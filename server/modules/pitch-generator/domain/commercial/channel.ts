// Canal — Value Object.
//
// Autoridad: **APS-20 §3**. Owner: Pitch Generator.
//
// **Un canal no es una integración** (DDD-01 §8 · APS-20 §3.4): no existe
// ninguna. El usuario envía manualmente (APS-18 §9.4). Sinónimos prohibidos:
// `Integración`, `Conector`.

/**
 * Los tres canales iniciales de APS-20 §6. **Superficie de comunicación con
 * reglas propias** de longitud, registro y formato.
 *
 * **APS-20 §3.1 — el canal restringe; no decide.** El orden es invariable:
 * `Diagnóstico → Estrategia → Canal → Redacción`. La estrategia se decide antes
 * de elegir canal, y el canal determina después si esa estrategia cabe.
 * **Nunca se abrevia la estrategia hasta que quepa, y nunca se excede el canal
 * para que quepa.**
 *
 * **APS-20 §3.2 — el canal no amplía la base de evidencia.** Contactar por
 * Instagram **no autoriza** a afirmar nada visto en Instagram: la lista cerrada
 * procede exclusivamente del análisis. Sin esta regla, la Regla de Evidencia se
 * vacía por el canal, que es su fuga más probable.
 *
 * **D-3 (ADR-16)** — la regla de canal es dominio; **el valor numérico de sus
 * límites, no**: vive en `infrastructure/` con su valor en APS-20 §6.
 */
export type Channel = "Email frío" | "LinkedIn Connection Note" | "Instagram DM";
