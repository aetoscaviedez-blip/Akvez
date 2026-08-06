// Pruebas de la **proyección del diagnóstico** — COM-14.
//
// Es un cálculo puro: no hay dobles, no hay repositorio y no hay I/O. Se prueba
// **qué sobrevive al recorte y qué no puede sobrevivir**.

import { describe, expect, it } from "vitest";
import { BuyerReading } from "./diagnoseBuyer";
import { reduceDiagnosis } from "./reduceDiagnosis";

/** Una lectura con las tres clases de conocimiento representadas. */
function reading(): BuyerReading {
  return {
    variables: [
      {
        id: "BD-1",
        knowledgeClass: "Inferida",
        value: "Consciente del Problema",
        indicios: ["Activo digital iniciado y desatendido"]
      },
      {
        id: "BD-3",
        knowledgeClass: "Inferida",
        value: "Exposición previa limitada",
        indicios: ["Sin presencia digital propia"]
      },
      { id: "BD-6", knowledgeClass: "Desconocida", indicios: [] }
    ],
    confidence: "2 de 7 variables con apoyo en indicios del análisis."
  };
}

describe("reduceDiagnosis", () => {
  // ── Lo que sobrevive ──────────────────────────────────────────────────────

  it("conserva las variables con su clase de conocimiento (CD-01)", () => {
    const reduced = reduceDiagnosis(reading());

    expect(reduced.variables.map((v) => v.id)).toEqual(["BD-1", "BD-3", "BD-6"]);
    expect(reduced.variables.map((v) => v.knowledgeClass)).toEqual([
      "Inferida",
      "Inferida",
      "Desconocida"
    ]);
  });

  it("conserva el valor de las variables que lo tienen, incluido el de BD-1", () => {
    const reduced = reduceDiagnosis(reading());

    // **BD-I4** — el `CommercialState` es el valor de BD-1, y **ése es el único
    // lugar donde existe**.
    expect(reduced.variables.find((v) => v.id === "BD-1")?.value).toBe(
      "Consciente del Problema"
    );
  });

  it("conserva la confianza declarada (APS-19 §7)", () => {
    expect(reduceDiagnosis(reading()).confidence).toBe(
      "2 de 7 variables con apoyo en indicios del análisis."
    );
  });

  // ── Lo que no sobrevive ───────────────────────────────────────────────────

  it("COM-14 §4.2 — los indicios no cruzan la reducción", () => {
    const reduced = reduceDiagnosis(reading());

    // Admitirlos abriría **una segunda vía** hacia la lista cerrada, y una lista
    // con dos orígenes deja de ser cerrada de forma verificable (RE-1).
    for (const variable of reduced.variables) {
      expect(Object.prototype.hasOwnProperty.call(variable, "indicios")).toBe(false);
    }
    expect(JSON.stringify(reduced)).not.toContain("Activo digital iniciado y desatendido");
  });

  it("BD-I2 · R-38 — una variable Desconocida no recupera la propiedad `value`", () => {
    const desconocida = reduceDiagnosis(reading()).variables.find(
      (v) => v.knowledgeClass === "Desconocida"
    );

    expect(desconocida).toBeDefined();
    // Ni vacío, ni `null`, ni `undefined` asignado: **la propiedad no existe**.
    expect(Object.prototype.hasOwnProperty.call(desconocida!, "value")).toBe(false);
  });

  it("COM-14 §4.1 — `commercialState` no aparece, y no puede reponerse después", () => {
    const reduced = reduceDiagnosis(reading());

    expect(Object.keys(reduced).sort()).toEqual(["confidence", "variables"]);

    // Congelada: un consumidor no puede devolver el campo hermano que BD-I4
    // descarta, ni siquiera en caliente.
    expect(() => {
      (reduced as unknown as { commercialState: string }).commercialState =
        "Consciente del Problema";
    }).toThrow();
    expect(Object.keys(reduced)).not.toContain("commercialState");
  });

  it("solo salen los campos que COM-14 define", () => {
    for (const variable of reduceDiagnosis(reading()).variables) {
      expect(Object.keys(variable).every((key) => ["id", "knowledgeClass", "value"].includes(key)))
        .toBe(true);
    }
  });

  // ── Pureza ────────────────────────────────────────────────────────────────

  it("no muta la lectura recibida y es determinista", () => {
    const original = reading();
    const first = reduceDiagnosis(original);
    const second = reduceDiagnosis(reading());

    expect(original.variables[0].indicios).toEqual(["Activo digital iniciado y desatendido"]);
    expect(first).toEqual(second);
  });

  it("la lista de variables tampoco admite añadidos", () => {
    const reduced = reduceDiagnosis(reading());

    expect(() => {
      (reduced.variables as unknown[]).push({ id: "BD-2", knowledgeClass: "Observable" });
    }).toThrow();
    expect(reduced.variables).toHaveLength(3);
  });
});
