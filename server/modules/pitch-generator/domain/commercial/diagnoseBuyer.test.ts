import { describe, expect, it } from "vitest";
import { CommercialEvidence, DigitalPresence, PresenceOrigin } from "./commercialEvidence";
import { diagnoseBuyer } from "./diagnoseBuyer";

// Verifica los **criterios de aceptación de APS-19 §9** que son comprobables
// sobre la lectura, con su identificador CD-xx. No se inventa ningún criterio.

function evidenceWith(
  digitalPresence: DigitalPresence,
  presenceOrigin: PresenceOrigin = "Activo digital propio"
): CommercialEvidence {
  return { lead: "lead-1", digitalPresence, presenceOrigin, rating: 4.8, reviewCount: 250 };
}

const ALL_PRESENCES: DigitalPresence[] = [
  "Sin sitio web",
  "Sitio web deficiente",
  "Sitio web básico"
];

describe("diagnoseBuyer — criterios de APS-19 §9", () => {
  it("CD-01 — las siete variables declaran su clase", () => {
    for (const presence of ALL_PRESENCES) {
      const { variables } = diagnoseBuyer(evidenceWith(presence));
      expect(variables).toHaveLength(7);
      expect(variables.map((v) => v.id)).toEqual([
        "BD-1", "BD-2", "BD-3", "BD-4", "BD-5", "BD-6", "BD-7"
      ]);
      for (const variable of variables) {
        expect(["Observable", "Inferida", "Desconocida"]).toContain(variable.knowledgeClass);
      }
    }
  });

  it("CD-02 — ninguna variable es Observable antes del primer contacto", () => {
    for (const presence of ALL_PRESENCES) {
      const { variables } = diagnoseBuyer(evidenceWith(presence));
      expect(variables.some((v) => v.knowledgeClass === "Observable")).toBe(false);
    }
  });

  it("CD-03 — toda variable Inferida declara los indicios que la sostienen", () => {
    for (const presence of ALL_PRESENCES) {
      const inferred = diagnoseBuyer(evidenceWith(presence)).variables.filter(
        (v) => v.knowledgeClass === "Inferida"
      );
      expect(inferred.length).toBeGreaterThan(0);
      for (const variable of inferred) {
        expect(variable.indicios.length).toBeGreaterThan(0);
      }
    }
  });

  it("CD-04 — ninguna variable Desconocida tiene valor asignado", () => {
    for (const presence of ALL_PRESENCES) {
      const unknown = diagnoseBuyer(evidenceWith(presence)).variables.filter(
        (v) => v.knowledgeClass === "Desconocida"
      );
      for (const variable of unknown) {
        // Ausencia es ausencia: ni "", ni 0, ni null (R-38 · RC-10 · BD-R2).
        expect(variable).not.toHaveProperty("value");
      }
    }
  });

  it("CD-08 — el diagnóstico no produce ninguna puntuación", () => {
    const reading = diagnoseBuyer(evidenceWith("Sitio web básico"));
    for (const variable of reading.variables) {
      expect(typeof variable.value).not.toBe("number");
    }
    expect(typeof reading.confidence).toBe("string");
  });

  it("CD-12 — Consciente del Proveedor y Conversación no son inferibles", () => {
    // MC-1: solo se establecen por manifestación, que aquí no existe.
    for (const presence of ALL_PRESENCES) {
      const bd1 = diagnoseBuyer(evidenceWith(presence)).variables[0];
      expect(bd1.value).not.toBe("Consciente del Proveedor");
      expect(bd1.value).not.toBe("Conversación");
    }
  });

  it("CD-15 — todo diagnóstico declara su confianza", () => {
    for (const presence of ALL_PRESENCES) {
      expect(diagnoseBuyer(evidenceWith(presence)).confidence).not.toBe("");
    }
  });

  it("CD-16 — un diagnóstico con variables Desconocidas es válido", () => {
    // §7.2: tres inferidas y cuatro desconocidas es el resultado normal.
    const { variables } = diagnoseBuyer(evidenceWith("Sitio web deficiente"));
    expect(variables.filter((v) => v.knowledgeClass === "Inferida")).toHaveLength(3);
    expect(variables.filter((v) => v.knowledgeClass === "Desconocida")).toHaveLength(4);
  });
});

describe("diagnoseBuyer — indicios de APS-19 §5.2", () => {
  it("distingue «nunca lo intentó» de «lo intentó y quedó a medias» (§5.3)", () => {
    const never = diagnoseBuyer(evidenceWith("Sin sitio web"));
    const abandoned = diagnoseBuyer(evidenceWith("Sitio web deficiente"));

    expect(never.variables[0].value).toBe("Inconsciente");
    expect(abandoned.variables[0].value).toBe("Consciente del Problema");

    // §6.4 — el intento previo fallido es el único indicio de BD-4.
    expect(never.variables[3].knowledgeClass).toBe("Desconocida");
    expect(abandoned.variables[3].knowledgeClass).toBe("Inferida");
  });

  it("D-1 — sin activo digital propio, la presencia ajena no eleva la consciencia", () => {
    // §5.2, Inconsciente: «ausencia total de activo digital propio · presencia
    // únicamente en directorios de terceros». La calidad de esa presencia ajena
    // no cambia el estado.
    const thirdParty = diagnoseBuyer(evidenceWith("Sitio web básico", "Solo presencia en terceros"));
    const ownAsset = diagnoseBuyer(evidenceWith("Sitio web básico", "Activo digital propio"));

    expect(thirdParty.variables[0].value).toBe("Inconsciente");
    expect(ownAsset.variables[0].value).toBe("Consciente de la Solución");
  });

  it("D-1 — sin activo propio no hay intento previo fallido (BD-4)", () => {
    // No se puede abandonar lo que nunca se emprendió.
    const thirdParty = diagnoseBuyer(
      evidenceWith("Sitio web deficiente", "Solo presencia en terceros")
    );
    expect(thirdParty.variables[3].knowledgeClass).toBe("Desconocida");
  });

  it("el indicio declara el hecho observado, no la lectura (§4.1)", () => {
    const { variables } = diagnoseBuyer(evidenceWith("Sin sitio web", "Solo presencia en terceros"));
    expect(variables[0].indicios[0]).toContain("Sin sitio web");
    expect(variables[0].indicios[0]).toContain("Solo presencia en terceros");
    // La lectura no se enuncia como hecho (RE-2 · CD-05).
    expect(variables[0].indicios[0]).not.toContain("Inconsciente");
  });

  it("es determinista: misma evidencia, mismo diagnóstico", () => {
    const evidence = evidenceWith("Sitio web básico");
    expect(diagnoseBuyer(evidence)).toEqual(diagnoseBuyer(evidence));
  });
});
