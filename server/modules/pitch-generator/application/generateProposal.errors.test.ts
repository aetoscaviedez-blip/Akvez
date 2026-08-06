// Errores esperados de `GenerateProposal` — Sprint 10 · Fase 3.
//
// **Sin dobles de `domain/`.** Aquí se ejecutan `selectStrategy` y
// `passesControlPoint` **reales**, que es lo único que permite comprobar lo que
// esta suite comprueba: **qué error sale, de qué categoría es, y que ninguno se
// disfraza de desenlace del negocio**.
//
// **No se prueba ningún algoritmo**: ninguno existe. Se prueba **la frontera
// entre lo que es una rama del resultado y lo que es un error**, que es una
// decisión de arquitectura ya tomada (C-3 · R-61 · AL-16 · R-62).

import { describe, expect, it, vi } from "vitest";
import { AgentInternalError, categoryOf, isAkvezError } from "../../../shared/errors";
import { ControlPointUnavailableError, StrategyProfileUnavailableError } from "../domain/commercial/proposalErrors";
import { ProposalDraftingPort } from "../domain/commercial/proposalDraftingPort";
import { ProposalRepository } from "../../../shared/persistence/repositories/ProposalRepository";
import { passesControlPoint } from "../domain/commercial/controlPoint";
import { createGenerateProposal, GenerateProposalInput } from "./generateProposal";

type SavedProposal = Parameters<ProposalRepository["save"]>[0];

function harness() {
  const draft = vi.fn(async () => "texto que nadie debería llegar a pedir");
  const save = vi.fn(async (proposal: SavedProposal) => ({ ...proposal, id: "no-debe-ocurrir" }));
  const findVersionsByMoment = vi.fn(async () => []);
  const findCurrentByMoment = vi.fn(async () => null);
  const findByLeadId = vi.fn(async () => []);

  const proposalDraftingPort: ProposalDraftingPort = { draft };
  const proposalRepository: ProposalRepository = {
    save,
    findVersionsByMoment,
    findCurrentByMoment,
    findByLeadId
  };

  return {
    draft,
    save,
    /** Toda lectura o escritura del único repositorio que el caso de uso conoce. */
    repositoryCalls: [save, findVersionsByMoment, findCurrentByMoment, findByLeadId],
    generateProposal: createGenerateProposal({ proposalDraftingPort, proposalRepository })
  };
}

function input(overrides: Partial<GenerateProposalInput> = {}): GenerateProposalInput {
  return {
    lead: "lead-proposal-1",
    diagnosis: {
      variables: [{ id: "BD-1", knowledgeClass: "Inferida", value: "Consciente del Problema" }],
      confidence: "Baja"
    },
    evidence: {
      lead: "lead-proposal-1",
      facts: Object.freeze([
        Object.freeze({
          lead: "lead-proposal-1",
          kind: "contacto_publico" as const,
          statement: "El negocio publica un teléfono de contacto",
          source: Object.freeze({ observation: "atributo_de_empresa" as const, source: "google-places" })
        })
      ])
    },
    sequence: {
      moment: "Evidencia",
      previousContribution: []
    },
    ...overrides
  };
}

describe("GenerateProposal · errores esperados", () => {
  // ── B-1 · SIN PERFIL NO HAY DECISIÓN ──────────────────────────────────────

  it("sin Perfil de Estrategia el caso de uso no emite: lanza y no persiste nada", async () => {
    const { generateProposal, draft, repositoryCalls } = harness();

    await expect(generateProposal(input())).rejects.toBeInstanceOf(
      StrategyProfileUnavailableError
    );

    // **Nada se redactó y nada se escribió.** No hay «propuesta a medias»:
    // la persistencia solo ocurre tras la aprobación del punto de control.
    expect(draft).not.toHaveBeenCalled();
    for (const call of repositoryCalls) expect(call).not.toHaveBeenCalled();
  });

  it("no se disfraza de desenlace del negocio: no hay rama para esto (AL-16 · R-62)", async () => {
    const { generateProposal } = harness();

    const result = await generateProposal(input()).then(
      (value) => ({ resolved: value }),
      (error: unknown) => ({ rejected: error })
    );

    // Si esto devolviese un `outcome`, la ausencia de una decisión de producto
    // habría quedado registrada como si fuera un final normal del contacto.
    expect("resolved" in result).toBe(false);
    expect("rejected" in result).toBe(true);
  });

  it("pertenece a la taxonomía común y a la categoría que le corresponde (APS-03 §12)", async () => {
    const { generateProposal } = harness();

    const error = await generateProposal(input()).catch((value: unknown) => value);

    expect(isAkvezError(error)).toBe(true);
    // El fallo se produjo **dentro** de AKVEZ: ni la entrada era inválida ni
    // intervino ningún proveedor.
    expect(categoryOf(error)).toBe("agent_internal");
    expect(error).toBeInstanceOf(AgentInternalError);
    // El nombre viaja en el error, que es lo que lo hace legible en un registro.
    expect((error as Error).name).toBe("StrategyProfileUnavailableError");
  });

  // ── EL PUNTO DE CONTROL ───────────────────────────────────────────────────

  it("el punto de control declara su indisponibilidad; no aprueba ni rechaza", () => {
    // Se invoca directamente porque la decisión de estrategia corta antes: sin
    // ella no hay texto que verificar. **No poder verificar no es no superar**,
    // y por eso esto no es la rama `control_failed`.
    expect(() =>
      passesControlPoint({
        strategy: {
          objective: "responder",
          barrier: "Credibilidad",
          evidenceBase: [],
          focus: "",
          emotion: "reconocimiento",
          relevanceElement: "",
          channel: "Email frío",
          moment: "Evidencia",
          expectedOutcome: "respondió"
        },
        facts: [],
        text: "cualquier texto"
      })
    ).toThrow(ControlPointUnavailableError);
  });

  // ── LA VERSIÓN DEL CRITERIO NO ES UNA ENTRADA INVÁLIDA: NO ES UNA ENTRADA ──

  it("COM-15 §3 — no hay error de versión ausente porque la versión no se recibe", async () => {
    const { generateProposal, repositoryCalls } = harness();

    // Antes existía `MissingCriteriaVersionError` para una entrada que llegase
    // sin versión. **Dejó de tener sentido**: una entrada no puede omitir lo que
    // no envía. Lo que impide emitir sigue siendo la ausencia de Perfil, y se
    // declara por la vía correcta.
    const error = await generateProposal(input()).catch((value: unknown) => value);

    expect(error).toBeInstanceOf(StrategyProfileUnavailableError);
    expect(categoryOf(error)).toBe("agent_internal");
    for (const call of repositoryCalls) expect(call).not.toHaveBeenCalled();
  });

  // ── LO QUE SÍ ES RAMA ─────────────────────────────────────────────────────

  it("la falta de diagnóstico sí es un desenlace, no un error (COM-09 §7)", async () => {
    const { generateProposal, draft, repositoryCalls } = harness();

    const result = await generateProposal(
      input({ diagnosis: undefined as unknown as GenerateProposalInput["diagnosis"] })
    );

    expect(result).toEqual({ outcome: "diagnosis_missing" });
    expect(draft).not.toHaveBeenCalled();
    for (const call of repositoryCalls) expect(call).not.toHaveBeenCalled();
  });
});
