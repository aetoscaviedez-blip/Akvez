import React from "react";
import { ScoreBreakdownEntry } from "../types";

/**
 * Desglose del Opportunity Score — **la explicación que APS-08 §9 exige**.
 *
 * ── POR QUÉ VIVE AQUÍ ────────────────────────────────────────────────────────
 *
 * **Estaba declarado dentro de `LeadLibrary.tsx`**, donde funcionaba bien y solo
 * la Biblioteca podía usarlo. Al llegar la misma explicación a la ruta de
 * búsqueda, había dos salidas: copiarlo o extraerlo. **Copiarlo habría creado
 * dos desgloses que divergirían en la primera modificación.**
 *
 * **Se extrae sin cambiar una línea de su comportamiento.** Lo único que cambia
 * es el tipo del parámetro, que pasa a ser el compartido — estructuralmente
 * idéntico al que usaba.
 *
 * ── QUÉ MUESTRA, Y POR QUÉ CADA COSA ─────────────────────────────────────────
 *
 * **`partialScore === null` se declara «sin medir»**, no como cero: es la
 * distinción que **R-38** protege y que hace honesto al Score.
 *
 * **`unmeasuredFactors` se publica deliberadamente.** APS-08 §11 obliga a
 * indicar que «la confianza del análisis puede ser limitada», y **decir *qué* no
 * se pudo medir es la forma honesta de hacerlo**. Ocultarlo daría al Score una
 * precisión que no tiene.
 *
 * **La suma de contribuciones se muestra junto al Score** porque lo reconstruye:
 * es la **Reproducibilidad de ADR-14 §6.3** hecha visible.
 *
 * **Presenta y no decide (R-48).** No calcula el Score, no lo reordena y no lo
 * interpreta: lo pinta.
 */
export default function ScoreBreakdown({
  breakdown,
  score
}: {
  breakdown: ScoreBreakdownEntry[];
  score: number;
}) {
  const totalContribution = breakdown.reduce((sum, entry) => sum + entry.contribution, 0);

  return (
    <div className="mt-3 pt-3 border-t border-app-border space-y-2">
      <p className="text-eyebrow text-app-muted uppercase tracking-widest font-display">
        Cómo se compone el Score
      </p>

      <div className="space-y-2">
        {breakdown.map((entry) => (
          <div key={entry.category} className="text-xs">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-app-text font-semibold">{entry.category}</span>
              <span className="text-app-muted font-mono shrink-0">
                {entry.partialScore === null ? "sin medir" : `${entry.partialScore}/100`}
                <span className="opacity-60"> × {entry.weight}%</span>
                {" = "}
                <span className="text-brand font-semibold">{entry.contribution.toFixed(2)}</span>
              </span>
            </div>

            {/* Barra proporcional a la contribución. Referencia: 25, el peso
                máximo de WP-01, para que las barras sean comparables entre sí. */}
            <div className="mt-1 h-1 rounded-full bg-surface-raised overflow-hidden">
              <div
                className="h-full bg-brand/60 rounded-full"
                style={{ width: `${Math.min(100, (entry.contribution / 25) * 100)}%` }}
              />
            </div>

            <p className="text-eyebrow text-app-muted mt-1 leading-relaxed">{entry.rationale}</p>

            {entry.unmeasuredFactors.length > 0 && (
              <p className="text-eyebrow text-app-muted mt-0.5 italic">
                No medible con datos públicos: {entry.unmeasuredFactors.join(", ")}.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* La suma reconstruye el Score: es la Reproducibilidad de ADR-14 §6.3
          hecha visible. Se redondea igual que el Score publicado. */}
      <div className="flex items-baseline justify-between gap-3 pt-2 border-t border-app-border text-xs">
        <span className="text-app-text font-bold font-display uppercase tracking-wide">Opportunity Score</span>
        <span className="font-mono text-app-muted">
          {totalContribution.toFixed(2)} ≈ <span className="text-brand font-black">{score}</span>
        </span>
      </div>
    </div>
  );
}
