// Errores explícitos del caso de uso `GenerateProposal`.
//
// ── POR QUÉ SON ERRORES Y NO RAMAS DEL RESULTADO ─────────────────────────────
//
// **COM-09 §4.2 cierra el resultado en cinco ramas**, y ninguna de ellas nombra
// las situaciones de este fichero. La distinción no es de estilo:
//
// | | Rama del resultado | Error lanzado |
// | --- | --- | --- |
// | Qué describe | **Un desenlace del negocio** que el usuario puede entender | **Que la operación no debía intentarse** |
// | Regla | C-3 · R-61 — un fallo esperado viaja como rama | **AL-16 · R-62** — un invariante roto **se lanza** |
// | Ejemplo | «el proveedor no respondió» | «no hay criterio con el que decidir» |
//
// **Convertir estas situaciones en ramas sería declararlas desenlaces normales
// del negocio**, y no lo son: son la constancia de que falta una decisión de
// producto. Añadir una sexta rama exigiría además enmendar COM-09.
//
// ── POR QUÉ EXTIENDEN LA TAXONOMÍA COMÚN ─────────────────────────────────────
//
// `shared/errors` declara **exactamente cuatro categorías** (APS-03 §12) y es
// explícito sobre cómo se especializa: *«NO contiene errores específicos del
// negocio. Cuando un módulo necesite uno, extenderá la clase de la categoría que
// le corresponda»*. **Este fichero hace eso y nada más: no crea categorías** —la
// lista es cerrada y una quinta exigiría enmendar APS-03—.
//
// Puede importarse desde `domain/` sin violar **R-04**: `shared/errors` no tiene
// dependencias (ADR-04 §11).

import { AgentInternalError } from "../../../../shared/errors";

/**
 * **No hay Perfil de Estrategia con el que decidir** — bloqueo **B-1**.
 *
 * Categoría `agent_internal` porque **el fallo no es del que invoca**: la entrada
 * era correcta y el proveedor no intervino. Falta una publicación de producto
 * (`SP-01`), y de las cuatro categorías de APS-03 §12 es la única que describe un
 * fallo producido **dentro** de AKVEZ.
 *
 * **Sin versión del Perfil la estrategia no es reproducible** (ADR-15 §7.2), y
 * **P-I1** dice que sin estrategia explicable una `Proposal` *«no puede
 * explicarse después, que es exactamente lo que la hace útil»*. Emitir igualmente
 * no produciría propuestas peores: produciría **propuestas que nadie puede
 * explicar**, y ADR-18 §10.4 propone no reetiquetarlas — el defecto sería
 * **permanente** (COM-10 §5).
 */
export class StrategyProfileUnavailableError extends AgentInternalError {}

/**
 * **El punto de control no puede verificar** — depende de **B-1**.
 *
 * Las comprobaciones 1 y 4 de APS-18 §10.3 contrastan el texto contra decisiones
 * —objetivo, hilo— que hoy no puede haber. **No se aprueba ni se rechaza por
 * defecto**: aprobar sin verificar vaciaría P-I4, y rechazar siempre convertiría
 * un bloqueo de gobernanza en un desenlace de negocio.
 *
 * **Un texto que no supera el control se rehace; no se entrega con advertencia**
 * (ADR-15 §10). **No poder verificar no es no superar**, y por eso esto no es la
 * rama `control_failed`.
 */
export class ControlPointUnavailableError extends AgentInternalError {}

// ── RETIRADO · `MissingCriteriaVersionError` ─────────────────────────────────
//
// Declaraba que la entrada no traía la versión del criterio. **Dejó de tener
// sentido cuando COM-15 §3 sacó `criteriaVersion` de la entrada**: una entrada
// **no puede omitir lo que no envía**, y el criterio lo transcribe `domain/`
// junto a su designación.
//
// **Su desaparición no deja ningún hueco:** la ausencia de Perfil sigue
// declarada —`CRITERIA_VERSION_ABSENT`— y sigue impidiendo emitir, pero por la
// vía correcta: `StrategyProfileUnavailableError`, arriba.
