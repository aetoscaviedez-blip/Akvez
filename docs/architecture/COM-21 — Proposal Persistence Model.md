# COM-21 — Modelo de Persistencia de `Proposal`

| Campo | Valor |
| --- | --- |
| Código | COM-21 |
| Clasificación | **Contrato técnico definitivo** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🔵 **Define la forma. No implementa y no enmienda ningún ADR** |
| Fecha | 2026-08-03 |
| Motivo | Sprint 13 |
| Relacionado | COM-19 · **COM-20** *(la decisión que este documento traduce)* · ADR-08 · ADR-13 §10.3 |

> **Cero código.** Este documento fija la forma que implementará después `ProposalRepositoryAdapter`.

---

# 1. Objeto y nomenclatura

**`ProposalRecord` designa en este documento el Persistence Contract del activo A-6.** Hoy ese contrato existe y se llama `Proposal`, en `shared/persistence/contracts/Proposal.ts`.

> **No se propone renombrarlo.** «Record» se usa aquí para distinguirlo en prosa de la entidad de dominio homónima; **el nombre del tipo no cambia**.

**ADR-08 §6 distingue tres planos, y este documento define los tres:**

| Plano | Qué es | Fichero |
| --- | --- | --- |
| **Persistence Contract** | La forma de negocio en la frontera | `contracts/Proposal.ts` |
| **Persistence Model** | **La forma efectivamente almacenada**, con identidad y metadatos | `models/ProposalModel.ts` — **no existe** |
| **Repository Interface** | Lo que `application/` consume | `repositories/ProposalRepository.ts` |

---

# 2. El registro definitivo

## 2.1 `ProposalRecord` — Persistence Contract

| Campo | Forma exacta | Obligatorio | Regla |
| --- | --- | :-: | --- |
| **`leadId`** | `string` | ✅ | Identidad · ADR-16 §4.4 · AG-1 |
| **`moment`** | Conjunto cerrado de seis valores, replicado *(`SequenceMoment`)* | ✅ | Identidad · APS-18 §9.2 |
| **`issue`** | `number` | ✅ | Identidad · **V-1 · P-I2**: regenerar añade |
| **`strategy`** | El contrato de persistencia de `CommercialStrategy` — **diez contenidos** | ✅ | **P-I1** — sin ella no puede explicarse |
| **`affirmableFacts`** | **`AffirmableFactRecord[]`** *(§3)* | ✅ | **P-I4** · APS-18 §11.1 · **COM-20** |
| **`text`** | `string` | ✅ | Es el contacto emitido |
| **`channel`** | Conjunto cerrado de tres valores, replicado *(`Channel`)* | ✅ | APS-18 §8.1 |
| **`criteriaVersion`** | `string` | ✅ | **RC-13** |
| **`issuedAt`** | `string` ISO-8601 | ✅ | **V-3** — cada emisión conserva su marca |

**Nueve campos. Ninguno se añade y ninguno se retira respecto del contrato vigente** *(§4)*.

**El `id` no pertenece al contrato:** lo aporta la persistencia y viaja en `Identified<T>`, que es lo que devuelven las lecturas. **El dominio nunca conoce ese tipo** *(ADR-05 §7, Decisión 3)*.

## 2.2 `CommercialStrategy` — Persistence Contract, con un solo cambio

| Campo | Forma | Cambio |
| --- | --- | :-: |
| `objective` · `barrier` · `focus` · `emotion` · `relevanceElement` · `expectedOutcome` | `string` o conjunto cerrado replicado | — |
| `resumedThread` · `openedThread` | `string`, **opcionales** — la ausencia significa ausencia *(R-38)* | — |
| `channel` · `moment` | Conjuntos cerrados replicados | — |
| **`evidenceBase`** | **`AffirmableFactRecord[]`** | ⚠️ **Cambia** |

## 2.3 `ProposalModel` — Persistence Model

**Lo que el motor almacena.** Añade identidad y metadatos, y **degrada los conjuntos cerrados a `string`**, exactamente como `CommercialSequenceModel` y `BuyerDiagnosisModel`: *«el modelo describe cómo se almacena, y la validación del vocabulario pertenece al dominio»*.

| Campo | Forma | Nota |
| --- | --- | --- |
| `id` · `userId` | `string` | Metadatos de propiedad · **F-3** vigente |
| `leadId` · `issue` · `text` · `criteriaVersion` · `issuedAt` | Como en el contrato | — |
| `moment` · `channel` | **`string`** | Conjunto cerrado degradado |
| `strategy` | `CommercialStrategyModel` | Con `evidenceBase: AffirmableFactModel[]` |
| `affirmableFacts` | **`AffirmableFactModel[]`** | §3.2 |
| `createdAt` | `string` | — |

