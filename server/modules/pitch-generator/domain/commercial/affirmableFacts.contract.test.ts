import { it } from "vitest";
import { generateAffirmableFacts } from "./affirmableFactProjection";
import { runAffirmableFactsContractTests } from "./affirmableFacts.contract";

// El mismo contrato que deberá superar cualquier productor futuro de hechos
// afirmables, sin que la suite cambie una línea.

it("AffirmableFacts contract — generateAffirmableFacts", () => {
  runAffirmableFactsContractTests({
    withEvidence: () =>
      generateAffirmableFacts({
        lead: "lead-1",
        source: "Google Maps",
        website: "https://ejemplo.co",
        phone: "+57 300 000 0000",
        rating: 4.6,
        reviewCount: 120,
        measuredFactors: ["Presencia Web", "Reputación"]
      }),

    withoutEvidence: () =>
      generateAffirmableFacts({ lead: "lead-1", source: "Google Maps" }),

    // La narrativa **está disponible en el sistema** pero no es alcanzable: la
    // entrada de la proyección no la declara. Se pasa deliberadamente por
    // encima del tipo para comprobar que ni siquiera así entra.
    withNarrativeAvailable: () =>
      generateAffirmableFacts({
        lead: "lead-1",
        source: "Google Maps",
        website: "https://ejemplo.co",
        rating: 4.6,
        reviewCount: 120,
        measuredFactors: ["Presencia Web"],
        description: "Negocio con presencia digital descuidada",
        flaws: ["Sitio anticuado", "Sin llamados a la acción"],
        angle: "Necesita un rediseño urgente",
        revenueLoss: "Pierde 30 clientes al mes, unos $2.000.000 COP",
        whyWebsiteNeeded: "Debería salir de la invisibilidad web"
      } as never)
  });
});
