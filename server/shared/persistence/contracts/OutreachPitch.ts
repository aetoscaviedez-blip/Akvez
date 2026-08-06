// Persistence contract verified against current OutreachPitch domain entity.
// This contract is intentionally independent from module domain layers
// according to ADR-08. Verified by direct reading of
// modules/pitch-generator/domain/OutreachPitch.ts — not imported from it. If
// OutreachPitch.ts changes shape, this file must be updated here explicitly.

export interface OutreachPitch {
  leadId: string;
  channel: string;
  subjectLine: string;
  message: string;
  strategyExplanation: string;
  isFallback: boolean;
}
