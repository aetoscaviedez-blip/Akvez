// Lo que la secuencia aporta al contacto que toca.
//
// Autoridad: **COM-16** *(el contrato)* · **COM-07 §5** *(qué autoriza)*.
// Owner: Pitch Generator.
//
// ⚠️ **No es `CommercialSequence` (A-12) y no lo sustituye.** Entra como dato;
// **no se busca** (ADR-15 §12). **APS-18 §9.1** — una secuencia *«no es una
// lista de mensajes: es una estrategia con memoria»*: **este contrato transporta
// la memoria, nunca las decisiones**.
//
// Vive en `domain/` por la misma razón que `reducedDiagnosis.ts`: lo consume la
// decisión de estrategia, que es `domain/` (ADR-16 §7).

import { RelevanceElement, Thread } from "./commercialStrategy";
import { SequenceMoment } from "./sequenceMoment";

/**
 * El resultado declarado del contacto anterior, **reducido a su declaración
 * mínima** (APS-18 §9.5 · COM-16 §5.5).
 *
 * ⚠️ **No reutiliza `DeclaredOutcome` y no puede reutilizarlo**: aquel transporta
 * la **manifestación del comprador**, texto libre que sería **contenido
 * enunciable ajeno a la proyección** — una segunda vía hacia lo que un contacto
 * puede afirmar, y **RE-1** exige origen único y verificable.
 *
 * **No se pierde nada que decida:** una manifestación **convierte una variable en
 * `Observable` y prevalece sobre toda lectura inferida** (APS-19 §4.3 · CE-I3),
 * y ese efecto **llega por el diagnóstico** — E-9 versiona A-11.
 *
 * **`responded` es binario porque es el único dato que el Blueprint exige**
 * (APS-18 §9.5), y con él se conserva **SC-R4 — el silencio es información**.
 */
export interface ReducedDeclaredOutcome {
  readonly responded: boolean;
}

/**
 * ⚠️ **No lleva canal, y no puede llevarlo** (COM-07 §5.2): elegir canal es
 * **contenido de la estrategia**, no del plan (APS-18 §8.1 · CM-3), y
 * `PlannedMoment` no tiene campo de canal **por diseño** (Sprint 03).
 *
 * ⚠️ **Tampoco lleva estrategias, ni la del contacto actual ni la de los
 * anteriores** (COM-16 §5.3 · §7.1). **SC-R1** — la estrategia se decide **antes
 * de usar** cada contacto, no al planificar; y una `CommercialStrategy` completa
 * arrastraría su `evidenceBase`, que es **una `ClosedFactList`**: un segundo
 * origen de hechos afirmables que no produjo la proyección **(RE-1)**. Lo que
 * viaja son **dos extracciones de texto**, nunca un objeto de decisión.
 *
 * ⚠️ **Y no lleva el número de secuencia** (COM-16 §5.1): pertenece a la
 * identidad de A-12 *(ADR-16 §4.3)*, **ninguna decisión de la propuesta lo
 * consume** y el número de emisión sale del historial de A-6. **F-8 — ninguno
 * está «por si acaso».**
 */
export interface ReducedSequence {
  /** Determina objetivo y barrera (APS-18 §9.2). **La única decisión comercial
   *  que entra, y ya está tomada**: se obedece; no se revisa. */
  readonly moment: SequenceMoment;
  /** El hilo que dejó planteado el contacto anterior; el siguiente lo retoma (§4.6 · CA-08). */
  readonly previousThread?: Thread;
  /**
   * Qué aportaron los contactos anteriores. **SC-R3 — ningún contacto repite al
   * anterior; si no aporta algo nuevo, no se emite** (APS-18 §9.3). Lista vacía
   * en el primer contacto: no hay nada que no repetir.
   *
   * **Hasta dónde alcanza esta memoria —el contacto inmediatamente anterior o
   * todos— no está decidido** (COM-16 §8.2): es una política de llenado que
   * pertenece a APS-18, y la forma de lista admite ambas.
   */
  readonly previousContribution: readonly RelevanceElement[];
  /**
   * Resultado declarado del contacto anterior. **SC-R4 — el silencio es
   * información**: indica qué barrera no se rompió, y **no autoriza a subir la
   * presión**. Ausente mientras el usuario no declare nada (CE-I2).
   */
  readonly previousOutcome?: ReducedDeclaredOutcome;
}
