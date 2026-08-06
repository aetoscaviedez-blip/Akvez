# COM-34 — Propuesta de Retirada de `OutreachPitchRepository`

| Campo | Valor |
| --- | --- |
| Código | COM-34 |
| Clasificación | **Propuesta de enmienda** — fuera de la Clasificación Oficial de ADS-00 |
| Estado | 🟡 **Propuesta. No ejecutada.** Requiere pronunciamiento del Architecture Team |
| Fecha | 2026-08-04 |
| Motivo | Sprint COM-34, tarea 1 — deuda abierta desde **COM-13 §2.5** |
| Enmienda propuesta a | **ADR-08 §13** *(y, subordinadamente, **ADR-13 §6.2**)* |
| Relacionado | **COM-33 §4** *(la auditoría)* · COM-19 §10 · COM-21 · COM-22 §11 · COM-23 §7 punto 10 |

> **Cero cambios de código.** No se ha eliminado ningún fichero, no se ha modificado ningún import y no se ha tocado ningún ADR.
>
> **Este documento no retira nada. Propone retirar, y expone el obstáculo que lo impide hoy.**

---

# 1. La propuesta, en una frase

> ### **Retirar los tres ficheros del par heredado sobre A-6, previa enmienda de ADR-08 §13 — y previa resolución de una contradicción entre dos ADR `Approved` que este sprint ha encontrado y que no puede resolver.**

---

# 2. Qué es exactamente el par heredado

**Son tres ficheros, no dos**, y forman un ciclo cerrado sobre sí mismos:

| Fichero | Capa | Qué declara |
| --- | --- | --- |
| `modules/pitch-generator/domain/OutreachPitch.ts` | Entidad de dominio | La forma anterior de la propuesta |
| `shared/persistence/contracts/OutreachPitch.ts` | Persistence Contract | Su réplica en la frontera de persistencia |
| `shared/persistence/repositories/OutreachPitchRepository.ts` | Repository Interface | `save` · `findByLeadId` |

**Retirar uno deja a los otros sin razón de ser:** el repositorio es el único importador del contrato, y el contrato replica la entidad. Nada más los alcanza.

---

# 3. Evidencia de uso: **cero**

Verificado por búsqueda exhaustiva sobre `server/`, `src/` y `server.ts`.

| Dimensión | Resultado |
| --- | --- |
| **Consumidores** | **Ninguno** |
| **Imports** | **Ninguno.** La única mención en código es **un comentario** en `ProposalRepository.ts:9` |
| **Rutas HTTP** | **Ninguna** |
| **Pruebas** | **Ninguna.** No tiene suite de contrato |
| **Adapters** | **Ninguno lo implementa** |
| **Composition Root** | **No lo construye ni lo nombra** |

**El contraste es lo que lo hace concluyente.** Los otros cuatro repositorios del sistema tienen **todos** adapter y suite de contrato:

| Repository | Adapter | Suite de contrato |
| --- | :-: | :-: |
| `LeadRepository` | ✅ | ✅ |
| `LeadAnalysisRepository` | ✅ | — |
| `BuyerDiagnosisRepository` | ✅ | ✅ |
| `CommercialSequenceRepository` | ✅ | ✅ |
| `ProposalRepository` | ✅ | ✅ |
| **`OutreachPitchRepository`** | ❌ | ❌ |

> **No está «pendiente de conectar»: está fuera del grafo.** El Composition Root construye cinco repositorios y ninguno es éste.

---

# 4. Evidencia de sustitución conceptual por `ProposalRepository`

## 4.1 Los dos contratos, campo a campo

| `OutreachPitch` *(heredado)* | `Proposal` *(canónico)* | Correspondencia |
| --- | --- | --- |
| `leadId` | `leadId` | ✅ Directa |
| `channel` | `channel` | ✅ Directa |
| `subjectLine` | — | ⚠️ **Absorbido en `text`** |
| `message` | `text` | ✅ Directa |
| `strategyExplanation` | `strategy` *(`CommercialStrategy`, diez contenidos)* | ⚠️ **Sustituido, no traducido** |
| `isFallback` | — | ⚠️ **Retirado** |
| — | `moment` | ➕ Parte de la identidad |
| — | `issue` | ➕ Parte de la identidad |
| — | `affirmableFacts` | ➕ **La lista cerrada** |
| — | `criteriaVersion` | ➕ RC-13 |
| — | `issuedAt` | ➕ V-3 |

