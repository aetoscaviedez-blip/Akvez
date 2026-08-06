// Persistence model de la **Propuesta comercial (A-6)** — la representación
// almacenada, distinta de la entidad de dominio y del Persistence Contract
// (ADR-08 §6). Declarado independientemente y verificado por lectura directa —
// **no importado**, conforme a ADR-08 §10 y **R-27**.
//
// Los conjuntos cerrados viajan como `string`, igual que en sus tres hermanos:
// el modelo describe cómo se almacena, y **la validación del vocabulario
// pertenece al dominio**.
//
// **NO LLEVA `updatedAt`, y es una consecuencia normativa, no una omisión.**
// ADR-13 §10.3 clasifica A-6 como **versionado, no actualizable**: una fila de
// propuesta **nunca se modifica** —regenerar **añade** una emisión (V-1 · P-I2)—
// y su repositorio **no expone `update`**. Registrar «última actualización»
// sugeriría una operación que no existe. Es el mismo criterio con que
// `BuyerDiagnosisModel` lo omite y `CommercialSequenceModel` sí lo lleva, por ser
// A-12 el único de los tres que se actualiza.
//
// HUECO CONOCIDO: `userId` placeholder de un solo inquilino, heredado de sus
// hermanos. No satisface ADR-05 §14 (deuda **F-3**).

import { AffirmableFactModel } from "./AffirmableFactModel";
import { CommercialStrategyModel } from "./CommercialSequenceModel";

/**
 * Una emisión almacenada.
 *
 * La identidad del agregado es **`(leadId, moment, issue)`** (ADR-16 §4.4 ·
 * AG-1): un mismo momento admite varias emisiones, y **ninguna sustituye a
 * otra**. `id` es el identificador de **persistencia**, no la identidad del
 * negocio (ADR-05 §7, Decisión 3).
 */
export interface ProposalModel {
  id: string;
  userId: string;
  leadId: string;
  /** Conjunto cerrado de APS-18 §9.2, almacenado como `string`. */
  moment: string;
  /** Número de emisión, creciente por `(Lead, momento)`. Parte de la identidad. */
  issue: number;
  strategy: CommercialStrategyModel;
  /**
   * La lista cerrada con la que se redactó y contra la que se verificó.
   * **Ninguna capa la amplía** (RE-1 · RA-4).
   */
  affirmableFacts: AffirmableFactModel[];
  text: string;
  /** Conjunto cerrado de APS-20 §6, almacenado como `string`. */
  channel: string;
  /** RC-13 — la designación del criterio bajo el que se emitió. */
  criteriaVersion: string;
  /** Marca temporal de la emisión (V-3). */
  issuedAt: string;
  createdAt: string;
}
