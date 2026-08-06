// Pruebas de la **frontera pública del módulo** — COM-24.
//
// Lo que se prueba aquí no es qué calculan las lecturas —eso ya lo prueban ellas—
// sino **qué atraviesa la frontera y qué no puede atravesarla**, y que la fachada
// **no hace nada** con lo que transporta.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { ReducedDiagnosis } from "../domain/commercial/reducedDiagnosis";
import { ReducedSequence } from "../domain/commercial/reducedSequence";
import { createPitchGeneratorAgent } from "./pitchGeneratorAgent";

const AGENT_SOURCE = readFileSync(
  fileURLToPath(new URL("./pitchGeneratorAgent.ts", import.meta.url)),
  "utf8"
);

const DIAGNOSIS: ReducedDiagnosis = Object.freeze({
  variables: Object.freeze([
    Object.freeze({ id: "BD-1" as const, knowledgeClass: "Inferida" as const, value: "Consciente del Problema" })
  ]),
  confidence: "1 de 7 variables con apoyo en indicios del análisis."
});

const SEQUENCE: ReducedSequence = Object.freeze({
  moment: "Evidencia" as const,
  previousThread: "qué hace que un cliente elija a un competidor",
  previousContribution: Object.freeze(["se reconoció la categoría del negocio"]),
  previousOutcome: Object.freeze({ responded: false })
});

/** El resultado que la emisión devuelve, para comprobar que no se traduce. */
const PROPOSAL_RESULT = Object.freeze({ outcome: "diagnosis_missing" as const });

/** Nada de lo que esta prueba no ejercita debe poder invocarse sin delatarse. */
const unused = async () => {
  throw new Error("no usado en esta prueba");
};

function agent(overrides: { diagnosis?: unknown; sequence?: unknown } = {}) {
  // `??` no sirve aquí: **`null` es un valor legítimo del doble**, no una
  // ausencia de configuración. Es la misma distinción que R-38 protege.
  const diagnosis = ("diagnosis" in overrides ? overrides.diagnosis : DIAGNOSIS) as ReducedDiagnosis | null;
  const sequence = ("sequence" in overrides ? overrides.sequence : SEQUENCE) as ReducedSequence | null;

  const readDiagnosis = vi.fn(async () => diagnosis);
  const readSequence = vi.fn(async () => sequence);
  const generateProposal = vi.fn(async (_input: unknown) => PROPOSAL_RESULT);

  return {
    readDiagnosis,
    readSequence,
    generateProposal,
    api: createPitchGeneratorAgent({
      generateOutreachPitch: unused as never,
      generateDiagnosis: unused as never,
      createSequence: unused as never,
      readReducedDiagnosis: readDiagnosis,
      readReducedSequence: readSequence,
      generateProposal
    })
  };
}

/** Todas las claves de un valor, a cualquier profundidad. */
function keysOf(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(keysOf);
  if (value === null || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, nested]) => [key, ...keysOf(nested)]);
}

