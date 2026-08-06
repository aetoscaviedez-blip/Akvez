import React from "react";
import { Prospect } from "../../../../shared/types";
import { MapPin, Globe, AlertTriangle, Zap, Sparkles, DollarSign, Target, Phone, Flame, MessageSquare, ArrowRight } from "lucide-react";

interface LeadCardProps {
  lead: Prospect;
  isActive: boolean;
  onSelectLead: (id: string) => void;
  /** Abre la Opportunity View sobre este Lead. */
  onOpenOpportunity: (id: string) => void;
}

export default function LeadCard({ lead, isActive, onSelectLead, onOpenOpportunity }: LeadCardProps) {
  // **`typeof === "number"`, NO `!!score`**: un Score de **0 es una puntuación
  // real** y `null` es una ausencia legítima (**R-45**). Confundirlos hacía que
  // la tarjeta mostrase un número inventado donde no había evaluación.
  const hasScore = typeof lead.score === "number";

  return (
    <div
      className={`bg-dark-surface border rounded-2xl p-6 transition-all relative overflow-hidden flex flex-col gap-5 ${
        isActive
          ? "border-brand"
          : "border-app-border hover:border-brand/45"
      }`}
    >
      {/* Performance top indicators */}
      <div className="flex items-start justify-between flex-wrap gap-4 border-b border-app-border/40 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {/*
              **Un dato de ejemplo debe declararse como tal.** Sin este
              distintivo, un Lead de muestra —con score, clasificación y
              problemas— es indistinguible de un resultado de búsqueda real.
            */}
            {lead.isDemo && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-warn bg-warn/15 px-2.5 py-1 rounded-md border border-warn/40 inline-block">
                ⚠️ Dato de ejemplo — no es un resultado real
              </span>
            )}
            <span className="text-[10px] uppercase font-bold tracking-widest text-app-muted bg-surface-raised px-2.5 py-1 rounded-md border border-app-border inline-block">
              📌 {lead.dateCreated}
            </span>
            {lead.classification && (
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border inline-block ${
                // **Rojo se reserva a «Sin sitio web»** — el único uso que el
                // ADN le asigna. El resto de estados del sitio son grados de
                // deficiencia, y comparten el ámbar de advertencia.
                lead.classification === 'Sin sitio web'
                  ? 'text-danger bg-danger/10 border-danger/30'
                  : 'text-warn bg-warn/10 border-warn/30'
              }`}>
                🌐 {lead.classification}
              </span>
            )}
            {/*
              **Solo se rotula la fuente que el servidor declara.** Aquí había
              ramas para «Instagram», «Facebook» y «Directorio» — fuentes que el
              sistema **no consulta**: su adapter está huérfano y el Composition
              Root no lo construye. Anunciarlas sugería una cobertura inexistente.
            */}
            {lead.source && (
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border inline-block ${
                lead.source === "Google Maps"
                  ? "text-app-muted bg-app-muted/10 border-app-muted/30"
                  : "text-brand bg-brand/10 border-brand/30"
              }`}>
                {lead.source === "Google Maps" ? "🗺️ " : "🔍 "} {lead.source}
              </span>
            )}
          </div>
          {/* El nombre abre la Opportunity View. Es la vía de acceso disponible
              **siempre**, también cuando el Lead no trae Evaluación y por tanto
              no rinde el bloque de Opportunity Intelligence. */}
          <button
            type="button"
            onClick={() => onOpenOpportunity(lead.id)}
            className="text-left text-xl font-bold text-app-text font-display leading-tight cursor-pointer transition-colors hover:text-brand"
          >
            {lead.name}
          </button>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            {/*
              La ausencia de sitio web se lee del **dato**, no de una cadena de
              relleno. Antes se comprobaba `website.includes("sin sitio web")`
              contra un texto que el propio mapper fabricaba.
            */}
            {lead.website ? (
              <a
                href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand hover:underline inline-flex items-center gap-1 font-sans"
              >
                <Globe className="w-3.5 h-3.5" />
                {lead.website}
              </a>
            ) : (
              <span className="text-xs text-app-muted inline-flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-app-muted" />
                Sin sitio web registrado
              </span>
            )}

            {lead.googleMapsUrl && (
              <a
                href={lead.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-warn hover:underline inline-flex items-center gap-1 font-sans font-medium"
              >
                <MapPin className="w-3.5 h-3.5 text-warn" />
                Ver Ficha en Google Maps
              </a>
            )}

            {lead.phone && (
              <span className="text-xs text-app-muted inline-flex items-center gap-1 font-sans">
                <Phone className="w-3.5 h-3.5 text-brand" />
                {lead.phone}
              </span>
            )}
          </div>

          {/*
            **«Maps Verificado» solo se afirma si hay algo verificado.** Antes
            bastaba con que el campo estuviera definido —y el adapter lo define
            siempre, con `0`—, de modo que el distintivo aparecía vacío
            reclamando una verificación que no respaldaba ningún dato.
          */}
          {((lead.rating ?? 0) > 0 || (lead.reviewCount ?? 0) > 0) && (
            <div className="flex flex-wrap items-center gap-2.5 mt-2.5 bg-surface-raised/60 border border-app-border/40 py-1.5 px-3 rounded-lg w-max max-w-full">
              <span className="text-[9px] font-bold uppercase tracking-widest text-brand bg-brand/10 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                <Sparkles className="w-2.5 h-2.5" /> Maps Verificado
              </span>
              {lead.rating && lead.rating > 0 ? (
                <span className="text-xs text-app-text font-semibold flex items-center gap-1 shrink-0">
                  ⭐ {lead.rating.toFixed(1)} / 5.0
                </span>
              ) : null}
              {lead.reviewCount && lead.reviewCount > 0 ? (
                <span className="text-xs text-app-muted flex items-center gap-1 shrink-0">
                  • {lead.reviewCount} Reseñas
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Beautiful score meter with Flame icon (Fueguito) */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-brand uppercase font-display tracking-widest flex items-center justify-end gap-1">
              <Flame className="w-3.5 h-3.5 text-brand fill-brand/20 animate-pulse" />
              Lead Score
            </div>
            {/*
              **El estado del sitio web NO es la banda del Opportunity Score.**
              Aquí se mostraba `classification` —«Sin sitio web», «Sitio web
              deficiente»— bajo el rótulo «Lead Score», presentando una cosa como
              la otra. El propio backend advierte la distinción
              (`analyzeProspects.ts`: «`band` no sustituye a `classification`»).

              El estado del sitio web ya tiene su distintivo propio arriba, con
              icono de globo. **La banda comercial (`band`, APS-08 §8) no llega
              todavía por esta ruta**, de modo que aquí no se afirma ninguna.
            */}
            <div className="text-[10px] text-app-muted font-medium font-sans">
              {hasScore ? "Sobre 100" : "Sin evaluar"}
            </div>
          </div>

          <div className="w-14 h-14 rounded-xl bg-surface-raised border border-app-border flex flex-col items-center justify-center select-none shrink-0 relative group">
            <div className="absolute -top-1 -right-1 bg-brand/10 border border-brand/30 rounded-full p-1 animate-pulse">
              <Flame className="w-3 h-3 text-brand fill-brand" />
            </div>
            {/* **Ausencia explícita**: «—», nunca un número inventado. */}
            <span className={`text-lg font-black font-display ${hasScore ? "text-app-text" : "text-app-muted"}`}>
              {hasScore ? lead.score : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Opportunity Intelligence ───────────────────────────────────────────
          **Banda, confianza y cobertura del Score.** Los tres se calculaban en
          `domain/` y hasta ahora no cruzaban la frontera HTTP.

          **Solo se muestra lo que llegó.** Un Lead sin evaluar no rinde este
          bloque, en lugar de rendirlo con huecos. */}
      {hasScore && (lead.band || lead.confidence || lead.coverage !== undefined) && (
        <div className="bg-surface-raised border border-app-border rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {lead.band && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand bg-brand/10 border border-brand/30 px-2.5 py-1 rounded-md">
                🎯 {lead.band}
              </span>
            )}
            {lead.confidence && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-app-muted bg-dark-surface border border-app-border px-2.5 py-1 rounded-md">
                Confianza {lead.confidence}
              </span>
            )}
            {lead.coverage !== undefined && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-app-muted bg-dark-surface border border-app-border px-2.5 py-1 rounded-md">
                {Math.round(lead.coverage * 100)}% de factores medidos
              </span>
            )}
          </div>

          {/*
            **El desglose ya no se despliega aquí: se abre en la Opportunity
            View.** Antes esta tarjeta plegaba `ScoreBreakdown` en un espacio de
            360 px dentro de una lista, donde las seis categorías competían con
            el resto del contenido de la tarjeta.

            **No se pierde nada y no se duplica nada:** es la misma explicación,
            en la pantalla que puede mostrarla entera. `ScoreBreakdown` sigue
            existiendo, sin tocar, al servicio de la Biblioteca.
          */}
          {lead.breakdown && lead.breakdown.length > 0 && (
            <button
              type="button"
              onClick={() => onOpenOpportunity(lead.id)}
              className="group flex w-full items-center justify-between gap-3 rounded-lg border border-brand/25 bg-brand/5 px-3.5 py-2.5 text-left transition-colors hover:border-brand/50 cursor-pointer"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand">
                Ver cómo se calculó este Score
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-brand transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          )}

          {lead.scoreVersion && (
            <p className="text-[10px] text-app-muted/70 font-mono">
              Perfil de Ponderación {lead.scoreVersion}
            </p>
          )}
        </div>
      )}

      {/* Lead Description — se omite si el análisis no la produjo. */}
      {lead.description && (
        <p className="text-xs text-app-muted leading-relaxed font-sans">
          {lead.description}
        </p>
      )}

      {/* Why Specifically Needed Section (CRITICAL USER REQUEST) */}
      {lead.whyWebsiteNeeded && (
        <div className="bg-brand/5 border border-brand/20 p-4 rounded-xl flex items-start gap-3">
          <Target className="w-5 h-5 text-brand shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-brand uppercase tracking-wider font-display">
              ¿Por qué necesita este negocio un sitio web? (Análisis Individual)
            </h5>
            <p className="text-xs text-app-text leading-relaxed font-sans italic">
              "{lead.whyWebsiteNeeded}"
            </p>
          </div>
        </div>
      )}

      {/* Revenue loss block (CRITICAL REQUEST) */}
      {lead.revenueLoss && (
        <div className="bg-warn/5 border border-warn/20 p-4 rounded-xl flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-warn shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-warn uppercase tracking-wider font-display">
              Impacto Financiero por Fallos Web
            </h5>
            <p className="text-xs text-app-text leading-relaxed font-sans">
              {lead.revenueLoss}
            </p>
          </div>
        </div>
      )}

      {/* Detected Problems list */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-warn" />
          Problemas Web Críticos Detectados
        </span>
        {/* Lista vacía = **el análisis no detectó problemas**. Se declara. */}
        {lead.flaws.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lead.flaws.map((flaw, fIdx) => (
              <li key={fIdx} className="bg-surface-raised border border-app-border/75 p-3 rounded-xl text-xs text-app-muted leading-relaxed">
                {flaw}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-app-muted italic font-sans">
            El análisis no detectó problemas web para este negocio.
          </p>
        )}
      </div>

      {/* Angle of opportunity */}
      <div className="bg-surface-raised border border-app-border p-4 rounded-xl space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand flex items-center gap-1.5">
          <Zap className="w-4 h-4" />
          Ángulo de Oportunidad para Diseñador
        </span>
        {/* **Sin ángulo no se inventa uno**: se declara que no se generó. */}
        <p className={`text-xs leading-relaxed font-sans ${lead.angle ? "text-app-text" : "text-app-muted italic"}`}>
          {lead.angle ?? "No se generó un ángulo de oportunidad para este negocio."}
        </p>
      </div>

      {/* Select lead CTA and utility actions (Mockup premium design) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-app-border/40">
        {lead.googleMapsUrl ? (
          <a
            href={lead.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-surface-raised hover:bg-dark-surface/80 text-app-text border border-app-border font-display font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-brand" />
            <span>Maps</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-surface-raised/40 text-app-muted/40 border border-app-border/40 font-display font-bold uppercase tracking-wider text-[11px] rounded-xl cursor-not-allowed"
          >
            <MapPin className="w-4 h-4 text-app-muted/30" />
            <span>Maps</span>
          </button>
        )}

        {lead.phone ? (
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-surface-raised hover:bg-dark-surface/80 text-app-text border border-app-border font-display font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 text-brand" />
            <span>Contacto</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(lead.phone || lead.name);
            }}
            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-surface-raised hover:bg-dark-surface/80 text-app-text border border-app-border font-display font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 text-brand" />
            <span>Contacto</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onSelectLead(lead.id)}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 font-display font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all cursor-pointer ${
            isActive
              ? "bg-brand hover:brightness-110 text-dark-bg font-extrabold"
              : "bg-surface-raised hover:bg-dark-surface/80 text-app-text border border-app-border"
          }`}
        >
          <MessageSquare className={`w-4 h-4 ${isActive ? "text-white" : "text-brand"}`} />
          <span>Generar mensaje</span>
        </button>
      </div>
    </div>
  );
}
