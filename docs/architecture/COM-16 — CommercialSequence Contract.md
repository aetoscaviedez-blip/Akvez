# COM-16 — Contrato de Lectura de `CommercialSequence`

| Campo | Valor |
| --- | --- |
| Código | COM-16 |
| Clasificación | **Contrato técnico** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Decide la forma. No cablea y no enmienda ningún ADR aprobado** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 11 |
| Relacionado | COM-07 §5 · COM-13 §5.2 · COM-14 · ADR-16 §4.3 · APS-18 §9 |

> **Ninguna línea de código se ha escrito.** Las consecuencias sobre el código se enumeran en §9 y **requieren aprobación previa**.

---

# 1. Propósito

## 1.1 Por qué existe el contrato

**`GenerateProposal` necesita saber qué contacto toca y qué dejaron los anteriores, y no puede obtenerlo por sí mismo.**

| # | Impedimento | Regla |
| :-: | --- | --- |
| **1** | **No puede buscarlo.** A-12 vive tras `CommercialSequenceRepository`, y `Deps` no lo contiene ni puede contenerlo | ADR-15 §12 · COM-09 §6 · AL-08 |
| **2** | **No puede recibir el agregado.** `CommercialSequence` transporta **la estrategia de cada contacto ya emitido**, y admitirla abriría dos fugas a la vez *(§7.1)* | COM-07 §5.2 · SC-R1 · RE-1 |
| **3** | **Nadie más puede recortarlo.** El Orchestrator no conoce persistencia *(R-24)* ni contiene lógica comercial *(R-10)* | COM-13 §5.2 |

**Es el mismo problema que COM-14 resolvió para el diagnóstico, sobre otro agregado.** Este documento aplica el patrón ya ratificado —*fuente → capa autorizada de lectura → contrato reducido → Orchestrator → `GenerateProposal`*— sin introducir ninguno nuevo.

## 1.2 Qué es y qué no es

**`ReducedSequence` no es `CommercialSequence` y no lo sustituye.** No tiene identidad, no se persiste, ningún evento lo escribe, **no es un agregado**: es la proyección de A-12 sobre lo que un contacto puede saber de los anteriores.

**APS-18 §9.1** — una secuencia *«no es una lista de mensajes: es una estrategia con memoria»*. **Este contrato transporta la memoria, nunca las decisiones.**

---

# 2. Auditoría de `CommercialSequence`

## 2.1 Dónde vive

| Plano | Ubicación |
| --- | --- |
| **Entidad de dominio** | `modules/pitch-generator/domain/commercial/CommercialSequence.ts` |
| **Activo** | **A-12** — ADR-13 §6.2 |
| **Persistence Contract** | `shared/persistence/contracts/CommercialSequence.ts` |
| **Repository Interface** | `shared/persistence/repositories/CommercialSequenceRepository.ts` |
| **Model · Mapper · Adapter** | `shared/persistence/models/` · `adapters/` *(los tres existen)* |
| **Contrato público** | `shared/contracts/commercialSequence.ts` + su mapper y su ruta |

## 2.2 Quién es su propietario

> **Pitch Generator** — ADR-16 §4.3 · APS-03 §7.3.

**Con una excepción que el contrato debe respetar:** el **resultado declarado** de cada contacto **lo produce el usuario, nunca un agente** *(DDD-01 §4.2 · APS-09 §9 · CE-I4)*. El módulo lo conserva; no lo decide.

## 2.3 Quién puede leerlo

| Capa | ¿Puede? | Regla |
| --- | :-: | --- |
| **`application/` de `pitch-generator`** | ✅ **Única** que recibe la Repository Interface | AL-06 · R-22 |
| **`domain/` de `pitch-generator`** | ✅ Como **dato recibido**, nunca buscándolo | ADR-15 §12 · DEV-00 §5.4 |
| **`presentation/`** | ⛔ **No importa persistencia**, «sin excepción» | R-23 |
| **`orchestrators/`** | ⛔ **No conoce persistencia** | R-24 |
| **Otros módulos** | ⛔ La comunicación pasa por el Orchestrator | R-02 · R-03 · ADR-04 §7.6 |

## 2.4 Qué contiene, y qué puede llegar a una propuesta

