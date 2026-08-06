// Caso de uso: consultar el Opportunity Score vigente de cada Lead.
//
// POR QUÉ VIVE EN LEAD ANALYZER — APS-03 §7.2 le atribuye la Evaluación, y el
// Score es su producto. El Lead Hunter es dueño de la Biblioteca; el Lead
// Analyzer es dueño de las puntuaciones. Que cada módulo exponga lo suyo es lo
// que permite que la Biblioteca muestre el Score **sin que ningún módulo lea el
// interior de otro** (R-02): quien los une es el Orchestrator (R-11).
//
// FRONTERAS — R-22: recibe la Repository Interface por inyección y no importa
// `adapters/`, `models/` ni `shared/persistence/contracts/`. R-05: no importa
// `shared/contracts/`, `shared/mappers/` ni HTTP.

import { LeadAnalysisRepository } from "../../../shared/persistence/repositories/LeadAnalysisRepository";

/**
 * Score vigente de un Lead, con la trazabilidad que exige R-34.
 *
 * Forma declarada de manera independiente, **sin importar el Persistence
 * Contract**: la desviación A-02 consiste exactamente en que `application/`
 * importe uno, y este caso de uso nuevo no la amplía.
 */
/**
 * Aportación de una categoría al Score, tal como se publica.
 *
 * Declarada de forma independiente, **sin importar el Persistence Contract**: la
 * desviación A-02 consistía exactamente en que `application/` importase uno, y
 * este caso de uso no la reintroduce.
 */
export interface ScoreBreakdownView {
  category: string;
  label: string;
  weight: number;
  partialScore: number | null;
  contribution: number;
  measuredFactors: string[];
  unmeasuredFactors: string[];
  rationale: string;
}

export interface LeadScoreView {
  leadId: string;
  /** 0-100. `null` es estado válido: Lead sin Score (R-45 · APS-08 §8.6). */
  score: number | null;
  /** Banda de APS-08 §8. Etiqueta de prioridad, nunca criterio de admisión. */
  band: string | null;
  /** Versión del Perfil de Ponderación que lo produjo (R-VIN). */
  scoreVersion: string;
  /** Confianza declarada del análisis (APS-08 §11). */
  confidence: string;
  coverage: number;
  /** Número de emisión vigente (ADR-13 §10.3, V-2). */
  emission: number;
  calculatedAt: string;
  /** Desglose completo — la explicación que exige APS-08 §9. */
  breakdown: ScoreBreakdownView[];
}

export interface ListLeadScoresResult {
  scores: LeadScoreView[];
}

export interface ListLeadScoresDependencies {
  leadAnalysisRepository: LeadAnalysisRepository;
}

export type ListLeadScoresFn = () => Promise<ListLeadScoresResult>;

export function createListLeadScores(
  deps: ListLeadScoresDependencies
): ListLeadScoresFn {
  const { leadAnalysisRepository } = deps;

  return async function listLeadScores(): Promise<ListLeadScoresResult> {
    // Una emisión vigente por Lead (V-2). No se filtra por banda ni por
    // puntuación: **ninguna puntuación excluye a un Lead** (APS-08 §8.6, RV-B/RV-C).
    const current = await leadAnalysisRepository.findCurrentForAllLeads();

    const scores: LeadScoreView[] = current.map((analysis) => ({
      leadId: analysis.leadId,
      score: analysis.score,
      band: analysis.band,
      scoreVersion: analysis.scoreVersion,
      confidence: analysis.confidence,
      coverage: analysis.coverage,
      // `emission` lo asigna la persistencia y viene siempre poblado al leer;
      // el 1 es solo la salvaguarda de tipo, no un valor por defecto de dominio.
      emission: analysis.emission ?? 1,
      calculatedAt: analysis.calculatedAt,
      // Se publica el desglose tal como se persistió, sin recalcularlo: la
      // explicación debe corresponder a la emisión conservada, no a un cálculo
      // nuevo que podría diferir (ADR-14 §6.3, §6.4).
      breakdown: analysis.breakdown.map((entry) => ({
        category: entry.category,
        label: entry.label,
        weight: entry.weight,
        partialScore: entry.partialScore,
        contribution: entry.contribution,
        measuredFactors: [...entry.measuredFactors],
        unmeasuredFactors: [...entry.unmeasuredFactors],
        rationale: entry.rationale
      }))
    }));

    return { scores };
  };
}
