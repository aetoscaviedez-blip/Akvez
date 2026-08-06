// Pruebas de la traducción compartida del hecho y de la estrategia — COM-33 §2.
//
// **Lo que se prueba aquí no es que la traducción funcione** —eso ya lo prueban
// las suites de contrato de los dos adapters— **sino la propiedad que la
// duplicación amenazaba**: que A-6 y A-12 almacenan *la misma* estrategia *de la
// misma forma*. Con dos copias de la traducción, cambiar una y no la otra era un
// cambio silencioso: ninguna prueba existente lo habría detectado, porque cada
// agregado solo se comparaba consigo mismo.

import { describe, expect, it } from "vitest";
import { CommercialSequence } from "../contracts/CommercialSequence";
import { CommercialStrategy } from "../contracts/CommercialStrategy";
import { Proposal } from "../contracts/Proposal";
import { toCommercialSequenceModel } from "./commercialSequenceMapper";
import { toCommercialStrategy, toCommercialStrategyModel } from "./commercialStrategyMapper";
import { toProposalModel } from "./proposalMapper";

/** Una estrategia con los diez contenidos de APS-18 §8.1 y ambos hilos. */
const STRATEGY: CommercialStrategy = {
  objective: "responder",
  barrier: "Credibilidad",
  evidenceBase: [
    {
      kind: "reputacion_publicada",
      statement: "el negocio acumula 214 reseñas públicas",
      source: { observation: "reputacion_publicada", source: "places:ChIJ-abc" }
    }
  ],
  focus: "la distancia entre lo que se publica y lo que se encuentra",
  emotion: "comparación suave",
  resumedThread: "qué hace que un cliente elija a un competidor",
  openedThread: "qué se pierde por no aparecer en la primera búsqueda",
  relevanceElement: "la categoría del negocio",
  channel: "Email frío",
  moment: "Evidencia",
  expectedOutcome: "una respuesta con una objeción concreta"
};

/** La misma estrategia sin ninguno de los dos hilos — primer contacto (R-38). */
const STRATEGY_SIN_HILOS: CommercialStrategy = (() => {
  const { resumedThread: _r, openedThread: _o, ...rest } = STRATEGY;
  return rest;
})();

function proposalWith(strategy: CommercialStrategy): Proposal {
  return {
    leadId: "lead-1",
    moment: "Evidencia",
    issue: 1,
    strategy,
    affirmableFacts: strategy.evidenceBase,
    text: "texto emitido",
    channel: "Email frío",
    criteriaVersion: "SIN-PERFIL-DE-ESTRATEGIA",
    issuedAt: "2026-08-04T00:00:00.000Z"
  };
}

function sequenceWith(strategy: CommercialStrategy): CommercialSequence {
  return {
    leadId: "lead-1",
    sequence: 1,
    status: "En curso",
    plan: [{ moment: "Evidencia", strategy, proposals: [1] }]
  };
}

const META = { id: "id-1", userId: "user-1", createdAt: "2026-08-04T00:00:00.000Z" };

describe("Traducción compartida de la Commercial Strategy", () => {
  // ── La propiedad que la extracción garantiza ───────────────────────────────

  it("COM-21 §5 — A-6 y A-12 almacenan la misma estrategia de forma idéntica", () => {
    const enPropuesta = toProposalModel(proposalWith(STRATEGY), META).strategy;
    const enSecuencia = toCommercialSequenceModel(sequenceWith(STRATEGY), {
      ...META,
      updatedAt: META.createdAt
    }).plan[0].strategy;

    // **Si un agregado tradujese la estrategia de otra forma, esto fallaría.**
    // Es exactamente el riesgo que dos copias de la traducción hacían posible.
    expect(enSecuencia).toEqual(enPropuesta);
  });

  it("la ausencia de los hilos se conserva igual en ambos agregados", () => {
    const enPropuesta = toProposalModel(proposalWith(STRATEGY_SIN_HILOS), META).strategy;
    const enSecuencia = toCommercialSequenceModel(sequenceWith(STRATEGY_SIN_HILOS), {
      ...META,
      updatedAt: META.createdAt
    }).plan[0].strategy;

    // **Se comparan CLAVES, no valores**: `{ resumedThread: undefined }` es igual
    // a `{}` bajo `toEqual`, y un hilo ausente pasaría a *existir* vacío sin que
    // ninguna prueba lo dijera (R-38 · COM-33 §2).
    expect(Object.keys(enPropuesta)).not.toContain("resumedThread");
    expect(Object.keys(enPropuesta)).not.toContain("openedThread");
    expect(Object.keys(enSecuencia!).sort()).toEqual(Object.keys(enPropuesta).sort());
  });

  // ── Reversibilidad del helper, por sí mismo ───────────────────────────────

  it("la estrategia sobrevive al viaje completo, con sus conjuntos cerrados", () => {
    const recuperada = toCommercialStrategy(toCommercialStrategyModel(STRATEGY));

    expect(recuperada).toEqual(STRATEGY);
    // El hecho conserva enunciado, clase y origen: sin los tres, la afirmación
    // sobrevive y el rastro que APS-18 §11.1 exige se destruye (COM-20).
    expect(recuperada.evidenceBase[0].source.source).toBe("places:ChIJ-abc");
  });

  it("no comparte estructura con la entrada: traducir copia, no aliasa", () => {
    const model = toCommercialStrategyModel(STRATEGY);

    // Si el mapper devolviera la misma referencia, una mutación posterior del
    // modelo almacenado alcanzaría a la estrategia del dominio.
    expect(model.evidenceBase).not.toBe(STRATEGY.evidenceBase);
    expect(model.evidenceBase[0]).not.toBe(STRATEGY.evidenceBase[0]);
    expect(model.evidenceBase[0].source).not.toBe(STRATEGY.evidenceBase[0].source);
  });
});
