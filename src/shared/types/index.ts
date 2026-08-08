import type { PlaceEvidence } from "../../modules/lead-hunter/domain/placeEvidence";
/**
 * Perfil del freelance que usa AKVEZ.
 *
 * ── LOS TRES CAMPOS NUEVOS SON OPCIONALES, Y POR QUÉ ─────────────────────────
 *
 * `company`, `city` y `website` los pide el alta inicial (H-10.1 · P1) para que
 * el producto sepa quién es su usuario. **Se añaden como opcionales a
 * propósito:** el backend recibe `designer` sin validación de forma y solo lee
 * `name`, `style`, `skills`, `tone` y `caseStudies`, de modo que los campos
 * nuevos viajan y se ignoran sin romper nada.
 *
 * **No son dominio.** No participan del Opportunity Score, ni del
 * descubrimiento, ni de ningún contrato del Blueprint: describen al usuario, no
 * al negocio analizado.
 */
export interface DesignerProfile {
  name: string;
  style: string;
  skills: string;
  tone: string;
  caseStudies: string;
  targetNiche: string;
  /** Nombre del estudio o marca, si el freelance trabaja bajo uno. */
  company?: string;
  /** Ciudad del freelance. Contexto para el mensaje; no filtra la búsqueda. */
  city?: string;
  /** Portafolio propio, si lo tiene. */
  website?: string;
}

export type LeadStatus = 'Prospect' | 'Audited' | 'Pitched' | 'Replied' | 'Won' | 'Stale';

/**
 * **Origen declarado del texto de contacto.**
 *
 * La interfaz debe poder responder *«¿esto lo generó una IA?»* sin explicación
 * externa, y para eso necesita **saberlo**, no deducirlo.
 *
 * Sustituye a la detección anterior, que escribía la cadena mágica
 * `"utilizando_respaldo_local"` en `pitchMessage` —un campo destinado al
 * mensaje— y la reconocía con `.includes("respaldo")`. Cualquier texto que
 * contuviera esa palabra activaba el aviso.
 */
/**
 * Aportación de una categoría al Opportunity Score — espejo de
 * `ScoreBreakdownEntryDTO` del contrato público.
 *
 * **`partialScore` es `number | null`**: `null` significa que **ninguna factor
 * de la categoría pudo medirse** (R-38), y **`0` es una puntuación real**.
 */
export interface ScoreBreakdownEntry {
  category: string;
  weight: number;
  partialScore: number | null;
  contribution: number;
  measuredFactors: string[];
  unmeasuredFactors: string[];
  rationale: string;
}

export type PitchSource =
  /** Redactado por el modelo generativo. */
  | 'AI_GENERATED'
  /** Redactado por la plantilla de respaldo, sin IA. */
  | 'FALLBACK_TEMPLATE'
  /** No existe una generación válida. */
  | 'UNAVAILABLE';

/**
 * Modelo de UI de un Lead.
 *
 * **La ausencia de un dato se representa como ausencia** — `undefined` o `null`—
 * y **nunca se sustituye por un valor de relleno**. Es la distinción que **R-38**
 * protege: «no hay dato» y «el dato es cero o vacío» no significan lo mismo, y
 * confundirlas hace que la interfaz afirme algo que nadie comprobó.
 *
 * Por eso `website`, `angle`, `description` y `score` son opcionales: el
 * servidor puede legítimamente no tener ninguno de ellos —un negocio sin sitio
 * web, un Lead sin Evaluación (**R-45**)— y la interfaz debe **declarar la
 * ausencia**, no inventar un sustituto.
 */
