import React from "react";
import { Prospect } from "../../../shared/types";
import ScoreBreakdown from "../../../shared/components/ScoreBreakdown";
import {
  SectionHeader, EmptyState, Surface, Callout, Button, StatGrid, StatTile, IconFrame
} from "../../../shared/components/ui";
import {
  ArrowLeft, Globe, MapPin, Search, Layers, AlertTriangle, Target,
  FileText, Calculator, Trophy, Cpu, Sparkles, HelpCircle, ChevronDown, Check, Minus
} from "lucide-react";

/**
 * Contexto de la búsqueda que produjo este Lead.
 *
 * **Solo se recibe cuando el negocio procede de la ejecución en curso.** Un Lead
 * recuperado del almacenamiento local no pertenece a la búsqueda actual, y
 * atribuirle su ciudad y su nicho sería inventar dos datos.
 */
export interface SearchContext {
  city: string;
  niche: string;
}

/**
 * Certeza sobre el motor que analizó **este** negocio.
 *
 * - `AI_CONFIRMED` — consta que fue el modelo generativo.
 * - `UNDETERMINED` — **no consta.** No es un fallo: es lo que se sabe.
 */
export type AnalysisEngineState = "AI_CONFIRMED" | "UNDETERMINED";

/**
 * **AI Showcase** — cómo AKVEZ llegó a considerar este negocio una oportunidad.
 *
 * ── QUÉ AÑADE SOBRE LA OPPORTUNITY VIEW ──────────────────────────────────────
 *
 * La Opportunity View responde **qué concluyó** el sistema. Esta pantalla
 * responde **cómo lo hizo**: qué dimensiones miró, qué encontró, cómo pesó cada
 * cosa y con qué motor. Es una narración del proceso, pensada para recorrerse
 * en voz alta en dos minutos.
 *
 * ── DE DÓNDE SALEN LOS DATOS ─────────────────────────────────────────────────
 *
 * **Del `Prospect` que ya está en memoria y del contexto de la búsqueda en
 * curso.** Ni una llamada nueva, ni un endpoint, ni un campo, ni un cálculo.
 *
 * ── LO QUE NO SE HACE, Y POR QUÉ ─────────────────────────────────────────────
 *
 * **Las seis dimensiones no están escritas en el frontend.** Se leen del
 * `breakdown` que llega del servidor. Codificarlas aquí duplicaría en la
 * interfaz una decisión de dominio —el Perfil de Ponderación vigente— y las dos
 * copias divergirían en cuanto se publicara WP-02.
 *
 * **El motor del análisis nunca se supone** (§6 del encargo). Ver
 * `AnalysisEngineState` y el bloque «Estado del análisis».
 */
