// Orchestrator de derivación de Hechos Afirmables.
//
// POR QUÉ EXISTE — es **el único componente que puede reunir** lo que la
// proyección necesita. **ADR-04 §7.6 prohíbe que un agente conozca o invoque a
// otro**, y **R-02/R-03** prohíben al dominio comercial importar el `domain/` de
// `lead-hunter` o de `lead-analyzer`. Los tres datos viven repartidos:
//
//   · atributos de la Empresa ........ Lead Hunter, dueño de la Biblioteca
//   · factores medidos ............... Lead Analyzer, dueño de la Evaluación
//   · la derivación .................. Pitch Generator, dueño del criterio
//
// **Ninguno de los tres sabe que los otros existen.** Este Orchestrator es el
// único canal por el que se encuentran — misma razón de ser que
// `leadLibraryOrchestrator`.
//
// FRONTERAS QUE RESPETA
//   · **R-24 — no conoce persistencia.** No lee repositorios: obtiene los datos
//     por Agent API, que es lo único que puede importar.
//   · R-08 — no conoce HTTP · R-09 — no conoce DTO públicos ni mappers.
//   · **R-10 — no contiene lógica de negocio.** No interpreta, no concluye y no
//     redacta: copia campos y delega. **Quien decide qué es un hecho es el
//     dominio comercial**, en `generateAffirmableFacts`.

import { LeadHunterAgentApi } from "../modules/lead-hunter/presentation/LeadHunterAgent";
import { LeadAnalyzerAgentApi } from "../modules/lead-analyzer/presentation/LeadAnalyzerAgent";
import { PitchGeneratorAgentApi } from "../modules/pitch-generator/presentation/pitchGeneratorAgent";
import { ObservedInput } from "../modules/pitch-generator/domain/commercial/affirmableFactProjection";
import { ClosedFactList } from "../modules/pitch-generator/domain/commercial/evidence";

export interface CommercialFactsDependencies {
  leadHunterAgent: LeadHunterAgentApi;
  leadAnalyzerAgent: LeadAnalyzerAgentApi;
  pitchGeneratorAgent: PitchGeneratorAgentApi;
}

export type RunCommercialFactsFn = (leadId: string) => Promise<ClosedFactList>;

/**
 * Deriva los hechos afirmables de un Lead.
 *
 * Devuelve **lista vacía** cuando el Lead no está en la Biblioteca: no es un
 * fallo del sistema, es que no hay nada observado que afirmar. **Ausencia de
 * evidencia no produce afirmación** (R-38 · RE-3).
 */
export function createCommercialFacts(
  deps: CommercialFactsDependencies
): RunCommercialFactsFn {
  const { leadHunterAgent, leadAnalyzerAgent, pitchGeneratorAgent } = deps;

  return async function runCommercialFacts(leadId: string): Promise<ClosedFactList> {
    // Ambos agentes en paralelo: son independientes y ninguno depende del otro.
    const [library, scores] = await Promise.all([
      leadHunterAgent.listLibrary(),
      leadAnalyzerAgent.listScores()
    ]);

    const lead = library.leads.find((candidate) => candidate.id === leadId);
    if (!lead) return [];

    const score = scores.scores.find((candidate) => candidate.leadId === leadId);

    // **Traducción de campos, no interpretación.** Cada valor se copia del
    // agente que lo produjo; ninguno se combina, se deduce ni se reformula.
    const observed: ObservedInput = {
      lead: lead.id,
      source: lead.source,
      ...presentText("website", lead.website),
      ...presentText("phone", lead.phone),
      ...publishedReputation(lead.rating, lead.reviewCount),
      ...measuredFactorsOf(score)
    };

    return pitchGeneratorAgent.observeFacts(observed);
  };
}

/**
 * Restituye la ausencia que la representación de origen perdió.
 *
 * `RegisteredLead` declara `website` y `phone` como `string`, y el adapter de
 * descubrimiento los rellena con **cadena vacía** cuando la fuente no los aporta.
 * **Propagar ese `""` haría que la proyección lo tomase por un dato observado.**
 *
 * No es interpretación: es **decodificación**. La cadena vacía *significa*
 * ausencia en el origen, y R-38 exige que la ausencia se represente como
 * ausencia. *(Ver hallazgo F-10: la pérdida ocurre aguas arriba.)*
 */
function presentText(field: "website" | "phone", value: string): Record<string, string> {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? {} : { [field]: trimmed };
}

/**
 * Una reputación publicada exige **calificación y volumen**.
 *
 * `rating: 0` con `reviewCount: 0` es la forma en que el origen representa «no
 * hay reseñas», y **sin reseñas no existe calificación publicada que afirmar**.
 * Emitir «su calificación es 0 sobre 0 reseñas» sería afirmar algo que nadie
 * observó.
 */
function publishedReputation(
  rating: number,
  reviewCount: number
): { rating?: number; reviewCount?: number } {
  if (typeof rating !== "number" || typeof reviewCount !== "number") return {};
  if (reviewCount <= 0) return {};
  return { rating, reviewCount };
}

/**
 * Reúne los factores que la evaluación **midió realmente**, de todas sus
 * categorías. `unmeasuredFactors` **no se toca**: lo no medido se declara
 * desconocido, nunca se rellena (RE-3 · APS-08 §11).
 *
 * Un Lead sin Score es estado válido (R-45) y simplemente no aporta factores.
 */
function measuredFactorsOf(
  score: { breakdown: Array<{ measuredFactors: string[] }> } | undefined
): { measuredFactors?: string[] } {
  if (!score) return {};
  const measured = score.breakdown.flatMap((entry) => entry.measuredFactors);
  return measured.length === 0 ? {} : { measuredFactors: measured };
}
