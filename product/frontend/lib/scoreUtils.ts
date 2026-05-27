import type { Lead } from "../../types/lead";
import type { LeadWithScore, Urgency } from "../types/feed";

export function computeLocalScore(lead: Lead): LeadWithScore {
  let score = 0;

  // Presupuesto (hasta 40 pts)
  if (lead.presupuesto_usd >= 300000) score += 40;
  else if (lead.presupuesto_usd >= 100000) score += 30;
  else if (lead.presupuesto_usd >= 50000) score += 20;
  else if (lead.presupuesto_usd >= 20000) score += 10;
  // <20000 → 0 pts

  // Longitud del mensaje (hasta 30 pts, proxy de intención detallada)
  if (lead.mensaje.length >= 100) score += 30;
  else if (lead.mensaje.length >= 50) score += 20;
  else if (lead.mensaje.length >= 20) score += 10;
  // <20 → 0 pts

  // Propiedades referenciadas (hasta 20 pts)
  if (lead.property_ids.length >= 3) score += 20;
  else if (lead.property_ids.length >= 1) score += 10;

  // Tipo de propiedad definido (10 pts)
  if (lead.tipo_propiedad !== null) score += 10;

  const trust_score = Math.min(100, score);

  const urgency: Urgency =
    trust_score >= 70 ? "Alta" :
    trust_score >= 40 ? "Media" :
    "Baja";

  return { lead, trust_score, urgency };
}
