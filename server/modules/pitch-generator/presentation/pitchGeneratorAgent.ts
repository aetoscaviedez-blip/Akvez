import { GenerateOutreachPitchFn, PitchPayload } from "../application/generateOutreachPitch";
import {
  GenerateDiagnosisFn,
  GenerateDiagnosisInput,
  GenerateDiagnosisResult
} from "../application/generateDiagnosis";
import {
  CreateSequenceFn,
  CreateSequenceInput,
  CreateSequenceResult
} from "../application/createSequence";
import {
  GenerateProposalFn,
  GenerateProposalInput,
  GenerateProposalResult
} from "../application/generateProposal";
import {
  generateAffirmableFacts,
  ObservedInput
} from "../domain/commercial/affirmableFactProjection";
import { ClosedFactList } from "../domain/commercial/evidence";
import { LeadReference } from "../domain/commercial/leadReference";
import { ReadReducedDiagnosisFn } from "../application/readReducedDiagnosis";
import { ReadReducedSequenceFn } from "../application/readReducedSequence";
import { ReducedDiagnosis } from "../domain/commercial/reducedDiagnosis";
import { ReducedSequence } from "../domain/commercial/reducedSequence";

export interface PitchGeneratorRequest {
  designer: any;
  lead: any;
  channel: string;
  customInstructions?: string;
}

/**
 * Contrato de salida del módulo. El mapeo a respuesta HTTP (a cargo de quien invoque
 * este agente — el Orchestrator, conforme ADR-04) debe reproducir exactamente el
 * comportamiento original de `/api/prospect/outreach`:
 *
 * - "validation_error" -> HTTP 400, body `{ error }` (sin campo `success`).
 * - "generation_error" -> HTTP 500, body `{ success: false, error }`.
 * - "success"          -> HTTP 200, body `{ success: true, pitch, isFallback? }`.
 */
export type PitchGeneratorOutcome =
  | { kind: "validation_error"; error: string }
  | { kind: "generation_error"; error: string }
  | { kind: "success"; pitch: PitchPayload; isFallback?: boolean };

export interface PitchGeneratorAgentApi {
  generateOutreach(request: PitchGeneratorRequest): Promise<PitchGeneratorOutcome>;

  /**
   * Emite el Diagnóstico Comercial de un Lead — evento **E-7**.
   *
   * Se expone aquí porque **APS-03 §7.3 y ADR-16 §6 atribuyen el diagnóstico a
   * este agente**. El resultado se transporta **tal cual lo devuelve el caso de
   * uso**: `application/` ya lo expresa como unión discriminada por `outcome`
   * (AL-12), de modo que **no hay nada que traducir aquí**.
   *
   * Es deliberadamente distinto de `generateOutreach`, que sí traduce a `kind`
   * porque su contrato de salida es anterior a ADR-17 y alimenta un mapper HTTP
   * ya existente. **Un caso de uso nuevo no necesita esa capa de traducción**:
   * es exactamente lo que ADR-17 §7.3 explica al elegir `outcome` sobre un
   * booleano.
   *
   * El tipo no menciona persistencia ni puertos, de modo que esta capa sigue sin
   * importar `shared/persistence/` (R-23, «sin excepción»).
   */
  generateDiagnosis(input: GenerateDiagnosisInput): Promise<GenerateDiagnosisResult>;

  /**
   * Diseña la Secuencia Comercial de un Lead — evento **E-8**.
   *
   * Se expone aquí porque sin superficie pública el registro del caso de uso en
   * el Composition Root quedaría inerte. La ruta HTTP pertenece a la Fase 3;
   * cuando llegue, el Orchestrator invocará esta operación.
   */
  createSequence(input: CreateSequenceInput): Promise<CreateSequenceResult>;

