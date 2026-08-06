# COM-14 — Contrato de Diagnóstico Reducido

| Campo | Valor |
| --- | --- |
| Código | COM-14 |
| Clasificación | **Contrato técnico** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Decide la forma. No cablea y no enmienda ningún ADR aprobado** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 10 · Fase 5 |
| Relacionado | COM-07 §2 · COM-09 · COM-13 §5.2 · ADR-16 §4.2 · APS-19 |

> **Ninguna línea de código se ha escrito en esta fase.** Las consecuencias sobre el código se enumeran en §6 y **requieren aprobación previa**.

---

# 1. Problema

**`GenerateProposal` necesita la lectura del comprador y no puede consumir `BuyerDiagnosis`.**

Dos razones distintas, y ninguna se resuelve sola:

| # | Impedimento | Regla |
| :-: | --- | --- |
| **1** | **No puede ir a buscarlo.** El agregado A-11 vive tras `BuyerDiagnosisRepository`, y `Deps` no lo contiene ni puede contenerlo | ADR-15 §12 · COM-09 §6 · AL-08 |
| **2** | **No puede recibirlo entero.** El agregado transporta los **indicios**, y admitirlos abriría **una segunda vía** hacia la lista cerrada junto a la proyección — **una lista con dos orígenes deja de ser cerrada de forma verificable** | COM-07 §2.2 · RE-1 |

**COM-13 §5.2 añadió el impedimento que faltaba:** hoy **nadie puede componer esa lectura**. La Agent API no expone ninguna lectura de A-11, y **el Orchestrator no puede recortar**: no conoce persistencia *(R-24)* y no contiene lógica de negocio *(R-10)*. **Recortar un diagnóstico es decidir qué puede alcanzar al mensaje**, y hacerlo fuera del dominio sería la fuga que **RA-R1 · RC-3** declaran la más probable de la arquitectura comercial.

---

# 2. Decisión

## 2.1 El contrato existe y se ratifica

> **`ReducedDiagnosis`** — `modules/pitch-generator/domain/commercial/reducedDiagnosis.ts`

Declarado en el Sprint 10 · Fase 2 y **se ratifica como el contrato de lectura**, con una corrección *(§4.1)*.

**Vive en `domain/` y no en `application/`** porque **lo consume `domain/`**: la decisión de estrategia se toma allí *(ADR-16 §7)* y no puede importar `application/`.

**No es `BuyerDiagnosis` y no lo sustituye.** No tiene identidad, no se persiste, ningún evento lo escribe y **no es un agregado**: es la proyección de A-11 sobre lo que una propuesta puede leer.

> **Sobre el nombre.** Este documento conserva `ReducedDiagnosis`. `ReducedBuyerDiagnosis` sería igualmente correcto y más simétrico con la entidad; **renombrar es un cambio de código y no se ejecuta aquí**. Si el Product Office prefiere la forma larga, es un renombrado mecánico sin impacto de contrato.

## 2.2 Quién produce la reducción — cuatro capas, cada una con su precedente

**Nadie decide nada nuevo: se replica exactamente la cadena de `generateAffirmableFacts`**, que resolvió el mismo problema para los hechos afirmables.

| Capa | Qué hace | Por qué ahí | Precedente |
| --- | --- | --- | --- |
| **`domain/`** | **La proyección**: recorta el agregado a lo de §3 | Es **cálculo puro sin I/O** y **decide qué puede leerse** (D-1 · RA-1 · DEV-00 §5.4) | `affirmableFactProjection.ts` |
| **`application/`** | **Una lectura** que recibe `BuyerDiagnosisRepository`, obtiene la emisión vigente y le aplica la proyección | **Es la única capa que puede recibir un repositorio** (AL-06 · R-22) | `listLeadScores` · `listLeadLibrary` |
| **`presentation/`** | Expone la lectura **ya recortada** en la Agent API | Única superficie pública del módulo; **no importa persistencia** (R-23) | `observeFacts` · `listScores` |
| **`orchestrators/`** | **Copia** el resultado dentro de la entrada de COM-07 | **Traducción de campos, no interpretación** (R-10) | `commercialFactsOrchestrator` |

> **Lo que la Agent API expone es la lectura recortada, nunca el agregado.** Si expusiera A-11, el recorte volvería a ocurrir fuera del dominio y el impedimento 2 seguiría abierto.

**La lectura no escribe, no versiona y no emite evento.** No es un quinto caso de uso canónico: **AG-3** exige evento a toda **escritura**, y esto no escribe nada.

