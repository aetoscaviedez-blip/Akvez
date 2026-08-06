import React from "react";
import { Surface, Meter } from "../../../../shared/components/ui";

/**
 * Un tramo del embudo de oportunidad.
 *
 * ── NO HAY NINGUNA CONVERSIÓN INVENTADA ──────────────────────────────────────
 *
 * **Se muestran recuentos absolutos y, como mucho, «N de M»** — una razón entre
 * dos cifras reales que el propio usuario puede comprobar sumando tarjetas.
 *
 * **No hay tasas de conversión, ni proyecciones, ni comparativas con ningún
 * histórico**: AKVEZ no guarda histórico, y fabricar un porcentaje sobre datos
 * que no existen sería justo lo que este sprint prohíbe.
 *
 * **La barra es proporcional al tramo anterior**, de modo que representa
 * exactamente el «N de M» que ya está escrito al lado.
 */
export default function FunnelStage({
  label,
  caption,
  value,
  previous,
  index,
  isLast = false
}: {
  label: string;
  caption: string;
  value: number;
  /** Tramo anterior. Ausente en el primero, que es la base del embudo. */
  previous?: number;
  index: number;
  isLast?: boolean;
}) {
  // Proporción respecto del tramo anterior. Sin anterior, el tramo es la base.
  const ratio = previous === undefined ? 1 : previous === 0 ? 0 : value / previous;

  return (
    <div
      className="motion-safe:animate-ak-rise"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Surface padding="lg" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h4 className="font-display text-base font-bold text-app-text">{label}</h4>
          <p className="font-sans text-[11px] leading-snug text-app-muted">{caption}</p>
        </div>

        <div className="flex shrink-0 items-baseline gap-3">
          <span className="font-display text-4xl font-black leading-none tabular-nums text-app-text">
            {value}
          </span>
          {previous !== undefined && (
            <span className="font-mono text-[11px] text-app-muted">
              de {previous}
            </span>
          )}
        </div>
      </Surface>

      {/* Barra proporcional al tramo anterior. */}
      <div className="mt-2">
        <Meter
          value={Math.min(100, Math.round(ratio * 100))}
          size="xs"
          delay={index * 70 + 120}
        />
      </div>

      {!isLast && (
        <div aria-hidden="true" className="mx-auto my-3 h-5 w-px bg-app-border" />
      )}
    </div>
  );
}
