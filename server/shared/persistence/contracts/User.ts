// Persistence contract for User. Unlike Lead, LeadAnalysis and OutreachPitch,
// there is no existing module domain entity to verify this against — User is
// not owned by any of the current business-capability modules. This is an
// infrastructure placeholder to satisfy the ADR-05 ownership model
// (Section 14: "Un usuario nunca puede acceder a información perteneciente a
// otro usuario"), intentionally independent from module domain layers
// according to ADR-08. Authentication fields, roles, permissions and
// subscriptionPlan are explicitly out of scope for this MVP contract.

export interface User {
  email: string;
}
