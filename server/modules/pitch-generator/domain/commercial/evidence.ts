// Hecho afirmable y Lista cerrada — Value Objects.
//
// Autoridad: **APS-18 §11.3** (el hecho) y **ADR-15 §10.2** (la lista).
// **Owner del hecho afirmable: Lead Analyzer** — procede del análisis (DDD-01
// §4.2). Owner de la lista: Pitch Generator, que la construye por emisión.

import { LeadReference } from "./leadReference";

/**
 * De qué observación procede un hecho. **Metadato de trazabilidad, jamás
 * argumento comercial.**
 *
 * `source` conserva la **Fuente** de la Referencia de Origen (ADR-12 §7.1), que
 * §7.4 autoriza expresamente a conservar: *«el dominio no adopta el
 * identificador de un proveedor: exige que exista uno y lo conserva»*. Acredita
 * **dónde se observó** el dato y **nunca entra en el enunciado**: «Google Maps
 * demuestra que…» sería convertir al proveedor en argumento.
 */
export interface EvidenceSource {
  readonly observation: "atributo_de_empresa" | "reputacion_publicada" | "evaluacion";
  readonly source: string;
}

/** Qué clase de observación enuncia el hecho. **No distingue observado de
 *  inferido: aquí todo es observado**, por definición (RE-2). */
export type FactKind =
  | "presencia_web"
  | "contacto_publico"
  | "reputacion_publicada"
  | "factor_medido";

/**
 * **Hecho afirmable** — conocimiento `Observable` que un contacto puede
 * enunciar.
 *
 * Sinónimos prohibidos por DDD-01 §8: `Dato`, `Argumento`. **Solo lo Observado
 * puede afirmarse; lo Inferido nunca** (RE-2).
 *
 * `statement` es **lo único que un contacto puede llegar a decir**; el resto es
 * la trazabilidad que hace verificable **P-I4** —ninguna afirmación sin
 * evidencia en la lista— después de emitida la propuesta.
 */
export interface AffirmableFact {
  readonly lead: LeadReference;
  readonly kind: FactKind;
  readonly statement: string;
  readonly source: EvidenceSource;
}

/**
 * **Lista cerrada de hechos afirmables** — el conjunto completo de lo que un
 * contacto puede afirmar.
 *
 * Sinónimos prohibidos por DDD-01 §8: `Contexto`, `Prompt context` — sugieren
 * algo ampliable, y **es cerrada**.
 *
 * **RE-1 · RA-4 — se construye en el dominio y ninguna capa la amplía.** El
 * redactor no puede salir de ella, y **el adapter no puede añadir un solo
 * hecho** (ADR-15 §10.2 · ADR-16 §7). **P-I4** — ninguna afirmación de una
 * `Proposal` carece de evidencia en esta lista.
 *
 * **§11.1** — toda afirmación comercial debe poder rastrearse hasta un hallazgo
 * del análisis. **APS-20 §3.2** — el canal no la amplía.
 *
 * Se construye por emisión y **no persiste aparte** (DDD-01 §4.2): viaja dentro
 * de la `Proposal` que la usó.
 */
export type ClosedFactList = readonly AffirmableFact[];