## 2.3 Qué se conserva

| Propiedad | Cómo se conserva |
| --- | --- |
| **Trazabilidad** | Cada variable llega con **su clase de conocimiento**, que es lo que declara **qué se sabe y qué no** (CD-01). La reducción **no mezcla ni recalcula**: copia lo que el diagnóstico emitió |
| **Reproducibilidad** | La proyección es **determinista y pura**: la misma emisión produce la misma lectura reducida |
| **Separación diagnóstico ↔ propuesta** | La reducción **no decide estrategia**, y el diagnóstico **no viaja al texto**: lo inferido orienta el enfoque y **nunca se afirma** (RE-2) |

---

# 3. Campos incluidos

**Los cuatro que COM-07 §2.1 autoriza, y cada uno participa en una decisión** *(Sprint 04 · F-8: ninguno está «por si acaso»)*.

| Campo | Para qué lo necesita `GenerateProposal` | Regla |
| --- | --- | --- |
| **`variables[].id`** | Saber de qué variable se habla; **BD-1** es el punto de entrada de toda la estrategia y **BD-7** determina el enfoque | APS-19 §6 · APS-18 §7 |
| **`variables[].knowledgeClass`** | Saber **qué se sabe y qué no**. De ahí salen las restricciones de APS-19 §8.2 | **CD-01** |
| **`variables[].value`** *(solo cuando la clase lo autoriza)* | **Orientar** enfoque y objetivo. En BD-1 el valor **es el `CommercialState`** | **RE-2 · BD-I4** |
| **`confidence`** | Ajustar **cuánta evidencia aportar antes de proponer** | APS-19 §7 |

---

# 4. Campos excluidos

## 4.1 `commercialState` como campo hermano — **se excluye**

> **Es la corrección que este documento introduce sobre el borrador de COM-07 §6.**

COM-07 §6 lo dibuja junto a `variables`, y el código de la Fase 2 lo transcribió así. **Duplica el valor de BD-1**, que viaja dentro de `variables`, y **nada impide que ambas representaciones difieran**.

**BD-I4 (ADR-16 §4.2, `Approved`) es explícito:** *«el `CommercialState` **es la variable BD-1**, no un campo aparte»* — y por eso la entidad `BuyerDiagnosis` **no lo declara**.

| Alternativa | Veredicto |
| --- | :-: |
| Conservarlo | ⛔ **Contradice BD-I4** y exigiría enmendar ADR-16 |
| **Excluirlo** | ✅ **Alinea con el ADR aprobado.** El dato no se pierde: BD-1 lo lleva |

**COM-07 es un contrato técnico preliminar cuyo propio estado declara «no decide»**; ADR-16 está `Approved`. **No hay conflicto de autoridad que resolver: prevalece el ADR.**

## 4.2 `indicios` — excluidos, y es el corazón del contrato

APS-19 §4.1 dice que *«el indicio es un hecho»*, luego **podrían afirmarse**. Admitirlos abriría **una segunda vía** hacia la lista cerrada junto a la proyección, y **RE-1** exige que sea de origen único y verificable.

> **Los indicios justifican la lectura; no alimentan el mensaje.**

*(Cuestión abierta heredada de COM-07 §8: si el Product Office decide admitirlos alguna vez, debe decidir **cómo se unifican las dos vías**. No se resuelve en implementación.)*

## 4.3 El valor de una variable `Desconocida` — **no existe**

**BD-I2** — ninguna `Desconocida` tiene valor asignado. **Ausente es ausente** y jamás se rellena *(BD-R2 · RC-10 · R-38)*.

**Una variable `Desconocida` entra como clase, nunca como afirmación.** Lo afirmable es la lista cerrada, que es **una entrada distinta** *(P-I4)*. **RE-3 — lo desconocido se declara, no se disimula.**

## 4.4 La lectura como enunciado

**RE-2** — lo inferido **decide el enfoque; nunca se afirma**. Y **APS-19 §4.4** lo prohíbe en términos absolutos: el sistema **nunca afirma** que un negocio *teme*, *desconfía*, *ignora*, *se resiste* ni *está frustrado*.

## 4.5 `description` · `flaws` · `angle` · `revenueLoss` · `whyWebsiteNeeded`

> **No se excluyen aquí: no existen aquí.**

