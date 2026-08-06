import React from "react";
import { Eyebrow } from "../../../../shared/components/ui";

interface ResultsHeaderProps {
  visibleCount: number;
  totalLeads: number;
  references: Array<{ title: string; url: string }>;
}

export default function ResultsHeader({ visibleCount, totalLeads, references }: ResultsHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* **F2.5 · V-08.** Era la cuarta anatomía de encabezado que sobrevivía en
          una pantalla ya unificada: display, mayúsculas y tamaño propios. Ahora
          usa el mismo rótulo en versalitas que el resto del sistema. */}
      <Eyebrow as="h4">
        Negocios encontrados ({Math.min(visibleCount, totalLeads)} de {totalLeads})
      </Eyebrow>

      {references.length > 0 && (
        <div className="text-xs text-brand flex items-center gap-1 shrink-0">
          <span className="font-bold">Fuentes de búsqueda:</span>
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
  );
}
