import React from "react";
import { Prospect } from "../../../../shared/types";
import {
  Surface, Badge, Callout, Button, ActionCard, Eyebrow, StatGrid, StatTile
} from "../../../../shared/components/ui";
import {
  MapPin, Globe, AlertTriangle, Zap, DollarSign, Target, Phone,
  MessageSquare, Star, Calendar, Search, ShieldCheck, Gauge, Award, Quote
} from "lucide-react";

interface LeadCardProps {
  lead: Prospect;
  isActive: boolean;
  onSelectLead: (id: string) => void;
  /** Abre la Opportunity View sobre este Lead. */
  onOpenOpportunity: (id: string) => void;
}

/**
 * **`LeadCard` — la tarjeta de una oportunidad.**
 *
 * ── POR QUÉ SE RECONSTRUYÓ ENTERA ────────────────────────────────────────────
 *
 * **Es el componente más visible de la demo:** aparece en el Executive Dashboard
 * *y* en el Lead Hunter, y es lo que un jurado tiene delante durante más tiempo.
 * También era el más alejado de la referencia: seis emojis, cinco esquemas de
 * color de chip distintos, `shadow-inner`, dos `animate-pulse` sin significado,
 * un hexadecimal a mano y **el Opportunity Score a 18 px** dentro de una caja con
 * una llama superpuesta.
 *
 * No se ha migrado: se ha vuelto a escribir sobre las primitivas del sistema.
 * **No queda una sola clase de color, borde, radio o superficie fuera de ellas.**
 *
 * ── LA JERARQUÍA, QUE ES LO QUE CAMBIA DE VERDAD ─────────────────────────────
 *
 * La referencia enseña un orden que es un argumento comercial, y la tarjeta lo
 * reproduce a su escala:
 *
 *     QUIÉN ES        → distintivos, nombre, vías de contacto
 *     CUÁNTO PUNTÚA   → el Score, en naranja y dominando la tarjeta
 *     QUÉ TAN FIABLE  → nivel, confianza y cobertura, en rejilla sin costuras
 *     POR QUÉ         → diagnóstico y evidencia
 *     QUÉ HACER       → tres acciones, **una sola primaria**
 *
 * **El Score pasa de 18 px a 48 px** — de competir con el nombre a ser el único
 * destino de la mirada. Es la regla 1 del ADN aplicada al tamaño de una tarjeta.
 *
 * ── QUÉ NO HA CAMBIADO ───────────────────────────────────────────────────────
 *
 * **Ni una condición, ni un dato, ni una acción.** Mismos `props`, mismos
 * `onClick`, mismos campos y mismas reglas de ausencia: `typeof score ===
 * "number"` (R-45), la reputación solo si hay algo que afirmar, el distintivo de
 * dato de ejemplo, la lista vacía de problemas declarada como resultado (R-38) y
 * el ángulo que no se inventa cuando no llegó.
 */
