/**
 * Une una entidad de dominio con el identificador asignado por persistencia.
 * Usado únicamente en las firmas de Repository — el dominio nunca conoce
 * este tipo (ADR-05 §7, Decisión 3: el id pertenece a persistencia, no a
 * la entidad de negocio).
 */
export type Identified<T> = T & { id: string };
