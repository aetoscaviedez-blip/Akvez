# H-02 — Plan de Integridad de Demo

| Campo | Valor |
| --- | --- |
| Documento | **H-02 — Demo Integrity Plan** |
| Clasificación | **Plan de trabajo** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | 🟡 **Plan redactado. CERO cambios de código** |
| Fecha | 2026-08-04 |
| Antecedentes | **H-01 — Demo Readiness Audit** · AKVEZ-02 |

> **No se ha modificado ningún fichero de código.**

---

# 0. El hallazgo que reescribe el plan

## 0.1 🔄 Corrección a H-01

**H-01 afirmó que *«el `breakdown` del Score no llega al frontend»*. Eso es cierto solo para una de las dos rutas.**

| Ruta | ¿Score completo? | ¿Maneja la ausencia? |
| --- | :-: | :-: |
| **`POST /api/prospect/search`** → `LeadHunter` → `LeadCard` | ❌ **Solo `score` + `classification`** | 🔴 **INVENTA datos** |
| **`GET /api/leads`** → `LeadLibrary` | ✅ **COMPLETO** | ✅ **Correcto** |

**`LeadLibraryItemDTO`** *(`contracts/leadLibrary.ts:69-103`)* ya expone: `score` · `band` · `scoreVersion` · `confidence` · `coverage` · `calculatedAt` · **`breakdown[]`** con `category`, `weight`, `partialScore`, `contribution`, `measuredFactors`, `unmeasuredFactors`, **`rationale`**.

**Y `LeadLibrary.tsx` ya lo pinta bien:**

| Línea | Evidencia |
| :-: | --- |
| 168 | `function ScoreBreakdown({ breakdown, score })` — **componente ya construido** |
| 215 | `{totalContribution.toFixed(2)} ≈ {score}` — **muestra la aritmética del Score** |
| **242** | `const hasScore = typeof lead.score === "number"` — con el comentario *«**NO `!!score`**: un Score de 0 es…»* |
| **323** | `{hasScore ? lead.score : "—"}` — **muestra un guion, NO inventa** |
| 317 | Tooltip: `Opportunity Score N/100 · band · Perfil scoreVersion` |

> ### **La «Pantalla 2» que H-01 daba por inexistente ya está construida — en la Biblioteca. Y hace exactamente lo correcto con los valores ausentes.**

## 0.2 Consecuencia para el plan

> ### **El trabajo no es construir una pantalla nueva. Es llevar la ruta de búsqueda al estándar que la Biblioteca ya cumple.**
>
> **El mismo repositorio contiene la enfermedad y la cura.** `LeadLibrary` es la implementación de referencia; `LeadHunter` es la que inventa.
>
> **Ventaja arquitectónica:** el patrón —DTO con campos opcionales, `?? null` explícito, `typeof === "number"` en la UI— **ya está aprobado y en uso**. Replicarlo no introduce criterio nuevo.

---

# 1. `LeadCard.tsx` — análisis completo

**254 líneas leídas íntegras.**

## 1.1 🔴 Datos inventados

| # | Línea | Código | Problema |
| :-: | :-: | --- | --- |
| **C-1** | **129** | `{lead.score \|\| 70}` | **Score `0` o ausente ⇒ muestra `70`.** `R-45` declara legítimo un Lead sin Score |
| **C-2** | **121** | `{lead.classification \|\| "Calificado"}` | Etiqueta inventada **y semánticamente errónea** — §1.4 |

## 1.2 🟡 Fallbacks visuales y ramas muertas

| # | Línea | Observación |
| :-: | :-: | --- |
| **C-3** | 94 | `lead.rating !== undefined \|\| lead.reviewCount !== undefined` — el distintivo **«✨ Maps Verificado»** aparece aunque ambos sean `0`, sin dato que mostrar |
| **C-4** | 38-51 | Ramas de `source` para **«Instagram», «Facebook», «Directorio»** — **fuentes que no existen**: `groundingSearchAdapter` está huérfano. **UI muerta** |
| **C-5** | 56-71 | `lead.website.toLowerCase().includes("sin sitio web")` — depende de una **cadena literal** que fabrica `prospectMapper.ts:26`. Acoplamiento frágil por texto |
| **C-6** | 229-231 | En la rama **sin teléfono**, el botón «Contacto» copia `lead.phone \|\| lead.name` ⇒ **siempre copia el nombre** |
| **C-7** | 170-182 | Cabecera *«Problemas Web Críticos Detectados»* se renderiza **aunque `flaws` esté vacío** |

