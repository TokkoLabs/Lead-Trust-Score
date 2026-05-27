/**
 * tests/frontend/test_recent_leads_table.tsx
 *
 * Cubre acceptance feature 12:
 *  - AC1: render accesible (role='table') con 6 columnas + ScoreBar con color
 *    dinámico según rango (verde/amarillo/rojo).
 *  - AC3: click en fila dispara onSelectLead.
 *  - AC4: data-driven a partir de props (sin mock interno).
 *  - aria-selected refleja selectedLeadId.
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import RecentLeadsTable from "../../product/frontend/components/dashboard/RecentLeadsTable";
import type { Lead } from "../../product/types/lead";

function makeLead(overrides: Partial<Lead> & { id: string }): Lead {
  return {
    id: overrides.id,
    mensaje: overrides.mensaje ?? "Mensaje de prueba para el lead",
    telefono: overrides.telefono ?? "+54 11 0000-0000",
    email: overrides.email ?? `${overrides.id}@example.com`,
    zona: overrides.zona ?? "Palermo",
    tipo_propiedad:
      overrides.tipo_propiedad !== undefined
        ? overrides.tipo_propiedad
        : "departamento",
    presupuesto_usd: overrides.presupuesto_usd ?? 100000,
    property_ids: overrides.property_ids ?? ["prop-01"],
    source: overrides.source,
    estado: overrides.estado,
    created_at: overrides.created_at,
  };
}

const fiveLeads: Lead[] = [
  makeLead({
    id: "lead-01",
    source: "WhatsApp",
    estado: "Nuevo",
    created_at: "2026-05-27T10:00:00.000Z",
  }),
  makeLead({
    id: "lead-02",
    source: "Zonaprop",
    estado: "En revisión",
    created_at: "2026-05-26T10:00:00.000Z",
  }),
  makeLead({
    id: "lead-03",
    source: "Mail",
    estado: "Calificado",
    created_at: "2026-05-25T10:00:00.000Z",
  }),
  makeLead({
    id: "lead-04",
    source: "Argenprop",
    estado: "Descartado",
    created_at: "2026-05-24T10:00:00.000Z",
  }),
  makeLead({
    id: "lead-05",
    source: "Chat web",
    estado: "Nuevo",
    created_at: "2026-05-23T10:00:00.000Z",
  }),
];

// aiScores con valores en cada rango cromático:
//   lead-01: 82  → verde (≥75)
//   lead-02: 60  → amarillo (50-74)
//   lead-03: 30  → rojo (<50)
//   lead-04: 50  → amarillo (borde inferior 50)
//   lead-05: 75  → verde (borde inferior 75)
const aiScores: Record<string, number> = {
  "lead-01": 82,
  "lead-02": 60,
  "lead-03": 30,
  "lead-04": 50,
  "lead-05": 75,
};

describe("RecentLeadsTable", () => {
  it("AC1: renderiza role='table' con 6 columnas y 5 filas de datos", () => {
    render(
      <RecentLeadsTable
        leads={fiveLeads}
        aiScores={aiScores}
        onSelectLead={() => {}}
      />,
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Header con 6 columnas: literales exactos del HTML target.
    const headers = within(table).getAllByRole("columnheader");
    expect(headers).toHaveLength(6);
    expect(headers.map((h) => h.textContent)).toEqual([
      "Lead",
      "Trust",
      "Conversión",
      "Urgencia",
      "Fuente",
      "Estado",
    ]);

    // 5 rows clickeables (role='button' en los <tr>).
    const rowButtons = within(table).getAllByRole("button");
    expect(rowButtons).toHaveLength(5);
  });

  it("AC1: ScoreBar de un lead con trust=82 usa color verde (feedback-green)", () => {
    render(
      <RecentLeadsTable
        leads={[fiveLeads[0]]}
        aiScores={{ "lead-01": 82 }}
        onSelectLead={() => {}}
      />,
    );

    const trustBar = screen.getByLabelText("Trust 82");
    expect(trustBar.getAttribute("data-score-range")).toBe("high");
    const fill = trustBar.querySelector("[data-testid='score-fill']");
    expect(fill?.className).toContain("bg-feedback-green-500");
  });

  it("AC1: ScoreBar de un lead con trust=60 usa color amarillo (feedback-yellow)", () => {
    render(
      <RecentLeadsTable
        leads={[fiveLeads[1]]}
        aiScores={{ "lead-02": 60 }}
        onSelectLead={() => {}}
      />,
    );

    const trustBar = screen.getByLabelText("Trust 60");
    expect(trustBar.getAttribute("data-score-range")).toBe("mid");
    const fill = trustBar.querySelector("[data-testid='score-fill']");
    expect(fill?.className).toContain("bg-feedback-yellow-500");
  });

  it("AC1: ScoreBar de un lead con trust=30 usa color rojo (brand-primary)", () => {
    render(
      <RecentLeadsTable
        leads={[fiveLeads[2]]}
        aiScores={{ "lead-03": 30 }}
        onSelectLead={() => {}}
      />,
    );

    const trustBar = screen.getByLabelText("Trust 30");
    expect(trustBar.getAttribute("data-score-range")).toBe("low");
    const fill = trustBar.querySelector("[data-testid='score-fill']");
    expect(fill?.className).toContain("bg-brand-primary-500");
  });

  it("AC3: click en una row dispara onSelectLead con el id correcto", async () => {
    const onSelectLead = jest.fn();
    const user = userEvent.setup();
    render(
      <RecentLeadsTable
        leads={fiveLeads}
        aiScores={aiScores}
        onSelectLead={onSelectLead}
      />,
    );

    const rows = screen
      .getAllByRole("button")
      .filter((el) => el.tagName === "TR");
    // Buscar la fila correspondiente a lead-03 por data-lead-id.
    const target = rows.find(
      (row) => row.getAttribute("data-lead-id") === "lead-03",
    );
    expect(target).toBeDefined();
    await user.click(target as HTMLElement);

    expect(onSelectLead).toHaveBeenCalledTimes(1);
    expect(onSelectLead).toHaveBeenCalledWith("lead-03");
  });

  it("AC3: selectedLeadId expone aria-selected='true' en la fila correspondiente", () => {
    render(
      <RecentLeadsTable
        leads={fiveLeads}
        aiScores={aiScores}
        onSelectLead={() => {}}
        selectedLeadId="lead-03"
      />,
    );

    const rows = screen
      .getAllByRole("button")
      .filter((el) => el.tagName === "TR");
    const target = rows.find(
      (row) => row.getAttribute("data-lead-id") === "lead-03",
    );
    expect(target).toHaveAttribute("aria-selected", "true");

    // Otra fila distinta debe seguir aria-selected='false'.
    const other = rows.find(
      (row) => row.getAttribute("data-lead-id") === "lead-01",
    );
    expect(other).toHaveAttribute("aria-selected", "false");
  });

  it("AC3: Enter sobre una fila enfocada también dispara onSelectLead (accesibilidad teclado)", async () => {
    const onSelectLead = jest.fn();
    const user = userEvent.setup();
    render(
      <RecentLeadsTable
        leads={fiveLeads}
        aiScores={aiScores}
        onSelectLead={onSelectLead}
      />,
    );

    const rows = screen
      .getAllByRole("button")
      .filter((el) => el.tagName === "TR");
    const target = rows.find(
      (row) => row.getAttribute("data-lead-id") === "lead-02",
    ) as HTMLElement;
    target.focus();
    await user.keyboard("{Enter}");

    expect(onSelectLead).toHaveBeenCalledWith("lead-02");
  });
});
