// Pruebas del **flujo** de `GenerateProposal` — Sprint 10 · Fase 2.
//
// **Solo el orquestador.** No se prueba el algoritmo de estrategia ni el del
// punto de control: ambos son `domain/`, ambos están bloqueados por B-1 y
// **ninguno pertenece a esta capa**. Aquí se prueba lo único que
// `application/` decide: **el orden, la condición de persistir y qué rama sale**.
//
// **Por qué se doblan las dos funciones de `domain/`.** Se importan directamente
// (D-A1 · COM-09 §6) y no se inyectan —un caso de uso no construye ni recibe sus
// decisiones—, de modo que la única forma de observar el encadenamiento sin
// probar el algoritmo es sustituir el módulo. **Doblar el veredicto no es doblar
// el criterio:** lo que se comprueba es qué hace `application/` con un veredicto
// dado, que es exactamente su responsabilidad (ADR-16 §7).

import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommercialStrategy } from "../domain/commercial/commercialStrategy";
import { ControlPointUnavailableError } from "../domain/commercial/proposalErrors";
import { ProposalDraftingInput, ProposalDraftingPort } from "../domain/commercial/proposalDraftingPort";
import { ProposalRepository } from "../../../shared/persistence/repositories/ProposalRepository";
import { CRITERIA_VERSION_ABSENT } from "../domain/commercial/diagnoseBuyer";
import {
  createGenerateProposal,
  GenerateProposalDeps,
  GenerateProposalInput
} from "./generateProposal";

const domain = vi.hoisted(() => ({
  selectStrategy: vi.fn(),
  passesControlPoint: vi.fn()
}));

vi.mock("../domain/commercial/selectStrategy", () => ({
  selectStrategy: domain.selectStrategy
}));
vi.mock("../domain/commercial/controlPoint", () => ({
  passesControlPoint: domain.passesControlPoint
}));

// ─── Traza y dobles ──────────────────────────────────────────────────────────

/**
 * El orden real de los pasos. **Es la aserción central de esta suite:** la
 * Línea de Decisión de ADR-15 §10 se atraviesa **en un solo sentido**, y una
 * inversión —persistir antes de verificar, verificar antes de redactar— no
 * rompería ningún tipo.
 */
let trace: string[];

type SavedProposal = Parameters<ProposalRepository["save"]>[0];

const APPROVED_DEPS = ["proposalDraftingPort", "proposalRepository"];

/**
 * La lista que **produce `domain/`**, deliberadamente **distinta en referencia**
 * de la que entra en `input.evidence.facts`.
 *
 * Es lo que hace discriminante la comprobación de fuente única: si alguna capa
 * volviese a leer el sobre de entrada después de decidir, las aserciones `toBe`
 * lo delatarían. Con dos listas iguales no se distinguiría.
 */
const DECIDED_FACTS = Object.freeze([
  Object.freeze({
    lead: "lead-proposal-1",
    kind: "contacto_publico" as const,
    statement: "El negocio publica un teléfono de contacto",
    source: Object.freeze({ observation: "atributo_de_empresa" as const, source: "google-places" })
  })
]);

function strategy(overrides: Partial<CommercialStrategy> = {}): CommercialStrategy {
  return {
    objective: "responder",
    barrier: "Credibilidad",
    evidenceBase: DECIDED_FACTS,
    focus: "un negocio que ya atiende por teléfono",
    emotion: "reconocimiento",
    resumedThread: "qué hace que un cliente elija a un competidor",
    openedThread: "qué ve alguien que busca el negocio y no lo encuentra",
    relevanceElement: "el teléfono publicado es el único canal de entrada",
    channel: "Email frío",
    moment: "Evidencia",
    expectedOutcome: "respondió",
    ...overrides
  };
}

