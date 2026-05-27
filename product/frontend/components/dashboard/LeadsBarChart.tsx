import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { DailyBucket } from "../../lib/dashboardMetrics";

// Registrar piezas de chart.js una sola vez por módulo.
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

/**
 * LeadsBarChart — Stacked bar chart "Leads por día y calidad".
 *
 * Acceptance feature 11 AC2: chart.js + react-chartjs-2, stacked bars con
 * 3 datasets (alta verde, media teal, baja rojo) y borderRadius 4.
 *
 * Colores literales del HTML target (líneas ~1025-1027):
 *   - Alta calidad  → rgba(24,156,123,.75)
 *   - Media calidad → rgba(66,127,148,.55)
 *   - Baja / spam   → rgba(223,21,23,.45)
 *
 * Copy del header tomado del HTML target (líneas ~704-706):
 *   - Título: "Leads por día y calidad"
 *   - CTA   : "Ver cola →"
 */

export interface LeadsBarChartProps {
  buckets: DailyBucket[];
  /** Si se pasa, el CTA "Ver cola →" del header invoca este handler. */
  onSeeQueue?: () => void;
}

const COLOR_ALTA = "rgba(24,156,123,.75)";
const COLOR_MEDIA = "rgba(66,127,148,.55)";
const COLOR_BAJA = "rgba(223,21,23,.45)";

const TICK_COLOR = "#94A2AB";
const GRID_COLOR = "#EAEEF1";
const FONT_FAMILY = "Nunito Sans";

export default function LeadsBarChart({
  buckets,
  onSeeQueue,
}: LeadsBarChartProps) {
  const data = {
    labels: buckets.map((b) => b.label),
    datasets: [
      {
        label: "Alta calidad",
        data: buckets.map((b) => b.alta),
        backgroundColor: COLOR_ALTA,
        borderRadius: 4,
        borderSkipped: false as const,
      },
      {
        label: "Media calidad",
        data: buckets.map((b) => b.media),
        backgroundColor: COLOR_MEDIA,
        borderRadius: 4,
        borderSkipped: false as const,
      },
      {
        label: "Baja / spam",
        data: buckets.map((b) => b.baja),
        backgroundColor: COLOR_BAJA,
        borderRadius: 4,
        borderSkipped: false as const,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: false, text: "Leads por día y calidad" },
      legend: {
        labels: {
          color: TICK_COLOR,
          font: { family: FONT_FAMILY, size: 11, weight: 600 },
          boxWidth: 10,
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: "#FFFFFF",
        titleColor: "#1D2327",
        bodyColor: "#6A7981",
        borderColor: "#D6DEE2",
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          color: TICK_COLOR,
          font: { family: FONT_FAMILY, size: 11 },
        },
      },
      y: {
        stacked: true,
        grid: { color: GRID_COLOR },
        ticks: {
          color: TICK_COLOR,
          font: { family: FONT_FAMILY, size: 11 },
        },
      },
    },
  } as const;

  return (
    <section
      aria-label="Leads por día y calidad"
      className="bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5"
    >
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-[13px] font-semibold text-neutral-grey-800">
          Leads por día y calidad
        </h2>
        {onSeeQueue && (
          <button
            type="button"
            onClick={onSeeQueue}
            className="text-xs font-semibold text-brand-primary-500 hover:underline"
          >
            Ver cola →
          </button>
        )}
      </header>
      <div className="relative h-[200px]">
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}