> ### **`strategyExplanation` es el punto decisivo, y no es una renombración.**
>
> El modelo heredado guardaba **una explicación en prosa** de la estrategia. El canónico guarda **la estrategia**: diez decisiones estructuradas *(APS-18 §8.1)* más la lista cerrada de hechos que la sostiene.
>
> **P-I1 lo exige:** una `Proposal` *«no es solo el texto — sin estrategia y evidencia no puede explicarse después»* *(ADR-16 §4.4)*. **Una prosa explicativa no satisface P-I1**: no es contrastable contra la lista cerrada, que es lo que **P-I4** y **CA-18** exigen.

## 4.2 Las tres operaciones

| `OutreachPitchRepository` | `ProposalRepository` | Qué cambia |
| --- | --- | --- |
| `save(pitch)` | `save(proposal)` — **append-only** *(V-1 · P-I2)* | El canónico declara la semántica; el heredado no |
| `findByLeadId(leadId)` | `findByLeadId(leadId)` | Equivalente |
| — | `findCurrentByMoment(leadId, moment)` | ➕ Vigencia por momento *(V-2)* |
| — | `findVersionsByMoment(leadId, moment)` | ➕ **Hace verificable P-I2** |

**El heredado no puede expresar el versionado**, porque no conoce ni `moment` ni `issue` — los dos campos que, con `leadId`, forman la identidad del agregado *(ADR-16 §4.4 · AG-1)*.

## 4.3 Lo que ya está construido sobre el canónico

`ProposalModel` · `proposalMapper` · `commercialStrategyMapper` · `inMemoryProposalAdapter` · `proposalRepository.contract.ts` + su suite · registro en el Composition Root. **Todo verde.**

## 4.4 El vocabulario ya lo declaró prohibido

**DDD-01 §8** —glosario **ratificado** como *«vocabulario obligatorio de todo documento, código y conversación del dominio comercial»*— registra **`Pitch`, `Mensaje`, `Copy` y `Outreach` como sinónimos prohibidos de `Proposal`**.

> **DDD-01 §8 es vocabulario, no derogación.** Prohíbe **nombrar** así al concepto; **no retira** un fichero que un ADR sigue nombrando. La distinción importa: es la diferencia entre corregir el lenguaje y modificar una decisión de arquitectura.

---

# 5. 🔴 El obstáculo — y es doble

## 5.1 Obstáculo 1 — ADR-08 §13 lo declara trabajo pendiente

**ADR-08 v1.2, `Approved`, §13 «Impacta / habilita»:**

> *«La conexión real de `LeadRepository`, `LeadAnalysisRepository` y **`OutreachPitchRepository`** a `application/` de cada módulo.»*

**Un ADR vigente declara que ese repositorio debe conectarse.** Retirarlo sin enmendar ADR-08 dejaría el código contradiciendo un ADR `Approved`, que es exactamente la situación que ADR-08 fue escrito para resolver *(§1)*.

> **Riesgo directo, ya registrado como COM-33 §6 riesgo 2:** un sprint futuro podría **conectarlo** creyendo que cumple ADR-08 §13, y entonces habría **dos repositorios sobre A-6 en uso** — lo que COM-19 §10 declara imposible: *«El motor no puede implementar ambos»*.

## 5.2 🔴 Obstáculo 2 — **hallazgo nuevo de este sprint**: dos ADR `Approved` describen A-6 de forma distinta

| Documento | Versión · Estado | Fecha | Qué dice que contiene **A-6** |
| --- | --- | --- | --- |
| **ADR-13 §6.2** | v1.2 · ✅ `Approved` | **2026-07-30** | **«Asunto · mensaje · tono»** |
| **ADR-16 §4.4** | v1.1 · ✅ `Approved` | **2026-07-30** | **«La estrategia · la lista cerrada de hechos afirmables · el texto · el canal · la versión del criterio»** |

> ### **Los dos Persistence Contracts del repositorio son réplicas fieles — de ADR distintos.**
>
> | Contrato en código | Réplica de |
> | --- | --- |
> | `contracts/OutreachPitch.ts` — `subjectLine` · `message` · `strategyExplanation` | **ADR-13 §6.2**: *asunto · mensaje · tono* |
> | `contracts/Proposal.ts` — `strategy` · `affirmableFacts` · `text` · `channel` · `criteriaVersion` | **ADR-16 §4.4** |
>
> **Ninguno de los dos ficheros es un error de implementación.** Cada uno replica lo que un ADR `Approved` declara. **La duplicación en el código es el reflejo de una duplicación en el Blueprint.**

