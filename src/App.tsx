import React from "react";
import { DesignerProfile, Prospect } from "./types";
import LeadHunter from "./components/LeadHunter";
import PitchGenerator from "./components/PitchGenerator";
import { Sparkles, Search, Send, Compass, Code, Info, Moon, Sliders, ArrowRight, MapPin, Mail, Settings, User, MessageSquare } from "lucide-react";

// Initializing Colombian sample leads for premium instant functionality
const CL_SAMPLE_LEADS: Prospect[] = [
  {
    id: "sample-col-1",
    name: "La Fogata Parrilla - Bogotá",
    website: "lafogataparrillabogota.co",
    description: "Auténtico e histórico restaurante de asados y comida típica colombiana en la sabana de Bogotá. Cuentan con excelentes reseñas y un flujo masivo de clientes presenciales los fines de semana, pero su sitio web tiene más de 8 años de antigüedad.",
    flaws: [
      "El menú para ordenar online es un archivo PDF escaneado de 15MB que tarda más de 20 segundos en descargar en celulares",
      "No tienen botón de reservas disponible ni integración con WhatsApp, obligando al comensal a hacer engorrosas llamadas telefónicas",
      "La tipografía del sitio web tiene poquísimo contraste y el diseño usa colores oscuros opacos que dificultan leer el horario de atención"
    ],
    angle: "Reemplazar el PDF estático por una carta digital interactiva e instantánea adaptada a móviles. Introducir un popup de reserva rápida por WhatsApp para asegurar las cenas de eventos empresariales.",
    status: "Prospect",
    dateCreated: "Jun 5",
    score: 85,
    classification: "🔥 Lead Excelente",
    revenueLoss: "Pierden aproximadamente de 15 a 20 reservas en línea los fines de semana debido a la lentitud del PDF y la falta de contacto directo."
  },
  {
    id: "sample-col-2",
    name: "OdontoEstética Medellín",
    website: "odontoesteticamedellin.com",
    description: "Exitosa clínica dental privada en El Poblado que ofrece servicios de alta gama como diseño de sonrisa y ortodoncia invisible. Su reputación es impecable, pero su portal digital parece una plantilla genérica fría.",
    flaws: [
      "No muestran casos de éxito antes/después ni testimonios reales de pacientes, lo que limita la persuasión indispensable en medicina estética",
      "Carecen de un sistema rápido de agendamiento — el usuario debe llenar un formulario de 10 campos y esperar un correo de respuesta",
      "No es responsive en tablets y pantallas móviles pequeñas, desconfigurando los datos de la dirección física"
    ],
    angle: "Crear una landing page moderna con foco en retratos humanos de alta definición. Añadir testimonios en video optimizados de pacientes reales y un widget conversacional interactivo para reservas instantáneas.",
    status: "Prospect",
    dateCreated: "Jun 4",
    score: 72,
    classification: "✅ Lead Bueno",
    revenueLoss: "Se estima que pierden hasta un 25% de visitas interesadas de Instagram porque el proceso de agendamiento tiene demasiados campos y fricciones."
  }
];

const DEFAULT_PROFILE: DesignerProfile = {
  name: "Estudio Creativo LeadFlow",
  style: "Diseño premium minimalista, elegante, moderno, con fotografía inmersiva de alta fidelidad, colores oscuros limpios y tipografía de autor adaptable a dispositivos móviles.",
  skills: "Webflow, WordPress, Custom React, Tailwind CSS",
  tone: "Empático, cercano, profesional y centrado en aportar valor antes de vender",
  caseStudies: "Especializado en mejorar las tasas de conversión móvil en negocios de gastronomía y salud.",
  targetNiche: "Cafeterías y Restaurantes"
};

