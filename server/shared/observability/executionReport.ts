// Observabilidad transversal de los flujos de agentes (APS-16 §14; APS-11 §4.5).
//
// UBICACIÓN — Vive en `shared/` porque es una preocupación estrictamente
// transversal, sin lógica de negocio ni conocimiento de ningún agente concreto
// (ADR-04 §11, regla disciplinaria). No conoce DTOs, ni contratos públicos, ni
// persistencia: solo recibe números, nombres y duraciones ya calculados.
//
// ALCANCE — Instrumentación pura. Ninguna función de este archivo altera el
// resultado de la operación que observa: todas devuelven `void`, y toda función
// `record*` es un **no-op** si no hay un reporte activo (tests, invocaciones
// directas fuera de un request). El código instrumentado se comporta igual con
// o sin reporte.
//
// MECANISMO — El reporte es *request-scoped* mediante `AsyncLocalStorage`, que
// forma parte del runtime de Node (no es una dependencia nueva). Esta decisión
// permite que cada capa registre sus métricas sin que cambie **ninguna** firma,
// DTO, contrato ni dirección de dependencia (ADR-05, ADR-08, ADR-09 intactos),
// y garantiza que dos requests concurrentes no se pisen los datos — lo que sí
// ocurriría con un acumulador a nivel de módulo.
//
// SEGURIDAD — Nunca se registran API Keys ni prompts. Todo texto libre que
// entra al reporte pasa por `sanitizeText`, que redacta credenciales embebidas
// en URLs y recorta la longitud. El saneamiento se aplica **en el punto de
// registro**, no en el llamador, para que ninguna capa pueda omitirlo.

import { AsyncLocalStorage } from "async_hooks";
import { isProduction } from "../config/env";

/**
 * Desglose de descartes, o su ausencia declarada. Nunca imprime ceros
 * inventados: si nadie registró el detalle, se dice que no está.
 */
function formatDiscards(d?: { unnamed: number; excluded: number; duplicate: number }): string {
  if (!d) return "No disponible";
  const total = d.unnamed + d.excluded + d.duplicate;
  if (total === 0) return "0";
  return `${total} (duplicados: ${d.duplicate} · ya en pantalla: ${d.excluded} · sin nombre: ${d.unnamed})`;
}

/** IDs mostrados antes de resumir el resto. Mantiene el reporte legible cuando
 *  una búsqueda persiste decenas de leads. */
const MAX_IDS_DISPLAYED = 10;
const MAX_TEXT_LENGTH = 200;
const SEPARATOR = "=".repeat(40);
const EMPTY = "—";

/** Flujos instrumentados. Determina qué secciones se imprimen. */
export type ExecutionFlow = "LEAD_HUNTER" | "PITCH_GENERATOR";

/**
 * Origen del contenido entregado al usuario (Sprint 15, Tarea 4, Fase 4).
 * Es un valor **registrado explícitamente** por la capa que toma la decisión,
 * nunca deducido por el lector del reporte a partir de otras métricas.
 *
 * - `GEMINI`          — todo el contenido proviene del modelo.
 * - `FALLBACK`        — todo el contenido proviene del sistema de respaldo.
 * - `GEMINI+FALLBACK` — parte del modelo, parte del respaldo.
 */
export type AnalysisSource = "GEMINI" | "FALLBACK" | "GEMINI+FALLBACK";

export interface GooglePlacesMetrics {
  /** Sub-consultas ejecutadas contra la API (incluye las que fallaron). */
  queries: number;
  /** Registros crudos devueltos por las consultas exitosas. */
  found: number;
  ms: number;
}

export interface DeduplicationMetrics {
  before: number;
  after: number;
  ms: number;
  /**
   * Desglose de los descartes por motivo (H-12.1 · P0.4). Opcional para no
   * romper a quien registre solo los totales.
   */
  discards?: { unnamed: number; excluded: number; duplicate: number };
}

export interface PersistenceMetrics {
  saved: number;
  ids: string[];
  ms: number;
}

export interface LeadAnalyzerMetrics {
  received: number;
  analyzed: number;
  ms: number;
}

