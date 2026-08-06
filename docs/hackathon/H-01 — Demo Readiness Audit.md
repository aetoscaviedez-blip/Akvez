# H-01 — Auditoría de Preparación para Demo

| Campo | Valor |
| --- | --- |
| Documento | **H-01 — Demo Readiness Audit** |
| Clasificación | **Auditoría de trabajo** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | 🟢 **Auditoría cerrada.** Cero cambios de código |
| Fecha | 2026-08-04 |
| Evento | DevNetwork [API + Cloud + AI] Hackathon 2026 |
| Antecedentes | **AKVEZ-02 — Runtime Validation Audit** · **AKVEZ-HACKATHON-ROADMAP** |

> **Cero cambios.** No se ha modificado código ni configuración. No se ha creado `.env`, `Dockerfile` ni nada ejecutable.

---

# 0. Los dos hallazgos que definen H-01

## 0.1 ⭐ El Score llega hasta el mapper y se pierde ahí

**`analyzeProspects.ts:221-229` adjunta a cada lead:** `band` · `confidence` · `scoreBreakdown` · `scoreCoverage`.
**`analyzeProspects.ts:323-329` los persiste** en `leadAnalysisRepository`.

> ### **El dato viaja íntegro por dominio, aplicación y persistencia. Muere en `leadResponseMapper.ts`, que no lo declara en su tipo de entrada.**
>
> **Punto de pérdida exacto: `server/shared/mappers/leadResponseMapper.ts` + `server/shared/contracts/prospectSearch.ts`.** **Una sola capa. Ni dominio, ni aplicación, ni IA.**

## 0.2 🔴 La UI inventa datos cuando faltan

**`LeadCard.tsx:129`** — `{lead.score || 70}`

> ### **Si el score es `0`, `null` o `undefined`, la tarjeta muestra `70`.**
>
> **`R-45` declara que un Lead sin Score es legítimo** y `OpportunityScoreResult.score` es `number | null` por diseño. **La UI convierte esa ausencia en un número inventado.**

**Y `LeadCard.tsx:121`** — `{lead.classification || "Calificado"}` inventa una etiqueta.

> **En una demo pública, un jurado que vea varios leads con exactamente 70 tiene derecho a sospechar de todo lo demás.**

---

# 1. Estado actual

## 1.1 Frontend

### Pantallas — 3

| Vista | Fichero | Endpoint | Estado |
| --- | --- | --- | :-: |
| **Hunter** | `LeadHunter.tsx` | `POST /api/prospect/search` | ✅ Real |
| **Library** | `LeadLibrary.tsx` | `GET /api/leads` | ✅ Real |
| **Pitch** | `PitchGenerator.tsx:41` | `POST /api/prospect/outreach` | ✅ Real |

### Componentes — 10 en el Hunter

`CitySelector` · `NicheSelector` · `DesignStyleConfigPanel` · `SearchCtaButton` · `SearchingLoader` · `SearchErrorBanner` · `ResultsHeader` · **`LeadCard`** · `LoadMoreControls` · `EmptyState`

### Rutas de navegación — **ninguna**

> **No hay router.** `App.tsx:62` — `useState<"hunter" | "library" | "pitch">`. Pestañas, sin URL por pantalla ni enlaces profundos.

### Qué pinta hoy `LeadCard`

| Dato | ¿Se muestra? | Nota |
| --- | :-: | --- |
| `score` | ✅ | ⚠️ **Con `|| 70`** — línea 129 |
| `classification` | ✅ | ⚠️ **Con `|| "Calificado"`** · y **etiqueta el medidor de Score con el estado del sitio web** *(§1.5)* |
| `rating` · `reviewCount` | ✅ | Datos de Places |
| `flaws` | ✅ | Lista |
| `angle` *(oportunidad)* | ✅ | |
| `revenueLoss` | ✅ | |
| **`band`** | ❌ | **No llega al frontend** |
| **`breakdown`** | ❌ | **No llega** |
| **`confidence`** · **`coverage`** | ❌ | **No llegan** |

## 1.2 Backend

### Endpoints — 6