> ### ⚠️ **`ProposalModel` NO lleva `updatedAt`, y es una consecuencia normativa, no una omisión.**
>
> **ADR-13 §10.3 clasifica A-6 como versionado, no actualizable.** Una fila de propuesta **nunca se modifica**: regenerar **añade una emisión** *(V-1 · P-I2)*. Registrar «última actualización» sugeriría que existe una operación que la produce, **y no existe** — el repositorio no expone `update`.
>
> **Es el mismo criterio con que `BuyerDiagnosisModel` lo omite y `CommercialSequenceModel` sí lo lleva**, por ser A-12 el único de los tres que se actualiza.

---

# 3. `affirmableFacts` — estructura definitiva

## 3.1 `AffirmableFactRecord` — en el Persistence Contract

| Campo | Forma exacta | Por qué está |
| --- | --- | --- |
| **`statement`** | `string`, no vacío | **P-I4 · CA-18** — es el objeto del contraste texto ↔ lista |
| **`kind`** | Conjunto cerrado de cuatro valores, replicado: `presencia_web` · `contacto_publico` · `reputacion_publicada` · `factor_medido` | **COM-20 §3.2** — ambiguo en dos de sus cuatro valores; recuperarlo obligaría a **interpretar el enunciado** |
| **`source.observation`** | Conjunto cerrado de tres valores, replicado: `atributo_de_empresa` · `reputacion_publicada` · `evaluacion` | **APS-18 §11.1** — el rastro hasta el hallazgo |
| **`source.source`** | `string`, no vacío — **la Fuente de la Referencia de Origen** | **ADR-12 §7.4** — *«exige que exista uno y lo conserva»* |

**La forma de `source` se conserva anidada**, como en la entidad: **ADR-08 §5** pide que el contrato *«replique la forma de la entidad sin importarla»*, y aplanarla obligaría a reconstruir una estructura al leer.

> **`AffirmableFactRecord` no es `AffirmableFact`.** Es **la proyección conservable** que COM-20 §6 decidió: se declara en la frontera, con nombre propio, y **nadie debe confundirlo con el hecho de dominio**.

## 3.2 `AffirmableFactModel` — en el Persistence Model

**Misma estructura, con los dos conjuntos cerrados degradados a `string`**, por la razón de §2.3: el modelo describe el almacenamiento; el vocabulario lo valida el dominio.

## 3.3 Por qué `lead` no forma parte del registro

**COM-20 §3.1 lo demostró, y la demostración es la justificación:**

1. La proyección recibe **un solo `ObservedInput`**, que declara **un solo `lead`**.
2. **Todo hecho producido copia ese valor**; no hay camino por el que entre un hecho de otro Lead.
3. La emisión persiste **la lista de esa propuesta**, cuya identidad declara **el mismo Lead**.

> **Por tanto `∀ hecho : hecho.lead = ProposalRecord.leadId`, y el dato ya está en la fila — una vez.**

**Conservarlo por hecho multiplicaría por N un valor idéntico** en el único registro que existe para ser auditado, y **AG-1 ya queda satisfecho por la identidad del agregado**.

**Al reconstruir, `lead` se deriva; no se inventa.** **R-38** prohíbe *«sustituir un dato inexistente»* — y éste existe, está en la misma fila y la igualdad es demostrable. **Derivar no es rellenar.**

---

# 4. Cambios respecto al contrato actual

| | Campo | Detalle |
| --- | --- | --- |
| **Permanece** | `leadId` · `moment` · `issue` · `strategy` · `text` · `channel` · `criteriaVersion` · `issuedAt` | **Ocho de nueve, sin tocar** |
| **Permanece** | Los nueve contenidos restantes de `CommercialStrategy` | Sin tocar |
| **Desaparece** | **Nada** | Ningún campo se retira |
| **Cambia de tipo** | **`Proposal.affirmableFacts`** | `string[]` → **`AffirmableFactRecord[]`** |
| **Cambia de tipo** | **`CommercialStrategy.evidenceBase`** | `string[]` → **`AffirmableFactRecord[]`** |
| **Se añade** | **`AffirmableFactRecord`** *(contrato)* y **`AffirmableFactModel`** *(modelo)* | Tipos nuevos, no campos |
| **Se añade** | Dos conjuntos cerrados replicados en `contracts/commercialValues.ts`: **`FactKind`** y la observación de origen | Réplicas, no decisiones |

