# COM-18 — Auditoría Final de los Contratos Reducidos

| Campo | Valor |
| --- | --- |
| Código | COM-18 |
| Clasificación | **Auditoría de cierre** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Audita y confirma. No decide, no cablea y no enmienda ningún ADR aprobado** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 12 |
| Relacionado | COM-07 · COM-09 · COM-12 · COM-13 · COM-14 · COM-15 · COM-16 |

> **Un solo cambio de código en este sprint**, y es una contradicción documental *(§6.1)*. Todo lo demás es dictamen.

---

# 1. Estado actual

## 1.1 Qué está estabilizado

| Contrato | Forma vigente | Fijado por |
| --- | --- | --- |
| **`GenerateProposalInput`** | `lead` · `diagnosis` · `evidence` · `sequence` — **cuatro campos** | COM-07 §6, corregido por COM-14 · COM-15 · COM-16 |
| **`ReducedDiagnosis`** | `variables[{id, knowledgeClass, value?}]` · `confidence` | COM-14 |
| **`ReducedSequence`** | `moment` · `previousThread?` · `previousContribution[]` · `previousOutcome?{responded}` | COM-16 |
| **`StrategySelectionInput`** | `diagnosis` · `sequence` · `facts` | COM-15 §3 |
| **`ProposalDraftingInput`** | `strategy` · `facts` | COM-09 §6 |
| **`ControlPointInput`** | `strategy` · `facts` · `text` | COM-09 §5 |
| **`GenerateProposalResult`** | Cinco ramas | COM-09 §4.2 |
| **`ProposalRepository`** | Interfaz sin adapter | COM-09 §6 · ADR-08 |

**116 pruebas en verde**, `lint` y `tsc --noEmit` limpios.

## 1.2 ⚠️ COM-07 §6 ha quedado desfasado

**El dibujo de COM-07 §6 ya no describe la entrada.** Difiere en **tres puntos**, y los tres se decidieron después con justificación:

| COM-07 §6 dibuja | Estado real | Decidido en |
| --- | --- | --- |
| `criteriaVersion` como campo de entrada | **No entra**: lo sella `domain/` | **COM-15 §3** |
| `diagnosis.commercialState` como campo hermano | **No existe**: es la variable BD-1 | **COM-14 §4.1** |
| `sequence.sequenceNumber` | **No entra**: ninguna decisión lo consume | **COM-16 §5.1** |

**No es una desviación: es una sucesión documental sin registrar.** COM-07 se declara *«contrato técnico preliminar — no decide»*, y las tres correcciones se apoyan en documentos `Approved`.

> **Recomendación:** anotar en COM-07 §6 que queda **superseded** por COM-14, COM-15 y COM-16 en esos tres puntos. **No se ha hecho aquí**: el entregable de este sprint es COM-18 y solo COM-18.

---

# 2. Contratos revisados

**Ocho superficies, revisadas campo a campo contra ADR-14, ADR-16, COM-07 y COM-16.**

| # | Superficie | Veredicto |
| :-: | --- | :-: |
| **1** | `ReducedDiagnosis` | ✅ Estable |
| **2** | `ReducedSequence` | ✅ Estable |
| **3** | `GenerateProposalInput` | ✅ Estable *(un residuo: §5.1)* |
| **4** | `StrategySelectionInput` | ✅ Estable |
| **5** | `ProposalDraftingPort` | ✅ Estable *(duplicidad mandatada: §4.1)* |
| **6** | `ControlPointInput` | ⚠️ **Duplicidad no mandatada: §3.2** |
| **7** | `GenerateProposalResult` / `ProposalEmission` | ⚠️ **Duplicidad heredada: §3.3** |
| **8** | `ProposalRepository` | ⚠️ **Duplicidad heredada: §3.3** |

## 2.1 Comprobaciones exigidas por el sprint

| # | Comprobación | Resultado |
| :-: | --- | :-: |
| **1** | Ningún dato en `ReducedDiagnosis` **y** `ReducedSequence` | ✅ **Intersección vacía** — §4.2 |
| **2** | Ningún dato en `Strategy` **y** `GenerateProposalInput` | ⚠️ **Uno: `moment`** — §3.1 |
| **3** | `ProposalRepository` recibe solo lo que debe persistirse | ✅ **Sí**, con tres duplicidades del modelo aprobado — §3.3 |
| **4** | Ningún tipo exportado por `application/` pertenece a `domain/` | ⚠️ **Tres reexportados** — §3.4 |

---

# 3. Duplicidades encontradas

## 3.1 `moment` viaja en la secuencia y en la estrategia — 🟡 sin resolver