| # | Ruta | Uso en demo |
| :-: | --- | :-: |
| 1 | `GET /api/health` | ⚪ |
| 2 | **`POST /api/prospect/search`** | 🟢 **Núcleo** |
| 3 | **`GET /api/leads`** | 🟢 Biblioteca |
| 4 | **`POST /api/prospect/outreach`** | 🟢 Pitch |
| 5 | `POST /api/leads/:leadId/diagnosis` | ❌ **Sin UI** |
| 6 | `POST /api/leads/:leadId/sequence` | ❌ **Sin UI** |

### Agentes — 3

| Agente | Capas | Estado |
| --- | --- | :-: |
| **Lead Hunter** | domain · application · infrastructure · presentation | ✅ Funcional |
| **Lead Analyzer** | ídem | ✅ Funcional |
| **Pitch Generator** | ídem | 🟡 **Dos subsistemas** — §1.6 |

### Orquestadores — 7

`leadAcquisition` *(demo)* · `leadLibrary` *(demo)* · `pitchOutreach` *(demo)* · `commercialDiagnosis` · `commercialSequence` · `commercialFacts` · `commercialProposal` *(sin ruta)*

### Persistencia

**5 adapters, todos en memoria.** Contratos, modelos y mappers listos para motor real. **Los datos no sobreviven al reinicio.**

## 1.3 Inteligencia artificial

### Modelos

| Adapter | Constante | Línea |
| --- | :-: | :-: |
| `leadAnalysisAdapter.ts` | **`gemini-3.5-flash`** | 9 |
| `proposalDraftingAdapter.ts` | **`gemini-3.5-flash`** | 57 |

> 🔴 **Sin verificar.** Un identificador inexistente devuelve **404, que no es transitorio** ⇒ `generateWithRetry` no reintenta ⇒ **respaldo silencioso**.

### Prompts

| Prompt | Ubicación | Técnica |
| --- | --- | --- |
| **Análisis de Leads** | `leadAnalysisAdapter.ts:132-206` | ⭐ **Salida estructurada** — `responseMimeType: "application/json"` + `responseSchema` tipado *(`index`, `description`, `flaws[]`, `revenueLoss`, `angle`, `whyWebsiteNeeded`, `classification`)* |
| **Redacción de propuesta** | `proposalDraftingAdapter.ts:100-139` | Transcripción de decisiones ya tomadas + lista cerrada de hechos afirmables |

> **El uso de `responseSchema` es un punto fuerte para el jurado:** no se parsea texto libre, se exige estructura al modelo.

### Fallback

| Respaldo | Fichero | Disparador |
| --- | --- | --- |
| `generateFallbackAnalysis` | `lead-analyzer/domain/fallbackAnalysis.ts` | Tanda de Gemini fallida — `analyzeProspects.ts:240` |
| `generateFallbackPitch` | `pitch-generator/domain/fallbackPitch.ts` | Redacción fallida — `generateOutreachPitch.ts:88` |

**Ambos heurísticos.** Clasifican por presencia y estado del sitio web. **No invocan IA.**

### Manejo de errores

| Mecanismo | Comportamiento |
| --- | --- |
| `generateWithRetry.ts` | **5 intentos**, retardo `2000 × intento × jitter`, **solo ante** `503/429/UNAVAILABLE/RESOURCE_EXHAUSTED` |
| `describeGeminiFailure.ts` | Tipifica el fallo — `type`, `httpStatus`, `statusText` |
| `errorResponseMapper.ts` | Traduce excepción a DTO de error |
| **Places** | 🟢 **Falla ruidosamente** — HTTP 500 si fallan todas las sub-consultas |
| **Gemini** | 🔴 **Falla en silencio** — HTTP 200 con heurística |

## 1.4 Cloud

| Artefacto | Estado |
| --- | :-: |
| `Dockerfile` · `cloudbuild.yaml` · `app.yaml` · `.github/workflows` · `Procfile` | ❌ **Ninguno** |
| Build | ✅ `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs` |
| Arranque | ✅ `node dist/server.cjs` |
| `PORT` dinámico | ✅ `env.ts:71` — **T-14 resuelta** |
| Escucha | ✅ `0.0.0.0` — `startServer.ts:35` |
| Estáticos en producción | ✅ `express.static("dist")` + catch-all |

**Variables de entorno:**

