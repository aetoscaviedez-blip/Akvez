// **La lectura recortada de la secuencia vigente** — `application/`.
//
// Autoridad: **COM-16 §6**, misma cadena que `readReducedDiagnosis`:
//
//     domain/        decide qué puede saberse   → `reduceSequence`
//     application/   LEE EL AGREGADO VIGENTE    → este fichero
//     presentation/  expone la lectura ya recortada
//     orchestrators/ copia el resultado; no interpreta
//
// **Vive aquí porque es la única capa que puede recibir un repositorio**
// (AL-06 · R-22). `domain/` no hace I/O (DEV-00 §5.4) y `presentation/` **no
// importa persistencia, sin excepción** (R-23).
//
// **Coordina; no decide** (D-2 · RC-3): obtiene la secuencia vigente y aplica la
// proyección. No elige qué campos sobreviven ni interpreta lo leído.
//
// **No es un caso de uso canónico y no emite ningún evento**: **AG-3** exige
// evento a toda **escritura**, y esto no escribe. No diseña el plan —eso es
// `CreateSequence` (E-8)— ni lo actualiza —eso es `RegisterContact` (E-9)—.
//
// **No importa `shared/persistence/contracts/`** (ADR-17 §13, prohibición 4 ·
// R-22): la forma de lo leído se deriva de la firma del repositorio.

import { CommercialSequenceRepository } from "../../../shared/persistence/repositories/CommercialSequenceRepository";
import { LeadReference } from "../domain/commercial/leadReference";
import { ReducedSequence } from "../domain/commercial/reducedSequence";
import { reduceSequence } from "../domain/commercial/reduceSequence";

/**
 * Una secuencia **tal como la devuelve el repositorio**, derivada de su firma y
 * **no importada del Persistence Contract**.
 */
type StoredSequence = Awaited<
  ReturnType<CommercialSequenceRepository["findByLeadId"]>
>[number];

/**
 * Dependencias. **Solo puertos** (AL-08), y **uno solo**: la Repository
 * Interface de la secuencia, **nunca el adapter** (AL-06 · R-22).
 *
 * Se recibe **solo para leer**. El repositorio expone `save` y `update`, y esta
 * consulta **no invoca ninguna de las dos**.
 */
export interface ReducedSequenceReaderDeps {
  commercialSequenceRepository: CommercialSequenceRepository;
}

/**
 * `null` cuando el Lead **no tiene secuencia vigente**, o cuando la que tiene
 * **no tiene contacto en curso** *(`reduceSequence`)*.
 *
 * **Es estado válido, no un fallo**: un Lead sin secuencia es correcto, y una
 * secuencia recién concluida no tiene contacto que preparar. Envolverlo en una
 * unión discriminada añadiría un vocabulario que **COM-16 no define**.
 */
export type ReadReducedSequenceFn = (lead: LeadReference) => Promise<ReducedSequence | null>;

export function createReducedSequenceReader(
  deps: ReducedSequenceReaderDeps
): ReadReducedSequenceFn {
  const { commercialSequenceRepository } = deps;

  return async function readReducedSequence(
    lead: LeadReference
  ): Promise<ReducedSequence | null> {
    // **Todas las secuencias del Lead, porque puede tener varias** (CS-I5): una
    // nueva **no borra la anterior**, y el repositorio las devuelve todas sin
    // recorte —las concluidas y las detenidas incluidas— (R-42 · R-44).
    const sequences: StoredSequence[] = await commercialSequenceRepository.findByLeadId(lead);
    if (sequences.length === 0) return null;

    // **La vigente es la de mayor número de secuencia**, que es el discriminante
    // de identidad de A-12 (ADR-16 §4.3 · AG-1) y crece con cada diseño nuevo.
    // No se confía en el orden que devuelva el motor.
    const current = sequences.reduce((latest, sequence) =>
      sequence.sequence > latest.sequence ? sequence : latest
    );

    // **El recorte lo hace `domain/`, íntegro.** Esta capa no lee ningún momento,
    // no descarta ningún campo por su cuenta y no completa nada. Lo almacenado
    // **satisface estructuralmente** la lectura estrecha que la proyección
    // declara, de modo que aquí no hay traducción que hacer.
    return reduceSequence(current);
  };
}
