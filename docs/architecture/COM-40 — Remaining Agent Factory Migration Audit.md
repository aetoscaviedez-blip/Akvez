# COM-40 — Auditoría de las Factorías de Agent API Restantes

| Campo | Valor |
| --- | --- |
| Código | COM-40 / 4 |
| Clasificación | **Auditoría técnica** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Auditoría completa. NADA migrado** |
| Fecha | 2026-08-04 |
| Objeto | `createLeadHunterAgent` · `createLeadAnalyzerAgent` |
| Norma de referencia | **ADR-19 v1.0 §5.1 (D-1)** y **§9.2** |

> **Cero cambios de código.** Ninguna factoría modificada.

---

# 1. Estado actual

## 1.1 `createLeadHunterAgent`

**`server/modules/lead-hunter/presentation/LeadHunterAgent.ts:45-48`**

```ts
export function createLeadHunterAgent(
  discoverProspects: DiscoverProspectsFn,
  listLeadLibrary: ListLeadLibraryFn
): LeadHunterAgentApi
```

| Campo | Valor |
| --- | --- |
| **Forma** | Posicional, **2 parámetros** |
| **Operaciones expuestas** | `execute(request)` · `listLibrary()` |
| **Conforme a ADR-19 D-1** | ❌ **No** |

## 1.2 `createLeadAnalyzerAgent`

**`server/modules/lead-analyzer/presentation/LeadAnalyzerAgent.ts:41-44`**

```ts
export function createLeadAnalyzerAgent(
  analyzeProspects: AnalyzeProspectsFn,
  listLeadScores: ListLeadScoresFn
): LeadAnalyzerAgentApi
```

| Campo | Valor |
| --- | --- |
| **Forma** | Posicional, **2 parámetros** |
| **Operaciones expuestas** | `execute(request)` · `listScores()` |
| **Conforme a ADR-19 D-1** | ❌ **No** |

---

# 2. Diferencias frente a ADR-19

| Decisión | `createLeadHunterAgent` | `createLeadAnalyzerAgent` |
| --- | :-: | :-: |
| **D-1** — un único parámetro nominal | ❌ **No cumple** | ❌ **No cumple** |
| **D-2** — ninguna dependencia opcional | ✅ Cumple | ✅ Cumple |
| **D-3** — no ejecuta trabajo ni valida | ✅ Cumple | ✅ Cumple |
| **D-4** — construida solo por el Composition Root | ✅ Cumple | ✅ Cumple |
| **D-5** — no importa `shared/persistence/` | ✅ Cumple | ✅ Cumple |
| **D-6** — el Orchestrator recibe la Agent API construida | ✅ Cumple | ✅ Cumple |

> ### **La única desviación es D-1, en ambas. Las otras cinco decisiones ya se cumplen.**

---

# 3. 🟢 Hallazgo — el defecto que motivó D-1 **no existe en estas dos**

**ADR-19 §5.1 fundamenta D-1 en que las dependencias de `pitchGeneratorAgent` son *indistinguibles por tipo*: cuatro de seis son `(input) => Promise<Result>`, e intercambiar dos compilaba.**

**En estas dos factorías, las dependencias tienen aridades distintas:**

| Factoría | Dependencia 1 | Dependencia 2 | ¿Intercambiables? |
| --- | --- | --- | :-: |
| **LeadHunter** | `DiscoverProspectsFn` — `(industry, location, excludeNames) => …` **3 args** | `ListLeadLibraryFn` — `() => …` **0 args** | ❌ **No compila** |
| **LeadAnalyzer** | `AnalyzeProspectsFn` — `(deduplicatedLeads, industry, location, …) => …` **4 args** | `ListLeadScoresFn` — `() => …` **0 args** | ❌ **No compila** |

> ### **Intercambiar las dos dependencias de cualquiera de estas factorías es hoy un error de compilación.**
>
> **Consecuencia para la migración:** es **conformidad con la norma**, no corrección de un defecto. **No hay riesgo latente que la migración elimine**, y **ADR-19 §9.2 ya lo anticipa**: *«Con dos parámetros, el coste que motivó D-1 no se materializa: la migración es **uniformidad**, no corrección de defecto.»*

## 3.1 Consecuencia sobre la estrategia de pruebas

> ⚠️ **Una prueba antirregresión de cableado sería aquí mucho menos discriminante que en `pitchGeneratorAgent`**, porque **el compilador ya discrimina**. Se registra en COM-40/5 §5 para que no se copie el patrón sin pensarlo.

---

# 4. Dependencias

## 4.1 Tipos implicados — ninguno cambia

| Tipo | Fichero | ¿Se modifica? |
| --- | --- | :-: |
| `DiscoverProspectsFn` | `lead-hunter/application/discoverProspects.ts:45` | ❌ No |
| `ListLeadLibraryFn` | `lead-hunter/application/listLeadLibrary.ts:62` | ❌ No |
| `AnalyzeProspectsFn` | `lead-analyzer/application/analyzeProspects.ts:48` | ❌ No |
| `ListLeadScoresFn` | `lead-analyzer/application/listLeadScores.ts:66` | ❌ No |
| `LeadHunterAgentApi` · `LeadAnalyzerAgentApi` | Sus respectivos `presentation/` | ❌ **No — la interfaz pública es intacta** |

