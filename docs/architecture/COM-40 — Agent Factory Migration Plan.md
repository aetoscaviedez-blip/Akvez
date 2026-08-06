# COM-40 — Plan Técnico de Migración de Factorías

| Campo | Valor |
| --- | --- |
| Código | COM-40 / 5 |
| Clasificación | **Plan técnico** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Plan redactado. NO ejecutado** — requiere aprobación |
| Fecha | 2026-08-04 |
| Alcance | `createLeadHunterAgent` · `createLeadAnalyzerAgent` |
| Norma | **ADR-19 v1.0 §5.1 (D-1)** · autorizado por **§9.2** |
| Antecedentes | **COM-40/4** *(la auditoría)* · COM-33 §3 *(precedente ejecutado)* |

> **Cero cambios de código. Ninguna factoría migrada.**

---

# 1. Resumen del plan

| Métrica | Valor |
| --- | :-: |
| Factorías a migrar | **2** |
| Ficheros a modificar | **3** |
| Líneas de wiring a cambiar | **2** |
| Ficheros de prueba a modificar | **0** |
| Interfaces públicas afectadas | **0** |
| Cambios de comportamiento | **0** |
| Pruebas esperadas tras la migración | **197** *(iguales)* |

---

# 2. `createLeadHunterAgent`

## 2.1 Estado actual

**`server/modules/lead-hunter/presentation/LeadHunterAgent.ts:45-48`**

```ts
export function createLeadHunterAgent(
  discoverProspects: DiscoverProspectsFn,
  listLeadLibrary: ListLeadLibraryFn
): LeadHunterAgentApi {
```

## 2.2 Cambio requerido

```ts
/**
 * Los dos casos de uso que esta fachada transporta, **con nombre** — ADR-19 §5.1 (D-1).
 *
 * Ninguna es opcional ni tiene valor por defecto: un valor por defecto sería
 * construir dentro de `presentation/`, competencia exclusiva del Composition
 * Root (ADR-09 §5.3 · R-55 · ADR-19 §5.2).
 */
export interface LeadHunterAgentDeps {
  discoverProspects: DiscoverProspectsFn;
  listLeadLibrary: ListLeadLibraryFn;
}

export function createLeadHunterAgent({
  discoverProspects,
  listLeadLibrary
}: LeadHunterAgentDeps): LeadHunterAgentApi {
```

**El cuerpo de la función no cambia.** `LeadHunterAgentApi` **no cambia**.

## 2.3 Archivos afectados

| Fichero | Cambio |
| --- | --- |
| `modules/lead-hunter/presentation/LeadHunterAgent.ts` | +interfaz `LeadHunterAgentDeps`, firma desestructurada |
| `bootstrap/compositionRoot.ts:123` | `createLeadHunterAgent({ discoverProspects, listLeadLibrary })` |

---

# 3. `createLeadAnalyzerAgent`

## 3.1 Estado actual

**`server/modules/lead-analyzer/presentation/LeadAnalyzerAgent.ts:41-44`**

```ts
export function createLeadAnalyzerAgent(
  analyzeProspects: AnalyzeProspectsFn,
  listLeadScores: ListLeadScoresFn
): LeadAnalyzerAgentApi {
```

## 3.2 Cambio requerido

```ts
export interface LeadAnalyzerAgentDeps {
  analyzeProspects: AnalyzeProspectsFn;
  listLeadScores: ListLeadScoresFn;
}

export function createLeadAnalyzerAgent({
  analyzeProspects,
  listLeadScores
}: LeadAnalyzerAgentDeps): LeadAnalyzerAgentApi {
```

**El cuerpo no cambia.** `LeadAnalyzerAgentApi` **no cambia**.

## 3.3 Archivos afectados

| Fichero | Cambio |
| --- | --- |
| `modules/lead-analyzer/presentation/LeadAnalyzerAgent.ts` | +interfaz `LeadAnalyzerAgentDeps`, firma desestructurada |
| `bootstrap/compositionRoot.ts:124` | `createLeadAnalyzerAgent({ analyzeProspects, listLeadScores })` |

---

# 4. Riesgos

| # | Riesgo | Sev. | Mitigación |
| :-: | --- | :-: | --- |
| **1** | **Un punto de llamada sin actualizar** | 🟢 **Baja** | **Solo hay 2, ambos en el Composition Root.** `tsc --noEmit` falla si se olvida uno: el objeto y los posicionales **no son asignables entre sí** |
| **2** | **Cambio de comportamiento accidental** | 🟢 **Baja** | El cuerpo de ambas funciones **no se toca**. Solo cambia la desestructuración del parámetro |
| **3** | **Ruptura de un consumidor** | 🟢 **Baja** | `LeadHunterAgentApi` y `LeadAnalyzerAgentApi` **no cambian**. Los Orchestrators reciben el tipo, no la factoría |
| **4** | **Pruebas rotas** | 🟢 **Baja** | **Ninguna prueba invoca estas factorías** *(COM-40/4 §5.3)* |
| **5** | ⚠️ **Migrar antes de resolver el registro de ADR-19** | 🟡 **Media** | **COM-40/3 §1**: el número de ADR-19 no está confirmado. **La regla D-1 es vinculante igualmente**; el conflicto es de catalogación, no de contenido |
| **6** | ⚠️ **Añadir una prueba antirregresión poco discriminante**, por copiar el patrón de COM-33 sin pensarlo | 🟡 Media | §5 |