| Dato | Propietario actual | Capa autorizada | ¿Puede llegar a `Proposal`? |
| --- | --- | --- | :-: |
| **`leadId`** *(identidad)* | Lead Hunter *(referencia)* | `application/` | ✅ **Ya llega por otra vía** — `input.lead` de COM-07 §6 |
| **`sequence`** *(número)* | Pitch Generator | `application/` | ⚠️ **No, hoy** — §5.1 |
| **`status`** | Pitch Generator | `application/` | ⛔ **No** — §5.2 |
| **`plan[].moment`** *(el vigente)* | Pitch Generator | `application/` | ✅ **Sí** — determina objetivo y barrera |
| **`plan[].strategy`** *(de contactos anteriores)* | Pitch Generator · `domain/` | `application/` | ⛔ **No, como objeto** — §5.3 · §7.1 |
| **↳ `strategy.openedThread` del anterior** | Ídem | Ídem | ✅ **Sí, extraído** — CA-08 |
| **↳ `strategy.relevanceElement` de anteriores** | Ídem | Ídem | ✅ **Sí, extraído** — SC-R3 |
| **↳ `strategy.evidenceBase`** | Ídem | Ídem | ⛔ **Nunca** — sería un segundo origen de la lista cerrada *(RE-1)* |
| **`plan[].proposals`** *(números de emisión)* | Pitch Generator | `application/` | ⛔ **No** — §5.4 |
| **`plan[].declaredOutcome.responded`** | **El usuario** | `application/` | ✅ **Sí** — SC-R4 |
| **`plan[].declaredOutcome.manifestation`** | **El usuario** | `application/` | ⛔ **No** — §5.5 |
| **`currentMoment`** | Pitch Generator | `application/` | ✅ **Sí, como `moment`** |

---

# 3. Propietario del dato

| Qué | Propietario |
| --- | --- |
| **La entidad A-12 y su lectura reducida** | **Pitch Generator** — ADR-16 §4.3 |
| **El resultado declarado de cada contacto** | **El usuario. Nunca un agente** — CE-I4 |
| **Este contrato y la cadena de §6** | **Arquitectura** |
| **Hasta dónde alcanza la memoria** *(§8.2)* | **Product Office**, vía APS-18 |
| **La implementación** | **Ingeniería**, en la fase de cableado |

---

# 4. Campos incluidos

**Lista cerrada. Cuatro campos, y cada uno participa en una decisión** *(Sprint 04 · F-8)*.

| # | Campo | Qué decide | Regla | Naturaleza |
| :-: | --- | --- | --- | --- |
| **1** | **`moment`** | **Objetivo y barrera** del contacto que toca | APS-18 §9.2 | **Decisión comercial ya tomada** *(al planificar)* |
| **2** | **`previousThread`** | Qué hilo **retoma** este contacto | APS-18 §4.6 · **CA-08** | **Contexto** |
| **3** | **`previousContribution`** | Qué **no puede repetir**: si no aporta algo nuevo, **no se emite** | APS-18 §9.3 · **SC-R3 · CA-21 · CA-25** | **Contexto** |
| **4** | **`previousOutcome.responded`** | Qué barrera **no se rompió**. **El silencio es información** | APS-18 §9.5 · **SC-R4** | **Hecho declarado por el usuario** |

## 4.1 Cuáles son decisiones comerciales y cuáles solo contexto

> **La distinción importa porque determina qué puede reescribirse sin cambiar el criterio.**

- **`moment` es la única decisión comercial que entra**, y **ya está tomada**: la produjo `designSequence` al planificar, bajo APS-18 §9.2. `GenerateProposal` **la obedece; no la revisa** — revisarla sería rediseñar la secuencia desde el caso de uso equivocado.
- **`previousThread` y `previousContribution` son contexto**: no deciden nada por sí mismos; **restringen** lo que la estrategia puede volver a decir.
- **`previousOutcome.responded` es un hecho declarado**, no una lectura: **lo produjo el usuario** y ningún agente puede alterarlo.

**Ninguno de los cuatro autoriza a afirmar nada.** Lo afirmable es la lista cerrada, que entra por `evidence` y es **una entrada distinta** *(P-I4 · RE-1)*.

## 4.2 Ausencias legítimas

**Tres de los cuatro campos son opcionales, y su ausencia significa ausencia** *(R-38)*:

- **Primer contacto**: no hay hilo previo que retomar *(APS-18 §4.6)* ni contactos anteriores que no repetir → `previousContribution` **vacío**, y vacío es un estado válido, no un fallo.
- **Sin declaración del usuario**: `previousOutcome` ausente. **CE-I2 — sin `ContactEvent` la secuencia no avanza**: *el sistema no supone lo que no le consta.*

