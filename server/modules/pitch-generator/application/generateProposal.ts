// `GenerateProposal` — caso de uso canónico de ADR-16 §7. Evento **E-5**.
//
// **Coordina; no decide** (D-2 · RA-6 · D-A3). ADR-16 §7 reparte así:
//   · `domain/` decide la **estrategia**, construye la **lista cerrada** y aloja
//     el **punto de control**.
//   · `application/` encadena estrategia → redacción → verificación, **rehace si
//     no supera el control** y entrega para persistir.
//   · `infrastructure/` **redacta** y persiste A-6.
//
// **Un caso de uso, un evento** (AL-04): E-5 y ninguno más. **P-I3 · LS-3** —
// emitir una Propuesta **no cambia el estadio del Lead**.
//
// **Es el único caso de uso que atraviesa la Línea de Decisión, y en un solo
// sentido** (ADR-15 §10 · COM-09 §1):
//
//     domain/ construye la lista cerrada
//             → infrastructure/ redacta con ella
//                     → domain/ VERIFICA contra ella
//                             → si no supera, REHACE
//
// ── LO QUE ESTE CASO DE USO NO PUEDE HACER ───────────────────────────────────
//
// **No busca información: toda entra por argumento** (ADR-15 §12 · COM-07 §1).
// `Deps` **no contiene** `BuyerDiagnosisRepository` ni `CommercialSequenceRepository`
// y no puede contenerlos (COM-09 §6 · AL-08): el diagnóstico y la secuencia
// **entran como dato**. Tampoco conoce Lead Hunter ni Lead Analyzer — la
// comunicación entre módulos pasa por el Orchestrator (R-02 · R-03 · R-11).
//
// **No decide nada de lo que encadena**: no produce la estrategia, no deriva
// hechos, no crea evidencia y **no modifica ni la una ni los otros**. La
// estrategia la devuelve `domain/` y viaja intacta hasta la emisión; la lista
// cerrada entra congelada y **ninguna capa la amplía** (RE-1 · RA-4).
//
// ── ESTADO · DOS BLOQUEOS DE GOBERNANZA ABIERTOS ─────────────────────────────
//
// **El flujo está completo; los dos puntos de decisión que encadena, no**
// (COM-11 §1). `selectStrategy` y `passesControlPoint` están declarados y
// documentados en `domain/` y **lanzan**: sin `SP-01` publicado (**B-1**) no hay
// estrategia reproducible, y **B-2** no ha fijado cuántas veces se rehace. En
// consecuencia **este caso de uso no puede emitir todavía**, y **no está cableado
// en el Composition Root ni en ningún Orchestrator ni ruta**.

import { AffirmableEvidence } from "../domain/commercial/factConsumption";
import { Channel } from "../domain/commercial/channel";
import { ClosedFactList } from "../domain/commercial/evidence";
import { CommercialCriteriaVersion } from "../domain/commercial/criteriaVersion";
import { CommercialStrategy } from "../domain/commercial/commercialStrategy";
import { CRITERIA_VERSION_ABSENT } from "../domain/commercial/diagnoseBuyer";
import { IssueNumber, LeadReference } from "../domain/commercial/leadReference";
import { ProposalDraftingPort } from "../domain/commercial/proposalDraftingPort";
import { ProposalIssued } from "../domain/commercial/commercialEvents";
import { ProposalRepository } from "../../../shared/persistence/repositories/ProposalRepository";
import { ReducedDiagnosis } from "../domain/commercial/reducedDiagnosis";
import { ReducedSequence } from "../domain/commercial/reducedSequence";
import { SequenceMoment } from "../domain/commercial/sequenceMoment";
import { messageOf } from "../../../shared/errors";
import { passesControlPoint } from "../domain/commercial/controlPoint";
import { selectStrategy } from "../domain/commercial/selectStrategy";

/**
 * El diagnóstico y la secuencia recortados **se declaran en `domain/`** —los
 * consume la decisión de estrategia, que es dominio (ADR-16 §7)— y se reexportan
 * aquí porque forman parte de la superficie de entrada de COM-07 §6. **Su forma
 * no cambia**: es la misma que fijó el Sprint 10 · Fase 1.
 */
export type {
  ReducedDiagnosis,
  ReducedDiagnosisVariable
} from "../domain/commercial/reducedDiagnosis";
export type { ReducedSequence } from "../domain/commercial/reducedSequence";

// ─── ENTRADA · COM-07 §6 ─────────────────────────────────────────────────────

