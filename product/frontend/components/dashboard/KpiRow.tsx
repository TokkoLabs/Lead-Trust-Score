import React from "react";
import KpiCard from "./KpiCard";
import type { Kpis } from "../../lib/dashboardMetrics";

/**
 * KpiRow — fila superior del Dashboard con las 4 KpiCards derivadas del
 * estado actual de leads + analyses.
 *
 * Copy literal del HTML target (ui-ux/lead-trust-dashboard-tokko (3).html,
 * líneas 676-700):
 *   - "Total leads"
 *   - "Score promedio"
 *   - "Alta calidad (≥75)"
 *   - "Descartados (spam)"
 *
 * Accents copiados del HTML target:
 *   - Total leads     → teal (brand-secondary-500)
 *   - Score promedio  → green (feedback-green-500)
 *   - Alta calidad    → teal (brand-secondary-500)
 *   - Descartados     → red (brand-primary-500)
 */
export interface KpiRowProps {
  kpis: Kpis;
}

export default function KpiRow({ kpis }: KpiRowProps) {
  const totalSafe = kpis.total === 0 ? 1 : kpis.total;
  const altaPct = Math.round((kpis.altaCalidad / totalSafe) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard label="Total leads" value={kpis.total} accentColor="teal" />
      <KpiCard
        label="Score promedio"
        value={kpis.scorePromedio}
        accentColor="green"
      />
      <KpiCard
        label="Alta calidad (≥75)"
        value={kpis.altaCalidad}
        delta={{ value: altaPct, direction: "up", label: "% del total" }}
        accentColor="teal"
      />
      <KpiCard
        label="Descartados (spam)"
        value={kpis.descartados}
        accentColor="red"
      />
    </div>
  );
}
