// El plan de la Secuencia Comercial: **decide qué momentos se planifican y en
// qué orden** (ADR-16 §7).
//
// Vive en `domain/` porque D-1 · RA-1: todo lo que decide, en el dominio. Es un
// cálculo puro y determinista — la misma entrada produce el mismo plan.
//
// **Ninguna regla es de autoría propia.** El orden y el conjunto de momentos los
// fija APS-18 §9.2; qué canal transporta cada momento, APS-20 §7.

import { Channel } from "./channel";
import { PlannedMoment } from "./CommercialSequence";
import { SequenceMoment } from "./sequenceMoment";

/**
 * Correspondencia canal ↔ momento de **APS-20 §7**, transcrita.
 *
 * | Momento | Email frío | LinkedIn Note | Instagram DM |
 * | --- | :-: | :-: | :-: |
 * | Reconocimiento | ✅ | ✅ | ✅ |
 * | Evidencia | ✅ | ❌ | ✅ |
 * | Demostración | ✅ | ❌ | ✅ |
 * | Oferta | ✅ | ❌ | ❌ |
 * | Seguimiento | ✅ | ❌ | ✅ |
 * | Reactivación | ✅ | ❌ | ✅ |
 *
 * **CM-1** — la nota de conexión solo transporta el momento 1; agotado, la
 * secuencia continúa por otro canal. **CM-2** — la oferta solo se emite por
 * correo: es el único canal con capacidad y registro adecuados.
 */
const CHANNELS_BY_MOMENT: Record<SequenceMoment, readonly Channel[]> = {
  Reconocimiento: ["Email frío", "LinkedIn Connection Note", "Instagram DM"],
  Evidencia: ["Email frío", "Instagram DM"],
  Demostración: ["Email frío", "Instagram DM"],
  Oferta: ["Email frío"],
  Seguimiento: ["Email frío", "Instagram DM"],
  Reactivación: ["Email frío", "Instagram DM"]
};

/**
 * Los seis momentos **en el orden de APS-18 §9.2**. El orden es parte de la
 * decisión: cada momento persigue un peldaño del Micro-Yes y **no se salta
 * ninguno** (APS-18 §4.5).
 */
export const SEQUENCE_MOMENTS: readonly SequenceMoment[] = [
  "Reconocimiento",
  "Evidencia",
  "Demostración",
  "Oferta",
  "Seguimiento",
  "Reactivación"
];

/**
 * Construye el plan con los momentos que **algún canal alcanzable** puede
 * transportar.
 *
 * **CE-1 de APS-20 §11** gobierna la exclusión: *«la secuencia se diseña con los
 * momentos que ese canal admite, y no se fuerza ninguno que no soporte. Si el
 * canal no admite oferta, **la secuencia termina antes** — resultado válido, y
 * detenerse lo es»*. Un negocio alcanzable solo por Instagram produce, por CM-2,
 * un plan de cinco momentos sin Oferta, y eso es correcto.
 *
 * **No asigna canal a ningún momento**, y no puede hacerlo: el canal es contenido
 * de la `Commercial Strategy` (APS-18 §8.1) y **CM-3** declara que cambiar de
 * canal entre momentos es una decisión de estrategia, no una consecuencia
 * técnica. La estrategia se decide contacto a contacto (SC-R1), en una fase
 * posterior. Por eso cada `PlannedMoment` sale **sin estrategia**.
 *
 * **No introduce disparadores temporales** (CS-I6 · SC-R6): el plan dice qué
 * contactos existen y en qué orden, nunca cuándo se emiten. Emitir uno exige
 * acción del usuario para ese contacto concreto (CS-I4).
 */
export function designSequence(reachableChannels: readonly Channel[]): PlannedMoment[] {
  return SEQUENCE_MOMENTS.filter((moment) =>
    reachableChannels.some((channel) => CHANNELS_BY_MOMENT[moment].includes(channel))
  ).map((moment) => ({
    moment,
    // Sin estrategia y sin propuestas: la secuencia acaba de diseñarse y **ningún
    // contacto se ha emitido**. `strategy` ausente es ausente (R-38): se decidirá
    // antes de usar cada contacto, no ahora.
    proposals: []
  }));
}
