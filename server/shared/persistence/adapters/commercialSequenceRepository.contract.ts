// Contrato de comportamiento reutilizable para cualquier implementación de
// `CommercialSequenceRepository`, hermano de `leadRepository.contract.ts` y
// `buyerDiagnosisRepository.contract.ts`.
//
// **Ejecuta las mismas aserciones contra el adapter que se le pase**, de modo
// que el futuro `PostgreSQLCommercialSequenceAdapter` de ADS-02 pueda
// verificarse con esta suite **sin modificarla**. Usa solo `node:assert`.
//
// QUÉ VERIFICA — la semántica que ADR-13 §10.3 asigna a **A-12**: **actualizar**,
// no versionar. Es la diferencia con A-11, y por eso esta suite es la única de
// las tres que comprueba que **una modificación no deja una copia detrás**.
//
// «Actualizar» no contradice la regla de no destrucción de §10.2: el rastro de
// los cambios lo conserva el **historial (A-8)**, que es otro activo y no
// competencia de este repositorio.
//
// QUÉ NO VERIFICA, y por qué:
//   · **Diagnósticos, estrategias, canales, `LeadStatus` y HTTP.** Pertenecen a
//     otros niveles; un contrato de repositorio que los tocase estaría probando
//     el sistema, no la frontera de persistencia.
//   · **La unicidad de `(leadId, sequence)` bajo concurrencia** — deuda F-2 en su
//     versión para A-12. No es comprobable sin motor real: en memoria y
//     monoproceso no hay escrituras simultáneas. Se declara para que la ausencia
//     sea deliberada y no un olvido.

import assert from "node:assert/strict";
import { CommercialSequenceRepository } from "../repositories/CommercialSequenceRepository";
import { CommercialSequence } from "../contracts/CommercialSequence";

function sequence(leadId: string, number: number): CommercialSequence {
  return {
    leadId,
    sequence: number,
    status: "Diseñada",
    plan: [
      { moment: "Reconocimiento", proposals: [] },
      { moment: "Evidencia", proposals: [] }
    ],
    currentMoment: "Reconocimiento"
  };
}

