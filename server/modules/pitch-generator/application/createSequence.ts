// `CreateSequence` — caso de uso canónico de ADR-16 §7. Evento **E-8**.
//
// **Coordina; no decide** (D-2 · RA-6 · D-A3). ADR-16 §7 reparte así:
//   · `domain/` decide el plan de momentos, su orden y sus objetivos.
//   · `application/` encadena diagnóstico → plan y entrega para persistir.
//   · `infrastructure/` persiste A-12.
//
// **Un caso de uso, un evento** (AL-04): E-8 y ninguno más.

import { BuyerDiagnosisRepository } from "../../../shared/persistence/repositories/BuyerDiagnosisRepository";
import { CommercialSequenceRepository } from "../../../shared/persistence/repositories/CommercialSequenceRepository";
import { CommercialSequenceDesignedOrUpdated } from "../domain/commercial/commercialEvents";
import { Channel } from "../domain/commercial/channel";
import { PlannedMoment, SequenceStatus } from "../domain/commercial/CommercialSequence";
import { SequenceMoment } from "../domain/commercial/sequenceMoment";
import { LeadReference } from "../domain/commercial/leadReference";
import { designSequence } from "../domain/commercial/designSequence";

/**
 * **Solo lo que participa en una decisión.**
 *
 * Recibía la `CommercialEvidence` completa y de ella usaba dos datos:
 * `digitalPresence` y `presenceOrigin` **no intervenían en la selección de
 * momentos, ni en el orden, ni en la persistencia, ni en ninguna invariante**, y
 * sin embargo la API pública los exigía al cliente. Era la deuda **F-8**.
 *
 * **Los canales siguen siendo evidencia recibida, no inferida** —el principio de
 * D-2 y de ADR-15 §12 se conserva íntegro—, pero dejan de viajar dentro de
 * `CommercialEvidence`: aquel tipo declara ser *«todo lo que **el diagnóstico**
 * puede leer»*, y el diagnóstico nunca lee canales. Eran dos evidencias distintas
 * en un mismo sobre.
 */
export interface CreateSequenceInput {
  lead: LeadReference;
  /**
   * Los canales por los que este negocio es alcanzable.
   *
   * **Opcional, y su ausencia significa ausencia** (R-38): «no consta qué canales
   * alcanzan a este negocio» es distinto de «se ha comprobado que ninguno». En
   * ambos casos no hay secuencia que diseñar, y **ninguno se rellena por
   * defecto** ni se deduce de los atributos del Lead (RE-1 · RA-4).
   */
  reachableChannels?: Channel[];
}

/**
 * La secuencia diseñada, **en tipos del propio módulo** (C-2 · AL-13). Se
 * construye desde el dominio, nunca desde el objeto que devuelve el repositorio.
 */
export interface DesignedSequence {
  id: string;
  lead: LeadReference;
  sequence: number;
  status: SequenceStatus;
  plan: PlannedMoment[];
  currentMoment?: SequenceMoment;
}

/**
 * Unión discriminada por literal (AL-12 · ADR-17 §7.3). **Tres fallos esperados
 * y nombrados**, no excepciones (C-3 · R-61):
 *
 * · `diagnosis_missing` — no hay diagnóstico vigente. **Una secuencia se crea a
 *   partir del diagnóstico vigente** (DDD-01 §3.3 · ADR-16 §7, «encadena
 *   diagnóstico → plan»): diseñar sin él sería planificar contactos sin haber
 *   leído al comprador.
 * · `no_reachable_channel` — no consta ningún canal que alcance al negocio, o
 *   ninguno transporta momento alguno. **No es un error del sistema**: es la
 *   consecuencia honesta de CE-1 y de R-38, y **nunca se resuelve inventando un
 *   canal**.
 * · `persistence_failed` — el plan se diseñó pero no pudo conservarse.
 */
export type CreateSequenceResult =
  | { outcome: "success"; sequence: DesignedSequence; event: CommercialSequenceDesignedOrUpdated }
  | { outcome: "diagnosis_missing" }
  | { outcome: "no_reachable_channel" }
  | { outcome: "persistence_failed"; reason: string };

/**
 * Dependencias. **Solo puertos** (F-2 · AL-08), ninguna opcional (F-3).
 *
 * `buyerDiagnosisRepository` se recibe **solo para leer la emisión vigente**: el
 * caso de uso no la modifica y no puede hacerlo — versionar A-11 es competencia
 * de `GenerateDiagnosis` (E-7) y de `RegisterContact` (E-9).
 */
