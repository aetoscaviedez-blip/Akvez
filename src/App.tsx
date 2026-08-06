import React from "react";
import { DesignerProfile, Prospect, SearchSummary } from "./shared/types";
import LeadHunter from "./modules/lead-hunter/presentation/LeadHunter";
import LeadLibrary from "./modules/lead-hunter/presentation/LeadLibrary";
import PitchGenerator from "./modules/pitch-generator/presentation/PitchGenerator";
import ExecutiveDashboard from "./modules/dashboard/presentation/ExecutiveDashboard";
import FirstRunProfile from "./shared/components/FirstRunProfile";
import { Compass, Code, ArrowRight, MapPin, Settings, MessageSquare, Library, LayoutDashboard } from "lucide-react";

/**
 * Claves de persistencia.
 *
 * **Se renombraron desde `leadflow_*` (H-10.1 · P1).** El producto se llama
 * AKVEZ; el nombre anterior sobrevivía en el almacenamiento, en el perfil por
 * defecto y —lo más grave— en la firma de los mensajes generados.
 *
 * El cambio de clave **descarta el trabajo guardado bajo el nombre viejo**. Es
 * intencionado: ese almacenamiento contenía los Leads de ejemplo y un perfil
 * firmado con una marca que no existe.
 */
const LEADS_KEY = "akvez_leads_v1";
const PROFILE_KEY = "akvez_profile_v1";


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

  /**
   * ⚠️ **H-10.1 · P2 — el producto arranca vacío.**
   *
   * Antes se precargaban dos negocios inventados para que la aplicación no
   * abriera en blanco. El efecto era el contrario del buscado: **la pantalla de
   * entrada quedaba dominada por un aviso ámbar diciendo que nada era real**, y
   * esos Leads contaminaban todas las cifras del Panel y dejaban la Opportunity
   * View llena de «No disponible», porque los datos de muestra no traen
   * desglose del Score.
   *
   * **Una pantalla vacía con una acción clara es más producto que una llena de
   * datos rotulados como falsos.** El estado vacío ya estaba escrito y hace de
   * puerta de entrada.
   */
  const [leads, setLeads] = React.useState<Prospect[]>(() => {
    const saved = localStorage.getItem(LEADS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  /**
   * **Perfil del freelance. `null` significa que todavía no se ha presentado.**
   *
   * No hay perfil por defecto: el anterior firmaba los mensajes como «Estudio
   * Creativo LeadFlow» —el nombre viejo del proyecto— y ese texto salía dentro
   * del mensaje generado, que es el momento culminante del recorrido.
   */
  const [designerProfile, setDesignerProfile] = React.useState<DesignerProfile | null>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  // State: Designer style used in Colombian Search API
  const [designerStyle, setDesignerStyle] = React.useState<string>(
    () => designerProfile?.style ?? ""
  );

  // Active Selected Lead ID in Pitch Generator
  const [selectedLeadId, setSelectedLeadId] = React.useState<string>(() => {
    return leads.length > 0 ? leads[0].id : "";
  });

  // LocalStorage sync
  React.useEffect(() => {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }, [leads]);

  React.useEffect(() => {
    if (designerProfile) localStorage.setItem(PROFILE_KEY, JSON.stringify(designerProfile));
  }, [designerProfile]);

  // Keep search style preference in sync with profile definition
  React.useEffect(() => {
    if (designerProfile) setDesignerStyle(designerProfile.style);
  }, [designerProfile?.style]);

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

            {/*
              **El producto sabe quién eres, y lo dice.** El avatar era un icono
              genérico sin nombre: nada en la interfaz indicaba que el espacio
              de trabajo fuera de alguien. Ahora lleva las iniciales del
              freelance y su nombre al lado.
            */}
            <div className="flex items-center gap-3">
              <button type="button" className="p-2.5 rounded-full hover:bg-surface-raised text-app-muted hover:text-app-text transition cursor-pointer">
                <Settings className="w-5 h-5" />
              </button>
              {/* **Solo cuando el producto sabe a quién nombrar.** Antes del
                  alta —que ahora ocurre al generar el primer mensaje— no hay
                  identidad que mostrar, y un avatar vacío o genérico diría
                  menos que su ausencia. */}
              {designerProfile && (
                <div className="flex items-center gap-2.5">
                  <span className="hidden text-right sm:block">
                    <span className="block font-sans text-xs font-semibold leading-tight text-app-text">
                      {designerProfile.name}
                    </span>
                    {designerProfile.company && (
                      <span className="block font-sans text-eyebrow leading-tight text-app-muted">
                        {designerProfile.company}
                      </span>
                    )}
                  </span>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/20 font-sans text-xs font-bold text-brand">
                    {initials(designerProfile.name)}
                  </div>
                </div>
              )}
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
        {/* Durante el alta tampoco se rinde: su texto del Pitch («Selecciona
            cualquier lead mapeado…») describe una pantalla que el usuario
            todavía no está viendo. */}
        <div
          className={`order-last ${
            activeTab === "dashboard" || (activeTab === "pitch" && !designerProfile)
              ? "hidden"
              : "block"
          }`}
        >
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
          ) : !designerProfile ? (
            /*
              **H-11.1 · el alta dejó de ser la puerta de entrada.**

              Antes bloqueaba la aplicación entera: nadie veía AKVEZ hasta
              rellenar cinco campos. El perfil, sin embargo, **solo se usa al
              redactar el mensaje** —el paso 4 de 5 del recorrido—, así que se
              estaba pidiendo unos 90 segundos antes de servir para nada, y
              **duplicaba el tiempo hasta el primer valor**: de tres pasos
              (abrir → buscar → resultados) a cinco.

              Ahora vive exactamente donde se necesita. El usuario abre, busca,
              explora resultados y abre una oportunidad sin que nadie le
              pregunte nada. Al pulsar «Generar mensaje» —y solo entonces— el
              producto le pide su firma, que es cuando la petición se explica
              sola: va a escribir en su nombre.

              Se cruza una sola vez; después, esta rama no vuelve a rendirse.
              `PitchGenerator` conserva su contrato intacto: nunca recibe un
              perfil nulo.
            */
            <FirstRunProfile onComplete={setDesignerProfile} />
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

/** Iniciales para el avatar. Como mucho dos letras. */
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
