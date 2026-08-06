import { Express, Request, Response } from "express";
import { handleHealth } from "./healthRoute";

/**
 * Handlers ya construidos, recibidos desde el Composition Root (ADR-09 §5.3).
 * Solo se inyectan los handlers cuya construcción requiere dependencias; los
 * que no tienen ninguna se siguen importando directamente (cambio mínimo).
 */
export interface RouteDependencies {
  handleProspectSearch: (req: Request, res: Response) => Promise<void>;
  handleLeadLibrary: (req: Request, res: Response) => Promise<void>;
  handleProspectOutreach: (req: Request, res: Response) => Promise<void>;
  handleDiagnosis: (req: Request, res: Response) => Promise<void>;
  handleSequence: (req: Request, res: Response) => Promise<void>;
}

export function registerRoutes(app: Express, deps: RouteDependencies): void {
  app.get("/api/health", handleHealth);

  // MÓDULO 1 — Lead Hunter
  app.post("/api/prospect/search", deps.handleProspectSearch);

  // Biblioteca de Leads — pantalla P-08 de APS-04 §A.3.5. Coordinada por el
  // Lead Library Orchestrator, conforme R-11.
  app.get("/api/leads", deps.handleLeadLibrary);

  // MÓDULO 2 — Pitch Generator (coordinado por el Orchestrator, conforme ADR-04)
  app.post("/api/prospect/outreach", deps.handleProspectOutreach);

  // Diagnóstico Comercial (E-7). Cuelga del Lead porque toda identidad
  // comercial lo incluye (AG-1 · ADR-16 §4.1).
  app.post("/api/leads/:leadId/diagnosis", deps.handleDiagnosis);

  // Secuencia Comercial (E-8). Se deriva del diagnóstico vigente del Lead.
  app.post("/api/leads/:leadId/sequence", deps.handleSequence);
}
