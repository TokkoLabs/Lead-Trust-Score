/**
 * product/types/lead_analysis.ts
 * Interfaz LeadAnalysis — resultado del pipeline de analisis con Claude API.
 * Cubre: R4, R9, R10
 */

export interface LeadAnalysis {
  trust_score: number;
  conversion_score: number;
  urgency_score: number;
  is_spam: boolean;
  detected_intent: string;
  suggested_action: string;
  ai_summary: string;
  property_match_ids: string[];
}

export class AIResponseParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIResponseParseError';
  }
}