/**
 * **La entrada completa, y nada más entra** — COM-07 §6, **corregido por
 * COM-14 §4.1, COM-15 §3 y COM-16 §5**.
 *
 * **Cuatro campos**, cada uno con la regla que lo justifica; **ninguno está «por
 * si acaso»** (Sprint 04 · F-8).
 *
 * **Qué NO está aquí, y por qué:**
 *
 * · **`CommercialStrategy`** — **no se recibe: la produce `domain/`**
 *   (COM-07 §4.2 · ADR-16 §7). Recibirla ya hecha significaría que alguien
 *   decidió fuera del dominio, **la fuga que RA-R1 y RC-3 declaran la más
 *   probable de la arquitectura comercial**.
 * · **El Perfil de Estrategia, y también su versión** — **COM-15 §3**. El
 *   criterio vive transcrito en `domain/` (ADR-18 §7) **junto a su designación**,
 *   igual que `weightingProfile.ts`, y **la emisión se sella desde el criterio
 *   que se aplicó**. Recibirla por argumento permitiría decidir bajo un criterio
 *   y sellar con otro, **sin que nada pudiera detectarlo** — y con ello RC-13 y
 *   ADR-15 §7.2 dejarían de ser verificables.
 * · **Los indicios del diagnóstico** — COM-07 §2.2 · COM-14 §4.2.
 * · **El `commercialState` como campo suelto** — COM-14 §4.1: **es la variable
 *   BD-1** (BD-I4), y viaja dentro de `diagnosis.variables`.
 * · **El canal** — COM-07 §5.2: es contenido de la estrategia (CM-3).
 * · **El número de secuencia y la manifestación del comprador** — COM-16 §5.1
 *   y §5.5.
 */
export interface GenerateProposalInput {
  readonly lead: LeadReference;
  readonly diagnosis: ReducedDiagnosis;
  /**
   * **Lo único que el texto podrá afirmar** (P-I4 · RE-1). Ya inmutable y ya
   * cerrada: la produjo la proyección y **ninguna capa la amplía** (RA-4).
   *
   * **Lista vacía es estado válido**: un contacto que no pueda afirmar nada es
   * información, no un fallo (RE-5).
   */
  readonly evidence: AffirmableEvidence;
  readonly sequence: ReducedSequence;
}

// ─── SALIDA · COM-09 §4 ──────────────────────────────────────────────────────

/**
 * La emisión producida, **en tipos del propio módulo** (C-2 · AL-13). Se
 * construye desde el dominio, nunca desde el objeto que devuelve el repositorio
 * (R-22 · ADR-08 §10): de él solo se toma `id`, que es una cadena y no un
 * contrato.
 *
 * ⚠️ **No es un `ProposalDraft`, y ese tipo no existe ni debe crearse**
 * (COM-09 §4.1): **`Proposal` no tiene estado de borrador**. ADR-16 §4.4 la
 * define emitida y versionada, y **P-I5** declara que *«emitida y nunca enviada
 * es un estado válido»* — que es exactamente lo que un «borrador» pretendería
 * nombrar.
 *
 * **`affirmableFacts` viaja con la emisión y no es redundante**: es lo que hace
 * **P-I4** comprobable *después* — sin ella nadie puede verificar que ninguna
 * afirmación carecía de respaldo.
 */
export interface ProposalEmission {
  id: string;
  lead: LeadReference;
  moment: SequenceMoment;
  issue: IssueNumber;
  /** La produjo `domain/`. **Nunca se recibió** (COM-07 §4.2). */
  strategy: CommercialStrategy;
  /** La lista contra la que el punto de control verificó (P-I4). */
  affirmableFacts: ClosedFactList;
  text: string;
  channel: Channel;
  criteriaVersion: CommercialCriteriaVersion;
}

/**
 * Unión discriminada por literal (AL-12 · ADR-17 §7.3). **Las cinco ramas de
 * COM-09 §4.2, ni una más**:
 *
 * · `control_failed` — **el texto no superó el punto de control**. *«Un texto que
 *   no supera el control se rehace; no se entrega con advertencia»* (ADR-15 §10 ·
 *   DDD-01 §8). **Agotar los intentos es una rama del resultado, nunca un texto
 *   entregado con reserva** (COM-09 §5 · COM-11 §4.5).
 * · `drafting_unavailable` — el proveedor de redacción no respondió. El adapter
 *   lo envolvió conservando `cause`; **este caso de uso nunca ve un error de
 *   SDK** (AL-14 · R-63).
 * · `diagnosis_missing` — no hay diagnóstico vigente (ADR-16 §7 · COM-09 §7).
 * · `persistence_failed` — se emitió pero no pudo conservarse; **sin motivo
 *   técnico al usuario** (R-61 · UI-9).
 *
 * **Un invariante roto no es rama de resultado: se lanza** (AL-16 · R-62).
 */
