import React from "react";
import { AlertTriangle, ChevronDown, Sparkles } from "lucide-react";
import { Button, Callout } from "../../../../shared/components/ui";

interface LoadMoreControlsProps {
  noMoreLeadsFound: boolean;
  totalLeads: number;
  visibleCount: number;
  onShowMore: () => void;
  onSearchMore: () => void;
  searchingMore: boolean;
}

export default function LoadMoreControls({
  noMoreLeadsFound,
  totalLeads,
  visibleCount,
  onShowMore,
  onSearchMore,
  searchingMore
}: LoadMoreControlsProps) {
  return (
    <div className="flex flex-col gap-4 mt-6">
      {noMoreLeadsFound && (
        <Callout
          tone="warn"
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Sin resultados adicionales"
        >
          No hay más leads disponibles en este nicho y ciudad. Intenta con otro
          nicho o ciudad.
        </Callout>
      )}

      {/* **Los dos botones comparten altura exacta.** Es lo que se percibe como
          «acabado», y uno solo de altura distinta lo rompe. */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {totalLeads > visibleCount && (
          <Button
            onClick={onShowMore}
            iconRight={<ChevronDown className="h-4 w-4" />}
          >
            Ver 5 más
          </Button>
        )}

        <Button
          variant="primary"
          onClick={onSearchMore}
          disabled={searchingMore}
          icon={
            searchingMore ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-dark-bg border-t-transparent" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )
          }
        >
          {searchingMore ? "Buscando más…" : "Buscar más leads"}
        </Button>
      </div>
    </div>
  );
}
