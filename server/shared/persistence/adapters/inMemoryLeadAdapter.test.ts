import { it } from "vitest";
import { createInMemoryLeadAdapter } from "./inMemoryLeadAdapter";
import { runLeadRepositoryContractTests } from "./leadRepository.contract";

// Integrado en Vitest al establecerse el entorno de pruebas (R-6).
//
// Antes se ejecutaba a mano con `npx tsx …` y terminaba en `process.exit(1)`,
// que bajo un runner mataría el proceso entero. **Las aserciones no cambian:**
// `leadRepository.contract.ts` sigue usando solo `node:assert` y sigue siendo
// agnóstico del framework, que es lo que permite verificar con él —sin
// modificarlo— cualquier adapter futuro, incluido el de PostgreSQL de ADS-02.

it("LeadRepository contract — inMemoryLeadAdapter", async () => {
  await runLeadRepositoryContractTests(createInMemoryLeadAdapter);
});
