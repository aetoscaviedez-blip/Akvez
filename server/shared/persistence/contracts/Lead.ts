// Persistence contract verified against current Lead domain entity. This
// contract is intentionally independent from module domain layers according
// to ADR-08. Verified by direct reading of modules/lead-hunter/domain/Lead.ts
// — not imported from it. If Lead.ts changes shape, this file must be
// updated here explicitly.

export type LeadStatus = 'Prospect' | 'Audited' | 'Pitched' | 'Replied' | 'Won' | 'Stale';

/**
 * Clave de identidad natural del Lead (ADR-12 §7).
 *
 * `identityKey` es la forma comparable de la identidad de la Empresa: la
 * Referencia de Origen `(Fuente, Designación)` cuando existe, o la Huella de
 * Identidad subsidiaria en su ausencia (§7.3, regla S-1).
 *
 * `null` significa **no identificable**: la fuente no aportó designación y no
 * pudo construirse huella. Un Lead así se registra igualmente —ninguna etapa
 * expulsa (PO-01 §8)— pero no podrá reconocerse en descubrimientos posteriores.
 * Nunca se sustituye por un valor aproximado: la regla **S-3** ordena que, ante
 * la duda, dos registros se traten como Leads distintos.
 *
 * La identidad completa del Lead incluye además el **Usuario** (§7.2). El
 * repositorio la resuelve dentro del espacio de un único usuario, nunca entre
 * usuarios (§7.2, corolario · ADR-05 §14).
 */
export interface Lead {
  name: string;
  website: string;
  phone: string;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  source: string;
  status: LeadStatus;

  /** Forma comparable de la identidad de la Empresa. Ver nota anterior. */
  identityKey: string | null;
  /** Fuente que emitió la designación, cuando hay Referencia de Origen. */
  identitySource: string | null;
  /** Designación estable emitida por la fuente, si la aportó. */
  identityDesignation: string | null;
}
