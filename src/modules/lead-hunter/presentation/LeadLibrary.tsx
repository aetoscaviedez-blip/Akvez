import React from "react";
import { SectionHeader, EmptyState, Callout, Badge, Button, Surface, Eyebrow } from "../../../shared/components/ui";
import { Library, RefreshCw, Globe, PhoneCall, Star, MapPin, AlertTriangle, Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import { loadLeadLibrary, RegisteredLeadView } from "../application/loadLeadLibrary";
// **Extraído a `shared/components` en H-03 Fase 2**: la misma explicación la
// muestran ahora la Biblioteca y la búsqueda. Se comparte en lugar de copiarse.
import ScoreBreakdown from "../../../shared/components/ScoreBreakdown";

/**
 * Biblioteca de Leads — pantalla P-08 de APS-04 §A.3.5.
 *
 * «Ninguna restricción de contenido: muestra **todos** los Leads.» A diferencia
 * del Workspace, que presenta el resultado de una ejecución, la Biblioteca es la
 * memoria comercial completa del usuario (APS-04 §A.3.4) y **solo crece**.
 *
 * REGLAS DE INTERFAZ QUE RESPETA
 *   · UI-2 — ningún Lead se oculta por su Opportunity Score.
 *   · UI-3 — ningún filtro se aplica por defecto. Esta vista no tiene filtros.
 *   · UI-4 — el conjunto completo es recorrible. No se trunca ni se pagina.
 *   · UI-5 — no ofrece eliminar ningún Lead de la Biblioteca.
 *   · UI-7 — la ausencia de análisis y de Score se muestra como **estado
 *     válido**, nunca como error.
 *   · UI-9 — no expone identificadores técnicos ni trazas. El `id` de
 *     persistencia se usa como clave de React y **no se muestra**.
 *   · UI-10 — no ofrece configurar umbrales, cupos ni límites.
 *   · R-48 — sin lógica de negocio: no puntúa, no ordena, no clasifica.
 *   · R-49 — todo valor visual procede de los Design Tokens.
 */
export default function LeadLibrary() {
  const [leads, setLeads] = React.useState<RegisteredLeadView[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [scored, setScored] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await loadLeadLibrary();
    if (result.success) {
      setLeads(result.leads);
      setTotal(result.total);
      setScored(result.scored);
    } else {
      setError(result.error);
      setLeads([]);
      setTotal(0);
      setScored(0);
    }
    setIsLoading(false);
  }, []);

  // Versión del Perfil de Ponderación con la que se puntuó. ADR-14 R-VIN vincula
  // toda puntuación a su versión, y el usuario debe poder saber bajo qué criterio
  // se ordenó su Biblioteca. Se toma del primer Lead evaluado: todos los de una
  // misma ejecución comparten versión, y si conviviesen dos, mostrar la del Lead
  // es más honesto que inventar una global.
  const activeProfileVersion = leads.find((lead) => lead.scoreVersion)?.scoreVersion;

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">

      {/*
        **H-09 · P4 — la Biblioteca entra en el Design System.**

        Era la única pantalla que seguía siendo la de antes de H-07: encabezado
        en mayúsculas display, contador en monoespaciada, estado vacío hecho a
        mano y ni una primitiva importada. **Y está a un clic desde las otras
        cuatro.**
      */}
      <SectionHeader
        level="screen"
        icon={<Library className="h-3.5 w-3.5" />}
        eyebrow="Archivo"
        title="Todo lo que el agente ha registrado"
        lead="Ordenados por Opportunity Score descendente. La Biblioteca solo crece: ningún Lead se oculta ni se elimina, por baja que sea su puntuación."
        action={
          <div className="flex items-center gap-3">
            {/* Recuento real: procede del servidor, no se deduce de la lista */}
            <Badge>
              {total} {total === 1 ? "Lead registrado" : "Leads registrados"}
            </Badge>
            <Button
              size="sm"
              onClick={load}
              disabled={isLoading}
              icon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />}
            >
              Actualizar
            </Button>
          </div>
        }
      >
        {activeProfileVersion && (
          /* Trazabilidad del criterio (ADR-14 R-VIN · §6.4): el usuario debe
             poder saber con qué Perfil se puntuó lo que está viendo. */
          <p className="font-mono text-xs text-app-muted">
            Perfil de Ponderación <span className="text-brand">{activeProfileVersion}</span>
            {scored < total && ` · ${scored} de ${total} evaluados`}
          </p>
        )}
      </SectionHeader>

      {/* Error — un fallo de carga NO se presenta como "Biblioteca vacía" */}
      {error && (
        <Callout
          tone="danger"
          icon={<AlertTriangle className="h-5 w-5" />}
          title="No se pudo cargar la Biblioteca"
        >
          {error}
        </Callout>
      )}

      {/* Cargando */}
      {isLoading && !error && (
        <EmptyState variant="panel" icon={<RefreshCw className="h-6 w-6 animate-spin" />}>
          Consultando la Biblioteca…
        </EmptyState>
      )}

      {/* Biblioteca vacía — estado válido, no un error */}
      {!isLoading && !error && leads.length === 0 && (
        <EmptyState
          variant="panel"
          icon={<Library className="h-6 w-6" />}
          title="Tu Biblioteca está vacía"
        >
          <>
            Ejecuta una búsqueda en <strong className="text-app-text">Oportunidades</strong> y cada
            empresa descubierta quedará registrada aquí de forma permanente.
          </>
        </EmptyState>
      )}

      {/* Conjunto completo — sin truncar (UI-4) */}
      {!isLoading && !error && leads.length > 0 && (
        <div className="space-y-3">
          {leads.map((lead) => (
            <LeadLibraryRow key={lead.id} lead={lead} />
          ))}
        </div>
      )}

    </div>
  );
}

