import { Request, Response } from "express";
import { describe, expect, it } from "vitest";
import { createInMemoryBuyerDiagnosisAdapter } from "../shared/persistence/adapters/inMemoryBuyerDiagnosisAdapter";
import { createGenerateDiagnosis } from "../modules/pitch-generator/application/generateDiagnosis";
import { createGenerateOutreachPitch } from "../modules/pitch-generator/application/generateOutreachPitch";
import { createPitchGeneratorAgent } from "../modules/pitch-generator/presentation/pitchGeneratorAgent";
import { createCommercialDiagnosis } from "../orchestrators/commercialDiagnosisOrchestrator";
import { createDiagnosisHandler } from "./diagnosisRoute";

// Integración HTTP de punta a punta: ruta → Orchestrator → Agent API → caso de
// uso → Repository Port → Adapter → Mapper → Model, con el adapter **real**.
//
// No se introduce ninguna dependencia de pruebas HTTP: se invoca el handler con
// dobles mínimos de `Request`/`Response`, que es lo que el handler realmente
// consume. Añadir un framework para esto sería una dependencia sin justificación
// técnica (DEV-00, restricciones de dependencias).

function fakeResponse() {
  const captured: { status: number; body: unknown } = { status: 0, body: null };
  const res = {
    status(code: number) {
      captured.status = code;
      return res;
    },
    json(body: unknown) {
      captured.body = body;
      return res;
    }
  } as unknown as Response;
  return { res, captured };
}

function request(leadId: string, body: unknown): Request {
  return { params: { leadId }, body } as unknown as Request;
}

function handlerWithRealChain() {
  const buyerDiagnosisRepository = createInMemoryBuyerDiagnosisAdapter();
  const generateDiagnosis = createGenerateDiagnosis({ buyerDiagnosisRepository });
  const generateOutreachPitch = createGenerateOutreachPitch({
    pitchDrafting: {
      async draft() {
        throw new Error("El diagnóstico no debe invocar la redacción.");
      }
    }
  });
  const pitchGeneratorAgent = createPitchGeneratorAgent({
    generateOutreachPitch,
    generateDiagnosis,
    createSequence: async () => {
      throw new Error("La ruta del diagnóstico no debe diseñar secuencias.");
    },
    readReducedDiagnosis: async () => {
      throw new Error("La ruta del diagnóstico no debe leer lecturas recortadas.");
    },
    readReducedSequence: async () => {
      throw new Error("La ruta del diagnóstico no debe leer lecturas recortadas.");
    },
    generateProposal: async () => {
      throw new Error("La ruta del diagnóstico no debe emitir propuestas.");
    }
  });
  const runCommercialDiagnosis = createCommercialDiagnosis({ pitchGeneratorAgent });

  return { handle: createDiagnosisHandler({ runCommercialDiagnosis }), buyerDiagnosisRepository };
}

const validBody = {
  digitalPresence: "Sitio web deficiente",
  presenceOrigin: "Activo digital propio",
  rating: 4.2,
  reviewCount: 31
};

describe("POST /api/leads/:leadId/diagnosis", () => {
  it("emite el diagnóstico y responde 201 con el contrato público", async () => {
    const { handle, buyerDiagnosisRepository } = handlerWithRealChain();
    const { res, captured } = fakeResponse();

    await handle(request("lead-http-1", validBody), res);

    expect(captured.status).toBe(201);
    const body = captured.body as any;
    expect(body.success).toBe(true);
    expect(body.diagnosis.leadId).toBe("lead-http-1");
    expect(body.diagnosis.issue).toBe(1);
    expect(body.diagnosis.variables).toHaveLength(7);

    // Se persistió de verdad.
    const stored = await buyerDiagnosisRepository.findCurrentByLeadId("lead-http-1");
    expect(stored).not.toBeNull();
    expect(stored!.id).toBe(body.diagnosis.id);
  });

  it("no filtra `criteriaVersion` al contrato público", async () => {
    const { handle } = handlerWithRealChain();
    const { res, captured } = fakeResponse();

    await handle(request("lead-http-2", validBody), res);

    const body = captured.body as any;
    expect(body.diagnosis).not.toHaveProperty("criteriaVersion");
    expect(JSON.stringify(body)).not.toContain("SIN-PERFIL-DE-ESTRATEGIA");
  });

  it("omite `value` en las variables Desconocidas (BD-I2 · CD-04 · R-38)", async () => {
    const { handle } = handlerWithRealChain();
    const { res, captured } = fakeResponse();

    await handle(request("lead-http-3", validBody), res);

    const body = captured.body as any;
    const unknown = body.diagnosis.variables.filter((v: any) => v.knowledgeClass === "Desconocida");
    expect(unknown).toHaveLength(4);
    for (const variable of unknown) {
      expect(Object.prototype.hasOwnProperty.call(variable, "value")).toBe(false);
    }
  });

  it("rechaza con 400 un vocabulario que el dominio no acepta", async () => {
    const { handle } = handlerWithRealChain();
    const { res, captured } = fakeResponse();

    await handle(request("lead-http-4", { ...validBody, presenceOrigin: "Otra cosa" }), res);

    expect(captured.status).toBe(400);
    expect((captured.body as any).error.code).toBe("VALIDATION_ERROR");
  });

  it("rechaza con 400 cuando falta el Lead (AG-1)", async () => {
    const { handle } = handlerWithRealChain();
    const { res, captured } = fakeResponse();

    await handle(request("  ", validBody), res);

    expect(captured.status).toBe(400);
  });

  it("traduce el fallo de persistencia a 500 sin exponer el motivo técnico", async () => {
    const generateDiagnosis = createGenerateDiagnosis({
      buyerDiagnosisRepository: {
        async save() { throw new Error("cadena de conexión inválida: postgres://secreto"); },
        async findCurrentByLeadId() { return null; },
        async findVersionsByLeadId() { return []; }
      }
    });
    const agent = createPitchGeneratorAgent({
      generateOutreachPitch: createGenerateOutreachPitch({
        pitchDrafting: { async draft() { throw new Error("no"); } }
      }),
      generateDiagnosis,
      createSequence: async () => {
        throw new Error("La ruta del diagnóstico no debe diseñar secuencias.");
      },
      readReducedDiagnosis: async () => {
        throw new Error("La ruta del diagnóstico no debe leer lecturas recortadas.");
      },
      readReducedSequence: async () => {
        throw new Error("La ruta del diagnóstico no debe leer lecturas recortadas.");
      },
      generateProposal: async () => {
        throw new Error("La ruta del diagnóstico no debe emitir propuestas.");
      }
    });
    const handle = createDiagnosisHandler({
      runCommercialDiagnosis: createCommercialDiagnosis({ pitchGeneratorAgent: agent })
    });
    const { res, captured } = fakeResponse();

    await handle(request("lead-http-5", validBody), res);

    expect(captured.status).toBe(500);
    const body = captured.body as any;
    expect(body.error.code).toBe("INTERNAL_ERROR");
    // UI-9 · O-6 · APS-10 — ni la traza ni el detalle del motor viajan al cliente.
    expect(JSON.stringify(body)).not.toContain("postgres://");
  });
});
