import { Type } from "@google/genai";
import { generateContentWithRetry } from "../../../shared/ai/generateWithRetry";
import { recordGeminiCall, recordGeminiFailure } from "../../../shared/observability/executionReport";
import { describeGeminiFailure } from "../../../shared/ai/describeGeminiFailure";
import { PitchDraft, PitchDraftingPort } from "../domain/pitchDraftingPort";

/** Modelo usado por este adapter. Constante única para que el reporte de
 *  observabilidad no pueda desincronizarse del modelo realmente invocado. */
const GEMINI_MODEL = "gemini-3.5-flash";

/**
 * Implementación del puerto `PitchDraftingPort` sobre el modelo generativo.
 *
 * Se construye en el Composition Root (ADR-09 §5.1 · ADR-17 AL-20), que es el
 * único autorizado a importar este fichero. No recibe credencial: `shared/ai`
 * —accesible **únicamente** desde `infrastructure/` (ADR-04 §11)— resuelve la
 * suya contra `shared/config/`.
 *
 * El modelo, el esquema de respuesta y el prompt son detalle de este adapter y
 * no cruzan la frontera: el puerto solo declara qué se necesita, nunca cómo se
 * obtiene (ADR-17 §6.1).
 */
export function createGeminiPitchDrafting(): PitchDraftingPort {
  return {
    draft({ designer, lead, channel, customInstructions }) {
      return generatePitchWithGemini(designer, lead, channel, customInstructions);
    }
  };
}

async function generatePitchWithGemini(
  designer: any,
  lead: any,
  channel: string,
  customInstructions?: string
): Promise<PitchDraft> {
      const prompt = `
        Eres LeadFlow, experto en escribir mensajes de outreach para diseñadores web freelance en Colombia.
        Canal: "${channel}"
        
        REGLAS — NUNCA las violes:
        - NUNCA suenes como spam, vendedor genérico o IA.
        - NUNCA empieces con "Hola, espero que estés bien" ni con tu nombre.
        - Empieza con un cumplido MUY específico sobre "${lead.name}" — algo que notaste en su negocio.
        - Menciona un problema concreto que observaste (sin website, sin reservas, etc.)
        - Conecta ese problema con pérdida de clientes o dinero — de forma empática.
        - Ofrece valor primero: "Hice un boceto de cómo podría verse tu web. ¿Te lo mando?"
        - NUNCA pidas reunión, presupuesto o llamada de inmediato.
        - Tono: ${designer.tone || "Cálido, cercano y profesional"}
        - Sonar como lo escribió una persona real, no una IA.
        
        DISEÑADOR:
        - Nombre: ${designer.name || "Diseñador freelance"}
        - Estilo: ${designer.style || "Diseño moderno y minimalista"}
        - Herramientas: ${designer.skills || "Webflow, WordPress"}
        - Casos de éxito: ${designer.caseStudies || "No especificado"}
        
        NEGOCIO (lead real):
        - Nombre: ${lead.name}
        - Nicho: ${lead.description}
        - Problemas: ${JSON.stringify(lead.flaws || [])}
        - Cómo pierde dinero: ${lead.revenueLoss}
        - Oportunidad: ${lead.angle}
        
        ${customInstructions ? `Instrucciones adicionales: ${customInstructions}` : ""}
        
        Devuelve JSON con:
        1. "subjectLine": Asunto creativo y no comercial (solo para email, vacío para DMs)
        2. "message": Mensaje completo bien espaciado
        3. "strategyExplanation": Por qué esta estructura funciona para este negocio específico
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
              subjectLine: { type: Type.STRING },
              message: { type: Type.STRING },
              strategyExplanation: { type: Type.STRING }
            },
            required: ["subjectLine", "message", "strategyExplanation"]
          }
        }
      }).catch((error: any) => {
        // Misma trazabilidad que Lead Analyzer (Fase 5): se describe y registra
        // la llamada fallida y se relanza el error sin alterarlo. La decisión de
        // activar el respaldo sigue siendo de `application/`.
        const failure = describeGeminiFailure(error);
        const elapsedMs = Date.now() - geminiStartedAt;
        recordGeminiFailure({ model: GEMINI_MODEL, ms: elapsedMs, failure });
        console.warn(
          `[Gemini][PitchGenerator] Llamada fallida tras ${elapsedMs} ms — ` +
          `tipo=${failure.type} http=${failure.httpStatus ?? "n/a"} status=${failure.statusText ?? "n/a"}`
        );
        throw error;
      });

      // Solo modelo, resultado y duración — nunca el prompt ni la respuesta.
      recordGeminiCall({ model: GEMINI_MODEL, success: true, ms: Date.now() - geminiStartedAt });

  return JSON.parse(response.text || "{}");
}