export default function AIShowcase({
  lead,
  searchContext,
  engineState,
  onBack
}: {
  lead: Prospect;
  searchContext?: SearchContext;
  engineState: AnalysisEngineState;
  onBack: () => void;
}) {
  // **`typeof === "number"`, nunca `!!score`**: `0` es una puntuación real y
  // `null` una ausencia legítima (R-45).
  const hasScore = typeof lead.score === "number";
  const breakdown = lead.breakdown ?? [];
  const [showArithmetic, setShowArithmetic] = React.useState(false);

  return (
    <div className="space-y-12 pb-4">

      <Button
        variant="ghost"
        size="sm"
        tone="neutral"
        onClick={onBack}
        icon={<ArrowLeft className="h-4 w-4" />}
        className="!px-0"
      >
        Volver
      </Button>

      {/* ── Portada ─────────────────────────────────────────────────────────── */}
      <SectionHeader
        level="screen"
        icon={<Cpu className="h-3.5 w-3.5" />}
        eyebrow="Proceso de análisis"
        title="¿Por qué AKVEZ considera que este negocio es una oportunidad?"
      />

      {/* ── 1 · RESUMEN DEL NEGOCIO ─────────────────────────────────────────── */}
      <SectionHeader step={1} eyebrow="Paso 01" icon={<FileText className="h-4 w-4" />} title="El negocio">
        <StatGrid columns={3}>
          <StatTile label="Nombre" value={lead.name} />
          {/* **Ciudad y nicho proceden de la búsqueda, no del negocio.** Se
              rotulan como lo que son. Sin búsqueda en curso no se afirman. */}
          <StatTile
            label="Ciudad de búsqueda"
            value={searchContext?.city}
            icon={<MapPin className="h-3 w-3" />}
          />
          <StatTile
            label="Nicho buscado"
            value={searchContext?.niche}
            icon={<Search className="h-3 w-3" />}
          />
          <StatTile
            label="Sitio web"
            value={lead.website}
            fallback="Sin sitio web registrado"
            icon={<Globe className="h-3 w-3" />}
          />
          <StatTile label="Estado del sitio" value={lead.classification} />
          <StatTile label="Fuente del descubrimiento" value={lead.source} />
        </StatGrid>
      </SectionHeader>

      {/* ── 2 · QUÉ ANALIZÓ AKVEZ ───────────────────────────────────────────── */}
      <SectionHeader
        step={2}
        eyebrow="Paso 02"
        icon={<Layers className="h-4 w-4" />}
        title="¿Qué analizó AKVEZ?"
        lead="Las dimensiones del modelo de puntuación, con el peso que cada una tiene y si pudo medirse con información pública."
      >
        {breakdown.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {breakdown.map((entry, index) => {
              const measured = entry.partialScore !== null;
              return (
                <Surface
                  key={entry.category}
                  variant={measured ? "solid" : "dashed"}
                  padding="md"
                  className="flex items-center gap-4 motion-safe:animate-ak-rise"
                  style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
                >
                  {/* **Verde para lo medido: es una validación, no una marca.** */}
                  <IconFrame tone={measured ? "success" : "neutral"} size="sm">
                    {measured ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                  </IconFrame>
                  <div className="min-w-0">
                    <h4 className="font-display text-sm font-bold leading-tight text-app-text">
                      {entry.category}
                    </h4>
                    <p className="mt-0.5 font-mono text-eyebrow text-app-muted">
                      peso {entry.weight}% · {measured ? "medida" : "no medible"}
                    </p>
                  </div>
                </Surface>
              );
            })}
          </div>
        ) : (
          <EmptyState>
            No consta qué dimensiones se evaluaron: este negocio no trae desglose
            del Score.
          </EmptyState>
        )}
      </SectionHeader>

      {/* ── 3 · QUÉ ENCONTRÓ ────────────────────────────────────────────────── */}
      <SectionHeader
        step={3}
        eyebrow="Paso 03"
        icon={<Target className="h-4 w-4" />}
        title="¿Qué encontró?"
        lead="Los hallazgos del análisis del negocio."
      >
        <div className="space-y-6">
          {lead.description ? (
            <p className="max-w-measure font-sans text-sm text-app-muted">
              {lead.description}
            </p>
          ) : (
            <EmptyState>
              El análisis no produjo una descripción de este negocio.
            </EmptyState>
          )}

          {/* Lista vacía = **el análisis no detectó problemas**. Es un
              resultado, y se declara. */}
          {lead.flaws.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {lead.flaws.map((flaw, index) => (
                <Surface
                  as="li"
                  key={index}
                  padding="md"
                  className="flex items-start gap-3 font-sans text-sm text-app-muted motion-safe:animate-ak-rise"
                  style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
                  {flaw}
                </Surface>
              ))}
            </ul>
          ) : (
            <EmptyState>
              El análisis no detectó problemas web para este negocio.
            </EmptyState>
          )}

          {lead.whyWebsiteNeeded ? (
            <Callout
              tone="brand"
              icon={<Target className="h-4 w-4" />}
              title="Por qué necesita un sitio web"
            >
              <span className="italic">"{lead.whyWebsiteNeeded}"</span>
            </Callout>
          ) : (
            <EmptyState>
              El análisis no explicó por qué este negocio necesita un sitio web.
            </EmptyState>
          )}
        </div>
      </SectionHeader>

      {/* ── 4 · CÓMO CALCULÓ EL SCORE ───────────────────────────────────────── */}
      <SectionHeader
        step={4}
        eyebrow="Paso 04"
        icon={<Calculator className="h-4 w-4" />}
        title="¿Cómo calculó el Score?"
        lead="Cada dimensión puntúa por separado, se pondera según su peso y la suma reconstruye el total. El modelo es determinista: los mismos datos producen siempre el mismo número."
      >
        {breakdown.length > 0 ? (
          <div className="space-y-6">
            {/*
              ── LA REJILLA DE CATEGORÍAS SE HA RETIRADO DE ESTA PANTALLA ──────

              **Era la redundancia más cara del recorrido.** Las mismas seis
              tarjetas se pintaban aquí y en la Opportunity View: una bajo el
              rótulo «¿Por qué obtuvo ese Score?» y otra bajo «¿Cómo calculó el
              Score?».

              En el producto la distinción se sostiene —una responde *qué
              concluyó* y la otra *cómo lo hizo*—. **En una demo de dos minutos
              es contar la misma idea dos veces**, y era el tramo donde más
              atención se perdía.

              **El desglose se queda donde es el clímax: la Opportunity View.**
              Aquí queda lo que esta pantalla sí aporta en exclusiva — la
              comprobación aritmética, que es la prueba de que el número es
              reproducible y no una alucinación del modelo.
            */}
            {hasScore && (
              <Surface level="raised" className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowArithmetic((v) => !v)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand">
                    Comprobar la aritmética
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-brand transition-transform duration-300 ${
                      showArithmetic ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showArithmetic && (
                  <div className="border-t border-app-border px-6 pb-6">
                    <ScoreBreakdown breakdown={breakdown} score={lead.score as number} />
                  </div>
                )}
              </Surface>
            )}
          </div>
        ) : (
          <EmptyState>
            No hay desglose que mostrar. La explicación acompaña siempre a una
            Evaluación emitida; su ausencia significa que este negocio no se
            evaluó, no que puntuara cero.
          </EmptyState>
        )}
      </SectionHeader>

      {/* ── 5 · RESULTADO FINAL ─────────────────────────────────────────────── */}
      <SectionHeader step={5} eyebrow="Paso 05" icon={<Trophy className="h-4 w-4" />} title="Resultado final">
        <StatGrid columns={4}>
          {/* **Ausencia explícita**: «—», nunca un número de relleno. */}
          <StatTile
            label="Opportunity Score"
            tone="brand"
            emphasis
            size="lg"
            value={hasScore ? lead.score : undefined}
            fallback="—"
            caption={hasScore ? "sobre 100" : "Sin Evaluación emitida"}
          />
          <StatTile label="Nivel" value={hasScore ? lead.band ?? undefined : undefined} />
          <StatTile
            label="Cobertura"
            // `coverage` llega como proporción 0-1. Mostrarlo en porcentaje es
            // un cambio de unidad, no un cálculo nuevo.
            value={
              lead.coverage !== undefined
                ? `${Math.round(lead.coverage * 100)}% de factores`
                : undefined
            }
          />
          <StatTile label="Confianza" value={lead.confidence} />
        </StatGrid>
        {lead.scoreVersion && (
          <p className="mt-3 font-mono text-eyebrow text-app-muted">
            Perfil de Ponderación {lead.scoreVersion}
          </p>
        )}
      </SectionHeader>

      {/* ── 6 · ESTADO DEL ANÁLISIS ─────────────────────────────────────────── */}
      <SectionHeader step={6} eyebrow="Paso 06" icon={<Cpu className="h-4 w-4" />} title="Estado del análisis" isLast>
        {engineState === "AI_CONFIRMED" ? (
          <Callout
            tone="intel"
            icon={<Sparkles className="h-5 w-5" />}
            title="IA generativa"
          >
            <p className="leading-relaxed">
              Consta que <strong>ningún negocio de esta búsqueda recurrió al
              motor heurístico</strong>, de modo que el análisis de este negocio
              lo produjo el modelo generativo.
            </p>
            <p className="mt-1.5 leading-relaxed text-app-muted">
              El Opportunity Score, en cambio, <strong>no lo calcula la
              IA</strong>: es un modelo determinista que puntúa los hechos que
              la IA extrae.
            </p>
          </Callout>
        ) : (
          <Callout
            icon={<HelpCircle className="h-5 w-5" />}
            title="No consta para este negocio"
          >
            <p className="leading-relaxed">
              {/*
                **La honestidad exacta que pide §6 del encargo.** El sistema
                publica si *alguno* de los negocios de una búsqueda usó el
                respaldo, pero no *cuál*. Con esa señal activa —o sin búsqueda
                en curso— **no se puede afirmar el motor de este negocio en
                concreto**, y suponerlo sería exactamente lo prohibido.
              */}
              AKVEZ publica si <strong>alguno</strong> de los negocios de una
              búsqueda se analizó con el motor heurístico, pero no{" "}
              <strong>cuál</strong>. Por eso aquí no se afirma ni una cosa ni la
              otra.
            </p>
            <p className="mt-1.5 leading-relaxed text-app-muted">
              Los negocios <strong>sí son reales</strong>: proceden de Google
              Places. Lo que no consta es el motor que redactó su análisis.
            </p>
          </Callout>
        )}
      </SectionHeader>
    </div>
  );
}
