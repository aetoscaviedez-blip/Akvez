// Orchestrator de emisión del Diagnóstico Comercial.
//
// POR QUÉ EXISTE — **R-11 es terminante**: «Todo workflow pasa por un
// Orchestrator. `routes/` **nunca** invoca un agente directamente, **ni siquiera
// de un solo módulo**». Hoy coordina un único agente, igual que
// `pitchOutreachOrchestrator`, y eso no lo hace prescindible: es la frontera que
// impide que una ruta alcance una Agent API, y el punto donde se añadirá la
// coordinación con el Lead Analyzer cuando la evidencia deje de llegar en el
// request (ver nota al final).
//
// FRONTERAS QUE RESPETA
//   · R-08 — no conoce HTTP: no recibe `Request`/`Response`, no importa express.
//   · R-09 — no conoce DTO públicos ni mappers.
//   · R-10 — no contiene lógica de negocio: no diagnostica y no interpreta.
//   · R-24 — no conoce persistencia: el tipo que importa no menciona
//     repositorios ni adapters.

import { PitchGeneratorAgentApi } from "../modules/pitch-generator/presentation/pitchGeneratorAgent";
import {
  GenerateDiagnosisInput,
  GenerateDiagnosisResult
} from "../modules/pitch-generator/application/generateDiagnosis";

export interface CommercialDiagnosisDependencies {
  pitchGeneratorAgent: PitchGeneratorAgentApi;
}

export type RunCommercialDiagnosisFn = (
  input: GenerateDiagnosisInput
) => Promise<GenerateDiagnosisResult>;

/**
 * **La evidencia llega desde arriba y este workflow no la busca** (ADR-15 §12).
 *
 * Cuando el sistema deba componerla a partir del análisis vigente en lugar de
 * recibirla en el request, **es aquí donde se coordinará con el Lead Analyzer**:
 * ADR-04 §7.6 prohíbe que el Pitch Generator invoque a otro agente, y R-02 que
 * un caso de uso lo haga. Ese cambio no tocará ni el dominio ni
 * `GenerateDiagnosis`.
 */
export function createCommercialDiagnosis(
  deps: CommercialDiagnosisDependencies
): RunCommercialDiagnosisFn {
  const { pitchGeneratorAgent } = deps;

  return async function runCommercialDiagnosis(
    input: GenerateDiagnosisInput
  ): Promise<GenerateDiagnosisResult> {
    return pitchGeneratorAgent.generateDiagnosis(input);
  };
}
