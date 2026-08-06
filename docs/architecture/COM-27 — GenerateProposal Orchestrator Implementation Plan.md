# COM-27 — Plan de Implementación del Orchestrator de `GenerateProposal`

| Campo | Valor |
| --- | --- |
| Código | COM-27 |
| Clasificación | **Plan de implementación** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Diseña. No implementa** — el código espera aprobación de este documento |
| Fecha | 2026-08-04 |
| Motivo | Sprint 27 |
| Relacionado | **COM-26** *(las decisiones)* · COM-25 · COM-24 · COM-09 §4.2 · COM-07 §2.2 |

> ### ⚠️ **SUPERSEDED BY COM-31 — parcialmente**
>
> **§3, fila «Use cases» · §7.3, segunda fila.** Fijaban que `GenerateProposal` se recibiría **inyectado directamente**, con *«asimetría con sus dos hermanos»* como **consecuencia aceptada**.
>
> **La consecuencia no era aceptable: infringía R-07 · ADR-04 §7.7** *(COM-30 §2.1)*. **COM-31 la corrigió** y el Orchestrator quedó con **dos dependencias**: la fachada y el workflow de hechos.
>
> **El resto del plan se ejecutó tal cual**, incluidas la corrección de §7.1 —la evidencia solo procede de `runCommercialFacts`— y la forma de §5.2 para la ausencia de secuencia.

> **Cero cambios de código.** `lint` limpio, `tsc --noEmit` limpio, **175 pruebas en verde**.
>
> ⚠️ **§7 contiene tres puntos que deben resolverse antes de escribir la primera línea.** Uno de ellos —§7.1— **incumpliría RE-1 si se implementara tal como está redactado**.

---

# 1. Auditoría del patrón existente

## 1.1 Ubicación

> **`server/orchestrators/`**, fuera de los módulos. Los seis existentes están ahí, y el Composition Root los construye.

**R-11** — *«Todo workflow pasa por un Orchestrator»* · **ADR-04 §7.6** — ningún agente conoce a otro.

## 1.2 Patrón, verificado en los cuatro comerciales

| Pieza | Convención | Ejemplos |
| --- | --- | --- |
| **Fichero** | `<dominio><Cosa>Orchestrator.ts` | `commercialSequenceOrchestrator.ts` · `commercialFactsOrchestrator.ts` |
| **Dependencias** | `interface <Nombre>Dependencies` | `CommercialSequenceDependencies` |
| **Tipo del workflow** | `type Run<Nombre>Fn` | `RunCommercialSequenceFn` · `RunCommercialFactsFn` |
| **Fábrica** | `export function create<Nombre>(deps)` | `createCommercialSequence` |
| **Función devuelta** | `async function run<Nombre>(…)` | `runCommercialSequence` |
| **Imports** | Solo `presentation/` y `application/` | Los cuatro, salvo `commercialFactsOrchestrator` *(§1.4)* |

## 1.3 Nombres que este plan adopta

```text
fichero      orchestrators/commercialProposalOrchestrator.ts
deps         CommercialProposalDependencies
tipo         RunCommercialProposalFn
fábrica      createCommercialProposal
función      runCommercialProposal
```

**Ninguno inventa vocabulario:** `Proposal` es el nombre canónico de ADR-16 §4.4, y `Pitch`, `Mensaje`, `Copy` y `Outreach` son sinónimos **prohibidos** *(DDD-01 §8)*.

## 1.4 Qué se imita y qué no

| Orchestrator | Qué aporta como modelo |
| --- | --- |
| **`commercialSequenceOrchestrator`** | ✅ **El modelo principal**: recibe la Agent API, delega y **devuelve el `Result` sin traducir** |
| **`commercialFactsOrchestrator`** | ✅ Invocación en paralelo con `Promise.all` · composición de un DTO de entrada · *«traducción de campos, no interpretación»* |
| | ⛔ **No se imita su import de `domain/`**: aquí no hace falta *(COM-26 §4.3)* |
| **`pitchOutreachOrchestrator`** | ⛔ Flujo heredado (F-1) |

---

# 2. Responsabilidad

## 2.1 Qué hace

