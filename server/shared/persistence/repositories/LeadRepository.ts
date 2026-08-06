import { Lead, LeadStatus } from "../contracts/Lead";
import { Identified } from "./Identified";

/**
 * Contrato de persistencia para Lead. Sin implementación — la aporta
 * Infrastructure de un módulo (o un futuro adapter en shared/persistence/adapters),
 * nunca el propio módulo de dominio ni ningún Agent directamente (ADR-05
 * Principio 1, Anexo: "Ningún agente debe saber dónde viven los datos").
 */
export interface LeadRepository {
  /**
   * Registra un Lead **de forma idempotente respecto de su identidad**.
   *
   * **ADR-13 §11.3** lo exige literalmente: repetir el Registro «no produce
   * efecto. La identidad ya está presente; se actualizan atributos si difieren».
   * **I-1**: «repetir una búsqueda completa no puede alterar el conjunto de Leads
   * del usuario, salvo por las Empresas nuevas que aparezcan». **I-2**: la
   * idempotencia se apoya **exclusivamente** en la identidad de ADR-12 —ningún
   * otro mecanismo de detección de repetición es admisible—.
   *
   * Comportamiento exigido:
   *   · identidad ausente en la Biblioteca → se crea el Lead;
   *   · identidad ya presente → **no se crea nada**; se actualizan los atributos
   *     que difieran (ADR-13 §10.4, U-1) y se devuelve el Lead existente **con su
   *     id original**;
   *   · `identityKey === null` (Empresa no identificable) → se registra siempre,
   *     porque ninguna etapa expulsa (PO-01 §8) y S-3 prohíbe fusionar por
   *     aproximación.
   *
   * **Nunca actualiza la fecha de descubrimiento** (ADR-12 §8.3 E-4 · U-3), ni el
   * estadio ya alcanzado por el Lead (ADR-13 §10.3, V-5).
   */
  register(lead: Lead): Promise<Identified<Lead>>;

  /**
   * Busca un Lead por su identidad natural dentro del espacio del usuario.
   *
   * La deduplicación «siempre opera dentro del espacio de un único usuario, nunca
   * entre usuarios» (ADR-12 §7.2, corolario · ADR-05 §14).
   */
  findByIdentity(identityKey: string): Promise<Identified<Lead> | null>;

  /**
   * Escritura directa, **sin comprobación de identidad**.
   *
   * Se conserva para el contrato de comportamiento y para escenarios que
   * necesiten registrar sin deduplicar. **El flujo de descubrimiento usa
   * `register`**, no ésta: usar `save` en el Registro reintroduciría los
   * duplicados que ADR-13 §11.3 prohíbe.
   */
  save(lead: Lead): Promise<Identified<Lead>>;
  findById(id: string): Promise<Identified<Lead> | null>;
  findByStatus(status: LeadStatus): Promise<Identified<Lead>[]>;
  updateStatus(id: string, status: LeadStatus): Promise<void>;

  /**
   * Devuelve **la Biblioteca completa**, sin filtro ni recorte.
   *
   * Es la operación que sostiene la pantalla P-08 de APS-04 §A.3.5: «Ninguna
   * restricción de contenido: muestra **todos** los Leads». Deliberadamente no
   * acepta filtros, límite ni paginación: cualquiera de los tres reintroduciría
   * en la frontera de persistencia un recorte sobre el conjunto, prohibido por
   * R-42 y R-44, y APS-17 §5 fija la conservación como indefinida y sin límite
   * de tamaño.
   *
   * `findByStatus` no sirve para la Biblioteca: filtraría por estadio y ocultaría
   * Leads, cuando un Lead sin análisis ni Score es un estado válido (R-45).
   *
   * La ordenación es responsabilidad de las capas superiores, no de esta: el
   * repositorio devuelve el conjunto, no una vista.
   */
  findAll(): Promise<Identified<Lead>[]>;
}
