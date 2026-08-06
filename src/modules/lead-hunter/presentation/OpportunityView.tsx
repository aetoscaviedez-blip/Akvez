import React from "react";
import { Prospect } from "../../../shared/types";
import OpportunityHero from "./components/OpportunityHero";
import ExecutiveSummary from "./components/ExecutiveSummary";
import ScoreCategoryCard from "./components/ScoreCategoryCard";
import FactorInventory from "./components/FactorInventory";
import {
  SectionHeader, EmptyState, Surface, Callout, Button, ActionCard, Eyebrow
} from "../../../shared/components/ui";
import {
  ArrowLeft, ArrowRight, MessageSquare, DollarSign, AlertTriangle,
  Zap, Target, Search, EyeOff, Calculator
} from "lucide-react";

/**
 * **Opportunity View** — la explicación completa de una oportunidad.
 *
 * ── EL RECORRIDO ─────────────────────────────────────────────────────────────
 *
 * 1. **Hero** — quién es el negocio y cuánto puntúa.
 * 2. **Resumen ejecutivo** — qué señales lo empujan, con cuánta cobertura y
 *    confianza.
 * 3. **¿Por qué obtuvo ese Score?** — el desglose completo, categoría a
 *    categoría, y la suma que lo reconstruye.
 * 4. **Qué encontró AKVEZ** — los factores que sí se midieron y los hallazgos
 *    del análisis del negocio.
 * 5. **Qué falta medir** — los factores que no se pudieron medir. Con el mismo
 *    peso visual que los anteriores.
 * 6. **Próximos pasos** — el ángulo comercial y la acción.
 *
 * ── DE DÓNDE SALEN LOS DATOS ─────────────────────────────────────────────────
 *
 * **De ninguna parte nueva.** Todo procede del `Prospect` que ya está en
 * memoria, mapeado por `prospectMapper` desde `LeadResponseDTO`. Esta vista
 * **no llama al servidor, no calcula el Score, no deriva métricas nuevas y no
 * rellena huecos**.
 *
 * La única aritmética es la **suma de las contribuciones**, que no produce
 * información: reconstruye el Score ya recibido y hace visible la
 * **Reproducibilidad de ADR-14 §6.3**.
 *
 * ── LA REGLA QUE GOBIERNA CADA BLOQUE ────────────────────────────────────────
 *
 * **Lo que no llegó, no se pinta.** Cada sección va condicionada a su dato, y un
 * Lead sin Evaluación —estado legítimo, **R-45**— rinde estados explícitos en
 * lugar de una pantalla con huecos o con ceros inventados (**R-38**).
 *
 * **Presenta y no decide (R-48).** El orden del desglose es el que llega del
 * servidor; el resumen reordena una copia para destacar, sin alterar nada.
 */
