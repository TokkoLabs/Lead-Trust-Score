import React, { useMemo } from "react";
import LeadsFeed from "../components/LeadsFeed";
import LeadDetailPanel from "../components/LeadDetailPanel";
import LeadCard from "../components/LeadCard";
import KpiRow from "../components/dashboard/KpiRow";
import LeadsBarChart from "../components/dashboard/LeadsBarChart";
import QualityDoughnut from "../components/dashboard/QualityDoughnut";
import RecentLeadsTable from "../components/dashboard/RecentLeadsTable";
import SourceFunnel from "../components/dashboard/SourceFunnel";
import CriteriaCard from "../components/dashboard/CriteriaCard";
import {
  computeKpis,
  computeDailyBuckets,
  type AnalysisMap,
} from "../lib/dashboardMetrics";
import type { Lead } from "../../types/lead";
import type { Property } from "../../types/property";
import type { LeadAnalysis } from "../../types/lead_analysis";
import type { LeadWithScore } from "../types/feed";

/**
 * DashboardView — envuelve el layout actual del dashboard que vivía
 * inline en `pages/index.tsx`: LeadsFeed + sección spam + LeadDetailPanel.
 *
 * Feature 11 (dashboard_kpis_and_charts) agrega arriba del layout previo
 * una fila de 4 KPI cards y dos gráficos (bar stacked + doughnut).
 *
 * Feature 18 (unified_random_lead_simulator): el SimulatorPanel con dos
 * botones se elimina; el trigger de simulación pasa al botón primario del
 * PageHeader en `pages/index.tsx`.
 *
 * Cubre: R8, R9, R23 (feature 9) + AC1-AC4 (feature 11).
 */
export interface DashboardViewProps {
  sortedLeads: LeadWithScore[];
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
  selectedLead: Lead | null;
  analysis: LeadAnalysis | null;
  isLoading: boolean;
  properties: Property[];
  spamLeads: LeadWithScore[];
  newLeadId: string | null;
  /** Opcional: leads "crudos" para el cálculo de métricas. Por defecto se
   *  reconstruye desde sortedLeads + spamLeads. */
  leadsForMetrics?: Lead[];
  /** Mapa leadId → analysis (trust_score, is_spam) para alimentar KPIs/charts. */
  analyses?: AnalysisMap;
  /** Handler opcional para el CTA "Ver cola →" del bar chart. */
  onSeeQueue?: () => void;
}

