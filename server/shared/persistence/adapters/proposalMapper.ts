// Frontera de mapeo de persistencia de la Propuesta Comercial (ADR-08 §7): el
// único lugar autorizado a traducir entre el Persistence Contract y
// `ProposalModel` (R-26). **Funciones puras** — sin I/O y **sin generación de
// identificadores ni marcas temporales**: el Database Adapter las produce y las
// pasa explícitamente.
//
// ── LO QUE ESTE FICHERO NO HACE, Y NO PUEDE HACER ────────────────────────────
//
// **No lee ninguna decisión: las copia.** `objective`, `barrier` y `emotion`
// atraviesan este fichero sin ser inspeccionados. **No construye estrategias**
// —vive fuera del módulo y no puede importar su `domain/` (ADR-08 §10 · R-27)—,
// **no añade ni quita hechos** (RA-4 · RE-1) y **no toca la identidad**.
//
// **Tampoco deriva `lead`.** El registro no lo conserva y esta capa no lo repone:
// rearmar la entidad de dominio ocurre en `application/` (COM-22 §3.1 · §5.5).

import { Proposal } from "../contracts/Proposal";
import { ProposalModel } from "../models/ProposalModel";
import { Channel, SequenceMoment } from "../contracts/commercialValues";
// **La traducción del hecho y de la estrategia es compartida** — COM-33 §2. Son
// los dos valores que A-6 y A-12 conservan por igual, y el fichero que los
// traduce no conoce ningún agregado: la fila, la identidad y el `meta` siguen
// siendo competencia exclusiva de este mapper.
import {
  toAffirmableFactModel,
  toAffirmableFactRecord,
  toCommercialStrategy,
  toCommercialStrategyModel
} from "./commercialStrategyMapper";

/**
 * Lo que el adapter **genera** y el mapper **no**: identidad de persistencia y
 * metadatos.
 *
 * **Sin `updatedAt`**: A-6 se versiona, no se actualiza (ADR-13 §10.3).
 */
export interface ProposalPersistenceMeta {
  id: string;
  userId: string;
  createdAt: string;
}

export function toProposalModel(proposal: Proposal, meta: ProposalPersistenceMeta): ProposalModel {
  return {
    id: meta.id,
    userId: meta.userId,
    createdAt: meta.createdAt,
    // La identidad viaja intacta: reescribirla aquí haría que la devuelta no
    // fuese la que el dominio construyó (ADR-16 §4.4 · AG-1).
    leadId: proposal.leadId,
    moment: proposal.moment,
    issue: proposal.issue,
    strategy: toCommercialStrategyModel(proposal.strategy),
    affirmableFacts: proposal.affirmableFacts.map(toAffirmableFactModel),
    text: proposal.text,
    channel: proposal.channel,
    criteriaVersion: proposal.criteriaVersion,
    issuedAt: proposal.issuedAt
  };
}

export function toProposal(model: ProposalModel): Proposal {
  return {
    leadId: model.leadId,
    moment: model.moment as SequenceMoment,
    issue: model.issue,
    strategy: toCommercialStrategy(model.strategy),
    affirmableFacts: model.affirmableFacts.map(toAffirmableFactRecord),
    text: model.text,
    channel: model.channel as Channel,
    criteriaVersion: model.criteriaVersion,
    issuedAt: model.issuedAt
  };
}
