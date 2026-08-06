import React from "react";
import { Prospect, SearchSummary } from "../../../shared/types";
import LeadCard from "../../lead-hunter/presentation/components/LeadCard";
import FunnelStage from "./components/FunnelStage";
import SystemStatus, { StatusItem } from "./components/SystemStatus";
import {
  SectionHeader, EmptyState, Surface, Callout, ActionCard, Badge, StatGrid, StatTile
} from "../../../shared/components/ui";
import {
  Search, Radar, Brain, Flame, Check, AlertTriangle, Activity, Layers, ShieldCheck
} from "lucide-react";

/**
 * **Executive Dashboard** — dónde está el trabajo y qué hacer a continuación.
 *
 * ── CADA CIFRA ES UN RECUENTO DE REGISTROS QUE EXISTEN ───────────────────────
 *
 * **No hay una sola métrica estimada, proyectada ni simulada.** Todo sale de
 * contar los `Prospect` que ya están en memoria y de los resúmenes de las
 * búsquedas que esta sesión ejecutó realmente.
 *
 * **Y cada recuento lleva escrita su definición debajo**, porque «leads
 * analizados» sin decir qué cuenta es una cifra que no se puede comprobar.
 *
 * ── LO QUE ESTE PANEL NO HACE ────────────────────────────────────────────────
 *
 * **No hay tasas de conversión, ni tendencias, ni comparativas temporales.**
 * AKVEZ no guarda histórico: cualquier «+12 % esta semana» sería inventado.
 *
 * **No hay luces verdes por defecto.** El estado del sistema solo afirma lo que
 * se ha comprobado; lo demás queda en «Sin comprobar» *(ver `SystemStatus`)*.
 *
 * **No hay cronología.** No existe registro de eventos, de modo que la actividad
 * se presenta como **hechos verificables del estado actual**, no como una línea
 * de tiempo con marcas horarias que habría que fabricar.
 */
