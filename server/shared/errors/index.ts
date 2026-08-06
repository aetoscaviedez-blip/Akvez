// Taxonomía común de errores de AKVEZ.
//
// Origen normativo — no se inventa ninguna categoría:
//   · APS-03 §12 "Manejo de Errores" clasifica los errores en EXACTAMENTE cuatro:
//     error de entrada, error de datos externos, error interno del agente y
//     error de comunicación.
//   · ADR-04 §11 sitúa esa taxonomía en `shared/errors` y la declara
//     "accesible desde cualquier capa".
//
// Por eso este módulo NO tiene dependencias: ni de dominio, ni de infraestructura,
// ni de HTTP, ni de ningún SDK. Puede importarse desde `domain/` sin violar
// DEV-00 R-04.
//
// NO contiene errores específicos del negocio. Cuando un módulo necesite uno,
// extenderá la clase de la categoría que le corresponda.

/**
 * Las cuatro categorías de APS-03 §12. Es una lista cerrada: añadir una quinta
 * exigiría modificar APS-03, que es un documento `Approved`.
 */
export type ErrorCategory =
  | "input"          // Error de entrada
  | "external_data"  // Error de datos externos
  | "agent_internal" // Error interno del agente
  | "communication"; // Error de comunicación

/**
 * Raíz de la taxonomía. No se instancia directamente: todo error pertenece a
 * una de las cuatro categorías.
 *
 * `cause` conserva el error original sin perderlo, de modo que un fallo de
 * proveedor externo pueda envolverse sin destruir su traza — condición para que
 * APS-03 §12 («el sistema deberá continuar procesando el resto de empresas»)
 * sea diagnosticable.
 */
export abstract class AkvezError extends Error {
  abstract readonly category: ErrorCategory;

  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = new.target.name;
    this.cause = cause;
    // Necesario al extender Error compilando a ES2022 con `useDefineForClassFields: false`.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * **Error de entrada.** Los datos recibidos no permiten ejecutar la operación:
 * faltan parámetros, están vacíos o no tienen la forma esperada.
 *
 * Es responsabilidad de quien invoca, no del sistema.
 */
export class InputError extends AkvezError {
  readonly category: ErrorCategory = "input";
}

/**
 * **Error de datos externos.** Una fuente externa respondió, pero lo devuelto no
 * es utilizable: formato inesperado, campos ausentes o contenido no interpretable.
 *
 * Se distingue de `CommunicationError` en que **sí hubo respuesta**.
 */
export class ExternalDataError extends AkvezError {
  readonly category: ErrorCategory = "external_data";
}

/**
 * **Error interno del agente.** El fallo se produjo dentro de la lógica de AKVEZ:
 * un invariante incumplido o un estado imposible.
 *
 * Nunca debe usarse para justificar la pérdida de un Lead ya registrado
 * (PO-01 §8; ADR-13 §11.2, regla A-2).
 */
export class AgentInternalError extends AkvezError {
  readonly category: ErrorCategory = "agent_internal";
}

/**
 * **Error de comunicación.** No se pudo obtener respuesta de un servicio externo:
 * red caída, tiempo de espera agotado, credenciales rechazadas o cupo excedido.
 *
 * Se distingue de `ExternalDataError` en que **no hubo respuesta utilizable**.
 */
export class CommunicationError extends AkvezError {
  readonly category: ErrorCategory = "communication";
}

/** Discrimina un error de la taxonomía frente a cualquier valor lanzado. */
export function isAkvezError(value: unknown): value is AkvezError {
  return value instanceof AkvezError;
}

/**
 * Categoría de un valor capturado en un `catch`. Un error ajeno a la taxonomía
 * se clasifica como interno, que es la lectura conservadora: si AKVEZ no sabe
 * de dónde viene, la responsabilidad se asume propia.
 */
export function categoryOf(value: unknown): ErrorCategory {
  return isAkvezError(value) ? value.category : "agent_internal";
}

/** Mensaje legible de cualquier valor capturado, sin lanzar a su vez. */
export function messageOf(value: unknown): string {
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  try {
    return String(value);
  } catch {
    return "Error no representable.";
  }
}
