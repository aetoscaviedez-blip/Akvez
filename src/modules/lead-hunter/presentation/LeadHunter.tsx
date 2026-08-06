import React from "react";
import { Prospect, SearchSummary } from "../../../shared/types";
import { NICHE_PRESETS } from "../domain/nichePresets";
import { searchProspects } from "../application/searchProspects";
import { searchMoreProspects } from "../application/searchMoreProspects";
import NicheSelector from "./components/NicheSelector";
import CitySelector from "./components/CitySelector";
import DesignStyleConfigPanel from "./components/DesignStyleConfigPanel";
import SearchCtaButton from "./components/SearchCtaButton";
import SearchingLoader from "./components/SearchingLoader";
import {
  SectionHeader, EmptyState, Surface, Callout
} from "../../../shared/components/ui";
import ResultsHeader from "./components/ResultsHeader";
import LoadMoreControls from "./components/LoadMoreControls";
import LeadCard from "./components/LeadCard";
import OpportunityView from "./OpportunityView";
import AIShowcase from "./AIShowcase";
import { AlertTriangle, Sparkles, Target, Search } from "lucide-react";

interface LeadHunterProps {
  designerStyle: string;
  setDesignerStyle: (style: string) => void;
  leads: Prospect[];
  onAddLeads: (leads: Prospect[]) => void;
  onSelectLead: (id: string) => void;
  activeLeadId: string;
  /**
   * Se invoca tras cada búsqueda que devuelve resultados. **Informa de lo que
   * ocurrió; no lo decide.** Permite que el panel describa la sesión sin que el
   * Hunter conozca al panel.
   */
  onSearchCompleted: (summary: SearchSummary) => void;
  /**
   * Lead que otra pantalla pide abrir en la Opportunity View. `null` cuando no
   * hay petición pendiente.
   */
  requestedLeadId: string | null;
  /** Confirma que la petición se atendió, para que no vuelva a dispararse. */
  onRequestedLeadConsumed: () => void;
}

