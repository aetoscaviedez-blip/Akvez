// Commercial Strategy y sus Value Objects componentes.
//
// Autoridad: **APS-18 §8** (qué es y qué contiene) · APS-18 §4.5, §4.6, §4.7,
// §5.1, §5.2, §8.5 (cada componente) · APS-20 §3.1 (el canal restringe después)
// · ADR-15 §7.2 (es determinista). Owner: Pitch Generator.
//
// ⚠️ **`Commercial Strategy` NO es una entidad.** ADR-16 §4 define cinco
// entidades y no la incluye; ARCH-01 §3 la sitúa expresamente como «parte de
// `Proposal`». **No tiene identidad propia, no se persiste por separado y ningún
// evento la escribe** (DDD-01 §3.6 · OBS-02). Confundirla con una entidad es el
// error frecuente que DDD-01 documenta.
//
// **Determinista por decisión** (ADR-15 §7.2): dado el mismo diagnóstico, el
// mismo estado y la misma versión del Perfil de Estrategia, produce la misma
// estrategia. **Es lo que la hace explicable y comparable, y la razón de que no
// viva en un prompt.**

import { Channel } from "./channel";
import { ClosedFactList } from "./evidence";
import { SequenceMoment } from "./sequenceMoment";

/**
 * **Micro-Yes** — el único avance que persigue un contacto (APS-18 §4.5).
 *
 * Escalera cerrada y ordenada:
 * `leer → reconocerse → responder → aceptar ver algo → aceptar hablar`.
 *
 * **Cada contacto persigue un solo avance y no salta ningún peldaño**, y el de
 * un contacto no dista más de un peldaño del anterior. Sinónimos prohibidos por
 * DDD-01 §8: `Objetivo múltiple`, `CTA`.
 */
export type MicroYes =
  | "leer"
  | "reconocerse"
  | "responder"
  | "aceptar ver algo"
  | "aceptar hablar";

/**
 * **Barrera** — la única resistencia que un contacto debe romper (APS-18 §5.1).
 *
 * Las cinco resistencias del comprador en frío, **siempre en este orden**:
 * `¿quién eres? → ¿esto es para mí? → ¿esto es verdad? → ¿por qué ahora? → ¿qué me cuesta?`
 *
 * **Una barrera por contacto.** Atacar varias produce un mensaje largo que no
 * rompe ninguna. Sinónimo prohibido: `Objeción` — una objeción se formula;
 * **una barrera existe antes de que nadie hable**.
 */
export type Barrier =
  | "Identidad"
  | "Relevancia"
  | "Credibilidad"
  | "Momento"
  | "Riesgo";

/**
 * **Emoción admisible** (APS-18 §8.5). Conjunto cerrado.
 *
 * **Miedo, vergüenza, culpa y presión temporal están excluidos por diseño.** No
 * son eficaces en contacto frío —producen bloqueo, no respuesta— y son
 * incompatibles con el Principio 10 de AF-00. **La exclusión es normativa, no
 * estilística.**
 */
export type AdmissibleEmotion =
  | "curiosidad"
  | "reconocimiento"
  | "comparación suave";

/**
 * **Hilo** — pregunta o asunto que un contacto **enuncia** y el siguiente
 * retoma (APS-18 §4.6). **Es respondible en cualquier momento.**
 *
 * Sinónimos prohibidos por DDD-01 §8: `Bucle`, `Loop`, `Gancho`. **`Bucle` fue
 * retirado del vocabulario en APS-18 v1.1**: era el vehículo léxico del
 * ocultamiento. **Nunca se genera interés mediante ocultamiento deliberado**, ni
 * se alude a un hallazgo sin enunciarlo (APS-18 §4.7 · Progressive Relevance).
 */
export type Thread = string;

/**
 * **Elemento de relevancia** — lo que un contacto aporta y el anterior no
 * contenía (APS-18 §4.7).
 *
 * **SC-R3** — ningún contacto repite al anterior. **Si no aporta algo nuevo, no
 * se emite.**
 */
export type RelevanceElement = string;

/**
 * **Resultado esperado** — qué se considerará éxito, **en forma observable y
 * binaria** (APS-18 §5.2).
 *
 * Válido solo si el usuario puede responder **sí o no sin interpretar**.
 * Válidos: *respondió*, *no respondió*, *pidió ver algo*, *aceptó hablar*,
 * *dijo que no*. **No válidos:** *generó interés*, *quedó pensando*, *mejoró la
 * percepción de marca* — no son comprobables y APS-18 §5.2 los excluye.
 */
export type ExpectedOutcome = string;

/**
 * El conjunto de decisiones que gobiernan **un** contacto (APS-18 §8.1).
 *
 * **Inmutable dentro de la emisión que la contiene:** se re-estrategiza contacto
 * a contacto, y cada re-estrategia produce una emisión nueva (SC-R1 · P-I2).
 *
 * **Qué NO contiene** (APS-18 §8.2): el texto del mensaje —la redacción es
 * posterior y separada—, instrucciones para el modelo, detalle técnico, datos
 * personales y afirmaciones no sostenidas por evidencia.
 *
 * **Qué nunca decide** (APS-18 §8.4): si el contacto se envía —lo decide el
 * usuario—, a quién se contacta, qué palabras finales se usan, si un Lead merece
 * esfuerzo comercial, ni **qué es cierto** — eso lo determina la evidencia.
 */
export interface CommercialStrategy {
  /** El único avance que persigue (§4.5). */
  objective: MicroYes;
  /** La única resistencia que debe romper (§5.1). */
  barrier: Barrier;
  /** Los hechos observados que puede afirmar (§11). */
  evidenceBase: ClosedFactList;
  /**
   * Qué se pone en primer plano, dada la identidad del negocio (§8.1). El
   * Blueprint no fija un conjunto cerrado de enfoques.
   */
  focus: string;
  /** Curiosidad, reconocimiento o comparación suave (§8.5). */
  emotion: AdmissibleEmotion;
  /** Qué asunto previo recoge (§4.6). Ausente en el primer contacto. */
  resumedThread?: Thread;
  /** Qué pregunta o asunto **enuncia** para el siguiente contacto (§4.6). */
  openedThread?: Thread;
  /** Qué aporta que el contacto anterior no contenía (§4.7). */
  relevanceElement: RelevanceElement;
  /** Dónde y cuándo tiene sentido (§8.1). */
  channel: Channel;
  moment: SequenceMoment;
  /** Qué se considerará éxito, en forma observable (§5.2). */
  expectedOutcome: ExpectedOutcome;
}
