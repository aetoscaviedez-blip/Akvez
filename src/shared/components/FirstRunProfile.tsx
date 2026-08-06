import React from "react";
import { DesignerProfile } from "../types";
import { Surface, SectionHeader, Button, Eyebrow } from "./ui";
import { ArrowRight, PenLine } from "lucide-react";

/**
 * **Alta inicial — la única vez que AKVEZ pregunta algo antes de trabajar.**
 *
 * ── QUÉ PROBLEMA DE PRODUCTO RESUELVE ────────────────────────────────────────
 *
 * Hasta ahora el producto no sabía quién era su usuario, y el efecto era peor
 * que un hueco: **la firma por defecto era «Estudio Creativo LeadFlow»**, el
 * nombre anterior del proyecto. Cada mensaje generado salía firmado por una
 * marca que no existe, **dentro del momento culminante del recorrido**.
 *
 * ── POR QUÉ ESTAS CINCO PREGUNTAS Y NO MÁS ───────────────────────────────────
 *
 * **Dos obligatorias y tres opcionales**, todas de una línea, en una sola
 * pantalla y con un solo botón. Un alta que se percibe como formulario es una
 * puerta; esta tiene que percibirse como una presentación.
 *
 * `name` y `skills` son obligatorios porque **el mensaje generado los usa
 * literalmente**: sin ellos el texto sale sin firma y sin oficio. El resto da
 * contexto y puede rellenarse después desde la firma del Pitch Generator.
 *
 * ── LO QUE NO SE PREGUNTA ────────────────────────────────────────────────────
 *
 * **No se pide el estilo, ni el tono, ni los casos de éxito.** Existen en el
 * perfil, tienen valores por defecto razonables y se editan en su sitio. Pedir
 * seis cosas más aquí convertiría treinta segundos en tres minutos, y la
 * primera impresión del producto sería un cuestionario.
 */
export default function FirstRunProfile({
  onComplete
}: {
  onComplete: (profile: DesignerProfile) => void;
}) {
  const [name, setName] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [skills, setSkills] = React.useState("");
  const [city, setCity] = React.useState("");
  const [website, setWebsite] = React.useState("");

  // **Solo se exige lo que el mensaje necesita para no salir roto.**
  const ready = name.trim() !== "" && skills.trim() !== "";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    onComplete({
      name: name.trim(),
      company: company.trim() || undefined,
      skills: skills.trim(),
      city: city.trim() || undefined,
      website: website.trim() || undefined,
      // Valores de partida del resto del perfil. **Son editables desde la firma
      // del generador**, y ninguno afirma nada sobre el usuario que él no pueda
      // cambiar en un clic.
      style:
        "Diseño limpio y moderno, adaptado a móviles, con foco en que el visitante encuentre rápido lo que busca.",
      tone: "Cercano, directo y profesional",
      caseStudies: "",
      targetNiche: ""
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl py-8">
      <SectionHeader
        level="screen"
        icon={<PenLine className="h-3.5 w-3.5" />}
        eyebrow="Antes de empezar"
        title="¿Quién eres?"
        lead="AKVEZ escribe los mensajes en tu nombre. Necesita saber cómo firmarlos y a qué te dedicas. Nada más."
      >
        <Surface as="section" padding="xl" className="space-y-6">
          <form onSubmit={submit} className="space-y-5">
            <Field
              label="Tu nombre"
              value={name}
              onChange={setName}
              placeholder="Ana Martínez"
              autoFocus
            />
            <Field
              label="Estudio o marca"
              optional
              value={company}
              onChange={setCompany}
              placeholder="Taller Digital"
            />
            <Field
              label="A qué te dedicas"
              value={skills}
              onChange={setSkills}
              placeholder="Diseño y desarrollo de sitios web en Webflow y WordPress"
            />
            <Field
              label="Tu ciudad"
              optional
              value={city}
              onChange={setCity}
              placeholder="Bogotá"
            />
            <Field
              label="Tu portafolio"
              optional
              value={website}
              onChange={setWebsite}
              placeholder="anamartinez.co"
            />

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-app-border pt-6">
              <p className="font-sans text-xs text-app-muted">
                Se guarda solo en este navegador. Puedes cambiarlo cuando quieras.
              </p>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!ready}
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Empezar a buscar
              </Button>
            </div>
          </form>
        </Surface>
      </SectionHeader>
    </div>
  );
}

/** Un campo del alta. Solo composición: la validación vive en el formulario. */
function Field({
  label,
  value,
  onChange,
  placeholder,
  optional = false,
  autoFocus = false
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  optional?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <Eyebrow>
        {label}
        {optional && <span className="font-normal normal-case tracking-normal opacity-60">opcional</span>}
      </Eyebrow>
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-control border border-app-border bg-surface-raised px-4 py-3 font-sans text-sm text-app-text placeholder:text-app-muted/70 transition-colors focus:border-brand focus:outline-none"
      />
    </label>
  );
}