export type GenerateProposalResult =
  | { outcome: "success"; proposal: ProposalEmission; event: ProposalIssued }
  | { outcome: "control_failed"; attempts: number }
  | { outcome: "drafting_unavailable" }
  | { outcome: "diagnosis_missing" }
  | { outcome: "persistence_failed"; reason: string };

// ─── DEPENDENCIAS · COM-09 §6 ────────────────────────────────────────────────

/**
 * **Solo puertos** (AL-08). Ninguna opcional (F-3). **Son las dos únicas
 * dependencias que COM-09 §6 aprueba**, y la tabla de esa sección cierra la
 * lista: *«Prohibido en `Deps`: cualquier otra cosa»*.
 *
 * **Qué NO está aquí y no puede estarlo:**
 *
 * · **`BuyerDiagnosisRepository` y `CommercialSequenceRepository`** — el
 *   diagnóstico y la secuencia **entran como dato; no se buscan** (ADR-15 §12).
 * · **Cualquier repositorio o puerto de Lead Hunter o Lead Analyzer** — la
 *   comunicación entre módulos pasa por el Orchestrator (R-02 · R-03 · R-11).
 * · **Las funciones de `domain/`** —`selectStrategy` y `passesControlPoint`— **no
 *   se inyectan**: son `domain/` del propio módulo y se importan directamente
 *   (D-A1 · COM-09 §6). Solo lo externo se inyecta.
 * · **El número de reintentos del punto de control** — **`Deps` contiene solo
 *   puertos y funciones de caso de uso; un número no es ninguna de las dos**
 *   (AL-08 · COM-11 §4.2). Tampoco se lee de configuración (ADR-17 §13,
 *   prohibición 9).
 *
 * `proposalRepository` es la **Repository Interface, nunca el adapter**
 * (AL-06 · R-22), y es la única persistencia que este caso de uso toca: A-6, su
 * propio activo. **No expone operación de estadio y no puede exponerla** —
 * ADR-13 v1.2 retiró A-3 de E-5 (P-I3 · LS-3).
 */
export interface GenerateProposalDeps {
  proposalDraftingPort: ProposalDraftingPort;
  proposalRepository: ProposalRepository;
}

export type GenerateProposalFn = (
  input: GenerateProposalInput
) => Promise<GenerateProposalResult>;

// ─── EL FLUJO ────────────────────────────────────────────────────────────────