/** Detalle de un fallo del proveedor, producido por `shared/ai/describeGeminiFailure`. */
export interface GeminiFailureDetail {
  type: string;
  httpStatus?: number;
  statusText?: string;
  message: string;
}

export interface GeminiMetrics {
  model: string;
  /** `true` si la llamada devolvió respuesta; `false` si terminó en excepción. */
  success: boolean;
  ms: number;
  fallback: boolean;
  fallbackReason?: string;
  /** Intentos consumidos por la política de reintentos (1 = sin reintentos). */
  attempts?: number;
  failure?: GeminiFailureDetail;
}

export interface AnalysisOrigin {
  source: AnalysisSource;
  detail?: string;
}

export interface ExecutionReport {
  flow: ExecutionFlow;
  timestamp: string;
  /** Marca de inicio para calcular el tiempo total del request. */
  startedAt: number;
  /** Encabezado propio de cada flujo: pares etiqueta → valor. */
  subject: Array<[string, string]>;
  googlePlaces?: GooglePlacesMetrics;
  deduplication?: DeduplicationMetrics;
  persistence?: PersistenceMetrics;
  leadAnalyzer?: LeadAnalyzerMetrics;
  gemini?: GeminiMetrics;
  analysis?: AnalysisOrigin;
  returned?: number;
}

export interface ExecutionReportContext {
  flow: ExecutionFlow;
  subject: Array<[string, string]>;
}

const storage = new AsyncLocalStorage<ExecutionReport>();

function current(): ExecutionReport | undefined {
  return storage.getStore();
}

/**
 * Abre el ámbito de observabilidad de un request y ejecuta `fn` dentro de él.
 * Devuelve exactamente lo que devuelva `fn` y propaga sus excepciones sin
 * alterarlas: envolver una operación en este helper no cambia su semántica.
 */
export function runWithExecutionReport<T>(
  context: ExecutionReportContext,
  fn: () => Promise<T>
): Promise<T> {
  const report: ExecutionReport = {
    flow: context.flow,
    timestamp: new Date().toISOString(),
    startedAt: Date.now(),
    subject: context.subject.map(([label, value]) => [label, sanitizeText(value)])
  };
  return storage.run(report, fn);
}

export function recordGooglePlaces(metrics: GooglePlacesMetrics): void {
  const report = current();
  if (!report) return;
  report.googlePlaces = metrics;
}

export function recordDeduplication(metrics: DeduplicationMetrics): void {
  const report = current();
  if (!report) return;
  report.deduplication = metrics;
}

export function recordPersistence(metrics: PersistenceMetrics): void {
  const report = current();
  if (!report) return;
  report.persistence = metrics;
}

export function recordLeadAnalyzer(metrics: LeadAnalyzerMetrics): void {
  const report = current();
  if (!report) return;
  report.leadAnalyzer = metrics;
}

/**
 * Registra una llamada al modelo que **devolvió respuesta**. Conserva un
 * `fallback` ya marcado: el orden respecto de `recordGeminiFallback` no altera
 * el reporte final.
 */
export function recordGeminiCall(metrics: { model: string; success: boolean; ms: number }): void {
  const report = current();
  if (!report) return;
  const existing = report.gemini;
  report.gemini = {
    model: metrics.model,
    success: metrics.success,
    ms: metrics.ms,
    fallback: existing?.fallback ?? false,
    fallbackReason: existing?.fallbackReason,
    attempts: existing?.attempts,
    failure: existing?.failure
  };
}

/**
 * Registra una llamada al modelo que **terminó en excepción**, con el detalle
 * necesario para auditar la causa (Sprint 15, Tarea 4, Fase 3): tipo de error,
 * código HTTP, mensaje resumido y tiempo empleado.
 */
export function recordGeminiFailure(params: {
  model: string;
  ms: number;
  failure: GeminiFailureDetail;
}): void {
  const report = current();
  if (!report) return;
  const existing = report.gemini;
  report.gemini = {
    model: params.model,
    success: false,
    ms: params.ms,
    fallback: existing?.fallback ?? false,
    fallbackReason: existing?.fallbackReason,
    attempts: existing?.attempts,
    failure: {
      type: sanitizeText(params.failure.type),
      httpStatus: params.failure.httpStatus,
      statusText: params.failure.statusText ? sanitizeText(params.failure.statusText) : undefined,
      message: sanitizeText(params.failure.message)
    }
  };
}

