import React from "react";
import { Sparkles } from "lucide-react";
import { Surface } from "../../../../shared/components/ui";

interface SearchingLoaderProps {
  activeNicheName: string;
  city: string;
  scanStep: number;
  scanMessages: string[];
}

export default function SearchingLoader({ activeNicheName, city, scanStep, scanMessages }: SearchingLoaderProps) {
  return (
    /* **El `animate-pulse` del contenedor entero se ha retirado.** Latía toda
       la tarjeta —texto incluido— y hacía el mensaje de progreso más difícil de
       leer justo cuando es lo único que hay que leer. El movimiento se queda en
       el indicador, que es lo que sí significa «está trabajando». */
    <Surface padding="xl" className="space-y-6 text-center">
      <div className="relative mx-auto h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-brand/20 animate-ping" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand animate-spin" />
        <Sparkles className="absolute inset-4 h-8 w-8 text-brand" />
      </div>

      <div className="mx-auto max-w-md space-y-2">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted">
          Radar de oportunidad activo
        </p>
        <h4 className="font-display text-lg font-bold tracking-tight text-app-text">
          Escaneando {activeNicheName} en {city}
        </h4>
        <Surface
          level="raised"
          radius="control"
          className="my-4 flex min-h-[40px] items-center justify-center p-2.5 font-mono text-xs text-brand"
        >
          {scanMessages[scanStep]}
        </Surface>
      </div>
    </Surface>
  );
}