export function createGenerateProposal(deps: GenerateProposalDeps): GenerateProposalFn {
  const { proposalDraftingPort, proposalRepository } = deps;

  return async function generateProposal(
    input: GenerateProposalInput
  ): Promise<GenerateProposalResult> {
    // ── 1 · VALIDAR LA ENTRADA ──────────────────────────────────────────────
    //
    // **Una comprobación, y ninguna más.** Todo lo demás lo garantiza el
    // contrato de entrada, y comprobarlo otra vez sería lógica adicional.
    //
    // **No hay diagnóstico vigente → `diagnosis_missing`** (COM-09 §7).
    // El caso de uso **no puede ir a comprobarlo** (ADR-15 §12): la única forma
    // observable de esa situación es que el Orchestrator no lo haya traído.
    if (!input.diagnosis) return { outcome: "diagnosis_missing" };

    // ── 2 · ESTRATEGIA ──────────────────────────────────────────────────────
    //
    // La decide `domain/`, íntegra. **Esta capa no la construye, no la corrige y
    // no la completa** (ADR-16 §7 · RA-R1 · RC-3), y no la recibe de fuera
    // (COM-07 §4.2). Viaja intacta desde aquí hasta la emisión.
    //
    // **`input.evidence.facts` se lee aquí y no vuelve a leerse.** Es la materia
    // prima que se entrega a la decisión; lo que sale de ella es la lista de
    // record.
    const strategy = selectStrategy({
      diagnosis: input.diagnosis,
      sequence: input.sequence,
      facts: input.evidence.facts
    });

    // ── LA LISTA CERRADA · UNA SOLA ─────────────────────────────────────────
    //
    // **A partir de aquí existe una única lista, y es la que produjo `domain/`.**
    //
    // **ADR-16 §7** atribuye al dominio tres cosas: *«la estrategia · **la lista
    // cerrada** · el punto de control»*, y **APS-18 §8.1** declara la base de
    // evidencia **contenido de la estrategia**. La lista contra la que se redacta,
    // se verifica y se emite es por tanto la del dominio — `evidenceBase` — y no
    // la del sobre de entrada.
    //
    // **Qué cambia esto en la práctica: nada de la semántica y una garantía de
    // más.** Antes se leía `input.evidence.facts` en cuatro puntos posteriores a
    // la decisión, de modo que **una estrategia que hubiese acotado su base de
    // evidencia habría sido redactada y verificada contra otra lista** sin que
    // ningún tipo lo impidiera. Ahora es imposible por construcción: **no hay
    // segunda referencia que pueda divergir** (RE-1 · RA-4 · P-I4).
    const facts = strategy.evidenceBase;

    // ── EL CRITERIO APLICADO ────────────────────────────────────────────────
    //
    // **La designación del criterio bajo el que se acaba de decidir** (RC-13 ·
    // COM-15 §3.1). **No entra por argumento y no se fabrica**: se lee del
    // `domain/` que la transcribe, igual que `GenerateDiagnosis`.
    //
    // Hoy vale `SIN-PERFIL-DE-ESTRATEGIA`: **declara la ausencia** en lugar de
    // inventar una versión, porque `"v1"` produciría **apariencia de
    // trazabilidad sin trazabilidad** —justo lo que RC-13 existe para impedir—
    // y **R-38 · RC-10 · BD-R2** lo prohíben. **RE-3: lo desconocido se declara,
    // no se disimula.**
    //
    // **Es el punto único que cambia cuando `SP-01` se publique** (B-1): pasará
    // a leer la designación del Perfil transcrito, y **ninguna otra línea de
    // este fichero se entera**.
    const criteriaVersion = CRITERIA_VERSION_ABSENT;

    // ── 3 · REDACCIÓN ───────────────────────────────────────────────────────
    //
    // **El modelo redacta. No decide** (APS-18 §10.1). Recibe decisiones
    // cerradas y devuelve solo texto (§10.2).
    //
    // ⚠️ **TODO(B-2 · COM-11 §4) — aquí se cierra el bucle rehacer→verificar.**
    // Los tramos 3 y 4 son el cuerpo del bucle: **redactar de nuevo y volver a
    // verificar**, tantas veces como el criterio comercial autorice. Falta el
    // número, y **R-52 prohíbe inventarlo**; **COM-11 §4.4 prohíbe además un
    // valor por defecto y un bucle sin límite**. Cuando se publique, su valor se
    // **transcribirá en `domain/`** desde su documento de autoridad —recomendado
    // APS-18 (COM-11 §4.3)—, **nunca en `Deps`** (AL-08) ni leído de
    // configuración (ADR-17 §13, prohibición 9), **y nunca en el adapter**: si
    // reintentase por su cuenta, el dominio no volvería a verificar cada texto
    // nuevo y el punto de control dejaría de serlo (COM-11 §4.1).
    //
    // Mientras tanto se ejecuta **un intento**, que es el mínimo que produce un
    // texto, y `attempts` informa de los realmente ejecutados — no de una
    // política.
    let attempts = 0;

    let text: string;
    try {
      attempts += 1;
      text = await proposalDraftingPort.draft({ strategy, facts });
    } catch {
      // El adapter ya envolvió el fallo del proveedor conservando `cause`
      // (AL-14 · R-63). Aquí **no se relanza ni se registra el detalle
      // técnico**: se traduce a la rama que el usuario puede entender (R-61 ·
      // UI-9).
      return { outcome: "drafting_unavailable" };
    }

    // ── 4 · PUNTO DE CONTROL ────────────────────────────────────────────────
    //
    // **Verifica `domain/`; rehace `application/`** (ADR-16 §7 · COM-09 §5).
    // Esta capa **no interpreta el veredicto ni lo matiza**: un texto que no lo
    // supera **no se entrega con advertencia** (ADR-15 §10 · DDD-01 §8).
    if (!passesControlPoint({ strategy, facts, text })) {
      // TODO(B-2): volver al tramo 3 mientras queden intentos autorizados.
      return { outcome: "control_failed", attempts };
    }

    // ── 5 · ENTREGA PARA PERSISTIR ──────────────────────────────────────────
    //
    // **Solo aquí, y solo tras la aprobación.** Nada se ha escrito antes: los
    // tramos 1 a 4 no tocan el repositorio.
    try {
      // **Número de emisión.** Sale del historial del propio activo: la
      // identidad es `(Lead, momento, número de emisión)` (ADR-16 §4.4 · AG-1) y
      // **regenerar añade; nunca sustituye** (P-I2 · V-1). No es una invención de
      // esta capa, igual que en `GenerateDiagnosis` y `CreateSequence`.
      const previous = await proposalRepository.findVersionsByMoment(
        input.lead,
        input.sequence.moment
      );
      const issue = previous.length + 1;

      // **Traducción explícita dominio → Persistence Contract** (ADR-08 §5). No
      // son el mismo tipo y no deben serlo; `application/` **no importa el
      // contrato** (ADR-17 §13, prohibición 4 · R-22): la forma la impone la
      // firma del repositorio.
      //
      // **Cada hecho viaja íntegro**: enunciado, clase y origen (COM-20 · COM-21).
      // Solo se descarta `lead`, que **la fila ya declara una vez** en su
      // identidad y del que se deriva —no se rellena— al rearmar la entidad.
      const stored = await proposalRepository.save({
        leadId: input.lead,
        moment: input.sequence.moment,
        issue,
        strategy: toPersistedStrategy(strategy),
        affirmableFacts: facts.map(toPersistedFact),
        text,
        channel: strategy.channel,
        criteriaVersion,
        // **V-3 — cada emisión conserva su marca temporal.** COM-07 §6 no la
        // declara como entrada, de modo que la aporta esta capa. **El dominio
        // sigue puro**: el reloj no entra en `domain/`. La divergencia con
        // `GenerateDiagnosis` —que sí la recibe por argumento— queda registrada
        // como **COM-12 RC-4**.
        issuedAt: new Date().toISOString()
      });

      // ── 6 · RESULTADO ─────────────────────────────────────────────────────
      //
      // **E-5 del catálogo cerrado de ADR-13 §13.1, y ningún otro** (AL-04).
      // **No toca el estadio del Lead** (P-I3 · LS-3 · CE-I1): ADR-13 v1.2
      // retiró A-3 de E-5 precisamente para cerrar esa conflación.
      return {
        outcome: "success",
        proposal: {
          id: stored.id,
          lead: input.lead,
          moment: input.sequence.moment,
          issue,
          strategy,
          affirmableFacts: facts,
          text,
          channel: strategy.channel,
          criteriaVersion
        },
        event: {
          code: "E-5",
          proposal: { lead: input.lead, moment: input.sequence.moment, issue }
        }
      };
    } catch (error) {
      // **Sin traza ni detalle del motor** (UI-9 · O-6). El error original no se
      // pierde: lo conserva quien lo lanzó, con su `cause` (R-63).
      return { outcome: "persistence_failed", reason: messageOf(error) };
    }
  };
}

