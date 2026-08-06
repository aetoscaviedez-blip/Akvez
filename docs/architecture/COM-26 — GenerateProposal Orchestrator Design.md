# COM-26 — Diseño del Orchestrator de `GenerateProposal`

| Campo | Valor |
| --- | --- |
| Código | COM-26 |
| Clasificación | **Diseño técnico** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Recomienda. No implementa y no cierra nada de Product Office** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 26 |
| Relacionado | **COM-25** *(las tres decisiones que bloqueaban)* · COM-07 §6 · COM-09 §4.2 · COM-24 |

> ### ⚠️ **SUPERSEDED BY COM-31 — parcialmente**
>
> **§5.2, fila «Use cases» · §5.5 íntegro · §6.1, riesgo 1 · §7, decisión 4.** Sostenían que el compositor debía recibir `GenerateProposalFn` **saltándose la fachada**, que era *«una asimetría con sus dos hermanos»* y que elegir entre las dos salidas **pertenecía al Product Office**.
>
> **No era una asimetría: era una infracción de R-07 · ADR-04 §7.7**, y la decisión era de arquitectura *(COM-30 §2.1-§2.2)*. **COM-31 la corrigió**: la emisión entra por la Agent API y **el Orchestrator pasó de tres dependencias a dos**.
>
> **El resto del documento sigue vigente**, incluidas las decisiones 1 a 3 de §7 y el análisis de ausencias de §2.

> **Cero cambios de código.** `lint` limpio, `tsc --noEmit` limpio, **175 pruebas en verde**.

---

# 1. Alcance

**Resolver las tres decisiones que COM-25 §7 declaró BLOCKED**, y diseñar el Orchestrator que las tres desbloquean. **No se escribe el Orchestrator.**

---

# 2. Decisión 1 — Cómo se representa la ausencia

## 2.1 Contexto

**`GenerateProposalInput` declara `diagnosis` y `sequence` obligatorios; las dos lecturas devuelven `… | null`.** Un Lead con diagnóstico y **sin secuencia diseñada** es un estado corriente que **hoy no tiene representación** *(COM-25 §4.5)*.

## 2.2 Dos hechos que el análisis debe tener delante

> ### **1. Sin secuencia no hay `moment`, y sin `moment` no hay identidad.**
>
> **ADR-16 §4.4** define la identidad de `Proposal` como **`(Lead, momento, número de emisión)`**, y el momento **solo puede venir de la secuencia** *(COM-25 §4.3)*. Un caso de uso que recibiera `sequence` ausente **no podría identificar lo que emite**, ni construir el evento E-5, ni entregar nada a persistir.

> ### **2. Si existe secuencia, existe diagnóstico.**
>
> `CreateSequence` **se niega a diseñar sin diagnóstico vigente** —devuelve `diagnosis_missing`— y **ninguna emisión se destruye** *(RC-9 · ADR-13 §10.2)*. Por tanto, **toda secuencia implica un diagnóstico conservado**, y `diagnosis_missing` es **estructuralmente casi inalcanzable** en el flujo normal.

**Las dos ausencias no son simétricas, y tratarlas igual sería el error.**

## 2.3 Las tres alternativas

| | **A · Campos opcionales** | **B · El Orchestrator no ejecuta** | **C · `ProposalGenerationReadiness`** |
| --- | --- | --- | --- |
| **Qué hace** | `diagnosis?` y `sequence?` | Si falta algo, no invoca | Un estado previo con cuatro valores |
| **Con la secuencia** | ⛔ **Incoherente**: sin `moment` el caso de uso **no puede identificar la emisión** *(§2.2.1)* | ✅ Coherente | ✅ Coherente |
| **Con el diagnóstico** | ✅ **Hace alcanzable la rama que COM-09 §7 ya definió** | 🟡 Traslada al Orchestrator una rama que el caso de uso ya tiene | 🟡 Duplica esa rama |
| **Contra R-10** | ✅ No decide nada | ⚠️ **Depende de cómo se formule** *(§2.4)* | ⚠️ El estado **decide** cuándo se puede proponer |
| **Contra F-8 · COM-07** | 🟡 Admite entradas incompletas | ✅ La entrada sigue completa | ✅ Ídem |
| **Concepto nuevo** | No | No | ⛔ **Sí** — y **`MissingStrategy` convertiría B-1 en un estado de producto**, que es exactamente lo que COM-11 §4.4 y R-52 prohíben modelar |
| **Ramas nuevas en COM-09 §4.2** | ⛔ Exigiría `sequence_missing` | ✅ Ninguna | ⛔ Exigiría un tipo de retorno nuevo |