export default function LeadHunter({
  designerStyle,
  setDesignerStyle,
  leads,
  onAddLeads,
  onSelectLead,
  activeLeadId,
  onSearchCompleted,
  requestedLeadId,
  onRequestedLeadConsumed
}: LeadHunterProps) {
  // Search state
  const [selectedPresetId, setSelectedPresetId] = React.useState(NICHE_PRESETS[0].id);
  const [customNiche, setCustomNiche] = React.useState("");
  const [useCustomNiche, setUseCustomNiche] = React.useState(false);
  const [city, setCity] = React.useState("Bogotá");
  const [nicheDropdownOpen, setNicheDropdownOpen] = React.useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = React.useState(false);

  // Advanced layout style toggle
  const [showStyleConfig, setShowStyleConfig] = React.useState(false);

  // Loading states
  const [searching, setSearching] = React.useState(false);
  const [searchingMore, setSearchingMore] = React.useState(false);
  const [noMoreLeadsFound, setNoMoreLeadsFound] = React.useState(false);
  const [scanStep, setScanStep] = React.useState(0);
  const [searchResults, setSearchResults] = React.useState<Prospect[]>([]);
  const [references, setReferences] = React.useState<Array<{ title: string; url: string }>>([]);
  const [usedFallbackEngine, setUsedFallbackEngine] = React.useState(false);
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(5);

  /**
   * Lead abierto en la **Opportunity View**.
   *
   * Es estado **de navegación de esta pantalla**, no de negocio: decide qué se
   * muestra, nunca qué se calcula. Se mantiene aquí —y no en `App`— porque la
   * vista de detalle pertenece al Workspace y no sobrevive a un cambio de
   * pestaña, igual que el resto del estado de resultados.
   *
   * No se reutiliza `activeLeadId`: ese identifica el Lead **enfocado en el
   * generador de mensajes**, y siempre apunta a alguno. Mezclarlos abriría la
   * vista de detalle sola.
   */
  const [openedLeadId, setOpenedLeadId] = React.useState<string | null>(null);

  /** El AI Showcase cuelga del Lead abierto: explica cómo se llegó a su Score. */
  const [showcaseOpen, setShowcaseOpen] = React.useState(false);

  // Atiende la petición de otra pantalla de abrir un negocio concreto. Se
  // confirma su consumo para que volver a esta pestaña no la reabra sola.
  React.useEffect(() => {
    if (!requestedLeadId) return;
    setOpenedLeadId(requestedLeadId);
    setShowcaseOpen(false);
    onRequestedLeadConsumed();
  }, [requestedLeadId]);

  // Scanning progression animation messages in Spanish
  const scanMessages = [
    "Iniciando Agente LeadHunter Colombia...",
    "Buscando listados reales en Google Search...",
    "Filtrando negocios informales y corporaciones...",
    "Analizando velocidad de carga y adaptación móvil...",
    "Evaluando fugas de conversión y falta de llamados a la acción (CTA)...",
    "Calculando el Lead Score y estructurando el ángulo comercial..."
  ];

  React.useEffect(() => {
    let interval: any;
    if (searching) {
      setScanStep(0);
      interval = setInterval(() => {
        setScanStep((prev) => (prev < scanMessages.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      setScanStep(0);
    }
    return () => clearInterval(interval);
  }, [searching]);

  // Determine actual niche string to search
  const activeNicheName = useCustomNiche
    ? customNiche
    : (NICHE_PRESETS.find(p => p.id === selectedPresetId)?.industry || "");

  const displayedLeads = hasSearched ? searchResults : leads;

  // Se resuelve contra la lista visible: si el Lead abierto ya no está en ella
  // —una búsqueda nueva la reemplazó— la vista vuelve sola a los resultados en
  // lugar de quedarse mostrando un negocio que ya no pertenece a la ejecución.
  const openedLead = openedLeadId
    ? displayedLeads.find((lead) => lead.id === openedLeadId)
    : undefined;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalNiche = useCustomNiche ? customNiche : NICHE_PRESETS.find(p => p.id === selectedPresetId)?.industry;
    if (!finalNiche || !city) return;

    setSearching(true);
    setHasSearched(true);
    setVisibleCount(5);
    setSearchResults([]);
    setReferences([]);
    setUsedFallbackEngine(false);
    setSearchError(null);
    setNoMoreLeadsFound(false);
    setOpenedLeadId(null);
    setShowcaseOpen(false);

    const result = await searchProspects({
      industry: finalNiche,
      location: city,
      designerStyle: designerStyle
    });

    if (result.success) {
      setSearchResults(result.prospects);
      setReferences(result.references);
      setUsedFallbackEngine(result.usedFallbackEngine);

      // Se informa de la búsqueda **que realmente ocurrió**, con sus cifras.
      onSearchCompleted({
        city,
        niche: finalNiche,
        found: result.prospects.length,
        usedFallbackEngine: result.usedFallbackEngine
      });

      if (result.prospects.length > 0) {
        onAddLeads(result.prospects);
      }
    } else {
      setSearchError(result.error);
    }

    setSearching(false);
  };

  const handleSearchMore = async () => {
    const finalNiche = useCustomNiche ? customNiche : NICHE_PRESETS.find(p => p.id === selectedPresetId)?.industry;
    if (!finalNiche || !city) return;

    setSearchingMore(true);
    setSearchError(null);
    setNoMoreLeadsFound(false);

    const excludeNamesList = searchResults.map(p => p.name);
    const result = await searchMoreProspects({
      industry: finalNiche,
      location: city,
      designerStyle: designerStyle,
      excludeNames: excludeNamesList,
      currentReferences: references
    });

    if (result.success) {
      if (result.noMoreLeadsFound) {
        setNoMoreLeadsFound(true);
      } else {
        setSearchResults(prev => [...prev, ...result.prospects]);
        setReferences(result.mergedReferences);

        // **La señal se acumula, no se sustituye.** Los resultados de «Buscar
        // más» se añaden a los anteriores, de modo que si **cualquier** tanda
        // usó el respaldo, la advertencia debe seguir en pie: la lista mostrada
        // contiene análisis heurísticos aunque la última tanda sí usara IA.
        setUsedFallbackEngine(prev => prev || result.usedFallbackEngine);

        // «Buscar más» es otra ejecución contra las APIs: cuenta como búsqueda.
        onSearchCompleted({
          city,
          niche: finalNiche,
          found: result.prospects.length,
          usedFallbackEngine: result.usedFallbackEngine
        });

        onAddLeads(result.prospects);
        setVisibleCount(prev => prev + 5);
      }
    } else {
      setSearchError(result.error);
    }

    setSearchingMore(false);
  };

  // ── Opportunity View ────────────────────────────────────────────────────────
  //
  // Con un Lead abierto, la pantalla **se dedica entera a él**: el formulario de
  // búsqueda y la lista se retiran. Es una vista de detalle, no un panel lateral,
  // porque el desglose del Score necesita el ancho completo para leerse — y
  // porque la atención en la demo debe estar en un único negocio.
  //
  // No hay router en el proyecto y este sprint no introduce uno: la conmutación
  // es la misma técnica que ya usa `App` para sus pestañas.
  if (openedLead) {
    if (showcaseOpen) {
      return (
        <AIShowcase
          lead={openedLead}
          // **Ciudad y nicho solo se transmiten si el negocio procede de la
          // búsqueda en curso.** Un Lead recuperado del almacenamiento local no
          // pertenece a esta ejecución, y atribuirle estos parámetros sería
          // inventar dos datos que nadie comprobó.
          searchContext={
            hasSearched ? { city, niche: activeNicheName } : undefined
          }
          // **`usedFallbackEngine === false` significa que NINGÚN negocio de la
          // tanda usó el respaldo**, de donde se sigue que este tampoco. Es la
          // única inferencia sólida disponible: con la señal activa solo consta
          // que *alguno* lo usó, no cuál, y entonces no se afirma nada.
          engineState={
            hasSearched && !usedFallbackEngine ? "AI_CONFIRMED" : "UNDETERMINED"
          }
          onBack={() => setShowcaseOpen(false)}
        />
      );
    }

    return (
      <OpportunityView
        lead={openedLead}
        onBack={() => setOpenedLeadId(null)}
        onGeneratePitch={onSelectLead}
        onOpenShowcase={() => setShowcaseOpen(true)}
      />
    );
  }

  return (
    <div className="space-y-8" id="lead-hunter-container">
      {/* Intro Header */}
      <SectionHeader
        level="screen"
        icon={<Target className="h-3.5 w-3.5" />}
        eyebrow="Lead Hunter Colombia"
        title="Encuentra negocios reales con deficiencias de conversión"
        lead="El sistema calcula un Opportunity Score para cada negocio y explica la fuga financiera de su sitio actual."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">

        {/* Left Side: Search Form matching screenshot */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6 lg:self-start animate-fade-in" id="sidebar-filters">

          <NicheSelector
            nicheDropdownOpen={nicheDropdownOpen}
            setNicheDropdownOpen={setNicheDropdownOpen}
            setCityDropdownOpen={setCityDropdownOpen}
            useCustomNiche={useCustomNiche}
            customNiche={customNiche}
            selectedPresetId={selectedPresetId}
            setUseCustomNiche={setUseCustomNiche}
            setSelectedPresetId={setSelectedPresetId}
          />

          <CitySelector
            cityDropdownOpen={cityDropdownOpen}
            setCityDropdownOpen={setCityDropdownOpen}
            setNicheDropdownOpen={setNicheDropdownOpen}
            city={city}
            setCity={setCity}
          />

          <DesignStyleConfigPanel
            designerStyle={designerStyle}
            setDesignerStyle={setDesignerStyle}
            showStyleConfig={showStyleConfig}
            setShowStyleConfig={setShowStyleConfig}
            useCustomNiche={useCustomNiche}
            setUseCustomNiche={setUseCustomNiche}
            customNiche={customNiche}
            setCustomNiche={setCustomNiche}
          />

          {/* Big CTA Action Button from Screenshot */}
          <SearchCtaButton searching={searching} onSearch={() => handleSearch()} />

          {/* Preset details tip if using presets */}
          {!useCustomNiche && (
            <Surface level="raised" padding="sm" radius="container" className="space-y-2">
              <span className="text-eyebrow font-bold text-brand uppercase tracking-wide flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                Problemas Comunes Identificados:
              </span>
              <ul className="text-xs text-app-muted space-y-1.5 font-sans">
                {NICHE_PRESETS.find(p => p.id === selectedPresetId)?.commonPainPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-brand mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Surface>
          )}
        </div>

        {/* Right Side: Results & Tracking Dashboard */}
        <div className="lg:col-span-8 space-y-6">

          {/* Real-time search loader animation */}
          {searching && (
            <SearchingLoader
              activeNicheName={activeNicheName}
              city={city}
              scanStep={scanStep}
              scanMessages={scanMessages}
            />
          )}

          {/* Empty State when no searches performed yet */}
          {!searching && displayedLeads.length === 0 && !searchError && (
            <EmptyState
              variant="panel"
              icon={<Search className="h-6 w-6" />}
              title={hasSearched ? "No se encontraron leads" : "Inicia la búsqueda de leads"}
            >
              {hasSearched
                ? `No identificamos negocios de "${activeNicheName}" en ${city} sin sitio web corporativo propio. Intenta con otra combinación de nicho o localización.`
                : "Configura el nicho y la ciudad a la izquierda. AKVEZ buscará en Google Places, analizará cada negocio y calculará su Opportunity Score."}
            </EmptyState>
          )}

          {/* Error Message if search failed */}
          {!searching && searchError && (
            <Callout
              tone="danger"
              icon={<AlertTriangle className="h-5 w-5" />}
              title="Error de búsqueda"
            >
              {searchError}
            </Callout>
          )}

          {/* Results Lists */}
          {displayedLeads.length > 0 && !searching && (
            <div className="space-y-6">
              {/*
                **Declaración del origen del análisis.**

                El texto anterior afirmaba que el sistema «cargaba perfiles
                comerciales de pymes colombianas 100% reales y verificadas» desde
                un «motor certificado de respaldo», y atribuía la causa a Google
                Search Grounding. **Las tres cosas eran falsas**: el respaldo no
                carga ningún perfil —analiza los mismos negocios que devolvió
                Google Places, con reglas heurísticas—, nada está certificado, y
                el adapter de Grounding ni siquiera se construye.

                Presentar una degradación como una función es lo contrario de la
                transparencia. **Lo que cambia cuando el respaldo actúa es el
                origen del análisis, y eso es lo que se declara.**
              */}
              {usedFallbackEngine ? (
                <Callout
                  tone="warn"
                  icon={<AlertTriangle className="h-5 w-5" />}
                  title="Análisis sin IA — motor heurístico de respaldo"
                >
                  <p className="leading-relaxed">
                    El modelo generativo no respondió, y <strong>al menos un negocio de esta lista se analizó con reglas heurísticas en lugar de IA</strong>.
                  </p>
                  <p className="mt-1.5 leading-relaxed text-app-muted">
                    Los negocios <strong>sí son reales</strong>: proceden de Google Places. Lo que no procede del modelo es el <strong>análisis</strong> — la descripción, los problemas detectados y el ángulo de oportunidad se derivaron de la presencia y el estado del sitio web, no de una lectura del negocio.
                  </p>
                </Callout>
              ) : (
                /*
                  **La transparencia es simétrica.** Declarar el respaldo sin
                  declarar nunca el caso normal deja al usuario sin forma de
                  distinguir «IA activa» de «aún no ha pasado nada».
                */
                <Callout tone="intel" icon={<Sparkles className="h-4 w-4" />} size="sm">
                  <strong className="text-intel">Analizado con IA.</strong> Los {displayedLeads.length} negocios de esta lista proceden de Google Places y fueron analizados por el modelo generativo.
                </Callout>
              )}

              <ResultsHeader
                visibleCount={visibleCount}
                totalLeads={displayedLeads.length}
                references={references}
              />

              {/* Grid representation */}
              <div className="grid grid-cols-1 gap-6">
                {displayedLeads.slice(0, visibleCount).map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    isActive={activeLeadId === lead.id}
                    onSelectLead={onSelectLead}
                    onOpenOpportunity={setOpenedLeadId}
                  />
                ))}
              </div>

              {/* Show more / Buscar más leads buttons */}
              <LoadMoreControls
                noMoreLeadsFound={noMoreLeadsFound}
                totalLeads={displayedLeads.length}
                visibleCount={visibleCount}
                onShowMore={() => setVisibleCount(prev => prev + 5)}
                onSearchMore={handleSearchMore}
                searchingMore={searchingMore}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
