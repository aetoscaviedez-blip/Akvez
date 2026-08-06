# H-02A — Auditoría de Implementación de Integridad de Demo

| Campo | Valor |
| --- | --- |
| Documento | **H-02A — Demo Integrity Implementation Audit** |
| Clasificación | **Auditoría de implementación** — fuera de la Clasificación Oficial de ADS-00 · **no es Blueprint** |
| Estado | ✅ **Implementado y verificado** |
| Fecha | 2026-08-04 |
| Alcance | **Bloque A de H-02 — solo frontend** |
| Antecedentes | **H-02 — Demo Integrity Plan** · H-01 · AKVEZ-02 |

> ### **La interfaz pública ya no inventa ningún dato.**

---

# 1. Validaciones

| Comprobación | Resultado |
| --- | :-: |
| `npm run lint` | ✅ **limpio** |
| `npx tsc --noEmit` | ✅ **limpio** |
| `npm test` | ✅ **197 · 26 ficheros** |
| Pruebas antes → después | **197 → 197** |
| Pruebas modificadas | **0** |

> **Ninguna prueba se tocó.** Las 197 cubren backend; **este cambio es íntegramente de frontend**, que no tiene pruebas *(brecha registrada en H-01, pendiente de H-03)*.

---

# 2. Ficheros modificados — 3, todos en `src/`

| # | Fichero | Naturaleza |
| :-: | --- | --- |
| **1** | `src/shared/types/index.ts` | Modelo de UI — habilita la representación de ausencia |
| **2** | `src/modules/lead-hunter/domain/prospectMapper.ts` | **Eliminación de las siete invenciones** |
| **3** | `src/modules/lead-hunter/presentation/components/LeadCard.tsx` | Ausencia explícita y separación de conceptos |

## 2.1 Verificación de no intervención

| Ámbito | Estado |
| --- | :-: |
| **`server/`** *(íntegro)* | ✅ **Intacto** — verificado por fecha |
| `domain/` · `application/` · `infrastructure/` del backend | ✅ **Intactos** |
| **Contratos públicos** — `server/shared/contracts/` | ✅ **Intactos** |
| `docs/blueprint/` | ✅ **Intacto** |
| **DTO del Score** *(B-1)* · **`dotenv`** · **Cloud Run** · campos nuevos | ✅ **NO implementados** |

---

# 3. Cambio 1 — `prospectMapper.ts`

## 3.1 Las siete invenciones eliminadas

| # | Antes | Ahora |
| :-: | --- | --- |
| **P-1** | `score: raw.score \|\| 60` | `numberOrAbsent(raw.score) ?? null` |
| **P-2** | `classification: … \|\| "✅ Lead Bueno"` | `textOrAbsent(raw.classification)` |
| **P-3** | `angle: … \|\| "Diseñar una landing page…"` | `textOrAbsent(raw.opportunity)` |
| **P-4** | `flaws: … \|\| ["Sitio web no optimizado…"]` | `Array.isArray(raw.flaws) ? raw.flaws : []` |
| **P-5** | `revenueLoss: … \|\| "Pérdida de clientes…"` | `textOrAbsent(raw.revenueLoss)` |
| **P-6** | `website: … \|\| "Sin sitio web — solo Google Maps"` | `textOrAbsent(raw.website)` |
| **P-7** | `source: raw.source \|\| ""` | `textOrAbsent(raw.source)` |

**También corregidos:** `googleMapsUrl`, `description`, `rating`, `reviewCount`, `whyWebsiteNeeded`, `phone` — todos pasaban por `|| ""` o `|| 0`, borrando la distinción entre ausencia y valor.

## 3.2 Dos helpers, una regla

```ts
function textOrAbsent(value: unknown): string | undefined
function numberOrAbsent(value: unknown): number | undefined
```

| Helper | Regla |
| --- | --- |
| `textOrAbsent` | Cadena vacía o solo espacios ⇒ **ausencia**. `websiteUri` vacío significa *no tiene sitio web*, no *tenemos uno cuyo texto desconocemos* |
| `numberOrAbsent` | **`0` es un número real y se conserva.** Solo lo no numérico es ausencia |

## 3.3 ✅ Verificación — `0` sobrevive

| Entrada | Antes | Ahora |
| :-: | :-: | :-: |
| `score: 0` | 🔴 **`60`** | ✅ **`0`** |
| `score: undefined` | 🔴 `60` | ✅ **`null`** |
| `score: 85` | ✅ `85` | ✅ `85` |
| `rating: 0` | `0` | ✅ `0` |
| `flaws: []` | 🔴 **1 problema inventado** | ✅ **`[]`** |

## 3.4 Lo que NO se cambió, y por qué

