// **El punto de control** — `domain/`.
//
// Autoridad: **APS-18 §10.3** (qué comprueba) · **ADR-15 §10** (qué ocurre si no
// se supera) · **ADR-16 §7** (dónde vive).
//
// **Es la pieza más delicada del caso de uso** (COM-09 §5). Sin él, *«el modelo
// no decide»* sería una intención y no una propiedad: **es la comprobación lo que
// la convierte en verificable** (APS-18 §10.3).
//
// **Un texto que no supera el control se rehace; no se entrega con advertencia**
// (ADR-15 §10). Sinónimos **prohibidos** por DDD-01 §8: `Validación`, `Filtro`,
// `Guardrail` — *«un filtro deja pasar con advertencia; **esto rehace**»*.
//
// ── EL REPARTO, Y POR QUÉ ────────────────────────────────────────────────────
//
// **Verificar es `domain/`; rehacer es `application/`** (ADR-16 §7 · COM-09 §5).
// **Separarlos así es lo que impide que el reintento acabe decidiendo algo.**
// Reintentar dentro del adapter no vale: *«el dominio no volvería a verificar
// cada texto nuevo, y el punto de control dejaría de ser un punto de control»*
// (COM-11 §4.1).
//
// ── ⛔ NO IMPLEMENTADO ───────────────────────────────────────────────────────
//
// **TODO — implementar las cinco comprobaciones de APS-18 §10.3:**
//
//   1. ¿Persigue el objetivo declarado, **y solo ése**?
//   2. ¿Respeta las restricciones del canal?
//   3. **¿Afirma algo que no está en la lista de hechos afirmables?** (P-I4)
//   4. ¿Retoma el hilo que debía retomar?
//   5. **¿Alude a algún hallazgo sin enunciarlo?** (§4.7 · CA-23)
//
// **Depende de B-1.** Las comprobaciones 1 y 4 contrastan el texto contra
// decisiones —objetivo, hilo— que **hoy no puede haber**, porque la estrategia no
// puede producirse sin `SP-01` (ver `selectStrategy.ts`). Implementarlas antes
// obligaría a fijar **cómo se reconoce una afirmación en un texto**, criterio que
// ningún documento aprobado publica: **sería una decisión de arquitectura nueva,
// y R-38 · R-52 prohíben inventarla**.
//
// **Qué NO decide este fichero:** cuántas veces se rehace. Ese es el bloqueo
// **B-2**, es **criterio comercial y no capacidad técnica** (COM-11 §4.3), y su
// valor se **transcribirá** desde su documento de autoridad —recomendado APS-18—
// igual que `weightingProfile.ts` transcribe APS-08 §7.1. **Hoy no existe
// constante alguna, ni valor por defecto** (COM-11 §4.4 · R-52 · R-38).

import { ClosedFactList } from "./evidence";
import { CommercialStrategy } from "./commercialStrategy";
import { ControlPointUnavailableError } from "./proposalErrors";

/**
 * Lo que la verificación necesita: **el texto y aquello contra lo que se
 * verifica**. Nada más entra, y en particular **no entra el diagnóstico**: el
 * control comprueba el texto contra la estrategia y la lista, no contra la
 * lectura del comprador.
 */
export interface ControlPointInput {
  readonly strategy: CommercialStrategy;
  /** La lista cerrada. **Ninguna capa la amplía** (RE-1 · RA-4). */
  readonly facts: ClosedFactList;
  readonly text: string;
}

/**
 * `true` si el texto puede entregarse; `false` si **debe rehacerse**.
 *
 * Devuelve un veredicto y **no un texto corregido**: corregirlo aquí convertiría
 * la verificación en redacción, y **RA-5** declara que ningún resultado
 * generativo modifica diagnóstico, estado, estrategia ni secuencia.
 *
 * ⛔ **No implementado.** Ver la cabecera.
 */
export function passesControlPoint(input: ControlPointInput): boolean {
  void input;
  throw new ControlPointUnavailableError(
    "El punto de control exige las cinco comprobaciones de APS-18 §10.3 sobre una estrategia " +
      "producida bajo Perfil publicado (bloqueo B-1). No se aprueba ni se rechaza por defecto."
  );
}