/** Intentos consumidos por la política de reintentos, para explicar el tiempo empleado. */
export function recordGeminiAttempts(attempts: number): void {
  const report = current();
  if (!report) return;
  if (!report.gemini) {
    report.gemini = { model: EMPTY, success: false, ms: 0, fallback: false, attempts };
    return;
  }
  report.gemini.attempts = attempts;
}

/**
 * Marca que se activó la inteligencia de respaldo. El primer motivo registrado
 * prevalece: es el que originó la degradación.
 */
export function recordGeminiFallback(reason: string): void {
  const report = current();
  if (!report) return;
  const existing = report.gemini;
  report.gemini = {
    model: existing?.model ?? EMPTY,
    success: existing?.success ?? false,
    ms: existing?.ms ?? 0,
    fallback: true,
    fallbackReason: existing?.fallbackReason ?? sanitizeText(reason),
    attempts: existing?.attempts,
    failure: existing?.failure
  };
}

/**
 * Declara el origen del contenido entregado (Fase 4). Lo invoca la capa
 * `application/` de cada agente, que es quien decide entre modelo y respaldo —
 * el reporte no lo deduce.
 */
export function recordAnalysisSource(source: AnalysisSource, detail?: string): void {
  const report = current();
  if (!report) return;
  report.analysis = {
    source,
    detail: detail ? sanitizeText(detail) : undefined
  };
}

export function recordResponse(returned: number): void {
  const report = current();
  if (!report) return;
  report.returned = returned;
}

/**
 * Imprime el reporte del request en curso. Nunca lanza: un fallo de formateo no
 * puede convertir una operación exitosa en un error.
 */
export function printExecutionReport(): void {
  // ⚠️ **H-12.1 · P0.4 — el reporte es instrumentación de desarrollo.**
  //
  // Se imprimía en todos los entornos. En Cloud Run eso significa volcar en los
  // logs del servicio, por cada búsqueda, el nicho y la ciudad consultados y el
  // desglose completo del pipeline. Es ruido operativo y superficie de
  // información innecesaria en un entorno donde nadie lo está leyendo.
  //
  // La recolección sigue activa siempre —es barata y no altera el flujo—; lo
  // que se condiciona es **la impresión**.
  if (isProduction()) return;

  const report = current();
  if (!report) return;
  try {
    console.log(formatExecutionReport(report));
  } catch {
    // La observabilidad jamás altera el resultado del request.
  }
}

/** Formateo puro, separado de la impresión para poder verificarse aisladamente. */
export function formatExecutionReport(report: ExecutionReport): string {
  const lines: string[] = [
    "",
    SEPARATOR,
    "AKVEZ EXECUTION REPORT",
    SEPARATOR,
    "",
    `${pad("Flow:")}${report.flow}`,
    `${pad("Timestamp:")}${text(report.timestamp)}`,
    ""
  ];

  for (const [label, value] of report.subject) {
    lines.push(`${pad(label)}${text(value)}`);
  }
  lines.push("");

  if (report.flow === "LEAD_HUNTER") {
    lines.push(...leadHunterSections(report));
  }

  lines.push(...geminiSection(report.gemini));
  lines.push(...analysisSection(report.analysis));

  lines.push(
    "Response",
    `${pad("Returned:")}${count(report.returned)}`,
    `${pad("Total Time:")}${duration(Date.now() - report.startedAt)}`,
    "",
    SEPARATOR,
    ""
  );

  return lines.join("\n");
}

