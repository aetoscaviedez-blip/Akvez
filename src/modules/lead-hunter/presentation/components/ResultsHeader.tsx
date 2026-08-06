import React from "react";

interface ResultsHeaderProps {
  visibleCount: number;
  totalLeads: number;
  references: Array<{ title: string; url: string }>;
}

export default function ResultsHeader({ visibleCount, totalLeads, references }: ResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-display font-bold uppercase text-xs tracking-wider text-app-muted">
        Leads Detectados en Colombia ({Math.min(visibleCount, totalLeads)} de {totalLeads})
      </h3>

      {references.length > 0 && (
        <div className="text-[11px] text-brand flex items-center gap-1 shrink-0">
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
  );
}
