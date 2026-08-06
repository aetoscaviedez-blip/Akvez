import { describe, expect, it } from "vitest";
import { generateAffirmableFacts, ObservedInput } from "./affirmableFactProjection";

// Contrato de comportamiento de la proyección. Verifica la **Regla de
// Evidencia** de APS-18 §11 sobre su único punto de entrada.

function observed(overrides: Partial<ObservedInput> = {}): ObservedInput {
  return {
    lead: "lead-1",
    source: "Google Maps",
    website: "https://ejemplo.co",
    phone: "+57 300 000 0000",
    rating: 4.6,
    reviewCount: 120,
    measuredFactors: ["Presencia Web", "Reputación"],
    ...overrides
  };
}

describe("generateAffirmableFacts — solo lo Observado", () => {
  it("cada hecho declara su origen (P-I4)", () => {
    for (const fact of generateAffirmableFacts(observed())) {
      expect(fact.source.observation).toBeTruthy();
      expect(fact.source.source).toBe("Google Maps");
      expect(fact.lead).toBe("lead-1");
      expect(fact.statement.length).toBeGreaterThan(0);
    }
  });

  it("es determinista: la misma observación produce los mismos hechos", () => {
    expect(generateAffirmableFacts(observed())).toEqual(generateAffirmableFacts(observed()));
  });

  it("no existe categoría inferida: toda clase es de observación", () => {
    // RE-2 — lo inferido nunca se afirma. No hay `FactKind` que lo permita.
    const kinds = generateAffirmableFacts(observed()).map((f) => f.kind);
    for (const kind of kinds) {
      expect(["presencia_web", "contacto_publico", "reputacion_publicada", "factor_medido"])
        .toContain(kind);
    }
  });
});

describe("generateAffirmableFacts — ausencia de evidencia", () => {
  it("un teléfono ausente no genera hecho, ni afirmativo ni negativo", () => {
    const facts = generateAffirmableFacts(observed({ phone: undefined }));
    expect(facts.some((f) => f.kind === "contacto_publico")).toBe(false);
    // Y no se inventa la negación: afirmar «no tiene teléfono» supondría que la
    // fuente lo habría publicado de existir, y eso no consta.
    expect(facts.some((f) => f.statement.includes("teléfono"))).toBe(false);
  });

  it("una calificación sin volumen de reseñas no genera hecho", () => {
    const facts = generateAffirmableFacts(observed({ reviewCount: undefined }));
    expect(facts.some((f) => f.kind === "reputacion_publicada")).toBe(false);
  });

  it("sin factores medidos no hay hechos de evaluación", () => {
    const facts = generateAffirmableFacts(observed({ measuredFactors: undefined }));
    expect(facts.some((f) => f.kind === "factor_medido")).toBe(false);
  });

  it("la ausencia de sitio web SÍ es constatable y sí es hecho", () => {
    const facts = generateAffirmableFacts(observed({ website: "" }));
    const presence = facts.find((f) => f.kind === "presencia_web");
    expect(presence?.statement).toBe("No se observa sitio web propio.");
  });

  it("sin ningún dato observable, solo queda la presencia web", () => {
    const facts = generateAffirmableFacts({ lead: "l", source: "Google Maps" });
    expect(facts).toHaveLength(1);
    expect(facts[0].kind).toBe("presencia_web");
  });
});

describe("generateAffirmableFacts — lo que no puede entrar", () => {
  it("la narrativa del análisis no tiene puerta de entrada", () => {
    // COM-04 §4 — `description`, `flaws`, `angle`, `revenueLoss` y
    // `whyWebsiteNeeded` los redacta un modelo generativo, no una medición.
    // `ObservedInput` no los declara: la garantía es estructural, la verifica
    // el compilador, y esta prueba documenta la intención.
    const input = observed() as unknown as Record<string, unknown>;
    for (const narrative of [
      "description", "flaws", "angle", "revenueLoss", "whyWebsiteNeeded"
    ]) {
      expect(input).not.toHaveProperty(narrative);
    }
  });

  it("ningún enunciado convierte al proveedor en argumento", () => {
    // Válido: `source: "Google Maps"` como metadato. No válido: «Google Maps
    // demuestra que…» dentro del texto que un contacto podría decir.
    for (const fact of generateAffirmableFacts(observed())) {
      expect(fact.statement).not.toContain("Google Maps");
    }
  });

  it("ningún enunciado emite un juicio sobre el negocio (APS-19 §4.4)", () => {
    // Prohibición absoluta: nunca se afirma que un negocio teme, desconfía,
    // ignora, se resiste o está frustrado — ni se califica su presencia.
    const prohibidos = [
      "descuidad", "deficiente", "pobre", "malo", "teme", "desconfía",
      "ignora", "frustrad", "pierde", "necesita"
    ];
    for (const fact of generateAffirmableFacts(observed())) {
      for (const palabra of prohibidos) {
        expect(fact.statement.toLowerCase()).not.toContain(palabra);
      }
    }
  });

  it("ningún enunciado afirma una pérdida económica (CD-07)", () => {
    const facts = generateAffirmableFacts(observed());
    for (const fact of facts) {
      expect(fact.statement).not.toMatch(/\$|COP|pesos|ingresos|factura/i);
    }
  });
});