## 2.4 Recomendación

> ## **B para la secuencia · A acotada al diagnóstico.**
>
> **Ninguna de las tres en estado puro. Las dos ausencias se resuelven donde cada una pertenece.**

### La secuencia — **el Orchestrator resuelve, y si no hay contacto, la petición no designa nada**

**No es una regla de negocio, y esa es la clave para que no incumpla R-10.** El Orchestrator **no decide si conviene proponer**: comprueba que **el contacto al que la petición se refiere existe**. Un Lead sin secuencia **no tiene ningún momento en curso**, de modo que la petición **no designa ningún objeto**.

**Eso es un error de entrada** —APS-03 §12, *«los datos recibidos no permiten ejecutar la operación… es responsabilidad de quien invoca»*— **y se lanza**, con el precedente exacto de `MissingCriteriaVersionError`: **una entrada que incumple el contrato no es un desenlace del negocio** *(AL-16 · R-62)*.

**Y hay un argumento de producto que lo confirma:** **CS-I4 · RC-7** — ningún momento se emite **sin acción del usuario para ese contacto concreto**. Si el usuario actúa sobre un contacto, **la secuencia existe por construcción**. Una petición sin ella **solo puede venir de un cliente mal construido**.

### El diagnóstico — **campo opcional, para que la rama que ya existe sea alcanzable**

**COM-09 §7 ya decidió** que la ausencia de diagnóstico es una **rama del resultado**. Hoy el tipo la contradice: declara `diagnosis` obligatorio, de modo que **la rama solo se alcanza forzando el tipo** *(COM-25 §4.5)*.

**Hacer `diagnosis` opcional no añade ninguna decisión: hace honesto el tipo respecto de una decisión ya tomada.** Y **no multiplica las ramas**: `diagnosis_missing` ya existe y ya está implementada.

### Por qué NO la C

**Introduce un concepto que el Blueprint no nombra**, y **DDD-01 §8** es explícito sobre el coste de eso. Peor: **`MissingStrategy` modelaría B-1 como un estado del producto**, cuando B-1 es **un bloqueo de gobernanza**: publicar `SP-01` lo elimina, y el estado quedaría para siempre describiendo algo que dejó de existir. **COM-11 §4.4** prohíbe precisamente convertir un bloqueo en comportamiento.

## 2.5 Impacto

| Qué | Alcance | Requiere |
| --- | --- | --- |
| **`diagnosis` pasa a opcional** en `GenerateProposalInput` | Un campo, más el `if` que ya existe | **Aprobación** — toca un contrato de `application/` |
| **`sequence` no cambia** | — | — |
| **COM-09 §4.2 no cambia** | Ninguna rama nueva | — |
| **COM-07 §6** | Cuarta corrección acumulada sobre su dibujo | Anotarlo como *superseded* *(COM-23 §4.5)* |
| **`diagnosis_missing` sigue siendo poco frecuente** | Es correcto: §2.2.2 explica por qué | — |

---

# 3. Decisión 2 — De dónde salen los hechos afirmables

## 3.1 ⚠️ Corrección de la premisa

> **`CommercialFactsRepository` no existe, y no puede existir.**

**Verificado**: los ocho repositorios del sistema no incluyen ninguno de hechos. Y no es una omisión — **DDD-01 §4.2**: la lista cerrada *«se construye por emisión y **no persiste aparte**»*, y **COM-10 §1, decisión 5**: *«los hechos no persisten, no crean evento ni agregado»*.

**Aunque existiera, el Orchestrator no podría leerlo: R-24 — no conoce persistencia.**

## 3.2 Tampoco los aporta `ReducedDiagnosisReader`

