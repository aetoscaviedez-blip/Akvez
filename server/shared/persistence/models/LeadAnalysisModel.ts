// Persistence model for LeadAnalysis — the stored representation, distinct from
// both the LeadAnalysis domain entity (modules/lead-analyzer/domain/LeadAnalysis.ts)
// and the LeadAnalysis persistence contract (shared/persistence/contracts/LeadAnalysis.ts),
// per ADR-08 §6. Declared independently, verified against the contract by direct
// reading — **not imported from it**, per ADR-08 §10 and R-27
// (shared/persistence/models/ may import only primitives and other files within
// shared/persistence/models/).
//
// Adds the technical fields a Domain Entity / Persistence Contract deliberately
// does not carry (ADR-05 §7, Decisión 3): id, userId, createdAt.
//
// NO lleva `updatedAt`. Es deliberado: **ADR-13 §10.3 V-1** establece que cada
// emisión de Score **añade** una versión y ninguna retira la anterior, de modo
// que una fila de análisis **nunca se actualiza**. Un `updatedAt` sugeriría que
// la sobrescritura es posible, y ADR-13 §10.2 la prohíbe expresamente.

export interface ScoreBreakdownEntryModel {
  category: string;
  label: string;
  weight: number;
  partialScore: number | null;
  contribution: number;
  measuredFactors: string[];
  unmeasuredFactors: string[];
  rationale: string;
}

export interface ScoringUserProfileModel {
  targetNiche: string;
  style: string;
}

export interface LeadAnalysisModel {
  id: string;
  userId: string;
  leadId: string;
  description: string;
  flaws: string[];
  angle: string;
  revenueLoss: string;
  whyWebsiteNeeded: string;
  score: number | null;
  classification: string;
  hasWebsite: boolean;
  scoreVersion: string;
  band: string | null;
  breakdown: ScoreBreakdownEntryModel[];
  confidence: string;
  coverage: number;
  userProfile: ScoringUserProfileModel;
  calculatedAt: string;
  /** Número de emisión, creciente por Lead (V-1). */
  emission: number;
  createdAt: string;
}