| Campo | Decisión |
| --- | --- |
| **`status: "Prospect"`** | ⚠️ **Conservado.** `Prospect` es uno de los **seis valores derogados** por PO-02 §5.1 — desviación **A-01** registrada en AR-05 §5.1, **con propietario y autorización propia**. Corregirlo alcanza a `CE-I1` y `RegisterContact`: **fuera de alcance** |
| **`dateCreated`** | ⚠️ **Conservado.** Se genera en el cliente y **el servidor no lo envía**. Se documenta como *marca de incorporación al workspace*, **no fecha de descubrimiento** — hoy coinciden porque el Lead se acaba de buscar |

---

# 4. Cambio 2 — `LeadCard.tsx`

## 4.1 Medidor de Score

| Antes | Ahora |
| --- | --- |
| `{lead.score \|\| 70}` | `{hasScore ? lead.score : "—"}` |
| `{lead.classification \|\| "Calificado"}` | `{hasScore ? "Sobre 100" : "Sin evaluar"}` |

**Guarda introducida:**

```ts
const hasScore = typeof lead.score === "number";
```

> **Mismo patrón que `LeadLibrary.tsx:242`**, que ya lo hacía bien. **`0` se muestra como `0`; la ausencia como `—` atenuado.**

## 4.2 ✅ Separación de conceptos — requisito 3

**El rótulo «Lead Score» mostraba debajo `classification`, que es el *estado del sitio web*, no la banda comercial.**

| Concepto | Dónde está ahora |
| --- | --- |
| **Estado del sitio web** | Distintivo propio arriba, con **icono de globo** — sin cambios |
| **Opportunity Score** | Medidor, con `hasScore` y sin etiqueta prestada |
| **Banda comercial** *(`band`, APS-08 §8)* | ⚠️ **No se afirma ninguna** — no llega por esta ruta hasta B-1 |

> **El backend ya advertía la distinción** *(`analyzeProspects.ts:221-223`: «`band` no sustituye a `classification`»)*. **La UI ya no las confunde.**

## 4.3 Sitio web — se lee el dato, no una cadena fabricada

| Antes | Ahora |
| --- | --- |
| `lead.website.toLowerCase().includes("sin sitio web")` | `lead.website ? <enlace> : "Sin sitio web registrado"` |

> **Se comprobaba contra un texto que el propio mapper fabricaba** *(P-6)*. Al retirar la fabricación, la comprobación habría dejado de funcionar. **Ahora la ausencia se lee de la ausencia.**

## 4.4 Fuentes inexistentes retiradas

**Eliminadas las ramas de «Instagram», «Facebook» y «Directorio».** El sistema **no consulta esas fuentes**: `groundingSearchAdapter` está huérfano y el Composition Root no lo construye. **Anunciarlas sugería una cobertura que no existe.**

**Se conserva** la rama de *Google Maps* —única fuente real— y una genérica para lo que el servidor declare.

## 4.5 «Maps Verificado» — solo si hay algo verificado

| Antes | Ahora |
| --- | --- |
| `lead.rating !== undefined \|\| lead.reviewCount !== undefined` | `(lead.rating ?? 0) > 0 \|\| (lead.reviewCount ?? 0) > 0` |

> **El adapter define siempre esos campos, con `0`** *(`place.rating \|\| 0`)*, de modo que el distintivo aparecía **vacío**, reclamando una verificación sin dato que la respaldara.

## 4.6 Ausencias declaradas

| Bloque | Cuando falta el dato |
| --- | --- |
| **Descripción** | Se omite el párrafo |
| **Problemas detectados** | *«El análisis no detectó problemas web para este negocio.»* |
| **Ángulo de oportunidad** | *«No se generó un ángulo de oportunidad para este negocio.»* |

> **Antes, `flaws` vacío rendía una cabecera sobre una rejilla vacía**, y `angle` ausente un bloque en blanco.

---

# 5. Cambio 3 — `src/shared/types/index.ts`

**`website`, `description` y `angle` pasan a opcionales; `score` pasa a `number | null`.**

> **Sin este cambio, `tsc --noEmit` falla:** retirar los `||` produce `undefined` donde el tipo exigía `string`. **Los tres cambios son indivisibles.**

**Se documentaron en el tipo las dos reglas que sostienen todo:**

| Regla | Dónde |
| --- | --- |
| **R-38** — «no hay dato» ≠ «el dato es cero o vacío» | Cabecera de `Prospect` |
| **R-45** — un Lead **sin Evaluación** es un estado legítimo | Campo `score` |
| **`classification` ≠ `band`** | Campo `classification` |

⚠️ **`LeadStatus` conserva los seis valores derogados** — desviación **A-01**, fuera de alcance.

---

# 6. Verificación de los tres requisitos

| # | Requisito | Verificación |
| :-: | --- | :-: |
| **1** | **Score de 0 es válido** | ✅ `numberOrAbsent` conserva `0`; `typeof === "number"` lo trata como puntuación |
| **2** | **`null` es ausencia** | ✅ `score` ausente ⇒ `null` ⇒ **`—`** |
| **3** | **Website status y Score separados** | ✅ Distintivo con globo arriba; medidor sin etiqueta prestada; **no se afirma banda** |

