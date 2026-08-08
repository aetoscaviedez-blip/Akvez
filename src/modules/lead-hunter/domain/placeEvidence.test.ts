import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { toPlaceEvidence, describeVisualEvidence, PlaceEvidence } from "./placeEvidence";
import { deriveOpportunities } from "./opportunityDerivation";

/** Evidencia mínima; solo se varía lo que cada test observa. */
const evidencia = (over: Partial<PlaceEvidence>): PlaceEvidence => ({
  version: "PE-1.0", websiteUrl: null, phone: null, rating: null,
  reviewCount: null, photoCount: null, ...over
});

/**
 * Estos tests vigilan **la distinción de tres estados**, que es la única razón
 * por la que `PlaceEvidence` existe. Un `|| 0` introducido en el futuro los
 * rompería antes de llegar a producción.
 */
describe("toPlaceEvidence — PE-1.0", () => {
  describe("photoCount conserva los tres estados", () => {
    it("N observado se conserva", () => {
      expect(toPlaceEvidence({ photoCount: 7 }).photoCount).toBe(7);
    });

    it("0 observado se conserva como 0, no como null", () => {
      const evidencia = toPlaceEvidence({ photoCount: 0 });
      expect(evidencia.photoCount).toBe(0);
      expect(evidencia.photoCount).not.toBeNull();
    });

    it("campo ausente produce null, no 0", () => {
      const evidencia = toPlaceEvidence({});
      expect(evidencia.photoCount).toBeNull();
      expect(evidencia.photoCount).not.toBe(0);
    });

    it("null explícito se conserva como null", () => {
      expect(toPlaceEvidence({ photoCount: null }).photoCount).toBeNull();
    });
  });

  describe("rating y reviewCount no colapsan el cero", () => {
    it("rating 0 sobrevive", () => {
      expect(toPlaceEvidence({ rating: 0 }).rating).toBe(0);
    });

    it("rating ausente es null", () => {
      expect(toPlaceEvidence({}).rating).toBeNull();
    });

    it("reviewCount 0 sobrevive", () => {
      expect(toPlaceEvidence({ reviewCount: 0 }).reviewCount).toBe(0);
    });

    it("reviewCount ausente es null", () => {
      expect(toPlaceEvidence({}).reviewCount).toBeNull();
    });
  });

  describe("texto: la cadena vacía es ausencia", () => {
    it("website ausente es null", () => {
      expect(toPlaceEvidence({}).websiteUrl).toBeNull();
    });

    it("website vacío es null, nunca \"\"", () => {
      expect(toPlaceEvidence({ website: "   " }).websiteUrl).toBeNull();
    });

    it("website presente se conserva", () => {
      expect(toPlaceEvidence({ website: "https://x.co" }).websiteUrl).toBe("https://x.co");
    });

    it("phone ausente es null", () => {
      expect(toPlaceEvidence({}).phone).toBeNull();
    });
  });

  describe("invariantes", () => {
    it("la versión siempre es PE-1.0", () => {
      expect(toPlaceEvidence({}).version).toBe("PE-1.0");
      expect(toPlaceEvidence({ photoCount: 3 }).version).toBe("PE-1.0");
    });

    it("no muta la entrada", () => {
      const entrada = { website: "https://x.co", rating: 0, photoCount: 0 };
      const copia = { ...entrada };
      toPlaceEvidence(entrada);
      expect(entrada).toEqual(copia);
    });

    it("un dato desconocido nunca se vuelve afirmación positiva", () => {
      const vacia = toPlaceEvidence({});
      expect(vacia).toEqual({
        version: "PE-1.0",
        websiteUrl: null,
        phone: null,
        rating: null,
        reviewCount: null,
        photoCount: null
      });
    });

    it("es determinista", () => {
      const entrada = { website: "https://x.co", photoCount: 2 };
      expect(toPlaceEvidence(entrada)).toEqual(toPlaceEvidence(entrada));
    });
  });
});

describe("describeVisualEvidence — H-14.G.1", () => {
  it("photoCount === 0 se presenta como evidencia observada, no como ausencia", () => {
    expect(describeVisualEvidence(evidencia({ photoCount: 0 }))).toEqual({ kind: "none" });
  });

  it("photoCount > 0 conserva el número exacto", () => {
    expect(describeVisualEvidence(evidencia({ photoCount: 12 }))).toEqual({
      kind: "some",
      count: 12
    });
  });

  it("photoCount === null no produce ninguna afirmación", () => {
    expect(describeVisualEvidence(evidencia({ photoCount: null }))).toEqual({ kind: "absent" });
  });

  it("evidencia ausente por completo tampoco afirma nada", () => {
    expect(describeVisualEvidence(undefined)).toEqual({ kind: "absent" });
  });

  it("0 y null NUNCA producen el mismo resultado", () => {
    const cero = describeVisualEvidence(evidencia({ photoCount: 0 }));
    const nulo = describeVisualEvidence(evidencia({ photoCount: null }));
    expect(cero).not.toEqual(nulo);
    expect(cero.kind).toBe("none");
    expect(nulo.kind).toBe("absent");
  });

  it("una sola fotografía sigue siendo `some`, no un caso especial", () => {
    expect(describeVisualEvidence(evidencia({ photoCount: 1 }))).toEqual({ kind: "some", count: 1 });
  });

  it("es determinista", () => {
    const e = evidencia({ photoCount: 4 });
    expect(describeVisualEvidence(e)).toEqual(describeVisualEvidence(e));
  });

  it("no muta la evidencia recibida", () => {
    const e = evidencia({ photoCount: 3 });
    const copia = { ...e };
    describeVisualEvidence(e);
    expect(e).toEqual(copia);
  });
});

describe("la evidencia visual no genera oportunidades ni toca el Score", () => {
  it("photoCount no produce ninguna oportunidad", () => {
    // `deriveOpportunities` deriva solo de `website`. La evidencia visual es
    // dato de contexto, no una necesidad del negocio (H-14.G §6.1).
    const sinFotos = deriveOpportunities({ website: "https://propio.co" });
    expect(sinFotos).toEqual([]);
  });

  it("ninguna oportunidad menciona fotografía", () => {
    const todas = [
      ...deriveOpportunities({}),
      ...deriveOpportunities({ website: "https://instagram.com/x" })
    ];
    for (const op of todas) {
      const texto = `${op.title} ${op.evidence} ${op.offer}`.toLowerCase();
      expect(texto).not.toMatch(/fotograf|fotógrafo|imagen|visual/);
    }
  });

  it("el módulo de evidencia no importa nada del scoring", () => {
    const src = readFileSync(new URL("./placeEvidence.ts", import.meta.url), "utf8");
    const imports = src.match(/^import[\s\S]*?from\s+".*?";$/gm) ?? [];
    expect(imports.join("\n")).not.toMatch(/score|scoring/i);
  });
});
