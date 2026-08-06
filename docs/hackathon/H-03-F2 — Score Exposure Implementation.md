# H-03 · Fase 2 — Exposición del Opportunity Score

| Campo | Valor |
| --- | --- |
| Documento | **H-03-F2 — Score Exposure Implementation** |
| Clasificación | **Registro de implementación** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | ✅ **Tareas 1 y 2 implementadas y validadas** · ⏸️ **Fases 3-5 detenidas** — §7 |
| Fecha | 2026-08-04 |
| Antecedentes | H-03 · H-03-F1 · H-02A/B/C/D |

---

# 1. Objetivo

**Que la ruta de búsqueda entregue la misma explicación del Score que la Biblioteca ya entregaba.**

> **No se calcula nada nuevo.** El dato existía en `domain/`, se adjuntaba en `application/` y se persistía. **Se perdía en el mapper HTTP.**

---

# 2. Cambios realizados

## 2.1 Tarea 1 — Contrato y mapper

| # | Cambio | Detalle |
| :-: | --- | --- |
| **1.1** | **Nuevo contrato compartido** `shared/contracts/opportunityScore.ts` | `ScoreBreakdownEntryDTO` **movido verbatim** — mismo nombre, misma forma, misma documentación |
| **1.2** | `leadLibrary.ts` **reexporta** el tipo | `export type { ScoreBreakdownEntryDTO }` — **ningún consumidor se entera** |
| **1.3** | `LeadResponseDTO` **+6 campos opcionales** | `band` · `scoreVersion` · `confidence` · `coverage` · `calculatedAt` · `breakdown` |
| **1.4** | `InternalAnalyzedLead` declara lo que ya recibía | `analyzeProspects` los adjuntaba y el tipo no los nombraba |
| **1.5** | `mapToLeadResponseDTO` los mapea | Con el patrón exacto de `leadLibraryMapper.ts:78-89` |

### Por qué un fichero nuevo y no un import entre contratos

**El encargo exige reutilizar el contrato existente sin crear nombres nuevos. Había dos formas:**

| Opción | Problema |
| --- | --- |
| Duplicar el tipo en `prospectSearch.ts` | **Dos definiciones que divergen en la primera modificación** |
| `prospectSearch.ts` importa de `leadLibrary.ts` | **Ata el contrato de un endpoint al de su par**, no al de una dependencia |

> **El Score no pertenece a un endpoint: lo publican dos.** Declararlo en fichero propio es lo que evita ambos problemas, y **R-15 lo autoriza expresamente**: *«`shared/contracts/` importa solo tipos primitivos y otros archivos de `shared/contracts/`»*.
>
> **Cero nombres nuevos. Cero duplicación. Cero consumidores rotos.**

### La regla de publicación

```ts
if (lead.scoreVersion !== undefined) {
  dto.scoreVersion = lead.scoreVersion;
  dto.band = lead.band ?? null;
  if (lead.confidence !== undefined) dto.confidence = lead.confidence;
  …
}
```

> **`scoreVersion` decide si hubo emisión.** Sin él no viaja ningún campo de Score: es la diferencia entre *«no se evaluó»* y *«se evaluó y dio null»*.
>
> **`?? null` solo en `band`**, porque una emisión real puede dar banda nula. **Ausente y nula no son lo mismo** *(R-38 · R-45)*.

## 2.2 Tarea 2 — Vista de oportunidad

| # | Cambio | Detalle |
| :-: | --- | --- |
| **2.1** | **`ScoreBreakdown` extraído** a `src/shared/components/` | **Sin cambiar una línea de su comportamiento** |
| **2.2** | `LeadLibrary.tsx` usa el componente extraído | **55 líneas retiradas**, sustituidas por un import |
| **2.3** | `Prospect` y `prospectMapper` transportan los campos | **Sin inventar** — `band: null` se conserva como `null` |
| **2.4** | **Bloque *Opportunity Intelligence*** en `LeadCard` | Banda · confianza · **% de factores medidos** · desglose desplegable · versión del Perfil |

