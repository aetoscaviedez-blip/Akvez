export type LeadStatus = 'Prospect' | 'Audited' | 'Pitched' | 'Replied' | 'Won' | 'Stale';

/**
 * Entidad de dominio de Lead Hunter: representa un negocio descubierto,
 * antes de cualquier análisis de oportunidad. No contiene identificador
 * ni metadatos de almacenamiento — eso es responsabilidad de la capa de
 * persistencia (ADR-05 §7, Decisión 3), no del dominio.
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
}
