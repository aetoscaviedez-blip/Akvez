// Contrato de comportamiento reutilizable para cualquier implementación de
// `ProposalRepository`, hermano de `buyerDiagnosisRepository.contract.ts`.
//
// **Ejecuta las mismas aserciones contra el adapter que se le pase**, de modo
// que el futuro adapter de ADS-02 pueda verificarse con esta suite **sin
// modificarla**. Usa solo `node:assert`: no introduce ningún framework y no
// depende del runner.
//
// QUÉ VERIFICA — la semántica de escritura que ADR-13 §10.3 asigna a **A-6**:
// **versionar**. Cada emisión añade; ninguna retira. Un adapter que implementase
// el versionado como sobrescritura —lo que §10.2 prohíbe expresamente— fallaría
// aquí, que es el punto de esta suite.
//
// Y verifica lo que **COM-20** decidió: que **la trazabilidad de cada hecho
// sobrevive al viaje completo**. Un adapter que conservase solo el enunciado
// pasaría todas las pruebas de versionado y fallaría éstas.
//
// QUÉ NO VERIFICA, y por qué: la **unicidad de `(leadId, moment, issue)`** bajo
// concurrencia (deuda **F-2**). No es comprobable sin un motor real: en memoria y
// monoproceso no hay dos escrituras simultáneas. Se declara para que la ausencia
// sea deliberada y no un olvido.

import assert from "node:assert/strict";
import { Proposal } from "../contracts/Proposal";
import { ProposalRepository } from "../repositories/ProposalRepository";
import { SequenceMoment } from "../contracts/commercialValues";

/**
 * Dos hechos de **clases distintas** y con **observaciones distintas**.
 *
 * El primero es el caso que hace discriminante la suite: `atributo_de_empresa`
 * admite dos `kind`, de modo que **un adapter que dedujese la clase desde la
 * observación se equivocaría aquí**.
 */
function facts(): Proposal["affirmableFacts"] {
  return [
    {
      kind: "contacto_publico",
      statement: "El negocio publica un teléfono de contacto",
      source: { observation: "atributo_de_empresa", source: "google-places" }
    },
    {
      kind: "reputacion_publicada",
      statement: "Su ficha acumula 48 reseñas con calificación 4,3",
      source: { observation: "reputacion_publicada", source: "google-places" }
    }
  ];
}

function emission(
  leadId: string,
  moment: SequenceMoment,
  issue: number,
  issuedAt: string
): Proposal {
  return {
    leadId,
    moment,
    issue,
    strategy: {
      objective: "responder",
      barrier: "Credibilidad",
      evidenceBase: facts(),
      focus: "un negocio que ya atiende por teléfono",
      emotion: "reconocimiento",
      // `resumedThread` **ausente a propósito**: es la que verifica que el
      // adapter conserva la ausencia (§4.6 · R-38).
      openedThread: "qué ve alguien que busca el negocio y no lo encuentra",
      relevanceElement: "el teléfono publicado es el único canal de entrada",
      channel: "Email frío",
      moment,
      expectedOutcome: "respondió"
    },
    affirmableFacts: facts(),
    text: "Texto emitido para este contacto.",
    channel: "Email frío",
    criteriaVersion: "SIN-PERFIL-DE-ESTRATEGIA",
    issuedAt
  };
}

