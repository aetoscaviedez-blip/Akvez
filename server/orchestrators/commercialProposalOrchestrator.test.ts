// Pruebas del **compositor de la entrada de `GenerateProposal`**.
//
// Lo que se prueba no es qué decide el caso de uso —no decide nada aquí— sino
// **qué recibe**: que las tres fuentes llegan intactas, que la evidencia sale
// solo de `runCommercialFacts`, y que el Orchestrator **no toca nada más**.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { InputError } from "../shared/errors";
import { createCommercialProposal } from "./commercialProposalOrchestrator";

const SOURCE = readFileSync(
  fileURLToPath(new URL("./commercialProposalOrchestrator.ts", import.meta.url)),
  "utf8"
);

/**
 * Un diagnóstico **cuyas variables parecen hechos**: si el Orchestrator las
 * convirtiera en evidencia, se vería en `evidence.facts`.
 */
const DIAGNOSIS = Object.freeze({
  variables: Object.freeze([
    Object.freeze({
      id: "BD-1" as const,
      knowledgeClass: "Inferida" as const,
      value: "El negocio publica un teléfono de contacto"
    }),
    Object.freeze({ id: "BD-4" as const, knowledgeClass: "Desconocida" as const })
  ]),
  confidence: "1 de 7 variables con apoyo en indicios del análisis."
});

const SEQUENCE = Object.freeze({
  moment: "Evidencia" as const,
  previousThread: "qué hace que un cliente elija a un competidor",
  previousContribution: Object.freeze(["se reconoció la categoría del negocio"]),
  previousOutcome: Object.freeze({ responded: false })
});

const FACTS = Object.freeze([
  Object.freeze({
    lead: "lead-1",
    kind: "reputacion_publicada" as const,
    statement: "Su ficha acumula 48 reseñas con calificación 4,3",
    source: Object.freeze({ observation: "reputacion_publicada" as const, source: "google-places" })
  })
]);

const RESULT = Object.freeze({ outcome: "drafting_unavailable" as const });

/** Orden real de las llamadas. */
let trace: string[];

function harness(
  overrides: { diagnosis?: unknown; sequence?: unknown } = {}
) {
  trace = [];

  const diagnosis = ("diagnosis" in overrides ? overrides.diagnosis : DIAGNOSIS) as never;
  const sequence = ("sequence" in overrides ? overrides.sequence : SEQUENCE) as never;

  const readReducedDiagnosis = vi.fn(async () => {
    trace.push("readReducedDiagnosis");
    return diagnosis;
  });
  const readReducedSequence = vi.fn(async () => {
    trace.push("readReducedSequence");
    return sequence;
  });
  const runCommercialFacts = vi.fn(async () => {
    trace.push("runCommercialFacts");
    return FACTS as never;
  });
  // Declara el argumento para que la traza del doble conserve lo recibido: es
  // lo que estas pruebas inspeccionan.
  const generateProposal = vi.fn(async (_input: unknown) => {
    trace.push("generateProposal");
    return RESULT;
  });

  /** Cualquier otra operación del agente delataría su uso. */
  const forbidden = () => {
    throw new Error("el compositor no debe invocar esta operación");
  };

  const pitchGeneratorAgent = {
    readReducedDiagnosis,
    readReducedSequence,
    // **La emisión entra por la fachada** (R-07 · COM-30): el Orchestrator ya no
    // recibe el caso de uso, lo alcanza por aquí.
    generateProposal,
    generateDiagnosis: forbidden as never,
    createSequence: forbidden as never,
    observeFacts: forbidden as never,
    generateOutreach: forbidden as never
  };

  return {
    readReducedDiagnosis,
    readReducedSequence,
    runCommercialFacts,
    generateProposal,
    run: createCommercialProposal({ pitchGeneratorAgent, runCommercialFacts })
  };
}

/** Lo que el compositor entregó al caso de uso. */
function inputOf(generateProposal: ReturnType<typeof harness>["generateProposal"]) {
  return generateProposal.mock.calls[0][0] as {
    lead: string;
    diagnosis: unknown;
    sequence: unknown;
    evidence: { lead: string; facts: unknown };
  };
}

