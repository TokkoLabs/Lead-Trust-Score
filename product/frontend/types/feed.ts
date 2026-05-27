import type { Lead } from "../../types/lead";

export type Urgency = "Alta" | "Media" | "Baja";

export interface LeadWithScore {
  lead: Lead;
  trust_score: number; // 0-100, entero
  urgency: Urgency;
}