**Son cosas distintas y no deben confundirse.** El diagnóstico reducido es **la lectura del comprador** *(cómo abordarlo)*; la lista cerrada es **lo único que el texto puede afirmar**. **COM-07 §2.2** excluye los indicios del diagnóstico precisamente para que **la lista tenga un solo origen** *(RE-1)*.

## 3.3 Recomendación

> ## **Inyectar `RunCommercialFactsFn`, el workflow que ya existe.**

`commercialFactsOrchestrator` **ya reúne las tres fuentes** —atributos de la Empresa del Lead Hunter, factores medidos del Lead Analyzer y la derivación del Pitch Generator— y **está construido en el Composition Root desde el Sprint 05, sin consumidor, esperando exactamente esto**.

**Las tres confirmaciones que el sprint pide:**

| Confirmación | Veredicto |
| --- | :-: |
| **Ningún Agent conoce a otro Agent** | ✅ **Se mantiene.** El compositor **no invoca agentes ajenos**: recibe una función ya construida. Quien conoce a los tres agentes es `commercialFactsOrchestrator`, que es **el único autorizado** (R-11 · ADR-04 §7.6) |
| **El Orchestrator puede coordinar varios servicios** | ✅ Es su razón de ser |
| **La lógica de reducción permanece fuera** | ✅ La derivación de hechos vive en `domain/` *(`generateAffirmableFacts`)*; el compositor **no la toca** |

> ⚠️ **Sería la primera vez que un workflow depende de otro.** No lo prohíbe ningún ADR —lo que ADR-04 §7.6 prohíbe es que un **agente** conozca a otro—, pero **tampoco lo enuncia ninguno**. **Se recomienda ratificarlo explícitamente**, no darlo por supuesto.
>
> **La alternativa —que el compositor reúna otra vez los tres agentes— se descarta:** duplicaría la composición de `ObservedInput`, que ya existe una vez.

---

# 4. Decisión 3 — Imports de `domain/`

## 4.1 Dos precisiones

**`application/orchestration` no existe.** Los Orchestrators viven en **`server/orchestrators/`**, fuera de los módulos, y se construyen desde el Composition Root.

**Y la duda de COM-25 §6.1 tiene una salida que no exige decidir la regla.**

## 4.2 ¿Es una violación? — **No**

**R-02 · R-03** prohíben que **el `domain/` de un módulo** importe el de otro. **Un Orchestrator no es el dominio de ningún módulo**, y **ningún ADR le prohíbe nombrar un tipo del módulo que coordina**.

**Precedente en el código:** `commercialFactsOrchestrator` importa `ObservedInput` y `ClosedFactList` de `domain/`; `leadLibraryOrchestrator` importa tipos de `application/`.

## 4.3 Recomendación — **no hace falta ningún import de `domain/`**

> **El contrato del Orchestrator vive donde ya vive: en `application/generateProposal.ts`.**

El compositor solo necesita **dos tipos**, y ambos son de `application/`:

```text
GenerateProposalInput      ← para construir el sobre
GenerateProposalResult     ← para declarar qué devuelve
```

**Los tipos reducidos no hay que nombrarlos:** los valores llegan de la Agent API y **se copian**; TypeScript los infiere. **Es exactamente el patrón de `commercialSequenceOrchestrator`**, que importa `CreateSequenceInput` y `CreateSequenceResult` y **ningún tipo de `domain/`**.

| | |
| --- | --- |
| **Consecuencia** | El nuevo Orchestrator **importa solo de `presentation/` y de `application/`** |
| **Sobre §6.1 de COM-25** | La discrepancia **deja de ser relevante para este componente**. Sigue abierta como cuestión general, y **el caso de `commercialFactsOrchestrator` es explicable, no un modelo a imitar** |

---

# 5. Diseño del Orchestrator

## 5.1 Responsabilidad

### Qué hace

1. **Reúne** las tres fuentes que el caso de uso necesita y no puede buscar *(ADR-15 §12)*.
2. **Copia** lo recibido en `GenerateProposalInput` y **compone el sobre de evidencia**.
3. **Invoca** `GenerateProposal` y **devuelve su resultado tal cual**.

### Qué NO hace