describe("PitchGeneratorAgentApi · lecturas recortadas", () => {
  // ── Delegación ────────────────────────────────────────────────────────────

  it("delega el Lead sin tocarlo y devuelve exactamente lo que produjo el caso de uso", async () => {
    const { api, readDiagnosis, readSequence } = agent();

    const diagnosis = await api.readReducedDiagnosis("lead-1");
    const sequence = await api.readReducedSequence("lead-1");

    expect(readDiagnosis).toHaveBeenCalledWith("lead-1");
    expect(readSequence).toHaveBeenCalledWith("lead-1");
    // **Identidad, no equivalencia**: si la fachada copiara, transformara o
    // completara algo, esto fallaría. Es lo que la hace una fachada sin lógica.
    expect(diagnosis).toBe(DIAGNOSIS);
    expect(sequence).toBe(SEQUENCE);
  });

  it("la ausencia se transporta como ausencia, no como objeto vacío", async () => {
    const { api } = agent({ diagnosis: null, sequence: null });

    expect(await api.readReducedDiagnosis("lead-1")).toBeNull();
    expect(await api.readReducedSequence("lead-1")).toBeNull();
  });

  it("son deterministas: dos llamadas iguales delegan igual y devuelven lo mismo", async () => {
    const { api, readDiagnosis } = agent();

    const first = await api.readReducedDiagnosis("lead-1");
    const second = await api.readReducedDiagnosis("lead-1");

    expect(first).toBe(second);
    expect(readDiagnosis).toHaveBeenCalledTimes(2);
    expect(readDiagnosis.mock.calls[0]).toEqual(readDiagnosis.mock.calls[1]);
  });

  it("una lectura no invoca a la otra ni a ninguna operación de escritura", async () => {
    const { api, readDiagnosis, readSequence } = agent();

    await api.readReducedDiagnosis("lead-1");

    expect(readDiagnosis).toHaveBeenCalledTimes(1);
    expect(readSequence).not.toHaveBeenCalled();
  });

  // ── Qué atraviesa la frontera ─────────────────────────────────────────────

  it("solo sale la lectura recortada: ningún campo del agregado", async () => {
    const { api } = agent();

    const diagnosis = await api.readReducedDiagnosis("lead-1");
    const sequence = await api.readReducedSequence("lead-1");

    expect(Object.keys(diagnosis!).sort()).toEqual(["confidence", "variables"]);
    expect(Object.keys(sequence!).sort()).toEqual([
      "moment",
      "previousContribution",
      "previousOutcome",
      "previousThread"
    ]);

    // Ni identidad, ni emisión, ni criterio, ni fecha, ni estado, ni plan.
    for (const forbidden of ["leadId", "id", "issue", "criteriaVersion", "issuedAt", "status", "plan", "sequence"]) {
      expect(Object.keys(diagnosis!)).not.toContain(forbidden);
      expect(Object.keys(sequence!)).not.toContain(forbidden);
    }
  });

  it("no salen `commercialState`, `strategy`, `evidenceBase`, indicios ni manifestación", async () => {
    const { api } = agent();

    // **Se comparan claves, no subcadenas.** La confianza declarada contiene
    // legítimamente la palabra «indicios» —es prosa del dominio, no un hecho
    // afirmable—, y buscarla en el JSON delataría un falso positivo.
    const keys = new Set([
      ...keysOf(await api.readReducedDiagnosis("lead-1")),
      ...keysOf(await api.readReducedSequence("lead-1"))
    ]);

    for (const forbidden of [
      "commercialState",
      "strategy",
      "evidenceBase",
      "indicios",
      "manifestation",
      "affirmableFacts"
    ]) {
      expect([...keys]).not.toContain(forbidden);
    }
  });

  // ── Qué no puede atravesarla ──────────────────────────────────────────────

  it("R-23 — la fachada no importa persistencia, adapters ni infraestructura", () => {
    // Es una propiedad de los **imports**, y se comprueba sobre ellos: si alguno
    // apareciera, un repositorio podría cruzar la frontera aunque hoy no cruce.
    const imports = AGENT_SOURCE.split("\n")
      .filter((line) => line.trimStart().startsWith("import ") || line.includes('} from "'))
      .join("\n");

    for (const forbidden of ["persistence", "adapters", "models", "Repository", "infrastructure"]) {
      expect(imports).not.toContain(forbidden);
    }
  });

  it("la fachada no declara ninguna operación que devuelva un agregado", () => {
    const { api } = agent();

    // Siete operaciones. **La superficie del módulo es cerrada**: si apareciera
    // una octava sin decidirse, esta prueba lo diría.
    expect(Object.keys(api).sort()).toEqual([
      "createSequence",
      "generateDiagnosis",
      "generateOutreach",
      "generateProposal",
      "observeFacts",
      "readReducedDiagnosis",
      "readReducedSequence"
    ]);
  });

  // ── La emisión, expuesta y no publicada ───────────────────────────────────

  it("R-07 — la emisión se alcanza por la fachada y se delega sin envolver", async () => {
    const { api, generateProposal } = agent();
    const input = { lead: "lead-1" } as never;

    const result = await api.generateProposal(input);

    // **Misma referencia en los dos sentidos**: entra el input tal cual y sale
    // el Result tal cual. Si la fachada envolviera o tradujera, fallaría.
    expect(generateProposal).toHaveBeenCalledWith(input);
    expect(generateProposal.mock.calls[0][0]).toBe(input);
    expect(result).toBe(PROPOSAL_RESULT);
  });
});

