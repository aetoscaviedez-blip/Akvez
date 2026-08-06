/**
 * **El mapa de tonos — el único sitio donde el color semántico se traduce a
 * clases.**
 *
 * ── POR QUÉ EXISTE ───────────────────────────────────────────────────────────
 *
 * La Fase 1 declaró el vocabulario (`brand`, `intel`, `success`, `warn`,
 * `danger`). **Pero un vocabulario que cada componente traduce por su cuenta no
 * es un sistema: es una convención que se erosiona.** Antes de esta tabla había
 * seis formas distintas de escribir «panel con tinte de marca» —`/5` y `/20`
 * aquí, `/10` y `/30` allá— y ninguna era la correcta porque no había ninguna
 * canónica.
 *
 * **Aquí se decide una vez.** Cambiar la intensidad de un tinte en toda la
 * aplicación es cambiar un número en este archivo.
 *
 * ── POR QUÉ LAS CLASES SON LITERALES ─────────────────────────────────────────
 *
 * Tailwind extrae las clases leyendo el código fuente como texto. **Una clase
 * compuesta en tiempo de ejecución —`` `bg-${tone}/5` `` — no se genera nunca**,
 * y falla en silencio: no rompe el build, simplemente no pinta. Por eso cada
 * combinación se escribe entera.
 */

/** Significado, no color. **`neutral` no es un tono apagado: es la ausencia de afirmación.** */
export type Tone = "neutral" | "brand" | "intel" | "success" | "warn" | "danger";

export interface ToneClasses {
  /** Texto en el color del tono. Para títulos y cifras que *son* el tono. */
  text: string;
  /** Icono. Coincide con `text`, salvo en `neutral`, donde se atenúa. */
  icon: string;
  /** Borde de un contenedor tintado. */
  border: string;
  /** Fondo tintado, muy bajo: el tono se insinúa, no se grita. */
  tint: string;
  /** Relleno sólido y su texto. Reservado a la acción primaria y a las píldoras. */
  solid: string;
  /** Relleno de una barra de progreso o medidor. */
  fill: string;
}

export const TONE: Record<Tone, ToneClasses> = {
  neutral: {
    text: "text-app-text",
    icon: "text-app-muted",
    border: "border-app-border",
    tint: "bg-surface-raised",
    solid: "bg-surface-raised text-app-text",
    fill: "bg-app-muted/50"
  },
  brand: {
    text: "text-brand",
    icon: "text-brand",
    border: "border-brand/30",
    tint: "bg-brand/5",
    // Texto oscuro sobre naranja: 7,9:1. El blanco daba 2,9:1 y fallaba AA.
    solid: "bg-brand text-dark-bg",
    fill: "bg-brand"
  },
  intel: {
    text: "text-intel",
    icon: "text-intel",
    border: "border-intel/30",
    tint: "bg-intel/10",
    solid: "bg-intel text-app-text",
    fill: "bg-intel"
  },
  success: {
    text: "text-success",
    icon: "text-success",
    border: "border-success/30",
    tint: "bg-success/10",
    solid: "bg-success text-dark-bg",
    fill: "bg-success"
  },
  warn: {
    text: "text-warn",
    icon: "text-warn",
    border: "border-warn/30",
    tint: "bg-warn/10",
    solid: "bg-warn text-dark-bg",
    fill: "bg-warn"
  },
  danger: {
    text: "text-danger",
    icon: "text-danger",
    border: "border-danger/30",
    tint: "bg-danger/10",
    solid: "bg-danger text-app-text",
    fill: "bg-danger"
  }
};

/**
 * Escala de radios de APS-04, corregida por la referencia oficial.
 *
 * **La regla: cuanto más contenedor, más radio.** Los controles se quedan en
 * 10 px; el círculo se reserva a píldoras, barras e iconos.
 */
export const RADIUS = {
  container: "rounded-container",
  card: "rounded-card",
  inset: "rounded-inset",
  control: "rounded-control",
  full: "rounded-full"
} as const;

export type Radius = keyof typeof RADIUS;

/** Escala de espaciado interno. Cuatro pasos, no doce. */
export const PADDING = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
  xl: "p-8"
} as const;

export type Padding = keyof typeof PADDING;