function leadHunterSections(report: ExecutionReport): string[] {
  const places = report.googlePlaces;
  const dedup = report.deduplication;
  const persistence = report.persistence;
  const analyzer = report.leadAnalyzer;

  return [
    "Google Places",
    `${pad("Queries:")}${count(places?.queries)}`,
    `${pad("Found:")}${count(places?.found)}`,
    `${pad("Time:")}${duration(places?.ms)}`,
    "",
    "Deduplication",
    `${pad("Before:")}${count(dedup?.before)}`,
    `${pad("After:")}${count(dedup?.after)}`,
    // El «por qué» del descarte (H-12.1 · P0.4). Se declara ausente en lugar de
    // imprimir ceros cuando nadie lo registró: R-38 vale también para el log.
    `${pad("Discarded:")}${formatDiscards(dedup?.discards)}`,
    `${pad("Time:")}${duration(dedup?.ms)}`,
    "",
    "Persistence",
    `${pad("Saved:")}${count(persistence?.saved)}`,
    `${pad("IDs:")}${formatIds(persistence?.ids)}`,
    `${pad("Time:")}${duration(persistence?.ms)}`,
    "",
    "Lead Analyzer",
    `${pad("Received:")}${count(analyzer?.received)}`,
    `${pad("Analyzed:")}${count(analyzer?.analyzed)}`,
    `${pad("Time:")}${duration(analyzer?.ms)}`,
    ""
  ];
}

function geminiSection(gemini?: GeminiMetrics): string[] {
  return [
    "Gemini",
    `${pad("Model:")}${text(gemini?.model)}`,
    `${pad("Success:")}${flag(gemini?.success)}`,
    `${pad("Attempts:")}${count(gemini?.attempts)}`,
    `${pad("Error Type:")}${text(gemini?.failure?.type)}`,
    `${pad("HTTP Status:")}${count(gemini?.failure?.httpStatus)}`,
    `${pad("API Status:")}${text(gemini?.failure?.statusText)}`,
    `${pad("Error:")}${text(gemini?.failure?.message)}`,
    `${pad("Fallback:")}${flag(gemini?.fallback)}`,
    `${pad("Reason:")}${text(gemini?.fallbackReason)}`,
    `${pad("Time:")}${duration(gemini?.ms)}`,
    ""
  ];
}

function analysisSection(analysis?: AnalysisOrigin): string[] {
  return [
    "Analysis",
    `${pad("Source:")}${text(analysis?.source)}`,
    `${pad("Detail:")}${text(analysis?.detail)}`,
    ""
  ];
}

/** Ancho fijo de etiqueta para que todas las columnas de valores queden alineadas. */
function pad(label: string): string {
  return label.padEnd(13, " ");
}

function text(value?: string): string {
  return value && value.trim() !== "" ? value : EMPTY;
}

function count(value?: number): string {
  return typeof value === "number" ? String(value) : EMPTY;
}

function duration(value?: number): string {
  return typeof value === "number" ? `${value} ms` : EMPTY;
}

function flag(value?: boolean): string {
  if (value === undefined) return EMPTY;
  return value ? "yes" : "no";
}

function formatIds(ids?: string[]): string {
  if (!ids) return EMPTY;
  if (ids.length === 0) return "(ninguno)";

  const shown = ids.slice(0, MAX_IDS_DISPLAYED).join(", ");
  const remaining = ids.length - MAX_IDS_DISPLAYED;
  return remaining > 0 ? `${shown} (+${remaining} más)` : shown;
}

/**
 * Credencial precedida de una etiqueta y un separador explícito
 * (`?key=…`, `Authorization: Bearer …`). Exigir el separador evita destruir
 * códigos de diagnóstico valiosos como `API_KEY_INVALID`, que no contienen
 * ningún secreto y son justamente lo que hay que poder leer en el reporte.
 */
const LABELLED_SECRET =
  /((?:api[_-]?key|apikey|key|access[_-]?token|token|authorization)\s*[=:]\s*(?:Bearer\s+)?)[A-Za-z0-9._\-]{8,}/gi;

/** Formato de las API Keys de Google, por si aparece sin etiqueta que la anteceda. */
const BARE_GOOGLE_KEY = /\bAIza[0-9A-Za-z_\-]{20,}/g;

/**
 * Redacta credenciales que un proveedor externo pudiera haber devuelto dentro
 * de un mensaje de error (típicamente una URL con la key en el query string) y
 * acota la longitud para que el reporte siga siendo legible.
 */
function sanitizeText(value: string): string {
  return String(value)
    .replace(LABELLED_SECRET, "$1[REDACTED]")
    .replace(BARE_GOOGLE_KEY, "[REDACTED]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEXT_LENGTH);
}
