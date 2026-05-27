import React, { useMemo } from "react";
import type { Lead, Source, Estado } from "../../../types/lead";
import type { LeadAnalysis } from "../../../types/lead_analysis";
import { computeLocalScore } from "../../lib/scoreUtils";
import ScoreBar, { scoreColorClass } from "./ScoreBar";

/**
 * RecentLeadsTable — Tabla 'Leads recientes' del Dashboard (feature 12).
 *
 * Reglas:
 *  - role='table' nativo (AC1) con 6 columnas: Lead | Trust | Conversión | Urgencia | Fuente | Estado.
 *  - ScoreBar con color dinámico verde ≥75 / amarillo 50-74 / rojo <50.
 *  - Click en fila → onSelectLead(lead.id). Filas accesibles por teclado
 *    (Enter / Space) con role='button' + tabIndex=0 (sin envolver `<button>`
 *    para preservar la semántica del `<tr>`).
 *  - aria-selected refleja `selectedLeadId === lead.id` (AC3).
 *  - Data-driven: sólo lee de `leads`, `aiScores`, `analysisByLeadId` (AC4).
 *
 * Fallbacks para conversion/urgency cuando no hay análisis IA completo:
 *  - conversion ≈ trust * 0.9.
 *  - urgency: derivada de computeLocalScore.urgency → Alta=85, Media=55, Baja=25.
 *  Estos valores son aproximaciones determinísticas para mantener la UI
 *  útil hasta que /api/leads/analyze pueble `analysisByLeadId`.
 */

export interface RecentLeadsTableProps {
  leads: Lead[];
  aiScores: Record<string, number>;
  /** Mapa opcional con análisis IA completos por lead.id. */
  analysisByLeadId?: Record<string, LeadAnalysis>;
  /** Máximo de filas a renderizar (default 6). */
  limit?: number;
  onSelectLead: (leadId: string) => void;
  selectedLeadId?: string | null;
  className?: string;
}

const URGENCY_FALLBACK: Record<"Alta" | "Media" | "Baja", number> = {
  Alta: 85,
  Media: 55,
  Baja: 25,
};

/** Mapa de color tematizado por canal — alineado con SourceFunnel + HTML target. */
const SOURCE_CHIP_CLASS: Record<Source, string> = {
  Zonaprop:
    "bg-brand-secondary-500/15 text-brand-secondary-700 border-brand-secondary-500/30",
  Argenprop:
    "bg-feedback-blue-500/10 text-feedback-blue-500 border-feedback-blue-500/30",
  WhatsApp:
    "bg-feedback-green-500/15 text-feedback-green-500 border-feedback-green-500/30",
  Mail:
    "bg-feedback-yellow-500/20 text-feedback-yellow-500 border-feedback-yellow-500/30",
  "Chat web":
    "bg-brand-primary-500/10 text-brand-primary-500 border-brand-primary-500/30",
  Mercadolibre:
    "bg-neutral-grey-100 text-neutral-grey-600 border-neutral-grey-300",
  Navent: "bg-neutral-grey-100 text-neutral-grey-600 border-neutral-grey-300",
};

const ESTADO_BADGE_CLASS: Record<Estado, string> = {
  Nuevo: "bg-feedback-blue-500/15 text-feedback-blue-500",
  "En revisión": "bg-feedback-yellow-500/20 text-feedback-yellow-500",
  Calificado: "bg-feedback-green-500/15 text-feedback-green-500",
  Descartado: "bg-brand-primary-500/15 text-brand-primary-500",
};

