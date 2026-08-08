import { EvidenceBasedOpportunity } from "./opportunityDerivation";
import {
  ProjectValueConfidence,
  ProjectValueCurrency,
  ProjectValueModelParams,
  ProjectValueModelVersion
} from "../../../config/projectValueModel";

/**
 * **Modelo de Valor de Proyecto — PV-1.0 (H-14.C).**
 *
 * ── QUÉ ES Y QUÉ NO ES ───────────────────────────────────────────────────────
 *
 * Produce un **rango orientativo** de lo que podría representar el proyecto
 * para el profesional. No es una cotización, no es un precio recomendado, no es
 * el presupuesto del negocio y no es una previsión de ingresos. Quien decide el
 * precio es el profesional: AKVEZ presenta y no decide (**R-48**).
 *
 * ── INDEPENDENCIA DEL OPPORTUNITY SCORE ──────────────────────────────────────
 *
 * Son magnitudes **paralelas**. El Score mide potencial comercial *para este
 * usuario* y **ordena** los Leads; el valor mide alcance económico del proyecto
 * y **no ordena nada**. Un negocio puede puntuar 91 y ser un proyecto pequeño.
 *
 * Este módulo **no importa nada relacionado con el Score**, y ningún módulo del
 * Score importa este. Si algún día el valor llegara a filtrar u ordenar Leads,
 * dejaría de superar la prueba de APS-17 §3 y pasaría a ser regla de dominio.
 *
 * ── DETERMINISMO ─────────────────────────────────────────────────────────────
 *
 * Depende **exclusivamente** del tipo de oportunidad y de los parámetros que
 * recibe. No lee fecha, usuario, `rating`, `reviewCount`, ciudad, teléfono,
 * red, `localStorage` ni estado global. Misma entrada, misma salida, siempre.
 *
 * Los parámetros entran **por argumento** y no por import: mantiene la función
 * pura y permite probar varias configuraciones sin tocar la de producción.
 */

export interface ProjectValue {
  modelVersion: ProjectValueModelVersion;
  currency: ProjectValueCurrency;
  min: number;
  max: number;
  confidence: ProjectValueConfidence;
  /** Tier que produjo el rango. Permite auditar la salida sin leer el código. */
  basis: string;
}

/**
 * Estima el valor potencial del proyecto a partir de las oportunidades
 * derivadas.
 *
 * Devuelve **`null` cuando no hay ninguna oportunidad compatible**. `null`
 * significa *no hay estimación*, que no es lo mismo que *la estimación es
 * cero*: la interfaz debe declarar la ausencia, nunca rendir `COP 0` ni un
 * rango genérico (**R-38**).
 */
export function estimateProjectValue(
  opportunities: readonly EvidenceBasedOpportunity[],
  params: ProjectValueModelParams
): ProjectValue | null {
  // **El tier se aplica una sola vez, nunca se suma.**
  //
  // En PV-1.0 los dos tipos son mutuamente excluyentes por construcción —un
  // negocio o no tiene sitio, o lo tiene en un tercero—, así que hoy la suma
  // nunca podría ocurrir. La regla se escribe igualmente porque un cambio
  // futuro del dominio podría emitir ambos, y sumar rangos duplicaría el valor
  // de un trabajo que sigue siendo uno solo: construirle un sitio.
  const tier = params.tiers.find((candidate) =>
    opportunities.some((opportunity) => candidate.opportunityTypes.includes(opportunity.id))
  );

  if (tier === undefined) return null;

  return {
    modelVersion: params.version,
    currency: params.currency,
    min: tier.min,
    max: tier.max,
    confidence: params.confidence,
    basis: tier.id
  };
}

/**
 * Formatea el rango para su presentación.
 *
 * Vive aquí —y no en un componente— para que **ninguna pantalla construya la
 * cadena por su cuenta**: una sola forma de escribir dinero en todo el
 * producto. Es una función pura, sin React.
 *
 * **No convierte de moneda.** Los precios son convenciones locales, no
 * magnitudes convertibles: aplicar un tipo de cambio produciría cifras absurdas
 * y ataría una salida determinista a un dato que cambia a diario. La
 * internacionalización futura añade monedas con sus propios parámetros
 * investigados (H-14.B.1 §9.1).
 */
export function formatProjectValue(value: ProjectValue): string {
  const amount = (n: number) => new Intl.NumberFormat("es-CO").format(n);
  return `${value.currency} ${amount(value.min)} – ${amount(value.max)}`;
}