**Son narrativa del Lead Analyzer** *(COM-04 §4)* y **nunca han pertenecido a A-11**. No hay filtro que aplicar: la entidad no los declara y el módulo no los recibe. La salvaguarda que sí los vigila —en la frontera por la que un texto entra a ser afirmable— es `affirmableFacts.contract.ts`, y **falla si aparecen**.

**Ningún texto generado por IA entra por esta vía.** **RA-5** — ningún resultado generativo modifica diagnóstico, estado, estrategia ni secuencia.

## 4.6 Información estratégica

**No viaja en el diagnóstico y no puede viajar.** **SC-R1** — la estrategia se decide **antes de usar** cada contacto; **COM-07 §4.2** — `GenerateProposal` **no la recibe: la produce su `domain/`**.

## 4.7 `criteriaVersion` del diagnóstico — excluido hoy, con motivo

El agregado A-11 conserva **su propia** versión de criterio *(RC-13)*, y COM-07 §2.1 la lista como consumible *«para saber bajo qué criterio se emitió»*.

**No entra**, porque **ninguna decisión de la estrategia la consume**, y **F-8** prohíbe los campos que no participan en una decisión.

> **Si más adelante debe conservarse la relación «diagnóstico emitido bajo X → propuesta emitida bajo Y», eso pertenece a la emisión, no a la entrada.** Es una cuestión para **ADR-18**, y queda anotada.

---

# 5. Propietario

| Qué | Propietario |
| --- | --- |
| **La entidad `BuyerDiagnosis` (A-11) y su lectura** | **Pitch Generator** — APS-03 §7.3 · ADR-16 §6 |
| **El contrato de este documento y la cadena de §2.2** | **Arquitectura** |
| **Qué puede afirmarse** *(§4.2, cuestión abierta)* | **Product Office** — APS-19 |
| **La implementación de la proyección y la lectura** | **Ingeniería**, en la fase de cableado |

---

# 6. Impacto

## 6.1 Cambios de código pendientes de aprobación

| # | Cambio | Alcance |
| :-: | --- | --- |
| **1** | **Retirar `commercialState`** de `ReducedDiagnosis` *(§4.1)* | `domain/commercial/reducedDiagnosis.ts` + fixtures de tres suites. **Ningún consumidor lo lee hoy**: no hay estrategia que lo consuma |
| **2** | **Crear la proyección** en `domain/commercial/` | Función pura, sin I/O |
| **3** | **Crear la lectura** en `application/` | Recibe `BuyerDiagnosisRepository`; devuelve la lectura reducida o declara su ausencia |
| **4** | **Exponerla** en `PitchGeneratorAgentApi` | Quinta operación del agente |

**Ninguno se ejecuta en esta fase.** Los tres últimos pertenecen al cableado; el primero puede hacerse antes, y **es el único que toca código ya escrito**.

## 6.2 Qué NO cambia

- **`GenerateProposalInput` conserva sus cinco campos.** Solo cambia la forma interna de uno *(§4.1)*.
- **Ningún ADR aprobado se enmienda.** La corrección de §4.1 **alinea** el código con ADR-16 BD-I4; no lo contradice.
- **Ningún agente, repositorio, adapter, Orchestrator ni ruta se modifica.**

## 6.3 Lo que este documento **no** resuelve

> **La lectura recortada de `CommercialSequence` (A-12) sigue abierta.**

COM-13 §5.2 detectó **dos** lecturas ausentes; el Sprint 10 · Fase 5 solo encarga la del diagnóstico. `previousThread` y `previousContribution` exigen **derivar** de los momentos anteriores del plan, y esa derivación tiene exactamente el mismo problema de capa que ésta.

**La cadena de §2.2 le sería aplicable**, pero **no se decide aquí**: no está en el alcance del sprint.

---

# 7. Referencias

**ADR-04** §10 · **ADR-15** §12, RA-1, RA-5, RA-R1 · **ADR-16** §4.2, §6, §7, RC-3, BD-I2, BD-I4, AG-3 · **ADR-17** AL-06, AL-08 · **ADR-18** *(Draft)* · **APS-03** §7.3 · **APS-18** §7, RE-1, RE-2, RE-3, SC-R1, SC-R3 · **APS-19** §4.1, §4.4, §6, §7, §8.2, CD-01 · **DDD-01** §4.2 · **DEV-00** §5.4, R-10, R-22, R-23, R-24, R-38, D-1, F-8 · **COM-04** §4 · **COM-07** §2, §4.2, §6, §8 · **COM-09** §6 · **COM-13** §5.2.
