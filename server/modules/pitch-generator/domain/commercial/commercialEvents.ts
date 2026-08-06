// Domain Events comerciales — declaración.
//
// Autoridad: **ADR-13 §13.1** (el catálogo) y **ADR-16 D-6 · §6** (la
// correspondencia entidad ↔ evento).
//
// **AG-3 — toda escritura pasa por un evento declarado.** El catálogo de ADR-13
// §13.1 es **cerrado**: *«ningún evento no enumerado aquí podrá escribir en la
// Biblioteca»* (§13.4). Son **nueve**, y **cuatro pertenecen al dominio
// comercial** — E-5, E-7, E-8 y E-9. **Este fichero declara esos cuatro y no
// crea ninguno.** Añadir uno exigiría enmendar ADR-13, que es un documento
// `Approved`.
//
// **Solo E-9 modifica el estadio de un Lead** (ADR-16 §6.2 · CE-I1 · RC-14).
//
// ── Lo que NO existe, y por qué ────────────────────────────────────────────
//
// · **`LeadCreated`** — el Registro es **E-2**, pertenece al **Lead Hunter**
//   (APS-03 §7.1) y **el dominio comercial no crea Leads** (D-5).
// · **`CommercialStateChanged`** — **no existe y no puede existir**: el
//   Commercial State es la variable **BD-1** del diagnóstico (BD-I4) y reside
//   dentro de A-11, que **no es un activo propio** (ADR-13 §6.2). Cambia cuando
//   se versiona el diagnóstico, esto es, con E-7 o con E-9 condicional.
// · **Un evento de manifestación independiente** — la manifestación del
//   comprador es **contenido del `ContactEvent`**, y su efecto —versionar
//   A-11— ocurre **dentro de E-9** (ADR-16 §6.1 · CE-I3). Declararlo aparte
//   fundiría dos hechos que D-4 separa expresamente.

import { BuyerDiagnosisId } from "./BuyerDiagnosis";
import { CommercialSequenceId } from "./CommercialSequence";
import { ContactEventId } from "./ContactEvent";
import { DeclaredOutcome } from "./declaredOutcome";
import { ProposalId } from "./Proposal";

/**
 * Los códigos del catálogo cerrado que pertenecen al dominio comercial
 * (ADR-13 §13.1). **No es una numeración propia: es la del catálogo.**
 */
export type CommercialEventCode = "E-5" | "E-7" | "E-8" | "E-9";

/**
 * **E-5 · «Propuesta comercial emitida»** — nombre oficial de ADR-13 §13.1.
 *
 * | | |
 * | --- | --- |
 * | **Agregado origen** | `Proposal` |
 * | **Autor** | Pitch Generator |
 * | **Semántica** | **Versiona.** Regenerar añade; nunca sustituye (P-I2) |
 * | **Activos afectados** | **A-6** · A-8 · A-10 |
 *
 * **No actualiza el estadio.** ADR-13 v1.2 **corrigió E-5 retirándole A-3**:
 * emitir una Propuesta no contacta a nadie (P-I3 · LS-3 · PO-02 §5).
 */
export interface ProposalIssued {
  code: "E-5";
  proposal: ProposalId;
}

/**
 * **E-7 · «Diagnóstico comercial emitido»** — nombre oficial de ADR-13 §13.1.
 *
 * | | |
 * | --- | --- |
 * | **Agregado origen** | `BuyerDiagnosis` |
 * | **Autor** | Pitch Generator |
 * | **Semántica** | **Versiona.** Cada emisión añade; ninguna retira |
 * | **Activos afectados** | **A-11** · A-8 · A-10 |
 *
 * **BD-I5** — no produce puntuación ni orden, y **ningún resultado del
 * diagnóstico puede alterar el Opportunity Score** (APS-19 §3).
 */
export interface BuyerDiagnosisIssued {
  code: "E-7";
  diagnosis: BuyerDiagnosisId;
}

/**
 * **E-8 · «Secuencia comercial diseñada o actualizada»** — nombre oficial de
 * ADR-13 §13.1.
 *
 * | | |
 * | --- | --- |
 * | **Agregado origen** | `CommercialSequence` |
 * | **Autor** | Pitch Generator |
 * | **Semántica** | **Actualiza.** No versiona: el rastro lo conserva A-8 |
 * | **Activos afectados** | **A-12** · A-8 · A-10 |
 *
 * **Diseñar no es emitir.** CS-I4 · RC-7 — ningún momento de la secuencia se
 * emite sin acción del usuario **para ese contacto concreto**, y CS-I6 · RC-8
 * prohíben todo disparador temporal.
 */
export interface CommercialSequenceDesignedOrUpdated {
  code: "E-8";
  sequence: CommercialSequenceId;
}

/**
 * **E-9 · «Contacto declarado»** — nombre oficial de ADR-13 §13.1.
 *
 * | | |
 * | --- | --- |
 * | **Agregado origen** | `ContactEvent` |
 * | **Autor** | **El usuario. Nunca un agente** (APS-09 §9 · CE-I4) |
 * | **Semántica** | Actualiza · **versiona A-11 condicionalmente** |
 * | **Activos afectados** | A-3 · A-11 · A-12 · A-8 |
 *
 * **Es el único evento del catálogo con semántica condicional junto a
 * E-2/E-2b**, y **el único que puede llevar un Lead a `Contacted`**
 * (CE-I1 · RC-14 · PO-02 §5).
 *
 * `outcome` viaja en el evento porque **de él depende su propio efecto**
 * (ADR-16 §6.1): si contiene manifestación, versiona el `BuyerDiagnosis`
 * (CE-I3). **Aquí solo se declara el dato; la decisión es de `domain/` y su
 * aplicación, de `RegisterContact`** — caso de uso que no pertenece a esta fase.
 *
 * ⚠️ **OBS-06 de DDD-01 — tres listas de activos divergentes para este evento:**
 * ADR-16 §6 le atribuye A-7 · A-8; ADR-13 §13.1, A-3 · A-11 · A-12 · A-8; y
 * ADR-16 §6.1, A-3 · A-12 · A-8 más A-11 condicional. **Se transcribe ADR-13,
 * que es el catálogo y prevalece.** La observación sigue abierta y no se
 * resuelve aquí.
 */
export interface ContactDeclared {
  code: "E-9";
  contact: ContactEventId;
  outcome: DeclaredOutcome;
}

/**
 * Unión discriminada por literal de los cuatro eventos comerciales.
 *
 * Discriminada por `code` —el código del catálogo— y no por un nombre libre:
 * con `strict` activo, olvidar una rama es un error de compilación y no un fallo
 * en producción (ADR-17 §7.3). **Ampliarla sin enmendar ADR-13 §13.1 violaría
 * la regla de cierre de §13.4 y D-6.**
 */
export type CommercialDomainEvent =
  | ProposalIssued
  | BuyerDiagnosisIssued
  | CommercialSequenceDesignedOrUpdated
  | ContactDeclared;
