import React from "react";
import { Prospect, DesignerProfile } from "../types";
import { Send, Sparkles, Copy, Mail, Linkedin, Instagram, AlertTriangle, Lightbulb, CheckCircle2, MessageSquareText, Sliders } from "lucide-react";

interface PitchGeneratorProps {
  leads: Prospect[];
  designerProfile: DesignerProfile;
  setDesignerProfile: (profile: DesignerProfile) => void;
  selectedLeadId: string;
  onSelectLeadId: (id: string) => void;
  onUpdateLead: (id: string, updatedFields: Partial<Prospect>) => void;
  onNavigateToHunter: () => void;
}

export default function PitchGenerator({
  leads,
  designerProfile,
  setDesignerProfile,
  selectedLeadId,
  onSelectLeadId,
  onUpdateLead,
  onNavigateToHunter
}: PitchGeneratorProps) {
  const [channel, setChannel] = React.useState<"email" | "linkedin" | "instagram">("email");
  const [customInstructions, setCustomInstructions] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [pitchError, setPitchError] = React.useState<string | null>(null);

  // Profile configuration collapsed drawer
  const [editProfile, setEditProfile] = React.useState(false);

  const activeLead = leads.find(p => p.id === selectedLeadId);

  const handleGeneratePitch = async () => {
    if (!activeLead) return;

    setLoading(true);
    setPitchError(null);
    try {
      const response = await fetch("/api/prospect/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designer: designerProfile,
          lead: activeLead,
          channel: channel === "email" ? "Email" : channel === "linkedin" ? "LinkedIn Connection Note" : "Instagram Direct Message (DM)",
          customInstructions: customInstructions
        })
      });

      const data = await response.json();
      if (data.success && data.pitch) {
        onUpdateLead(activeLead.id, {
          subjectLine: data.pitch.subjectLine || "",
          generatedPitch: data.pitch.message || "",
          pitchChannel: channel,
          pitchAngle: activeLead.angle,
          pitchMessage: data.pitch.isFallback ? "utilizando_respaldo_local" : "",
          status: "Pitched"
        });
      } else {
        setPitchError(data.error || "No se pudo generar la plantilla de contacto. Verifica los secretos del applet.");
      }
    } catch (err: any) {
      console.error(err);
      setPitchError("Error al contactar con la IA: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8" id="pitch-generator-container">
      {/* Header Info */}
      <div className="space-y-1.5 border-l-4 border-accent-green pl-4">
        <h2 className="text-3xl font-bold font-display uppercase tracking-tight text-app-text">
          Outreach <span className="text-accent-green">Personalizado</span>
        </h2>
        <p className="text-sm text-app-muted font-sans max-w-2xl">
          Genera mensajes de contacto enfocados en aportar valor, libres de clichés comerciales, y diseñados específicamente a partir del dolor web de cada prospecto.
        </p>
      </div>

      {leads.length === 0 ? (
        /* Empty State */
        <div className="bg-dark-surface border border-app-border rounded-2xl p-12 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-dark-bg border border-app-border flex items-center justify-center text-accent-green/80 mx-auto">
            <Send className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-display uppercase tracking-wide text-app-text">Sin Leads para Generar Mensaje</h3>
            <p className="text-xs text-app-muted max-w-md mx-auto leading-relaxed">
              Necesitas seleccionar o buscar al menos un cliente calificado antes de que nuestro redactor persuasivo pueda ponerse a redactar una propuesta.
            </p>
          </div>
          <button
            onClick={onNavigateToHunter}
            className="bg-accent-green text-dark-bg font-bold font-display uppercase tracking-wider text-xs px-6 py-3 rounded-xl transition cursor-pointer hover:bg-opacity-90 active:scale-95 inline-block shadow-md shadow-accent-green/10"
          >
            Ir al Lead Hunter
          </button>
        </div>
      ) : (
        /* Core Pitch Panel */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Workspace */}
          <div className="lg:col-span-5 bg-dark-surface border border-app-border rounded-2xl p-6 h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-app-border pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-app-muted">Paso 1: Configurar Variables</span>
              <button
                type="button"
                onClick={() => setEditProfile(!editProfile)}
                className="text-[10px] bg-dark-bg text-accent-green border border-accent-green/20 hover:border-accent-green px-2.5 py-1 rounded font-bold cursor-pointer"
              >
                {editProfile ? "Guardar Firma" : "Editar Firma Freelance"}
              </button>
            </div>

            {/* Profile Drawer */}
            {editProfile && (
              <div className="bg-dark-bg p-4 border border-app-border rounded-xl space-y-4 animate-fadeIn">
                <h4 className="text-xs font-bold text-accent-green uppercase font-display tracking-widest">Firma del Diseñador</h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-muted uppercase">Nombre de Firma / Freelancer</label>
                    <input
                      type="text"
                      value={designerProfile.name}
                      onChange={(e) => setDesignerProfile({ ...designerProfile, name: e.target.value })}
                      className="w-full bg-dark-surface border border-app-border rounded-lg px-2.5 py-1.5 text-xs text-app-text focus:outline-none focus:border-accent-green"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-muted uppercase">Tono de Escritura</label>
                    <select
                      value={designerProfile.tone}
                      onChange={(e) => setDesignerProfile({ ...designerProfile, tone: e.target.value })}
                      className="w-full bg-dark-surface border border-app-border rounded-lg px-2 text-xs py-1.5 text-app-text focus:outline-none focus:border-accent-green"
                    >
                      <option value="Cálido, empático, observador y ultra-enfocado al valor">Empático & Observador</option>
                      <option value="Directo, audaz, experto en conversión y con alta energía">Directo & Orientado a Resultados</option>
                      <option value="Sofisticado, formal, altamente profesional y pulido">Formal & Corporativo</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-muted uppercase">Herramientas Principales</label>
                    <input
                      type="text"
                      value={designerProfile.skills}
                      onChange={(e) => setDesignerProfile({ ...designerProfile, skills: e.target.value })}
                      placeholder="Ej: Webflow, Custom React, WordPress"
                      className="w-full bg-dark-surface border border-app-border rounded-lg px-2.5 py-1.5 text-xs text-app-text focus:outline-none focus:border-accent-green"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Lead selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-app-muted">Seleccionar Lead de Colombia</label>
              <select
                value={selectedLeadId}
                onChange={(e) => onSelectLeadId(e.target.value)}
                className="w-full bg-dark-bg border border-app-border rounded-xl px-3 py-2.5 text-xs text-app-text focus:outline-none focus:border-accent-green transition"
              >
                {leads.map((p) => (
                  <option key={p.id} value={p.id}>
                    🗺️ {p.name} ({p.website})
                  </option>
                ))}
              </select>
            </div>

            {activeLead && (
              <>
                {/* Active Lead Summary Panel */}
                <div className="bg-dark-bg border border-app-border p-4 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold text-secondary-orange uppercase tracking-widest block">Análisis del Objetivo</span>
                  <div>
                    <h5 className="text-xs font-bold text-app-text">{activeLead.name}</h5>
                    <p className="text-[11px] text-app-muted italic mt-0.5 mt-1 line-clamp-2">
                       &ldquo;{activeLead.description}&rdquo;
                    </p>
                  </div>

                  {activeLead.revenueLoss && (
                    <div className="text-[10.5px] text-rose-450 border border-rose-900/40 bg-rose-950/20 p-2.5 rounded-lg">
                      <strong>Dolor Comercial:</strong> {activeLead.revenueLoss}
                    </div>
                  )}

                  <div className="text-[11px] text-app-muted border-t border-app-border/40 pt-2 shrink-0">
                    <strong>Ángulo Detectado:</strong> {activeLead.angle}
                  </div>
                </div>

                {/* Channel choice */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-app-muted block">Canal de Contacto</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setChannel("email")}
                      className={`py-2 px-1 rounded-xl border text-xs font-bold font-display cursor-pointer flex flex-col items-center justify-center gap-1.5 transition ${
                        channel === "email"
                          ? "border-accent-green bg-accent-green/5 text-accent-green"
                          : "border-app-border bg-dark-bg hover:bg-dark-bg/40 text-app-muted hover:text-app-text"
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      Email Frío
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setChannel("linkedin")}
                      className={`py-2 px-1 rounded-xl border text-xs font-bold font-display cursor-pointer flex flex-col items-center justify-center gap-1.5 transition ${
                        channel === "linkedin"
                          ? "border-accent-green bg-accent-green/5 text-accent-green"
                          : "border-app-border bg-dark-bg hover:bg-dark-bg/40 text-app-muted hover:text-app-text"
                      }`}
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn Note
                    </button>

                    <button
                      type="button"
                      onClick={() => setChannel("instagram")}
                      className={`py-2 px-1 rounded-xl border text-xs font-bold font-display cursor-pointer flex flex-col items-center justify-center gap-1.5 transition ${
                        channel === "instagram"
                          ? "border-accent-green bg-accent-green/5 text-accent-green"
                          : "border-app-border bg-dark-bg hover:bg-dark-bg/40 text-app-muted hover:text-app-text"
                      }`}
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram DM
                    </button>
                  </div>
                </div>

                {/* Additional instructions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-app-muted block">
                    Instrucciones Adicionales (Opcional)
                  </label>
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    rows={3}
                    placeholder="Ej: Destaca que soy de su misma ciudad, o pídele que vea el caso de éxito de cafeterías."
                    className="w-full bg-dark-bg border border-app-border rounded-xl p-3 text-xs text-app-text placeholder:text-app-muted focus:outline-none focus:border-accent-green transition"
                  />
                </div>

                {/* Generate Action Button */}
                <button
                  onClick={handleGeneratePitch}
                  disabled={loading}
                  className="w-full bg-accent-green text-dark-bg hover:bg-opacity-90 font-bold font-display uppercase tracking-wider text-xs py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-accent-green/10"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
                      Generando Persuasión...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generar Mensaje Persuasivo
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Right Side Output Box */}
          <div className="lg:col-span-7 space-y-6 animate-fadeIn">

            {pitchError && (
              <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl flex items-start gap-4 shadow-md animate-fade-in">
                <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider font-display">
                    Error al generar propuesta
                  </h4>
                  <p className="text-xs text-app-text font-sans leading-relaxed">
                    {pitchError}
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-dark-surface border border-accent-green/30 rounded-2xl p-8 text-center space-y-4">
                <Sparkles className="w-10 h-10 text-accent-green animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-app-text font-display uppercase tracking-widest">Generando Estructura de Mensaje...</h4>
                <p className="text-xs text-app-muted max-w-sm mx-auto leading-relaxed font-sans">
                  El redactor comercial de LeadFlow está analizando el dolor de {activeLead?.name} y formulando una apertura irresistible libre de rechazo.
                </p>
                <div className="w-full max-w-xs h-1.5 bg-dark-bg rounded-full overflow-hidden mx-auto mt-2">
                  <div className="h-full bg-accent-green rounded-full animate-progress duration-300" style={{ width: "70%" }}></div>
                </div>
              </div>
            )}

            {!loading && activeLead && !activeLead.generatedPitch && (
              <div className="border border-dashed border-app-border rounded-2xl p-10 text-center bg-dark-surface/10 space-y-3">
                <MessageSquareText className="w-10 h-10 text-app-muted mx-auto" />
                <h4 className="text-md font-bold text-app-text font-display uppercase tracking-wide">Mensaje Listo para Generar</h4>
                <p className="text-xs text-app-muted max-w-sm mx-auto leading-relaxed">
                  Haz clic en el botón de la izquierda para que nuestra Inteligencia Artificial arme la plantilla ideal con una oferta de valor de baja fricción.
                </p>
              </div>
            )}

            {!loading && activeLead && activeLead.generatedPitch && (
              <div className="bg-dark-surface border border-accent-green/40 rounded-2xl p-6 space-y-5 neon-glow animate-fadeIn">
                
                {/* Header Actions */}
                <div className="flex justify-between items-center border-b border-app-border/40 pb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent-green" />
                    <span className="text-xs font-bold uppercase tracking-widest text-app-text font-display">
                      Outreach Optimizado para {channel === "email" ? "Email Frío" : channel === "linkedin" ? "LinkedIn" : "Instagram"}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(
                      channel === 'email' 
                        ? `Asunto: ${activeLead.subjectLine}\n\n${activeLead.generatedPitch}` 
                        : activeLead.generatedPitch || ""
                    )}
                    className="text-xs bg-dark-bg border border-accent-green/20 hover:border-accent-green text-accent-green font-bold font-display uppercase tracking-widest px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>

                {/* Active Support Banner */}
                {activeLead.pitchMessage && activeLead.pitchMessage.includes("respaldo") && (
                  <div className="bg-secondary-orange/10 border border-secondary-orange/30 p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed animate-fade-in">
                    <AlertTriangle className="w-5 h-5 text-secondary-orange shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1 text-app-text">
                      <span className="font-bold text-secondary-orange uppercase tracking-wider font-display block text-[10px]">
                        Redactor de Respaldo Activo
                      </span>
                      Debido a límites de cuotas temporales en el API, nuestro motor de inteligencia de respaldo local ha redactado un mensaje persuasivo optimizado para Colombia adaptado minuciosamente al dolor de este cliente.
                    </div>
                  </div>
                )}

                {/* Email Subject line wrapper */}
                {channel === "email" && activeLead.subjectLine && (
                  <div className="bg-dark-bg p-3 border border-app-border rounded-xl space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#ff6b35]">Asunto Sugerido:</span>
                    <p className="text-xs font-bold text-app-text">{activeLead.subjectLine}</p>
                  </div>
                )}

                {/* Main Script Text Area */}
                <div className="bg-dark-bg p-5 border border-app-border rounded-xl text-xs text-app-text leading-relaxed whitespace-pre-wrap font-sans max-h-[420px] overflow-y-auto">
                  {activeLead.generatedPitch}
                </div>

                {/* Dynamic tactical explanation */}
                <div className="bg-accent-green/5 border border-accent-green/10 p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-accent-green uppercase tracking-wide flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" />
                    Consejo Táctico de Éxito
                  </span>
                  <p className="text-[11px] text-app-muted leading-relaxed">
                    Este mensaje inicia directo con un halago honesto de su local en {activeLead.dateCreated ? "Colombia" : "su región"}, transiciona al error del menú estático sin criticar agresivamente, y propone enviar un boceto personalizado para aportarle valor premium de manera gratuita.
                  </p>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