### Por qué extraer y no copiar

> **El componente ya existía y funcionaba en la Biblioteca.** Copiarlo habría creado **dos desgloses que divergirían**. La restricción del encargo —*«no duplicar lógica existente»*— obliga a extraer.
>
> **Efecto colateral bueno:** la Biblioteca y la búsqueda **no pueden divergir** en cómo explican el Score.

---

# 3. Archivos modificados — 9

## Backend — 4

| Archivo | Cambio |
| --- | --- |
| `server/shared/contracts/opportunityScore.ts` | 🆕 **Nuevo** |
| `server/shared/contracts/leadLibrary.ts` | Reexporta el tipo movido |
| `server/shared/contracts/prospectSearch.ts` | **+6 campos opcionales** |
| `server/shared/mappers/leadResponseMapper.ts` | Declara y mapea |

## Frontend — 5

| Archivo | Cambio |
| --- | --- |
| `src/shared/components/ScoreBreakdown.tsx` | 🆕 **Extraído** |
| `src/shared/types/index.ts` | **+`ScoreBreakdownEntry`**, +6 campos |
| `src/modules/lead-hunter/domain/prospectMapper.ts` | Transporta sin inventar |
| `src/modules/lead-hunter/presentation/components/LeadCard.tsx` | Vista de oportunidad |
| `src/modules/lead-hunter/presentation/LeadLibrary.tsx` | Usa el componente extraído |

---

# 4. Impacto arquitectónico

| Restricción del encargo | Cumplimiento |
| --- | :-: |
| **No tocar `domain/`** | ✅ **Intacto** |
| **No tocar `application/`** | ✅ **Intacto** |
| **No tocar `infrastructure/`** | ✅ **Intacto** |
| No modificar reglas de negocio | ✅ **Ninguna** — el Score se calcula igual |
| No crear lógica paralela | ✅ **Se extrajo la existente** |
| No inventar datos | ✅ Ausencia = ausencia |
| No ocultar fallos de IA | ✅ Sin cambios en la transparencia |
| Origen real de lo mostrado | ✅ **Todo procede de `opportunityScore.ts` del dominio** |

## 4.1 ¿Requiere actualizar el Blueprint?

> ## **No.**

| Documento | Análisis |
| --- | :-: |
| **ADR-06 §10** *(contrato público)* | **Ampliación aditiva** con campos opcionales. **No rompe compatibilidad** y replica una forma ya aprobada en `LeadLibraryItemDTO` |
| **ADR-07 §8** | Frontera respetada: `shared/contracts/` sigue importando solo de sí mismo *(R-15)* |
| **R-18** | ✅ No se importa `shared/persistence/contracts/` |
| **R-14** | ✅ El DTO no deriva de ninguna entidad interna |

**Ninguna decisión de arquitectura cambia. No se detectó contradicción.**

---

# 5. Validaciones

**Ejecutadas tras cada tarea, no solo al final.**

| Hito | `lint` | `tsc` | `test` |
| --- | :-: | :-: | :-: |
| Tras Tarea 1 *(backend)* | ✅ | ✅ | ✅ **197** |
| Tras extracción del componente | — | ✅ | — |
| **Final** | ✅ | ✅ | ✅ **197 · 26 ficheros** |

**Pruebas antes → después: 197 → 197. Cero modificadas.**

> **Dos errores de compilación detectados y corregidos en el proceso:** import faltante de `ScoreBreakdownEntryDTO` en el mapper, y un `</div>` huérfano al insertar el bloque en `LeadCard` *(TS1005)*.

---

# 6. Riesgos

