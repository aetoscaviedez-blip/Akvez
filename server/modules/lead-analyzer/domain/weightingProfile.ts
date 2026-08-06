// Perfil de Ponderación — el artefacto de dominio que asigna a cada categoría de
// evaluación de APS-08 §6 su peso dentro del Opportunity Score (ADR-14 §7.1).
//
// ESTE FICHERO NO DECIDE NADA. Transcribe los valores publicados en
// **APS-08 §7.1** y cumple el contenido mínimo que exige **ADR-14 §7.2**. Si los
// pesos de APS-08 cambian, este fichero NO se edita: se publica una versión
// nueva, porque **R-INM** declara inmutable toda versión publicada.
//
// UBICACIÓN — Vive en `domain/` porque es cálculo puro sin I/O (ADR-04 §10) y
// porque es contenido de dominio, no configuración. Los pesos **no son
// parámetros operativos** en el sentido de R-50/R-52: no limitan el conjunto de
// Leads. APS-08 §7.1 (RV-D) lo verifica expresamente aplicando el Criterio de
// Invariancia — «modificar estos pesos altera el orden, nunca qué Leads existen
// o son alcanzables»—, y por eso no residen en APS-17 ni infringen ADR-11 §8.1.

/** Las seis categorías de evaluación de APS-08 §6. No se añaden ni se quitan. */
export type EvaluationCategory =
  | "presenciaWeb"          // §6.1
  | "identidadDigital"      // §6.2
  | "informacionComercial"  // §6.3
  | "reputacion"            // §6.4
  | "potencialDeMejora"     // §6.5
  | "compatibilidad";       // §6.6

/** Etiqueta publicable de cada categoría, para la explicación de APS-08 §9. */
export const CATEGORY_LABELS: Readonly<Record<EvaluationCategory, string>> = Object.freeze({
  presenciaWeb: "Presencia Web",
  identidadDigital: "Identidad Digital",
  informacionComercial: "Información Comercial",
  reputacion: "Reputación",
  potencialDeMejora: "Potencial de Mejora",
  compatibilidad: "Compatibilidad"
});

/**
 * Una versión del Perfil de Ponderación, con el contenido mínimo de
 * **ADR-14 §7.2** (C-1 a C-10).
 *
 * `succeeds`, `changeReason`, `supportingEvidence` y `transitionStrategy` son
 * opcionales **solo** porque §7.2 exime de C-6, C-7, C-9 y C-10 a la versión
 * inicial, «por no suceder a ninguna otra». Toda versión posterior debe
 * aportarlos.
 */
export interface WeightingProfile {
  /** C-1 — identificador único. **Nunca se reutiliza** (ADR-14 §9.1). */
  readonly version: string;
  readonly code: string;
  readonly name: string;
  /** C-2 — peso de cada una de las seis categorías. Suma exactamente 100. */
  readonly weights: Readonly<Record<EvaluationCategory, number>>;
  /** C-3 */ readonly publishedAt: string;
  /** C-4 */ readonly effectiveFrom: string;
  /** C-5 */ readonly approvedBy: string;
  /** C-8 — impacto esperado sobre el orden de los Leads existentes. */
  readonly expectedImpact: string;
  /** C-9 — versión a la que sucede. Ausente en la inicial. */
  readonly succeeds?: string;
  /** C-6 */ readonly changeReason?: string;
  /** C-7 */ readonly supportingEvidence?: string;
  /** C-10 */ readonly transitionStrategy?: string;
}

/**
 * **WP-01 v1.0** — Perfil de Ponderación Inicial, Diseño Web.
 *
 * Estado `Vigente`, único perfil publicado (APS-08 §7.1). ADR-14 §9.2 garantiza
 * que existe **una y sola una** versión vigente en cada momento, y que ninguna
 * puntuación se emite bajo una versión que no lo sea.
 *
 * `Object.freeze` materializa **R-INM** en el código: el objeto no puede
 * mutarse en caliente. No sustituye a la regla —que es documental— pero impide
 * que una versión publicada se altere por accidente en tiempo de ejecución.
 */
export const WP_01: WeightingProfile = Object.freeze({
  version: "WP-01 v1.0",
  code: "WP-01",
  name: "Perfil de Ponderación Inicial — Diseño Web",

  // Pesos textuales de la tabla de APS-08 §7.1. Suma verificada = 100.
  weights: Object.freeze({
    presenciaWeb: 25,
    potencialDeMejora: 25,
    compatibilidad: 20,
    reputacion: 12,
    identidadDigital: 10,
    informacionComercial: 8
  }),

  publishedAt: "2026-07-29",
  effectiveFrom: "2026-07-29",
  approvedBy: "Fundadora, conforme a ADR-14 §8.1",

  // C-8. En la versión inicial no existen puntuaciones previas que reordenar.
  expectedImpact:
    "Versión inicial: no existen Scores previos, de modo que no hay reordenación " +
    "de Leads existentes. Presencia Web y Potencial de Mejora concentran el 50 % " +
    "y sitúan en cabeza a las Empresas con presencia digital deficiente o inexistente."

  // C-6, C-7, C-9 y C-10 se omiten por la excepción expresa de ADR-14 §7.2:
  // la versión inicial no sucede a ninguna otra.
});

/**
 * Suma de los pesos del perfil. Debe ser exactamente 100 (APS-08 §7.1).
 *
 * Se expone como función verificable en lugar de darse por supuesta: un perfil
 * cuyos pesos no sumen 100 produciría Scores fuera de la escala 0-100 que fija
 * APS-08 §7, y el fallo sería silencioso.
 */
export function totalWeight(profile: WeightingProfile): number {
  return Object.values(profile.weights).reduce((sum, weight) => sum + weight, 0);
}

/** El perfil vigente. Único punto del código que decide cuál se aplica. */
export function currentWeightingProfile(): WeightingProfile {
  return WP_01;
}
