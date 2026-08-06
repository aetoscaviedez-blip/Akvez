# COM-41 — Auditoría de Migración de Agent Factories

| Campo | Valor |
| --- | --- |
| Código | COM-41 / B |
| Clasificación | **Auditoría técnica previa a migración** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟢 **Auditoría cerrada. Autoriza la migración de §5** |
| Fecha | 2026-08-04 |
| Objeto | `createLeadHunterAgent` · `createLeadAnalyzerAgent` |
| Norma | **ADR-19 v1.0 §5.1 (D-1)**, autorizada por **§9.2** |
| Antecedentes | COM-40/4 · COM-40/5 · COM-33 §3 *(precedente ejecutado)* |

> **Auditoría redactada ANTES de tocar código**, conforme al sprint.

---

# 1. Firma actual de cada factory

## 1.1 `createLeadHunterAgent` — `lead-hunter/presentation/LeadHunterAgent.ts:45-48`

```ts
export function createLeadHunterAgent(
  discoverProspects: DiscoverProspectsFn,
  listLeadLibrary: ListLeadLibraryFn
): LeadHunterAgentApi
```

## 1.2 `createLeadAnalyzerAgent` — `lead-analyzer/presentation/LeadAnalyzerAgent.ts:41-44`

```ts
export function createLeadAnalyzerAgent(
  analyzeProspects: AnalyzeProspectsFn,
  listLeadScores: ListLeadScoresFn
): LeadAnalyzerAgentApi
```

**Ambas: posicionales, dos parámetros.**

---

# 2. Dependencias recibidas

| Factory | Dependencia | Tipo | Fichero |
| --- | --- | --- | --- |
| **LeadHunter** | `discoverProspects` | `DiscoverProspectsFn` — `(industry, location, excludeNames) => Promise<…>` | `lead-hunter/application/discoverProspects.ts:45` |
| | `listLeadLibrary` | `ListLeadLibraryFn` — `() => Promise<…>` | `lead-hunter/application/listLeadLibrary.ts:62` |
| **LeadAnalyzer** | `analyzeProspects` | `AnalyzeProspectsFn` — `(deduplicatedLeads, industry, location, designerStyle) => Promise<…>` | `lead-analyzer/application/analyzeProspects.ts:48` |
| | `listLeadScores` | `ListLeadScoresFn` — `() => Promise<…>` | `lead-analyzer/application/listLeadScores.ts:66` |

> **Los cuatro tipos son funciones de caso de uso del propio módulo.** Cumplen la naturaleza que ADR-19 D-1 exige de los campos de `<Agente>AgentDeps`.

---

# 3. Composition Root

**Únicos puntos de llamada del repositorio:**

```
bootstrap/compositionRoot.ts:123  const leadHunterAgent   = createLeadHunterAgent(discoverProspects, listLeadLibrary);
bootstrap/compositionRoot.ts:124  const leadAnalyzerAgent = createLeadAnalyzerAgent(analyzeProspects, listLeadScores);
```

**Las cuatro dependencias se construyen antes, en el mismo fichero:**

| Variable | Línea | Construida por |
| --- | :-: | --- |
| `discoverProspects` | 110 | `createDiscoverProspects({ leadRepository, prospectDiscovery })` |
| `listLeadLibrary` | 118 | `createListLeadLibrary({ leadRepository })` |
| `analyzeProspects` | 111 | `createAnalyzeProspects({ leadAnalysisRepository, leadAnalysis })` |
| `listLeadScores` | 121 | `createListLeadScores({ leadAnalysisRepository })` |

> **Los nombres de variable coinciden con los nombres de campo propuestos**, de modo que la migración admite la forma abreviada `{ discoverProspects, listLeadLibrary }` sin renombrar nada.

---

# 4. Tests relacionados

## 4.1 🟢 Ninguna prueba invoca estas factorías

**Búsqueda exhaustiva sobre `server/`: cero resultados** para `createLeadHunterAgent` y `createLeadAnalyzerAgent` fuera de su declaración y del Composition Root.

## 4.2 Pruebas que usan estos agentes — por **tipo**, no por factoría

| Fichero | Uso | ¿Afectado? |
| --- | --- | :-: |
| `commercialFactsOrchestrator.test.ts:12` | `function hunterWith(leads): LeadHunterAgentApi` — **objeto literal** | ❌ **No** |
| `commercialFactsOrchestrator.test.ts:19` | `function analyzerWith(scores): LeadAnalyzerAgentApi` — **objeto literal** | ❌ **No** |

## 4.3 Pruebas que verifican el grafo construido

| Fichero | Qué verifica | ¿Cubre la migración? |
| --- | --- | :-: |
| `compositionRoot.test.ts` — 8 pruebas | *«construye el grafo completo sin fallar»* · *«cada arranque produce su propio grafo»* · *«construir no invoca a nadie»* | ✅ **Sí, indirectamente** |
| Suites de rutas e integración | Recorren el grafo real | ✅ **Sí** |

> **La migración se verifica por 197 pruebas existentes que NO se modifican.** Es el criterio más fuerte de equivalencia de comportamiento.

---

# 5. Qué cambia y qué no

## 5.1 Qué cambia

| Elemento | Cambio |
| --- | --- |
| `LeadHunterAgent.ts` | **+`LeadHunterAgentDeps`**, firma desestructurada |
| `LeadAnalyzerAgent.ts` | **+`LeadAnalyzerAgentDeps`**, firma desestructurada |
| `compositionRoot.ts` | **2 líneas** — 123 y 124 |

## 5.2 Qué NO cambia