### Por qué la regla de precedencia **no** lo resuelve

**ADS-00 R-4:** *«Dentro de una misma categoría prevalece el documento más reciente en estado `Approved`.»*

| Criterio | ADR-13 | ADR-16 | ¿Discrimina? |
| --- | :-: | :-: | :-: |
| Categoría | ADR | ADR | ❌ La misma |
| Estado | `Approved` | `Approved` | ❌ El mismo |
| Última actualización | **2026-07-30** | **2026-07-30** | ❌ **La misma fecha** |
| Sprint de aprobación | GOV-01 / *Architecture Freeze* | *Architecture Freeze* | ❌ El mismo bloque |

> ### **R-4 es indeterminada en este caso.** Ambos son ADR, ambos `Approved`, ambos actualizados el mismo día en el mismo bloque de gobernanza.

### Y por qué este documento no elige

**ADS-00 R-5:** *«Una IA nunca resolverá un conflicto documental por cuenta propia. Deberá señalarlo y aplicar esta jerarquía únicamente para determinar qué documento debe corregirse.»*

**Se señala. No se resuelve.**

> **Nota de alcance.** La contradicción es **estrecha y localizada**: es **una fila de una tabla de inventario**. ADR-13 §6.2 inventaría *qué activos son durables*; **ADR-16 es el ADR de dominio y §4.4 es la definición canónica de la entidad**. Todo indica que la fila de ADR-13 quedó sin actualizar cuando ADR-16 fijó `Proposal` — **pero «todo indica» no es una resolución documental**, y ADR-13 §10.3, §12 y §13 *(donde A-6 se versiona y E-5 lo emite)* siguen vigentes sin discusión.

---

# 6. Enmienda propuesta — texto exacto

**No aplicada.** Se propone para que el Architecture Team la evalúe.

## 6.1 ADR-08 §13 — «Impacta / habilita»

| | Texto |
| --- | --- |
| **Hoy** | *«La conexión real de `LeadRepository`, `LeadAnalysisRepository` y `OutreachPitchRepository` a `application/` de cada módulo.»* |
| **Propuesto** | *«La conexión real de `LeadRepository`, `LeadAnalysisRepository` y `ProposalRepository` a `application/` de cada módulo. **`OutreachPitchRepository` se retira: declaraba el activo A-6 bajo el modelo anterior a ADR-16 §4.4 y ha sido sustituido por `ProposalRepository`, que sí expresa la identidad `(Lead, momento, número de emisión)` y la semántica de versionado de ADR-13 §10.3.»*** |

**Registro en el Historial de Versiones de ADR-08** — v1.3, con motivo: *«Sustitución del par heredado sobre A-6 tras la entrada en vigor de ADR-16 §4.4. Ningún otro contenido decisional resulta afectado.»*

> **La enmienda no toca §5, §6, §7, §10 ni ninguna decisión de frontera.** ADR-08 decide **cómo** se declara un Persistence Contract, no **cuáles** existen. Solo cambia una entrada de su lista de trabajo habilitado.

## 6.2 ADR-13 §6.2 — fila A-6 *(subordinada, y no es competencia de este documento)*

| | Texto |
| --- | --- |
| **Hoy** | `| **A-6** | **Propuesta comercial** | Asunto · mensaje · tono | Al generarse. **Versionada** |` |
| **Propuesto** | `| **A-6** | **Propuesta comercial** | La estrategia · la lista cerrada de hechos afirmables · el texto · el canal · la versión del criterio *(ADR-16 §4.4)* | Al generarse. **Versionada** |` |

> ⚠️ **Esta segunda enmienda es la que crea el conflicto de §5.2 y NO se propone como acto de este sprint.** Se transcribe únicamente para que el Architecture Team vea el alcance exacto: **una fila**. Quién puede modificar ADR-13 y con qué autoridad es una cuestión de gobernanza que este documento no decide.

---

# 7. Plan de ejecución, para cuando se autorice

**Precondición: enmienda a ADR-08 §13 registrada en su Historial de Versiones.**

