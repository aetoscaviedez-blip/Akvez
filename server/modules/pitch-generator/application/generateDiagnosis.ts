// `GenerateDiagnosis` — caso de uso canónico de ADR-16 §7. Evento **E-7**.
//
// **Coordina; no decide** (D-2 · RA-6 · D-A3). ADR-16 §7 reparte así:
//   · `domain/` decide las siete variables, su clase, sus indicios y la confianza.
//   · `application/` obtiene la evidencia **ya unida**, invoca el cálculo y
//     entrega para persistir.
//   · `infrastructure/` persiste A-11.
//
// **Un caso de uso, un evento** (AL-04): E-7 y ninguno más.

import { BuyerDiagnosisRepository } from "../../../shared/persistence/repositories/BuyerDiagnosisRepository";
import { BuyerDiagnosisIssued } from "../domain/commercial/commercialEvents";
import { CommercialEvidence } from "../domain/commercial/commercialEvidence";
import { DiagnosisVariable } from "../domain/commercial/diagnosisVariable";
import { LeadReference } from "../domain/commercial/leadReference";
import { CRITERIA_VERSION_ABSENT, diagnoseBuyer } from "../domain/commercial/diagnoseBuyer";

/**
 * **La evidencia entra; no se busca.** ADR-15 §12: el sistema comercial la
 * recibe ya unida y **nunca la busca**. Quien la une es el Orchestrator
 * (R-02 · R-11).
 */
export interface GenerateDiagnosisInput {
  evidence: CommercialEvidence;
  /** Momento de la emisión, en ISO-8601. Lo aporta quien invoca: el dominio es puro. */
  issuedAt: string;
}

/**
 * Unión discriminada por literal (AL-12 · ADR-17 §7.3).
 *
 * `persistence_failed` es un **fallo esperado y significativo** —el diagnóstico
 * se calculó pero no pudo conservarse—, y **C-3 · R-61** exigen que viaje como
 * rama del resultado y no como excepción.
 *
 * **No transporta el contrato de persistencia ni ningún DTO** (AL-13 · R-22):
 * devuelve la identidad de la emisión y el evento que la declara.
 */
/**
 * La emisión producida, **en tipos del propio módulo** (C-2 · AL-13).
 *
 * Se construye a partir de la lectura del dominio y no del objeto devuelto por
 * el repositorio: transportar el Persistence Contract sería la desviación que
 * **R-22 y ADR-08 §10** prohíben. Del repositorio solo se toma `id`, que es una
 * cadena y no un contrato.
 */
export interface DiagnosisEmission {
  id: string;
  lead: LeadReference;
  issue: number;
  issuedAt: string;
  variables: DiagnosisVariable[];
  confidence: string;
}

export type GenerateDiagnosisResult =
  | { outcome: "success"; emission: DiagnosisEmission; event: BuyerDiagnosisIssued }
  | { outcome: "persistence_failed"; reason: string };

/**
 * Dependencias. **Solo puertos** (F-2 · AL-08): el repositorio es la Repository
 * Interface, nunca el adapter (R-22 · ADR-08 §10). Ninguna es opcional (F-3).
 *
 * `diagnoseBuyer` **no viaja aquí**: es `domain/` del propio módulo y se importa
 * libremente (D-A1). Solo lo externo se inyecta.
 */
export interface GenerateDiagnosisDeps {
  buyerDiagnosisRepository: BuyerDiagnosisRepository;
}

export type GenerateDiagnosisFn = (
  input: GenerateDiagnosisInput
) => Promise<GenerateDiagnosisResult>;

export function createGenerateDiagnosis(
  deps: GenerateDiagnosisDeps
): GenerateDiagnosisFn {
  const { buyerDiagnosisRepository } = deps;

  return async function generateDiagnosis(
    input: GenerateDiagnosisInput
  ): Promise<GenerateDiagnosisResult> {
    const { evidence, issuedAt } = input;

    // ── DECISIÓN ────────────────────────────────────────────────────────────
    // La toma el dominio, íntegra. Esta capa no lee ninguna variable, no la
    // corrige y no la completa: hacerlo sería la fuga que RA-R1 y RC-3 declaran
    // la más probable de toda la arquitectura comercial.
    const reading = diagnoseBuyer(evidence);

    // ── NÚMERO DE EMISIÓN ───────────────────────────────────────────────────
    // Se versiona: cada emisión añade y ninguna retira (V-1 · RC-9). El número
    // sale del historial existente, de modo que la identidad `(Lead, nº emisión)`
    // sea la de ADR-16 §4.2 y no una invención de esta capa.
    let issue: number;
    try {
      const previous = await buyerDiagnosisRepository.findVersionsByLeadId(evidence.lead);
      issue = previous.length + 1;
    } catch (error) {
      return { outcome: "persistence_failed", reason: describe(error) };
    }

    // ── ENTREGA PARA PERSISTIR ──────────────────────────────────────────────
    try {
      const stored = await buyerDiagnosisRepository.save({
        leadId: evidence.lead,
        issue,
        variables: reading.variables,
        confidence: reading.confidence,
        // RC-13 — no hay Perfil de Estrategia vigente y no se fabrica una
        // versión. Ver `CRITERIA_VERSION_ABSENT`.
        criteriaVersion: CRITERIA_VERSION_ABSENT,
        issuedAt
      });

      // E-7 del catálogo cerrado de ADR-13 §13.1. **No se declara ningún otro**:
      // este caso de uso no toca el estadio (solo E-9 lo hace, CE-I1) y no
      // modifica el Opportunity Score (CD-11).
      return {
        outcome: "success",
        emission: {
          id: stored.id,
          lead: evidence.lead,
          issue,
          issuedAt,
          variables: reading.variables,
          confidence: reading.confidence
        },
        event: { code: "E-7", diagnosis: { lead: evidence.lead, issue } }
      };
    } catch (error) {
      return { outcome: "persistence_failed", reason: describe(error) };
    }
  };
}

/**
 * Mensaje legible del fallo, **sin traza ni detalle del motor** (UI-9 · O-6).
 * El error original no se pierde: lo conserva quien lo lanzó, con su `cause`
 * (R-63).
 */
function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
