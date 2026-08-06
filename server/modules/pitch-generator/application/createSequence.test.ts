import { describe, expect, it } from "vitest";
import { createInMemoryBuyerDiagnosisAdapter } from "../../../shared/persistence/adapters/inMemoryBuyerDiagnosisAdapter";
import { createInMemoryCommercialSequenceAdapter } from "../../../shared/persistence/adapters/inMemoryCommercialSequenceAdapter";
import { CommercialEvidence } from "../domain/commercial/commercialEvidence";
import { createGenerateDiagnosis } from "./generateDiagnosis";
import { createCreateSequence, CreateSequenceInput } from "./createSequence";

// **Sin mocks de persistencia**: se usan los adapters reales, y el diagnóstico
// previo lo emite `GenerateDiagnosis` de verdad. Es la cadena que el Composition
// Root construye.

function realChain() {
  const buyerDiagnosisRepository = createInMemoryBuyerDiagnosisAdapter();
  const commercialSequenceRepository = createInMemoryCommercialSequenceAdapter();
  return {
    buyerDiagnosisRepository,
    commercialSequenceRepository,
    generateDiagnosis: createGenerateDiagnosis({ buyerDiagnosisRepository }),
    createSequence: createCreateSequence({ buyerDiagnosisRepository, commercialSequenceRepository })
  };
}

/** Evidencia del **diagnóstico**. No lleva canales: el diagnóstico no los lee. */
function evidence(): CommercialEvidence {
  return {
    lead: "lead-seq-1",
    digitalPresence: "Sitio web deficiente",
    presenceOrigin: "Activo digital propio"
  };
}

/** Entrada de `CreateSequence`: solo lo que participa en una decisión (F-8). */
function sequenceInput(overrides: Partial<CreateSequenceInput> = {}): CreateSequenceInput {
  return { lead: "lead-seq-1", reachableChannels: ["Email frío"], ...overrides };
}

describe("CreateSequence", () => {
  it("emite E-8 y ningún otro evento (AL-04)", async () => {
    const chain = realChain();
    await chain.generateDiagnosis({ evidence: evidence(), issuedAt: "2026-07-31T10:00:00.000Z" });

    const result = await chain.createSequence(sequenceInput());

    expect(result.outcome).toBe("success");
    if (result.outcome !== "success") return;
    expect(result.event.code).toBe("E-8");
    expect(result.event.sequence).toEqual({ lead: "lead-seq-1", sequence: 1 });
  });

  it("persiste y recupera la secuencia con el adapter real", async () => {
    const chain = realChain();
    await chain.generateDiagnosis({ evidence: evidence(), issuedAt: "2026-07-31T10:00:00.000Z" });

    const result = await chain.createSequence(sequenceInput());
    if (result.outcome !== "success") throw new Error("se esperaba éxito");

    const stored = await chain.commercialSequenceRepository.findById(result.sequence.id);
    expect(stored).not.toBeNull();
    expect(stored!.status).toBe("Diseñada");
    expect(stored!.plan.map((p) => p.moment)).toEqual([
      "Reconocimiento", "Evidencia", "Demostración", "Oferta", "Seguimiento", "Reactivación"
    ]);
    expect(stored!.currentMoment).toBe("Reconocimiento");
  });

  it("la ausencia de estrategia sobrevive al viaje Contract → Model → Contract", async () => {
    const chain = realChain();
    await chain.generateDiagnosis({ evidence: evidence(), issuedAt: "2026-07-31T10:00:00.000Z" });
    const result = await chain.createSequence(sequenceInput());
    if (result.outcome !== "success") throw new Error("se esperaba éxito");

    const stored = await chain.commercialSequenceRepository.findById(result.sequence.id);
    for (const planned of stored!.plan) {
      expect(Object.prototype.hasOwnProperty.call(planned, "strategy")).toBe(false);
    }
  });

  it("CE-1 — excluye los momentos que ningún canal alcanzable transporta", async () => {
    const chain = realChain();
    await chain.generateDiagnosis({ evidence: evidence(), issuedAt: "2026-07-31T10:00:00.000Z" });

    const result = await chain.createSequence(
      sequenceInput({ reachableChannels: ["Instagram DM"] })
    );

    if (result.outcome !== "success") throw new Error("se esperaba éxito");
    expect(result.sequence.plan.map((p) => p.moment)).not.toContain("Oferta");
    expect(result.sequence.plan).toHaveLength(5);
  });

  it("CS-I5 — una secuencia nueva no borra la anterior", async () => {
    const chain = realChain();
    await chain.generateDiagnosis({ evidence: evidence(), issuedAt: "2026-07-31T10:00:00.000Z" });

    await chain.createSequence(sequenceInput());
    const second = await chain.createSequence(sequenceInput());

    if (second.outcome !== "success") throw new Error("se esperaba éxito");
    expect(second.sequence.sequence).toBe(2);

    const all = await chain.commercialSequenceRepository.findByLeadId("lead-seq-1");
    expect(all.map((s) => s.sequence)).toEqual([1, 2]);
  });

  it("sin diagnóstico vigente no hay secuencia que diseñar", async () => {
    const chain = realChain();
    // No se emite diagnóstico previo.
    const result = await chain.createSequence(sequenceInput());
    expect(result.outcome).toBe("diagnosis_missing");
  });

  it("R-2 — sin canales no se inventa ninguno: se declara la ausencia", async () => {
    const chain = realChain();
    await chain.generateDiagnosis({ evidence: evidence(), issuedAt: "2026-07-31T10:00:00.000Z" });

    const sinCanales = await chain.createSequence(sequenceInput({ reachableChannels: [] }));
    const noConsta = await chain.createSequence(sequenceInput({ reachableChannels: undefined }));

    expect(sinCanales.outcome).toBe("no_reachable_channel");
    expect(noConsta.outcome).toBe("no_reachable_channel");
  });

  it("un fallo de persistencia es rama del resultado, no excepción (C-3 · R-61)", async () => {
    const chain = realChain();
    await chain.generateDiagnosis({ evidence: evidence(), issuedAt: "2026-07-31T10:00:00.000Z" });

    const failing = createCreateSequence({
      buyerDiagnosisRepository: chain.buyerDiagnosisRepository,
      commercialSequenceRepository: {
        async save() { throw new Error("motor no disponible"); },
        async update() { throw new Error("motor no disponible"); },
        async findById() { return null; },
        async findByLeadId() { return []; }
      }
    });

    const result = await failing(sequenceInput());
    expect(result.outcome).toBe("persistence_failed");
  });
});
