import React from "react";
import { DesignerProfile } from "../../../../shared/types";
import { Surface } from "../../../../shared/components/ui";
import { PenLine, X } from "lucide-react";

/**
 * Firma del diseñador — los datos con los que se redacta el mensaje.
 *
 * **Es configuración, no narrativa.** Vivía dentro del panel de control como
 * «Paso 1: Configurar Variables» *(un paso 1 sin paso 2 en ninguna parte)*, con
 * el mismo peso visual que el Lead y el canal. Aquí queda plegado sobre la
 * secuencia: se abre cuando hace falta y no ocupa sitio cuando no.
 *
 * **Los tres campos son exactamente los que había.** No se añade ni se retira
 * ninguno: `name`, `tone` y `skills`.
 */
export default function DesignerSignaturePanel({
  designerProfile,
  setDesignerProfile,
  open,
  onToggle
}: {
  designerProfile: DesignerProfile;
  setDesignerProfile: (profile: DesignerProfile) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Surface>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="flex min-w-0 items-center gap-3">
          <PenLine className="h-4 w-4 shrink-0 text-brand" />
          <span className="min-w-0">
            <span className="block font-sans text-eyebrow font-bold uppercase tracking-widest text-app-muted">
              Firma del diseñador
            </span>
            <span className="block truncate font-display text-sm font-bold text-app-text">
              {/* **Un nombre vacío se declara.** El prompt lo usa igualmente. */}
              {designerProfile.name.trim() !== ""
                ? designerProfile.name
                : "Sin nombre de firma"}
            </span>
          </span>
        </span>
        <span className="shrink-0 font-sans text-eyebrow font-bold uppercase tracking-widest text-brand">
          {open ? <X className="h-4 w-4" /> : "Editar"}
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-app-border px-5 py-5 motion-safe:animate-ak-rise">
          <Field label="Nombre de firma o freelancer">
            <input
              type="text"
              value={designerProfile.name}
              onChange={(e) => setDesignerProfile({ ...designerProfile, name: e.target.value })}
              className="w-full rounded-control border border-app-border bg-surface-raised px-3 py-2 font-sans text-xs text-app-text transition-colors focus:border-brand focus:outline-none"
            />
          </Field>

          <Field label="Tono de escritura">
            <select
              value={designerProfile.tone}
              onChange={(e) => setDesignerProfile({ ...designerProfile, tone: e.target.value })}
              className="w-full rounded-control border border-app-border bg-surface-raised px-3 py-2 font-sans text-xs text-app-text transition-colors focus:border-brand focus:outline-none"
            >
              <option value="Cálido, empático, observador y ultra-enfocado al valor">
                Empático y observador
              </option>
              <option value="Directo, audaz, experto en conversión y con alta energía">
                Directo y orientado a resultados
              </option>
              <option value="Sofisticado, formal, altamente profesional y pulido">
                Formal y corporativo
              </option>
            </select>
          </Field>

          <Field label="Herramientas principales">
            <input
              type="text"
              value={designerProfile.skills}
              onChange={(e) => setDesignerProfile({ ...designerProfile, skills: e.target.value })}
              placeholder="Webflow, React, WordPress…"
              className="w-full rounded-control border border-app-border bg-surface-raised px-3 py-2 font-sans text-xs text-app-text placeholder:text-app-muted transition-colors focus:border-brand focus:outline-none"
            />
          </Field>
        </div>
      )}
    </Surface>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block font-sans text-eyebrow font-bold uppercase tracking-widest text-app-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
