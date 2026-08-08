import { Prospect } from "../../../shared/types";

/**
 * **Derivación de oportunidades verificables (H-14.A′).**
 *
 * ── POR QUÉ EXISTE ───────────────────────────────────────────────────────────
 *
 * La sección «Oportunidades para ti» **no puede alimentarse de `lead.flaws`**.
 * La auditoría H-14 demostró que `flaws` es prosa generada, no observación: el
 * respaldo determinista y el prompt de Gemini afirman velocidad de carga,
 * adaptación móvil, ausencia de CTA y SEO local sobre sitios que **AKVEZ nunca
 * descarga ni inspecciona**.
 *
 * Este módulo produce el conjunto opuesto: oportunidades que se pueden
 * justificar carácter por carácter contra un dato observado.
 *
 * ── LA REGLA QUE GOBIERNA TODO ───────────────────────────────────────────────
 *
 * Cada oportunidad debe poder responder: **«¿qué dato permite afirmar esto?»**
 * Si no hay respuesta, no se emite. Por eso `evidence` y `rule` son campos
 * obligatorios del modelo y no adornos: si no se pueden rellenar con un hecho,
 * la oportunidad no existe.
 *
 * ── AUSENCIA NO ES DEFECTO ───────────────────────────────────────────────────
 *
 * Que Google Places no registre un sitio web permite decir **«no consta un
 * sitio web»**. No permite decir «su web es mala», «pierde clientes» ni
 * «necesita SEO». La redacción de este módulo mantiene esa distinción de forma
 * deliberada: describe lo que consta y ofrece un servicio, nunca diagnostica lo
 * que no se ha mirado.
 *
 * ── POR QUÉ VIVE EN `domain/` Y NO EN EL COMPONENTE ──────────────────────────
 *
 * Es una regla de negocio: qué constituye una oportunidad comercial y con qué
 * evidencia. No conoce React, no importa nada de `presentation/` y es
 * determinista — la misma entrada produce siempre la misma salida. La tarjeta
 * consume el resultado y no sabe cómo se produjo.
 */

/** Vocabulario cerrado. Añadir un valor obliga a declarar su evidencia. */
export type OpportunityId = "WEB_PRESENCE" | "OWNED_DOMAIN";

export interface EvidenceBasedOpportunity {
  id: OpportunityId;
  /** Nombre comercial corto de la oportunidad. */
  title: string;
  /** Qué sabe AKVEZ. Un hecho, nunca un juicio. */
  evidence: string;
  /** Qué puede ofrecer el profesional. Un servicio, nunca una promesa de resultado. */
  offer: string;
  /** La regla que la produjo. Permite auditar la salida sin leer este fichero. */
  rule: string;
}

/**
 * Plataformas de terceros: redes sociales, marketplaces y constructores con
 * subdominio compartido.
 *
 * ⚠️ **Esta lista replica la de `calculateScore`** (`server/modules/lead-analyzer/
 * domain/scoring.ts`), que la usa para su clasificación `Sitio web básico`. No se
 * importa porque cruzaría la frontera cliente/servidor. La duplicación está
 * reportada en H-14.A′ como deuda a consolidar.
 *
 * Detectar una de estas cadenas en la URL **es una observación**, no una
 * inferencia: se lee el enlace que Places devuelve, no su contenido.
 */
const THIRD_PARTY_HOSTS = [
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "linkedin.com",
  "wix",
  "blogspot",
  "weebly",
  "jimdo",
  "sites.google",
  "amarillas",
  "mercadolibre",
  "olx",
  "co.todoclasificados"
] as const;

/** `true` cuando Places no registra ningún sitio para el negocio. */
function hasNoWebsite(website?: string): boolean {
  if (!website) return true;
  const value = website.trim();
  if (value === "") return true;
  // El pipeline puede rellenar este literal en lugar de omitir el campo.
  return value.toLowerCase().includes("sin sitio web");
}

/** Plataforma de terceros detectada en la URL, o `null`. */
function thirdPartyHost(website: string): string | null {
  const url = website.toLowerCase();
  return THIRD_PARTY_HOSTS.find((host) => url.includes(host)) ?? null;
}

/**
 * Deriva las oportunidades verificables de un negocio.
 *
 * Devuelve un arreglo **posiblemente vacío**: un negocio con dominio propio no
 * ofrece ninguna oportunidad que AKVEZ pueda demostrar hoy, y eso es un
 * resultado legítimo que la interfaz debe declarar (R-38). Rellenar el hueco
 * con supuestos sería exactamente el defecto que este módulo evita.
 */
export function deriveOpportunities(lead: Pick<Prospect, "website">): EvidenceBasedOpportunity[] {
  if (hasNoWebsite(lead.website)) {
    return [
      {
        id: "WEB_PRESENCE",
        title: "Presencia web propia",
        evidence: "Google Places no registra ningún sitio web para este negocio.",
        offer:
          "Podrías crear su primer sitio: un lugar propio donde presente lo que hace y donde puedan contactarlo.",
        rule: "websiteUri ausente en Google Places"
      }
    ];
  }

  const host = thirdPartyHost(lead.website as string);
  if (host !== null) {
    return [
      {
        id: "OWNED_DOMAIN",
        title: "Dominio propio",
        evidence: `El enlace que registra Google Places apunta a ${host}, una plataforma de terceros.`,
        offer:
          "Podrías darle un sitio con dominio propio, que no dependa de una plataforma ajena.",
        rule: "websiteUri apunta a una plataforma de terceros conocida"
      }
    ];
  }

  // Dominio propio: no hay ninguna oportunidad demostrable sin inspeccionar el
  // sitio, y AKVEZ no lo inspecciona. Se devuelve vacío antes que suponer.
  return [];
}
