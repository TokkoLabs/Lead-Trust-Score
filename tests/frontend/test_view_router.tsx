/**
 * tests/frontend/test_view_router.tsx
 *
 * Tests para la navegación entre vistas del shell: render condicional
 * por activeView, persistencia de tabs, breadcrumb y botón primario.
 *
 * Cubre: R6, R13, R14, R16, R17, R18, R19, R20, R25, R26.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Home from "../../pages/index";

// Mock del hook useLeadAnalysis: el test no hace fetch real, no necesita
// análisis IA cargado para verificar el router de vistas.
jest.mock("../../product/frontend/hooks/useLeadAnalysis", () => ({
  useLeadAnalysis: () => ({ analysis: null, isLoading: false, error: null }),
}));

// Mocks de chart.js + react-chartjs-2: jsdom no soporta canvas; sin esto
// LeadsBarChart/QualityDoughnut (montados por DashboardView desde la
// feature 11) crashean al renderizarse.
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
  const ReactLib = require("react") as typeof import("react");
  return {
    Bar: () =>
      ReactLib.createElement("canvas", { "data-testid": "bar-chart" }),
    Doughnut: () =>
      ReactLib.createElement("canvas", { "data-testid": "doughnut-chart" }),
  };
});

describe("view_router_navigation", () => {
  it("R13, R16: render inicial muestra DashboardView con title 'Dashboard de leads' y tablist", () => {
    render(<Home />);

    // Título exacto de la vista dashboard.
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Dashboard de leads"
    );

    // Tablist presente (R17 — dashboard sí tiene tabs).
    expect(screen.getByRole("tablist")).toBeInTheDocument();

    // DashboardView montado: identificable por el botón "+ Nuevo lead"
    // del PageHeader (feature 18). El SimulatorPanel ya no existe.
    expect(
      screen.getByRole("button", { name: "+ Nuevo lead" })
    ).toBeInTheDocument();
  });

  it("R14, R16: click sobre nav item 'Cola de leads' muestra QueueView y cambia el title", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole("button", { name: "Cola de leads" }));

    // El title pasa a 'Cola de leads' (literal exacto).
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Cola de leads"
    );

    // Tablist sigue visible (R17 — queue también tiene tabs en PageHeader).
    expect(screen.getByRole("tablist")).toBeInTheDocument();

    // QueueView montado (feature 14 reemplazó el placeholder por la vista
    // real con stats + filter bar + cards) y DashboardView desmontado.
    expect(screen.getByTestId("queue-view")).toBeInTheDocument();
  });

  it("R17: click sobre 'Procesados' muestra ProcessedView SIN tablist", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole("button", { name: "Procesados" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Leads procesados"
    );
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();

    // Botón de la vista de procesados.
    expect(
      screen.getByRole("button", { name: "Volver al dashboard" })
    ).toBeInTheDocument();
  });

  it("R17: click sobre 'Criterios' muestra CriteriaView SIN tablist", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole("button", { name: "Criterios" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Criterios de scoring"
    );
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("R18: cambio de tab en Dashboard persiste tras ir a Cola y volver", async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Seleccionar "7 días" en Dashboard.
    await user.click(screen.getByRole("tab", { name: "7 días" }));
    expect(screen.getByRole("tab", { name: "7 días" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    // Ir a Cola y volver a Dashboard vía LeftRail.
    await user.click(screen.getByRole("button", { name: "Cola de leads" }));
    await user.click(screen.getByRole("button", { name: "Dashboard" }));

    // "7 días" sigue activa en Dashboard.
    expect(screen.getByRole("tab", { name: "7 días" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Hoy" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("R20: click sobre breadcrumb 'Volver' desde QueueView regresa a Dashboard", async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Navegar a Cola.
    await user.click(screen.getByRole("button", { name: "Cola de leads" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Cola de leads"
    );

    // Click en breadcrumb "Volver".
    await user.click(screen.getByRole("button", { name: "Volver" }));

    // Volvimos a Dashboard.
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Dashboard de leads"
    );
  });

  it("R6, R19: botón primario '+ Nuevo lead' es clickable y no lanza excepciones", async () => {
    // Feature 18: el click dispara POST /api/leads/simulate. Mockeamos
    // fetch con un Promise pendiente para no salir a la red y verificar
    // que el botón sigue montado durante el ciclo.
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const user = userEvent.setup();
    render(<Home />);

    const btn = screen.getByRole("button", { name: "+ Nuevo lead" });
    expect(btn).toBeInTheDocument();

    // El click no debe lanzar excepciones.
    await user.click(btn);

    // El botón sigue montado y accesible (aunque ahora con label
    // "Generando..." mientras está loading). Buscamos por el botón del
    // PageHeader específicamente (el rail también tiene "Nuevo lead").
    expect(
      screen.getByRole("button", { name: /^\+ Nuevo lead$|^Generando/ })
    ).toBeInTheDocument();

    global.fetch = originalFetch;
  });
});
