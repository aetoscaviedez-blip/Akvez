import { ProspectDiscoveryPort } from "../domain/prospectDiscoveryPort";
import { deduplicateLeads } from "../domain/deduplicateLeads";
import { resolveEmpresaIdentity, identityKey } from "../domain/leadIdentity";
import { recordDeduplication, recordPersistence } from "../../../shared/observability/executionReport";
import { LeadRepository } from "../../../shared/persistence/repositories/LeadRepository";

/**
 * `deduplicatedLeads` contiene los **Leads ya registrados**, con su identidad
 * asignada por la capa de persistencia.
 *
 * Es lo que exige APS-03 §7.1 del Lead Hunter: «Entregar al siguiente agente el
 * conjunto de **Leads registrados, con su identidad ya asignada**». Antes de
 * DEV-05 este caso de uso devolvía candidatos sin identificador y el Registro
 * ocurría dentro de `lead-analyzer`, lo que contradecía a la vez §7.1 y §7.2
 * («el Lead Analyzer no crea Leads»).
 */
export interface DiscoverProspectsResult {
  deduplicatedLeads: any[];
  references: Array<{ title: string; url: string }>;
  /** Empresas que ya existían en la Biblioteca y no se registraron de nuevo. */
  alreadyRegistered: number;
}

/**
 * Dependencias del caso de uso, recibidas por inyección desde el Composition
 * Root (ADR-09 §5.2). `application/` conoce la Repository Interface, jamás el
 * Database Adapter que la implementa (R-22 · ADR-08 §10), y conoce el **puerto**
 * de descubrimiento, jamás el adapter que lo implementa (ADR-17 §12, AL-19).
 *
 * Cierra el primero de los tres puntos de AR-05 §5, acción 8: este fichero
 * importaba `../infrastructure/googlePlacesAdapter`.
 */
export interface DiscoverProspectsDependencies {
  leadRepository: LeadRepository;
  prospectDiscovery: ProspectDiscoveryPort;
}

/**
 * **Ya no recibe `apiKey`.** ADR-17 §6.3 señala expresamente esta firma como el
 * incumplimiento simultáneo de P-3 y P-4: hacía viajar una credencial por la
 * capa de aplicación —y antes por la Agent API, el Orchestrator y la ruta— y
 * ataba el caso de uso a la existencia de un proveedor con clave. La credencial
 * la recibe ahora el adapter del Composition Root (ADR-17 §9.3).
 */
export type DiscoverProspectsFn = (
  industry: string,
  location: string,
  excludeNames: string[]
) => Promise<DiscoverProspectsResult>;

