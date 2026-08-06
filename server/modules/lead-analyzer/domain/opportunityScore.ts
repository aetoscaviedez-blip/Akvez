// Cálculo del Opportunity Score conforme al Perfil de Ponderación (APS-08 §7,
// ADR-14). **Cálculo puro**: sin I/O, sin reloj, sin azar — vive en `domain/`
// (ADR-04 §10) y cumple la Reproducibilidad que exige ADR-14 §6.3: los mismos
// datos, el mismo perfil de usuario y la misma versión producen siempre el
// mismo resultado.
//
// ── QUÉ SIGNIFICA UN SCORE ALTO ─────────────────────────────────────────────
// **Oportunidad comercial para este usuario**, no calidad del negocio. Lo fija
// la justificación de APS-08 §7.1: «para un diseñador web, el mejor cliente
// potencial es aquel cuya presencia digital es deficiente o inexistente». Por
// eso una web ausente **sube** el Score: es un hallazgo, no una carencia
// (R-38 · APS-08 §6.5).
//
// ── DECISIÓN REQUERIDA D-1, DECLARADA Y NO IMPROVISADA ──────────────────────
// APS-08 §6 enumera **qué factores** evalúa cada categoría, pero ningún
// documento aprobado define **cómo** convertir los datos disponibles en la
// puntuación parcial de cada categoría. Este fichero deriva esas funciones
// exclusivamente de los factores que §6 enumera y de la dirección que §7.1
// justifica, limitándose a los factores **realmente medibles** con los datos que
// hoy aporta el descubrimiento. Queda registrado como desviación D-1 en el
// informe de DEV-04, para pronunciamiento del Product Office (autoridad de
// APS-08 conforme a ADR-14 §8.1).
//
// ── CÓMO SE TRATA LO NO MEDIBLE (R-38) ──────────────────────────────────────
// Un factor que no puede medirse **no puntúa cero**: se excluye de la base de su
// categoría y reduce la cobertura declarada. Una categoría sin ningún factor
// medible no contribuye y su peso se excluye del divisor, de modo que los pesos
// relativos de WP-01 se conservan intactos, la escala sigue siendo 0-100 y las
// cinco bandas permanecen alcanzables (APS-08 §7.1, RV-D). La confianza
// resultante se declara conforme a APS-08 §11.

import {
  EvaluationCategory,
  WeightingProfile,
  CATEGORY_LABELS,
  totalWeight
} from "./weightingProfile";

/** Datos observados de la Empresa. Solo lo que el descubrimiento aporta hoy. */
export interface ScoreInput {
  website: string;
  phone: string;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  source: string;
  /** Nicho al que pertenece la Empresa, según la búsqueda que la descubrió. */
  industry: string;
}

/**
 * Perfil de usuario con el que se calcula. **ADR-13 §10.3 V-4 y DEV-00 R-34
 * exigen conservarlo**: sin él la puntuación no es interpretable a posteriori,
 * porque Compatibilidad (20 %) mide el encaje con *este* usuario (APS-08 §6.6).
 */
export interface UserScoringProfile {
  /** Nicho objetivo declarado por el usuario. */
  targetNiche: string;
  /** Estilo de diseño declarado. */
  style: string;
}

/** Confianza del análisis, exigida por APS-08 §11 cuando los datos son parciales. */
export type ScoreConfidence = "alta" | "media" | "limitada";

/** Aportación de una categoría, para la explicación que exige APS-08 §9. */
export interface CategoryBreakdown {
  category: EvaluationCategory;
  label: string;
  /** Peso en el perfil, en puntos porcentuales. */
  weight: number;
  /** Puntuación parcial 0-100. `null` si ningún factor pudo medirse. */
  partialScore: number | null;
  /** Puntos que esta categoría aporta al Score final, ya normalizados. */
  contribution: number;
  /** Factores de APS-08 §6 que sí se midieron. */
  measuredFactors: string[];
  /** Factores de APS-08 §6 que **no** son medibles con los datos actuales. */
  unmeasuredFactors: string[];
  /** Explicación legible de por qué esta categoría puntuó así (APS-08 §9). */
  rationale: string;
}

/** Resultado completo y auto-explicativo de una emisión de Score. */
export interface OpportunityScoreResult {
  /** Score 0-100. `null` si no pudo evaluarse ninguna categoría (R-45). */
  score: number | null;
  /** Banda de APS-08 §8. `null` si no hay Score. */
  band: string | null;
  /** Versión del Perfil que lo produjo. **Vinculación permanente** (R-VIN). */
  profileVersion: string;
  breakdown: CategoryBreakdown[];
  confidence: ScoreConfidence;
  /** Proporción de factores medidos sobre el total enumerado en APS-08 §6. */
  coverage: number;
  /** Suma de pesos efectivamente evaluados. 100 si las seis categorías puntúan. */
  evaluatedWeight: number;
}

