import type { Lead } from "../../types/lead";

/**
 * leadReasons — funcion pura que deriva los "reason chips" que aparecen en
 * QueueCard / LeadDetailPanel a partir del Lead + (opcional) el resultado
 * del analisis IA.
 *
 * Feature 14 AC3:
 *  - Reglas positivas (✓ verde): solicita visita, interesado, mudanza
 *    pronta, compra, email completo, telefono completo, mensaje extenso.
 *  - Reglas negativas (✗ rojo): sin email, sin telefono, mensaje vacio,
 *    detectado como spam, palabras sospechosas.
 *  - Maximo 6 chips por lead (cap defensivo).
 *
 * 100% pura: no toca DOM ni estado.
 */

export interface ReasonChip {
  id: string;
  label: string;
  variant: "positive" | "negative";
}

export interface ReasonAnalysisLike {
  is_spam: boolean;
  detected_intent?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUSPICIOUS_PATTERN = /\b(test|demo|prueba)\b/i;
const MAX_CHIPS = 6;

/**
 * deriveReasons — recibe Lead + analysis opcional y devuelve chips unicos.
 *
 * El orden privilegia razones de intencion positiva (visita, interes, compra)
 * por encima de razones formales (email/telefono completos), porque son las
 * que mas pesan para un agente humano leyendo la cola.
 */
export function deriveReasons(
  lead: Lead,
  analysis?: ReasonAnalysisLike,
): ReasonChip[] {
  const reasons: ReasonChip[] = [];
  const seen = new Set<string>();
  const push = (chip: ReasonChip) => {
    if (seen.has(chip.id)) return;
    seen.add(chip.id);
    reasons.push(chip);
  };

  const message = (lead.mensaje ?? "").trim();
  const messageLower = message.toLowerCase();
  const email = (lead.email ?? "").trim();
  const phone = (lead.telefono ?? "").trim();
  const phoneDigits = phone.replace(/\D/g, "");

  // ── Positivas (intencion explicita en el mensaje) ──────────────────────
  if (/(visita|visitar|\bver\b|agendar)/i.test(messageLower)) {
    push({ id: "visita", label: "Solicita visita", variant: "positive" });
  }
  if (/(interesad[oa]|me interesa)/i.test(messageLower)) {
    push({ id: "interesado", label: "Interesado", variant: "positive" });
  }
  if (/(mudanza|urgente)/i.test(messageLower)) {
    push({ id: "mudanza", label: "Mudanza pronta", variant: "positive" });
  }
  if (/(comprar|compra\b|comprador)/i.test(messageLower)) {
    push({ id: "compra", label: "Compra", variant: "positive" });
  }

  // ── Positivas (completitud de datos) ───────────────────────────────────
  if (email && EMAIL_PATTERN.test(email)) {
    push({ id: "email-ok", label: "Email completo", variant: "positive" });
  }
  if (phoneDigits.length >= 10) {
    push({
      id: "telefono-ok",
      label: "Teléfono completo",
      variant: "positive",
    });
  }
  if (message.length >= 50) {
    push({
      id: "mensaje-extenso",
      label: "Mensaje extenso",
      variant: "positive",
    });
  }

  // ── Negativas (faltantes y red flags) ──────────────────────────────────
  if (!email) {
    push({ id: "sin-email", label: "Sin email", variant: "negative" });
  }
  if (!phone || phoneDigits.length < 10) {
    push({ id: "sin-telefono", label: "Sin teléfono", variant: "negative" });
  }
  if (!message || message.length < 10) {
    push({
      id: "mensaje-vacio",
      label: "Mensaje vacío",
      variant: "negative",
    });
  }
  if (analysis?.is_spam === true) {
    push({
      id: "spam",
      label: "Detectado como spam",
      variant: "negative",
    });
  }
  if (SUSPICIOUS_PATTERN.test(message)) {
    push({
      id: "sospechoso",
      label: "Palabras sospechosas",
      variant: "negative",
    });
  }

  return reasons.slice(0, MAX_CHIPS);
}
