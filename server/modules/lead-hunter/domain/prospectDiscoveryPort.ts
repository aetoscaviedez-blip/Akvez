// Puerto de proveedor del módulo Lead Hunter — descubrimiento de Empresas.
//
// ADR-17 §6.3: «el puerto de proveedor se declara en el `domain/` del módulo que
// lo consume, y se expresa exclusivamente en tipos de ese `domain/` y primitivos».
// Se declara aquí y no en `application/` ni en `infrastructure/` porque es lo que
// hace verificable la frontera: ampliar lo que se pide al exterior exige tocar el
// dominio, y un cambio en el dominio se revisa.
//
// Cumplimiento de las cuatro restricciones de ADR-17 §6.3:
//   · P-1 — solo tipos de este `domain/` y primitivos.
//   · P-2 — no nombra ningún proveedor, ni en el identificador ni en los tipos.
//           Quién descubre (Google Places, un directorio, una búsqueda social) es
//           decisión del Composition Root, no de esta interfaz.
//   · P-3 — no expone ningún parámetro operativo: ni número de sub-consultas, ni
//           tiempo de espera, ni reintentos, ni cupo. Son limitaciones técnicas y
//           viven en el adapter (ADR-11 §8.1, §8.3 · R-52).
//   · P-4 — **no expone credenciales.** La clave del proveedor la recibe el
//           adapter del Composition Root desde `shared/config/`, y deja de viajar
//           por `application/` (ADR-04 §11 · RI-9).

/**
 * Una Empresa tal como la entrega una fuente de descubrimiento, antes del
 * Registro y antes de cualquier análisis.
 *
 * No es un `Lead`: un Lead existe a partir del Registro (PO-01 §3), y esto es lo
 * que se descubre. Tampoco lleva identificador: la identidad la asigna la
 * persistencia más adelante en el flujo.
 */
export interface DiscoveredProspect {
  /**
   * Designación de la Referencia de Origen (ADR-12 §7.1): el identificador
   * estable que la Fuente asigna a **este establecimiento concreto**. Cadena
   * vacía cuando la fuente no lo proporciona — la identidad se resolverá
   * entonces por Huella, que es el mecanismo subsidiario de ADR-12 §7.3.
   *
   * No es una capacidad de proveedor filtrada al dominio (ADR-11 §9 E-6):
   * ADR-12 §7.4 lo precisa — «el dominio no adopta el identificador de un
   * proveedor: exige que exista uno y lo conserva».
   */
  sourceDesignation: string;
  name: string;
  website: string;
  phone: string;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  /**
   * Fuente de la Referencia de Origen (ADR-12 §7.1). **La declara el adapter**,
   * que es quien sabe de dónde vino el dato; `application/` no puede nombrarla
   * sin conocer al proveedor.
   */
  source: string;
}

/**
 * Lo que el Lead Hunter necesita del exterior para descubrir Empresas.
 *
 * Un fallo total de la fuente se propaga **como excepción envuelta por el
 * adapter, conservando `cause`** (R-63 · ADR-17 §10.2, AL-14). Una búsqueda
 * legítimamente vacía **no es un fallo**: resuelve con `[]`.
 */
export interface ProspectDiscoveryPort {
  discover(industry: string, location: string): Promise<DiscoveredProspect[]>;
}
