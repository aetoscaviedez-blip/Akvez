// **La lectura recortada del diagnóstico vigente** — `application/`.
//
// Autoridad: **COM-14 §2.2**, tercera fila de la cadena aprobada:
//
//     domain/        decide qué puede leerse   → `reduceDiagnosis`
//     application/   LEE EL AGREGADO VIGENTE   → este fichero
//     presentation/  expone la lectura ya recortada
//     orchestrators/ copia el resultado; no interpreta
//
// **Vive aquí porque es la única capa que puede recibir un repositorio**
// (AL-06 · R-22). `domain/` no hace I/O (DEV-00 §5.4) y `presentation/` **no
// importa persistencia, sin excepción** (R-23).
//
// **Coordina; no decide** (D-2 · RC-3). No elige qué campos sobreviven —eso lo
// decidió `domain/`— ni interpreta lo leído: obtiene la emisión vigente y aplica
// la proyección.
//
// ── QUÉ NO ES ────────────────────────────────────────────────────────────────
//
// **No es un caso de uso canónico de ADR-16 §7 y no emite ningún evento.**
// **AG-3** exige evento a toda **escritura**, y esto **no escribe nada**: ni
// versiona A-11, ni toca el estadio, ni produce estrategia. Es una consulta, y
// su precedente es `listLeadScores` del Lead Analyzer.
//
// **No importa `shared/persistence/contracts/`** (ADR-17 §13, prohibición 4 ·
// R-22): la forma de lo leído se deriva de la firma del repositorio.

import { BuyerDiagnosisRepository } from "../../../shared/persistence/repositories/BuyerDiagnosisRepository";
import { LeadReference } from "../domain/commercial/leadReference";
import { ReducedDiagnosis } from "../domain/commercial/reducedDiagnosis";
import { reduceDiagnosis } from "../domain/commercial/reduceDiagnosis";

/**
 * La emisión vigente **tal como la devuelve el repositorio**, derivada de su
 * firma y **no importada del Persistence Contract**.
 */
type StoredDiagnosis = NonNullable<
  Awaited<ReturnType<BuyerDiagnosisRepository["findCurrentByLeadId"]>>
>;

/**
 * Dependencias. **Solo puertos** (AL-08), y **uno solo**: la Repository
 * Interface del diagnóstico, **nunca el adapter** (AL-06 · R-22).
 *
 * Se recibe **solo para leer**: esta consulta no versiona A-11 —competencia de
 * `GenerateDiagnosis` (E-7) y de `RegisterContact` (E-9)— y el repositorio no
 * expone ninguna operación que se lo permita.
 */
export interface ReducedDiagnosisReaderDeps {
  buyerDiagnosisRepository: BuyerDiagnosisRepository;
}

/**
 * `null` cuando el Lead **no tiene diagnóstico vigente**.
 *
 * **Es estado válido, no un fallo**: un Lead sin diagnóstico es correcto, y así
 * lo declara el propio repositorio al devolver `null`. Envolverlo en una unión
 * discriminada añadiría un vocabulario que **COM-14 no define**, y la ausencia
 * ya se transporta sin pérdida.
 */
export type ReadReducedDiagnosisFn = (lead: LeadReference) => Promise<ReducedDiagnosis | null>;

export function createReducedDiagnosisReader(
  deps: ReducedDiagnosisReaderDeps
): ReadReducedDiagnosisFn {
  const { buyerDiagnosisRepository } = deps;

  return async function readReducedDiagnosis(
    lead: LeadReference
  ): Promise<ReducedDiagnosis | null> {
    // **La vigente, no el historial** (V-2). Las emisiones anteriores no se
    // destruyen (RC-9), pero una propuesta se decide sobre la lectura vigente.
    const current: StoredDiagnosis | null =
      await buyerDiagnosisRepository.findCurrentByLeadId(lead);

    if (current === null) return null;

    // **El recorte lo hace `domain/`, íntegro.** Esta capa no lee ninguna
    // variable, no descarta ningún campo por su cuenta y no completa nada.
    //
    // Lo leído se entrega tal cual: su forma **coincide estructuralmente** con
    // la lectura que el dominio produce —las siete variables con su clase, sus
    // indicios y la confianza—, de modo que no hay traducción que hacer aquí.
    // **Los indicios entran en la proyección y no salen de ella**, que es
    // exactamente donde COM-14 §4.2 quiere que se detengan.
    return reduceDiagnosis(current);
  };
}