| # | Riesgo | Sev. | Estado |
| :-: | --- | :-: | --- |
| **1** | **Nada de esto se ha visto funcionando.** Sin credenciales, verificado por `tsc` y lectura | 🔴 **Alta** | **H-03-F1 §4.5** |
| **2** | **`breakdown` se transporta sin validar su forma** — `Array.isArray` y confianza en el contrato | 🟡 Media | Aceptable: el servidor es propio |
| **3** | **La tarjeta puede saturarse** con el bloque nuevo | 🟢 Baja | **Mitigado**: desglose cerrado por defecto |
| **4** | **La extracción pudo alterar la Biblioteca** | 🟢 Baja | Movido **verbatim**; `tsc` limpio |
| **5** | **Cero pruebas de frontend** | 🟡 Media | Deuda conocida |

---

# 7. ⏸️ Fases 3-5 — detenidas, y por qué

## 7.1 Fase 3 — AI Transparency por lead

**El nivel agregado ya está hecho** *(H-02B y H-02D)*: la búsqueda declara *«Analizado con IA»* / *«Análisis sin IA»*, y el pitch declara sus tres orígenes.

> ### ⚠️ **Lo que falta es la granularidad por lead, y exige un campo que NO está en la lista aprobada.**
>
> La Tarea 1 autorizó exactamente siete campos: `score`, `band`, `confidence`, `scoreBreakdown`, `scoreCoverage`, `calculatedAt`, `scoreVersion`. **`usedFallbackAnalysis` no está entre ellos.**
>
> El dato **existe por lead** *(`analyzeProspects.ts:236,272`)* y `leadResponseMapper` **lo retiene deliberadamente**, documentándolo como decisión.

**Requiere autorización explícita para un octavo campo.**

## 7.2 Fase 4 — AI Showcase Panel

**El encargo indica la fuente correcta:** *«executionReport.ts existente. No recalcular.»* ✅

> ### ⚠️ **Pero el reporte no cruza HTTP.** Hoy solo se imprime con `printExecutionReport()`.
>
> Publicarlo exige **ampliar `SearchResponseMetadata`** — otro contrato público, no incluido en la lista de la Tarea 1.

**A favor:** el propio contrato se declara *«contenedor extensible para señales futuras»* *(`prospectSearch.ts:41-45`)*, de modo que la ampliación **es su propósito declarado**.

**Requiere autorización explícita.**

## 7.3 Fase 5 — Cloud

**Sin dependencias.** Puede ejecutarse en cuanto se autorice — no toca código de aplicación.

---

# 8. Próximo paso recomendado

| # | Acción | Requiere |
| :-: | --- | :-: |
| **1** | **Autorizar `SearchResponseMetadata` + reporte de ejecución** *(Fase 4)* | ✅ **Decisión** |
| **2** | **Autorizar `usedFallbackAnalysis` por lead** *(Fase 3)* | ✅ **Decisión** |
| **3** | **Fase 5 — `Dockerfile` + Cloud Run** | ⚠️ Confirmar |
| **4** | **Ejecutar con credenciales** y ver el desglose con datos reales | 🔴 **Credenciales** |

> ### **El paso 4 es el más valioso.** Todo lo implementado hoy **está verificado por el compilador, no por los ojos**. Una sola búsqueda real confirmaría de golpe las Fases 1 y 2.

---

# 9. Referencias

**Nuevos:** `server/shared/contracts/opportunityScore.ts` · `src/shared/components/ScoreBreakdown.tsx`

**Modificados:** `server/shared/contracts/{leadLibrary,prospectSearch}.ts` · `server/shared/mappers/leadResponseMapper.ts` · `src/shared/types/index.ts` · `src/modules/lead-hunter/domain/prospectMapper.ts` · `src/modules/lead-hunter/presentation/{LeadLibrary.tsx,components/LeadCard.tsx}`

**Origen del dato, sin modificar:** `server/modules/lead-analyzer/domain/opportunityScore.ts:60-115` · `server/modules/lead-analyzer/application/analyzeProspects.ts:221-229,262-267`

**Normativa:** **R-14** · **R-15** · **R-18** · **R-38** · **R-45** · **R-48** · APS-08 §6, §8, §9, §11 · ADR-06 §10 · ADR-07 §8 · ADR-14 §6.3, R-VIN