// ── Cableado por nombre — COM-33 §3 ─────────────────────────────────────────
//
// **La factoría recibía seis parámetros posicionales.** Cuatro de los seis son
// `(input) => Promise<Result>` y los dobles de prueba se escriben como `any` o
// `never`: **intercambiar dos compilaba sin error**, y el defecto solo aparecía
// al ejecutar la operación equivocada. Estas dos pruebas fijan lo contrario.

/** Seis dobles **distinguibles**: cada uno delata cuál se invocó. */
function tracers() {
  return {
    generateOutreachPitch: vi.fn(async () => ({
      outcome: "success" as const,
      pitch: { marca: "generateOutreachPitch" } as never
    })),
    generateDiagnosis: vi.fn(async () => "generateDiagnosis" as never),
    createSequence: vi.fn(async () => "createSequence" as never),
    readReducedDiagnosis: vi.fn(async () => "readReducedDiagnosis" as never),
    readReducedSequence: vi.fn(async () => "readReducedSequence" as never),
    generateProposal: vi.fn(async () => "generateProposal" as never)
  };
}

describe("PitchGeneratorAgentApi · cableado de dependencias", () => {
  it("cada dependencia alcanza su propia operación, y ninguna otra", async () => {
    const deps = tracers();
    const api = createPitchGeneratorAgent(deps);

    // **Cada operación debe devolver la marca de SU dependencia.** Si dos
    // estuvieran cruzadas —lo que el orden posicional permitía—, la marca
    // devuelta sería la de la otra y la comparación fallaría.
    const outreach = await api.generateOutreach({
      designer: {},
      lead: {},
      channel: "Email frío"
    });
    expect(outreach).toEqual({ kind: "success", pitch: { marca: "generateOutreachPitch" } });

    expect(await api.generateDiagnosis({} as never)).toBe("generateDiagnosis");
    expect(await api.createSequence({} as never)).toBe("createSequence");
    expect(await api.readReducedDiagnosis("lead-1")).toBe("readReducedDiagnosis" as never);
    expect(await api.readReducedSequence("lead-1")).toBe("readReducedSequence" as never);
    expect(await api.generateProposal({} as never)).toBe("generateProposal" as never);

    // Y ninguna se invocó de más: una operación que llamase a dos dependencias
    // pasaría las comparaciones anteriores y fallaría aquí.
    for (const doble of Object.values(deps)) {
      expect(doble).toHaveBeenCalledTimes(1);
    }
  });

  it("el orden en que se declaran las dependencias no significa nada", async () => {
    const deps = tracers();

    // Las mismas seis funciones, declaradas en **orden inverso**. Con parámetros
    // posicionales esto construía un agente distinto —y silenciosamente roto—;
    // con nombres debe construir exactamente el mismo.
    const invertido = createPitchGeneratorAgent({
      generateProposal: deps.generateProposal,
      readReducedSequence: deps.readReducedSequence,
      readReducedDiagnosis: deps.readReducedDiagnosis,
      createSequence: deps.createSequence,
      generateDiagnosis: deps.generateDiagnosis,
      generateOutreachPitch: deps.generateOutreachPitch
    });

    expect(await invertido.generateDiagnosis({} as never)).toBe("generateDiagnosis");
    expect(await invertido.createSequence({} as never)).toBe("createSequence");
    expect(await invertido.readReducedDiagnosis("lead-1")).toBe("readReducedDiagnosis" as never);
    expect(await invertido.readReducedSequence("lead-1")).toBe("readReducedSequence" as never);
    expect(await invertido.generateProposal({} as never)).toBe("generateProposal" as never);
  });
});
