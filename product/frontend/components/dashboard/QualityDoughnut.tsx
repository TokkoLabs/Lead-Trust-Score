import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Registrar piezas de chart.js una sola vez por módulo.
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * QualityDoughnut — Doughnut chart "Distribución por calidad".
 *
 * Acceptance feature 11 AC3: cutout 68%, hoverOffset 6, 3 segmentos
 * (Alta/Media/Baja) y leyenda inferior.
 *
 * Colores literales del HTML target (línea ~1047):
 *   - Alta (≥75)     → rgba(24,156,123,.8)
 *   - Media (40-74)  → rgba(66,127,148,.65)
 *   - Baja / spam    → rgba(223,21,23,.7)
 */

export interface QualityDoughnutProps {
  data: { alta: number; media: number; baja: number };
}

const FONT_FAMILY = "Nunito Sans";
const TICK_COLOR = "#94A2AB";

export default function QualityDoughnut({ data }: QualityDoughnutProps) {
  const chartData = {
    labels: ["Alta (≥75)", "Media (40–74)", "Baja / spam"],
    datasets: [
      {
        data: [data.alta, data.media, data.baja],
        backgroundColor: [
          "rgba(24,156,123,.8)",
          "rgba(66,127,148,.65)",
          "rgba(223,21,23,.7)",
        ],
        borderColor: "#FFFFFF",
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: TICK_COLOR,
          font: { family: FONT_FAMILY, size: 11, weight: 600 },
          boxWidth: 10,
          padding: 14,
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
  } as const;

  return (
    <section
      aria-label="Distribución por calidad"
      className="bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5"
    >
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-[13px] font-semibold text-neutral-grey-800">
          Distribución por calidad
        </h2>
      </header>
      <div className="relative h-[200px]">
        <Doughnut data={chartData} options={options} />
      </div>
    </section>
  );
}
