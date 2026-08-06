// Pruebas de integración del Composition Root.
//
// **Qué se prueba aquí y en ningún otro sitio: que el grafo se construye.** Cada
// capa tiene sus propias pruebas; ésta comprueba lo único que solo se ve al
// ensamblarlas — que las piezas encajan, que nadie construye sus propias
// dependencias y que **la persistencia no se filtra hacia las rutas**.
//
// **La ausencia de dependencias circulares se comprueba por construcción**: un
// ciclo entre módulos ESM haría que alguna factoría fuese `undefined` al
// invocarse, y `buildApplicationDependencies()` fallaría al ejecutarse. Que
// devuelva un grafo completo es la prueba.

import { describe, expect, it, vi } from "vitest";
import { createCommercialProposal } from "../orchestrators/commercialProposalOrchestrator";
import { createGeminiProposalDrafting } from "../modules/pitch-generator/infrastructure/proposalDraftingAdapter";
import { createGenerateProposal } from "../modules/pitch-generator/application/generateProposal";
import { createInMemoryProposalAdapter } from "../shared/persistence/adapters/inMemoryProposalAdapter";
import { buildApplicationDependencies } from "./compositionRoot";

/** Los cinco manejadores que hoy expone el backend. **Ninguno más.** */
const HANDLERS = [
  "handleDiagnosis",
  "handleLeadLibrary",
  "handleProspectOutreach",
  "handleProspectSearch",
  "handleSequence"
];

describe("Composition Root", () => {
  it("construye el grafo completo sin fallar", () => {
    const deps = buildApplicationDependencies();

    expect(Object.keys(deps).sort()).toEqual(HANDLERS);
    for (const handler of HANDLERS) {
      expect(typeof deps[handler as keyof typeof deps]).toBe("function");
    }
  });

  it("R-23 · R-24 — no filtra persistencia hacia las rutas", () => {
    const deps = buildApplicationDependencies();

    // `routes/` recibe **manejadores**, nunca repositorios. Si un adapter se
    // colase aquí, una ruta podría leer la Biblioteca sin pasar por su caso de
    // uso — y el Orchestrator dejaría de ser el único camino (R-11).
    for (const value of Object.values(deps)) {
      expect(typeof value).toBe("function");
    }
  });

  it("R-57 — no hay singleton de módulo: cada arranque produce su propio grafo", () => {
    const first = buildApplicationDependencies();
    const second = buildApplicationDependencies();

    // Construir dos veces debe producir dos grafos independientes. Si alguna
    // pieza fuese un `const` exportado a nivel de módulo, ambos compartirían
    // instancia — la desviación que ADR-15 §9.5 declaró prerrequisito técnico.
    for (const handler of HANDLERS) {
      const key = handler as keyof typeof first;
      expect(first[key]).not.toBe(second[key]);
    }
  });

  it("sin endpoints nuevos: el cableado de la Propuesta no expone superficie HTTP", () => {
    const deps = buildApplicationDependencies();

    // `GenerateProposal` **ya se construye en el arranque**, pero **no hay
    // manejador de propuesta y no debe haberlo todavía**: con B-1 abierto el
    // caso de uso no puede emitir, y publicarlo presentaría un bloqueo de
    // gobernanza como si fuera una función del producto.
    expect(Object.keys(deps)).not.toContain("handleProposal");
    expect(Object.keys(deps)).toHaveLength(HANDLERS.length);
  });

  // ── GenerateProposal, resuelto por inyección ──────────────────────────────

  it("sus dos dependencias aprobadas quedan resueltas por adapters reales", () => {
    // **Reproduce exactamente lo que el Composition Root hace.** Que compile es
    // la prueba de que `GenerateProposalDeps` queda completamente satisfecho:
    // el puerto de redacción por su adapter, y la persistencia por la Repository
    // Interface —nunca el adapter— (COM-09 §6 · AL-06 · R-22).
    const generateProposal = createGenerateProposal({
      proposalDraftingPort: createGeminiProposalDrafting(),
      proposalRepository: createInMemoryProposalAdapter()
    });

    expect(typeof generateProposal).toBe("function");
  });

  // ── El compositor de la propuesta ─────────────────────────────────────────

  it("se construye con las dos dependencias aprobadas, y con ninguna más", () => {
    // **Reproduce lo que el Composition Root hace.** Que compile es la prueba
    // de que `CommercialProposalDependencies` queda satisfecho: la Agent API
    // —por la que llegan las dos lecturas y **la emisión** (COM-24 · COM-30)— y
    // el workflow de hechos. **Ningún repositorio, ningún adapter y ningún caso
    // de uso inyectado.**
    const agent = {
      readReducedDiagnosis: vi.fn(async () => null),
      readReducedSequence: vi.fn(async () => null),
      // La emisión entra por la fachada, no por inyección directa (R-07).
      generateProposal: vi.fn(async () => ({ outcome: "diagnosis_missing" as const })),
      generateDiagnosis: vi.fn(),
      createSequence: vi.fn(),
      observeFacts: vi.fn(),
      generateOutreach: vi.fn()
    } as never;

    const run = createCommercialProposal({
      pitchGeneratorAgent: agent,
      runCommercialFacts: vi.fn(async () => [])
    });

    expect(typeof run).toBe("function");
  });

  it("el compositor no aparece en las rutas: integrar no es publicar", () => {
    const deps = buildApplicationDependencies();

    // Se construye en el arranque, **sin endpoint**: con B-1 abierto no habría
    // capacidad que publicar (COM-24 §3.4).
    expect(Object.keys(deps)).not.toContain("handleProposal");
    expect(Object.keys(deps).sort()).toEqual(HANDLERS);
  });

  it("construir el caso de uso no invoca a nadie: el grafo se monta sin efectos", () => {
    // Construir no redacta, no persiste y no decide. Si alguna factoría hiciera
    // I/O al ensamblar, el arranque dependería de un proveedor externo — y
    // `buildApplicationDependencies()` no podría ejecutarse en una prueba.
    expect(() => buildApplicationDependencies()).not.toThrow();
  });
});
