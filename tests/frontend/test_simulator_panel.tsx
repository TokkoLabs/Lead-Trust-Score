/**
 * tests/frontend/test_simulator_panel.tsx
 * Tests para el componente SimulatorPanel.
 * Usa global.fetch = jest.fn() — sin llamadas reales.
 * Cubre: R8, R9, R10, R11, R12, R21
 */

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import SimulatorPanel from "../../product/frontend/components/SimulatorPanel";
import type { LeadAnalysis } from "../../product/types/lead_analysis";
import type { Lead } from "../../product/types/lead";

// Fixture Lead interesado
const INTERESTED_LEAD_FIXTURE: Lead = {
  id: "sim-1234567890",
  mensaje:
    "Hola! Estoy buscando un departamento de 3 ambientes en Palermo o Recoleta. " +
    "Mi presupuesto es de USD 220.000. Necesito mudarme antes de fin de mes porque " +
    "vence mi contrato de alquiler. Preferentemente piso alto con balcon.",
  email: "martin.gonzalez87@gmail.com",
  telefono: "+54 9 11 4832-9175",
  zona: "Palermo",
  tipo_propiedad: "departamento",
  presupuesto_usd: 220000,
  property_ids: [],
};

// Fixture LeadAnalysis para lead interesado
const INTERESTED_ANALYSIS_FIXTURE: LeadAnalysis = {
  trust_score: 88,
  conversion_score: 82,
  urgency_score: 75,
  is_spam: false,
  detected_intent: "Compra de departamento",
  suggested_action: "Contactar en 24hs.",
  ai_summary: "Lead de alta confiabilidad.",
  property_match_ids: ["prop-01"],
};

// Fixture Lead spam
const SPAM_LEAD_FIXTURE: Lead = {
  id: "sim-9999999999",
  mensaje: "comprar casa precio",
  email: "user4823@tempmail.org",
  telefono: "000-0000",
  zona: "",
  tipo_propiedad: null,
  presupuesto_usd: 0,
  property_ids: [],
};

// Fixture LeadAnalysis para spam
const SPAM_ANALYSIS_FIXTURE: LeadAnalysis = {
  trust_score: 5,
  conversion_score: 2,
  urgency_score: 1,
  is_spam: true,
  detected_intent: "Intencion vaga",
  suggested_action: "Descartar.",
  ai_summary: "Lead spam.",
  property_match_ids: [],
};

// Helper: crear respuesta fetch mockeada
function makeFetchResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

// R8, R21: Ambos botones visibles en el DOM
test("renders_both_buttons_with_correct_labels", () => {
  const onLeadSimulated = jest.fn();
  render(<SimulatorPanel onLeadSimulated={onLeadSimulated} />);

  expect(
    screen.getByRole("button", { name: "Simular Lead Interesado" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Simular Lead Spam" })
  ).toBeInTheDocument();
});

// R9, R21: Botones deshabilitados y texto "Simulando..." durante carga
test("disables_buttons_and_shows_loading_text_while_loading", async () => {
  const onLeadSimulated = jest.fn();

  // Fetch que no resuelve (simula carga indefinida)
  global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

  render(<SimulatorPanel onLeadSimulated={onLeadSimulated} />);

  const btnInteresado = screen.getByRole("button", {
    name: "Simular Lead Interesado",
  });
  const btnSpam = screen.getByRole("button", { name: "Simular Lead Spam" });

  // Inicialmente habilitados
  expect(btnInteresado).not.toBeDisabled();
  expect(btnSpam).not.toBeDisabled();

  // Click para iniciar carga
  fireEvent.click(btnInteresado);

  // Ambos deben deshabilitarse y aparecer "Simulando..."
  await waitFor(() => {
    expect(btnInteresado).toBeDisabled();
    expect(btnSpam).toBeDisabled();
    expect(screen.getByText("Simulando...")).toBeInTheDocument();
  });
});

// R10, R21: callback onLeadSimulated invocado con fixture al simular lead interesado
test("calls_onLeadSimulated_with_result_when_simulating_interested_lead", async () => {
  const onLeadSimulated = jest.fn();

  global.fetch = jest.fn(() =>
    makeFetchResponse({
      lead: INTERESTED_LEAD_FIXTURE,
      analysis: INTERESTED_ANALYSIS_FIXTURE,
    })
  ) as jest.Mock;

  render(<SimulatorPanel onLeadSimulated={onLeadSimulated} />);

  fireEvent.click(
    screen.getByRole("button", { name: "Simular Lead Interesado" })
  );

  await waitFor(() => {
    expect(onLeadSimulated).toHaveBeenCalledTimes(1);
  });

  const callArg = onLeadSimulated.mock.calls[0][0] as {
    lead: Lead;
    analysis: LeadAnalysis;
  };
  expect(callArg.lead.id).toBe("sim-1234567890");
  expect(callArg.analysis.is_spam).toBe(false);
  expect(callArg.analysis.trust_score).toBe(88);

  // Verificar que fetch fue llamado con el body correcto
  expect(global.fetch).toHaveBeenCalledWith(
    "/api/leads/simulate",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ type: "interested" }),
    })
  );
});

// R11, R21: callback onLeadSimulated invocado con fixture al simular lead spam
test("calls_onLeadSimulated_with_result_when_simulating_spam_lead", async () => {
  const onLeadSimulated = jest.fn();

  global.fetch = jest.fn(() =>
    makeFetchResponse({
      lead: SPAM_LEAD_FIXTURE,
      analysis: SPAM_ANALYSIS_FIXTURE,
    })
  ) as jest.Mock;

  render(<SimulatorPanel onLeadSimulated={onLeadSimulated} />);

  fireEvent.click(screen.getByRole("button", { name: "Simular Lead Spam" }));

  await waitFor(() => {
    expect(onLeadSimulated).toHaveBeenCalledTimes(1);
  });

  const callArg = onLeadSimulated.mock.calls[0][0] as {
    lead: Lead;
    analysis: LeadAnalysis;
  };
  expect(callArg.lead.id).toBe("sim-9999999999");
  expect(callArg.analysis.is_spam).toBe(true);
  expect(callArg.analysis.trust_score).toBe(5);

  // Verificar que fetch fue llamado con el body correcto
  expect(global.fetch).toHaveBeenCalledWith(
    "/api/leads/simulate",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ type: "spam" }),
    })
  );
});

// R12, R21: mensaje de error visible cuando fetch retorna status 500
test("shows_error_message_when_fetch_returns_error_status", async () => {
  const onLeadSimulated = jest.fn();

  global.fetch = jest.fn(() =>
    makeFetchResponse({ error: "Simulation failed" }, 500)
  ) as jest.Mock;

  render(<SimulatorPanel onLeadSimulated={onLeadSimulated} />);

  fireEvent.click(
    screen.getByRole("button", { name: "Simular Lead Interesado" })
  );

  await waitFor(() => {
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  expect(screen.getByRole("alert").textContent).toContain("Simulation failed");
  expect(onLeadSimulated).not.toHaveBeenCalled();
});

// R12, R21: botones restaurados al estado habilitado tras error
test("re_enables_buttons_after_fetch_error", async () => {
  const onLeadSimulated = jest.fn();

  global.fetch = jest.fn(() =>
    makeFetchResponse({ error: "Simulation failed" }, 500)
  ) as jest.Mock;

  render(<SimulatorPanel onLeadSimulated={onLeadSimulated} />);

  fireEvent.click(
    screen.getByRole("button", { name: "Simular Lead Interesado" })
  );

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: "Simular Lead Interesado" })
    ).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Simular Lead Spam" })
    ).not.toBeDisabled();
  });
});
