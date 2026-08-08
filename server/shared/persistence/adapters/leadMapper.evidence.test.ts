import { describe, it, expect } from "vitest";
import { toLeadModel, toLead } from "./leadMapper";
import { Lead } from "../contracts/Lead";

/**
 * **Persistencia de la evidencia observada — H-14.H.**
 *
 * El riesgo que vigilan estos tests es uno solo y muy concreto: que la ausencia
 * histórica se confunda con un cero observado. `undefined ≠ null ≠ 0`.
 */
const meta = { id: "l1", userId: "u1", createdAt: "2026-01-01", updatedAt: "2026-01-01" };

const lead = (over: Partial<Lead> = {}): Lead => ({
  name: "Negocio", website: "https://x.co", phone: "+57 300", googleMapsUrl: "https://maps",
  rating: 4.7, reviewCount: 125, source: "Google Maps", status: "Prospect",
  identityKey: null, identitySource: null, identityDesignation: null,
  evidenceVersion: null, photoCount: null, ...over
});

/** El ciclo real: escribir a persistencia y volver a leer. */
const ciclo = (l: Lead): Lead => toLead(toLeadModel(l, meta));

describe("leadMapper — ciclo save → load de la evidencia", () => {
  it("Caso 1 — evidencia completa se recupera idéntica", () => {
    const original = lead({ evidenceVersion: "PE-1.0", photoCount: 12, rating: 4.7, reviewCount: 125 });
    const recuperado = ciclo(original);
    expect(recuperado.photoCount).toBe(12);
    expect(recuperado.evidenceVersion).toBe("PE-1.0");
    expect(recuperado.rating).toBe(4.7);
    expect(recuperado.reviewCount).toBe(125);
  });

  it("Caso 2 — cero fotografías se recupera como 0, jamás como null", () => {
    const recuperado = ciclo(lead({ evidenceVersion: "PE-1.0", photoCount: 0 }));
    expect(recuperado.photoCount).toBe(0);
    expect(recuperado.photoCount).not.toBeNull();
  });

  it("Caso 3 — dato no observado se recupera como null, jamás como 0", () => {
    const recuperado = ciclo(lead({ evidenceVersion: "PE-1.0", photoCount: null }));
    expect(recuperado.photoCount).toBeNull();
    expect(recuperado.photoCount).not.toBe(0);
  });

  it("Caso 4 — Lead anterior a PE-1.0 sobrevive al ciclo", () => {
    const antiguo = lead({ evidenceVersion: null, photoCount: null });
    const recuperado = ciclo(antiguo);
    expect(recuperado.evidenceVersion).toBeNull();
    expect(recuperado.photoCount).toBeNull();
    // Y conserva intacto todo lo demás.
    expect(recuperado.name).toBe("Negocio");
    expect(recuperado.rating).toBe(4.7);
  });

  it("Caso 5 — la versión se conserva", () => {
    expect(ciclo(lead({ evidenceVersion: "PE-1.0", photoCount: 3 })).evidenceVersion).toBe("PE-1.0");
  });

  it("Caso 6 — el ciclo no muta el objeto original", () => {
    const original = lead({ evidenceVersion: "PE-1.0", photoCount: 5 });
    const copia = { ...original };
    ciclo(original);
    expect(original).toEqual(copia);
  });

  it("Caso 7 — save → load conserva cada recuento exacto", () => {
    for (const n of [0, 1, 7, 12, 40]) {
      expect(ciclo(lead({ evidenceVersion: "PE-1.0", photoCount: n })).photoCount).toBe(n);
    }
  });

  it("Caso 8 — ausencia histórica y cero observado NUNCA se confunden", () => {
    const historico = ciclo(lead({ evidenceVersion: null, photoCount: null }));
    const observadoCero = ciclo(lead({ evidenceVersion: "PE-1.0", photoCount: 0 }));
    expect(historico.photoCount).toBeNull();
    expect(observadoCero.photoCount).toBe(0);
    expect(historico.evidenceVersion).not.toBe(observadoCero.evidenceVersion);
  });
});

describe("no se duplica la fuente de verdad", () => {
  it("el modelo persistido no guarda rating ni website dos veces", () => {
    const model = toLeadModel(lead({ evidenceVersion: "PE-1.0", photoCount: 2 }), meta) as any;
    // `rating`, `reviewCount`, `website` y `phone` viven en sus campos de
    // siempre. `PlaceEvidence` se reconstruye al leer; no se almacena anidada.
    expect(model.placeEvidence).toBeUndefined();
    expect(model.rating).toBe(4.7);
    expect(Object.keys(model).filter((k) => k === "rating")).toHaveLength(1);
  });

  it("solo se persiste lo que no estaba ya persistido", () => {
    const model = toLeadModel(lead({ evidenceVersion: "PE-1.0", photoCount: 2 }), meta) as any;
    expect(model.photoCount).toBe(2);
    expect(model.evidenceVersion).toBe("PE-1.0");
  });
});
