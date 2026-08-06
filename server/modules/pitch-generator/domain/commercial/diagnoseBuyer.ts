// La lectura comercial: **decide las siete variables** (ADR-16 §7).
//
// Vive en `domain/` porque **D-1 · RA-1**: todo lo que decide, en el dominio.
// Es un **cálculo puro, sin I/O** (DEV-00 §5.4) y determinista: la misma
// evidencia produce el mismo diagnóstico.
//
// **Ninguna regla de este fichero es de autoría propia.** Cada variable se
// resuelve con lo que APS-19 §6 declara sobre ella, y **cuando APS-19 dice que
// no hay indicio público que la sostenga, el resultado es `Desconocida`**. Es lo
// que APS-19 §7.2 llama el resultado normal de un diagnóstico en frío honesto:
// «tres inferidas y cuatro desconocidas». Rellenar huecos sería el modo de fallo
// que APS-18 §11.4 advierte.

import { CommercialEvidence } from "./commercialEvidence";
import { DiagnosisVariable } from "./diagnosisVariable";
import { Indicio } from "./knowledgeClass";

/**
 * **Marca de ausencia de Perfil de Estrategia.**
 *
 * ADR-15 §7.4 declara su gobernanza `Pospuesta` y exige ADR propio. **RC-13
 * obliga a que toda entidad emitida conserve la versión del criterio**, y no
 * existe ninguna.
 *
 * Se declara la ausencia en lugar de fabricar una versión: inventar `"v1"` sería
 * «un valor por defecto que sustituye a un dato que no existe» —prohibido por
 * **R-38 · RC-10 · BD-R2**— y produciría apariencia de trazabilidad sin
 * trazabilidad, que es exactamente lo que RC-13 existe para impedir. **RE-3: lo
 * desconocido se declara, no se disimula.**
 *
 * Es detectable por búsqueda: el día que exista el ADR, este identificador marca
 * cada emisión que debe migrarse.
 */
export const CRITERIA_VERSION_ABSENT = "SIN-PERFIL-DE-ESTRATEGIA";

/** Las siete variables, en el orden de APS-19 §6. */
export interface BuyerReading {
  variables: DiagnosisVariable[];
  confidence: string;
}

/**
 * Produce la lectura comercial a partir de la evidencia del análisis.
 *
 * **Antes del primer contacto ninguna variable puede ser `Observable`**
 * (CD-02 · APS-19 §4.3): la única vía hacia `Observable` es la manifestación del
 * comprador, y esta función no recibe ninguna. **Los estados *Consciente del
 * Proveedor* y *Conversación* de BD-1 son por tanto inalcanzables aquí**
 * (MC-1 · CD-12), lo cual es correcto y no una limitación.
 */
export function diagnoseBuyer(evidence: CommercialEvidence): BuyerReading {
  return {
    variables: [
      readAwareness(evidence),
      unknown("BD-2"),
      readSophistication(evidence),
      readPerceivedRisk(evidence),
      unknown("BD-5"),
      unknown("BD-6"),
      unknown("BD-7")
    ],
    confidence: declareConfidence(evidence)
  };
}

/**
 * **BD-1 — Nivel de consciencia.** Inferida a partir de los indicios de
 * APS-19 §5.2, que enumera para cada estado qué presencia digital lo sugiere.
 *
 * | Indicio de §5.2 | Estado |
 * | --- | --- |
 * | «Ausencia total de activo digital propio · presencia únicamente en directorios de terceros» | Inconsciente |
 * | «**Activo digital iniciado y desatendido**» | Consciente del Problema |
 * | «Presencia construida con medios visiblemente limitados» | Consciente de la Solución |
 *
 * **El origen de la presencia decide antes que su calidad.** Sin activo digital
 * propio se cumple el primer indicio de *Inconsciente* —«ausencia total de
 * activo digital propio»— con independencia de lo cuidada que esté esa presencia
 * ajena. Es la corrección de D-1: `Sitio web básico` agrupaba un sitio propio
 * pobre con una presencia que solo vive en plataformas de terceros, y §5.2 los
 * sitúa en estados distintos.
 *
 * **§5.3 — «distinguir *nunca lo intentó* de *lo intentó y quedó a medias* es la
 * decisión de entrada más importante del modelo»**: son dos conversaciones
 * distintas y un mismo mensaje no sirve para las dos.
 *
 * **Qué NO se afirma** (§6.1): que el negocio sea ignorante, negligente o
 * desinteresado. La ausencia de presencia digital puede responder a una decisión
 * deliberada, a un canal alternativo que le funciona o a falta de tiempo.
 */
function readAwareness(evidence: CommercialEvidence): DiagnosisVariable {
  const state = !hasOwnAsset(evidence)
    ? "Inconsciente"
    : evidence.digitalPresence === "Sitio web deficiente"
      ? "Consciente del Problema"
      : "Consciente de la Solución";

  return {
    id: "BD-1",
    knowledgeClass: "Inferida",
    value: state,
    indicios: [presenceIndicio(evidence)]
  };
}

