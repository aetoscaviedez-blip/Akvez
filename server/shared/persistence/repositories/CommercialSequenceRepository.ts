import { CommercialSequence } from "../contracts/CommercialSequence";
import { Identified } from "./Identified";

/**
 * Puerto de persistencia de la **Secuencia Comercial (A-12)**. Sin
 * implementación (AL-06 · ADR-08 §6, §10).
 *
 * **SEMÁNTICA: ACTUALIZAR** (ADR-13 §10.1, §10.3). Es **el único de los cuatro
 * activos comerciales que no se versiona**, y la razón es de volumen: su estado
 * cambia con cada contacto y **A-8 ya conserva íntegro el rastro de esos
 * cambios**. Versionarla «multiplicaría el volumen sin aportar nada».
 *
 * **§10.2 — regla de no destrucción.** `update` cambia el valor vigente
 * **conservando el anterior en el historial**; no es una sobrescritura que
 * pierda conocimiento. **No existe operación de borrado**, aquí ni en ningún
 * otro puerto: no hay una cuarta operación (§10.1).
 */
export interface CommercialSequenceRepository {
  /**
   * Registra una secuencia nueva.
   *
   * **CS-I5** — un Lead puede tener varias y **una nueva no borra la anterior**.
   * Por eso el número de secuencia forma parte de la identidad y esta operación
   * nunca reemplaza a una existente.
   */
  save(sequence: CommercialSequence): Promise<Identified<CommercialSequence>>;

  /**
   * Actualiza una secuencia existente: su estado, su momento vigente o lo que
   * conserva de cada contacto (ADR-13 §10.1).
   *
   * **CS-I3** — agotarla o detenerla **no expulsa al Lead**; `Detenida` y
   * `Concluida` son estados de la secuencia, nunca del Lead.
   */
  update(id: string, sequence: CommercialSequence): Promise<Identified<CommercialSequence>>;

  findById(id: string): Promise<Identified<CommercialSequence> | null>;

  /**
   * **Todas** las secuencias de un Lead, sin filtro ni recorte — las concluidas
   * y las detenidas incluidas (CS-I5). Devolver solo la vigente destruiría el
   * rastro que CS-I5 protege.
   */
  findByLeadId(leadId: string): Promise<Identified<CommercialSequence>[]>;
}