  /**
   * Deriva los **hechos afirmables** de un negocio a partir de lo observado.
   *
   * **Es una Tool de cálculo puro**, y por eso se expone así: **DEV-00 §5.4 ·
   * ADR-04 §10** — *«una Tool de cálculo puro, sin I/O, vive en `domain/`… quien
   * la declara y expone es `presentation/`»*. No se inyecta por el Composition
   * Root porque no es una dependencia externa: es dominio propio, que esta capa
   * importa libremente (D-A1).
   *
   * **Síncrona a propósito.** No hace I/O, y declararla `Promise` sugeriría que
   * podría hacerlo.
   *
   * **No persiste nada** y no emite evento: la lista cerrada *«se construye por
   * emisión; no persiste aparte»* (DDD-01 §4.2).
   */
  observeFacts(observed: ObservedInput): ClosedFactList;

  /**
   * La lectura del comprador **ya recortada** — COM-14.
   *
   * **Lo que sale es la proyección, nunca el agregado.** Si esta operación
   * expusiera `BuyerDiagnosis`, el recorte tendría que hacerlo quien lo recibe
   * —un Orchestrator, que **no contiene lógica de negocio** (R-10)— y **decidir
   * qué puede alcanzar al mensaje volvería a ocurrir fuera del dominio**: la
   * fuga que RA-R1 · RC-3 declaran la más probable de la arquitectura comercial.
   *
   * **`null` es estado válido**: un Lead sin diagnóstico vigente es correcto.
   *
   * El tipo **no menciona persistencia ni repositorios**, de modo que esta capa
   * sigue sin importar `shared/persistence/` (R-23, «sin excepción»).
   */
  readReducedDiagnosis(lead: LeadReference): Promise<ReducedDiagnosis | null>;

  /**
   * Lo que la secuencia aporta al contacto que toca, **ya recortado** — COM-16.
   *
   * Misma razón de ser que la anterior: **transporta la memoria, nunca las
   * decisiones** (COM-16 §1.2). No salen el número de secuencia, el estado, las
   * propuestas emitidas, las estrategias de contactos anteriores ni la
   * manifestación del comprador.
   *
   * **`null` es estado válido**: sin secuencia, o con una secuencia sin contacto
   * en curso, no hay nada que preparar.
   */
  readReducedSequence(lead: LeadReference): Promise<ReducedSequence | null>;

  /**
   * Emite la Propuesta Comercial de un contacto — evento **E-5**.
   *
   * **Se expone aquí porque `presentation/` es la única superficie del módulo
   * que un Orchestrator conoce** —**R-07 · ADR-04 §7.7**—. Recibirla por
   * inyección directa sería **un Orchestrator invocando `application/`**, que es
   * exactamente lo que DEV-00 v1.3 corrigió su propio diagrama para impedir
   * *(COM-30 §2.1)*.
   *
   * > ⚠️ **Expuesta, y deliberadamente NO publicada.** **No tiene ruta HTTP y no
   * > debe tenerla mientras `SP-01` no se publique (B-1):** sin versión del
   * > Perfil de Estrategia la emisión **no es reproducible** *(ADR-15 §7.2)*, y
   * > hoy `selectStrategy` lanza. **La frontera de publicación es la ruta, no la
   * > Agent API** —cuya audiencia es el Orchestrator *(ADR-04, glosario)*—.
   * >
   * > Es el mismo estado en que `createSequence` estuvo antes de su ruta.
   *
   * El resultado se transporta **tal cual lo devuelve el caso de uso**:
   * `application/` ya lo expresa como unión discriminada por `outcome` (AL-12),
   * de modo que **no hay nada que traducir aquí**.
   */
  generateProposal(input: GenerateProposalInput): Promise<GenerateProposalResult>;
}

/**
 * Los seis casos de uso que esta fachada transporta, **con nombre** — COM-33 §3.
 *
 * **Eran seis parámetros posicionales**, y el orden era la única cosa que
 * distinguía uno de otro. Como los seis son funciones y cuatro comparten forma
 * —`(input) => Promise<Result>`—, **intercambiar dos compilaba sin error**: el
 * defecto solo aparecía al ejecutar la operación equivocada. Añadir el sexto ya
 * obligó a tocar las mismas cinco llamadas en dos sprints distintos.
 *
 * **Con nombres, el orden deja de significar nada** y omitir uno es un error de
 * compilación con el nombre del que falta.
 *
 * Es la misma forma que **ADR-17 §8.2 F-1** impone a las factorías de
 * `application/`. ⚠️ **Aquella regla gobierna `application/`, no
 * `presentation/`**: se adopta aquí por analogía y por el coste ya medido, no
 * porque un documento aprobado lo exija. `LeadHunterAgent` y `LeadAnalyzerAgent`
 * siguen siendo posicionales y **no están en infracción** *(COM-33 §3.3)*.
 *
 * Ninguna es opcional ni tiene valor por defecto: un valor por defecto sería una
 * construcción dentro de la fachada, y construir es competencia exclusiva del
 * Composition Root (ADR-09 §5.3 · R-55).
 */
