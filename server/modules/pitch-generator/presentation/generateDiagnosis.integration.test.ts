import { describe, expect, it } from "vitest";
import { createInMemoryBuyerDiagnosisAdapter } from "../../../shared/persistence/adapters/inMemoryBuyerDiagnosisAdapter";
import { createGenerateDiagnosis } from "../application/generateDiagnosis";
import { createGenerateOutreachPitch } from "../application/generateOutreachPitch";
import { CommercialEvidence } from "../domain/commercial/commercialEvidence";
import { CRITERIA_VERSION_ABSENT } from "../domain/commercial/diagnoseBuyer";
import { createPitchGeneratorAgent } from "./pitchGeneratorAgent";

// Ejecución **real** del flujo `GenerateDiagnosis`, con el adapter de
// persistencia de verdad y no con dobles: recorre Agent API → caso de uso →
// Repository Interface → Database Adapter → Mapper → Model y vuelta.
//
// Se arma la misma cadena que construye el Composition Root. No se importa
// `buildApplicationDependencies` porque su contrato de salida es
// `RouteDependencies` —handlers HTTP— y el diagnóstico **todavía no tiene ruta**:
// exponerlo exigiría DTO público y mapper, que son de otra fase.

function agentWithRealPersistence() {
  const buyerDiagnosisRepository = createInMemoryBuyerDiagnosisAdapter();
  const generateDiagnosis = createGenerateDiagnosis({ buyerDiagnosisRepository });
  // El redactor no interviene en este flujo; se inyecta un puerto que fallaría
  // si alguien lo invocase, de modo que la prueba detecte cualquier acoplamiento
  // accidental entre diagnóstico y redacción.
  const generateOutreachPitch = createGenerateOutreachPitch({
    pitchDrafting: {
      async draft() {
        throw new Error("El diagnóstico no debe invocar la redacción.");
      }
    }
  });

  // `CreateSequence` no interviene en este flujo; se inyecta una implementación
  // que fallaría si alguien la invocase.
  const createSequence = async () => {
    throw new Error("El diagnóstico no debe diseñar secuencias.");
  };

  return {
    agent: createPitchGeneratorAgent({
      generateOutreachPitch,
      generateDiagnosis,
      createSequence,
      // Emitir un diagnóstico no lo lee: si alguna de las dos se invocara aquí,
      // la prueba lo diría.
      readReducedDiagnosis: async () => { throw new Error("Emitir no lee la lectura recortada."); },
      readReducedSequence: async () => { throw new Error("Emitir no lee la secuencia recortada."); },
      generateProposal: async () => { throw new Error("Emitir un diagnóstico no emite propuestas."); }
    }),
    buyerDiagnosisRepository
  };
}

const evidence: CommercialEvidence = {
  lead: "lead-integration-1",
  digitalPresence: "Sitio web deficiente",
  presenceOrigin: "Activo digital propio",
  rating: 4.2,
  reviewCount: 31
};

describe("GenerateDiagnosis — integración con persistencia real", () => {
  it("emite, persiste y recupera el diagnóstico vigente", async () => {
    const { agent, buyerDiagnosisRepository } = agentWithRealPersistence();

    const result = await agent.generateDiagnosis({
      evidence,
      issuedAt: "2026-07-31T12:00:00.000Z"
    });

    expect(result.outcome).toBe("success");
    if (result.outcome !== "success") return;
    expect(result.event.code).toBe("E-7");

    // La emisión vigente es la que acaba de escribirse (V-2).
    const current = await buyerDiagnosisRepository.findCurrentByLeadId(evidence.lead);
    expect(current).not.toBeNull();
    expect(current!.id).toBe(result.emission.id);
    expect(current!.issue).toBe(1);
    expect(current!.criteriaVersion).toBe(CRITERIA_VERSION_ABSENT);
    expect(current!.issuedAt).toBe("2026-07-31T12:00:00.000Z");
  });

  it("versiona: la segunda emisión no retira la primera (V-1 · RC-9)", async () => {
    const { agent, buyerDiagnosisRepository } = agentWithRealPersistence();

    await agent.generateDiagnosis({ evidence, issuedAt: "2026-07-31T12:00:00.000Z" });
    await agent.generateDiagnosis({ evidence, issuedAt: "2026-07-31T13:00:00.000Z" });

    const versions = await buyerDiagnosisRepository.findVersionsByLeadId(evidence.lead);
    expect(versions.map((v) => v.issue)).toEqual([1, 2]);
    expect(versions[0].issuedAt).toBe("2026-07-31T12:00:00.000Z");
    // La vigente es la más reciente, y la anterior sigue ahí.
    const current = await buyerDiagnosisRepository.findCurrentByLeadId(evidence.lead);
    expect(current!.issue).toBe(2);
  });

  it("la ausencia sobrevive al viaje Contract → Model → Contract (BD-I2 · R-38)", async () => {
    const { agent, buyerDiagnosisRepository } = agentWithRealPersistence();
    await agent.generateDiagnosis({ evidence, issuedAt: "2026-07-31T12:00:00.000Z" });

    const current = await buyerDiagnosisRepository.findCurrentByLeadId(evidence.lead);
    const unknown = current!.variables.filter((v) => v.knowledgeClass === "Desconocida");

    expect(unknown).toHaveLength(4);
    for (const variable of unknown) {
      // Ausente sigue ausente: la propiedad no existe, no vale `undefined`.
      expect(Object.prototype.hasOwnProperty.call(variable, "value")).toBe(false);
    }
  });
});

// **El diagnóstico no puede tocar el Lead ni su estadio** (P-I3 · CE-I1), y esa
// garantía no se prueba aquí a propósito: es **estructural**, no de
// comportamiento. `GenerateDiagnosisDeps` contiene un único campo
// —`BuyerDiagnosisRepository`—, de modo que el caso de uso **no tiene forma de
// alcanzar A-3**. Lo verifica el compilador en cada build; una prueba de
// ejecución solo podría confirmar que no ocurrió esta vez.