export default function ExecutiveDashboard({
  leads,
  searchHistory,
  activeLeadId,
  onStartSearch,
  onOpenOpportunity,
  onGeneratePitch
}: {
  leads: Prospect[];
  searchHistory: SearchSummary[];
  activeLeadId: string;
  onStartSearch: () => void;
  onOpenOpportunity: (id: string) => void;
  onGeneratePitch: (id: string) => void;
}) {
  // ── Recuentos ───────────────────────────────────────────────────────────────
  //
  // Cuatro definiciones explícitas. Se declaran aquí y se rotulan en pantalla,
  // para que ninguna cifra dependa de una interpretación tácita.
  const found = leads.length;
  // «Analizado» = el análisis del negocio produjo contenido.
  const analyzed = leads.filter((l) => !!l.description || l.flaws.length > 0).length;
  // «Con Score» = hay Evaluación emitida. **`typeof`, nunca `!!`**: `0` es una
  // puntuación real y `null` una ausencia legítima (R-45).
  const scored = leads.filter((l) => typeof l.score === "number").length;
  const pitched = leads.filter((l) => !!l.generatedPitch).length;
  const demoCount = leads.filter((l) => l.isDemo).length;

  // Distribución por banda. **Se agrupa por la etiqueta que asignó el dominio**;
  // el frontend no fija ningún umbral (APS-08 §8.6: las bandas son etiquetas de
  // prioridad, nunca criterios de admisión).
  const bandCounts = leads.reduce<Record<string, number>>((acc, lead) => {
    if (typeof lead.score === "number" && lead.band) {
      acc[lead.band] = (acc[lead.band] ?? 0) + 1;
    }
    return acc;
  }, {});
  const bands = Object.entries(bandCounts).sort((a, b) => b[1] - a[1]);

  const lastSearch = searchHistory.length > 0 ? searchHistory[searchHistory.length - 1] : undefined;

  // Marca temporal real de la última Evaluación emitida. `calculatedAt` es ISO,
  // de modo que el orden lexicográfico es el cronológico.
  const lastCalculatedAt = leads
    .map((l) => l.calculatedAt)
    .filter((v): v is string => typeof v === "string" && v !== "")
    .sort()
    .pop();

  // ── Salud del servidor ──────────────────────────────────────────────────────
  //
  // Única comprobación activa del panel, contra un endpoint que YA existe. No
  // acredita nada de Places ni de Gemini: solo que el proceso responde.
  const [serverStatus, setServerStatus] =
    React.useState<"checking" | "ok" | "down">("checking");

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/health")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("http"))))
      .then((d) => {
        if (!cancelled) setServerStatus(d?.status === "ok" ? "ok" : "down");
      })
      .catch(() => {
        if (!cancelled) setServerStatus("down");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const statusItems = buildStatusItems(serverStatus, lastSearch, leads);

  // Los más recientes primero: `App.handleAddLeads` antepone los nuevos, de modo
  // que **el orden del arreglo es el de incorporación**. No se inventa ninguna
  // ordenación temporal que el dato no soporte.
  const latest = leads.slice(0, 3);

  return (
    <div className="space-y-16 pb-4">

      {/* ── 1 · HERO ────────────────────────────────────────────────────────── */}
      <SectionHeader
        level="screen"
        icon={<Radar className="h-3.5 w-3.5" />}
        eyebrow="Panel del agente"
        title={
          found > 0
            ? "Esto es lo que AKVEZ ha encontrado para ti"
            : "AKVEZ está listo para buscar por ti"
        }
        lead={
          found > 0
            ? "Todas las cifras cuentan negocios reales que están en tu espacio de trabajo. Ninguna es una estimación."
            : "Todavía no hay negocios en tu espacio de trabajo. Lanza una búsqueda y el agente empezará a trabajar."
        }
      >
        <StatGrid columns={4}>
          {/*
            ⚠️ **«Búsquedas realizadas» no existía en el producto.** Es un
            recuento de sesión: cuenta búsquedas que esta pestaña ejecutó de
            verdad, y **se pierde al recargar**. Se rotula como tal en lugar de
            presentarse como un histórico que nadie guarda.
          */}
          <StatTile
            icon={<Search className="h-4 w-4" />}
            tone="brand"
            label="Búsquedas"
            caption="Ejecutadas en esta sesión"
            value={searchHistory.length}
            size="lg"
            delay={0}
          />
          <StatTile
            icon={<Radar className="h-4 w-4" />}
            tone="brand"
            label="Negocios encontrados"
            caption="En tu espacio de trabajo"
            value={found}
            size="lg"
            delay={60}
          />
          <StatTile
            icon={<Brain className="h-4 w-4" />}
            tone="intel"
            label="Analizados"
            caption="Con descripción o problemas detectados"
            value={analyzed}
            size="lg"
            delay={120}
          />
          <StatTile
            icon={<Flame className="h-4 w-4" />}
            tone="brand"
            label="Con Opportunity Score"
            caption="Con Evaluación emitida"
            value={scored}
            size="lg"
            delay={180}
          />
        </StatGrid>

        {/*
          **Si hay datos de ejemplo mezclados, las cifras de arriba los
          incluyen.** Callarlo convertiría el panel en una afirmación falsa sobre
          cuánto trabajo real hay hecho.
        */}
        {/* **Era el último aviso de integridad escrito a mano.** Ahora usa
            `Callout`, como sus hermanos del producto: misma anatomía, mismo
            cuerpo y misma medida de lectura. */}
        {demoCount > 0 && (
          <Callout tone="warn" icon={<AlertTriangle className="h-4 w-4" />} size="sm">
            <strong className="text-warn">
              {demoCount} de estos {found} negocios son datos de ejemplo.
            </strong>{" "}
            No proceden de una búsqueda real y están incluidos en todas las
            cifras de esta pantalla.
          </Callout>
        )}

        {/* ── 6 · CTA ─────────────────────────────────────────────────────────
            **Se coloca aquí, y no al final, porque es el punto de entrada del
            flujo**: el panel existe para llevar a la búsqueda, y enterrar esa
            acción bajo cinco secciones la haría inalcanzable en una demo.

            **Es la única acción primaria de esta pantalla.** */}
        <ActionCard
          variant="solid"
          tone="brand"
          icon={<Search className="h-5 w-5" />}
          title="Buscar nuevas oportunidades"
          detail="Elige nicho y ciudad; el agente rastrea Google Places y puntúa cada negocio."
          onClick={onStartSearch}
        />
      </SectionHeader>

      {/* ── 2 · EMBUDO ──────────────────────────────────────────────────────── */}
      <SectionHeader
        icon={<Layers className="h-4 w-4 text-brand" />}
        eyebrow="Progresión"
        title="Embudo de oportunidad"
        lead="Cuántos negocios llegan a cada etapa. Son recuentos, no tasas de conversión: AKVEZ no guarda histórico con el que compararlos."
      >
        {found > 0 ? (
          <div className="space-y-0">
            <FunnelStage
              index={0}
              label="Encontrados"
              caption="Negocios descubiertos y registrados"
              value={found}
            />
            <FunnelStage
              index={1}
              label="Analizados"
              caption="El análisis produjo descripción o problemas detectados"
              value={analyzed}
              previous={found}
            />
            <FunnelStage
              index={2}
              label="Con Score emitido"
              caption="Tienen Opportunity Score y su desglose por categorías"
              value={scored}
              previous={analyzed}
            />
            <FunnelStage
              index={3}
              label="Con mensaje generado"
              caption="Ya tienen un texto de contacto redactado"
              value={pitched}
              previous={scored}
              isLast
            />

            {/* Distribución por banda. **Etiquetas del dominio, sin umbrales
                propios**: AKVEZ no descarta ningún Lead por su puntuación. */}
            {bands.length > 0 && (
              <Surface level="raised" padding="lg" className="mt-8">
                <h4 className="font-sans text-eyebrow font-bold uppercase tracking-widest text-app-muted">
                  Reparto por nivel de oportunidad
                </h4>
                <div className="mt-4 flex flex-wrap gap-3">
                  {bands.map(([band, count]) => (
                    <Badge key={band} tone="brand">
                      <span className="font-display font-black tabular-nums text-brand">
                        {count}
                      </span>
                      {band}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 font-sans text-xs leading-relaxed text-app-muted">
                  El nivel es una <strong>etiqueta de prioridad</strong>, nunca un
                  filtro: ningún negocio se descarta por su puntuación.
                </p>
              </Surface>
            )}
          </div>
        ) : (
          <EmptyState>El embudo se llena con la primera búsqueda.</EmptyState>
        )}
      </SectionHeader>

      {/* ── 3 · ACTIVIDAD ───────────────────────────────────────────────────── */}
      <SectionHeader
        icon={<Activity className="h-4 w-4 text-brand" />}
        eyebrow="Estado actual"
        title="Actividad"
        lead="Hechos comprobables del estado actual. AKVEZ no lleva registro de eventos, así que aquí no hay marcas horarias: hay lo que hay ahora."
      >
        {found > 0 || searchHistory.length > 0 ? (
          <Surface as="ul" className="overflow-hidden">
            {buildActivity({
              searchHistory, lastSearch, found, analyzed, scored, pitched, lastCalculatedAt
            }).map((entry, index) => (
              <li
                key={entry.text}
                className="flex items-start gap-3.5 border-b border-app-border px-6 py-4 last:border-0 motion-safe:animate-ak-rise"
                style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
              >
                <span
                  className={`mt-0.5 shrink-0 ${
                    entry.tone === "warn" ? "text-warn" : "text-success"
                  }`}
                >
                  {entry.tone === "warn" ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </span>
                <span className="font-sans text-sm leading-relaxed text-app-text">
                  {entry.text}
                </span>
              </li>
            ))}
          </Surface>
        ) : (
          <EmptyState>Sin actividad todavía en esta sesión.</EmptyState>
        )}
      </SectionHeader>

      {/* ── 4 · ÚLTIMOS NEGOCIOS ────────────────────────────────────────────── */}
      <SectionHeader
        icon={<Radar className="h-4 w-4 text-brand" />}
        eyebrow="Descubrimiento"
        title="Últimos negocios"
        lead="Los tres más recientes en incorporarse a tu espacio de trabajo."
      >
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {/* **Se reutiliza `LeadCard` sin modificarlo.** Es la misma tarjeta
                del Lead Hunter: una copia adaptada habría creado dos que
                divergirían a la primera modificación. */}
            {latest.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                isActive={activeLeadId === lead.id}
                onSelectLead={onGeneratePitch}
                onOpenOpportunity={onOpenOpportunity}
              />
            ))}
          </div>
        ) : (
          <EmptyState>Todavía no hay negocios que mostrar.</EmptyState>
        )}
      </SectionHeader>

      {/* ── 5 · ESTADO DEL SISTEMA ──────────────────────────────────────────── */}
      <SectionHeader
        icon={<ShieldCheck className="h-4 w-4 text-brand" />}
        eyebrow="Verificación"
        title="Estado del sistema"
        lead="Solo lo que se ha podido comprobar. Lo que no se ha ejercitado en esta sesión queda declarado como no comprobado."
      >
        <SystemStatus items={statusItems} />
      </SectionHeader>
    </div>
  );
}

/**
 * Construye el estado del sistema.
 *
 * **Cada renglón declara qué acredita**, y ninguno afirma más de lo observado.
 */
function buildStatusItems(
  serverStatus: "checking" | "ok" | "down",
  lastSearch: SearchSummary | undefined,
  leads: Prospect[]
): StatusItem[] {
  // Evidencia de que Places respondió: hay negocios con Fuente declarada por el
  // servidor. No acredita que responda **ahora**, y así se dice.
  const hasPlacesEvidence = leads.some((l) => !!l.source);

  return [
    {
      label: "Servidor AKVEZ",
      level: serverStatus === "checking" ? "checking" : serverStatus === "ok" ? "ok" : "down",
      detail:
        serverStatus === "checking"
          ? "Comprobando…"
          : serverStatus === "ok"
            ? "Responde a la comprobación de salud."
            : "No responde a la comprobación de salud."
    },
    {
      label: "Google Places",
      level: lastSearch ? (lastSearch.found > 0 ? "ok" : "warn") : hasPlacesEvidence ? "warn" : "unknown",
      detail: lastSearch
        ? lastSearch.found > 0
          ? `La última búsqueda devolvió ${lastSearch.found} negocios.`
          : "La última búsqueda no devolvió negocios."
        : hasPlacesEvidence
          ? "Hay negocios con Fuente declarada, pero no de esta sesión."
          : "Sin comprobar: no se ha buscado en esta sesión."
    },
    {
      label: "Gemini",
      level: lastSearch ? (lastSearch.usedFallbackEngine ? "warn" : "ok") : "unknown",
      detail: lastSearch
        ? lastSearch.usedFallbackEngine
          ? "En la última búsqueda, al menos un negocio no lo analizó el modelo."
          : "Analizó todos los negocios de la última búsqueda."
        : "Sin comprobar: no se ha buscado en esta sesión."
    },
    {
      label: "Motor de respaldo",
      level: lastSearch ? (lastSearch.usedFallbackEngine ? "warn" : "ok") : "unknown",
      detail: lastSearch
        ? lastSearch.usedFallbackEngine
          ? "Activo en la última búsqueda. Los análisis afectados no proceden del modelo."
          : "No intervino en la última búsqueda."
        : "Sin comprobar: no se ha buscado en esta sesión."
    }
  ];
}

interface ActivityEntry {
  text: string;
  tone: "ok" | "warn";
}

/**
 * Actividad — **derivada del estado, no de un registro.**
 *
 * Cada renglón es una afirmación que el usuario puede verificar contando
 * tarjetas. **No se fabrica ninguna marca horaria**: la única fecha que aparece
 * es `calculatedAt`, que sí llega del servidor.
 */
function buildActivity({
  searchHistory,
  lastSearch,
  found,
  analyzed,
  scored,
  pitched,
  lastCalculatedAt
}: {
  searchHistory: SearchSummary[];
  lastSearch?: SearchSummary;
  found: number;
  analyzed: number;
  scored: number;
  pitched: number;
  lastCalculatedAt?: string;
}): ActivityEntry[] {
  const entries: ActivityEntry[] = [];

  if (lastSearch) {
    entries.push({
      text: `Última búsqueda: ${lastSearch.niche} en ${lastSearch.city} — ${lastSearch.found} negocios devueltos.`,
      tone: "ok"
    });
  }
  if (searchHistory.length > 1) {
    entries.push({
      text: `Se han ejecutado ${searchHistory.length} búsquedas en esta sesión.`,
      tone: "ok"
    });
  }
  if (found > 0) {
    entries.push({ text: `Hay ${found} negocios en el espacio de trabajo.`, tone: "ok" });
  }
  if (analyzed > 0) {
    entries.push({ text: `${analyzed} tienen análisis del negocio.`, tone: "ok" });
  }
  if (scored > 0) {
    entries.push({ text: `${scored} tienen Opportunity Score emitido con su desglose.`, tone: "ok" });
  }
  if (pitched > 0) {
    entries.push({ text: `${pitched} tienen un mensaje de contacto generado.`, tone: "ok" });
  }
  if (lastSearch?.usedFallbackEngine) {
    entries.push({
      text: "En la última búsqueda, al menos un negocio se analizó con el motor de respaldo en lugar del modelo.",
      tone: "warn"
    });
  }
  const formatted = formatTimestamp(lastCalculatedAt);
  if (formatted) {
    entries.push({ text: `Última Evaluación emitida: ${formatted}.`, tone: "ok" });
  }

  return entries;
}

/** Formatea una marca ISO. **Devuelve `undefined` si no es una fecha válida**. */
function formatTimestamp(iso?: string): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}
