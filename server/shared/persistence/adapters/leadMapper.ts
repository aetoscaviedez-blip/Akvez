// Persistence mapper boundary for Lead (ADR-08 §7): the only place allowed
// to translate between the Lead persistence contract and LeadModel. Pure
// functions only — no I/O, no database access, no ID/timestamp generation.
// The caller (a future Database Adapter) is responsible for producing
// id/userId/createdAt/updatedAt and passing them in explicitly.

import { Lead } from "../contracts/Lead";
import { LeadModel } from "../models/LeadModel";

export interface LeadPersistenceMeta {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function toLeadModel(lead: Lead, meta: LeadPersistenceMeta): LeadModel {
  return {
    id: meta.id,
    userId: meta.userId,
    name: lead.name,
    website: lead.website,
    phone: lead.phone,
    googleMapsUrl: lead.googleMapsUrl,
    rating: lead.rating,
    reviewCount: lead.reviewCount,
    source: lead.source,
    status: lead.status,
    identityKey: lead.identityKey,
    identitySource: lead.identitySource,
    identityDesignation: lead.identityDesignation,
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt
  };
}

export function toLead(model: LeadModel): Lead {
  return {
    name: model.name,
    website: model.website,
    phone: model.phone,
    googleMapsUrl: model.googleMapsUrl,
    rating: model.rating,
    reviewCount: model.reviewCount,
    source: model.source,
    status: model.status,
    identityKey: model.identityKey,
    identitySource: model.identitySource,
    identityDesignation: model.identityDesignation
  };
}
