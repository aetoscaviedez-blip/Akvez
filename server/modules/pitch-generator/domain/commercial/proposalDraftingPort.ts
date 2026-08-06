// Puerto de **redacción de una propuesta comercial** — declarado por `domain/`.
//
// Autoridad: **COM-09 §6** (la dependencia y su forma) · **APS-18 §10.1 y §10.2**
// (qué recibe y qué devuelve) · **ADR-16 §2** (la dependencia sobre la redacción
// es un puerto de `domain/`) · **ADR-17 §6.3** (P-1…P-4).
//
// ⚠️ **No sustituye a `PitchDraftingPort` y no lo modifica.** Aquél recibe
// `designer` y `lead` sin tipar y devuelve un `PitchDraft`: es el flujo heredado.
// **COM-09 §6 declara que son dos puertos distintos y que conviene que
// coexistan** hasta retirar el anterior (deuda F-1 del Sprint 01). Ninguna capa
// debe usar los dos.
//
// Cumplimiento de ADR-17 §6.3:
//   · P-1 — solo tipos de este `domain/`. `strategy` y `facts` son Value Objects
//           comerciales; el retorno es un primitivo.
//   · P-2 — **no nombra ningún proveedor.** Qué modelo redacta es decisión del
//           Composition Root (ADR-17 §9.3).
//   · P-3 — **no expone parámetro operativo alguno**: ni modelo, ni reintentos de
//           proveedor, ni tiempo de espera, ni formato. Los límites numéricos del
//           canal viven en `infrastructure/` con su valor en APS-20 §6 (D-3), y
//           **por eso no viajan aquí**: el canal entra como decisión —dentro de
//           la estrategia—, nunca como su tabla de límites.
//   · P-4 — no expone credenciales.

import { ClosedFactList } from "./evidence";
import { CommercialStrategy } from "./commercialStrategy";

/**
 * Lo único que la redacción recibe.
 *
 * **APS-18 §10.2** enumera qué se le entrega: *«el objetivo, la barrera, la
 * emoción admisible, el hilo que retoma, el hilo que deja planteado, el canal con
 * sus restricciones y —de forma determinante— la lista cerrada de hechos
 * afirmables»*. **Los siete primeros son campos de `CommercialStrategy`**, de
 * modo que el puerto no declara ningún campo suelto por ellos: declararlos otra
 * vez permitiría entregar un objetivo distinto del que la estrategia decidió.
 *
 * **No existe un campo de contexto libre**, y no puede existir: `Contexto` y
 * `Prompt context` son sinónimos **prohibidos** de la lista cerrada (DDD-01 §8)
 * precisamente porque sugieren algo ampliable. **RA-4 — el adapter no puede
 * añadir un solo hecho.**
 *
 * ⚠️ **`facts` viaja además de `strategy.evidenceBase` porque COM-09 §6 lo
 * exige** —*«debe recibir la estrategia **y** la lista cerrada»*—. **El puerto no
 * cambia por ello, y no puede cambiar**: exponer una sola de las dos sería
 * enmendar COM-09 §6. Lo que sí está resuelto es de dónde sale: **quien invoca
 * pasa `strategy.evidenceBase`**, que es la lista que produjo `domain/`
 * (ADR-16 §7 · APS-18 §8.1). **No hay dos listas que puedan divergir.**
 */
export interface ProposalDraftingInput {
  readonly strategy: CommercialStrategy;
  readonly facts: ClosedFactList;
}

/**
 * **El modelo redacta. No decide** (APS-18 §10.1).
 *
 * **Devuelve el texto. Nada más** (APS-18 §10.2): ni asunto, ni explicación de
 * la estrategia, ni metadatos. Todo lo que no sea texto sería una decisión, y
 * **RA-5** declara que ningún resultado generativo modifica diagnóstico, estado,
 * estrategia ni secuencia — **el texto es una salida terminal**.
 *
 * Un fallo del proveedor se propaga **como excepción envuelta por el adapter,
 * conservando `cause`** (AL-14 · R-63): el caso de uso **nunca ve un error de
 * SDK**, y lo traduce a la rama `drafting_unavailable` de su resultado.
 */
export interface ProposalDraftingPort {
  draft(input: ProposalDraftingInput): Promise<string>;
}