export function createDiscoverProspects(
  deps: DiscoverProspectsDependencies
): DiscoverProspectsFn {
  const { leadRepository, prospectDiscovery } = deps;

  return async function discoverProspects(
    industry: string,
    location: string,
    excludeNames: string[]
  ): Promise<DiscoverProspectsResult> {
    // Execute all 3 sources in parallel!
    console.log(`[LeadHunter] Iniciando búsqueda multi-fuente paralela para "${industry}" en "${location}"...`);

    let places: any[] = [];
    let socialResult = { leads: [] as any[], references: [] as Array<{ title: string; url: string }> };
    let directoryResult = { leads: [] as any[], references: [] as Array<{ title: string; url: string }> };

    // Se conserva el andamiaje multi-fuente: cuando vuelvan las fuentes 2 y 3,
    // se agregan a este arreglo sin cambiar la forma de la espera.
    const searchPromises = [
      prospectDiscovery.discover(industry, location)
        .then(res => { places = res; })
    ];

    const [placesOutcome] = await Promise.allSettled(searchPromises);

    // H-01 — Google Places es hoy la ÚNICA fuente de descubrimiento activa: si
    // falla por completo no queda nada que pueda compensarla, y absorber el
    // error convertía un fallo total (clave inválida, cuota agotada, API
    // deshabilitada, red caída) en un "no hay negocios de ese nicho".
    //
    // El adapter solo rechaza cuando fallan TODAS sus sub-consultas. Una
    // búsqueda legítimamente vacía —o una en la que `excludeNames` descartó
    // todo, como en "Buscar más"— resuelve con `[]` y continúa por el camino
    // normal hasta un 200 con lista vacía, exactamente igual que antes.
    if (placesOutcome.status === "rejected") {
      // El detalle técnico (status HTTP, mensaje original de Google) se queda
      // aquí y en `cause`: alimenta el log del servidor y nunca viaja al
      // usuario. `fromException` solo lee `.message` al construir la respuesta.
      console.error("[LeadHunter] Error buscando en Google Places:", placesOutcome.reason);
      throw new Error(
        "No fue posible consultar Google Places en este momento. Intenta nuevamente en unos minutos.",
        { cause: placesOutcome.reason }
      );
    }

    // La Fuente (ADR-12 §7.1) la declara ahora el adapter, que es quien sabe de
    // dónde vino cada Empresa. Aquí se fijaba `source: "Google Maps"`, con lo que
    // `application/` nombraba a un proveedor concreto.

    // Combine all 3 sources
    const allResults = [...places, ...socialResult.leads, ...directoryResult.leads];

    const dedupStartedAt = Date.now();
    const { leads: deduplicatedLeads, discards } = deduplicateLeads(allResults, excludeNames);
    recordDeduplication({
      before: allResults.length,
      after: deduplicatedLeads.length,
      ms: Date.now() - dedupStartedAt,
      // H-12.1 · P0.4 — sin esto, «llegaron 40 y quedaron 12» no distingue un
      // filtro trabajando de una fuente devolviendo poco.
      discards
    });
    console.log(`[LeadHunter] Fusión completada. Bruto: ${allResults.length} -> Deduplicados: ${deduplicatedLeads.length}`);

    // H-04 / ADR-10 — Este caso de uso YA NO PERSISTE. Conforme a la decisión
    // aprobada, el Registro ocurre después de la selección y antes del análisis,
    // de modo que el repositorio contenga únicamente «empresas identificadas
    // como oportunidades comerciales» (APS-07 §5) y no todo lo descubierto.
    //
    // `discoverProspects` recupera así una responsabilidad única: consultar las
    // fuentes y deduplicar. Devuelve los leads descubiertos tal cual, sin
    // identificador — la identidad la asigna la persistencia, que ahora ocurre
    // más adelante en el flujo.

    // Deduplicate combined references
    const combinedReferences = [
      ...socialResult.references,
      ...directoryResult.references
    ];
    const uniqueRefsMap = new Map<string, any>();
    combinedReferences.forEach((ref: any) => {
      if (ref?.url) {
        uniqueRefsMap.set(ref.url, ref);
      }
    });
    const deduplicatedReferences = Array.from(uniqueRefsMap.values());

    // ── REGISTRO ──────────────────────────────────────────────────────────────
    // El Registro es el único evento que convierte una Empresa en Lead
    // (APS-07 §7.1) y **lo ejecuta este agente**: APS-03 §7.1 se lo atribuye
    // expresamente al Lead Hunter, junto con «consultar la Biblioteca de Leads
    // para detectar duplicados». Alcanza a **todas** las Empresas descubiertas y
    // no duplicadas, con independencia de su valor (APS-17 §3.1).
    //
    // Es **idempotente respecto de la identidad** (ADR-13 §11.3): repetir una
    // búsqueda no altera el conjunto de Leads del usuario, salvo por las Empresas
    // nuevas que aparezcan (regla I-1). La identidad es la de ADR-12 y ningún
    // otro mecanismo de detección de repetición es admisible (I-2).
    const persistStartedAt = Date.now();
    let alreadyRegistered = 0;

    const registered = await Promise.all(
      deduplicatedLeads.map(async (candidate: any) => {
        const identity = resolveEmpresaIdentity(candidate, location);
        const key = identity === null ? null : identityKey(identity);

        // ¿Ya estaba en la Biblioteca? Solo para observabilidad: `register` es
        // idempotente por sí mismo y no depende de esta comprobación.
        if (key !== null && (await leadRepository.findByIdentity(key)) !== null) {
          alreadyRegistered++;
        }

        const stored = await leadRepository.register({
          name: candidate.name,
          website: candidate.website,
          phone: candidate.phone,
          googleMapsUrl: candidate.googleMapsUrl,
          rating: candidate.rating,
          reviewCount: candidate.reviewCount,
          source: candidate.source,
          // Estadio inicial. En un redescubrimiento el adapter **preserva** el
          // estadio ya alcanzado y no lo devuelve a `Prospect` (ADR-13 V-5).
          status: "Prospect",
          identityKey: key,
          identitySource: identity?.kind === "sourceReference" ? identity.reference.source : null,
          identityDesignation: identity?.kind === "sourceReference" ? identity.reference.designation : null
        });

        // Se entrega el candidato enriquecido con la identidad que asignó la
        // persistencia, conforme a APS-03 §7.1.
        return { ...candidate, id: stored.id };
      })
    );

    recordPersistence({
      saved: registered.length - alreadyRegistered,
      ids: registered.map((lead: any) => lead.id),
      ms: Date.now() - persistStartedAt
    });

    if (alreadyRegistered > 0) {
      console.log(
        `[LeadHunter] ${alreadyRegistered} de ${registered.length} Empresas ya estaban en la Biblioteca: ` +
        "se actualizaron sus atributos sin crear Leads nuevos (ADR-13 §11.3)."
      );
    }

    return { deduplicatedLeads: registered, references: deduplicatedReferences, alreadyRegistered };
  };
}