> **La migración cambia la **firma de construcción**, no el contrato expuesto.** Ningún consumidor de `LeadHunterAgentApi` o `LeadAnalyzerAgentApi` se entera.

## 4.2 Consumidores de las Agent API — ninguno afectado

**Los Orchestrators reciben las Agent API **ya construidas**, por objeto nombrado:**

| Orchestrator | Cómo las recibe | ¿Afectado? |
| --- | --- | :-: |
| `leadAcquisitionOrchestrator` | `{ leadHunterAgent, leadAnalyzerAgent }` | ❌ **No** |
| `leadLibraryOrchestrator` | `{ leadHunterAgent, leadAnalyzerAgent }` | ❌ **No** |
| `commercialFactsOrchestrator` | `{ leadHunterAgent, leadAnalyzerAgent, pitchGeneratorAgent }` | ❌ **No** |

> **Ya cumplen D-6.** Reciben el **tipo** de la Agent API, no la factoría.

---

# 5. Impacto de la migración

## 5.1 Ficheros afectados — **3**

| # | Fichero | Cambio |
| :-: | --- | --- |
| **1** | `modules/lead-hunter/presentation/LeadHunterAgent.ts` | Añadir `LeadHunterAgentDeps`; desestructurar en la firma |
| **2** | `modules/lead-analyzer/presentation/LeadAnalyzerAgent.ts` | Añadir `LeadAnalyzerAgentDeps`; desestructurar en la firma |
| **3** | `bootstrap/compositionRoot.ts` | **2 líneas** — 123 y 124 |

## 5.2 🟢 Puntos de llamada — **2, ambos en el Composition Root**

```
compositionRoot.ts:123  const leadHunterAgent   = createLeadHunterAgent(discoverProspects, listLeadLibrary);
compositionRoot.ts:124  const leadAnalyzerAgent = createLeadAnalyzerAgent(analyzeProspects, listLeadScores);
```

> ### **No existe ningún otro punto de llamada en todo el repositorio.**

## 5.3 🟢 Pruebas afectadas — **NINGUNA**

**Búsqueda exhaustiva sobre `server/`: ningún fichero de prueba invoca `createLeadHunterAgent` ni `createLeadAnalyzerAgent`.**

**Las pruebas que trabajan con estos agentes construyen dobles a mano, tipados con la interfaz:**

| Fichero de prueba | Qué usa | ¿Afectado? |
| --- | --- | :-: |
| `commercialFactsOrchestrator.test.ts:12` | `function hunterWith(leads): LeadHunterAgentApi` — **objeto literal** | ❌ **No** |
| `commercialFactsOrchestrator.test.ts:19` | `function analyzerWith(scores): LeadAnalyzerAgentApi` — **objeto literal** | ❌ **No** |

> ### **Usan el TIPO de la Agent API, nunca la factoría. La migración no los toca.**

## 5.4 Contraste con la migración de `pitchGeneratorAgent`

| | `pitchGeneratorAgent` *(COM-33)* | **Las dos restantes** |
| --- | :-: | :-: |
| Dependencias | **6** | 2 |
| Dependencias indistinguibles por tipo | **4** | **0** |
| Puntos de llamada | **7** *(1 wiring + 6 en pruebas)* | **2** *(solo wiring)* |
| Ficheros de prueba a tocar | **5** | **0** |
| Defecto latente que elimina | **Sí** — cruce silencioso | **No** — el compilador ya lo impide |

> **La migración restante es sustancialmente menor que la ya ejecutada, y de riesgo menor.**

---

# 6. Conclusiones

| # | Conclusión |
| :-: | --- |
| **1** | **Ambas factorías desvían solo en D-1.** Las otras cinco decisiones de ADR-19 ya se cumplen |
| **2** | **El defecto que motivó D-1 no existe aquí**: las dependencias tienen aridades distintas y **el compilador ya impide el cruce** |
| **3** | **3 ficheros, 2 líneas de wiring, 0 pruebas afectadas** |
| **4** | **Ninguna interfaz pública cambia.** Ningún Orchestrator ni ruta se entera |
| **5** | **La migración es conformidad normativa, no corrección de defecto** — como **ADR-19 §9.2** anticipa |
| **6** | ⚠️ **Una prueba antirregresión de cableado sería poco discriminante aquí** — §3.1 |

---

# 7. Estado — **nada migrado**

| Comprobación | Resultado |
| --- | :-: |
| `LeadHunterAgent.ts` modificado | ❌ **No** |
| `LeadAnalyzerAgent.ts` modificado | ❌ **No** |
| `compositionRoot.ts` modificado | ❌ **No** |
| Pruebas modificadas | ❌ **No** |

> **La migración requiere aprobación y un sprint que la incluya en su alcance** *(ADR-19 §9.2)*. **El plan técnico está en COM-40/5.**

---

# 8. Referencias

**ADR-04 v1.3** §7.7 · **ADR-09 v1.3** §5.1, §5.2 · **ADR-19 v1.0** §5.1 *(D-1)*, §5.2 a §5.6, §9.1, §9.2 · **DEV-00** §5.1, R-07, R-23, R-54, R-55 · **COM-33** §3 · **COM-39** §8.
