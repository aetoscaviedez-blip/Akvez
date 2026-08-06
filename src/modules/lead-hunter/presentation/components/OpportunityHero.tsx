import React from "react";
import { Prospect } from "../../../../shared/types";
import { Surface, Badge, Meter, IconFrame } from "../../../../shared/components/ui";
import { Globe, MapPin, Phone, Star, ShieldCheck, Gauge, FileCheck2, AlertTriangle } from "lucide-react";

/** Radio y circunferencia del anillo. Geometría, no dato. */
const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * **Hero Card de la Opportunity View.**
 *
 * Reúne en un solo bloque lo que identifica la oportunidad: negocio, Score,
 * nivel, cobertura, confianza y estado del análisis.
 *
 * ── EL ANILLO NO AÑADE INFORMACIÓN ───────────────────────────────────────────
 *
 * Representa el mismo `score` que se imprime en su centro, sobre una escala
 * 0-100 que es la del propio Score (APS-08 §7). **No introduce ninguna
 * magnitud nueva** y no se dibuja cuando no hay puntuación.
 *
 * ── QUÉ NO SE AFIRMA AQUÍ ────────────────────────────────────────────────────
 *
 * **No se declara si el análisis lo hizo la IA o el motor de respaldo.** Ese
 * dato existe por Lead en el backend (`usedFallbackAnalysis`) pero **no cruza el
 * contrato público**: solo llega `metadata.usedFallbackEngine`, que describe la
 * lista entera. Trasladar un agregado de la lista a un negocio concreto
 * afirmaría de *este* negocio algo que solo se sabe del conjunto — justo el tipo
 * de inferencia que H-02C retiró de la interfaz.
 *
 * **«Estado del análisis» se limita a lo verificable:** si hay Evaluación
 * emitida y bajo qué versión del Perfil de Ponderación.
 */
