# AKVEZ — Roadmap de Hackathon

| Campo | Valor |
| --- | --- |
| Documento | **AKVEZ-HACKATHON-ROADMAP** |
| Clasificación | **Documento de trabajo** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | 🟡 **Roadmap propuesto.** Nada implementado |
| Fecha | 2026-08-04 |
| Evento | **DevNetwork [API + Cloud + AI] Hackathon 2026** |
| Base de evidencia | **AKVEZ-02 — Runtime Validation Audit** *(lectura de código, no de documentación)* |

> **Cero cambios de código.** Este documento no implementa nada y no modifica arquitectura ni Blueprint.

---

# 1. Objetivo del hackathon

## 1.1 La historia que debe contar la demo

> ### **«AKVEZ ayuda a profesionales independientes a encontrar negocios con oportunidades digitales usando inteligencia artificial.»**

**Flujo ganador:** mercado → negocios reales → análisis IA → estrategia de contacto → cliente potencial.

## 1.2 Los cuatro ejes del jurado, contra el estado real

| Eje | Estado actual | Brecha |
| --- | :-: | --- |
| **API** | 🟢 **Fuerte** | Places API (New) con expansión por zonas, deduplicación por Referencia de Origen, tolerancia a fallo parcial. **Es código serio, no una llamada de ejemplo** |
| **AI** | 🟡 **Fuerte pero invisible** | Gemini real + un motor de scoring de ~370 líneas… **cuyo razonamiento no llega a la pantalla** *(§2.2)* |
| **Cloud** | 🔴 **Inexistente** | **Cero artefactos de despliegue.** Es el eje más débil y el más barato de cubrir |
| **UX** | 🟡 **Parcial** | Tres pantallas reales; **la Pantalla 2 del guion no existe como tal** |

> ### **Diagnóstico estratégico: AKVEZ no tiene un problema de capacidad, tiene un problema de exposición.** El sistema ya calcula más inteligencia de la que enseña, y no tiene dónde desplegarse.

---

# 2. Estado actual real

## 2.1 ✅ Qué funciona — verificado en código

| Capacidad | Evidencia | Nota |
| --- | --- | --- |
| **Búsqueda real en Google Places** | `googlePlacesAdapter.ts:63-83` | `POST places.googleapis.com/v1/places:searchText`, FieldMask de 7 campos |
| **Expansión por zonas de ciudad** | `googlePlacesAdapter.ts:37-59` · `domain/zones.ts` | Bogotá, Medellín, Cali, Barranquilla |
| **Deduplicación por identidad** | `googlePlacesAdapter.ts:131-148` | Por `place.id`, no por nombre |
| **Registro idempotente** | `discoverProspects.ts:157-161` | `findByIdentity` → `register` |
| **Análisis con Gemini** | `leadAnalysisAdapter.ts` | Tandas de 10, 5 simultáneas, reintentos con *jitter* |
| **Opportunity Score** | `opportunityScore.ts` — **~370 líneas** | Pesos, `partialScore`, `coverage`, bandas, normalización |
| **Generación de pitch** | `generateOutreachPitch.ts` + adapter | Con respaldo |
| **3 pantallas navegables** | `LeadHunter` · `LeadLibrary` · `PitchGenerator` | 10 componentes en el Hunter |
| **6 endpoints** | `routes/index.ts` | 4 en uso por la UI |
| **Observabilidad** | `executionReport.ts` | Métricas por llamada |

**El flujo está conectado de extremo a extremo.** No hay eslabón roto entre la UI y las APIs externas.

## 2.2 🔴 Qué NO funciona o no existe

