// Persistence contract de la **Secuencia Comercial — activo A-12**.
//
// **Verificado por lectura directa de
// `modules/pitch-generator/domain/commercial/CommercialSequence.ts` — no
// importado de allí** (ADR-08 §10 · DEV-00 §5.2).
//
// ADR-13 §6.2 fija el contenido de A-12: «Plan de momentos · momento vigente ·
// por cada contacto, su estrategia y el resultado declarado», y su momento de
// escritura: «Al diseñarse y en cada actualización. **Actualizable, no
// versionado**».

import { CommercialStrategy } from "./CommercialStrategy";
import { SequenceMoment, SequenceStatus } from "./commercialValues";

/**
 * Un momento planificado, con lo que la secuencia conserva de él.
 *
 * `proposals` **referencia por identidad** las emisiones de `Proposal` de este
 * momento; **no las contiene** (DDD-01 §5.4). Fundirlas obligaría a versionar la
 * secuencia en cada emisión de texto o a dejar de versionar la propuesta,
 * incumpliendo **P-I2**.
 */
export interface PlannedMoment {
  moment: SequenceMoment;
  strategy?: CommercialStrategy;
  /** Números de emisión de las `Proposal` de este momento. */
  proposals: number[];
  /** Presente solo cuando el usuario ha declarado algo (CE-I2). */
  declaredOutcome?: {
    responded: boolean;
    manifestation?: string;
  };
}

/**
 * Una secuencia. **Se actualiza, no se versiona** (ADR-13 §10.3): el rastro de
 * sus cambios lo conserva íntegro el historial (A-8).
 *
 * `sequence` es el número que, junto al Lead, forma la identidad del agregado
 * (ADR-16 §4.3 · AG-1). **CS-I5** — un Lead puede tener varias secuencias y
 * **una nueva no borra la anterior**; por eso el número forma parte de la
 * identidad y no se reutiliza.
 */
export interface CommercialSequence {
  leadId: string;
  sequence: number;
  status: SequenceStatus;
  plan: PlannedMoment[];
  /** Ausente mientras la secuencia no se haya iniciado. */
  currentMoment?: SequenceMoment;
}
