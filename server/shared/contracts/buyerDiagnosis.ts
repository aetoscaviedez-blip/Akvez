/**
 * Contrato público del Diagnóstico Comercial (ADR-06 · ADR-07).
 *
 * Independiente de `domain/`, `application/`, `infrastructure/` y
 * `persistence/`: **declara su forma pública y no deriva de ninguna entidad
 * interna** (R-14). Si el dominio cambia, este contrato solo cambia si la API
 * pública debe cambiar — que es exactamente la libertad que justifica su
 * existencia.
 */

import { ErrorResponseDTO } from "./apiError";

/**
 * Lo que el cliente declara sobre la presencia digital observada.
 *
 * **Viaja como cadena y no como unión cerrada.** El vocabulario lo decide el
 * dominio (APS-19 · APS-20), y un contrato público que lo replicase obligaría a
 * versionar la API cada vez que el dominio ampliase un conjunto cerrado. La
 * validación del valor pertenece a la frontera, no al transporte.
 */
export interface DiagnosisRequestDTO {
  digitalPresence: string;
  presenceOrigin: string;
  rating?: number;
  reviewCount?: number;
}

/**
 * Una variable del diagnóstico, tal como se publica.
 *
 * `value` es **opcional y se omite cuando la variable es `Desconocida`**
 * (BD-I2 · CD-04). No se sustituye por `null` ni por cadena vacía: la respuesta
 * debe permitir distinguir «no se sabe» de «se sabe que está vacío» (R-38), y
 * un cliente que reciba la propiedad ausente no puede confundirlas.
 */
export interface DiagnosisVariableDTO {
  id: string;
  knowledgeClass: string;
  value?: string;
  /** Los hechos observados que sostienen la lectura (CD-03). */
  indicios: string[];
}

export interface DiagnosisDTO {
  id: string;
  leadId: string;
  /** Número de emisión. Junto al Lead forma la identidad (ADR-16 §4.2). */
  issue: number;
  issuedAt: string;
  variables: DiagnosisVariableDTO[];
  confidence: string;
}

export interface DiagnosisResponseDTO {
  success: true;
  diagnosis: DiagnosisDTO;
}

export type DiagnosisResult = DiagnosisResponseDTO | ErrorResponseDTO;
