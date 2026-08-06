// Persistence contract del **Hecho Afirmable**.
//
// **Verificado por lectura directa de
// `modules/pitch-generator/domain/commercial/evidence.ts` — no importado de
// allí** (ADR-08 §10 · DEV-00 §5.2).
//
// Vive en fichero propio porque **lo comparten dos contratos** —el de `Proposal`
// y el de `CommercialStrategy`— y ninguno debe importar al otro para nombrarlo.
//
// ── QUÉ CONSERVA, Y POR QUÉ ──────────────────────────────────────────────────
//
// **COM-20** resolvió qué debe sobrevivir de cada hecho:
//
//   · **`statement`** — es el objeto del contraste que **P-I4** y **CA-18**
//     exigen: texto emitido ↔ lista cerrada.
//   · **`source`** — es **el rastro**. **APS-18 §11.1**: *«toda afirmación
//     comercial debe poder rastrearse hasta un hallazgo del análisis»*, y
//     **ADR-12 §7.4** emplea el verbo **conservar**. Sin él la afirmación
//     sobrevive y la propiedad que la regla nombra se destruye.
//   · **`kind`** — ninguna regla obliga a conservarlo, pero **es ambiguo en dos
//     de sus cuatro valores** frente a `source.observation`, y recuperarlo
//     obligaría a **interpretar el enunciado**. Un registro de evidencia que
//     exige interpretarse deja de serlo.
//
// ── QUÉ NO CONSERVA ──────────────────────────────────────────────────────────
//
// **`lead` no forma parte del registro** (COM-20 §3.1 · COM-21 §3.3). No es una
// omisión: es una **derivación demostrada**. La proyección recibe un solo Lead y
// todo hecho copia ese valor, de modo que
//
//     ∀ hecho ∈ Proposal.affirmableFacts : hecho.lead = Proposal.leadId
//
// El dato **está en la fila, una vez**, y **AG-1 ya queda satisfecho por la
// identidad del agregado**. Recuperarlo es derivar, no rellenar: **R-38** prohíbe
// *«sustituir un dato inexistente»*, y éste existe.

import { EvidenceObservation, FactKind } from "./commercialValues";

/**
 * De qué observación procede un hecho. **Metadato de trazabilidad, jamás
 * argumento comercial** — el enunciado nunca convierte la Fuente en argumento.
 *
 * `source` conserva la **Fuente** de la Referencia de Origen, que ADR-12 §7.4
 * autoriza expresamente a conservar: *«el dominio no adopta el identificador de
 * un proveedor: exige que exista uno y lo conserva»*.
 */
export interface EvidenceSourceRecord {
  observation: EvidenceObservation;
  source: string;
}

/**
 * Un hecho afirmable **tal como se conserva**.
 *
 * ⚠️ **No es `AffirmableFact`.** Es su **proyección conservable**: la misma
 * información menos `lead`, que se deriva de la identidad del agregado. Quien
 * rearme la entidad de dominio lo hace en `application/` — **nunca el adapter**
 * (COM-22 §3.1).
 */
export interface AffirmableFactRecord {
  kind: FactKind;
  statement: string;
  source: EvidenceSourceRecord;
}
