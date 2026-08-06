// Persistence contract de la Commercial Strategy.
//
// **Verificado por lectura directa de
// `modules/pitch-generator/domain/commercial/commercialStrategy.ts` — no
// importado de allí** (ADR-08 §10 · DEV-00 §5.2).
//
// **No tiene repositorio propio y no debe tenerlo.** No es una entidad: no tiene
// identidad, no se persiste por separado y ningún evento la escribe
// (DDD-01 §3.6 · OBS-02). Se persiste **dentro** de `Proposal` (A-6) y, por cada
// contacto, dentro de `CommercialSequence` (A-12).

import { AffirmableFactRecord } from "./AffirmableFact";
import {
  AdmissibleEmotion,
  Barrier,
  Channel,
  MicroYes,
  SequenceMoment
} from "./commercialValues";

/** APS-18 §8.1 — las diez decisiones que gobiernan un contacto. */
export interface CommercialStrategy {
  objective: MicroYes;
  barrier: Barrier;
  /**
   * Los hechos observados que este contacto puede afirmar. Lista cerrada.
   *
   * **Mismo elemento que `Proposal.affirmableFacts`** (COM-21 §5): la estrategia
   * que A-12 conserva por contacto **es la misma estrategia**, y APS-18 §11.1 no
   * deja de aplicarle por estar en otro agregado.
   */
  evidenceBase: AffirmableFactRecord[];
  focus: string;
  emotion: AdmissibleEmotion;
  /** Ausente en el primer contacto: no hay hilo previo que retomar. */
  resumedThread?: string;
  openedThread?: string;
  relevanceElement: string;
  channel: Channel;
  moment: SequenceMoment;
  expectedOutcome: string;
}
