import React from "react";
import { Prospect, ScoreBreakdownEntry } from "../../../../shared/types";
import { TrendingUp, TrendingDown, Gauge, ShieldCheck, Info } from "lucide-react";
import { Surface, Meter, IconFrame, EmptyState, SectionHeader } from "../../../../shared/components/ui";

/**
 * **Resumen ejecutivo del Opportunity Score.**
 *
 * ── NO HAY UNA SOLA PALABRA GENERADA ─────────────────────────────────────────
 *
 * **Ni IA, ni plantillas de prosa, ni adjetivos sobre el negocio.** El resumen
 * consiste en **seleccionar y ordenar** entradas del `breakdown` que ya se
 * muestran íntegras más abajo, y en enseñar sus cifras. Todo texto fijo de esta
 * pantalla describe **la métrica**, nunca al negocio concreto.
 *
 * ── LAS TRES AGREGACIONES, Y POR QUÉ NO SON MÉTRICAS NUEVAS ──────────────────
 *
 * | Se muestra | Cómo | Equivalencia |
 * | --- | --- | --- |
 * | Factores medidos / totales | Suma de las longitudes de `measuredFactors` y `unmeasuredFactors` | **Es `coverage` expresado en recuento** — el dominio lo define igual |
 * | Peso evaluado | Suma de `weight` de las categorías con `partialScore` | **Es `evaluatedWeight`**, con la misma definición de `opportunityScore.ts` |
 * | Orden de las señales | `sort` por `contribution` | Reordenar lo ya mostrado |
 *
 * **Ninguna produce un valor que el dominio no calcule ya con esa misma
 * definición**, de modo que no pueden divergir del Score publicado.
 *
 * ── ⚠️ LA DIRECCIÓN DEL SCORE, QUE DECIDE TODA LA REDACCIÓN ──────────────────
 *
 * `opportunityScore.ts` lo declara en su cabecera: un Score alto significa
 * **«oportunidad comercial para este usuario, no calidad del negocio»**, y
 * *«una web ausente **sube** el Score: es un hallazgo, no una carencia»*.
 *
 * **Por eso aquí no se habla de fortalezas y debilidades DEL NEGOCIO.** Llamar
 * «fortaleza» a una puntuación alta en Presencia Web invertiría el significado
 * del dato: esa puntuación es alta precisamente cuando el negocio **no** tiene
 * sitio propio. Lo que el resumen ordena son **señales de oportunidad**, que es
 * lo que el número mide.
 */
