import React from "react";
import { Search } from "lucide-react";
import { Button } from "../../../../shared/components/ui";

interface SearchCtaButtonProps {
  searching: boolean;
  onSearch: () => void;
}

/**
 * **Acción primaria de la pantalla de apertura.**
 *
 * Era el último control del producto escrito a mano: su propio relleno, su
 * propio radio, su propia altura y su propia tipografía. **Ahora usa `Button`**,
 * de modo que comparte anatomía exacta con todas las demás acciones primarias
 * del recorrido.
 *
 * El estado de carga se conserva íntegro: mismo texto, mismo indicador.
 */
export default function SearchCtaButton({ searching, onSearch }: SearchCtaButtonProps) {
  return (
    <Button
      variant="primary"
      size="lg"
      fullWidth
      onClick={onSearch}
      disabled={searching}
      icon={
        searching ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-dark-bg border-t-transparent" />
        ) : undefined
      }
      iconRight={searching ? undefined : <Search className="h-4 w-4" />}
    >
      {searching ? "Rastreando…" : "Encuentra oportunidades"}
    </Button>
  );
}
