import { LeadHunterAgentApi } from "../modules/lead-hunter/presentation/LeadHunterAgent";
import { LeadAnalyzerAgentApi } from "../modules/lead-analyzer/presentation/LeadAnalyzerAgent";

/**
 * **Ya no transporta `apiKey`.** Ninguna credencial atraviesa este workflow: la
 * recibe el adapter de descubrimiento desde el Composition Root (ADR-17 §6.3
 * P-4, §9.3).
 */
export interface LeadAcquisitionRequest {
  industry: string;
  location: string;
  designerStyle: string;
  excludeNames: string[];
}

export interface LeadAcquisitionResult {
  deduplicatedLeads: any[];
  references: Array<{ title: string; url: string }>;
  leads: any[];
}

/**
 * Dependencias del workflow, recibidas ya construidas desde el Composition Root
 * (ADR-09 §5.3). Ambos agentes se inyectan: desde H-04 / ADR-10 la construcción
 * de `LeadAnalyzerAgent` también requiere dependencias externas, por lo que ya
 * no puede importarse como singleton.
 *
 * Ninguno de los dos tipos menciona repositorios ni adapters: este Orchestrator
 * sigue sin conocer persistencia en ninguna forma (ADR-05 §6, Principio 1).
 */
export interface LeadAcquisitionDependencies {
  leadHunterAgent: LeadHunterAgentApi;
  leadAnalyzerAgent: LeadAnalyzerAgentApi;
}

export type RunLeadAcquisitionWorkflowFn = (
  request: LeadAcquisitionRequest
) => Promise<LeadAcquisitionResult>;

/**
 * Coordina el workflow completo de adquisición de leads: Lead Hunter → Lead Analyzer.
 * Conforme ADR-04, es de uso obligatorio: ninguna ruta invoca LeadHunterAgent ni
 * LeadAnalyzerAgent directamente, y ningún agente conoce ni invoca al otro. Este
 * Orchestrator no contiene lógica de negocio (no calcula scores, no busca leads,
 * no conoce Gemini, prompts, Google Places, infrastructure ni domain de ningún
 * módulo) — solo invoca las Agent API (capa presentation) de los agentes
 * registrados para este workflow, en orden, y decide si corresponde ejecutar el
 * siguiente paso del workflow (decisión de coordinación, no de negocio).
 *
 * Tampoco conoce persistencia en ninguna forma (ADR-05 §6, Principio 1): recibe
 * una Agent API ya construida, cuyo tipo no menciona repositorios ni adapters.
 */
export function createLeadAcquisitionWorkflow(
  deps: LeadAcquisitionDependencies
): RunLeadAcquisitionWorkflowFn {
  const { leadHunterAgent, leadAnalyzerAgent } = deps;

  return async function runLeadAcquisitionWorkflow(
    request: LeadAcquisitionRequest
  ): Promise<LeadAcquisitionResult> {
    const { industry, location, designerStyle, excludeNames } = request;

    const hunterResult = await leadHunterAgent.execute({ industry, location, excludeNames });

    if (hunterResult.deduplicatedLeads.length === 0) {
      return {
        deduplicatedLeads: hunterResult.deduplicatedLeads,
        references: hunterResult.references,
        leads: []
      };
    }

    const leads = await leadAnalyzerAgent.execute({
      deduplicatedLeads: hunterResult.deduplicatedLeads,
      industry,
      location,
      designerStyle
    });

    return {
      deduplicatedLeads: hunterResult.deduplicatedLeads,
      references: hunterResult.references,
      leads
    };
  };
}
