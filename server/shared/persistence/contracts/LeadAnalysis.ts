// Persistence contract verified against current LeadAnalysis domain entity.
// This contract is intentionally independent from module domain layers
// according to ADR-08. Verified by direct reading of
// modules/lead-analyzer/domain/LeadAnalysis.ts — not imported from it. If
// LeadAnalysis.ts changes shape, this file must be updated here explicitly.
//
// AMPLIADO EN DEV-04 — se incorporan los campos que **DEV-00 R-34** exige
// conservar en cada emisión de Score: la versión del Perfil de Ponderación
// (ADR-14 R-VIN) y el perfil de usuario con el que se calculó (ADR-13 §10.3
// V-4), más el desglose que hace la puntuación explicable y reproducible
// (APS-08 §9 · ADR-14 §6.3) y su marca temporal (ADR-13 V-3).

/** Aportación de una categoría de APS-08 §6 al Score. */
export interface ScoreBreakdownEntry {
  category: string;
  label: string;
  weight: number;
  /** `null` cuando ningún factor de la categoría pudo medirse (R-38). */
  partialScore: number | null;
  contribution: number;
  measuredFactors: string[];
  unmeasuredFactors: string[];
  rationale: string;
}

/** Perfil de usuario conservado con la emisión (V-4 · R-34). */
export interface ScoringUserProfileSnapshot {
  targetNiche: string;
  style: string;
}

export interface LeadAnalysis {
  leadId: string;
  description: string;
  flaws: string[];
  angle: string;
  revenueLoss: string;
  whyWebsiteNeeded: string;
  /** `null` es estado válido: un Lead sin Score existe legítimamente (R-45). */
  score: number | null;
  classification: string;
  hasWebsite: boolean;

  /** Versión del Perfil de Ponderación. Vinculación permanente (R-VIN). */
  scoreVersion: string;
  band: string | null;
  breakdown: ScoreBreakdownEntry[];
  confidence: string;
  coverage: number;
  userProfile: ScoringUserProfileSnapshot;
  calculatedAt: string;
  /**
   * Número de emisión para este Lead, empezando en 1.
   *
   * **ADR-13 §10.3 V-1**: «cada emisión nueva **añade** una versión; ninguna
   * retira la anterior». **V-2**: la vigente es la más reciente. Es el campo que
   * permite cumplir ambas sin destruir historia (ADR-14 §6.6, No destrucción).
   *
   * **Opcional por la misma razón que `id` no está en este contrato:** lo asigna
   * la capa de persistencia, no el llamador (ADR-05 §7, Decisión 3). Se omite al
   * guardar —el Adapter lo calcula a partir de lo ya almacenado, de modo que la
   * secuencia no pueda falsearse— y viene siempre poblado al leer.
   */
  emission?: number;
}
