import React from "react";
import { DesignerProfile } from "../types";
import { Surface, SectionHeader, Button, Eyebrow } from "./ui";
import { ArrowRight, PenLine } from "lucide-react";

/**
 * **Alta — la única vez que AKVEZ pregunta algo, y ya no es al principio.**
 *
 * Se rinde desde el Composition Root cuando el usuario entra a «Generar
 * mensaje» sin perfil (H-11.1). El nombre del fichero se conserva —sigue
 * siendo el alta de primer uso— pero el momento cambió: ya no bloquea la
 * entrada al producto, sino que completa el único paso que lo necesita.
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
      {/*
        **El microcopy cambió porque cambió el momento (H-11.1).**

        Este formulario ya no abre la aplicación: aparece al pulsar «Generar
        mensaje», cuando el usuario ya ha buscado, ha visto resultados y ha
        elegido un negocio. El texto anterior —«Antes de empezar · ¿Quién
        eres?»— sonaba a puerta de entrada porque lo era.

        Ahora tiene que sonar a lo que es: **el último dato que falta para
        escribir**, pedido justo cuando su utilidad es evidente. El botón ya no
        dice «Empezar a buscar» (eso ya ocurrió); dice a dónde lleva.
      */}
      <SectionHeader
        level="screen"
        icon={<PenLine className="h-3.5 w-3.5" />}
        eyebrow="Falta tu firma"
        title="¿Quién escribe este mensaje?"
        lead="AKVEZ va a redactarlo en tu nombre y el negocio lo recibirá firmado por ti. Necesita saber cómo llamarte y a qué te dedicas. Nada más."
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
                Continuar al mensaje
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
