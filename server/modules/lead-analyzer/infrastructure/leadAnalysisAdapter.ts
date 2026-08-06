import { Type } from "@google/genai";
import { generateContentWithRetry } from "../../../shared/ai/generateWithRetry";
import { recordGeminiCall, recordGeminiFailure } from "../../../shared/observability/executionReport";
import { describeGeminiFailure } from "../../../shared/ai/describeGeminiFailure";
import { LeadAnalysisOutcome, LeadAnalysisPort } from "../domain/leadAnalysisPort";

/** Modelo usado por este adapter. Constante única para que el reporte de
 *  observabilidad no pueda desincronizarse del modelo realmente invocado. */
const GEMINI_MODEL = "gemini-3.5-flash";

// ── Parámetros operativos (R-50: el valor procede de APS-17, no se inventa) ──
//
// Ambos son de capa **Infraestructura** conforme a APS-17 §4 y §8, y ambos
// superan el Criterio de Invariancia de DEV-00 §3.6: si se duplicasen, se
// redujesen a la mitad o desapareciesen, el usuario tendría **el mismo
// conjunto de Leads** en su Biblioteca, porque el Registro ocurre antes y
// alcanza a todos (APS-17 §4, nota de WS-01).
//
// Viven en `infrastructure/` y no en `application/` porque ADR-11 §8.2 prohíbe
// a la capa de aplicación toda limitación **sobre el conjunto**: quien fragmenta
// es el adapter, y recompone el conjunto completo antes de devolver el control.

/** WS-01 — Tamaño de tanda de procesamiento (APS-17 §4). */
const ANALYSIS_BATCH_SIZE = 10;

/** WS-02 — Análisis simultáneos por ejecución (APS-17 §4). */
const MAX_CONCURRENT_BATCHES = 5;

/**
 * Implementación del puerto `LeadAnalysisPort` sobre el modelo generativo.
 *
 * Se construye en el Composition Root (ADR-09 §5.1 · ADR-17 AL-20). No recibe
 * credencial: `shared/ai` —accesible **únicamente** desde `infrastructure/`
 * (ADR-04 §11)— resuelve la suya contra `shared/config/`.
 *
 * El contrato de resultado se declara en `domain/`: `batchCount` y
 * `failedBatches` pasaron a llamarse `attempted` y `failed` porque un puerto no
 * puede expresar en su superficie la fragmentación en tandas, que es una
 * limitación técnica del adapter (ADR-17 §6.3 P-3 · ADR-11 §8.3). La semántica
 * es idéntica.
 */
export function createGeminiLeadAnalysis(): LeadAnalysisPort {
  return {
    analyze(leads, industry, location, designerStyle) {
      return analyzeLeadsWithGemini(leads, industry, location, designerStyle);
    }
  };
}

/**
 * Analiza el conjunto completo fragmentándolo en tandas de `WS-01` y ejecutando
 * como máximo `WS-02` de forma simultánea, **recomponiendo el conjunto completo**
 * antes de devolver el control (APS-17 §3.1 · ADR-11 §7.3, §8.3).
 *
 * **No lanza cuando solo algunas tandas fallan.** Devuelve lo que sí se pudo
 * analizar y deja constancia del fallo parcial: **R-64** exige que un fallo
 * parcial sobre un conjunto de Empresas nunca aborte el conjunto (APS-03 §12 ·
 * PO-01 §8). Los Leads cuya tanda falló llegan a `application/` sin análisis, y
 * es allí donde se resuelven con la inteligencia de respaldo — lead por lead.
 */
