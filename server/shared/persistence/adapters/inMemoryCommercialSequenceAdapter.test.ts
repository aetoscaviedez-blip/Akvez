import { it } from "vitest";
import { createInMemoryCommercialSequenceAdapter } from "./inMemoryCommercialSequenceAdapter";
import { runCommercialSequenceRepositoryContractTests } from "./commercialSequenceRepository.contract";

// El mismo contrato que deberá superar `PostgreSQLCommercialSequenceAdapter`
// (ADS-02) sin que la suite cambie una línea.

it("CommercialSequenceRepository contract — inMemoryCommercialSequenceAdapter", async () => {
  await runCommercialSequenceRepositoryContractTests(createInMemoryCommercialSequenceAdapter);
});
