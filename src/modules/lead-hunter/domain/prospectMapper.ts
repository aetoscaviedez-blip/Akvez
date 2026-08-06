import { Prospect } from "../../../shared/types";

/**
 * Traduce un lead del contrato público (`LeadResponseDTO`) al modelo de la UI.
 *
 * El identificador NO es un parámetro (H-03, Sprint 15). Lo asigna una sola vez
 * `LeadRepository.save()` en el backend y viaja intacto dentro de `raw.id`; esta
 * función se limita a leerlo. La firma anterior aceptaba un `id` externo, y esa
 * puerta era justamente la que permitía al frontend fabricar identificadores
 * propios y descartar el UUID real. Al eliminar el parámetro, reintroducir esa
 * generación deja de ser posible sin volver a cambiar esta firma.
 */
/**
 * Devuelve la cadena solo si trae contenido. **Vacío es ausencia**, no dato.
 *
 * Es la distinción que **R-38** protege, aplicada a la frontera de lectura:
 * `websiteUri` vacío significa que el negocio **no tiene sitio web**, no que
 * tengamos uno cuyo texto desconocemos.
 */
function textOrAbsent(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

/** Devuelve el número solo si lo es. **`0` es un valor real**, no una ausencia. */
function numberOrAbsent(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function mapRawProspectToProspect(raw: any): Prospect {
  // `id` es obligatorio en LeadResponseDTO. Si falta, es una violación del
  // contrato y debe tratarse como tal: no se inventa un reemplazo local —
  // hacerlo reintroduciría el defecto que esta refactorización elimina.
  if (typeof raw?.id !== "string" || raw.id.trim() === "") {
    throw new Error(
      "Contrato inválido: el lead recibido no trae `id`. El identificador lo asigna el servidor y es obligatorio en LeadResponseDTO."
    );
  }

  // ── ESTE MAPPER NO INVENTA NADA ─────────────────────────────────────────────
  //
  // **Traduce y conserva. Cuando un dato no viene, no viene.**
  //
  // Antes rellenaba siete campos con valores por defecto —un Score de 60, la
  // clasificación «✅ Lead Bueno», un problema web, una oportunidad comercial y
  // una pérdida de ingresos— de modo que **un negocio sin analizar se presentaba
  // como un negocio analizado**. Ninguno de esos valores procedía del servidor.
  //
  // **R-38** lo prohíbe: un valor por defecto «borra la distinción entre *no hay
  // dato* y *el dato es cero*». **R-45** declara además que un Lead **sin Score
  // es un estado legítimo**. La interfaz debe **declarar la ausencia**, y para
  // ello necesita recibirla.
  return {
    id: raw.id,
    name: raw.name,
    website: textOrAbsent(raw.website),
    googleMapsUrl: textOrAbsent(raw.googleMapsUrl),
    description: textOrAbsent(raw.description),
    // Lista vacía = **el análisis no detectó problemas**. Es un resultado, no
    // una ausencia — y por eso no se sustituye por un problema inventado.
    flaws: Array.isArray(raw.flaws) ? raw.flaws : [],
    // `opportunity` es el nombre público de `angle` (ADR-06, Decisión 1).
    angle: textOrAbsent(raw.opportunity),
    status: "Prospect",
    // Marca de incorporación al workspace, generada en el cliente. **No procede
    // del servidor y no pretende ser la fecha de descubrimiento**: hoy coinciden
    // porque el Lead se acaba de buscar.
    dateCreated: new Date().toLocaleDateString("es-CO", { month: "short", day: "numeric" }),
    // **`0` se conserva como 0**; la ausencia se conserva como ausencia.
    score: numberOrAbsent(raw.score) ?? null,
    // **Estado del sitio web**, no banda del Score. No se sustituye.
    classification: textOrAbsent(raw.classification),
    // ── Explicación del Score ────────────────────────────────────────────────
    //
    // **Se transporta tal cual llega.** `band` puede ser `null` en una emisión
    // real —cuando ninguna categoría pudo medirse— y esa nulidad **es un dato**,
    // no una ausencia: se conserva sin convertirla.
    band: raw.band === null ? null : textOrAbsent(raw.band),
    scoreVersion: textOrAbsent(raw.scoreVersion),
    confidence: textOrAbsent(raw.confidence),
    coverage: numberOrAbsent(raw.coverage),
    calculatedAt: textOrAbsent(raw.calculatedAt),
    breakdown: Array.isArray(raw.breakdown) ? raw.breakdown : undefined,
    revenueLoss: textOrAbsent(raw.revenueLoss),
    rating: numberOrAbsent(raw.rating),
    reviewCount: numberOrAbsent(raw.reviewCount),
    whyWebsiteNeeded: textOrAbsent(raw.whyWebsiteNeeded),
    phone: textOrAbsent(raw.phone),
    // Solo se conserva la fuente que el servidor declare. **No se infiere
    // ninguna**: las únicas fuentes reales son las que produce el descubrimiento.
    source: textOrAbsent(raw.source)
  };
}
