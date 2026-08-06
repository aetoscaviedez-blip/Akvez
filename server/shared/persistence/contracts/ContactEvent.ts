// Persistence contract del **Contacto declarado**.
//
// **Verificado por lectura directa de
// `modules/pitch-generator/domain/commercial/ContactEvent.ts` — no importado de
// allí** (ADR-08 §10 · DEV-00 §5.2).
//
// ⚠️ **Su activo es la divergencia OBS-06 de DDD-01, que sigue abierta.**
// ADR-13 §13.1 atribuye a E-9 los activos **A-3 · A-11 · A-12 · A-8** —ninguno
// exclusivo suyo—; **ADR-16 §6** le atribuye **A-7 · A-8**; y ADR-16 §6.1, una
// tercera lista. **Las tres difieren y prevalece ADR-13**, que es el catálogo.
//
// **Consecuencia para esta frontera:** la declaración del usuario se conserva
// como parte del **historial (A-8)**, cuya regla es «solo crece», que es
// exactamente la semántica que ADR-16 §4.5 atribuye a esta entidad. **No se crea
// ningún activo nuevo**, y el efecto de E-9 sobre A-3, A-11 y A-12 lo ejercen
// sus repositorios respectivos, nunca éste.

import { SequenceMoment } from "./commercialValues";

/**
 * Lo que el usuario **declara** que ocurrió.
 *
 * La identidad del agregado es `(Lead, momento, marca temporal)`
 * (ADR-16 §4.5 · AG-1).
 *
 * **La declaración mínima es binaria** (APS-18 §9.5): `responded`. La
 * manifestación es opcional porque «respondió con manifestación» **no es un
 * tercer valor**, sino la presencia del dato (ADR-16 §6.1) — modelarlo como
 * valor permitiría una manifestación sin respuesta, estado imposible.
 *
 * **CE-I4** — nunca lo genera el sistema: ni por inferencia, ni por tiempo, ni
 * por detección. Este contrato **no expone ninguna forma de crearlo sin
 * declaración del usuario**.
 */
export interface ContactEvent {
  leadId: string;
  moment: SequenceMoment;
  /** Marca temporal de la declaración, en formato ISO-8601. */
  declaredAt: string;
  responded: boolean;
  /** Presente solo si el comprador manifestó algo aprovechable (CE-I3). */
  manifestation?: string;
}
