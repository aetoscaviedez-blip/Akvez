/**
 * Contrato público del **Opportunity Score** — la explicación que acompaña a
 * toda puntuación (ADR-06 §10, §11).
 *
 * ── POR QUÉ ESTE FICHERO EXISTE ──────────────────────────────────────────────
 *
 * **El Score no pertenece a un endpoint: lo publican dos.** `GET /api/leads` lo
 * expone desde su origen, y `POST /api/prospect/search` lo expone también desde
 * que la explicación dejó de perderse en su mapper.
 *
 * Declararlo aquí evita las dos salidas peores:
 *
 *   · **Duplicar el tipo** en ambos contratos, con dos definiciones que
 *     divergirían en la primera modificación.
 *   · **Que `prospectSearch.ts` importe de `leadLibrary.ts`**, atando el
 *     contrato de un endpoint al de otro que es su par, no su dependencia.
 *
 * **R-15 lo autoriza expresamente**: *«`shared/contracts/` importa solo tipos
 * primitivos y otros archivos de `shared/contracts/`»*.
 *
 * **No se introduce ningún nombre nuevo.** `ScoreBreakdownEntryDTO` conserva su
 * identificador, su forma y su documentación; solo cambia de fichero, y
 * `leadLibrary.ts` lo reexporta para que ningún consumidor existente se entere.
 *
 * Independiente de `domain/`, `application/`, `infrastructure/` y
 * `shared/persistence/` — **R-18** prohíbe importar `shared/persistence/contracts/`.
 */

/**
 * Aportación de una categoría de evaluación al Opportunity Score.
 *
 * **APS-08 §9 exige que todo Score vaya acompañado de una explicación**, y que el
 * usuario comprenda «por qué obtuvo esa puntuación, qué aspectos aumentaron el
 * resultado, qué factores redujeron la evaluación y cuáles representan
 * oportunidades comerciales». Este DTO es el vehículo de esa explicación.
 *
 * **Todo es trazable a WP-01.** `weight` es el peso publicado en APS-08 §7.1 y
 * `category` es una de las seis categorías de §6 — no se introduce ningún factor
 * nuevo. `contribution` es la aportación ya normalizada al Score final, de modo
 * que la suma de las seis contribuciones reconstruye la puntuación (ADR-14 §6.3,
 * Reproducibilidad).
 */
export interface ScoreBreakdownEntryDTO {
  /** Categoría de evaluación de APS-08 §6, en su forma publicable. */
  category: string;
  /** Peso aplicado, en puntos porcentuales, según WP-01 (APS-08 §7.1). */
  weight: number;
  /** Puntuación parcial 0-100. `null` si ningún factor pudo medirse (R-38). */
  partialScore: number | null;
  /** Aportación de esta categoría al Score final, ya normalizada. */
  contribution: number;
  /** Factores de APS-08 §6 que sí se midieron. */
  measuredFactors: string[];
  /**
   * Factores de APS-08 §6 **no medibles** con la información pública disponible.
   *
   * Se publican deliberadamente: APS-08 §11 obliga a indicar que «la confianza del
   * análisis puede ser limitada», y decir *qué* no se pudo medir es la forma
   * honesta de hacerlo. Ocultarlos daría al Score una precisión que no tiene.
   */
  unmeasuredFactors: string[];
  /** Explicación legible de por qué la categoría puntuó así (APS-08 §9). */
  rationale: string;
}
