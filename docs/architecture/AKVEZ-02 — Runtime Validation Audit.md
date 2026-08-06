# AKVEZ-02 — Auditoría de Validación en Ejecución

| Campo | Valor |
| --- | --- |
| Código | **AKVEZ-02** |
| Clasificación | **Auditoría de ejecución** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Auditoría cerrada.** Cero cambios de código |
| Fecha | 2026-08-04 |
| Objeto | Qué necesita AKVEZ para ejecutar **Lead Hunter → Lead Analyzer → Pitch Generator** con datos reales |
| Método | **Lectura del código en ejecución**, no de la documentación |

> **Cero cambios.** No se ha modificado código, no se han creado funcionalidades, no se han borrado datos demo, no se ha tocado arquitectura ni Blueprint.
>
> ⚠️ **No existe `AKVEZ-01`.** Este documento inaugura la serie.

---

# 0. Conclusión en una frase

> ### **El flujo está completo y conectado de extremo a extremo. No arranca por una sola razón: las credenciales no llegan al proceso — y crear un `.env` NO las hará llegar.**

---

# 1. Variables de entorno requeridas

## 1.1 Las que el código lee

**Única frontera con el entorno: `server/shared/config/env.ts`.** Verificado: **ningún otro fichero del backend lee `process.env`** *(salvo `vite.config.ts`, que es build)*.

| Variable | Función | Línea | ¿Obligatoria? | Si falta |
| --- | --- | :-: | :-: | --- |
| **`GOOGLE_PLACES_API_KEY`** | `getGooglePlacesApiKey()` | env.ts:22 | 🔴 **SÍ — bloqueante** | **HTTP 400 inmediato**, la búsqueda no se ejecuta |
| **`GEMINI_API_KEY`** | `getGeminiApiKey()` | env.ts:17 | 🟡 **Degradante** | Todo cae a **respaldo heurístico**, sin aviso al usuario |
| `PORT` | `getPort()` | env.ts:71 | ⚪ No | Cae a **3000** |
| `NODE_ENV` | `isProduction()` | env.ts:41 | ⚪ No | Vacío ⇒ modo desarrollo, Vite en middleware |
| `DISABLE_HMR` | `vite.config.ts:17` | — | ⚪ No | HMR activo |
| `APP_URL` | *(declarada en `.env.example`)* | — | ❌ **No se lee** | **Ninguno — el código no la consulta** |

## 1.2 🔴 El hallazgo — `dotenv` está instalado y **nunca se carga**

| Hecho | Evidencia |
| --- | --- |
| `dotenv` es dependencia declarada | `package.json:19` — `"dotenv": "^17.2.3"` |
| **No se importa en ningún fichero** | Búsqueda sobre `*.ts`/`*.tsx`: **cero ocurrencias** fuera de `package.json` |
| El script de arranque no lo carga | `package.json:7` — `"dev": "tsx server.ts"`, **sin `--env-file`** |
| `server.ts` solo invoca el arranque | `server.ts` — 2 líneas, sin carga de entorno |
| `startServer.ts` no lo carga | Verificado íntegro |

> ### **Consecuencia: crear un fichero `.env` NO tendrá ningún efecto.** `process.env.GOOGLE_PLACES_API_KEY` seguirá siendo `undefined`.
>
> **Las variables solo llegan si se exportan en el shell o las inyecta la plataforma** — que es la hipótesis del `.env.example`: *«AI Studio automatically injects this at runtime from user secrets»*.
>
> **`.env.example` describe un entorno gestionado por AI Studio, no una ejecución local.** Ejecutar en local requiere exportarlas manualmente o añadir la carga de `dotenv` — **cambio de código, fuera del alcance de esta auditoría**.

## 1.3 Estado actual del repositorio

| Comprobación | Resultado |
| --- | :-: |
| ¿Existe `.env`? | ❌ **NO** |
| ¿Existe `.env.example`? | ✅ Sí — 3 variables, **una de ellas (`APP_URL`) no se usa** |
| ¿`.gitignore` excluye `.env`? | Verificar antes de crear uno |

---

# 2. APIs externas necesarias

## 2.1 Google Places API (New)