| # | Problema | Evidencia | Impacto en demo |
| :-: | --- | --- | :-: |
| **1** | **`dotenv` instalado y nunca cargado.** Un `.env` **no surtirá efecto** | `package.json:19` · sin importar en ningún fichero · `"dev": "tsx server.ts"` sin `--env-file` | 🔴 **La demo no arranca** |
| **2** | **Cero artefactos de despliegue** | Sin `Dockerfile`, `cloudbuild.yaml`, `app.yaml`, `.github/`, `Procfile` | 🔴 **Eje Cloud vacío** |
| **3** | **El razonamiento del Score no llega al frontend** | `leadResponseMapper.ts` — `InternalAnalyzedLead` **no incluye `breakdown`, `band`, `confidence`, `coverage`** | 🔴 **La IA no se ve** |
| **4** | **Fallback silencioso de IA** | `analyzeProspects.ts:239-267` — devuelve **HTTP 200** con análisis heurístico | 🔴 **Demo falsa** |
| **5** | **Datos demo indistinguibles de reales** | `App.tsx:8-40` — 2 leads con score y clasificación | 🔴 **Auto-engaño** |
| **6** | **Modelo `gemini-3.5-flash` sin verificar** | `leadAnalysisAdapter.ts:9` · `proposalDraftingAdapter.ts:57` | 🔴 **Si no existe, todo cae al respaldo** |
| **7** | **Persistencia en memoria** | Los 5 adapters son `inMemory*` | 🟡 Biblioteca se vacía al reiniciar |
| **8** | **Cero pruebas del camino de producto** | Sin tests en `lead-hunter` ni `lead-analyzer` | 🟡 Regresiones invisibles |
| **9** | **Sin router** | `App.tsx:62` — pestañas por `useState` | 🟢 Aceptable para demo |

### ⭐ El hallazgo con mejor relación impacto/esfuerzo — problema 3

**`opportunityScore.ts` calcula, por cada Lead, un `ScoreBreakdownEntry[]` con:**

`category` · `label` · `weight` · `partialScore` · `contribution` · `measuredFactors` · `unmeasuredFactors` · **`rationale`**

**Más `band`, `confidence`, `coverage` y `scoreVersion`.**

> ### **Nada de eso cruza la frontera HTTP.** `leadResponseMapper.ts` solo expone `score` y `classification`.
>
> **La Pantalla 2 del guion —*«score, razones, problemas detectados, oportunidad»*— pide exactamente lo que el sistema ya calcula y tira a la basura.**
>
> **Es la mejora más barata y más vistosa del roadmap:** ampliar un DTO y pintarlo. **Sin tocar dominio, sin tocar IA, sin tocar arquitectura.**

## 2.3 🟡 Qué necesita validación antes de confiar

| # | Cuestión | Cómo se valida | Bloquea |
| :-: | --- | --- | :-: |
| **1** | ¿Existe `gemini-3.5-flash`? | Una llamada real, o `models.list` | 🔴 Todo el eje AI |
| **2** | ¿Está habilitada **Places API (New)** con facturación? | Una búsqueda real | 🔴 Todo el flujo |
| **3** | **¿Cuánto cuesta una búsqueda?** | Contar `bogotaZones.length` + 1 llamadas | 🟡 Presupuesto de demo |
| **4** | ¿Qué devuelve Gemini de verdad para 10 leads? | Ejecución real | 🟡 Calidad percibida |
| **5** | ¿Cuánto tarda una búsqueda completa? | Cronometrar | 🟡 **Ritmo de la demo en vivo** |

---

# 3. Arquitectura actual relevante

## 3.1 Frontend

| Aspecto | Estado |
| --- | --- |
| **Stack** | React 19 · Vite 6 · Tailwind 4 · `lucide-react` |
| **Navegación** | **Sin router.** `useState<"hunter" \| "library" \| "pitch">` — `App.tsx:62` |
| **Estado** | `localStorage` — `leadflow_leads_v2`, `leadflow_designer_v2` |
| **Estructura** | Modular por agente: `modules/lead-hunter/{application,domain,infrastructure,presentation}` |
| **Llamadas** | `prospectSearchApi.ts` · `leadLibraryApi.ts` · `PitchGenerator.tsx:41` |

## 3.2 Backend

| Aspecto | Estado |
| --- | --- |
| **Stack** | Express 4 · TypeScript `strict` · `tsx` en desarrollo |
| **Arquitectura** | 3 módulos × 4 capas + `orchestrators/` + `routes/` + `shared/` |
| **Composition Root** | `bootstrap/compositionRoot.ts` — grafo completo, una vez |
| **Persistencia** | **5 adapters en memoria.** Contratos, modelos y mappers listos para motor real |
| **Arranque** | `server.ts` → `startServer()` → Vite middleware (dev) o `express.static("dist")` (prod) |

