import React from "react";
import { Surface } from "../../../../shared/components/ui";
import { ChevronDown } from "lucide-react";
import { NICHE_PRESETS } from "../../domain/nichePresets";

interface NicheSelectorProps {
  nicheDropdownOpen: boolean;
  setNicheDropdownOpen: (open: boolean) => void;
  setCityDropdownOpen: (open: boolean) => void;
  useCustomNiche: boolean;
  customNiche: string;
  selectedPresetId: string;
  setUseCustomNiche: (value: boolean) => void;
  setSelectedPresetId: (id: string) => void;
}

// Visible subset of NICHE_PRESETS (single source of truth) and their order in this dropdown.
const VISIBLE_NICHE_IDS = [
  "fotografos",
  "odontologos",
  "abogados",
  "cafeterias-restaurantes",
  "medicos-esteticos",
  "gimnasios",
  "coaches",
  "eventos"
];

// UI-only display labels (shorter than NichePreset.industry). Presentation concern only —
// does not duplicate or override the domain data itself.
const NICHE_DISPLAY_LABELS: Record<string, string> = {
  "fotografos": "Fotógrafos",
  "odontologos": "Odontólogos",
  "abogados": "Abogados",
  "cafeterias-restaurantes": "Restaurantes",
  "medicos-esteticos": "Medico estético",
  "gimnasios": "Gimnasios",
  "coaches": "Coaches",
  "eventos": "Eventos"
};

const NICHE_OPTIONS = VISIBLE_NICHE_IDS
  .map((id) => NICHE_PRESETS.find((p) => p.id === id))
  .filter((preset): preset is NonNullable<typeof preset> => Boolean(preset))
  .map((preset) => ({ id: preset.id, label: NICHE_DISPLAY_LABELS[preset.id] }));

export default function NicheSelector({
  nicheDropdownOpen,
  setNicheDropdownOpen,
  setCityDropdownOpen,
  useCustomNiche,
  customNiche,
  selectedPresetId,
  setUseCustomNiche,
  setSelectedPresetId
}: NicheSelectorProps) {
  return (
    <Surface className="overflow-hidden">
      <button
        type="button"
        onClick={() => {
          setNicheDropdownOpen(!nicheDropdownOpen);
          setCityDropdownOpen(false); // Close city dropdown
        }}
        className="w-full flex items-center justify-between p-4 bg-surface-raised/45 hover:bg-surface-raised/65 transition-colors focus:outline-none cursor-pointer text-left"
      >
        <div className="flex flex-col">
          <span className="font-sans text-eyebrow font-bold uppercase tracking-widest text-app-muted">Selecciona tu nicho</span>
          {!useCustomNiche ? (
            <span className="text-xs text-brand font-semibold mt-0.5">
              {NICHE_PRESETS.find(p => p.id === selectedPresetId)?.industry || "Fotógrafos"}
            </span>
          ) : (
            <span className="text-xs text-brand font-semibold mt-0.5">
              Personalizado: {customNiche || "Ninguno"}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-brand transition-transform duration-200 ${nicheDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {nicheDropdownOpen && (
        <div className="p-3 bg-surface-raised/25 space-y-1.5 max-h-[310px] overflow-y-auto border-t border-app-border/40 animate-fade-in">
          {NICHE_OPTIONS.map((item) => {
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
                className={`w-full text-left px-4 py-3 rounded-control text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? "bg-intel/50 text-brand font-extrabold border-l-2 border-brand pl-3"
                    : "text-app-muted hover:text-app-text hover:bg-dark-surface/40"
                }`}
              >
                <span>{item.label}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand" />}
              </button>
            );
          })}
        </div>
      )}
    </Surface>
  );
}
