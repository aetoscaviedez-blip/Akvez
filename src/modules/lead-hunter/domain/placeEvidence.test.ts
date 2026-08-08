import { describe, it, expect } from "vitest";
import { toPlaceEvidence } from "./placeEvidence";

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
