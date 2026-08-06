// Pruebas del `ProposalDraftingAdapter`.
//
// **El proveedor se dobla.** Lo que se prueba no es qué escribe un modelo —eso no
// es comprobable— sino **qué se le entrega y qué se hace con lo que devuelve**:
// que la estrategia llega íntegra, que la lista cerrada es la única fuente de
// hechos, y que **nada más entra**.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommercialStrategy } from "../domain/commercial/commercialStrategy";
import { ClosedFactList } from "../domain/commercial/evidence";
import { CommunicationError, ExternalDataError } from "../../../shared/errors";
import { ProposalDraftingPort } from "../domain/commercial/proposalDraftingPort";

const ai = vi.hoisted(() => ({ generateContentWithRetry: vi.fn() }));

vi.mock("../../../shared/ai/generateWithRetry", () => ({
  generateContentWithRetry: ai.generateContentWithRetry
}));
vi.mock("../../../shared/observability/executionReport", () => ({
  recordGeminiCall: vi.fn(),
  recordGeminiFailure: vi.fn()
}));
vi.mock("../../../shared/ai/describeGeminiFailure", () => ({
  describeGeminiFailure: () => ({ type: "unknown", httpStatus: undefined, statusText: undefined })
}));

import { createGeminiProposalDrafting } from "./proposalDraftingAdapter";

const ADAPTER_SOURCE = readFileSync(
  fileURLToPath(new URL("./proposalDraftingAdapter.ts", import.meta.url)),
  "utf8"
);

function facts(): ClosedFactList {
  return [
    {
      lead: "lead-1",
      kind: "contacto_publico",
      statement: "El negocio publica un teléfono de contacto",
      source: { observation: "atributo_de_empresa", source: "google-places" }
    },
    {
      lead: "lead-1",
      kind: "reputacion_publicada",
      statement: "Su ficha acumula 48 reseñas con calificación 4,3",
      source: { observation: "reputacion_publicada", source: "google-places" }
    }
  ];
}

function strategy(overrides: Partial<CommercialStrategy> = {}): CommercialStrategy {
  return {
    objective: "responder",
    barrier: "Credibilidad",
    evidenceBase: facts(),
    focus: "un negocio que ya atiende por teléfono",
    emotion: "reconocimiento",
    resumedThread: "qué hace que un cliente elija a un competidor",
    openedThread: "qué ve alguien que busca el negocio y no lo encuentra",
    relevanceElement: "el teléfono publicado es el único canal de entrada",
    channel: "Email frío",
    moment: "Evidencia",
    expectedOutcome: "respondió",
    ...overrides
  };
}

/** El prompt que recibió el proveedor en la última llamada. */
function lastPrompt(): string {
  return ai.generateContentWithRetry.mock.calls[0][0].contents as string;
}

let port: ProposalDraftingPort;

beforeEach(() => {
  vi.clearAllMocks();
  ai.generateContentWithRetry.mockResolvedValue({ text: "  Texto redactado por el modelo.  " });
  port = createGeminiProposalDrafting();
});