**No decide la estrategia** · **no interpreta el diagnóstico** · **no modifica los hechos** · **no crea texto** · **no valida reglas de negocio** · **no calcula scoring** · **no crea diagnósticos** · **no consulta al Lead Analyzer directamente** · **no modifica entidades** · **no construye prompts** · **no conoce adapters** · **no conoce persistencia** · **no conoce HTTP ni DTO públicos**.

> **La prueba de que no decide es que no puede:** todo lo que recibe llega **ya recortado**, y **no importa nada capaz de decidir**.

## 5.2 Dependencias — lista exacta

| Tipo | Dependencia | Por qué |
| --- | --- | --- |
| **Repositories** | **Ninguno** | **R-24** — un Orchestrator no conoce persistencia |
| **Readers** | **Ninguno directo** | Llegan **a través de la Agent API** *(COM-24)*: `readReducedDiagnosis` y `readReducedSequence` |
| **Agent APIs** | **`PitchGeneratorAgentApi`** | Único agente que coordina. **No conoce Lead Hunter ni Lead Analyzer** |
| **Workflows** | **`RunCommercialFactsFn`** | §3.3 — los hechos afirmables |
| **Use cases** | **`GenerateProposalFn`** | ⚠️ **§5.5** |
| **Adapters** | **Ninguno** | Se construyen en el Composition Root *(ADR-17 §9.1)* |

## 5.3 Flujo

```text
1.  Recibe { lead }                          ← de la ruta, vía su handler
2.  ├─ pitchGeneratorAgent.readReducedSequence(lead)   ─┐  en paralelo:
3.  ├─ pitchGeneratorAgent.readReducedDiagnosis(lead)   ├─ son independientes
4.  └─ runCommercialFacts(lead)                        ─┘
5.  Si no hay secuencia → error de entrada (§2.4). No designa ningún contacto
6.  Construye GenerateProposalInput:
        lead       ← copia
        sequence   ← copia
        diagnosis  ← copia (ausente si no hay: §2.4)
        evidence   ← { lead, facts }   ← única derivación: compone el sobre
7.  generateProposal(input)
8.  Devuelve el Result **sin traducir**: `application/` ya lo expresa como unión
    discriminada por `outcome` (AL-12), y no hay nada que traducir
```

**El paso 5 es el único condicional, y no es una regla de negocio**: comprueba que el objeto al que la petición se refiere existe.

## 5.4 Reglas que lo gobiernan

| Regla | Qué impone |
| --- | --- |
| **R-10** | Sin lógica de negocio |
| **R-11** | `routes/` nunca invoca un agente: pasa por aquí |
| **R-24** | No conoce persistencia |
| **R-08 · R-09** | No conoce HTTP ni DTO públicos ni mappers |
| **ADR-04 §7.6** | No invoca a otro agente |
| **RA-R1 · RC-3** | Decidir aquí sería **la fuga más probable de la arquitectura comercial** |
| **AL-12** | El resultado viaja como unión discriminada, sin traducir |

## 5.5 ⚠️ Una cuestión de forma que conviene decidir antes de escribirlo

**`commercialDiagnosisOrchestrator` y `commercialSequenceOrchestrator` reciben la Agent API y llaman al caso de uso *a través de ella*.** Aquí, en cambio, **`GenerateProposal` no está expuesto en la Agent API** —deliberadamente, porque con **B-1** siempre falla *(COM-24 §3.4)*—.

**De modo que el compositor tendría que recibir `GenerateProposalFn` directamente**, saltándose la fachada del módulo. **Es una asimetría con sus dos hermanos**, y hay dos salidas:

| Salida | Coste |
| --- | --- |
| **Inyectar `GenerateProposalFn`** | Rompe la simetría: un Orchestrator invocaría `application/` sin pasar por `presentation/` |
| **Exponer `generateProposal` en la Agent API** | Publica una operación que **con B-1 siempre falla** |

> **No se recomienda ninguna aquí: es la decisión 5 de COM-25 §7, y pertenece al Product Office** — publicar o no una capacidad bloqueada.

---

# 6. Riesgos y decisiones pendientes

## 6.1 Riesgos de este diseño

