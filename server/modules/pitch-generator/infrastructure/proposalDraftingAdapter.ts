// Implementación de `ProposalDraftingPort` sobre el modelo generativo.
//
// **ESTE FICHERO NO DECIDE NADA.** Recibe decisiones ya tomadas —una
// `CommercialStrategy` y la lista cerrada— y las **transcribe** a instrucciones.
// **APS-18 §10.1: «el modelo de IA redacta. No decide»**, y este adapter es el
// único punto donde esa frase se materializa.
//
// Se construye en el Composition Root (ADR-09 §5.1 · ADR-17 AL-20), único
// autorizado a importar este fichero. No recibe credencial: `shared/ai`
// —accesible **únicamente** desde `infrastructure/` (ADR-04 §11)— resuelve la
// suya contra `shared/config/`.
//
// ── QUÉ ENTRA EN EL PROMPT, Y DE DÓNDE SALE CADA COSA ────────────────────────
//
// **APS-18 §10.2** enumera qué recibe la redacción: *«el objetivo, la barrera, la
// emoción admisible, el hilo que retoma, el hilo que deja planteado, el canal con
// sus restricciones y —de forma determinante— la lista cerrada de hechos
// afirmables»*. **Los siete primeros son campos de la estrategia**; el octavo es
// `facts`. **Nada más entra, y nada de lo que entra lo decide este fichero.**
//
// Las restricciones de canal se **transcriben de APS-20 §6**, que las publica
// como listas cerradas de elementos permitidos y prohibidos. Transcribirlas no
// es decidir: **D-3** deja la *regla* de canal en el dominio y el punto de
// control la **verifica** después (APS-18 §10.3, comprobación 2). Aquí solo se
// comunican al modelo, que es lo que §10.2 exige.
//
// ── ⚠️ LO QUE NO PUEDE TRANSCRIBIRSE, Y POR QUÉ ──────────────────────────────
//
// **El límite de longitud de cada canal no existe todavía.** APS-20 §6 lo remite
// a **APS-17** en los tres casos, como parámetro **propuesto** —`CH-01`, `CH-02`
// y `CH-03` (§12, Q-3)—, y **ningún documento aprobado publica su valor**.
//
// **No se inventa ninguno.** Un número aquí sería *«un valor por defecto que
// sustituye a un dato que no existe»* —prohibido por **R-38**— y **R-52** prohíbe
// fijar un parámetro operativo sin valor aprobado. Es el mismo tipo de bloqueo
// que B-2, con otro parámetro. **La brevedad se transmite con lo que APS-20 §6 sí
// publica**: qué personalización espera cada canal y qué elementos admite.
//
// ── LO QUE ESTE ADAPTER NO PUEDE HACER ───────────────────────────────────────
//
// **No añade un solo hecho** (RA-4 · RE-1): la lista llega cerrada y el prompt la
// enumera sin ampliarla. **No conoce el diagnóstico, ni el Lead Analyzer, ni el
// Lead Hunter, ni ningún repositorio** — no los importa y no puede importarlos.
// **No decide objetivo, barrera, evidencia ni estrategia** (RC-2).

import { generateContentWithRetry } from "../../../shared/ai/generateWithRetry";
import { recordGeminiCall, recordGeminiFailure } from "../../../shared/observability/executionReport";
import { describeGeminiFailure } from "../../../shared/ai/describeGeminiFailure";
import { CommunicationError, ExternalDataError } from "../../../shared/errors";
import {
  ProposalDraftingInput,
  ProposalDraftingPort
} from "../domain/commercial/proposalDraftingPort";

/** Modelo usado por este adapter. Constante única para que el reporte de
 *  observabilidad no pueda desincronizarse del modelo realmente invocado. */
const GEMINI_MODEL = "gemini-3.5-flash";

/**
 * Restricciones publicadas de cada canal — **transcritas de APS-20 §6**.
 *
 * **Sin longitud**: su valor no está publicado *(cabecera)*. Lo que sí se
 * transcribe es qué personalización espera el canal y qué elementos admite y
 * prohíbe, que APS-20 §6 declara como listas cerradas.
 */
const CHANNEL_CONSTRAINTS: Readonly<Record<string, string>> = Object.freeze({
  "Email frío": [
    "Personalización esperada: alta — admite varios hechos observados sin degradar la legibilidad.",
    "Permitido: asunto; cuerpo en párrafos breves; como máximo un enlace, y solo a un activo propio; firma con identidad real; una única pregunta final explícita y respondible.",
    "Prohibido: adjuntos de cualquier tipo; imágenes incrustadas o maquetación de boletín; más de un enlace; un asunto que prometa algo que el cuerpo no entrega; simular respuesta a un hilo previo inexistente («RE:», «Fwd:»); remitente que no identifique a la persona real; más de una pregunta."
  ].join("\n"),
  "LinkedIn Connection Note": [
    "Personalización esperada: exactamente un hecho observado.",
    "Permitido: una observación específica y verificable sobre el negocio; identificación del emisor.",
    "Prohibido: enlaces; cualquier oferta, propuesta o mención de servicio; cualquier petición de reunión, llamada o respuesta; abreviaturas o supresiones que degraden la observación para hacerla caber.",
    "Si la observación no cabe, no se abrevia."
  ].join("\n"),
  "Instagram DM": [
    "Personalización esperada: uno o dos hechos observados.",
    "Permitido: registro conversacional y directo; mensaje breve, en una sola emisión; una pregunta.",
    "Prohibido: enlaces; registro formal de correo (saludos protocolarios, firmas, estructura de carta); cualquier oferta; varios mensajes consecutivos; audio, imagen o vídeo; toda afirmación sobre lo publicado en el propio canal."
  ].join("\n")
});

