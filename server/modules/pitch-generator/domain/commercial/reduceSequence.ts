// **La reducción de la secuencia** — `domain/`.
//
// Autoridad: **COM-16**. Owner: Pitch Generator.
//
// Vive aquí, y no en `application/` ni en el Orchestrator, por la misma razón
// que `reduceDiagnosis`: **decidir qué puede saber un contacto de los anteriores
// es una decisión**, y **D-1 · RA-1** sitúan en el dominio todo lo que decide.
//
// Es un **cálculo puro, sin I/O** (DEV-00 §5.4). **No importa persistencia y no
// conoce ningún adapter.**
//
// ── LA ENTRADA ES DELIBERADAMENTE ESTRECHA ───────────────────────────────────
//
// `SequenceReading` declara **solo los campos que la proyección lee**, y esa
// estrechez es la garantía: `status`, `proposals`, la `evidenceBase` de las
// estrategias anteriores y la **manifestación del comprador** no pueden filtrarse
// **porque no entran** (COM-16 §5). No hay que recordar excluirlos.
//
// La forma la satisfacen tanto el agregado de dominio como el almacenado, sin
// que este fichero conozca ninguno de los dos.

import { RelevanceElement, Thread } from "./commercialStrategy";
import { ReducedDeclaredOutcome, ReducedSequence } from "./reducedSequence";
import { SequenceMoment } from "./sequenceMoment";

/** Lo único que la proyección necesita de la estrategia de un contacto anterior. */
export interface PlannedMomentReading {
  readonly moment: SequenceMoment;
  /** Ausente mientras el contacto no se haya usado: la estrategia se decide **antes de usar** (SC-R1). */
  readonly strategy?: {
    readonly openedThread?: Thread;
    readonly relevanceElement: RelevanceElement;
  };
  /** Ausente mientras el usuario no declare nada (CE-I2). */
  readonly declaredOutcome?: { readonly responded: boolean };
}

export interface SequenceReading {
  readonly plan: readonly PlannedMomentReading[];
  /** Ausente mientras la secuencia no se haya iniciado (ADR-16 §4.3). */
  readonly currentMoment?: SequenceMoment;
}

/**
 * Proyecta la secuencia sobre lo que el contacto que toca puede saber.
 *
 * **`null` cuando no hay contacto que preparar**: sin momento vigente no hay
 * nada que redactar, y **APS-18 §9.1** describe la secuencia como *«una
 * estrategia con memoria»* — sin contacto en curso, la memoria no tiene destino.
 *
 * **El resultado se congela**, como en `reduceDiagnosis`: cierra la vía por la
 * que un consumidor podría reponer el número de secuencia o la manifestación que
 * COM-16 §5.1 y §5.5 excluyen.
 */
export function reduceSequence(reading: SequenceReading): ReducedSequence | null {
  const { currentMoment, plan } = reading;
  if (currentMoment === undefined) return null;

  const index = plan.findIndex((planned) => planned.moment === currentMoment);
  // Un momento vigente que no pertenece a su propio plan **no es un estado que
  // esta proyección pueda leer**: no se inventa una lectura para él.
  if (index === -1) return null;

  const previous = plan.slice(0, index);
  const immediate = previous[previous.length - 1];

  const reduced: {
    moment: SequenceMoment;
    previousThread?: Thread;
    previousContribution: readonly RelevanceElement[];
    previousOutcome?: ReducedDeclaredOutcome;
  } = {
    moment: currentMoment,
    previousContribution: Object.freeze(contributionsOf(previous))
  };

  // **CA-08 — el hilo que retoma es el que dejó planteado *el anterior*.** No
  // el de dos contactos atrás: la regla es explícita y singular.
  if (immediate?.strategy?.openedThread !== undefined) {
    reduced.previousThread = immediate.strategy.openedThread;
  }

  // **SC-R4 — el silencio es información.** Solo `responded`: la manifestación
  // del comprador no cruza (COM-16 §5.5), y su efecto ya llega por el
  // diagnóstico (CE-I3).
  if (immediate?.declaredOutcome !== undefined) {
    reduced.previousOutcome = Object.freeze({ responded: immediate.declaredOutcome.responded });
  }

  return Object.freeze(reduced);
}

/**
 * Lo que aportaron los contactos anteriores, **en el orden del plan**.
 *
 * ⚠️ **Se transportan todos, y eso no decide la política de memoria.**
 * **COM-16 §8.2** dejó abierto si un contacto puede repetir lo dicho tres
 * contactos atrás —APS-18 §9.3, CA-21 y CA-25 hablan del *anterior*; COM-07 §5.1,
 * de *los anteriores*—, y esa decisión pertenece al **Product Office**.
 *
 * **Transportar no es filtrar.** Recortar aquí a un solo elemento **cerraría** la
 * decisión abierta: haría inaplicable la lectura plural. Entregar la memoria
 * completa la deja viva, y **quién la usa y hasta dónde lo decide la estrategia**,
 * que es donde SC-R3 se aplica.
 *
 * Los momentos sin estrategia no aportan nada: no se usaron todavía (SC-R1).
 */
function contributionsOf(previous: readonly PlannedMomentReading[]): RelevanceElement[] {
  return previous
    .filter((planned) => planned.strategy !== undefined)
    .map((planned) => planned.strategy!.relevanceElement);
}
