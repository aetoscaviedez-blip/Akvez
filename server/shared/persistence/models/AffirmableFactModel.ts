// Persistence model del Hecho Afirmable — la representación almacenada,
// distinta de la entidad de dominio y del Persistence Contract (ADR-08 §6).
// Declarado independientemente y verificado por lectura directa — **no
// importado**, conforme a ADR-08 §10 y **R-27**.
//
// Los conjuntos cerrados viajan como `string`, igual que en los tres modelos
// existentes: **el modelo describe cómo se almacena, y la validación del
// vocabulario pertenece al dominio**.
//
// Vive en fichero propio porque lo comparten **dos** modelos: el de la Propuesta
// y la estrategia que la Secuencia Comercial conserva por contacto.

/**
 * Forma almacenada de la Referencia de Origen (ADR-12 §7.1).
 *
 * **`source` es la Fuente**, y es lo que hace rastreable la afirmación
 * (APS-18 §11.1). **Nunca entra en el enunciado**: es metadato, no argumento.
 */
export interface EvidenceSourceModel {
  observation: string;
  source: string;
}

/**
 * Forma almacenada de un hecho afirmable.
 *
 * **Sin `lead`**: se deriva de `ProposalModel.leadId` (COM-20 §3.1 · COM-21
 * §3.3). Almacenarlo por hecho repetiría N veces un valor que la fila ya declara
 * una vez.
 */
export interface AffirmableFactModel {
  kind: string;
  statement: string;
  source: EvidenceSourceModel;
}
