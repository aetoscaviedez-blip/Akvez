import { calculateScore } from "../domain/scoring";
import { calculateOpportunityScore } from "../domain/opportunityScore";
import { currentWeightingProfile } from "../domain/weightingProfile";
import { generateFallbackAnalysis } from "../domain/fallbackAnalysis";
import { LeadAnalysisPort } from "../domain/leadAnalysisPort";
import {
  recordLeadAnalyzer,
  recordGeminiFallback,
  recordAnalysisSource,
  recordPersistence
} from "../../../shared/observability/executionReport";
import { LeadAnalysisRepository } from "../../../shared/persistence/repositories/LeadAnalysisRepository";

/**
 * Dependencias externas de este caso de uso. Se reciben por inyección desde el
 * Composition Root (ADR-09 §5.2) — nunca se construyen aquí. `application/`
 * conoce la Repository Interface, jamás el Database Adapter que la implementa
 * (ADR-08 §10).
 *
 * **Ya no recibe `LeadRepository`.** Cierra la desviación **A-02**: este fichero
 * importaba `shared/persistence/contracts/Lead` para construir el Lead que
 * persistía, lo que R-22 prohíbe expresamente («`application/` no importa
 * `adapters/`, `models/` ni `contracts/`»).
 *
 * La causa no era el import, sino que el Registro estaba en el módulo equivocado:
 * APS-03 §7.1 lo atribuye al **Lead Hunter** y §7.2 dice de este agente que «no
 * crea Leads: opera sobre Leads que ya existen en la Biblioteca». Trasladado el
 * Registro a su agente, el import desaparece por sí solo. La justificación previa
 * citaba «H-04 / ADR-10», y **ADR-10 está `Archived`** — DEV-00 §10: ningún
 * documento archivado es fuente de ninguna regla.
 */
export interface AnalyzeProspectsDependencies {
  leadAnalysisRepository: LeadAnalysisRepository;
  /**
   * Puerto de análisis, no adapter. Cierra el segundo de los tres puntos de
   * AR-05 §5, acción 8: este fichero importaba
   * `../infrastructure/leadAnalysisAdapter` (ADR-17 §12, AL-19).
   */
  leadAnalysis: LeadAnalysisPort;
}

/**
 * Forma del caso de uso ya vinculado a sus dependencias. Es el único tipo que
 * `presentation/` necesita conocer: no menciona persistencia, de modo que la
 * Agent API puede transportarlo sin importar `shared/persistence/` en ninguna
 * forma (ADR-08 §10, prohibición «sin excepción»; ADR-09 §5.2).
 */
export type AnalyzeProspectsFn = (
  deduplicatedLeads: any[],
  industry: string,
  location: string,
  designerStyle: string
) => Promise<any[]>;

