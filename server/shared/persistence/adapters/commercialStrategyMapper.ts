// Traducción de los **dos valores compartidos** de la frontera de persistencia
// comercial: el Hecho Afirmable y la Commercial Strategy. Funciones puras — sin
// I/O y sin generación de identificadores ni marcas temporales.
//
// ── POR QUÉ VIVE EN FICHERO PROPIO ───────────────────────────────────────────
//
// **Por la misma razón que `AffirmableFact.ts` y `AffirmableFactModel.ts`:** los
// comparten **dos** agregados —`Proposal` (A-6) y la estrategia que
// `CommercialSequence` (A-12) conserva por contacto— y **ambos lados de la
// traducción tienen una única declaración canónica**. Traducirlos dos veces
// hacía posible que un agregado almacenase la misma estrategia de una forma y el
// otro de otra: exactamente la divergencia que **COM-21 §5** descartó al decidir
// que `CommercialStrategyModel` sigue al Persistence Contract compartido.
//
// ── QUÉ NO ES ESTE FICHERO ───────────────────────────────────────────────────
//
// **No es un mapper universal, y no puede llegar a serlo.** No conoce ningún
// agregado: no traduce `Proposal`, no traduce `CommercialSequence` y no declara
// metadatos de persistencia. La responsabilidad por agregado sigue íntegra en
// `proposalMapper.ts` y `commercialSequenceMapper.ts`, que son los únicos que
// nombran su fila, su identidad y su `meta`.
//
// Sigue dentro de `shared/persistence/adapters/`, de modo que **R-26** se
// mantiene: la conversión Contract ↔ Model no sale del Database Adapter.
//
// **No lee ninguna decisión: las copia.** `objective`, `barrier` y `emotion`
// atraviesan este fichero sin ser inspeccionados. No construye estrategias
// —vive fuera del módulo y no puede importar su `domain/` (ADR-08 §10 · R-27)—
// y **no añade ni quita hechos** (RA-4 · RE-1).

import { AffirmableFactRecord } from "../contracts/AffirmableFact";
import { AffirmableFactModel } from "../models/AffirmableFactModel";
import { CommercialStrategy } from "../contracts/CommercialStrategy";
import { CommercialStrategyModel } from "../models/CommercialSequenceModel";
import { Channel, EvidenceObservation, FactKind, SequenceMoment } from "../contracts/commercialValues";

/**
 * **Transformación** — el conjunto cerrado se degrada a `string`. La estructura
 * anidada de `source` **se conserva**: aplanarla obligaría a rearmarla al leer.
 */
export function toAffirmableFactModel(fact: AffirmableFactRecord): AffirmableFactModel {
  return {
    kind: fact.kind,
    statement: fact.statement,
    source: { observation: fact.source.observation, source: fact.source.source }
  };
}

/**
 * **Reconstrucción** — los dos conjuntos cerrados vuelven del `string` con que se
 * almacenan, igual que `channel` y `moment` más abajo.
 */
export function toAffirmableFactRecord(model: AffirmableFactModel): AffirmableFactRecord {
  return {
    kind: model.kind as FactKind,
    statement: model.statement,
    source: {
      observation: model.source.observation as EvidenceObservation,
      source: model.source.source
    }
  };
}

/**
 * Los diez contenidos de APS-18 §8.1, uno a uno.
 *
 * **Los hilos son opcionales y su ausencia es significativa**: no hay hilo previo
 * en el primer contacto (§4.6 · R-38). Asignarlos incondicionalmente
 * introduciría las propiedades con `undefined`, y un contacto sin hilo pasaría a
 * *tener* un hilo vacío.
 */
export function toCommercialStrategyModel(strategy: CommercialStrategy): CommercialStrategyModel {
  const model: CommercialStrategyModel = {
    objective: strategy.objective,
    barrier: strategy.barrier,
    evidenceBase: strategy.evidenceBase.map(toAffirmableFactModel),
    focus: strategy.focus,
    emotion: strategy.emotion,
    relevanceElement: strategy.relevanceElement,
    channel: strategy.channel,
    moment: strategy.moment,
    expectedOutcome: strategy.expectedOutcome
  };
  if (strategy.resumedThread !== undefined) model.resumedThread = strategy.resumedThread;
  if (strategy.openedThread !== undefined) model.openedThread = strategy.openedThread;
  return model;
}

export function toCommercialStrategy(model: CommercialStrategyModel): CommercialStrategy {
  const strategy: CommercialStrategy = {
    objective: model.objective as CommercialStrategy["objective"],
    barrier: model.barrier as CommercialStrategy["barrier"],
    evidenceBase: model.evidenceBase.map(toAffirmableFactRecord),
    focus: model.focus,
    emotion: model.emotion as CommercialStrategy["emotion"],
    relevanceElement: model.relevanceElement,
    channel: model.channel as Channel,
    moment: model.moment as SequenceMoment,
    expectedOutcome: model.expectedOutcome
  };
  if (model.resumedThread !== undefined) strategy.resumedThread = model.resumedThread;
  if (model.openedThread !== undefined) strategy.openedThread = model.openedThread;
  return strategy;
}