| Campo | Valor |
| --- | --- |
| **Endpoint** | `POST https://places.googleapis.com/v1/places:searchText` |
| **Evidencia** | `googlePlacesAdapter.ts:64` |
| **Autenticación** | **Doble** — `?key=` en la URL **y** cabecera `X-Goog-Api-Key` *(líneas 64, 69)* |
| **FieldMask** | `places.id, displayName, websiteUri, nationalPhoneNumber, googleMapsUri, rating, userRatingCount` *(línea 70)* |
| **Cuerpo** | `{ textQuery, pageSize: 20 }` *(línea 72)* |
| **API a habilitar en GCP** | **Places API (New)** — no la versión legacy |

### ⚠️ Volumen de llamadas por búsqueda

`googlePlacesAdapter.ts:37-59` expande la consulta **por zonas de ciudad**:

| Ciudad | Sub-consultas | Fuente |
| --- | :-: | --- |
| Bogotá | 1 + `bogotaZones.length` | `domain/zones.ts` |
| Medellín · Cali · Barranquilla | 1 + zonas respectivas | ídem |
| Cualquier otra | **1** | — |

**Se lanzan todas en paralelo** *(`Promise.allSettled`, línea 86)*. **Una sola búsqueda en Bogotá puede consumir decenas de llamadas facturables.** Conviene conocer el coste antes de la primera demo.

**Tolerancia a fallo:** el adapter solo lanza si **fallan todas** *(línea 113)*. Fallos parciales se absorben y se registran en consola.

## 2.2 Google Gemini API

| Campo | Valor |
| --- | --- |
| **SDK** | `@google/genai` ^2.4.0 — `package.json:16` |
| **Cliente** | `GoogleGenAI` con `httpOptions.headers["User-Agent"] = "aistudio-build"` — `geminiClient.ts:12-15` |
| **Patrón** | Singleton perezoso — `geminiClient.ts:4-6` |
| **Si falta la clave** | `throw new Error("La variable de entorno GEMINI_API_KEY no está definida.")` — `geminiClient.ts:10` |

### Política de reintentos — `generateWithRetry.ts`

| Parámetro | Valor |
| --- | :-: |
| Reintentos | **5** |
| Retardo base | **2000 ms**, creciente y con *jitter* — `delayMs * attempt * (0.8 + rand*0.4)` |
| Se reintenta ante | `503` · `429` · `UNAVAILABLE` · `RESOURCE_EXHAUSTED` · `rate limit` · `Overloaded` |
| **No se reintenta** | Cualquier otro — **incluido `404 NOT_FOUND` de modelo inexistente** |

> **Peor caso por llamada:** ≈ 2+4+6+8 s de espera antes de rendirse. **El Analyzer ejecuta hasta 5 tandas simultáneas**, de modo que una cuota agotada puede prolongar mucho una búsqueda.

## 2.3 Resumen de dependencias externas

| Servicio | ¿Imprescindible para el flujo? |
| --- | :-: |
| **Places API (New)** | 🔴 **Sí** — sin ella no hay Leads |
| **Gemini API** | 🟡 **No, pero sí para calidad** — hay respaldo heurístico |
| Cualquier otro | ❌ Ninguno. No hay base de datos, ni auth, ni terceros |

---

# 3. Modelos de IA configurados

| Adapter | Constante | Línea | Uso |
| --- | :-: | :-: | --- |
| `leadAnalysisAdapter.ts` | **`gemini-3.5-flash`** | 9 | Análisis de Leads |
| `proposalDraftingAdapter.ts` | **`gemini-3.5-flash`** | 57 | Redacción de propuesta *(bloqueado por B-1)* |
| `pitchGenerationAdapter.ts` | *(verificar)* | — | Pitch heredado — **camino vivo** |

## 3.1 🔴 Riesgo — el identificador de modelo no está verificado

| Hecho | Consecuencia |
| --- | --- |
| **Ninguna prueba invoca el modelo real** | El nombre nunca se ha ejercitado contra la API |
| **Un modelo inexistente devuelve `404 NOT_FOUND`** | **No es transitorio** ⇒ `generateWithRetry` **no reintenta** y lanza |
| **`analyzeProspects` captura el fallo y usa respaldo** | `analyzeProspects.ts:239-267` |

> ### **Si `gemini-3.5-flash` no existe, el sistema NO falla: cae al respaldo heurístico en silencio y devuelve análisis plausibles.**
>
> **Es el modo de fallo más peligroso de todo el sistema**, porque una demo parecería funcionar mientras la IA nunca se invoca.
>
> **Señal de detección disponible:** la respuesta incluye `metadata.usedFallbackEngine: true` *(`prospectSearchRoute.ts:81`)*, y la consola registra *«Gemini no devolvió análisis para N de N lead(s)»* *(`analyzeProspects.ts:280`)*. **Hay que mirarlas expresamente.**

