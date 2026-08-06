// First functional persistence adapter (ADR-08 §8): implements LeadRepository
// entirely in-memory, to validate the Contract -> Mapper -> Model boundary
// end-to-end before any real database engine is chosen (ADR-05 §5, still
// undecided). Data does not survive a process restart — this is explicitly a
// validation adapter, not the final persistence.
//
// KNOWN GAP (flagged, not silently resolved): LeadRepository.save(lead: Lead)
// does not accept a userId — the interface was not modified per this task's
// restrictions. Until the User model / ownership strategy is decided
// (Sprint 13, Tarea 1, Decisión 4 — still pending), this adapter assigns a
// single-tenant placeholder userId to every saved Lead. This does NOT satisfy
// ADR-05 §14 ("un usuario nunca puede acceder a información perteneciente a
// otro usuario") — it only exists so LeadModel.userId (a required field) can
// be populated. Must be revisited before any multi-user scenario.

import { randomUUID } from "crypto";
import { LeadRepository } from "../repositories/LeadRepository";
import { Identified } from "../repositories/Identified";
import { Lead, LeadStatus } from "../contracts/Lead";
import { LeadModel } from "../models/LeadModel";
import { toLeadModel, toLead } from "./leadMapper";

const PLACEHOLDER_USER_ID = "single-tenant-placeholder";

export function createInMemoryLeadAdapter(): LeadRepository {
  const store = new Map<string, LeadModel>();

  function toIdentifiedLead(model: LeadModel): Identified<Lead> {
    return { ...toLead(model), id: model.id };
  }

  /**
   * Índice de identidad → id de Lead, **acotado al espacio del usuario actual**
   * (ADR-12 §7.2: la deduplicación nunca opera entre usuarios).
   *
   * ⚠️ **La unicidad compuesta `(userId, identityKey)` la resuelve este código, no
   * un motor.** ADS-02 §5 (RQ-2) y la verificación heredada VH-3 exigen que la
   * garantice el motor: con un `Map` en memoria y un solo proceso funciona, pero
   * **no es la garantía que el Blueprint pide**. Queda registrado como limitación
   * del adapter de validación, no como cumplimiento.
   */
  const identityIndex = new Map<string, string>();

  function scopedIdentity(identityKey: string): string {
    return `${PLACEHOLDER_USER_ID}::${identityKey}`;
  }

  return {
    // Registro idempotente por identidad — ADR-13 §11.3, I-1 e I-2.
    async register(lead: Lead): Promise<Identified<Lead>> {
      // Empresa no identificable: se registra siempre. Ninguna etapa expulsa
      // (PO-01 §8) y S-3 prohíbe fusionar por aproximación.
      if (lead.identityKey === null) {
        return this.save(lead);
      }

      const scoped = scopedIdentity(lead.identityKey);
      const existingId = identityIndex.get(scoped);

      if (existingId === undefined) {
        const created = await this.save(lead);
        identityIndex.set(scoped, created.id);
        return created;
      }

      const existing = store.get(existingId);
      if (!existing) {
        // Índice inconsistente con el almacén: se rehace en lugar de propagar el
        // fallo, y el Lead se registra. Nunca se pierde una Empresa por esto.
        const created = await this.save(lead);
        identityIndex.set(scoped, created.id);
        return created;
      }

      // La identidad ya está presente: **el Registro no produce efecto**. Solo se
      // actualizan los atributos que difieran (ADR-13 §10.4, U-1).
      //
      // Lo que NO se toca, y es lo que hace correcta esta operación:
      //   · `id` — la identidad del Lead no cambia (V-5);
      //   · `createdAt` — la fecha de descubrimiento nunca se actualiza (E-4, U-3);
      //   · `status` — el estadio ya alcanzado se preserva (V-5). Un
      //     redescubrimiento no puede devolver a `Prospect` un Lead ya contactado.
      const updated: LeadModel = {
        ...existing,
        name: lead.name,
        website: lead.website,
        phone: lead.phone,
        googleMapsUrl: lead.googleMapsUrl,
        rating: lead.rating,
        reviewCount: lead.reviewCount,
        source: lead.source,
        identitySource: lead.identitySource,
        identityDesignation: lead.identityDesignation,
        updatedAt: new Date().toISOString()
      };

      store.set(existing.id, updated);
      return toIdentifiedLead(updated);
    },

    async findByIdentity(identityKey: string): Promise<Identified<Lead> | null> {
      const id = identityIndex.get(scopedIdentity(identityKey));
      if (id === undefined) return null;
      const model = store.get(id);
      return model ? toIdentifiedLead(model) : null;
    },

    async save(lead: Lead): Promise<Identified<Lead>> {
      const now = new Date().toISOString();
      const model = toLeadModel(lead, {
        id: randomUUID(),
        userId: PLACEHOLDER_USER_ID,
        createdAt: now,
        updatedAt: now
      });
      store.set(model.id, model);
      // También se indexa desde `save`: si alguien registra por esta vía un Lead
      // con identidad, un `register` posterior debe reconocerlo en lugar de
      // duplicarlo.
      if (model.identityKey !== null) {
        identityIndex.set(scopedIdentity(model.identityKey), model.id);
      }
      return toIdentifiedLead(model);
    },

    async findById(id: string): Promise<Identified<Lead> | null> {
      const model = store.get(id);
      return model ? toIdentifiedLead(model) : null;
    },

    async findByStatus(status: LeadStatus): Promise<Identified<Lead>[]> {
      return Array.from(store.values())
        .filter((model) => model.status === status)
        .map(toIdentifiedLead);
    },

    // Biblioteca completa: sin filtro y sin recorte (R-42, R-44). El orden de
    // inserción del `Map` se conserva, de modo que los Leads salen en el orden
    // en que fueron registrados; ordenar es tarea de las capas superiores.
    async findAll(): Promise<Identified<Lead>[]> {
      return Array.from(store.values()).map(toIdentifiedLead);
    },

    async updateStatus(id: string, status: LeadStatus): Promise<void> {
      const model = store.get(id);
      if (!model) return;
      store.set(id, { ...model, status, updatedAt: new Date().toISOString() });
    }
  };
}
