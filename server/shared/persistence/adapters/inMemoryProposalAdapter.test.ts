import { it } from "vitest";
import { createInMemoryProposalAdapter } from "./inMemoryProposalAdapter";
import { runProposalRepositoryContractTests } from "./proposalRepository.contract";

// El mismo contrato que deberá superar el adapter de ADS-02 sin que la suite
// cambie una línea.

it("ProposalRepository contract — inMemoryProposalAdapter", async () => {
  await runProposalRepositoryContractTests(createInMemoryProposalAdapter);
});
