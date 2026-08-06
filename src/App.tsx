import React from "react";
import { DesignerProfile, Prospect, SearchSummary } from "./shared/types";
import LeadHunter from "./modules/lead-hunter/presentation/LeadHunter";
import LeadLibrary from "./modules/lead-hunter/presentation/LeadLibrary";
import PitchGenerator from "./modules/pitch-generator/presentation/PitchGenerator";
import ExecutiveDashboard from "./modules/dashboard/presentation/ExecutiveDashboard";
import { Compass, Code, ArrowRight, MapPin, Settings, User, MessageSquare, Library, LayoutDashboard } from "lucide-react";

// ── DATOS DE EJEMPLO — NO SON RESULTADOS REALES ─────────────────────────────
//
// Se cargan **solo cuando no hay nada guardado**, para que la aplicación no
// arranque vacía. **Cada uno lleva `isDemo: true`**, y la interfaz los rotula
// como ejemplo allí donde se muestran.
//
// **La marca no es decorativa:** sin ella, un Lead inventado —con score,
// clasificación y problemas detectados— es indistinguible de uno devuelto por
// una búsqueda real. **Ningún Lead procedente del servidor lleva `isDemo`.**
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
    isDemo: true,
    status: "Prospect",
    dateCreated: "Jun 5",
    score: 85,
    classification: "Sitio web deficiente",
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
    isDemo: true,
    status: "Prospect",
    dateCreated: "Jun 4",
    score: 72,
    classification: "Sitio web deficiente",
    revenueLoss: "El proceso de agendamiento pide diez campos y respuesta por correo, de modo que las visitas que llegan desde Instagram se pierden antes de completarlo."
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
  // Vistas: "hunter" (Workspace), "library" (Biblioteca, P-08) o "pitch".
  //
  // APS-04 §A.3.4 distingue Workspace y Biblioteca, y son dos vistas distintas
  // por decisión vinculante: el Workspace muestra «el resultado de una
  // ejecución» y la Biblioteca contiene «todo». Por eso el Workspace conserva su
  // estado local y la Biblioteca lee siempre del servidor.
  //
  // **Se abre por «Oportunidades», no por el Panel.**
  //
  // Un panel resume trabajo acumulado, y en el minuto cero no hay ninguno: sus
  // cifras mayores son un cero y unos doses. **Abrir así comunica vacío antes
  // que valor.** El Hunter abre enseñando que basta con elegir nicho y ciudad,
  // que es la propuesta de valor sin una sola frase de marketing.
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "hunter" | "library" | "pitch">("hunter");

  /**
   * Búsquedas ejecutadas en esta sesión.
   *
   * ⚠️ **Es lo único que este sprint añade y que antes no existía.** No es
   * telemetría del backend ni un histórico persistido: **vive en memoria y
   * muere con la pestaña.** Cuenta ejecuciones reales, nunca estimadas, y el
   * panel lo rotula como recuento de sesión.
   */
  const [searchHistory, setSearchHistory] = React.useState<SearchSummary[]>([]);

  /** Negocio que el panel pide abrir en la Opportunity View del Hunter. */
  const [requestedLeadId, setRequestedLeadId] = React.useState<string | null>(null);

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

  /** Desde el panel: abre un negocio en la Opportunity View del Hunter. */
  const handleOpenOpportunity = (id: string) => {
    setSelectedLeadId(id);
    setRequestedLeadId(id);
    setActiveTab("hunter");
  };

  return (
    <div className="min-h-screen bg-dark-bg text-app-text font-sans antialiased selection:bg-brand/20 selection:text-brand flex flex-col">
      
      {/* Global Header matching screenshot */}
      <header className="bg-dark-surface border-b border-app-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/*
              **Logotipo — H-08 · el tratamiento de la referencia.**

              Eran **tres objetos**: un círculo naranja con «AK», la palabra
              «VEZ» aparte con `tracking-widest`, y un chip «PRO». El ojo tenía
              que ensamblarlos para leer una marca, y el resultado se leía
              literalmente partido: «AK VEZ».

              Ahora es **una sola palabra con la V en naranja** — que es donde
              vive el acento de la marca y el único sitio del producto donde
              sobrevive la tipografía con carácter. Más presencia, mejor lectura
              y una personalidad que el ensamblaje anterior no tenía.
            */}
            <div className="flex items-center gap-3">
              <span className="font-brand text-2xl font-bold tracking-tight text-app-text">
                AK<span className="text-brand">V</span>EZ
              </span>
              <span className="rounded-control border border-app-border bg-surface-raised px-2 py-0.5 font-sans text-eyebrow font-bold uppercase tracking-widest text-app-muted">
                Pro
              </span>
            </div>

            {/* Live active agent indicator */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-raised/45 border border-app-border/80">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
              </span>
              {/*
                ⚠️ **Aquí había una cifra fabricada:** `leads.length * 11 + 72`.

                Era el único dato inventado que quedaba en AKVEZ, y estaba en el
                sitio de mayor exposición del producto: la cabecera, visible en
                las cinco pantallas y durante toda la demo. **Era también la
                primera cifra que un jurado leía.**

                Se sustituye por el **recuento real** de negocios en el espacio
                de trabajo — el mismo número que el usuario puede comprobar
                contando tarjetas. La escala se insinúa con lo que hay, no con
                una multiplicación.
              */}
              <span className="text-xs sm:text-sm text-app-text font-medium font-sans">
                Agente activo <span className="opacity-50">•</span>{" "}
                <strong className="font-semibold text-brand">
                  {leads.length} {leads.length === 1 ? "negocio" : "negocios"} en tu espacio de trabajo
                </strong>
              </span>
            </div>

            {/* Settings & Profile Icons */}
            <div className="flex items-center gap-3">
              <button type="button" className="p-2.5 rounded-full hover:bg-surface-raised text-app-muted hover:text-app-text transition cursor-pointer">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand">
                <User className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="flex max-w-7xl w-full mx-auto flex-col px-4 sm:px-6 lg:px-8 py-10 flex-grow gap-10">
        
        {/*
          **El orden de las pestañas ES el orden de la historia.**

          Antes empezaba por «Panel» — un resumen de trabajo acumulado que en el
          minuto cero está vacío, y que responde «¿qué ha pasado aquí?» antes de
          que nadie se haya preguntado «¿para qué sirve esto?».

          Ahora el recorrido va **descubrimiento → acción → consecuencia**:

              Oportunidades  · se encuentran negocios reales
              Generar mensaje · se contacta con uno
              Panel          · lo que queda después de hacerlo varias veces
              Biblioteca     · el archivo

          El Panel no desaparece: **cambia de significado por cambiar de sitio**.
          Al final se lee como «esto se acumula»; al principio se leía como
          «esto está vacío».
        */}
        <div className="border-b border-app-border pb-px">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("hunter")}
              id="tab-hunter"
              type="button"
              className={`flex items-center gap-2.5 py-4 px-1 border-b-2 font-display text-base font-bold tracking-tight transition-all cursor-pointer ${
                activeTab === "hunter"
                  ? "border-brand text-app-text"
                  : "border-transparent text-app-muted hover:text-app-text hover:border-app-border/40"
              }`}
            >
              <MapPin className={`w-4 h-4 ${activeTab === "hunter" ? "text-brand" : "text-app-muted"}`} />
              <span>Oportunidades</span>
            </button>

            <button
              onClick={() => setActiveTab("pitch")}
              id="tab-pitch"
              type="button"
              className={`flex items-center gap-2.5 py-4 px-1 border-b-2 font-display text-base font-bold tracking-tight transition-all cursor-pointer ${
                activeTab === "pitch"
                  ? "border-brand text-app-text"
                  : "border-transparent text-app-muted hover:text-app-text hover:border-app-border/40"
              }`}
            >
              <MessageSquare className={`w-4 h-4 ${activeTab === "pitch" ? "text-brand" : "text-app-muted"}`} />
              <span>Generar mensaje</span>
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              id="tab-dashboard"
              type="button"
              className={`flex items-center gap-2.5 py-4 px-1 border-b-2 font-display text-base font-bold tracking-tight transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "border-brand text-app-text"
                  : "border-transparent text-app-muted hover:text-app-text hover:border-app-border/40"
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === "dashboard" ? "text-brand" : "text-app-muted"}`} />
              <span>Panel</span>
            </button>

            <button
              onClick={() => setActiveTab("library")}
              id="tab-library"
              type="button"
              className={`flex items-center gap-2.5 py-4 px-1 border-b-2 font-display text-base font-bold tracking-tight transition-all cursor-pointer ${
                activeTab === "library"
                  ? "border-brand text-app-text"
                  : "border-transparent text-app-muted hover:text-app-text hover:border-app-border/40"
              }`}
            >
              <Library className={`w-4 h-4 ${activeTab === "library" ? "text-brand" : "text-app-muted"}`} />
              <span>Biblioteca</span>
            </button>
          </div>
        </div>

        {/* Dynamic Context Strategy Compass.
            **No se rinde en el Panel:** esa pantalla trae su propio encabezado y
            su propia llamada a la acción, y superponerle una segunda guía
            duplicaría el mensaje de entrada. */}
        {/*
          ⚠️ **F4.5 · R-07 — el panel se conserva, pero deja de ir primero.**

          La prueba de escaneo de 5 segundos encontró que en Lead Hunter y en
          Pitch Generator **lo primero que hallaba la mirada era esta guía**, que
          son instrucciones, y no el titular de la pantalla. Un bloque de ayuda
          que compite con el encabezado es un defecto de jerarquía.

          **No se retira ni un carácter de su contenido** —eso sería una decisión
          de producto, no de interfaz—. Lo que cambia es su peso: pasa a
          renderizarse **debajo** del área de trabajo, con tratamiento de nota al
          pie y su texto acotado a la medida de lectura. Sigue disponible para
          quien la busque; deja de secuestrar el primer vistazo.

          `order` la mueve visualmente sin alterar el orden del DOM, de modo que
          un lector de pantalla la sigue encontrando junto a la navegación.
        */}
        <div className={`order-last ${activeTab === "dashboard" ? "hidden" : "block"}`}>
          <div className="flex flex-col gap-3 rounded-container border border-app-border bg-dark-surface/60 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Compass className="mt-0.5 h-4 w-4 shrink-0 text-app-muted" />
              <div className="space-y-1">
                <h4 className="font-sans text-eyebrow font-bold uppercase tracking-widest text-app-muted">
                  Brújula del freelancer
                </h4>
                <p className="max-w-measure font-sans text-xs text-app-muted">
                  {/* «verificados» y «alta viabilidad comercial» eran afirmaciones sin respaldo: el sistema no verifica negocios ni garantiza viabilidad. Devuelve negocios de Google Places con un Opportunity Score calculado. */}
                  {activeTab === "hunter" && "Configura los filtros de nicho y ciudad colombiana, opcionalmente detalla tu estilo de diseño y busca negocios reales en Google Places con su Opportunity Score calculado."}
                  {activeTab === "library" && "Tu memoria comercial completa: todas las empresas que el agente ha registrado, con independencia de su puntuación. La Biblioteca solo crece — de aquí no se elimina ningún Lead."}
                  {activeTab === "pitch" && "Selecciona cualquier lead mapeado en tu buscador y genera una propuesta de outreach hiper-personalizada para Email, LinkedIn o Instagram de baja presión y alto retorno."}
                </p>
              </div>
            </div>

            {activeTab === "hunter" && (
              <button
                onClick={() => setActiveTab("pitch")}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 font-sans text-xs font-semibold text-brand hover:underline"
              >
                Ver generador de mensajes
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Workspace Display Area */}
        <div className="transition-all duration-300">
          {activeTab === "dashboard" ? (
            /* Panel del agente — solo presenta lo que ya existe en este estado
               y en los resúmenes de búsqueda de la sesión. */
            <ExecutiveDashboard
              leads={leads}
              searchHistory={searchHistory}
              activeLeadId={selectedLeadId}
              onStartSearch={() => setActiveTab("hunter")}
              onOpenOpportunity={handleOpenOpportunity}
              onGeneratePitch={handleSelectLeadContext}
            />
          ) : activeTab === "hunter" ? (
            <LeadHunter
              designerStyle={designerStyle}
              setDesignerStyle={setDesignerStyle}
              leads={leads}
              onAddLeads={handleAddLeads}
              onSelectLead={handleSelectLeadContext}
              activeLeadId={selectedLeadId}
              onSearchCompleted={(summary) =>
                setSearchHistory((prev) => [...prev, summary])
              }
              requestedLeadId={requestedLeadId}
              onRequestedLeadConsumed={() => setRequestedLeadId(null)}
            />
          ) : activeTab === "library" ? (
            /* Biblioteca — lee del servidor en cada visita. No recibe el estado
               local del Workspace: son dos vistas distintas sobre datos distintos
               (APS-04 §A.3.4), y la Biblioteca es la única que refleja lo que
               realmente quedó registrado en persistencia. */
            <LeadLibrary />
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
          {/* **El producto se llama AKVEZ.** El pie nombraba «LeadFlow Colombia
              Suite» en las cinco pantallas: una ruptura de identidad literal,
              permanente y en texto. */}
          <p className="font-sans">
            © 2026 AKVEZ. Todas las comunicaciones generadas cumplen normas de
            contacto profesional ético.
          </p>
          <div className="flex items-center gap-1 font-mono">
            <Code className="w-3.5 h-3.5 text-brand" />
            Análisis con Google Gemini · Descubrimiento con Google Places
          </div>
        </div>
      </footer>

    </div>
  );
}