## 3.3 APIs externas

| API | Endpoint | Criticidad |
| --- | --- | :-: |
| **Google Places (New)** | `POST places.googleapis.com/v1/places:searchText` | 🔴 Imprescindible |
| **Gemini** | SDK `@google/genai` ^2.4.0 | 🟡 Degradable |

## 3.4 Inteligencia artificial

| Componente | Naturaleza |
| --- | --- |
| **Análisis de Leads** | Gemini — tandas de 10, máx. 5 simultáneas |
| **Opportunity Score** | ⭐ **Determinista, no IA** — ~370 líneas de scoring ponderado |
| **Redacción de pitch** | Gemini, con respaldo heurístico |
| **Reintentos** | 5 intentos, retardo creciente con *jitter*, solo ante errores transitorios |

> **Matiz que conviene saber contar al jurado:** el Score **no lo inventa la IA** — es un modelo determinista, explicable y reproducible, alimentado por hechos que la IA extrae. **Es un argumento fuerte de rigor**, y hoy no se ve porque el `breakdown` no llega a pantalla.

## 3.5 🔴 Deployment

| Artefacto | Estado |
| --- | :-: |
| `Dockerfile` · `cloudbuild.yaml` · `app.yaml` · `.github/workflows` · `Procfile` | ❌ **Ninguno** |
| Script de build | ✅ `vite build && esbuild server.ts --bundle --platform=node --outfile=dist/server.cjs` |
| Script de arranque | ✅ `node dist/server.cjs` |
| **Objetivo actual implícito** | **AI Studio** — `metadata.json` declara `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`, y `.env.example` dice *«AI Studio automatically injects this at runtime»* |

> ### **AKVEZ está construido hoy como un applet de AI Studio, no como una aplicación cloud desplegable.**
>
> **El build ya produce un artefacto autónomo** (`dist/server.cjs` + `dist/` estático) y lee `PORT` del entorno *(T-14 resuelta)*. **Está a un `Dockerfile` de ser desplegable en Cloud Run.**

---

# 4. Riesgos para una demo pública

| # | Riesgo | Prob. | Impacto | Mitigación |
| :-: | --- | :-: | :-: | --- |
| **R-1** | **La IA no se está usando y nadie lo nota.** Fallback silencioso ⇒ HTTP 200 con heurística | 🔴 Alta | 🔴 **Descalificatorio** | H-01 · H-02 |
| **R-2** | **Modelo inexistente** ⇒ 404 no transitorio ⇒ respaldo total | 🟡 Media | 🔴 Crítico | **H-01, primera tarea** |
| **R-3** | **Los datos demo se presentan como resultados reales** | 🔴 Alta | 🔴 **Pérdida de credibilidad** | H-02 |
| **R-4** | **Cuota de Places agotada en vivo** — decenas de llamadas por búsqueda | 🟡 Media | 🔴 Demo muerta | H-01 · H-04 |
| **R-5** | **La búsqueda tarda demasiado** para una demo en vivo | 🟡 Media | 🟡 Alto | H-04 |
| **R-6** | **Nada que enseñar en el eje Cloud** | 🔴 **Alta** | 🟡 Alto | H-01 |
| **R-7** | **Sin red en el recinto** ⇒ ninguna API responde | 🟡 Media | 🔴 Crítico | H-04 — **grabación de respaldo** |
| **R-8** | **Regresión no detectada** — cero pruebas del camino de producto | 🟡 Media | 🟡 Medio | H-03 |
| **R-9** | **Se rompe la arquitectura por prisa** y el proyecto queda inservible tras el hackathon | 🟡 Media | 🔴 Alto | **Regla de §6** |

---

# 5. Roadmap

> **Cuatro sprints. Ninguno requiere refactorización arquitectónica.**

## Sprint H-01 — Runtime y validación

### Objetivo
**Conseguir una ejecución real verificada de extremo a extremo, y tener dónde desplegarla.**

