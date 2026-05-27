import React, { useMemo } from "react";
import type { Lead, Source } from "../../../types/lead";

/**
 * SourceFunnel — bloque 'Volumen por fuente' del Dashboard (feature 12).
 *
 * Reglas:
 *  - Agrupa leads por `source`. Leads sin source son ignorados (AC2).
 *  - Calcula porcentaje relativo al máximo (max = 100%).
 *  - Ordena descendente por count (AC2 / test AC).
 *  - Color por canal alineado al HTML target
 *    (ui-ux/lead-trust-dashboard-tokko (3).html, líneas 731-736).
 *  - Data-driven a partir de `leads` (AC4); sin mock interno.
 */

export interface SourceFunnelProps {
  leads: Lead[];
  /** Top-N a renderizar (default 5). */
  limit?: number;
  className?: string;
}

interface FunnelRow {
  source: Source;
  count: number;
  /** Porcentaje 0-100 relativo al máximo. */
  percent: number;
}

interface ChannelTheme {
  /** Color de fondo (track + fill se mezclan con opacidad). */
  fillClass: string;
  textClass: string;
}

const CHANNEL_THEME: Record<Source, ChannelTheme> = {
  Zonaprop: {
    fillClass: "bg-brand-secondary-500/25",
    textClass: "text-brand-secondary-700",
  },
  Argenprop: {
    fillClass: "bg-feedback-blue-500/15",
    textClass: "text-feedback-blue-500",
  },
  WhatsApp: {
    fillClass: "bg-feedback-green-500/20",
    textClass: "text-feedback-green-500",
  },
  Mail: {
    fillClass: "bg-feedback-yellow-500/25",
    textClass: "text-feedback-yellow-500",
  },
  "Chat web": {
    fillClass: "bg-brand-primary-500/15",
    textClass: "text-brand-primary-500",
  },
  Mercadolibre: {
    fillClass: "bg-neutral-grey-200",
    textClass: "text-neutral-grey-700",
  },
  Navent: {
    fillClass: "bg-neutral-grey-200",
    textClass: "text-neutral-grey-700",
  },
};

function aggregate(leads: Lead[], limit: number): FunnelRow[] {
  const counts = new Map<Source, number>();
  for (const lead of leads) {
    if (!lead.source) continue;
    counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1);
  }
  if (counts.size === 0) return [];

  const entries: Array<[Source, number]> = Array.from(counts.entries());
  entries.sort((a, b) => b[1] - a[1]);
  const max = entries[0][1];

  return entries.slice(0, limit).map(([source, count]) => ({
    source,
    count,
    percent: max > 0 ? Math.round((count / max) * 100) : 0,
  }));
}

export default function SourceFunnel({
  leads,
  limit = 5,
  className,
}: SourceFunnelProps) {
  const rows = useMemo(() => aggregate(leads, limit), [leads, limit]);

  return (
    <section
      aria-label="Volumen por fuente"
      className={`bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5 ${
        className ?? ""
      }`}
    >
      <header className="mb-4">
        <h2 className="text-[13px] font-semibold text-neutral-grey-800">
          Volumen por fuente
        </h2>
        <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mt-2">
          Distribución por canal
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="text-body-sm text-neutral-grey-500">
          No hay leads con fuente asignada.
        </p>
      ) : (
        <ul className="flex flex-col gap-2" data-testid="funnel-list">
          {rows.map(({ source, count, percent }) => {
            const theme = CHANNEL_THEME[source];
            return (
              <li
                key={source}
                className="flex items-center gap-3"
                data-source={source}
              >
                <span className="text-[11px] font-semibold text-neutral-grey-600 w-[70px] shrink-0">
                  {source}
                </span>
                <div
                  className="flex-1 h-5 rounded-chip bg-neutral-grey-100 overflow-hidden"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  aria-label={`${source}: ${count} leads (${percent}%)`}
                >
                  <div
                    data-testid="funnel-fill"
                    data-percent={percent}
                    className={`h-full rounded-chip flex items-center justify-end pr-2 text-[11px] font-bold transition-[width] duration-500 ${theme.fillClass} ${theme.textClass}`}
                    style={{ width: `${percent}%` }}
                  >
                    {count}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