export function createAnalyzeProspects(
  deps: AnalyzeProspectsDependencies
): AnalyzeProspectsFn {
  const { leadAnalysisRepository, leadAnalysis } = deps;

  return async function analyzeProspects(
  deduplicatedLeads: any[],
  industry: string,
  location: string,
  designerStyle: string
): Promise<any[]> {
  const startedAt = Date.now();

  // ── EVALUACIÓN ──────────────────────────────────────────────────────────────
  // Se puntúa el conjunto COMPLETO y se ORDENA por Score descendente (WS-05 de
  // APS-17 §4). **No se recorta.**
  //
  // Aquí existía un `.slice(0, 10)` que además de ordenar truncaba, y solo los
  // 10 supervivientes llegaban al Registro. Era exactamente el parámetro
  // «Máximo de Leads por ejecución» que **APS-17 §3.1 declaró inadmisible** por
  // ser un Top N, y que sustituyó por WS-01 — una tanda de procesamiento que
  // recompone el conjunto completo. Incumplía a la vez:
  //
  //   · APS-03 §7.2 — el Lead Analyzer «no trunca: la priorización se ejerce
  //     ordenando, nunca recortando», y «no expulsa».
  //   · R-42 — no existe Top N. Ninguna consulta, tanda ni cupo puede
  //     determinar qué Leads existen.
  //   · R-44 — ninguna etapa expulsa a un Lead de la Biblioteca.
  //   · El Criterio de Invariancia de §3.6: al desaparecer el límite, el
  //     usuario obtiene un conjunto de Leads distinto → inadmisible.
  //
  // La priorización que el producto necesita se conserva íntegra: el orden por
  // Score sigue siendo el mismo, y es lo único que este paso decide.
  // El Score lo produce el **Perfil de Ponderación WP-01** (APS-08 §7.1), no una
  // heurística local. Antes de DEV-04 esta línea invocaba `calculateScore`, que
  // aplicaba una escala inventada (base 25 más bonificaciones) sin correspondencia
  // con ninguna categoría de APS-08 §6 ni con ningún peso aprobado. `calculateScore`
  // se conserva **solo** para `calculatedClassification`, que alimenta el prompt de
  // Gemini y es un concepto distinto de las cinco bandas de APS-08 §8: describe el
  // sitio observado, no la prioridad comercial del Lead.
  //
  // El perfil de usuario viaja al cálculo porque **Compatibilidad pesa el 20 %** y
  // mide el encaje con *este* usuario (APS-08 §6.6). Se conserva con cada emisión,
  // como exigen R-34 y ADR-13 V-4.
  const weightingProfile = currentWeightingProfile();
  const userProfile = { targetNiche: industry, style: designerStyle || "" };

  const scored = deduplicatedLeads
    .map((p: any) => {
      const websiteClassification = calculateScore(p.rating, p.reviewCount, p.website);
      const opportunity = calculateOpportunityScore(
        {
          website: p.website,
          phone: p.phone,
          googleMapsUrl: p.googleMapsUrl,
          rating: p.rating,
          reviewCount: p.reviewCount,
          source: p.source,
          industry
        },
        userProfile,
        weightingProfile
      );

      return {
        ...p,
        score: opportunity.score,
        opportunity,
        calculatedClassification: websiteClassification.calculatedClassification
      };
    })
    // WS-05 de APS-17 §4 — orden por Opportunity Score descendente. Un Lead sin
    // Score (`null`) es estado válido (R-45) y se ordena al final **sin
    // ocultarse**: ordenar no es excluir (APS-08 §8.6).
    .sort((a: any, b: any) => (b.score ?? -1) - (a.score ?? -1));

  // ── LOS LEADS LLEGAN YA REGISTRADOS ────────────────────────────────────────
  // El Registro lo ejecutó el **Lead Hunter** antes de invocar a este agente,
  // conforme a APS-03 §7.1, y entregó «el conjunto de Leads registrados, con su
  // identidad ya asignada». Este caso de uso **no crea Leads** (APS-03 §7.2):
  // opera sobre Leads que ya existen en la Biblioteca.
  //
  // Por eso el `id` de cada lead ya viene poblado, y aquí no se persiste nada
  // salvo la emisión del Score. Es lo que cierra la desviación **A-02**.
  const selected = scored;
  // ────────────────────────────────────────────────────────────────────────────

  // ── ANÁLISIS ────────────────────────────────────────────────────────────────
  // Se envía el conjunto COMPLETO de Leads registrados. La fragmentación en
  // tandas (WS-01) y su concurrencia (WS-02) son responsabilidad del adapter:
  // esta capa no puede imponer limitaciones sobre el conjunto (ADR-11 §8.2).
  //
  // El adapter **no lanza por un fallo parcial** (R-64): devuelve lo que sí se
  // analizó y el recuento de tandas fallidas. Los Leads sin análisis se
  // resuelven abajo con la inteligencia de respaldo, uno por uno — ninguno se
  // pierde, y ninguno se retira de la Biblioteca por un fallo posterior
  // (PO-01 §8 · ADR-13 §11.2 regla A-2).
  const leads = [];
  let batchResponse: any = null;
  // Solo observabilidad: distingue "la llamada falló" de "la llamada respondió
  // pero sin análisis utilizable" — dos causas de respaldo hoy indistinguibles.
  let geminiCallFailed = false;

  try {
    batchResponse = await leadAnalysis.analyze(selected, industry, location, designerStyle);

    // Todas las tandas fallaron: el análisis no se pudo realizar en absoluto.
    // Es la situación que antes producía una excepción, y se registra igual.
    if (batchResponse.attempted > 0 && batchResponse.failed === batchResponse.attempted) {
      console.log("[LeadHunter] Se ha activado de manera segura la inteligencia de respaldo para el análisis de leads locales.");
      geminiCallFailed = true;
      recordGeminiFallback(batchResponse.firstFailureMessage || "Todas las tandas de análisis fallaron.");
    } else if (batchResponse.failed > 0) {
      // Fallo parcial: el conjunto continúa (R-64). Se deja constancia de la
      // causa raíz sin interrumpir nada.
      recordGeminiFallback(
        `${batchResponse.failed} de ${batchResponse.attempted} tanda(s) de análisis fallaron: ` +
        `${batchResponse.firstFailureMessage || "causa no reportada"}`
      );
    }
  } catch (err: any) {
        console.log("[LeadHunter] Se ha activado de manera segura la inteligencia de respaldo para el análisis de leads locales.");
        geminiCallFailed = true;
        recordGeminiFallback(err?.message || String(err));
  }

      // Map the analyzed leads back to selected, using Gemini output or fallback
      const analyzedMap = new Map<number, any>();
      if (batchResponse?.analyzedLeads && Array.isArray(batchResponse.analyzedLeads)) {
        batchResponse.analyzedLeads.forEach((lead: any) => {
          if (lead && typeof lead.index === "number") {
            analyzedMap.set(lead.index, lead);
          }
        });
      }

      // Solo observabilidad: cuenta los leads que Gemini no devolvió y que se
      // resolvieron con la inteligencia de respaldo.
      let fallbackCount = 0;

      for (let idx = 0; idx < selected.length; idx++) {
        const place = selected[idx];
        const hasWeb = !!(place.website && place.website.trim() !== "" && !place.website.toLowerCase().includes("sin sitio web"));
        const analysis = analyzedMap.get(idx);

        if (analysis) {
          leads.push({
            // Identificador asignado por el Repository durante el Registro
            // (Sprint 15, Tarea 2; reubicado por H-04 / ADR-10). Se propaga sin
            // modificarse: `sort` + `slice` reordenan y recortan este arreglo,
            // por lo que la correspondencia lead↔id no puede reconstruirse
            // fuera de este archivo.
            id: place.id,
            name: place.name,
            googleMapsUrl: place.googleMapsUrl,
            phone: place.phone || "No disponible",
            rating: place.rating,
            reviewCount: place.reviewCount,
            hasWebsite: hasWeb,
            website: hasWeb ? place.website : `Sin sitio web — solo ${place.source}`,
            description: analysis.description || `Negocio de ${industry} en ${location} respaldado por ${place.source}.`,
            flaws: analysis.flaws || (hasWeb ? ["Sitio web descuidado", "Falta de optimización", "Diseño anticuado"] : ["Sin presencia web propia", "Falta de portafolio directo", "Nula diferenciación en línea"]),
            revenueLoss: analysis.revenueLoss || "Pierde tráfico frente a competidores con presencia web profesional independiente.",
            angle: analysis.angle || "Diseñar su primera página web profesional.",
            whyWebsiteNeeded: analysis.whyWebsiteNeeded || "Ganar independencia digital y optimizar conversión de clientes directos.",
            score: place.score,
            // Banda de APS-08 §8 y trazabilidad del Score. `band` no sustituye a
            // `classification`: aquélla es la prioridad comercial del Lead, ésta
            // describe el sitio web observado.
            band: place.opportunity.band,
            scoreVersion: place.opportunity.profileVersion,
            confidence: place.opportunity.confidence,
            scoreBreakdown: place.opportunity.breakdown,
            scoreCoverage: place.opportunity.coverage,
            classification: analysis.classification || place.calculatedClassification,
            source: place.source,
            // H-02 — Marca interna del origen real de ESTE análisis, puesta por
            // la rama que efectivamente lo produjo. No altera ninguna decisión:
            // es el dato que la ruta necesita para poblar
            // `metadata.usedFallbackEngine` sin inferirlo. Nunca cruza la
            // frontera HTTP: `mapToLeadResponseDTO` es una lista blanca.
            usedFallbackAnalysis: false
          });
        } else {
          fallbackCount++;
          const fallbackAnalysis = generateFallbackAnalysis(place, industry, location, designerStyle);
          leads.push({
            // Mismo identificador del Repository que en la rama con análisis
            // de Gemini: la ruta de fallback no puede quedar sin `id`.
            id: place.id,
            name: place.name,
            googleMapsUrl: place.googleMapsUrl,
            phone: place.phone || "No disponible",
            rating: place.rating,
            reviewCount: place.reviewCount,
            hasWebsite: hasWeb,
            website: hasWeb ? place.website : `Sin sitio web — solo ${place.source}`,
            description: fallbackAnalysis.description,
            flaws: fallbackAnalysis.flaws,
            revenueLoss: fallbackAnalysis.revenueLoss,
            angle: fallbackAnalysis.angle,
            whyWebsiteNeeded: fallbackAnalysis.whyWebsiteNeeded,
            score: place.score,
            // El Score es independiente del origen del análisis narrativo: lo
            // produce WP-01 sobre datos observados, no el modelo. Un lead
            // resuelto por respaldo conserva exactamente el mismo Score y la
            // misma trazabilidad.
            band: place.opportunity.band,
            scoreVersion: place.opportunity.profileVersion,
            confidence: place.opportunity.confidence,
            scoreBreakdown: place.opportunity.breakdown,
            scoreCoverage: place.opportunity.coverage,
            classification: fallbackAnalysis.classification,
            source: place.source,
            // H-02 — Este lead NO fue analizado por el modelo: su contenido lo
            // produjo `generateFallbackAnalysis`. Misma marca que en la rama de
            // Gemini, con el valor que corresponde a esta.
            usedFallbackAnalysis: true
          });
        }
      }

  // El primer motivo registrado prevalece: si la llamada falló, ese error es la
  // causa raíz y este recuento no lo sobrescribe.
  if (fallbackCount > 0) {
    recordGeminiFallback(`Gemini no devolvió análisis para ${fallbackCount} de ${selected.length} lead(s).`);
  }

  // Fase 4 — el origen del análisis se DECLARA aquí, en la capa que tomó la
  // decisión lead por lead. El reporte no lo deduce a partir de otras métricas.
  if (selected.length > 0) {
    if (fallbackCount === 0) {
      recordAnalysisSource("GEMINI", `Los ${selected.length} lead(s) fueron analizados por el modelo.`);
    } else if (fallbackCount === selected.length) {
      recordAnalysisSource(
        "FALLBACK",
        geminiCallFailed
          ? `La llamada a Gemini falló; los ${selected.length} lead(s) usan la inteligencia de respaldo.`
          : `Gemini respondió pero no devolvió ningún análisis utilizable; los ${selected.length} lead(s) usan la inteligencia de respaldo.`
      );
    } else {
      recordAnalysisSource(
        "GEMINI+FALLBACK",
        `${selected.length - fallbackCount} lead(s) analizados por Gemini, ${fallbackCount} con inteligencia de respaldo.`
      );
    }
  }

  // ── EMISIÓN DEL SCORE — persistencia con trazabilidad completa ──────────────
  // **R-34** exige que cada emisión conserve el perfil de usuario (ADR-13 V-4) y
  // la versión del Perfil de Ponderación (ADR-14 R-VIN). **APS-08 §9** exige que
  // el Score vaya acompañado de su explicación, y **ADR-14 §6.3** que pueda
  // recalcularse: por eso se persiste el desglose íntegro y no solo el número.
  //
  // `save` es **append-only** (ADR-13 §10.3 V-1): una emisión nueva nunca retira
  // la anterior. La marca temporal se toma aquí y no dentro del cálculo, que es
  // una función pura y debe seguir siéndolo para ser reproducible.
  const calculatedAt = new Date().toISOString();
  const emissionResults = await Promise.allSettled(
    leads.map((lead: any) =>
      leadAnalysisRepository.save({
        leadId: lead.id,
        description: lead.description,
        flaws: lead.flaws,
        angle: lead.angle,
        revenueLoss: lead.revenueLoss,
        whyWebsiteNeeded: lead.whyWebsiteNeeded,
        score: lead.score,
        classification: lead.classification,
        hasWebsite: lead.hasWebsite,
        scoreVersion: lead.scoreVersion,
        band: lead.band,
        breakdown: lead.scoreBreakdown,
        confidence: lead.confidence,
        coverage: lead.scoreCoverage,
        userProfile,
        calculatedAt
      })
    )
  );

  // `allSettled` y no `all`: el fallo al persistir la emisión de un Lead **no
  // puede retirar de la respuesta a los demás** (R-64 · APS-03 §12), y tampoco
  // retira al propio Lead de la Biblioteca — su Registro ya ocurrió y es
  // definitivo (PO-01 §8 · ADR-13 §11.2, regla A-2). Un Lead cuya emisión falló
  // queda simplemente sin Score persistido, que es estado válido (R-45).
  const failedEmissions = emissionResults.filter((r) => r.status === "rejected").length;
  if (failedEmissions > 0) {
    console.error(
      `[LeadAnalyzer] ${failedEmissions} de ${leads.length} emisión(es) de Score no se pudieron persistir. ` +
      "Los Leads permanecen en la Biblioteca sin Score."
    );
  }

  recordLeadAnalyzer({
    received: deduplicatedLeads.length,
    analyzed: leads.length,
    ms: Date.now() - startedAt
  });

    return leads;
  };
}
