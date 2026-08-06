// Contrato de comportamiento reutilizable para cualquier implementación de
// `BuyerDiagnosisRepository`, hermano de `leadRepository.contract.ts`.
//
// **Ejecuta las mismas aserciones contra el adapter que se le pase**, de modo
// que el futuro `PostgreSQLBuyerDiagnosisAdapter` de ADS-02 pueda verificarse
// con esta suite **sin modificarla**. Usa solo `node:assert`: no introduce
// ningún framework y no depende del runner.
//
// QUÉ VERIFICA — la semántica de escritura que ADR-13 §10.3 asigna a **A-11**:
// **versionar**. Cada emisión añade; ninguna retira. Un adapter que implementase
// el versionado como sobrescritura —lo que §10.2 prohíbe expresamente— fallaría
// aquí, que es el punto de esta suite.
//
// QUÉ NO VERIFICA, y por qué: la **unicidad de `(leadId, issue)`** bajo
// concurrencia (deuda **F-2**). No es comprobable sin un motor real: en memoria y
// monoproceso no hay dos escrituras simultáneas. Cuando exista el adapter de
// PostgreSQL, su restricción compuesta debe probarse **contra el motor**, no
// aquí. Se declara para que la ausencia sea deliberada y no un olvido.

import assert from "node:assert/strict";
import { BuyerDiagnosisRepository } from "../repositories/BuyerDiagnosisRepository";
import { BuyerDiagnosis } from "../contracts/BuyerDiagnosis";

function emission(leadId: string, issue: number, issuedAt: string): BuyerDiagnosis {
  return {
    leadId,
    issue,
    variables: [
      {
        id: "BD-1",
        knowledgeClass: "Inferida",
        value: "Consciente del Problema",
        indicios: ["Activo digital iniciado y desatendido"]
      },
      // Variable Desconocida **sin `value`**: es la que verifica que el adapter
      // conserva la ausencia (BD-I2 · CD-04 · R-38).
      { id: "BD-6", knowledgeClass: "Desconocida", indicios: [] }
    ],
    confidence: "1 de 7 variables con apoyo en indicios del análisis.",
    criteriaVersion: "SIN-PERFIL-DE-ESTRATEGIA",
    issuedAt
  };
}

