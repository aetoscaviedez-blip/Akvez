import React from "react";
import { ScoreBreakdownEntry } from "../../../../shared/types";
import { Surface, Meter, Badge, EmptyState } from "../../../../shared/components/ui";
import { Check, Minus } from "lucide-react";

type Variant = "measured" | "unmeasured";

/**
 * Inventario de factores de APS-08 §6, agrupado por categoría.
 *
 * **Un solo componente para las dos caras del mismo hecho**: lo que se pudo
 * medir y lo que no. Se parametriza en lugar de duplicarse porque ambas listas
 * tienen idéntica estructura y deben verse igual — si divergieran, una de las
 * dos parecería más importante que la otra, y no lo es.
 *
 * ── POR QUÉ «QUÉ FALTA MEDIR» TIENE EL MISMO PESO VISUAL ─────────────────────
 *
 * **APS-08 §11 obliga a indicar que la confianza del análisis puede ser
 * limitada**, y decir *qué* no se pudo medir es la forma honesta de hacerlo.
 * Esconder los factores ausentes en una nota al pie daría al Score una precisión
 * que no tiene.
 *
 * **Ninguna de las dos listas se genera aquí**: son los arrays `measuredFactors`
 * y `unmeasuredFactors` que el dominio adjunta a cada categoría.
 */
export default function FactorInventory({
  breakdown,
  variant
}: {
  breakdown: ScoreBreakdownEntry[];
  variant: Variant;
}) {
  const groups = breakdown
    .map((entry) => ({
      category: entry.category,
      weight: entry.weight,
      factors: variant === "measured" ? entry.measuredFactors : entry.unmeasuredFactors
    }))
    .filter((group) => group.factors.length > 0);

  const total = groups.reduce((n, group) => n + group.factors.length, 0);

  if (total === 0) {
    return (
      <EmptyState>
        {variant === "measured"
          ? "Ningún factor pudo medirse con los datos públicos disponibles."
          : "Todos los factores del modelo pudieron medirse para este negocio."}
      </EmptyState>
    );
  }

  const isMeasured = variant === "measured";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group, index) => (
        <Surface
          key={group.category}
          variant={isMeasured ? "solid" : "dashed"}
          padding="md"
          className="motion-safe:animate-ak-rise"
          style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
        >
          <header className="mb-3.5 flex items-baseline justify-between gap-3 border-b border-app-border/60 pb-2.5">
            <h5 className="font-display text-xs font-bold uppercase tracking-wider text-app-text">
              {group.category}
            </h5>
            <Badge size="xs">{group.weight}%</Badge>
          </header>

          <ul className="space-y-2">
            {group.factors.map((factor) => (
              <li key={factor} className="flex items-start gap-2.5">
                {/* **Verde: un factor medido es una validación, no una marca.** */}
                {isMeasured ? (
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                ) : (
                  <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-app-muted/50" />
                )}
                <span
                  className={`font-sans text-xs leading-relaxed first-letter:uppercase ${
                    isMeasured ? "text-app-text/90" : "text-app-muted"
                  }`}
                >
                  {factor}
                </span>
              </li>
            ))}
          </ul>
        </Surface>
      ))}
    </div>
  );
}
