// Traducción de un error del SDK de Gemini a una descripción auditable
// (Sprint 15, Tarea 4, Fase 3).
//
// UBICACIÓN — Vive en `shared/ai` porque codifica conocimiento del SDK de
// Gemini. Conforme ADR-04 §11, `shared/ai` es accesible **únicamente desde la
// capa `infrastructure/`** de cada módulo: son los Adapters quienes capturan el
// error del proveedor y quienes deben describirlo. `application/` nunca importa
// este archivo — solo registra su propia decisión de activar el respaldo.
//
// NO extrae ni transporta prompts, respuestas ni credenciales: únicamente tipo
// de error, código HTTP y un mensaje resumido. El saneamiento final (redacción
// de credenciales y recorte) lo aplica `shared/observability` en el punto de
// registro, de modo que ningún llamador pueda omitirlo.

export interface GeminiFailureDescription {
  /** Nombre de la clase del error tal como lo reporta el runtime. Dato factual,
   *  no una clasificación inferida. */
  type: string;
  /** Código HTTP devuelto por el proveedor, si el error lo expone. */
  httpStatus?: number;
  /** Nombre canónico del estado gRPC/Google (UNAVAILABLE, NOT_FOUND, …). */
  statusText?: string;
  /** Mensaje del error, sin sanear todavía. */
  message: string;
}

/**
 * Estados canónicos que la API de Gemini devuelve junto al código HTTP.
 * Se buscan de forma literal: no se deduce ninguno que el proveedor no haya
 * escrito explícitamente.
 */
const CANONICAL_STATUS =
  /\b(INVALID_ARGUMENT|FAILED_PRECONDITION|OUT_OF_RANGE|UNAUTHENTICATED|PERMISSION_DENIED|NOT_FOUND|RESOURCE_EXHAUSTED|DEADLINE_EXCEEDED|UNAVAILABLE|INTERNAL|UNKNOWN|CANCELLED)\b/;

/**
 * `status` numérico anclado a una etiqueta explícita (`status: 503`,
 * `"code": 429`). El anclaje evita confundir con un 3 dígitos cualquiera del
 * mensaje — se prefiere no reportar código antes que reportar uno inventado.
 */
const LABELLED_HTTP_CODE = /\b(?:status|statusCode|code|http)\b["'\s:=]*(\d{3})\b/i;

export function describeGeminiFailure(error: unknown): GeminiFailureDescription {
  const err = error as any;

  return {
    type: resolveType(err),
    httpStatus: resolveHttpStatus(err),
    statusText: resolveStatusText(err),
    message: resolveMessage(err)
  };
}

function resolveType(err: any): string {
  if (err?.constructor?.name && err.constructor.name !== "Object") {
    return err.constructor.name;
  }
  if (err?.name) return String(err.name);
  return typeof err;
}

/**
 * En `@google/genai`, `ApiError.status` es el código HTTP **numérico**. Otros
 * transportes usan `statusCode`, y algunos errores solo lo dejan escrito en el
 * mensaje. Se leen en ese orden de fiabilidad.
 */
function resolveHttpStatus(err: any): number | undefined {
  if (typeof err?.status === "number") return err.status;
  if (typeof err?.statusCode === "number") return err.statusCode;
  if (typeof err?.response?.status === "number") return err.response.status;

  const match = LABELLED_HTTP_CODE.exec(messageOf(err));
  if (!match) return undefined;

  const code = Number(match[1]);
  return code >= 100 && code <= 599 ? code : undefined;
}

/**
 * Algunos errores traen el nombre canónico en `status` (string) en lugar del
 * código numérico; en otros aparece dentro del mensaje.
 */
function resolveStatusText(err: any): string | undefined {
  if (typeof err?.status === "string" && err.status.trim() !== "") {
    return err.status;
  }
  const match = CANONICAL_STATUS.exec(messageOf(err));
  return match ? match[1] : undefined;
}

function resolveMessage(err: any): string {
  const message = messageOf(err);
  return message.trim() !== "" ? message : "(sin mensaje)";
}

function messageOf(err: any): string {
  if (typeof err?.message === "string") return err.message;
  if (err === undefined || err === null) return "";
  return String(err);
}
