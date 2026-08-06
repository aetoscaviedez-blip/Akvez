import React from "react";
import { Prospect } from "../../../../shared/types";
import { Eyebrow, StatGrid, StatTile } from "../../../../shared/components/ui";
import { Radar, Globe, Flame } from "lucide-react";

interface ResultsHeaderProps {
  visibleCount: number;
  totalLeads: number;
  references: Array<{ title: string; url: string }>;
  /** Los negocios mostrados. Se cuentan aquí; no se estima nada. */
  leads: Prospect[];
  /** Ciudad de la búsqueda en curso. */
  city: string;
  /** `true` cuando esta lista procede de una ejecución de esta sesión. */
  hasSearched: boolean;
}

/**
 * **El aterrizaje de una búsqueda — H-10.1 · P4.**
 *
 * ── QUÉ PROBLEMA DE PRODUCTO RESUELVE ────────────────────────────────────────
 *
 * Es el instante en que AKVEZ cumple su promesa: sale, busca y vuelve con
 * negocios reales. **Y aterrizaba como una lista bajo un rótulo pequeño en
 * versalitas.** Era el único momento del recorrido capaz de provocar sorpresa,
 * y pasaba desapercibido.
 *
 * ── LAS TRES CIFRAS SON RECUENTOS, NO ESTIMACIONES ───────────────────────────
 *
 * | En pantalla | Cómo se obtiene |
 * | --- | --- |
 * | Encontrados | `leads.length` |
 * | Sin sitio web | `leads.filter(l => !l.website).length` |
 * | Con Opportunity Score | `typeof l.score === "number"` |
 *
 * **Ninguna se proyecta, se pondera ni se compara con nada.** Son las mismas
 * tarjetas de abajo, contadas: el usuario puede comprobarlas contando.
 *
 * **«Sin sitio web» es la que más importa.** Es el hecho comercialmente
 * decisivo del producto —un negocio sin web es literalmente el cliente de quien
 * vende webs— y hasta ahora vivía como un distintivo pequeño dentro de cada
 * tarjeta.
 *
 * ── CUANDO NO HAY BÚSQUEDA EN CURSO ──────────────────────────────────────────
 *
 * La lista puede ser el espacio de trabajo acumulado y no el resultado de una
 * ejecución. **Entonces no se anuncia ningún hallazgo:** se rinde el rótulo
 * sobrio de siempre, porque no ha ocurrido nada que celebrar.
 */
export default function ResultsHeader({
  visibleCount,
  totalLeads,
  references,
  leads,
  city,
  hasSearched
}: ResultsHeaderProps) {
  const withoutSite = leads.filter((l) => !l.website).length;
  const scored = leads.filter((l) => typeof l.score === "number").length;

  const sources = references.length > 0 && (
    <div className="flex shrink-0 items-center gap-1 font-sans text-xs text-brand">
      <span className="font-bold">Fuentes de búsqueda:</span>
      <div className="flex gap-1.5">
        {references.slice(0, 3).map((ref, idx) => (
          <a
            key={idx}
            href={ref.url}
            target="_blank"
            rel="noreferrer"
            className="max-w-[80px] truncate opacity-80 hover:underline hover:opacity-100"
            title={ref.title}
          >
            [{idx + 1}]
          </a>
        ))}
      </div>
    </div>
  );

  // Sin ejecución en curso esto es el espacio de trabajo, no un hallazgo.
  if (!hasSearched) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow as="h4">
          Tu espacio de trabajo ({Math.min(visibleCount, totalLeads)} de {totalLeads})
        </Eyebrow>
        {sources}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Eyebrow as="h4" icon={<Radar className="h-3.5 w-3.5 text-brand" />}>
            Búsqueda completada
          </Eyebrow>
          <h3 className="font-display text-2xl font-semibold text-app-text">
            {totalLeads} {totalLeads === 1 ? "negocio encontrado" : "negocios encontrados"}
            {city && <span className="text-app-muted"> en {city}</span>}
          </h3>
        </div>
        {sources}
      </div>

      <StatGrid columns={3}>
        <StatTile
          level="raised"
          size="lg"
          tone="brand"
          emphasis
          icon={<Radar className="h-3.5 w-3.5" />}
          label="Encontrados"
          value={totalLeads}
          caption="Negocios reales de Google Places"
        />
        <StatTile
          level="raised"
          size="lg"
          tone="danger"
          icon={<Globe className="h-3.5 w-3.5" />}
          label="Sin sitio web"
          value={withoutSite}
          caption="No tienen presencia propia: es el encargo más directo"
        />
        <StatTile
          level="raised"
          size="lg"
          tone="intel"
          icon={<Flame className="h-3.5 w-3.5" />}
          label="Con Opportunity Score"
          value={scored}
          caption="Con desglose por categorías"
        />
      </StatGrid>
    </div>
  );
}
