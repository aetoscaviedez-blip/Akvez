import { Request, Response } from "express";
import { RunCommercialDiagnosisFn } from "../orchestrators/commercialDiagnosisOrchestrator";
import { mapToDiagnosisResult } from "../shared/mappers/diagnosisResponseMapper";
import { toErrorResponseDTO, fromException } from "../shared/mappers/errorResponseMapper";
import { DiagnosisRequestDTO } from "../shared/contracts/buyerDiagnosis";

/**
 * `POST /api/leads/:leadId/diagnosis` — emite el Diagnóstico Comercial de un
 * Lead (evento **E-7**).
 *
 * La ruta cuelga del Lead porque **AG-1** lo exige: toda identidad comercial
 * incluye al Lead, y un diagnóstico sin Lead no existe (ADR-16 §4.1).
 *
 * **Adaptador HTTP delgado** (ADR-04 §7.8): valida la forma del request,
 * delega en el workflow y traduce la respuesta. No decide, no diagnostica y no
 * conoce persistencia.
 */
export interface DiagnosisRouteDependencies {
  runCommercialDiagnosis: RunCommercialDiagnosisFn;
}

/** Vocabulario que el dominio acepta hoy. Se valida aquí porque el contrato
 *  público transporta cadenas (ver `shared/contracts/buyerDiagnosis.ts`). */
const DIGITAL_PRESENCE = ["Sin sitio web", "Sitio web deficiente", "Sitio web básico"];
const PRESENCE_ORIGIN = ["Activo digital propio", "Solo presencia en terceros"];

export function createDiagnosisHandler(deps: DiagnosisRouteDependencies) {
  const { runCommercialDiagnosis } = deps;

  return async function handleDiagnosis(req: Request, res: Response): Promise<void> {
    const leadId = String(req.params.leadId ?? "").trim();
    const body = (req.body ?? {}) as Partial<DiagnosisRequestDTO>;

    if (leadId === "") {
      res.status(400).json(toErrorResponseDTO("VALIDATION_ERROR", "Falta el identificador del Lead."));
      return;
    }

    if (!DIGITAL_PRESENCE.includes(String(body.digitalPresence))) {
      res.status(400).json(
        toErrorResponseDTO(
          "VALIDATION_ERROR",
          `"digitalPresence" debe ser uno de: ${DIGITAL_PRESENCE.join(", ")}.`
        )
      );
      return;
    }

    if (!PRESENCE_ORIGIN.includes(String(body.presenceOrigin))) {
      res.status(400).json(
        toErrorResponseDTO(
          "VALIDATION_ERROR",
          `"presenceOrigin" debe ser uno de: ${PRESENCE_ORIGIN.join(", ")}.`
        )
      );
      return;
    }

    try {
      const outcome = await runCommercialDiagnosis({
        evidence: {
          lead: leadId,
          // Ya validados contra el vocabulario del dominio.
          digitalPresence: body.digitalPresence as never,
          presenceOrigin: body.presenceOrigin as never,
          // Ausente sigue ausente: no se rellena con 0 (R-38).
          ...(typeof body.rating === "number" ? { rating: body.rating } : {}),
          ...(typeof body.reviewCount === "number" ? { reviewCount: body.reviewCount } : {})
        },
        // **La marca temporal la fija el servidor, no el cliente.** Es la de la
        // emisión (V-3) y debe ser confiable: aceptarla del request permitiría
        // falsear el orden de las versiones de un diagnóstico.
        issuedAt: new Date().toISOString()
      });

      const result = mapToDiagnosisResult(outcome);

      if (outcome.outcome === "persistence_failed") {
        // El motivo técnico se queda en el servidor; el mapper ya devolvió un
        // mensaje propio (UI-9 · O-6).
        console.error("[Diagnosis] No se pudo conservar la emisión:", outcome.reason);
        res.status(500).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error: any) {
      console.error("[Diagnosis] Error:", error);
      res.status(500).json(fromException(error));
    }
  };
}
