/**
 * tests/frontend/test_random_simulator_button.tsx
 *
 * Feature 18 (unified_random_lead_simulator) — frontend.
 *
 * Verifica:
 *  - El SimulatorPanel con dos botones fue eliminado: NO existen botones
 *    "Simular Lead Interesado" / "Simular Lead Spam" en el dashboard.
 *  - Existe un único botón "+ Nuevo lead" en el PageHeader del Dashboard.
 *  - Click → fetch a `/api/leads/simulate` con method POST y SIN body.
 *  - Lead no-spam aparece en el feed principal.
 *  - Lead spam aparece en la sección "Leads Spam Detectados".
 *  - Mientras fetch está en flight, el botón muestra "Generando..." y queda
 *    deshabilitado (aria-busy="true").
 *  - Si fetch falla (HTTP 500), aparece un toast con role="status" y el
 *    botón vuelve a estar habilitado.
 */

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../pages/index";
import type { Lead } from "../../product/types/lead";
import type { LeadAnalysis } from "../../product/types/lead_analysis";

// Mock del hook useLeadAnalysis — no se quiere disparar fetch a /analyze.
jest.mock("../../product/frontend/hooks/useLeadAnalysis", () => ({
  useLeadAnalysis: () => ({ analysis: null, isLoading: false, error: null }),
}));

// Mock de chart.js + react-chartjs-2 — jsdom no soporta canvas y
// LeadsBarChart/QualityDoughnut crashearían al render.
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

const INTERESTED_LEAD: Lead = {
  id: "sim-interested-1",
  mensaje: "Hola, quiero coordinar una visita esta semana.",
  email: "lead1234@gmail.com",
  telefono: "+54 9 11 1234-5678",
  zona: "Palermo",
  tipo_propiedad: "departamento",
  presupuesto_usd: 220000,
  property_ids: [],
};

const INTERESTED_ANALYSIS: LeadAnalysis = {
  trust_score: 92,
  conversion_score: 85,
  urgency_score: 80,
  is_spam: false,
  detected_intent: "Compra",
  suggested_action: "Llamar inmediato.",
  ai_summary: "Lead de alta prioridad.",
  property_match_ids: [],
};

const SPAM_LEAD: Lead = {
  id: "sim-spam-1",
  mensaje: "test",
  email: "user1@tempmail.org",
  telefono: "000-0000",
  zona: "Palermo",
  tipo_propiedad: null,
  presupuesto_usd: 0,
  property_ids: [],
};

const SPAM_ANALYSIS: LeadAnalysis = {
  trust_score: 5,
  conversion_score: 2,
  urgency_score: 1,
  is_spam: true,
  detected_intent: "Spam",
  suggested_action: "Descartar.",
  ai_summary: "Lead spam.",
  property_match_ids: [],
};

function makeOkResponse(data: unknown) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  });
}

function makeErrResponse(status: number, data: unknown) {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  // Restaurar fetch
  delete (global as { fetch?: unknown }).fetch;
});

// AC3 + AC7: no quedan rastros de los dos botones antiguos.
test("dashboard_does_not_render_legacy_simulator_buttons", () => {
  render(<Home />);

  expect(
    screen.queryByRole("button", { name: "Simular Lead Interesado" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Simular Lead Spam" }),
  ).not.toBeInTheDocument();
});

// AC3 + AC7: existe exactamente un botón con el label "+ Nuevo lead".
test("dashboard_renders_single_new_lead_primary_button", () => {
  render(<Home />);

  const buttons = screen.getAllByRole("button", { name: "+ Nuevo lead" });
  expect(buttons).toHaveLength(1);
});

// AC7: click dispara fetch a /api/leads/simulate sin body.
test("click_on_new_lead_fires_fetch_to_simulate_without_body", async () => {
  global.fetch = jest.fn(() =>
    makeOkResponse({ lead: INTERESTED_LEAD, analysis: INTERESTED_ANALYSIS }),
  ) as jest.Mock;

  render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: "+ Nuevo lead" }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled();
  });

  const call = (global.fetch as jest.Mock).mock.calls[0];
  expect(call[0]).toBe("/api/leads/simulate");
  expect(call[1].method).toBe("POST");
  // El body NO debe haber sido enviado (feature 18 envía POST sin payload).
  expect(call[1].body).toBeUndefined();
});

// AC3 + AC4: lead no-spam aparece en el feed principal.
test("non_spam_lead_appears_in_feed_after_click", async () => {
  global.fetch = jest.fn(() =>
    makeOkResponse({ lead: INTERESTED_LEAD, analysis: INTERESTED_ANALYSIS }),
  ) as jest.Mock;

  const { container } = render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: "+ Nuevo lead" }));

  await waitFor(() => {
    // El id del lead generado debe aparecer en el DOM (en LeadCard del feed).
    expect(container.textContent ?? "").toContain("sim-interested-1");
  });

  // La sección spam no se renderiza.
  expect(
    screen.queryByText(/Leads Spam Detectados/),
  ).not.toBeInTheDocument();
});

// AC4: lead spam aparece en la sección spam.
test("spam_lead_appears_in_spam_section_after_click", async () => {
  global.fetch = jest.fn(() =>
    makeOkResponse({ lead: SPAM_LEAD, analysis: SPAM_ANALYSIS }),
  ) as jest.Mock;

  render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: "+ Nuevo lead" }));

  await waitFor(() => {
    expect(screen.getByText(/Leads Spam Detectados/)).toBeInTheDocument();
  });
});

// AC5: estado loading (spinner inline + disabled + texto "Generando...").
test("button_shows_loading_state_during_fetch", async () => {
  // Fetch que nunca resuelve durante el test.
  global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

  render(<Home />);

  const btn = screen.getByRole("button", { name: "+ Nuevo lead" });
  expect(btn).not.toBeDisabled();

  fireEvent.click(btn);

  await waitFor(() => {
    // El botón ahora dice "Generando..." y está disabled / aria-busy.
    const loadingBtn = screen.getByRole("button", { name: /Generando/ });
    expect(loadingBtn).toBeDisabled();
    expect(loadingBtn).toHaveAttribute("aria-busy", "true");
  });
});

// AC5: errores como toast (no inline) usando Toast.tsx común.
test("error_response_shows_toast_with_role_status_and_re_enables_button", async () => {
  global.fetch = jest.fn(() =>
    makeErrResponse(500, { error: "Simulation failed" }),
  ) as jest.Mock;

  render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: "+ Nuevo lead" }));

  // Toast aparece con role="status" (Toast.tsx).
  await waitFor(() => {
    const toastHost = screen.getByTestId("sim-error-toast");
    expect(toastHost).toBeInTheDocument();
    // El componente Toast usa role="status".
    expect(toastHost.querySelector('[role="status"]')).not.toBeNull();
  });

  // El botón vuelve a estar habilitado tras el error.
  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: "+ Nuevo lead" }),
    ).not.toBeDisabled();
  });
});
