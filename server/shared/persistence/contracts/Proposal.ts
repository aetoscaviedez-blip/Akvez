// Persistence contract de la **Propuesta comercial — activo A-6**.
//
// **Verificado por lectura directa de
// `modules/pitch-generator/domain/commercial/Proposal.ts` — no importado de
// allí** (ADR-08 §10 · DEV-00 §5.2).
//
// ⚠️ **Coexiste con `OutreachPitch.ts` sobre el mismo activo A-6.** Aquél es el
// contrato del modelo anterior —asunto, mensaje, tono— y **no representa la
// `Proposal` canónica de ADR-16 §4.4**, que es «estrategia, evidencia y texto» y
// sin las dos primeras **no puede explicarse después** (P-I1). `Pitch`,
// `Mensaje`, `Copy` y `Outreach` son además sinónimos **prohibidos** de
// `Proposal` (DDD-01 §8). La retirada del contrato anterior es una migración que
// no pertenece a esta fase; queda reportada.

import { AffirmableFactRecord } from "./AffirmableFact";
import { CommercialStrategy } from "./CommercialStrategy";
import { Channel, SequenceMoment } from "./commercialValues";

/**
 * Una **emisión** de propuesta. **Regenerar añade; nunca sustituye** (P-I2 ·
 * V-1). ADR-13 §10.3 lo razona: «sin versionado, regenerar destruiría una
 * propuesta que el usuario podía preferir».
 *
 * La identidad del agregado es `(Lead, momento, número de emisión)`
 * (ADR-16 §4.4 · AG-1): un mismo momento admite varias emisiones.
 *
 * **P-I3 — emitirla no cambia el estadio del Lead.** Este contrato **no expone
 * ninguna operación ni ningún campo de estadio**, y su repositorio tampoco: la
 * corrección que ADR-13 v1.2 aplicó a E-5 retirándole A-3 se sostiene aquí por
 * construcción.
 */
export interface Proposal {
  leadId: string;
  moment: SequenceMoment;
  issue: number;
  strategy: CommercialStrategy;
  /**
   * La lista cerrada de hechos afirmables con la que se redactó.
   *
   * **P-I4** — ninguna afirmación de la propuesta carece de evidencia aquí.
   * Se conserva con la emisión porque **es lo que permite verificarla después**:
   * sin ella, el punto de control de ADR-15 §10 no sería reproducible.
   *
   * **Cada hecho conserva su enunciado, su clase y su origen** (COM-20 · COM-21).
   * Conservar solo el enunciado dejaría la afirmación y **destruiría el rastro
   * que APS-18 §11.1 exige**.
   */
  affirmableFacts: AffirmableFactRecord[];
  text: string;
  channel: Channel;
  /** RC-13 — toda entidad emitida conserva la versión del criterio. */
  criteriaVersion: string;
  /** Marca temporal de la emisión (V-3). */
  issuedAt: string;
}
