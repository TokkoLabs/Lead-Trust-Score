import React, { useMemo, useState } from "react";
import type { Lead } from "../../types/lead";
import type { LeadAnalysis } from "../../types/lead_analysis";
import { computeLocalScore } from "../lib/scoreUtils";
import QueueStats from "../components/queue/QueueStats";
import FilterBar, { type FilterKind } from "../components/queue/FilterBar";
import QueueCard from "../components/queue/QueueCard";

/**
 * QueueView — vista "Cola de leads" del HTML target.
 *
 * Compone QueueStats + FilterBar + lista de QueueCard. La fuente de verdad
 * de los leads es `pages/index.tsx`; QueueView solo lee props y mantiene
 * estado local de filtro + ids eliminados.
 *
 * Reglas (feature 14):
 *  - El score efectivo de cada lead es aiScores[id] si existe, sino
 *    computeLocalScore(lead).trust_score.
 *  - Filtro: Alta ≥75, Media 40-74, Baja <40 (consistente con
 *    dashboardMetrics.classifyTier sin la flag is_spam, que aquí no aplica
 *    porque los leads spam ya van a la sección spam del DashboardView).
 *  - Eliminar oculta localmente la card (estado dismissed) sin tocar el
 *    estado superior — feature 14 no contempla mutación persistente.
 *
 * Cubre: AC1, AC4, AC6.
 */

export interface QueueViewProps {
  leads: Lead[];
  aiScores: Record<string, number>;
  analysisByLeadId?: Record<string, LeadAnalysis>;
}

interface ResolvedLead {
  lead: Lead;
  trust_score: number;
  analysis?: LeadAnalysis;
}

function classifyFilter(score: number): Exclude<FilterKind, "all"> {
  if (score >= 75) return "high";
  if (score >= 40) return "mid";
  return "low";
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

export default function QueueView({
  leads,
  aiScores,
  analysisByLeadId,
}: QueueViewProps) {
  const [filter, setFilter] = useState<FilterKind>("all");
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(
    () => new Set<string>(),
  );

  const resolved: ResolvedLead[] = useMemo(() => {
    return leads
      .filter((l) => !dismissedIds.has(l.id))
      .map((lead) => {
        const aiTrust = aiScores[lead.id];
        const trust_score =
          typeof aiTrust === "number"
            ? aiTrust
            : computeLocalScore(lead).trust_score;
        return {
          lead,
          trust_score,
          analysis: analysisByLeadId?.[lead.id],
        };
      })
      .sort((a, b) => compareByCreatedAtDesc(a.lead, b.lead));
  }, [leads, aiScores, analysisByLeadId, dismissedIds]);

  const stats = useMemo(() => {
    let total = 0;
    let alta = 0;
    let baja = 0;
    for (const r of resolved) {
      total += 1;
      if (r.trust_score >= 75) alta += 1;
      else if (r.trust_score < 40) baja += 1;
    }
    return { total, alta, baja };
  }, [resolved]);

  const filtered = useMemo(() => {
    if (filter === "all") return resolved;
    return resolved.filter((r) => classifyFilter(r.trust_score) === filter);
  }, [resolved, filter]);

  function handleEliminar(leadId: string) {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(leadId);
      return next;
    });
  }

  // Handlers no-op para feature 14 (la integración real llega después).
  function handleCrearContacto(_leadId: string) {
    /* placeholder hasta feature de Contactos */
  }
  function handleAsignar(_leadId: string) {
    /* placeholder hasta feature de Equipo */
  }

  return (
    <div
      data-testid="queue-view"
      className="px-6 py-6 space-y-4 overflow-y-auto h-full"
    >
      <QueueStats
        total={stats.total}
        altaCalidad={stats.alta}
        bajaCalidad={stats.baja}
      />

      <FilterBar active={filter} onChange={setFilter} />

      <div
        data-testid="queue-list"
        className="space-y-3 transition-all duration-300"
        role="list"
        aria-label="Lista de leads en cola"
      >
        {filtered.length === 0 && (
          <div className="py-8 text-center text-neutral-grey-500 text-body-sm">
            No hay leads en esta categoría
          </div>
        )}
        {filtered.map(({ lead, trust_score, analysis }) => (
          <div role="listitem" key={lead.id}>
            <QueueCard
              lead={lead}
              analysis={analysis}
              trust_score={trust_score}
              onCrearContacto={handleCrearContacto}
              onAsignar={handleAsignar}
              onEliminar={handleEliminar}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
