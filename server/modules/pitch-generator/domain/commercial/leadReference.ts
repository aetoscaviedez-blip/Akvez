// Referencia al `Lead` desde el dominio comercial.
//
// **AG-1 (DDD-01 §5.3): toda identidad comercial incluye al `Lead`.** Las cuatro
// entidades comerciales se identifican por el Lead más un discriminante, nunca
// de forma autónoma, y **se referencian entre sí por identidad, nunca
// conteniéndose**.
//
// **El `Lead` no se declara aquí y no puede declararse aquí.** Su owner es el
// Lead Hunter (DDD-01 §2.1 · APS-03 §7.1) y su autoridad es PO-01 §2. ADR-16
// §4.1 lo referencia y **nunca lo redefine**; D-5 prohíbe a toda entidad
// comercial registrar, eliminar, ocultar, ordenar o puntuar Leads. Importar
// `modules/lead-hunter/domain/` desde aquí violaría además R-02 y R-03: la
// comunicación entre módulos pasa por el Orchestrator.

/**
 * Identidad de un `Lead` tal como quedó asignada en el **Registro** (PO-01 §3).
 *
 * El dominio comercial la transporta y nunca la construye ni la interpreta: la
 * identidad canónica es `(Referencia de Origen, Usuario)` (ADR-12 §7.2) y vive
 * en el módulo que la produce.
 */
export type LeadReference = string;

/**
 * Número de emisión o de secuencia dentro de la identidad de una entidad
 * comercial.
 *
 * Discrimina emisiones sucesivas del mismo objeto para el mismo Lead. **Ninguna
 * emisión sustituye a la anterior** (RC-9 · P-I2 · CS-I5).
 */
export type IssueNumber = number;