**`ReducedSequence.moment` y `CommercialStrategy.moment` son el mismo dato.**

| | |
| --- | --- |
| **Quién manda hoy** | **La secuencia.** El flujo usa `input.sequence.moment` para la identidad de la emisión, para el evento E-5 y para persistir. **`strategy.moment` no se lee en ninguna línea** |
| **Por qué existen los dos** | **APS-18 §8.1** incluye el momento entre los diez contenidos de una estrategia; **COM-16 §4** lo declara *«la única decisión comercial que entra, y ya está tomada»*. **Ambos campos están en documentos que no se enmiendan desde una auditoría** |
| **Riesgo real** | Que `selectStrategy`, cuando se implemente, produzca una estrategia con un `moment` distinto del que la secuencia dictó. **Nada lo impediría**, y la propuesta quedaría identificada por un momento y explicada por otro |

> **Regla que debe respetar quien implemente `selectStrategy` (B-1):** `strategy.moment` **se copia** de `sequence.moment`. **No se decide.** El momento lo fijó el plan; la estrategia lo transporta.

**No se cambia código**: `selectStrategy` no tiene cuerpo, y no hay nada que corregir todavía. **Queda como regla de implementación.**

## 3.2 `ControlPointInput.facts` es derivable de `strategy.evidenceBase` — 🟡 recomendación

**Desde el ajuste de la Fase 3+, `facts` y `strategy.evidenceBase` son la misma referencia**, siempre, por construcción.

**La diferencia con el puerto de redacción es que aquí nadie lo exige:**

| | `ProposalDraftingInput` | `ControlPointInput` |
| --- | --- | --- |
| ¿Quién manda los dos campos? | **COM-09 §6**: *«debe recibir la estrategia **y** la lista cerrada»* | **Nadie.** Lo declaré así por simetría |

**Cambio recomendado:** retirar `facts` de `ControlPointInput`, que pasaría a `{ strategy, text }`. **No se ejecuta** *(§6.2)*: es una redundancia inofensiva —no puede divergir— y el sprint autoriza tocar código solo ante contradicción objetiva.

## 3.3 El modelo aprobado persiste tres datos dos veces — 🔴 heredada, no resoluble aquí

**`Proposal` —la entidad de ADR-16 §4.4 y su Persistence Contract— conserva `strategy` completa *y*, además, campos que la estrategia ya lleva dentro:**

| Dato | Dónde aparece | Veces |
| --- | --- | :-: |
| **El canal** | `Proposal.channel` **y** `Proposal.strategy.channel` | **2** |
| **El momento** | `Proposal.moment` **y** `Proposal.strategy.moment` | **2** |
| **La lista de hechos** | `Proposal.affirmableFacts` **y** `Proposal.strategy.evidenceBase` | **2** |

**Ninguna procede de este módulo:** las tres están en **ADR-16 §4.4** *(`Approved`)* y en el Persistence Contract que lo replica. **El código no puede hacerlas divergir** —los tres campos se escriben desde la misma estrategia—, pero **el esquema admite que diverjan**, y quien lea la fila después no sabrá cuál manda.

**Se marca como bloqueo.** Resolverlo exige enmendar ADR-16 §4.4 y el contrato de persistencia. **Propietario: Arquitectura.** *(Colinda con `COM-12 RC-5`, que pregunta qué conserva A-6 por hecho: conviene decidirlas juntas.)*

## 3.4 `application/` reexporta tres tipos de `domain/` — 🟡 recomendación

**Es exactamente lo que la comprobación 4 del sprint busca.**

`application/generateProposal.ts` reexporta `ReducedDiagnosis`, `ReducedDiagnosisVariable` y `ReducedSequence`, **que son tipos de `domain/`** —COM-14 y COM-16 los sitúan allí—. Fue una medida de compatibilidad del Sprint 10 · Fase 2, cuando esos tipos se trasladaron.

**Qué tiene de malo:** crea **una segunda ruta canónica** para importar un tipo de dominio, y quien la use —un Orchestrator, mañana— dependerá de `application/` para hablar de `domain/`.

**Qué NO tiene de malo:** no viola ninguna regla enunciada. **AL-13** prohíbe transportar **DTO públicos y contratos de persistencia**, y estos no son ni una cosa ni la otra.

**Cambio recomendado:** retirar el bloque de reexportación; los tres consumidores actuales —las tres suites de prueba— importarían de `domain/commercial/`. **Precedente:** `commercialFactsOrchestrator` ya importa `ObservedInput` y `ClosedFactList` directamente del `domain/` del módulo. **No se ejecuta** *(§6.2)*.

---

# 4. Duplicidades descartadas

