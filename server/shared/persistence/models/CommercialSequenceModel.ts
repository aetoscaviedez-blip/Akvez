// Persistence model de la Secuencia Comercial (A-12) — la representación
// almacenada, distinta de la entidad de dominio y del Persistence Contract
// (ADR-08 §6). Declarado independientemente y verificado por lectura directa —
// **no importado**, conforme a ADR-08 §10 y **R-27**.
//
// Los conjuntos cerrados viajan como `string`, igual que en
// `BuyerDiagnosisModel`: el modelo describe cómo se almacena, y la validación del
// vocabulario pertenece al dominio.
//
// **SÍ lleva `updatedAt`, y es la diferencia con A-11.** ADR-13 §10.3 declara que
// la Secuencia Comercial **no se versiona: se actualiza** — «su estado cambia con
// cada contacto y A-8 ya conserva íntegro el rastro de esos cambios». Una fila de
// secuencia **sí se modifica**, y registrar cuándo es información legítima.
// `BuyerDiagnosisModel` no lo lleva por la razón inversa.

import { AffirmableFactModel } from "./AffirmableFactModel";

/**
 * Forma almacenada de la Commercial Strategy (APS-18 §8.1).
 *
 * **Se declara aunque esta fase no la escriba nunca**: el Persistence Contract ya
 * la admite dentro de cada momento, y el mapper debe poder conservarla íntegra
 * cuando `GenerateProposal` empiece a decidirla. Un modelo que la almacenase como
 * dato opaco la devolvería degradada.
 */
export interface CommercialStrategyModel {
  objective: string;
  barrier: string;
  /**
   * **Sigue al Persistence Contract compartido** (COM-21 §5): la estrategia que
   * un contacto conserva es la misma que conserva una `Proposal`, y almacenarla
   * de dos formas distintas según el agregado sería la divergencia que ese
   * documento descartó.
   */
  evidenceBase: AffirmableFactModel[];
  focus: string;
  emotion: string;
  /** Ausente en el primer contacto: no hay hilo previo que retomar. */
  resumedThread?: string;
  openedThread?: string;
  relevanceElement: string;
  channel: string;
  moment: string;
  expectedOutcome: string;
}

export interface PlannedMomentModel {
  moment: string;
  /**
   * Ausente mientras no se haya decidido la estrategia de ese contacto, que
   * ocurre **antes de usarlo** y no al diseñar el plan (SC-R1). Se almacena
   * ausente, nunca como objeto vacío (R-38).
   */
  strategy?: CommercialStrategyModel;
  /** Números de emisión de las `Proposal` de este momento. */
  proposals: number[];
  declaredOutcome?: {
    responded: boolean;
    manifestation?: string;
  };
}

export interface CommercialSequenceModel {
  id: string;
  userId: string;
  leadId: string;
  /** Número de secuencia, creciente por Lead. Parte de la identidad (CS-I5). */
  sequence: number;
  status: string;
  plan: PlannedMomentModel[];
  /** Ausente mientras la secuencia no tenga momento vigente. */
  currentMoment?: string;
  createdAt: string;
  /** Última actualización. Legítimo aquí: A-12 se actualiza (ADR-13 §10.3). */
  updatedAt: string;
}
