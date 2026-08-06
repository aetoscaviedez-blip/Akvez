import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "../config/env";

let aiClient: GoogleGenAI | null = null;

export function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = getGeminiApiKey();
    if (!key) {
      throw new Error("La variable de entorno GEMINI_API_KEY no está definida.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return aiClient;
}