**Cuatro sospechas comprobadas y desestimadas, con su motivo.**

## 4.1 `ProposalDraftingInput.facts` frente a `strategy.evidenceBase`

**Duplicidad real, pero mandatada:** COM-09 §6 exige entregar a la redacción *«la estrategia **y** la lista cerrada»*. **Retirarla sería enmendar COM-09.** Y desde el ajuste de la Fase 3+ **no puede divergir**: quien invoca pasa `strategy.evidenceBase`.

## 4.2 `ReducedDiagnosis` ∩ `ReducedSequence` = ∅

**Comprobado campo a campo:**

| `ReducedDiagnosis` | `ReducedSequence` |
| --- | --- |
| `variables[].id` · `knowledgeClass` · `value?` · `confidence` | `moment` · `previousThread?` · `previousContribution[]` · `previousOutcome?` |

**Ningún nombre coincide y ningún dato se solapa.** Es la separación que COM-16 §7.3 verificó: **A-11 responde *cómo se aborda*; A-12, *qué contacto toca*.** El `CommercialState` está en un solo sitio —el valor de BD-1— desde COM-14 §4.1.

**Tampoco son derivables entre sí:** podría pensarse que `previousOutcome.responded` se deduce del diagnóstico —una manifestación versiona A-11—, pero **el silencio no deja rastro en el diagnóstico**, y el silencio es precisamente lo que **SC-R4** declara informativo. **No es transitivo.**

## 4.3 `strategy.resumedThread` frente a `sequence.previousThread`

**Coincidirán en valor, y no es duplicidad: es el objeto de una verificación.**

`previousThread` es **lo que el contacto anterior dejó planteado** *(entrada)*; `resumedThread` es **lo que esta estrategia decide retomar** *(decisión)*. **CA-08** exige que sean el mismo, y **la comprobación 4 del punto de control existe para verificarlo** *(APS-18 §10.3)*. Fundirlos eliminaría lo que se verifica.

**Distinto de `relevanceElement` frente a `previousContribution`:** aquél es lo que **este** contacto aporta; éste, lo que aportaron los anteriores. **SC-R3** exige compararlos, no igualarlos.

## 4.4 Ningún dato del Opportunity Score alcanza la propuesta — **ADR-14**

**Comprobado:** ni `score`, ni `band`, ni `classification`, ni `profileVersion` aparecen en ninguna de las ocho superficies.

**Es lo que ADR-14 exige por dos vías:** **BD-I5 · RC-12** —el diagnóstico *«no produce puntuación ni orden»*— y **CD-11** —ningún resultado del diagnóstico altera el Score—. **Los dos ejes siguen separados:** el Score responde *«¿merece la pena?»*; el diagnóstico, *«¿cómo se aborda?»*.

**Y la versión del criterio comercial no se confunde con la del Perfil de Ponderación:** son dos designaciones distintas, de dos documentos distintos, y **COM-15 §3.2** las mantuvo separadas apoyándose en el precedente sin fundirlo.

---

# 5. Riesgos residuales

| # | Riesgo | Severidad | Evaluación |
| :-: | --- | :-: | --- |
| **1** | **El Lead viaja dos veces**: `input.lead` y `input.evidence.lead` | 🟡 Media | **Ambos están justificados por reglas distintas** —la identidad de la emisión y **AG-1**, que exige que todo hecho declare su Lead— y **retirar cualquiera empeora**: tomar la identidad del sobre de la evidencia ataría la identidad de A-6 a la lista de hechos. **Nada comprueba que coincidan**; una guarda sería lógica nueva |
| **2** | **`strategy.moment` puede divergir** de `sequence.moment` | 🟡 Media | §3.1. Se materializa al implementar `selectStrategy` |
| **3** | **Tres datos persistidos dos veces** | 🔴 Alta | §3.3. Bloqueo de Blueprint |
| **4** | **`ProposalEmission` no lleva `issuedAt`** | 🟢 Baja | La emisión que se devuelve **no dice cuándo se emitió**, aunque la fila persistida sí. COM-09 §4.2 define esos campos y no ese; se anota junto a **`COM-12 RC-4`** |
| **5** | **`CRITERIA_VERSION_ABSENT` vive en `diagnoseBuyer.ts`** | 🟢 Baja | La marca de ausencia habita el fichero de la lectura del comprador, no el del Value Object que la nombra. **COM-15 §6.1 #4** lo previó; no se ejecutó por alcance |
| **6** | **`COM-12 RC-4` y `RC-5`** | 🟡 Media | Sin cambios |
| **7** | **COM-16 §8.1 y §8.2** | 🔴 Alta | De qué secuencia nació una propuesta · hasta dónde alcanza la memoria. **Product Office y Arquitectura** |

