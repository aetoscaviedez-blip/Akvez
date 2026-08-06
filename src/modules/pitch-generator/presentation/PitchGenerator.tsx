import React from "react";
import { Prospect, DesignerProfile, PitchSource } from "../../../shared/types";
import {
  SectionHeader, EmptyState, Surface, Callout, Button, ActionCard, Badge
} from "../../../shared/components/ui";
import PitchOutput, { CHANNEL_LABELS } from "./components/PitchOutput";
import DesignerSignaturePanel from "./components/DesignerSignaturePanel";
import {
  Send, Sparkles, Mail, Linkedin, Instagram, AlertTriangle, MessageSquareText,
  Globe, MapPin, Phone, Target, DollarSign, Zap, Flame, ArrowRight
} from "lucide-react";

/**
 * Resuelve el origen declarado del pitch de un Lead.
 *
 * **Devuelve `undefined` cuando el origen no consta**, y eso es información: un
 * pitch generado antes de que se registrara el origen **no puede atribuirse a la
 * IA**. Suponerlo sería una afirmación falsa.
 */
function resolvePitchSource(lead: Prospect): PitchSource | undefined {
  if (!lead.generatedPitch) return "UNAVAILABLE";
  if (lead.pitchSource) return lead.pitchSource;
  // Compatibilidad con Leads guardados antes de `pitchSource`: el respaldo se
  // marcaba escribiendo una cadena en `pitchMessage`.
  if (lead.pitchMessage?.includes("respaldo")) return "FALLBACK_TEMPLATE";
  return undefined;
}

const CHANNELS = [
  { id: "email", label: "Email frío", icon: Mail },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "instagram", label: "Instagram", icon: Instagram }
] as const;

interface PitchGeneratorProps {
  leads: Prospect[];
  designerProfile: DesignerProfile;
  setDesignerProfile: (profile: DesignerProfile) => void;
  selectedLeadId: string;
  onSelectLeadId: (id: string) => void;
  onUpdateLead: (id: string, updatedFields: Partial<Prospect>) => void;
  onNavigateToHunter: () => void;
}

/**
 * **Pitch Generator** — de un negocio a un mensaje, contado como secuencia.
 *
 * ── LA NARRATIVA ─────────────────────────────────────────────────────────────
 *
 * `Lead → Problema encontrado → Oportunidad detectada → Pitch generado →
 * Acción recomendada`.
 *
 * La disposición anterior era un panel de control a la izquierda y una caja de
 * salida a la derecha: **mostraba la herramienta, no el razonamiento**. Los
 * problemas detectados —`flaws`, el hallazgo más concreto del análisis— **no
 * aparecían en ninguna parte de esta pantalla**.
 *
 * ── QUÉ DATOS USA ────────────────────────────────────────────────────────────
 *
 * **Solo los que ya están en el `Prospect`.** Ni una llamada nueva, ni un campo
 * nuevo, ni un cálculo. Lo único que cambia respecto de la versión anterior es
 * **qué se enseña de lo que ya había**.
 *
 * ── LA REGLA ─────────────────────────────────────────────────────────────────
 *
 * **Toda ausencia se declara.** Ningún bloque desaparece en silencio y ninguno
 * se rellena con texto genérico: si el análisis no produjo un dato, la pantalla
 * dice que no lo produjo (**R-38**).
 */
