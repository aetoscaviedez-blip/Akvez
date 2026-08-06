/**
 * Contrato público de la Secuencia Comercial (ADR-06 · ADR-07).
 *
 * Independiente de `domain/`, `application/` y `persistence/`: **declara su forma
 * pública y no deriva de ninguna entidad interna** (R-14).
 */

import { ErrorResponseDTO } from "./apiError";

/**
 * La evidencia con la que se diseña la secuencia.
 *
 * **Un solo campo, porque uno solo decide algo:** de los canales alcanzables
 * depende qué momentos son planificables (APS-20 §7 · CE-1). El contrato pedía
 * además `digitalPresence` y `presenceOrigin`, que **no intervenían en ninguna
 * decisión** — deuda F-8, cerrada. Un DTO que exige datos que nadie lee obliga al
 * cliente a inventarlos.
 */
export interface SequenceRequestDTO {
  reachableChannels: string[];
}

/**
 * Un momento del plan, tal como se publica.
 *
 * **Solo lleva el momento.** No lleva estrategia —se decide antes de usar cada
 * contacto (SC-R1) y no existe todavía— ni canal —es contenido de la estrategia
 * (APS-18 §8.1 · CM-3)—. Publicar cualquiera de los dos anunciaría al cliente
 * una decisión que el sistema no ha tomado.
 */
export interface PlannedMomentDTO {
  moment: string;
}

export interface CommercialSequenceDTO {
  id: string;
  leadId: string;
  /** Número de secuencia. Junto al Lead forma la identidad (ADR-16 §4.3). */
  sequence: number;
  status: string;
  /** El contacto que toca. Ausente si la secuencia no tiene momento vigente. */
  currentMoment?: string;
  plan: PlannedMomentDTO[];
}

export interface SequenceResponseDTO {
  success: true;
  sequence: CommercialSequenceDTO;
}

export type SequenceResult = SequenceResponseDTO | ErrorResponseDTO;