## 1.3 🟢 Valores hardcodeados aceptables

| Línea | Elemento |
| :-: | --- |
| 145, 160, 173, 188 | Textos de cabecera de sección |
| 204, 244 | Colores hex `#E28A5D` fuera del tema Tailwind — inconsistencia menor |
| 25, 35, 50, 97 | Emojis decorativos |

## 1.4 ⚠️ Error semántico — el medidor está mal etiquetado

**`LeadCard.tsx:116-122`** rotula el bloque **«Lead Score»** y debajo pone `lead.classification`.

**Pero `classification` NO es la banda del Score:**

| Concepto | Valores | Origen |
| --- | --- | --- |
| `classification` | *Sin sitio web · Sitio web básico · Sitio web deficiente* | **Estado del sitio web** — Gemini o `fallbackAnalysis.ts:11-37` |
| **`band`** | *Oportunidad Excelente · Alta · Media · Baja · Muy Baja* | **Prioridad comercial** — `classifyScore()`, APS-08 §8 |

**El backend lo advierte expresamente** — `analyzeProspects.ts:221-223`: *«`band` no sustituye a `classification`: aquélla es la prioridad comercial del Lead, ésta [describe el sitio]»*.

> **La UI las confunde porque `band` nunca le llega por esta ruta.** En la Biblioteca sí llega, y allí se usa correctamente *(`LeadLibrary.tsx:317`)*.

---

# 2. 🔴 `prospectMapper.ts` — el problema real

> ### **H-01 señaló `LeadCard`. La fuente está una capa antes, y es mucho peor.**

**`src/modules/lead-hunter/domain/prospectMapper.ts:23-41`** — siete invenciones:

| # | Línea | Código | Qué inventa |
| :-: | :-: | --- | --- |
| **P-1** | **33** | `score: raw.score \|\| 60` | 🔴 **Un Score de 60.** `0 ⇒ 60` |
| **P-2** | **34** | `classification: raw.classification \|\| "✅ Lead Bueno"` | 🔴 **Clasificación falsa** — y en el **mismo vocabulario que los datos demo** |
| **P-3** | **30** | `angle: raw.opportunity \|\| "Diseñar una landing page de alta conversión…"` | 🔴 **Una oportunidad comercial entera** |
| **P-4** | **29** | `flaws: raw.flaws \|\| ["Sitio web no optimizado para dispositivos móviles."]` | 🔴 **Un problema detectado que nadie detectó** |
| **P-5** | **35** | `revenueLoss: raw.revenueLoss \|\| "Pérdida de clientes potenciales…"` | 🔴 **Un impacto financiero** |
| **P-6** | **26** | `website: raw.website \|\| "Sin sitio web — solo Google Maps"` | 🟡 Texto de relleno del que depende `LeadCard:56` |
| **P-7** | **32** | `dateCreated: new Date().toLocaleDateString(...)` | 🟡 Fecha **del cliente**, no del descubrimiento |

## 2.1 Qué ve el jurado

> **Un negocio sin Score, sin problemas detectados y sin oportunidad identificada se renderiza como:**
>
> **Score 60 · «✅ Lead Bueno» · un problema web inventado · una oportunidad comercial inventada · una pérdida de ingresos inventada.**
>
> ### **Es exactamente lo que la Prioridad 2 prohíbe, y es peor que el `|| 70` de H-01.**

## 2.2 Interacción entre las dos capas

`prospectMapper` corre **antes** que `LeadCard`. Como P-1 ya sustituye el ausente por `60`, **C-1 (`|| 70`) casi nunca se dispara** — pero sigue ahí y se disparará en cuanto P-1 se corrija.

> **Corregir solo `LeadCard` no arregla nada. Corregir solo `prospectMapper` deja `|| 70` esperando. Van juntos.**

## 2.3 Contraste — el mismo repositorio ya sabe hacerlo bien

