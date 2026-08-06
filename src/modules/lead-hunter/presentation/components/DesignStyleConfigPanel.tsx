import React from "react";

interface DesignStyleConfigPanelProps {
  designerStyle: string;
  setDesignerStyle: (style: string) => void;
  showStyleConfig: boolean;
  setShowStyleConfig: (show: boolean) => void;
  useCustomNiche: boolean;
  setUseCustomNiche: (value: boolean) => void;
  customNiche: string;
  setCustomNiche: (value: string) => void;
}

export default function DesignStyleConfigPanel({
  designerStyle,
  setDesignerStyle,
  showStyleConfig,
  setShowStyleConfig,
  useCustomNiche,
  setUseCustomNiche,
  customNiche,
  setCustomNiche
}: DesignStyleConfigPanelProps) {
  return (
    <div className="bg-dark-surface border border-app-border rounded-2xl p-4.5 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-app-muted font-display">Estilo de Diseño</span>
        <button
          type="button"
          onClick={() => setShowStyleConfig(!showStyleConfig)}
          className="text-eyebrow text-brand hover:underline cursor-pointer font-bold"
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
          className="w-full bg-surface-raised border border-app-border rounded-xl p-3 text-xs text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition"
        />
      ) : (
        <div className="bg-surface-raised/40 p-3 border border-app-border/60 rounded-xl text-[10.5px] text-app-muted italic leading-relaxed">
          Usando: &ldquo;{designerStyle ? designerStyle.slice(0, 45) + "..." : "Diseño premium minimalista"}&rdquo;
        </div>
      )}

      {/* Custom Niche switch */}
      <div className="flex items-center justify-between pt-2.5 border-t border-app-border/40">
        <span className="text-eyebrow uppercase font-bold text-app-muted tracking-wider">¿Usar nicho personalizado?</span>
        <input
          type="checkbox"
          checked={useCustomNiche}
          onChange={(e) => setUseCustomNiche(e.target.checked)}
          className="w-4 h-4 rounded text-brand bg-surface-raised border-app-border focus:ring-brand cursor-pointer"
        />
      </div>

      {useCustomNiche && (
        <input
          type="text"
          value={customNiche}
          onChange={(e) => setCustomNiche(e.target.value)}
          placeholder="Ej: Tienda de café, Veterinarias..."
          className="w-full bg-surface-raised border border-app-border rounded-xl px-3 py-2.5 text-xs text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition mt-1"
          required
        />
      )}
    </div>
  );
}