| # | Riesgo | Severidad |
| :-: | --- | :-: |
| **1** | **La asimetría del §5.5**: el compositor no puede seguir el patrón de sus dos hermanos mientras `GenerateProposal` no se exponga | 🔴 **Bloquea escribirlo** |
| **2** | **Hacer `diagnosis` opcional** vuelve a tocar el contrato de entrada — cuarta corrección sobre el dibujo de COM-07 §6 | 🟡 |
| **3** | **La dependencia workflow → workflow** no tiene precedente ni enunciado | 🟡 |
| **4** | **`diagnosis_missing` seguirá siendo casi inalcanzable** *(§2.2.2)*: el tipo será honesto, pero la rama seguirá sin ocurrir en el flujo normal | 🟢 |
| **5** | **Cinco piezas construidas sin consumidor** — `runCommercialFacts`, `generateProposal`, las dos lecturas y el adapter de redacción | 🟡 |

## 6.2 Bloqueos de gobernanza — **sin cambios y sin tocar**

| Bloqueo | Estado | Impacto sobre este diseño |
| --- | :-: | --- |
| **B-1 — `SP-01` sin publicar** | 🔴 Abierto | **Impide emitir**, y es lo que hace incómoda la decisión del §5.5 |
| **B-2 — reintentos del punto de control** | 🔴 Abierto | Ninguno sobre el Orchestrator |
| **CH-01/02/03 — longitud de canal** | 🔴 Abierto | Ninguno: es del adapter |
| **`COM-12 RC-4` — origen de `issuedAt`** | 🟡 Abierto | Ninguno |
| **COM-16 §8.1 — de qué secuencia nació una propuesta** | 🔴 Abierto | ⚠️ **Rozaría este diseño**: el compositor conoce la secuencia y **podría** pasarla; **no se hace**, porque A-6 no la conserva |
| **COM-16 §8.2 — alcance de la memoria** | 🔴 Abierto | Ninguno: la lectura transporta la memoria completa |
| **F-1 — dos puertos de redacción** | 🟡 Abierto | Ninguno: el compositor no conoce adapters |

## 6.3 Impacto futuro

- **Cuando `SP-01` se publique**, este diseño **no cambia**: el Orchestrator ya entrega todo lo que la estrategia necesitará.
- **Cuando se decida COM-16 §8.1**, el compositor **ya tiene el dato a mano** —conoce la secuencia— y sería el punto natural para pasarlo, **si A-6 llega a conservarlo**.
- **La deuda F-1 no se cerrará por este camino**: el flujo heredado tiene su propio Orchestrator y su propia ruta.

---

# 7. Resumen de decisiones

| # | Decisión | Recomendación | Quién la ratifica |
| :-: | --- | --- | --- |
| **1** | Ausencia de diagnóstico y de secuencia | **B para la secuencia** *(error de entrada: no designa contacto)* · **A acotada al diagnóstico** *(campo opcional, rama ya existente)*. **C descartada** | **Arquitectura** |
| **2** | Origen de los hechos afirmables | **Inyectar `RunCommercialFactsFn`**. `CommercialFactsRepository` **no existe ni puede existir** | **Arquitectura** |
| **3** | Imports de `domain/` | **Innecesarios**: el contrato vive en `application/generateProposal.ts` y los valores se infieren | **Arquitectura** |
| **4** | Cómo se invoca `GenerateProposal` *(§5.5)* | **Sin recomendación**: exponer una capacidad bloqueada es decisión de producto | **Product Office** |

---

# 8. Referencias

**ADR-04** §7.6 · **ADR-13** §10.2, §10.3 · **ADR-15** §12, RA-R1 · **ADR-16** §4.4, §7, RC-3, RC-7, RC-9, CS-I4 · **ADR-17** §9.1, AL-12, AL-16 · **APS-03** §12 · **APS-18** RE-1 · **DDD-01** §4.2, §8 · **DEV-00** R-02, R-03, R-08, R-09, R-10, R-11, R-24, R-52, R-62, F-8 · **COM-07** §2.2, §6 · **COM-09** §4.2, §7 · **COM-10** §1 · **COM-11** §4.4 · **COM-16** §8 · **COM-23** §4.5 · **COM-24** §3.4 · **COM-25**.