> **Ningún campo se añade ni se retira del registro. Exactamente dos cambian de tipo, y son el mismo tipo.**

---

# 5. ⚠️ La propagación alcanza a A-12

**El Persistence Contract de la estrategia es compartido.** `contracts/CommercialStrategy.ts` lo importan **dos** contratos:

```text
contracts/CommercialStrategy.ts  ──┬──►  contracts/Proposal.ts          (A-6)
                                   └──►  contracts/CommercialSequence.ts (A-12)
```

**Y A-12 tiene su propia réplica en el modelo:** `models/CommercialSequenceModel.ts` declara `CommercialStrategyModel.evidenceBase: string[]`.

**Consecuencia: cambiar `evidenceBase` una vez alcanza la persistencia de la Secuencia Comercial.**

## 5.1 Por qué no se evita, y por qué no es grave

| Alternativa | Veredicto |
| --- | :-: |
| **Un contrato de estrategia propio para A-6**, dejando A-12 con `string[]` | ⛔ **Peor.** La misma estrategia se almacenaría de dos formas según qué agregado la contenga — **exactamente la divergencia que toda la serie COM ha ido eliminando** |
| **Cambiar el contrato compartido una vez** | ✅ **Es la consecuencia coherente.** La estrategia que A-12 conserva por contacto **es la misma**, y **P-I1 y APS-18 §11.1 no dejan de aplicarle por estar en otro agregado** |

**Mitigación de hecho:** **A-12 no almacena ninguna estrategia hoy.** `CreateSequence` deja toda `strategy` ausente —verificado con prueba— y `RegisterContact` no existe. **El cambio es declarativo**: alcanza al tipo, no a datos escritos.

## 5.2 Lo que esto exige

> **Autorización explícita.** Sprints anteriores congelaron `CommercialSequence` y su persistencia. **Este documento no la modifica y no propone modificarla por su cuenta**: deja constancia de que la implementación de COM-20 **no puede confinarse a A-6** y necesita ese permiso.

---

# 6. Comprobación de reconstrucción

## 6.1 `ClosedFactList`

| Campo de `AffirmableFact` | De dónde sale |
| --- | --- |
| `statement` | `AffirmableFactRecord.statement` |
| `kind` | `AffirmableFactRecord.kind` |
| `source` | `AffirmableFactRecord.source` |
| `lead` | **`ProposalRecord.leadId`** — derivación demostrada *(§3.3)* |

> ✅ **Reconstruible íntegra.**

## 6.2 `CommercialStrategy`

**Diez contenidos: nueve ya se conservaban y el décimo —`evidenceBase`— pasa a reconstruirse por §6.1.**

> ✅ **Reconstruible íntegra.**

## 6.3 `Proposal`

| Parte | Estado |
| --- | :-: |
| `id` = `(leadId, moment, issue)` | ✅ |
| `strategy` | ✅ *(§6.2)* |
| `affirmableFacts` | ✅ *(§6.1)* |
| `text` · `channel` · `criteriaVersion` | ✅ |

> ## ✅ **Reconstruible íntegra.**
>
> **COM-19 §6 respondió «No» a esta misma pregunta.** Con este contrato la respuesta pasa a **«Sí»** — y la causa de aquel «No» era exactamente la que COM-20 resolvió.

## 6.4 Pérdidas residuales

**Ninguna afecta a la reconstrucción del agregado. Las cuatro estaban ya identificadas y ninguna depende de este contrato.**

| # | Pérdida | Dónde está registrada |
| :-: | --- | --- |
| **1** | **`issuedAt` no tiene sitio en la entidad de dominio**: se persiste y **la reconstrucción lo descarta**, porque `Proposal` no lo declara | **`COM-12 RC-4`** |
| **2** | **Qué emisión del diagnóstico se leyó** — la reproducibilidad de ADR-15 §7.2 sigue apoyada en inferencia temporal | **COM-19 §7.3** |
| **3** | **De qué secuencia nació la propuesta** | **COM-16 §8.1** |
| **4** | **Ambigüedad si `channel` o `moment` divergieran** entre el nivel superior y la estrategia | **COM-18 §3.3** |

**Y una condición de vigencia**, heredada de COM-20 §6.5: **la derivación de `lead` se apoya en que la proyección produce hechos de un solo Lead.** Si eso cambiara, la derivación caería y `lead` tendría que conservarse por hecho.

---

# 7. Ficheros que cambiarán en la implementación

## 7.1 Se modifican