## 6.1 Comprobación automática

```
grep -E "\|\| \"|\|\| \[|\|\| [0-9]"  prospectMapper.ts  →  NINGUNO
grep -E "\|\| \"|\|\| [0-9]"          LeadCard.tsx       →  NINGUNO
```

---

# 7. Qué ve ahora el jurado

**Un negocio real sin evaluar ni analizar:**

| Elemento | Antes | Ahora |
| --- | :-: | :-: |
| Score | 🔴 **60** *(o 70)* | ✅ **`—` · «Sin evaluar»** |
| Clasificación | 🔴 **«✅ Lead Bueno»** | ✅ **Sin distintivo** |
| Problemas | 🔴 **1 problema inventado** | ✅ **«No se detectaron problemas»** |
| Oportunidad | 🔴 **Una estrategia inventada** | ✅ **«No se generó un ángulo»** |
| Pérdida de ingresos | 🔴 **Un impacto inventado** | ✅ **Bloque omitido** |
| Sitio web | 🔴 «Sin sitio web — solo Google Maps» | ✅ **«Sin sitio web registrado»** |
| Maps Verificado | 🔴 **Distintivo vacío** | ✅ **Oculto** |

> ### **Un negocio no analizado ya no puede confundirse con uno analizado.**

---

# 8. Lo que sigue pendiente

| # | Pendiente | Bloque | Estado |
| :-: | --- | :-: | :-: |
| **1** | **Fallback de IA invisible** — `metadata.usedFallbackEngine` se emite y no se muestra | **C** | 🔴 **El riesgo descalificatorio sigue abierto** |
| **2** | **Score breakdown en la ruta de búsqueda** | **B** | ⏸️ Requiere aprobación de **B-1** |
| **3** | **`dotenv`** · **Cloud Run** · verificación del modelo | **D** | ⏸️ No implementados |
| **4** | **`CL_SAMPLE_LEADS` sin etiquetar** | **E-5** | ⏸️ Pendiente |
| **5** | Botón «Contacto» sin teléfono copia el nombre | **E-4** | ⏸️ Bug de UX, no dato inventado |
| **6** | `status: "Prospect"` y `LeadStatus` derogado | — | ⏸️ **A-01**, autorización propia |
| **7** | **Cero pruebas de frontend** | H-03 | ⏸️ |

> ### ⚠️ **Este sprint elimina los datos inventados. NO elimina el fallback silencioso.**
>
> **Con Gemini caído, la tarjeta seguirá mostrando análisis heurístico sin distinguirlo** — porque `fallbackAnalysis` **sí produce** `flaws`, `angle` y `revenueLoss` reales, y la UI no tiene forma de saber que vinieron del respaldo.
>
> **El Bloque C sigue siendo el riesgo más grave, y no requiere aprobación arquitectónica.**

---

# 9. Impacto arquitectónico

| Pregunta | Respuesta |
| --- | :-: |
| ¿Se tocó `domain/`, `application/` o `infrastructure/` del backend? | ❌ **No** |
| ¿Se modificó algún contrato público? | ❌ **No** |
| ¿Se añadieron capas, agentes o dependencias? | ❌ **No** |
| ¿Se rompió compatibilidad? | ❌ **No** — solo se relajaron tipos de UI |
| ¿Requiere actualizar el Blueprint? | ❌ **No** |
| **Clasificación** | **Tipo A — Demo UX** |

> **`src/modules/lead-hunter/domain/prospectMapper.ts` está en `domain/` del *frontend*, no del backend.** La restricción del encargo protege `server/`, que **no se ha tocado**.

---

# 10. Referencias

**Ficheros modificados:** `src/shared/types/index.ts` · `src/modules/lead-hunter/domain/prospectMapper.ts` · `src/modules/lead-hunter/presentation/components/LeadCard.tsx`

**Referencias de apoyo:** `src/modules/lead-hunter/presentation/LeadLibrary.tsx:242,323` *(patrón de referencia)* · `src/modules/lead-hunter/application/searchProspects.ts:29-31` · `server/shared/contracts/prospectSearch.ts` *(sin cambios)* · `server/modules/lead-analyzer/application/analyzeProspects.ts:221-223` · `server/modules/lead-hunter/infrastructure/googlePlacesAdapter.ts:164-172` · `server/routes/prospectSearchRoute.ts:81`

**Normativa:** **DEV-00 R-38** *(ausencia ≠ cero)* · **R-45** *(Lead sin Score es legítimo)* · **APS-08 §8** *(bandas)* · **PO-02 §5.1** · **AR-05 §5.1** *(A-01)* · **ADR-06** *(contrato público — no tocado)*

**Documentos:** H-02 §6.1 *(Bloque A)* · H-01 · AKVEZ-02
