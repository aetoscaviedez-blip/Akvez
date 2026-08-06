import React from "react";
import { TONE, Tone } from "./tone";

/**
 * **`Badge` — el chip de dato de AKVEZ.**
 *
 * Trece lugares lo repetían con cinco anatomías distintas: los cinco chips de
 * `LeadCard` (cada uno con su propio esquema de color), los tres de
 * `OpportunityHero`, el `Chip` propio del Pitch Generator y el distintivo «PRO»
 * de la cabecera.
 *
 * ── LA REGLA DE LA REFERENCIA ────────────────────────────────────────────────
 *
 * **El icono lleva el color semántico; el texto, no.** Es lo que permite poner
 * cinco chips en una fila sin que la fila se convierta en un semáforo. Un chip
 * `solid` —el tono relleno— existe solo para la píldora de banda, y por eso es
 * `rounded-full`: la referencia reserva el círculo a estados conseguidos.
 */
export default function Badge({
  children,
  tone = "neutral",
  icon,
  variant = "outline",
  size = "sm"
}: {
  children: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
  /** `pill` es la píldora de banda: relleno, redonda, para un valor conseguido. */
  variant?: "outline" | "pill";
  size?: "xs" | "sm";
}) {
  const tinted = tone !== "neutral";

  if (variant === "pill") {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wider ${
          tinted
            ? `${TONE[tone].border} ${TONE[tone].tint} ${TONE[tone].text}`
            : "border-app-border bg-surface-raised text-app-muted"
        }`}
      >
        {icon}
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-control border border-app-border bg-surface-raised px-2.5 py-1 font-sans font-bold uppercase tracking-widest text-app-muted ${
        size === "xs" ? "text-[10px]" : "text-[11px]"
      }`}
    >
      {/* **Solo el icono lleva color.** El texto se mantiene neutro para que
          una fila de chips no compita con el dato que la fila acompaña. */}
      {icon && <span className={`shrink-0 ${TONE[tone].icon}`}>{icon}</span>}
      {children}
    </span>
  );
}
