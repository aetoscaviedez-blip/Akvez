import React from "react";

/**
 * **`Eyebrow` — el rótulo en versalitas de AKVEZ.**
 *
 * ── POR QUÉ EXISTE ───────────────────────────────────────────────────────────
 *
 * `text-[10px] font-bold uppercase tracking-widest text-app-muted` era **la
 * cadena de clases más repetida de todo el producto**: encabeza cada campo del
 * Pitch Generator, cada celda de `StatTile`, cada eyebrow de `SectionHeader`,
 * cada `Field` de la firma del diseñador y los sub-rótulos de la Opportunity
 * View, que además la habían encapsulado en un `SubHeading` local.
 *
 * **Es la unidad tipográfica que sostiene la lectura rápida de la interfaz:**
 * el ojo la usa para saber *qué es* el dato que viene debajo sin leerlo. Que su
 * tamaño o su tracking difiriesen entre pantallas era una de las causas —poco
 * visibles una a una— de que el recorrido no pareciera un único producto.
 *
 * **No es un componente nuevo del sistema: es la extracción de un estilo que ya
 * existía repetido.** No añade anatomías; retira una duplicada.
 */
export default function Eyebrow({
  children,
  icon,
  tone = "muted",
  as: Tag = "span",
  className = ""
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** `brand` solo cuando el rótulo *es* la marca hablando, no cuando etiqueta. */
  tone?: "muted" | "brand";
  /**
   * **Cuando el rótulo encabeza contenido, es un encabezado.**
   *
   * Por defecto rinde `span`, que es lo correcto para la etiqueta de un dato.
   * Se pasa `h4`/`h5` cuando introduce una sección: si no, el esquema del
   * documento pierde un nivel y un lector de pantalla deja de poder navegarlo.
   */
  as?: "span" | "h4" | "h5";
  className?: string;
}) {
  return (
    <Tag
      className={`flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest ${
        tone === "brand" ? "text-brand" : "text-app-muted"
      } ${className}`.trim()}
    >
      {icon}
      {children}
    </Tag>
  );
}