**Verificación mínima antes de cualquier demo:** una llamada de prueba al modelo, o consultar `models.list` del SDK.

---

# 4. Rutas existentes

## 4.1 Registradas — `server/routes/index.ts`

| # | Método · Ruta | Handler | Estado |
| :-: | --- | --- | :-: |
| 1 | `GET /api/health` | `handleHealth` | ✅ Sin dependencias |
| 2 | **`POST /api/prospect/search`** | `handleProspectSearch` | ✅ **Flujo principal** |
| 3 | **`GET /api/leads`** | `handleLeadLibrary` | ✅ Biblioteca |
| 4 | **`POST /api/prospect/outreach`** | `handleProspectOutreach` | ✅ **Pitch** |
| 5 | `POST /api/leads/:leadId/diagnosis` | `handleDiagnosis` | ⚠️ **Sin UI** |
| 6 | `POST /api/leads/:leadId/sequence` | `handleSequence` | ⚠️ **Sin UI** |

## 4.2 Servido estático — `startServer.ts:22-33`

| Entorno | Comportamiento |
| --- | --- |
| **Desarrollo** *(por defecto)* | Vite en **middleware mode**, `appType: "spa"` |
| **Producción** *(`NODE_ENV=production`)* | `express.static("dist")` + catch-all a `index.html` |

**Escucha en `0.0.0.0:${PORT}`** *(línea 35)*.

## 4.3 Rutas que NO existen

**Ninguna de propuesta comercial.** `GenerateProposal` está construido y cableado pero **sin endpoint** — decisión deliberada mientras **B-1** siga abierto.

---

# 5. Pantallas existentes

## 5.1 Navegación

> **No hay router.** `App.tsx:62` — `useState<"hunter" | "library" | "pitch">`. **Pestañas, no URLs.** No hay enlaces profundos ni historial de navegador.

| Vista | Fichero | Llamada de red | Estado |
| --- | --- | --- | :-: |
| **Hunter** | `LeadHunter.tsx` + **10 componentes** | `POST /api/prospect/search` | ✅ Real |
| **Library** | `LeadLibrary.tsx` | `GET /api/leads` | ✅ Real |
| **Pitch** | `PitchGenerator.tsx:41` | `POST /api/prospect/outreach` | ✅ Real |

**Componentes del Hunter:** `CitySelector` · `NicheSelector` · `DesignStyleConfigPanel` · `SearchCtaButton` · `SearchingLoader` · `SearchErrorBanner` · `ResultsHeader` · `LeadCard` · `LoadMoreControls` · `EmptyState`.

## 5.2 Pantallas que NO existen

**Ninguna del subsistema comercial:** diagnóstico, secuencia, propuesta, perfil de estrategia. **Las rutas 5 y 6 de §4.1 no son alcanzables desde la interfaz.**

## 5.3 Persistencia de estado del cliente

| Clave | Contenido | Línea |
| --- | --- | :-: |
| `leadflow_leads_v2` | Leads del workspace | App.tsx:88 |
| `leadflow_designer_v2` | Perfil del diseñador | App.tsx:92 |

> ⚠️ **El workspace vive en `localStorage`; la Biblioteca lee del servidor.** Como la persistencia del servidor es **en memoria**, tras reiniciar **las dos vistas muestran cosas distintas**: el workspace conserva sus leads, la Biblioteca aparece vacía.

---

# 6. Datos mock y respaldos existentes

**Ninguno se ha borrado. Inventario completo:**

## 6.1 🟡 Datos de muestra en la interfaz

| Elemento | Ubicación | Comportamiento |
| --- | --- | --- |
| **`CL_SAMPLE_LEADS`** | `App.tsx:8-40` | **2 leads colombianos completos** —*La Fogata Parrilla*, *OdontoEstética Medellín*— con `score`, `classification`, `flaws`, `revenueLoss` |
| **`DEFAULT_PROFILE`** | `App.tsx:42-49` | Perfil *«Estudio Creativo LeadFlow»* |

**Activación:** `App.tsx:65-68` — se cargan **solo si `localStorage` está vacío**.

> ⚠️ **Al abrir la aplicación por primera vez parece que ya hay datos analizados.** Son ficticios. **Es el principal riesgo de auto-engaño en una demo.**

