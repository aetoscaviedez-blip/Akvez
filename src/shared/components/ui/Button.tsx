import React from "react";
import { TONE, Tone } from "./tone";

/**
 * **`Button` — la acción de AKVEZ.**
 *
 * ── QUÉ SUSTITUYE ────────────────────────────────────────────────────────────
 *
 * Catorce botones con alturas de `py-2.5` a `py-7`, cuatro radios distintos,
 * dos familias tipográficas, tres tratamientos de hover y un solo `active:scale`
 * en toda la aplicación.
 *
 * ── LA REGLA DE LA REFERENCIA ────────────────────────────────────────────────
 *
 * **Una única acción primaria por pantalla.** Cuando todo es naranja, nada
 * destaca: el `primary` existe para que haya exactamente un destino evidente, y
 * cada uso adicional en la misma pantalla le resta fuerza al primero.
 *
 * **Los elementos de una misma fila comparten altura exacta.** Es lo que se
 * percibe como «acabado», y un solo elemento de altura distinta lo rompe.
 */
export default function Button({
  children,
  onClick,
  href,
  variant = "secondary",
  tone = "brand",
  size = "md",
  icon,
  iconRight,
  disabled = false,
  external = false,
  type = "button",
  fullWidth = false,
  className = ""
}: {
  children: React.ReactNode;
  onClick?: () => void;
  /** Con `href` se rinde un enlace; sin él, un botón. Mismo aspecto. */
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  type?: "button" | "submit";
  fullWidth?: boolean;
  className?: string;
}) {
  const height =
    size === "sm" ? "px-4 py-2.5 text-[11px]" : size === "lg" ? "px-7 py-4 text-xs" : "px-6 py-3.5 text-[11px]";

  const skin =
    variant === "primary"
      ? `${TONE[tone].solid} hover:brightness-110`
      : variant === "ghost"
        ? `border border-transparent ${TONE[tone].text} hover:border-app-border`
        : `border border-app-border bg-surface-raised text-app-text hover:border-brand/40`;

  const classes = `inline-flex items-center justify-center gap-2.5 rounded-control font-display font-bold uppercase tracking-wider transition-all duration-300 ${height} ${skin} ${
    fullWidth ? "w-full" : ""
  } ${
    disabled
      ? "cursor-not-allowed opacity-50"
      : "cursor-pointer active:scale-[0.98]"
  } ${className}`
    .replace(/\s+/g, " ")
    .trim();

  if (href && !disabled) {
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className={classes}
      >
        {icon}
        {children}
        {iconRight}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
