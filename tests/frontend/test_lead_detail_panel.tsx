/**
 * tests/frontend/test_lead_detail_panel.tsx
 *
 * Feature 17 — tests del rediseno Tokko del LeadDetailPanel.
 *
 * AC1 (tokens Tokko, sin gray-*): aserciones sobre clases brand-/feedback-/
 *      neutral-grey-/surface-ground/shadow-low/rounded-card.
 * AC2: trust badge circular semantico (verde/amarillo/rojo), conversion +
 *      urgency bars (via ScoreBar role=progressbar), seccion "Análisis IA",
 *      copiar suggested_action, property cards filtradas por property_match_ids,
 *      skeleton con animate-pulse.
 * AC3: reason chips derivadas con deriveReasons.
 * AC4: footer con 3 botones (Crear contacto / Asignar / Marcar como spam) y
 *      callbacks que reciben lead.id.
 */

import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
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
  configurable: true,
});

// Fixtures
const baseLead: Lead = {
  id: "lead-test-01",
  mensaje:
    "Hola, estoy interesado en visitar el departamento de Palermo lo antes posible.",
  telefono: "+54 11 1234-5678",
  email: "juan.perez@example.com",
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

// ─────────────────────────────────────────────────────────────────────────────
// AC1 — Tokens Tokko (sin gray-*)
// ─────────────────────────────────────────────────────────────────────────────
test("lead_detail_panel_uses_tokko_surface_classes", () => {
  const analysis = makeAnalysis();

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />,
  );

  const panel = screen.getByTestId("lead-detail-panel");
  expect(panel).toHaveClass("bg-surface-ground");
  expect(panel).toHaveClass("rounded-card");
  expect(panel).toHaveClass("shadow-low");
});

test("lead_detail_panel_does_not_use_legacy_gray_classes", () => {
  const analysis = makeAnalysis();

  const { container } = render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />,
  );

  // Ningun elemento del panel debe arrastrar clases gray-* del dark theme.
  const elementsWithGray = container.querySelectorAll(
    '[class*="bg-gray-"], [class*="text-gray-"], [class*="border-gray-"]',
  );
  expect(elementsWithGray.length).toBe(0);
});

// ─────────────────────────────────────────────────────────────────────────────
// AC2 — Skeleton de loading
// ─────────────────────────────────────────────────────────────────────────────
test("skeleton_visible_when_isLoading_true", () => {
  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={null}
      isLoading={true}
      properties={baseProperties}
    />,
  );

  expect(screen.getByTestId("lead-detail-skeleton")).toBeInTheDocument();
});

test("skeleton_uses_animate_pulse_classes", () => {
  const { container } = render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={null}
      isLoading={true}
      properties={baseProperties}
    />,
  );

  const pulsing = container.querySelectorAll(".animate-pulse");
  expect(pulsing.length).toBeGreaterThan(0);
});

test("loading_panel_has_aria_busy_true", () => {
  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={null}
      isLoading={true}
      properties={baseProperties}
    />,
  );

  const panel = screen.getByTestId("lead-detail-panel");
  expect(panel).toHaveAttribute("aria-busy", "true");
});

// ─────────────────────────────────────────────────────────────────────────────
// AC2 — Trust badge circular con color semantico
// ─────────────────────────────────────────────────────────────────────────────
test("badge_green_when_trust_score_80", () => {
  const analysis = makeAnalysis({ trust_score: 80 });

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />,
  );

  const avatar = screen.getByTestId("lead-detail-avatar");
  expect(avatar).toHaveClass("bg-feedback-green-500");

  const trustBadge = screen.getByTestId("lead-detail-trust-badge");
  expect(trustBadge).toHaveClass("border-feedback-green-500");
  expect(trustBadge).toHaveTextContent("80");
});