/**
 * La forma que exige la frontera de persistencia, **derivada de la firma del
 * repositorio y no importada del contrato** (ADR-17 §13, prohibición 4 · R-22).
 */
type PersistedStrategy = Parameters<ProposalRepository["save"]>[0]["strategy"];

/** El hecho, en la forma de la frontera. **Derivada de la firma, no importada.** */
type PersistedFact = PersistedStrategy["evidenceBase"][number];

/**
 * Traduce un hecho afirmable a la forma de la frontera (ADR-08 §5).
 *
 * **Conserva los tres campos que COM-20 decidió** —enunciado, clase y origen— y
 * **descarta `lead`**, que la fila ya declara en su identidad y del que se
 * deriva: **derivar no es rellenar**, y R-38 prohíbe lo segundo, no lo primero.
 *
 * **No interpreta nada**: copia campo a campo. Ni resume, ni concatena, ni
 * recalcula (RA-4 · RE-1).
 */
function toPersistedFact(fact: ClosedFactList[number]): PersistedFact {
  return {
    kind: fact.kind,
    statement: fact.statement,
    source: { observation: fact.source.observation, source: fact.source.source }
  };
}

/**
 * Traduce la estrategia de dominio a la forma de la frontera (ADR-08 §5).
 *
 * **No decide nada y no altera la estrategia**: reproduce sus diez contenidos y
 * traslada su base de evidencia hecho a hecho. **Las ausencias siguen ausentes**
 * —un hilo que no existe no viaja como clave vacía— porque **R-38** prohíbe
 * sustituir un dato inexistente, y ausente y vacío no significan lo mismo
 * (§4.6: no hay hilo previo en el primer contacto).
 */
function toPersistedStrategy(strategy: CommercialStrategy): PersistedStrategy {
  return {
    objective: strategy.objective,
    barrier: strategy.barrier,
    evidenceBase: strategy.evidenceBase.map(toPersistedFact),
    focus: strategy.focus,
    emotion: strategy.emotion,
    ...(strategy.resumedThread === undefined ? {} : { resumedThread: strategy.resumedThread }),
    ...(strategy.openedThread === undefined ? {} : { openedThread: strategy.openedThread }),
    relevanceElement: strategy.relevanceElement,
    channel: strategy.channel,
    moment: strategy.moment,
    expectedOutcome: strategy.expectedOutcome
  };
}
