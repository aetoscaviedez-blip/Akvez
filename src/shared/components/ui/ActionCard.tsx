import React from "react";
import { ArrowRight } from "lucide-react";
import { TONE, Tone } from "./tone";
import IconFrame from "./IconFrame";

/**
 * **`ActionCard` — la acción que se explica a sí misma.**
 *
 * ── DE DÓNDE SALE ────────────────────────────────────────────────────────────
 *
 * **Es el componente que la referencia usa en «¿QUÉ PUEDES HACER AHORA?»**:
 * icono en marco, dos líneas de texto —qué hace y con qué—, flecha a la
 * derecha, y **una sola de las tres en naranja sólido**. Es la anatomía que
 * hace que un jurado sepa qué mirar sin leer nada.
 *
 * ── QUÉ SUSTITUYE ────────────────────────────────────────────────────────────
 *
 * El CTA en banner del Executive Dashboard, la banda «Ver cómo lo analizó
 * AKVEZ» de la Opportunity View, el «Ver cómo se calculó este Score» de
 * `LeadCard`, y las tres `ActionLink` del Pitch Generator — cinco anatomías
 * para «acción con contexto».
 *
 * ── EL ESTADO NO DISPONIBLE SE MUESTRA, NO SE OCULTA ─────────────────────────
 *
 * `available={false}` rinde la tarjeta **atenuada y punteada, no la elimina**.
 * Ocultar una vía de contacto que no se tiene dejaría al usuario sin saber que
 * existe; declararla ausente es la misma regla que gobierna el resto del
 * producto.
 */
export default function ActionCard({
  title,
  detail,
  icon,
  onClick,
  href,
  tone = "neutral",
  variant = "outline",
  available = true,
  external = false
}: {
  title: string;
  detail?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  tone?: Tone;
  /** `solid` es la acción primaria: **una por pantalla**. */
  variant?: "outline" | "solid";
  available?: boolean;
  external?: boolean;
}) {
  const solid = variant === "solid" && available;

  const skin = !available
    ? "border-dashed border-app-border/60 bg-dark-surface/30"
    : solid
      ? `border-transparent ${TONE[tone].solid} hover:brightness-110`
      : `border-app-border bg-dark-surface hover:border-brand/40`;

  const body = (
    <>
      {icon && (
        <span className="shrink-0">
          {solid ? (
            // Sobre relleno sólido el marco sobra: el icono ya tiene contraste.
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-dark-bg/15">
              {icon}
            </span>
          ) : (
            <IconFrame
              shape="circle"
              tone={available ? tone : "neutral"}
            >
              {icon}
            </IconFrame>
          )}
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span
          className={`block font-display text-sm font-bold ${
            available ? (solid ? "" : "text-app-text") : "text-app-muted/60"
          }`}
        >
          {title}
        </span>
        {detail && (
          <span
            className={`mt-0.5 block truncate font-sans text-[11px] ${
              solid ? "opacity-70" : "text-app-muted"
            }`}
          >
            {detail}
          </span>
        )}
      </span>

      {available && (
        <ArrowRight
          className={`h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 ${
            solid ? "" : "text-app-muted"
          }`}
        />
      )}
    </>
  );

  const classes = `group flex items-center gap-4 rounded-card border p-5 text-left transition-all duration-300 ${skin} ${
    available ? "cursor-pointer" : ""
  }`;

  if (!available) {
    return <div className={classes}>{body}</div>;
  }

  if (href) {
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className={classes}
      >
        {body}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`w-full ${classes}`}>
      {body}
    </button>
  );
}
