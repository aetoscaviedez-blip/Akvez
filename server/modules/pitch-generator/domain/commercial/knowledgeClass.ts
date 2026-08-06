// Clase de conocimiento e Indicio — Value Objects.
//
// Autoridad: **APS-19 §4.2** y **APS-19 §4.1**. Owner de la clase: Pitch
// Generator. **Owner del Indicio: Lead Analyzer** — procede del análisis y el
// sistema comercial nunca lo amplía (DDD-01 §4.2 · RE-1 · RA-4).

/**
 * Las tres clases de APS-19 §4.2. **Conjunto cerrado de tres valores, no una
 * magnitud.** Sinónimos prohibidos por DDD-01 §8: `Nivel de certeza`, `Score de
 * confianza`.
 *
 * | Clase | Qué autoriza |
 * | --- | --- |
 * | `Observable` | **Puede afirmarse** en un contacto |
 * | `Inferida` | **Orienta la estrategia. Nunca se afirma como hecho** (RE-2) |
 * | `Desconocida` | Puede reconocerse abiertamente. **Nunca se rellena** (RE-3) |
 *
 * **APS-19 §4.3 — la única vía hacia `Observable` es la manifestación del
 * comprador.** Antes de cualquier contacto **ninguna variable puede ser
 * `Observable`**: no existe manifestación alguna.
 */
export type KnowledgeClass = "Observable" | "Inferida" | "Desconocida";

/**
 * **Indicio** — un hecho público observable del que se deriva una lectura.
 *
 * *«El indicio es un hecho; la lectura no»* (APS-19 §4.1). Es un dato, no un
 * objeto con ciclo de vida, y por eso es un Value Object (DDD-01 §4.2).
 *
 * Sinónimos **prohibidos** por DDD-01 §8 y OBS-04: `Buyer Signals`, `Señal`,
 * `Insight` — ninguno aparece en documento aprobado, y `Insight` además sugiere
 * conclusión y no hecho. Se conserva el término oficial en castellano porque
 * toda traducción disponible colisiona con un sinónimo prohibido.
 *
 * El Blueprint no fija estructura interna para el indicio: es el enunciado del
 * hecho constatado. Declararle campos aquí sería introducir un concepto que
 * ninguna autoridad decide.
 */
export type Indicio = string;
