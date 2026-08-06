// Proyección de Hechos Afirmables.
//
// **Los hechos se derivan; no se almacenan.** DDD-01 §4.2 lo dice de la lista
// cerrada: *«se construye por emisión; no persiste aparte»*. No hay activo, no
// hay evento y no hay repositorio: son una **proyección determinista** de lo que
// ya está persistido —atributos de la Empresa (A-2) y evaluación (A-4)—, cada uno
// con su propio evento de escritura en el catálogo cerrado de ADR-13 §13.1.
//
// **Solo entra lo Observado.** APS-18 §11.3 y DDD-01 §8: *«solo lo Observado
// puede afirmarse; lo Inferido nunca»* (RE-2). Aquí no hay categoría inferida y
// no puede haberla: lo inferido vive en `BuyerDiagnosis` y **orienta** la
// estrategia sin enunciarse jamás como hecho.
//
// **La narrativa del análisis no es fuente.** `description`, `flaws`, `angle`,
// `revenueLoss` y `whyWebsiteNeeded` los redacta un modelo generativo, no una
// medición (COM-04 §4). **No existe `EvidenceSource` que los acredite**, y esa
// ausencia es la garantía: no es una regla que alguien deba recordar, es que no
// hay por dónde entrar.
//
// **Ausencia de evidencia no produce afirmación.** Un dato que no consta no
// genera hecho — ni afirmativo ni negativo (R-38 · RE-3).

import { AffirmableFact, ClosedFactList, EvidenceSource } from "./evidence";
import { LeadReference } from "./leadReference";

/**
 * Lo observado que la proyección puede leer. **Nada más entra.**
 *
 * Se declara aquí y no se importa de `lead-hunter` ni de `lead-analyzer`: **D-A2
 * prohíbe a un módulo importar el `domain/` de otro**, y R-02/R-03 encaminan la
 * comunicación entre módulos por el Orchestrator. Es el mismo criterio que
 * `CommercialEvidence`.
 *
 * **Todos los campos observables son opcionales salvo la identidad y la Fuente.**
 * Un negocio sin teléfono publicado no tiene un teléfono vacío: no tiene dato, y
 * la distinción es la que R-38 protege.
 */
export interface ObservedInput {
  lead: LeadReference;
  /**
   * Fuente de la Referencia de Origen (ADR-12 §7.1). **Es metadato de
   * trazabilidad, nunca argumento comercial**: acredita dónde se observó el
   * dato y no entra en ningún enunciado.
   */
  source: string;
  /** Sitio web propio, si se observó alguno. */
  website?: string;
  /** Teléfono público, si la fuente lo publica. */
  phone?: string;
  rating?: number;
  reviewCount?: number;
  /**
   * Factores que la evaluación **midió realmente**, frente a los que declaró no
   * medibles (APS-08 §11). Es el único material del análisis legible por máquina
   * que acredita una observación.
   */
  measuredFactors?: string[];
}

/**
 * Deriva la lista cerrada de hechos afirmables.
 *
 * **Función pura y determinista**: la misma observación produce los mismos
 * hechos, en el mismo orden. No lee estado, no escribe y no consulta nada
 * (DEV-00 §5.4).
 *
 * **RA-4 — la lista se construye en el dominio y ninguna capa la amplía.** Ni el
 * adapter, ni el canal (APS-20 §3.2), ni el Perfil de Estrategia, que **no aporta
 * ni un solo hecho**: decide cómo se aborda, nunca qué es cierto (APS-18 §8.4).
 */
export function generateAffirmableFacts(observed: ObservedInput): ClosedFactList {
  const facts: AffirmableFact[] = [];

  // ── Presencia web ─────────────────────────────────────────────────────────
  // Tanto la presencia como la ausencia son constatables por cualquiera, y
  // ambas son hechos. Lo que NO es un hecho es calificarlas: «no dispone de
  // sitio web propio» es observación; «su presencia digital está descuidada»
  // es un juicio, y APS-19 §4.4 lo prohíbe.
  const website = (observed.website ?? "").trim();
  facts.push({
    lead: observed.lead,
    kind: "presencia_web",
    statement: website === ""
      ? "No se observa sitio web propio."
      : `Dispone de sitio web propio: ${website}`,
    source: attribute(observed)
  });

  // ── Contacto público ──────────────────────────────────────────────────────
  // Solo si consta. Un teléfono ausente **no genera hecho**: afirmar «no tiene
  // teléfono» supondría que la fuente lo habría publicado de existir, y eso no
  // consta.
  const phone = (observed.phone ?? "").trim();
  if (phone !== "") {
    facts.push({
      lead: observed.lead,
      kind: "contacto_publico",
      statement: `Publica un teléfono de contacto: ${phone}`,
      source: attribute(observed)
    });
  }

  // ── Reputación publicada ──────────────────────────────────────────────────
  // Exige ambos datos: una calificación sin volumen no es interpretable, y
  // enunciarla sola induciría a error. Se enuncia el dato, nunca su lectura
  // —«bien valorado» sería un juicio—.
  if (typeof observed.rating === "number" && typeof observed.reviewCount === "number") {
    facts.push({
      lead: observed.lead,
      kind: "reputacion_publicada",
      statement: `Su calificación pública es ${observed.rating} sobre ${observed.reviewCount} reseñas.`,
      source: Object.freeze({ observation: "reputacion_publicada" as const, source: observed.source })
    });
  }

  // ── Factores medidos en la evaluación ─────────────────────────────────────
  // Un factor medido acredita **que se midió**, no su resultado. APS-08 §11
  // obliga a declarar la cobertura parcial, y `unmeasuredFactors` es su reverso:
  // lo no medido **no entra aquí** y se declara desconocido en otro lugar
  // (RE-3), nunca se rellena.
  for (const factor of observed.measuredFactors ?? []) {
    const name = factor.trim();
    if (name === "") continue;
    facts.push({
      lead: observed.lead,
      kind: "factor_medido",
      statement: `La evaluación midió: ${name}.`,
      source: Object.freeze({ observation: "evaluacion" as const, source: observed.source })
    });
  }

  // **Un hecho entregado no puede mutar.** `readonly` lo impide en compilación;
  // `freeze` lo impide también en ejecución, que es donde un consumidor
  // descuidado —o un adapter— podría reescribir un enunciado después de que el
  // punto de control lo hubiera verificado. **P-I4 dejaría de ser comprobable**
  // si la lista contra la que se verificó pudiera cambiar después.
  return Object.freeze(facts.map((fact) => Object.freeze(fact)));
}

function attribute(observed: ObservedInput): EvidenceSource {
  return Object.freeze({ observation: "atributo_de_empresa" as const, source: observed.source });
}
