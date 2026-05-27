import React, { useMemo, useState } from "react";
import type { Lead } from "../../../types/lead";
import type { LeadAnalysis } from "../../../types/lead_analysis";
import { deriveReasons } from "../../lib/leadReasons";

/**
 * QueueCard — tarjeta expandida de un lead pendiente.
 *
 * Replica `.lead-queue-card` del HTML target (líneas 502-536, 1100-1126):
 *   1. Header: avatar inicial coloreado por score + nombre + timestamp + ✕.
 *   2. Score pill: alta/media/baja con texto y %.
 *   3. Reason chips (hasta 6, derivadas con deriveReasons).
 *   4. Divider.
 *   5. Contacto enmascarado (email + teléfono) + botón ojo.
 *   6. Property row (si hay direccion_propiedad o agencia).
 *   7. Message box con borde teal.
 *   8. Tag row (source, zona, operación inferida por presupuesto, tipo).
 *   9. Actions: Crear contacto (primary) / Asignar (secondary) / Eliminar (danger).
 *
 * Feature 14 AC1, AC2, AC5.
 */

export interface QueueCardProps {
  lead: Lead;
  analysis?: LeadAnalysis;
  /** trust_score efectivo (aiScore || computeLocalScore). */
  trust_score: number;
  onCrearContacto?: (leadId: string) => void;
  onAsignar?: (leadId: string) => void;
  onEliminar?: (leadId: string) => void;
}

interface ScoreTier {
  label: string;
  icon: string;
  pillClass: string;
  avatarClass: string;
}

const SCORE_TIER_HIGH: ScoreTier = {
  label: "Alta",
  icon: "★",
  pillClass:
    "bg-feedback-green-500-15 text-feedback-green-500 border border-feedback-green-500",
  avatarClass: "bg-feedback-green-500-15 text-feedback-green-500",
};

const SCORE_TIER_MID: ScoreTier = {
  label: "Media",
  icon: "—",
  pillClass:
    "bg-feedback-yellow-500-15 text-feedback-yellow-500 border border-feedback-yellow-500",
  avatarClass: "bg-feedback-yellow-500-15 text-feedback-yellow-500",
};

const SCORE_TIER_LOW: ScoreTier = {
  label: "Baja",
  icon: "⚠",
  pillClass:
    "bg-brand-primary-500-15 text-brand-primary-500 border border-brand-primary-500",
  avatarClass: "bg-brand-primary-500-15 text-brand-primary-500",
};

function tierFor(score: number): ScoreTier {
  if (score >= 75) return SCORE_TIER_HIGH;
  if (score >= 40) return SCORE_TIER_MID;
  return SCORE_TIER_LOW;
}

/** Deriva un display name humano desde el email (o "Lead {id}"). */
function deriveDisplayName(lead: Lead): string {
  const email = (lead.email ?? "").trim();
  if (email && email.includes("@")) {
    const local = email.split("@")[0];
    if (local && local.length > 0) {
      const cleaned = local.replace(/[._\-]+/g, " ").trim();
      return cleaned
        .split(/\s+/)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
    }
  }
  return `Lead ${lead.id}`;
}

function avatarInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

/**
 * Enmascarado de email: primera letra + "•••@•••." + tld original.
 * Ejemplos:
 *   "juan@gmail.com" → "j•••@•••.com"
 *   "ana.maria@correo.com.ar" → "a•••@•••.ar"
 *   ""               → ""
 */
function maskEmail(raw: string): string {
  const email = (raw ?? "").trim();
  if (!email || !email.includes("@")) return "";
  const [local, domain] = email.split("@");
  const firstChar = local.charAt(0).toLowerCase() || "•";
  const tldMatch = domain.split(".");
  const tld = tldMatch.length > 1 ? tldMatch[tldMatch.length - 1] : "com";
  return `${firstChar}•••@•••.${tld}`;
}

/** Masking de teléfono — placeholder fijo según el HTML target. */
const MASKED_PHONE = "••• •••••••";

