import { it } from "vitest";
import { createInMemoryBuyerDiagnosisAdapter } from "./inMemoryBuyerDiagnosisAdapter";
import { runBuyerDiagnosisRepositoryContractTests } from "./buyerDiagnosisRepository.contract";

// El mismo contrato que deberá superar `PostgreSQLBuyerDiagnosisAdapter`
// (ADS-02) sin que la suite cambie una línea.

it("BuyerDiagnosisRepository contract — inMemoryBuyerDiagnosisAdapter", async () => {
  await runBuyerDiagnosisRepositoryContractTests(createInMemoryBuyerDiagnosisAdapter);
});
