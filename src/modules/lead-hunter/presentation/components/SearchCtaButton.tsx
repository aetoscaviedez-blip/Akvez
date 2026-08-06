import React from "react";
import { Search } from "lucide-react";

interface SearchCtaButtonProps {
  searching: boolean;
  onSearch: () => void;
}

/**
 * **Acción primaria del Lead Hunter — la segunda pantalla del recorrido.**
 *
 * Antes se pintaba `#E28A5D` con texto blanco, mientras la del Panel —la
 * pantalla inmediatamente anterior— era `#ff7a00` con texto oscuro: **el
 * recorrido repintaba su propia acción principal al pasar de una a otra.**
 *
 * Ahora comparten relleno (`brand`) y tratamiento de texto. El texto oscuro
 * sobre naranja da **7,9:1** de contraste; el blanco daba **2,9:1**.
 */
export default function SearchCtaButton({ searching, onSearch }: SearchCtaButtonProps) {
  return (
    <button
      type="button"
      onClick={onSearch}
      disabled={searching}
      className="w-full bg-brand hover:brightness-110 text-dark-bg font-bold font-display uppercase tracking-widest text-xs py-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
    >
      {searching ? (
        <>
          <div className="w-4.5 h-4.5 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
          <span>Rastreando...</span>
        </>
      ) : (
        <>
          <span>Encuentra oportunidades</span>
          <Search className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
