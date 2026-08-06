import React from "react";
import { CheckCircle2, HelpCircle, XCircle, Loader2 } from "lucide-react";
import { StatGrid, StatTile } from "../../../../shared/components/ui";
import type { Tone } from "../../../../shared/components/ui";

/** Certeza sobre un componente del sistema. **`unknown` no es un fallo.** */
export type StatusLevel = "ok" | "warn" | "down" | "unknown" | "checking";

/**
 * Estado del sistema — **solo lo verificable desde el navegador.**
 *
 * ── LA REGLA QUE GOBIERNA ESTE BLOQUE ────────────────────────────────────────
 *
 * **Nunca se asume.** Un panel de estado que pinta cuatro luces verdes por
 * defecto no informa de nada: informa de que nadie comprobó nada.
 *
 * **Aquí solo hay dos fuentes legítimas:**
 *
 * | Fuente | Qué acredita |
 * | --- | --- |
 * | `GET /api/health` | Que **el servidor responde**. Nada más — no dice nada de Places ni de Gemini |
 * | La última búsqueda de la sesión | Qué **ocurrió realmente** la última vez que se usaron las APIs |
 *
 * **Sin búsqueda en la sesión, Places y Gemini quedan en «Sin comprobar»**, que
 * es el estado honesto: no se ha ejercitado ninguna de las dos.
 *
 * **No se inventa telemetría.** Las métricas de ejecución del backend —consultas,
 * tiempos, modelo— **no cruzan el contrato público** y siguen bloqueadas
 * *(H-03B)*. Este bloque no las suple con estimaciones.
 */
export default function SystemStatus({ items }: { items: StatusItem[] }) {
  return (
    <StatGrid columns={4}>
      {items.map((item, index) => {
        const { icon, tone } = PRESENTATION[item.level];
        return (
          <StatTile
            key={item.label}
            icon={icon}
            tone={tone}
            label={item.label}
            // **El estado es el valor, y el detalle su definición.** Antes el
            // rótulo era el valor y el estado vivía solo en el color del icono:
            // quien no distinguiera los tonos no leía nada.
            value={LEVEL_LABEL[item.level]}
            caption={item.detail}
            size="sm"
            delay={index * 60}
          />
        );
      })}
    </StatGrid>
  );
}

export interface StatusItem {
  label: string;
  level: StatusLevel;
  /** Qué acredita exactamente este estado. Nunca decorativo. */
  detail: string;
}

/** Nombre publicable de cada nivel. **El color nunca es el único portador.** */
const LEVEL_LABEL: Record<StatusLevel, string> = {
  ok: "Comprobado",
  warn: "Con reservas",
  down: "No responde",
  unknown: "Sin comprobar",
  checking: "Comprobando…"
};

/**
 * Icono y tono por nivel.
 *
 * **`unknown` y `warn` no son rojos.** Un dato que no consta no es una avería, y
 * pintarlo como tal empujaría a leerlo como un fallo del sistema.
 *
 * **`ok` es verde, no naranja.** Una comprobación superada es una validación, y
 * el naranja está reservado a marca y acción.
 */
const PRESENTATION: Record<StatusLevel, { icon: React.ReactNode; tone: Tone }> = {
  ok: { icon: <CheckCircle2 className="h-4 w-4" />, tone: "success" },
  warn: { icon: <HelpCircle className="h-4 w-4" />, tone: "warn" },
  down: { icon: <XCircle className="h-4 w-4" />, tone: "danger" },
  unknown: { icon: <HelpCircle className="h-4 w-4" />, tone: "neutral" },
  checking: { icon: <Loader2 className="h-4 w-4 animate-spin" />, tone: "neutral" }
};
