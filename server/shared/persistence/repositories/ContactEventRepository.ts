import { ContactEvent } from "../contracts/ContactEvent";
import { Identified } from "./Identified";

/**
 * Puerto de persistencia del **Contacto declarado**. Sin implementación
 * (AL-06 · ADR-08 §6, §10).
 *
 * **Su activo es la divergencia OBS-06**, abierta: ADR-13 §13.1 —que prevalece—
 * no asigna a E-9 ningún activo exclusivo, y la declaración se conserva como
 * parte del **historial (A-8)**, cuya regla es «solo crece». Ver la nota
 * completa en `contracts/ContactEvent.ts`.
 *
 * **SEMÁNTICA: SOLO CRECE** (ADR-16 §4.5 · S-1 · S-2 de PO-02 §7.2):
 * *«Nadie puede modificarlo. Solo crece: ninguna declaración se elimina ni se
 * altera.»* Por eso este puerto **no expone `update` ni borrado alguno** — no es
 * una omisión, es el invariante expresado como superficie.
 *
 * **CE-I4 — nunca lo genera el sistema:** ni por inferencia, ni por tiempo, ni
 * por detección. El autor es **el usuario, nunca un agente** (APS-09 §9).
 *
 * ⚠️ **Este puerto no lleva ningún Lead a `Contacted`, y no debe intentarlo.**
 * **CE-I1** hace de la declaración el único hecho que produce esa transición,
 * pero **el estadio es A-3 y lo escribe `LeadRepository`**. Un caso de uso
 * —`RegisterContact`, fase posterior— coordina ambas escrituras; **fundirlas
 * aquí daría a este puerto la capacidad de mover el estadio sin declaración**.
 */
export interface ContactEventRepository {
  /**
   * Registra una declaración del usuario. **Append-only, sin excepción.**
   *
   * No existe operación equivalente que el sistema pueda invocar por su cuenta:
   * toda invocación de ésta procede de un acto explícito del usuario (CE-I4).
   */
  save(contactEvent: ContactEvent): Promise<Identified<ContactEvent>>;

  /**
   * Historial completo de declaraciones de un Lead, de la más antigua a la más
   * reciente. Sin filtro ni recorte (R-42 · R-44).
   *
   * Es lo que sostiene **CE-I2**: sin declaración, la secuencia no avanza — y
   * saber qué se declaró y cuándo es la única forma de comprobarlo.
   */
  findByLeadId(leadId: string): Promise<Identified<ContactEvent>[]>;
}
