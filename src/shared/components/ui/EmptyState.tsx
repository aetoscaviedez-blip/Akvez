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
      <Surface variant="dashed" radius="container" className="px-7 py-6">
        {title && (
          <p className="mb-2 font-display text-lg font-bold text-app-text">
            {title}
          </p>
        )}
        {/* **F4.5 · R-02.** Estos bloques corrían a 125-135 caracteres por línea
            —las líneas más largas de toda la aplicación— y a 14 px.

            **Son el corazón del argumento de integridad de AKVEZ:** explican
            *por qué* falta un dato en lugar de dejar un hueco, y son justo lo
            que un jurado lee si pregunta «¿y aquí por qué no hay nada?».
            Merecen el mismo cuerpo que cualquier otro párrafo del producto. */}
        <p className="max-w-measure font-sans text-sm text-app-muted">
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
        <p className="font-display text-xl font-semibold text-app-text">
          {title}
        </p>
      )}
      {/*
        **H-11.1 · la acción va antes que la explicación.**

        El orden era título → explicación → acción: el usuario tenía que leer
        un párrafo entero para descubrir que abajo había un botón. En la
        pantalla de entrada del producto eso significaba explicar durante tres
        líneas algo que se resolvía en un clic.

        Invertido, el bloque se lee **qué es · qué hago · por qué**. La
        explicación no se pierde —queda debajo, para quien la quiera— pero deja
        de bloquear el camino a la acción.

        Se corrige en la primitiva y no en cada llamada: los tres estados
        vacíos con acción del producto (Lead Hunter, Biblioteca y Pitch
        Generator) sufrían el mismo orden invertido.
      */}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
      {/* Sin acción el párrafo sigue al título de cerca; con acción necesita
          separarse de ella para no leerse como su pie. */}
      <p
        className={
          action
            ? "mx-auto mt-6 max-w-measure font-sans text-sm text-app-muted"
            : "mx-auto mt-3 max-w-measure font-sans text-sm text-app-muted"
        }
      >
        {children}
      </p>
    </Surface>
  );
}
