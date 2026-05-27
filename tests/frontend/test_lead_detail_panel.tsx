/**
 * tests/frontend/test_lead_detail_panel.tsx
 * Tests for the LeadDetailPanel component.
 * Cubre: R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R21
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LeadDetailPanel from "../../product/frontend/components/LeadDetailPanel";
import type { Lead } from "../../product/types/lead";
import type { LeadAnalysis } from "../../product/types/lead_analysis";
import type { Property } from "../../product/types/property";

// Mock navigator.clipboard
const mockWriteText = jest.fn();
Object.defineProperty(navigator, "clipboard", {
  value: { writeText: mockWriteText },
  writable: true,
});

// Fixtures
const baseLead: Lead = {
  id: "lead-test-01",
  mensaje: "Mensaje de prueba para el panel de detalle",
  telefono: "+54 11 1234-5678",
  email: "test@example.com",
  zona: "Palermo",
  tipo_propiedad: "departamento",
  presupuesto_usd: 150000,
  property_ids: ["prop-01"],
};

function makeAnalysis(overrides: Partial<LeadAnalysis> = {}): LeadAnalysis {
  return {
    trust_score: 80,
    conversion_score: 70,
    urgency_score: 60,
    is_spam: false,
    detected_intent: "compra",
    suggested_action: "Llamar hoy a las 10am",
    ai_summary: "Lead con alto interés en departamentos de Palermo",
    property_match_ids: ["prop-01", "prop-02"],
    ...overrides,
  };
}

const baseProperties: Property[] = [
  {
    id: "prop-01",
    titulo: "Departamento luminoso en Palermo",
    precio_usd: 120000,
    zona: "Palermo",
    tipo: "departamento",
    dormitorios: 2,
    descripcion: "Descripción departamento Palermo",
  },
  {
    id: "prop-02",
    titulo: "Casa en Belgrano",
    precio_usd: 310000,
    zona: "Belgrano",
    tipo: "casa",
    dormitorios: 4,
    descripcion: "Descripción casa Belgrano",
  },
  {
    id: "prop-03",
    titulo: "PH duplex en Caballito",
    precio_usd: 175000,
    zona: "Caballito",
    tipo: "ph",
    dormitorios: 3,
    descripcion: "Descripción PH Caballito",
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

// --- (a) skeleton visible when isLoading=true --- R2
test("skeleton_visible_when_isLoading_true", () => {
  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={null}
      isLoading={true}
      properties={baseProperties}
    />
  );

  expect(screen.getByTestId("skeleton")).toBeInTheDocument();
});

// --- (b) badge green when trust_score=80 --- R3
test("badge_green_when_trust_score_80", () => {
  const analysis = makeAnalysis({ trust_score: 80 });

  const { container } = render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />
  );

  const badge = container.querySelector(".bg-green-500.rounded-full");
  expect(badge).not.toBeNull();
  expect(badge).toHaveTextContent("80");
});

// --- (c) badge yellow when trust_score=60 --- R3
test("badge_yellow_when_trust_score_60", () => {
  const analysis = makeAnalysis({ trust_score: 60 });

  const { container } = render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />
  );

  const badge = container.querySelector(".bg-yellow-400.rounded-full");
  expect(badge).not.toBeNull();
  expect(badge).toHaveTextContent("60");
});

// --- (d) badge red when trust_score=30 --- R3
test("badge_red_when_trust_score_30", () => {
  const analysis = makeAnalysis({ trust_score: 30 });

  const { container } = render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />
  );

  const badge = container.querySelector(".bg-red-500.rounded-full");
  expect(badge).not.toBeNull();
  expect(badge).toHaveTextContent("30");
});

// --- (e) ai_summary text visible with "Análisis IA" label --- R6
test("ai_summary_visible_with_label", () => {
  const analysis = makeAnalysis({
    ai_summary: "Lead con alto interés en departamentos de Palermo",
  });

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />
  );

  expect(screen.getByText("Análisis IA")).toBeInTheDocument();
  expect(
    screen.getByText("Lead con alto interés en departamentos de Palermo")
  ).toBeInTheDocument();
});

// --- (f) suggested_action visible in "Acción Recomendada" section --- R7
test("suggested_action_visible_in_accion_recomendada", () => {
  const analysis = makeAnalysis({
    suggested_action: "Llamar hoy a las 10am",
  });

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />
  );

  expect(screen.getByText("Acción Recomendada")).toBeInTheDocument();
  expect(screen.getByText("Llamar hoy a las 10am")).toBeInTheDocument();
});

// --- (g) property cards rendered when property_match_ids has matching IDs --- R9
test("property_cards_rendered_when_matches_exist", () => {
  const analysis = makeAnalysis({
    property_match_ids: ["prop-01", "prop-02"],
  });

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />
  );

  expect(
    screen.getByText("Departamento luminoso en Palermo")
  ).toBeInTheDocument();
  expect(screen.getByText("Casa en Belgrano")).toBeInTheDocument();
  // prop-03 is not in property_match_ids, should not appear
  expect(screen.queryByText("PH duplex en Caballito")).not.toBeInTheDocument();
});

// --- (h) "Sin propiedades coincidentes" when property_match_ids is empty --- R10
test("no_matches_message_when_property_match_ids_empty", () => {
  const analysis = makeAnalysis({ property_match_ids: [] });

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />
  );

  expect(
    screen.getByText("Sin propiedades coincidentes")
  ).toBeInTheDocument();
});

// --- (i) navigator.clipboard.writeText invoked with suggested_action on Copiar click --- R8
test("clipboard_writeText_invoked_on_copy_click", () => {
  const analysis = makeAnalysis({
    suggested_action: "Llamar hoy a las 10am",
  });

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />
  );

  const copyButton = screen.getByRole("button", { name: "Copiar" });
  fireEvent.click(copyButton);

  expect(mockWriteText).toHaveBeenCalledWith("Llamar hoy a las 10am");
  expect(mockWriteText).toHaveBeenCalledTimes(1);
});
