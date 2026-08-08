/**
 * **`PlaceEvidence` — la evidencia observada, separada de lo inferido (H-14.F.1).**
 *
 * ── QUÉ PROBLEMA RESUELVE ────────────────────────────────────────────────────
 *
 * `Prospect` mezcla hoy lo que AKVEZ **observó** (`website`, `rating`) con lo
 * que un modelo **generó** (`flaws`, `angle`, `description`), sin que nada en el
 * tipo los distinga. Y peor: el adapter colapsa la ausencia con `|| 0` y `|| ""`,
 * de modo que un negocio sin calificar y uno calificado con 0 llegan idénticos
 * (H-14.F §3.1).
 *
 * `PlaceEvidence` es el canal donde esa distinción **sí** se conserva.
 *
 * ── NO SIGNIFICA «EVIDENCIA DE GOOGLE» ───────────────────────────────────────
 *
 * Significa **evidencia observada**. El nombre no menciona al proveedor a
 * propósito: una fuente futura entraría por su propio mapper hacia esta misma
 * estructura, sin que el dominio se entere de que existe.
 *
 * ── LA REGLA DE LOS TRES ESTADOS ─────────────────────────────────────────────
 *
 *   `null`  → no observado / no disponible
 *   `0`     → **observado y realmente cero**
 *   `N`     → observado
 *
 * Nunca se reconstruyen con `|| 0`. Colapsar esos estados es el defecto que
 * este módulo existe para impedir.
 */

/**
 * Versiona **qué señales se recogieron**, no su formato.
 *
 * Es lo único que distingue «observamos cero fotografías» de «recogimos esta
 * evidencia antes de mirar fotografías». Sin ella, un Lead antiguo sería
 * indistinguible de uno sin fotos.
 */
export type PlaceEvidenceVersion = "PE-1.0";

export interface PlaceEvidence {
  version: PlaceEvidenceVersion;
  /** `null` = la fuente no registra sitio web. */
  websiteUrl: string | null;
  /** `null` = la fuente no registra teléfono. */
  phone: string | null;
  /** `null` = sin calificación publicada. `0` = calificación real de cero. */
  rating: number | null;
  /** `null` = no disponible. `0` = cero reseñas observadas. */
  reviewCount: number | null;
  /** `null` = no observado. `0` = **se observó que no hay ninguna**. */
  photoCount: number | null;
}

/**
 * **Qué debe presentarse sobre la evidencia visual (H-14.G.1).**
 *
 * ── POR QUÉ ES UNA FUNCIÓN Y NO UN `if` EN EL COMPONENTE ─────────────────────
 *
 * La decisión de qué se puede decir sobre `photoCount` es una **regla de
 * integridad**, no una cuestión de maquetación: colapsar `null` con `0` haría
 * que AKVEZ afirmara «no tiene fotografías» sobre un negocio que nunca miró.
 * Vive aquí para poder probarse exhaustivamente sin montar React —el proyecto
 * corre sus tests en `environment: "node"`— y para que ninguna pantalla futura
 * reinvente el criterio.
 *
 * ── NO ES UNA OPORTUNIDAD ────────────────────────────────────────────────────
 *
 * Devuelve **un dato observado**, nunca una necesidad. `VISUAL_ASSETS` como
 * oportunidad queda bloqueado hasta que la evidencia persista (H-14.G §6.1): una
 * oportunidad que aparece al buscar y desaparece al recargar la Biblioteca sería
 * peor que ninguna.
 */
export type VisualEvidenceDisplay =
  /** No se observó el dato. **No se presenta nada** — ni «0», ni «no disponible». */
  | { kind: "absent" }
  /** Se observó que la ficha no registra fotografías. */
  | { kind: "none" }
  /** Se observaron `count` fotografías. */
  | { kind: "some"; count: number };

/**
 * Traduce la evidencia a lo único que puede afirmarse de ella.
 *
 * ⚠️ **`typeof === "number"`, jamás `photoCount || 0`.** Es exactamente la
 * distinción que `PE-1.0` existe para preservar: `0` es un hecho observado y
 * `null` es la ausencia de observación.
 */
export function describeVisualEvidence(evidence?: PlaceEvidence): VisualEvidenceDisplay {
  const count = evidence?.photoCount;
  if (typeof count !== "number") return { kind: "absent" };
  return count === 0 ? { kind: "none" } : { kind: "some", count };
}

/** Cadena presente y no vacía, o `null`. Nunca `""`. */
function textOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Número finito, o `null`.
 *
 * ⚠️ **`0` sobrevive.** Es la razón de ser de esta función: `Number.isFinite(0)`
 * es `true`, mientras que cualquier comprobación de veracidad lo descartaría.
 */
function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Reconstruye la evidencia desde la respuesta HTTP.
 *
 * **Es el reverso exacto del mapper del servidor**, y el único punto del cliente
 * autorizado a interpretar la forma cruda. No deriva, no clasifica y no juzga:
 * qué constituye una oportunidad es materia de `opportunityDerivation`.
 */
export function toPlaceEvidence(raw: {
  website?: unknown;
  phone?: unknown;
  rating?: unknown;
  reviewCount?: unknown;
  photoCount?: unknown;
}): PlaceEvidence {
  return {
    version: "PE-1.0",
    websiteUrl: textOrNull(raw.website),
    phone: textOrNull(raw.phone),
    rating: numberOrNull(raw.rating),
    reviewCount: numberOrNull(raw.reviewCount),
    photoCount: numberOrNull(raw.photoCount)
  };
}