export default function ExecutiveSummary({ lead }: { lead: Prospect }) {
  const hasScore = typeof lead.score === "number";
  const breakdown = lead.breakdown ?? [];

  // Solo las categorías con puntuación entran en el orden. Una categoría sin
  // medir **no es una señal débil**: es una señal ausente, y su lugar está en
  // «Qué falta medir» (R-38).
  const measured = breakdown.filter((entry) => entry.partialScore !== null);
  const ranked = [...measured].sort((a, b) => b.contribution - a.contribution);

  const strongest = ranked.slice(0, 2);
  // Se toman por la cola y se invierten para leerlas de menor a mayor. Se
  // excluyen las que ya figuran como más fuertes: con pocas categorías medidas,
  // una misma señal no puede ser a la vez la que más y la que menos aporta.
  const weakest = ranked
    .slice(Math.max(strongest.length, ranked.length - 2))
    .reverse();

  const measuredFactorCount = breakdown.reduce((n, e) => n + e.measuredFactors.length, 0);
  const totalFactorCount = breakdown.reduce(
    (n, e) => n + e.measuredFactors.length + e.unmeasuredFactors.length, 0
  );
  const evaluatedWeight = measured.reduce((n, e) => n + e.weight, 0);

  // Sin Evaluación no hay nada que resumir. **Se dice, no se rellena.**
  if (!hasScore || breakdown.length === 0) {
    return (
      <EmptyState
        variant="panel"
        icon={<Info className="h-6 w-6" />}
        title="Sin resumen ejecutivo"
      >
        {hasScore
          ? "Este negocio tiene puntuación pero no trae el desglose por categorías, que es de donde sale el resumen."
          : "Este negocio no tiene Evaluación emitida. Un Lead sin puntuación es un estado válido: no significa que puntuara cero."}
      </EmptyState>
    );
  }

  return (
    <SectionHeader
      icon={<Info className="h-4 w-4" />}
      eyebrow="Lectura del Score"
      title="Resumen ejecutivo"
      lead={
        <>
          Un Score alto mide{" "}
          <strong className="font-semibold text-app-text/90">
            oportunidad comercial para ti
          </strong>
          , no calidad del negocio: una web ausente sube la puntuación porque es
          exactamente el trabajo que puedes vender.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* ── Señales que más aportan ────────────────────────────────────── */}
        <SummaryTile
          icon={<TrendingUp className="h-4 w-4 text-brand" />}
          title="Señales que más aportan"
          caption="Categorías que más puntos suman al Score"
        >
          {strongest.length > 0 ? (
            <SignalList entries={strongest} tone="strong" />
          ) : (
            <EmptyLine text="Ninguna categoría pudo puntuarse." />
          )}
        </SummaryTile>

        {/* ── Señales que menos aportan ──────────────────────────────────── */}
        <SummaryTile
          icon={<TrendingDown className="h-4 w-4 text-app-muted" />}
          title="Señales que menos aportan"
          caption="Categorías medidas cuya aportación es menor"
        >
          {weakest.length > 0 ? (
            <SignalList entries={weakest} tone="weak" />
          ) : (
            <EmptyLine text="No hay más categorías medidas que las anteriores." />
          )}
        </SummaryTile>

        {/* ── Cobertura ──────────────────────────────────────────────────── */}
        <SummaryTile
          icon={<Gauge className="h-4 w-4 text-brand" />}
          title="Cobertura"
          caption="Cuánto del modelo pudo medirse con datos públicos"
        >
          <div className="space-y-4">
            {lead.coverage !== undefined && (
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-black leading-none tabular-nums text-app-text">
                  {Math.round(lead.coverage * 100)}%
                </span>
                <span className="font-sans text-xs text-app-muted">de los factores</span>
              </div>
            )}
            <dl className="space-y-2 font-sans text-xs">
              <StatRow
                label="Factores medidos"
                value={`${measuredFactorCount} de ${totalFactorCount}`}
              />
              <StatRow
                label="Peso evaluado del perfil"
                value={`${evaluatedWeight} de 100 puntos`}
              />
              <StatRow
                label="Categorías con puntuación"
                value={`${measured.length} de ${breakdown.length}`}
              />
            </dl>
          </div>
        </SummaryTile>

        {/* ── Confianza ──────────────────────────────────────────────────── */}
        <SummaryTile
          icon={<ShieldCheck className="h-4 w-4 text-brand" />}
          title="Confianza"
          caption="Declarada por el análisis, no estimada aquí"
        >
          <div className="space-y-4">
            <span className="block font-display text-4xl font-black capitalize leading-none text-app-text">
              {lead.confidence ?? "—"}
            </span>
            <p className="font-sans text-xs leading-relaxed text-app-muted">
              {/* Texto sobre **la métrica**, idéntico para todo Lead: describe
                  qué es la confianza, no qué le pasa a este negocio. */}
              La confianza acompaña siempre al Score y baja cuando la información
              pública no alcanza a cubrir el modelo. Lo que no pudo medirse está
              enumerado más abajo, sin omitir nada.
            </p>
            {lead.scoreVersion && (
              <p className="font-mono text-eyebrow text-app-muted">
                Perfil de Ponderación {lead.scoreVersion}
              </p>
            )}
          </div>
        </SummaryTile>
      </div>
    </SectionHeader>
  );
}

/** Lista de señales con su aportación real. Presenta; no interpreta. */
function SignalList({
  entries,
  tone
}: {
  entries: ScoreBreakdownEntry[];
  tone: "strong" | "weak";
}) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.category} className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-display text-sm font-bold text-app-text">
              {entry.category}
            </span>
            <span
              className={`shrink-0 font-mono text-xs tabular-nums ${
                tone === "strong" ? "text-brand" : "text-app-muted"
              }`}
            >
              +{entry.contribution.toFixed(2)}
            </span>
          </div>
          <Meter
            value={entry.partialScore ?? undefined}
            tone={tone === "strong" ? "brand" : "neutral"}
            size="xs"
          />
          <p className="font-mono text-eyebrow text-app-muted">
            {entry.partialScore}/100 · peso {entry.weight}%
          </p>
        </li>
      ))}
    </ul>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-app-border/60 pb-2 last:border-0 last:pb-0">
      <dt className="text-app-muted">{label}</dt>
      <dd className="shrink-0 font-mono tabular-nums text-app-text">{value}</dd>
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <p className="font-sans text-xs italic text-app-muted">{text}</p>;
}

/** Contenedor de una casilla del resumen. Solo presentación. */
function SummaryTile({
  icon,
  title,
  caption,
  children
}: {
  icon: React.ReactNode;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <Surface
      padding="lg"
      className="flex flex-col gap-5 transition-colors duration-300 hover:border-brand/40 motion-safe:animate-ak-rise"
    >
      <header className="flex items-start gap-3">
        <IconFrame size="sm">{icon}</IconFrame>
        <div className="min-w-0">
          <h4 className="font-display text-sm font-bold text-app-text">{title}</h4>
          <p className="mt-1 font-sans text-xs text-app-muted">
            {caption}
          </p>
        </div>
      </header>
      {children}
    </Surface>
  );
}
