/**
 * tests/frontend/test_dashboard_widgets.tsx
 *
 * Verifica el render de los widgets del Dashboard (feature 11):
 *   - KpiRow expone las 4 KPI cards con los labels exactos del HTML target.
 *   - LeadsBarChart recibe buckets calculados y renderiza un <canvas>.
 *   - QualityDoughnut renderiza con leyenda inferior y los 3 labels.
 *
 * Para evitar romper con chart.js + jsdom (no soporta canvas real),
 * mockeamos chart.js y react-chartjs-2 a stubs que renderizan un <canvas>
 * con data-testid distinguible.
 *
 * Cubre acceptance feature 11 AC7.
 */

// IMPORTANT: jest.mock se eleva antes de los imports, por eso los stubs
// quedan activos para todos los componentes importados.
jest.mock("chart.js", () => ({
  Chart: { register: jest.fn() },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  ArcElement: {},
  Tooltip: {},
  Legend: {},
}));

jest.mock("react-chartjs-2", () => {
  const React = require("react") as typeof import("react");
  return {
    Bar: (props: { data: { labels: string[] } }) =>
      React.createElement("canvas", {
        "data-testid": "bar-chart",
        "aria-label": "Leads por día y calidad",
        "data-labels": JSON.stringify(props.data.labels),
      }),
    Doughnut: (props: { data: { labels: string[] } }) =>
      React.createElement("canvas", {
        "data-testid": "doughnut-chart",
        "aria-label": "Distribución por calidad",
        "data-labels": JSON.stringify(props.data.labels),
      }),
  };
});

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import KpiRow from "../../product/frontend/components/dashboard/KpiRow";
import LeadsBarChart from "../../product/frontend/components/dashboard/LeadsBarChart";
import QualityDoughnut from "../../product/frontend/components/dashboard/QualityDoughnut";
import type {
  DailyBucket,
  Kpis,
} from "../../product/frontend/lib/dashboardMetrics";

describe("KpiRow", () => {
  it("AC1: renderiza las 4 KPI cards con los labels exactos del HTML target", () => {
    const kpis: Kpis = {
      total: 247,
      scorePromedio: 64,
      altaCalidad: 89,
      descartados: 31,
    };

    render(<KpiRow kpis={kpis} />);

    expect(screen.getByText("Total leads")).toBeInTheDocument();
    expect(screen.getByText("Score promedio")).toBeInTheDocument();
    expect(screen.getByText("Alta calidad (≥75)")).toBeInTheDocument();
    expect(screen.getByText("Descartados (spam)")).toBeInTheDocument();

    // Los valores también deben aparecer.
    expect(screen.getByText("247")).toBeInTheDocument();
    expect(screen.getByText("64")).toBeInTheDocument();
    expect(screen.getByText("89")).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();

    // 4 grupos role=group (KpiCard envuelve cada card en role=group).
    expect(screen.getAllByRole("group")).toHaveLength(4);
  });
});

describe("LeadsBarChart", () => {
  const buckets: DailyBucket[] = [
    { date: "2026-05-21", label: "Jue", alta: 1, media: 2, baja: 0 },
    { date: "2026-05-22", label: "Vie", alta: 3, media: 1, baja: 1 },
    { date: "2026-05-23", label: "Sáb", alta: 0, media: 0, baja: 2 },
    { date: "2026-05-24", label: "Dom", alta: 2, media: 4, baja: 0 },
    { date: "2026-05-25", label: "Lun", alta: 1, media: 1, baja: 1 },
    { date: "2026-05-26", label: "Mar", alta: 5, media: 3, baja: 0 },
    { date: "2026-05-27", label: "Hoy", alta: 4, media: 2, baja: 1 },
  ];

  it("AC2: renderiza un <canvas> y el título 'Leads por día y calidad'", () => {
    render(<LeadsBarChart buckets={buckets} />);

    const canvas = screen.getByTestId("bar-chart");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute(
      "aria-label",
      "Leads por día y calidad",
    );

    // El título también se renderiza en el header.
    expect(screen.getByText("Leads por día y calidad")).toBeInTheDocument();
  });

  it("AC2: pasa al chart las labels derivadas de buckets (length=7)", () => {
    render(<LeadsBarChart buckets={buckets} />);
    const canvas = screen.getByTestId("bar-chart");
    const labels = JSON.parse(canvas.getAttribute("data-labels") || "[]");
    expect(labels).toHaveLength(7);
    expect(labels[6]).toBe("Hoy");
  });

  it("AC2: el CTA 'Ver cola →' aparece sólo cuando onSeeQueue está presente", () => {
    const onSeeQueue = jest.fn();
    const { rerender } = render(<LeadsBarChart buckets={buckets} />);
    expect(screen.queryByRole("button", { name: "Ver cola →" })).toBeNull();

    rerender(<LeadsBarChart buckets={buckets} onSeeQueue={onSeeQueue} />);
    expect(
      screen.getByRole("button", { name: "Ver cola →" }),
    ).toBeInTheDocument();
  });
});

describe("QualityDoughnut", () => {
  it("AC3: renderiza un <canvas> con los 3 labels Alta/Media/Baja", () => {
    render(<QualityDoughnut data={{ alta: 5, media: 3, baja: 2 }} />);

    const canvas = screen.getByTestId("doughnut-chart");
    expect(canvas).toBeInTheDocument();
    const labels = JSON.parse(canvas.getAttribute("data-labels") || "[]");
    expect(labels).toEqual([
      "Alta (≥75)",
      "Media (40–74)",
      "Baja / spam",
    ]);

    // Título del card visible.
    expect(screen.getByText("Distribución por calidad")).toBeInTheDocument();
  });
});
