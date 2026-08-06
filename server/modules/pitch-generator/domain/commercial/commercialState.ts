// Commercial State — Value Object.
//
// Autoridad: **APS-18 §7**. Desarrollado como variable BD-1 en APS-19 §5.
// Owner: Pitch Generator (DDD-01 §4.2).
//
// ⚠️ **No es un estadio del ciclo de vida del Lead y no es un campo del Lead.**
// **BD-I4: el Commercial State es la variable BD-1 del diagnóstico**, no un campo
// aparte (ADR-16 §4.2). **LS-5: son dos ejes independientes** — el estadio
// describe lo que AKVEZ ha hecho con el Lead; el Commercial State, lo que el
// comprador sabe. Un Lead puede ser `Scored` y su comprador *Inconsciente* a la
// vez (PO-02 LS-5).
//
// Sinónimos **prohibidos** por DDD-01 §8: `Buying Stage`, `Estado del Lead`,
// `LeadStatus`. Confundirlos es el riesgo R-6 de ADR-16.

/**
 * Los cinco estados de APS-18 §7.2. **Conjunto cerrado y ordenado.**
 *
 * ```
 * Inconsciente → Consciente del Problema → Consciente de la Solución
 *              → Consciente del Proveedor → Conversación
 * ```
 *
 * Reglas de APS-18 §7.4, transcritas en DDD-01 §6.4:
 * - **CS-R1 · CS-R2** — puede **retroceder** y puede **detenerse indefinidamente**.
 * - **CS-R3** — solo avanza con evidencia. Un contacto enviado no lo avanza; lo
 *   avanza **la reacción del comprador**.
 * - **CS-R4** — **puede ser desconocido**. Un Lead nunca contactado tiene un
 *   estado indeterminado, y eso es correcto. Se representa como la clase de
 *   conocimiento `Desconocida` de la variable BD-1, nunca con un valor por
 *   defecto (BD-R2 · R-38).
 *
 * **APS-18 §7.5** — ningún Commercial State condiciona que un Lead pueda ser
 * contactado. El sistema puede recomendar detener una secuencia; **nunca puede
 * excluir un Lead**.
 */
export type CommercialState =
  | "Inconsciente"
  | "Consciente del Problema"
  | "Consciente de la Solución"
  | "Consciente del Proveedor"
  | "Conversación";
