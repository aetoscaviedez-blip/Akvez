import React from "react";
import { Prospect, PitchSource } from "../../../../shared/types";
import { Sparkles, AlertTriangle, Copy, Check, Mail } from "lucide-react";
import { Surface, Callout, Button } from "../../../../shared/components/ui";

/** Nombre publicable de cada canal. Único lugar donde se traducen. */
const CHANNEL_LABELS: Record<string, string> = {
  email: "Email frío",
  linkedin: "Nota de LinkedIn",
  instagram: "Mensaje directo de Instagram"
};

/**
 * El texto generado, con su origen declarado.
 *
 * ── EL CANAL QUE SE MUESTRA ES EL QUE PRODUJO EL TEXTO ───────────────────────
 *
 * **Se lee de `lead.pitchChannel`, no del selector.** El encabezado anterior
 * usaba el canal *actualmente seleccionado*: bastaba generar un email y cambiar
 * el selector a LinkedIn para que la pantalla rotulase «LinkedIn» sobre un texto
 * de correo — y para que el botón «Copiar» cambiase de formato en consecuencia.
 *
 * **`pitchChannel` se guardaba desde el principio y nadie lo leía.**
 *
 * ── LOS TRES ESTADOS DE ORIGEN ───────────────────────────────────────────────
 *
 * `AI_GENERATED` · `FALLBACK_TEMPLATE` · **origen no registrado**. El tercero no
 * es un defecto: un pitch guardado antes de que existiera `pitchSource` **no
 * puede atribuirse a la IA**, y decirlo es más honesto que suponerlo.
 */
export default function PitchOutput({
  lead,
  pitchSource,
  onCopy,
  copied
}: {
  lead: Prospect;
  pitchSource: PitchSource | undefined;
  onCopy: (text: string) => void;
  copied: boolean;
}) {
  // El canal con el que se redactó. Ausente en pitches antiguos: se declara.
  const producedChannel = lead.pitchChannel;
  const channelLabel = producedChannel ? CHANNEL_LABELS[producedChannel] : undefined;

  // El asunto solo pertenece al correo. Se decide por el canal **que produjo el
  // texto**, no por el que esté seleccionado ahora.
  const showsSubject = producedChannel === "email" && !!lead.subjectLine;

  const clipboardText = showsSubject
    ? `Asunto: ${lead.subjectLine}\n\n${lead.generatedPitch}`
    : lead.generatedPitch || "";

  return (
    <Surface className="overflow-hidden motion-safe:animate-ak-rise">

      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-app-border px-6 py-4">
        <div className="min-w-0 space-y-1">
          <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted">
            Mensaje generado
          </span>
          <span className="block font-display text-sm font-bold text-app-text">
            {/* **Sin canal registrado no se afirma ninguno.** */}
            {channelLabel ?? "Canal no registrado"}
          </span>
        </div>

        <Button
          size="sm"
          onClick={() => onCopy(clipboardText)}
          icon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        >
          {copied ? "Copiado" : "Copiar mensaje"}
        </Button>
      </div>

      <div className="space-y-5 p-6">
        {/* ── Origen del texto ─────────────────────────────────────────────── */}
        {pitchSource === "AI_GENERATED" && (
          <Callout tone="intel" icon={<Sparkles className="h-4 w-4" />} size="sm">
            <strong className="text-intel">Redactado con IA.</strong> Este texto
            lo generó el modelo a partir de los datos de este negocio.
          </Callout>
        )}

        {pitchSource === "FALLBACK_TEMPLATE" && (
          <Callout
            tone="warn"
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Plantilla de respaldo — sin IA"
          >
            <p className="leading-relaxed">
              El modelo generativo no respondió. <strong>Este texto procede de
              una plantilla</strong>, no de una redacción personalizada.
            </p>
            <p className="mt-1.5 leading-relaxed text-app-muted">
              Revísalo antes de enviarlo: <strong>no se ha adaptado al análisis
              de este negocio</strong>.
            </p>
          </Callout>
        )}

        {pitchSource === undefined && (
          <Callout icon={<AlertTriangle className="h-4 w-4" />} size="sm">
            <strong>Origen no registrado.</strong> Este texto se generó antes de
            que se registrara su procedencia. <strong>No consta si lo produjo la
            IA o una plantilla.</strong>
          </Callout>
        )}

        {/* ── Asunto ───────────────────────────────────────────────────────── */}
        {showsSubject && (
          <Surface level="raised" radius="inset" padding="sm" className="space-y-1.5">
            <span className="flex items-center gap-1.5 font-sans text-[10px] font-bold uppercase tracking-widest text-app-muted">
              <Mail className="h-3 w-3" />
              Asunto sugerido
            </span>
            <p className="font-display text-sm font-bold leading-snug text-app-text">
              {lead.subjectLine}
            </p>
          </Surface>
        )}

        {/* ── Cuerpo ───────────────────────────────────────────────────────── */}
        <Surface level="raised" radius="inset" padding="lg" className="max-h-[460px] overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-[1.75] text-app-text">
          {lead.generatedPitch}
        </Surface>
      </div>
    </Surface>
  );
}

export { CHANNEL_LABELS };
