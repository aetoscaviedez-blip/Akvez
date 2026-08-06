// Persistence contract del **Diagnóstico Comercial — activo A-11**.
//
// **Verificado por lectura directa de
// `modules/pitch-generator/domain/commercial/BuyerDiagnosis.ts` — no importado
// de allí** (ADR-08 §10 · DEV-00 §5.2). Si el dominio cambia de forma, este
// fichero se actualiza aquí explícitamente.
//
// ADR-13 §6.2 fija el contenido de A-11: «Las siete variables de APS-19 §6 con
// su clase de conocimiento, sus indicios y su confianza · el **Commercial
// State** · la versión del criterio comercial».

import { CommercialState, DiagnosisVariableId, KnowledgeClass } from "./commercialValues";

/**
 * Una de las siete variables.
 *
 * **BD-I2** — una variable `Desconocida` **no tiene valor**: `value` ausente es
 * ausente y la persistencia **nunca lo sustituye por un valor por defecto**
 * (R-38 · BD-R2 · RC-10).
 * **BD-I3** — toda `Inferida` conserva sus indicios.
 */
export interface DiagnosisVariable {
  id: DiagnosisVariableId;
  knowledgeClass: KnowledgeClass;
  /** En BD-1 el valor es un `CommercialState` (BD-I4). */
  value?: CommercialState | string;
  indicios: string[];
}

/**
 * Una **emisión** del diagnóstico. **Nunca sustituye a la anterior** (V-1).
 *
 * `issue` es el número de emisión que, junto al Lead, forma la identidad del
 * agregado (ADR-16 §4.2 · AG-1). `issuedAt` cumple **V-3**: cada versión
 * conserva su marca temporal.
 *
 * **No lleva campo `commercialState`**: el Commercial State es la variable BD-1
 * y reside dentro de `variables` (**BD-I4** · ADR-13 §6.2, que declara
 * expresamente que «el Commercial State no es un activo propio»).
 */
export interface BuyerDiagnosis {
  leadId: string;
  issue: number;
  variables: DiagnosisVariable[];
  confidence: string;
  /** RC-13 — toda entidad emitida conserva la versión del criterio. */
  criteriaVersion: string;
  /** Marca temporal de la emisión (V-3). */
  issuedAt: string;
}
