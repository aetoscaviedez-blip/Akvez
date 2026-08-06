import { Type } from "@google/genai";
import { generateContentWithRetry } from "../../../shared/ai/generateWithRetry";
import { generateFallbackSocialLeads, generateFallbackDirectoryLeads } from "../domain/fallbackLeads";

// [CÓDIGO MUERTO — no invocado en el flujo actual, preservado tal cual por decisión del Sprint 8]
// Fuentes alternativas de descubrimiento vía Gemini + Google Search grounding. Nunca se invocan hoy
// desde application/discoverProspects.ts — ver informe del Sprint 7 para la evidencia. No reactivar
// ni corregir sin una decisión explícita en un Sprint dedicado.

export function extractReferences(response: any): Array<{ title: string; url: string }> {
  const refs: Array<{ title: string; url: string }> = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks && Array.isArray(chunks)) {
    chunks.forEach((c: any) => {
      if (c?.web && c.web.uri) {
        refs.push({
          title: c.web.title || "Fuente de búsqueda",
          url: c.web.uri
        });
      }
    });
  }
  return refs;
}

export async function searchSocialMediaViaGrounding(
  industry: string,
  location: string
): Promise<{ leads: any[]; references: Array<{ title: string; url: string }> }> {
  console.log(`[Source 2 - Grounding] Buscando perfiles sociales en Google Search...`);
  
  const prompt = `
    Por favor, utiliza tu herramienta de búsqueda de Google (googleSearch) para investigar negocios reales del sector "${industry}" en la ciudad de "${location}, Colombia".
    Realiza búsquedas en Google que busquen:
    1. "${industry} ${location} Colombia site:instagram.com"
    2. "${industry} ${location} Colombia site:facebook.com"
    3. "${industry} ${location} Colombia sin pagina web"
    4. "${industry} ${location} Colombia solo whatsapp"

    De los resultados que encuentres, extrae un listado de entre 3 y 6 negocios REALES de esa zona que no parezcan tener su propio sitio web institucional (por ejemplo, solo operan en Instagram, Facebook, o atienden únicamente por WhatsApp).
    
    Para cada negocio, debes extraer:
    - name: Nombre oficial o comercial del negocio (específico y real).
    - website: Su enlace de perfil social o de WhatsApp encontrado (ej. enlace de Instagram, Facebook, o enlace de chat/API WhatsApp api.whatsapp.com/send?phone=... o similar).
    - phone: Teléfono de contacto o número móvil (si está visible en los fragmentos de búsqueda). Si no hay, pon "No disponible".
    - platform: Identifica de dónde proviene principalmente. Debe ser exactamente: "Instagram" o "Facebook" o "Búsqueda Google".

    Devuelve un objeto JSON estructurado con la propiedad "leads" que contenga la lista de estos negocios. No incluyas explicaciones en texto plano, solo el objeto JSON formateado.
  `;

  try {
    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            leads: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  website: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  platform: { 
                    type: Type.STRING,
                    enum: ["Instagram", "Facebook", "Búsqueda Google"]
                  }
                },
                required: ["name", "website", "phone", "platform"]
              }
            }
          },
          required: ["leads"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const foundLeads = parsed.leads || [];
    console.log(`[Source 2 - Grounding] Encontrados ${foundLeads.length} leads de redes sociales.`);

    const references = extractReferences(response);

    const leads = foundLeads.map((lf: any) => ({
      name: (lf.name || "Negocio sin nombre").trim(),
      website: lf.website || `Sin sitio web — solo ${lf.platform}`,
      phone: lf.phone || "No disponible",
      googleMapsUrl: "",
      rating: 0,
      reviewCount: 0,
      source: lf.platform || "Búsqueda Google"
    }));

    return { leads, references };
  } catch (err) {
    console.log("[Source 2 - Grounding] Exceso de cuota o demora de red detectada en Redes Sociales. Aplicando base de datos de respaldo.");
    const leads = generateFallbackSocialLeads(industry, location);
    return { leads, references: [] };
  }
}

export async function searchDirectoriesViaGrounding(
  industry: string,
  location: string
): Promise<{ leads: any[]; references: Array<{ title: string; url: string }> }> {
  console.log(`[Source 3 - Grounding] Buscando directorios locales en Google Search...`);

  const prompt = `
    Por favor, utiliza tu herramienta de búsqueda de Google (googleSearch) para encontrar negocios locales reales del sector "${industry}" en la ciudad o municipio de "${location}, Colombia" listados en directorios empresariales.
    Realiza búsquedas que simulen:
    1. "${industry} ${location} Colombia paginas amarillas"
    2. "${industry} ${location} Colombia directorio empresarial"

    Extrae un listado de entre 3 y 6 negocios reales que aparezcan listados en estas plataformas y que NO tengan su propia página web con dominio independiente (es decir, dependen de la página del directorio).
    
    Para cada negocio, extrae:
    - name: Nombre oficial o comercial del negocio (real, verificado en ese territorio).
    - website: El enlace a su ficha en el directorio o la ficha de contacto que encontraste.
    - phone: Teléfono de contacto directo si está disponible en la descripción de búsqueda, si no pon "No disponible".

    Devuelve un objeto JSON estructurado con la propiedad "leads" que contenga la lista de estos negocios. No incluyas explicaciones en texto plano, solo el objeto JSON formateado.
  `;

  try {
    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            leads: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  website: { type: Type.STRING },
                  phone: { type: Type.STRING }
                },
                required: ["name", "website", "phone"]
              }
            }
          },
          required: ["leads"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const foundLeads = parsed.leads || [];
    console.log(`[Source 3 - Grounding] Encontrados ${foundLeads.length} leads de directorios.`);

    const references = extractReferences(response);

    const leads = foundLeads.map((lf: any) => ({
      name: (lf.name || "Negocio sin nombre").trim(),
      website: lf.website || "Sin sitio web — solo listado Directorio",
      phone: lf.phone || "No disponible",
      googleMapsUrl: "",
      rating: 0,
      reviewCount: 0,
      source: "Directorio"
    }));

    return { leads, references };
  } catch (err) {
    console.log("[Source 3 - Grounding] Exceso de cuota o demora de red detectada en Directorios. Aplicando base de datos de respaldo.");
    const leads = generateFallbackDirectoryLeads(industry, location);
    return { leads, references: [] };
  }
}
