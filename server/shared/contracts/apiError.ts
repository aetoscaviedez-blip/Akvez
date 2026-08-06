/**
 * Contrato único de error para toda la API pública de AKVEZ (ADR-06, sección 12).
 * No importa nada — es la base de la que dependen los demás contratos de esta carpeta.
 */

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "AI_FAILURE"
  | "INTERNAL_ERROR";

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details: Record<string, unknown>;
}

export interface ErrorResponseDTO {
  success: false;
  error: ApiError;
}