describe("ProposalDraftingAdapter", () => {
  // ── El puerto ─────────────────────────────────────────────────────────────

  it("implementa el puerto: recibe estrategia y hechos, y devuelve solo texto", async () => {
    const result = await port.draft({ strategy: strategy(), facts: facts() });

    // **APS-18 §10.2 — «Devuelve: el texto. Nada más»**, ya recortado.
    expect(result).toBe("Texto redactado por el modelo.");
    expect(typeof result).toBe("string");
  });

  // ── Propagación íntegra de la estrategia ──────────────────────────────────

  it("los diez contenidos de la estrategia llegan al proveedor (APS-18 §8.1)", async () => {
    const decided = strategy();
    await port.draft({ strategy: decided, facts: facts() });

    const prompt = lastPrompt();
    for (const value of [
      decided.objective,
      decided.barrier,
      decided.emotion,
      decided.focus,
      decided.relevanceElement,
      decided.resumedThread!,
      decided.openedThread!,
      decided.channel,
      decided.moment,
      decided.expectedOutcome
    ]) {
      expect(prompt).toContain(value);
    }
  });

  it("R-38 — un hilo ausente no se sustituye por uno inventado", async () => {
    await port.draft({
      strategy: strategy({ resumedThread: undefined, openedThread: undefined }),
      facts: facts()
    });

    const prompt = lastPrompt();
    expect(prompt).toContain("No hay asunto previo que retomar");
    expect(prompt).toContain("No dejes planteado ningún asunto nuevo");
  });

  it("el canal viaja con las restricciones que APS-20 §6 publica", async () => {
    await port.draft({ strategy: strategy({ channel: "LinkedIn Connection Note" }), facts: facts() });

    const prompt = lastPrompt();
    expect(prompt).toContain("exactamente un hecho observado");
    expect(prompt).toContain("cualquier petición de reunión");
  });

  it("APS-20 §3.2 — el canal no amplía la base de evidencia", async () => {
    await port.draft({ strategy: strategy({ channel: "Instagram DM" }), facts: facts() });

    // Contactar por Instagram **no autoriza a afirmar nada visto en Instagram**:
    // la lista cerrada procede exclusivamente del análisis.
    expect(lastPrompt()).toContain("toda afirmación sobre lo publicado en el propio canal");
  });

  // ── La lista cerrada es la única fuente de hechos ─────────────────────────

  it("RE-1 · RA-4 — se entregan exactamente los hechos recibidos, ni uno más", async () => {
    const recibidos = facts();
    await port.draft({ strategy: strategy(), facts: recibidos });

    const prompt = lastPrompt();
    for (const fact of recibidos) expect(prompt).toContain(fact.statement);
    // La lista enumerada no puede tener más elementos que los recibidos.
    expect(prompt).toContain(`${recibidos.length}. ${recibidos[1].statement}`);
    expect(prompt).not.toContain(`${recibidos.length + 1}. `);
    expect(prompt).toContain("No afirmes absolutamente nada que no esté en la lista anterior");
  });

  it("RE-5 — una lista vacía es estado válido y no se rellena", async () => {
    await port.draft({ strategy: strategy({ evidenceBase: [] }), facts: [] });

    const prompt = lastPrompt();
    expect(prompt).toContain("(ninguno)");
    expect(prompt).toContain("no afirmes ningún hecho sobre el negocio");
  });

  it("la trazabilidad del hecho no viaja: el enunciado sí, la Fuente nunca", async () => {
    await port.draft({ strategy: strategy(), facts: facts() });

    const prompt = lastPrompt();
    // `source` es **metadato de trazabilidad, jamás argumento comercial**:
    // «Google Maps demuestra que…» convertiría al proveedor en argumento.
    expect(prompt).not.toContain("google-places");
    expect(prompt).not.toContain("atributo_de_empresa");
  });

  // ── Lo que no entra ───────────────────────────────────────────────────────

  it("no accede al diagnóstico, al Lead Analyzer, al Lead Hunter ni a repositorios", () => {
    // Es una propiedad de los **imports**, y se comprueba sobre ellos: si alguno
    // apareciera, el adapter tendría acceso aunque hoy no lo usara.
    const imports = importsOf(ADAPTER_SOURCE);

    for (const forbidden of [
      "BuyerDiagnosis",
      "Repository",
      "lead-analyzer",
      "lead-hunter",
      "reducedDiagnosis",
      "reducedSequence",
      "persistence"
    ]) {
      expect(imports).not.toContain(forbidden);
    }

    // Y lo que sí importa: el cliente de IA, la observabilidad, la taxonomía de
    // errores y **su propio puerto**. Nada más.
    expect(imports).toContain("shared/ai/generateWithRetry");
    expect(imports).toContain("domain/commercial/proposalDraftingPort");
  });

  it("no decide nada comercial: el prompt no aporta enfoque, tono ni argumentos propios", async () => {
    await port.draft({ strategy: strategy(), facts: facts() });

    const prompt = lastPrompt().toLowerCase();
    // Ninguna indicación de autoría del adapter. Todo lo que orienta el texto
    // procede de un campo recibido o de una regla publicada (RC-2).
    for (const marker of ["tono:", "cumplido", "empatía", "pierde dinero", "oportunidad de mejora"]) {
      expect(prompt).not.toContain(marker);
    }
  });

  // ── Fallos ────────────────────────────────────────────────────────────────

  it("AL-14 · R-63 — un fallo del proveedor se envuelve conservando `cause`", async () => {
    const original = new Error("429 Too Many Requests");
    ai.generateContentWithRetry.mockRejectedValue(original);

    const error = await port.draft({ strategy: strategy(), facts: facts() }).catch((e: unknown) => e);

    // El caso de uso **nunca ve un error de SDK** (COM-09 §7).
    expect(error).toBeInstanceOf(CommunicationError);
    expect((error as CommunicationError).cause).toBe(original);
  });

  it("una respuesta vacía es un error de datos externos, no de comunicación", async () => {
    ai.generateContentWithRetry.mockResolvedValue({ text: "   " });

    const error = await port.draft({ strategy: strategy(), facts: facts() }).catch((e: unknown) => e);

    // Hubo respuesta; no es utilizable. APS-03 §12 distingue ambos casos.
    expect(error).toBeInstanceOf(ExternalDataError);
  });
});

/** Las rutas importadas por el fichero, y solo ellas. */
function importsOf(source: string): string {
  return source
    .split("\n")
    .filter((line) => line.trimStart().startsWith("import ") || line.includes('} from "'))
    .join("\n");
}
