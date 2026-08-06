// `BuyerDiagnosis` — Entidad · Aggregate Root.
//
// Autoridad: **ADR-16 §4.2**. Desarrollado en APS-19, APS-18 §6 y ADR-13 A-11.
// Owner: **Pitch Generator** (APS-03 §7.3 · ADR-16 §6).
//
// **Nombre canónico `BuyerDiagnosis`.** ADR-13 designa el mismo objeto como
// «Diagnóstico Comercial», activo **A-11** (OBS-03 de DDD-01: un concepto con
// dos nombres oficiales; se adopta el de su autoridad de modelo).
//
// **Qué es.** La lectura comercial de un negocio: **cómo abordarlo**.
// **Qué no es.** No es el Opportunity Score, y la diferencia es la razón de que
// exista: el Score responde a *«¿merece la pena?»*; el diagnóstico, a *«¿cómo se
// aborda?»* (APS-19 §3). **No describe a una persona**: describe al negocio.

import { DeclaredConfidence, DiagnosisVariable } from "./diagnosisVariable";
import { CommercialCriteriaVersion } from "./criteriaVersion";
import { IssueNumber, LeadReference } from "./leadReference";

/**
 * Identidad: **`(Lead, número de emisión)`** (ADR-16 §4.2 · AG-1).
 */
export interface BuyerDiagnosisId {
  lead: LeadReference;
  issue: IssueNumber;
}

/**
 * **Invariantes** (ADR-16 §4.2, transcritas sin código nuevo):
 *
 * - **BD-I1** — toda variable declara su clase: `Observable`, `Inferida` o
 *   `Desconocida`.
 * - **BD-I2** — ninguna `Desconocida` tiene valor asignado.
 * - **BD-I3** — toda `Inferida` conserva sus indicios.
 * - **BD-I4** — **el `CommercialState` es la variable BD-1**, no un campo
 *   aparte. Por eso esta entidad **no declara un campo `commercialState`**.
 * - **BD-I5 · RC-12** — **no produce puntuación ni orden**: no es comparable
 *   entre Leads.
 *
 * **Ciclo: versionado.** Cada emisión añade; ninguna retira (ADR-13 §10.3).
 * **Nadie lo modifica: se versiona.** Vigente es la emisión más reciente; las
 * anteriores **no se destruyen** (RC-9).
 *
 * **Eventos que lo afectan:** **E-7** emitido *(versiona)* · **E-9** contacto
 * declarado, **solo si hubo manifestación** *(versiona condicionalmente,
 * CE-I3)*. Ambos pertenecen al catálogo cerrado de ADR-13 §13.1; **este sprint
 * no crea ninguno**.
 *
 * > **Un diagnóstico con variables desconocidas es un diagnóstico correcto**, no
 * > incompleto. Antes del primer contacto lo esperable son **tres inferidas y
 * > cuatro desconocidas**; presentar siete sostenidas *«no es un diagnóstico
 * > mejor: es un diagnóstico que ha rellenado huecos»* (APS-19 §7.2).
 */
export interface BuyerDiagnosis {
  id: BuyerDiagnosisId;
  /**
   * Las siete variables de APS-19 §6, cada una con su clase, sus indicios y su
   * valor cuando proceda. **BD-1 porta el `CommercialState`** (BD-I4).
   */
  variables: DiagnosisVariable[];
  confidence: DeclaredConfidence;
  /** RC-13 — toda entidad emitida conserva la versión del criterio. */
  criteriaVersion: CommercialCriteriaVersion;
}
