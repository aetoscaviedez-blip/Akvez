// Variable de diagnóstico y Confianza declarada — Value Objects.
//
// Autoridad: **APS-19 §6** (las siete variables) y **APS-19 §7** (la confianza).
// Owner: Pitch Generator.

import { CommercialState } from "./commercialState";
import { Indicio, KnowledgeClass } from "./knowledgeClass";

/**
 * Las siete variables de APS-19 §6. **Conjunto cerrado.**
 *
 * | # | Variable | Qué establece |
 * | --- | --- | --- |
 * | BD-1 | Nivel de consciencia | Si el negocio sabe que tiene el problema |
 * | BD-2 | Urgencia | Si existe alguna razón real para actuar ahora |
 * | BD-3 | Sofisticación | Cuánta exposición previa tiene a soluciones de este tipo |
 * | BD-4 | Riesgo percibido | Qué teme que salga mal si acepta |
 * | BD-5 | Coste percibido | Qué cree que le costará |
 * | BD-6 | Nivel de confianza | Cuánta credibilidad concede hoy a un desconocido |
 * | BD-7 | Identidad profesional | Cómo se ve a sí mismo el negocio |
 *
 * **Todas de negocio. Ninguna personal** (APS-19 §4.5 · RC-11).
 */
export type DiagnosisVariableId =
  | "BD-1"
  | "BD-2"
  | "BD-3"
  | "BD-4"
  | "BD-5"
  | "BD-6"
  | "BD-7";

/**
 * Una de las siete lecturas del diagnóstico.
 *
 * **BD-I1** — toda variable declara su clase.
 * **BD-I2** — ninguna `Desconocida` tiene valor asignado: `value` **ausente es
 * ausente** y jamás se rellena por defecto (BD-R2 · RC-10 · R-38).
 * **BD-I3** — toda `Inferida` conserva sus indicios.
 *
 * **APS-19 §4.4, prohibición absoluta:** el sistema nunca afirma que un negocio
 * *teme*, *desconfía*, *ignora*, *se resiste* ni *está frustrado*. Puede afirmar
 * el indicio y orientar la estrategia con la lectura; **nunca enunciar la
 * lectura como un hecho del mundo**.
 *
 * El valor de **BD-1 es el `CommercialState`** y no un campo aparte del
 * diagnóstico (BD-I4). Para las seis restantes el Blueprint no fija un conjunto
 * cerrado de valores: la lectura es su enunciado.
 */
export interface DiagnosisVariable {
  id: DiagnosisVariableId;
  knowledgeClass: KnowledgeClass;
  /**
   * La lectura, **solo cuando la clase la autoriza**. Ausente en toda variable
   * `Desconocida` (BD-I2). En BD-1 el valor es un `CommercialState` (BD-I4).
   */
  value?: CommercialState | string;
  /**
   * Los indicios que sostienen la lectura. **Toda `Inferida` los conserva**
   * (BD-I3). Proceden del análisis y el sistema comercial **nunca los amplía**
   * (RE-1 · RA-4).
   */
  indicios: Indicio[];
}

/**
 * **Confianza declarada** — cuánto apoyo real tiene el diagnóstico.
 *
 * Autoridad: APS-19 §7. Se sostiene en **cuántas variables tienen apoyo real** y
 * en la solidez de los indicios que las sostienen. Un diagnóstico con cinco
 * variables `Desconocida` es **válido y utilizable**, pero no puede presentarse
 * con la misma confianza que uno con cinco sostenidas.
 *
 * ⚠️ **El Blueprint no fija un conjunto cerrado de valores ni una escala.**
 * Declararla aquí como enumeración o como número sería inventar un criterio que
 * ninguna autoridad decide — y `Score de confianza` es además un sinónimo
 * prohibido (DDD-01 §8). Fijar su forma corresponde a APS-19.
 */
export type DeclaredConfidence = string;
