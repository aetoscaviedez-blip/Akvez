// Pruebas de la **proyección de la secuencia** — COM-16.
//
// Cálculo puro: sin dobles, sin repositorio y sin I/O. Se prueba **qué sabe el
// contacto que toca de los anteriores, y qué no puede llegar a saber**.

import { describe, expect, it } from "vitest";
import { SequenceReading, reduceSequence } from "./reduceSequence";

/**
 * Un plan de tres momentos: dos ya usados —con estrategia y resultado— y el
 * tercero en curso.
 */
function reading(overrides: Partial<SequenceReading> = {}): SequenceReading {
  return {
    currentMoment: "Demostración",
    plan: [
      {
        moment: "Reconocimiento",
        strategy: {
          openedThread: "qué hace que un cliente elija a un competidor",
          relevanceElement: "se reconoció la categoría del negocio"
        },
        declaredOutcome: { responded: false }
      },
      {
        moment: "Evidencia",
        strategy: {
          openedThread: "qué ve alguien que busca el negocio y no lo encuentra",
          relevanceElement: "el teléfono publicado es el único canal de entrada"
        },
        declaredOutcome: { responded: true }
      },
      { moment: "Demostración" }
    ],
    ...overrides
  };
}

describe("reduceSequence", () => {
  // ── El contacto que toca ──────────────────────────────────────────────────

  it("el momento vigente es el que se proyecta (APS-18 §9.2)", () => {
    expect(reduceSequence(reading())?.moment).toBe("Demostración");
  });

  it("sin momento vigente no hay contacto que preparar", () => {
    expect(reduceSequence(reading({ currentMoment: undefined }))).toBeNull();
  });

  it("un momento vigente ajeno a su propio plan no produce lectura", () => {
    expect(reduceSequence(reading({ currentMoment: "Reactivación" }))).toBeNull();
  });

  // ── La memoria ────────────────────────────────────────────────────────────

  it("CA-08 — retoma el hilo que dejó planteado *el anterior*, no otro", () => {
    const reduced = reduceSequence(reading());

    // El de Reconocimiento existe y **no** debe ganar: el anterior es Evidencia.
    expect(reduced?.previousThread).toBe(
      "qué ve alguien que busca el negocio y no lo encuentra"
    );
  });

  it("SC-R4 — el resultado declarado es el del contacto anterior, y solo `responded`", () => {
    const reduced = reduceSequence(reading());

    expect(reduced?.previousOutcome).toEqual({ responded: true });
    expect(Object.keys(reduced!.previousOutcome!)).toEqual(["responded"]);
  });

  it("transporta lo que aportaron todos los contactos usados, en orden de plan", () => {
    // **COM-16 §8.2 sigue abierto**: transportar la memoria completa no decide
    // hasta dónde alcanza la regla, y recortarla aquí sí la cerraría.
    expect(reduceSequence(reading())?.previousContribution).toEqual([
      "se reconoció la categoría del negocio",
      "el teléfono publicado es el único canal de entrada"
    ]);
  });

  it("un momento sin estrategia no aporta nada: no se usó todavía (SC-R1)", () => {
    const reduced = reduceSequence({
      currentMoment: "Evidencia",
      plan: [{ moment: "Reconocimiento" }, { moment: "Evidencia" }]
    });

    expect(reduced?.previousContribution).toEqual([]);
    expect(Object.prototype.hasOwnProperty.call(reduced!, "previousThread")).toBe(false);
  });

  // ── El primer contacto ────────────────────────────────────────────────────

  it("el primer contacto no tiene memoria, y su ausencia es ausencia (R-38)", () => {
    const reduced = reduceSequence({
      currentMoment: "Reconocimiento",
      plan: reading().plan
    });

    expect(reduced?.previousContribution).toEqual([]);
    // Ni vacío ni `undefined` asignado: **las propiedades no existen**.
    expect(Object.prototype.hasOwnProperty.call(reduced!, "previousThread")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(reduced!, "previousOutcome")).toBe(false);
  });

  // ── Lo que no puede salir ─────────────────────────────────────────────────

  it("COM-16 §5 — no salen número de secuencia, estado, propuestas ni estrategias", () => {
    const reduced = reduceSequence(reading());

    expect(Object.keys(reduced!).sort()).toEqual([
      "moment",
      "previousContribution",
      "previousOutcome",
      "previousThread"
    ]);
    for (const forbidden of ["sequenceNumber", "sequence", "status", "proposals", "strategy"]) {
      expect(Object.keys(reduced!)).not.toContain(forbidden);
    }
  });

  it("COM-16 §5.5 — la manifestación del comprador no cruza", () => {
    const conManifestacion = reading({
      plan: [
        {
          moment: "Reconocimiento",
          strategy: { relevanceElement: "se reconoció la categoría" },
          declaredOutcome: { responded: true, manifestation: "dijo que ya tiene proveedor" } as {
            responded: boolean;
          }
        },
        { moment: "Evidencia" }
      ],
      currentMoment: "Evidencia"
    });

    const reduced = reduceSequence(conManifestacion);

    // Sería contenido enunciable ajeno a la proyección: una segunda vía hacia lo
    // afirmable (RE-1). Su efecto ya llega por el diagnóstico (CE-I3).
    expect(JSON.stringify(reduced)).not.toContain("ya tiene proveedor");
    expect(Object.keys(reduced!.previousOutcome!)).toEqual(["responded"]);
  });

  // ── Pureza ────────────────────────────────────────────────────────────────

  it("no muta la lectura recibida, es determinista y su salida está congelada", () => {
    const original = reading();
    const first = reduceSequence(original);

    expect(first).toEqual(reduceSequence(reading()));
    expect(original.plan).toHaveLength(3);
    expect(() => {
      (first as unknown as { status: string }).status = "Detenida";
    }).toThrow();
    expect(() => {
      (first!.previousContribution as unknown[]).push("aportación inventada");
    }).toThrow();
  });
});