| | `prospectMapper.ts:33` | `LeadLibrary.tsx:242` |
| --- | --- | --- |
| Código | `score: raw.score \|\| 60` | `typeof lead.score === "number"` |
| Ausencia | **Inventa 60** | **Muestra «—»** |
| Comentario | — | *«NO `!!score`: un Score de 0 es…»* |

---

# 3. `leadResponseMapper` — campos que existen y se pierden

## 3.1 Qué recibe

**`InternalAnalyzedLead`** *(`leadResponseMapper.ts:14-46`)* declara **19 campos**, y `analyzeProspects.ts:221-229` adjunta al lead **cuatro más que el tipo no declara**: `band` · `confidence` · `scoreBreakdown` · `scoreCoverage`.

## 3.2 Qué expone

**`LeadResponseDTO`** *(`contracts/prospectSearch.ts:23-39`)* — 15 campos. **Del Score solo `score`.**

## 3.3 Tabla de pérdida

| Campo | ¿Lo calcula el dominio? | ¿Llega al mapper? | ¿Se persiste? | ¿Cruza HTTP? |
| --- | :-: | :-: | :-: | :-: |
| `score` | ✅ | ✅ | ✅ | ✅ |
| **`band`** | ✅ | ✅ *(221-229)* | ✅ *(326)* | 🔴 **NO** |
| **`breakdown`** | ✅ | ✅ | ✅ *(327)* | 🔴 **NO** |
| **`confidence`** | ✅ | ✅ | ✅ *(328)* | 🔴 **NO** |
| **`coverage`** | ✅ | ✅ | ✅ *(329)* | 🔴 **NO** |
| `evaluatedWeight` · `profileVersion` | ✅ | ⚠️ Parcial | ✅ | 🔴 NO |
| `hasWebsite` | — | ✅ | — | ❌ **Deliberado** |
| **`usedFallbackAnalysis`** | — | ✅ | — | ❌ **Deliberado** — solo agregado en `metadata` |

> **Los cuatro campos críticos ya están en el objeto que entra al mapper. El mapper simplemente no los declara ni los copia.**

## 3.4 El precedente ya resuelto

**`leadLibraryMapper.ts:78-89`** hace exactamente lo que falta:

```
if (lead.scoreVersion !== undefined) {
  dto.score = lead.score ?? null;
  dto.band  = lead.band  ?? null;
  if (lead.confidence !== undefined) dto.confidence = lead.confidence;
  if (lead.coverage   !== undefined) dto.coverage   = lead.coverage;
  if (lead.breakdown  !== undefined) { … }
}
```

**Con el razonamiento documentado en el propio fichero** *(línea 73)*: distingue *«sin evaluar»* de *«evaluado con resultado nulo»*, conforme a **R-38** y **R-45**.

> ### **No hay que diseñar nada. Hay que replicar `leadLibraryMapper` en `leadResponseMapper`.**

---

# 4. Opportunity Score — qué llega y qué no

## 4.1 Por ruta

| Dato | `/api/prospect/search` | `/api/leads` |
| --- | :-: | :-: |
| `score` | ✅ | ✅ |
| `band` | 🔴 **No** | ✅ |
| `breakdown[]` con `rationale` | 🔴 **No** | ✅ |
| `confidence` | 🔴 **No** | ✅ |
| `coverage` | 🔴 **No** | ✅ |
| `scoreVersion` | 🔴 **No** | ✅ |
| `calculatedAt` | 🔴 **No** | ✅ |
| **Ausencia representada** | 🔴 **Inventada** | ✅ **`null` / «—»** |

## 4.2 Lo que existe y no se muestra en la pantalla principal

**Por cada categoría de APS-08 §6**, el sistema ya calcula y descarta:

`weight` *(peso en el perfil)* · `partialScore` *(0-100 o `null`)* · `contribution` *(puntos aportados)* · **`measuredFactors[]`** · **`unmeasuredFactors[]`** · **`rationale`** *(explicación legible)*

Más, por Lead: `band` · `confidence` *(alta/media/limitada)* · `coverage` · `evaluatedWeight` · `profileVersion`.

