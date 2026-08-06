// Database Adapter en memoria para `ProposalRepository` (ADR-08 §8), hermano de
// `inMemoryBuyerDiagnosisAdapter`. Valida la frontera Contract → Mapper → Model
// de punta a punta antes del motor real de ADS-02. Los datos no sobreviven a un
// reinicio del proceso: es explícitamente un adapter de validación, **no la
// persistencia definitiva**.
//
// APPEND-ONLY POR DISEÑO — **ADR-13 §10.3 V-1**: cada emisión de la Propuesta
// añade una versión sin retirar la anterior, y **§10.2 prohíbe implementar el
// versionado como sobrescritura**. Este adapter **no expone ninguna operación de
// actualización ni de borrado**: el almacén solo crece.
//
// **NO EXPONE NADA DE ESTADIO, y no puede exponerlo.** Emitir una Propuesta **no
// cambia el estadio del Lead** (P-I3 · LS-3): ADR-13 v1.2 retiró A-3 de E-5
// precisamente para cerrar esa conflación. **Tampoco «marcar como enviada»**:
// AKVEZ **no envía y no observa** (P-I5 · PO-02 §6.2).
//
// HUECO CONOCIDO, señalado y no resuelto en silencio: igual que sus hermanos,
// asigna un `userId` placeholder de un solo inquilino. No satisface ADR-05 §14
// (deuda **F-3**).

import { randomUUID } from "crypto";
import { Identified } from "../repositories/Identified";
import { Proposal } from "../contracts/Proposal";
import { ProposalModel } from "../models/ProposalModel";
import { ProposalRepository } from "../repositories/ProposalRepository";
import { SequenceMoment } from "../contracts/commercialValues";
import { toProposal, toProposalModel } from "./proposalMapper";

const PLACEHOLDER_USER_ID = "single-tenant-placeholder";

export function createInMemoryProposalAdapter(): ProposalRepository {
  // Todas las emisiones, en orden de inserción. Nunca se elimina ni se
  // sobrescribe ningún elemento.
  const emissions: ProposalModel[] = [];

  function toIdentified(model: ProposalModel): Identified<Proposal> {
    return { ...toProposal(model), id: model.id };
  }

  function versionsOf(leadId: string, moment: SequenceMoment): ProposalModel[] {
    return emissions.filter((model) => model.leadId === leadId && model.moment === moment);
  }

  return {
    /**
     * Añade una emisión. **Nunca sustituye** (V-1 · P-I2).
     *
     * El número de emisión llega ya decidido en el contrato porque **forma parte
     * de la identidad del agregado** —`(Lead, momento, número de emisión)`,
     * ADR-16 §4.4— y lo deriva el caso de uso del historial existente. Este
     * adapter lo conserva tal cual: reescribirlo aquí haría que la identidad
     * devuelta no fuese la que el dominio construyó.
     *
     * **Consecuencia para el motor real** *(ADS-02)*: la unicidad de
     * `(leadId, moment, issue)` debe garantizarla el motor con una **restricción
     * compuesta**. En memoria y con un solo proceso no hay concurrencia que la
     * ponga a prueba (deuda **F-2**).
     */
    async save(proposal: Proposal): Promise<Identified<Proposal>> {
      const model = toProposalModel(proposal, {
        id: randomUUID(),
        userId: PLACEHOLDER_USER_ID,
        createdAt: new Date().toISOString()
      });

      emissions.push(model);
      return toIdentified(model);
    },

    /**
     * V-2 — la vigente es la más reciente, es decir, **la de mayor `issue`**.
     *
     * **No se ordena por `issuedAt`** y la razón es de garantías: `issue` es
     * monótono creciente por `(Lead, momento)` —lo deriva el caso de uso del
     * historial y V-1 · P-I2 aseguran que solo se añade—, mientras que la marca
     * temporal es un valor de reloj **cuyo origen sigue abierto**. Ordenar por
     * ella haría que «cuál es la vigente» dependiera de una cuestión sin decidir.
     */
    async findCurrentByMoment(
      leadId: string,
      moment: SequenceMoment
    ): Promise<Identified<Proposal> | null> {
      const versions = versionsOf(leadId, moment);
      if (versions.length === 0) return null;
      const current = versions.reduce((latest, model) =>
        model.issue > latest.issue ? model : latest
      );
      return toIdentified(current);
    },

    /**
     * Historial completo de un momento, **de la más antigua a la más reciente**.
     * Es lo que hace verificable **P-I2**: si una regeneración hubiese sustituido
     * a la anterior, se vería aquí.
     */
    async findVersionsByMoment(
      leadId: string,
      moment: SequenceMoment
    ): Promise<Identified<Proposal>[]> {
      return versionsOf(leadId, moment)
        .slice()
        .sort((a, b) => a.issue - b.issue)
        .map(toIdentified);
    },

    /**
     * **Todas** las emisiones del Lead, de cualquier momento, **sin filtro ni
     * recorte**: un límite aquí reintroduciría en la frontera de persistencia un
     * recorte sobre el conjunto (R-42 · R-44).
     *
     * Se devuelven en **orden de inserción**, que en un almacén append-only es el
     * orden en que se emitieron. No se reordenan por `issue`: ese número
     * discrimina emisiones **dentro de un mismo momento**, y mezclarlos entre
     * momentos distintos sugeriría un orden que no significa nada.
     */
    async findByLeadId(leadId: string): Promise<Identified<Proposal>[]> {
      return emissions.filter((model) => model.leadId === leadId).map(toIdentified);
    }
  };
}
