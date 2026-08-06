// Database Adapter en memoria para BuyerDiagnosisRepository (ADR-08 §8),
// hermano de inMemoryLeadAdapter e inMemoryLeadAnalysisAdapter. Valida la
// frontera Contract → Mapper → Model de punta a punta antes de implementar el
// motor real de ADS-02. Los datos no sobreviven a un reinicio del proceso: es
// explícitamente un adapter de validación, no la persistencia definitiva.
//
// APPEND-ONLY POR DISEÑO — **ADR-13 §10.3 V-1**: cada emisión del Diagnóstico
// Comercial añade una versión sin retirar la anterior, y §10.2 prohíbe
// implementar el versionado como sobrescritura. Este adapter **no expone
// ninguna operación de actualización ni de borrado**: el almacén solo crece.
//
// HUECO CONOCIDO, señalado y no resuelto en silencio: igual que sus hermanos,
// asigna un `userId` placeholder de un solo inquilino. No satisface ADR-05 §14
// y debe revisarse antes de cualquier escenario multi-usuario.

import { randomUUID } from "crypto";
import { BuyerDiagnosisRepository } from "../repositories/BuyerDiagnosisRepository";
import { Identified } from "../repositories/Identified";
import { BuyerDiagnosis } from "../contracts/BuyerDiagnosis";
import { BuyerDiagnosisModel } from "../models/BuyerDiagnosisModel";
import { toBuyerDiagnosisModel, toBuyerDiagnosis } from "./buyerDiagnosisMapper";

const PLACEHOLDER_USER_ID = "single-tenant-placeholder";

export function createInMemoryBuyerDiagnosisAdapter(): BuyerDiagnosisRepository {
  // Todas las emisiones, en orden de inserción. Nunca se elimina ni se
  // sobrescribe ningún elemento.
  const emissions: BuyerDiagnosisModel[] = [];

  function toIdentified(model: BuyerDiagnosisModel): Identified<BuyerDiagnosis> {
    return { ...toBuyerDiagnosis(model), id: model.id };
  }

  function versionsOf(leadId: string): BuyerDiagnosisModel[] {
    return emissions.filter((model) => model.leadId === leadId);
  }

  return {
    /**
     * Añade una emisión. **Nunca sustituye** (V-1 · RC-9).
     *
     * El número de emisión llega ya decidido en el contrato porque **forma parte
     * de la identidad del agregado** — `(Lead, número de emisión)`, ADR-16 §4.2—
     * y `GenerateDiagnosis` lo deriva del historial existente. Este adapter lo
     * conserva tal cual: reescribirlo aquí haría que la identidad devuelta no
     * fuese la que el dominio construyó.
     *
     * **Consecuencia para el motor real** *(ADS-02)*: la unicidad de
     * `(leadId, issue)` debe garantizarla el motor con una **restricción
     * compuesta**, que es precisamente el mecanismo que ADS-02 §5.1 eligió
     * PostgreSQL para resolver. En memoria y con un solo proceso no hay
     * concurrencia que la ponga a prueba.
     */
    async save(diagnosis: BuyerDiagnosis): Promise<Identified<BuyerDiagnosis>> {
      const model = toBuyerDiagnosisModel(diagnosis, {
        id: randomUUID(),
        userId: PLACEHOLDER_USER_ID,
        createdAt: new Date().toISOString()
      });

      emissions.push(model);
      return toIdentified(model);
    },

    // V-2 — la vigente es la más reciente, es decir, la de mayor `issue`.
    async findCurrentByLeadId(leadId: string): Promise<Identified<BuyerDiagnosis> | null> {
      const versions = versionsOf(leadId);
      if (versions.length === 0) return null;
      const current = versions.reduce((latest, model) =>
        model.issue > latest.issue ? model : latest
      );
      return toIdentified(current);
    },

    // Historial completo, de la más antigua a la más reciente. Permite comprobar
    // que ninguna emisión destruyó a la anterior (RC-9 · §10.2).
    async findVersionsByLeadId(leadId: string): Promise<Identified<BuyerDiagnosis>[]> {
      return versionsOf(leadId)
        .slice()
        .sort((a, b) => a.issue - b.issue)
        .map(toIdentified);
    }
  };
}