---

# 5. Campos excluidos

## 5.1 `sequence` — **el número de secuencia** ⚠️

> **Es la corrección que este documento introduce sobre el contrato vigente.**

`ReducedSequence` lo declara hoy como `sequenceNumber`. **Ningún consumidor lo lee**: verificado en el código, solo aparece en el propio tipo y en los datos de prueba. El número de emisión de la propuesta **no sale de aquí**, sale del historial de A-6 *(`findVersionsByMoment`)*.

**COM-07 §5.1 lo justifica como *«parte de la identidad de la emisión»* citando ADR-16 §4.4. La cita no lo sostiene:** ADR-16 §4.4 define la identidad de `Proposal` como **`(Lead, momento, número de emisión)`**, y el número de **secuencia** pertenece a la identidad de A-12 *(§4.3)*, que es **otra entidad**.

**Se excluye por F-8** — *ninguno está «por si acaso»*.

> ⚠️ **Y detrás hay una pregunta que no se decide aquí:** hoy **una `Proposal` no conserva de qué secuencia nació**, ni en el dominio ni en persistencia. Si debiera conservarlo, cambiaría la identidad o el contenido de A-6 — territorio de **ADR-16 §4.4** y del Persistence Contract. **Marcado como bloqueo en §8.1.**

## 5.2 `status` — el estado de la secuencia

**COM-07 §5.2** lo prohíbe expresamente **como criterio de exclusión**, y **CS-I3 · APS-18 §7.5** explican por qué: *agotar o detener una secuencia **no expulsa al Lead***.

**No entra en ninguna forma.** Si entrase «solo como contexto», el paso siguiente —no emitir cuando está `Detenida`— sería una regla de exclusión que **ningún documento aprobado autoriza**, tomada en el sitio equivocado.

## 5.3 `strategy` — la estrategia de contactos anteriores

**Ni la del contacto actual ni la de los anteriores, como objeto.**

- **La del actual no existe todavía**: `CreateSequence` deja toda `strategy` ausente, con prueba *(COM-10 §1)*, porque **SC-R1** exige decidirla **antes de usar** cada contacto, no al planificar.
- **La de los anteriores existe y no puede viajar entera** — dos motivos independientes, en §7.1.

**Lo que sí viaja son dos extracciones**: el hilo que el anterior dejó planteado y lo que los anteriores aportaron. **Dos cadenas, no un objeto de decisión.**

## 5.4 `proposals` — los números de emisión

**No participa en ninguna decisión.** Sirve para recorrer las emisiones de un momento *(P-I2)*, y **eso es una consulta, no una entrada de la propuesta siguiente**.

**Y su ausencia es una salvaguarda:** con ellos entraría la tentación de recuperar el **texto** de la propuesta anterior — que es exactamente lo que §7.2 impide.

## 5.5 `manifestation` — lo que el comprador dijo ⚠️

> **Es la segunda corrección de este documento, y la más delicada.**

`ReducedSequence` transporta hoy `DeclaredOutcome` completo, que incluye la **manifestación del comprador**: texto libre escrito por el usuario.

**Se excluye, por el mismo razonamiento con que COM-07 §2.2 excluyó los indicios:**

| | |
| --- | --- |
| **Qué pasaría si entrase** | Sería **contenido enunciable que no procede de la proyección**: una **segunda vía** hacia lo que un contacto puede afirmar, y **una lista con dos orígenes deja de ser cerrada de forma verificable** *(RE-1)* |
| **Qué se pierde al excluirlo** | **Nada que decida.** Una manifestación **convierte una variable en `Observable` y prevalece sobre toda lectura inferida** *(APS-19 §4.3 · CE-I3)*, y ese efecto **ya llega por el diagnóstico**: E-9 versiona A-11, y la lectura reducida de COM-14 lo muestra |
| **Qué se conserva** | **`responded`**, que es *«la declaración mínima»* que APS-18 §9.5 exige, y con ella **SC-R4 — el silencio es información** |

**Consecuencia de forma:** el contrato **no reutiliza `DeclaredOutcome`**, declara su propia reducción con un solo campo — igual que `ReducedDiagnosisVariable` no reutiliza `DiagnosisVariable` *(COM-14)*.

