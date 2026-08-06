import React from "react";
import { ScoreBreakdownEntry } from "../../../../shared/types";
import { Surface, Meter, Badge } from "../../../../shared/components/ui";

/**
 * Una categoría de evaluación del Opportunity Score, como tarjeta.
 *
 * ── QUÉ PINTA, Y DE DÓNDE SALE CADA NÚMERO ───────────────────────────────────
 *
 * **Los seis valores visibles son campos del `breakdown` tal cual llegan.**
 * Este componente no calcula, no deriva y no interpreta ninguno:
 *
 * | En pantalla | Campo |
 * | --- | --- |
 * | Título | `category` |
 * | «Peso N%» | `weight` — puntos porcentuales de WP-01 (APS-08 §7.1) |
 * | «N/100» y barra | `partialScore` |
 * | «+N» | `contribution` |
 * | Texto explicativo | `rationale` |
 *
 * ── POR QUÉ LA BARRA MIDE `partialScore` Y NO `contribution` ─────────────────
 *
 * **`partialScore` está acotado a 0-100 por definición**, de modo que una barra
 * proporcional a él es legible sin escalar nada.
 *
 * **`contribution` no tiene tope fijo:** vale `(weight × partialScore) /
 * evaluatedWeight`, y `evaluatedWeight` es la suma de los pesos que *sí* se
 * pudieron medir. Si solo puntúa una categoría, su contribución es el Score
 * entero. Una barra proporcional a la contribución necesitaría un máximo
 * inventado — exactamente lo que este sprint prohíbe.
 *
 * ── AUSENCIA ≠ CERO ──────────────────────────────────────────────────────────
 *
 * **`partialScore === null` no pinta barra**: rinde un estado «Sin medir»
 * explícito. Dibujar una barra vacía comunicaría «puntuó 0», que es una
 * afirmación distinta y falsa — la distinción que **R-38** protege.
 */
export default function ScoreCategoryCard({
  entry,
  index
}: {
  entry: ScoreBreakdownEntry;
  index: number;
}) {
  const measured = entry.partialScore !== null;

  return (
    <Surface
      as="article"
      variant={measured ? "solid" : "dashed"}
      padding="lg"
      className={`group relative flex flex-col gap-5 overflow-hidden transition-all duration-300 motion-safe:animate-ak-rise ${
        measured ? "hover:border-brand/40" : ""
      }`}
      // Entrada escalonada: la rejilla se compone en cascada en lugar de
      // aparecer de golpe. Solo retardo — no altera el orden ni el contenido.
      style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
    >
      {/* Encabezado: categoría y peso en el perfil */}
      <header className="flex items-start justify-between gap-4">
        <h4 className="font-display text-base font-bold leading-tight text-app-text">
          {entry.category}
        </h4>
        <Badge size="xs">{entry.weight}%</Badge>
      </header>

      {/* Las dos cifras de la categoría, lado a lado.
          **Responden a preguntas distintas** y por eso no se funden en una:
          `partialScore` es «qué tal puntuó», `contribution` es «cuánto aportó
          al total». */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span
              className={`font-display text-4xl font-black leading-none tabular-nums ${
                measured ? "text-app-text" : "text-app-muted/40"
              }`}
            >
              {measured ? entry.partialScore : "—"}
            </span>
            {measured && <span className="font-mono text-xs text-app-muted">/100</span>}
          </div>
          <div className="mt-1.5 font-sans text-[10px] uppercase tracking-widest text-app-muted">
            {measured ? "obtenido" : "sin medir"}
          </div>
        </div>

        <div className="text-right">
          <div
            className={`font-display text-xl font-black leading-none tabular-nums ${
              measured ? "text-brand" : "text-app-muted/40"
            }`}
          >
            {/* **Dos decimales, los mismos que trae el dato.** Redondear a uno
                haría que las seis tarjetas no sumasen el total que se muestra
                al pie, y esa suma es precisamente lo que el usuario puede
                comprobar (ADR-14 §6.3, Reproducibilidad). */}
            {measured ? `+${entry.contribution.toFixed(2)}` : "—"}
          </div>
          <div className="mt-1.5 font-sans text-[10px] uppercase tracking-widest text-app-muted">
            aporta
          </div>
        </div>
      </div>

      {/* Barra de puntuación parcial. **Sin dato no hay relleno**: `Meter`
          rinde la pista rayada, que es la representación honesta de una
          categoría que no pudo medirse. */}
      <Meter
        value={measured ? (entry.partialScore as number) : undefined}
        delay={Math.min(index, 8) * 55 + 140}
      />

      {/* Explicación textual — APS-08 §9 exige que todo Score vaya acompañado
          de una explicación. Llega redactada desde `domain/`; aquí se pinta. */}
      <p className="font-sans text-xs leading-relaxed text-app-muted">
        {entry.rationale}
      </p>
    </Surface>
  );
}