export async function runProposalRepositoryContractTests(
  createRepository: () => ProposalRepository
): Promise<void> {
  // ── Escritura ─────────────────────────────────────────────────────────────

  // save() devuelve la emisión con un identificador asignado por persistencia,
  // **sin alterar la identidad del negocio** (ADR-05 §7, Decisión 3).
  {
    const repo = createRepository();
    const saved = await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));

    assert.equal(typeof saved.id, "string");
    assert.ok(saved.id.length > 0);
    assert.equal(saved.leadId, "lead-1");
    assert.equal(saved.moment, "Evidencia");
    assert.equal(saved.issue, 1);
  }

  // findCurrentByMoment() devuelve null cuando ese momento no ha emitido nada.
  // **Es estado válido**: un momento sin propuesta es correcto (CS-I4).
  {
    const repo = createRepository();
    assert.equal(await repo.findCurrentByMoment("lead-1", "Oferta"), null);
  }

  // ── Versionado — ADR-13 §10.3 ─────────────────────────────────────────────

  // V-1 · P-I2 — regenerar AÑADE; nunca sustituye
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));
    await repo.save(emission("lead-1", "Evidencia", 2, "2026-08-01T11:00:00.000Z"));

    const versions = await repo.findVersionsByMoment("lead-1", "Evidencia");
    assert.equal(versions.length, 2, "regenerar no puede sustituir a la emisión anterior");
    assert.deepEqual(versions.map((v) => v.issue), [1, 2]);
  }

  // V-2 — la vigente es la de mayor número de emisión, **no la última insertada**.
  // Un adapter que devolviese «la última escrita» fallaría aquí.
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", "Evidencia", 2, "2026-08-01T11:00:00.000Z"));
    await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));

    assert.equal((await repo.findCurrentByMoment("lead-1", "Evidencia"))?.issue, 2);
    assert.deepEqual(
      (await repo.findVersionsByMoment("lead-1", "Evidencia")).map((v) => v.issue),
      [1, 2]
    );
  }

  // ── Aislamiento ───────────────────────────────────────────────────────────

  // Las emisiones de un momento no contaminan las de otro momento del mismo Lead
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));
    await repo.save(emission("lead-1", "Oferta", 1, "2026-08-01T12:00:00.000Z"));

    assert.equal((await repo.findVersionsByMoment("lead-1", "Evidencia")).length, 1);
    assert.equal((await repo.findCurrentByMoment("lead-1", "Oferta"))?.moment, "Oferta");
  }

  // Ni las de un Lead con las de otro
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));
    await repo.save(emission("lead-2", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));

    assert.equal((await repo.findVersionsByMoment("lead-1", "Evidencia")).length, 1);
    assert.equal((await repo.findByLeadId("lead-2")).length, 1);
  }

  // findByLeadId devuelve TODAS las emisiones, de cualquier momento, sin recorte
  // (R-42 · R-44)
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));
    await repo.save(emission("lead-1", "Evidencia", 2, "2026-08-01T11:00:00.000Z"));
    await repo.save(emission("lead-1", "Oferta", 1, "2026-08-01T12:00:00.000Z"));

    assert.equal((await repo.findByLeadId("lead-1")).length, 3);
  }

  // ── Trazabilidad del hecho afirmable — COM-20 ─────────────────────────────

  // **Los tres campos de cada hecho sobreviven al viaje completo.** Es la
  // comprobación que RC-5 existía para exigir: un adapter que guardase solo el
  // enunciado pasaría todo lo anterior y fallaría aquí.
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));
    const current = await repo.findCurrentByMoment("lead-1", "Evidencia");

    assert.deepEqual(current?.affirmableFacts, facts(), "cada hecho vuelve íntegro");

    const [first] = current!.affirmableFacts;
    assert.equal(first.statement, "El negocio publica un teléfono de contacto");
    assert.equal(first.kind, "contacto_publico");
    assert.equal(first.source.observation, "atributo_de_empresa");
    assert.equal(first.source.source, "google-places", "la Fuente es el rastro (APS-18 §11.1)");
  }

  // **La clase no se deduce de la observación.** `atributo_de_empresa` admite dos
  // `kind`, y conservarlo es justo lo que evita interpretar el enunciado.
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));
    const current = await repo.findCurrentByMoment("lead-1", "Evidencia");
    const attribute = current?.affirmableFacts.find(
      (fact) => fact.source.observation === "atributo_de_empresa"
    );

    assert.equal(attribute?.kind, "contacto_publico");
  }

  // **El registro NO conserva `lead` por hecho, y no debe conservarlo.** Se
  // deriva de `leadId`, que sí viaja: es la demostración de COM-20 §3.1 hecha
  // comprobación.
  {
    const repo = createRepository();
    const saved = await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));

    for (const fact of saved.affirmableFacts) {
      assert.equal(
        Object.prototype.hasOwnProperty.call(fact, "lead"),
        false,
        "un hecho persistido no repite el Lead: se deriva de la identidad del agregado"
      );
    }
    assert.equal(saved.leadId, "lead-1", "y el Lead del que se deriva sí está en la fila");
  }

  // La lista de la estrategia recibe el mismo trato que la del agregado
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));
    const current = await repo.findCurrentByMoment("lead-1", "Evidencia");

    assert.deepEqual(current?.strategy.evidenceBase, facts());
  }

  // ── Conservación del contenido ────────────────────────────────────────────

  // **Nada se pierde en el viaje completo.** Contract → Model → Contract debe
  // devolver exactamente lo escrito, salvo el `id` que añade persistencia.
  {
    const repo = createRepository();
    const original = emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z");
    const saved = await repo.save(original);
    const { id, ...recovered } = saved;

    assert.ok(id.length > 0);
    assert.deepEqual(recovered, original, "el viaje completo no puede perder información");
  }

  // **La ausencia sobrevive.** Un hilo que no existe no puede recuperarse
  // presente —ni vacío, ni null—: es la distinción que R-38 protege y el punto
  // donde un mapper descuidado la destruye.
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));
    const current = await repo.findCurrentByMoment("lead-1", "Evidencia");

    assert.equal(
      Object.prototype.hasOwnProperty.call(current!.strategy, "resumedThread"),
      false,
      "un contacto sin hilo previo no puede recuperarse con la propiedad presente"
    );
    assert.equal(current?.strategy.openedThread, "qué ve alguien que busca el negocio y no lo encuentra");
  }

  // La versión del criterio y la marca temporal viajan intactas (RC-13 · V-3)
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));
    const current = await repo.findCurrentByMoment("lead-1", "Evidencia");

    assert.equal(current?.criteriaVersion, "SIN-PERFIL-DE-ESTRATEGIA");
    assert.equal(current?.issuedAt, "2026-08-01T10:00:00.000Z");
  }

  // **El almacén no es alcanzable desde fuera.** Mutar lo devuelto no puede
  // alterar lo conservado: una emisión es inmutable una vez escrita (V-1 · §10.2).
  {
    const repo = createRepository();
    const saved = await repo.save(emission("lead-1", "Evidencia", 1, "2026-08-01T10:00:00.000Z"));
    saved.affirmableFacts.push({
      kind: "presencia_web",
      statement: "hecho introducido por el llamador",
      source: { observation: "atributo_de_empresa", source: "inventada" }
    });
    saved.affirmableFacts[0].statement = "enunciado reescrito por el llamador";

    const current = await repo.findCurrentByMoment("lead-1", "Evidencia");
    assert.deepEqual(
      current?.affirmableFacts,
      facts(),
      "mutar lo devuelto no puede añadir ni reescribir un hecho conservado (RA-4 · RE-1)"
    );
  }

  console.log("[contract] ProposalRepository contract tests passed.");
}
