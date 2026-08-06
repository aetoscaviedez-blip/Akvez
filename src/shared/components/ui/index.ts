/**
 * **El Design System de AKVEZ.**
 *
 * Nueve primitivas. Toda pantalla se construye con estas y nada más.
 *
 * ── LA REGLA DE ENTRADA ──────────────────────────────────────────────────────
 *
 * Antes de crear un componente nuevo:
 *
 * 1. **¿Existe ya uno equivalente?** — casi siempre sí.
 * 2. **¿Puede generalizarse el existente?**
 * 3. **¿Puede parametrizarse?**
 * 4. **¿Serviría en las cinco pantallas?** — si solo sirve en una, es un
 *    componente de esa pantalla, no del sistema.
 *
 * **El objetivo no es escribir menos código: es tener menos componentes
 * distintos.** Cada anatomía nueva es una oportunidad de que AKVEZ parezca
 * construido por equipos distintos.
 */
export { default as Surface } from "./Surface";
export { default as Callout } from "./Callout";
export { default as Eyebrow } from "./Eyebrow";
export { default as SectionHeader } from "./SectionHeader";
export { default as EmptyState } from "./EmptyState";
export { default as Button } from "./Button";
export { default as ActionCard } from "./ActionCard";
export { default as Badge } from "./Badge";
export { default as IconFrame } from "./IconFrame";
export { default as Meter } from "./Meter";
export { StatGrid, StatTile } from "./StatGrid";
export { TONE, RADIUS, PADDING } from "./tone";
export type { Tone, Radius, Padding } from "./tone";
