// Database Adapter en memoria para LeadAnalysisRepository (ADR-08 §8), hermano
// de inMemoryLeadAdapter. Valida la frontera Contract → Mapper → Model de punta
// a punta antes de elegir motor real (ADR-05 §5, aún sin decidir). Los datos no
// sobreviven a un reinicio del proceso: es explícitamente un adapter de
// validación, no la persistencia definitiva.
//
// APPEND-ONLY POR DISEÑO — **ADR-13 §10.3 V-1** exige que cada emisión de Score
// añada una versión sin retirar la anterior, y §10.2 prohíbe implementar el
// versionado como sobrescritura. Este adapter **no expone ninguna operación de
// actualización ni de borrado**: el almacén solo crece.
//
// HUECO CONOCIDO, señalado y no resuelto en silencio: igual que
// inMemoryLeadAdapter, asigna un `userId` placeholder de un solo inquilino. No
// satisface ADR-05 §14 («un usuario nunca puede acceder a información
// perteneciente a otro usuario») y debe revisarse antes de cualquier escenario
// multi-usuario.

import { randomUUID } from "crypto";
import { LeadAnalysisRepository } from "../repositories/LeadAnalysisRepository";
import { Identified } from "../repositories/Identified";
import { LeadAnalysis } from "../contracts/LeadAnalysis";
import { LeadAnalysisModel } from "../models/LeadAnalysisModel";
import { toLeadAnalysisModel, toLeadAnalysis } from "./leadAnalysisMapper";

const PLACEHOLDER_USER_ID = "single-tenant-placeholder";

export function createInMemoryLeadAnalysisAdapter(): LeadAnalysisRepository {
  // Todas las emisiones, en orden de inserción. Nunca se elimina ni se
  // sobrescribe ningún elemento.
  const emissions: LeadAnalysisModel[] = [];

  function toIdentified(model: LeadAnalysisModel): Identified<LeadAnalysis> {
    return { ...toLeadAnalysis(model), id: model.id };
  }

  function versionsOf(leadId: string): LeadAnalysisModel[] {
    return emissions.filter((model) => model.leadId === leadId);
  }

  return {
    async save(analysis: LeadAnalysis): Promise<Identified<LeadAnalysis>> {
      // El número de emisión lo calcula el Adapter a partir de lo ya almacenado:
      // el llamador no puede fijarlo, de modo que la secuencia no puede
      // falsearse ni colisionar (V-1).
      const previous = versionsOf(analysis.leadId);
      const model = toLeadAnalysisModel(analysis, {
        id: randomUUID(),
        userId: PLACEHOLDER_USER_ID,
        createdAt: new Date().toISOString(),
        emission: previous.length + 1
      });

      emissions.push(model);
      return toIdentified(model);
    },

    // V-2 — la vigente es la más reciente, es decir, la de mayor `emission`.
    async findByLeadId(leadId: string): Promise<Identified<LeadAnalysis> | null> {
      const versions = versionsOf(leadId);
      if (versions.length === 0) return null;
      const current = versions.reduce((latest, model) =>
        model.emission > latest.emission ? model : latest
      );
      return toIdentified(current);
    },

    // Una vigente por Lead. Sin filtro y sin recorte (R-42 · R-44).
    async findCurrentForAllLeads(): Promise<Identified<LeadAnalysis>[]> {
      const currentByLead = new Map<string, LeadAnalysisModel>();
      for (const model of emissions) {
        const existing = currentByLead.get(model.leadId);
        if (!existing || model.emission > existing.emission) {
          currentByLead.set(model.leadId, model);
        }
      }
      return Array.from(currentByLead.values()).map(toIdentified);
    },

    // Historial completo, de la más antigua a la más reciente (ADR-14 §6.4).
    async findVersionsByLeadId(leadId: string): Promise<Identified<LeadAnalysis>[]> {
      return versionsOf(leadId)
        .slice()
        .sort((a, b) => a.emission - b.emission)
        .map(toIdentified);
    }
  };
}
