/**
 * Contrato público de POST /api/prospect/outreach (ADR-06, sección 10).
 * Independiente de domain/, application/, infrastructure/ y persistence/ — ver
 * ADR-06 sección 11 (Reglas de Aislamiento).
 */

import { ErrorResponseDTO } from "./apiError";

/**
 * Se mantienen únicamente los cinco campos del perfil del diseñador que el
 * generador de outreach usa realmente hoy (name, style, skills, tone,
 * caseStudies) — `targetNiche` no se incluye porque no lo consume el prompt
 * actual. La autenticación y un futuro perfil de `User` persistido son fase
 * posterior (ADR-05 §10); hasta entonces, este contrato debe seguir siendo
 * funcionalmente suficiente para generar un pitch (ADR-06, Decisión
 * Importante 2) — por eso `designer` no se elimina todavía.
 */
export interface DesignerProfileDTO {
  name: string;
  style: string;
  skills: string;
  tone: string;
  caseStudies: string;
}

/**
 * `leadId` es un campo futuro que depende de conectar server/shared/persistence/
 * (Sprint 11) — no existe todavía identidad de servidor para un lead
 * (ADR-06, Decisión Importante 6).
 */
export interface OutreachRequestDTO {
  leadId: string;
  designer: DesignerProfileDTO;
  channel: string;
  customInstructions?: string;
}

export interface OutreachPitchDTO {
  subjectLine: string;
  message: string;
}

/**
 * Booleano explícito — reemplaza el mecanismo actual de detectar el respaldo
 * mediante un substring dentro de otro campo (ADR-06, Decisión Importante 4).
 */
export interface OutreachResponseMetadata {
  isFallback: boolean;
}

export interface OutreachResponseDTO {
  success: boolean;
  pitch: OutreachPitchDTO;
  metadata: OutreachResponseMetadata;
}

export type OutreachPitchResult = OutreachResponseDTO | ErrorResponseDTO;
