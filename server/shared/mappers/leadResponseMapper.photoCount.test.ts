import { describe, it, expect } from "vitest";
import { mapToLeadResponseDTO } from "./leadResponseMapper";
import { calculateScore } from "../../modules/lead-analyzer/domain/scoring";

/** Lead analizado mínimo. Solo se varía lo que cada test observa. */
const lead = (over: Record<string, unknown> = {}) =>
  ({
    id: "l1", name: "Negocio", website: "", googleMapsUrl: "", phone: "",
    rating: 0, reviewCount: 0, hasWebsite: false, description: "", flaws: [],
    revenueLoss: "", angle: "", whyWebsiteNeeded: "", score: 50,
    source: "Google Maps", classification: "Sin sitio web",
    usedFallbackAnalysis: false, ...over
  }) as any;

describe("leadResponseMapper — transporte de photoCount (PE-1.0)", () => {
  it("publica N cuando se observaron fotografías", () => {
    expect(mapToLeadResponseDTO(lead({ photoCount: 5 }), "l1").photoCount).toBe(5);
  });

  it("publica 0 cuando se observó que no hay ninguna", () => {
    const dto = mapToLeadResponseDTO(lead({ photoCount: 0 }), "l1");
    expect(dto.photoCount).toBe(0);
    // El riesgo real: que un `|| 0` o un `if (truthy)` lo dejara fuera.
    expect("photoCount" in dto).toBe(true);
  });

  it("omite el campo cuando la evidencia no se recogió", () => {
    const dto = mapToLeadResponseDTO(lead(), "l1");
    expect(dto.photoCount).toBeUndefined();
  });

  it("conserva null explícito sin convertirlo en 0", () => {
    expect(mapToLeadResponseDTO(lead({ photoCount: null }), "l1").photoCount).toBeNull();
  });

  it("no altera ningún campo público existente", () => {
    const sin = mapToLeadResponseDTO(lead(), "l1");
    const con = mapToLeadResponseDTO(lead({ photoCount: 3 }), "l1");
    const { photoCount: _a, ...restoCon } = con as any;
    const { photoCount: _b, ...restoSin } = sin as any;
    expect(restoCon).toEqual(restoSin);
  });
});

describe("calculateScore conserva exactamente su contrato", () => {
  it("mantiene su firma de tres argumentos no nulables", () => {
    expect(calculateScore.length).toBe(3);
  });

  it("produce el mismo resultado que antes de PE-1.0", () => {
    expect(calculateScore(4.5, 80, "")).toEqual({
      score: 100,
      calculatedClassification: "Sin sitio web"
    });
    expect(calculateScore(0, 0, "https://propio.co")).toEqual({
      score: 40,
      calculatedClassification: "Sitio web deficiente"
    });
  });

  it("no conoce photoCount", () => {
    // La evidencia visual queda fuera del Score por diseño (H-14.F §10).
    expect(String(calculateScore)).not.toMatch(/photo/i);
  });
});
