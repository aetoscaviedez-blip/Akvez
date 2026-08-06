// Versión del criterio comercial — Value Object.
//
// Autoridad: **ADR-15 §7.4 (RA-7)**. Owner: **Product Office** (DDD-01 §4.2).

/**
 * La versión del **Perfil de Estrategia** que produjo una emisión.
 *
 * **RC-13 — toda entidad emitida conserva la versión del criterio que la
 * produjo.** *«Sin ella, una decisión conservada no puede reproducirse»*
 * (DDD-01 §4.2). Es una referencia inmutable.
 *
 * ⏸️ **El Perfil de Estrategia existe y su gobernanza está `Pospuesta`:**
 * ADR-15 §7.4 declara que **exige un ADR propio**, todavía no emitido, y el
 * roadmap lo sitúa en el Sprint 04. Por eso aquí se declara **la referencia**
 * —que RC-13 exige a toda entidad emitida— y **no el perfil**, que no puede
 * modelarse sin esa decisión.
 *
 * Sinónimos prohibidos por DDD-01 §8 para el Perfil: `Configuración`,
 * `Parámetros` — un parámetro se ajusta; esto **se versiona y se vincula a cada
 * emisión**.
 */
export type CommercialCriteriaVersion = string;