async function analyzeLeadsWithGemini(
  scored: any[],
  industry: string,
  location: string,
  designerStyle: string
): Promise<LeadAnalysisOutcome> {
  if (scored.length === 0) {
    return { analyzedLeads: [], attempted: 0, failed: 0 };
  }

  // Fragmentación en tandas, conservando el desplazamiento de cada una para
  // poder devolver índices globales.
  const batches: Array<{ offset: number; leads: any[] }> = [];
  for (let offset = 0; offset < scored.length; offset += ANALYSIS_BATCH_SIZE) {
    batches.push({ offset, leads: scored.slice(offset, offset + ANALYSIS_BATCH_SIZE) });
  }

  const analyzedLeads: any[] = [];
  let failedBatches = 0;
  let firstFailureMessage: string | undefined;

  // Pool de concurrencia acotada por WS-02. Se recorre el arreglo de tandas con
  // un cursor compartido: cada worker toma la siguiente pendiente al terminar la
  // suya, de modo que nunca hay más de `MAX_CONCURRENT_BATCHES` llamadas vivas.
  let cursor = 0;
  async function worker(): Promise<void> {
    while (cursor < batches.length) {
      const batch = batches[cursor++];
      try {
        const result = await analyzeBatch(batch.leads, batch.offset, industry, location, designerStyle);
        analyzedLeads.push(...result);
      } catch (error: any) {
        // El fallo de una tanda no cancela las demás ni el conjunto (R-64).
        failedBatches++;
        if (!firstFailureMessage) firstFailureMessage = error?.message || String(error);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(MAX_CONCURRENT_BATCHES, batches.length) }, () => worker())
  );

  return { analyzedLeads, attempted: batches.length, failed: failedBatches, firstFailureMessage };
}

/**
 * Analiza una sola tanda. `indexOffset` traduce los índices locales que devuelve
 * el modelo a índices globales del conjunto de entrada.
 */
