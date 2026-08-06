// Orchestrator de la Propuesta Comercial — **el compositor de la entrada**.
//
// POR QUÉ EXISTE — **`GenerateProposal` no busca información: toda le llega
// preparada** (ADR-15 §12 · COM-07 §1), y las tres fuentes que necesita viven
// repartidas. **ADR-04 §7.6 prohíbe que un agente conozca o invoque a otro**, de
// modo que **este es el único componente que puede reunirlas**.
//
// FRONTERAS QUE RESPETA
//   · **R-10 — no contiene lógica de negocio.** No decide estrategia, no
//     interpreta el diagnóstico, no elige el momento y no toca los hechos:
//     **copia y compone un sobre**.
//   · **R-07 — `presentation/` es la única superficie del módulo que conoce.**
//     Las tres operaciones que usa —las dos lecturas y la emisión— entran por la
//     Agent API. **No invoca `application/`**, que es lo que DEV-00 v1.3 corrigió
//     su propio diagrama para impedir (COM-30).
//   · **R-24 — no conoce persistencia.** Ningún repositorio, ningún adapter.
//   · R-08 — no conoce HTTP · R-09 — no conoce DTO públicos ni mappers.
//   · **No importa `domain/`**: los valores llegan de la Agent API y se copian;
//     los tipos se infieren (COM-26 §4.3).
//
// ── LA ÚNICA TRANSFORMACIÓN, Y ES UN SOBRE ───────────────────────────────────
//
// `evidence` se compone con **el Lead de la petición y los hechos que
// `runCommercialFacts` produce**. Nada más entra ahí.
//
// **El diagnóstico NO alimenta la lista cerrada.** Sumarlo abriría **una segunda
// vía** hacia lo afirmable —la que COM-07 §2.2 cerró al excluir los indicios—, y
// **una lista con dos orígenes deja de ser cerrada de forma verificable**
// (RE-1). Sus variables son lecturas: **lo inferido orienta el enfoque y nunca
// se afirma** (RE-2).

import { InputError } from "../shared/errors";
import { PitchGeneratorAgentApi } from "../modules/pitch-generator/presentation/pitchGeneratorAgent";
import { RunCommercialFactsFn } from "./commercialFactsOrchestrator";
import { GenerateProposalResult } from "../modules/pitch-generator/application/generateProposal";

/**
 * **Dos dependencias.** El tipo del resultado se importa de `application/`
 * —como hacen sus hermanos con `CreateSequenceResult`—, pero **ninguna función
 * de esa capa se invoca**: la distinción que R-07 protege es entre *nombrar un
 * tipo* y *usar la capa*.
 */
export interface CommercialProposalDependencies {
  pitchGeneratorAgent: PitchGeneratorAgentApi;
  /** La fuente autorizada de evidencia. **Un workflow, no un agente**: quien
   *  conoce a los tres agentes es él, y es el único que puede (R-11). */
  runCommercialFacts: RunCommercialFactsFn;
}

export type RunCommercialProposalFn = (leadId: string) => Promise<GenerateProposalResult>;

export function createCommercialProposal(
  deps: CommercialProposalDependencies
): RunCommercialProposalFn {
  const { pitchGeneratorAgent, runCommercialFacts } = deps;

  return async function runCommercialProposal(
    leadId: string
  ): Promise<GenerateProposalResult> {
    // Las tres en paralelo: son independientes y ninguna depende de otra.
    const [sequence, diagnosis, facts] = await Promise.all([
      pitchGeneratorAgent.readReducedSequence(leadId),
      pitchGeneratorAgent.readReducedDiagnosis(leadId),
      runCommercialFacts(leadId)
    ]);

    // ── SIN SECUENCIA NO HAY CONTACTO QUE PREPARAR ──────────────────────────
    //
    // **Sin secuencia no hay momento; sin momento no hay identidad de emisión**
    // —`(Lead, momento, número de emisión)`, ADR-16 §4.4—. La petición **no
    // designa ningún contacto**, de modo que no hay nada que emitir ni desenlace
    // que devolver.
    //
    // **No es una regla de negocio**: no se decide si conviene proponer, se
    // comprueba que el objeto al que la petición se refiere existe. Es un error
    // de entrada —*«los datos recibidos no permiten ejecutar la operación… es
    // responsabilidad de quien invoca»* (APS-03 §12)— y **se lanza**, con el
    // precedente de `MissingCriteriaVersionError` (AL-16 · R-62).
    //
    // **CS-I4 · RC-7** lo confirman: ningún momento se emite sin acción del
    // usuario **para ese contacto concreto**. Si el usuario actuó, la secuencia
    // existe por construcción.
    if (sequence === null) {
      throw new InputError(
        `El Lead ${leadId} no tiene un contacto en curso: sin secuencia comercial vigente ` +
          "no existe momento al que referir una propuesta."
      );
    }

    // ── SIN DIAGNÓSTICO VIGENTE ─────────────────────────────────────────────
    //
    // **Es un desenlace del negocio, y COM-09 §7 ya lo definió**: la rama
    // `diagnosis_missing`. Se devuelve **la misma que devolvería el caso de
    // uso**, con el mismo vocabulario: **no se crea ningún estado nuevo**.
    //
    // No se invoca `GenerateProposal` porque **la entrada no puede componerse**:
    // su contrato declara el diagnóstico obligatorio. Forzar el tipo para
    // alcanzar la rama sería mentirle al compilador.
    if (diagnosis === null) return { outcome: "diagnosis_missing" };

    // ── COMPOSICIÓN ─────────────────────────────────────────────────────────
    //
    // **Tres copias y un sobre.** Nada se completa, se filtra ni se reordena:
    // el recorte ya lo decidió `domain/` y los hechos llegan cerrados
    // (RE-1 · RA-4).
    return pitchGeneratorAgent.generateProposal({
      lead: leadId,
      diagnosis,
      sequence,
      // La única derivación: el Lead de la petición y **los hechos, tal cual**.
      evidence: { lead: leadId, facts }
    });
  };
}