| Variable | Obligatoria | Si falta |
| --- | :-: | --- |
| `GOOGLE_PLACES_API_KEY` | 🔴 **Sí** | **HTTP 400** — `prospectSearchRoute.ts:39` |
| `GEMINI_API_KEY` | 🟡 Degradante | Respaldo silencioso |
| `PORT` · `NODE_ENV` | ⚪ No | 3000 · modo desarrollo |
| `APP_URL` | ❌ **No se lee** | Ninguno |

> 🔴 **`dotenv` está en `package.json:19` y nunca se importa.** `"dev": "tsx server.ts"` sin `--env-file`. **Un `.env` no surtirá efecto.**

**Objetivo actual implícito:** `metadata.json` declara `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` — **AKVEZ está construido como applet de AI Studio**, no como app cloud.

## 1.5 ⚠️ Tres vocabularios de «clasificación» conviviendo

| Vocabulario | Valores | Origen | ¿Se expone? |
| --- | --- | --- | :-: |
| **Estado del sitio web** | *Sin sitio web · Sitio web básico · Sitio web deficiente* | Gemini o `fallbackAnalysis.ts:11-37` | ✅ **Sí, como `classification`** |
| **Banda comercial** *(APS-08 §8)* | *Oportunidad Excelente · Alta · Media · Baja · Muy Baja* | `classifyScore()` — `opportunityScore.ts:111` | ❌ **No** |
| **Datos demo** | *🔥 Lead Excelente · ✅ Lead Bueno* | `App.tsx:26,38` | ✅ Sí |

> ### **`LeadCard.tsx:121` etiqueta el medidor de «Lead Score» con `classification` — es decir, con el estado del sitio web, no con la banda del Score.**
>
> **El código lo sabe y lo advierte:** `analyzeProspects.ts:221-223` — *«`band` no sustituye a `classification`: aquélla es la prioridad comercial del Lead, ésta [describe el sitio]»*. **La UI las confunde de todos modos, porque la banda nunca le llega.**
>
> **Y los datos demo usan un tercer vocabulario que no coincide con ninguno de los dos.**

## 1.6 Pitch Generator — dos subsistemas

| Subsistema | Estado | Pruebas |
| --- | :-: | :-: |
| **(a) Heredado** — `generateOutreachPitch` → `/api/prospect/outreach` | ✅ **Vivo, es el de la demo** | **0** |
| **(b) Comercial** — `GenerateProposal`, diagnóstico, secuencia | 🔴 **`selectStrategy` lanza** *(B-1)*. **Sin ruta** | **~190** |

> **~190 de las 197 pruebas cubren el subsistema que NO participa en la demo.**

---

# 2. Flujo completo

## 2.1 Descubrimiento y análisis

```
[UI] LeadHunter.tsx — usuario elige nicho + ciudad
  ↓ prospectSearchApi.ts → POST /api/prospect/search
[RUTA] prospectSearchRoute.ts
  ├─ valida industry + location .................. 400 si faltan
  ├─ valida GOOGLE_PLACES_API_KEY (línea 39) ..... 🔴 400 — PRIMER PUNTO DE FALLO
  └─ abre reporte de observabilidad
  ↓
[ORQUESTADOR] leadAcquisitionOrchestrator
  ↓
[AGENTE 1] LeadHunterAgent.execute()
  ↓ discoverProspects()
     ↓ googlePlacesAdapter — 1 + N sub-consultas por zona, en paralelo
        🌐 POST places.googleapis.com/v1/places:searchText
     ↓ dedup por place.id (Referencia de Origen)
     ↓ leadRepository.findByIdentity() → register()   [EN MEMORIA]
  ↓  (si 0 leads → 200 con lista vacía)
[AGENTE 2] LeadAnalyzerAgent.execute()
  ↓ analyzeProspects()
     ↓ calculateOpportunityScore()  ⭐ DETERMINISTA, NO IA
        → { score, band, breakdown[], confidence, coverage, evaluatedWeight }
     ↓ leadAnalysisAdapter — tandas de 10, máx. 5 simultáneas
        🌐 Gemini + responseSchema tipado
        └─ si la tanda falla → generateFallbackAnalysis()  🔴 SILENCIOSO
     ↓ compone el lead (líneas 221-229): band, confidence, scoreBreakdown, scoreCoverage
     ↓ leadAnalysisRepository.save() (líneas 323-329)  ← el Score completo SÍ se persiste
  ↓
[MAPPER] leadResponseMapper.ts
  🔴 InternalAnalyzedLead NO declara band, breakdown, confidence, coverage
  → LeadResponseDTO: solo score + classification + narrativa de Gemini
  ↓
[RESPUESTA] SearchResponseDTO { success, leads[], references[], metadata.usedFallbackEngine }
  ↓
[UI] App.tsx handleAddLeads() → estado + localStorage
     LeadCard.tsx → score (|| 70) · classification (|| "Calificado") · flaws · angle · revenueLoss
```

