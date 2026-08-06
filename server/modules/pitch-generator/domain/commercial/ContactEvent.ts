// `ContactEvent` — Entidad · Aggregate Root.
//
// Autoridad: **ADR-16 §4.5, §6.1**. Desarrollado en PO-02 §5, ADR-13 E-9 y
// APS-18 §9.5. **Owner: el usuario. Nunca un agente** (APS-09 §9).
//
// **Qué es.** Lo que el usuario declara que ocurrió. **La única entidad del
// dominio que AKVEZ no produce.**
//
// **Qué no es.** **No es una Propuesta.** Producir y declarar son hechos
// distintos, y **fundirlos reintroduciría la conflación que cinco documentos
// acaban de corregir** (D-4). Sinónimos prohibidos por DDD-01 §8: `Envío`,
// `Interacción`, `Actividad`, `Touch` — AKVEZ **no envía y no observa**
// (PO-02 §6.2), y *Envío* atribuiría al sistema un acto del usuario.

import { DeclaredOutcome } from "./declaredOutcome";
import { SequenceMoment } from "./sequenceMoment";
import { LeadReference } from "./leadReference";

/**
 * Identidad: **`(Lead, momento de la secuencia, marca temporal)`**
 * (ADR-16 §4.5 · AG-1).
 *
 * **OBS-08 de DDD-01** advierte que la tabla de cardinalidades declara
 * `Proposal → ContactEvent` como 1 : 0..1, mientras que esta identidad es por
 * **momento** y no por emisión de `Proposal`. **Prevalece la identidad**: la
 * declaración se refiere al momento, no a una emisión concreta.
 */
export interface ContactEventId {
  lead: LeadReference;
  moment: SequenceMoment;
  /** Marca temporal de la declaración, en formato ISO-8601. */
  declaredAt: string;
}

/**
 * **Invariantes** (ADR-16 §4.5):
 *
 * - **CE-I1 · RC-14** — **es el único hecho que lleva un `Lead` a
 *   `Contacted`**. Ningún otro evento comercial toca el estadio.
 * - **CE-I2** — **sin él la secuencia no avanza**: el sistema no supone lo que
 *   no le consta.
 * - **CE-I3** — una **manifestación prevalece sobre toda lectura inferida** y
 *   **versiona el `BuyerDiagnosis`**.
 * - **CE-I4** — **nunca lo genera el sistema**: ni por inferencia, ni por
 *   tiempo, ni por detección.
 *
 * **Ciclo: solo crece.** Ninguna declaración se elimina ni se altera
 * (S-1 · S-2 de PO-02 §7.2). **Nadie puede modificarlo.**
 *
 * **Evento que lo afecta:** **E-9**, con **semántica condicional** — la única
 * del catálogo junto a E-2/E-2b. El detalle de los tres efectos está en
 * `declaredOutcome.ts`.
 *
 * > **Es la entidad que hace honesto el modelo.** Sin ella, AKVEZ registraría
 * > como hechos cosas que solo ha producido (ADR-16 §4.5).
 */
export interface ContactEvent {
  id: ContactEventId;
  /** Lo que el usuario declara que ocurrió (APS-18 §9.5). */
  outcome: DeclaredOutcome;
}
