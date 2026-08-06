// Reusable behavior contract for any LeadRepository implementation
// (Sprint 13, Tarea 4 — Estrategia de testing). Runs the same assertions
// against whichever adapter is passed in, so a future real database adapter
// can be verified with this exact suite, unchanged. Uses Node's built-in
// assert module only — no test framework introduced.

import assert from "node:assert/strict";
import { LeadRepository } from "../repositories/LeadRepository";
import { Lead } from "../contracts/Lead";

const sampleLead: Lead = {
  name: "Test Business",
  website: "https://example.com",
  phone: "+57 300 000 0000",
  googleMapsUrl: "https://maps.google.com/example",
  rating: 4.5,
  reviewCount: 12,
  source: "Google Maps",
  status: "Prospect",
  identityKey: "ref:google maps|PLACE-001",
  identitySource: "Google Maps",
  identityDesignation: "PLACE-001"
};

export async function runLeadRepositoryContractTests(createRepository: () => LeadRepository): Promise<void> {
  // save() assigns an id and preserves the Lead fields
  {
    const repo = createRepository();
    const saved = await repo.save(sampleLead);
    assert.equal(typeof saved.id, "string");
    assert.ok(saved.id.length > 0);
    assert.equal(saved.name, sampleLead.name);
    assert.equal(saved.status, sampleLead.status);
  }

  // findById() returns exactly what save() returned
  {
    const repo = createRepository();
    const saved = await repo.save(sampleLead);
    const found = await repo.findById(saved.id);
    assert.ok(found);
    assert.deepEqual(found, saved);
  }

  // findById() returns null for an unknown id
  {
    const repo = createRepository();
    const found = await repo.findById("does-not-exist");
    assert.equal(found, null);
  }

  // findByStatus() filters correctly
  {
    const repo = createRepository();
    await repo.save({ ...sampleLead, name: "A", status: "Prospect" });
    await repo.save({ ...sampleLead, name: "B", status: "Pitched" });
    const prospects = await repo.findByStatus("Prospect");
    assert.equal(prospects.length, 1);
    assert.equal(prospects[0].name, "A");
  }

  // updateStatus() persists the new status
  {
    const repo = createRepository();
    const saved = await repo.save(sampleLead);
    await repo.updateStatus(saved.id, "Pitched");
    const found = await repo.findById(saved.id);
    assert.equal(found?.status, "Pitched");
  }

  // updateStatus() on an unknown id does not throw
  {
    const repo = createRepository();
    await assert.doesNotReject(() => repo.updateStatus("does-not-exist", "Pitched"));
  }

  // ── Registro idempotente por identidad — ADR-13 §11.3 (I-1, I-2) ───────────

  // register() crea el Lead cuando la identidad no está presente
  {
    const repo = createRepository();
    const created = await repo.register(sampleLead);
    assert.equal(typeof created.id, "string");
    assert.equal((await repo.findAll()).length, 1);
  }

  // register() repetido con la MISMA identidad NO produce efecto: ni Lead nuevo,
  // ni id nuevo. Es la exigencia literal de ADR-13 §11.3.
  {
    const repo = createRepository();
    const first = await repo.register(sampleLead);
    const second = await repo.register(sampleLead);
    assert.equal(second.id, first.id, "un redescubrimiento no debe crear un Lead nuevo");
    assert.equal((await repo.findAll()).length, 1, "la Biblioteca no debe crecer al repetir");
  }

  // I-1: repetir una búsqueda completa no altera el conjunto, salvo por las
  // Empresas nuevas que aparezcan.
  {
    const repo = createRepository();
    const busqueda = [
      { ...sampleLead, name: "A", identityKey: "ref:google maps|P-A", identityDesignation: "P-A" },
      { ...sampleLead, name: "B", identityKey: "ref:google maps|P-B", identityDesignation: "P-B" }
    ];
    for (const lead of busqueda) await repo.register(lead);
    for (const lead of busqueda) await repo.register(lead);
    assert.equal((await repo.findAll()).length, 2, "I-1: el conjunto no puede crecer al repetir");

    await repo.register({ ...sampleLead, name: "C", identityKey: "ref:google maps|P-C", identityDesignation: "P-C" });
    assert.equal((await repo.findAll()).length, 3, "I-1: una Empresa nueva SÍ se añade");
  }

  // U-1: un redescubrimiento con datos distintos actualiza los atributos…
  // …y U-3/E-4: NUNCA actualiza la fecha de descubrimiento, ni el estadio (V-5).
  {
    const repo = createRepository();
    const first = await repo.register(sampleLead);
    await repo.updateStatus(first.id, "Pitched");

    const updated = await repo.register({
      ...sampleLead,
      website: "https://nuevo-sitio.co",
      rating: 4.9,
      reviewCount: 300
    });

    assert.equal(updated.id, first.id);
    assert.equal(updated.website, "https://nuevo-sitio.co", "U-1: el atributo debe actualizarse");
    assert.equal(updated.rating, 4.9);
    assert.equal(
      updated.status, "Pitched",
      "V-5: un redescubrimiento no puede devolver el Lead a un estadio anterior"
    );
  }

  // findByIdentity() localiza el Lead por su identidad natural
  {
    const repo = createRepository();
    const created = await repo.register(sampleLead);
    const found = await repo.findByIdentity(sampleLead.identityKey as string);
    assert.equal(found?.id, created.id);
    assert.equal(await repo.findByIdentity("ref:google maps|NO-EXISTE"), null);
  }

  // Empresa NO identificable: se registra siempre, y dos de ellas no se fusionan.
  // S-3: «ante la duda, no se fusiona»; PO-01 §8: ninguna etapa expulsa.
  {
    const repo = createRepository();
    const anonima = { ...sampleLead, identityKey: null, identitySource: null, identityDesignation: null };
    const a = await repo.register(anonima);
    const b = await repo.register(anonima);
    assert.notEqual(a.id, b.id, "S-3: sin identidad no se fusiona por aproximación");
    assert.equal((await repo.findAll()).length, 2);
  }

  // La identidad forma parte de lo que se conserva y se devuelve
  {
    const repo = createRepository();
    const created = await repo.register(sampleLead);
    assert.equal(created.identityKey, sampleLead.identityKey);
    assert.equal(created.identitySource, "Google Maps");
    assert.equal(created.identityDesignation, "PLACE-001");
  }

  // findAll() on an empty Biblioteca returns an empty set, never null
  {
    const repo = createRepository();
    const all = await repo.findAll();
    assert.deepEqual(all, []);
  }

  // findAll() returns the COMPLETE Biblioteca — every Lead, whatever its status.
  // This is the assertion that guards R-42 and R-44 at the persistence boundary:
  // if any implementation ever filters, caps or paginates findAll(), it fails here.
  {
    const repo = createRepository();
    await repo.save({ ...sampleLead, name: "A", status: "Prospect" });
    await repo.save({ ...sampleLead, name: "B", status: "Pitched" });
    await repo.save({ ...sampleLead, name: "C", status: "Stale" });

    const all = await repo.findAll();
    assert.equal(all.length, 3);
    assert.deepEqual(all.map((lead) => lead.name).sort(), ["A", "B", "C"]);
    // Every returned Lead carries the identity assigned by persistence.
    for (const lead of all) {
      assert.equal(typeof lead.id, "string");
      assert.ok(lead.id.length > 0);
    }
  }

  console.log("[contract] LeadRepository contract tests passed.");
}