## 2.2 Generación de pitch

```
[UI] PitchGenerator.tsx:41 → POST /api/prospect/outreach
[RUTA] prospectOutreachRoute → [ORQ] pitchOutreachOrchestrator
  ↓ PitchGeneratorAgent.generateOutreach()
     ↓ generateOutreachPitch()
        🌐 Gemini vía pitchGenerationAdapter
        └─ si falla → generateFallbackPitch()   🔴 SILENCIOSO
  ↓ { kind: "success", pitch, isFallback? }
[UI] muestra el texto
```

> ⚠️ **`isFallback` sí existe en el contrato del agente** *(`pitchGeneratorAgent.ts:47`)*. **Verificar si la UI lo usa** — de no hacerlo, es la misma ceguera que en el análisis.

---

# 3. Producto actual frente a demo ideal

| Capacidad | Existe | Falta | Prioridad |
| --- | --- | --- | :-: |
| **Lead Discovery** | ✅ Places real, zonas, dedup por identidad, registro idempotente | **Credenciales llegando al proceso** *(`dotenv` no se carga)* · API habilitada · coste medido | 🔴 **P0** |
| **Opportunity Score explicado** | ✅ **Calculado íntegro** — `band`, `breakdown[]` con `rationale` y factores, `confidence`, `coverage`. Persistido | **Exponerlo en el DTO y pintarlo.** Hoy solo se ve un número — **y con `\|\| 70`** | 🔴 **P0** |
| **AI Analysis visible** | ✅ Gemini con `responseSchema`; `description`, `flaws`, `angle`, `revenueLoss`, `whyWebsiteNeeded` se muestran | **Distinguir IA de respaldo en pantalla.** Hoy son indistinguibles | 🔴 **P0** |
| **Pitch Generator** | ✅ Funcional con respaldo | Mostrar estrategia y siguiente acción · **exponer `isFallback`** | 🟡 **P1** |
| **Cloud deployment** | ✅ Build autónomo · `PORT` dinámico · `0.0.0.0` · estáticos | **`Dockerfile` + URL pública.** Cero artefactos hoy | 🔴 **P0** |

## 3.1 Añadidos que la tabla no recoge

| Capacidad | Existe | Falta | Prioridad |
| --- | --- | --- | :-: |
| **No inventar datos en UI** | ❌ | Retirar `\|\| 70` y `\|\| "Calificado"` | 🔴 **P0** |
| **Vocabulario coherente** | ❌ | Separar banda comercial de estado del sitio | 🟡 P1 |
| **Datos demo distinguibles** | ❌ | Etiquetar `CL_SAMPLE_LEADS` | 🟡 P1 |
| **Pruebas del camino de demo** | ❌ **Cero** | `opportunityScore`, dedup, adapter | 🟡 P1 |

---

# 4. Riesgos de demo

## 4.1 Puntos donde puede fallar

| # | Punto | Evidencia | Efecto |
| :-: | --- | --- | :-: |
| **1** | **Credenciales no llegan** | `dotenv` sin cargar | 🔴 **HTTP 400 al primer clic** |
| **2** | **Places: clave inválida, API no habilitada o cuota agotada** | `googlePlacesAdapter.ts:113` | 🔴 **HTTP 500** |
| **3** | **Modelo Gemini inexistente** | 404 no transitorio | 🟡 **Respaldo silencioso** |
| **4** | **Cuota Gemini agotada** | 429 ⇒ 5 reintentos ⇒ respaldo | 🟡 Lentitud + respaldo |
| **5** | **Reinicio del proceso** | Persistencia en memoria | 🟡 Biblioteca vacía |
| **6** | **Sin red en el recinto** | — | 🔴 Nada funciona |

