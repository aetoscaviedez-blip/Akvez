import { ApiErrorCode, ErrorResponseDTO } from "../contracts/apiError";

/**
 * Construye el contrato único de error (ADR-06, sección 12). Punto central
 * de creación de ErrorResponseDTO — cualquier otro mapper o, en un futuro
 * Sprint de conexión, cualquier ruta, debería construir sus errores a
 * través de esta función en vez de crear el objeto a mano.
 */
export function toErrorResponseDTO(
  code: ApiErrorCode,
  message: string,
  details: Record<string, unknown> = {}
): ErrorResponseDTO {
  return {
    success: false,
    error: { code, message, details }
  };
}

/**
 * Prepara el terreno para reemplazar las dos formas de error que existen
 * hoy en las rutas reales (`prospectSearchRoute.ts`, `prospectOutreachRoute.ts`):
 *   - `{ error: "..." }` (sin `success`, usada en las validaciones 400)
 *   - `{ success: false, error: "..." }` (usada en los errores 500)
 * por el contrato único. No modifica ningún handler — es la función que un
 * futuro Sprint de conexión usará para hacerlo.
 */
export function fromLegacyError(
  raw: { error: string } | { success: false; error: string },
  code: ApiErrorCode = "INTERNAL_ERROR"
): ErrorResponseDTO {
  return toErrorResponseDTO(code, raw.error);
}

/**
 * Normaliza una excepción de JavaScript (ej. un `catch (error: any)` como
 * los que ya existen en discoverProspects.ts, analyzeProspects.ts y
 * generateOutreachPitch.ts) hacia el contrato único de error.
 */
export function fromException(err: unknown, code: ApiErrorCode = "INTERNAL_ERROR"): ErrorResponseDTO {
  const message = err instanceof Error ? err.message : String(err);
  return toErrorResponseDTO(code, message);
}