test("badge_yellow_when_trust_score_55", () => {
  const analysis = makeAnalysis({ trust_score: 55 });

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />,
  );

  const avatar = screen.getByTestId("lead-detail-avatar");
  expect(avatar).toHaveClass("bg-feedback-yellow-500");

  const trustBadge = screen.getByTestId("lead-detail-trust-badge");
  expect(trustBadge).toHaveClass("border-feedback-yellow-500");
  expect(trustBadge).toHaveTextContent("55");
});

test("badge_red_when_trust_score_25", () => {
  const analysis = makeAnalysis({ trust_score: 25 });

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />,
  );

  const avatar = screen.getByTestId("lead-detail-avatar");
  expect(avatar).toHaveClass("bg-brand-primary-500");

  const trustBadge = screen.getByTestId("lead-detail-trust-badge");
  expect(trustBadge).toHaveClass("border-brand-primary-500");
  expect(trustBadge).toHaveTextContent("25");
});

// ─────────────────────────────────────────────────────────────────────────────
// AC2 — Conversion + Urgency bars (mediante role=progressbar de ScoreBar)
// ─────────────────────────────────────────────────────────────────────────────
test("conversion_and_urgency_bars_render", () => {
  const analysis = makeAnalysis({
    conversion_score: 65,
    urgency_score: 40,
  });

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />,
  );

  const conversionBar = screen.getByRole("progressbar", {
    name: /conversion 65/i,
  });
  expect(conversionBar).toHaveAttribute("aria-valuenow", "65");

  const urgencyBar = screen.getByRole("progressbar", {
    name: /urgencia 40/i,
  });
  expect(urgencyBar).toHaveAttribute("aria-valuenow", "40");
});

// ─────────────────────────────────────────────────────────────────────────────
// AC2 — AI Summary etiqueta "Análisis IA"
// ─────────────────────────────────────────────────────────────────────────────
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
    />,
  );

  expect(screen.getByText("Análisis IA")).toBeInTheDocument();
  expect(
    screen.getByText("Lead con alto interés en departamentos de Palermo"),
  ).toBeInTheDocument();
});

// ─────────────────────────────────────────────────────────────────────────────
// AC2 — Suggested action + boton copiar
// ─────────────────────────────────────────────────────────────────────────────
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
    />,
  );

  expect(screen.getByText("Acción Recomendada")).toBeInTheDocument();
  expect(screen.getByText("Llamar hoy a las 10am")).toBeInTheDocument();
});

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
    />,
  );

  const copyButton = screen.getByRole("button", {
    name: /copiar acción recomendada/i,
  });
  fireEvent.click(copyButton);

  expect(mockWriteText).toHaveBeenCalledWith("Llamar hoy a las 10am");
  expect(mockWriteText).toHaveBeenCalledTimes(1);
});

test("copy_button_has_aria_label", () => {
  const analysis = makeAnalysis();

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />,
  );

  const copyButton = screen.getByTestId("lead-detail-copy");
  expect(copyButton).toHaveAttribute("aria-label", "Copiar acción recomendada");
});

// ─────────────────────────────────────────────────────────────────────────────
// AC2 — property_match_ids filtra correctamente las propiedades
// ─────────────────────────────────────────────────────────────────────────────
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
    />,
  );

  expect(
    screen.getByText("Departamento luminoso en Palermo"),
  ).toBeInTheDocument();
  expect(screen.getByText("Casa en Belgrano")).toBeInTheDocument();
  // prop-03 no esta en property_match_ids → no debe aparecer.
  expect(screen.queryByText("PH duplex en Caballito")).not.toBeInTheDocument();
});

test("no_matches_message_when_property_match_ids_empty", () => {
  const analysis = makeAnalysis({ property_match_ids: [] });

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />,
  );

  expect(screen.getByText("Sin propiedades coincidentes")).toBeInTheDocument();
});