> **`unmeasuredFactors` es especialmente valioso ante un jurado: el sistema declara qué NO pudo medir.** Es lo contrario de inventar.

---

# 5. Runtime

## 5.1 Configuración necesaria

| Variable | Obligatoria | Si falta |
| --- | :-: | --- |
| **`GOOGLE_PLACES_API_KEY`** | 🔴 **Sí** | **HTTP 400** — `prospectSearchRoute.ts:39` |
| **`GEMINI_API_KEY`** | 🟡 Degradante | Respaldo silencioso |
| `PORT` · `NODE_ENV` | ⚪ No | 3000 · desarrollo |
| `APP_URL` | ❌ No se lee | — |

## 5.2 🔴 `dotenv` instalado y nunca cargado

`package.json:19` lo declara · **cero imports** · `"dev": "tsx server.ts"` sin `--env-file`.

> **Crear un `.env` NO surtirá efecto.** Las variables deben exportarse en el shell o inyectarlas la plataforma.

## 5.3 Servicios externos

| Servicio | Endpoint | Habilitación |
| --- | --- | --- |
| **Places API (New)** | `POST places.googleapis.com/v1/places:searchText` | Habilitar en GCP + facturación |
| **Gemini** | SDK `@google/genai` | Clave válida + **modelo verificado** |

⚠️ **Volumen:** `googlePlacesAdapter.ts:37-59` lanza **1 + N sub-consultas por zona**. Una búsqueda en Bogotá consume decenas de llamadas facturables.

## 5.4 Posibles fallos, por orden

| # | Fallo | Visible | Efecto |
| :-: | --- | :-: | :-: |
| 1 | Credenciales no llegan | ✅ **Sí** | HTTP 400 |
| 2 | Places: clave inválida / no habilitada / cuota | ✅ **Sí** | HTTP 500 |
| 3 | **Modelo Gemini inexistente** | 🔴 **NO** | Respaldo silencioso |
| 4 | Cuota Gemini | 🔴 **NO** | 5 reintentos ⇒ respaldo |
| 5 | Reinicio del proceso | 🟡 Parcial | Biblioteca vacía |

**Señales existentes y no mostradas:** `metadata.usedFallbackEngine` *(`prospectSearchRoute.ts:81`)* · `usedFallbackAnalysis` por lead *(interno)* · consola *(`analyzeProspects.ts:280`)*.

---

# 6. Cambios propuestos

> **Ninguno implementado. Orden por impacto sobre la integridad de la demo.**

## 6.1 Bloque A — Eliminar datos inventados

| # | Cambio | Archivo | Impacto | ¿Arquitectura? | ¿Blueprint? |
| :-: | --- | --- | --- | :-: | :-: |
| **A-1** | Retirar los **siete `\|\|`** de `mapRawProspectToProspect` y propagar la ausencia | `src/modules/lead-hunter/domain/prospectMapper.ts:26-41` | 🔴 **Alto — elimina la invención en origen** | ❌ **No** | ❌ **No** |
| **A-2** | Retirar `\|\| 70` y `\|\| "Calificado"` | `src/.../components/LeadCard.tsx:121,129` | 🔴 Alto | ❌ No | ❌ No |
| **A-3** | Representar la ausencia con **«—»**, patrón de `LeadLibrary.tsx:242,323` | `LeadCard.tsx` | 🟡 Medio | ❌ No | ❌ No |
| **A-4** | Hacer opcionales en `Prospect` los campos que pueden faltar | `src/shared/types/index.ts:12-40` | 🟡 Medio — **habilita A-1** | ❌ No | ❌ No |

**Tipo A/B. Solo frontend.** ⚠️ **A-1 y A-4 van juntos**: retirar los `||` sin ajustar el tipo produce errores de `tsc`.

## 6.2 Bloque B — Exponer el Score en la ruta de búsqueda

