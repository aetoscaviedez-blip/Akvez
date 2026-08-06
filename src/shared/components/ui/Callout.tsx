import React from "react";
import Surface from "./Surface";
import { TONE, Tone } from "./tone";

/**
 * **`Callout` — un bloque que afirma algo sobre lo que contiene.**
 *
 * ── QUÉ SUSTITUYE ────────────────────────────────────────────────────────────
 *
 * Diecisiete bloques con la misma anatomía —icono, título, cuerpo, fondo
 * tintado— y once tratamientos distintos:
 *
 * | Era | Dónde |
 * | --- | --- |
 * | `InsightPanel` | **Duplicado carácter por carácter** en Opportunity View y Pitch Generator |
 * | Banner de motor de respaldo · banner «Analizado con IA» | Lead Hunter |
 * | Tres bloques de origen del texto | `PitchOutput` |
 * | «Por qué necesita un sitio web» · estado del análisis | AI Showcase |
 * | `SearchErrorBanner` · error de redacción | Hunter, Pitch Generator |
 * | Avisos de dato de ejemplo | Dashboard, Pitch Generator, `LeadCard` |
 *
 * ── POR QUÉ ESTE COMPONENTE ES EL MÁS DELICADO DEL SISTEMA ───────────────────
 *
 * **Casi todos sus usos son declaraciones de integridad**, no decoración: qué
 * motor produjo un análisis, si un dato es de ejemplo, si un texto salió de una
 * plantilla en vez del modelo. Son las afirmaciones que sostienen la
 * credibilidad del producto.
 *
 * **Por eso el tono nunca es un adorno.** `warn` significa «esto tiene una
 * reserva que debes leer»; `danger`, «esto ha fallado»; `success`, «esto está
 * verificado». Elegirlo por estética invertiría el significado del bloque.
 */
export default function Callout({
  children,
  title,
  icon,
  tone = "neutral",
  size = "md"
}: {
  children: React.ReactNode;
  /** Se rinde como versalita, no como titular: encabeza, no compite. */
  title?: string;
  icon?: React.ReactNode;
  tone?: Tone;
  /** `sm` es una sola línea de declaración; `md`, un bloque con cuerpo. */
  size?: "sm" | "md";
}) {
  return (
    <Surface
      tone={tone}
      padding={size === "sm" ? "sm" : "lg"}
      radius="container"
      className={`flex gap-3.5 ${size === "sm" ? "items-center" : "items-start"}`}
    >
      {icon && (
        <span
          className={`shrink-0 ${size === "sm" ? "" : "mt-0.5"} ${
            tone === "neutral" ? "text-app-muted" : TONE[tone].icon
          }`}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0 space-y-1.5">
        {title && (
          <h4
            className={`font-sans text-[10px] font-bold uppercase tracking-widest ${
              tone === "neutral" ? "text-app-text/70" : TONE[tone].text
            }`}
          >
            {title}
          </h4>
        )}
        <div className="font-sans text-xs leading-relaxed text-app-text">
          {children}
        </div>
      </div>
    </Surface>
  );
}
