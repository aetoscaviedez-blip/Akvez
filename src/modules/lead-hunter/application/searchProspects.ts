import { Prospect } from "../../../shared/types";
import { fetchProspects } from "../infrastructure/prospectSearchApi";
import { mapRawProspectToProspect } from "../domain/prospectMapper";

export interface SearchProspectsParams {
  industry: string;
  location: string;
  designerStyle: string;
}

export interface SearchProspectsResult {
  success: boolean;
  prospects: Prospect[];
  references: Array<{ title: string; url: string }>;
  usedFallbackEngine: boolean;
  error: string | null;
}

export async function searchProspects(params: SearchProspectsParams): Promise<SearchProspectsResult> {
  try {
    const data = await fetchProspects({
      industry: params.industry,
      location: params.location,
      designerStyle: params.designerStyle
    });

    if (data.success && data.leads) {
      // El id lo asigna el Repository y viaja dentro de cada lead (H-03).
      const parsed: Prospect[] = data.leads.map((lead: any) =>
        mapRawProspectToProspect(lead)
      );

      return {
        success: true,
        prospects: parsed,
        references: data.references || [],
        usedFallbackEngine: !!data.metadata?.usedFallbackEngine,
        error: null
      };
    }

    return {
      success: false,
      prospects: [],
      references: [],
      usedFallbackEngine: false,
      error: data.error?.message || "No se pudieron obtener resultados. Asegúrate de configurar la variable de entorno GEMINI_API_KEY."
    };
  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      prospects: [],
      references: [],
      usedFallbackEngine: false,
      error: err.message || "Error al buscar prospectos."
    };
  }
}
