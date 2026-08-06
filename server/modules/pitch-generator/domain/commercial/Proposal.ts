// `Proposal` — Entidad · Aggregate Root.
//
// Autoridad: **ADR-16 §4.4**. Desarrollado en PO-02 §3, APS-18 §8 y §11, APS-20
// y ADR-13 A-6. Owner: **Pitch Generator**.
//
// **Qué es.** El artefacto completo de un contacto: **la estrategia que lo
// decide, la evidencia que lo sostiene y el texto que lo expresa**.
//
// **Qué no es.** **No es solo el texto** (P-I1): sin estrategia y evidencia no
// puede explicarse después, que es exactamente lo que la hace útil. **No es un
// contacto**: producirla no contacta a nadie (D-4). Sinónimos prohibidos por
// DDD-01 §8: `Pitch`, `Mensaje`, `Copy`, `Outreach`.

import { Channel } from "./channel";
import { CommercialStrategy } from "./commercialStrategy";
import { ClosedFactList } from "./evidence";
import { CommercialCriteriaVersion } from "./criteriaVersion";
import { SequenceMoment } from "./sequenceMoment";
import { IssueNumber, LeadReference } from "./leadReference";

/**
 * Identidad: **`(Lead, momento de la secuencia, número de emisión)`**
 * (ADR-16 §4.4 · AG-1).
 */
export interface ProposalId {
  lead: LeadReference;
  moment: SequenceMoment;
  issue: IssueNumber;
}

/**
 * **Invariantes** (ADR-16 §4.4):
 *
 * - **P-I1** — **no es solo el texto**.
 * - **P-I2** — **regenerar nunca sustituye**: añade una emisión (PO-02 §3).
 * - **P-I3** — **emitirla no cambia el estadio del Lead** (LS-3). Es la
 *   corrección que ADR-13 v1.2 aplicó sobre E-5 al retirarle A-3.
 * - **P-I4** — **ninguna afirmación suya carece de evidencia en la lista
 *   cerrada**.
 * - **P-I5** — **emitida y nunca enviada es un estado válido**.
 *
 * **Ciclo: versionada.** **Eventos que la afectan:** **E-5** emitida
 * *(versiona; no toca el estadio)*.
 *
 * > **Es el único objeto que atraviesa la Línea de Decisión, y en un solo
 * > sentido:** el dominio construye la lista cerrada, el modelo redacta con
 * > ella, y **el dominio verifica contra ella**. **Un texto que no supera el
 * > punto de control se rehace; no se entrega con advertencia** (ADR-15 §10).
 * >
 * > **RA-5** — ningún resultado generativo modifica un diagnóstico, un estado,
 * > una estrategia ni una secuencia. **El texto es una salida terminal.**
 */
export interface Proposal {
  id: ProposalId;
  /** Las decisiones que gobiernan este contacto (APS-18 §8.1). */
  strategy: CommercialStrategy;
  /** La evidencia que lo sostiene. **Ninguna capa la amplía** (RE-1 · RA-4). */
  affirmableFacts: ClosedFactList;
  /**
   * El texto que lo expresa. **Lo produce un modelo generativo; las decisiones
   * no** (APS-18 §10.1 · ADR-15 §8). El usuario puede reescribirlo antes de
   * enviarlo (APS-18 §8.4).
   */
  text: string;
  channel: Channel;
  /** RC-13 — toda entidad emitida conserva la versión del criterio. */
  criteriaVersion: CommercialCriteriaVersion;
}
