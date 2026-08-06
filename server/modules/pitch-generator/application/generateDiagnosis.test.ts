import { describe, expect, it } from "vitest";
import { BuyerDiagnosis } from "../../../shared/persistence/contracts/BuyerDiagnosis";
import { BuyerDiagnosisRepository } from "../../../shared/persistence/repositories/BuyerDiagnosisRepository";
import { Identified } from "../../../shared/persistence/repositories/Identified";
import { CRITERIA_VERSION_ABSENT } from "../domain/commercial/diagnoseBuyer";
import { createGenerateDiagnosis, GenerateDiagnosisInput } from "./generateDiagnosis";

// Doble de prueba, **no un adapter**: vive en el ámbito del test y el
// Composition Root no lo conoce. Cumple la semántica append-only que el puerto
// declara (V-1), que es lo que se está verificando.
function fakeRepository(): BuyerDiagnosisRepository & { stored: BuyerDiagnosis[] } {
  const stored: BuyerDiagnosis[] = [];
  return {
    stored,
    async save(diagnosis) {
      stored.push(diagnosis);
      return { ...diagnosis, id: `d-${stored.length}` } as Identified<BuyerDiagnosis>;
    },
    async findCurrentByLeadId(leadId) {
      const versions = stored.filter((d) => d.leadId === leadId);
      const last = versions[versions.length - 1];
      return last ? ({ ...last, id: "x" } as Identified<BuyerDiagnosis>) : null;
    },
    async findVersionsByLeadId(leadId) {
      return stored
        .filter((d) => d.leadId === leadId)
        .map((d, i) => ({ ...d, id: `d-${i + 1}` }) as Identified<BuyerDiagnosis>);
    }
  };
}

const input: GenerateDiagnosisInput = {
  evidence: {
    lead: "lead-1",
    digitalPresence: "Sitio web deficiente",
    presenceOrigin: "Activo digital propio",
    rating: 4.5,
    reviewCount: 90
  },
  issuedAt: "2026-07-31T10:00:00.000Z"
};

describe("GenerateDiagnosis", () => {
  it("emite E-7 y ningún otro evento (AL-04)", async () => {
    const generate = createGenerateDiagnosis({ buyerDiagnosisRepository: fakeRepository() });
    const result = await generate(input);

    expect(result.outcome).toBe("success");
    if (result.outcome !== "success") return;
    expect(result.event.code).toBe("E-7");
    expect(result.event.diagnosis).toEqual({ lead: "lead-1", issue: 1 });
    // La emisión viaja en tipos del módulo, no en el Persistence Contract
    // (C-2 · AL-13): del repositorio solo llega `id`.
    expect(result.emission.lead).toBe("lead-1");
    expect(result.emission.variables).toHaveLength(7);
    expect(result.emission).not.toHaveProperty("criteriaVersion");
  });

  it("versiona: cada emisión añade y ninguna retira (V-1 · RC-9)", async () => {
    const repository = fakeRepository();
    const generate = createGenerateDiagnosis({ buyerDiagnosisRepository: repository });

    await generate(input);
    const second = await generate(input);

    expect(repository.stored).toHaveLength(2);
    expect(repository.stored[0].issue).toBe(1);
    expect(repository.stored[1].issue).toBe(2);
    if (second.outcome === "success") expect(second.event.diagnosis.issue).toBe(2);
  });

  it("RC-13 — declara la ausencia de Perfil de Estrategia, sin fabricar versión", async () => {
    const repository = fakeRepository();
    const generate = createGenerateDiagnosis({ buyerDiagnosisRepository: repository });
    await generate(input);

    expect(repository.stored[0].criteriaVersion).toBe(CRITERIA_VERSION_ABSENT);
    expect(repository.stored[0].criteriaVersion).not.toMatch(/^v?\d/);
  });

  it("un fallo de persistencia es rama del resultado, no excepción (C-3 · R-61)", async () => {
    const failing: BuyerDiagnosisRepository = {
      async save() { throw new Error("motor no disponible"); },
      async findCurrentByLeadId() { return null; },
      async findVersionsByLeadId() { return []; }
    };
    const generate = createGenerateDiagnosis({ buyerDiagnosisRepository: failing });

    const result = await generate(input);

    expect(result.outcome).toBe("persistence_failed");
    if (result.outcome === "persistence_failed") {
      expect(result.reason).toBe("motor no disponible");
    }
  });

  it("no altera la lectura que produjo el dominio (D-2 · RA-6)", async () => {
    const repository = fakeRepository();
    const generate = createGenerateDiagnosis({ buyerDiagnosisRepository: repository });
    await generate(input);

    const persisted = repository.stored[0];
    expect(persisted.variables).toHaveLength(7);
    expect(persisted.variables.filter((v) => v.knowledgeClass === "Desconocida")).toHaveLength(4);
  });
});