## 6.2 Respaldos de dominio — **producen resultados reales sin IA**

| Respaldo | Fichero | Cuándo actúa |
| --- | --- | --- |
| **`generateFallbackAnalysis`** | `lead-analyzer/domain/fallbackAnalysis.ts` | Por lead, cuando su tanda de Gemini falló — `analyzeProspects.ts:240` |
| **`generateFallbackPitch`** | `pitch-generator/domain/fallbackPitch.ts` | Cuando la redacción falla — `generateOutreachPitch.ts:88` |

**Ambos son heurísticos**: clasifican por presencia y estado del sitio web *(`fallbackAnalysis.ts:11-37`)*. **No llaman a ninguna IA.**

## 6.3 🔴 Persistencia simulada

**Los cinco adapters registrados en el Composition Root son en memoria:**

`inMemoryLeadAdapter` · `inMemoryLeadAnalysisAdapter` · `inMemoryBuyerDiagnosisAdapter` · `inMemoryCommercialSequenceAdapter` · `inMemoryProposalAdapter`

| Consecuencia | Detalle |
| --- | --- |
| **Los datos no sobreviven al reinicio** | Declarado en cada adapter: *«adapter de validación, no la persistencia definitiva»* |
| **`userId` es un placeholder** | `PLACEHOLDER_USER_ID = "single-tenant-placeholder"` — deuda **F-3** |

## 6.4 Código huérfano detectado

| Elemento | Estado |
| --- | --- |
| **`groundingSearchAdapter.ts`** + **`fallbackLeads.ts`** | **No los construye el Composition Root.** Son las *«fuentes 2 y 3»* que `discoverProspects.ts:68` dice conservar como andamiaje. **Código muerto en ejecución** |
| **`APP_URL`** | Declarada en `.env.example`, **no la lee ningún fichero** |

---

# 7. Primer punto de fallo de una ejecución real

## 7.1 La secuencia, paso a paso

**Escenario: `npm run dev`, usuario busca «Restaurantes» en «Bogotá».**

| # | Paso | Resultado |
| :-: | --- | :-: |
| 1 | `tsx server.ts` → `startServer()` | ✅ Arranca |
| 2 | `buildApplicationDependencies()` | ✅ **No falla**: `getGooglePlacesApiKey() ?? ""` *(compositionRoot.ts:94)* — la clave ausente se convierte en cadena vacía **sin lanzar** |
| 3 | Vite middleware + `app.listen(3000)` | ✅ La app carga |
| 4 | La UI muestra **2 leads de muestra** | ⚠️ Parecen reales |
| 5 | Usuario pulsa buscar → `POST /api/prospect/search` | — |
| 6 | Validación de `industry` y `location` | ✅ Pasa |
| 7 | **`if (!getGooglePlacesApiKey())`** — `prospectSearchRoute.ts:39` | 🔴 **AQUÍ SE DETIENE** |

## 7.2 🔴 Primer punto de fallo

> ### **`server/routes/prospectSearchRoute.ts`, línea 39.**
>
> **Respuesta:** `HTTP 400` · `{"code":"VALIDATION_ERROR","message":"Falta la clave GOOGLE_PLACES_API_KEY en los Secrets."}`
>
> **Es un fallo limpio y bien diagnosticado** — el código lo previó expresamente para *«no degradar el 400 explícito a un 500 genérico»* *(líneas 33-38)*. **No hay defecto que corregir: falta configuración.**

## 7.3 Puntos de fallo siguientes, en orden

**Suponiendo resuelto cada anterior:**

| # | Punto | Condición | Efecto |
| :-: | --- | --- | :-: |
| **2.º** | `googlePlacesAdapter.ts:113` | Clave inválida, API no habilitada o cuota agotada ⇒ **todas** las sub-consultas fallan | 🔴 **HTTP 500** |
| **3.º** | `geminiClient.ts:10` | Falta `GEMINI_API_KEY` | 🟡 **Respaldo silencioso** |
| **4.º** | `generateWithRetry.ts` | **Modelo inexistente ⇒ 404, no transitorio, no reintenta** | 🟡 **Respaldo silencioso** |
| **5.º** | Reinicio del proceso | Persistencia en memoria | 🟡 **Biblioteca vacía**; workspace intacto |

> ### **Los puntos 3.º y 4.º no producen error visible.** Devuelven **HTTP 200 con resultados heurísticos**. La única señal es `metadata.usedFallbackEngine: true` y la consola del servidor.