/**
 * Desglose del Opportunity Score — la explicación que exige **APS-08 §9**.
 *
 * Muestra, por cada una de las seis categorías de APS-08 §6: la categoría, su
 * puntuación parcial, el peso aplicado según WP-01 y su contribución al Score
 * final. **Todo es trazable a WP-01**: ningún factor se inventa aquí.
 *
 * Los factores no medibles se muestran explícitamente. APS-08 §11 obliga a
 * indicar que la confianza «puede ser limitada», y decir *qué* no se pudo medir es
 * la forma honesta de cumplirlo: oculto, el Score aparentaría una precisión que
 * no tiene.
 */
/** Una fila de la Biblioteca. Presenta y no decide (R-48). */
function LeadLibraryRow({ lead }: { lead: RegisteredLeadView }) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  // La ausencia de sitio web es un HALLAZGO comercial, no un hueco que rellenar
  // (R-38 · APS-08 §7.1: pesa el 25 % en el Perfil WP-01). Se presenta como
  // oportunidad, no como dato faltante.
  const hasWebsite = !!(lead.website && lead.website.trim() !== "" && !lead.website.toLowerCase().includes("sin sitio web"));

  // ⚠️ A-03 — el contrato de persistencia declara `rating` y `reviewCount` como
  // números obligatorios y no anulables, de modo que «no hay dato» y «el dato es
  // cero» son hoy indistinguibles en la frontera. Se muestra «—» para el cero
  // por ser la lectura más probable, pero la distinción no puede garantizarse
  // hasta que A-03 se resuelva y el contrato exprese la opcionalidad real.
  const hasRating = lead.rating > 0;
  const hasReviews = lead.reviewCount > 0;

  // «Tiene Score» es `typeof score === "number"`, NO `!!score`: un Score de 0 es
  // una puntuación legítima —Oportunidad Muy Baja— y `!!0` lo trataría como
  // ausente, ocultando la puntuación de los Leads menos prioritarios. Eso sería
  // exactamente el umbral encubierto que APS-08 §8.6 prohíbe.
  const hasScore = typeof lead.score === "number";

  return (
    <Surface padding="sm" className="transition-colors hover:border-brand/40">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">

        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-sm font-bold text-app-text font-display truncate">{lead.name}</h3>

            {/* Estadio del Lead. Vocabulario sujeto a la desviación A-01. */}
            <span className="rounded-control border border-app-border bg-surface-raised px-2 py-0.5 font-sans text-eyebrow font-bold uppercase tracking-widest text-app-muted">
              {lead.status}
            </span>

            {/* Banda de APS-08 §8, o ausencia de Evaluación como ESTADO VÁLIDO
                (UI-7 · R-45). Ninguna de las dos cosas oculta el Lead. */}
            {hasScore ? (
              <span className="flex items-center gap-1 text-eyebrow text-brand font-semibold px-2 py-0.5 rounded border border-brand/30 bg-brand/5">
                <Sparkles className="w-3 h-3" />
                {lead.band}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-eyebrow text-app-muted font-medium px-2 py-0.5 rounded border border-app-border bg-surface-raised">
                <Sparkles className="w-3 h-3 text-app-muted" />
                Sin evaluar
              </span>
            )}

            {/* APS-08 §11 — cuando la información pública es parcial, la confianza
                se declara. No se esconde tras un número aparentemente exacto. */}
            {hasScore && lead.confidence && lead.confidence !== "alta" && (
              <span
                title={`Confianza ${lead.confidence}: parte de los factores de evaluación no son medibles con los datos públicos disponibles.`}
                className="flex items-center gap-1 text-eyebrow text-app-muted font-medium px-2 py-0.5 rounded border border-app-border bg-surface-raised"
              >
                <AlertTriangle className="w-3 h-3" />
                Confianza {lead.confidence}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 flex-wrap text-xs text-app-muted">
            {hasWebsite ? (
              <span className="flex items-center gap-1.5 min-w-0">
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{lead.website}</span>
              </span>
            ) : (
              /* Hallazgo, no carencia: es lo que hace valioso al Lead */
              <span className="flex items-center gap-1.5 text-brand font-semibold">
                <Globe className="w-3.5 h-3.5 shrink-0" />
                Sin sitio web propio
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              {lead.phone && lead.phone.trim() !== "" ? lead.phone : "—"}
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {lead.source}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-xs">
          {/* Opportunity Score — 0-100 (APS-08 §7). Se muestra en cabeza porque es
              el criterio de orden por defecto (WS-05). La ausencia se muestra como
              «—», nunca como 0 (R-38 · UI-7). */}
          <span
            title={
              hasScore
                ? `Opportunity Score ${lead.score}/100 · ${lead.band} · Perfil ${lead.scoreVersion}`
                : "Este Lead todavía no ha sido evaluado. Es un estado válido: sigue en tu Biblioteca."
            }
            className="flex flex-col items-end leading-tight"
          >
            <span className={`font-display font-black text-base ${hasScore ? "text-brand" : "text-app-muted"}`}>
              {hasScore ? lead.score : "—"}
            </span>
            <span className="text-eyebrow text-app-muted uppercase tracking-wider">Score</span>
          </span>

          <span className="flex items-center gap-1.5 text-app-muted">
            <Star className="w-3.5 h-3.5 text-brand shrink-0" />
            {hasRating ? lead.rating.toFixed(1) : "—"}
          </span>
          <span className="text-app-muted font-mono">
            {hasReviews ? `${lead.reviewCount} reseñas` : "—"}
          </span>
          {lead.googleMapsUrl && (
            <a
              href={lead.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline font-semibold"
            >
              Ver en Maps
            </a>
          )}
        </div>

      </div>

      {/* APS-08 §9 — «Todo Opportunity Score deberá acompañarse de una
          explicación.» Se ofrece plegada para no saturar la vista, pero está
          siempre disponible: la explicación no es opcional, su despliegue sí. */}
      {hasScore && lead.breakdown && lead.breakdown.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setShowBreakdown((open) => !open)}
            aria-expanded={showBreakdown}
            className="mt-2 flex items-center gap-1 text-eyebrow text-app-muted hover:text-brand transition font-semibold uppercase tracking-wider cursor-pointer"
          >
            {showBreakdown ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            {showBreakdown ? "Ocultar" : "Por qué"} este Score
          </button>

          {showBreakdown && (
            <ScoreBreakdown breakdown={lead.breakdown} score={lead.score as number} />
          )}
        </>
      )}
    </Surface>
  );
}