| # | Cambio | Archivo | Impacto | ¿Arquitectura? | ¿Blueprint? |
| :-: | --- | --- | --- | :-: | :-: |
| **B-1** | Añadir `band`, `confidence`, `coverage`, `breakdown[]`, `scoreVersion` — **opcionales** | `server/shared/contracts/prospectSearch.ts:23-39` | 🔴 **Alto** | ⚠️ **Contrato público, aditivo** | 🟡 **Revisar ADR-06 §10** |
| **B-2** | Declararlos en `InternalAnalyzedLead` y mapearlos con el patrón `?? null` | `server/shared/mappers/leadResponseMapper.ts` | 🔴 Alto | ⚠️ Mapper | ❌ No |
| **B-3** | Ampliar `Prospect` con los campos del Score | `src/shared/types/index.ts` | 🟡 | ❌ No | ❌ No |
| **B-4** | Transportarlos en `prospectMapper` **sin inventar** | `src/.../prospectMapper.ts` | 🟡 | ❌ No | ❌ No |
| **B-5** | **Reutilizar `ScoreBreakdown`** de `LeadLibrary.tsx:168` en `LeadCard` | `src/.../components/` | 🔴 **Alto visual** | ❌ No — **componente ya existente** | ❌ No |

**Tipo C solo en B-1.** **Cero cambios en `domain/`, `application/` e `infrastructure/`.**

> **Precedente que respalda B-1 y B-2:** `LeadLibraryItemDTO` ya expone estos mismos campos con la misma semántica. **No se inventa contrato: se replica uno aprobado.**

## 6.3 Bloque C — Fallo visible de IA

| # | Cambio | Archivo | Impacto | ¿Arquitectura? | ¿Blueprint? |
| :-: | --- | --- | --- | :-: | :-: |
| **C-1** | Mostrar distintivo cuando `metadata.usedFallbackEngine === true` | `LeadHunter.tsx` / `ResultsHeader.tsx` | 🔴 **Alto** | ❌ **No** — el dato **ya se emite** | ❌ **No** |
| **C-2** | Propagar `usedFallbackEngine` desde `searchProspects` | `src/.../application/searchProspects.ts` | 🟡 | ❌ No | ❌ No |
| **C-3** | *(Opcional)* Distintivo **por lead** — exige mapear `usedFallbackAnalysis` | `leadResponseMapper.ts` + DTO | 🟡 | ⚠️ Contrato público | 🟡 **ADR-06** |

> ### ⚠️ **C-1 y C-2 NO tocan el dominio, y eso importa.**
>
> **`DEV-00 R-64`** exige que *«un fallo parcial nunca aborte el conjunto»* —deriva de **APS-03 §12** y **PO-01 §8**—. **Convertir el fallo de Gemini en error fatal la infringiría.**
>
> **El requisito real es de presentación:** *«la demo no debe aparentar usar IA cuando no la usa»* se satisface **mostrando**, no abortando. **Sin tocar Blueprint.**

## 6.4 Bloque D — Runtime

| # | Cambio | Archivo | Impacto | ¿Arquitectura? | ¿Blueprint? |
| :-: | --- | --- | --- | :-: | :-: |
| **D-1** | **Verificar el modelo Gemini** | — | 🔴 **Crítico** | ❌ No | ❌ No |
| **D-2** | Credenciales en el proceso — shell, o `import "dotenv/config"` en `server.ts` | `server.ts` *(2 líneas)* | 🔴 **Desbloquea la demo** | ❌ **No** | ❌ No |
| **D-3** | Habilitar Places API + medir coste y duración | — | 🔴 | ❌ No | ❌ No |

## 6.5 Bloque E — Limpieza opcional

| # | Cambio | Archivo | Prioridad |
| :-: | --- | --- | :-: |
| **E-1** | Retirar ramas muertas de `source` *(Instagram/Facebook/Directorio)* | `LeadCard.tsx:38-51` | 🟢 Baja |
| **E-2** | Ocultar «Maps Verificado» sin datos | `LeadCard.tsx:94` | 🟢 Baja |
| **E-3** | Ocultar cabecera de problemas si `flaws` vacío | `LeadCard.tsx:170` | 🟢 Baja |
| **E-4** | Corregir el botón «Contacto» sin teléfono | `LeadCard.tsx:229` | 🟢 Baja |
| **E-5** | Etiquetar `CL_SAMPLE_LEADS` como muestra | `App.tsx:8-40` | 🟡 Media |
| **E-6** | Usar `band` en el medidor, no `classification` | `LeadCard.tsx:121` | 🟡 **Media** — depende de B |