## 4.2 🔴 Fallos silenciosos — el riesgo más grave

| # | Fallo | Por qué es peligroso |
| :-: | --- | --- |
| **1** | **Gemini cae y devuelve HTTP 200** con heurística | **La demo parece usar IA sin usarla** |
| **2** | **`{lead.score \|\| 70}`** | **Muestra 70 cuando no hay score.** Varios leads con 70 exacto delatan el truco |
| **3** | **`{lead.classification \|\| "Calificado"}`** | Etiqueta inventada |
| **4** | **`isFallback` del pitch** posiblemente no usado en UI | Mismo problema en Pantalla 3 |

**Señales que sí existen y hoy no se muestran:**

| Señal | Dónde |
| --- | --- |
| `metadata.usedFallbackEngine` | Respuesta HTTP — `prospectSearchRoute.ts:81` |
| `usedFallbackAnalysis` por lead | Interno — **deliberadamente no mapeado** |
| *«Gemini no devolvió análisis para N de N»* | Consola — `analyzeProspects.ts:280` |

## 4.3 Datos mock

| Elemento | Ubicación | Riesgo |
| --- | --- | :-: |
| **`CL_SAMPLE_LEADS`** — 2 leads con score y clasificación | `App.tsx:8-40` | 🔴 **Indistinguibles de reales** |
| `DEFAULT_PROFILE` | `App.tsx:42-49` | 🟢 Inocuo |
| **5 adapters en memoria** | `compositionRoot.ts:70-82` | 🟡 No persisten |
| `PLACEHOLDER_USER_ID` | Adapters | 🟢 Invisible en demo |
| **Código huérfano** — `groundingSearchAdapter` + `fallbackLeads` | No los construye nadie | 🟢 Inerte |

## 4.4 Configuraciones manuales requeridas

1. Exportar `GOOGLE_PLACES_API_KEY` y `GEMINI_API_KEY` **en el shell** — un `.env` no basta
2. Habilitar **Places API (New)** con facturación
3. Verificar que el modelo Gemini existe
4. Presupuestar cuota — **1 + N llamadas por búsqueda**

## 4.5 Dependencias externas

| Dependencia | Criticidad | Sin ella |
| --- | :-: | --- |
| **Places API (New)** | 🔴 | **No hay demo** |
| **Gemini** | 🟡 | Demo degradada **y silenciosa** |
| Red | 🔴 | Nada |
| **Ninguna otra** | — | Sin BD, sin auth, sin terceros |

---

# 5. Opportunity Score — análisis de impacto

**Respuesta a las tres preguntas del encargo.**

## 5.1 Qué información existe

**`OpportunityScoreResult`** — `opportunityScore.ts:85-100`:

| Campo | Tipo | Valor para la demo |
| --- | --- | :-: |
| `score` | `number \| null` | ✅ Ya visible |
| **`band`** | `string \| null` | ⭐ *Oportunidad Excelente/Alta/Media/Baja/Muy Baja* |
| **`breakdown`** | `CategoryBreakdown[]` | ⭐⭐⭐ **El activo** |
| **`confidence`** | `"alta" \| "media" \| "limitada"` | ⭐⭐ Honestidad del análisis |
| **`coverage`** | `number` | ⭐⭐ Proporción de factores medidos |
| `evaluatedWeight` | `number` | ⭐ Peso evaluado |
| `profileVersion` | `string` | ⭐ Trazabilidad |

**`CategoryBreakdown`** — líneas 66-82: `category` · `label` · `weight` · `partialScore` · `contribution` · **`measuredFactors[]`** · **`unmeasuredFactors[]`** · **`rationale`**

> ### **`rationale` es literalmente la explicación legible de por qué cada categoría puntuó así.** Existe, se calcula, se persiste — **y nunca se muestra.**

## 5.2 Qué DTO expone

**`LeadResponseDTO`** — `contracts/prospectSearch.ts:23-39`:

