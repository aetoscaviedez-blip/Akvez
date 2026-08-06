// Frontera de mapeo de persistencia del Diagnóstico Comercial (ADR-08 §7): el
// único lugar autorizado a traducir entre el Persistence Contract y
// `BuyerDiagnosisModel` (R-26). Funciones puras — sin I/O, sin acceso a base de
// datos y sin generación de identificadores ni marcas temporales. El Database
// Adapter produce `id`, `userId` y `createdAt` y los pasa explícitamente.

import { BuyerDiagnosis, DiagnosisVariable } from "../contracts/BuyerDiagnosis";
import { BuyerDiagnosisModel, DiagnosisVariableModel } from "../models/BuyerDiagnosisModel";

export interface BuyerDiagnosisPersistenceMeta {
  id: string;
  userId: string;
  createdAt: string;
}

/**
 * Copia cada variable **conservando la ausencia de `value`**.
 *
 * `value` solo se escribe si la variable lo trae. Asignarlo incondicionalmente
 * introduciría la propiedad con valor `undefined`, y una variable `Desconocida`
 * pasaría a *tener* un campo vacío en lugar de no tenerlo — la distinción que
 * **BD-I2 · CD-04 · R-38** exigen conservar.
 */
function toVariableModel(variable: DiagnosisVariable): DiagnosisVariableModel {
  const model: DiagnosisVariableModel = {
    id: variable.id,
    knowledgeClass: variable.knowledgeClass,
    indicios: [...variable.indicios]
  };
  if (variable.value !== undefined) model.value = variable.value;
  return model;
}

function toVariable(model: DiagnosisVariableModel): DiagnosisVariable {
  const variable: DiagnosisVariable = {
    // El vocabulario lo garantiza el dominio, que es quien lo decide; el modelo
    // almacena cadenas (ver cabecera de BuyerDiagnosisModel).
    id: model.id as DiagnosisVariable["id"],
    knowledgeClass: model.knowledgeClass as DiagnosisVariable["knowledgeClass"],
    indicios: [...model.indicios]
  };
  if (model.value !== undefined) variable.value = model.value;
  return variable;
}

export function toBuyerDiagnosisModel(
  diagnosis: BuyerDiagnosis,
  meta: BuyerDiagnosisPersistenceMeta
): BuyerDiagnosisModel {
  return {
    id: meta.id,
    userId: meta.userId,
    leadId: diagnosis.leadId,
    issue: diagnosis.issue,
    // Copia profunda: una vez emitido, un diagnóstico es inmutable y se
    // versiona (RC-9). Compartir la referencia permitiría que el llamador lo
    // alterase después de guardarlo.
    variables: diagnosis.variables.map(toVariableModel),
    confidence: diagnosis.confidence,
    criteriaVersion: diagnosis.criteriaVersion,
    issuedAt: diagnosis.issuedAt,
    createdAt: meta.createdAt
  };
}

export function toBuyerDiagnosis(model: BuyerDiagnosisModel): BuyerDiagnosis {
  return {
    leadId: model.leadId,
    issue: model.issue,
    variables: model.variables.map(toVariable),
    confidence: model.confidence,
    criteriaVersion: model.criteriaVersion,
    issuedAt: model.issuedAt
  };
}
