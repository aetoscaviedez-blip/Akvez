import { bogotaZones, medellinZones, caliZones, barranquillaZones } from "../domain/zones";
import { recordGooglePlaces } from "../../../shared/observability/executionReport";
import { DiscoveredProspect, ProspectDiscoveryPort } from "../domain/prospectDiscoveryPort";

/**
 * Fuente de la Referencia de Origen (ADR-12 §7.1) de todo lo que descubre este
 * adapter. **La declara la infraestructura, que es quien sabe de dónde vino el
 * dato.** Antes la fijaba `application/`, que así nombraba a un proveedor.
 */
const SOURCE = "Google Maps";

/**
 * Implementación del puerto `ProspectDiscoveryPort` sobre Google Places.
 *
 * Se construye **una vez, en el Composition Root**, que es el único lugar
 * autorizado a construir (ADR-09 §5.1 · ADR-17 §9.1, AL-20) y el único que
 * conoce `shared/config/`. La credencial se captura aquí y no vuelve a viajar:
 * deja de atravesar el Orchestrator, la Agent API y el caso de uso (ADR-17 §6.3,
 * P-4).
 *
 * Sustituir Google Places por otra fuente es un cambio de una línea en el
 * Composition Root; ninguna otra capa se entera (ADR-17 §9.3).
 */
export function createGooglePlacesDiscovery(apiKey: string): ProspectDiscoveryPort {
  return {
    discover(industry: string, location: string): Promise<DiscoveredProspect[]> {
      return searchGooglePlaces(industry, location, apiKey);
    }
  };
}