1. **Reúne** las tres fuentes que el caso de uso **no puede buscar** *(ADR-15 §12)*.
2. **Copia** lo recibido en `GenerateProposalInput` y **compone el sobre de evidencia**.
3. **Invoca** `GenerateProposal` y **devuelve su resultado tal cual** *(AL-12: ya es unión discriminada; no hay nada que traducir)*.

## 2.2 Qué NO hace

**No decide la estrategia** · **no interpreta el diagnóstico** · **no clasifica ni modifica hechos** · **no genera texto** · **no construye prompts** · **no valida canales** · **no calcula scoring** · **no crea diagnósticos** · **no valida reglas de negocio** · **no modifica entidades**.

**No importa** persistencia · adapters · `infrastructure/` · HTTP · DTO públicos · mappers. **No consulta repositorios** *(R-24)*. **No lee Lead Hunter ni Lead Analyzer** *(ADR-04 §7.6)*.

> **La prueba de que no decide es que no puede:** todo lo que recibe llega **ya recortado**, y **no importa nada capaz de decidir**.

---

# 3. Dependencias — lista exacta

| Categoría | Dependencia | Cómo llega |
| --- | --- | --- |
| **Repositories** | **Ninguno** | R-24 |
| **Adapters** | **Ninguno** | Se construyen en el Composition Root *(ADR-17 §9.1)* |
| **Readers** | `readReducedDiagnosis` · `readReducedSequence` | ⚠️ **A través de `PitchGeneratorAgentApi`** — §7.2 |
| **Agent APIs** | **`PitchGeneratorAgentApi`** | Inyectada. **Único agente que coordina** |
| **Workflows** | **`RunCommercialFactsFn`** | Inyectado *(COM-26 §3.3)*. **Primera dependencia workflow → workflow** |
| **Use cases** | **`GenerateProposalFn`** | ⚠️ Inyectado directamente — §7.3 |

**Imports previstos: dos ficheros.**

```text
modules/pitch-generator/presentation/pitchGeneratorAgent   → PitchGeneratorAgentApi
modules/pitch-generator/application/generateProposal       → GenerateProposalInput · Result · Fn
orchestrators/commercialFactsOrchestrator                  → RunCommercialFactsFn
```

**Ningún import de `domain/`**: los valores llegan de la Agent API y **se copian**; TypeScript los infiere *(COM-26 §4.3)*.

---

# 4. Flujo

```text
  Request { lead }
        │
        ▼
  ┌─ ORCHESTRATOR ────────────────────────────────────────────────┐
  │                                                               │
  │  1. En paralelo, porque son independientes:                   │
  │        agent.readReducedSequence(lead)                        │
  │        agent.readReducedDiagnosis(lead)                       │
  │        runCommercialFacts(lead)                               │
  │                                                               │
  │  2. Sin secuencia → §5.2. No se invoca el caso de uso         │
  │                                                               │
  │  3. Construye GenerateProposalInput:                          │
  │        lead      ← copia                                      │
  │        sequence  ← copia                                      │
  │        diagnosis ← copia            (§5.1)                    │
  │        evidence  ← { lead, facts }  ← única derivación        │
  │                                                               │
  │  4. generateProposal(input)                                   │
  │                                                               │
  │  5. Devuelve el Result **sin traducir**                       │
  └───────────────────────────────────────────────────────────────┘
        │
        ▼
  GenerateProposalResult   ·   cinco ramas de COM-09 §4.2
```

**El paso 2 es el único condicional**, y **no es una regla de negocio**: comprueba que el contacto al que la petición se refiere **existe**.

---

# 5. Manejo de la ausencia

## 5.1 Diagnóstico ausente

**COM-09 §7 ya decidió que es una rama del resultado: `diagnosis_missing`.** El caso de uso la implementa y la comprueba una prueba.

⚠️ **Pero el tipo la contradice**, y la ratificación del sprint **prohíbe corregirlo**: `GenerateProposalInput.diagnosis` es **obligatorio** y `readReducedDiagnosis` devuelve **`ReducedDiagnosis | null`**.

**Sin opcionalidad, la única forma de alcanzar la rama es forzar el tipo** — pasar el `null` con un `as`. **Este plan no lo hace**: mentirle al compilador para llegar a un camino que el tipo declara imposible es deuda, no implementación. **§7.2 recoge las dos salidas coherentes.**

