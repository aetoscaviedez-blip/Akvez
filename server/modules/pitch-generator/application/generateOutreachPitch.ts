import { PitchDraft, PitchDraftingPort } from "../domain/pitchDraftingPort";
import { generateFallbackPitch } from "../domain/fallbackPitch";
import {
  recordGeminiFallback,
  recordAnalysisSource
} from "../../../shared/observability/executionReport";

/**
 * El texto redactado. Alias del tipo de `domain/`: el resultado de un caso de
 * uso se expresa en tipos del propio módulo (ADR-17 §7.2, C-2). Se conserva el
 * nombre `PitchPayload` porque es el que ya viaja hacia `presentation/` y el
 * mapper de respuesta, y renombrarlo no aporta nada a esta fase.
 */
export type PitchPayload = PitchDraft;

export interface GenerateOutreachPitchInput {
  designer: any;
  lead: any;
  channel: string;
  customInstructions?: string;
}

/**
 * Unión discriminada por literal (ADR-17 §7.3 · AL-12).
 *
 * Antes discriminaba por `success: true | false`. **ADR-17 §7.3 cita este
 * módulo como el ejemplo del defecto**: un booleano solo admite dos ramas y
 * obliga a subdividir el fallo dentro de una de ellas, que es exactamente cómo
 * `PitchGeneratorOutcome` acabó teniendo tres ramas en `presentation/` mientras
 * `application/` tenía dos. Con `outcome` caben tantas ramas como fallos
 * esperados haya, sin capas de traducción.
 *
 * `drafting_failed` es un **fallo esperado y significativo**, no una excepción:
 * el proveedor falló y el respaldo también. C-3 exige que viaje como rama del
 * resultado (R-61).
 */
export type GenerateOutreachPitchResult =
  | { outcome: "success"; pitch: PitchPayload; isFallback?: boolean }
  | { outcome: "drafting_failed"; error: string };

/**
 * Dependencias del caso de uso. **Un único parámetro, con nombres, y solo
 * puertos** (ADR-17 §8.2, F-1 y F-2). Ninguna es opcional ni tiene valor por
 * defecto: un `?? new GeminiAdapter()` sería una construcción dentro de
 * `application/`, prohibida por R-55 (F-3).
 *
 * Cierra el tercero de los tres puntos de AR-05 §5, acción 8: este fichero
 * importaba `../infrastructure/pitchGenerationAdapter`.
 */
export interface GenerateOutreachPitchDeps {
  pitchDrafting: PitchDraftingPort;
}

export type GenerateOutreachPitchFn = (
  input: GenerateOutreachPitchInput
) => Promise<GenerateOutreachPitchResult>;

/**
 * Factory del caso de uso (ADR-09 §5.2 · R-56 · AL-01). No ejecuta trabajo, no
 * abre conexiones y no valida sus dependencias: solo cierra sobre ellas y
 * devuelve la función ya vinculada (F-4, F-5).
 *
 * **Sustituye a la función suelta anterior**, que se importaba y ejecutaba
 * directamente y hacía imposible construir el módulo desde el Composition Root
 * — la desviación que ADR-15 §9.5 declara prerrequisito de todo lo demás.
 */
export function createGenerateOutreachPitch(
  deps: GenerateOutreachPitchDeps
): GenerateOutreachPitchFn {
  const { pitchDrafting } = deps;

  return async function generateOutreachPitch(
    input: GenerateOutreachPitchInput
  ): Promise<GenerateOutreachPitchResult> {
    const { designer, lead, channel, customInstructions } = input;

    try {
      // El caso de uso invoca el **puerto**. Nunca ve un error del SDK del
      // proveedor: ve lo que el puerto declara (ADR-17 §10.3 · AL-14).
      const parsed = await pitchDrafting.draft({ designer, lead, channel, customInstructions });
      // Fase 4/5 — el origen se DECLARA aquí, en la capa que tomó la decisión.
      recordAnalysisSource("GEMINI", "El pitch fue redactado por el modelo.");
      return { outcome: "success", pitch: parsed };
    } catch (error: any) {
      console.log("[Pitch Generator] Se ha activado de manera segura la redacción persuasiva de respaldo para el outreach del cliente.");
      recordGeminiFallback(error?.message || String(error));
      try {
        const fallbackPitch = generateFallbackPitch(designer, lead, channel);
        recordAnalysisSource("FALLBACK", "El pitch proviene de la redacción de respaldo.");
        return { outcome: "success", pitch: fallbackPitch, isFallback: true };
      } catch (fallbackErr: any) {
        // Antes se silenciaba por completo: no quedaba rastro de por qué un
        // request terminaba en 500 pese a existir un respaldo.
        console.error("[Pitch Generator] La redacción de respaldo también falló:", fallbackErr);
        recordAnalysisSource("FALLBACK", "La redacción de respaldo también falló; no se entregó pitch.");
        return {
          outcome: "drafting_failed",
          error: "No se pudo generar el mensaje. Activa tu API key de Gemini para habilitar el redactor dinámico completo."
        };
      }
    }
  };
}
