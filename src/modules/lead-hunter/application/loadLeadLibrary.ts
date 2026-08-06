import { fetchLeadLibrary, LeadLibraryItemPayload, ScoreBreakdownEntryPayload } from "../infrastructure/leadLibraryApi";

/** Aportación de una categoría al Score, para la explicación de APS-08 §9. */
export type ScoreBreakdownEntryView = ScoreBreakdownEntryPayload;

/**
 * Un Lead registrado, tal como lo consume la interfaz.
 *
 * Los campos de Score son **opcionales**: un Lead sin Evaluación es un estado
 * válido del dominio (R-45) y R-38 prohíbe rellenar esa ausencia con un valor por
 * defecto. `undefined` significa «sin evaluar» y la vista debe representarlo como
 * tal (UI-7), nunca como cero ni como error.
 */
export interface RegisteredLeadView {
  id: string;
  name: string;
  website: string;
  phone: string;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  source: string;
  status: string;
  score?: number | null;
  band?: string | null;
  scoreVersion?: string;
  confidence?: string;
  coverage?: number;
  breakdown?: ScoreBreakdownEntryView[];
}

export interface LoadLeadLibraryResult {
  success: boolean;
  leads: RegisteredLeadView[];
  total: number;
  /** Cuántos Leads tienen Score. El resto se muestran igualmente (UI-2). */
  scored: number;
  error: string | null;
}

/**
 * Carga la Biblioteca de Leads del usuario.
 *
 * **No ordena, no filtra y no recorta.** Devuelve el conjunto tal como lo
 * publica la API: UI-2 prohíbe ocultar un Lead por su Score, UI-3 prohíbe
 * aplicar filtros por defecto y UI-4 prohíbe truncar el conjunto.
 *
 * Un fallo se devuelve **como valor** y no como excepción: es un fallo esperado
 * y significativo para el caso de uso (R-61). Ante error se devuelve
 * `success: false` con el mensaje, nunca una lista vacía que la vista
 * confundiría con «la Biblioteca está vacía».
 */
export async function loadLeadLibrary(): Promise<LoadLeadLibraryResult> {
  try {
    const data = await fetchLeadLibrary();

    if (data.success && Array.isArray(data.leads)) {
      const leads: RegisteredLeadView[] = data.leads.map((lead: LeadLibraryItemPayload) => ({
        id: lead.id,
        name: lead.name,
        website: lead.website,
        phone: lead.phone,
        googleMapsUrl: lead.googleMapsUrl,
        rating: lead.rating,
        reviewCount: lead.reviewCount,
        source: lead.source,
        status: lead.status,
        // Se propagan tal cual: si la clave no venía, sigue sin venir. No se
        // sustituye por 0 ni por "sin dato" (R-38).
        score: lead.score,
        band: lead.band,
        scoreVersion: lead.scoreVersion,
        confidence: lead.confidence,
        coverage: lead.coverage,
        breakdown: lead.breakdown
      }));

      return {
        success: true,
        // El servidor ya devuelve la Biblioteca ordenada por Score descendente
        // (WS-05). **No se reordena aquí**: el orden por defecto es una decisión
        // de producto, no de la vista.
        leads,
        // Se conserva el `total` que publica el servidor en lugar de recalcularlo:
        // si alguna vez no coincidiese con la lista recibida, el síntoma debe ser
        // visible en la vista y no quedar enmascarado (R-42 · R-44).
        total: typeof data.total === "number" ? data.total : leads.length,
        scored: typeof data.scored === "number" ? data.scored : 0,
        error: null
      };
    }

    return {
      success: false,
      leads: [],
      total: 0,
      scored: 0,
      error: data.error?.message || "No se pudo cargar la Biblioteca de Leads."
    };
  } catch (err: any) {
    return {
      success: false,
      leads: [],
      total: 0,
      scored: 0,
      error: err?.message || "No se pudo contactar con el servidor."
    };
  }
}
