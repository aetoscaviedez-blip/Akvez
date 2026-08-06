import React from "react";

/**
 * **`SectionHeader` — el único encabezado de AKVEZ.**
 *
 * ── QUÉ SUSTITUYE ────────────────────────────────────────────────────────────
 *
 * Nueve implementaciones de la misma idea:
 *
 * | Era | Dónde | Anatomía |
 * | --- | --- | --- |
 * | `Section` | Executive Dashboard | icono fijo + título + lead |
 * | `Section` | Opportunity View | icono + eyebrow + título + lead |
 * | `Stage` | AI Showcase | icono en marco + raíl + «Paso 01» + título |
 * | `NarrativeStep` | Pitch Generator | numeral en marco + raíl + eyebrow |
 * | `ScreenHeader` ×2 | Hunter, Pitch | **borde izquierdo naranja** + título |
 * | Headers inline ×3 | Dashboard, Showcase, ExecutiveSummary | eyebrow + título 5xl |
 *
 * **Dos de ellas compartían nombre y difieren en firma; otras dos hacían lo
 * mismo con nombre distinto.** El usuario percibía el cambio de anatomía al
 * cambiar de pestaña, y lo leía —correctamente— como cambio de aplicación.
 *
 * ── LOS DOS NIVELES ──────────────────────────────────────────────────────────
 *
 * **`screen`** abre una pantalla: una sola vez, y con la escala editorial que
 * la referencia reserva al protagonista. **`section`** abre un bloque dentro de
 * ella. No hay un tercero: el paso numerado es una `section` con `step`.
 *
 * **El borde izquierdo naranja de Hunter y Pitch se retira.** No aparecía en las
 * otras tres pantallas y era el indicio más visible de que el recorrido cambiaba
 * de manos a mitad de camino.
 */
export default function SectionHeader({
  level = "section",
  step,
  icon,
  eyebrow,
  title,
  lead,
  action,
  isLast = false,
  children,
  className = ""
}: {
  level?: "screen" | "section";
  /** Número de paso. Activa el marco numerado y el raíl vertical. */
  step?: number;
  /** Dentro del marco cuando hay `step`; junto al eyebrow en caso contrario. */
  icon?: React.ReactNode;
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Contenido alineado a la derecha del título. */
  action?: React.ReactNode;
  /** Último paso de una secuencia: no dibuja el raíl. */
  isLast?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  const isStep = typeof step === "number";

  const heading =
    level === "screen" ? (
      <h2 className="max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-app-text sm:text-5xl">
        {title}
      </h2>
    ) : (
      <h3 className="flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-app-text">
        {/* Sin eyebrow, el icono acompaña al título. Con eyebrow, sube a su
            fila: dos iconos en la misma columna competirían. */}
        {!eyebrow && icon}
        {title}
      </h3>
    );

  return (
    <section
      className={`relative ${isStep ? "pl-0 sm:pl-16" : ""} ${className}`.trim()}
    >
      {/* Marco numerado y raíl vertical. **Puramente estructural**: se ocultan
          en pantallas estrechas, donde la secuencia ya la marca el orden de
          lectura. */}
      {isStep && (
        <div className="absolute left-0 top-0 hidden h-full sm:block">
          <div className="flex h-11 w-11 items-center justify-center rounded-inset border border-app-border bg-dark-surface font-display text-sm font-black tabular-nums text-brand">
            {icon ?? String(step).padStart(2, "0")}
          </div>
          {!isLast && (
            <div
              aria-hidden="true"
              className="mx-auto mt-3 w-px bg-gradient-to-b from-app-border to-transparent"
              style={{ height: "calc(100% - 3.5rem)" }}
            />
          )}
        </div>
      )}

      {/* **Ritmo editorial.** El encabezado se separa de su contenido más de lo
          que sus propias piezas se separan entre sí: es lo que hace que el ojo
          lea «título → cuerpo» como un bloque y no como una lista comprimida. */}
      <div className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="space-y-3">
            {eyebrow && (
              <span className="flex items-center gap-2 font-sans text-eyebrow font-bold uppercase tracking-[0.2em] text-app-muted">
                {icon && !isStep && <span className="text-brand">{icon}</span>}
                {eyebrow}
              </span>
            )}
            {heading}
            {/* **La entradilla se acota a la medida de lectura**, no al ancho del
                contenedor. A 16 px, `max-w-3xl` daba ~96 caracteres por línea:
                el ojo pierde el renglón al volver al margen izquierdo. */}
            {lead && (
              <p className="max-w-measure font-sans text-sm text-app-muted">
                {lead}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}
