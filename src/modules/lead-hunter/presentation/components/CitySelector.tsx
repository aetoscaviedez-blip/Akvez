import React from "react";
import { ChevronDown } from "lucide-react";
import { CIUDADES_COLOMBIA } from "../../domain/supportedCities";

interface CitySelectorProps {
  cityDropdownOpen: boolean;
  setCityDropdownOpen: (open: boolean) => void;
  setNicheDropdownOpen: (open: boolean) => void;
  city: string;
  setCity: (city: string) => void;
}

export default function CitySelector({
  cityDropdownOpen,
  setCityDropdownOpen,
  setNicheDropdownOpen,
  city,
  setCity
}: CitySelectorProps) {
  return (
    <div className="bg-dark-surface border border-app-border rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => {
          setCityDropdownOpen(!cityDropdownOpen);
          setNicheDropdownOpen(false); // Close niche dropdown
        }}
        className="w-full flex items-center justify-between p-4 bg-surface-raised/45 hover:bg-surface-raised/65 transition-colors focus:outline-none cursor-pointer text-left"
      >
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-app-text font-display">Ciudad</span>
          <span className="text-xs text-brand font-semibold mt-0.5">{city}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-brand transition-transform duration-200 ${cityDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {cityDropdownOpen && (
        <div className="p-3 bg-surface-raised/25 space-y-1.5 border-t border-app-border/40 animate-fade-in">
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
                    ? "bg-intel/50 text-brand font-extrabold border-l-2 border-brand pl-3"
                    : "text-app-muted hover:text-app-text hover:bg-dark-surface/40"
                }`}
              >
                <span>{ciudad}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
