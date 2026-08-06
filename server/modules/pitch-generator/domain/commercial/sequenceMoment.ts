// Momento de la secuencia — Value Object.
//
// Autoridad: **APS-18 §9.2**. Owner: Pitch Generator.
// Sinónimos prohibidos por DDD-01 §8: `Paso`, `Touchpoint`, `Toque`.

/**
 * Los seis momentos de APS-18 §9.2. **Conjunto cerrado y ordenado.**
 *
 * | # | Momento | Objetivo | Barrera | Nunca hace |
 * | --- | --- | --- | --- | --- |
 * | 1 | Reconocimiento | Que lea y se reconozca | Identidad · Relevancia | Proponer nada. Pedir nada |
 * | 2 | Evidencia | Que responda | Credibilidad | Insistir. Retoma el hilo del 1 |
 * | 3 | Demostración | Que acepte ver algo | Relevancia aplicada | Pedir reunión. Hablar de precio |
 * | 4 | Oferta | Que acepte hablar | Riesgo | Presionar. Poner plazos falsos |
 * | 5 | Seguimiento | Recuperar la atención | Momento | Repetir el contacto anterior |
 * | 6 | Reactivación | Reabrir mucho después | Momento | Reiniciar la misma secuencia |
 *
 * **La correspondencia momento → objetivo y momento → barrera la decide
 * APS-18 §9.2**, no esta declaración: aquí solo se nombra el conjunto.
 *
 * **CS-I4 · RC-7** — ningún momento se emite sin acción del usuario **para ese
 * contacto concreto**. **CS-I6 · RC-8** — ningún disparador temporal, en
 * ninguna capa.
 */
export type SequenceMoment =
  | "Reconocimiento"
  | "Evidencia"
  | "Demostración"
  | "Oferta"
  | "Seguimiento"
  | "Reactivación";
