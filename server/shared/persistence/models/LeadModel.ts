// Persistence model for Lead — the stored representation, distinct from both
// the Lead domain entity (modules/lead-hunter/domain/Lead.ts) and the Lead
// persistence contract (shared/persistence/contracts/Lead.ts), per ADR-08 §6.
// Declared independently, verified against shared/persistence/contracts/Lead.ts
// — not imported from it, per ADR-08 §10 (shared/persistence/models/ may
// import only primitives and other files within shared/persistence/models/).
// If the Lead persistence contract changes shape, this file must be updated
// here explicitly.
//
// Adds the technical fields a Domain Entity / Persistence Contract
// deliberately does not carry (ADR-05 §7, Decisión 3): id, userId,
// createdAt, updatedAt.

export type LeadStatus = 'Prospect' | 'Audited' | 'Pitched' | 'Replied' | 'Won' | 'Stale';

export interface LeadModel {
  id: string;
  userId: string;
  name: string;
  website: string;
  phone: string;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  source: string;
  status: LeadStatus;
  /**
   * Identidad natural (ADR-12 §7). Junto con `userId` forma la identidad completa
   * del Lead, `(Referencia de Origen, Usuario)`, sobre la que se apoya la
   * idempotencia del Registro (ADR-13 §11.3, I-2).
   *
   * **La unicidad compuesta `(userId, identityKey)` debe garantizarla el motor**,
   * no la aplicación: RQ-2 de ADS-02 §5 y la verificación heredada VH-3. El
   * adapter en memoria la resuelve en código porque no hay motor todavía, y eso
   * queda registrado como limitación, no como cumplimiento.
   */
  identityKey: string | null;
  identitySource: string | null;
  identityDesignation: string | null;
  /**
   * Fecha de entrada en la Biblioteca. **Nunca se actualiza en los
   * redescubrimientos** (ADR-12 §8.3 E-4 · ADR-13 §10.4 U-3).
   */
  createdAt: string;
  updatedAt: string;
}
