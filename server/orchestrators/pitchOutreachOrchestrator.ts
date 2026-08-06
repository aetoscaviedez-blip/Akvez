import {
  PitchGeneratorAgentApi,
  PitchGeneratorRequest,
  PitchGeneratorOutcome
} from "../modules/pitch-generator/presentation/pitchGeneratorAgent";

/**
 * Dependencias del workflow, recibidas ya construidas desde el Composition Root
 * (ADR-09 §5.3). Antes este fichero importaba el agente como `const` y lo
 * invocaba: al normalizarse el módulo, el agente pasa a inyectarse, igual que en
 * `leadAcquisitionOrchestrator`.
 *
 * El tipo `PitchGeneratorAgentApi` no menciona persistencia, puertos ni
 * proveedores: este Orchestrator sigue sin conocerlos (ADR-05 §6, Principio 1).
 */
export interface PitchOutreachDependencies {
  pitchGeneratorAgent: PitchGeneratorAgentApi;
}

export type RunPitchOutreachWorkflowFn = (
  request: PitchGeneratorRequest
) => Promise<PitchGeneratorOutcome>;

/**
 * Coordina el workflow de generación de outreach. Conforme ADR-04, es de uso obligatorio:
 * ninguna ruta invoca la Agent API directamente. Este Orchestrator no contiene lógica de
 * negocio, no conoce Gemini, prompts, infrastructure ni domain — solo invoca la Agent API
 * (capa presentation) del módulo registrado para este workflow.
 */
export function createPitchOutreachWorkflow(
  deps: PitchOutreachDependencies
): RunPitchOutreachWorkflowFn {
  const { pitchGeneratorAgent } = deps;

  return async function runPitchOutreachWorkflow(
    request: PitchGeneratorRequest
  ): Promise<PitchGeneratorOutcome> {
    return pitchGeneratorAgent.generateOutreach(request);
  };
}