---

# 7. Resumen de impacto

| Bloque | Ficheros | Backend | Frontend | ¿Arquitectura? | ¿Blueprint? |
| :-: | :-: | :-: | :-: | :-: | :-: |
| **A** — sin invención | 3 | 0 | 3 | ❌ | ❌ |
| **B** — Score expuesto | 5 | **2** | 3 | ⚠️ **Contrato** | 🟡 **ADR-06** |
| **C** — fallo visible | 2-3 | 0-1 | 2 | ❌ | ❌ *(salvo C-3)* |
| **D** — runtime | 0-1 | 0-1 | 0 | ❌ | ❌ |
| **E** — limpieza | 2 | 0 | 2 | ❌ | ❌ |

> ### **Un único cambio requiere análisis arquitectónico: B-1**, ampliación aditiva del contrato público. **Todo lo demás es Tipo A o B.**
>
> **`domain/`, `application/` e `infrastructure/` no se tocan en ningún bloque.**

---

# 8. Orden recomendado

| # | Bloque | Motivo |
| :-: | --- | --- |
| **1** | **D-1, D-2, D-3** | Sin esto no hay nada que verificar |
| **2** | **A-4 + A-1 + A-2 + A-3** | **Elimina la invención.** Van juntos por `tsc` |
| **3** | **C-1 + C-2** | Elimina la demo falsa. Sin dependencias |
| **4** | **B-1 → B-5** | ⚠️ **Requiere aprobación de B-1** |
| **5** | **E-5, E-6** | Coherencia |
| **6** | **E-1 a E-4** | Pulido |

**Los pasos 1-3 no requieren ninguna aprobación arquitectónica y eliminan los tres riesgos descalificatorios.**

---

# 9. Decisión que pido

| # | Decisión | Alcance |
| :-: | --- | --- |
| **1** | **¿Apruebo el Bloque B-1?** — ampliar `LeadResponseDTO` con los campos del Score, **opcionales y aditivos**, replicando `LeadLibraryItemDTO` | **Único punto que toca contrato público.** Gobernado por **ADR-06 §10** |
| **2** | **¿Cargo `dotenv` en `server.ts`** *(D-2)*, o prefieres exportar en el shell? | 2 líneas |
| **3** | **¿Incluyo C-3** —distintivo de respaldo **por lead**—, que también toca el DTO? | Contrato público |

> **Los bloques A, C-1/C-2, D-1, D-3 y E no requieren decisión: son Tipo A/B, sin impacto arquitectónico.** Puedo empezar por ellos en cuanto lo autorices.

---

# 10. Referencias

**Código:** `src/modules/lead-hunter/domain/prospectMapper.ts:13-42` · `src/modules/lead-hunter/presentation/components/LeadCard.tsx:1-254` · `src/modules/lead-hunter/presentation/LeadLibrary.tsx:54,168,215,238-242,317,323,365` · `src/modules/lead-hunter/infrastructure/leadLibraryApi.ts:7-46` · `src/modules/lead-hunter/application/searchProspects.ts:30` · `src/shared/types/index.ts:10-40` · `src/App.tsx:8-40` · `server/shared/contracts/prospectSearch.ts:23-55` · `server/shared/contracts/leadLibrary.ts:31-124` · `server/shared/mappers/leadResponseMapper.ts:14-83` · `server/shared/mappers/leadLibraryMapper.ts:73-89` · `server/modules/lead-analyzer/domain/opportunityScore.ts:60-115` · `server/modules/lead-analyzer/application/analyzeProspects.ts:221-229,262-267,280,323-329` · `server/modules/lead-analyzer/domain/fallbackAnalysis.ts:11-37` · `server/modules/lead-hunter/infrastructure/googlePlacesAdapter.ts:37-59` · `server/routes/prospectSearchRoute.ts:39,81` · `server/shared/config/env.ts` · `package.json:7,19`.

**Documentos:** H-01 · AKVEZ-02 · AKVEZ-HACKATHON-ROADMAP · DEV-00 R-38, R-45, R-64 · APS-03 §12 · APS-08 §6, §8, §9 · PO-01 §8 · ADR-06 §10 · ADR-07 §8.
