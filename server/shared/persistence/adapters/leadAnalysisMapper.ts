// Persistence mapper boundary for LeadAnalysis (ADR-08 §7): the only place
// allowed to translate between the LeadAnalysis persistence contract and
// LeadAnalysisModel (R-26). Pure functions only — no I/O, no database access,
// no ID/timestamp generation. The caller (the Database Adapter) produces
// id/userId/createdAt/emission and passes them in explicitly.

import { LeadAnalysis } from "../contracts/LeadAnalysis";
import { LeadAnalysisModel } from "../models/LeadAnalysisModel";

export interface LeadAnalysisPersistenceMeta {
  id: string;
  userId: string;
  createdAt: string;
  /** Número de emisión, calculado por el Adapter a partir de lo ya almacenado. */
  emission: number;
}

export function toLeadAnalysisModel(
  analysis: LeadAnalysis,
  meta: LeadAnalysisPersistenceMeta
): LeadAnalysisModel {
  return {
    id: meta.id,
    userId: meta.userId,
    leadId: analysis.leadId,
    description: analysis.description,
    flaws: [...analysis.flaws],
    angle: analysis.angle,
    revenueLoss: analysis.revenueLoss,
    whyWebsiteNeeded: analysis.whyWebsiteNeeded,
    score: analysis.score,
    classification: analysis.classification,
    hasWebsite: analysis.hasWebsite,
    scoreVersion: analysis.scoreVersion,
    band: analysis.band,
    // Copia profunda del desglose: una vez emitida, la explicación de un Score
    // es inmutable (ADR-14 R-INM en espíritu, §6.6 No destrucción). Compartir la
    // referencia permitiría que el llamador la alterase después de guardarla.
    breakdown: analysis.breakdown.map((entry) => ({
      category: entry.category,
      label: entry.label,
      weight: entry.weight,
      partialScore: entry.partialScore,
      contribution: entry.contribution,
      measuredFactors: [...entry.measuredFactors],
      unmeasuredFactors: [...entry.unmeasuredFactors],
      rationale: entry.rationale
    })),
    confidence: analysis.confidence,
    coverage: analysis.coverage,
    userProfile: { ...analysis.userProfile },
    calculatedAt: analysis.calculatedAt,
    emission: meta.emission,
    createdAt: meta.createdAt
  };
}

export function toLeadAnalysis(model: LeadAnalysisModel): LeadAnalysis {
  return {
    leadId: model.leadId,
    description: model.description,
    flaws: [...model.flaws],
    angle: model.angle,
    revenueLoss: model.revenueLoss,
    whyWebsiteNeeded: model.whyWebsiteNeeded,
    score: model.score,
    classification: model.classification,
    hasWebsite: model.hasWebsite,
    scoreVersion: model.scoreVersion,
    band: model.band,
    breakdown: model.breakdown.map((entry) => ({
      category: entry.category,
      label: entry.label,
      weight: entry.weight,
      partialScore: entry.partialScore,
      contribution: entry.contribution,
      measuredFactors: [...entry.measuredFactors],
      unmeasuredFactors: [...entry.unmeasuredFactors],
      rationale: entry.rationale
    })),
    confidence: model.confidence,
    coverage: model.coverage,
    userProfile: { ...model.userProfile },
    calculatedAt: model.calculatedAt,
    emission: model.emission
  };
}
