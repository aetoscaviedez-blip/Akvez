// Pruebas **estructurales** de `GenerateProposal` — Sprint 10 · Fase 1.
//
// **No prueban generación de texto**: no hay ninguna. Prueban la única cosa que
// esta fase construye —**la forma**— en los cuatro puntos donde puede romperse
// sin que nada más falle:
//
//   1. el caso de uso **no depende de repositorios ajenos**;
//   2. el constructor **solo recibe las dependencias aprobadas** (COM-09 §6);
//   3. la entrada **coincide exactamente con COM-07 §6**;
//   4. la salida **coincide exactamente con COM-09 §4.2**.
//
// **Dos planos, y ninguno basta solo.** Vitest no comprueba tipos: un campo
// añadido a una interfaz no rompería ninguna aserción de ejecución. Por eso cada
// forma se verifica **también en tiempo de compilación** con `Exact<A, B>`, que
// falla en `npm run lint` (`tsc --noEmit`) si la superficie deriva. Las
// comprobaciones de ejecución cubren lo que el tipo no alcanza: qué se toca, qué
// se invoca y qué existe realmente en el módulo.

import { describe, expect, it, vi } from "vitest";
import { ProposalDraftingInput, ProposalDraftingPort } from "../domain/commercial/proposalDraftingPort";
import { ProposalRepository } from "../../../shared/persistence/repositories/ProposalRepository";
import * as generateProposalModule from "./generateProposal";
import {
  createGenerateProposal,
  GenerateProposalDeps,
  GenerateProposalInput,
  GenerateProposalResult,
  ProposalEmission,
  ReducedDiagnosis,
  ReducedDiagnosisVariable,
  ReducedSequence
} from "./generateProposal";

// ─── Igualdad exacta de tipos ────────────────────────────────────────────────

/**
 * `true` **solo si `A` y `B` son el mismo tipo**. Con una sola dirección
 * (`extends`) un campo añadido pasaría inadvertido: la comprobación debe ser
 * mutua, o no comprueba «exactamente».
 */
type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

/** Las claves de una rama concreta del resultado. */
type BranchKeys<O extends GenerateProposalResult["outcome"]> = keyof Extract<
  GenerateProposalResult,
  { outcome: O }
>;

// ── 3 · LA ENTRADA COINCIDE CON COM-07 §6, CORREGIDO POR COM-15 ──────────────
//
// **Cuatro campos.** **Nada más entra**, y en particular **no entran** la
// `CommercialStrategy` —la produce `domain/`, COM-07 §4.2—, ningún perfil del
// diseñador, ni **la versión del criterio**: **COM-15 §3** la saca de la entrada
// porque el criterio se transcribe en `domain/` junto a su designación, y
// recibirla permitiría **decidir bajo un criterio y sellar con otro**.
const _input: Exact<
  keyof GenerateProposalInput,
  "lead" | "diagnosis" | "evidence" | "sequence"
> = true;

// El diagnóstico entra **recortado**: sin `indicios` (COM-07 §2.2) y **sin
// `commercialState` como campo suelto** — **BD-I4: es la variable BD-1**, y un
// campo hermano lo duplicaría (COM-14 §4.1).
const _diagnosis: Exact<keyof ReducedDiagnosis, "variables" | "confidence"> = true;

const _diagnosisVariable: Exact<
  keyof ReducedDiagnosisVariable,
  "id" | "knowledgeClass" | "value"
> = true;

// La secuencia entra **sin canal** (COM-07 §5.2 · CM-3), **sin estrategias
// previas** (SC-R1) y **sin el número de secuencia**: pertenece a la identidad
// de A-12 y ninguna decisión de la propuesta lo consume (COM-16 §5.1 · F-8).
const _sequence: Exact<
  keyof ReducedSequence,
  "moment" | "previousThread" | "previousContribution" | "previousOutcome"
> = true;

// **La manifestación del comprador no entra** (COM-16 §5.5): sería contenido
// enunciable ajeno a la proyección, una segunda vía hacia lo afirmable (RE-1).
const _declaredOutcome: Exact<
  keyof NonNullable<ReducedSequence["previousOutcome"]>,
  "responded"
> = true;

// ── 4 · LA SALIDA COINCIDE CON COM-09 §4.2 ───────────────────────────────────
//
// Cinco ramas discriminadas por literal, ni una más (AL-12 · ADR-17 §7.3).
const _outcomes: Exact<
  GenerateProposalResult["outcome"],
  "success" | "control_failed" | "drafting_unavailable" | "diagnosis_missing" | "persistence_failed"
> = true;

const _success: Exact<BranchKeys<"success">, "outcome" | "proposal" | "event"> = true;
const _controlFailed: Exact<BranchKeys<"control_failed">, "outcome" | "attempts"> = true;
const _draftingUnavailable: Exact<BranchKeys<"drafting_unavailable">, "outcome"> = true;
const _diagnosisMissing: Exact<BranchKeys<"diagnosis_missing">, "outcome"> = true;
const _persistenceFailed: Exact<BranchKeys<"persistence_failed">, "outcome" | "reason"> = true;

