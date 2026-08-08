/**
 * Contrato público de GET /api/leads — la Biblioteca de Leads del usuario
 * (ADR-06 §10, §11).
 *
 * Independiente de `domain/`, `application/`, `infrastructure/` y
 * `shared/persistence/`. Importa únicamente tipos primitivos y otro archivo de
 * `shared/contracts/` (R-15), y **no importa `shared/persistence/contracts/`**:
 * resuelven fronteras distintas y R-18 prohíbe expresamente que se importen
 * entre sí.
 *
 * `LeadLibraryItemDTO` **no es** la entidad `Lead` (R-14): es la forma que
 * efectivamente cruza la frontera HTTP.
 */

import { ErrorResponseDTO } from "./apiError";
import { ScoreBreakdownEntryDTO } from "./opportunityScore";

/**
 * **`ScoreBreakdownEntryDTO` se declara ahora en `./opportunityScore`**, porque
 * lo publican **dos** endpoints: esta Biblioteca y la búsqueda de prospectos.
 *
 * **Se reexporta sin cambio alguno** —mismo nombre, misma forma— para que todo
 * consumidor que lo importara desde aquí siga funcionando. **No es un contrato
 * nuevo: es el mismo, en el fichero que le corresponde.**
 */
export type { ScoreBreakdownEntryDTO };

/**
 * Un Lead registrado, tal como se publica en la Biblioteca.
 *
 * **Los campos de Score son opcionales, y eso es una decisión de dominio, no una
 * comodidad.** Un Lead sin Evaluación es un estado válido y esperado (R-45 ·
 * APS-08 §8.6 punto 3), y R-38 prohíbe sustituir una ausencia por un valor por
 * defecto: si un Lead no tiene Score, el campo **no viaja**, en lugar de viajar
 * como `0`. La interfaz debe representar esa ausencia como ausencia (UI-7),
 * nunca como cero ni como error.
 *
 * `status` viaja como cadena y no como unión cerrada de forma deliberada: el
 * conjunto de valores de `LeadStatus` es objeto de la desviación **A-01**,
 * abierta y pendiente del Product Office. Cerrar aquí la unión fijaría en un
 * contrato público un vocabulario que está en revisión.
 */
export interface LeadLibraryItemDTO {
  id: string;
  name: string;
  website: string;
  phone: string;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  source: string;
  status: string;

  /**
   * **Evidencia observada — PE-1.0 (H-14.H).** Aditivo y opcional.
   * Ausente = Lead anterior a PE-1.0: no se observo, que no es lo mismo
   * que haber observado cero.
   */
  photoCount?: number | null;

  /** Opportunity Score 0-100 (APS-08 §7). Ausente si el Lead no fue evaluado. */
  score?: number | null;
  /** Banda de APS-08 §8. **Etiqueta de prioridad, nunca criterio de admisión.** */
  band?: string | null;
  /**
   * Versión del Perfil de Ponderación que produjo el Score.
   *
   * Se publica porque **ADR-14 R-VIN** vincula de forma permanente toda
   * puntuación a su versión, y sin ella «es un número sin significado que no
   * podrá utilizarse para ordenar ni para explicar». El usuario debe poder saber
   * bajo qué criterio se puntuó su Lead.
   */
  scoreVersion?: string;
  /** Confianza declarada del análisis (APS-08 §11). */
  confidence?: string;
  /** Proporción de factores de APS-08 §6 medidos. Sostiene la confianza. */
  coverage?: number;
  /** Marca temporal de la emisión vigente (ADR-13 §10.3, V-3). */
  calculatedAt?: string;
  /**
   * Desglose completo de la puntuación, una entrada por cada categoría de
   * APS-08 §6. Presente siempre que exista Score (APS-08 §9).
   */
  breakdown?: ScoreBreakdownEntryDTO[];
}

/**
 * `total` es el tamaño real de la Biblioteca y **siempre coincide con
 * `leads.length`**: esta respuesta no pagina ni recorta. Se publica de forma
 * explícita para que ningún consumidor tenga que deducirlo, y para que un
 * recorte futuro sea inmediatamente visible como una discrepancia entre ambos
 * valores en lugar de pasar desapercibido (R-42 · R-44 · UI-4).
 */
export interface LeadLibraryResponseDTO {
  success: boolean;
  leads: LeadLibraryItemDTO[];
  total: number;
  /**
   * Cuántos Leads tienen Score vigente.
   *
   * Se publica para que la diferencia con `total` sea **visible y explicable**:
   * los Leads no evaluados existen, cuentan y se muestran. Es lo contrario de
   * un filtro — hace explícito que no hay ninguno.
   */
  scored: number;
}

export type LeadLibraryResult = LeadLibraryResponseDTO | ErrorResponseDTO;
