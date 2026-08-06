import { Request, Response } from "express";
import { RunPitchOutreachWorkflowFn } from "../orchestrators/pitchOutreachOrchestrator";
import { mapToOutreachResult } from "../shared/mappers/outreachResponseMapper";
import { fromException } from "../shared/mappers/errorResponseMapper";
import {
  runWithExecutionReport,
  recordResponse,
  printExecutionReport
} from "../shared/observability/executionReport";

/**
 * Dependencias recibidas ya construidas desde el Composition Root (ADR-09 §5.3),
 * igual que las de `prospectSearchRoute`. Antes esta ruta importaba el workflow
 * como función de módulo, que a su vez importaba el agente como `const`: era la
 * cadena que impedía construir el módulo comercial desde el Composition Root
 * (ADR-15 §9.5).
 */
export interface ProspectOutreachDependencies {
  runPitchOutreachWorkflow: RunPitchOutreachWorkflowFn;
}

export function createProspectOutreachHandler(deps: ProspectOutreachDependencies) {
  const { runPitchOutreachWorkflow } = deps;

  return async function handleProspectOutreach(req: Request, res: Response): Promise<void> {
    const { designer, lead, channel, customInstructions } = req.body;

    // Ámbito de observabilidad del request (Sprint 15, Tarea 4, Fase 5). Hasta
    // ahora este flujo no emitía ningún reporte: el respaldo del Pitch Generator
    // solo era visible en `metadata.isFallback` de la respuesta, sin rastro
    // auditable en el servidor. Solo instrumenta: no altera flujo ni respuesta.
    await runWithExecutionReport({
      flow: "PITCH_GENERATOR",
      subject: [["Lead:", String(lead?.name ?? "")], ["Channel:", String(channel ?? "")]]
    }, async () => {
      try {
        const outcome = await runPitchOutreachWorkflow({ designer, lead, channel, customInstructions });
        const result = mapToOutreachResult(outcome);

        if (outcome.kind === "validation_error") {
          recordResponse(0);
          res.status(400).json(result);
          return;
        }

        if (outcome.kind === "generation_error") {
          recordResponse(0);
          res.status(500).json(result);
          return;
        }

        recordResponse(1);
        res.json(result);
      } catch (error: any) {
        console.error("[PitchGenerator] Error:", error);
        res.status(500).json(fromException(error));
      } finally {
        // Se emite siempre — también en la ruta de error — para que un fallo
        // quede documentado con las métricas que sí alcanzaron a registrarse.
        printExecutionReport();
      }
    });
  };
}