// La emisión transporta la estrategia y la lista contra la que se verificó: es
// lo que hace **P-I4** comprobable después (COM-09 §4.2).
const _emission: Exact<
  keyof ProposalEmission,
  "id" | "lead" | "moment" | "issue" | "strategy" | "affirmableFacts" | "text" | "channel" | "criteriaVersion"
> = true;

// ── 2 · EL CONSTRUCTOR SOLO RECIBE LAS DEPENDENCIAS APROBADAS ────────────────
//
// **Prohibido en `Deps`: cualquier otra cosa** (COM-09 §6 · AL-08). Que
// `BuyerDiagnosisRepository` y `CommercialSequenceRepository` no aparezcan es lo
// que hace exigible ADR-15 §12: **el diagnóstico y la secuencia entran como
// dato**.
const _deps: Exact<
  keyof GenerateProposalDeps,
  "proposalDraftingPort" | "proposalRepository"
> = true;

// El puerto de redacción **recibe decisiones cerradas y devuelve solo texto**
// (COM-09 §6 · APS-18 §10.2). Ningún campo de contexto libre.
const _portInput: Exact<keyof ProposalDraftingInput, "strategy" | "facts"> = true;
const _portOutput: Exact<Awaited<ReturnType<ProposalDraftingPort["draft"]>>, string> = true;

/** Las aserciones de tipo no producen valor: existen para que `tsc` las evalúe. */
void [
  _input, _diagnosis, _diagnosisVariable, _sequence, _declaredOutcome,
  _outcomes, _success, _controlFailed, _draftingUnavailable, _diagnosisMissing,
  _persistenceFailed, _emission,
  _deps, _portInput, _portOutput
];

// ─── Dobles ──────────────────────────────────────────────────────────────────

const APPROVED_DEPS = ["proposalDraftingPort", "proposalRepository"];

/**
 * **Ningún doble importa el Persistence Contract.** `application/` tiene
 * prohibido importar `shared/persistence/contracts/` (ADR-17 §13, prohibición 4 ·
 * R-22), y sus pruebas no deben abrir por la puerta de atrás lo que la capa cierra
 * por la principal: la forma la impone la firma del repositorio.
 */
type SavedProposal = Parameters<ProposalRepository["save"]>[0];

function spies() {
  const draft = vi.fn(async () => "texto que esta fase no debe pedir");
  const save = vi.fn(async (proposal: SavedProposal) => ({ ...proposal, id: "no-debe-ocurrir" }));
  const findCurrentByMoment = vi.fn(async () => null);
  const findVersionsByMoment = vi.fn(async () => []);
  const findByLeadId = vi.fn(async () => []);

  const proposalDraftingPort: ProposalDraftingPort = { draft };
  const proposalRepository: ProposalRepository = {
    save,
    findCurrentByMoment,
    findVersionsByMoment,
    findByLeadId
  };

  return {
    deps: { proposalDraftingPort, proposalRepository } satisfies GenerateProposalDeps,
    draft,
    repositoryCalls: [save, findCurrentByMoment, findVersionsByMoment, findByLeadId]
  };
}

/**
 * Entrada canónica de COM-07 §6, **con todos los campos opcionales presentes**:
 * es la forma más ancha que el contrato admite, y por tanto la que revela
 * cualquier campo de más.
 */
function input(): GenerateProposalInput {
  return {
    lead: "lead-proposal-1",
    diagnosis: {
      // **El `CommercialState` viaja como valor de BD-1**, que es el único lugar
      // donde existe (BD-I4 · COM-14 §4.1).
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
          kind: "contacto_publico",
          statement: "El negocio publica un teléfono de contacto",
          source: Object.freeze({ observation: "atributo_de_empresa", source: "google-places" })
        })
      ])
    },
    sequence: {
      moment: "Evidencia",
      previousThread: "qué hace que un cliente elija a un competidor",
      previousContribution: ["se reconoció la categoría del negocio"],
      previousOutcome: { responded: false }
    }
  };
}

