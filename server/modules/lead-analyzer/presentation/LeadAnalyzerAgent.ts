import { AnalyzeProspectsFn } from "../application/analyzeProspects";
import { ListLeadScoresFn, ListLeadScoresResult } from "../application/listLeadScores";

export interface LeadAnalyzerRequest {
  deduplicatedLeads: any[];
  industry: string;
  location: string;
  designerStyle: string;
}

export interface LeadAnalyzerAgentApi {
  execute(request: LeadAnalyzerRequest): Promise<any[]>;

  /**
   * Devuelve el Opportunity Score vigente de cada Lead evaluado.
   *
   * Se expone aquí porque la Evaluación es responsabilidad de este agente
   * (APS-03 §7.2) y el Score es su producto. El Orchestrator es el único que la
   * invoca (R-07, R-11), y es él quien la combina con la Biblioteca del Lead
   * Hunter: **ningún agente conoce ni invoca al otro** (ADR-04 §7.6).
   *
   * El tipo de retorno no menciona persistencia, de modo que esta capa sigue sin
   * importar `shared/persistence/` — prohibido «sin excepción» por R-23.
   */
  listScores(): Promise<ListLeadScoresResult>;
}

/**
 * Única API pública del módulo Lead Analyzer (Agent API / capa "presentation" de ADR-04).
 * Ningún componente externo debe acceder a application/, domain/ o infrastructure/ directamente.
 *
 * Se construye por factory desde el Composition Root (ADR-09 §5.2), igual que
 * `LeadHunterAgent`: recibe el caso de uso ya vinculado a sus dependencias.
 * Desde H-04 / ADR-10 el Registro de los leads seleccionados ocurre dentro de
 * este módulo, pero esta capa no conoce — ni puede conocer —
 * `shared/persistence/` en ninguna de sus cuatro subcarpetas (ADR-08 §10, «sin
 * excepción»): el tipo `AnalyzeProspectsFn` no menciona persistencia, de modo
 * que el repositorio viaja capturado en un closure y queda fuera de la
 * superficie de tipos de este archivo.
 */
/**
 * Los dos casos de uso que esta fachada transporta, **con nombre** —
 * **ADR-19 §5.1 (D-1)**.
 *
 * Ninguna es opcional ni tiene valor por defecto: un valor por defecto sería
 * construir dentro de `presentation/`, competencia exclusiva del Composition
 * Root (**ADR-09 §5.3 · R-55 · ADR-19 §5.2**).
 */
export interface LeadAnalyzerAgentDeps {
  analyzeProspects: AnalyzeProspectsFn;
  listLeadScores: ListLeadScoresFn;
}

export function createLeadAnalyzerAgent({
  analyzeProspects,
  listLeadScores
}: LeadAnalyzerAgentDeps): LeadAnalyzerAgentApi {
  return {
    async execute(request: LeadAnalyzerRequest): Promise<any[]> {
      const { deduplicatedLeads, industry, location, designerStyle } = request;
      return analyzeProspects(deduplicatedLeads, industry, location, designerStyle);
    },

    async listScores(): Promise<ListLeadScoresResult> {
      return listLeadScores();
    }
  };
}
