// Contrato de consumo de Hechos Afirmables.
//
// Es la frontera que `GenerateProposal` recibirá cuando exista. **Se declara
// antes que él a propósito**: fijar qué puede consumir *antes* de escribir quien
// consume evita que el caso de uso arrastre lo que tenga a mano.
//
// ── POR QUÉ ES UNA ENTRADA Y NO UN PUERTO ────────────────────────────────────
//
// **ADR-15 §12** — el sistema comercial *«recibe la evidencia ya unida y **nunca
// la busca**»*. Un puerto inyectado en `Deps` le daría al caso de uso la
// capacidad de **ir a buscar** hechos, que es exactamente lo que esa regla
// prohíbe. Por eso los hechos llegan **como argumento**, igual que
// `CommercialEvidence` en `GenerateDiagnosis` y `reachableChannels` en
// `CreateSequence`.
//
// Quien los reúne es el **Orchestrator** (`commercialFactsOrchestrator`), único
// componente autorizado a coordinar agentes (R-11 · ADR-04 §7.6).
//
// ── LO QUE ESTE CONTRATO HACE IMPOSIBLE ──────────────────────────────────────
//
// No por vigilancia, sino porque **no existe el tipo que lo permitiría**:
//
//   · **Narrativa libre** — no hay campo de texto suelto. Todo enunciado es un
//     `AffirmableFact`, y todo `AffirmableFact` exige `kind` y `source`.
//   · **Inferencias** — `FactKind` no tiene valor inferido, y no puede tenerlo:
//     *«solo lo Observado puede afirmarse; lo Inferido nunca»* (RE-2 · DDD-01 §8).
//   · **`confidence` por hecho** — no se declara. Un hecho observado no tiene
//     grados: si admitiera confianza parcial dejaría de ser afirmable y sería
//     una inferencia (COM-05 §3.4).
//   · **Desconocidos** — no entran. `unmeasuredFactors` se declara en otro
//     lugar y nunca como hecho (RE-3).
//   · **Campos económicos no medidos** — no hay origen que los acredite:
//     ningún `EvidenceSource` corresponde a la narrativa del análisis, donde
//     vive `revenueLoss` (COM-04 §4 · CD-07).
//   · **Estrategias comerciales** — no viajan aquí. La estrategia es contenido
//     de `Proposal` y se decide contacto a contacto (SC-R1).
//
// ── LO QUE ESTE CONTRATO TODAVÍA NO DECLARA, Y POR QUÉ ───────────────────────
//
// `GenerateProposal` necesitará además **la estrategia del contacto**, y ésta la
// determinan el diagnóstico vigente, el momento de la secuencia y **la versión
// del Perfil de Estrategia** (ADR-15 §7.2). **El Perfil no existe** —ADR-18 sigue
// `Draft` y `SP-01` sin publicar—, de modo que declarar hoy esa parte del
// contrato sería inventar su forma. **Se declara lo que está decidido y nada
// más.**

import { ClosedFactList } from "./evidence";
import { LeadReference } from "./leadReference";

/**
 * La evidencia afirmable de un Lead, tal como un caso de uso la recibirá.
 *
 * **Inmutable de extremo a extremo**: `readonly` en cada campo y la lista
 * congelada por la proyección. Un hecho verificado por el punto de control no
 * puede cambiar después, o **P-I4 dejaría de ser comprobable**.
 *
 * **Lista vacía es estado válido.** Un Lead del que nada se ha observado no
 * produce hechos, y eso no bloquea nada: significa que un contacto no podrá
 * afirmar nada sobre él — que es información, no un fallo (RE-3 · RE-5).
 */
export interface AffirmableEvidence {
  readonly lead: LeadReference;
  readonly facts: ClosedFactList;
}