| # | Fichero | Qué cambia |
| :-: | --- | --- |
| **1** | `shared/persistence/contracts/Proposal.ts` | `affirmableFacts` cambia de tipo |
| **2** | `shared/persistence/contracts/CommercialStrategy.ts` | `evidenceBase` cambia de tipo |
| **3** | `shared/persistence/contracts/commercialValues.ts` | Se replican los dos conjuntos cerrados |
| **4** | `shared/persistence/models/CommercialSequenceModel.ts` | `CommercialStrategyModel.evidenceBase` sigue al contrato — **§5** |
| **5** | `shared/persistence/adapters/commercialSequenceMapper.ts` | **Revisar**; su código copia la lista sin inspeccionarla y podría no necesitar cambio — **§5** |
| **6** | `modules/pitch-generator/application/generateProposal.ts` | La traducción a la frontera deja de reducir cada hecho a su enunciado, **en sus dos puntos** |
| **7** | Las tres suites de `generateProposal` | Aserciones sobre lo entregado a persistir |

## 7.2 Se crean

| # | Fichero | Qué es |
| :-: | --- | --- |
| **8** | `shared/persistence/contracts/AffirmableFact.ts` | `AffirmableFactRecord` — importado por los contratos de `Proposal` y `CommercialStrategy` |
| **9** | `shared/persistence/models/ProposalModel.ts` | §2.3 |
| **10** | `shared/persistence/adapters/proposalMapper.ts` | Contract ↔ Model, **funciones puras** *(ADR-08 §7 · R-26)* |
| **11** | `shared/persistence/adapters/inMemoryProposalAdapter.ts` | Database Adapter |
| **12** | `shared/persistence/adapters/proposalRepository.contract.ts` | **Suite de comportamiento**, como sus tres hermanos |
| **13** | `shared/persistence/adapters/inMemoryProposalAdapter.test.ts` | Ejecuta la suite |

## 7.3 **No** cambian

| Fichero | Por qué |
| --- | --- |
| `repositories/ProposalRepository.ts` | Sus firmas se expresan en términos de `Proposal`; **el tipo cambia por debajo** |
| `contracts/CommercialSequence.ts` | Usa el contrato de estrategia; no lo declara |
| `modules/pitch-generator/domain/commercial/*` | **La entidad nunca perdió nada**: ya declara `ClosedFactList` |
| `contracts/OutreachPitch.ts` · `repositories/OutreachPitchRepository.ts` | El par heredado sobre A-6, sin uso. **Su retirada es otra decisión** |
| Composition Root · Orchestrators · rutas | Pertenecen al cableado |

---

# 8. Decisiones abiertas sobre la persistencia de A-6

> **Sobre la forma del registro: ninguna.**

| Cuestión | Estado |
| --- | :-: |
| Qué se conserva de cada hecho | ✅ **Cerrado** — COM-20 |
| Forma exacta del contrato, del modelo y del elemento | ✅ **Cerrado** — este documento |
| `updatedAt` en el modelo | ✅ **Cerrado** — no lo lleva *(§2.3)* |
| `lead` por hecho | ✅ **Cerrado** — no se conserva *(§3.3)* |

**Lo que sigue abierto no es la forma del registro:**

| Cuestión | Naturaleza | Dónde |
| --- | --- | --- |
| **Autorización para tocar la persistencia de A-12** | **Permiso**, no decisión de diseño | §5.2 |
| **Unicidad de `(leadId, moment, issue)` en el motor real** | Ingeniería, con ADS-02 | **F-2** · COM-19 §7.2 |
| **`findCurrentByMoment`: vigente por `issue` o por `issuedAt`** | Contrato del repositorio | COM-19 §9 |
| **Origen de `issuedAt`** | Arquitectura | `COM-12 RC-4` |
| **Referencia al diagnóstico y a la secuencia** | Arquitectura | COM-19 §7.3 · COM-16 §8.1 |
| **Doble escritura de canal, momento y lista** | Arquitectura | COM-18 §3.3 |
| **`userId` de un solo inquilino** | Ingeniería | **F-3** |

---

# 9. Referencias

**ADR-05** §7, §14 · **ADR-08** §5, §6, §7, §10 · **ADR-12** §7.1, §7.4 · **ADR-13** §10.1, §10.3, V-1, V-3 · **ADR-15** §7.2 · **ADR-16** §4.4, RC-13, P-I1, P-I2, P-I4, AG-1 · **APS-18** §8.1, §9.2, §11.1, CA-18 · **DEV-00** R-26, R-27, R-38, F-2, F-3 · **COM-12** RC-4 · **COM-16** §8.1 · **COM-18** §3.3 · **COM-19** §6, §7, §9 · **COM-20**.
