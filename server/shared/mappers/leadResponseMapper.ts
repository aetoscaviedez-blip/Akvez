import { LeadResponseDTO } from "../contracts/prospectSearch";
import { ScoreBreakdownEntryDTO } from "../contracts/opportunityScore";

/**
 * Forma real que hoy produce `server/modules/lead-analyzer/application/analyzeProspects.ts`,
 * confirmada por lectura directa del código (no es una suposición). No es un
 * import del módulo Lead Analyzer — está prohibido por esta tarea — es una
 * declaración independiente, propiedad de este mapper, que describe el
 * contrato de entrada que espera. Si `analyzeProspects.ts` cambia su forma
 * de salida en el futuro, este tipo deberá actualizarse aquí explícitamente;
 * no se infiere de ningún archivo de dominio.
 */
export interface InternalAnalyzedLead {
  /**
   * Identificador asignado por el Repository durante el descubrimiento y
   * propagado por `analyzeProspects` (Sprint 15, Tarea 2). Es el único
   * identificador del Lead en toda la cadena — ya no se genera ninguno aquí
   * ni en la ruta HTTP.
   */
  id: string;
  name: string;
  website: string;
  googleMapsUrl: string;
  phone: string;
  rating: number;
  reviewCount: number;
  hasWebsite: boolean;
  description: string;
  flaws: string[];
  revenueLoss: string;
  angle: string;
  whyWebsiteNeeded: string;
  score: number;
  classification: string;
  source: string;

  /**
   * Campos del Opportunity Score que `analyzeProspects` adjunta a cada lead
   * *(líneas 221-229 y 262-267)* y que **este tipo no declaraba**, de modo que
   * la explicación se perdía en esta frontera aunque estuviese calculada y
   * persistida.
   *
   * **Opcionales porque un Lead sin Evaluación es un estado válido (R-45).**
   * `scoreVersion` es el indicador de que hubo emisión: sin él no se publica
   * ninguno, exactamente como decide `leadLibraryMapper`.
   */
  scoreVersion?: string;
  band?: string | null;
  confidence?: string;
  scoreCoverage?: number;
  calculatedAt?: string;
  scoreBreakdown?: ScoreBreakdownEntryDTO[];
  /**
   * Marca interna del origen del análisis de este lead (H-02). La declara este
   * tipo porque `analyzeProspects.ts` la produce, y este archivo se
   * compromete a describir su forma real de salida. Se recibe pero
   * deliberadamente NO se mapea: no es un campo público de LeadResponseDTO —
   * la señal pública equivalente es `SearchResponseMetadata.usedFallbackEngine`,
   * que la ruta agrega a nivel de respuesta, no de lead.
   */
  usedFallbackAnalysis: boolean;
  /**
   * Recuento de fotografías observado en la ficha de la fuente (H-14.F.1 ·
   * `PE-1.0`). Llega hasta aquí porque `analyzeProspects` propaga el candidato
   * completo con `{ ...p }`.
   *
   * **Opcional y nulable, y la distinción importa:** `0` es «se observó que no
   * hay ninguna»; ausente o `null` es «no se observó». Nunca se colapsan.
   */
  photoCount?: number | null;
}

/**
 * Transforma un lead analizado internamente hacia el contrato público
 * LeadResponseDTO (ADR-06, sección 10).
 *
 * `id` se recibe como parámetro obligatorio y no se genera aquí. Desde
 * Sprint 15, Tarea 2, quien lo asigna es el Database Adapter durante
 * `LeadRepository.save()`, y se propaga sin modificarse hasta este punto.
 * Este mapper no decide esa estrategia — solo la requiere como entrada
 * explícita, evitando reintroducir el patrón de id generado en el cliente
 * que el Sprint 12 (Tarea 1) señaló como hallazgo.
 *
 * `hasWebsite` se recibe pero deliberadamente no se mapea: no está definido
 * como campo público en LeadResponseDTO (ADR-06 / API-DTO-CATALOG.md, sin
 * consumidor en el frontend hoy).
 *
 * `angle` se mapea a `opportunity`: es la correspondencia confirmada en
 * ADR-06, Decisión Importante 1.
 */
export function mapToLeadResponseDTO(lead: InternalAnalyzedLead, id: string): LeadResponseDTO {
  const dto: LeadResponseDTO = {
    id,
    name: lead.name,
    website: lead.website,
    googleMapsUrl: lead.googleMapsUrl,
    phone: lead.phone,
    rating: lead.rating,
    reviewCount: lead.reviewCount,
    source: lead.source,
    description: lead.description,
    flaws: lead.flaws,
    opportunity: lead.angle,
    classification: lead.classification,
    revenueLoss: lead.revenueLoss,
    whyWebsiteNeeded: lead.whyWebsiteNeeded,
    score: lead.score
  };

  // ── Explicación del Score — mismo criterio que `leadLibraryMapper` ─────────
  //
  // **`scoreVersion` decide si hubo emisión.** Sin él no se publica ningún campo
  // de Score: es la diferencia entre «no se evaluó» y «se evaluó y dio null».
  //
  // **`?? null` en `band`**, no `if (!== undefined)`: una emisión real puede dar
  // banda nula —cuando ninguna categoría pudo medirse— y **ausente y nula no son
  // lo mismo** (R-38 · R-45). Los demás campos **solo viajan si existen**.
  if (lead.scoreVersion !== undefined) {
    dto.scoreVersion = lead.scoreVersion;
    dto.band = lead.band ?? null;

    if (lead.confidence !== undefined) dto.confidence = lead.confidence;
    if (lead.scoreCoverage !== undefined) dto.coverage = lead.scoreCoverage;
    if (lead.calculatedAt !== undefined) dto.calculatedAt = lead.calculatedAt;
    if (lead.scoreBreakdown !== undefined) dto.breakdown = lead.scoreBreakdown;
  }

  // ── Evidencia observada — `PE-1.0` (H-14.F.1) ──────────────────────────────
  //
  // **`!== undefined`, deliberadamente, y no `?? null`.** `0` es un valor que
  // debe viajar —«se observó que no hay fotografías»— y `undefined` significa
  // que la evidencia no se recogió. Un `|| 0` aquí destruiría exactamente la
  // distinción que este sprint existe para preservar.
  if (lead.photoCount !== undefined) {
    dto.photoCount = lead.photoCount;
  }

  return dto;
}
