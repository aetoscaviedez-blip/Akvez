import { Request, Response } from "express";
import { getGooglePlacesApiKey } from "../shared/config/env";
import { RunLeadAcquisitionWorkflowFn } from "../orchestrators/leadAcquisitionOrchestrator";
import { mapToLeadResponseDTO } from "../shared/mappers/leadResponseMapper";
import { toErrorResponseDTO, fromException } from "../shared/mappers/errorResponseMapper";
import { SearchResponseDTO } from "../shared/contracts/prospectSearch";
import {
  runWithExecutionReport,
  recordResponse,
  printExecutionReport
} from "../shared/observability/executionReport";

/**
 * Dependencias recibidas ya construidas desde el Composition Root (ADR-09 §5.3).
 * La ruta no construye adapters ni conoce persistencia: recibe un workflow cuyo
 * tipo no menciona repositorios ni models (ADR-05 §6, Principio 1).
 */
export interface ProspectSearchDependencies {
  runLeadAcquisitionWorkflow: RunLeadAcquisitionWorkflowFn;
}

export function createProspectSearchHandler(deps: ProspectSearchDependencies) {
  const { runLeadAcquisitionWorkflow } = deps;

  return async function handleProspectSearch(req: Request, res: Response): Promise<void> {
    const { industry, location, designerStyle, excludeNames = [] } = req.body;

    if (!industry || !location) {
      res.status(400).json(toErrorResponseDTO("VALIDATION_ERROR", "Por favor proporciona el nicho y la ciudad."));
      return;
    }

    // Validación de configuración, **no** transporte de la credencial: la clave
    // ya no viaja al workflow (ADR-17 §6.3 P-4) — la recibió el adapter en el
    // arranque. Se conserva esta comprobación para no degradar el 400 explícito
    // («falta la clave») a un 500 genérico, que sería una regresión de
    // diagnóstico para el usuario. `shared/config/` es accesible desde cualquier
    // capa (ADR-04 §11) y esta ruta ya la leía.
    if (!getGooglePlacesApiKey()) {
      res.status(400).json(toErrorResponseDTO("VALIDATION_ERROR", "Falta la clave GOOGLE_PLACES_API_KEY en los Secrets."));
      return;
    }

    // Ámbito de observabilidad del request (Sprint 15, Tarea 1). Solo instrumenta:
    // no altera el flujo, ni la respuesta, ni los errores propagados. Se abre una
    // vez superada la validación de entrada, de modo que un 400 no emite reporte.
    await runWithExecutionReport({
      flow: "LEAD_HUNTER",
      subject: [["City:", String(location)], ["Niche:", String(industry)]]
    }, async () => {
      try {
        // Descubrimiento + análisis coordinados por el Lead Acquisition Orchestrator (ADR-04)
        const { deduplicatedLeads, references, leads } = await runLeadAcquisitionWorkflow({
          industry,
          location,
          designerStyle,
          excludeNames
        });

        if (deduplicatedLeads.length === 0) {
          const response: SearchResponseDTO = {
            success: true,
            leads: [],
            references: []
          };
          recordResponse(response.leads.length);
          res.json(response);
          return;
        }

        console.log(`[LeadHunter] Análisis completado. Devolviendo ${leads.length} leads reales.`);

        // `id` proviene del Repository (Sprint 15, Tarea 2, DT-3 resuelta): lo asignó
        // el Adapter durante `save()` y se propagó a través del análisis. Esta ruta ya
        // no genera identificadores — existe un único id por Lead en toda la cadena.
        // H-02 — `usedFallbackEngine` se PROPAGA, no se infiere. Cada lead trae
        // la marca que le puso `analyzeProspects` en la rama que realmente lo
        // produjo; `some` implementa el "total o parcialmente" que describe el
        // contrato. El dato NO se lee del reporte de observabilidad: la
        // instrumentación no puede ser fuente de una respuesta HTTP.
        const usedFallbackEngine = leads.some((lead) => lead.usedFallbackAnalysis === true);

        const response: SearchResponseDTO = {
          success: true,
          leads: leads.map((lead) => mapToLeadResponseDTO(lead, lead.id)),
          references,
          metadata: { usedFallbackEngine }
        };
        recordResponse(response.leads.length);
        res.json(response);

      } catch (error: any) {
        console.error("[LeadHunter] Error:", error);
        // NO fallback — return real error so user knows what failed
        res.status(500).json(fromException(error));
      } finally {
        // Se emite siempre — también en la ruta de error — para que un fallo
        // quede documentado con las métricas que sí alcanzaron a registrarse.
        printExecutionReport();
      }
    });
  };
}