// ─────────────────────────────────────────────────────────────────────────────
// AC3 — Reason chips derivadas con leadReasons
// ─────────────────────────────────────────────────────────────────────────────
test("reason_chips_rendered_when_lead_has_signals", () => {
  // baseLead tiene "visitar" + "interesado" + email valido + telefono completo.
  const analysis = makeAnalysis();

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />,
  );

  const chipsContainer = screen.getByTestId("lead-detail-reasons");
  const chips = within(chipsContainer).getAllByRole("listitem");
  expect(chips.length).toBeGreaterThan(0);

  // Debe haber chips positivas (verde).
  const positives = chips.filter(
    (c) => c.getAttribute("data-reason-variant") === "positive",
  );
  expect(positives.length).toBeGreaterThan(0);

  // Algun chip debe usar la clase semantica positiva Tokko.
  const positiveSample = positives[0];
  expect(positiveSample.className).toMatch(/feedback-green-500/);
});

test("reason_chips_section_uses_tokko_classes", () => {
  const negativeLead: Lead = {
    ...baseLead,
    mensaje: "Hola test demo",
    email: "",
    telefono: "",
  };
  const analysis = makeAnalysis();

  render(
    <LeadDetailPanel
      lead={negativeLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />,
  );

  const chipsContainer = screen.getByTestId("lead-detail-reasons");
  const chips = within(chipsContainer).getAllByRole("listitem");
  const negatives = chips.filter(
    (c) => c.getAttribute("data-reason-variant") === "negative",
  );
  expect(negatives.length).toBeGreaterThan(0);
  expect(negatives[0].className).toMatch(/brand-primary-500/);
});

// ─────────────────────────────────────────────────────────────────────────────
// AC4 — Footer con 3 action buttons + callbacks
// ─────────────────────────────────────────────────────────────────────────────
test("footer_has_three_action_buttons", () => {
  const analysis = makeAnalysis();

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
      onCrearContacto={jest.fn()}
      onAsignar={jest.fn()}
      onMarcarSpam={jest.fn()}
    />,
  );

  const footer = screen.getByTestId("lead-detail-footer");
  expect(within(footer).getByText("Crear contacto")).toBeInTheDocument();
  expect(within(footer).getByText("Asignar")).toBeInTheDocument();
  expect(within(footer).getByText("Marcar como spam")).toBeInTheDocument();
});

test("crear_contacto_callback_fires_with_lead_id", () => {
  const onCrearContacto = jest.fn();
  const analysis = makeAnalysis();

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
      onCrearContacto={onCrearContacto}
    />,
  );

  fireEvent.click(screen.getByTestId("lead-detail-action-create"));

  expect(onCrearContacto).toHaveBeenCalledWith("lead-test-01");
  expect(onCrearContacto).toHaveBeenCalledTimes(1);
});

test("asignar_callback_fires_with_lead_id", () => {
  const onAsignar = jest.fn();
  const analysis = makeAnalysis();

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
      onAsignar={onAsignar}
    />,
  );

  fireEvent.click(screen.getByTestId("lead-detail-action-assign"));

  expect(onAsignar).toHaveBeenCalledWith("lead-test-01");
});

test("marcar_spam_callback_fires_with_lead_id", () => {
  const onMarcarSpam = jest.fn();
  const analysis = makeAnalysis();

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
      onMarcarSpam={onMarcarSpam}
    />,
  );

  fireEvent.click(screen.getByTestId("lead-detail-action-spam"));

  expect(onMarcarSpam).toHaveBeenCalledWith("lead-test-01");
});

test("footer_buttons_disabled_when_no_callbacks_passed", () => {
  const analysis = makeAnalysis();

  render(
    <LeadDetailPanel
      lead={baseLead}
      analysis={analysis}
      isLoading={false}
      properties={baseProperties}
    />,
  );

  expect(screen.getByTestId("lead-detail-action-create")).toBeDisabled();
  expect(screen.getByTestId("lead-detail-action-assign")).toBeDisabled();
  expect(screen.getByTestId("lead-detail-action-spam")).toBeDisabled();
});
