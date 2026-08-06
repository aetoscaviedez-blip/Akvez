import { LeadAnalysis } from "../contracts/LeadAnalysis";
import { Identified } from "./Identified";

/**
 * Contrato de persistencia para LeadAnalysis. Sin implementación — ver
 * LeadRepository.ts para la misma nota sobre dónde debe vivir la
 * implementación real.
 *
 * SEMÁNTICA DE VERSIONADO — **ADR-13 §10.3** gobierna este contrato:
 *   · **V-1** — cada emisión nueva **añade** una versión; ninguna retira la
 *     anterior. `save` es por tanto **append-only**: nunca sobrescribe.
 *   · **V-2** — existe siempre una versión vigente, la más reciente, y es la que
 *     se presenta al usuario. Es lo que devuelve `findByLeadId`.
 *   · **V-3** — cada versión conserva su marca temporal.
 *   · **V-5** — una emisión nueva nunca altera la identidad ni el estadio ya
 *     alcanzado por el Lead.
 *
 * ADR-13 §10.2 prohíbe implementar el versionado como sobrescritura, y ADR-14
 * §6.6 lo refuerza: la comparación entre el diagnóstico anterior y el nuevo **es
 * conocimiento comercial** y no puede destruirse.
 */
export interface LeadAnalysisRepository {
  /** Registra una emisión nueva. **Append-only** (V-1). */
  save(analysis: LeadAnalysis): Promise<Identified<LeadAnalysis>>;

  /** Devuelve la emisión **vigente** de un Lead: la más reciente (V-2). */
  findByLeadId(leadId: string): Promise<Identified<LeadAnalysis> | null>;

  /**
   * Devuelve **todas** las emisiones vigentes, una por Lead.
   *
   * Existe para que la Biblioteca pueda mostrar el Score de cada Lead sin lanzar
   * una consulta por Lead. No filtra ni recorta: un Lead sin análisis
   * simplemente no aparece aquí, y eso es estado válido (R-45) — nunca un motivo
   * para ocultarlo de la Biblioteca (R-44 · UI-2).
   */
  findCurrentForAllLeads(): Promise<Identified<LeadAnalysis>[]>;

  /**
   * Historial completo de emisiones de un Lead, de la más antigua a la más
   * reciente. Sostiene la **Trazabilidad** de ADR-14 §6.4 y la **Auditabilidad**
   * de §6.5: permite comprobar que ninguna emisión destruyó a la anterior.
   */
  findVersionsByLeadId(leadId: string): Promise<Identified<LeadAnalysis>[]>;
}
