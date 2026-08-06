/**
 * Contrato público de POST /api/prospect/search (ADR-06, sección 10).
 * Independiente de domain/, application/, infrastructure/ y persistence/ — ver
 * ADR-06 sección 11 (Reglas de Aislamiento). No representa ninguna entidad
 * interna de dominio; es la forma que efectivamente cruza la frontera HTTP.
 */

import { ErrorResponseDTO } from "./apiError";
import { ScoreBreakdownEntryDTO } from "./opportunityScore";

export interface ReferenceDTO {
  title: string;
  url: string;
}

/**
 * `id` es un campo futuro, asignado por el servidor una vez se conecte
 * server/shared/persistence/ (Sprint 11). No existe todavía en ningún punto
 * real del sistema (ADR-06, Decisión Importante 6).
 *
 * `opportunity` es el nombre público confirmado para lo que en el dominio de
 * Lead Analyzer puede seguir llamándose `angle` (ADR-06, Decisión Importante 1).
 */
export interface LeadResponseDTO {
  id: string;
  name: string;
  website: string;
  googleMapsUrl: string;
  phone: string;
  rating: number;
  reviewCount: number;
  source: string;
  description: string;
  flaws: string[];
  opportunity: string;
  classification: string;
  revenueLoss: string;
  whyWebsiteNeeded: string;
  score: number;

  // ── Explicación del Opportunity Score ──────────────────────────────────────
  //
  // **Ampliación aditiva.** Estos campos ya se calculaban en `domain/`, ya se
  // adjuntaban al Lead en `application/` y ya se persistían — pero **no cruzaban
  // esta frontera**, de modo que la búsqueda entregaba una puntuación sin
  // explicación mientras la Biblioteca la entregaba completa.
  //
  // **Nombres, tipos y semántica son los de `LeadLibraryItemDTO`**, verbatim: es
  // el mismo Score publicado por dos endpoints, y **debe verse igual en ambos**.
  //
  // **Todos opcionales, y eso es decisión de dominio, no comodidad.** Un Lead sin
  // Evaluación es un estado válido (**R-45** · APS-08 §8.6) y **R-38** prohíbe
  // sustituir una ausencia por un valor por defecto: si no hay dato, **el campo no
  // viaja**. Ningún consumidor actual se rompe por su adición.
  //
  // ⚠️ **`score` (arriba) se conserva obligatorio** para no romper el contrato
  // vigente. Su nulabilidad es una cuestión distinta y no se decide aquí.

  /** Banda de APS-08 §8. **Etiqueta de prioridad, nunca criterio de admisión.** */
  band?: string | null;
  /**
   * Versión del Perfil de Ponderación que produjo el Score.
   *
   * Se publica porque **ADR-14 R-VIN** vincula de forma permanente toda
   * puntuación a su versión, y sin ella «es un número sin significado que no
   * podrá utilizarse para ordenar ni para explicar».
   */
  scoreVersion?: string;
  /** Confianza declarada del análisis (APS-08 §11). */
  confidence?: string;
  /** Proporción de factores de APS-08 §6 medidos. Sostiene la confianza. */
  coverage?: number;
  /** Marca temporal de la emisión (ADR-13 §10.3, V-3). */
  calculatedAt?: string;
  /**
   * Desglose completo de la puntuación, una entrada por cada categoría de
   * APS-08 §6. Presente siempre que exista Score (APS-08 §9).
   */
  breakdown?: ScoreBreakdownEntryDTO[];
}

/**
 * Contenedor extensible para señales futuras (ej. `usedFallbackEngine`).
 * Reemplaza el uso de `message` como mecanismo de control (ADR-06, Decisión
 * Importante 3) — no se incluye `message` en este contrato.
 */
export interface SearchResponseMetadata {
  usedFallbackEngine?: boolean;
}

export interface SearchResponseDTO {
  success: boolean;
  leads: LeadResponseDTO[];
  references: ReferenceDTO[];
  metadata?: SearchResponseMetadata;
}

export type ProspectSearchResult = SearchResponseDTO | ErrorResponseDTO;