## 5.2 Secuencia ausente

**Decisión ratificada B, y su fundamento es objetivo:**

> **Sin secuencia no hay `moment`; sin `moment` no hay identidad de emisión.** **ADR-16 §4.4** define la identidad de `Proposal` como `(Lead, momento, número de emisión)`.

**La petición no designa ningún contacto**, de modo que **no hay nada que emitir ni desenlace que devolver**.

**Forma prevista: `InputError` de la taxonomía aprobada** —APS-03 §12, *«los datos recibidos no permiten ejecutar la operación… es responsabilidad de quien invoca»*—, con el precedente exacto de `MissingCriteriaVersionError`.

**Y lo confirma una regla de producto:** **CS-I4 · RC-7** — ningún momento se emite **sin acción del usuario para ese contacto concreto**. Si el usuario actúa sobre un contacto, **la secuencia existe por construcción**; una petición sin ella **solo puede venir de un cliente mal construido**.

> ⚠️ **La ratificación dice «devolver la salida de ausencia correspondiente» y «no crear estados nuevos».** **Ninguna de las cinco ramas de COM-09 §4.2 representa «sin secuencia»**, y crear una sexta está prohibido: **lanzar es la única forma que no inventa un estado.** Confirmación pedida en §7.3.

---

# 6. Pruebas previstas

**Solo del Orchestrator.** No se prueban los algoritmos que coordina.

| # | Qué comprueba |
| :-: | --- |
| **1** | **Orden y paralelismo**: las tres fuentes se piden, y ninguna espera a otra |
| **2** | **Copia, no interpretación**: lo entregado al caso de uso es **la misma referencia** que devolvió cada fuente *(identidad, no equivalencia)* |
| **3** | **El sobre de evidencia** lleva el `lead` de la petición y **exactamente** los hechos recibidos |
| **4** | **Sin secuencia**: no se invoca `GenerateProposal` **en absoluto** |
| **5** | **El `Result` se devuelve sin traducir**: la misma referencia, las cinco ramas |
| **6** | **No toca nada más**: un `Proxy` sobre las dependencias que lanza ante cualquier acceso no aprobado |
| **7** | **Ningún import prohibido**, comprobado sobre el fichero |

---

# 7. ⚠️ Puntos a resolver antes de escribir código

**La regla final del sprint ordena detenerse ante una decisión que cambie contratos o comportamiento comercial. Estos tres lo hacen.**

## 7.1 🔴 La derivación de `evidence`, tal como está redactada, incumple RE-1

**La ratificación §3 dice:**

```text
CommercialFacts + ReducedDiagnosis  →  AffirmableFactRecord[]
```

**Hay dos problemas, y el primero es grave:**

| # | Problema | Regla |
| :-: | --- | --- |
| **1** | **Sumar el diagnóstico a los hechos afirmables abre una segunda vía hacia la lista cerrada** | **COM-07 §2.2** excluyó los indicios exactamente por esto: *«una lista con dos orígenes deja de ser cerrada de forma verificable»* **(RE-1)**. Es la fuga que toda la serie COM-04…COM-07 existe para cerrar |
| **2** | **`AffirmableFactRecord` es el tipo de la frontera de persistencia** *(COM-21 §3.1)* | El Orchestrator **no puede importar persistencia** —su propia lista de restricciones lo prohíbe—, y la entrada del caso de uso espera **`AffirmableEvidence`**, cuyo `facts` es `ClosedFactList` **de dominio** |

**Además, el diagnóstico reducido no contiene nada que pudiera ser un hecho afirmable**: son variables con su clase de conocimiento y una confianza declarada. **Lo inferido nunca se afirma** *(RE-2)*.

> ### **Derivación correcta, y es la única:**
> ```text
> evidence ← { lead, facts: runCommercialFacts(lead) }
> ```
> **El `lead` de la petición y los hechos que el workflow ya produce.** Es lo que COM-26 §5.3 diseñó y lo único que no toca la Regla de Evidencia.

**No se implementa la versión ratificada. Se pide corregir §3 antes de escribir código.**

