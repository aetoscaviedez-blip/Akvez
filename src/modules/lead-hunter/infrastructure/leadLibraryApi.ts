// Frontera HTTP con la API pública de AKVEZ para la Biblioteca de Leads.
//
// El frontend consume la API pública y **nunca** el motor de persistencia
// (R-29 · ADS-02 §5.3). Esta capa solo transporta: no interpreta, no ordena y
// no filtra.

/** Forma publicada por GET /api/leads (contrato `LeadLibraryItemDTO`). */
export interface LeadLibraryItemPayload {
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
   * Campos de Opportunity Score. **Opcionales**: un Lead sin Evaluación es un
   * estado válido (R-45) y el servidor omite las claves en lugar de enviar cero
   * (R-38). `undefined` significa «sin evaluar», no «puntuación nula».
   */
  score?: number | null;
  band?: string | null;
  scoreVersion?: string;
  confidence?: string;
  coverage?: number;
  calculatedAt?: string;
  breakdown?: ScoreBreakdownEntryPayload[];
}

/** Aportación de una categoría de APS-08 §6 al Score (explicación de §9). */
export interface ScoreBreakdownEntryPayload {
  category: string;
  weight: number;
  partialScore: number | null;
  contribution: number;
  measuredFactors: string[];
  unmeasuredFactors: string[];
  rationale: string;
}

export interface LeadLibraryPayload {
  success: boolean;
  leads?: LeadLibraryItemPayload[];
  total?: number;
  scored?: number;
  error?: { code: string; message: string };
}

/**
 * Recupera la Biblioteca completa.
 *
 * No envía parámetros de consulta: la Biblioteca no admite filtro, límite ni
 * paginación en el servidor (APS-04 §A.3.5, P-08).
 */
export async function fetchLeadLibrary(): Promise<LeadLibraryPayload> {
  const response = await fetch("/api/leads");
  return response.json();
}
