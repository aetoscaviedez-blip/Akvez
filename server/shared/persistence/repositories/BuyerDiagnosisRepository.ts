import { BuyerDiagnosis } from "../contracts/BuyerDiagnosis";
import { Identified } from "./Identified";

/**
 * Puerto de persistencia del **Diagnóstico Comercial (A-11)**. Sin
 * implementación — ver `LeadRepository.ts` para la nota sobre dónde debe vivir.
 *
 * **AL-06 · ADR-08 §6, §10** — el puerto de persistencia vive aquí y **no se
 * traslada a `domain/`**. Se expresa en términos de un **Persistence Contract**,
 * nunca de la entidad de dominio ni del Persistence Model. `application/` lo
 * recibe **por inyección** desde el Composition Root y jamás conoce al adapter
 * que lo implementa (R-22 · ADR-09 §5.3).
 *
 * **SEMÁNTICA: VERSIONAR** (ADR-13 §10.3, activo A-11):
 *   · **V-1** — cada emisión **añade**; ninguna retira la anterior. `save` es
 *     **append-only** y **nunca sobrescribe**.
 *   · **V-2** — existe siempre una emisión **vigente**, la más reciente.
 *   · **V-3** — cada versión conserva su marca temporal.
 *   · **V-5** — una emisión nueva **nunca altera la identidad ni el estadio** ya
 *     alcanzado por el Lead. Por eso este puerto **no expone ninguna operación
 *     sobre el estadio**: solo E-9 lo toca (CE-I1).
 *
 * **Por qué se versiona** (ADR-13 §10.3): APS-19 §4.3 establece que una
 * manifestación del comprador prevalece sobre toda lectura inferida.
 * *«Prevalecer significa que la sustituye, no que la borre»* — comparar el
 * diagnóstico anterior con el corregido por el propio comprador es «el
 * conocimiento comercial más valioso que el sistema puede adquirir».
 */
export interface BuyerDiagnosisRepository {
  /** Registra una emisión nueva. **Append-only** (V-1). */
  save(diagnosis: BuyerDiagnosis): Promise<Identified<BuyerDiagnosis>>;

  /**
   * Devuelve la emisión **vigente** de un Lead: la más reciente (V-2).
   *
   * `null` es estado válido: **un Lead sin diagnóstico es correcto**
   * (DDD-01 §7.3, cardinalidad 1 : 0..n). Nunca es motivo para ocultarlo
   * (R-44 · UI-2).
   */
  findCurrentByLeadId(leadId: string): Promise<Identified<BuyerDiagnosis> | null>;

  /**
   * Historial completo de emisiones de un Lead, de la más antigua a la más
   * reciente. **Permite comprobar que ninguna emisión destruyó a la anterior**
   * (RC-9 · §10.2) y sostiene la comparación que ADR-13 §10.3 declara
   * conocimiento comercial.
   */
  findVersionsByLeadId(leadId: string): Promise<Identified<BuyerDiagnosis>[]>;
}
