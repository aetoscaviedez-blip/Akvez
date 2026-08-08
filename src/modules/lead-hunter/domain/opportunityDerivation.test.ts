import { describe, it, expect } from "vitest";
import { deriveOpportunities, EvidenceBasedOpportunity } from "./opportunityDerivation";

/**
 * Estos tests protegen **integridad**, no comportamiento visual.
 *
 * El bloque «no afirma lo que no puede demostrar» es el más importante del
 * fichero: vigila que nunca reaparezcan las afirmaciones que la auditoría H-14
 * encontró en `flaws` —velocidad, SEO, CTA, conversión, reservas— por la puerta
 * de atrás de un cambio de copy.
 */
describe("deriveOpportunities", () => {
  describe("negocio sin sitio web", () => {
    it("genera la oportunidad de presencia web", () => {
      const [op, ...resto] = deriveOpportunities({});
      expect(op.id).toBe("WEB_PRESENCE");
      expect(resto).toHaveLength(0);
    });

    it("trata la cadena vacía como ausencia", () => {
      expect(deriveOpportunities({ website: "   " })[0].id).toBe("WEB_PRESENCE");
    });

    it("trata el literal «Sin sitio web» como ausencia", () => {
      expect(deriveOpportunities({ website: "Sin sitio web" })[0].id).toBe("WEB_PRESENCE");
    });

    it("declara el dato observado, no un defecto", () => {
      const [op] = deriveOpportunities({});
      expect(op.evidence).toContain("no registra");
      // Nunca convierte la ausencia en un juicio sobre un sitio inexistente.
      expect(op.evidence.toLowerCase()).not.toContain("mala");
      expect(op.evidence.toLowerCase()).not.toContain("deficiente");
    });
  });

  describe("negocio con sitio en plataforma de terceros", () => {
    it("genera la oportunidad de dominio propio", () => {
      const [op] = deriveOpportunities({ website: "https://www.instagram.com/cafecentral" });
      expect(op.id).toBe("OWNED_DOMAIN");
      expect(op.evidence).toContain("instagram.com");
    });

    it("reconoce constructores además de redes sociales", () => {
      expect(deriveOpportunities({ website: "https://cafe.wixsite.com/inicio" })[0].id).toBe(
        "OWNED_DOMAIN"
      );
    });

    it("no genera la oportunidad de presencia web", () => {
      const ids = deriveOpportunities({ website: "https://facebook.com/negocio" }).map((o) => o.id);
      expect(ids).not.toContain("WEB_PRESENCE");
    });
  });

  describe("negocio con dominio propio", () => {
    it("no genera ninguna oportunidad", () => {
      expect(deriveOpportunities({ website: "https://cafecentral.co" })).toEqual([]);
    });

    it("no inventa una oportunidad para llenar la interfaz", () => {
      // Sin inspeccionar el sitio no hay nada demostrable. El vacío es la
      // respuesta correcta, no un fallo.
      expect(deriveOpportunities({ website: "https://www.panaderiasol.com.co" })).toHaveLength(0);
    });
  });

  describe("no afirma lo que AKVEZ no puede demostrar", () => {
    // Se comparan como **palabras completas**: «cta» sin límites casaría dentro
    // de «contactarlo», y el guardián bloquearía copy legítimo.
    const PROHIBIDO = [
      "seo",
      "lento",
      "lenta",
      "velocidad",
      "carga",
      "convierte",
      "conversión",
      "cta",
      "ctas",
      "llamado a la acción",
      "reserva",
      "reservas",
      "móvil",
      "responsive",
      "fotografía",
      "imágenes",
      "pierde",
      "%"
    ];

    const todas: EvidenceBasedOpportunity[] = [
      ...deriveOpportunities({}),
      ...deriveOpportunities({ website: "https://instagram.com/x" }),
      ...deriveOpportunities({ website: "https://propio.co" })
    ];

    it("ninguna oportunidad emitida contiene una afirmación no verificable", () => {
      for (const op of todas) {
        const texto = `${op.title} ${op.evidence} ${op.offer}`.toLowerCase();
        for (const termino of PROHIBIDO) {
          const comoPalabra = new RegExp(`(^|[^\\p{L}])${termino}($|[^\\p{L}])`, "u");
          expect(
            comoPalabra.test(texto),
            `«${termino}» aparece como palabra en la oportunidad ${op.id}: "${texto}"`
          ).toBe(false);
        }
      }
    });

    it("toda oportunidad declara evidencia y regla", () => {
      for (const op of todas) {
        expect(op.evidence.trim()).not.toBe("");
        expect(op.rule.trim()).not.toBe("");
      }
    });
  });

  describe("determinismo", () => {
    it("la misma entrada produce el mismo resultado", () => {
      const entrada = { website: "https://instagram.com/negocio" };
      expect(deriveOpportunities(entrada)).toEqual(deriveOpportunities(entrada));
    });

    it("datos incompletos no rompen la derivación", () => {
      expect(() => deriveOpportunities({ website: undefined })).not.toThrow();
    });
  });
});
