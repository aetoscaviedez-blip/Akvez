import { Request, Response } from "express";
import { describe, expect, it } from "vitest";
import { createInMemoryBuyerDiagnosisAdapter } from "../shared/persistence/adapters/inMemoryBuyerDiagnosisAdapter";
import { createInMemoryCommercialSequenceAdapter } from "../shared/persistence/adapters/inMemoryCommercialSequenceAdapter";
import { createGenerateDiagnosis } from "../modules/pitch-generator/application/generateDiagnosis";
import { createCreateSequence } from "../modules/pitch-generator/application/createSequence";
import { createGenerateOutreachPitch } from "../modules/pitch-generator/application/generateOutreachPitch";
import { createPitchGeneratorAgent } from "../modules/pitch-generator/presentation/pitchGeneratorAgent";
import { createCommercialSequence } from "../orchestrators/commercialSequenceOrchestrator";
import { createSequenceHandler } from "./sequenceRoute";

// Integración HTTP de punta a punta con los adapters **reales**, igual que
// `diagnosisRoute.test.ts`. Sin dependencias de pruebas HTTP: el handler se
// invoca con dobles mínimos de `Request`/`Response`.

function fakeResponse() {
  const captured: { status: number; body: unknown } = { status: 0, body: null };
  const res = {
    status(code: number) { captured.status = code; return res; },
    json(body: unknown) { captured.body = body; return res; }
  } as unknown as Response;
  return { res, captured };
}

function request(leadId: string, body: unknown): Request {
  return { params: { leadId }, body } as unknown as Request;
}

function realChain() {
  const buyerDiagnosisRepository = createInMemoryBuyerDiagnosisAdapter();
  const commercialSequenceRepository = createInMemoryCommercialSequenceAdapter();
  const generateDiagnosis = createGenerateDiagnosis({ buyerDiagnosisRepository });
  const createSequence = createCreateSequence({
    buyerDiagnosisRepository,
    commercialSequenceRepository
  });
  const agent = createPitchGeneratorAgent({
    generateOutreachPitch: createGenerateOutreachPitch({
      pitchDrafting: {
        async draft() { throw new Error("La secuencia no debe invocar la redacción."); }
      }
    }),
    generateDiagnosis,
    createSequence,
    readReducedDiagnosis: async () => {
      throw new Error("La ruta de la secuencia no debe leer lecturas recortadas.");
    },
    readReducedSequence: async () => {
      throw new Error("La ruta de la secuencia no debe leer lecturas recortadas.");
    },
    generateProposal: async () => {
      throw new Error("La ruta de la secuencia no debe emitir propuestas.");
    }
  });

  return {
    handle: createSequenceHandler({
      runCommercialSequence: createCommercialSequence({ pitchGeneratorAgent: agent })
    }),
    generateDiagnosis,
    commercialSequenceRepository
  };
}

// F-8 cerrada: el request solo transporta lo que decide algo.
const validBody = { reachableChannels: ["Email frío"] };

const evidence = {
  lead: "lead-http-seq",
  digitalPresence: "Sitio web deficiente" as const,
  presenceOrigin: "Activo digital propio" as const
};

describe("POST /api/leads/:leadId/sequence", () => {
  it("diseña la secuencia y responde 201 con el contrato público", async () => {
    const chain = realChain();
    await chain.generateDiagnosis({ evidence, issuedAt: "2026-07-31T10:00:00.000Z" });
    const { res, captured } = fakeResponse();

    await chain.handle(request("lead-http-seq", validBody), res);

    expect(captured.status).toBe(201);
    const body = captured.body as any;
    expect(body.success).toBe(true);
    expect(body.sequence.leadId).toBe("lead-http-seq");
    expect(body.sequence.sequence).toBe(1);
    expect(body.sequence.status).toBe("Diseñada");
    expect(body.sequence.currentMoment).toBe("Reconocimiento");
    expect(body.sequence.plan.map((p: any) => p.moment)).toEqual([
      "Reconocimiento", "Evidencia", "Demostración", "Oferta", "Seguimiento", "Reactivación"
    ]);

    // Se persistió de verdad.
    const stored = await chain.commercialSequenceRepository.findById(body.sequence.id);
    expect(stored).not.toBeNull();
  });

  it("la respuesta no transporta Persistence Contract ni estrategia", async () => {
    const chain = realChain();
    await chain.generateDiagnosis({ evidence, issuedAt: "2026-07-31T10:00:00.000Z" });
    const { res, captured } = fakeResponse();

    await chain.handle(request("lead-http-seq", validBody), res);

    const body = captured.body as any;
    // El Persistence Contract usa `leadId` + `sequence` dentro del propio objeto
    // y no expone `id`; el DTO es una forma distinta y propia.
    for (const planned of body.sequence.plan) {
      expect(Object.keys(planned)).toEqual(["moment"]);
    }
    expect(JSON.stringify(body)).not.toContain("strategy");
    expect(JSON.stringify(body)).not.toContain("channel");
    expect(JSON.stringify(body)).not.toContain("userId");
    expect(JSON.stringify(body)).not.toContain("updatedAt");
  });

  it("CE-1 — con solo Instagram el plan omite la Oferta", async () => {
    const chain = realChain();
    await chain.generateDiagnosis({ evidence, issuedAt: "2026-07-31T10:00:00.000Z" });
    const { res, captured } = fakeResponse();

    await chain.handle(
      request("lead-http-seq", { ...validBody, reachableChannels: ["Instagram DM"] }),
      res
    );

    expect(captured.status).toBe(201);
    const moments = (captured.body as any).sequence.plan.map((p: any) => p.moment);
    expect(moments).not.toContain("Oferta");
    expect(moments).toHaveLength(5);
  });

  it("404 cuando el Lead no tiene diagnóstico vigente", async () => {
    const chain = realChain();
    const { res, captured } = fakeResponse();

    await chain.handle(request("sin-diagnostico", validBody), res);

    expect(captured.status).toBe(404);
    expect((captured.body as any).error.code).toBe("NOT_FOUND");
  });

  it("400 cuando no consta ningún canal alcanzable", async () => {
    const chain = realChain();
    await chain.generateDiagnosis({ evidence, issuedAt: "2026-07-31T10:00:00.000Z" });
    const { res, captured } = fakeResponse();

    await chain.handle(request("lead-http-seq", { ...validBody, reachableChannels: [] }), res);

    expect(captured.status).toBe(400);
    expect((captured.body as any).error.code).toBe("VALIDATION_ERROR");
  });

  it("400 ante un canal desconocido", async () => {
    const chain = realChain();
    const { res, captured } = fakeResponse();

    await chain.handle(
      request("lead-http-seq", { ...validBody, reachableChannels: ["WhatsApp"] }),
      res
    );

    expect(captured.status).toBe(400);
  });

  it("400 cuando falta el Lead (AG-1)", async () => {
    const chain = realChain();
    const { res, captured } = fakeResponse();

    await chain.handle(request("  ", validBody), res);

    expect(captured.status).toBe(400);
  });
});
