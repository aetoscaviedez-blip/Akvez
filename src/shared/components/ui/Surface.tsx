import React from "react";
import { TONE, RADIUS, PADDING, Tone, Radius, Padding } from "./tone";

/**
 * **`Surface` — el contenedor de AKVEZ. Todo bloque vive dentro de uno.**
 *
 * ── QUÉ SUSTITUYE ────────────────────────────────────────────────────────────
 *
 * Doce archivos repetían `rounded-2xl border border-app-border bg-dark-surface`;
 * catorce repetían la variante punteada; seis repetían un panel tintado —dos de
 * ellos, `InsightPanel`, **carácter por carácter en dos módulos distintos**—.
 * Todas eran la misma idea escrita de nuevo cada vez.
 *
 * ── LA JERARQUÍA LUMÍNICA, HECHA EXPLÍCITA ───────────────────────────────────
 *
 * `level` no es un adorno: es **la posición del bloque en la pila de
 * profundidad**, y la referencia obtiene toda su solidez de respetarla.
 *
 *     base    #0A0A0F   lienzo de la aplicación
 *       └── card    #121218   tarjeta sobre el lienzo
 *             └── raised  #1A1A24   contenedor dentro de una tarjeta
 *
 * **Cada nivel de anidamiento sube.** Un `raised` dentro de otro `raised` es un
 * error de composición, no un caso de uso.
 *
 * ── `tone` AFIRMA ALGO ───────────────────────────────────────────────────────
 *
 * Un tono distinto de `neutral` tiñe el fondo y el borde, y **eso comunica**.
 * `neutral` es la opción por defecto justamente porque la mayoría de los bloques
 * no afirman nada sobre su contenido.
 */
export default function Surface({
  children,
  tone = "neutral",
  level = "card",
  variant = "solid",
  radius = "container",
  padding = "none",
  as: Tag = "div",
  className = "",
  style
}: {
  children?: React.ReactNode;
  tone?: Tone;
  /** Posición en la pila de profundidad. */
  level?: "card" | "raised" | "flush";
  /** `dashed` marca una ausencia; `solid`, una presencia. */
  variant?: "solid" | "dashed";
  radius?: Radius;
  padding?: Padding;
  as?: "div" | "section" | "article" | "header" | "li" | "ul";
  className?: string;
  style?: React.CSSProperties;
}) {
  const tinted = tone !== "neutral";

  // El fondo lo decide el tono cuando hay tono; si no, el nivel de profundidad.
  const background = tinted
    ? TONE[tone].tint
    : level === "raised"
      ? "bg-surface-raised"
      : level === "flush"
        ? ""
        : "bg-dark-surface";

  // Un bloque punteado se atenúa: declara una ausencia, y no debe pesar como
  // una presencia. Es lo que distingue «no hay dato» de «el dato es este».
  const border =
    variant === "dashed"
      ? `border border-dashed ${tinted ? TONE[tone].border : "border-app-border"}`
      : `border ${tinted ? TONE[tone].border : "border-app-border"}`;

  const dimmed = variant === "dashed" && !tinted ? "bg-dark-surface/40" : "";

  // **La luz.** Un degradado vertical de blanco al 4,5 % que se agota en 140 px,
  // más un borde superior más claro que el resto. No se ve; se nota — y es lo
  // que convierte un rectángulo pintado en un objeto con una cara superior.
  //
  // **No se aplica a lo punteado ni a lo tintado:** un bloque que declara una
  // ausencia no debe parecer sólido, y un panel con tono ya tiene su propia
  // materia. Iluminar todo por igual anularía la distinción.
  const lit = variant === "solid" && !tinted && level !== "flush" ? "ak-lit" : "";

  return (
    <Tag
      className={`${RADIUS[radius]} ${border} ${dimmed || background} ${lit} ${PADDING[padding]} ${className}`.replace(/\s+/g, " ").trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