function harness(options: { versions?: number } = {}) {
  /**
   * La estrategia que devuelve `domain/`, **con la lista cerrada dentro**
   * (ADR-16 §7 · APS-18 §8.1). Es la única lista que el flujo debe usar a partir
   * de la decisión.
   */
  const decided = strategy();

  domain.selectStrategy.mockImplementation(() => {
    trace.push("selectStrategy");
    return decided;
  });
  domain.passesControlPoint.mockImplementation(() => {
    trace.push("passesControlPoint");
    return true;
  });

  const draft = vi.fn(async (_input: ProposalDraftingInput) => {
    trace.push("draft");
    return "Texto redactado a partir de la estrategia decidida.";
  });

  const findVersionsByMoment = vi.fn(async () => {
    trace.push("findVersionsByMoment");
    return new Array(options.versions ?? 0).fill(null) as never[];
  });

  const save = vi.fn(async (proposal: SavedProposal) => {
    trace.push("save");
    return { ...proposal, id: "proposal-1" };
  });

  const proposalDraftingPort: ProposalDraftingPort = { draft };
  const proposalRepository: ProposalRepository = {
    save,
    findVersionsByMoment,
    findCurrentByMoment: vi.fn(async () => {
      trace.push("findCurrentByMoment");
      return null;
    }),
    findByLeadId: vi.fn(async () => {
      trace.push("findByLeadId");
      return [];
    })
  };

  const deps = { proposalDraftingPort, proposalRepository } satisfies GenerateProposalDeps;

  return {
    deps,
    decided,
    draft,
    save,
    findVersionsByMoment,
    generateProposal: createGenerateProposal(deps)
  };
}

function input(overrides: Partial<GenerateProposalInput> = {}): GenerateProposalInput {
  return {
    lead: "lead-proposal-1",
    diagnosis: {
      variables: [
        { id: "BD-1", knowledgeClass: "Inferida", value: "Consciente del Problema" },
        { id: "BD-4", knowledgeClass: "Desconocida" }
      ],
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
      previousThread: "qué hace que un cliente elija a un competidor",
      previousContribution: ["se reconoció la categoría del negocio"],
      previousOutcome: { responded: false }
    },
    ...overrides
  };
}

beforeEach(() => {
  trace = [];
  vi.clearAllMocks();
});

