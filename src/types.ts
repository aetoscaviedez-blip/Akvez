export interface DesignerProfile {
  name: string;
  style: string;
  skills: string;
  tone: string;
  caseStudies: string;
  targetNiche: string;
}

export type LeadStatus = 'Prospect' | 'Audited' | 'Pitched' | 'Replied' | 'Won' | 'Stale';

export interface Prospect {
  id: string;
  name: string;
  website: string;
  description: string;
  flaws: string[];
  angle: string;
  status: LeadStatus;
  notes?: string;
  auditReport?: string;
  subjectLine?: string;
  generatedPitch?: string;
  pitchChannel?: 'email' | 'linkedin' | 'instagram';
  pitchAngle?: string;
  pitchMessage?: string;
  dateCreated: string;
  score?: number;
  classification?: string;
  revenueLoss?: string;
  googleMapsUrl?: string;
  rating?: number;
  reviewCount?: number;
  whyWebsiteNeeded?: string;
  phone?: string;
  hasWebsite?: boolean;
  source?: string;
}

export interface NichePreset {
  id: string;
  industry: string;
  suggestedAesthetic: string;
  commonPainPoints: string[];
  recommendedAngle: string;
  sampleKeywords: string[];
}