`id` · `name` · `website` · `googleMapsUrl` · `phone` · `rating` · `reviewCount` · `source` · `description` · `flaws[]` · `opportunity` · `classification` · `revenueLoss` · `whyWebsiteNeeded` · **`score`**

> **Del Score solo sobrevive `score`.** `band`, `breakdown`, `confidence`, `coverage`, `evaluatedWeight` y `profileVersion` **no cruzan la frontera HTTP**.

## 5.3 Qué capa debe modificarse

| Capa | ¿Cambia? | Motivo |
| --- | :-: | --- |
| `domain/opportunityScore.ts` | ❌ **No** | Ya lo calcula todo |
| `application/analyzeProspects.ts` | ❌ **No** | Ya lo adjunta *(221-229)* y persiste *(323-329)* |
| `infrastructure/` | ❌ **No** | Ajeno |
| **`shared/contracts/prospectSearch.ts`** | ✅ **SÍ** | Ampliar `LeadResponseDTO` |
| **`shared/mappers/leadResponseMapper.ts`** | ✅ **SÍ** | Declarar los campos en `InternalAnalyzedLead` y mapearlos |
| **`src/shared/types/index.ts`** | ✅ **SÍ** | Ampliar `Prospect` |
| **`src/.../presentation/`** | ✅ **SÍ** | Pantalla 2 |

> ### **Dos ficheros de backend, ambos en `shared/`. Cero cambios en dominio, aplicación e infraestructura.**

## 5.4 Clasificación e impacto

| Aspecto | Valoración |
| --- | --- |
| **Tipo** | **A (Demo UX)** en el frontend · **C (Arquitectura)** en el DTO — es contrato público |
| **¿Afecta a la arquitectura?** | **No.** No añade capas, agentes ni dependencias. **Es aditivo** |
| **¿Requiere Blueprint?** | 🟡 **Conviene revisar ADR-06 §10 y ADR-07 §8.** Ampliar un DTO es aditivo y **no rompe compatibilidad**, pero el contrato público está gobernado |
| **Riesgo técnico** | 🟢 Bajo — ⚠️ **`partialScore` y `score` pueden ser `null` por R-45**: la UI debe representar la ausencia **sin inventar** |

---

# 6. Cloud — evaluación

## 6.1 Qué ya está resuelto

| Requisito | Estado |
| --- | :-: |
| Artefacto autónomo | ✅ `dist/server.cjs` + `dist/` estático |
| `PORT` del entorno | ✅ `env.ts:71` — T-14 |
| Escucha en `0.0.0.0` | ✅ `startServer.ts:35` |
| Estáticos en producción | ✅ `NODE_ENV=production` |
| Sin estado en disco | ✅ Todo en memoria — **encaja con contenedor efímero** |
| Sin BD que aprovisionar | ✅ |

> ### **AKVEZ ya cumple los requisitos de un contenedor sin saberlo.** Falta el envoltorio.

## 6.2 Opciones

| Opción | Esfuerzo | Encaje | Veredicto |
| --- | :-: | :-: | --- |
| **Cloud Run + Docker** | 🟢 Bajo | 🟢 **Alto** | ✅ **Recomendada** — `PORT` inyectado, escala a cero, HTTPS y URL pública automáticos, **mismo proveedor que Places y Gemini** |
| Cloud Run *(source deploy)* | 🟢 Muy bajo | 🟡 Medio | Sin `Dockerfile`, pero **menos control** sobre el build de dos etapas |
| App Engine | 🟡 Medio | 🟡 | Más ceremonia, sin ventaja |
| VM | 🔴 Alto | 🔴 | Descartada |
| Vercel / Netlify | 🟡 | 🔴 | Pensadas para *serverless*, **no para un Express de larga vida** |

## 6.3 Recomendación

> **`Dockerfile` multi-etapa + Cloud Run**, con las dos credenciales como **Secrets**.
>
> **Ventaja para el jurado:** las tres piezas —Places, Gemini y hosting— **en el mismo proveedor cloud**, con secretos gestionados. **Es exactamente el eje que hoy está vacío.**

**Clasificación: Tipo B (Reliability/configuración).** **No toca código de aplicación.** **No requiere Blueprint.**

---

# 7. Orden de implementación propuesto