// ── Bandas de clasificación — APS-08 §8, transcritas literalmente ────────────
// Son **etiquetas de prioridad, no criterios de admisión** (§8.6): ninguna
// oculta, retira ni impide registrar un Lead.
const BANDS: ReadonlyArray<{ min: number; max: number; label: string }> = Object.freeze([
  { min: 90, max: 100, label: "Oportunidad Excelente" },
  { min: 75, max: 89, label: "Oportunidad Alta" },
  { min: 60, max: 74, label: "Oportunidad Media" },
  { min: 40, max: 59, label: "Oportunidad Baja" },
  { min: 0, max: 39, label: "Oportunidad Muy Baja" }
]);

export function classifyScore(score: number): string {
  const band = BANDS.find((b) => score >= b.min && score <= b.max);
  // Sin `find` no habría banda para un valor fuera de escala. Se acota antes de
  // clasificar para que un fallo aritmético no produzca una etiqueta ausente.
  return band ? band.label : BANDS[BANDS.length - 1].label;
}

/** Plataformas que denotan presencia prestada, no un sitio propio. */
const BORROWED_PLATFORMS = [
  "wix", "blogspot", "weebly", "jimdo", "sites.google", "facebook.com",
  "instagram.com", "twitter.com", "linkedin.com", "amarillas", "mercadolibre",
  "olx", "co.todoclasificados", "linktr.ee", "wordpress.com"
];

const SOCIAL_SOURCES = ["instagram", "facebook", "grounding", "redes"];

function hasOwnWebsite(website: string): boolean {
  const value = (website || "").trim().toLowerCase();
  if (value === "" || value.includes("sin sitio web")) return false;
  return !BORROWED_PLATFORMS.some((platform) => value.includes(platform));
}

function hasBorrowedPresence(website: string, source: string): boolean {
  const value = (website || "").trim().toLowerCase();
  const src = (source || "").toLowerCase();
  return (
    BORROWED_PLATFORMS.some((platform) => value.includes(platform)) ||
    SOCIAL_SOURCES.some((s) => src.includes(s))
  );
}

function isPresent(value: string): boolean {
  const v = (value || "").trim().toLowerCase();
  return v !== "" && v !== "no disponible" && !v.includes("sin ");
}

/** Normaliza dos cadenas para comparar nichos sin ruido de mayúsculas o tildes. */
function normalize(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .trim();
}

/**
 * Evalúa una categoría a partir de sus factores medibles.
 *
 * `factors` declara cada factor de APS-08 §6 con su valor 0-100 y si pudo
 * medirse. La parcial es la media de los medidos — nunca se rellena un factor
 * ausente con cero (R-38).
 */
function evaluate(
  category: EvaluationCategory,
  weight: number,
  factors: Array<{ name: string; value: number | null }>,
  rationale: string
): Omit<CategoryBreakdown, "contribution"> {
  const measured = factors.filter((f) => f.value !== null);
  const unmeasured = factors.filter((f) => f.value === null);

  const partialScore =
    measured.length === 0
      ? null
      : Math.round(measured.reduce((sum, f) => sum + (f.value as number), 0) / measured.length);

  return {
    category,
    label: CATEGORY_LABELS[category],
    weight,
    partialScore,
    measuredFactors: measured.map((f) => f.name),
    unmeasuredFactors: unmeasured.map((f) => f.name),
    rationale
  };
}

/**
 * Calcula el Opportunity Score de una Empresa bajo un Perfil de Ponderación y
 * un perfil de usuario concretos.
 *
 * **Función pura y determinista** (ADR-14 §6.3). No lee el reloj ni el entorno:
 * la marca temporal de la emisión la aporta la capa que persiste.
 */
