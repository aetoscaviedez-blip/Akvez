import React from "react";
import { TONE, Tone } from "./tone";

/**
 * **`Meter` — una barra proporcional a un dato que ya está escrito al lado.**
 *
 * Cinco componentes la repetían: `OpportunityHero`, `ScoreCategoryCard`,
 * `ExecutiveSummary`, `FunnelStage` y `ScoreBreakdown`.
 *
 * ── LA REGLA QUE NO SE NEGOCIA ───────────────────────────────────────────────
 *
 * **La barra nunca introduce una magnitud nueva.** Representa el mismo número
 * que el usuario puede leer en cifra a su lado, sobre una escala que el dominio
 * define. Una barra sin su cifra sería una afirmación que nadie puede comprobar.
 *
 * ── POR QUÉ SE ANIMA LA ESCALA Y NO EL ANCHO ─────────────────────────────────
 *
 * **El ancho ES el dato.** `ak-bar` anima `scaleX` desde el borde izquierdo, de
 * modo que el ancho final se fija en el marcado y la animación solo lo recorre.
 * Animar el ancho haría que, a mitad de la transición, la barra estuviera
 * mostrando un valor falso.
 *
 * `value === undefined` **no pinta relleno**: rinde la pista rayada de «sin
 * medir». Una barra vacía comunicaría «puntuó 0», que es una afirmación distinta
 * (**R-38**).
 */
export default function Meter({
  value,
  tone = "brand",
  size = "sm",
  delay = 0
}: {
  /** Porcentaje 0-100. `undefined` = no se pudo medir. */
  value?: number;
  tone?: Tone;
  size?: "xs" | "sm" | "md";
  /** Retardo de entrada, para que una rejilla se componga en cascada. */
  delay?: number;
}) {
  const height = size === "xs" ? "h-1" : size === "md" ? "h-2" : "h-1.5";

  return (
    <div className={`w-full overflow-hidden rounded-full bg-app-border ${height}`}>
      {value === undefined ? (
        // Sin dato no hay relleno: la pista rayada es la representación honesta
        // de un factor que no pudo medirse.
        <div className="h-full w-full rounded-full bg-[repeating-linear-gradient(115deg,transparent,transparent_5px,rgba(156,163,175,0.16)_5px,rgba(156,163,175,0.16)_10px)]" />
      ) : (
        <div
          className={`h-full origin-left rounded-full motion-safe:animate-ak-bar ${TONE[tone].fill}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, animationDelay: `${delay}ms` }}
        />
      )}
    </div>
  );
}
