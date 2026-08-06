// Database Adapter en memoria para CommercialSequenceRepository (ADR-08 §8).
// Valida la frontera Contract → Mapper → Model antes del motor real de ADS-02.
// Los datos no sobreviven a un reinicio: es un adapter de validación.
//
// **ACTUALIZABLE, NO VERSIONADO** — es la diferencia con sus dos hermanos.
// ADR-13 §10.3 declara que A-12 **no entra en el versionado**: «se actualiza. Su
// estado cambia con cada contacto y **A-8 ya conserva íntegro el rastro de esos
// cambios**». Versionarla «multiplicaría el volumen sin aportar nada».
//
// **Aun así, nada se destruye:**
//   · `update` cambia el valor vigente; §10.2 sigue vigente y el rastro lo
//     conserva el historial.
//   · **No existe borrado.** ADR-13 §10.1 no admite una cuarta operación.
//   · **CS-I5** — una secuencia nueva no borra la anterior: `save` **añade** una
//     secuencia con su propio número, jamás reemplaza a otra del mismo Lead.
//
// HUECO CONOCIDO: `userId` placeholder de un solo inquilino, heredado de sus
// hermanos. No satisface ADR-05 §14 (deuda F-3).

import { randomUUID } from "crypto";
import { CommercialSequenceRepository } from "../repositories/CommercialSequenceRepository";
import { Identified } from "../repositories/Identified";
import { CommercialSequence } from "../contracts/CommercialSequence";
import { CommercialSequenceModel } from "../models/CommercialSequenceModel";
import { toCommercialSequenceModel, toCommercialSequence } from "./commercialSequenceMapper";

const PLACEHOLDER_USER_ID = "single-tenant-placeholder";

export function createInMemoryCommercialSequenceAdapter(): CommercialSequenceRepository {
  const sequences: CommercialSequenceModel[] = [];

  function toIdentified(model: CommercialSequenceModel): Identified<CommercialSequence> {
    return { ...toCommercialSequence(model), id: model.id };
  }

  return {
    /** Registra una secuencia nueva. **Nunca reemplaza a otra** (CS-I5). */
    async save(sequence: CommercialSequence): Promise<Identified<CommercialSequence>> {
      const now = new Date().toISOString();
      const model = toCommercialSequenceModel(sequence, {
        id: randomUUID(),
        userId: PLACEHOLDER_USER_ID,
        createdAt: now,
        updatedAt: now
      });

      sequences.push(model);
      return toIdentified(model);
    },

    /**
     * Actualiza una secuencia existente **conservando su identidad y su fecha de
     * creación**: `leadId` y `sequence` forman la identidad del agregado
     * (ADR-16 §4.3) y una actualización no puede alterarla.
     *
     * Un `id` desconocido **lanza**: actualizar algo que no existe no es un
     * desenlace previsto sino un estado imposible, y **R-62** exige que un
     * invariante roto se lance en lugar de viajar como valor.
     */
    async update(
      id: string,
      sequence: CommercialSequence
    ): Promise<Identified<CommercialSequence>> {
      const index = sequences.findIndex((model) => model.id === id);
      if (index === -1) {
        throw new Error(`No existe la secuencia comercial ${id}.`);
      }

      const existing = sequences[index];
      const updated = toCommercialSequenceModel(sequence, {
        id: existing.id,
        userId: existing.userId,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString()
      });

      sequences[index] = updated;
      return toIdentified(updated);
    },

    async findById(id: string): Promise<Identified<CommercialSequence> | null> {
      const model = sequences.find((candidate) => candidate.id === id);
      return model ? toIdentified(model) : null;
    },

    /**
     * **Todas** las secuencias del Lead, sin filtro ni recorte: las concluidas y
     * las detenidas incluidas. Devolver solo la vigente destruiría el rastro que
     * **CS-I5** protege (R-42 · R-44).
     */
    async findByLeadId(leadId: string): Promise<Identified<CommercialSequence>[]> {
      return sequences
        .filter((model) => model.leadId === leadId)
        .slice()
        .sort((a, b) => a.sequence - b.sequence)
        .map(toIdentified);
    }
  };
}
