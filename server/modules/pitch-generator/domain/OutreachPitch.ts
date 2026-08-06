/**
 * Entidad de dominio de Pitch Generator: representa un mensaje de outreach
 * generado para un Lead ya existente. Referencia a su Lead mediante `leadId`
 * (el id asignado por persistencia al guardar el Lead). No contiene
 * identificador propio ni metadatos de almacenamiento — eso es
 * responsabilidad de la capa de persistencia (ADR-05 §7, Decisión 3), no
 * del dominio.
 */
export interface OutreachPitch {
  leadId: string;
  channel: string;
  subjectLine: string;
  message: string;
  strategyExplanation: string;
  isFallback: boolean;
}
