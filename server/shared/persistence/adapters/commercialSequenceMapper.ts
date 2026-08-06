// Frontera de mapeo de persistencia de la Secuencia Comercial (ADR-08 §7): el
// único lugar autorizado a traducir entre el Persistence Contract y
// `CommercialSequenceModel` (R-26). Funciones puras — sin I/O y sin generación de
// identificadores ni marcas temporales: el Database Adapter las produce y las
// pasa explícitamente.

import { CommercialSequence, PlannedMoment } from "../contracts/CommercialSequence";
import { CommercialSequenceModel, PlannedMomentModel } from "../models/CommercialSequenceModel";
import { SequenceMoment, SequenceStatus } from "../contracts/commercialValues";
// **La traducción del hecho y de la estrategia es compartida** — COM-33 §2. La
// estrategia que un contacto conserva **es la misma** que conserva una
// `Proposal` (COM-21 §5), y traducirla dos veces hacía posible que cada agregado
// la almacenase de una forma. El plan, el momento y el resultado declarado
// siguen siendo competencia exclusiva de este mapper.
import { toCommercialStrategy, toCommercialStrategyModel } from "./commercialStrategyMapper";

/**
 * Copia un momento planificado **conservando la ausencia** de la estrategia y
 * del resultado declarado. Asignarlos incondicionalmente introduciría las
 * propiedades con `undefined`, y un momento sin estrategia pasaría a *tener* una
 * estrategia vacía — la distinción que R-38 protege y que SC-R1 hace
 * significativa: la estrategia se decide **antes de usar** el contacto, no al
 * diseñar el plan.
 */
function toPlannedMomentModel(planned: PlannedMoment): PlannedMomentModel {
  const model: PlannedMomentModel = {
    moment: planned.moment,
    proposals: [...planned.proposals]
  };
  if (planned.strategy !== undefined) model.strategy = toCommercialStrategyModel(planned.strategy);
  if (planned.declaredOutcome !== undefined) {
    model.declaredOutcome = { responded: planned.declaredOutcome.responded };
    if (planned.declaredOutcome.manifestation !== undefined) {
      model.declaredOutcome.manifestation = planned.declaredOutcome.manifestation;
    }
  }
  return model;
}

function toPlannedMoment(model: PlannedMomentModel): PlannedMoment {
  const planned: PlannedMoment = {
    moment: model.moment as SequenceMoment,
    proposals: [...model.proposals]
  };
  if (model.strategy !== undefined) planned.strategy = toCommercialStrategy(model.strategy);
  if (model.declaredOutcome !== undefined) {
    planned.declaredOutcome = { responded: model.declaredOutcome.responded };
    if (model.declaredOutcome.manifestation !== undefined) {
      planned.declaredOutcome.manifestation = model.declaredOutcome.manifestation;
    }
  }
  return planned;
}

export interface CommercialSequencePersistenceMeta {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function toCommercialSequenceModel(
  sequence: CommercialSequence,
  meta: CommercialSequencePersistenceMeta
): CommercialSequenceModel {
  const model: CommercialSequenceModel = {
    id: meta.id,
    userId: meta.userId,
    leadId: sequence.leadId,
    sequence: sequence.sequence,
    status: sequence.status,
    plan: sequence.plan.map(toPlannedMomentModel),
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt
  };
  if (sequence.currentMoment !== undefined) model.currentMoment = sequence.currentMoment;
  return model;
}

export function toCommercialSequence(model: CommercialSequenceModel): CommercialSequence {
  const sequence: CommercialSequence = {
    leadId: model.leadId,
    sequence: model.sequence,
    status: model.status as SequenceStatus,
    plan: model.plan.map(toPlannedMoment)
  };
  if (model.currentMoment !== undefined) {
    sequence.currentMoment = model.currentMoment as SequenceMoment;
  }
  return sequence;
}
