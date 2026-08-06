import { describe, expect, it } from "vitest";
import { LeadHunterAgentApi } from "../modules/lead-hunter/presentation/LeadHunterAgent";
import { LeadAnalyzerAgentApi } from "../modules/lead-analyzer/presentation/LeadAnalyzerAgent";
import { createPitchGeneratorAgent } from "../modules/pitch-generator/presentation/pitchGeneratorAgent";
import { createCommercialFacts } from "./commercialFactsOrchestrator";

// La frontera completa: Lead Hunter + Lead Analyzer → ObservedInput →
// proyección. **El Pitch Generator es el real**, con su proyección de verdad;
// los otros dos agentes se sustituyen por dobles porque lo que se verifica es
// la coordinación, no su contenido.

function hunterWith(leads: any[]): LeadHunterAgentApi {
  return {
    async execute() { throw new Error("no usado"); },
    async listLibrary() { return { leads, total: leads.length }; }
  };
}

function analyzerWith(scores: any[]): LeadAnalyzerAgentApi {
  return {
    async execute() { throw new Error("no usado"); },
    async listScores() { return { scores }; }
  };
}

function commercialAgent() {
  const fail = async () => { throw new Error("no usado"); };
  return createPitchGeneratorAgent({
    generateOutreachPitch: fail as any,
    generateDiagnosis: fail as any,
    createSequence: fail as any,
    readReducedDiagnosis: fail as any,
    readReducedSequence: fail as any,
    generateProposal: fail as any
  });
}

const lead = {
  id: "lead-1",
  name: "Panadería Central",
  website: "https://panaderia.co",
  phone: "+57 300 000 0000",
  googleMapsUrl: "https://maps.example/x",
  rating: 4.6,
  reviewCount: 120,
  source: "Google Maps",
  status: "Prospect"
};

const score = {
  leadId: "lead-1",
  score: 72,
  band: "Oportunidad Alta",
  scoreVersion: "WP-01",
  confidence: "media",
  coverage: 0.6,
  emission: 1,
  calculatedAt: "2026-07-31T10:00:00.000Z",
  breakdown: [
    { category: "presenciaWeb", label: "Presencia Web", weight: 0.3, partialScore: 80,
      contribution: 24, measuredFactors: ["Sitio web propio"], unmeasuredFactors: ["Velocidad"],
      rationale: "" }
  ]
};

function facts(leads: any[] = [lead], scores: any[] = [score]) {
  return createCommercialFacts({
    leadHunterAgent: hunterWith(leads),
    leadAnalyzerAgent: analyzerWith(scores),
    pitchGeneratorAgent: commercialAgent()
  });
}

describe("commercialFactsOrchestrator", () => {
  it("un Lead con evidencia produce hechos observables con origen", async () => {
    const result = await facts()("lead-1");

    expect(result.length).toBeGreaterThan(0);
    for (const fact of result) {
      expect(fact.lead).toBe("lead-1");
      expect(fact.source.source).toBe("Google Maps");
    }
    expect(result.map((f) => f.kind)).toEqual([
      "presencia_web", "contacto_publico", "reputacion_publicada", "factor_medido"
    ]);
  });

  it("reúne los factores medidos y nunca los no medidos (RE-3)", async () => {
    const result = await facts()("lead-1");
    const medidos = result.filter((f) => f.kind === "factor_medido");

    expect(medidos).toHaveLength(1);
    expect(medidos[0].statement).toContain("Sitio web propio");
    // `unmeasuredFactors` no entra: lo desconocido se declara, no se afirma.
    expect(result.some((f) => f.statement.includes("Velocidad"))).toBe(false);
  });

  it("un Lead ausente de la Biblioteca no produce hechos", async () => {
    expect(await facts()("no-existe")).toEqual([]);
  });

  it("un Lead sin Score produce hechos de atributo, ninguno de evaluación", async () => {
    const result = await facts([lead], [])("lead-1");
    expect(result.some((f) => f.kind === "factor_medido")).toBe(false);
    expect(result.some((f) => f.kind === "presencia_web")).toBe(true);
  });

  it("restituye la ausencia que el origen perdió (F-10 · R-38)", async () => {
    // `website` y `phone` llegan como cadena vacía cuando la fuente no los
    // aporta; propagarlas las convertiría en dato observado.
    const sinDatos = { ...lead, website: "", phone: "" };
    const result = await facts([sinDatos])("lead-1");

    expect(result.some((f) => f.kind === "contacto_publico")).toBe(false);
    const presencia = result.find((f) => f.kind === "presencia_web");
    expect(presencia?.statement).toBe("No se observa sitio web propio.");
  });

  it("sin reseñas no hay calificación que afirmar", async () => {
    const sinReputacion = { ...lead, rating: 0, reviewCount: 0 };
    const result = await facts([sinReputacion])("lead-1");

    expect(result.some((f) => f.kind === "reputacion_publicada")).toBe(false);
    expect(result.some((f) => f.statement.includes("0 reseñas"))).toBe(false);
  });

  it("ninguna narrativa del análisis alcanza los hechos", async () => {
    // El Orchestrator no lee `description`, `flaws`, `angle`, `revenueLoss` ni
    // `whyWebsiteNeeded` — y no podría: `ObservedInput` no los declara.
    const conNarrativa = {
      ...score,
      description: "Negocio con presencia digital descuidada",
      flaws: ["Sitio anticuado"],
      revenueLoss: "Pierde 30 clientes al mes"
    };
    const result = await facts([lead], [conNarrativa])("lead-1");

    const texto = JSON.stringify(result);
    expect(texto).not.toContain("descuidada");
    expect(texto).not.toContain("anticuado");
    expect(texto).not.toContain("Pierde");
  });

  it("el Orchestrator no transforma: los valores llegan tal cual", async () => {
    const result = await facts()("lead-1");
    const reputacion = result.find((f) => f.kind === "reputacion_publicada");
    expect(reputacion?.statement).toBe("Su calificación pública es 4.6 sobre 120 reseñas.");
  });
});