export function createGeminiProposalDrafting(): ProposalDraftingPort {
  return {
    draft(input: ProposalDraftingInput): Promise<string> {
      return draftWithGemini(input);
    }
  };
}

/**
 * Rinde la estrategia y la lista cerrada como instrucciones.
 *
 * **Cada línea procede de un campo recibido o de una regla publicada.** No hay
 * ninguna indicación de estilo, tono ni enfoque de autoría propia: eso sería
 * decidir, y la decisión ya viene tomada.
 */
function buildPrompt({ strategy, facts }: ProposalDraftingInput): string {
  const affirmables = facts.length
    ? facts.map((fact, index) => `${index + 1}. ${fact.statement}`).join("\n")
    : "(ninguno)";

  return [
    "Redacta el texto de un contacto comercial en frío. Tú no decides nada: todas las decisiones ya están tomadas y se te entregan a continuación.",
    "",
    "DECISIONES QUE DEBES MATERIALIZAR",
    `- Objetivo único del contacto: ${strategy.objective}. Persigue ese avance y ninguno más.`,
    `- Única resistencia que debe romper: ${strategy.barrier}.`,
    `- Emoción admisible: ${strategy.emotion}.`,
    `- Qué se pone en primer plano: ${strategy.focus}.`,
    `- Qué aporta este contacto que el anterior no contenía: ${strategy.relevanceElement}.`,
    strategy.resumedThread
      ? `- Asunto que este contacto retoma, y debe retomar: ${strategy.resumedThread}.`
      : "- No hay asunto previo que retomar: es el primer contacto de la conversación.",
    strategy.openedThread
      ? `- Asunto que este contacto debe dejar planteado, enunciado por completo: ${strategy.openedThread}.`
      : "- No dejes planteado ningún asunto nuevo.",
    `- Momento de la secuencia: ${strategy.moment}.`,
    `- Resultado que se considerará éxito: ${strategy.expectedOutcome}.`,
    "",
    `CANAL: ${strategy.channel}`,
    CHANNEL_CONSTRAINTS[strategy.channel] ?? "",
    "",
    "HECHOS QUE PUEDES AFIRMAR — lista cerrada y completa",
    affirmables,
    "",
    "REGLAS QUE NO PUEDES INCUMPLIR",
    "- No afirmes absolutamente nada que no esté en la lista anterior. Si la lista está vacía, no afirmes ningún hecho sobre el negocio.",
    "- No aludas a un hallazgo sin enunciarlo: si lo mencionas, dilo entero.",
    "- No condiciones ninguna información a que el receptor responda.",
    "- No actives miedo, vergüenza, culpa ni presión temporal.",
    "- No inventes cifras, pérdidas económicas ni comparaciones que no estén en la lista.",
    "- No firmes en nombre de nadie ni atribuyas datos de contacto que no se te han dado.",
    "",
    "SALIDA: devuelve únicamente el texto del contacto. Sin encabezados, sin explicaciones y sin comentarios sobre tu propio trabajo."
  ].join("\n");
}

async function draftWithGemini(input: ProposalDraftingInput): Promise<string> {
  const startedAt = Date.now();

  const response = await generateContentWithRetry({
    model: GEMINI_MODEL,
    contents: buildPrompt(input)
  }).catch((error: unknown) => {
    // Misma trazabilidad que el resto de adapters generativos: se describe y
    // registra la llamada fallida.
    const failure = describeGeminiFailure(error);
    const elapsedMs = Date.now() - startedAt;
    recordGeminiFailure({ model: GEMINI_MODEL, ms: elapsedMs, failure });
    console.warn(
      `[Gemini][Proposal] Llamada fallida tras ${elapsedMs} ms — ` +
        `tipo=${failure.type} http=${failure.httpStatus ?? "n/a"} status=${failure.statusText ?? "n/a"}`
    );
    // **El caso de uso nunca ve un error de SDK** (AL-14 · R-63 · COM-09 §7):
    // se envuelve **conservando `cause`**, y `application/` lo traduce a su rama
    // `drafting_unavailable`.
    throw new CommunicationError("El proveedor de redacción no respondió.", error);
  });

  // Solo modelo, resultado y duración — nunca el prompt ni la respuesta.
  recordGeminiCall({ model: GEMINI_MODEL, success: true, ms: Date.now() - startedAt });

  const text = response.text?.trim() ?? "";
  if (text.length === 0) {
    // Hubo respuesta, pero no es utilizable: es la distinción que APS-03 §12
    // hace entre un fallo de comunicación y uno de datos externos.
    throw new ExternalDataError("El proveedor de redacción devolvió una respuesta vacía.");
  }

  return text;
}