---

# 6. Cambios necesarios

## 6.1 Ejecutado — una contradicción objetiva

| Qué | Dónde |
| --- | --- |
| **El comentario de `GenerateProposalInput` afirmaba «Cinco campos» sobre una interfaz de cuatro** | `application/generateProposal.ts` |

**Era una contradicción entre un tipo y su propia documentación**, heredada del Sprint 11 · Fase 2. Corregido a **cuatro campos**, con la cita de las tres correcciones que lo dejaron así. **Ningún cambio de comportamiento.**

## 6.2 Recomendados — **no ejecutados**, pendientes de aprobación

| # | Cambio | Motivo | Alcance |
| :-: | --- | --- | --- |
| **1** | Retirar `facts` de `ControlPointInput` | §3.2 — derivable, no mandatado | Un tipo de `domain/`, sin consumidor todavía |
| **2** | Retirar la reexportación de los tres tipos reducidos | §3.4 — pertenecen a `domain/` | Tres líneas de importación en las pruebas |
| **3** | Anotar COM-07 §6 como **superseded** en tres puntos | §1.2 | Documental |
| **4** | Mover `CRITERIA_VERSION_ABSENT` a `criteriaVersion.ts` | Riesgo 5 | Toca `GenerateDiagnosis`: **fuera del alcance de este sprint** |

**Ninguno es urgente y ninguno bloquea el cableado.**

## 6.3 Reglas de implementación derivadas de esta auditoría

**Para quien implemente `selectStrategy` cuando `SP-01` se publique:**

1. **`strategy.moment` se copia de `sequence.moment`.** No se decide *(§3.1)*.
2. **`strategy.resumedThread` es `sequence.previousThread`** cuando existe *(CA-08)*.
3. **`strategy.evidenceBase` sale de los `facts` recibidos**, sin ampliarlos *(RE-1 · RA-4)*.

---

# 7. Confirmación de estabilidad

> ## ✅ **Los contratos reducidos del dominio están estabilizados.**

| Criterio | Veredicto |
| --- | :-: |
| **`ReducedDiagnosis` y `ReducedSequence` no comparten ningún dato** | ✅ Intersección vacía, verificada campo a campo |
| **La entrada no contiene nada derivable, transitivo ni de otro agregado** | ✅ Con **una excepción declarada**: el Lead, justificado dos veces por reglas distintas *(riesgo 1)* |
| **La estrategia no se recibe ni se filtra desde fuera** | ✅ La produce `domain/`; **`StrategySelectionInput` no la contiene** |
| **La versión del criterio no es un argumento** | ✅ Se sella desde `domain/` *(COM-15)* |
| **Ningún dato del Opportunity Score alcanza la propuesta** | ✅ ADR-14 · BD-I5 · CD-11 |
| **La persistencia recibe solo lo que debe conservarse** | ✅ Nueve campos, cada uno con su regla — con tres duplicidades **del modelo aprobado** |
| **`lint`, `tsc --noEmit` y `npm test`** | ✅ Limpios · 116 en verde |

## 7.1 Qué NO queda estabilizado, y por qué no depende de estos contratos

**Tres duplicidades sobreviven, y ninguna vive en un contrato reducido:**

- **§3.3** vive en **ADR-16 §4.4**, un documento aprobado.
- **§3.1** vive en **APS-18 §8.1** frente a **COM-16 §4**, y **se materializará en un cuerpo que aún no existe**.
- **§3.2 y §3.4** son recomendaciones de higiene sin efecto sobre el comportamiento.

> **Ningún contrato reducido necesita cambiar antes del cableado.**

---

# 8. Referencias

**ADR-08** §5, §10 · **ADR-13** §10.3, §13.1, V-1, V-3 · **ADR-14** §9.1, §9.2 · **ADR-15** §7.2, §10, §12, RA-4, RA-R1 · **ADR-16** §4.2, §4.3, §4.4, §7, RC-3, RC-12, RC-13, BD-I4, BD-I5, P-I1, P-I2, P-I4, AG-1 · **ADR-17** AL-06, AL-08, AL-12, AL-13 · **APS-18** §8.1, §9.2, §9.3, §10.3, RE-1, RE-5, SC-R3, SC-R4, CA-08 · **APS-19** CD-11 · **DDD-01** §4.2, §5.4 · **DEV-00** R-22, R-38, D-A1, F-8 · **COM-07** §2, §5, §6 · **COM-09** §4.2, §5, §6 · **COM-12** · **COM-13** · **COM-14** · **COM-15** · **COM-16**.