describe("GenerateProposal · flujo (Sprint 10 · Fase 2)", () => {
  // ── ORDEN ─────────────────────────────────────────────────────────────────

  it("atraviesa la Línea de Decisión en un solo sentido y en este orden (ADR-15 §10)", async () => {
    const { generateProposal } = harness();

    const result = await generateProposal(input());

    expect(result.outcome).toBe("success");
    expect(trace).toEqual([
      "selectStrategy",   // domain/ decide
      "draft",            // infrastructure/ redacta con la decisión
      "passesControlPoint", // domain/ verifica contra ella
      "findVersionsByMoment", // solo después: identidad de la emisión
      "save"              // y solo después: persistir
    ]);
  });

  it("la redacción recibe la estrategia decidida y la lista cerrada, y nada más", async () => {
    const { generateProposal, draft, decided } = harness();
    const entrada = input();

    await generateProposal(entrada);

    expect(draft).toHaveBeenCalledTimes(1);
    const recibido = draft.mock.calls[0][0];
    expect(Object.keys(recibido).sort()).toEqual(["facts", "strategy"]);
    // **La estrategia no se modifica** por esta capa: es la misma que devolvió
    // `domain/` (RA-R1 · RC-3).
    expect(recibido.strategy).toBe(decided);
    // **Los hechos tampoco**: se redacta con **la lista que decidió `domain/`**,
    // sin derivar ni ampliar (RE-1 · RA-4 · ADR-16 §7).
    expect(recibido.facts).toBe(decided.evidenceBase);
  });

  it("una sola lista: la que produjo domain/ es la que se redacta, verifica y emite", async () => {
    const { generateProposal, draft, save, decided } = harness();
    const entrada = input();

    const result = await generateProposal(entrada);

    if (result.outcome !== "success") throw new Error("se esperaba éxito");
    // **Cuatro puntos, una sola referencia** (ADR-16 §7 · APS-18 §8.1): no queda
    // ninguna segunda lista que pueda divergir de la que decidió el dominio.
    const unica = decided.evidenceBase;
    expect(draft.mock.calls[0][0].facts).toBe(unica);
    expect(domain.passesControlPoint.mock.calls[0][0].facts).toBe(unica);
    expect(result.proposal.affirmableFacts).toBe(unica);
    expect(save.mock.calls[0][0].affirmableFacts).toEqual(
      save.mock.calls[0][0].strategy.evidenceBase
    );
    // Y la lista del sobre de entrada solo se lee una vez: al decidir.
    expect(domain.selectStrategy.mock.calls[0][0].facts).toBe(entrada.evidence.facts);
  });

  it("el punto de control verifica contra la misma lista con la que se redactó (P-I4)", async () => {
    const { generateProposal, decided } = harness();
    const entrada = input();

    await generateProposal(entrada);

    expect(domain.passesControlPoint).toHaveBeenCalledTimes(1);
    const verificado = domain.passesControlPoint.mock.calls[0][0];
    expect(Object.keys(verificado).sort()).toEqual(["facts", "strategy", "text"]);
    expect(verificado.strategy).toBe(decided);
    expect(verificado.facts).toBe(decided.evidenceBase);
    expect(verificado.text).toBe("Texto redactado a partir de la estrategia decidida.");
  });

  it("la decisión de estrategia recibe solo lo que COM-07 admite, ya preparado", async () => {
    const { generateProposal } = harness();
    const entrada = input();

    await generateProposal(entrada);

    const recibido = domain.selectStrategy.mock.calls[0][0];
    expect(Object.keys(recibido).sort()).toEqual(["diagnosis", "facts", "sequence"]);
    // **COM-15 §3** — tampoco se le dice bajo qué criterio decidir: el criterio
    // se transcribe donde se decide, junto a su designación.
    expect(Object.keys(recibido)).not.toContain("criteriaVersion");
    expect(recibido.diagnosis).toBe(entrada.diagnosis);
    expect(recibido.sequence).toBe(entrada.sequence);
  });

  // ── SUCCESS ───────────────────────────────────────────────────────────────

  it("emite E-5 y ningún otro evento (AL-04), sin tocar el estadio (P-I3)", async () => {
    const { generateProposal } = harness();

    const result = await generateProposal(input());

    if (result.outcome !== "success") throw new Error("se esperaba éxito");
    expect(result.event.code).toBe("E-5");
    expect(result.event.proposal).toEqual({
      lead: "lead-proposal-1",
      moment: "Evidencia",
      issue: 1
    });
    expect(Object.keys(result.event).sort()).toEqual(["code", "proposal"]);
  });

  it("P-I2 · V-1 — regenerar añade: el número sale del historial, no de esta capa", async () => {
    const { generateProposal, save } = harness({ versions: 2 });

    const result = await generateProposal(input());

    if (result.outcome !== "success") throw new Error("se esperaba éxito");
    expect(result.proposal.issue).toBe(3);
    expect(save.mock.calls[0][0].issue).toBe(3);
  });

  it("la emisión transporta la estrategia y la lista contra la que se verificó (COM-09 §4.2)", async () => {
    const { generateProposal, decided } = harness();
    const entrada = input();

    const result = await generateProposal(entrada);

    if (result.outcome !== "success") throw new Error("se esperaba éxito");
    expect(result.proposal.strategy).toBe(decided);
    expect(result.proposal.affirmableFacts).toBe(decided.evidenceBase);
    expect(result.proposal.text).toBe("Texto redactado a partir de la estrategia decidida.");
    // El canal es contenido de la estrategia, nunca de la secuencia (CM-3).
    expect(result.proposal.channel).toBe(decided.channel);
    expect(result.proposal.criteriaVersion).toBe(CRITERIA_VERSION_ABSENT);
    // Del repositorio solo se toma el `id`: una cadena, no un contrato (R-22).
    expect(result.proposal.id).toBe("proposal-1");
  });

  it("ADR-08 §5 — entrega para persistir la forma de la frontera, sin inventar nada", async () => {
    const { generateProposal, save, decided } = harness();

    await generateProposal(input());

    const persisted = save.mock.calls[0][0];
    expect(persisted.leadId).toBe("lead-proposal-1");
    expect(persisted.moment).toBe("Evidencia");
    expect(persisted.channel).toBe(decided.channel);
    expect(persisted.criteriaVersion).toBe(CRITERIA_VERSION_ABSENT);
    // V-3 — cada emisión conserva su marca temporal.
    expect(new Date(persisted.issuedAt).toISOString()).toBe(persisted.issuedAt);
    // La estrategia viaja íntegra; solo la base de evidencia se reduce a los
    // enunciados, que es lo único que el contrato conserva.
    expect(persisted.strategy.objective).toBe(decided.objective);
    expect(persisted.strategy.barrier).toBe(decided.barrier);
    expect(persisted.strategy.expectedOutcome).toBe(decided.expectedOutcome);
  });

  it("R-38 — un hilo ausente no se persiste como clave vacía", async () => {
    const { generateProposal, save } = harness();
    domain.selectStrategy.mockImplementation(() => {
      trace.push("selectStrategy");
      // Primer contacto: no hay hilo previo que retomar (APS-18 §4.6).
      return strategy({ resumedThread: undefined, openedThread: undefined });
    });

    await generateProposal(input());

    const persistedStrategy = save.mock.calls[0][0].strategy;
    expect(Object.prototype.hasOwnProperty.call(persistedStrategy, "resumedThread")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(persistedStrategy, "openedThread")).toBe(false);
  });

  // ── CONTROL POINT ─────────────────────────────────────────────────────────

  it("un texto que no supera el control no se entrega ni se persiste (ADR-15 §10)", async () => {
    const { generateProposal, save, findVersionsByMoment } = harness();
    domain.passesControlPoint.mockImplementation(() => {
      trace.push("passesControlPoint");
      return false;
    });

    const result = await generateProposal(input());

    expect(result).toEqual({ outcome: "control_failed", attempts: 1 });
    expect(save).not.toHaveBeenCalled();
    expect(findVersionsByMoment).not.toHaveBeenCalled();
    expect(trace).toEqual(["selectStrategy", "draft", "passesControlPoint"]);
  });

  it("si el punto de control no puede verificar, el error sale intacto y no se persiste", async () => {
    const { generateProposal, save, findVersionsByMoment } = harness();
    const blocked = new ControlPointUnavailableError("el punto de control no puede verificar");
    domain.passesControlPoint.mockImplementation(() => {
      trace.push("passesControlPoint");
      throw blocked;
    });

    // **No se convierte en `control_failed`**: no poder verificar no es no
    // superar. Y no se envuelve: quien lo reciba debe poder distinguirlo
    // (AL-16 · R-62).
    await expect(generateProposal(input())).rejects.toBe(blocked);
    expect(save).not.toHaveBeenCalled();
    expect(findVersionsByMoment).not.toHaveBeenCalled();
  });

  it("nada se persiste antes del veredicto: el control point precede a toda escritura", async () => {
    const { generateProposal, save } = harness();
    domain.passesControlPoint.mockImplementation(() => {
      // En el instante de verificar, **el repositorio no ha sido tocado**.
      expect(save).not.toHaveBeenCalled();
      expect(trace).toEqual(["selectStrategy", "draft"]);
      trace.push("passesControlPoint");
      return true;
    });

    await generateProposal(input());

    expect(save).toHaveBeenCalledTimes(1);
  });

  // ── RAMAS DE FALLO ────────────────────────────────────────────────────────

  it("si el proveedor de redacción falla, no se verifica ni se persiste", async () => {
    const { deps, save } = harness();
    deps.proposalDraftingPort.draft = vi.fn(async () => {
      trace.push("draft");
      // El adapter ya lo envolvió conservando `cause` (AL-14 · R-63).
      throw new Error("cuota agotada en el proveedor");
    });
    const failing = createGenerateProposal(deps);

    const result = await failing(input());

    expect(result).toEqual({ outcome: "drafting_unavailable" });
    expect(domain.passesControlPoint).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
    expect(trace).toEqual(["selectStrategy", "draft"]);
  });

  it("un fallo de persistencia es rama del resultado, no excepción (C-3 · R-61)", async () => {
    const { deps } = harness();
    deps.proposalRepository.save = vi.fn(async () => {
      throw new Error("motor no disponible");
    });
    const failing = createGenerateProposal(deps);

    const result = await failing(input());

    expect(result).toEqual({ outcome: "persistence_failed", reason: "motor no disponible" });
  });

  it("también es rama si falla la lectura del historial de emisiones", async () => {
    const { deps } = harness();
    deps.proposalRepository.findVersionsByMoment = vi.fn(async () => {
      throw new Error("motor no disponible");
    });
    const failing = createGenerateProposal(deps);

    const result = await failing(input());

    expect(result.outcome).toBe("persistence_failed");
  });

  it("sin diagnóstico vigente no se decide nada (COM-09 §7)", async () => {
    const { generateProposal, draft, save } = harness();

    const result = await generateProposal(
      input({ diagnosis: undefined as unknown as GenerateProposalInput["diagnosis"] })
    );

    expect(result).toEqual({ outcome: "diagnosis_missing" });
    expect(trace).toEqual([]);
    expect(domain.selectStrategy).not.toHaveBeenCalled();
    expect(draft).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });

  // ── EL CRITERIO APLICADO ──────────────────────────────────────────────────

  it("COM-15 §3 — la versión no entra: la emisión se sella desde domain/", async () => {
    const { generateProposal, save } = harness();
    const entrada = input();

    const result = await generateProposal(entrada);

    if (result.outcome !== "success") throw new Error("se esperaba éxito");
    // **RC-13** — la emisión conserva la designación del criterio aplicado, y
    // **quien invoca no puede elegirla**: la entrada no la declara.
    expect(Object.keys(entrada)).not.toContain("criteriaVersion");
    expect(result.proposal.criteriaVersion).toBe(CRITERIA_VERSION_ABSENT);
    // Lo sellado y lo persistido son el mismo valor: **una sola fuente**.
    expect(save.mock.calls[0][0].criteriaVersion).toBe(result.proposal.criteriaVersion);
  });

  it("R-38 · RE-3 — no se fabrica una versión: se declara la ausencia", async () => {
    const { generateProposal } = harness();

    const result = await generateProposal(input());

    if (result.outcome !== "success") throw new Error("se esperaba éxito");
    // Inventar `"v1"` produciría **apariencia de trazabilidad sin trazabilidad**,
    // que es justo lo que RC-13 existe para impedir.
    expect(result.proposal.criteriaVersion).toBe("SIN-PERFIL-DE-ESTRATEGIA");
  });

  // ── DEPENDENCIAS ──────────────────────────────────────────────────────────

  it("el flujo completo no toca ninguna dependencia fuera de las dos aprobadas", async () => {
    const { deps } = harness();
    const accessed = new Set<string>();

    const guarded = new Proxy(deps as unknown as Record<string, unknown>, {
      get(target, property) {
        if (typeof property === "string") {
          if (!APPROVED_DEPS.includes(property)) {
            throw new Error(`dependencia no aprobada: ${property}`);
          }
          accessed.add(property);
        }
        return Reflect.get(target, property);
      }
    });

    const result = await createGenerateProposal(
      guarded as unknown as GenerateProposalDeps
    )(input());

    expect(result.outcome).toBe("success");
    expect([...accessed].sort()).toEqual(APPROVED_DEPS);
  });

  it("solo se consulta el repositorio del propio activo, y solo su historial", async () => {
    const { generateProposal, deps } = harness();

    await generateProposal(input());

    // A-6 y nada más: no existe repositorio de diagnóstico ni de secuencia que
    // consultar, y las lecturas ajenas del propio puerto tampoco se usan.
    expect(deps.proposalRepository.findCurrentByMoment).not.toHaveBeenCalled();
    expect(deps.proposalRepository.findByLeadId).not.toHaveBeenCalled();
    expect(trace.filter((step) => step.startsWith("find"))).toEqual(["findVersionsByMoment"]);
  });
});