export interface CreateSequenceDeps {
  buyerDiagnosisRepository: BuyerDiagnosisRepository;
  commercialSequenceRepository: CommercialSequenceRepository;
}

export type CreateSequenceFn = (input: CreateSequenceInput) => Promise<CreateSequenceResult>;

export function createCreateSequence(deps: CreateSequenceDeps): CreateSequenceFn {
  const { buyerDiagnosisRepository, commercialSequenceRepository } = deps;

  return async function createSequence(
    input: CreateSequenceInput
  ): Promise<CreateSequenceResult> {
    const { lead, reachableChannels } = input;

    // ── DIAGNÓSTICO VIGENTE ─────────────────────────────────────────────────
    // Se lee, no se produce. Si falta, no hay secuencia que diseñar.
    let hasDiagnosis: boolean;
    try {
      hasDiagnosis = (await buyerDiagnosisRepository.findCurrentByLeadId(lead)) !== null;
    } catch (error) {
      return { outcome: "persistence_failed", reason: describe(error) };
    }
    if (!hasDiagnosis) return { outcome: "diagnosis_missing" };

    // ── DECISIÓN ────────────────────────────────────────────────────────────
    // La toma el dominio, íntegra. Esta capa no añade, quita ni reordena
    // momentos: hacerlo sería la fuga que RA-R1 y RC-3 declaran la más probable
    // de toda la arquitectura comercial.
    //
    // Ausente y vacío se tratan igual —no hay canal con el que contar— y ninguno
    // se rellena con un valor por defecto (R-38).
    const plan = designSequence(reachableChannels ?? []);
    if (plan.length === 0) return { outcome: "no_reachable_channel" };

    // ── NÚMERO DE SECUENCIA ─────────────────────────────────────────────────
    // Sale del historial existente: **CS-I5 — un Lead puede tener varias
    // secuencias y una nueva no borra la anterior**, de modo que el número forma
    // parte de la identidad `(Lead, nº de secuencia)` y nunca se reutiliza.
    let sequenceNumber: number;
    try {
      const existing = await commercialSequenceRepository.findByLeadId(lead);
      sequenceNumber = existing.length + 1;
    } catch (error) {
      return { outcome: "persistence_failed", reason: describe(error) };
    }

    // El momento vigente de una secuencia recién diseñada es **el primero del
    // plan**: es el contacto que toca. No implica que se haya emitido nada —el
    // estado es `Diseñada` y **CS-I4** exige acción del usuario para cada
    // contacto concreto—, solo declara cuál es el siguiente.
    const currentMoment = plan[0].moment;

    try {
      const stored = await commercialSequenceRepository.save({
        leadId: lead,
        sequence: sequenceNumber,
        status: "Diseñada",
        // **Traducción explícita dominio → Persistence Contract.** No son el
        // mismo tipo y no deben serlo (ADR-08 §5): el compilador lo hizo
        // evidente al rechazar el plan de dominio, cuya `evidenceBase` es
        // `readonly`. Pasarlo tal cual habría atado la persistencia a la forma
        // del dominio, que es justo lo que la frontera existe para impedir.
        //
        // Solo viajan `moment` y `proposals` porque **un plan recién diseñado no
        // tiene nada más**: la estrategia se decide antes de usar cada contacto
        // (SC-R1) y el resultado declarado exige un `ContactEvent` (CE-I2). No
        // se descarta información: no existe.
        plan: plan.map((planned) => ({
          moment: planned.moment,
          proposals: [...planned.proposals]
        })),
        currentMoment
      });

      return {
        outcome: "success",
        sequence: {
          id: stored.id,
          lead: lead,
          sequence: sequenceNumber,
          status: "Diseñada",
          plan,
          currentMoment
        },
        // E-8 del catálogo cerrado de ADR-13 §13.1. **Ningún otro**: esta
        // operación no toca el estadio (solo E-9, CE-I1) ni versiona el
        // diagnóstico.
        event: {
          code: "E-8",
          sequence: { lead: lead, sequence: sequenceNumber }
        }
      };
    } catch (error) {
      return { outcome: "persistence_failed", reason: describe(error) };
    }
  };
}

/** Mensaje legible del fallo, sin traza ni detalle del motor (UI-9 · O-6). */
function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
