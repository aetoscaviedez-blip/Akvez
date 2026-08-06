// La evidencia que el sistema comercial **recibe ya unida y nunca busca**
// (ADR-15 §12 · APS-19 §3.2).
//
// **Owner: Lead Analyzer.** El sistema comercial la consume y **nunca la amplía
// ni la modifica** (RE-1 · RA-4 · DDD-01 §2.3). Quien une análisis y Score es el
// Orchestrator: un caso de uso jamás invoca a otro módulo (R-02 · R-11).
//
// Se declara en este `domain/` —y no se importa de `lead-analyzer`— porque
// **D-A2 prohíbe a un módulo importar el `domain/` de otro**. Es la misma razón
// por la que `LeadReference` no importa la entidad `Lead`.

import { LeadReference } from "./leadReference";

/**
 * Clasificación del activo digital observada por el análisis.
 *
 * **Es un hallazgo del análisis, no una lectura comercial.** APS-19 §4.1: «el
 * indicio es un hecho; la lectura no». Los tres valores son los que el Lead
 * Analyzer emite hoy.
 */
export type DigitalPresence =
  | "Sin sitio web"
  | "Sitio web deficiente"
  | "Sitio web básico";

/**
 * Dónde vive la presencia observada. **Discriminante que APS-19 §5.2 nombra
 * literalmente** al describir el estado *Inconsciente*: «ausencia total de
 * **activo digital propio** · presencia únicamente en **directorios de
 * terceros**».
 *
 * Existe porque `DigitalPresence` no basta: `Sitio web básico` agrupa un sitio
 * propio pobre con una presencia que solo vive en plataformas ajenas, y §5.2
 * sitúa cada caso en un estado distinto.
 *
 * **Dos valores y no tres.** No se distingue «red social» de «directorio»:
 * ninguno de los dos es un activo digital propio, que es exactamente la
 * distinción que §5.2 utiliza. Añadir un tercer valor exigiría un indicio que
 * §5.2 no nombra.
 *
 * **No nombra ningún proveedor** (P-2 · ADR-11 §9 E-6): quién descubrió la
 * presencia —Google Maps, un directorio, una plataforma social— es
 * conocimiento de `infrastructure/`, y la traducción a estos dos valores
 * corresponde a quien construye la evidencia, nunca al diagnóstico.
 */
export type PresenceOrigin = "Activo digital propio" | "Solo presencia en terceros";

/**
 * Todo lo que el diagnóstico puede leer. **Nada más entra**: ampliar esta
 * superficie es ampliar la base de evidencia, que RE-1 y RA-4 declaran cerrada.
 *
 * **No incluye el Opportunity Score deliberadamente.** APS-19 §3 lo separa: el
 * Score responde a «¿merece la pena?» y el diagnóstico a «¿cómo se aborda?».
 * Dejarlo fuera hace **CD-11** cierto por construcción — el diagnóstico no puede
 * modificar una emisión de Score que no ve— y evita que se cuele como insumo de
 * una lectura comercial, que **APS-19 §3.2** prohíbe.
 */
export interface CommercialEvidence {
  lead: LeadReference;
  digitalPresence: DigitalPresence;
  presenceOrigin: PresenceOrigin;
  /** Reputación visible. Ausente es ausente: nunca se sustituye por 0 (R-38). */
  rating?: number;
  reviewCount?: number;
}