function deriveDisplayName(lead: Lead): string {
  if (lead.email) {
    const local = lead.email.split("@")[0];
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

function truncateMsg(msg: string | undefined, max = 28): string {
  if (!msg) return "";
  if (msg.length <= max) return msg;
  return `${msg.slice(0, max)}…`;
}

function compareByCreatedAtDesc(a: Lead, b: Lead): number {
  const aTime = a.created_at ? Date.parse(a.created_at) : NaN;
  const bTime = b.created_at ? Date.parse(b.created_at) : NaN;
  const aValid = !Number.isNaN(aTime);
  const bValid = !Number.isNaN(bTime);
  if (aValid && bValid) return bTime - aTime;
  if (aValid) return -1;
  if (bValid) return 1;
  return 0;
}

interface ResolvedRow {
  lead: Lead;
  trust: number;
  conversion: number;
  urgency: number;
  displayName: string;
  initial: string;
  source?: Source;
  estado: Estado;
}

export default function RecentLeadsTable({
  leads,
  aiScores,
  analysisByLeadId,
  limit = 6,
  onSelectLead,
  selectedLeadId,
  className,
}: RecentLeadsTableProps) {
  const rows = useMemo<ResolvedRow[]>(() => {
    const resolved = leads.map((lead) => {
      const local = computeLocalScore(lead);
      const aiTrust = aiScores[lead.id];
      const analysis = analysisByLeadId?.[lead.id];
      const trust = analysis?.trust_score ?? aiTrust ?? local.trust_score;
      const conversion =
        analysis?.conversion_score ?? Math.round(trust * 0.9);
      const urgency =
        analysis?.urgency_score ?? URGENCY_FALLBACK[local.urgency];
      const displayName = deriveDisplayName(lead);
      return {
        lead,
        trust,
        conversion,
        urgency,
        displayName,
        initial: avatarInitial(displayName),
        source: lead.source,
        estado: lead.estado ?? "Nuevo",
      } as ResolvedRow;
    });

    const allHaveCreatedAt = resolved.every((r) => Boolean(r.lead.created_at));
    const sorted = [...resolved].sort((a, b) => {
      if (allHaveCreatedAt) {
        return compareByCreatedAtDesc(a.lead, b.lead);
      }
      return b.trust - a.trust;
    });

    return sorted.slice(0, limit);
  }, [leads, aiScores, analysisByLeadId, limit]);

  function handleSelect(leadId: string) {
    onSelectLead(leadId);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTableRowElement>,
    leadId: string,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectLead(leadId);
    }
  }

  return (
    <section
      aria-label="Leads recientes"
      className={`bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5 ${
        className ?? ""
      }`}
    >
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-[13px] font-semibold text-neutral-grey-800">
          Leads recientes
        </h2>
      </header>

      <div className="overflow-x-auto">
        <table
          role="table"
          className="w-full border-collapse"
          aria-label="Tabla de leads recientes"
        >
          <thead>
            <tr>
              {[
                "Lead",
                "Trust",
                "Conversión",
                "Urgencia",
                "Fuente",
                "Estado",
              ].map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 text-left py-2 px-3 border-b border-neutral-grey-200"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 px-3 text-center text-body-sm text-neutral-grey-500"
                >
                  No hay leads recientes para mostrar.
                </td>
              </tr>
            )}
            {rows.map(
              ({
                lead,
                trust,
                conversion,
                urgency,
                displayName,
                initial,
                source,
                estado,
              }) => {
                const isSelected = selectedLeadId === lead.id;
                const avatarBg = scoreColorClass(trust).bg;
                return (
                  <tr
                    key={lead.id}
                    role="button"
                    tabIndex={0}
                    aria-selected={isSelected}
                    data-lead-id={lead.id}
                    onClick={() => handleSelect(lead.id)}
                    onKeyDown={(e) => handleKeyDown(e, lead.id)}
                    className={`cursor-pointer transition-colors outline-none focus-visible:bg-neutral-grey-100 hover:bg-neutral-grey-50 ${
                      isSelected ? "bg-neutral-grey-100" : ""
                    }`}
                  >
                    <td className="py-2.5 px-3 border-b border-neutral-grey-100">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={`flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold text-white ${avatarBg}`}
                        >
                          {initial}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[12px] font-semibold text-neutral-grey-800 truncate">
                            {displayName}
                          </div>
                          <div className="text-[11px] text-neutral-grey-500 truncate">
                            {truncateMsg(lead.mensaje)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 border-b border-neutral-grey-100 w-[140px]">
                      <ScoreBar value={trust} ariaLabel={`Trust ${trust}`} />
                    </td>
                    <td className="py-2.5 px-3 border-b border-neutral-grey-100 w-[140px]">
                      <ScoreBar
                        value={conversion}
                        ariaLabel={`Conversión ${conversion}`}
                      />
                    </td>
                    <td className="py-2.5 px-3 border-b border-neutral-grey-100 w-[140px]">
                      <ScoreBar
                        value={urgency}
                        ariaLabel={`Urgencia ${urgency}`}
                      />
                    </td>
                    <td className="py-2.5 px-3 border-b border-neutral-grey-100">
                      {source ? (
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-[3px] rounded-chip border ${SOURCE_CHIP_CLASS[source]}`}
                        >
                          {source}
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-grey-400">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 border-b border-neutral-grey-100">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-[2px] rounded-pill ${ESTADO_BADGE_CLASS[estado]}`}
                      >
                        {estado}
                      </span>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
