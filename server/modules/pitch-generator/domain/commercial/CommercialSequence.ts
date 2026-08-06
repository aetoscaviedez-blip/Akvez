// `CommercialSequence` — Entidad · Aggregate Root.
//
// Autoridad: **ADR-16 §4.3**. Desarrollado en PO-02 §4, APS-18 §9, APS-20 §7 y
// ADR-13 A-12. Owner: **Pitch Generator**.
//
// **Qué es.** El plan de contactos que AKVEZ propone para conseguir una
// conversación con un Lead. **No es una lista de mensajes: es una estrategia con
// memoria** (APS-18 §9.1).
//
// **Qué no es.** No es un compromiso de envío (CS-I1). **No es automatización de
// seguimiento**: diseñar no es automatizar (PO-02 §2.2). **No obliga al usuario a
// nada**: puede ignorarla, alterarla o detenerla.
//
// Sinónimos prohibidos por DDD-01 §8: `Campaña`, `Cadencia`, `Drip`,
// `Follow-up automático` — las tres últimas implican **automatización**, fuera
// de la V1 (PO-02 §2 · SC-R6).

import { CommercialStrategy } from "./commercialStrategy";
import { DeclaredOutcome } from "./declaredOutcome";
import { SequenceMoment } from "./sequenceMoment";
import { IssueNumber, LeadReference } from "./leadReference";

/**
 * Identidad: **`(Lead, número de secuencia)`** (ADR-16 §4.3 · AG-1).
 */
export interface CommercialSequenceId {
  lead: LeadReference;
  sequence: IssueNumber;
}

/** Los cuatro estados de ADR-16 §4.3. Conjunto cerrado. */
export type SequenceStatus = "Diseñada" | "En curso" | "Concluida" | "Detenida";

/**
 * Un momento planificado de la secuencia, con lo que la secuencia conserva de
 * él: su estrategia, la `Proposal` emitida —**referenciada por identidad, nunca
 * contenida** (§5.4)— y el resultado declarado por el usuario.
 *
 * **No se llama `SequenceStep`.** `Paso`, `Touchpoint` y `Toque` son sinónimos
 * **prohibidos** de *Momento* (DDD-01 §8), y `SequenceStep` era uno de los
 * nombres que el enunciado original proponía.
 *
 * **§5.4 de DDD-01 — por qué la `Proposal` no vive dentro de este agregado:** la
 * secuencia **se actualiza** y la propuesta **se versiona**. Fundirlas obligaría
 * a versionar la secuencia en cada emisión de texto —«multiplicaría el volumen
 * sin aportar nada»— o a dejar de versionar la propuesta, **incumpliendo P-I2**.
 * Es el mismo razonamiento con que ADR-13 §6.2 separó A-11 de A-12.
 */
export interface PlannedMoment {
  moment: SequenceMoment;
  /** La estrategia decidida para **este** contacto (ADR-16 §4.3). */
  strategy?: CommercialStrategy;
  /**
   * Referencia por identidad a las emisiones de `Proposal` de este momento.
   * **Regenerar añade** (P-I2): un momento puede tener varias.
   */
  proposals: IssueNumber[];
  /**
   * Lo que el usuario declaró para este contacto. Ausente mientras no haya
   * declarado nada — **y mientras esté ausente, la secuencia no avanza**
   * (CE-I2 · APS-18 §9.5).
   */
  declaredOutcome?: DeclaredOutcome;
}

/**
 * **Invariantes** (ADR-16 §4.3):
 *
 * - **CS-I1** — es una propuesta, **no un compromiso**.
 * - **CS-I2 · SC-R2** — **concluye al alcanzar una conversación**.
 * - **CS-I3 · SC-R5** — agotarla o detenerla **no expulsa al Lead**.
 * - **CS-I4 · RC-7** — ningún momento se emite sin **acción del usuario para ese
 *   contacto concreto**.
 * - **CS-I5** — un Lead puede tener varias secuencias, y **una nueva no borra la
 *   anterior**.
 * - **CS-I6 · RC-8 · SC-R6** — **no contiene disparadores temporales**, en
 *   ninguna capa.
 * - **CE-I2** — **sin `ContactEvent` la secuencia no avanza**: el sistema no
 *   supone lo que no le consta.
 *
 * **Ciclo: se actualiza, no se versiona.** El rastro lo conserva el historial
 * (A-8) (ADR-13 §6.2).
 *
 * **Eventos que la afectan:** **E-8** diseñada o actualizada · **E-9** contacto
 * declarado *(actualiza)*.
 *
 * > **SC-R4 — el silencio es información**, no fracaso, y no autoriza a subir la
 * > presión.
 */
export interface CommercialSequence {
  id: CommercialSequenceId;
  status: SequenceStatus;
  /** Plan de momentos (APS-18 §9.2). */
  plan: PlannedMoment[];
  /** Momento vigente (ADR-16 §4.3). Ausente mientras no se haya iniciado. */
  currentMoment?: SequenceMoment;
}