export default function App() {
  // Tabs: "hunter" (Lead Hunter) or "pitch" (Pitch Generator)
  const [activeTab, setActiveTab] = React.useState<"hunter" | "pitch">("hunter");

  // State: Leads Scouted in Colombia
  const [leads, setLeads] = React.useState<Prospect[]>(() => {
    const saved = localStorage.getItem("leadflow_leads_v2");
    return saved ? JSON.parse(saved) : CL_SAMPLE_LEADS;
  });

  // State: Designer profile (firm info)
  const [designerProfile, setDesignerProfile] = React.useState<DesignerProfile>(() => {
    const saved = localStorage.getItem("leadflow_designer_v2");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  // State: Designer style used in Colombian Search API
  const [designerStyle, setDesignerStyle] = React.useState<string>(() => {
    return designerProfile.style || "Diseño moderno, limpio, responsive, estética refinada y adaptable a celulares.";
  });

  // Active Selected Lead ID in Pitch Generator
  const [selectedLeadId, setSelectedLeadId] = React.useState<string>(() => {
    return leads.length > 0 ? leads[0].id : "";
  });

  // LocalStorage sync
  React.useEffect(() => {
    localStorage.setItem("leadflow_leads_v2", JSON.stringify(leads));
  }, [leads]);

  React.useEffect(() => {
    localStorage.setItem("leadflow_designer_v2", JSON.stringify(designerProfile));
  }, [designerProfile]);

  // Keep search style preference in sync with profile definition
  React.useEffect(() => {
    setDesignerStyle(designerProfile.style);
  }, [designerProfile.style]);

  // Add search results to Leads Database without duplicating existing names
  const handleAddLeads = (newLeads: Prospect[]) => {
    setLeads((prev) => {
      const filtered = newLeads.filter(
        (nl) => !prev.some((p) => p.name.toLowerCase() === nl.name.toLowerCase())
      );
      const combined = [...filtered, ...prev];
      if (combined.length > 0) {
        setSelectedLeadId(combined[0].id); // Auto-focus the newest one
      }
      return combined;
    });
  };

  const handleUpdateLead = (id: string, updatedFields: Partial<Prospect>) => {
    setLeads((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  // Navigates directly from Hunter trigger button to generator view with selected focus
  const handleSelectLeadContext = (id: string) => {
    setSelectedLeadId(id);
    setActiveTab("pitch");
  };

  return (
    <div className="min-h-screen bg-dark-bg text-app-text font-sans antialiased selection:bg-accent-green/20 selection:text-accent-green flex flex-col">
      
      {/* Global Header matching screenshot */}
      <header className="bg-dark-surface border-b border-app-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Group */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-[#E28A5D] rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                AK
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black font-display uppercase tracking-widest text-app-text text-lg">VEZ</span>
                <span className="text-[10px] text-app-text font-black uppercase tracking-widest px-2.5 py-1 rounded border border-app-border bg-dark-bg/40">
                  PRO
                </span>
              </div>
            </div>

            {/* Live active agent indicator */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-dark-bg/45 border border-app-border/80">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs sm:text-sm text-app-text font-medium font-sans">
                Agente activo <span className="opacity-50">•</span> <strong className="font-semibold text-[#E28A5D]">{leads.length * 11 + 72} oportunidades encontradas</strong>
              </span>
            </div>

            {/* Settings & Profile Icons */}
            <div className="flex items-center gap-3">
              <button type="button" className="p-2.5 rounded-full hover:bg-dark-bg text-app-muted hover:text-app-text transition cursor-pointer">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-full bg-[#E28A5D]/20 border border-[#E28A5D]/30 flex items-center justify-center text-[#E28A5D]">
                <User className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8">
        
        {/* Module Navigation Tabs */}
        <div className="border-b border-app-border pb-px">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("hunter")}
              id="tab-hunter"
              type="button"
              className={`flex items-center gap-2.5 py-4 px-1 border-b-2 text-sm font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "hunter"
                  ? "border-accent-green text-app-text"
                  : "border-transparent text-app-muted hover:text-app-text hover:border-app-border/40"
              }`}
            >
              <MapPin className="w-4 h-4 text-accent-green" />
              <span>Oportunidades</span>
            </button>
            
            <button
              onClick={() => setActiveTab("pitch")}
              id="tab-pitch"
              type="button"
              className={`flex items-center gap-2.5 py-4 px-1 border-b-2 text-sm font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "pitch"
                  ? "border-accent-green text-app-text"
                  : "border-transparent text-app-muted hover:text-app-text hover:border-app-border/40"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-accent-green" />
              <span>Generar mensaje</span>
            </button>
          </div>
        </div>

        {/* Dynamic Context Strategy Compass */}
        <div className="bg-dark-surface border border-app-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Compass className="w-5 h-5 text-[#ff6b35] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-app-text uppercase tracking-widest font-display">BrÚjula del Freelancer</h4>
              <p className="text-xs text-app-muted mt-0.5 leading-relaxed font-sans max-w-3xl">
                {activeTab === "hunter" && "Configura los filtros de nicho y ciudad colombiana, opcionalmente detalla tu estilo de diseño y escanea en tiempo real para extraer leads verificados con alta viabilidad comercial."}
                {activeTab === "pitch" && "Selecciona cualquier lead mapeado en tu buscador y genera una propuesta de outreach hiper-personalizada para Email, LinkedIn o Instagram de baja presión y alto retorno."}
              </p>
            </div>
          </div>

          {activeTab === "hunter" && (
            <button
              onClick={() => setActiveTab("pitch")}
              className="text-xs text-accent-green hover:underline flex items-center gap-1 font-semibold shrink-0 cursor-pointer"
            >
              Ver Generador de Mensajes
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Workspace Display Area */}
        <div className="transition-all duration-300">
          {activeTab === "hunter" ? (
            <LeadHunter
              designerStyle={designerStyle}
              setDesignerStyle={setDesignerStyle}
              leads={leads}
              onAddLeads={handleAddLeads}
              onSelectLead={handleSelectLeadContext}
              activeLeadId={selectedLeadId}
            />
          ) : (
            <PitchGenerator
              leads={leads}
              designerProfile={designerProfile}
              setDesignerProfile={setDesignerProfile}
              selectedLeadId={selectedLeadId}
              onSelectLeadId={setSelectedLeadId}
              onUpdateLead={handleUpdateLead}
              onNavigateToHunter={() => setActiveTab("hunter")}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-dark-surface border-t border-app-border py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-app-muted">
          <p className="font-sans">
            © 2026 LeadFlow Colombia Suite. Todas las comunicaciones generadas cumplen normas de contacto profesional ético.
          </p>
          <div className="flex items-center gap-1 font-mono">
            <Code className="w-3.5 h-3.5 text-accent-green" />
            Bautizado con Google Gemini en Español
          </div>
        </div>
      </footer>

    </div>
  );
}