async function searchGooglePlaces(
  industry: string,
  location: string,
  apiKey: string
): Promise<DiscoveredProspect[]> {
  let queries: string[] = [
    `${industry} ${location} Colombia`
  ];

  const locLower = location.toLowerCase();

  if (locLower.includes("bogotá") || locLower.includes("bogota")) {
    queries.push(
      ...bogotaZones.map(zone => `${industry} ${zone} Bogotá`)
    );
  } else if (locLower.includes("medellín") || locLower.includes("medellin")) {
    queries.push(
      ...medellinZones.map(zone => `${industry} ${zone} Medellín`)
    );
  } else if (locLower.includes("cali")) {
    queries.push(
      ...caliZones.map(zone => `${industry} ${zone} Cali`)
    );
  } else if (locLower.includes("barranquilla")) {
    queries.push(
      ...barranquillaZones.map(zone => `${industry} ${zone} Barranquilla`)
    );
  }

  console.log(`[Places API] Iniciando búsqueda ampliada con ${queries.length} sub-consultas para: "${industry}" en "${location}"...`);

  const fetchQuery = async (query: string) => {
    const url = `https://places.googleapis.com/v1/places:searchText?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        // `places.photos` se añade en H-14.F.1. Pertenece al nivel **Essentials**
        // y AKVEZ ya factura **Enterprise** por `rating`, `websiteUri`,
        // `nationalPhoneNumber` y `userRatingCount`: al facturarse el nivel más
        // alto que toque la petición, **el coste adicional es cero**.
        //
        // Solo se usa su **longitud**. Ni se descarga la imagen, ni se conserva
        // `name`, ni `widthPx`/`heightPx` —la resolución no es calidad—, ni
        // `authorAttributions`.
        "X-Goog-FieldMask": "places.id,places.displayName,places.websiteUri,places.nationalPhoneNumber,places.googleMapsUri,places.rating,places.userRatingCount,places.photos"
      },
      body: JSON.stringify({ textQuery: query, pageSize: 20 })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errorMsg = errData.error?.message || `Status key error: ${response.status}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.places || [];
  };

  const startedAt = Date.now();
  const results = await Promise.allSettled(queries.map(q => fetchQuery(q)));
  const elapsedMs = Date.now() - startedAt;

  let allRawPlaces: any[] = [];
  let errorCount = 0;
  let lastErrorMessage = "";

  results.forEach((res, index) => {
    const qName = queries[index];
    if (res.status === "fulfilled") {
      const found = res.value;
      console.log(`[Places API] Consulta exitosa: "${qName}" -> Encontró ${found.length} registros.`);
      allRawPlaces = allRawPlaces.concat(found);
    } else {
      console.error(`[Places API] Consulta fallida: "${qName}":`, res.reason);
      errorCount++;
      lastErrorMessage = res.reason?.message || String(res.reason);
    }
  });

  // Observabilidad: se registra antes del posible `throw` para que el reporte
  // también describa la ejecución cuando fallan todas las sub-consultas.
  // `found` es el total de registros crudos devueltos por las consultas
  // exitosas — la unificación por nombre que sigue es interna de este adapter.
  recordGooglePlaces({ queries: queries.length, found: allRawPlaces.length, ms: elapsedMs });

  // If ALL queries fail, throw the error
  if (errorCount === queries.length) {
    throw new Error(`Google Places API error: ${lastErrorMessage || "Fallaron todas las sub-consultas de búsqueda."}`);
  }

  // Deduplicación de las sub-consultas **por Designación**, no por nombre.
  //
  // Varias sub-consultas devuelven el mismo establecimiento, y hay que unificarlo.
  // Antes se hacía por nombre en minúsculas, lo que **fusionaba establecimientos
  // distintos que comparten enseña** —dos «Café Central» en barrios diferentes
  // colapsaban en uno— y hacía desaparecer un negocio real de la Biblioteca,
  // contra la regla **S-3** de ADR-12 §7.3 («ante la duda, no se fusiona»,
  // porque «un falso positivo fusiona dos negocios reales y destruye
  // información») y contra R-44.
  //
  // Todas las sub-consultas provienen de la misma Fuente, de modo que comparar
  // Designaciones es comparar Referencias de Origen completas (ADR-12 §7.1). Es
  // además lo que exige **I-2** de ADR-13 §11.3: «la idempotencia se apoya
  // exclusivamente en la identidad de ADR-12».
  const byDesignation = new Map<string, any>();
  const withoutDesignation: any[] = [];

  allRawPlaces.forEach((place: any) => {
    const designation = (place.id || "").trim();
    if (designation === "") {
      // Sin Designación no hay Referencia de Origen. No se fusiona por nombre
      // aquí: se conserva y la identidad se resolverá por Huella más adelante,
      // que es el mecanismo subsidiario previsto en §7.3.
      withoutDesignation.push(place);
      return;
    }
    if (!byDesignation.has(designation)) {
      byDesignation.set(designation, place);
    }
  });

  const uniqueRawPlaces = [...byDesignation.values(), ...withoutDesignation];
  console.log(`[Places API] Combinación completada. Total bruto antes de filtrar: ${allRawPlaces.length} -> Únicos por Referencia de Origen: ${uniqueRawPlaces.length}`);

  return uniqueRawPlaces.map((place: any) => ({
    // Designación de la Referencia de Origen (ADR-12 §7.1): el identificador
    // estable que Google Places asigna a **este establecimiento concreto**.
    //
    // Se pedía ya en el `FieldMask` (`places.id`) pero se descartaba al mapear, de
    // modo que el sistema no conservaba ninguna identidad natural y cada búsqueda
    // volvía a registrar las mismas Empresas como Leads nuevos. Conservarlo es
    // condición para la idempotencia que exige ADR-13 §11.3 (I-2: «la
    // idempotencia se apoya **exclusivamente** en la identidad de ADR-12»).
    //
    // No es una capacidad propietaria filtrada al dominio (ADR-11 §9, E-6):
    // ADR-12 §7.4 lo precisa — «el dominio no adopta el identificador de un
    // proveedor: exige que exista uno y lo conserva».
    sourceDesignation: place.id || "",
    name: place.displayName?.text || "Negocio sin nombre",
    website: place.websiteUri || "",
    phone: place.nationalPhoneNumber || "",
    googleMapsUrl: place.googleMapsUri || "",
    rating: place.rating || 0,
    reviewCount: place.userRatingCount || 0,
    // ⚠️ **Único campo del adapter que preserva la ausencia (H-14.F.1).**
    //
    // El resto de esta función colapsa la ausencia con `|| 0` y `|| ""`, de modo
    // que un negocio sin calificar y uno calificado con 0 llegan idénticos. Es un
    // defecto anterior a este sprint, documentado en H-14.F §3.1, y **no se
    // corrige aquí**: hacerlo cambiaría el Score de negocios reales.
    //
    // `photoCount` **no lo hereda**:
    //
    //   `photos` ausente  → 0     Google omite el campo cuando no hay ninguna,
    //                             y `PE-1.0` sí lo pide. Es cero observado.
    //   lista vacía       → 0
    //   lista con N       → N
    //
    // `null` queda reservado a evidencia recogida antes de `PE-1.0`, que este
    // adapter nunca produce.
    photoCount: Array.isArray(place.photos) ? place.photos.length : 0,
    source: SOURCE
  }));
}
