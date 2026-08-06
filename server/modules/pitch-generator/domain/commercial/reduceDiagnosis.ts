// **La reducción del diagnóstico** — `domain/`.
//
// Autoridad: **COM-14 §2.2**. Owner: Pitch Generator.
//
// Vive aquí, y no en `application/` ni en el Orchestrator, porque **recortar un
// diagnóstico es decidir qué puede alcanzar al mensaje** — y **D-1 · RA-1**
// sitúan en el dominio todo lo que decide. Hacerlo fuera sería la fuga que
// **RA-R1 · RC-3** declaran la más probable de la arquitectura comercial.
//
// Es un **cálculo puro, sin I/O** (DEV-00 §5.4), hermano de
// `generateAffirmableFacts`: la misma emisión produce siempre la misma lectura
// reducida, que es lo que COM-14 §2.3 exige como reproducibilidad.
//
// ── QUÉ QUITA, Y POR QUÉ ─────────────────────────────────────────────────────
//
//   · **Los indicios** — COM-14 §4.2. APS-19 §4.1 dice que *«el indicio es un
//     hecho»*, luego podrían afirmarse, y admitirlos abriría **una segunda vía**
//     hacia la lista cerrada junto a la proyección: **una lista con dos orígenes
//     deja de ser cerrada de forma verificable** (RE-1). **Justifican la lectura;
//     no alimentan el mensaje.**
//   · **Todo lo demás del agregado** —identidad, número de emisión, versión del
//     criterio y marca temporal— porque **ninguna decisión de la estrategia lo
//     consume** y F-8 prohíbe los campos que no participan en una decisión.
//
// **No añade nada, no recalcula nada y no combina nada.** Copia lo que el
// diagnóstico emitió, y por eso la trazabilidad se conserva: cada variable llega
// con **su clase de conocimiento**, que es lo que declara qué se sabe y qué no
// (CD-01).

import { BuyerReading } from "./diagnoseBuyer";
import { ReducedDiagnosis, ReducedDiagnosisVariable } from "./reducedDiagnosis";

/**
 * Proyecta la emisión vigente sobre lo que una propuesta puede leer.
 *
 * **El resultado se congela.** No lo exige ninguna regla, pero lo hace su
 * hermana `generateAffirmableFacts`, y aquí cierra una vía concreta: **nadie
 * puede reponer `commercialState` como campo suelto** después de la reducción.
 * **BD-I4** sostiene que el `CommercialState` **es la variable BD-1**, y su
 * valor viaja dentro de `variables` — que es el único lugar donde existe.
 */
export function reduceDiagnosis(reading: BuyerReading): ReducedDiagnosis {
  const variables = reading.variables.map(toReducedVariable);

  return Object.freeze({
    variables: Object.freeze(variables),
    confidence: reading.confidence
  });
}

/**
 * Una variable, recortada.
 *
 * **`value` ausente sigue ausente** (BD-I2 · R-38): una variable `Desconocida`
 * **no tiene valor**, y asignarlo incondicionalmente introduciría la propiedad
 * con `undefined` — con lo que *«no consta»* pasaría a ser *«consta vacío»*, que
 * es justo la distinción que R-38 protege.
 *
 * **`indicios` no se copia y no existe destino para él**: `ReducedDiagnosisVariable`
 * no lo declara.
 */
function toReducedVariable(variable: BuyerReading["variables"][number]): ReducedDiagnosisVariable {
  const reduced: ReducedDiagnosisVariable = {
    id: variable.id,
    knowledgeClass: variable.knowledgeClass
  };

  if (variable.value !== undefined) {
    return Object.freeze({ ...reduced, value: variable.value });
  }

  return Object.freeze(reduced);
}
