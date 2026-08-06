import { DiscoverProspectsFn, DiscoverProspectsResult } from "../application/discoverProspects";
import { ListLeadLibraryFn, ListLeadLibraryResult } from "../application/listLeadLibrary";

/**
 * **Ya no transporta `apiKey`.** La credencial del proveedor de descubrimiento
 * la recibe el adapter desde el Composition Root (ADR-17 §6.3 P-4, §9.3): deja
 * de atravesar la ruta, el Orchestrator, esta Agent API y el caso de uso.
 */
export interface LeadHunterRequest {
  industry: string;
  location: string;
  excludeNames: string[];
}

export interface LeadHunterAgentApi {
  execute(request: LeadHunterRequest): Promise<DiscoverProspectsResult>;

  /**
   * Devuelve la Biblioteca de Leads completa del usuario.
   *
   * Se expone en esta Agent API porque APS-03 §7.1 atribuye al Lead Hunter
   * «consultar la Biblioteca de Leads»: es una capacidad del agente, no un
   * atajo de lectura. El Orchestrator sigue siendo el único que la invoca
   * (R-07, R-11).
   *
   * El tipo de retorno **no menciona persistencia** en ninguna forma, de modo
   * que esta capa continúa sin importar `shared/persistence/` — prohibido «sin
   * excepción» por R-23. El repositorio viaja capturado en el closure del caso
   * de uso, fuera de la superficie de tipos de este archivo.
   */
  listLibrary(): Promise<ListLeadLibraryResult>;
}

/**
 * Los dos casos de uso que esta fachada transporta, **con nombre** —
 * **ADR-19 §5.1 (D-1)**.
 *
 * Ninguna es opcional ni tiene valor por defecto: un valor por defecto sería
 * construir dentro de `presentation/`, competencia exclusiva del Composition
 * Root (**ADR-09 §5.3 · R-55 · ADR-19 §5.2**).
 */
export interface LeadHunterAgentDeps {
  discoverProspects: DiscoverProspectsFn;
  listLeadLibrary: ListLeadLibraryFn;
}

/**
 * Única API pública del módulo Lead Hunter (Agent API / capa "presentation" de ADR-04).
 * Ningún componente externo debe acceder a application/, domain/ o infrastructure/ directamente.
 *
 * Se construye por factory desde el Composition Root (ADR-09 §5.2): recibe el
 * caso de uso ya vinculado a sus dependencias. Esta capa no conoce — ni puede
 * conocer — `shared/persistence/` en ninguna de sus cuatro subcarpetas
 * (ADR-08 §10, «sin excepción»): el tipo `DiscoverProspectsFn` no menciona
 * persistencia, de modo que el repositorio viaja capturado en un closure y
 * queda fuera de la superficie de tipos de este archivo.
 */
export function createLeadHunterAgent({
  discoverProspects,
  listLeadLibrary
}: LeadHunterAgentDeps): LeadHunterAgentApi {
  return {
    async execute(request: LeadHunterRequest): Promise<DiscoverProspectsResult> {
      const { industry, location, excludeNames } = request;
      return discoverProspects(industry, location, excludeNames);
    },

    async listLibrary(): Promise<ListLeadLibraryResult> {
      return listLeadLibrary();
    }
  };
}