### Tareas

| # | Tarea | Impacto arquitectónico | ¿Blueprint? |
| :-: | --- | :-: | :-: |
| **1.1** | **Verificar que `gemini-3.5-flash` existe.** Una llamada o `models.list` | ❌ Ninguno — no toca código | ❌ No |
| **1.2** | **Hacer que las credenciales lleguen al proceso.** Dos opciones: exportarlas en el shell *(cero código)* o **cargar `dotenv` en `server.ts`** | ⚠️ **Mínimo.** `dotenv` ya es dependencia. Afecta al arranque, no a la arquitectura | ❌ No |
| **1.3** | **Habilitar Places API (New)** con facturación y verificar una búsqueda real | ❌ Ninguno | ❌ No |
| **1.4** | **Medir**: nº de llamadas y duración de una búsqueda en Bogotá | ❌ Ninguno | ❌ No |
| **1.5** | **`Dockerfile` + despliegue en Cloud Run** | ⚠️ **Aditivo.** No toca código de aplicación; el build ya produce artefacto autónomo y `PORT` ya se lee del entorno | ❌ No |

### Criterios de aceptación
✅ Una búsqueda real devuelve negocios reales de Google Places · ✅ **`metadata.usedFallbackEngine === false`** en esa respuesta · ✅ Coste y duración por búsqueda documentados · ✅ URL pública funcionando · ✅ `lint`, `tsc`, `197/197` verdes.

### Riesgos
El modelo no existe *(→ elegir uno válido: cambio de una constante)* · la cuota no alcanza *(→ acotar zonas en H-04)* · Cloud Run exige ajustes de arranque *(el `PORT` dinámico ya está resuelto)*.

---

## Sprint H-02 — Experiencia demo

### Objetivo
**Enseñar la inteligencia que ya existe, y hacer imposible confundir IA con respaldo.**

### Tareas

| # | Tarea | Impacto arquitectónico | ¿Blueprint? |
| :-: | --- | :-: | :-: |
| **2.1** | ⭐ **Exponer el `breakdown` del Score en el DTO** — `breakdown`, `band`, `confidence`, `coverage` | ⚠️ **Contrato público.** Es **aditivo**; ADR-06/ADR-07 gobiernan el DTO. **Ampliar no rompe** | 🟡 **Posible** — conviene revisar ADR-06 |
| **2.2** | **Pantalla 2 — AI Opportunity Analysis.** Score, banda, aportación por categoría, `rationale`, factores medidos y no medidos | ❌ Solo `presentation/` del frontend | ❌ No |
| **2.3** | 🔴 **Indicador visible de origen del análisis.** Distintivo claro cuando `usedFallbackEngine === true` | ❌ Solo UI — **§6.1** | ❌ No |
| **2.4** | **Separar los datos demo de los reales.** Etiquetarlos como *muestra*, o cargarlos solo con `?demo=1` | ⚠️ Mínimo — `App.tsx`. **No borrarlos** | ❌ No |
| **2.5** | **Pantalla 3 — enriquecer el Pitch** con estrategia y siguiente acción | ❌ Solo UI | ❌ No |

### Criterios de aceptación
✅ Un lead muestra **por qué** tiene su score, con aportación por categoría · ✅ **Un análisis por respaldo es visualmente inconfundible** · ✅ Los leads de muestra están etiquetados · ✅ El flujo de 3 pantallas se recorre sin tocar consola.

### Riesgos
El `breakdown` de un lead con `partialScore: null` debe renderizarse sin romper *(R-38: ausencia ≠ cero)* · ampliar el DTO exige revisar el mapper y su contrato.

---

## Sprint H-03 — Calidad IA

### Objetivo
**Que lo que la IA devuelve sea consistentemente bueno, y que una regresión no pase inadvertida.**

### Tareas