/**
 * Si el negocio dispone de **activo digital propio**, en el sentido literal de
 * §5.2. `Sin sitio web` nunca lo es; una presencia que solo vive en terceros
 * tampoco, por buena que parezca.
 */
function hasOwnAsset(evidence: CommercialEvidence): boolean {
  return (
    evidence.digitalPresence !== "Sin sitio web" &&
    evidence.presenceOrigin === "Activo digital propio"
  );
}

/**
 * **BD-3 — Sofisticación.** Inferida por «la naturaleza de los activos digitales
 * existentes» (§6.3): sin activo propio no hay exposición previa constatable;
 * con activo, la hay.
 *
 * **Qué NO se afirma** (§6.3): **nada sobre la persona**. No es nivel educativo,
 * ni capacidad, ni inteligencia. Es exposición previa a una categoría de
 * solución, y nada más.
 */
function readSophistication(evidence: CommercialEvidence): DiagnosisVariable {
  return {
    id: "BD-3",
    knowledgeClass: "Inferida",
    value: hasOwnAsset(evidence)
      ? "Exposición previa a soluciones de esta categoría"
      : "Sin exposición previa constatable a soluciones de esta categoría",
    indicios: [presenceIndicio(evidence)]
  };
}

/**
 * **BD-4 — Riesgo percibido.** `Desconocida` **salvo intento previo fallido**,
 * que APS-19 §6.4 declara «el indicio más fuerte, y prácticamente el único
 * disponible»: quien invirtió y no obtuvo resultado teme repetirlo.
 *
 * El intento previo fallido es el activo iniciado y desatendido de §5.3.
 *
 * **Qué NO se afirma** (§6.4 · §4.4): que el negocio *desconfía*, *ha sido
 * engañado* o *tiene miedo*. Son estados internos, y §4.4 los prohíbe
 * **expresamente y en absoluto**. Por eso la lectura enuncia el hecho —hubo un
 * intento previo que no prosperó— y nunca la emoción.
 */
function readPerceivedRisk(evidence: CommercialEvidence): DiagnosisVariable {
  // Sin activo propio no hubo intento: no se puede abandonar lo que nunca se
  // emprendió. Es el mismo discriminante que gobierna BD-1.
  if (!hasOwnAsset(evidence) || evidence.digitalPresence !== "Sitio web deficiente") {
    return unknown("BD-4");
  }

  return {
    id: "BD-4",
    knowledgeClass: "Inferida",
    value: "Existe un intento previo que no prosperó",
    indicios: [presenceIndicio(evidence)]
  };
}

/**
 * Variable sin apoyo. **`Desconocida` y sin valor asignado** (BD-I2 · CD-04):
 * ausencia es ausencia, jamás un valor por defecto (R-38 · RC-10 · BD-R2).
 *
 * Las cuatro que lo son siempre, por declaración de su propia autoridad:
 *
 * | Variable | Por qué |
 * | --- | --- |
 * | **BD-2** Urgencia | §6.2 — solo la sostienen «activo caído o inaccesible · información caducada visible · dominio expirado», y **el análisis no observa ninguno**. «Fuera de estos casos, no hay indicio público de urgencia» |
 * | **BD-5** Coste percibido | §6.5 — «**ningún indicio público sostiene esta variable con solidez**». CD-07 prohíbe además inferir capacidad económica |
 * | **BD-6** Confianza | §6.6 — «**ningún indicio público la sostiene**». Es «la variable más tentadora de inventar y la menos sostenible: se declara así para que nadie la rellene» |
 * | **BD-7** Identidad profesional | §6.7 la haría inferible por «calificación alta con muchas reseñas», pero **ningún documento aprobado fija qué es *alta* ni *muchas***, y R-52 prohíbe inventar el valor de un parámetro. Queda `Desconocida` hasta que se aprueben los umbrales |
 */
function unknown(id: DiagnosisVariable["id"]): DiagnosisVariable {
  return { id, knowledgeClass: "Desconocida", indicios: [] };
}

/** El hecho observado, nunca la lectura (APS-19 §4.1). */
function presenceIndicio(evidence: CommercialEvidence): Indicio {
  return (
    `Presencia digital observada por el análisis: ${evidence.digitalPresence}` +
    ` — ${evidence.presenceOrigin}`
  );
}

/**
 * **Confianza declarada** (APS-19 §7.1 · CD-15): se sostiene en **cuántas
 * variables tienen apoyo real**. Se enuncia el recuento, que es un hecho
 * comprobable, y no una escala — APS-19 no fija ninguna, y `Score de confianza`
 * es sinónimo prohibido (DDD-01 §8).
 *
 * **§7.2 — un diagnóstico con desconocidos es correcto**, no incompleto.
 * **§7.3** — no puede ser más fiable que la evidencia de la que deriva: hereda
 * esa limitación y la declara, nunca la compensa.
 */
function declareConfidence(evidence: CommercialEvidence): string {
  const supported =
    hasOwnAsset(evidence) && evidence.digitalPresence === "Sitio web deficiente" ? 3 : 2;
  return `${supported} de 7 variables con apoyo en indicios del análisis; el resto se declara desconocido.`;
}