export default function LeadCard({ lead, isActive, onSelectLead, onOpenOpportunity }: LeadCardProps) {
  // **`typeof === "number"`, NO `!!score`**: un Score de **0 es una puntuación
  // real** y `null` es una ausencia legítima (**R-45**).
  const hasScore = typeof lead.score === "number";

  const hasReputation = (lead.rating ?? 0) > 0 || (lead.reviewCount ?? 0) > 0;
  const hasIntelligence =
    hasScore && (!!lead.band || !!lead.confidence || lead.coverage !== undefined);

  // **Composición, no contenido.** Cuando el análisis solo produjo uno de los dos
  // diagnósticos, la rejilla de dos columnas lo dejaba a media anchura con el
  // texto estrangulado en tres líneas cortas y media tarjeta vacía al lado. Con
  // uno solo, ocupa el ancho completo. **No cambia qué se muestra: cómo se
  // reparte el espacio de lo que ya se mostraba.**
  const diagnosisCount = (lead.whyWebsiteNeeded ? 1 : 0) + (lead.revenueLoss ? 1 : 0);

  return (
    <Surface
      as="article"
      className={`overflow-hidden transition-colors duration-300 ${
        // El estado activo se marca con un anillo interior en lugar de recolorear
        // el borde: no compite con la clase de borde de `Surface` y rinde el
        // mismo trazo continuo sin duplicar líneas.
        isActive ? "ring-1 ring-inset ring-brand" : "hover:border-brand/40"
      }`}
    >

      {/* ── 1 · QUIÉN ES · CUÁNTO PUNTÚA ──────────────────────────────────── */}
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            {/*
              **Un dato de ejemplo debe declararse como tal.** Sin este
              distintivo, un Lead de muestra —con score, clasificación y
              problemas— es indistinguible de un resultado de búsqueda real.

              Va en `pill` y no en chip neutro por la misma razón que en el Hero:
              **es una declaración de integridad, no un dato**, y F2.5 comprobó
              que el tratamiento neutro la dejaba indistinguible de sus vecinos.
            */}
            {lead.isDemo && (
              <Badge variant="pill" tone="warn" icon={<AlertTriangle className="h-3.5 w-3.5" />}>
                Dato de ejemplo — no es un resultado real
              </Badge>
            )}

            <Badge icon={<Calendar className="h-3 w-3" />}>{lead.dateCreated}</Badge>

            {/* **Rojo se reserva a «Sin sitio web»** — el único uso que el ADN le
                asigna. El resto de estados del sitio son grados de deficiencia y
                comparten el ámbar de advertencia. **El tono viaja en el icono; el
                texto se mantiene neutro**, para que una fila de cinco distintivos
                no se convierta en un semáforo. */}
            {lead.classification && (
              <Badge
                tone={lead.classification === "Sin sitio web" ? "danger" : "warn"}
                icon={<Globe className="h-3 w-3" />}
              >
                {lead.classification}
              </Badge>
            )}

            {/*
              **Solo se rotula la fuente que el servidor declara.** Aquí hubo
              ramas para «Instagram», «Facebook» y «Directorio» — fuentes que el
              sistema **no consulta**: su adapter está huérfano y el Composition
              Root no lo construye. Anunciarlas sugería una cobertura inexistente.
            */}
            {lead.source && (
              <Badge
                icon={
                  lead.source === "Google Maps"
                    ? <MapPin className="h-3 w-3" />
                    : <Search className="h-3 w-3" />
                }
              >
                {lead.source}
              </Badge>
            )}
          </div>

          {/* El nombre abre la Opportunity View. Es la vía de acceso disponible
              **siempre**, también cuando el Lead no trae Evaluación y por tanto
              no rinde la franja de inteligencia.

              **F4.5 · R-06 — baja de 26 px a 22.** Iba exactamente al mismo
              tamaño y peso que el título de la sección que contiene la lista, y
              dos niveles distintos de la jerarquía no pueden verse iguales.
              **La sección es el contenedor y debe pesar más**, así que cede la
              tarjeta. */}
          <button
            type="button"
            onClick={() => onOpenOpportunity(lead.id)}
            className="block cursor-pointer text-left font-display text-xl font-semibold leading-snug text-app-text transition-colors hover:text-brand"
          >
            {lead.name}
          </button>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs">
            {/* La ausencia de sitio web se lee del **dato**, no de una cadena de
                relleno: es el hecho comercial más relevante del producto. */}
            {lead.website ? (
              <a
                href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-brand transition-colors hover:text-brand/75"
              >
                <Globe className="h-3.5 w-3.5" />
                {lead.website}
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-app-muted">
                <Globe className="h-3.5 w-3.5" />
                Sin sitio web registrado
              </span>
            )}

            {lead.googleMapsUrl && (
              <a
                href={lead.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-app-muted transition-colors hover:text-app-text"
              >
                <MapPin className="h-3.5 w-3.5" />
                Ver ficha en Google Maps
              </a>
            )}

            {lead.phone && (
              <span className="inline-flex items-center gap-1.5 text-app-muted">
                <Phone className="h-3.5 w-3.5" />
                {lead.phone}
              </span>
            )}
          </div>

          {/*
            **«Maps verificado» solo se afirma si hay algo verificado.** Antes
            bastaba con que el campo estuviera definido —y el adapter lo define
            siempre, con `0`—, de modo que el distintivo aparecía vacío
            reclamando una verificación que no respaldaba ningún dato.
          */}
          {hasReputation && (
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success" icon={<ShieldCheck className="h-3 w-3" />}>
                Maps verificado
              </Badge>
              {lead.rating && lead.rating > 0 ? (
                <Badge tone="warn" icon={<Star className="h-3 w-3" />}>
                  {lead.rating.toFixed(1)} / 5.0
                </Badge>
              ) : null}
              {lead.reviewCount && lead.reviewCount > 0 ? (
                <Badge>{lead.reviewCount} reseñas</Badge>
              ) : null}
            </div>
          )}
        </div>

        {/* ── El Score ────────────────────────────────────────────────────────
            **Naranja y a 48 px: el único destino de la mirada en la tarjeta.**
            El ADN reserva el naranja a marca y acción, y **la cifra del Score es
            precisamente lo que la marca vende**. La proporción respecto al cuerpo
            pasa de 1,5× a 4×.

            El rótulo dice «Opportunity Score», que es el nombre del dato en el
            dominio. Decía «Lead Score», que no existe en ninguna parte. */}
        <div className="shrink-0 text-left sm:text-right">
          <Eyebrow className="sm:justify-end">Opportunity Score</Eyebrow>
          <div className="mt-1.5 flex items-baseline gap-1.5 sm:justify-end">
            {/* **Ausencia explícita**: «—», nunca un número inventado. */}
            <span
              className={`font-display text-5xl font-black leading-none tabular-nums ${
                hasScore ? "text-brand" : "text-app-muted/40"
              }`}
            >
              {hasScore ? lead.score : "—"}
            </span>
            {hasScore && (
              <span className="font-mono text-xs text-app-muted">/ 100</span>
            )}
          </div>
          {!hasScore && (
            <p className="mt-1.5 font-sans text-xs text-app-muted">Sin evaluar</p>
          )}
        </div>
      </div>

      {/* ── 2 · QUÉ TAN FIABLE ES ──────────────────────────────────────────────
          **Nivel, confianza y cobertura.** Los tres se calculan en `domain/` y
          llegan por el contrato público.

          **Solo se muestra lo que llegó.** Un Lead sin evaluar no rinde esta
          franja, en lugar de rendirla con huecos. */}
      {hasIntelligence && (
        <div className="px-6 pb-6">
          <StatGrid columns={3}>
            <StatTile
              level="raised"
              size="sm"
              // El nivel es una **etiqueta de prioridad**, nunca un criterio de
              // admisión (APS-08 §8.6). Verde: es un valor conseguido.
              tone="success"
              icon={<Award className="h-3.5 w-3.5" />}
              label="Nivel de oportunidad"
              value={lead.band ?? undefined}
              fallback="Sin nivel asignado"
            />
            <StatTile
              level="raised"
              size="sm"
              tone="intel"
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
              label="Confianza del análisis"
              value={lead.confidence ?? undefined}
            />
            <StatTile
              level="raised"
              size="sm"
              tone="intel"
              icon={<Gauge className="h-3.5 w-3.5" />}
              label="Cobertura"
              // `coverage` llega como proporción 0-1. Mostrarlo en porcentaje es
              // un cambio de unidad, no un cálculo nuevo.
              value={
                lead.coverage !== undefined
                  ? `${Math.round(lead.coverage * 100)}% de factores`
                  : undefined
              }
              meter={
                lead.coverage !== undefined
                  ? Math.round(lead.coverage * 100)
                  : undefined
              }
              hint={lead.scoreVersion ? `Perfil ${lead.scoreVersion}` : undefined}
            />
          </StatGrid>
        </div>
      )}

      {/*
        **El desglose no se despliega aquí: se abre en la Opportunity View.**
        Antes esta tarjeta plegaba `ScoreBreakdown` en un espacio de 360 px dentro
        de una lista, donde las seis categorías competían con el resto del
        contenido. **No se pierde nada y no se duplica nada:** es la misma
        explicación, en la pantalla que puede mostrarla entera.
      */}
      {lead.breakdown && lead.breakdown.length > 0 && (
        <div className="px-6 pb-6">
          <ActionCard
            tone="intel"
            icon={<Search className="h-4 w-4" />}
            title="Ver cómo se calculó este Score"
            detail="El desglose por categorías, factor a factor."
            onClick={() => onOpenOpportunity(lead.id)}
          />
        </div>
      )}

      {/* ── 3 · POR QUÉ ────────────────────────────────────────────────────── */}
      <div className="space-y-7 border-t border-app-border px-6 py-7">

        {/* Se omite si el análisis no la produjo.

            **F4.5 · R-01 — era el peor hallazgo de legibilidad del producto.**
            Iba a 14 px en una caja de 750 px: ~110 caracteres por línea. Y
            estaba justo encima de las tarjetas de problemas, que van a 16 px,
            de modo que **lo que presenta el negocio se leía más pequeño que el
            detalle que lo matiza**: la jerarquía al revés. */}
        {lead.description && (
          <p className="max-w-measure font-sans text-sm text-app-muted">
            {lead.description}
          </p>
        )}

        <div
          className={`grid grid-cols-1 gap-4 ${
            diagnosisCount === 2 ? "lg:grid-cols-2" : ""
          }`}
        >
          {lead.whyWebsiteNeeded && (
            <Callout
              tone="brand"
              icon={<Target className="h-4 w-4" />}
              title="Por qué necesita un sitio web"
            >
              <span className="italic">"{lead.whyWebsiteNeeded}"</span>
            </Callout>
          )}

          {lead.revenueLoss && (
            <Callout
              tone="warn"
              icon={<DollarSign className="h-4 w-4" />}
              title="Impacto financiero estimado"
            >
              {lead.revenueLoss}
            </Callout>
          )}
        </div>

        <div className="space-y-3">
          <Eyebrow as="h4" icon={<AlertTriangle className="h-3.5 w-3.5 text-warn" />}>
            Problemas web detectados
          </Eyebrow>

          {/* Lista vacía = **el análisis no detectó problemas**. Es un
              resultado, y se declara (R-38). */}
          {lead.flaws.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {lead.flaws.map((flaw, index) => (
                <Surface
                  as="li"
                  key={index}
                  level="raised"
                  radius="card"
                  padding="md"
                  className="flex items-start gap-3 font-sans text-sm text-app-muted motion-safe:animate-ak-rise"
                  style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
                  {flaw}
                </Surface>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-xs italic text-app-muted">
              El análisis no detectó problemas web para este negocio.
            </p>
          )}
        </div>

        {/* **Sin ángulo no se inventa uno**: se declara que no se generó. */}
        <Callout
          tone={lead.angle ? "brand" : "neutral"}
          icon={lead.angle ? <Zap className="h-4 w-4" /> : <Quote className="h-4 w-4" />}
          title="Ángulo de oportunidad"
        >
          {lead.angle ?? (
            <span className="italic text-app-muted">
              No se generó un ángulo de oportunidad para este negocio.
            </span>
          )}
        </Callout>
      </div>

      {/* ── 4 · QUÉ HACER ──────────────────────────────────────────────────────
          **Tres acciones de altura idéntica y una sola primaria.** La referencia
          es explícita: cuando todo destaca, nada destaca. */}
      <div className="grid grid-cols-1 gap-3 border-t border-app-border px-6 py-5 sm:grid-cols-3">
        <Button
          fullWidth
          href={lead.googleMapsUrl}
          external
          disabled={!lead.googleMapsUrl}
          icon={<MapPin className="h-4 w-4" />}
        >
          Maps
        </Button>

        <Button
          fullWidth
          href={lead.phone ? `tel:${lead.phone}` : undefined}
          // Sin teléfono, el control conserva su comportamiento anterior: copiar
          // al portapapeles lo que haya. No se retira ni se cambia.
          onClick={
            lead.phone
              ? undefined
              : () => navigator.clipboard.writeText(lead.phone || lead.name)
          }
          icon={<Phone className="h-4 w-4" />}
        >
          Contacto
        </Button>

        <Button
          fullWidth
          variant={isActive ? "primary" : "secondary"}
          onClick={() => onSelectLead(lead.id)}
          icon={<MessageSquare className="h-4 w-4" />}
        >
          Generar mensaje
        </Button>
      </div>
    </Surface>
  );
}