export default function DashboardView({
  sortedLeads,
  selectedLeadId,
  onSelectLead,
  selectedLead,
  analysis,
  isLoading,
  properties,
  spamLeads,
  newLeadId,
  leadsForMetrics,
  analyses,
  onSeeQueue,
}: DashboardViewProps) {
  // AC4: los widgets derivan del estado actual de leads + analyses.
  // Si el host no pasa `leadsForMetrics`, reconstruimos un superset uniendo
  // los leads del feed y los marcados como spam.
  const metricsLeads = useMemo<Lead[]>(() => {
    if (leadsForMetrics) return leadsForMetrics;
    const seen = new Set<string>();
    const out: Lead[] = [];
    for (const item of sortedLeads) {
      if (!seen.has(item.lead.id)) {
        seen.add(item.lead.id);
        out.push(item.lead);
      }
    }
    for (const item of spamLeads) {
      if (!seen.has(item.lead.id)) {
        seen.add(item.lead.id);
        out.push(item.lead);
      }
    }
    return out;
  }, [leadsForMetrics, sortedLeads, spamLeads]);

  // Si no se pasa `analyses`, derivamos un mapa best-effort desde sortedLeads
  // (trust_score conocido) y spamLeads (is_spam=true).
  const analysesMap = useMemo<AnalysisMap>(() => {
    if (analyses) return analyses;
    const map: AnalysisMap = {};
    for (const item of sortedLeads) {
      map[item.lead.id] = { trust_score: item.trust_score, is_spam: false };
    }
    for (const item of spamLeads) {
      map[item.lead.id] = { trust_score: item.trust_score, is_spam: true };
    }
    return map;
  }, [analyses, sortedLeads, spamLeads]);

  const kpis = useMemo(
    () => computeKpis(metricsLeads, analysesMap),
    [metricsLeads, analysesMap],
  );

  // Feature 12: RecentLeadsTable consume aiScores como Record<id, number>.
  // Derivamos del mismo `analysesMap` para evitar duplicar estado.
  const trustScoresMap = useMemo<Record<string, number>>(() => {
    const out: Record<string, number> = {};
    for (const [id, value] of Object.entries(analysesMap)) {
      out[id] = value.trust_score;
    }
    return out;
  }, [analysesMap]);

  const buckets = useMemo(
    () => computeDailyBuckets(metricsLeads, analysesMap),
    [metricsLeads, analysesMap],
  );

  const doughnutData = useMemo(() => {
    const totals = buckets.reduce(
      (acc, b) => {
        acc.alta += b.alta;
        acc.media += b.media;
        acc.baja += b.baja;
        return acc;
      },
      { alta: 0, media: 0, baja: 0 },
    );
    // Si no hubo created_at suficientes, fallback al desglose por KPIs.
    if (totals.alta + totals.media + totals.baja === 0) {
      const media = Math.max(
        0,
        kpis.total - kpis.altaCalidad - kpis.descartados,
      );
      return {
        alta: kpis.altaCalidad,
        media,
        baja: kpis.descartados,
      };
    }
    return totals;
  }, [buckets, kpis]);

  return (
    <div className="p-6 space-y-6">
      {/* Feature 11 — KPI row + charts */}
      <KpiRow kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeadsBarChart buckets={buckets} onSeeQueue={onSeeQueue} />
        </div>
        <div>
          <QualityDoughnut data={doughnutData} />
        </div>
      </div>

      {/* Feature 12 — Leads recientes + Volumen por fuente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentLeadsTable
            leads={metricsLeads}
            aiScores={trustScoresMap}
            onSelectLead={onSelectLead}
            selectedLeadId={selectedLeadId}
          />
        </div>
        <div>
          <SourceFunnel leads={metricsLeads} />
        </div>
      </div>

      {/* Feature 13 — Card "Criterios de scoring" ancho completo */}
      <div>
        <CriteriaCard />
      </div>

      {/* Layout previo (feature 9): feed+spam | detalle.
          Feature 18 elimina el SimulatorPanel; el trigger de simulación
          vive ahora en el botón "+ Nuevo lead" del PageHeader. */}
      <div className="flex gap-6 h-full">
        {/* Columna izquierda: feed + sección spam */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          <h2 className="text-title-sm font-bold text-neutral-grey-900 mb-6">
            Leads
          </h2>

          <LeadsFeed
            items={sortedLeads}
            onSelectLead={onSelectLead}
            selectedLeadId={selectedLeadId}
            newLeadId={newLeadId}
          />

          {spamLeads.length > 0 && (
            <section className="mt-6">
              <h2 className="text-body-xs font-semibold text-brand-primary-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span aria-hidden="true">⚠</span>
                Leads Spam Detectados ({spamLeads.length})
              </h2>
              <div className="space-y-2">
                {spamLeads.map((item) => (
                  <div
                    key={item.lead.id}
                    className={`rounded-card bg-red-950 border border-red-800${
                      item.lead.id === newLeadId ? " animate-enter" : ""
                    }`}
                  >
                    <span className="sr-only">Lead spam:</span>
                    <ul>
                      <LeadCard
                        item={item}
                        isNew={item.lead.id === newLeadId}
                      />
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Columna derecha: detalle */}
        <div className="flex-1">
          {selectedLead ? (
            <LeadDetailPanel
              lead={selectedLead}
              analysis={analysis}
              isLoading={isLoading}
              properties={properties}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-grey-500 text-body-sm">
              Selecciona un lead del feed para ver el análisis IA detallado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