export interface PitchGeneratorAgentDeps {
  generateOutreachPitch: GenerateOutreachPitchFn;
  generateDiagnosis: GenerateDiagnosisFn;
  createSequence: CreateSequenceFn;
  readReducedDiagnosis: ReadReducedDiagnosisFn;
  readReducedSequence: ReadReducedSequenceFn;
  generateProposal: GenerateProposalFn;
}

/**
 * Única API pública del módulo Pitch Generator (Agent API / capa "presentation" de ADR-04).
 * Ningún componente externo debe acceder a application/, domain/ o infrastructure/ directamente.
 *
 * **Se construye por factory desde el Composition Root** (ADR-09 §5.2), igual que
 * `LeadHunterAgent` y `LeadAnalyzerAgent`. Antes era un `const` exportado que
 * construía su propia cadena al importarse: era la desviación que **ADR-15 §9.5**
 * declara *«prerrequisito técnico de todo lo demás»* —«la única razón por la que
 * no admite dependencias nuevas»— y que **R-57** prohíbe como singleton de módulo.
 *
 * El tipo `GenerateOutreachPitchFn` no menciona el puerto de redacción, de modo
 * que esta capa transporta un caso de uso con un proveedor dentro sin conocer
 * que el proveedor existe (ADR-17 §5.3).
 */
export function createPitchGeneratorAgent({
  generateOutreachPitch,
  generateDiagnosis,
  createSequence,
  readReducedDiagnosis,
  readReducedSequence,
  generateProposal
}: PitchGeneratorAgentDeps): PitchGeneratorAgentApi {
  return {
    async generateDiagnosis(input: GenerateDiagnosisInput): Promise<GenerateDiagnosisResult> {
      return generateDiagnosis(input);
    },

    async createSequence(input: CreateSequenceInput): Promise<CreateSequenceResult> {
      return createSequence(input);
    },

    // ── Lecturas recortadas ─────────────────────────────────────────────────
    //
    // **Delegación, y nada más.** No transforman, no combinan, no completan y no
    // deciden: devuelven **exactamente** lo que el caso de uso produjo. Cualquier
    // ajuste aquí sería lógica en una fachada, y el recorte ya lo decidió
    // `domain/`.

    async readReducedDiagnosis(lead: LeadReference): Promise<ReducedDiagnosis | null> {
      return readReducedDiagnosis(lead);
    },

    async readReducedSequence(lead: LeadReference): Promise<ReducedSequence | null> {
      return readReducedSequence(lead);
    },

    // **Delegación, y nada más.** No envuelve, no traduce y no decide: devuelve
    // **exactamente** lo que el caso de uso produjo, incluidas sus cinco ramas.
    async generateProposal(input: GenerateProposalInput): Promise<GenerateProposalResult> {
      return generateProposal(input);
    },

    observeFacts(observed: ObservedInput): ClosedFactList {
      return generateAffirmableFacts(observed);
    },

    async generateOutreach(request: PitchGeneratorRequest): Promise<PitchGeneratorOutcome> {
      const { designer, lead, channel, customInstructions } = request;

      if (!designer || !lead || !channel) {
        return { kind: "validation_error", error: "Faltan parámetros requeridos." };
      }

      const result = await generateOutreachPitch({ designer, lead, channel, customInstructions });

      if (result.outcome === "success") {
        return { kind: "success", pitch: result.pitch, isFallback: result.isFallback };
      }

      return { kind: "generation_error", error: result.error };
    }
  };
}