| # | Tarea | Impacto arquitectónico | ¿Blueprint? |
| :-: | --- | :-: | :-: |
| **3.1** | **Ejecutar contra 5-10 nichos reales** y revisar la calidad del análisis | ❌ Ninguno | ❌ No |
| **3.2** | **Ajustar el prompt del Analyzer** si la calidad no es suficiente | ⚠️ Solo `infrastructure/` | ❌ No |
| **3.3** | **Primeras pruebas del camino de producto**: `opportunityScore`, `deduplicateLeads`, `googlePlacesAdapter` con `fetch` doblado | ❌ **Aditivo.** Cierra la brecha de AKVEZ-02 | ❌ No |
| **3.4** | **Prueba de humo del arranque** con y sin credenciales | ❌ Aditivo | ❌ No |
| **3.5** | **Elegir el nicho y la ciudad de la demo** por resultados medidos | ❌ Ninguno | ❌ No |

### Criterios de aceptación
✅ ≥5 nichos ejecutados y documentados · ✅ **`opportunityScore` con pruebas** — hoy tiene cero · ✅ Nicho de demo elegido con evidencia · ✅ Tests ≥ 197.

### Riesgos
Ajustar el prompt puede degradar otros nichos *(→ medir antes y después)* · tiempo de ejecución real consume cuota.

---

## Sprint H-04 — Preparación final

### Objetivo
**Que la demo no dependa de la suerte.**

### Tareas

| # | Tarea | Impacto arquitectónico | ¿Blueprint? |
| :-: | --- | :-: | :-: |
| **4.1** | **Guion de demo cronometrado** | ❌ Ninguno | ❌ No |
| **4.2** | 🔴 **Grabación de respaldo** del flujo completo funcionando | ❌ Ninguno | ❌ No |
| **4.3** | **Ensayo con red del recinto**, o *hotspot* propio | ❌ Ninguno | ❌ No |
| **4.4** | **Verificar cuota** y, si hace falta, **acotar zonas** para el nicho de demo | ⚠️ Configuración de `zones.ts` | ❌ No |
| **4.5** | **Pulido visual** de las 3 pantallas | ❌ Solo UI | ❌ No |
| **4.6** | **Narrativa para el jurado**: mapear la demo a los 4 ejes | ❌ Ninguno | ❌ No |

### Criterios de aceptación
✅ Demo completa en tiempo objetivo · ✅ **Vídeo de respaldo grabado** · ✅ Ensayada en condiciones reales de red · ✅ Cuota suficiente verificada · ✅ Cada eje del jurado con su momento en el guion.

### Riesgos
La red del recinto falla *(→ 4.2)* · la cuota se agota en los ensayos *(→ presupuestar)*.

---

# 6. Cuestión que requiere decisión antes de H-02

## 6.1 ⚠️ La Prioridad 2 choca con una regla del Blueprint — y hay salida limpia

**El encargo dice:** *«Si Gemini falla: debe existir un error visible. No un resultado falso.»*

**Pero el Blueprint decide lo contrario, y con fundamento:**

| Regla | Texto |
| --- | --- |
| **DEV-00 R-64** | *«Un **fallo parcial** sobre un conjunto de Empresas **nunca aborta el conjunto**. El sistema continúa procesando el resto»* |
| **Origen** | **APS-03 §12** · **PO-01 §8** · ADR-13 §11.2 |

> **Convertir el fallo de Gemini en error fatal infringiría R-64**, que deriva de un APS y de una decisión de producto de orden 2. **No es una regla menor.**

### La salida

> ### **El requisito real es de *presentación*, no de *dominio*.** *«La demo nunca debe aparentar usar IA cuando no la está usando»* se satisface **mostrando** el origen del análisis, no **abortando** el conjunto.

**Y el dato ya existe:**

| Señal | Dónde | Estado |
| --- | --- | :-: |
| `metadata.usedFallbackEngine` | Respuesta de `/api/prospect/search` — `prospectSearchRoute.ts:81` | ✅ **Ya se emite** |
| `usedFallbackAnalysis` por lead | `InternalAnalyzedLead` | ⚠️ **Existe internamente, no se mapea** — decisión deliberada del mapper |

**Propuesta:** **H-02 tarea 2.3 se resuelve solo en la UI.** Cero cambios de dominio, cero infracción de R-64, **cero necesidad de tocar el Blueprint**.