> **Si el Product Office decidiera que una manifestación puede afirmarse, debe decidir cómo se unifican las dos vías.** Es la misma cuestión abierta que COM-07 §8 dejó para los indicios, y **no se resuelve en implementación**. *(§8.3)*

## 5.6 `commercialState` y todo lo del diagnóstico

**No pertenecen a esta entidad y no entran por aquí.** La razón está en §7.3.

---

# 6. Flujo permitido

```text
  ┌─ FUENTE ────────────────────────────────────────────────────────────┐
  │  CommercialSequence (A-12)  ·  agregado completo                    │
  │  Owner: Pitch Generator · ADR-16 §4.3                               │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │  CommercialSequenceRepository
                                 │  **única capa que puede leerlo: application/**
                                 ▼                       (AL-06 · R-22)
  ┌─ CAPA AUTORIZADA DE LECTURA ────────────────────────────────────────┐
  │  application/  obtiene la secuencia vigente del Lead                │
  │  domain/       APLICA LA REDUCCIÓN  ← aquí se decide qué puede      │
  │                cálculo puro, sin I/O    saber el contacto siguiente │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │  ReducedSequence  (§4)
                                 ▼
  ┌─ SUPERFICIE PÚBLICA ────────────────────────────────────────────────┐
  │  presentation/  expone LA LECTURA YA RECORTADA, nunca el agregado   │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │  Agent API
                                 ▼
  ┌─ ORCHESTRATOR ──────────────────────────────────────────────────────┐
  │  COPIA el resultado dentro de la entrada de COM-07                  │
  │  no filtra · no interpreta · no decide          (R-10 · R-24)       │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │  GenerateProposalInput.sequence
                                 ▼
  ┌─ GENERATEPROPOSAL ──────────────────────────────────────────────────┐
  │  Recibe. No busca. No sabe de dónde viene ni que A-12 existe        │
  └─────────────────────────────────────────────────────────────────────┘
```

**Es la cadena de COM-14 §2.2, sin variación.** Cada capa tiene su precedente en `generateAffirmableFacts` → `commercialFactsOrchestrator`.

**Dos propiedades que el diagrama garantiza:**

1. **La reducción ocurre en `domain/`**, que es donde **RA-R1 · RC-3** exigen que se decida qué puede alcanzar al mensaje. Hacerla en el Orchestrator sería la fuga *«más probable de toda la arquitectura comercial»*.
2. **`GenerateProposal` no conoce el origen.** Su entrada declara `ReducedSequence`, no `CommercialSequence`: **aunque A-12 desapareciera, el caso de uso no cambiaría**.

**La lectura no escribe, no versiona y no emite evento.** **AG-3** exige evento a toda **escritura**; esto no escribe.

---

# 7. Riesgos analizados

## 7.1 Riesgo A — Estrategia duplicada

> **Verificado: `CommercialSequence` SÍ contiene decisiones que pertenecen a `CommercialStrategy`.** `PlannedMoment.strategy` conserva la estrategia de cada contacto *(ADR-13 §6.2 · ADR-16 §4.3)*.

**No es un defecto del modelo: es su memoria.** El defecto sería dejarla llegar. **Dos fugas distintas, y basta una para romper el sistema:**

| # | Fuga | Consecuencia |
| :-: | --- | --- |
| **1** | **Decidir por imitación.** Con la estrategia anterior delante, copiarla es el camino corto | La estrategia dejaría de decidirse **bajo el Perfil** y pasaría a heredarse. **ADR-15 §7.2** exige que se determine por diagnóstico, estado y versión del criterio — no por lo que se hizo la última vez |
| **2** | **Segundo origen de evidencia.** `CommercialStrategy.evidenceBase` **es una `ClosedFactList`** | Entraría una lista de hechos afirmables **que no produjo la proyección**, y **RE-1** exige origen único y verificable. Es exactamente la fuga que COM-07 §2.2 cerró con los indicios |

**Mitigación del contrato:** solo viajan **`openedThread` del contacto anterior** y **los `relevanceElement` de los anteriores** — dos extracciones de texto que **CA-08 y SC-R3 exigen expresamente**. **Ningún objeto `CommercialStrategy` cruza la frontera, y `evidenceBase` no cruza en ninguna forma.**

**Riesgo residual: 🟢 bajo.** El tipo `ReducedSequence` **no declara ningún campo capaz de transportar una estrategia**: la fuga exigiría cambiar el contrato, no equivocarse al usarlo.

