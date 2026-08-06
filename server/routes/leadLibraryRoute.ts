import { Request, Response } from "express";
import { RunLeadLibraryQueryFn } from "../orchestrators/leadLibraryOrchestrator";
import { mapToLeadLibraryResponseDTO } from "../shared/mappers/leadLibraryMapper";
import { LeadLibraryResponseDTO } from "../shared/contracts/leadLibrary";
import { fromException } from "../shared/mappers/errorResponseMapper";

/**
 * GET /api/leads — la Biblioteca de Leads del usuario.
 *
 * Adaptador HTTP delgado (R-12): recibe la petición, invoca al Orchestrator y
 * responde mediante `shared/mappers/` y `shared/contracts/`. No importa
 * `domain/`, `application/` ni `infrastructure/` (R-13), y **no conoce
 * persistencia en ninguna forma** (R-24): el tipo `RunLeadLibraryQueryFn` no
 * menciona repositorios ni adapters.
 *
 * No acepta parámetros de consulta —ni filtro, ni límite, ni paginación—. Es
 * deliberado: la pantalla P-08 de APS-04 §A.3.5 no admite «ninguna restricción
 * de contenido: muestra **todos** los Leads», y un `?limit=` reintroduciría por
 * la puerta de atrás el Top N que PO-01 §6 eliminó del dominio.
 */
export interface LeadLibraryDependencies {
  runLeadLibraryQuery: RunLeadLibraryQueryFn;
}

export function createLeadLibraryHandler(deps: LeadLibraryDependencies) {
  const { runLeadLibraryQuery } = deps;

  return async function handleLeadLibrary(_req: Request, res: Response): Promise<void> {
    try {
      const library = await runLeadLibraryQuery();
      const response: LeadLibraryResponseDTO = mapToLeadLibraryResponseDTO(library);
      res.json(response);
    } catch (error: any) {
      // Fallo inesperado al leer la Biblioteca: se propaga como error real, sin
      // devolver un conjunto vacío que el cliente interpretaría como
      // «la Biblioteca está vacía» (R-62 · R-38).
      console.error("[LeadLibrary] Error:", error);
      res.status(500).json(fromException(error));
    }
  };
}