⚠️ **Si además se quiere el distintivo por lead**, habría que mapear `usedFallbackAnalysis` al DTO — **contrato público, ADR-06**. Es aditivo, pero **requiere decisión propia** *(§7, punto 2)*.

---

# 7. Lo que pido antes de implementar

**Conforme a la restricción del encargo, ninguna tarea se ejecuta sin aprobación. Tres decisiones abren el roadmap:**

| # | Decisión | Impacto | ¿Blueprint? |
| :-: | --- | --- | :-: |
| **1** | **¿Cargo `dotenv` en `server.ts`?** *(H-01.2)* — o prefieres exportar las variables en el shell | 2 líneas en el arranque. **Sin impacto arquitectónico** | ❌ No |
| **2** | **¿Amplío el DTO público con el `breakdown` del Score?** *(H-02.1)* — **es la tarea de mayor impacto visual del roadmap** | **Contrato público.** Aditivo, gobernado por ADR-06/ADR-07 | 🟡 **Conviene revisar ADR-06 §10** |
| **3** | **¿Creo `Dockerfile` y despliego en Cloud Run?** *(H-01.5)* | **Aditivo.** No toca código de aplicación | ❌ No |

## 7.1 Regla que propongo mantener durante el hackathon

> **Ninguna tarea del roadmap exige refactorización arquitectónica, y ninguna debería introducirla.**
>
> **La arquitectura actual —módulos independientes, bajo acoplamiento, Composition Root único— es un activo, no un obstáculo:** es lo que permite exponer el `breakdown` tocando **un mapper y un componente**, sin rozar el dominio.
>
> **Si una tarea parece exigir romperla, es señal de que la tarea está mal planteada.**

---

# 8. Lo que NO está en el roadmap, y por qué

| Fuera de alcance | Motivo |
| --- | --- |
| CRM · usuarios · billing · comunidad · multi-tenancy | **Congelado por el encargo** |
| **Motor de persistencia real (PostgreSQL/Supabase)** | En memoria basta para una demo. **F-2 Capa C queda para después** |
| **Subsistema comercial** — `GenerateProposal`, diagnóstico, secuencia | **Bloqueado por B-1 y sin UI.** No forma parte del flujo de demo |
| Los bloqueos **B-1, B-2, CH-01/02/03, F-1, F-2, F-3, F-9** | **Ninguno afecta al flujo del hackathon** |
| Cadena de gobernanza **COM-33 → COM-48** | Trabajo de Blueprint, ajeno a la demo |
| Router en el frontend | Las pestañas bastan; añadirlo es coste sin retorno para el jurado |

> ⚠️ **Nota:** ~190 de las 197 pruebas cubren el subsistema comercial, que **no participa en la demo**. **El camino que se va a demostrar tiene cero pruebas** — por eso H-03.3 existe.

---

# 9. Referencias de código

`package.json:7,16,19` · `server.ts` · `server/bootstrap/startServer.ts` · `server/bootstrap/compositionRoot.ts:94` · `server/shared/config/env.ts` · `server/shared/ai/geminiClient.ts` · `server/shared/ai/generateWithRetry.ts` · `server/modules/lead-hunter/infrastructure/googlePlacesAdapter.ts` · `server/modules/lead-hunter/domain/zones.ts` · `server/modules/lead-hunter/application/discoverProspects.ts:157-161` · `server/modules/lead-analyzer/domain/opportunityScore.ts` · `server/modules/lead-analyzer/infrastructure/leadAnalysisAdapter.ts:9` · `server/modules/lead-analyzer/application/analyzeProspects.ts:239-298` · `server/shared/mappers/leadResponseMapper.ts` · `server/shared/persistence/contracts/LeadAnalysis.ts:14-30` · `server/routes/index.ts` · `server/routes/prospectSearchRoute.ts:81` · `src/App.tsx:8-49,62` · `src/shared/types/index.ts:28-29` · `vite.config.ts` · `metadata.json` · `.env.example`.

**Documentos:** **AKVEZ-02 — Runtime Validation Audit** · DEV-00 R-38, R-64 · APS-03 §12 · PO-01 §8 · ADR-06 · ADR-07 §8.
