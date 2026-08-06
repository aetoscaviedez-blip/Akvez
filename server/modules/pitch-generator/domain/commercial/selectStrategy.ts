// **La decisión de estrategia** — `domain/`.
//
// Autoridad: **ADR-16 §7** (*«qué decide `domain/`: la estrategia · la lista
// cerrada · el punto de control»*) · **APS-18 §8** (qué contiene una estrategia)
// · **ADR-15 §7.2** (es determinista).
//
// Vive aquí porque **D-1 · RA-1**: todo lo que decide, en el dominio. Decidirla
// en `application/` o recibirla ya hecha sería **la fuga que RA-R1 y RC-3
// declaran la más probable de toda la arquitectura comercial**.
//
// Es un **cálculo puro, sin I/O** (DEV-00 §5.4), como `diagnoseBuyer` y
// `designSequence`: recibe todo lo que necesita y no busca nada.
//
// ── ⛔ NO IMPLEMENTADA · BLOQUEO B-1 ─────────────────────────────────────────
//
// **TODO(B-1 · COM-11 §3.2) — transcribir el Perfil de Estrategia cuando `SP-01`
// se publique.** No es una tarea de ingeniería pendiente: es un bloqueo de
// gobernanza cuyo propietario es el **Product Office** (COM-10 §6 · COM-11 §1).
//
// **Qué falta exactamente**, según COM-11 §3.2 — tres correspondencias, y solo
// esas tres, porque *«casi todo lo que un contacto necesita ya está publicado y
// es invariable»* (§3.1):
//
//   · **C-3a** — `CommercialState` (BD-1) → **punto de entrada**. APS-18 §7.2
//     describe qué necesita cada estado para avanzar, pero **no dice por qué
//     momento entrar** cuando el comprador ya está avanzado.
//   · **C-3b** — `BD-7` identidad profesional → **enfoque**. APS-19 §6.7 dice que
//     BD-7 determina *«qué se reconoce antes de observar nada crítico»*; **qué se
//     reconoce en cada caso no está publicado**.
//   · **C-3c** — objetivo del momento → **forma del resultado esperado**.
//     APS-18 §5.2 lo exige observable y binario; **falta la correspondencia
//     sistemática**.
//
// **Y qué NO debe hacerse aquí cuando se implemente** (COM-11 §3.3): ampliar o
// completar las correspondencias, generar o derivar la designación de la versión,
// ni editar una publicada. **Este fichero transcribirá; no decidirá** — con la
// cabecera declarativa del precedente `weightingProfile.ts`.
//
// **Por qué no se implementa con `SIN-PERFIL-DE-ESTRATEGIA`:** sin versión del
// Perfil la estrategia **no es reproducible** (ADR-15 §7.2), y **P-I1** dice que
// sin estrategia explicable una `Proposal` *«no puede explicarse después, que es
// exactamente lo que la hace útil»*. **No serían propuestas peores: serían
// propuestas que nadie puede explicar**, y ADR-18 §10.4 propone no reetiquetarlas
// — el defecto sería **permanente** (COM-10 §5).
//
// **No existe estrategia por defecto** (RC-10 · BD-R2 · R-38 · COM-11 §2.2), y
// **es el atajo natural si se implementa sin Perfil**: por eso esta función no
// devuelve una estrategia mínima, ni parcial, ni marcada como provisional.

import { ClosedFactList } from "./evidence";
import { CommercialStrategy } from "./commercialStrategy";
import { ReducedDiagnosis } from "./reducedDiagnosis";
import { ReducedSequence } from "./reducedSequence";
import { StrategyProfileUnavailableError } from "./proposalErrors";

/**
 * Todo lo que la decisión necesita, **y nada que haya que ir a buscar**.
 *
 * Los tres elementos son los que COM-07 admite en la entrada del caso de uso,
 * salvo `lead` —la identidad no decide nada— y con `evidence` reducida a su
 * lista: **la estrategia se apoya en los hechos, no en el sobre que los trae**.
 *
 * ⚠️ **La versión del criterio no entra, y no puede entrar** (COM-15 §3).
 * **El criterio se transcribe aquí junto a su designación**, igual que
 * `weightingProfile.ts` transcribe los pesos y su `version`: recibirla por
 * argumento permitiría **decidir bajo un criterio y sellar la emisión con otro**,
 * y **nada en el sistema podría detectarlo** — con ello **RC-13 y ADR-15 §7.2
 * dejarían de ser verificables**.
 */
export interface StrategySelectionInput {
  readonly diagnosis: ReducedDiagnosis;
  readonly sequence: ReducedSequence;
  /** La base de evidencia de la estrategia (APS-18 §8.1 · §11). */
  readonly facts: ClosedFactList;
}

/**
 * Decide los diez contenidos de APS-18 §8.1 para **un** contacto.
 *
 * ⛔ **No implementada.** Ver el bloqueo B-1 en la cabecera. Lanza en lugar de
 * devolver algo: **un caso de uso que no puede decidir no debe emitir**, y una
 * rama de resultado haría pasar por situación de negocio lo que es una decisión
 * de producto pendiente (AL-16 · R-62).
 */
export function selectStrategy(input: StrategySelectionInput): CommercialStrategy {
  void input;
  throw new StrategyProfileUnavailableError(
    "La decisión de estrategia exige el Perfil de Estrategia publicado (SP-01, bloqueo B-1). " +
      "No existe estrategia por defecto: ver COM-11 §3.2."
  );
}
