// Contrato de comportamiento de **cualquier productor de Hechos Afirmables**,
// hermano de las tres suites de repositorio.
//
// **Ejecuta las mismas aserciones contra el productor que se le pase.** Hoy solo
// existe `generateAffirmableFacts`; el día que exista otro —una proyección
// distinta, o una versión que incorpore fuentes nuevas— deberá superar esta
// suite **sin que cambie una línea**. Usa solo `node:assert`.
//
// QUÉ PROTEGE — la **Regla de Evidencia** de APS-18 §11 en el único punto donde
// puede romperse sin que nada falle: **la frontera por la que un texto entra a
// ser afirmable**. Es la salvaguarda de COM-04 R-1, cuyo enunciado es que
// alimentar la lista con prosa del analizador *«vaciaría la Regla de Evidencia
// sin romper ninguna prueba»*. Esta es esa prueba.

import assert from "node:assert/strict";
import { AffirmableFact, ClosedFactList } from "./evidence";

/** Los cinco campos narrativos que un modelo generativo redacta (COM-04 §4). */
const NARRATIVE_FIELDS = [
  "description",
  "flaws",
  "angle",
  "revenueLoss",
  "whyWebsiteNeeded"
] as const;

/** Contenido que delataría prosa generativa dentro de un enunciado. */
const NARRATIVE_MARKERS = [
  "descuidad", "deficiente", "anticuad", "pobre",
  "teme", "desconfía", "ignora", "frustrad",
  "pierde", "perdiendo", "necesita", "debería", "oportunidad de mejora"
];

/** Marcas de una afirmación económica que nadie midió (CD-07 · APS-19 §6.5). */
const ECONOMIC_MARKERS = /\$|\bCOP\b|pesos|ingresos|factura|ventas perdidas/i;

export interface FactProducerUnderTest {
  /** Produce hechos a partir de una observación **con** datos. */
  withEvidence(): ClosedFactList;
  /** Produce hechos a partir de una observación **sin** datos observables. */
  withoutEvidence(): ClosedFactList;
  /** Produce hechos con narrativa del análisis presente en la entrada. */
  withNarrativeAvailable(): ClosedFactList;
}

export function runAffirmableFactsContractTests(producer: FactProducerUnderTest): void {
  // ── Trazabilidad ──────────────────────────────────────────────────────────

  // Cada hecho declara su origen. Sin él, P-I4 no es verificable después.
  {
    const facts = producer.withEvidence();
    assert.ok(facts.length > 0, "una observación con datos debe producir hechos");
    for (const fact of facts) {
      assert.ok(fact.source, "todo hecho declara su origen");
      assert.ok(fact.source.observation, "el origen declara qué observación lo produjo");
      assert.ok(fact.source.source.length > 0, "el origen declara su Fuente");
      assert.ok(fact.lead.length > 0, "todo hecho se refiere a un Lead (AG-1)");
      assert.ok(fact.statement.trim().length > 0, "todo hecho tiene enunciado");
    }
  }

  // El enunciado **nunca** contiene la Fuente: es metadato, no argumento.
  {
    for (const fact of producer.withEvidence()) {
      assert.ok(
        !fact.statement.includes(fact.source.source),
        `el enunciado no puede convertir la Fuente en argumento: "${fact.statement}"`
      );
    }
  }

  // ── Solo lo Observado ─────────────────────────────────────────────────────

  // Ninguna clase de hecho admite lo inferido (RE-2 · DDD-01 §8).
  {
    const admitidas = ["presencia_web", "contacto_publico", "reputacion_publicada", "factor_medido"];
    for (const fact of producer.withEvidence()) {
      assert.ok(
        admitidas.includes(fact.kind),
        `clase de hecho no admitida: ${fact.kind}`
      );
    }
  }

  // **Ningún campo narrativo alcanza un hecho, aunque esté disponible.**
  //
  // Se comprueban dos cosas distintas y **sobre superficies distintas**:
  //   · que ninguna **clave** narrativa aparezca en la estructura → sobre el
  //     JSON completo;
  //   · que ningún **contenido** interpretativo aparezca → **solo sobre los
  //     enunciados**, nunca sobre las claves. La clave `statement` contiene la
  //     subcadena «teme», y buscar marcadores sobre el JSON entero producía un
  //     falso positivo que ocultaba el valor de esta comprobación.
  {
    const facts = producer.withNarrativeAvailable();
    const serialized = JSON.stringify(facts);
    for (const field of NARRATIVE_FIELDS) {
      assert.ok(
        !serialized.includes(field),
        `la narrativa "${field}" no puede alcanzar un hecho afirmable`
      );
    }

    const statements = facts.map((fact) => fact.statement).join(" ").toLowerCase();
    for (const marker of NARRATIVE_MARKERS) {
      assert.ok(
        !statements.includes(marker),
        `contenido interpretativo detectado en un enunciado: "${marker}"`
      );
    }
  }

  // Ninguna afirmación económica: nadie midió esas magnitudes (CD-07).
  {
    for (const fact of producer.withNarrativeAvailable()) {
      assert.ok(
        !ECONOMIC_MARKERS.test(fact.statement),
        `afirmación económica no medida: "${fact.statement}"`
      );
    }
  }

  // Ningún hecho declara confianza: un hecho observado no tiene grados.
  {
    for (const fact of producer.withEvidence()) {
      assert.ok(
        !Object.prototype.hasOwnProperty.call(fact, "confidence"),
        "un hecho observado no lleva confianza: si la llevara, sería una inferencia"
      );
    }
  }

  // ── Ausencia ──────────────────────────────────────────────────────────────

  // Lo no observado no genera afirmación, **ni afirmativa ni negativa** (R-38).
  {
    const facts = producer.withoutEvidence();
    for (const fact of facts) {
      assert.ok(
        fact.source.observation === "atributo_de_empresa",
        "sin datos observables solo caben hechos de atributo constatable"
      );
    }
  }

  // ── Inmutabilidad tras la entrega ─────────────────────────────────────────

  // **Un hecho entregado no puede mutar.** Si pudiera, la lista contra la que el
  // punto de control verificó dejaría de ser la misma, y P-I4 sería
  // incomprobable.
  {
    const facts = producer.withEvidence();
    const original = facts[0].statement;
    try {
      (facts[0] as { statement: string }).statement = "afirmación introducida después";
    } catch {
      // En módulo estricto, escribir sobre un objeto congelado lanza. Ambas
      // formas son aceptables: lo que se exige es que el valor no cambie.
    }
    assert.equal(facts[0].statement, original, "un hecho entregado no puede reescribirse");
  }

  // La lista tampoco admite añadidos: **ninguna capa la amplía** (RA-4 · RE-1).
  {
    const facts = producer.withEvidence();
    const size = facts.length;
    try {
      (facts as AffirmableFact[]).push({
        lead: "x",
        kind: "presencia_web",
        statement: "hecho introducido por un consumidor",
        source: { observation: "atributo_de_empresa", source: "inventada" }
      });
    } catch {
      // Ídem.
    }
    assert.equal(facts.length, size, "la lista cerrada no admite añadidos");
  }

  console.log("[contract] AffirmableFacts contract tests passed.");
}
