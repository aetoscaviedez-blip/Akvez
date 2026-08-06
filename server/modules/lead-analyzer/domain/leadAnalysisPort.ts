// Puerto de proveedor del módulo Lead Analyzer — análisis narrativo de Leads.
//
// ADR-17 §6.3: lo declara el `domain/` del módulo que lo consume. Cumple las
// cuatro restricciones:
//   · P-1 — solo tipos de este módulo y primitivos.
//   · P-2 — no nombra ningún proveedor. El adapter que hoy lo implementa usa un
//           modelo generativo; el puerto no lo sabe ni puede saberlo.
//   · P-3 — **no expone ningún parámetro operativo.** El tamaño de tanda (WS-01)
//           y la concurrencia (WS-02) son limitaciones técnicas con valor en
//           APS-17 §4 y viven en el adapter (ADR-11 §8.1, §8.3 · R-52). Este
//           puerto entrega el conjunto completo y recibe el conjunto completo.
//   · P-4 — no expone credenciales.

/**
 * Resultado de analizar **el conjunto completo** de Leads registrados.
 *
 * `analyzedLeads` usa **índices globales** respecto del arreglo de entrada:
 * quien consume este resultado no necesita saber si el proveedor fragmentó la
 * ejecución internamente.
 *
 * `attempted` y `failed` existen porque **R-64 exige que un fallo parcial nunca
 * aborte el conjunto**: sin ellos, «todo falló» y «algo falló» serían
 * indistinguibles y la única forma de expresar el fallo sería una excepción que
 * se llevaría por delante a los Leads sí analizados. No son parámetros
 * operativos —nadie los configura—, son el desenlace de la ejecución.
 */
export interface LeadAnalysisOutcome {
  analyzedLeads: any[];
  /** Invocaciones que el proveedor necesitó para cubrir el conjunto completo. */
  attempted: number;
  /** Cuántas de ellas no produjeron análisis. */
  failed: number;
  firstFailureMessage?: string;
}

/**
 * Lo que el Lead Analyzer necesita del exterior para producir el análisis
 * narrativo de un conjunto de Leads.
 *
 * **No lanza por un fallo parcial** (R-64 · AL-15): devuelve lo que sí se
 * analizó. Los Leads sin análisis los resuelve `application/` con la
 * inteligencia de respaldo, uno por uno — ninguno se pierde y ninguno se retira
 * de la Biblioteca (PO-01 §8 · ADR-13 §11.2 A-2).
 */
export interface LeadAnalysisPort {
  analyze(
    leads: any[],
    industry: string,
    location: string,
    designerStyle: string
  ): Promise<LeadAnalysisOutcome>;
}