## 7.2 Riesgo B — Narrativa generada

> **Verificado: ningún campo puede introducir copy generado, argumentos ni justificaciones.**

| Vía posible | ¿Abierta? | Por qué |
| --- | :-: | --- |
| **El texto de una `Proposal` anterior** | ⛔ **Cerrada por construcción** | A-12 **referencia las propuestas por identidad; no las contiene** *(DDD-01 §5.4)*. **El texto no está en el agregado**, así que no hay de dónde sacarlo |
| **`strategy.focus` o la explicación de la estrategia** | ⛔ Cerrada | Ningún objeto de estrategia viaja *(§7.1)* |
| **La manifestación del comprador** | ⛔ **Cerrada por este documento** | §5.5 |
| **Salida de un modelo generativo** | ⛔ Cerrada | **RA-5** — ningún resultado generativo modifica diagnóstico, estado, **estrategia ni secuencia**. *El texto es una salida terminal* |

**Riesgo residual: 🟡 medio, y honesto declararlo.** `Thread` y `RelevanceElement` son `string`, y **ningún tipo impide escribir prosa dentro**. Lo que lo impide es que **los produce `domain/` al decidir la estrategia**, y **APS-18 §8.2** enumera lo que una estrategia **no contiene**: el texto del mensaje, instrucciones para el modelo, detalle técnico y afirmaciones no sostenidas por evidencia.

**Y hay una segunda red:** aunque algo se colase, **el punto de control verifica el texto final** contra la lista cerrada y contra la alusión sin enunciado *(APS-18 §10.3, comprobaciones 3 y 5 · CA-18 · CA-23)*.

## 7.3 Riesgo C — Estado del comprador

> **Verificado: `CommercialState`, `BuyerDiagnosis` y `CommercialSequence` tienen responsabilidades separadas, y este contrato no las funde.**

| Concepto | Qué responde | Dónde vive | Ciclo |
| --- | --- | --- | --- |
| **`BuyerDiagnosis` (A-11)** | **¿Cómo se aborda este negocio?** | Agregado propio | **Se versiona** |
| **`CommercialState`** | **¿Qué sabe el comprador?** | **Es la variable BD-1 de A-11**, no un campo aparte *(BD-I4)* | Con el diagnóstico |
| **`CommercialSequence` (A-12)** | **¿Qué contacto toca y qué dejaron los anteriores?** | Agregado propio | **Se actualiza** |

**Tres reglas sostienen la separación, y las tres se respetan:**

- **BD-I4** — el `CommercialState` **no es un campo suelto**; **COM-14 §4.1** ya lo excluyó como campo hermano del diagnóstico reducido, y **con más razón no aparece aquí**: no pertenece a esta entidad.
- **ADR-13 §6.2** separó A-11 de A-12 **deliberadamente**: una se versiona y la otra se actualiza. **DDD-01 §5.4** aplica el mismo razonamiento a `Proposal`.
- **LS-5** — el estadio del Lead y el Commercial State son **ejes independientes**; **CS-I3 · APS-18 §7.5** — ni el estado de la secuencia ni el del comprador **excluyen a un Lead**.

**Cómo lo garantiza el contrato:** `ReducedSequence` **no declara ningún campo del diagnóstico**, y `ReducedDiagnosis` **no declara ninguno de la secuencia**. **Entran por separado en COM-07 §6 y se combinan solo dentro de `domain/`, al decidir la estrategia** — que es el único lugar autorizado a combinarlos.

**Riesgo residual: 🟢 bajo.**

---

# 8. Riesgos pendientes y bloqueos

**Ninguno se resuelve en este documento. Los tres primeros pertenecen a decisiones que no son de ingeniería.**

## 8.1 🔴 Bloqueo — ¿de qué secuencia nació una propuesta?

**Hoy no se conserva.** `Proposal` no lo declara ni en el dominio ni en persistencia *(§5.1)*.

**Decidirlo cambiaría la identidad o el contenido de A-6**, que fija **ADR-16 §4.4** —`Approved`— y replica el Persistence Contract. **Es una decisión de Blueprint: se marca como bloqueo y no se toma aquí.**

**Propietario: Arquitectura**, con ADR-16. **Mientras tanto, `sequence` no entra** *(§5.1)*.

## 8.2 🔴 Bloqueo — hasta dónde alcanza la memoria

> **`previousContribution`: ¿lo que aportó el contacto inmediatamente anterior, o todos los anteriores?**

