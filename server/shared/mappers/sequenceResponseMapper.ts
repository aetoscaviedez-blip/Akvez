import { SequenceResult } from "../contracts/commercialSequence";

/**
 * Forma real de `CreateSequenceResult`, confirmada por lectura directa de
 * `modules/pitch-generator/application/createSequence.ts`. **No es un import del
 * módulo**: R-16 exige que cada mapper declare su propio tipo de entrada, y R-15
 * prohíbe a `shared/mappers/` importar `modules/`.
 */
export interface InternalDesignedSequence {
  id: string;
  lead: string;
  sequence: number;
  status: string;
  currentMoment?: string;
  plan: Array<{ moment: string }>;
}

export type InternalSequenceOutcome =
  | { outcome: "success"; sequence: InternalDesignedSequence }
  | { outcome: "diagnosis_missing" }
  | { outcome: "no_reachable_channel" }
  | { outcome: "persistence_failed"; reason: string };

/**
 * Traduce el resultado del caso de uso al contrato público (ADR-06 §10).
 * **Traducción estructural y nada más:** no decide, no completa y no reordena.
 *
 * Las tres ramas de fallo se distinguen porque **son situaciones distintas para
 * el usuario**, y fundirlas en un error genérico le impediría saber qué hacer:
 *
 * | Rama | Código | Por qué |
 * | --- | --- | --- |
 * | `diagnosis_missing` | `NOT_FOUND` | Falta el diagnóstico vigente del que la secuencia se deriva. **Se resuelve emitiéndolo** |
 * | `no_reachable_channel` | `VALIDATION_ERROR` | No consta ningún canal que alcance al negocio. **Se resuelve aportándolos**, nunca inventándolos (R-2) |
 * | `persistence_failed` | `INTERNAL_ERROR` | Fallo del sistema. **El motivo técnico no viaja** (UI-9 · O-6 · APS-10) |
 *
 * **El plan se publica solo con sus momentos.** La estrategia y el canal no se
 * incluyen porque no existen todavía: anunciarlos vacíos sería declarar una
 * decisión no tomada.
 */
export function mapToSequenceResult(outcome: InternalSequenceOutcome): SequenceResult {
  if (outcome.outcome === "diagnosis_missing") {
    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "El Lead no tiene un diagnóstico vigente del que derivar la secuencia.",
        details: {}
      }
    };
  }

  if (outcome.outcome === "no_reachable_channel") {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "No consta ningún canal por el que este negocio sea alcanzable.",
        details: {}
      }
    };
  }

  if (outcome.outcome === "persistence_failed") {
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "No se pudo conservar la secuencia. Inténtalo de nuevo.",
        details: {}
      }
    };
  }

  const { sequence } = outcome;
  const dto: SequenceResult = {
    success: true,
    sequence: {
      id: sequence.id,
      leadId: sequence.lead,
      sequence: sequence.sequence,
      status: sequence.status,
      plan: sequence.plan.map((planned) => ({ moment: planned.moment }))
    }
  };
  // Ausente se omite, nunca se rellena (R-38).
  if (sequence.currentMoment !== undefined) {
    dto.sequence.currentMoment = sequence.currentMoment;
  }
  return dto;
}