export default function OpportunityView({
  lead,
  onBack,
  onGeneratePitch,
  onOpenShowcase
}: {
  lead: Prospect;
  onBack: () => void;
  onGeneratePitch: (id: string) => void;
  /** Abre el AI Showcase: el proceso que llevó hasta este resultado. */
  onOpenShowcase: () => void;
}) {
  const hasScore = typeof lead.score === "number";
  const breakdown = lead.breakdown ?? [];

  // Reconstrucción del Score a partir de sus partes. No lo recalcula: suma lo
  // que ya se muestra, para que el usuario compruebe que cuadra.
  const totalContribution = breakdown.reduce((sum, entry) => sum + entry.contribution, 0);

  const hasBusinessAnalysis =
    !!lead.description || !!lead.whyWebsiteNeeded || !!lead.revenueLoss || lead.flaws.length > 0;

  return (
    <div className="space-y-14 pb-4">

      {/* ── Navegación ──────────────────────────────────────────────────────── */}
      <Button
        variant="ghost"
        size="sm"
        tone="neutral"
        onClick={onBack}
        icon={<ArrowLeft className="h-4 w-4" />}
        className="!px-0"
      >
        Volver a los resultados
      </Button>

      {/* ── 1 · HERO ────────────────────────────────────────────────────────── */}
      <OpportunityHero lead={lead} />

      {/* Acceso al proceso. **Esta pantalla explica el resultado; el Showcase
          explica cómo se llegó a él.** Son dos preguntas distintas y por eso no
          comparten pantalla. */}
      <ActionCard
        tone="intel"
        icon={<Search className="h-5 w-5" />}
        title="Ver cómo lo analizó AKVEZ"
        detail="El proceso completo: qué dimensiones miró, qué encontró y cómo pesó cada cosa."
        onClick={onOpenShowcase}
      />

      {/* ── 2 · RESUMEN EJECUTIVO ───────────────────────────────────────────── */}
      <ExecutiveSummary lead={lead} />

      {/* ── 3 · POR QUÉ OBTUVO ESE SCORE ───────────────────────────────────── */}
      <SectionHeader
        icon={<Calculator className="h-4 w-4 text-brand" />}
        eyebrow="Desglose del Opportunity Score"
        title="¿Por qué obtuvo ese Score?"
        lead="El Opportunity Score no lo inventa la IA: es un modelo determinista y reproducible. Cada categoría puntúa por separado, se pondera según su peso y la suma reconstruye el total."
      >
        {breakdown.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {breakdown.map((entry, index) => (
                <ScoreCategoryCard key={entry.category} entry={entry} index={index} />
              ))}
            </div>

            {/* Reconstrucción — ADR-14 §6.3 hecha visible. */}
            {hasScore && (
              <Surface
                level="raised"
                className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-sans text-[11px] uppercase tracking-widest text-app-muted">
                  Suma de las {breakdown.length} contribuciones
                </span>
                <span className="font-mono text-sm text-app-muted">
                  {totalContribution.toFixed(2)}
                  <span className="mx-2 opacity-50">≈</span>
                  <span className="font-display text-xl font-black text-brand">
                    {lead.score}
                  </span>
                </span>
              </Surface>
            )}
          </div>
        ) : (
          <EmptyState title="Este negocio no trae desglose del Score">
            La explicación acompaña siempre a una Evaluación emitida; su ausencia
            significa que este Lead no se evaluó, no que puntuara cero.
          </EmptyState>
        )}
      </SectionHeader>

      {/* ── 4 · QUÉ ENCONTRÓ AKVEZ ─────────────────────────────────────────── */}
      <SectionHeader
        icon={<Search className="h-4 w-4 text-brand" />}
        eyebrow="Evidencia"
        title="Qué encontró AKVEZ"
        lead="Los factores del modelo que sí pudieron medirse con información pública, y los hallazgos del análisis del negocio."
      >
        <div className="space-y-8">
          {breakdown.length > 0 && (
            <div className="space-y-4">
              <Eyebrow as="h4">Factores medidos por el motor de puntuación</Eyebrow>
              <FactorInventory breakdown={breakdown} variant="measured" />
            </div>
          )}

          {hasBusinessAnalysis && (
            <div className="space-y-4">
              {/* **Atribución separada y deliberada.** Los factores de arriba los
                  mide un modelo determinista; lo de aquí procede del análisis del
                  negocio. Fundirlos en una sola lista atribuiría a uno lo que
                  produjo el otro. */}
              <Eyebrow as="h4">Hallazgos del análisis del negocio</Eyebrow>

              {lead.description && (
                <p className="max-w-3xl font-sans text-sm leading-relaxed text-app-muted">
                  {lead.description}
                </p>
              )}

              {/* Lista vacía = **el análisis no detectó problemas**. Es un
                  resultado, y se declara. */}
              {lead.flaws.length > 0 && (
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {lead.flaws.map((flaw, index) => (
                    <Surface
                      as="li"
                      key={index}
                      padding="md"
                      className="flex items-start gap-3 font-sans text-xs leading-relaxed text-app-muted motion-safe:animate-ak-rise"
                      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                    >
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
                      {flaw}
                    </Surface>
                  ))}
                </ul>
              )}

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {lead.whyWebsiteNeeded && (
                  <Callout
                    icon={<Target className="h-4 w-4 text-brand" />}
                    title="Por qué necesita un sitio web"
                    tone="brand"
                  >
                    <span className="italic">"{lead.whyWebsiteNeeded}"</span>
                  </Callout>
                )}
                {lead.revenueLoss && (
                  <Callout
                    icon={<DollarSign className="h-4 w-4 text-warn" />}
                    title="Impacto financiero estimado"
                    tone="warn"
                  >
                    {lead.revenueLoss}
                  </Callout>
                )}
              </div>
            </div>
          )}

          {breakdown.length === 0 && !hasBusinessAnalysis && (
            <EmptyState title="Todavía no hay evidencia para este negocio">
              Ni el motor de puntuación ni el análisis produjeron hallazgos. Es un
              estado válido, no un error.
            </EmptyState>
          )}
        </div>
      </SectionHeader>

      {/* ── 5 · QUÉ FALTA MEDIR ────────────────────────────────────────────── */}
      {breakdown.length > 0 && (
        <SectionHeader
          icon={<EyeOff className="h-4 w-4 text-app-muted" />}
          eyebrow="Límites del análisis"
          title="Qué falta medir"
          lead="Estos factores forman parte del modelo pero no pudieron medirse con la información pública disponible. No puntúan cero: quedan fuera del cálculo y reducen la cobertura declarada."
        >
          <FactorInventory breakdown={breakdown} variant="unmeasured" />
        </SectionHeader>
      )}

      {/* ── 6 · PRÓXIMOS PASOS ─────────────────────────────────────────────── */}
      <SectionHeader
        icon={<Zap className="h-4 w-4 text-brand" />}
        eyebrow="Acción"
        title="Próximos pasos"
      >
        <div className="space-y-6">
          <Callout
            icon={<Zap className="h-4 w-4 text-brand" />}
            title="Ángulo de oportunidad"
            tone="brand"
          >
            {/* **Sin ángulo no se inventa uno.** */}
            {lead.angle ?? (
              <span className="italic text-app-muted">
                No se generó un ángulo de oportunidad para este negocio.
              </span>
            )}
          </Callout>

          {/* **La única acción primaria de esta pantalla.** */}
          <Surface className="flex flex-col items-center gap-4 px-8 py-10 text-center">
            <h4 className="max-w-xl font-display text-xl font-bold tracking-tight text-app-text">
              ¿Contactamos a {lead.name}?
            </h4>
            <p className="max-w-md font-sans text-xs leading-relaxed text-app-muted">
              El generador redacta un mensaje personalizado a partir de este mismo
              análisis.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onGeneratePitch(lead.id)}
              icon={<MessageSquare className="h-4 w-4" />}
              className="mt-1"
            >
              Generar mensaje
            </Button>
          </Surface>
        </div>
      </SectionHeader>
    </div>
  );
}
