// Resultado declarado y Manifestación del comprador — Value Objects.
//
// Autoridad: **APS-18 §9.5** (el resultado) y **APS-19 §4.3** (la manifestación).
// **Owner: el usuario.** Nunca un agente (DDD-01 §4.2 · APS-09 §9).
//
// Viven en fichero propio, y no dentro de `ContactEvent`, porque la
// `CommercialSequence` también los conserva por contacto (ADR-16 §4.3) y una
// entidad no debe importar a otra para nombrar un valor.

/**
 * **Manifestación del comprador** — lo que el comprador dijo.
 *
 * **Convierte una variable en `Observable` y prevalece sobre toda lectura
 * inferida** (APS-19 §4.3 · CE-I3). *«Si una manifestación del comprador
 * contradice una lectura inferida, prevalece la manifestación, sin excepción.»*
 * La lectura anterior **no se borra: se sustituye y queda constancia**.
 *
 * Sinónimos prohibidos por DDD-01 §8: `Respuesta`, `Feedback` — *Respuesta* no
 * distingue entre **responder** y **manifestar algo aprovechable**, que es
 * exactamente la distinción de la que depende la condicionalidad de E-9.
 */
export type BuyerManifestation = string;

/**
 * **Resultado declarado** — lo que el usuario declara que ocurrió.
 *
 * **La declaración mínima es binaria: respondió / no respondió** (APS-18 §9.5).
 * Por eso `responded` es un booleano y no una enumeración: es el único dato que
 * el Blueprint exige, y **sin declaración la secuencia no avanza**.
 *
 * La tercera situación de ADR-16 §6.1 —«respondió con manifestación»— **no es un
 * tercer valor**: es la presencia de `manifestation`. Modelarla como un valor
 * más permitiría declarar una manifestación sin respuesta, que es un estado
 * imposible.
 *
 * | Lo que el usuario declara | Efecto (ADR-16 §6.1) |
 * | --- | --- |
 * | No respondió | Actualiza la secuencia y el historial. **No versiona** |
 * | Respondió, sin contenido aprovechable | Actualiza el estadio, la secuencia y el historial. **No versiona** |
 * | Respondió con manifestación | Además **versiona el `BuyerDiagnosis`** (CE-I3) |
 */
export interface DeclaredOutcome {
  responded: boolean;
  /** Presente solo si el comprador manifestó algo aprovechable. */
  manifestation?: BuyerManifestation;
}