export async function runCommercialSequenceRepositoryContractTests(
  createRepository: () => CommercialSequenceRepository
): Promise<void> {
  // ── Persistencia inicial ──────────────────────────────────────────────────

  // save() devuelve la secuencia con un identificador asignado por persistencia
  {
    const repo = createRepository();
    const saved = await repo.save(sequence("lead-1", 1));
    assert.equal(typeof saved.id, "string");
    assert.ok(saved.id.length > 0);
    assert.equal(saved.leadId, "lead-1");
    assert.equal(saved.sequence, 1);
    assert.equal(saved.status, "Diseñada");
  }

  // findById() devuelve exactamente lo que save() devolvió
  {
    const repo = createRepository();
    const saved = await repo.save(sequence("lead-1", 1));
    const found = await repo.findById(saved.id);
    assert.deepEqual(found, saved);
  }

  // findById() devuelve null para un id desconocido
  {
    const repo = createRepository();
    assert.equal(await repo.findById("no-existe"), null);
  }

  // findByLeadId() devuelve vacío cuando el Lead no tiene secuencias.
  // **Es estado válido**: un Lead sin secuencia es correcto (DDD-01 §7.3).
  {
    const repo = createRepository();
    assert.deepEqual(await repo.findByLeadId("sin-secuencias"), []);
  }

  // CS-I5 — un Lead puede tener varias secuencias y **una nueva no borra la
  // anterior**. Se devuelven ordenadas por número de secuencia.
  {
    const repo = createRepository();
    await repo.save(sequence("lead-1", 2));
    await repo.save(sequence("lead-1", 1));

    const all = await repo.findByLeadId("lead-1");
    assert.equal(all.length, 2, "una secuencia nueva no puede borrar la anterior");
    assert.deepEqual(all.map((s) => s.sequence), [1, 2]);
  }

  // Las secuencias de un Lead no contaminan las de otro
  {
    const repo = createRepository();
    await repo.save(sequence("lead-1", 1));
    await repo.save(sequence("lead-2", 1));

    assert.equal((await repo.findByLeadId("lead-1")).length, 1);
    assert.equal((await repo.findByLeadId("lead-2"))[0].leadId, "lead-2");
  }

  // ── Actualización — ADR-13 §10.1, §10.3 ───────────────────────────────────

  // update() modifica la secuencia existente
  {
    const repo = createRepository();
    const saved = await repo.save(sequence("lead-1", 1));

    await repo.update(saved.id, {
      ...sequence("lead-1", 1),
      status: "En curso",
      currentMoment: "Evidencia"
    });

    const found = await repo.findById(saved.id);
    assert.equal(found?.status, "En curso");
    assert.equal(found?.currentMoment, "Evidencia");
  }

  // update() **conserva la identidad del agregado**: `id`, `leadId` y el número
  // de secuencia son la identidad `(Lead, nº de secuencia)` de ADR-16 §4.3, y
  // una actualización no puede alterarla.
  {
    const repo = createRepository();
    const saved = await repo.save(sequence("lead-1", 1));

    const updated = await repo.update(saved.id, {
      ...sequence("lead-1", 1),
      status: "Concluida"
    });

    assert.equal(updated.id, saved.id);
    assert.equal(updated.leadId, "lead-1");
    assert.equal(updated.sequence, 1);
  }

  // **update() NO versiona y NO duplica.** Es la aserción central de esta suite:
  // tras actualizar, sigue habiendo **una sola** secuencia. Un adapter que
  // implementase la actualización como una emisión nueva —la semántica de
  // A-11— fallaría aquí.
  {
    const repo = createRepository();
    const saved = await repo.save(sequence("lead-1", 1));
    await repo.update(saved.id, { ...sequence("lead-1", 1), status: "En curso" });
    await repo.update(saved.id, { ...sequence("lead-1", 1), status: "Concluida" });

    const all = await repo.findByLeadId("lead-1");
    assert.equal(all.length, 1, "actualizar no puede dejar una copia detrás");
    assert.equal(all[0].status, "Concluida");
  }

  // El plan se sustituye por completo al actualizar: la secuencia avanza y su
  // plan es el vigente, no una acumulación.
  {
    const repo = createRepository();
    const saved = await repo.save(sequence("lead-1", 1));

    await repo.update(saved.id, {
      ...sequence("lead-1", 1),
      plan: [{ moment: "Reconocimiento", proposals: [1] }]
    });

    const found = await repo.findById(saved.id);
    assert.equal(found?.plan.length, 1);
    assert.deepEqual(found?.plan[0].proposals, [1]);
  }

  // ── Semántica de inexistencia — R-62 ──────────────────────────────────────

  // Actualizar un id inexistente **lanza**: no es un desenlace previsto sino un
  // estado imposible, y un invariante roto se lanza, nunca viaja como valor.
  {
    const repo = createRepository();
    await assert.rejects(() => repo.update("no-existe", sequence("lead-1", 1)));
  }

  // ...y **no crea nada**. Un `update` fallido no puede dejar rastro.
  {
    const repo = createRepository();
    await assert.rejects(() => repo.update("no-existe", sequence("lead-1", 1)));
    assert.deepEqual(await repo.findByLeadId("lead-1"), []);
  }

  // ── Integridad frente al exterior ─────────────────────────────────────────

  // Mutar lo que devuelve save() no puede alterar lo conservado
  {
    const repo = createRepository();
    const saved = await repo.save(sequence("lead-1", 1));
    saved.plan.push({ moment: "Oferta", proposals: [] });
    saved.plan[0].proposals.push(99);

    const found = await repo.findById(saved.id);
    assert.equal(found?.plan.length, 2, "mutar lo devuelto no puede añadir momentos");
    assert.deepEqual(found?.plan[0].proposals, []);
  }

  // Mutar lo que devuelve findById() tampoco
  {
    const repo = createRepository();
    const saved = await repo.save(sequence("lead-1", 1));
    const found = await repo.findById(saved.id);
    found!.plan.length = 0;

    const again = await repo.findById(saved.id);
    assert.equal(again?.plan.length, 2);
  }

  // Mutar el objeto que se PASÓ a save() tampoco: la persistencia no puede
  // quedarse con una referencia que el llamador siga controlando.
  {
    const repo = createRepository();
    const input = sequence("lead-1", 1);
    const saved = await repo.save(input);
    input.plan.push({ moment: "Oferta", proposals: [] });

    const found = await repo.findById(saved.id);
    assert.equal(found?.plan.length, 2, "la persistencia no puede compartir referencia con el llamador");
  }

  console.log("[contract] CommercialSequenceRepository contract tests passed.");
}
