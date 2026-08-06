// Composition Root del backend (ADR-09 §5.1).
//
// Este es el ÚNICO lugar del sistema autorizado a importar
// `shared/persistence/adapters/` y a construir instancias concretas de
// Database Adapter. Ninguna otra capa construye sus propias dependencias:
// todas reciben lo que necesitan ya construido, por parámetro (ADR-09 §5.3).
//
// **Desde ADR-17 §9.1 (AL-20) también construye los adapters de proveedor.** Es
// la fila que ese ADR añade a la tabla de ADR-09 §8: si `application/` recibe un
// puerto, alguien tiene que construir el adapter que lo implementa, y el único
// lugar autorizado a construir es este. La excepción es acotada y verificable:
// un import de `modules/*/infrastructure/` solo es admisible aquí si su único
// uso es construir un adapter y pasarlo como valor de un campo de `Deps`
// (ADR-17 §9.1 · KPI-4). Ninguno se invoca, se lee ni se compone con lógica.
//
// No contiene lógica de negocio, no conoce HTTP semántico ni dominio — solo
// ensambla el grafo de dependencias una vez, al arrancar el proceso.

import { getGooglePlacesApiKey } from "../shared/config/env";
import { createInMemoryLeadAdapter } from "../shared/persistence/adapters/inMemoryLeadAdapter";
import { createInMemoryLeadAnalysisAdapter } from "../shared/persistence/adapters/inMemoryLeadAnalysisAdapter";
import { createInMemoryBuyerDiagnosisAdapter } from "../shared/persistence/adapters/inMemoryBuyerDiagnosisAdapter";
import { createInMemoryCommercialSequenceAdapter } from "../shared/persistence/adapters/inMemoryCommercialSequenceAdapter";
import { createInMemoryProposalAdapter } from "../shared/persistence/adapters/inMemoryProposalAdapter";
import { createGooglePlacesDiscovery } from "../modules/lead-hunter/infrastructure/googlePlacesAdapter";
import { createDiscoverProspects } from "../modules/lead-hunter/application/discoverProspects";
import { createListLeadLibrary } from "../modules/lead-hunter/application/listLeadLibrary";
import { createLeadHunterAgent } from "../modules/lead-hunter/presentation/LeadHunterAgent";
import { createGeminiLeadAnalysis } from "../modules/lead-analyzer/infrastructure/leadAnalysisAdapter";
import { createAnalyzeProspects } from "../modules/lead-analyzer/application/analyzeProspects";
import { createListLeadScores } from "../modules/lead-analyzer/application/listLeadScores";
import { createLeadAnalyzerAgent } from "../modules/lead-analyzer/presentation/LeadAnalyzerAgent";
import { createGeminiPitchDrafting } from "../modules/pitch-generator/infrastructure/pitchGenerationAdapter";
import { createGeminiProposalDrafting } from "../modules/pitch-generator/infrastructure/proposalDraftingAdapter";
import { createGenerateProposal } from "../modules/pitch-generator/application/generateProposal";
import { createGenerateOutreachPitch } from "../modules/pitch-generator/application/generateOutreachPitch";
import { createGenerateDiagnosis } from "../modules/pitch-generator/application/generateDiagnosis";
import { createCreateSequence } from "../modules/pitch-generator/application/createSequence";
import { createReducedDiagnosisReader } from "../modules/pitch-generator/application/readReducedDiagnosis";
import { createReducedSequenceReader } from "../modules/pitch-generator/application/readReducedSequence";
import { createPitchGeneratorAgent } from "../modules/pitch-generator/presentation/pitchGeneratorAgent";
import { createLeadAcquisitionWorkflow } from "../orchestrators/leadAcquisitionOrchestrator";
import { createLeadLibraryQuery } from "../orchestrators/leadLibraryOrchestrator";
import { createPitchOutreachWorkflow } from "../orchestrators/pitchOutreachOrchestrator";
import { createCommercialDiagnosis } from "../orchestrators/commercialDiagnosisOrchestrator";
import { createCommercialSequence } from "../orchestrators/commercialSequenceOrchestrator";
import { createCommercialFacts } from "../orchestrators/commercialFactsOrchestrator";
import { createCommercialProposal } from "../orchestrators/commercialProposalOrchestrator";
import { createProspectSearchHandler } from "../routes/prospectSearchRoute";
import { createLeadLibraryHandler } from "../routes/leadLibraryRoute";
import { createProspectOutreachHandler } from "../routes/prospectOutreachRoute";
import { createDiagnosisHandler } from "../routes/diagnosisRoute";
import { createSequenceHandler } from "../routes/sequenceRoute";
import { RouteDependencies } from "../routes";

