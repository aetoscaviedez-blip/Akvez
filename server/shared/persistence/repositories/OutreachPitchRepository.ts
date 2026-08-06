import { OutreachPitch } from "../contracts/OutreachPitch";
import { Identified } from "./Identified";

/**
 * Contrato de persistencia para OutreachPitch. Sin implementación — ver
 * LeadRepository.ts para la misma nota sobre dónde debe vivir la
 * implementación real.
 */
export interface OutreachPitchRepository {
  save(pitch: OutreachPitch): Promise<Identified<OutreachPitch>>;
  findByLeadId(leadId: string): Promise<Identified<OutreachPitch>[]>;
}