async function analyzeBatch(
  scored: any[],
  indexOffset: number,
  industry: string,
  location: string,
  designerStyle: string
): Promise<any[]> {
        const batchInput = scored.map((p: any, idx: number) => {
          const hasWeb = !!(p.website && p.website.trim() !== "" && !p.website.toLowerCase().includes("sin sitio web"));
          return {
            index: idx,
            name: p.name,
            rating: p.rating,
            reviewCount: p.reviewCount,
            phone: p.phone || "No disponible",
            website: hasWeb ? p.website : "Sin sitio web",
            calculatedClassification: p.calculatedClassification,
            source: p.source
          };
        });

        const prompt = `
          Eres el agente LeadFlow, un consultor de diseño web experto en analizar negocios de Colombia para optimizar su conversión y lanzar propuestas de outreach atractivas.
          
          Analiza este lote de ${batchInput.length} negocios de la ciudad de "${location}, Colombia" en el nicho "${industry}".
          El estilo del diseñador web que propone el servicio es: "${designerStyle || "moderno y minimalista"}".
          
          Información de los negocios recopilados:
          ${JSON.stringify(batchInput, null, 2)}
          
          Por cada uno de estos negocios, analiza su situación particular basado en su nombre, nicho, calificación, origen de fuente ("source"), y presencia digital actual, y genera un estudio de consultoría personalizado.
          
          REGLAS DE ANÁLISIS SEGÚN LA FUENTE:
          1. Si un negocio proviene de 'Instagram' o 'Facebook' o 'Búsqueda Google' con un perfil social:
             - "classification": Se clasifica generalmente como "Sitio web básico" (al operar en una red social).
             - "flaws": Describe exactamente 3 pérdidas críticas o desventajas de depender 100% de redes sociales (ej. cero control de algoritmo, falta de menús con reserva directa, nulo posicionamiento SEO en Google).
             - "revenueLoss": Explica cómo pierden clientes en Colombia que desean ver menús, cotizar o agendar de forma seria y segura sin esperar un mensaje directo de WhatsApp o DM.
             - "angle": Propón el concepto de su primera web propia que integre reservas online y refleje su marca con estilo "${designerStyle}".
             - "whyWebsiteNeeded": Breve y contundente llamado a la acción personalizado de por qué necesitan superar el límite de las redes sociales.
          2. Si proviene de 'Directorio':
             - "classification": Clasifica como "Sitio web básico".
             - "flaws": Describe exactamente 3 problemas de depender de listados grupales (ej. ser listado al lado de toda la competencia, nula diferenciación de marca, falta de canales interactivos de venta).
             - "revenueLoss": Describe cómo el tráfico directo de clientes interesados se diluye hacia competidores con páginas dedicadas independientes.
             - "angle": Propón lanzarles su propia página web premium para destacar como líderes locales.
             - "whyWebsiteNeeded": Explicación de por qué dependen críticamente de salir de directorios impersonales.
          3. Si proviene de 'Google Maps' y la clasificación calculada es "Sin sitio web":
             - "classification": Debe ser exactamente "Sin sitio web".
             - "flaws": Detalla exactamente 3 problemas por operar de manera totalmente offline en internet (sin canal de ventas, etc.).
             - "revenueLoss": Detalla la pérdida financiera de forma empática.
             - "angle": Diseñarles su primera web oficial que aumente su credibilidad y conversión.
             - "whyWebsiteNeeded": Por qué requieren urgentemente salir de la invisibilidad web.
          4. Si proviene de 'Google Maps' con web deficiente:
             - "classification": "Sitio web deficiente" o "Sitio web básico".
             - "flaws": Describe 3 debilidades claras de su web lenta, desactualizada, sin llamados a la acción o de difícil navegación.
             - "revenueLoss": Desperdicio de pauta o tráfico orgánico y pérdida de confianza de los usuarios.
             - "angle": Rediseño visual o funcional premium.
             - "whyWebsiteNeeded": Modernización urgente de conversión.
            
          Devuelve un objeto JSON con la propiedad "analyzedLeads" que contenga un array ordenado que corresponda a cada negocio.
        `;

        const geminiStartedAt = Date.now();
        const response = await generateContentWithRetry({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                analyzedLeads: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      index: { type: Type.INTEGER },
                      description: { type: Type.STRING },
                      flaws: { type: Type.ARRAY, items: { type: Type.STRING } },
                      revenueLoss: { type: Type.STRING },
                      angle: { type: Type.STRING },
                      whyWebsiteNeeded: { type: Type.STRING },
                      classification: { 
                        type: Type.STRING,
                        enum: ["Sin sitio web", "Sitio web deficiente", "Sitio web básico"]
                      }
                    },
                    required: ["index", "description", "flaws", "revenueLoss", "angle", "whyWebsiteNeeded", "classification"]
                  }
                }
              },
              required: ["analyzedLeads"]
            }
          }
        }).catch((error: any) => {
          // Se describe y registra la llamada fallida, y se relanza el error sin
          // alterarlo: la decisión de activar el respaldo sigue siendo de
          // `application/`. Solo tipo, código HTTP y mensaje resumido — nunca el
          // prompt ni la credencial.
          const failure = describeGeminiFailure(error);
          const elapsedMs = Date.now() - geminiStartedAt;
          recordGeminiFailure({ model: GEMINI_MODEL, ms: elapsedMs, failure });
          console.warn(
            `[Gemini][LeadAnalyzer] Llamada fallida tras ${elapsedMs} ms — ` +
            `tipo=${failure.type} http=${failure.httpStatus ?? "n/a"} status=${failure.statusText ?? "n/a"}`
          );
          throw error;
        });

        // Solo modelo, resultado y duración — nunca el prompt ni la respuesta.
        recordGeminiCall({ model: GEMINI_MODEL, success: true, ms: Date.now() - geminiStartedAt });

  const parsed = JSON.parse(response.text || "{}");
  const analyzed = Array.isArray(parsed?.analyzedLeads) ? parsed.analyzedLeads : [];

  // Traducción de índice local → índice global del conjunto completo. Sin esto,
  // la tanda 2 devolvería índices 0..9 que colisionarían con los de la tanda 1.
  // Se descarta cualquier índice que el modelo devuelva fuera de rango en lugar
  // de propagarlo: un índice inválido asignaría el análisis a otro Lead.
  return analyzed
    .filter((lead: any) => lead && typeof lead.index === "number" && lead.index >= 0 && lead.index < scored.length)
    .map((lead: any) => ({ ...lead, index: lead.index + indexOffset }));
}