| Elemento | Estado |
| --- | :-: |
| `LeadHunterAgentApi` · `LeadAnalyzerAgentApi` | ✅ **Intactas** |
| Cuerpo de ambas factorías | ✅ **Intacto** |
| `application/`, `domain/`, `infrastructure/` | ✅ **No tocados** |
| Orchestrators | ✅ **No tocados** — reciben el tipo, no la factoría |
| `routes/` | ✅ **No tocadas** |
| `createPitchGeneratorAgent` · `GenerateProposal` | ✅ **No tocados** |
| Pruebas | ✅ **Ninguna modificada** |

---

# 6. Por qué ADR-19 aplica

| Decisión | LeadHunter | LeadAnalyzer |
| --- | :-: | :-: |
| **D-1** — un único parámetro nominal | ❌ **No cumple** | ❌ **No cumple** |
| D-2 · D-3 · D-4 · D-5 · D-6 | ✅ Cumplen | ✅ Cumplen |

**ADR-19 §9.1:** *«Toda Agent API Factory **nueva** debe construirse con objeto de dependencias nombrado, desde el 2026-08-04.»*

**ADR-19 §9.2**, sobre las existentes: *«**Migrar — en sprint separado**… La aprobación de este ADR crea la regla. La migración es un sprint separado y NO forma parte de esta aprobación.»*

> ### **Este sprint es ese sprint separado, y lo autoriza expresamente en su Bloque B.**

## 6.1 ⚠️ Naturaleza de la migración — conformidad, no corrección

**El defecto que fundamenta D-1 —dependencias indistinguibles por tipo— NO existe aquí:**

| Factory | Dep. 1 | Dep. 2 | ¿Cruzarlas compila? |
| --- | :-: | :-: | :-: |
| LeadHunter | 3 argumentos | **0 argumentos** | ❌ **No** |
| LeadAnalyzer | 4 argumentos | **0 argumentos** | ❌ **No** |

> **ADR-19 §9.2 ya lo anticipa:** *«Con dos parámetros, el coste que motivó D-1 no se materializa: la migración es **uniformidad**, no corrección de defecto.»*

---

# 7. Riesgos

| # | Riesgo | Sev. | Mitigación |
| :-: | --- | :-: | --- |
| **1** | Un punto de llamada sin actualizar | 🟢 Baja | **Solo hay 2.** `tsc --noEmit` falla: objeto y posicionales **no son asignables entre sí** |
| **2** | Cambio de comportamiento accidental | 🟢 Baja | El cuerpo **no se toca** |
| **3** | Ruptura de un consumidor | 🟢 Baja | Las **Agent API no cambian** |
| **4** | Pruebas rotas | 🟢 Baja | **Ninguna invoca las factorías** |
| **5** | **Crear abstracción compartida / factory base** | 🟡 Media | **Prohibido por el sprint y no autorizado por ADR-19.** Cada módulo declara su propia `Deps` |
| **6** | **Añadir una prueba no discriminante** | 🟡 Media | §8 |

---

# 8. Estrategia de pruebas — y una limitación que se documenta

## 8.1 No se crean pruebas nuevas

> ### **Una prueba antirregresión de cableado aquí NO puede detectar el error real.**
>
> Las dos pruebas de `pitchGeneratorAgent` *(COM-33 §3.4)* discriminan porque **cuatro de sus seis dependencias eran indistinguibles por tipo** y el cruce **compilaba**.
>
> **Aquí el cruce es un error de compilación** *(§6.1)*. Una prueba de cableado **pasaría siempre** y no podría fallar por el defecto que pretende cubrir: **sugeriría una garantía que no aporta**.

**El sprint lo exige explícitamente —*«Si una prueba no puede detectar el error real, documentarlo»*—, y queda documentado aquí.**

## 8.2 Qué verifica realmente la migración

| # | Verificación | Instrumento |
| :-: | --- | --- |
| **1** | La firma cambió y el wiring la sigue | `npx tsc --noEmit` |
| **2** | **TypeScript detecta la inversión accidental** | ✅ **Ya la detectaba** — aridades distintas *(§6.1)*. La migración **añade además** detección por nombre |
| **3** | Comportamiento idéntico | **197 pruebas sin modificar** |
| **4** | El grafo se construye | `compositionRoot.test.ts` |

## 8.3 Verificación de discriminación

> **Revertir temporalmente una llamada del Composition Root a la forma posicional debe producir error de compilación.** Si compilase, la migración no habría surtido efecto.
>
> *(Mismo método aplicado en COM-33 §2.3 y §3.4.)*

---

# 9. Autorización

| Comprobación | Resultado |
| --- | :-: |
| ¿ADR-19 está `Approved`? | ✅ **Sí** — 2026-08-04 |
| ¿ADR-19 autoriza la migración en sprint separado? | ✅ **Sí** — §9.2 |
| ¿El sprint la incluye en su alcance? | ✅ **Sí** — Bloque B |
| ¿Requiere aprobación documental adicional? | ❌ **No** |
| ¿El conflicto de numeración de COM-40/3 la bloquea? | ❌ **No** — afecta al **registro** de ADR-19, no a la vigencia de D-1 |

> ### ✅ **La migración está autorizada. Se ejecuta en este sprint.**

---

# 10. Referencias

**ADR-09 v1.3** §5.1, §5.2, §5.3, §6 · **ADR-19 v1.0** §5.1 *(D-1)*, §5.2 a §5.6, §9.1, §9.2 · **DEV-00** §5.1, §6.1, R-07, R-23, R-54, R-55 · **COM-33** §2.3, §3, §3.4 · **COM-40/3** §1 · **COM-40/4** · **COM-40/5**.