| # | Acción | Fichero |
| :-: | --- | --- |
| 1 | Eliminar | `shared/persistence/repositories/OutreachPitchRepository.ts` |
| 2 | Eliminar | `shared/persistence/contracts/OutreachPitch.ts` |
| 3 | Eliminar | `modules/pitch-generator/domain/OutreachPitch.ts` |
| 4 | Actualizar comentario | `shared/persistence/repositories/ProposalRepository.ts:9-12` — retirar la nota de coexistencia |
| 5 | Actualizar comentario | `shared/persistence/contracts/Proposal.ts:7-13` — retirar la nota de coexistencia |
| 6 | Verificar | `npm run lint` · `npx tsc --noEmit` · `npm test` |

**Impacto esperado en pruebas: ninguno.** Ninguna prueba los referencia. **197/197 debe mantenerse.**

## 7.1 Lo que este plan **NO** incluye

> **`generateOutreachPitch` y su puerto `pitchDraftingPort` NO forman parte de esta retirada.**
>
> El caso de uso heredado **está vivo y en producción**: lo usa `/api/prospect/outreach`, lo construye el Composition Root y lo expone la Agent API. **F-1** *(dos puertos de redacción)* es una deuda **distinta**, con su propio calendario, y esta propuesta no la toca ni la prejuzga.

---

# 8. Riesgos

| # | Riesgo | Severidad | Nota |
| :-: | --- | :-: | --- |
| **1** | **Retirar sin enmendar ADR-08 §13** deja el código contradiciendo un ADR `Approved` | 🔴 Alta | Es la razón por la que este sprint no ejecuta |
| **2** | **No retirar** deja vivo el riesgo inverso: un sprint futuro **conecta** el repositorio creyendo cumplir ADR-08 §13, y aparecen dos repositorios sobre A-6 | 🔴 Alta | COM-33 §6 riesgo 2. **El tiempo no lo reduce** |
| **3** | **La contradicción ADR-13 / ADR-16 sobre A-6 permanece abierta** aunque se enmiende ADR-08 | 🟡 Media | §5.2. Es independiente de la retirada: existiría igual |
| **4** | Enmendar ADR-13 §6.2 **sin auditar el resto del inventario §6.2** | 🟡 Media | A-4 y A-5 podrían arrastrar el mismo desfase. **No auditado en este sprint** |

---

# 9. Qué se pide

| # | Decisión | Quién |
| :-: | --- | --- |
| **1** | **Autorizar la enmienda de ADR-08 §13** *(§6.1)* y, con ella, la retirada de los tres ficheros *(§7)* | **Architecture Team** |
| **2** | **Pronunciarse sobre la contradicción ADR-13 §6.2 / ADR-16 §4.4** *(§5.2)* — o declararla fuera del alcance y registrarla como deuda con propietario | **Architecture Team**, y si se estima que toca materia de producto, **Product Office** |
| **3** | **Decidir si el inventario de ADR-13 §6.2 se audita entero** o solo la fila A-6 | **Architecture Team** |

> **Ninguna de las tres requiere código.** La 1 desbloquea seis pasos ya escritos y verificables en una sola ejecución.

---

# 10. Referencias

**ADR-08** v1.2 §1, §5, §10, §13 · **ADR-12** §12.1, §12.2 · **ADR-13** v1.2 §6.2, §10.3, §12.3, §13 · **ADR-16** v1.1 §4.4 *(P-I1 a P-I5)* · **APS-18** §8.1, §11.1 · **ADS-00** R-3, R-4, R-5 · **DDD-01** §8 *(glosario ratificado)* · **DEV-00** R-22, R-26, R-27 · **COM-13** §2.5 · **COM-19** §10 · **COM-21** · **COM-22** §11 · **COM-23** §7 punto 10 · **COM-33** §4, §6.


---

> ## Superseded by ADR-13 v1.3 and ADR-19
>
> **Registrado el 2026-08-04, Sprint COM-39.** Este documento **no se elimina y no se marca `Deprecated`**: conserva su valor como registro del análisis que condujo a las decisiones.
>
> **La supersesión alcanza a las materias decididas** — contenido canónico de A-6, ordenamiento de versiones de la Propuesta, patrón de construcción de la Agent API y garantías de identidad de F-2 *(Capa A.2)*. **Ante discrepancia prevalecen `ADR-13 v1.3` y `ADR-19`.**
>
> ⚠️ **No alcanza a las cuestiones aquí registradas que siguen abiertas** — señaladamente la **enmienda de ADR-08 §13** *(COM-34 §6.1)*, la **Capa B de F-2** *(ADS-02 §3)* y los bloqueos **B-1**, **B-2**, **CH-01/02/03** y **F-1**, que ninguna de las dos decisiones toca.
