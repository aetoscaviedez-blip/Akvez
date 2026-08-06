import React from "react";
import Surface from "./Surface";
import IconFrame from "./IconFrame";

/**
 * **`EmptyState` — la ausencia declarada de AKVEZ.**
 *
 * ── QUÉ SUSTITUYE ────────────────────────────────────────────────────────────
 *
 * Ocho implementaciones y catorce usos: `EmptyState` (Dashboard), `EmptyPanel`
 * (Opportunity View), `Unavailable` (AI Showcase), `AbsentData` (Pitch
 * Generator), `EmptyLine` (Executive Summary), `EmptyState.tsx` (Lead Hunter),
 * más los estados propios de `FactorInventory` y `ExecutiveSummary`.
 *
 * **`AbsentData` y `Unavailable` eran idénticas carácter por carácter** en dos
 * módulos distintos.
 *
 * ── POR QUÉ ESTE COMPONENTE IMPORTA MÁS DE LO QUE PARECE ─────────────────────
 *
 * **Es lo que un jurado ve antes de la primera búsqueda.** Y en AKVEZ no es
 * decoración: seis sprints de disciplina han establecido que **toda ausencia se
 * declara** —nunca desaparece en silencio, nunca se rellena con texto genérico—
 * porque un hueco mudo deja al usuario sin saber si el sistema no encontró nada
 * o si algo falló (**R-38**).
 *
 * **El punteado es la gramática de esa regla:** marca «aquí no hay dato» de una
 * forma que no se confunde con «aquí está el dato».
 */
export default function EmptyState({
  title,
  children,
  icon,
  variant = "inline",
  action
}: {
  /** Sin título, el bloque es una sola línea de explicación. */
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** `panel` centra y da aire; `inline` ocupa lo mínimo dentro de un flujo. */
  variant?: "panel" | "inline";
  action?: React.ReactNode;
}) {
  if (variant === "inline") {
    return (
      <Surface variant="dashed" radius="container" className="px-6 py-6">
        {title && (
          <p className="mb-1.5 font-display text-sm font-bold text-app-text">
            {title}
          </p>
        )}
        <p className="font-sans text-xs leading-relaxed text-app-muted">
          {children}
        </p>
      </Surface>
    );
  }

  return (
    <Surface variant="dashed" radius="container" className="px-6 py-12 text-center">
      {icon && (
        <div className="mb-5 flex justify-center">
          <IconFrame size="lg" shape="circle">
            {icon}
          </IconFrame>
        </div>
      )}
      {title && (
        <p className="font-display text-lg font-bold tracking-tight text-app-text">
          {title}
        </p>
      )}
      <p className="mx-auto mt-2 max-w-md font-sans text-xs leading-relaxed text-app-muted">
        {children}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </Surface>
  );
}
