// Pruebas de la **lectura recortada del diagnóstico** — COM-14.
//
// **Sin mocks de persistencia en el camino principal**: se usa el adapter real y
// el diagnóstico lo emite `GenerateDiagnosis` de verdad. Es la cadena que el
// Composition Root construirá, y es lo que hace la prueba no vacía: **el
// agregado real sí lleva indicios**, de modo que si el recorte no ocurriese, se
// vería.

import { describe, expect, it } from "vitest";
import { createInMemoryBuyerDiagnosisAdapter } from "../../../shared/persistence/adapters/inMemoryBuyerDiagnosisAdapter";
import { BuyerDiagnosisRepository } from "../../../shared/persistence/repositories/BuyerDiagnosisRepository";
import { CommercialEvidence } from "../domain/commercial/commercialEvidence";
import { createGenerateDiagnosis } from "./generateDiagnosis";
import { createReducedDiagnosisReader } from "./readReducedDiagnosis";

function evidence(lead: string): CommercialEvidence {
  return { lead, digitalPresence: "Sitio web deficiente", presenceOrigin: "Activo digital propio" };
}

/** La cadena real: adapter real y emisión real. */
async function chainWithDiagnosis(lead: string) {
  const buyerDiagnosisRepository = createInMemoryBuyerDiagnosisAdapter();
  const generateDiagnosis = createGenerateDiagnosis({ buyerDiagnosisRepository });

  await generateDiagnosis({ evidence: evidence(lead), issuedAt: "2026-08-01T10:00:00.000Z" });

  return {
    buyerDiagnosisRepository,
    read: createReducedDiagnosisReader({ buyerDiagnosisRepository })
  };
}

describe("ReducedDiagnosisReader", () => {
  // ── Ausencia ──────────────────────────────────────────────────────────────

  it("un Lead sin diagnóstico vigente devuelve ausencia, no un objeto vacío", async () => {
    const read = createReducedDiagnosisReader({
      buyerDiagnosisRepository: createInMemoryBuyerDiagnosisAdapter()
    });

    // **Es estado válido**: un Lead sin diagnóstico es correcto.
    expect(await read("lead-sin-diagnostico")).toBeNull();
  });

  // ── El recorte, sobre datos reales ────────────────────────────────────────

  it("el agregado almacenado lleva indicios y la lectura no los devuelve", async () => {
    const { buyerDiagnosisRepository, read } = await chainWithDiagnosis("lead-1");

    // Premisa de la prueba: el agregado real **sí** los conserva (BD-I3).
    const stored = await buyerDiagnosisRepository.findCurrentByLeadId("lead-1");
    const withIndicios = stored!.variables.filter((v) => v.indicios.length > 0);
    expect(withIndicios.length).toBeGreaterThan(0);

    // Y la lectura recortada no: **ni la propiedad, ni su contenido**.
    //
    // Se comprueba contra el enunciado real del indicio, no contra la palabra
    // «indicios» — que aparece legítimamente dentro de la confianza declarada,
    // donde es prosa del dominio y no un hecho que pueda afirmarse.
    const reduced = await read("lead-1");
    const enunciado = withIndicios[0].indicios[0];

    expect(enunciado.length).toBeGreaterThan(0);
    expect(JSON.stringify(reduced)).not.toContain(enunciado);
    for (const variable of reduced!.variables) {
      expect(Object.prototype.hasOwnProperty.call(variable, "indicios")).toBe(false);
    }
  });

  it("nunca sale el agregado completo: ni identidad, ni emisión, ni criterio, ni fecha", async () => {
    const { read } = await chainWithDiagnosis("lead-1");

    const reduced = await read("lead-1");

    // Solo los dos campos que COM-14 define. `leadId`, `issue`, `criteriaVersion`
    // e `issuedAt` **no participan en ninguna decisión de la estrategia** (F-8).
    expect(Object.keys(reduced!).sort()).toEqual(["confidence", "variables"]);
    for (const forbidden of ["leadId", "issue", "criteriaVersion", "issuedAt", "id"]) {
      expect(Object.keys(reduced!)).not.toContain(forbidden);
    }
  });

  it("COM-14 §4.1 — `commercialState` no reaparece como campo suelto", async () => {
    const { read } = await chainWithDiagnosis("lead-1");

    const reduced = await read("lead-1");

    expect(Object.keys(reduced!)).not.toContain("commercialState");
    // **BD-I4** — el estado viaja como valor de BD-1, que es donde existe.
    const bd1 = reduced!.variables.find((v) => v.id === "BD-1");
    expect(bd1).toBeDefined();
  });

  it("las siete variables llegan con su clase declarada (CD-01)", async () => {
    const { read } = await chainWithDiagnosis("lead-1");

    const reduced = await read("lead-1");

    expect(reduced!.variables).toHaveLength(7);
    for (const variable of reduced!.variables) {
      expect(["Observable", "Inferida", "Desconocida"]).toContain(variable.knowledgeClass);
    }
    expect(reduced!.confidence.length).toBeGreaterThan(0);
  });

  // ── Qué se lee, y qué no se toca ──────────────────────────────────────────

  it("V-2 — lee la emisión vigente, no el historial, y no escribe nada", async () => {
    const touched: string[] = [];
    const stored = {
      leadId: "lead-1",
      issue: 1,
      variables: [{ id: "BD-1" as const, knowledgeClass: "Inferida" as const, value: "x", indicios: ["y"] }],
      confidence: "declarada",
      criteriaVersion: "SIN-PERFIL-DE-ESTRATEGIA",
      issuedAt: "2026-08-01T10:00:00.000Z",
      id: "row-1"
    };

    const spy: BuyerDiagnosisRepository = {
      async findCurrentByLeadId() {
        touched.push("findCurrentByLeadId");
        return stored;
      },
      async findVersionsByLeadId() {
        touched.push("findVersionsByLeadId");
        return [];
      },
      async save() {
        touched.push("save");
        throw new Error("una lectura no escribe");
      }
    };

    await createReducedDiagnosisReader({ buyerDiagnosisRepository: spy })("lead-1");

    // Una sola operación, y es la de la vigente. **No versiona A-11**: eso es
    // competencia de `GenerateDiagnosis` (E-7) y de `RegisterContact` (E-9).
    expect(touched).toEqual(["findCurrentByLeadId"]);
  });
});
