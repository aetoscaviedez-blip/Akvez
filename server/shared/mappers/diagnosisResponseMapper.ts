import { DiagnosisResult } from "../contracts/buyerDiagnosis";

/**
 * Forma real de `GenerateDiagnosisResult`, confirmada por lectura directa de
 * `modules/pitch-generator/application/generateDiagnosis.ts`. **No es un import
 * del módulo** —R-16 exige que cada mapper declare su propio tipo de entrada— y
 * R-15 prohíbe a `shared/mappers/` importar `modules/`.
 */
export interface InternalDiagnosisVariable {
  id: string;
  knowledgeClass: string;
  value?: string;
  indicios: string[];
}

export interface InternalDiagnosisEmission {
  id: string;
  /**
   * El módulo lo llama `lead`; el contrato público lo publica como `leadId`.
   * **Traducir ese nombre es exactamente para lo que existe este mapper**: sin
   * él, el vocabulario interno decidiría el de la API.
   */
  lead: string;
  issue: number;
  issuedAt: string;
  variables: InternalDiagnosisVariable[];
  confidence: string;
}

export type InternalDiagnosisOutcome =
  | { outcome: "success"; emission: InternalDiagnosisEmission }
  | { outcome: "persistence_failed"; reason: string };

/**
 * Traduce el resultado del caso de uso al contrato público (ADR-06 §10).
 *
 * **Traducción estructural y nada más:** no calcula, no decide, no completa y no
 * reordena. Un mapper que interpretase el diagnóstico estaría tomando una
 * decisión comercial fuera del dominio (D-1 · RA-1).
 *
 * **`criteriaVersion` se recibe y deliberadamente no se publica.** Hoy vale
 * `SIN-PERFIL-DE-ESTRATEGIA`, que es un marcador de gobernanza interno: nombra
 * un artefacto que el Blueprint aún no ha aprobado (ADR-15 §7.4, `Pospuesto`).
 * Exponerlo filtraría un estado interno al cliente sin que éste pueda hacer nada
 * con él. **Cuando exista el Perfil de Estrategia, publicarlo será una decisión
 * de ADR-06**, no un efecto colateral de esta fase.
 *
 * **`value` ausente se omite**, nunca se rellena (BD-I2 · CD-04 · R-38).
 *
 * El fallo de persistencia se traduce a `INTERNAL_ERROR` con **un mensaje
 * propio**: el motivo técnico no viaja al usuario (UI-9 · O-6 · APS-10).
 */
export function mapToDiagnosisResult(outcome: InternalDiagnosisOutcome): DiagnosisResult {
  if (outcome.outcome === "persistence_failed") {
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "No se pudo conservar el diagnóstico. Inténtalo de nuevo.",
        details: {}
      }
    };
  }

  const { emission } = outcome;
  return {
    success: true,
    diagnosis: {
      id: emission.id,
      leadId: emission.lead,
      issue: emission.issue,
      issuedAt: emission.issuedAt,
      variables: emission.variables.map((variable) => {
        const dto: InternalDiagnosisVariable = {
          id: variable.id,
          knowledgeClass: variable.knowledgeClass,
          indicios: [...variable.indicios]
        };
        if (variable.value !== undefined) dto.value = variable.value;
        return dto;
      }),
      confidence: emission.confidence
    }
  };
}