> **Cinco de los seis riesgos son 🟢 bajos.** Es la migración de menor riesgo del proyecto hasta la fecha.

---

# 5. Estrategia de pruebas

## 5.1 Qué NO hace falta añadir, y por qué

> ### ⚠️ **NO replicar sin más las dos pruebas antirregresión de `pitchGeneratorAgent`.**
>
> Aquellas discriminan porque **cuatro de las seis dependencias eran indistinguibles por tipo** y el cruce **compilaba**. **Aquí no:**
>
> | Factoría | Dep. 1 | Dep. 2 | Cruce |
> | --- | :-: | :-: | :-: |
> | LeadHunter | `(industry, location, excludeNames)` — 3 args | `()` — 0 args | ❌ **No compila** |
> | LeadAnalyzer | `(deduplicatedLeads, industry, location, …)` — 4 args | `()` — 0 args | ❌ **No compila** |
>
> **El compilador ya es la prueba.** Una prueba de cableado aquí **pasaría siempre** y no podría fallar por el defecto que pretende cubrir: sería **una prueba no discriminante**, que es peor que ninguna — sugiere una garantía que no aporta.

## 5.2 Qué sí verifica la migración

| # | Verificación | Cómo |
| :-: | --- | --- |
| **1** | **La firma cambió y el wiring la sigue** | `npx tsc --noEmit` — falla si un punto de llamada quedó posicional |
| **2** | **El comportamiento es idéntico** | **197 pruebas existentes**, sin modificar ninguna |
| **3** | **El grafo se construye** | `compositionRoot.test.ts` — 8 pruebas, incluida *«construye el grafo completo sin fallar»* |
| **4** | **No hay singleton de módulo** | `compositionRoot.test.ts` — *«cada arranque produce su propio grafo»* |

> **Las cuatro ya existen.** La migración **no requiere pruebas nuevas**: requiere que las actuales sigan verdes **sin tocarlas**, que es el criterio más fuerte de equivalencia de comportamiento.

## 5.3 Verificación propuesta

| # | Paso | Criterio de aceptación |
| :-: | --- | --- |
| **1** | `npx tsc --noEmit` **antes** | Limpio — línea base |
| **2** | Migrar `LeadHunterAgent.ts` | — |
| **3** | Actualizar `compositionRoot.ts:123` | — |
| **4** | `npx tsc --noEmit` | **Limpio** |
| **5** | `npm test` | **197/197**, sin modificar ninguna prueba |
| **6** | Repetir 2-5 para `LeadAnalyzerAgent` | **197/197** |
| **7** | `npm run lint` final | Limpio |

## 5.4 Verificación de discriminación

> **Comprobar que el cambio importa:** revertir temporalmente **una** llamada del Composition Root a la forma posicional debe producir **error de compilación**. Si compilase, la migración no habría surtido efecto.
>
> *(Es el mismo método aplicado en COM-33 §2.3 y §3.4 para verificar que las pruebas discriminaban.)*

---

# 6. Orden de ejecución recomendado

| # | Acto | Bloquea a |
| :-: | --- | --- |
| **1** | **Aprobar la ejecución de este plan** | Todo |
| **2** | Migrar `LeadHunterAgent` + su línea de wiring · verificar | — |
| **3** | Migrar `LeadAnalyzerAgent` + su línea de wiring · verificar | — |
| **4** | **Descender R-a a R-d a DEV-00 §3** | — |

> **Los pasos 2 y 3 son independientes entre sí** y pueden ejecutarse en cualquier orden, o juntos. **Se recomienda por separado**, con verificación entre medias: aísla cuál de los dos rompería algo, si algo rompiera.

## 6.1 ⚠️ Precondición documental

> **ADR-19 §9.2 autoriza esta migración y la remite a «un sprint separado».** Este plan **es** ese sprint, y **queda a la espera de aprobación de ejecución**.
>
> **El conflicto de numeración de COM-40/3 NO bloquea la migración:** afecta al **registro** de ADR-19 en el catálogo, no a la vigencia de su regla D-1, que está `Approved` desde el 2026-08-04.

---

# 7. Lo que este plan **NO** contempla

- ❌ **Wrappers** de compatibilidad — prohibidos por el sprint y **innecesarios**: solo hay 2 puntos de llamada.
- ❌ **Cambios en `LeadHunterAgentApi` ni `LeadAnalyzerAgentApi`.**
- ❌ **Renombrar agentes** ni operaciones.
- ❌ **Tocar `application/`, `domain/`, `infrastructure/`, `routes/`** ni los Orchestrators.
- ❌ **Rutas HTTP.**
- ❌ **`pitchGeneratorAgent`** — ya conforme.
- ❌ **Pruebas nuevas** — §5.1.

---

# 8. Referencias

**ADR-09 v1.3** §5.1, §5.2, §5.3, §6 · **ADR-19 v1.0** §5.1 *(D-1)*, §5.2, §9.1, §9.2, §13 · **DEV-00** §5.1, §6.1, R-54, R-55, R-57 · **COM-33** §2.3, §3, §3.4 · **COM-39** §8 · **COM-40/3** §1 · **COM-40/4**.
