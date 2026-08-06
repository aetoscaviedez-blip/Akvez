import { Proposal } from "../contracts/Proposal";
import { SequenceMoment } from "../contracts/commercialValues";
import { Identified } from "./Identified";

/**
 * Puerto de persistencia de la **Propuesta comercial (A-6)**. Sin implementación
 * (AL-06 · ADR-08 §6, §10).
 *
 * ⚠️ **Sustituye conceptualmente a `OutreachPitchRepository`**, que declara el
 * mismo activo A-6 bajo el modelo anterior —asunto, mensaje, tono— y hoy **no lo
 * usa nadie**. La retirada de aquél es una migración posterior; ambos coexisten
 * mientras tanto y **ninguna capa debe usar los dos**.
 *
 * **SEMÁNTICA: VERSIONAR** (ADR-13 §10.3):
 *   · **V-1** — `save` es **append-only**. **P-I2: regenerar añade; nunca
 *     sustituye.** ADR-13 §10.3 lo razona: «sin versionado, regenerar destruiría
 *     una propuesta que el usuario podía preferir».
 *   · **V-3** — cada emisión conserva su marca temporal.
 *
 * **P-I3 · LS-3 — emitir una Propuesta no cambia el estadio del Lead.** Este
 * puerto **no expone ninguna operación de estadio**, y no puede exponerla: ADR-13
 * v1.2 retiró A-3 de E-5 precisamente para cerrar esa conflación.
 *
 * **P-I5 — emitida y nunca enviada es un estado válido.** No existe operación de
 * «marcar como enviada»: AKVEZ **no envía y no observa** (PO-02 §6.2). Lo que
 * ocurrió lo declara el usuario, y eso es un `ContactEvent`.
 */
export interface ProposalRepository {
  /** Registra una emisión nueva. **Append-only** (V-1 · P-I2). */
  save(proposal: Proposal): Promise<Identified<Proposal>>;

  /**
   * Devuelve la emisión **vigente** de un momento concreto: la más reciente
   * (V-2). `null` cuando ese momento aún no ha producido ninguna.
   */
  findCurrentByMoment(
    leadId: string,
    moment: SequenceMoment
  ): Promise<Identified<Proposal> | null>;

  /**
   * **Todas** las emisiones de un momento, de la más antigua a la más reciente.
   *
   * Es lo que hace verificable **P-I2**: si una regeneración hubiese sustituido
   * a la anterior, se vería aquí.
   */
  findVersionsByMoment(
    leadId: string,
    moment: SequenceMoment
  ): Promise<Identified<Proposal>[]>;

  /**
   * Todas las emisiones de un Lead, de cualquier momento. Sin filtro ni recorte:
   * un límite aquí reintroduciría en la frontera de persistencia un recorte
   * sobre el conjunto, prohibido por R-42 y R-44.
   */
  findByLeadId(leadId: string): Promise<Identified<Proposal>[]>;
}