/**
 * Construye el grafo de dependencias del backend.
 *
 * Debe invocarse UNA sola vez, durante el arranque del proceso. Las instancias
 * creadas aquí son propiedad de este Composition Root y viven durante todo el
 * ciclo del servidor (ADR-09 §6) — no son singletons globales: no se exportan
 * como estado mutable de módulo ni son alcanzables desde ningún otro archivo,
 * solo viajan explícitamente por la cadena de parámetros.
 *
 * Sustituir `InMemoryLeadAdapter` por un adapter de motor real es un cambio de
 * una sola línea aquí; ninguna otra capa se entera (ADR-09 §6).
 */
export function buildApplicationDependencies(): RouteDependencies {
  // Persistencia — única construcción de Adapter en todo el backend
  const leadRepository = createInMemoryLeadAdapter();
  // Emisiones de Opportunity Score, con su versión de Perfil de Ponderación y el
  // perfil de usuario que las produjo (R-34). Append-only: ADR-13 §10.3 V-1.
  const leadAnalysisRepository = createInMemoryLeadAnalysisAdapter();
  // Emisiones del Diagnóstico Comercial (A-11). Append-only: cada emisión añade
  // y ninguna retira (ADR-13 §10.3 V-1).
  const buyerDiagnosisRepository = createInMemoryBuyerDiagnosisAdapter();
  // Secuencias Comerciales (A-12). **Actualizable, no versionada**
  // (ADR-13 §10.3): el rastro de sus cambios lo conserva el historial (A-8).
  const commercialSequenceRepository = createInMemoryCommercialSequenceAdapter();
  // Emisiones de la Propuesta Comercial (A-6). **Append-only**: regenerar añade
  // y nunca sustituye (ADR-13 §10.3 V-1 · P-I2). No expone estadio ni borrado.
  const proposalRepository = createInMemoryProposalAdapter();

  // ── Adapters de proveedor (ADR-17 §9.1, AL-20) ─────────────────────────────
  // Una instancia por puerto, creada una vez y viva durante todo el proceso
  // (ADR-17 §9.3). Sustituir cualquiera de los tres por otro proveedor es un
  // cambio de UNA línea aquí: ninguna otra capa se entera.
  //
  // La credencial de descubrimiento se entrega aquí y **deja de viajar por la
  // ruta, el Orchestrator, la Agent API y el caso de uso** (ADR-17 §6.3 P-4).
  // `shared/config/` es la única frontera con el entorno del proceso (RI-9), y
  // este es el único punto que la consulta para construir. Ausente es estado
  // válido: la ruta ya responde 400 explícito y el adapter nunca llega a usarse.
  const prospectDiscovery = createGooglePlacesDiscovery(getGooglePlacesApiKey() ?? "");
  // Los dos adapters generativos resuelven su credencial dentro de `shared/ai`,
  // accesible únicamente desde `infrastructure/` (ADR-04 §11).
  const leadAnalysis = createGeminiLeadAnalysis();
  const pitchDrafting = createGeminiPitchDrafting();
  // **Puerto de redacción canónico**, distinto del anterior y no intercambiable
  // con él: `ProposalDraftingPort` recibe la estrategia y la lista cerrada y
  // devuelve solo texto (COM-09 §6 · APS-18 §10.2). **Ambos coexisten hasta que
  // se retire el flujo heredado** (deuda F-1), y los tipos impiden confundirlos.
  const proposalDrafting = createGeminiProposalDrafting();

  // Application — el descubrimiento ya no persiste (H-04 / ADR-10): el Registro
  // ocurre tras la selección, dentro del Lead Analyzer, que es quien recibe
  // ahora la Repository Interface (nunca el Adapter).
  // El Registro vive en el Lead Hunter (APS-03 §7.1), de modo que es este caso de
  // uso —y no el del Analyzer— el que recibe `LeadRepository`. Cierra A-02.
  const discoverProspects = createDiscoverProspects({ leadRepository, prospectDiscovery });
  const analyzeProspects = createAnalyzeProspects({ leadAnalysisRepository, leadAnalysis });

  // Consulta de la Biblioteca — recibe la MISMA instancia de Repository que la
  // escritura (ADR-09 §6: una instancia por Repository Interface, creada una vez
  // durante el arranque). Es lo que hace que la Biblioteca leída sea exactamente
  // la escrita; con el adapter en memoria, dos instancias serían dos almacenes
  // distintos y la lectura devolvería siempre un conjunto vacío.
  const listLeadLibrary = createListLeadLibrary({ leadRepository });

  // Presentation (Agent API) — reciben el caso de uso ya vinculado
  const listLeadScores = createListLeadScores({ leadAnalysisRepository });

  // **Con nombres, no por posición** (ADR-19 §5.1 D-1).
  const leadHunterAgent = createLeadHunterAgent({ discoverProspects, listLeadLibrary });
  const leadAnalyzerAgent = createLeadAnalyzerAgent({ analyzeProspects, listLeadScores });

  // Pitch Generator — **queda registrado aquí por primera vez.** Su cadena
  // completa (caso de uso → Agent API → workflow → ruta) se construía por
  // importación de módulo, con el agente como `const` exportado. ADR-15 §9.5
  // exige construirlo íntegramente desde el Composition Root y R-57 prohíbe el
  // singleton de módulo: es el prerrequisito técnico de todo el trabajo
  // comercial posterior.
  const generateOutreachPitch = createGenerateOutreachPitch({ pitchDrafting });
  // `GenerateDiagnosis` (E-7) — primer caso de uso comercial canónico de
  // ADR-16 §7. Recibe la Repository Interface, jamás el adapter (R-22).
  const generateDiagnosis = createGenerateDiagnosis({ buyerDiagnosisRepository });
  // `CreateSequence` (E-8). Recibe el repositorio del diagnóstico **solo para
  // leer la emisión vigente**: encadenar diagnóstico → plan es su cometido
  // (ADR-16 §7), y versionar A-11 no lo es.
  const createSequence = createCreateSequence({
    buyerDiagnosisRepository,
    commercialSequenceRepository
  });
  // `GenerateProposal` (E-5) — **queda completamente resuelto por inyección**.
  // Sus dos únicas dependencias aprobadas (COM-09 §6 · AL-08) se satisfacen
  // aquí: el puerto de redacción y la Repository Interface de su propio activo,
  // **nunca el adapter** (AL-06 · R-22).
  //
  // **Se entrega a la Agent API**, como los demás casos de uso del módulo:
  // `presentation/` es la única superficie que un Orchestrator conoce
  // (**R-07 · ADR-04 §7.7**). Entregarlo directamente al Orchestrator era la
  // infracción que COM-30 detectó y este cableado corrige.
  //
  // **Exponerlo no es publicarlo:** sigue **sin ruta**, y no debe tenerla
  // mientras `SP-01` no se publique (**B-1**). La frontera de publicación es la
  // ruta HTTP, no la Agent API (ADR-04, glosario).
  const generateProposal = createGenerateProposal({
    proposalDraftingPort: proposalDrafting,
    proposalRepository
  });

  // Las dos lecturas recortadas (COM-14 · COM-16). **Reciben las MISMAS
  // instancias de Repository que las escrituras** (ADR-09 §6): es lo que hace
  // que lo leído sea exactamente lo emitido — con adapters en memoria, dos
  // instancias serían dos almacenes distintos.
  //
  // **Solo leen.** Ninguna versiona A-11 ni actualiza A-12: eso es competencia
  // de `GenerateDiagnosis` (E-7), `CreateSequence` (E-8) y `RegisterContact` (E-9).
  const readReducedDiagnosis = createReducedDiagnosisReader({ buyerDiagnosisRepository });
  const readReducedSequence = createReducedSequenceReader({ commercialSequenceRepository });

  // **Con nombres, no por posición** (COM-33 §3). Los seis son funciones y cuatro
  // comparten forma: por posición, intercambiar dos compilaba sin error y el
  // defecto solo aparecía al ejecutar la operación equivocada.
  const pitchGeneratorAgent = createPitchGeneratorAgent({
    generateOutreachPitch,
    generateDiagnosis,
    createSequence,
    readReducedDiagnosis,
    readReducedSequence,
    generateProposal
  });

  // Orchestrator — recibe las Agent API ya construidas. La consulta de la
  // Biblioteca coordina AMBOS agentes: el Hunter aporta los Leads registrados y
  // el Analyzer su Score vigente. Ninguno conoce al otro (ADR-04 §7.6).
  const runLeadAcquisitionWorkflow = createLeadAcquisitionWorkflow({ leadHunterAgent, leadAnalyzerAgent });
  const runLeadLibraryQuery = createLeadLibraryQuery({ leadHunterAgent, leadAnalyzerAgent });
  const runPitchOutreachWorkflow = createPitchOutreachWorkflow({ pitchGeneratorAgent });
  // R-11 — la ruta del diagnóstico tampoco invoca la Agent API directamente,
  // aunque hoy el workflow coordine un solo agente.
  const runCommercialDiagnosis = createCommercialDiagnosis({ pitchGeneratorAgent });
  const runCommercialSequence = createCommercialSequence({ pitchGeneratorAgent });
  // Derivación de hechos afirmables. **Es el único componente que puede reunir**
  // lo que la proyección necesita: ADR-04 §7.6 prohíbe que un agente conozca a
  // otro, y los tres datos viven repartidos entre los tres módulos.
  const runCommercialFacts = createCommercialFacts({
    leadHunterAgent,
    leadAnalyzerAgent,
    pitchGeneratorAgent
  });

  // **El compositor de la entrada de `GenerateProposal`** (COM-27). Reúne las
  // tres fuentes que el caso de uso no puede buscar (ADR-15 §12) y **copia**:
  // no decide estrategia, no interpreta el diagnóstico y no toca los hechos.
  //
  // **Recibe un workflow —`runCommercialFacts`— y no los tres agentes.** No es
  // que un Orchestrator conozca a otro: recibe **una función ya construida**, y
  // quien conoce a los tres agentes sigue siendo el único autorizado (R-11 ·
  // ADR-04 §7.6).
  //
  // **Todavía sin ruta**, y es deliberado: este sprint integra la composición,
  // no publica una capacidad de producto — y con B-1 abierto no habría nada que
  // publicar.
  const runCommercialProposal = createCommercialProposal({
    pitchGeneratorAgent,
    runCommercialFacts
  });
  void runCommercialProposal;

  // Routes — reciben el workflow ya construido
  const handleProspectSearch = createProspectSearchHandler({ runLeadAcquisitionWorkflow });
  const handleLeadLibrary = createLeadLibraryHandler({ runLeadLibraryQuery });
  const handleProspectOutreach = createProspectOutreachHandler({ runPitchOutreachWorkflow });
  const handleDiagnosis = createDiagnosisHandler({ runCommercialDiagnosis });
  const handleSequence = createSequenceHandler({ runCommercialSequence });

  return {
    handleProspectSearch,
    handleLeadLibrary,
    handleProspectOutreach,
    handleDiagnosis,
    handleSequence
  };
}