describe("GenerateProposal · estructura (Sprint 10 · Fase 1)", () => {
  // ── 1 · NO DEPENDE DE REPOSITORIOS AJENOS ─────────────────────────────────

  it("no accede a ninguna dependencia fuera de las dos aprobadas (COM-09 §6 · AL-08)", () => {
    const { deps } = spies();
    const accessed: string[] = [];

    const guarded = new Proxy(deps as unknown as Record<string, unknown>, {
      get(target, property) {
        if (typeof property === "string") {
          if (!APPROVED_DEPS.includes(property)) {
            throw new Error(`dependencia no aprobada: ${property}`);
          }
          accessed.push(property);
        }
        return Reflect.get(target, property);
      }
    });

    expect(() => createGenerateProposal(guarded as unknown as GenerateProposalDeps)).not.toThrow();
    expect(accessed.sort()).toEqual(APPROVED_DEPS);
  });

  it("un diagnóstico o una secuencia no se buscan: entran como dato (ADR-15 §12)", async () => {
    // Sin dobles de `domain/`: la ejecución muere en la decisión de estrategia
    // (B-1), y aun así **ningún repositorio se toca**.
    const { deps, repositoryCalls } = spies();
    const generateProposal = createGenerateProposal(deps);

    await generateProposal(input()).catch(() => undefined);

    // El único repositorio que conoce es el de su propio activo (A-6), y esta
    // fase no lo usa. Ninguno de diagnóstico ni de secuencia existe siquiera.
    for (const call of repositoryCalls) expect(call).not.toHaveBeenCalled();
  });

  // ── 3 · LA ENTRADA, EN EJECUCIÓN ──────────────────────────────────────────

  it("la entrada tiene exactamente los cuatro campos de COM-07 §6 · COM-15", () => {
    expect(Object.keys(input()).sort()).toEqual(["diagnosis", "evidence", "lead", "sequence"]);
  });

  it("COM-07 §4.2 — no recibe la estrategia: la produce domain/", () => {
    expect(Object.keys(input())).not.toContain("strategy");
    expect(Object.keys(input())).not.toContain("commercialStrategy");
  });

  it("COM-15 §3 — no recibe la versión del criterio: la sella domain/", () => {
    // Recibirla permitiría **decidir bajo un criterio y sellar con otro**, sin
    // que nada pudiera detectarlo (RC-13 · ADR-15 §7.2).
    expect(Object.keys(input())).not.toContain("criteriaVersion");
  });

  it("COM-07 §2.2 · COM-14 §4.1 — el diagnóstico entra sin indicios y sin estado suelto", () => {
    const { diagnosis } = input();
    expect(Object.keys(diagnosis).sort()).toEqual(["confidence", "variables"]);
    for (const variable of diagnosis.variables) {
      expect(Object.prototype.hasOwnProperty.call(variable, "indicios")).toBe(false);
    }
    // **BD-I4** — el `CommercialState` es la variable BD-1, no un campo aparte.
    expect(Object.keys(diagnosis)).not.toContain("commercialState");
    expect(diagnosis.variables.find((v) => v.id === "BD-1")?.value).toBe(
      "Consciente del Problema"
    );
  });

  it("BD-I2 — ninguna variable Desconocida trae valor, y nada lo rellena", () => {
    const desconocida = input().diagnosis.variables.find((v) => v.knowledgeClass === "Desconocida");
    expect(desconocida).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(desconocida!, "value")).toBe(false);
  });

  it("COM-07 §5.2 · COM-16 — la secuencia no lleva canal, estrategias ni número", () => {
    const { sequence } = input();
    expect(Object.keys(sequence).sort()).toEqual(
      ["moment", "previousContribution", "previousOutcome", "previousThread"]
    );
    expect(Object.keys(sequence)).not.toContain("channel");
    expect(Object.keys(sequence)).not.toContain("strategy");
    // COM-16 §5.1 — pertenece a la identidad de A-12; ninguna decisión lo consume.
    expect(Object.keys(sequence)).not.toContain("sequenceNumber");
  });

  it("COM-16 §5.5 — el resultado declarado entra sin la manifestación del comprador", () => {
    const { previousOutcome } = input().sequence;
    expect(previousOutcome).toBeDefined();
    expect(Object.keys(previousOutcome!)).toEqual(["responded"]);
    // Texto libre del comprador sería **una segunda vía hacia lo afirmable** (RE-1).
    expect(Object.keys(previousOutcome!)).not.toContain("manifestation");
  });

  it("RE-1 · RA-4 — la lista de hechos llega cerrada y ninguna capa la amplía", () => {
    const { evidence } = input();
    const size = evidence.facts.length;
    expect(() => {
      (evidence.facts as unknown[]).push({ lead: "x", kind: "presencia_web", statement: "añadido", source: {} });
    }).toThrow();
    expect(evidence.facts).toHaveLength(size);
  });

  // ── ALCANCE DE LA FASE ────────────────────────────────────────────────────

  it("B-1 — sin estrategia no hay redacción: el orden lo impide", async () => {
    const { deps, draft } = spies();
    const generateProposal = createGenerateProposal(deps);

    // `selectStrategy` real: lanza mientras `SP-01` no se publique. Que la
    // redacción no llegue a ocurrir **no es una comprobación del algoritmo de
    // estrategia**, sino del orden: redactar antes de decidir sería redactar sin
    // decisión que materializar (APS-18 §10.1).
    await expect(generateProposal(input())).rejects.toThrow(/Perfil de Estrategia/);
    expect(draft).not.toHaveBeenCalled();
  });

  it("B-2 · R-52 — el módulo no publica ninguna constante operativa", () => {
    // Los tipos se borran al compilar: lo que queda en tiempo de ejecución es
    // **todo lo que el módulo declara como valor**. Que sea solo la fábrica
    // prueba que no se coló un número de reintentos, un valor por defecto ni
    // ningún otro parámetro sin autoridad (COM-11 §4.4).
    expect(Object.keys(generateProposalModule)).toEqual(["createGenerateProposal"]);
  });
});
