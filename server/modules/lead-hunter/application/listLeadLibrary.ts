// Caso de uso: consultar la Biblioteca de Leads del usuario.
//
// POR QUÉ VIVE EN LEAD HUNTER — APS-03 §7.1 le atribuye expresamente
// «consultar la Biblioteca de Leads» y «registrar en la Biblioteca todas las
// Empresas descubiertas». Es el agente dueño de la Biblioteca, de modo que la
// lectura del conjunto le corresponde sin necesidad de crear ningún agente
// nuevo — algo que exigiría modificar APS-03 y queda fuera de este sprint.
//
// FRONTERAS QUE RESPETA
//   · R-22 — recibe la Repository Interface **como dependencia**, nunca la
//     construye, y **no importa** `adapters/`, `models/` ni
//     `shared/persistence/contracts/`. El único import de persistencia es la
//     interfaz del repositorio, que es precisamente lo que R-22 sanciona.
//   · R-05 — no importa `shared/contracts/`, `shared/mappers/` ni HTTP.
//   · ADR-07 §8 — devuelve un **resultado interno propio del módulo**; la
//     traducción al DTO público es tarea de `shared/mappers/`.
//
// SOBRE LA FORMA DE SALIDA — `RegisteredLead` se declara aquí de forma
// independiente y **no importa** el Persistence Contract. Es deliberado: la
// desviación A-02 consiste exactamente en que `application/` importe un
// Persistence Contract, y este caso de uso nuevo no la amplía. La
// correspondencia con lo que devuelve el repositorio es estructural, sin import
// (mismo principio que ADR-08 §5 aplica entre entidad y modelo).

import { LeadRepository } from "../../../shared/persistence/repositories/LeadRepository";

/**
 * Un Lead tal como está registrado en la Biblioteca, con la identidad ya
 * asignada por la capa de persistencia.
 *
 * No incluye Score ni análisis: **no se persisten todavía**, y un Lead sin
 * análisis y sin Score es un estado válido del dominio (R-45 · PO-01 §5). Quien
 * presente estos datos debe representar esa ausencia como ausencia, nunca como
 * error ni como cero (R-38 · UI-7).
 */
export interface RegisteredLead {
  id: string;
  name: string;
  website: string;
  phone: string;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  source: string;
  status: string;
  /** Evidencia observada (H-14.H). null = Lead anterior a PE-1.0. */
  evidenceVersion: string | null;
  /** null = no observado. 0 = observado y realmente cero. */
  photoCount: number | null;
}

/**
 * Resultado interno del caso de uso (ADR-07 §8). Lleva `total` explícito para
 * que ninguna capa superior tenga que deducir el tamaño del conjunto a partir
 * de un arreglo que podría haber sido recortado en el camino.
 */
export interface ListLeadLibraryResult {
  leads: RegisteredLead[];
  total: number;
}

export interface ListLeadLibraryDependencies {
  leadRepository: LeadRepository;
}

export type ListLeadLibraryFn = () => Promise<ListLeadLibraryResult>;

export function createListLeadLibrary(
  deps: ListLeadLibraryDependencies
): ListLeadLibraryFn {
  const { leadRepository } = deps;

  return async function listLeadLibrary(): Promise<ListLeadLibraryResult> {
    // Conjunto completo. No se filtra, no se recorta y no se pagina aquí:
    // ADR-11 §8.2 prohíbe a esta capa toda limitación sobre el conjunto, y
    // R-42/R-44 prohíben que cualquier consulta determine qué Leads existen.
    const registered = await leadRepository.findAll();

    // Orden por defecto de la vista: WS-05 de APS-17 §4 fija «Opportunity Score
    // descendente». El Score **no se persiste todavía**, de modo que aquí no
    // puede aplicarse sin inventar un valor — y R-38 prohíbe sustituir una
    // ausencia por un valor por defecto. Se devuelve el conjunto en el orden de
    // Registro, que es información real, y la ordenación definitiva queda
    // pendiente de que el Score se persista conforme a R-34.
    const leads: RegisteredLead[] = registered.map((lead) => ({
      id: lead.id,
      name: lead.name,
      website: lead.website,
      phone: lead.phone,
      googleMapsUrl: lead.googleMapsUrl,
      rating: lead.rating,
      reviewCount: lead.reviewCount,
      source: lead.source,
      status: lead.status,
      evidenceVersion: lead.evidenceVersion,
      photoCount: lead.photoCount
    }));

    return { leads, total: leads.length };
  };
}