export async function runBuyerDiagnosisRepositoryContractTests(
  createRepository: () => BuyerDiagnosisRepository
): Promise<void> {
  // save() devuelve la emisión con un identificador asignado por persistencia
  {
    const repo = createRepository();
    const saved = await repo.save(emission("lead-1", 1, "2026-07-31T10:00:00.000Z"));
    assert.equal(typeof saved.id, "string");
    assert.ok(saved.id.length > 0);
    assert.equal(saved.leadId, "lead-1");
    assert.equal(saved.issue, 1);
  }

  // findCurrentByLeadId() devuelve null cuando el Lead no tiene diagnóstico.
  // **Es estado válido**: un Lead sin diagnóstico es correcto (DDD-01 §7.3).
  {
    const repo = createRepository();
    assert.equal(await repo.findCurrentByLeadId("sin-diagnostico"), null);
  }

  // ── Versionado — ADR-13 §10.3 ─────────────────────────────────────────────

  // V-1 — una emisión nueva AÑADE y no retira la anterior
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", 1, "2026-07-31T10:00:00.000Z"));
    await repo.save(emission("lead-1", 2, "2026-07-31T11:00:00.000Z"));

    const versions = await repo.findVersionsByLeadId("lead-1");
    assert.equal(versions.length, 2, "una emisión nueva no puede sustituir a la anterior");
    assert.deepEqual(versions.map((v) => v.issue), [1, 2]);
  }

  // V-2 — la vigente es la más reciente
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", 1, "2026-07-31T10:00:00.000Z"));
    await repo.save(emission("lead-1", 2, "2026-07-31T11:00:00.000Z"));

    const current = await repo.findCurrentByLeadId("lead-1");
    assert.ok(current);
    assert.equal(current.issue, 2);
  }

  // La vigente no depende del ORDEN DE INSERCIÓN, sino del número de emisión.
  // Un adapter que devolviese «la última insertada» pasaría la prueba anterior
  // y fallaría ésta.
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", 2, "2026-07-31T11:00:00.000Z"));
    await repo.save(emission("lead-1", 1, "2026-07-31T10:00:00.000Z"));

    const current = await repo.findCurrentByLeadId("lead-1");
    assert.equal(current?.issue, 2);
  }

  // El historial se devuelve de la más antigua a la más reciente, con
  // independencia del orden en que se escribieron.
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", 2, "2026-07-31T11:00:00.000Z"));
    await repo.save(emission("lead-1", 1, "2026-07-31T10:00:00.000Z"));

    const versions = await repo.findVersionsByLeadId("lead-1");
    assert.deepEqual(versions.map((v) => v.issue), [1, 2]);
  }

  // ── Aislamiento por Lead ──────────────────────────────────────────────────

  // Las emisiones de un Lead no contaminan las de otro
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", 1, "2026-07-31T10:00:00.000Z"));
    await repo.save(emission("lead-2", 1, "2026-07-31T10:00:00.000Z"));

    assert.equal((await repo.findVersionsByLeadId("lead-1")).length, 1);
    assert.equal((await repo.findCurrentByLeadId("lead-2"))?.leadId, "lead-2");
  }

  // ── Conservación del contenido ────────────────────────────────────────────

  // **La ausencia sobrevive al viaje completo.** Una variable `Desconocida` no
  // puede recuperarse con `value` presente —ni vacío, ni null—: es la distinción
  // que R-38 protege y el punto donde un mapper descuidado la destruye.
  {
    const repo = createRepository();
    const saved = await repo.save(emission("lead-1", 1, "2026-07-31T10:00:00.000Z"));
    const unknownVariable = saved.variables.find((v) => v.knowledgeClass === "Desconocida");

    assert.ok(unknownVariable);
    assert.equal(
      Object.prototype.hasOwnProperty.call(unknownVariable, "value"),
      false,
      "una variable Desconocida no puede tener la propiedad `value`"
    );
  }

  // Los indicios de una variable Inferida se conservan íntegros (BD-I3 · CD-03)
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", 1, "2026-07-31T10:00:00.000Z"));
    const current = await repo.findCurrentByLeadId("lead-1");
    const inferred = current?.variables.find((v) => v.knowledgeClass === "Inferida");

    assert.deepEqual(inferred?.indicios, ["Activo digital iniciado y desatendido"]);
  }

  // La versión del criterio y la marca temporal viajan intactas (RC-13 · V-3)
  {
    const repo = createRepository();
    await repo.save(emission("lead-1", 1, "2026-07-31T10:00:00.000Z"));
    const current = await repo.findCurrentByLeadId("lead-1");

    assert.equal(current?.criteriaVersion, "SIN-PERFIL-DE-ESTRATEGIA");
    assert.equal(current?.issuedAt, "2026-07-31T10:00:00.000Z");
  }

  // **El almacén no es alcanzable desde fuera.** Mutar lo devuelto no puede
  // alterar lo conservado: una emisión es inmutable una vez escrita (RC-9).
  {
    const repo = createRepository();
    const saved = await repo.save(emission("lead-1", 1, "2026-07-31T10:00:00.000Z"));
    saved.variables[0].indicios.push("indicio inventado por el llamador");

    const current = await repo.findCurrentByLeadId("lead-1");
    assert.deepEqual(
      current?.variables[0].indicios,
      ["Activo digital iniciado y desatendido"],
      "mutar el objeto devuelto no puede alterar la emisión conservada"
    );
  }

  console.log("[contract] BuyerDiagnosisRepository contract tests passed.");
}