export default function PitchGenerator({
  leads,
  designerProfile,
  setDesignerProfile,
  selectedLeadId,
  onSelectLeadId,
  onUpdateLead,
  onNavigateToHunter
}: PitchGeneratorProps) {
  const [channel, setChannel] = React.useState<"email" | "linkedin" | "instagram">("email");
  const [customInstructions, setCustomInstructions] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [pitchError, setPitchError] = React.useState<string | null>(null);
  const [editProfile, setEditProfile] = React.useState(false);

  const activeLead = leads.find((p) => p.id === selectedLeadId);

  /**
   * **El siguiente negocio sin mensaje.** No se recomienda ni se puntúa: es el
   * inmediato de la lista que todavía no tiene texto redactado. `undefined`
   * cuando ya se ha escrito a todos.
   */
  const nextLead = leads.find((p) => p.id !== selectedLeadId && !p.generatedPitch);

  /** Origen declarado del pitch mostrado. `undefined` = no consta. */
  const pitchSource = activeLead ? resolvePitchSource(activeLead) : undefined;

  const handleGeneratePitch = async () => {
    if (!activeLead) return;

    setLoading(true);
    setPitchError(null);
    try {
      const response = await fetch("/api/prospect/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designer: designerProfile,
          lead: activeLead,
          channel: channel === "email" ? "Email" : channel === "linkedin" ? "LinkedIn Connection Note" : "Instagram Direct Message (DM)",
          customInstructions: customInstructions
        })
      });

      const data = await response.json();
      if (data.success && data.pitch) {
        // **El origen se registra, no se deduce.** `metadata.isFallback` viaja
        // desde `generateOutreachPitch` hasta aquí por el contrato público
        // (`outreachPitch.ts`), y se guarda como estado explícito.
        onUpdateLead(activeLead.id, {
          subjectLine: data.pitch.subjectLine || "",
          generatedPitch: data.pitch.message || "",
          pitchChannel: channel,
          pitchAngle: activeLead.angle,
          pitchSource: data.metadata?.isFallback ? "FALLBACK_TEMPLATE" : "AI_GENERATED",
          status: "Pitched"
        });
      } else {
        setPitchError(data.error?.message || "No se pudo generar el mensaje. Verifica las credenciales configuradas.");
      }
    } catch (err: any) {
      console.error(err);
      setPitchError("No se pudo contactar con el servicio de redacción: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Sin Leads ───────────────────────────────────────────────────────────────
  if (leads.length === 0) {
    return (
      <div className="space-y-8">
        <SectionHeader
        level="screen"
        icon={<Send className="h-3.5 w-3.5" />}
        eyebrow="Generador de mensajes"
        title="De un negocio analizado a un mensaje de contacto"
        lead="Paso a paso: qué se le detectó, qué oportunidad hay y qué decirle."
      />
        <div className="mx-auto max-w-2xl">
          <EmptyState
            variant="panel"
            icon={<Send className="h-6 w-6" />}
            title="Todavía no hay negocios"
            action={
              <Button variant="primary" onClick={onNavigateToHunter}>
                Buscar oportunidades
              </Button>
            }
          >
            El mensaje se redacta a partir del análisis de un negocio concreto.
            Busca oportunidades primero y vuelve aquí.
          </EmptyState>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="pitch-generator-container">
      <SectionHeader
        level="screen"
        icon={<Send className="h-3.5 w-3.5" />}
        eyebrow="Generador de mensajes"
        title="De un negocio analizado a un mensaje de contacto"
        lead="Paso a paso: qué se le detectó, qué oportunidad hay y qué decirle."
      />

      {/* ── Barra de contexto ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="lead-selector"
            className="block font-sans text-eyebrow font-bold uppercase tracking-widest text-app-muted"
          >
            Negocio
          </label>
          <select
            id="lead-selector"
            value={selectedLeadId}
            onChange={(e) => onSelectLeadId(e.target.value)}
            className="w-full rounded-control border border-app-border bg-surface-raised px-4 py-3.5 font-sans text-sm text-app-text transition-colors focus:border-brand focus:outline-none"
          >
            {/*
              El selector mezcla Leads reales y de ejemplo en una sola lista.
              **El prefijo distingue unos de otros** antes de que el usuario elija.
            */}
            {leads.map((p) => (
              <option key={p.id} value={p.id}>
                {p.isDemo ? "⚠️ EJEMPLO · " : ""}{p.name}
                {p.website ? ` (${p.website})` : " — sin sitio web"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <div className="w-full">
            <DesignerSignaturePanel
              designerProfile={designerProfile}
              setDesignerProfile={setDesignerProfile}
              open={editProfile}
              onToggle={() => setEditProfile((v) => !v)}
            />
          </div>
        </div>
      </div>

      {activeLead && (
        <>
          {/*
            **Un pitch sobre un Lead de ejemplo se redacta con datos inventados.**
            El texto resultante puede ser perfectamente convincente y no describe
            ningún negocio real.
          */}
          {activeLead.isDemo && (
            <Callout tone="warn" icon={<AlertTriangle className="h-4 w-4" />} size="sm">
              <strong className="text-warn">Negocio de ejemplo.</strong> No
              procede de una búsqueda real: sus datos son ficticios.{" "}
              <strong>Cualquier mensaje generado a partir de él describirá un
              negocio que no existe.</strong>
            </Callout>
          )}

          <div className="pt-4">

            {/* ── 01 · LEAD ─────────────────────────────────────────────────── */}
            <SectionHeader
              step={1}
              eyebrow="El negocio"
              title={activeLead.name}
              lead="A quién vas a escribir, y qué sabe AKVEZ de él."
            >
              <Surface padding="lg" className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  {activeLead.source && (
                    <Badge>{activeLead.source}</Badge>
                  )}
                  {activeLead.classification && (
                    <Badge>Sitio web · {activeLead.classification}</Badge>
                  )}
                  {/* **`typeof === "number"`, nunca `!!score`**: `0` es una
                      puntuación real y `null` una ausencia legítima (R-45). */}
                  {/* **F2.5 · V-04.** Era el último chip del producto escrito a
                      mano: tintado de naranja junto a distintivos neutros, en la
                      misma fila. Ahora comparte anatomía con todos los demás. */}
                  {typeof activeLead.score === "number" && (
                    <Badge tone="brand" icon={<Flame className="h-3 w-3" />}>
                      Score {activeLead.score}
                      {activeLead.band ? ` · ${activeLead.band}` : ""}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 font-sans text-xs">
                  {activeLead.website ? (
                    <a
                      href={activeLead.website.startsWith("http") ? activeLead.website : `https://${activeLead.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-brand transition-colors hover:text-brand/75"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {activeLead.website}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-app-muted">
                      <Globe className="h-3.5 w-3.5" />
                      Sin sitio web registrado
                    </span>
                  )}
                  {activeLead.phone && (
                    <span className="inline-flex items-center gap-1.5 text-app-muted">
                      <Phone className="h-3.5 w-3.5" />
                      {activeLead.phone}
                    </span>
                  )}
                  {activeLead.googleMapsUrl && (
                    <a
                      href={activeLead.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-app-muted transition-colors hover:text-app-text"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      Ver en Google Maps
                    </a>
                  )}
                </div>

                {/* **La descripción se condiciona.** Antes se rendía siempre
                    entre comillas: sin `description`, la pantalla mostraba unas
                    comillas vacías. */}
                {activeLead.description ? (
                  <p className="max-w-measure border-t border-app-border/60 pt-5 font-sans text-sm text-app-muted">
                    {activeLead.description}
                  </p>
                ) : (
                  <p className="max-w-measure border-t border-app-border/60 pt-5 font-sans text-sm italic text-app-muted">
                    El análisis no produjo una descripción de este negocio.
                  </p>
                )}
              </Surface>
            </SectionHeader>

            {/* ── 02 · PROBLEMA ENCONTRADO ──────────────────────────────────── */}
            <SectionHeader
              step={2}
              eyebrow="El diagnóstico"
              title="Problema encontrado"
              lead="Lo que el análisis detectó y que da motivo al mensaje."
            >
              <div className="space-y-5">
                {/* **`flaws` no se mostraba en esta pantalla.** Es el hallazgo
                    más concreto del análisis y el que sostiene el mensaje. */}
                {activeLead.flaws.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {activeLead.flaws.map((flaw, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 rounded-container border border-app-border bg-dark-surface p-6 font-sans text-sm text-app-muted motion-safe:animate-ak-rise"
                        style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
                      >
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
                        {flaw}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState>
                    El análisis no detectó problemas web para este negocio. Es un
                    resultado, no un fallo: el mensaje tendrá que apoyarse en otro
                    argumento.
                  </EmptyState>
                )}

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {activeLead.revenueLoss ? (
                    <Callout
                      icon={<DollarSign className="h-4 w-4 text-warn" />}
                      title="Cuánto les cuesta hoy"
                      tone="warn"
                    >
                      {activeLead.revenueLoss}
                    </Callout>
                  ) : (
                    <EmptyState>
                      El análisis no estimó impacto comercial para este negocio.
                    </EmptyState>
                  )}

                  {/* `whyWebsiteNeeded` existía en el dato y no se mostraba
                      nunca en esta pantalla. */}
                  {activeLead.whyWebsiteNeeded ? (
                    <Callout
                      icon={<Target className="h-4 w-4 text-brand" />}
                      title="Por qué necesita un sitio web"
                      tone="brand"
                    >
                      <span className="italic">"{activeLead.whyWebsiteNeeded}"</span>
                    </Callout>
                  ) : (
                    <EmptyState>
                      El análisis no explicó por qué este negocio necesita un sitio
                      web.
                    </EmptyState>
                  )}
                </div>
              </div>
            </SectionHeader>

            {/* ── 03 · OPORTUNIDAD DETECTADA ────────────────────────────────── */}
            <SectionHeader
              step={3}
              eyebrow="El ángulo"
              title="Oportunidad detectada"
              lead="La propuesta concreta que el análisis derivó del diagnóstico."
            >
              {activeLead.angle ? (
                <Callout
                  icon={<Zap className="h-4 w-4 text-brand" />}
                  title="Lo que le venderías"
                  tone="brand"
                >
                  {activeLead.angle}
                </Callout>
              ) : (
                <EmptyState>
                  No se generó un ángulo de oportunidad para este negocio. El
                  mensaje se redactará sin él.
                </EmptyState>
              )}
            </SectionHeader>

            {/* ── 04 · PITCH GENERADO ───────────────────────────────────────── */}
            <SectionHeader
              step={4}
              eyebrow="La redacción"
              title="Pitch generado"
              lead="Elige el canal y genera el mensaje. El texto se redacta a partir de todo lo anterior."
            >
              <div className="space-y-6">

                {/* Canal */}
                <div className="space-y-2.5">
                  <span className="block font-sans text-eyebrow font-bold uppercase tracking-widest text-app-muted">
                    Canal de contacto
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {CHANNELS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setChannel(id)}
                        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-control border py-4 font-display text-xs font-bold transition-all duration-300 ${
                          channel === id
                            ? "border-brand bg-brand/5 text-brand"
                            : "border-app-border bg-dark-surface text-app-muted hover:border-app-border/40 hover:text-app-text"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instrucciones */}
                <div className="space-y-2.5">
                  <label
                    htmlFor="custom-instructions"
                    className="block font-sans text-eyebrow font-bold uppercase tracking-widest text-app-muted"
                  >
                    Instrucciones adicionales · opcional
                  </label>
                  <textarea
                    id="custom-instructions"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    rows={2}
                    placeholder="Ej.: menciona que eres de su misma ciudad."
                    className="w-full rounded-control border border-app-border bg-surface-raised p-4 font-sans text-xs leading-relaxed text-app-text placeholder:text-app-muted transition-colors focus:border-brand focus:outline-none"
                  />
                </div>

                {/* **La única acción primaria de esta pantalla.** */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleGeneratePitch}
                  disabled={loading}
                  icon={
                    loading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-dark-bg border-t-transparent" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )
                  }
                >
                  {loading
                    ? "Redactando…"
                    : activeLead.generatedPitch
                      ? "Volver a generar"
                      : "Generar mensaje"}
                </Button>

                {/* Estados de la redacción */}
                {pitchError && (
                  <Callout
                    tone="danger"
                    icon={<AlertTriangle className="h-5 w-5" />}
                    title="No se generó el mensaje"
                  >
                    {pitchError}
                  </Callout>
                )}

                {loading && (
                  <Callout
                    tone="intel"
                    icon={<Sparkles className="h-5 w-5 animate-spin" />}
                    title="Redactando"
                  >
                    {/* **Sin adjetivos sobre el resultado.** El texto anterior
                        prometía «una apertura irresistible libre de rechazo»,
                        que es una afirmación que nadie puede sostener. */}
                    Redactando el mensaje para {activeLead.name}.
                  </Callout>
                )}

                {!loading && !activeLead.generatedPitch && !pitchError && (
                  <EmptyState
                    variant="panel"
                    icon={<MessageSquareText className="h-6 w-6" />}
                    title="Todavía no hay mensaje para este negocio"
                  >
                    Se redactará con el diagnóstico y el ángulo de arriba, y con
                    tu firma.
                  </EmptyState>
                )}

                {!loading && activeLead.generatedPitch && (
                  <PitchOutput
                    lead={activeLead}
                    pitchSource={pitchSource}
                    onCopy={copyToClipboard}
                    copied={copied}
                  />
                )}
              </div>
            </SectionHeader>

            {/* ── 05 · ACCIÓN RECOMENDADA ───────────────────────────────────── */}
            <SectionHeader
              step={5}
              eyebrow="El siguiente paso"
              title="Acción recomendada"
              lead="Por dónde contactar, con los datos que el descubrimiento aportó."
              isLast
            >
              {activeLead.generatedPitch ? (
                <div className="space-y-6">
                  <NextActions lead={activeLead} />

                  {/*
                    **H-10.1 · P5 — el recorrido dejaba de pedir nada aquí.**

                    Se generaba el mensaje, se copiaba, y la pantalla se
                    apagaba. **La prospección es un bucle y el producto la
                    presentaba como una línea recta**: sin un «siguiente», nada
                    comunica que esto se repite — que es justamente donde está
                    el valor.

                    El siguiente negocio **no se elige ni se recomienda**: es el
                    inmediato de la lista que todavía no tiene mensaje. Si no
                    queda ninguno, el bloque no se rinde.
                  */}
                  {nextLead && (
                    <ActionCard
                      variant="solid"
                      tone="brand"
                      icon={<ArrowRight className="h-5 w-5" />}
                      title="Siguiente oportunidad"
                      detail={`${nextLead.name} — todavía no le has escrito.`}
                      onClick={() => onSelectLeadId(nextLead.id)}
                    />
                  )}
                </div>
              ) : (
                <EmptyState>
                  Genera el mensaje para ver las vías de contacto disponibles.
                </EmptyState>
              )}
            </SectionHeader>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Vías de contacto reales del negocio.
 *
 * **No se recomienda ninguna hora, ninguna frecuencia ni ningún guion de
 * seguimiento:** el sistema no mide nada de eso. Se enumeran las vías que el
 * descubrimiento aportó, y **se declara cuáles no se tienen**.
 */
function NextActions({ lead }: { lead: Prospect }) {
  const channelLabel = lead.pitchChannel ? CHANNEL_LABELS[lead.pitchChannel] : undefined;
  // Google Places no aporta perfiles sociales: para LinkedIn e Instagram no hay
  // destinatario en los datos, y eso es lo que se dice.
  const socialChannel = lead.pitchChannel === "linkedin" || lead.pitchChannel === "instagram";

  return (
    <div className="space-y-5">
      <Surface padding="lg">
        <span className="block font-sans text-eyebrow font-bold uppercase tracking-widest text-app-muted">
          Canal del mensaje redactado
        </span>
        <p className="mt-2 font-display text-lg font-bold text-app-text">
          {channelLabel ?? "No registrado"}
        </p>
        {socialChannel && (
          <p className="mt-3 font-sans text-xs leading-relaxed text-app-muted">
            AKVEZ <strong>no dispone del perfil social</strong> de este negocio:
            el descubrimiento se hace sobre Google Places, que no lo aporta.
            Tendrás que localizarlo tú antes de enviar.
          </p>
        )}
      </Surface>

      {/* **Las vías que no existen se muestran igualmente, desactivadas.**
          Ocultarlas dejaría al usuario sin saber que existen. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ActionCard
          available={!!lead.phone}
          href={lead.phone ? `tel:${lead.phone}` : undefined}
          icon={<Phone className="h-4 w-4" />}
          title="Llamar"
          detail={lead.phone ?? "Sin teléfono registrado"}
        />
        <ActionCard
          available={!!lead.googleMapsUrl}
          href={lead.googleMapsUrl}
          icon={<MapPin className="h-4 w-4" />}
          title="Ficha de Maps"
          detail={lead.googleMapsUrl ? "Ver ubicación y reseñas" : "Sin ficha registrada"}
          external
        />
        <ActionCard
          available={!!lead.website}
          href={
            lead.website
              ? lead.website.startsWith("http") ? lead.website : `https://${lead.website}`
              : undefined
          }
          icon={<Globe className="h-4 w-4" />}
          title="Sitio web"
          detail={lead.website ?? "Sin sitio web — es el argumento"}
          external
        />
      </div>
    </div>
  );
}
