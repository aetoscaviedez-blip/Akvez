/**
 * **PV-01 — Parámetros del Modelo de Valor de Proyecto.**
 *
 * ── FUENTE ÚNICA DE VERDAD ───────────────────────────────────────────────────
 *
 * Estas cifras **no pueden aparecer en ningún otro fichero**. Ni en el dominio,
 * ni en un componente, ni en un test. Quien necesite el rango importa `PV_01`.
 *
 * Su registro normativo vive en **APS-17 §8bis**, con la prueba de admisibilidad
 * del §3 ya superada: duplicar o suprimir estos valores **no altera el conjunto
 * de Leads** del usuario, porque el rango no filtra, no ordena y no descarta.
 * Por eso es configuración y no regla de dominio.
 *
 * ── POR QUÉ VIVE EN `config/` Y NO EN `domain/` ──────────────────────────────
 *
 * APS-17 **G-3** lo prohíbe sin excepción: «ningún parámetro nuevo podrá
 * introducirse en la capa de dominio». La capa declarada de PV-01 es
 * **Experiencia de Usuario**.
 *
 * ── ORIGEN DE LAS CIFRAS ─────────────────────────────────────────────────────
 *
 * Investigación de mercado de H-14.B.1: franja publicada de «sitio corporativo
 * 5-10 páginas» en Colombia 2026, coincidente con la de pymes primer año y
 * corroborada por el ejemplo de APS-04 §10.3 (≈ USD 625–1.500).
 *
 * **Confianza declarada: media.** Son precios publicados, no transacciones
 * verificadas, y en su mayoría por quien vende el servicio. No subirá hasta que
 * existan proyectos cerrados que los confirmen.
 *
 * ── UN SOLO TIER, DELIBERADAMENTE ────────────────────────────────────────────
 *
 * `WEB_PRESENCE` y `OWNED_DOMAIN` comparten rango porque significan el mismo
 * trabajo —construir un sitio— y **ninguna fuente cotiza por separado** la
 * migración desde una red social. Dos rangos distintos exigirían inventar la
 * distancia entre ellos: sería falsa precisión con apariencia de análisis.
 */

import { OpportunityId } from "../modules/lead-hunter/domain/opportunityDerivation";

export type ProjectValueModelVersion = "PV-1.0";
export type ProjectValueCurrency = "COP";
export type ProjectValueConfidence = "medium";

export interface ProjectValueTier {
  /** Identificador del tier. Aparece en `basis` para poder auditar la salida. */
  id: string;
  /** Tipos de oportunidad que activan este tier. */
  opportunityTypes: readonly OpportunityId[];
  min: number;
  max: number;
}

export interface ProjectValueModelParams {
  version: ProjectValueModelVersion;
  currency: ProjectValueCurrency;
  confidence: ProjectValueConfidence;
  tiers: readonly ProjectValueTier[];
}

/**
 * ⚠️ **Las únicas cifras monetarias del producto.**
 *
 * Cambiarlas es un cambio **Menor** conforme a APS-17 G-1 y APS-13 §9, y obliga
 * a subir la versión del modelo para no reinterpretar estimaciones ya
 * calculadas.
 */
export const PV_01: ProjectValueModelParams = {
  version: "PV-1.0",
  currency: "COP",
  confidence: "medium",
  tiers: [
    {
      id: "WEBSITE",
      opportunityTypes: ["WEB_PRESENCE", "OWNED_DOMAIN"],
      min: 2_500_000,
      max: 6_000_000
    }
  ]
};