## 7.4 Qué NO fallará

| Comprobado | Motivo |
| --- | --- |
| El grafo de dependencias | `compositionRoot.test.ts` — se construye sin efectos, sin credenciales |
| El arranque del servidor | `env.ts` **no valida al importar**, por diseño *(cabecera del fichero)* |
| El servido del frontend | Vite en middleware, sin dependencia de credenciales |
| Los 3 caminos de la UI | Conectados a rutas reales |

---

# 8. Lo mínimo para ejecutar el flujo real

**Ninguno de estos puntos requiere escribir funcionalidad. Se listan como hallazgo, no como plan.**

| # | Necesidad | Naturaleza | Bloqueante |
| :-: | --- | --- | :-: |
| **1** | **`GOOGLE_PLACES_API_KEY` llegando a `process.env`** — y **`.env` no basta** *(§1.2)* | Configuración **+ posible cambio de código** para cargar `dotenv` | 🔴 **Sí** |
| **2** | **Places API (New) habilitada** en el proyecto GCP, con facturación | Configuración externa | 🔴 **Sí** |
| **3** | **Verificar que `gemini-3.5-flash` existe** | Comprobación | 🟡 Calidad |
| **4** | **`GEMINI_API_KEY`** en el entorno | Configuración | 🟡 Calidad |
| **5** | **Conocer el coste por búsqueda** — decenas de llamadas en Bogotá *(§2.1)* | Comprobación | 🟢 Operativo |

## 8.1 Cómo distinguir una ejecución real de una degradada

| Señal | Dónde | Significado |
| --- | --- | --- |
| `metadata.usedFallbackEngine === true` | Respuesta de `/api/prospect/search` | **Gemini no se usó** en al menos un lead |
| `[Places API] Consulta exitosa: …` | Consola del servidor | Places respondió de verdad |
| `Gemini no devolvió análisis para N de N lead(s)` | Consola | **Respaldo total** |
| Reporte de ejecución | `printExecutionReport()` | Métricas por llamada |

---

# 9. Alcance de esta auditoría

## 9.1 Lo que NO se ha hecho

❌ Modificar código · ❌ Crear funcionalidades · ❌ Borrar datos demo · ❌ Cambiar arquitectura · ❌ Tocar `docs/blueprint/` · ❌ Crear `.env` · ❌ Ejecutar llamada real a ninguna API externa.

## 9.2 Verificación

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` · `npx tsc --noEmit` | ✅ **Limpios** |
| `npm test` | ✅ **197 · 26 ficheros** |
| Ficheros `.ts`/`.tsx` modificados | **0** |
| `docs/blueprint/` modificado | **0** |

## 9.3 Fuera de alcance — bloqueos de gobernanza

**B-1** *(`SP-01`)* · **B-2** *(reintentos)* · **CH-01/02/03** *(longitud de canal)* · **F-1** · **F-2** · **F-3** · **F-9**.

> **Ninguno afecta al flujo auditado.** Bloquean el **subsistema comercial**, que **no forma parte de Lead Hunter → Lead Analyzer → Pitch Generator** y **no tiene interfaz**.

---

# 10. Referencias de código

`package.json:7,16,19` · `server.ts` · `server/bootstrap/startServer.ts` · `server/bootstrap/compositionRoot.ts:94` · `server/shared/config/env.ts` · `server/shared/ai/geminiClient.ts:4-17` · `server/shared/ai/generateWithRetry.ts` · `server/modules/lead-hunter/infrastructure/googlePlacesAdapter.ts:37-172` · `server/modules/lead-hunter/application/discoverProspects.ts:68,86,157-161` · `server/modules/lead-analyzer/infrastructure/leadAnalysisAdapter.ts:9,24-27` · `server/modules/lead-analyzer/application/analyzeProspects.ts:239-298` · `server/modules/lead-analyzer/domain/fallbackAnalysis.ts` · `server/modules/pitch-generator/application/generateOutreachPitch.ts:88` · `server/modules/pitch-generator/infrastructure/proposalDraftingAdapter.ts:57` · `server/routes/index.ts` · `server/routes/prospectSearchRoute.ts:33-42,81,94` · `src/App.tsx:8-49,62-92` · `src/modules/lead-hunter/infrastructure/prospectSearchApi.ts` · `src/modules/pitch-generator/presentation/PitchGenerator.tsx:41` · `vite.config.ts:17-19` · `.env.example`.
