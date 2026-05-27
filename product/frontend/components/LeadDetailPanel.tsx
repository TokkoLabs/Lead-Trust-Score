// product/frontend/components/LeadDetailPanel.tsx
//
// Feature 17 — Rediseno Tokko del panel de detalle del lead.
//
// AC1: design system Tokko (bg-surface-neutral-ground, shadow-low, rounded-card,
//      tipografia Nunito Sans heredada del shell). Sin clases gray-* del dark
//      theme anterior.
// AC2: mantiene trust badge circular con color semantico, barras conversion/
//      urgency, ai_summary etiqueta "Analisis IA", boton copiar suggested_action,
//      property cards filtradas por property_match_ids, skeleton de loading.
// AC3: reason chips derivadas con deriveReasons() de lib/leadReasons.ts.
// AC4: footer con 3 action buttons (Crear contacto / Asignar / Marcar como spam)
//      consistentes con QueueCard.

import React from "react";
import type { Lead } from "../../types/lead";
import type { LeadAnalysis } from "../../types/lead_analysis";
import type { Property } from "../../types/property";
import ScoreBar from "./dashboard/ScoreBar";
import { deriveReasons } from "../lib/leadReasons";

export interface LeadDetailPanelProps {
  lead: Lead;
  analysis: LeadAnalysis | null;
  isLoading: boolean;
  properties: Property[];
  /** Handler opcional del footer "Crear contacto". */
  onCrearContacto?: (leadId: string) => void;
  /** Handler opcional del footer "Asignar". */
  onAsignar?: (leadId: string) => void;
  /** Handler opcional del footer "Marcar como spam". */
  onMarcarSpam?: (leadId: string) => void;
}

interface ScoreTone {
  bg: string;
  bgSoft: string;
  border: string;
  text: string;
}

const TONE_HIGH: ScoreTone = {
  bg: "bg-feedback-green-500",
  bgSoft: "bg-feedback-green-500-15",
  border: "border-feedback-green-500",
  text: "text-feedback-green-500",
};

const TONE_MID: ScoreTone = {
  bg: "bg-feedback-yellow-500",
  bgSoft: "bg-feedback-yellow-500-15",
  border: "border-feedback-yellow-500",
  text: "text-feedback-yellow-500",
};

const TONE_LOW: ScoreTone = {
  bg: "bg-brand-primary-500",
  bgSoft: "bg-brand-primary-500-15",
  border: "border-brand-primary-500",
  text: "text-brand-primary-500",
};

function toneFor(score: number): ScoreTone {
  if (score >= 75) return TONE_HIGH;
  if (score >= 40) return TONE_MID;
  return TONE_LOW;
}

function tierLabel(score: number): { label: string; icon: string } {
  if (score >= 75) return { label: "Alta", icon: "★" };
  if (score >= 40) return { label: "Media", icon: "—" };
  return { label: "Baja", icon: "⚠" };
}

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

// ─── Skeleton (AC2) ─────────────────────────────────────────────────────────
function SkeletonBody() {
  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6"
      data-testid="lead-detail-skeleton"
      aria-busy="true"
    >
      <div className="space-y-2 animate-pulse" data-testid="skeleton">
        <div className="h-3 w-24 bg-neutral-grey-100 rounded" />
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-neutral-grey-100 rounded-pill" />
          <div className="h-6 w-24 bg-neutral-grey-100 rounded-pill" />
          <div className="h-6 w-16 bg-neutral-grey-100 rounded-pill" />
        </div>
      </div>
      <div className="space-y-3 animate-pulse">
        <div className="h-3 w-28 bg-neutral-grey-100 rounded" />
        <div className="h-2 bg-neutral-grey-100 rounded-full" />
        <div className="h-2 bg-neutral-grey-100 rounded-full" />
      </div>
      <div className="space-y-2 animate-pulse">
        <div className="h-3 w-24 bg-neutral-grey-100 rounded" />
        <div className="h-3 bg-neutral-grey-100 rounded" />
        <div className="h-3 bg-neutral-grey-100 rounded w-5/6" />
        <div className="h-3 bg-neutral-grey-100 rounded w-4/6" />
      </div>
      <div className="animate-pulse">
        <div className="h-20 bg-neutral-grey-100 rounded-button" />
      </div>
    </div>
  );
}

// ─── Reason chip render ─────────────────────────────────────────────────────
interface ChipProps {
  variant: "positive" | "negative";
  label: string;
  id: string;
}

