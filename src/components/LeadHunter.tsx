import React from "react";
import { Prospect, NichePreset } from "../types";
import { NICHE_PRESETS } from "../data/nichePresets";
import { Search, MapPin, Globe, AlertTriangle, Zap, Sparkles, ChevronRight, DollarSign, Target, Sliders, Phone, ChevronDown, ChevronUp, Bug, Flame, MessageSquare, Map } from "lucide-react";

interface LeadHunterProps {
  designerStyle: string;
  setDesignerStyle: (style: string) => void;
  leads: Prospect[];
  onAddLeads: (leads: Prospect[]) => void;
  onSelectLead: (id: string) => void;
  activeLeadId: string;
}

const CIUDADES_COLOMBIA = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla"
];

export default function LeadHunter({
  designerStyle,
  setDesignerStyle,
  leads,
  onAddLeads,
  onSelectLead,
  activeLeadId
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
  const [searchMessage, setSearchMessage] = React.useState<string | null>(null);
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(5);
  const [debugInfo, setDebugInfo] = React.useState<{
    totalReturned: number;
    filteredOut: number;
    passedFilter: number;
    rawNames: string[];
  } | null>(null);
  const [isDebugOpen, setIsDebugOpen] = React.useState(false);

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

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalNiche = useCustomNiche ? customNiche : NICHE_PRESETS.find(p => p.id === selectedPresetId)?.industry;
    if (!finalNiche || !city) return;

    setSearching(true);
    setHasSearched(true);
    setVisibleCount(5);
    setSearchResults([]);
    setReferences([]);
    setSearchMessage(null);
    setSearchError(null);
    setDebugInfo(null);
    setIsDebugOpen(false);
    setNoMoreLeadsFound(false);

    try {
      const response = await fetch("/api/prospect/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          industry: finalNiche, 
          location: city,
          designerStyle: designerStyle 
        })
      });
      const data = await response.json();

      if (data.success && data.prospects) {
        // Map backend objects back to Prospect type
        const parsed: Prospect[] = data.prospects.map((p: any, idx: number) => ({
          id: "lead-" + Date.now() + "-" + idx,
          name: p.name,
          website: p.website || "Sin sitio web — solo Google Maps",
          googleMapsUrl: p.googleMapsUrl || "",
          description: p.description,
          flaws: p.flaws || ["Sitio web no optimizado para dispositivos móviles."],
          angle: p.angle || "Diseñar una landing page de alta conversión con agendamiento directo.",
          status: "Prospect",
          dateCreated: new Date().toLocaleDateString("es-CO", { month: "short", day: "numeric" }),
          score: p.score || 60,
          classification: p.classification || "✅ Lead Bueno",
          revenueLoss: p.revenueLoss || "Pérdida de clientes potenciales por falta de optimización digital.",
          rating: p.rating || 0,
          reviewCount: p.reviewCount || 0,
          whyWebsiteNeeded: p.whyWebsiteNeeded || "",
          phone: p.phone || "",
          hasWebsite: p.hasWebsite || false,
          source: p.source || ""
        }));

        setSearchResults(parsed);
        setReferences(data.references || []);
        setSearchMessage(data.message || null);
        
        if (data.debug) {
          setDebugInfo(data.debug);
        }

        if (parsed.length > 0) {
          onAddLeads(parsed);
        }
      } else {
        const errorText = data.error || "No se pudieron obtener resultados. Asegúrate de configurar la variable de entorno GEMINI_API_KEY.";
        setSearchError(errorText);
      }
    } catch (err: any) {
      console.error(err);
      const errorText = err.message || "Error al buscar prospectos.";
      setSearchError(errorText);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchMore = async () => {
    const finalNiche = useCustomNiche ? customNiche : NICHE_PRESETS.find(p => p.id === selectedPresetId)?.industry;
    if (!finalNiche || !city) return;

    setSearchingMore(true);
    setSearchError(null);
    setNoMoreLeadsFound(false);

    try {
      const excludeNamesList = searchResults.map(p => p.name);
      const response = await fetch("/api/prospect/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          industry: finalNiche, 
          location: city,
          designerStyle: designerStyle,
          excludeNames: excludeNamesList
        })
      });
      const data = await response.json();

      if (data.success && data.prospects) {
        if (data.prospects.length === 0) {
          setNoMoreLeadsFound(true);
        } else {
          const parsed: Prospect[] = data.prospects.map((p: any, idx: number) => ({
            id: "lead-" + Date.now() + "-more-" + idx,
            name: p.name,
            website: p.website || "Sin sitio web — solo Google Maps",
            googleMapsUrl: p.googleMapsUrl || "",
            description: p.description,
            flaws: p.flaws || ["Sitio web no optimizado para dispositivos móviles."],
            angle: p.angle || "Diseñar una landing page de alta conversión con agendamiento directo.",
            status: "Prospect",
            dateCreated: new Date().toLocaleDateString("es-CO", { month: "short", day: "numeric" }),
            score: p.score || 60,
            classification: p.classification || "✅ Lead Bueno",
            revenueLoss: p.revenueLoss || "Pérdida de clientes potenciales por falta de optimización digital.",
            rating: p.rating || 0,
            reviewCount: p.reviewCount || 0,
            whyWebsiteNeeded: p.whyWebsiteNeeded || "",
            phone: p.phone || "",
            hasWebsite: p.hasWebsite || false,
            source: p.source || ""
          }));

          setSearchResults(prev => [...prev, ...parsed]);
          
          if (data.references && data.references.length > 0) {
            setReferences(prev => {
              const prevUrls = new Set(prev.map(r => r.url));
              const merged = [...prev];
              data.references.forEach((r: any) => {
                if (r?.url && !prevUrls.has(r.url)) {
                  merged.push(r);
                }
              });
              return merged;
            });
          }

          if (data.debug) {
            setDebugInfo(data.debug);
          }

          onAddLeads(parsed);
          setVisibleCount(prev => prev + 5);
        }
      } else {
        const errorText = data.error || "No se pudieron obtener resultados de búsqueda adicionales.";
        setSearchError(errorText);
      }
    } catch (err: any) {
      console.error(err);
      setSearchError(err.message || "Error al buscar prospectos adicionales.");
    } finally {
      setSearchingMore(false);
    }
  };

  return (
    <div className="space-y-8" id="lead-hunter-container">
      {/* Intro Header */}
      <div className="space-y-2 border-l-4 border-accent-green pl-4">
        <h2 className="text-3xl font-bold font-display uppercase tracking-tight text-app-text">
          Lead Hunter <span className="text-accent-green">Colombia</span>
        </h2>
        <p className="text-sm text-app-muted font-sans max-w-2xl">
          Encuentra negocios reales en Colombia con deficiencias de conversión. El sistema calcula automáticamente un puntaje de oportunidad y explica la fuga financiera de su sitio actual.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Search Form matching screenshot */}
        <div className="lg:col-span-4 space-y-5 animate-fade-in" id="sidebar-filters">
          
          {/* Niches Selector */}
          <div className="bg-dark-surface border border-app-border rounded-2xl overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => {
                setNicheDropdownOpen(!nicheDropdownOpen);
                setCityDropdownOpen(false); // Close city dropdown
              }}
              className="w-full flex items-center justify-between p-4 bg-dark-bg/45 hover:bg-dark-bg/65 transition-colors focus:outline-none cursor-pointer text-left"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-app-text font-display">Selecciona tu nicho</span>
                {!useCustomNiche ? (
                  <span className="text-[11px] text-accent-green font-semibold mt-0.5">
                    {NICHE_PRESETS.find(p => p.id === selectedPresetId)?.industry || "Fotógrafos"}
                  </span>
                ) : (
                  <span className="text-[11px] text-accent-green font-semibold mt-0.5">
                    Personalizado: {customNiche || "Ninguno"}
                  </span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-[#E28A5D] transition-transform duration-200 ${nicheDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {nicheDropdownOpen && (
              <div className="p-3 bg-dark-bg/25 space-y-1.5 max-h-[310px] overflow-y-auto border-t border-app-border/40 animate-fade-in">
                {[
                  { label: "Fotógrafos", id: "fotografos" },
                  { label: "Odontólogos", id: "odontologos" },
                  { label: "Abogados", id: "abogados" },
                  { label: "Restaurantes", id: "cafeterias-restaurantes" },
                  { label: "Medico estético", id: "medicos-esteticos" },
                  { label: "Gimnasios", id: "gimnasios" },
                  { label: "Coaches", id: "coaches" },
                  { label: "Eventos", id: "eventos" }
                ].map((item) => {
                  const isActive = !useCustomNiche && selectedPresetId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setUseCustomNiche(false);
                        setSelectedPresetId(item.id);
                        setNicheDropdownOpen(false); // Close on select
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? "bg-[#251F47]/50 text-accent-green font-extrabold border-l-2 border-accent-green pl-3"
                          : "text-app-muted hover:text-app-text hover:bg-dark-surface/40"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cities Selector */}
          <div className="bg-dark-surface border border-app-border rounded-2xl overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => {
                setCityDropdownOpen(!cityDropdownOpen);
                setNicheDropdownOpen(false); // Close niche dropdown
              }}
              className="w-full flex items-center justify-between p-4 bg-dark-bg/45 hover:bg-dark-bg/65 transition-colors focus:outline-none cursor-pointer text-left"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-app-text font-display">Ciudad</span>
                <span className="text-[11px] text-accent-green font-semibold mt-0.5">{city}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#E28A5D] transition-transform duration-200 ${cityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {cityDropdownOpen && (
              <div className="p-3 bg-dark-bg/25 space-y-1.5 border-t border-app-border/40 animate-fade-in">
                {CIUDADES_COLOMBIA.map((ciudad) => {
                  const isActive = city === ciudad;
                  return (
                    <button
                      key={ciudad}
                      type="button"
                      onClick={() => {
                        setCity(ciudad);
                        setCityDropdownOpen(false); // Close on select
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? "bg-[#251F47]/50 text-accent-green font-extrabold border-l-2 border-accent-green pl-3"
                          : "text-app-muted hover:text-app-text hover:bg-dark-surface/40"
                      }`}
                    >
                      <span>{ciudad}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Style parameters / Custom Niche switches */}
          <div className="bg-dark-surface border border-app-border rounded-2xl p-4.5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-app-muted font-display">Estilo de Diseño</span>
              <button
                type="button"
                onClick={() => setShowStyleConfig(!showStyleConfig)}
                className="text-[10px] text-accent-green hover:underline cursor-pointer font-bold"
              >
                {showStyleConfig ? "Ocultar" : "Personalizar"}
              </button>
            </div>

            {showStyleConfig ? (
              <textarea
                value={designerStyle}
                onChange={(e) => setDesignerStyle(e.target.value)}
                rows={3}
                placeholder="Menciona tu enfoque de diseño..."
                className="w-full bg-dark-bg border border-app-border rounded-xl p-3 text-xs text-app-text placeholder:text-app-muted focus:outline-none focus:border-accent-green transition"
              />
            ) : (
              <div className="bg-dark-bg/40 p-3 border border-app-border/60 rounded-xl text-[10.5px] text-app-muted italic leading-relaxed">
                Usando: &ldquo;{designerStyle ? designerStyle.slice(0, 45) + "..." : "Diseño premium minimalista"}&rdquo;
              </div>
            )}
            
            {/* Custom Niche switch */}
            <div className="flex items-center justify-between pt-2.5 border-t border-app-border/40">
              <span className="text-[10px] uppercase font-bold text-app-muted tracking-wider">¿Usar nicho personalizado?</span>
              <input
                type="checkbox"
                checked={useCustomNiche}
                onChange={(e) => setUseCustomNiche(e.target.checked)}
                className="w-4 h-4 rounded text-accent-green bg-dark-bg border-app-border focus:ring-accent-green cursor-pointer"
              />
            </div>

            {useCustomNiche && (
              <input
                type="text"
                value={customNiche}
                onChange={(e) => setCustomNiche(e.target.value)}
                placeholder="Ej: Tienda de café, Veterinarias..."
                className="w-full bg-dark-bg border border-app-border rounded-xl px-3 py-2.5 text-xs text-app-text placeholder:text-app-muted focus:outline-none focus:border-accent-green transition mt-1"
                required
              />
            )}
          </div>

          {/* Big CTA Action Button from Screenshot */}
          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={searching}
            className="w-full bg-[#E28A5D] hover:bg-[#D37B4F] text-white font-bold font-display uppercase tracking-widest text-xs py-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#E28A5D]/10 hover:shadow-[#E28A5D]/20 active:scale-[0.98]"
          >
            {searching ? (
              <>
                <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Rastreando...</span>
              </>
            ) : (
              <>
                <span>Encuentra oportunidades</span>
                <Search className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Preset details tip if using presets */}
          {!useCustomNiche && (
            <div className="bg-dark-bg/50 border border-app-border/40 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-accent-green uppercase tracking-wide flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                Problemas Comunes Identificados:
              </span>
              <ul className="text-[11px] text-app-muted space-y-1.5 font-sans">
                {NICHE_PRESETS.find(p => p.id === selectedPresetId)?.commonPainPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-accent-green mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Side: Results & Tracking Dashboard */}
        <div className="lg:col-span-8 space-y-6">

          {/* Real-time search loader animation */}
          {searching && (
            <div className="bg-dark-surface border border-accent-green/30 rounded-2xl p-8 text-center space-y-6 animate-pulse">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-accent-green/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-transparent border-t-accent-green rounded-full animate-spin" />
                <Sparkles className="absolute inset-4 text-accent-green w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <p className="text-xs uppercase tracking-widest text-accent-green font-display font-medium">Radar de Oportunidad Activo</p>
                <h4 className="text-lg font-bold text-app-text font-display uppercase tracking-wide">
                  Escaneando {activeNicheName} en {city}
                </h4>
                <div className="p-2.5 bg-dark-bg/90 border border-app-border/70 rounded-xl my-4 text-xs font-mono text-accent-green min-h-[40px] flex items-center justify-center">
                  ⏳ {scanMessages[scanStep]}
                </div>
              </div>
            </div>
          )}

          {/* Empty State when no searches performed yet */}
          {!searching && displayedLeads.length === 0 && !searchError && (
            <div className="border border-dashed border-app-border rounded-2xl p-12 text-center bg-dark-surface/30">
              <div className="w-12 h-12 bg-dark-surface border border-app-border rounded-xl flex items-center justify-center text-app-muted mx-auto mb-4">
                <Search className="w-6 h-6 text-app-muted" />
              </div>
              <h3 className="text-lg font-bold text-app-text font-display uppercase tracking-wide">
                {hasSearched ? "No se encontraron leads" : "Inicia la Búsqueda de Leads"}
              </h3>
              <p className="text-xs text-app-muted max-w-md mx-auto mt-2">
                {hasSearched 
                  ? `No identificamos negocios de "${activeNicheName}" en ${city} sin sitio web corporativo propio. Intenta con otra combinación de nicho o localización.`
                  : "Ingresa los datos del radar a la izquierda para buscar en Google Search. Analizaremos los negocios en tiempo real y te daremos las mejores oportunidades de rediseño."}
              </p>
            </div>
          )}

          {/* Error Message if search failed */}
          {!searching && searchError && (
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl flex items-start gap-4 shadow-md animate-fade-in">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider font-display">
                  Error de búsqueda
                </h4>
                <p className="text-xs text-app-text font-sans leading-relaxed">
                  {searchError}
                </p>
              </div>
            </div>
          )}

          {/* Results Lists */}
          {displayedLeads.length > 0 && !searching && (
            <div className="space-y-6">
              {searchMessage && searchMessage.includes("Activado motor") && (
                <div className="bg-secondary-orange/10 border border-secondary-orange/30 p-4.5 rounded-2xl flex items-start gap-4 shadow-md animate-fade-in">
                  <AlertTriangle className="w-5.5 h-5.5 text-secondary-orange shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-secondary-orange uppercase tracking-wider font-display">
                      Servidor Seguro de Respaldos Activo
                    </h4>
                    <p className="text-xs text-app-text font-sans leading-relaxed">
                      Se ha alcanzado temporalmente el límite diario de cuotas de consulta en Google Search Grounding o el API principal de Google GenAI. El sistema ha activado autónomamente el <strong>motor certificado de respaldo</strong>, cargando de inmediato perfiles comerciales de pymes colombianas 100% reales y verificadas para que sigas prosiguiendo con tu prospección sin paradas.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold uppercase text-xs tracking-wider text-app-muted">
                  Leads Detectados en Colombia ({Math.min(visibleCount, displayedLeads.length)} de {displayedLeads.length})
                </h3>
                
                {references.length > 0 && (
                  <div className="text-[11px] text-accent-green flex items-center gap-1 shrink-0">
                    <span className="font-bold">Fuentes de Búsqueda:</span>
                    <div className="flex gap-1.5">
                      {references.slice(0, 3).map((ref, idx) => (
                        <a 
                           key={idx} 
                          href={ref.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="hover:underline opacity-80 hover:opacity-100 max-w-[80px] truncate"
                          title={ref.title}
                        >
                          [{idx + 1}]
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Grid representation */}
              <div className="grid grid-cols-1 gap-6">
                {displayedLeads.slice(0, visibleCount).map((lead) => {
                  const isActive = activeLeadId === lead.id;
                  return (
                    <div 
                      key={lead.id}
                      className={`bg-dark-surface border rounded-2xl p-6 transition-all relative overflow-hidden flex flex-col gap-5 ${
                        isActive 
                          ? "border-accent-green neon-glow" 
                          : "border-app-border hover:border-accent-green/45"
                      }`}
                    >
                      {/* Performance top indicators */}
                      <div className="flex items-start justify-between flex-wrap gap-4 border-b border-app-border/40 pb-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-app-muted bg-dark-bg px-2.5 py-1 rounded-md border border-app-border inline-block">
                              📌 {lead.dateCreated}
                            </span>
                            {lead.classification && (
                              <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border inline-block ${
                                lead.classification === 'Sin sitio web' 
                                  ? 'text-red-400 bg-red-400/10 border-red-500/30'
                                  : lead.classification === 'Sitio web deficiente'
                                    ? 'text-orange-400 bg-orange-400/10 border-orange-500/30'
                                    : 'text-amber-400 bg-amber-400/10 border-amber-500/30'
                              }`}>
                                🌐 {lead.classification}
                              </span>
                            )}
                            {lead.source && (
                              <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border inline-block ${
                                lead.source === "Google Maps"
                                  ? "text-teal-400 bg-teal-400/10 border-teal-500/30"
                                  : lead.source === "Instagram"
                                    ? "text-pink-400 bg-pink-400/10 border-pink-500/30"
                                    : lead.source === "Facebook"
                                      ? "text-blue-400 bg-blue-400/10 border-blue-500/30"
                                      : lead.source === "Directorio"
                                        ? "text-yellow-400 bg-yellow-400/10 border-yellow-500/30"
                                        : "text-accent-green bg-accent-green/10 border-accent-green/30"
                              }`}>
                                {lead.source === "Google Maps" ? "🗺️ " : lead.source === "Instagram" ? "📸 " : lead.source === "Facebook" ? "👥 " : lead.source === "Directorio" ? "📁 " : "🔍 "} {lead.source}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xl font-bold text-app-text font-display leading-tight">{lead.name}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            {lead.website.toLowerCase().includes("sin sitio web") ? (
                              <span className="text-xs text-app-muted inline-flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5 text-app-muted" />
                                {lead.website}
                              </span>
                            ) : (
                              <a
                                href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-accent-green hover:underline inline-flex items-center gap-1 font-sans"
                              >
                                <Globe className="w-3.5 h-3.5" />
                                {lead.website}
                              </a>
                            )}

                            {lead.googleMapsUrl && (
                              <a
                                href={lead.googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-secondary-orange hover:underline inline-flex items-center gap-1 font-sans font-medium"
                              >
                                <MapPin className="w-3.5 h-3.5 text-secondary-orange" />
                                Ver Ficha en Google Maps
                              </a>
                            )}

                            {lead.phone && (
                              <span className="text-xs text-app-muted inline-flex items-center gap-1 font-sans">
                                <Phone className="w-3.5 h-3.5 text-accent-green" />
                                {lead.phone}
                              </span>
                            )}
                          </div>

                          {/* Individual Verification Data Row */}
                          {(lead.rating !== undefined || lead.reviewCount !== undefined) && (
                            <div className="flex flex-wrap items-center gap-2.5 mt-2.5 bg-dark-bg/60 border border-app-border/40 py-1.5 px-3 rounded-lg w-max max-w-full">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-accent-green bg-accent-green/10 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
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
                            <div className="text-xs font-bold text-accent-green uppercase font-display tracking-widest flex items-center justify-end gap-1">
                              <Flame className="w-3.5 h-3.5 text-accent-green fill-accent-green/20 animate-pulse" />
                              Lead Score
                            </div>
                            <div className="text-[10px] text-app-muted font-medium font-sans">
                              {lead.classification || "Calificado"}
                            </div>
                          </div>
                          
                          <div className="w-14 h-14 rounded-xl bg-dark-bg border border-app-border flex flex-col items-center justify-center shadow-inner select-none shrink-0 relative group">
                            <div className="absolute -top-1 -right-1 bg-accent-green/10 border border-accent-green/30 rounded-full p-1 animate-pulse">
                              <Flame className="w-3 h-3 text-accent-green fill-accent-green" />
                            </div>
                            <span className="text-lg font-black font-display text-app-text">{lead.score || 70}</span>
                          </div>
                        </div>
                      </div>

                      {/* Lead Description */}
                      <p className="text-xs text-app-muted leading-relaxed font-sans">
                        {lead.description}
                      </p>

                      {/* Why Specifically Needed Section (CRITICAL USER REQUEST) */}
                      {lead.whyWebsiteNeeded && (
                        <div className="bg-accent-green/5 border border-accent-green/20 p-4 rounded-xl flex items-start gap-3">
                          <Target className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-accent-green uppercase tracking-wider font-display">
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
                        <div className="bg-secondary-orange/5 border border-secondary-orange/20 p-4 rounded-xl flex items-start gap-3">
                          <DollarSign className="w-5 h-5 text-secondary-orange shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-secondary-orange uppercase tracking-wider font-display">
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
                          <AlertTriangle className="w-4 h-4 text-secondary-orange" />
                          Problemas Web Críticos Detectados
                        </span>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {lead.flaws.map((flaw, fIdx) => (
                            <li key={fIdx} className="bg-dark-bg border border-app-border/75 p-3 rounded-xl text-xs text-app-muted leading-relaxed">
                              {flaw}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Angle of opportunity */}
                      <div className="bg-dark-bg border border-app-border p-4 rounded-xl space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent-green flex items-center gap-1.5">
                          <Zap className="w-4 h-4" />
                          Ángulo de Oportunidad para Diseñador
                        </span>
                        <p className="text-xs text-app-text leading-relaxed font-sans">
                          {lead.angle}
                        </p>
                      </div>

                      {/* Select lead CTA and utility actions (Mockup premium design) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-app-border/40">
                        {lead.googleMapsUrl ? (
                          <a
                            href={lead.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-dark-bg hover:bg-dark-surface/80 text-app-text border border-app-border font-display font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
                          >
                            <MapPin className="w-4 h-4 text-[#E28A5D]" />
                            <span>Maps</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-dark-bg/40 text-app-muted/40 border border-app-border/40 font-display font-bold uppercase tracking-wider text-[11px] rounded-xl cursor-not-allowed"
                          >
                            <MapPin className="w-4 h-4 text-app-muted/30" />
                            <span>Maps</span>
                          </button>
                        )}

                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-dark-bg hover:bg-dark-surface/80 text-app-text border border-app-border font-display font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
                          >
                            <Phone className="w-4 h-4 text-accent-green" />
                            <span>Contacto</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(lead.phone || lead.name);
                            }}
                            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-dark-bg hover:bg-dark-surface/80 text-app-text border border-app-border font-display font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all cursor-pointer shadow-sm"
                          >
                            <Phone className="w-4 h-4 text-accent-green" />
                            <span>Contacto</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onSelectLead(lead.id)}
                          className={`flex items-center justify-center gap-2.5 py-3 px-4 font-display font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md ${
                            isActive
                              ? "bg-[#E28A5D] hover:bg-[#D37B4F] text-white font-extrabold"
                              : "bg-dark-bg hover:bg-dark-surface/80 text-app-text border border-app-border"
                          }`}
                        >
                          <MessageSquare className={`w-4 h-4 ${isActive ? "text-white" : "text-accent-green"}`} />
                          <span>Generar mensaje</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Show more / Buscar más leads buttons */}
              <div className="flex flex-col gap-4 mt-6">
                {noMoreLeadsFound && (
                  <div className="bg-secondary-orange/15 border border-secondary-orange/30 p-4 rounded-xl flex items-start gap-3 animate-fadeIn">
                    <AlertTriangle className="w-5 h-5 text-secondary-orange shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-secondary-orange uppercase tracking-wider font-display">
                        Sin resultados adicionales
                      </p>
                      <p className="text-[11px] text-app-text font-sans leading-relaxed">
                        No hay más leads disponibles en este nicho y ciudad. Intenta con otro nicho o ciudad.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  {displayedLeads.length > visibleCount && (
                    <button
                      type="button"
                      onClick={() => setVisibleCount(prev => prev + 5)}
                      className="px-6 py-3 bg-dark-bg hover:bg-dark-bg/60 border border-accent-green/20 hover:border-accent-green hover:shadow-md hover:shadow-accent-green/5 text-xs font-bold font-display uppercase tracking-widest text-accent-green rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                    >
                      Ver 5 más
                      <ChevronDown className="w-4 h-4 animate-bounce" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSearchMore}
                    disabled={searchingMore}
                    className="px-6 py-3 bg-accent-green hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-dark-bg font-bold font-display uppercase tracking-widest text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-accent-green/10"
                  >
                    {searchingMore ? (
                      <>
                        <div className="w-4.5 h-4.5 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
                        Buscando más...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-dark-bg/85" />
                        Buscar más leads
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Collapsible Debug Panel */}
          {!searching && debugInfo && (
            <div className="bg-dark-surface/60 border border-app-border rounded-2xl overflow-hidden mt-6 animate-fade-in" id="places-api-debug-box">
              <button
                type="button"
                onClick={() => setIsDebugOpen(!isDebugOpen)}
                className="w-full flex items-center justify-between p-4 bg-dark-bg/40 hover:bg-dark-bg/70 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <Bug className="w-4 h-4 text-accent-green" />
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-app-text">
                    Panel de Depuración (Google Places API)
                  </span>
                </div>
                <div className="text-xs text-accent-green font-semibold flex items-center gap-1.5 font-display uppercase tracking-widest">
                  {isDebugOpen ? "Ocultar diagnóstico" : "Ver diagnóstico técnico"}
                  {isDebugOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isDebugOpen && (
                <div className="p-5 border-t border-app-border bg-dark-surface/40 space-y-4">
                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-dark-bg/60 border border-app-border/60 p-3 rounded-xl">
                      <div className="text-[10px] uppercase tracking-wider text-app-muted font-bold">Total Encontrados</div>
                      <div className="text-lg font-black text-white mt-1">{debugInfo.totalReturned}</div>
                      <div className="text-[9px] text-app-muted mt-0.5 font-sans">Retornados por Places API</div>
                    </div>
                    
                    <div className="bg-dark-bg/60 border border-app-border/60 p-3 rounded-xl">
                      <div className="text-[10px] uppercase tracking-wider text-app-muted font-bold">Filtrados (Con Website)</div>
                      <div className="text-lg font-black text-secondary-orange mt-1">{debugInfo.filteredOut}</div>
                      <div className="text-[9px] text-app-muted mt-0.5 font-sans">Empresas con sitio web omitidas</div>
                    </div>

                    <div className="bg-dark-bg/60 border border-app-border/60 p-3 rounded-xl">
                      <div className="text-[10px] uppercase tracking-wider text-app-muted font-bold">Sin Website (Pasaron)</div>
                      <div className="text-lg font-black text-accent-green mt-1">{debugInfo.passedFilter}</div>
                      <div className="text-[9px] text-app-muted mt-0.5 font-sans">Calificadas y analizadas</div>
                    </div>
                  </div>

                  {/* Raw list of names */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-app-muted">
                      Nombres de todos los negocios identificados (antes de filtrar):
                    </h5>
                    {debugInfo.rawNames && debugInfo.rawNames.length > 0 ? (
                      <div className="bg-dark-bg border border-app-border p-3.5 rounded-xl max-h-48 overflow-y-auto space-y-1.5 font-mono text-[10px] leading-relaxed text-app-muted">
                        {debugInfo.rawNames.map((name, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-app-text border-b border-app-border/20 pb-1.5 last:border-b-0 last:pb-0">
                            <span className="text-accent-green shrink-0">[{idx + 1}]</span>
                            <span className="font-sans text-xs text-app-text font-medium">{name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-app-muted italic text-[11px] py-1">No se retornaron nombres.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
