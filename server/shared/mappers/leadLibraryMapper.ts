import { LeadLibraryItemDTO, LeadLibraryResponseDTO, ScoreBreakdownEntryDTO } from "../contracts/leadLibrary";

/**
 * Forma real que hoy produce
 * `server/modules/lead-hunter/application/listLeadLibrary.ts`, confirmada por
 * lectura directa del código.
 *
 * **Este mapper declara su propio tipo de entrada y no lo importa del módulo
 * dueño** (R-16), y no importa `domain/`, `application/` ni `infrastructure/`
 * de ningún módulo (R-17). Si `listLeadLibrary.ts` cambia su forma de salida,
 * este tipo debe actualizarse aquí explícitamente: la correspondencia es un
 * compromiso verificado en revisión, no una dependencia de compilación.
 */
export interface InternalRegisteredLead {
  id: string;
  name: string;
  website: string;
  phone: string;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  source: string;
  status: string;
  evidenceVersion?: string | null;
  photoCount?: number | null;
  /** Presentes solo si el Lead fue evaluado. Ausencia = sin Evaluación (R-45). */
  score?: number | null;
  band?: string | null;
  scoreVersion?: string;
  confidence?: string;
  coverage?: number;
  calculatedAt?: string;
  breakdown?: Array<{
    category: string;
    label: string;
    weight: number;
    partialScore: number | null;
    contribution: number;
    measuredFactors: string[];
    unmeasuredFactors: string[];
    rationale: string;
  }>;
}

/** Resultado interno del Orchestrator, declarado igualmente por este mapper. */
export interface InternalLeadLibrary {
  leads: InternalRegisteredLead[];
  total: number;
  scored: number;
}

/**
 * Traduce el resultado interno hacia el contrato público de GET /api/leads.
 *
 * **Es una lista blanca campo a campo**, no un `spread`: cualquier campo interno
 * que se añada en el futuro al caso de uso queda fuera del contrato público
 * hasta que se decida publicarlo. Es lo que impide que un dato interno se filtre
 * por la frontera HTTP sin decisión explícita (ADR-06 §11 · UI-9).
 */
export function mapToLeadLibraryItemDTO(lead: InternalRegisteredLead): LeadLibraryItemDTO {
  const dto: LeadLibraryItemDTO = {
    id: lead.id,
    name: lead.name,
    website: lead.website,
    phone: lead.phone,
    googleMapsUrl: lead.googleMapsUrl,
    rating: lead.rating,
    reviewCount: lead.reviewCount,
    source: lead.source,
    status: lead.status,
    // Solo viaja si la evidencia se observo. evidenceVersion es el
    // indicador; sin el, el campo no se publica (mismo criterio que el Score).
    ...(lead.evidenceVersion ? { photoCount: lead.photoCount ?? null } : {})
  };

  // Los campos de Score **solo se añaden si el Lead fue evaluado**. Se comprueba
  // la presencia de `scoreVersion` y no la de `score`, porque `score` puede ser
  // legítimamente `null` en una emisión real —cuando ninguna categoría pudo
  // medirse— y esa emisión sí existe y debe publicarse con su versión.
  //
  // Omitir la clave en lugar de emitir `score: 0` es lo que cumple R-38: una
  // ausencia se representa como ausencia, nunca con un valor por defecto.
  if (lead.scoreVersion !== undefined) {
    dto.score = lead.score ?? null;
    dto.band = lead.band ?? null;
    dto.scoreVersion = lead.scoreVersion;
    if (lead.confidence !== undefined) dto.confidence = lead.confidence;
    if (lead.coverage !== undefined) dto.coverage = lead.coverage;
    if (lead.calculatedAt !== undefined) dto.calculatedAt = lead.calculatedAt;

    // Desglose — APS-08 §9. Lista blanca campo a campo, igual que el resto del
    // mapper: `label` interno no se publica porque `category` ya lleva la forma
    // publicable de la categoría, y duplicarlo daría dos fuentes de verdad.
    if (lead.breakdown !== undefined) {
      dto.breakdown = lead.breakdown.map((entry): ScoreBreakdownEntryDTO => ({
        category: entry.label || entry.category,
        weight: entry.weight,
        partialScore: entry.partialScore,
        contribution: entry.contribution,
        measuredFactors: [...entry.measuredFactors],
        unmeasuredFactors: [...entry.unmeasuredFactors],
        rationale: entry.rationale
      }));
    }
  }

  return dto;
}

/**
 * Traduce la Biblioteca completa.
 *
 * `total` se toma del resultado interno y **no se recalcula** a partir del
 * arreglo mapeado: si alguna vez dejaran de coincidir, el síntoma debe ser
 * visible en la respuesta en lugar de quedar enmascarado por un `length` que
 * siempre cuadra (R-42 · R-44).
 */
export function mapToLeadLibraryResponseDTO(library: InternalLeadLibrary): LeadLibraryResponseDTO {
  return {
    success: true,
    leads: library.leads.map(mapToLeadLibraryItemDTO),
    total: library.total,
    scored: library.scored
  };
}