function ReasonChipView({ variant, label, id }: ChipProps) {
  const cls =
    variant === "positive"
      ? "bg-feedback-green-500-15 text-feedback-green-500"
      : "bg-brand-primary-500-15 text-brand-primary-500";
  return (
    <span
      role="listitem"
      data-reason-id={id}
      data-reason-variant={variant}
      className={`text-[11px] px-2 py-0.5 rounded-pill flex items-center gap-1 font-semibold ${cls}`}
    >
      <span aria-hidden="true">{variant === "positive" ? "✓" : "✗"}</span>
      {label}
    </span>
  );
}

// ─── Property card mini (AC2) ────────────────────────────────────────────────
function PropertyMatchCard({ property }: { property: Property }) {
  return (
    <li
      data-testid="lead-detail-property-card"
      className="bg-surface-low border border-neutral-grey-200 rounded-button p-3 flex items-start gap-3"
    >
      <div
        aria-hidden="true"
        className="w-9 h-9 rounded-md bg-brand-secondary-500/15 flex items-center justify-center text-[16px] flex-shrink-0"
      >
        🏢
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body-sm font-semibold text-neutral-grey-800 truncate">
          {property.titulo}
        </p>
        <p className="text-[11px] text-neutral-grey-600 mt-0.5">
          {property.zona} · {property.tipo} · $
          {property.precio_usd.toLocaleString()} USD
        </p>
      </div>
    </li>
  );
}