export function calculateOpportunityScore(
  input: ScoreInput,
  user: UserScoringProfile,
  profile: WeightingProfile
): OpportunityScoreResult {
  const w = profile.weights;
  const ownSite = hasOwnWebsite(input.website);
  const borrowed = hasBorrowedPresence(input.website, input.source);

  // ── §6.1 Presencia Web ────────────────────────────────────────────────────
  // Dirección: peor presencia → mayor oportunidad (§7.1). «Funcionamiento» y
  // «velocidad» exigirían visitar el sitio: no medibles hoy.
  const presenciaWeb = evaluate("presenciaWeb", w.presenciaWeb, [
    { name: "existencia del sitio", value: ownSite ? 20 : 100 },
    { name: "calidad general", value: ownSite ? 35 : borrowed ? 75 : 100 },
    { name: "estructura", value: ownSite ? 40 : borrowed ? 80 : 100 },
    { name: "funcionamiento", value: null },
    { name: "velocidad", value: null }
  ],
    ownSite
      ? "Tiene sitio propio: la brecha de presencia web es menor, aunque su calidad no puede verificarse sin visitarlo."
      : borrowed
        ? "Opera sobre una plataforma prestada o una red social, sin sitio propio: brecha alta."
        : "No tiene ninguna presencia web propia: es la brecha máxima que este perfil premia.");

  // ── §6.2 Identidad Digital ────────────────────────────────────────────────
  // Un negocio activo en redes pero sin web propia demuestra que le importa su
  // imagen y solo le falta el sitio: señal fuerte de oportunidad.
  const identidadDigital = evaluate("identidadDigital", w.identidadDigital, [
    { name: "redes sociales", value: borrowed ? 90 : ownSite ? 40 : 30 },
    { name: "imagen profesional", value: ownSite ? 45 : borrowed ? 70 : 50 },
    { name: "consistencia de marca", value: null },
    { name: "actividad reciente", value: null }
  ],
    borrowed
      ? "Mantiene presencia en redes o directorios: ya invierte en su imagen y solo le falta un sitio propio."
      : "Sin señales de presencia social en los datos disponibles.");

  // ── §6.3 Información Comercial ────────────────────────────────────────────
  // Condición de contactabilidad (§7.1): más datos de contacto → más fácil
  // dirigirse al negocio. `googleMapsUrl` acredita dirección física.
  const informacionComercial = evaluate("informacionComercial", w.informacionComercial, [
    { name: "teléfono", value: isPresent(input.phone) ? 100 : 0 },
    { name: "dirección", value: isPresent(input.googleMapsUrl) ? 100 : 0 },
    { name: "correo", value: null },
    { name: "horarios", value: null },
    { name: "descripción del negocio", value: null }
  ],
    isPresent(input.phone)
      ? "Hay teléfono y ubicación verificable: el negocio es contactable de inmediato."
      : "Sin teléfono en los datos públicos: el contacto exigirá otra vía.");

  // ── §6.4 Reputación ───────────────────────────────────────────────────────
  // Señal de solidez: un negocio con reseñas activas puede contratar. Limitada
  // al 12 % por APS-08 §4.4, que **prohíbe favorecer por tamaño o reputación**.
  // R-38: rating 0 y reviewCount 0 se tratan como AUSENCIA de dato, no como
  // reputación nula — el contrato no permite distinguirlos (desviación A-03).
  const reputacion = evaluate("reputacion", w.reputacion, [
    { name: "calificación", value: input.rating > 0 ? Math.round((Math.min(input.rating, 5) / 5) * 100) : null },
    { name: "número de reseñas", value: input.reviewCount > 0 ? Math.round(Math.min(input.reviewCount, 100)) : null },
    { name: "antigüedad de las reseñas", value: null },
    { name: "consistencia", value: null }
  ],
    input.rating > 0
      ? `Calificación ${input.rating} con ${input.reviewCount} reseñas: negocio en actividad, con capacidad de contratar.`
      : "Sin datos de reputación publicados: no se puntúa esta categoría en lugar de asumir reputación nula.");

  // ── §6.5 Potencial de Mejora ──────────────────────────────────────────────
  // «Oportunidades evidentes de optimización» (§6.5). La ausencia de sitio web
  // es la más evidente, y es lo que §7.1 sitúa en el centro del perfil.
  // «información incompleta» queda **sin medir** deliberadamente. Es un factor que
  // §6.5 enumera, pero con los datos actuales solo podría derivarse de la
  // presencia de teléfono y dirección — exactamente lo que §6.3 ya puntúa como
  // categoría propia, con su propio peso del 8 %. Medirlo aquí lo contaría dos
  // veces y **con signo opuesto**: más datos de contacto subirían Información
  // Comercial y bajarían Potencial de Mejora a la vez.
  //
  // Ese doble cómputo tenía dos consecuencias, ambas verificadas por barrido
  // exhaustivo de 3.456 combinaciones:
  //   · concedía a la contactabilidad un peso oculto adicional, distorsionando
  //     los pesos que WP-01 declara;
  //   · imponía un techo de **86 puntos**, que dejaba la banda «Oportunidad
  //     Excelente» (90-100) **inalcanzable** e incumplía la verificación **RV-D**
  //     de APS-08 §7.1 — «ninguna combinación impide alcanzar cualquier banda».
  //
  // Excluirlo restablece RV-D y respeta los pesos declarados. Queda registrado
  // en el informe de DEV-04 como parte de la decisión requerida D-1.
  const potencialDeMejora = evaluate("potencialDeMejora", w.potencialDeMejora, [
    { name: "ausencia de sitio web", value: ownSite ? 25 : 100 },
    { name: "diseño desactualizado", value: borrowed ? 85 : null },
    { name: "información incompleta", value: null },
    { name: "problemas de usabilidad", value: null }
  ],
    ownSite
      ? "Tiene sitio propio: el margen de mejora existe pero es menor y exige auditoría."
      : "Sin sitio web propio: la oportunidad de optimización es inmediata y evidente.");

  // ── §6.6 Compatibilidad ───────────────────────────────────────────────────
  // «Si el tipo de empresa coincide con el perfil profesional del usuario»
  // (§6.6). Es la categoría que hace que el Score signifique «potencial para
  // este usuario concreto» (§7.1 · PO-01 §5).
  const niche = normalize(user.targetNiche);
  const industry = normalize(input.industry);
  const nicheWords = niche.split(/\s+/).filter((word) => word.length > 3);
  const nicheMatch =
    niche !== "" && industry !== "" &&
    (industry.includes(niche) || niche.includes(industry) ||
      nicheWords.some((word) => industry.includes(word)));

  const compatibilidad = evaluate("compatibilidad", w.compatibilidad, [
    {
      name: "encaje con el perfil profesional",
      // Sin nicho declarado no se asume incompatibilidad: no se mide (R-38).
      value: niche === "" ? null : nicheMatch ? 100 : 55
    },
    {
      // V1 «dirigida a negocios que puedan beneficiarse de diseño web» (§6.6).
      name: "beneficio potencial de servicios de diseño web",
      value: ownSite ? 60 : 100
    }
  ],
    niche === ""
      ? "El usuario no ha declarado nicho objetivo: el encaje no se puntúa, solo el beneficio potencial."
      : nicheMatch
        ? `La Empresa pertenece al nicho objetivo declarado ("${user.targetNiche}").`
        : `La Empresa está fuera del nicho objetivo declarado ("${user.targetNiche}"), aunque puede beneficiarse de un sitio web.`);

  const categories = [
    presenciaWeb, potencialDeMejora, compatibilidad,
    reputacion, identidadDigital, informacionComercial
  ];

  // Solo las categorías con parcial contribuyen, y solo su peso entra al
  // divisor: los pesos relativos de WP-01 se conservan y la escala sigue 0-100.
  const evaluatedWeight = categories
    .filter((c) => c.partialScore !== null)
    .reduce((sum, c) => sum + c.weight, 0);

  const breakdown: CategoryBreakdown[] = categories.map((c) => ({
    ...c,
    contribution:
      c.partialScore === null || evaluatedWeight === 0
        ? 0
        : Math.round(((c.weight * c.partialScore) / evaluatedWeight) * 100) / 100
  }));

  const rawScore =
    evaluatedWeight === 0
      ? null
      : categories
          .filter((c) => c.partialScore !== null)
          .reduce((sum, c) => sum + c.weight * (c.partialScore as number), 0) / evaluatedWeight;

  const score = rawScore === null ? null : Math.max(0, Math.min(100, Math.round(rawScore)));

  // Cobertura y confianza — APS-08 §11 exige señalar que la confianza «puede ser
  // limitada» cuando la información pública es insuficiente.
  const totalFactors = categories.reduce(
    (sum, c) => sum + c.measuredFactors.length + c.unmeasuredFactors.length, 0
  );
  const measuredFactors = categories.reduce((sum, c) => sum + c.measuredFactors.length, 0);
  const coverage = totalFactors === 0 ? 0 : Math.round((measuredFactors / totalFactors) * 100) / 100;

  const confidence: ScoreConfidence =
    evaluatedWeight < totalWeight(profile) || coverage < 0.5
      ? "limitada"
      : coverage < 0.7
        ? "media"
        : "alta";

  return {
    score,
    band: score === null ? null : classifyScore(score),
    profileVersion: profile.version,
    breakdown,
    confidence,
    coverage,
    evaluatedWeight
  };
}
