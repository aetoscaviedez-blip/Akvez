import { OutreachPitchResult } from "../contracts/outreachPitch";

/**
 * Forma real de `PitchGeneratorOutcome`, confirmada por lectura directa de
 * `server/modules/pitch-generator/presentation/pitchGeneratorAgent.ts` y de
 * `PitchPayload` en `application/generateOutreachPitch.ts`. No son imports
 * del módulo Pitch Generator — está prohibido por esta tarea — son
 * declaraciones independientes, propiedad de este mapper, que describen el
 * contrato de entrada que espera.
 */
interface InternalPitchPayload {
  subjectLine: string;
  message: string;
  strategyExplanation: string;
}

export type InternalPitchGeneratorOutcome =
  | { kind: "validation_error"; error: string }
  | { kind: "generation_error"; error: string }
  | { kind: "success"; pitch: InternalPitchPayload; isFallback?: boolean };

/**
 * Transforma el resultado interno de Pitch Generator hacia el contrato
 * público (ADR-06, sección 10). `strategyExplanation` se recibe pero
 * deliberadamente nunca se incluye en la salida: ADR-06 / API-DTO-CATALOG.md
 * lo clasifican como Interno (el frontend lo recibe hoy pero nunca lo lee).
 * `isFallback` se normaliza a un booleano explícito en `metadata.isFallback`,
 * reemplazando el mecanismo frágil actual de detectar el respaldo mediante
 * un substring dentro de otro campo (ADR-06, Decisión Importante 4).
 *
 * Los dos casos de error (`validation_error`, `generation_error`) se
 * traducen directamente al contrato único de error (ADR-06, sección 12),
 * sin depender de errorResponseMapper.ts — cada mapper de esta carpeta es
 * autocontenido y solo depende de shared/contracts/, conforme a las
 * dependencias permitidas de esta tarea.
 */
export function mapToOutreachResult(outcome: InternalPitchGeneratorOutcome): OutreachPitchResult {
  if (outcome.kind === "validation_error") {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: outcome.error,
        details: {}
      }
    };
  }

  if (outcome.kind === "generation_error") {
    return {
      success: false,
      error: {
        code: "AI_FAILURE",
        message: outcome.error,
        details: {}
      }
    };
  }

  return {
    success: true,
    pitch: {
      subjectLine: outcome.pitch.subjectLine,
      message: outcome.pitch.message
    },
    metadata: {
      isFallback: !!outcome.isFallback
    }
  };
}
