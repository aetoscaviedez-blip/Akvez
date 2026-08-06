// El diagnóstico vigente **recortado a lo que una propuesta puede leer**.
//
// Autoridad: **COM-14** *(el contrato)* · **COM-07 §2** *(qué autoriza)*.
// Owner: Pitch Generator.
//
// ⚠️ **No es `BuyerDiagnosis` (A-11) y no lo sustituye.** Es el recorte que
// COM-07 §2.1 autoriza: llega **ya resuelto**, y la prohibición del Sprint 05
// —*«`GenerateProposal` no puede conocer `BuyerDiagnosis` internamente»*— se
// refería a **ir a buscarlo**: leer su repositorio o navegar su agregado
// (ADR-15 §12 · COM-07 §2, nota final).
//
// Vive en `domain/` porque **lo consume `domain/`**: la decisión de estrategia se
// toma aquí (ADR-16 §7) y no puede importar `application/`.

import { CommercialState } from "./commercialState";
import { DeclaredConfidence, DiagnosisVariableId } from "./diagnosisVariable";
import { KnowledgeClass } from "./knowledgeClass";

/**
 * Una variable del diagnóstico, recortada.
 *
 * **`indicios` no está declarado aquí y no puede añadirse** (COM-07 §2.2 ·
 * COM-14 §4.2): APS-19 §4.1 dice que *«el indicio es un hecho»*, luego podrían
 * afirmarse, y admitirlos abriría **una segunda vía** hacia la lista cerrada
 * junto a la proyección — **una lista con dos orígenes deja de ser cerrada de
 * forma verificable** (RE-1). Los indicios **justifican la lectura; no alimentan
 * el mensaje**.
 *
 * `value` ausente es ausente (BD-I2 · R-38): **ninguna variable `Desconocida`
 * tiene valor**, y nada lo rellena.
 *
 * **En BD-1 el valor es el `CommercialState`** (BD-I4), y es el único lugar
 * donde ese dato existe.
 */
export interface ReducedDiagnosisVariable {
  readonly id: DiagnosisVariableId;
  readonly knowledgeClass: KnowledgeClass;
  readonly value?: CommercialState | string;
}

/**
 * La lectura del comprador, tal como entra.
 *
 * **Lo inferido orienta el enfoque y nunca se afirma** (RE-2): que una lectura
 * viaje aquí no la convierte en enunciable — lo enunciable es la lista cerrada,
 * y solo eso.
 *
 * ⚠️ **No declara `commercialState`, y no puede declararlo** (COM-14 §4.1).
 * **BD-I4 (ADR-16 §4.2) es explícito: el `CommercialState` *es* la variable
 * BD-1, no un campo aparte** —por eso la entidad `BuyerDiagnosis` tampoco lo
 * declara—. Un campo hermano **duplicaría el valor de BD-1 sin que nada
 * impidiese que difirieran**, y cuál prevalece no lo decide ningún documento.
 * **El dato no se pierde: BD-1 lo lleva.**
 */
export interface ReducedDiagnosis {
  readonly variables: readonly ReducedDiagnosisVariable[];
  /** Cuánta evidencia aportar antes de proponer (APS-19 §7 · COM-07 §2.1). */
  readonly confidence: DeclaredConfidence;
}