/** Convierte el ISO created_at en un texto humanizado tipo "Hace 2 hs". */
function formatTimestamp(createdAt: string | undefined, now: Date = new Date()): string {
  if (!createdAt) return "Hoy";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Hoy";
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Hace un momento";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days} d`;
  // > 7 días: fecha cruda DD/MM
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

/** Operación inferida del presupuesto (Venta si ≥ 80k, sino Alquiler). */
function inferOperacion(presupuesto: number): "Venta" | "Alquiler" {
  return presupuesto >= 80000 ? "Venta" : "Alquiler";
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function QueueCard({
  lead,
  analysis,
  trust_score,
  onCrearContacto,
  onAsignar,
  onEliminar,
}: QueueCardProps) {
  const [revealed, setRevealed] = useState(false);

  const tier = tierFor(trust_score);
  const displayName = useMemo(() => deriveDisplayName(lead), [lead]);
  const initial = avatarInitial(displayName);
  const timestamp = useMemo(() => formatTimestamp(lead.created_at), [lead.created_at]);

  const reasons = useMemo(
    () =>
      deriveReasons(lead, analysis
        ? { is_spam: analysis.is_spam, detected_intent: analysis.detected_intent }
        : undefined),
    [lead, analysis],
  );

  const maskedEmail = maskEmail(lead.email ?? "");
  const hasEmail = Boolean((lead.email ?? "").trim());
  const hasPhone = Boolean((lead.telefono ?? "").trim());
  const showContactRow = hasEmail || hasPhone;

  const propertyLabel = (lead.direccion_propiedad ?? "").trim();
  const agencyLabel = (lead.agencia ?? "").trim();
  const showPropertyRow = Boolean(propertyLabel || agencyLabel);

  const zonaLabel = lead.zona ? `Capital Federal | ${lead.zona}` : null;
  const tipoLabel = lead.tipo_propiedad ? capitalize(lead.tipo_propiedad.replace(/_/g, " ")) : null;
  const operacion = inferOperacion(lead.presupuesto_usd);
  const sourceLabel = lead.source ?? null;

  const tags = [sourceLabel, zonaLabel, operacion, tipoLabel].filter(
    (t): t is string => Boolean(t),
  );

  function handleReveal() {
    setRevealed((prev) => !prev);
  }

  return (
    <article
      data-testid="queue-card"
      data-lead-id={lead.id}
      aria-label={`Lead ${displayName}`}
      className="bg-surface-ground border border-neutral-grey-200 rounded-card p-5 mb-3 transition-all duration-150 hover:border-neutral-grey-400 hover:shadow-low animate-enter"
    >
      {/* 1. Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className={`flex items-center justify-center w-[38px] h-[38px] rounded-full text-[13px] font-bold flex-shrink-0 ${tier.avatarClass}`}
            data-testid="queue-card-avatar"
          >
            {initial}
          </div>
          <div>
            <div className="text-body-md font-semibold text-neutral-grey-800 leading-tight">
              {displayName}
            </div>
            <div className="text-[11px] text-neutral-grey-500 mt-0.5">
              {timestamp}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            data-testid="queue-card-score-pill"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-pill text-[11px] font-semibold ${tier.pillClass}`}
          >
            <span aria-hidden="true">{tier.icon}</span>
            <span>
              {tier.label} · {Math.round(trust_score)}%
            </span>
          </div>
          <button
            type="button"
            aria-label="Eliminar lead"
            onClick={() => onEliminar?.(lead.id)}
            className="bg-transparent border-0 text-neutral-grey-400 hover:text-brand-primary-500 cursor-pointer text-[16px] p-1 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. Reason chips */}
      {reasons.length > 0 && (
        <div
          className="flex gap-1.5 flex-wrap mb-3"
          data-testid="queue-card-reasons"
          role="list"
          aria-label="Razones de scoring"
        >
          {reasons.map((chip) => (
            <span
              key={chip.id}
              role="listitem"
              data-reason-id={chip.id}
              data-reason-variant={chip.variant}
              className={[
                "text-[10px] px-2 py-0.5 rounded-pill flex items-center gap-1 font-semibold",
                chip.variant === "positive"
                  ? "bg-feedback-green-500-15 text-feedback-green-500"
                  : "bg-brand-primary-500-15 text-brand-primary-500",
              ].join(" ")}
            >
              <span aria-hidden="true">
                {chip.variant === "positive" ? "✓" : "✗"}
              </span>
              {chip.label}
            </span>
          ))}
        </div>
      )}

      {/* 3. Divider */}
      <div
        className="h-px bg-neutral-grey-200 my-3"
        aria-hidden="true"
      />

      {/* 4. Contact row */}
      {showContactRow && (
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="grid grid-cols-2 gap-x-5 gap-y-2 flex-1">
            {hasEmail && (
              <div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mb-0.5">
                  Email
                </div>
                <div
                  data-testid="queue-card-email"
                  className="text-[12px] font-semibold text-neutral-grey-700"
                >
                  {revealed ? lead.email : maskedEmail}
                </div>
              </div>
            )}
            {hasPhone && (
              <div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mb-0.5">
                  Teléfono
                </div>
                <div
                  data-testid="queue-card-phone"
                  className="text-[12px] font-semibold text-neutral-grey-700"
                >
                  {revealed ? lead.telefono : MASKED_PHONE}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            data-testid="queue-card-reveal"
            aria-label={revealed ? "Ocultar contacto" : "Mostrar contacto"}
            aria-pressed={revealed}
            onClick={handleReveal}
            className="bg-transparent border border-neutral-grey-200 text-neutral-grey-600 hover:text-brand-primary-500 hover:border-brand-primary-500 cursor-pointer rounded-chip px-2 py-1 text-[14px] transition-colors"
          >
            {revealed ? "🙈" : "👁"}
          </button>
        </div>
      )}

      {/* 5. Property row */}
      {showPropertyRow && (
        <div
          className="flex items-center gap-2.5 px-3 py-2 bg-surface-low rounded-chip mb-2.5 border border-neutral-grey-200"
          data-testid="queue-card-property"
        >
          <div
            aria-hidden="true"
            className="w-[34px] h-[34px] rounded-md bg-brand-secondary-500/15 flex items-center justify-center text-[16px] flex-shrink-0"
          >
            🏢
          </div>
          <div className="min-w-0">
            {propertyLabel && (
              <div className="text-[12px] font-semibold text-neutral-grey-800 truncate">
                {propertyLabel}
              </div>
            )}
            {agencyLabel && (
              <div className="text-[10px] text-neutral-grey-500 mt-0.5 truncate">
                {agencyLabel}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Message box */}
      {lead.mensaje && lead.mensaje.trim().length > 0 && (
        <div
          data-testid="queue-card-message"
          className="text-[12px] text-neutral-grey-700 px-3 py-2 bg-surface-low rounded-chip mb-2.5 leading-relaxed border-l-[3px] border-l-brand-secondary-500"
        >
          {lead.mensaje}
        </div>
      )}

      {/* 7. Tag row */}
      {tags.length > 0 && (
        <div
          className="flex gap-1.5 flex-wrap mb-3.5"
          data-testid="queue-card-tags"
        >
          {tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-pill bg-surface-low text-neutral-grey-600 border border-neutral-grey-200 font-semibold"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* 8. Actions row */}
      <div className="flex gap-2">
        <button
          type="button"
          data-testid="queue-card-action-create"
          onClick={() => onCrearContacto?.(lead.id)}
          className="text-[12px] px-3.5 py-1.5 rounded-button bg-brand-primary-500 text-white border-0 cursor-pointer font-sans font-bold hover:opacity-90 transition-opacity"
        >
          Crear contacto
        </button>
        <button
          type="button"
          data-testid="queue-card-action-assign"
          onClick={() => onAsignar?.(lead.id)}
          className="text-[12px] px-3.5 py-1.5 rounded-button bg-transparent text-neutral-grey-700 border border-neutral-grey-200 cursor-pointer font-sans font-semibold hover:bg-neutral-grey-100 transition-colors"
        >
          Asignar
        </button>
        <button
          type="button"
          data-testid="queue-card-action-delete"
          onClick={() => onEliminar?.(lead.id)}
          className="text-[12px] px-3.5 py-1.5 rounded-button bg-transparent text-brand-primary-500 border border-brand-primary-500 cursor-pointer font-sans font-semibold ml-auto hover:bg-brand-primary-500-15 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
