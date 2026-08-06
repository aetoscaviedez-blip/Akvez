import React from "react";
import { TONE, Tone } from "./tone";

/**
 * **`IconFrame` — el marco de un icono que encabeza un bloque.**
 *
 * Siete lugares lo repetían con siete tamaños y tres formas distintas:
 * `NarrativeStep` (44 px cuadrado), `Stage` (44 px), `HeroStat` (40 px),
 * `SummaryTile` (36 px), `ActionLink` (36 px), el estado vacío del Pitch
 * (64 px circular) y `ExecutiveSummary` (36 px).
 *
 * ── LAS DOS FORMAS DE LA REFERENCIA ──────────────────────────────────────────
 *
 * **Circular con tinte** cuando el icono encabeza un bloque de razonamiento
 * —es el tratamiento que la referencia da a las cuatro tarjetas de «¿por qué es
 * una excelente oportunidad?»—, y **cuadrado sobre superficie elevada** cuando
 * solo acompaña a un dato.
 *
 * **El icono nunca compite con el texto:** va delante y en el color del
 * contexto, nunca al revés.
 */
export default function IconFrame({
  children,
  tone = "neutral",
  size = "md",
  shape = "square"
}: {
  children: React.ReactNode;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  shape?: "square" | "circle";
}) {
  const dimension =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11";

  const tinted = tone !== "neutral";

  return (
    <span
      className={`flex shrink-0 items-center justify-center border ${dimension} ${
        shape === "circle" ? "rounded-full" : "rounded-inset"
      } ${
        tinted
          ? `${TONE[tone].border} ${TONE[tone].tint} ${TONE[tone].text}`
          : "border-app-border bg-surface-raised text-app-muted"
      }`}
    >
      {children}
    </span>
  );
}
