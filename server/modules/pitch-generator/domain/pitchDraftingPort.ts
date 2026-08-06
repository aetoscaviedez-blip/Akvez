// Puerto de proveedor del módulo Pitch Generator — redacción del mensaje.
//
// **Es el puerto que ADR-16 §2 ya presuponía** al declarar que la dependencia
// del sistema comercial sobre la redacción es «un puerto declarado por
// `domain/`». Hasta ahora esa presuposición no era exigible: `application/`
// importaba el adapter directamente. ADR-17 §12 (AL-19) la hace exigible y este
// fichero la materializa.
//
// Cumplimiento de ADR-17 §6.3:
//   · P-1 — solo tipos de este `domain/` y primitivos.
//   · P-2 — **no nombra ningún proveedor.** Que hoy redacte Gemini es una
//           decisión del Composition Root; sustituirlo no toca esta interfaz ni
//           `application/` (ADR-17 §9.3).
//   · P-3 — no expone parámetro operativo alguno: ni modelo, ni reintentos, ni
//           tiempo de espera, ni formato de respuesta.
//   · P-4 — no expone credenciales.
//
// **Lo que este puerto todavía NO expresa.** ADR-15 §8 y §10 exigen que la
// redacción reciba decisiones cerradas —una `Commercial Strategy` y la lista
// cerrada de hechos afirmables— y que el dominio verifique el texto contra ella.
// Esa forma corresponde al caso de uso `GenerateProposal` de ADR-16 §7, que
// **no pertenece a esta fase**. Este puerto declara la dependencia tal como el
// flujo actual la ejerce, sin ampliarla ni anticiparla.

/**
 * El texto de un contacto, ya redactado.
 *
 * `subjectLine` va vacío cuando el canal no lo admite —un DM no tiene asunto—,
 * que es la representación correcta de un dato inexistente: no se rellena por
 * defecto (R-38).
 */
export interface PitchDraft {
  subjectLine: string;
  message: string;
  strategyExplanation: string;
}

/**
 * Lo que el Pitch Generator necesita del exterior para redactar un contacto.
 *
 * Un fallo del proveedor se propaga **como excepción envuelta por el adapter,
 * conservando `cause`** (R-63 · AL-14). `application/` decide entonces si activa
 * la redacción de respaldo: esa decisión es de coordinación y no cruza la
 * frontera hacia `infrastructure/`.
 */
export interface PitchDraftingPort {
  draft(input: PitchDraftingInput): Promise<PitchDraft>;
}

export interface PitchDraftingInput {
  designer: any;
  lead: any;
  channel: string;
  customInstructions?: string;
}
