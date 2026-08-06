// Orchestrator de consulta de la Biblioteca de Leads.
//
// POR QUÉ EXISTE — R-11 es terminante: «Todo workflow pasa por un Orchestrator.
// `routes/` **nunca** invoca un agente directamente, **ni siquiera de un solo
// módulo**». Desde DEV-04 coordina además **dos** agentes, que es precisamente
// su razón de ser: ADR-04 §7.6 prohíbe que un agente conozca o invoque a otro.
//
//   · **Lead Hunter** es dueño de la Biblioteca (APS-03 §7.1) y aporta los Leads
//     registrados.
//   · **Lead Analyzer** es dueño de la Evaluación (APS-03 §7.2) y aporta el
//     Opportunity Score vigente de cada uno.
//
// Ninguno de los dos sabe que el otro existe. Este Orchestrator es **el único
// canal** por el que sus resultados se encuentran.
//
// FRONTERAS QUE RESPETA
//   · R-08 — no conoce HTTP: no recibe `Request`/`Response`, no importa express.
//   · R-09 — no conoce DTO públicos: no importa `shared/contracts/` ni mappers.
//   · R-10 — **no contiene lógica de negocio**: no puntúa, no clasifica, no
//     filtra y no decide qué Leads existen. Unir dos conjuntos por `leadId` es
//     coordinación, no negocio: no crea ni altera ningún dato.
//   · R-24 — no conoce persistencia. Ninguno de los tipos que importa menciona
//     repositorios ni adapters.

import { LeadHunterAgentApi } from "../modules/lead-hunter/presentation/LeadHunterAgent";
import { LeadAnalyzerAgentApi } from "../modules/lead-analyzer/presentation/LeadAnalyzerAgent";
import { RegisteredLead } from "../modules/lead-hunter/application/listLeadLibrary";
import { LeadScoreView, ScoreBreakdownView } from "../modules/lead-analyzer/application/listLeadScores";

/**
 * Un Lead de la Biblioteca con su Score vigente, si lo tiene.
 *
 * Los campos de Score son **opcionales de forma deliberada**: un Lead sin
 * Evaluación es un estado válido y esperado (R-45 · APS-08 §8.6 punto 3), y
 * R-38 prohíbe rellenar esa ausencia con un valor por defecto. Ausente significa
 * ausente, nunca cero.
 */
export interface LibraryEntry extends RegisteredLead {
  score?: number | null;
  band?: string | null;
  scoreVersion?: string;
  confidence?: string;
  coverage?: number;
  calculatedAt?: string;
  /** Desglose por categoría — explicación exigida por APS-08 §9. */
  breakdown?: ScoreBreakdownView[];
}

export interface LeadLibraryQueryResult {
  leads: LibraryEntry[];
  total: number;
  /** Cuántos Leads tienen Score vigente. El resto son válidos igualmente. */
  scored: number;
}

export interface LeadLibraryDependencies {
  leadHunterAgent: LeadHunterAgentApi;
  leadAnalyzerAgent: LeadAnalyzerAgentApi;
}

export type RunLeadLibraryQueryFn = () => Promise<LeadLibraryQueryResult>;

export function createLeadLibraryQuery(
  deps: LeadLibraryDependencies
): RunLeadLibraryQueryFn {
  const { leadHunterAgent, leadAnalyzerAgent } = deps;

  return async function runLeadLibraryQuery(): Promise<LeadLibraryQueryResult> {
    // Ambos agentes en paralelo: son independientes y ninguno depende del otro.
    const [library, scoreResult] = await Promise.all([
      leadHunterAgent.listLibrary(),
      leadAnalyzerAgent.listScores()
    ]);

    const scoreByLeadId = new Map<string, LeadScoreView>();
    for (const score of scoreResult.scores) {
      scoreByLeadId.set(score.leadId, score);
    }

    // La Biblioteca manda: se recorre **la lista de Leads registrados**, no la de
    // Scores. Así un Lead sin Evaluación sigue apareciendo, y una Evaluación
    // huérfana no puede inventar un Lead que no existe (APS-08 §8.6 punto 3:
    // «Nunca crea un Lead»).
    const leads: LibraryEntry[] = library.leads.map((lead) => {
      const score = scoreByLeadId.get(lead.id);
      if (!score) return lead;
      return {
        ...lead,
        score: score.score,
        band: score.band,
        scoreVersion: score.scoreVersion,
        confidence: score.confidence,
        coverage: score.coverage,
        calculatedAt: score.calculatedAt,
        breakdown: score.breakdown
      };
    });

    // WS-05 de APS-17 §4 — orden por defecto: Opportunity Score descendente.
    // Los Leads sin Score van al final **sin ocultarse**: ordenar no es excluir
    // (APS-08 §8.6). Se conserva su orden relativo de Registro.
    const ordered = leads
      .map((lead, index) => ({ lead, index }))
      .sort((a, b) => {
        const scoreA = a.lead.score ?? null;
        const scoreB = b.lead.score ?? null;
        if (scoreA === null && scoreB === null) return a.index - b.index;
        if (scoreA === null) return 1;
        if (scoreB === null) return -1;
        return scoreB - scoreA || a.index - b.index;
      })
      .map((entry) => entry.lead);

    return {
      leads: ordered,
      // `total` procede del agente dueño de la Biblioteca, no de `ordered.length`:
      // si alguna vez no coincidieran, el síntoma debe ser visible (R-42 · R-44).
      total: library.total,
      scored: ordered.filter((lead) => typeof lead.score === "number").length
    };
  };
}