| # | Acción | Tipo | Blueprint | Impacto |
| :-: | --- | :-: | :-: | :-: |
| **1** | **Verificar que el modelo Gemini existe** | — | ❌ | 🔴 Desbloquea todo el eje AI |
| **2** | **Credenciales en el proceso** *(shell, o cargar `dotenv`)* | **B** | ❌ | 🔴 **Desbloquea la demo** |
| **3** | **Habilitar Places API + medir coste y duración** | — | ❌ | 🔴 |
| **4** | 🔴 **Retirar `\|\| 70` y `\|\| "Calificado"`** de `LeadCard` | **A** | ❌ | 🔴 **Elimina datos inventados** |
| **5** | **Mostrar `metadata.usedFallbackEngine`** en la UI | **A** | ❌ | 🔴 **Elimina la demo falsa** |
| **6** | ⭐ **Exponer `band`, `breakdown`, `confidence`, `coverage`** en el DTO | **C** | 🟡 **Revisar ADR-06** | 🔴 **Mayor impacto visual** |
| **7** | **Pantalla 2 — AI Opportunity Analysis** | **A** | ❌ | 🔴 |
| **8** | **`Dockerfile` + Cloud Run** | **B** | ❌ | 🔴 **Cubre el eje Cloud** |
| **9** | **Etiquetar los datos demo** | **A** | ❌ | 🟡 |
| **10** | **Exponer `isFallback` en Pantalla 3** | A/C | 🟡 | 🟡 |
| **11** | **Primeras pruebas del camino de demo** | **B** | ❌ | 🟡 |

> **Los pasos 1-5 no tocan arquitectura y eliminan los tres riesgos descalificatorios.** **El 6 es el único que requiere análisis previo de contrato.**

---

# 8. Lo que NO hay que hacer

| Tentación | Por qué no |
| --- | --- |
| Añadir router al frontend | Las pestañas bastan. Coste sin retorno para el jurado |
| Motor de persistencia real | En memoria basta. **F-2 Capa C queda para el SaaS** |
| Desbloquear el subsistema comercial | **B-1 es del Product Office** y no participa en la demo |
| Refactorizar la arquitectura | **Es el activo que permite el paso 6 tocando dos ficheros** |
| Nuevos agentes o capas | Nada lo exige |
| Tocar `domain/` o `application/` | **Ningún paso del §7 lo necesita** |

---

# 9. Referencias de código

`package.json:7,16,19` · `server.ts` · `server/bootstrap/startServer.ts:35` · `server/bootstrap/compositionRoot.ts:70-82,94` · `server/shared/config/env.ts:17,22,71` · `server/shared/ai/geminiClient.ts` · `server/shared/ai/generateWithRetry.ts` · `server/shared/ai/describeGeminiFailure.ts` · `server/shared/contracts/prospectSearch.ts:23-55` · **`server/shared/mappers/leadResponseMapper.ts`** · `server/modules/lead-hunter/infrastructure/googlePlacesAdapter.ts:37-172` · `server/modules/lead-hunter/application/discoverProspects.ts:157-161` · **`server/modules/lead-analyzer/domain/opportunityScore.ts:60-115`** · `server/modules/lead-analyzer/infrastructure/leadAnalysisAdapter.ts:9,132-206` · **`server/modules/lead-analyzer/application/analyzeProspects.ts:105-123,221-229,262-267,280,323-329`** · `server/modules/lead-analyzer/domain/fallbackAnalysis.ts:11-37` · `server/modules/pitch-generator/presentation/pitchGeneratorAgent.ts:47` · `server/modules/pitch-generator/application/generateOutreachPitch.ts:88` · `server/routes/index.ts` · `server/routes/prospectSearchRoute.ts:39,81` · `src/App.tsx:8-49,62` · **`src/modules/lead-hunter/presentation/components/LeadCard.tsx:113-132`** · `src/shared/types/index.ts:28-29` · `metadata.json` · `.env.example`.

**Documentos:** AKVEZ-02 · AKVEZ-HACKATHON-ROADMAP · DEV-00 R-38, R-45, R-64 · APS-08 §6, §8, §9, §11 · ADR-06 §10 · ADR-07 §8.
