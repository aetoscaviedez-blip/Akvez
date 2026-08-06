// Pruebas de la **lectura recortada de la secuencia** — COM-16.
//
// **Sin mocks de persistencia en el camino principal**: se usan los adapters
// reales y la secuencia la diseña `CreateSequence` de verdad, a partir de un
// diagnóstico emitido por `GenerateDiagnosis`. Es la cadena que el Composition
// Root construirá, y es lo que verifica la **compatibilidad estructural** entre
// lo almacenado y la lectura estrecha que la proyección declara.

import { describe, expect, it } from "vitest";
import { createInMemoryBuyerDiagnosisAdapter } from "../../../shared/persistence/adapters/inMemoryBuyerDiagnosisAdapter";
import { createInMemoryCommercialSequenceAdapter } from "../../../shared/persistence/adapters/inMemoryCommercialSequenceAdapter";
import { CommercialEvidence } from "../domain/commercial/commercialEvidence";
import { CommercialSequenceRepository } from "../../../shared/persistence/repositories/CommercialSequenceRepository";
import { createCreateSequence } from "./createSequence";
import { createGenerateDiagnosis } from "./generateDiagnosis";
import { createReducedSequenceReader } from "./readReducedSequence";

function evidence(lead: string): CommercialEvidence {
  return { lead, digitalPresence: "Sitio web deficiente", presenceOrigin: "Activo digital propio" };
}

/** La cadena real: diagnóstico emitido y secuencia diseñada. */
async function chainWithSequence(lead: string, sequences = 1) {
  const buyerDiagnosisRepository = createInMemoryBuyerDiagnosisAdapter();
  const commercialSequenceRepository = createInMemoryCommercialSequenceAdapter();
  const generateDiagnosis = createGenerateDiagnosis({ buyerDiagnosisRepository });
  const createSequence = createCreateSequence({
    buyerDiagnosisRepository,
    commercialSequenceRepository
  });

  await generateDiagnosis({ evidence: evidence(lead), issuedAt: "2026-08-01T10:00:00.000Z" });
  for (let i = 0; i < sequences; i += 1) {
    await createSequence({ lead, reachableChannels: ["Email frío"] });
  }

  return {
    commercialSequenceRepository,
    read: createReducedSequenceReader({ commercialSequenceRepository })
  };
}

describe("ReducedSequenceReader", () => {
  // ── Ausencia ──────────────────────────────────────────────────────────────

  it("un Lead sin secuencia devuelve ausencia, no un objeto vacío", async () => {
    const read = createReducedSequenceReader({
      commercialSequenceRepository: createInMemoryCommercialSequenceAdapter()
    });

    expect(await read("lead-sin-secuencia")).toBeNull();
  });

  // ── La lectura, sobre datos reales ────────────────────────────────────────

  it("compatibilidad estructural: lo almacenado alimenta la proyección sin traducción", async () => {
    const { read } = await chainWithSequence("lead-1");

    const reduced = await read("lead-1");

    // `CreateSequence` deja el primer momento como vigente.
    expect(reduced).not.toBeNull();
    expect(reduced!.moment).toBe("Reconocimiento");
  });

  it("una secuencia recién diseñada no tiene memoria todavía", async () => {
    const { read } = await chainWithSequence("lead-1");

    const reduced = await read("lead-1");

    // **SC-R1** — la estrategia se decide **antes de usar** cada contacto, no al
    // planificar: `CreateSequence` deja toda `strategy` ausente.
    expect(reduced!.previousContribution).toEqual([]);
    expect(Object.prototype.hasOwnProperty.call(reduced!, "previousThread")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(reduced!, "previousOutcome")).toBe(false);
  });

  it("no salen el número de secuencia, el estado, las propuestas ni el plan", async () => {
    const { read, commercialSequenceRepository } = await chainWithSequence("lead-1");

    // Premisa: lo almacenado **sí** los lleva.
    const [stored] = await commercialSequenceRepository.findByLeadId("lead-1");
    expect(stored.status).toBe("Diseñada");
    expect(stored.plan.length).toBeGreaterThan(0);

    const reduced = await read("lead-1");
    expect(Object.keys(reduced!).sort()).toEqual(["moment", "previousContribution"]);
    for (const forbidden of ["sequence", "sequenceNumber", "status", "plan", "leadId", "id"]) {
      expect(Object.keys(reduced!)).not.toContain(forbidden);
    }
  });

  // ── Qué secuencia se lee ──────────────────────────────────────────────────

  it("CS-I5 — con varias secuencias se lee la vigente: la de mayor número", async () => {
    const touched: string[] = [];
    const spy: CommercialSequenceRepository = {
      async findByLeadId() {
        touched.push("findByLeadId");
        return [
          {
            id: "row-2",
            leadId: "lead-1",
            sequence: 2,
            status: "Diseñada" as const,
            plan: [{ moment: "Oferta" as const, proposals: [] }],
            currentMoment: "Oferta" as const
          },
          {
            id: "row-1",
            leadId: "lead-1",
            sequence: 1,
            status: "Concluida" as const,
            plan: [{ moment: "Evidencia" as const, proposals: [] }],
            currentMoment: "Evidencia" as const
          }
        ];
      },
      async findById() {
        touched.push("findById");
        return null;
      },
      async save() {
        touched.push("save");
        throw new Error("una lectura no escribe");
      },
      async update() {
        touched.push("update");
        throw new Error("una lectura no escribe");
      }
    };

    const reduced = await createReducedSequenceReader({ commercialSequenceRepository: spy })(
      "lead-1"
    );

    // La segunda no borra a la primera, y la vigente es la más reciente — con
    // independencia del orden en que el motor las devuelva.
    expect(reduced?.moment).toBe("Oferta");
    // Una sola operación, y ninguna de escritura.
    expect(touched).toEqual(["findByLeadId"]);
  });

  it("una secuencia sin momento vigente no produce lectura", async () => {
    const spy: CommercialSequenceRepository = {
      async findByLeadId() {
        return [
          {
            id: "row-1",
            leadId: "lead-1",
            sequence: 1,
            status: "Concluida" as const,
            plan: [{ moment: "Evidencia" as const, proposals: [] }]
          }
        ];
      },
      async findById() {
        return null;
      },
      async save() {
        throw new Error("una lectura no escribe");
      },
      async update() {
        throw new Error("una lectura no escribe");
      }
    };

    expect(
      await createReducedSequenceReader({ commercialSequenceRepository: spy })("lead-1")
    ).toBeNull();
  });
});