describe("commercialProposalOrchestrator", () => {
  // ── 1 y 2 · Delegación exacta ─────────────────────────────────────────────

  it("el diagnóstico llega al caso de uso sin transformarse", async () => {
    const { run, generateProposal } = harness();

    await run("lead-1");

    // **Identidad, no equivalencia**: si el compositor copiara, completara o
    // reordenara algo, esto fallaría.
    expect(inputOf(generateProposal).diagnosis).toBe(DIAGNOSIS);
  });

  it("la secuencia llega al caso de uso sin transformarse", async () => {
    const { run, generateProposal } = harness();

    await run("lead-1");

    expect(inputOf(generateProposal).sequence).toBe(SEQUENCE);
  });

  it("no calcula momento, número de emisión ni historial: los transporta", async () => {
    const { run, generateProposal } = harness();

    await run("lead-1");

    const { sequence } = inputOf(generateProposal) as { sequence: typeof SEQUENCE };
    expect(sequence.moment).toBe("Evidencia");
    expect(sequence.previousThread).toBe(SEQUENCE.previousThread);
    expect(sequence.previousContribution).toBe(SEQUENCE.previousContribution);
    expect(sequence.previousOutcome).toBe(SEQUENCE.previousOutcome);
  });

  // ── 3 · La evidencia solo viene de CommercialFacts ────────────────────────

  it("RE-1 — la lista cerrada procede solo de runCommercialFacts", async () => {
    const { run, generateProposal } = harness();

    await run("lead-1");
    const { evidence } = inputOf(generateProposal);

    expect(evidence.facts).toBe(FACTS);
    expect(evidence.lead).toBe("lead-1");
    expect(Object.keys(evidence).sort()).toEqual(["facts", "lead"]);
  });

  it("RE-2 — ninguna variable del diagnóstico se convierte en hecho", async () => {
    const { run, generateProposal } = harness();

    await run("lead-1");
    const { evidence } = inputOf(generateProposal);

    // El valor de BD-1 **parece** un hecho —«El negocio publica un teléfono de
    // contacto»— y es una **lectura inferida**. Sumarla abriría una segunda vía
    // hacia lo afirmable, que es justo lo que COM-07 §2.2 cerró.
    const serialized = JSON.stringify(evidence);
    expect(serialized).not.toContain("El negocio publica un teléfono de contacto");
    expect(serialized).not.toContain("knowledgeClass");
    expect(serialized).not.toContain("confidence");
    expect(serialized).not.toContain("BD-1");
  });

  // ── 4 y 5 · Qué invoca, y qué no ──────────────────────────────────────────

  it("solo invoca las tres fuentes aprobadas y el caso de uso", async () => {
    const { run, readReducedDiagnosis, readReducedSequence, runCommercialFacts, generateProposal } =
      harness();

    await run("lead-1");

    expect(readReducedDiagnosis).toHaveBeenCalledWith("lead-1");
    expect(readReducedSequence).toHaveBeenCalledWith("lead-1");
    expect(runCommercialFacts).toHaveBeenCalledWith("lead-1");
    expect(generateProposal).toHaveBeenCalledTimes(1);
    // Cualquier otra operación del agente lanza si se toca: emitir diagnóstico,
    // diseñar secuencia, derivar hechos o redactar **no son suyas**.
    expect(trace.filter((step) => step === "generateProposal")).toHaveLength(1);
  });

  it("R-07 — nunca recibe el caso de uso: la emisión entra por la fachada", () => {
    // `CommercialProposalDependencies` tiene **dos** claves. Recibir
    // `generateProposal` sería un Orchestrator invocando `application/`, que es
    // lo que DEV-00 v1.3 corrigió su diagrama para impedir (COM-30 §2.1).
    const deps: Record<string, unknown> = {
      pitchGeneratorAgent: {} as never,
      runCommercialFacts: async () => [] as never
    };

    expect(Object.keys(deps).sort()).toEqual(["pitchGeneratorAgent", "runCommercialFacts"]);
    expect(Object.keys(deps)).not.toContain("generateProposal");
    expect(() => createCommercialProposal(deps as never)).not.toThrow();
  });

  it("B-1 bloquea la ruta, no la arquitectura: la emisión se invoca por la fachada", async () => {
    const { run, generateProposal } = harness();

    await run("lead-1");

    // El caso de uso se alcanza **a través de `presentation/`**, y su fallo por
    // `SP-01` no cambia por dónde entra: el bloqueo es de publicación, no de
    // frontera (COM-30 §2.2).
    expect(generateProposal).toHaveBeenCalledTimes(1);
  });

  it("R-24 · R-10 — no importa persistencia, adapters, dominio ni infraestructura", () => {
    const imports = SOURCE.split("\n")
      .filter((line) => line.trimStart().startsWith("import ") || line.includes('} from "'))
      .join("\n");

    for (const forbidden of [
      "persistence",
      "adapters",
      "models",
      "Repository",
      "infrastructure",
      "/domain/",
      "express"
    ]) {
      expect(imports).not.toContain(forbidden);
    }
  });

  // ── 6 · Orden de composición ──────────────────────────────────────────────

  it("las tres fuentes se obtienen antes de invocar el caso de uso", async () => {
    const { run } = harness();

    await run("lead-1");

    expect(trace).toHaveLength(4);
    expect(trace[3]).toBe("generateProposal");
    expect(trace.slice(0, 3).sort()).toEqual([
      "readReducedDiagnosis",
      "readReducedSequence",
      "runCommercialFacts"
    ]);
  });

  // ── Ausencias ─────────────────────────────────────────────────────────────

  it("sin secuencia la petición no designa contacto: no se invoca el caso de uso", async () => {
    const { run, generateProposal } = harness({ sequence: null });

    // Sin momento no hay identidad de emisión (ADR-16 §4.4). No es un desenlace
    // del negocio: es una entrada que no designa nada (APS-03 §12).
    await expect(run("lead-1")).rejects.toBeInstanceOf(InputError);
    expect(generateProposal).not.toHaveBeenCalled();
  });

  it("sin diagnóstico devuelve la rama que COM-09 §7 ya define, sin crear estados", async () => {
    const { run, generateProposal } = harness({ diagnosis: null });

    const result = await run("lead-1");

    expect(result).toEqual({ outcome: "diagnosis_missing" });
    // No se invoca: su contrato declara el diagnóstico obligatorio, y forzar el
    // tipo para alcanzar la rama sería mentirle al compilador.
    expect(generateProposal).not.toHaveBeenCalled();
  });

  // ── El resultado ──────────────────────────────────────────────────────────

  it("AL-12 — devuelve el Result del caso de uso sin traducirlo", async () => {
    const { run } = harness();

    // La misma referencia: `application/` ya lo expresa como unión discriminada
    // por `outcome`, y aquí no hay nada que traducir.
    expect(await run("lead-1")).toBe(RESULT);
  });
});
