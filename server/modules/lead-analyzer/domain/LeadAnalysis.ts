/**
 * Entidad de dominio de Lead Analyzer: representa el análisis de oportunidad
 * de un Lead ya existente. Referencia a su Lead mediante `leadId` (el id
 * asignado por persistencia al guardar el Lead, no un campo del propio
 * dominio Lead). No contiene identificador propio ni metadatos de
 * almacenamiento — eso es responsabilidad de la capa de persistencia
 * (ADR-05 §7, Decisión 3), no del dominio.
 */
/**
 * Aportación de una categoría de APS-08 §6 al Opportunity Score.
 *
 * Se conserva íntegra porque **APS-08 §9 exige que todo Score vaya acompañado de
 * una explicación** —qué subió, qué bajó y qué es oportunidad comercial— y
 * porque **ADR-14 §6.3** exige poder **recalcular** la puntuación: sin el
 * desglose, un Score es un número que no puede reconstruirse ni explicarse.
 */
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

/**
 * Perfil de usuario con el que se emitió el Score.
 *
 * **ADR-13 §10.3 V-4 y DEV-00 R-34 obligan a conservarlo.** Sin él la puntuación
 * «no es interpretable a posteriori», porque Compatibilidad pesa el 20 % y mide
 * el encaje con *este* usuario concreto (APS-08 §6.6 · PO-01 §5).
 */
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
  /** Opportunity Score 0-100. `null` es estado válido: Lead sin Score (R-45). */
  score: number | null;
  /** Clasificación del sitio observado. **No** es la banda de APS-08 §8. */
  classification: string;
  hasWebsite: boolean;

  // ── Trazabilidad del Score — R-34 · ADR-14 R-VIN · ADR-13 V-3, V-4 ─────────

  /**
   * Versión del Perfil de Ponderación que produjo el Score. **Vinculación
   * permanente** (R-VIN): «una puntuación sin versión de Perfil asociada es un
   * número sin significado y no podrá utilizarse para ordenar ni para explicar».
   */
  scoreVersion: string;
  /** Banda de APS-08 §8. Etiqueta de prioridad, nunca criterio de admisión. */
  band: string | null;
  breakdown: ScoreBreakdownEntry[];
  /** Confianza declarada del análisis (APS-08 §11). */
  confidence: string;
  /** Proporción de factores de APS-08 §6 efectivamente medidos. */
  coverage: number;
  /** Perfil de usuario con el que se calculó (V-4). */
  userProfile: ScoringUserProfileSnapshot;
  /** Marca temporal de la emisión (ADR-13 §10.3, V-3). */
  calculatedAt: string;
}
