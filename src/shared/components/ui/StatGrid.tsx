import React from "react";
import { TONE, Tone } from "./tone";
import Meter from "./Meter";

/**
 * **`StatGrid` — la rejilla sin costuras.**
 *
 * El truco es `gap-px` sobre un fondo del color del borde: **las separaciones
 * son el fondo asomando entre celdas**, de modo que la rejilla entera se lee
 * como una sola pieza en lugar de como cuatro tarjetas sueltas. La referencia lo
 * usa en toda su franja de datos.
 */
export function StatGrid({
  children,
  columns = 4
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div
      className={`grid grid-cols-1 gap-px overflow-hidden rounded-container border border-app-border bg-app-border ${cols}`}
    >
      {children}
    </div>
  );
}

/**
 * **`StatTile` — una cifra con su definición.**
 *
 * ── QUÉ SUSTITUYE ────────────────────────────────────────────────────────────
 *
 * Veintiún usos y cuatro implementaciones: `MetricTile` (Dashboard), `Fact`
 * (AI Showcase), `StatusCell` (SystemStatus) y `HeroStat` (Opportunity Hero).
 * Las cuatro pintaban etiqueta + valor + apostilla con cuatro tipografías
 * distintas.
 *
 * ── LA DEFINICIÓN VIAJA CON LA CIFRA ─────────────────────────────────────────
 *
 * **`caption` no es decorativa.** Una cifra sin decir qué cuenta no se puede
 * comprobar, y todo el Executive Dashboard está construido sobre la premisa
 * contraria: cada recuento lleva escrita su definición debajo.
 *
 * ── AUSENCIA EXPLÍCITA ───────────────────────────────────────────────────────
 *
 * `value === undefined` rinde **«No disponible» atenuado**, nunca un hueco ni un
 * cero. `fallback` permite sustituir ese texto cuando la ausencia significa algo
 * por sí misma —«sin sitio web» es un hallazgo, no un vacío—.
 */
export function StatTile({
  label,
  value,
  caption,
  icon,
  tone = "neutral",
  size = "md",
  meter,
  fallback,
  hint,
  delay = 0
}: {
  label: string;
  value?: React.ReactNode;
  caption?: string;
  icon?: React.ReactNode;
  tone?: Tone;
  /** `lg` es la cifra protagonista de una rejilla. */
  size?: "sm" | "md" | "lg";
  /** Barra proporcional al mismo porcentaje que ya muestra `value`. */
  meter?: number;
  fallback?: string;
  hint?: string;
  delay?: number;
}) {
  const present = value !== undefined && value !== null && value !== "";

  const valueClass =
    size === "lg"
      ? "font-display text-5xl font-black leading-none tabular-nums"
      : size === "sm"
        ? "font-display text-sm font-bold"
        : "font-display text-base font-bold";

  return (
    <div
      className="bg-dark-surface px-6 py-6 motion-safe:animate-ak-rise"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-app-muted">
        {icon && <span className={TONE[tone].icon}>{icon}</span>}
        {label}
      </span>

      <div
        className={`mt-2.5 ${valueClass} ${
          present ? (tone === "neutral" ? "text-app-text" : TONE[tone].text) : "text-app-muted/50"
        }`}
      >
        {present ? value : fallback ?? "No disponible"}
      </div>

      {meter !== undefined && (
        <div className="mt-3">
          <Meter value={meter} tone={tone === "neutral" ? "brand" : tone} delay={delay + 200} />
        </div>
      )}

      {/* La definición viaja con la cifra: sin ella, el número no se puede
          comprobar. */}
      {caption && (
        <p className="mt-2.5 font-sans text-[11px] leading-snug text-app-muted">
          {caption}
        </p>
      )}

      {hint && (
        <p className="mt-2 truncate font-mono text-[10px] text-app-muted/70">{hint}</p>
      )}
    </div>
  );
}