export default function OpportunityHero({ lead }: { lead: Prospect }) {
  // **`typeof === "number"`, nunca `!!score`**: `0` es una puntuación real y
  // `null` una ausencia legítima (R-45).
  const hasScore = typeof lead.score === "number";
  const ringOffset = hasScore
    ? RING_CIRCUMFERENCE * (1 - (lead.score as number) / 100)
    : RING_CIRCUMFERENCE;

  const hasContactData =
    !!lead.website || !!lead.googleMapsUrl || !!lead.phone ||
    (lead.rating ?? 0) > 0 || (lead.reviewCount ?? 0) > 0;

  return (
    <Surface as="header" className="relative overflow-hidden motion-safe:animate-ak-rise">
      {/* Halo decorativo. Puramente estético: no codifica ningún dato. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-brand/10 blur-3xl"
      />

      <div className="relative flex flex-col gap-10 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">

        {/* ── Identidad del negocio ─────────────────────────────────────────── */}
        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {/*
              Un dato de ejemplo debe declararse como tal, también aquí.

              **Se usa `pill`, no el chip neutro.** La regla del sistema —«el
              icono lleva el color, el texto no»— existe para que una fila de
              chips de dato no se convierta en un semáforo. **Pero esto no es un
              chip de dato: es una declaración de integridad**, y en la
              inspección F2.5 se comprobó que el tratamiento neutro la dejaba
              indistinguible de la fuente y del estado del sitio. `pill` tiñe
              texto, fondo y borde, que es el peso que esta afirmación necesita.
            */}
            {lead.isDemo && (
              <Badge variant="pill" tone="warn" icon={<AlertTriangle className="h-3.5 w-3.5" />}>
                Dato de ejemplo — no es un resultado real
              </Badge>
            )}
            {lead.source && (
              <Badge icon={<MapPin className="h-3 w-3" />}>{lead.source}</Badge>
            )}
            {/*
              **`classification` es el estado del sitio web, no la banda del
              Score.** Se rotula con su significado real para que no se lea como
              una calificación comercial: la banda es `band`, y está junto al
              número.
            */}
            {lead.classification && (
              <Badge icon={<Globe className="h-3 w-3" />}>
                Sitio web · {lead.classification}
              </Badge>
            )}
          </div>

          <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-app-text sm:text-5xl">
            {lead.name}
          </h2>

          {hasContactData && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 font-sans text-xs">
              {lead.website ? (
                <a
                  href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand transition-colors hover:text-brand/75"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {lead.website}
                </a>
              ) : (
                // La ausencia de sitio web se declara: es el hecho comercial más
                // relevante del producto, no un hueco.
                <span className="inline-flex items-center gap-1.5 text-app-muted">
                  <Globe className="h-3.5 w-3.5" />
                  Sin sitio web registrado
                </span>
              )}

              {lead.googleMapsUrl && (
                <a
                  href={lead.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-app-muted transition-colors hover:text-app-text"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Ver en Google Maps
                </a>
              )}

              {lead.phone && (
                <span className="inline-flex items-center gap-1.5 text-app-muted">
                  <Phone className="h-3.5 w-3.5" />
                  {lead.phone}
                </span>
              )}

              {/* Solo se afirma reputación si hay algo que afirmar. */}
              {((lead.rating ?? 0) > 0 || (lead.reviewCount ?? 0) > 0) && (
                <span className="inline-flex items-center gap-1.5 text-app-muted">
                  <Star className="h-3.5 w-3.5 text-brand" />
                  {lead.rating && lead.rating > 0 ? `${lead.rating.toFixed(1)} / 5.0` : "Sin valoración"}
                  {lead.reviewCount && lead.reviewCount > 0 ? ` · ${lead.reviewCount} reseñas` : ""}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Opportunity Score ─────────────────────────────────────────────── */}
        <div className="flex shrink-0 flex-col items-center gap-4">
          <div className="relative h-36 w-36">
            <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle
                cx="64" cy="64" r={RING_RADIUS}
                fill="none" strokeWidth="7"
                className="stroke-app-border"
              />
              {hasScore && (
                <circle
                  cx="64" cy="64" r={RING_RADIUS}
                  fill="none" strokeWidth="7" strokeLinecap="round"
                  className="stroke-brand motion-safe:animate-ak-ring"
                  style={{
                    strokeDasharray: RING_CIRCUMFERENCE,
                    strokeDashoffset: ringOffset,
                    // Consumidas por el keyframe `ak-ring`. El CSS no conoce
                    // ningún valor: recorre el que le fija el componente.
                    ["--ak-ring-c" as string]: `${RING_CIRCUMFERENCE}`,
                    ["--ak-ring-o" as string]: `${ringOffset}`
                  }}
                />
              )}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* **Ausencia explícita**: «—», nunca un número de relleno. */}
              {/* **Hero Score a 60 px.** Es la cifra protagonista de la pantalla
                  más importante del recorrido, y el ADN pide que domine sin
                  competencia. A 48 px empataba con el nombre del negocio. */}
              <span
                className={`font-display text-6xl font-black leading-none tabular-nums ${
                  hasScore ? "text-app-text" : "text-app-muted/40"
                }`}
              >
                {hasScore ? lead.score : "—"}
              </span>
              <span className="mt-1 font-mono text-eyebrow text-app-muted">
                {hasScore ? "/ 100" : "sin score"}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <span className="block font-sans text-eyebrow font-bold uppercase tracking-[0.2em] text-app-muted">
              Opportunity Score
            </span>
            {/* Banda de APS-08 §8 — **etiqueta de prioridad, nunca criterio de
                admisión (§8.6)**. `band` puede ser `null` en una emisión real:
                se distingue de «no llegó». */}
            {/* **La banda es verde, no naranja.** Se pinta como valor
                conseguido, no como marca: el naranja se reserva a la cifra y a
                la acción (regla 3 del ADN). */}
            {hasScore && lead.band ? (
              <Badge variant="pill" tone="success">
                {lead.band}
              </Badge>
            ) : (
              <Badge variant="pill">
                {hasScore ? "Sin nivel asignado" : "Sin Evaluación"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ── Franja de calidad del análisis ────────────────────────────────── */}
      <div className="relative grid grid-cols-1 divide-y divide-app-border border-t border-app-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <HeroStat
          icon={<Gauge className="h-4 w-4 text-brand" />}
          label="Cobertura de factores"
          value={
            // `coverage` llega como proporción 0-1. Mostrarlo en porcentaje es
            // un cambio de unidad, no un cálculo nuevo.
            lead.coverage !== undefined ? `${Math.round(lead.coverage * 100)}%` : "No disponible"
          }
          meter={lead.coverage !== undefined ? Math.round(lead.coverage * 100) : undefined}
        />
        <HeroStat
          icon={<ShieldCheck className="h-4 w-4 text-brand" />}
          label="Confianza del análisis"
          value={lead.confidence ?? "No disponible"}
        />
        <HeroStat
          icon={<FileCheck2 className="h-4 w-4 text-brand" />}
          label="Estado del análisis"
          value={hasScore ? "Evaluación emitida" : "Sin evaluar"}
          hint={lead.scoreVersion}
        />
      </div>
    </Surface>
  );
}

/**
 * Celda de la franja del Hero. Solo presentación.
 *
 * `meter` dibuja una barra proporcional al mismo porcentaje que ya muestra
 * `value`; no representa ninguna magnitud distinta.
 */
function HeroStat({
  icon,
  label,
  value,
  hint,
  meter
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  meter?: number;
}) {
  return (
    <div className="flex items-center gap-4 px-8 py-6">
      <IconFrame size="sm">{icon}</IconFrame>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="font-sans text-eyebrow uppercase tracking-widest text-app-muted">
          {label}
        </div>
        <div className="truncate font-display text-base font-bold capitalize text-app-text">
          {value}
        </div>
        {meter !== undefined && <Meter value={meter} size="xs" delay={220} />}
        {hint && (
          <div className="truncate font-mono text-eyebrow text-app-muted">{hint}</div>
        )}
      </div>
    </div>
  );
}