**Las fuentes no dicen lo mismo, y la diferencia cambia el comportamiento:**

| Fuente | Qué dice |
| --- | --- |
| **APS-18 §9.3 SC-R3 · CA-21 · CA-25** | *«ningún contacto repite **al anterior**»* · *«al menos un elemento de relevancia que **el anterior** no contenía»* — **singular** |
| **COM-07 §5.1** | *«qué aportaron **los contactos anteriores**»* — **plural** |

**El contrato admite ambas sin cambiar de forma** —es una lista—, pero **la política de llenado decide si un contacto puede repetir algo dicho tres contactos atrás**. **No se inventa.**

**Propietario: Product Office**, vía APS-18. *(`previousThread` no tiene esta ambigüedad: **CA-08** es explícito — es el hilo que dejó planteado **el anterior**.)*

## 8.3 🟡 Pendiente — ¿puede afirmarse una manifestación?

**Heredado de la cuestión abierta de COM-07 §8 sobre los indicios, y es la misma pregunta:** una manifestación **es un hecho** —lo dijo el comprador—, luego en teoría podría afirmarse. **Este contrato la excluye** para conservar una lista cerrada de origen único *(§5.5)*.

**Si el Product Office prefiere admitirla, debe decidirse cómo se unifican las dos vías.** **Propietario: Product Office**, vía APS-19.

## 8.4 Bloqueos heredados, sin cambios

**B-1** *(`SP-01` sin publicar)* y **B-2** *(reintentos del punto de control)* siguen abiertos *(COM-11 §6)*. **`COM-12 RC-5`** sigue bloqueando el adapter de A-6.

**Ninguno lo toca este documento**, y ninguno impide cerrar este contrato: la forma de la lectura **no depende del criterio comercial**.

---

# 9. Impacto

## 9.1 Cambios de código pendientes de aprobación

| # | Cambio | Alcance |
| :-: | --- | --- |
| **1** | **Retirar `sequenceNumber`** de `ReducedSequence` *(§5.1)* | `domain/commercial/reducedSequence.ts` + datos de prueba. **Ningún consumidor lo lee** |
| **2** | **Reducir `previousOutcome` a `{ responded }`** *(§5.5)* | Ídem. Deja de reutilizar `DeclaredOutcome` |
| **3** | **Crear la proyección** de A-12 en `domain/commercial/` | Cálculo puro; extrae los dos textos de las estrategias anteriores |
| **4** | **Crear la lectura** en `application/` y **exponerla** en la Agent API | Recibe `CommercialSequenceRepository` |

**Ninguno se ejecuta en este sprint.** Los dos primeros tocan código escrito; los dos últimos pertenecen al cableado.

## 9.2 Qué NO cambia

- **`GenerateProposalInput` conserva su campo `sequence`.** Cambia la forma interna, no la superficie.
- **Ningún ADR aprobado se enmienda.** Las dos correcciones **se apoyan** en F-8 y en RE-1; lo que exigiría enmienda —conservar la secuencia de origen— **se marca como bloqueo** y no se hace *(§8.1)*.
- **Ni `CommercialSequence`, ni `CreateSequence`, ni `designSequence`, ni el repositorio, ni el adapter, ni el Orchestrator, ni la ruta se tocan.**

---

# 10. Referencias

**ADR-04** §7.6 · **ADR-13** §6.2, §10.1, §10.3 · **ADR-15** §7.2, §12, RA-5, RA-R1 · **ADR-16** §4.3, §4.4, RC-3, CS-I3, CS-I5, CE-I2, CE-I4, AG-3, P-I2, P-I4 · **ADR-17** AL-06, AL-08 · **APS-03** §7.3 · **APS-09** §9 · **APS-18** §4.6, §4.7, §7.5, §8.2, §9.1, §9.2, §9.3, §9.5, §10.3, RE-1, SC-R1, SC-R3, SC-R4, CA-08, CA-18, CA-21, CA-23, CA-25 · **APS-19** §4.3, CE-I3 · **DDD-01** §4.2, §5.4 · **DEV-00** §5.4, R-02, R-03, R-10, R-22, R-23, R-24, R-38, F-8 · **PO-02** LS-5 · **COM-07** §2.2, §5, §6, §8 · **COM-09** §6 · **COM-10** §1 · **COM-11** §6 · **COM-12** · **COM-13** §5.2 · **COM-14**.