export default function LeadDetailPanel({
  lead,
  analysis,
  isLoading,
  properties,
  onCrearContacto,
  onAsignar,
  onMarcarSpam,
}: LeadDetailPanelProps) {
  const displayName = deriveDisplayName(lead);
  const initial = avatarInitial(displayName);

  // Score efectivo: el del analysis si existe, sino 0 (estado vacio).
  const effectiveScore = analysis?.trust_score ?? 0;
  const tone = toneFor(effectiveScore);
  const tier = tierLabel(effectiveScore);

  // Reason chips (AC3) — se calculan tambien con analysis null.
  const reasons = deriveReasons(
    lead,
    analysis
      ? { is_spam: analysis.is_spam, detected_intent: analysis.detected_intent }
      : undefined,
  );

  // Property matches (AC2)
  const matchedProperties = analysis
    ? properties.filter((p) => analysis.property_match_ids.includes(p.id))
    : [];

  const handleCopy = () => {
    if (!analysis) return;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(analysis.suggested_action);
    }
  };

  // ─── Header (compartido por loading / vacio / lleno) ──────────────────────
  const header = (
    <div
      className="p-6 border-b border-neutral-grey-200"
      data-testid="lead-detail-header"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            data-testid="lead-detail-avatar"
            aria-hidden="true"
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-title-sm flex-shrink-0 ${tone.bg}`}
          >
            {initial}
          </div>
          <div className="min-w-0">
            <h3 className="text-title-sm font-bold text-neutral-grey-800 truncate">
              {displayName}
            </h3>
            <p className="text-body-xs text-neutral-grey-600 mt-0.5 truncate">
              Lead {lead.id}
              {lead.zona ? ` · ${lead.zona}` : ""}
              {lead.tipo_propiedad ? ` · ${lead.tipo_propiedad}` : ""}
            </p>
          </div>
        </div>

        {/* Trust badge circular grande (AC2) */}
        <div
          data-testid="lead-detail-trust-badge"
          aria-label={`Trust Score ${effectiveScore}`}
          className={`w-16 h-16 rounded-full ${tone.bgSoft} border-4 ${tone.border} flex items-center justify-center flex-shrink-0`}
        >
          <span className={`text-title-sm font-bold ${tone.text}`}>
            {effectiveScore}
          </span>
        </div>
      </div>

      {/* Score pill (AC2/AC4 consistencia con QueueCard) */}
      <div className="mt-3">
        <span
          data-testid="lead-detail-score-pill"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[11px] font-semibold ${tone.bgSoft} ${tone.text} border ${tone.border}`}
        >
          <span aria-hidden="true">{tier.icon}</span>
          <span>
            {tier.label} · {effectiveScore}%
          </span>
        </span>
      </div>
    </div>
  );

  // ─── Footer actions (AC4) — siempre presente para consistencia visual ────
  const footer = (
    <div
      className="p-4 border-t border-neutral-grey-200 flex gap-2 bg-surface-ground"
      data-testid="lead-detail-footer"
    >
      <button
        type="button"
        data-testid="lead-detail-action-create"
        onClick={() => onCrearContacto?.(lead.id)}
        disabled={!onCrearContacto}
        className="text-body-xs px-3.5 py-1.5 rounded-button bg-brand-primary-500 text-white border-0 cursor-pointer font-sans font-bold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
      >
        Crear contacto
      </button>
      <button
        type="button"
        data-testid="lead-detail-action-assign"
        onClick={() => onAsignar?.(lead.id)}
        disabled={!onAsignar}
        className="text-body-xs px-3.5 py-1.5 rounded-button bg-transparent text-neutral-grey-700 border border-neutral-grey-200 cursor-pointer font-sans font-semibold hover:bg-neutral-grey-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        Asignar
      </button>
      <button
        type="button"
        data-testid="lead-detail-action-spam"
        onClick={() => onMarcarSpam?.(lead.id)}
        disabled={!onMarcarSpam}
        className="text-body-xs px-3.5 py-1.5 rounded-button bg-transparent text-brand-primary-500 border border-brand-primary-500 cursor-pointer font-sans font-semibold ml-auto hover:bg-brand-primary-500-15 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        Marcar como spam
      </button>
    </div>
  );

  // ─── Loading state (AC2) ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <aside
        data-testid="lead-detail-panel"
        aria-busy="true"
        className="bg-surface-ground rounded-card shadow-low overflow-hidden flex flex-col h-full"
      >
        {header}
        <SkeletonBody />
        {footer}
      </aside>
    );
  }

  // ─── Empty state (analysis aun no llego) ──────────────────────────────────
  if (!analysis) {
    return (
      <aside
        data-testid="lead-detail-panel"
        className="bg-surface-ground rounded-card shadow-low overflow-hidden flex flex-col h-full"
      >
        {header}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-body-sm text-neutral-grey-600">
            Selecciona un lead para ver el análisis.
          </p>
        </div>
        {footer}
      </aside>
    );
  }

  // ─── Render principal ─────────────────────────────────────────────────────
  return (
    <aside
      data-testid="lead-detail-panel"
      className="bg-surface-ground rounded-card shadow-low overflow-hidden flex flex-col h-full"
    >
      {header}

      {/* Body scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Reason chips (AC3) */}
        {reasons.length > 0 && (
          <section data-testid="lead-detail-reasons-section">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-grey-600 mb-2">
              Razones
            </h4>
            <div
              role="list"
              aria-label="Razones de scoring"
              data-testid="lead-detail-reasons"
              className="flex flex-wrap gap-2"
            >
              {reasons.map((chip) => (
                <ReasonChipView
                  key={chip.id}
                  id={chip.id}
                  label={chip.label}
                  variant={chip.variant}
                />
              ))}
            </div>
          </section>
        )}

        {/* Conversion + Urgency bars (AC2) */}
        <section data-testid="lead-detail-metrics">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-grey-600 mb-2">
            Métricas IA
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-body-xs text-neutral-grey-700 mb-1">
                <span>Conversión</span>
              </div>
              <ScoreBar
                value={analysis.conversion_score}
                variant="normal"
                ariaLabel={`Conversion ${analysis.conversion_score}`}
              />
            </div>
            <div>
              <div className="flex justify-between text-body-xs text-neutral-grey-700 mb-1">
                <span>Urgencia</span>
              </div>
              <ScoreBar
                value={analysis.urgency_score}
                variant="normal"
                ariaLabel={`Urgencia ${analysis.urgency_score}`}
              />
            </div>
          </div>
        </section>

        {/* AI Summary (AC2) */}
        <section data-testid="lead-detail-ai-summary">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-grey-600 mb-2">
            Análisis IA
          </h4>
          <p className="text-body-sm text-neutral-grey-700 leading-relaxed">
            {analysis.ai_summary}
          </p>
        </section>

        {/* Suggested Action + Copy button (AC2) */}
        <section
          data-testid="lead-detail-suggested-action"
          className="bg-surface-low rounded-button p-4 border-l-[3px] border-l-brand-secondary-500"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-grey-600 mb-1">
                Acción Recomendada
              </h4>
              <p className="text-body-sm text-neutral-grey-800">
                {analysis.suggested_action}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copiar acción recomendada"
              data-testid="lead-detail-copy"
              className="text-body-xs px-3 py-1 rounded-button bg-surface-ground border border-neutral-grey-200 text-neutral-grey-700 hover:bg-neutral-grey-100 hover:text-brand-primary-500 transition-colors cursor-pointer font-semibold flex-shrink-0"
            >
              Copiar
            </button>
          </div>
        </section>

        {/* Property matches (AC2) */}
        <section data-testid="lead-detail-properties">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-grey-600 mb-2">
            Propiedades Coincidentes ({matchedProperties.length})
          </h4>
          {matchedProperties.length === 0 ? (
            <p className="text-body-sm text-neutral-grey-600">
              Sin propiedades coincidentes
            </p>
          ) : (
            <ul className="space-y-2">
              {matchedProperties.map((p) => (
                <PropertyMatchCard key={p.id} property={p} />
              ))}
            </ul>
          )}
        </section>
      </div>

      {footer}
    </aside>
  );
}
