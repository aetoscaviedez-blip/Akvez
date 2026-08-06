// Orchestrator de diseño de la Secuencia Comercial.
//
// POR QUÉ EXISTE — **R-11**: «Todo workflow pasa por un Orchestrator. `routes/`
// **nunca** invoca un agente directamente, **ni siquiera de un solo módulo»**.
// Es el mismo motivo por el que existen `pitchOutreachOrchestrator` y
// `commercialDiagnosisOrchestrator`.
//
// FRONTERAS QUE RESPETA
//   · R-08 — no conoce HTTP.
//   · R-09 — no conoce DTO públicos ni mappers.
//   · R-10 — no contiene lógica de negocio: no diseña el plan ni elige momentos.
//   · R-24 — no conoce persistencia.

import { PitchGeneratorAgentApi } from "../modules/pitch-generator/presentation/pitchGeneratorAgent";
import {
  CreateSequenceInput,
  CreateSequenceResult
} from "../modules/pitch-generator/application/createSequence";

export interface CommercialSequenceDependencies {
  pitchGeneratorAgent: PitchGeneratorAgentApi;
}

export type RunCommercialSequenceFn = (
  input: CreateSequenceInput
) => Promise<CreateSequenceResult>;

/**
 * **La evidencia llega desde arriba y este workflow no la busca** (ADR-15 §12).
 *
 * Cuando los canales alcanzables dejen de venir en el request y deban obtenerse
 * del Lead —deuda **F-7**—, **es aquí donde se coordinará con el Lead Hunter**:
 * ADR-04 §7.6 prohíbe que el Pitch Generator invoque a otro agente. Ese cambio
 * no tocará el dominio ni `CreateSequence`.
 */
export function createCommercialSequence(
  deps: CommercialSequenceDependencies
): RunCommercialSequenceFn {
  const { pitchGeneratorAgent } = deps;

  return async function runCommercialSequence(
    input: CreateSequenceInput
  ): Promise<CreateSequenceResult> {
    return pitchGeneratorAgent.createSequence(input);
  };
}
