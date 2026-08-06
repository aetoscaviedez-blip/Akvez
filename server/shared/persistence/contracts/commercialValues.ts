// Conjuntos cerrados del dominio comercial, replicados para la frontera de
// persistencia.
//
// **Verificados por lectura directa de
// `modules/pitch-generator/domain/commercial/` — no importados de allí.**
// **ADR-08 §10 prohíbe a `shared/persistence/` importar `modules/*/domain/`**, y
// DEV-00 §5.2 punto 3 lo enuncia como regla: *«la correspondencia estructural no
// se expresa con un import. Un Persistence Contract replica la forma de la
// entidad sin importarla»*. Es el mismo criterio con que `contracts/Lead.ts`
// replica `LeadStatus`.
//
// **Si el dominio cambia, este fichero debe actualizarse aquí explícitamente.**
// La duplicación es deliberada: es el precio de que la persistencia no ate al
// dominio, y ADR-08 §5 la asume expresamente.

/** APS-18 §7.2 — cinco valores. Es la variable BD-1 del diagnóstico (BD-I4). */
export type CommercialState =
  | "Inconsciente"
  | "Consciente del Problema"
  | "Consciente de la Solución"
  | "Consciente del Proveedor"
  | "Conversación";

/** APS-19 §4.2 — tres clases. */
export type KnowledgeClass = "Observable" | "Inferida" | "Desconocida";

/** APS-19 §6 — las siete variables del diagnóstico. */
export type DiagnosisVariableId =
  | "BD-1"
  | "BD-2"
  | "BD-3"
  | "BD-4"
  | "BD-5"
  | "BD-6"
  | "BD-7";

/** APS-18 §9.2 — los seis momentos de la secuencia. */
export type SequenceMoment =
  | "Reconocimiento"
  | "Evidencia"
  | "Demostración"
  | "Oferta"
  | "Seguimiento"
  | "Reactivación";

/** ADR-16 §4.3 — los cuatro estados de la secuencia. */
export type SequenceStatus = "Diseñada" | "En curso" | "Concluida" | "Detenida";

/** APS-20 §6 — los tres canales iniciales. */
export type Channel = "Email frío" | "LinkedIn Connection Note" | "Instagram DM";

/** APS-18 §4.5 — la escalera del Micro-Yes. */
export type MicroYes =
  | "leer"
  | "reconocerse"
  | "responder"
  | "aceptar ver algo"
  | "aceptar hablar";

/** APS-18 §5.1 — las cinco barreras del comprador en frío. */
export type Barrier =
  | "Identidad"
  | "Relevancia"
  | "Credibilidad"
  | "Momento"
  | "Riesgo";

/** APS-18 §8.5 — emociones admisibles. La exclusión del resto es normativa. */
export type AdmissibleEmotion =
  | "curiosidad"
  | "reconocimiento"
  | "comparación suave";

/**
 * APS-18 §11.3 — las cuatro clases de hecho afirmable.
 *
 * **No hay valor inferido, y no puede haberlo**: *«solo lo Observado puede
 * afirmarse; lo Inferido nunca»* (RE-2). El conjunto es cerrado.
 */
export type FactKind =
  | "presencia_web"
  | "contacto_publico"
  | "reputacion_publicada"
  | "factor_medido";

/**
 * De qué observación procede un hecho — parte de la **Referencia de Origen**
 * (ADR-12 §7.1). Conjunto cerrado de tres valores.
 */
export type EvidenceObservation =
  | "atributo_de_empresa"
  | "reputacion_publicada"
  | "evaluacion";
