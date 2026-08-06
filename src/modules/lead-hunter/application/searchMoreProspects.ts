import { Prospect } from "../../../shared/types";
import { fetchProspects } from "../infrastructure/prospectSearchApi";
import { mapRawProspectToProspect } from "../domain/prospectMapper";

export interface SearchMoreProspectsParams {
  industry: string;
  location: string;
  designerStyle: string;
  excludeNames: string[];
  currentReferences: Array<{ title: string; url: string }>;
}

export interface SearchMoreProspectsResult {
  success: boolean;
  noMoreLeadsFound: boolean;
  prospects: Prospect[];
  mergedReferences: Array<{ title: string; url: string }>;
  /**
   * **Origen del análisis de esta tanda** — `metadata.usedFallbackEngine` del
   * contrato público.
   *
   * `true` significa que **al menos un lead de esta tanda NO fue analizado por
   * el modelo generativo**, sino por la inteligencia de respaldo heurística.
   *
   * ⚠️ **`searchProspects` ya lo devolvía y esta función no.** «Buscar más»
   * perdía la señal, de modo que una tanda con respaldo se incorporaba a los
   * resultados **sin quedar declarada**.
   */
  usedFallbackEngine: boolean;
  error: string | null;
}

export async function searchMoreProspects(params: SearchMoreProspectsParams): Promise<SearchMoreProspectsResult> {
  try {
    const data = await fetchProspects({
      industry: params.industry,
      location: params.location,
      designerStyle: params.designerStyle,
      excludeNames: params.excludeNames
    });

    if (data.success && data.leads) {
      if (data.leads.length === 0) {
        return {
          success: true,
          noMoreLeadsFound: true,
          prospects: [],
          mergedReferences: params.currentReferences,
          usedFallbackEngine: !!data.metadata?.usedFallbackEngine,
          error: null
        };
      }

      // El id lo asigna el Repository y viaja dentro de cada lead (H-03).
      const parsed: Prospect[] = data.leads.map((lead: any) =>
        mapRawProspectToProspect(lead)
      );

      // Reference deduplication (Application responsibility, per architectural decision).
      let mergedReferences = params.currentReferences;
      if (data.references && data.references.length > 0) {
        const prevUrls = new Set(params.currentReferences.map((r) => r.url));
        const merged = [...params.currentReferences];
        data.references.forEach((r: any) => {
          if (r?.url && !prevUrls.has(r.url)) {
            merged.push(r);
          }
        });
        mergedReferences = merged;
      }

      return {
        success: true,
        noMoreLeadsFound: false,
        prospects: parsed,
        mergedReferences,
        usedFallbackEngine: !!data.metadata?.usedFallbackEngine,
        error: null
      };
    }

    return {
      success: false,
      noMoreLeadsFound: false,
      prospects: [],
      mergedReferences: params.currentReferences,
      usedFallbackEngine: false,
      error: data.error?.message || "No se pudieron obtener resultados de búsqueda adicionales."
    };
  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      noMoreLeadsFound: false,
      prospects: [],
      mergedReferences: params.currentReferences,
      usedFallbackEngine: false,
      error: err.message || "Error al buscar prospectos adicionales."
    };
  }
}