## 7.2 🟡 La decisión 2 se contradice consigo misma

> *«Aplicar decisión A acotada… usar la rama ya existente de COM-09… **No convertir diagnosis en opcional**.»*

**«A acotada» era precisamente hacerlo opcional** *(COM-26 §2.4)*. Prohibirlo deja la rama alcanzable **solo forzando el tipo**.

| Salida | Coste |
| --- | --- |
| **A real** — `diagnosis?: ReducedDiagnosis` | Un campo del contrato de `application/`. **La rama pasa a ser alcanzable sin trucos** |
| **B también para el diagnóstico** | Sin tocar contratos, pero **`diagnosis_missing` queda como código muerto**: una rama implementada y probada que nada puede alcanzar |

**Cualquiera de las dos es implementable. La combinación literal ratificada, no.**

## 7.3 🟡 Dos formas que la ratificación deja sin fijar

| Cuestión | Lectura de este plan | Por qué |
| --- | --- | --- |
| **Sin secuencia: ¿se lanza o se devuelve?** | **Se lanza `InputError`** | Ninguna rama existente lo representa y crear una está prohibido *(§5.2)* |
| **¿Cómo se invoca `GenerateProposal`?** | **Inyectado como `GenerateProposalFn`** | La decisión 4 lo lista como dependencia coordinable. **Consecuencia aceptada: asimetría con sus dos hermanos**, que llaman al caso de uso a través de la Agent API — y `GenerateProposal` **sigue sin exponerse** porque con B-1 siempre falla *(COM-24 §3.4)* |

---

# 8. Riesgos

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **§7.1 — la derivación ratificada incumple RE-1** | 🔴 **Bloquea** |
| **2** | **§7.2 — la decisión 2 no es implementable como está** | 🟡 **Bloquea** |
| **3** | **B-1 abierto: `GenerateProposal` no puede emitir.** El Orchestrator quedará **completo y siempre fallará al llegar a la estrategia** — `selectStrategy` lanza | 🔴 |
| **4** | **Un Orchestrator que nunca completa su flujo es difícil de probar de extremo a extremo.** Las pruebas de §6 lo cubren **con dobles**, que es lo correcto, pero **no habrá ninguna prueba de integración real hasta que `SP-01` se publique** | 🟡 |
| **5** | **Seis piezas construidas sin consumidor** — `runCommercialFacts`, `generateProposal`, las dos lecturas, el adapter de redacción y, tras este sprint, el propio Orchestrator: **no habrá ruta que lo invoque** | 🟡 |
| **6** | **La dependencia workflow → workflow** sigue sin enunciado en ningún ADR *(COM-26 §3.3)* | 🟡 |
| **7** | **COM-07 §6 sigue sin anotar**, y §7.2 podría añadirle una cuarta corrección | 🟢 |

**Bloqueos de gobernanza — sin cambios y sin tocar:** **B-1**, **B-2**, **CH-01/02/03**, **`COM-12 RC-4`**, **COM-16 §8.1 y §8.2**, **F-1**.

---

# 9. Qué se implementará tras la aprobación

| # | Artefacto | Condición |
| :-: | --- | --- |
| **1** | `orchestrators/commercialProposalOrchestrator.ts` | **§7.1 corregido** y **§7.2 resuelto** |
| **2** | `orchestrators/commercialProposalOrchestrator.test.ts` | Las siete comprobaciones de §6 |
| **3** | **Cableado en el Composition Root** | Construir el workflow. **Sin ruta y sin handler**: no hay endpoint en este alcance |

**Nada más. Ni ruta, ni DTO público, ni mapper, ni exposición en la Agent API.**

---

# 10. Referencias

**ADR-04** §7.6 · **ADR-15** §12, RA-R1 · **ADR-16** §4.4, §7, RC-3, RC-7, CS-I4 · **ADR-17** §9.1, AL-12, AL-16 · **APS-03** §12 · **APS-18** RE-1, RE-2 · **DDD-01** §8 · **DEV-00** R-08, R-09, R-10, R-11, R-24, R-62 · **COM-07** §2.2, §6 · **COM-09** §4.2, §7 · **COM-21** §3.1 · **COM-24** §3.4 · **COM-25** · **COM-26**.
