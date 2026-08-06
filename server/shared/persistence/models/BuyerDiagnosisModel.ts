// Persistence model del Diagnóstico Comercial (A-11) — la representación
// almacenada, distinta tanto de la entidad de dominio
// (modules/pitch-generator/domain/commercial/BuyerDiagnosis.ts) como del
// Persistence Contract (shared/persistence/contracts/BuyerDiagnosis.ts), según
// ADR-08 §6. Declarado independientemente y verificado contra el contrato por
// lectura directa — **no importado de él**, conforme a ADR-08 §10 y **R-27**:
// `shared/persistence/models/` solo puede importar primitivos y otros ficheros
// de `shared/persistence/models/`.
//
// Los conjuntos cerrados viajan como `string` y no como uniones literales, igual
// que `classification` y `band` en LeadAnalysisModel: el modelo describe **cómo
// se almacena**, y la validación del vocabulario pertenece al dominio.
//
// Añade los campos técnicos que la entidad y el contrato deliberadamente no
// llevan (ADR-05 §7, Decisión 3): `id`, `userId`, `createdAt`.
//
// **NO lleva `updatedAt`.** Es deliberado: A-11 se **versiona** (ADR-13 §10.3
// V-1) y una fila de diagnóstico **nunca se actualiza**. Un `updatedAt`
// sugeriría que la sobrescritura es posible, y §10.2 la prohíbe expresamente.

export interface DiagnosisVariableModel {
  id: string;
  knowledgeClass: string;
  /**
   * Ausente cuando la variable es `Desconocida` (BD-I2 · CD-04). **Se almacena
   * ausente**, nunca como cadena vacía ni como `null` con significado de valor:
   * la distinción entre «no hay dato» y «el dato es vacío» es la que R-38
   * protege.
   */
  value?: string;
  indicios: string[];
}

export interface BuyerDiagnosisModel {
  id: string;
  userId: string;
  leadId: string;
  /** Número de emisión, creciente por Lead (V-1). Parte de la identidad. */
  issue: number;
  variables: DiagnosisVariableModel[];
  confidence: string;
  criteriaVersion: string;
  /** Marca temporal de la emisión (V-3). */
  issuedAt: string;
  createdAt: string;
}