export interface Prospect {
  id: string;
  name: string;
  /** Ausente cuando el negocio no tiene sitio web registrado. */
  website?: string;
  description?: string;
  /** Vacío cuando el análisis no detectó ningún problema. */
  flaws: string[];
  angle?: string;
  status: LeadStatus;
  notes?: string;
  auditReport?: string;
  subjectLine?: string;
  generatedPitch?: string;
  pitchChannel?: 'email' | 'linkedin' | 'instagram';
  pitchAngle?: string;
  pitchMessage?: string;
  /**
   * **Origen del texto de contacto almacenado en `generatedPitch`.**
   *
   * Ausente en Leads con pitch generado **antes** de que este campo existiera:
   * en ese caso el origen **no se conoce**, y la interfaz debe decirlo en lugar
   * de suponer que fue IA.
   */
  pitchSource?: PitchSource;
  /**
   * **Marca de dato de ejemplo.** `true` solo en los Leads de muestra que la
   * aplicación carga cuando no hay nada guardado.
   *
   * **Nunca lo asigna el servidor**: ningún Lead procedente de una búsqueda real
   * lo lleva. Existe para que un dato de demostración **no pueda confundirse con
   * un resultado real** en ninguna pantalla.
   */
  isDemo?: boolean;
  dateCreated: string;
  /**
   * Opportunity Score 0-100. **`null` es un estado válido** —un Lead sin
   * Evaluación existe legítimamente (**R-45**)— y **`0` es una puntuación real**,
   * no una ausencia. Quien lo lea debe usar `typeof score === "number"`,
   * nunca `!!score`.
   */
  score?: number | null;
  /**
   * **Estado del sitio web** —*Sin sitio web · Sitio web básico · Sitio web
   * deficiente*—, **no la banda del Opportunity Score**.
   *
   * ⚠️ Son conceptos distintos: la banda comercial de APS-08 §8 es `band`, que
   * **hoy no llega por la ruta de búsqueda**. No deben mostrarse como si fueran
   * lo mismo.
   */
  classification?: string;

  /**
   * **Explicación del Opportunity Score.** Mismos nombres y semántica que el
   * contrato público — no son datos nuevos: son los que el dominio ya calculaba
   * y que hasta ahora se perdían en el mapper HTTP.
   *
   * **Ausentes cuando el Lead no fue evaluado (R-45).** Nunca se rellenan.
   */
  band?: string | null;
  scoreVersion?: string;
  confidence?: string;
  coverage?: number;
  calculatedAt?: string;
  breakdown?: ScoreBreakdownEntry[];
  revenueLoss?: string;
  googleMapsUrl?: string;
  rating?: number;
  reviewCount?: number;
  whyWebsiteNeeded?: string;
  phone?: string;
  source?: string;

  /**
   * **Evidencia observada — `PE-1.0` (H-14.F.1).**
   *
   * Canal **paralelo** a `website`, `rating`, `reviewCount` y `phone`, que
   * permanecen intactos para no romper a sus consumidores actuales (F-1).
   *
   * La diferencia es la **fidelidad**: aquí `0` y «no observado» son estados
   * distintos; en los campos de arriba el adapter los colapsó con `|| 0`
   * (H-14.F §3.1). Las reglas nuevas deben leer de aquí.
   *
   * Opcional porque los Leads guardados antes de `PE-1.0` no lo traen.
   */
  placeEvidence?: PlaceEvidence;
}

/**
 * Resumen de una búsqueda **efectivamente ejecutada** en esta sesión.
 *
 * **No es telemetría del backend.** Son los parámetros y el resultado que el
 * propio frontend acaba de manejar, conservados para que el panel pueda
 * describir lo que ocurrió sin inventarlo.
 *
 * ⚠️ **Vive en memoria y muere con la pestaña.** No se persiste: un recuento de
 * búsquedas que sobreviviera a la recarga exigiría almacenamiento, y este sprint
 * no lo introduce.
 */
export interface SearchSummary {
  city: string;
  niche: string;
  /** Negocios devueltos por esta búsqueda concreta. */
  found: number;
  /**
   * Señal del contrato público: **`true` significa que al menos un negocio de
   * la tanda se analizó con el motor de respaldo**, no que lo hicieran todos.
   */
  usedFallbackEngine: boolean;
}

export interface NichePreset {
  id: string;
  industry: string;
  suggestedAesthetic: string;
  commonPainPoints: string[];
  recommendedAngle: string;
  sampleKeywords: string[];
}
