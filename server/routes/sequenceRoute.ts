import { Request, Response } from "express";
import { RunCommercialSequenceFn } from "../orchestrators/commercialSequenceOrchestrator";
import { mapToSequenceResult } from "../shared/mappers/sequenceResponseMapper";
import { toErrorResponseDTO, fromException } from "../shared/mappers/errorResponseMapper";
import { SequenceRequestDTO } from "../shared/contracts/commercialSequence";

/**
 * `POST /api/leads/:leadId/sequence` — diseña la Secuencia Comercial de un Lead
 * (evento **E-8**).
 *
 * Cuelga del Lead porque **AG-1** lo exige: toda identidad comercial lo incluye.
 *
 * **Adaptador HTTP delgado** (ADR-04 §7.8): valida la forma del request, delega
 * en el workflow y traduce la respuesta. **No decide qué momentos existen** —eso
 * es del dominio— y no conoce persistencia.
 */
export interface SequenceRouteDependencies {
  runCommercialSequence: RunCommercialSequenceFn;
}

const CHANNELS = ["Email frío", "LinkedIn Connection Note", "Instagram DM"];

export function createSequenceHandler(deps: SequenceRouteDependencies) {
  const { runCommercialSequence } = deps;

  return async function handleSequence(req: Request, res: Response): Promise<void> {
    const leadId = String(req.params.leadId ?? "").trim();
    const body = (req.body ?? {}) as Partial<SequenceRequestDTO>;

    if (leadId === "") {
      res.status(400).json(toErrorResponseDTO("VALIDATION_ERROR", "Falta el identificador del Lead."));
      return;
    }

    // Solo se valida **la forma**: que sea una lista de canales conocidos. **Qué
    // momentos permite cada canal es regla de dominio** (APS-20 §7) y no se
    // duplica aquí. Una lista vacía es forma válida: el dominio responderá que
    // no hay secuencia que diseñar, y esa es su decisión, no la de la ruta.
    const channels = body.reachableChannels;
    if (!Array.isArray(channels) || channels.some((channel) => !CHANNELS.includes(String(channel)))) {
      res.status(400).json(
        toErrorResponseDTO(
          "VALIDATION_ERROR",
          `"reachableChannels" debe ser una lista de: ${CHANNELS.join(", ")}.`
        )
      );
      return;
    }

    try {
      const outcome = await runCommercialSequence({
        lead: leadId,
        reachableChannels: channels as never
      });

      const result = mapToSequenceResult(outcome);

      if (outcome.outcome === "success") {
        res.status(201).json(result);
        return;
      }

      if (outcome.outcome === "diagnosis_missing") {
        res.status(404).json(result);
        return;
      }

      if (outcome.outcome === "no_reachable_channel") {
        res.status(400).json(result);
        return;
      }

      // El motivo técnico se queda en el servidor (UI-9 · O-6).
      console.error("[Sequence] No se pudo conservar la secuencia:", outcome.reason);
      res.status(500).json(result);
    } catch (error: any) {
      console.error("[Sequence] Error:", error);
      res.status(500).json(fromException(error));
    }
  };
}
