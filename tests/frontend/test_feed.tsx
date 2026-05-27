/**
 * tests/frontend/test_feed.tsx
 * React Testing Library tests for LeadsFeed and LeadCard components.
 * Covers: R20, R21, R22, R23, R5, R9, R10, R11, R12
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import LeadsFeed from "../../product/frontend/components/LeadsFeed";
import type { LeadWithScore } from "../../product/frontend/types/feed";
import type { Lead } from "../../product/types/lead";

// Helper to build a minimal Lead
function makeLead(overrides: Partial<Lead> & { id: string }): Lead {
  return {
    id: overrides.id,
    mensaje: overrides.mensaje ?? "Mensaje de prueba",
    telefono: overrides.telefono ?? "+54 11 0000-0000",
    email: overrides.email ?? "test@test.com",
    zona: overrides.zona ?? "Palermo",
    tipo_propiedad: overrides.tipo_propiedad !== undefined ? overrides.tipo_propiedad : "departamento",
    presupuesto_usd: overrides.presupuesto_usd ?? 100000,
    property_ids: overrides.property_ids ?? ["prop-01"],
  };
}

// Helper to build a LeadWithScore with explicit trust_score and urgency
function makeItem(
  id: string,
  trust_score: number,
  urgency: "Alta" | "Media" | "Baja"
): LeadWithScore {
  return {
    lead: makeLead({ id }),
    trust_score,
    urgency,
  };
}

// --- Test: renders leads in descending trust_score order --- R21
test("renders_leads_in_descending_trust_score_order", () => {
  const items: LeadWithScore[] = [
    makeItem("lead-high", 90, "Alta"),
    makeItem("lead-mid", 50, "Media"),
    makeItem("lead-low", 20, "Baja"),
  ];

  render(<LeadsFeed items={items} />);

  const listItems = screen.getAllByRole("listitem");
  expect(listItems).toHaveLength(3);

  // The first item should contain "lead-high" (trust_score 90)
  expect(within(listItems[0]).getByText("lead-high")).toBeInTheDocument();
  // The second item should contain "lead-mid" (trust_score 50)
  expect(within(listItems[1]).getByText("lead-mid")).toBeInTheDocument();
  // The third item should contain "lead-low" (trust_score 20)
  expect(within(listItems[2]).getByText("lead-low")).toBeInTheDocument();
});

// --- Test: badge color green for trust_score > 75 --- R22, R6, R9
test("badge_color_green_for_high_score", () => {
  const items: LeadWithScore[] = [makeItem("lead-green", 80, "Alta")];

  const { container } = render(<LeadsFeed items={items} />);

  // The badge should have bg-green-500
  const badge = container.querySelector(".bg-green-500");
  expect(badge).not.toBeNull();
  expect(badge).toHaveTextContent("80");
});

// --- Test: badge color yellow for trust_score 40-75 --- R7
test("badge_color_yellow_for_mid_score", () => {
  const items: LeadWithScore[] = [makeItem("lead-yellow", 55, "Media")];

  const { container } = render(<LeadsFeed items={items} />);

  const badge = container.querySelector(".bg-yellow-400");
  expect(badge).not.toBeNull();
  expect(badge).toHaveTextContent("55");
});

// --- Test: badge color red for trust_score < 40 --- R8, R22
test("badge_color_red_for_low_score", () => {
  const items: LeadWithScore[] = [makeItem("lead-red", 30, "Baja")];

  const { container } = render(<LeadsFeed items={items} />);

  const badge = container.querySelector(".bg-red-500");
  expect(badge).not.toBeNull();
  expect(badge).toHaveTextContent("30");
});

// --- Test: urgency tag "Alta" visible --- R10, R23
test("urgency_tag_alta_visible", () => {
  const items: LeadWithScore[] = [makeItem("lead-alta", 80, "Alta")];

  render(<LeadsFeed items={items} />);

  expect(screen.getByText("Alta")).toBeInTheDocument();
});

// --- Test: urgency tag "Media" visible --- R11, R23
test("urgency_tag_media_visible", () => {
  const items: LeadWithScore[] = [makeItem("lead-media", 55, "Media")];

  render(<LeadsFeed items={items} />);

  expect(screen.getByText("Media")).toBeInTheDocument();
});

// --- Test: urgency tag "Baja" visible --- R12, R23
test("urgency_tag_baja_visible", () => {
  const items: LeadWithScore[] = [makeItem("lead-baja", 20, "Baja")];

  render(<LeadsFeed items={items} />);

  expect(screen.getByText("Baja")).toBeInTheDocument();
});

// --- Test: lead.id visible in list item --- R5, R20
test("renders_lead_id_visible", () => {
  const items: LeadWithScore[] = [makeItem("lead-visible-id", 60, "Media")];

  render(<LeadsFeed items={items} />);

  expect(screen.getByText("lead-visible-id")).toBeInTheDocument();
});
