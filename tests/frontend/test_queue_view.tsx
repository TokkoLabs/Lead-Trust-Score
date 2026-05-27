/**
 * tests/frontend/test_queue_view.tsx
 *
 * Cubre acceptance feature 14 (queue_view):
 *  - AC6: stats cards reflejan los counts reales.
 *  - AC4: filtro 'Alta calidad' deja sólo leads con score ≥75.
 *  - AC2: QueueCard muestra todas las secciones para un lead completo.
 *  - AC5: email/teléfono enmascarados por default + botón ojo revela.
 *  - AC1: lista renderiza con stats + filter bar + cards.
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import QueueView from "../../product/frontend/views/QueueView";
import QueueCard from "../../product/frontend/components/queue/QueueCard";
import type { Lead } from "../../product/types/lead";

function makeLead(overrides: Partial<Lead> & { id: string }): Lead {
  return {
    id: overrides.id,
    mensaje: overrides.mensaje ?? "Mensaje de prueba",
    telefono: overrides.telefono ?? "+54 11 4444-5555",
    email: overrides.email ?? `${overrides.id}@example.com`,
    zona: overrides.zona ?? "Palermo",
    tipo_propiedad:
      overrides.tipo_propiedad !== undefined
        ? overrides.tipo_propiedad
        : "departamento",
    presupuesto_usd: overrides.presupuesto_usd ?? 100000,
    property_ids: overrides.property_ids ?? [],
    source: overrides.source,
    estado: overrides.estado,
    created_at: overrides.created_at,
    agencia: overrides.agencia,
    direccion_propiedad: overrides.direccion_propiedad,
  };
}

// 5 leads con scores controlados vía aiScores:
//   l1 80 (alta), l2 90 (alta), l3 50 (media), l4 60 (media), l5 30 (baja)
const FIVE_LEADS: Lead[] = [
  makeLead({
    id: "l1",
    email: "juan@correo.com",
    created_at: "2026-05-27T10:00:00.000Z",
  }),
  makeLead({
    id: "l2",
    email: "ana@correo.com",
    created_at: "2026-05-26T10:00:00.000Z",
  }),
  makeLead({
    id: "l3",
    email: "lucia@correo.com",
    created_at: "2026-05-25T10:00:00.000Z",
  }),
  makeLead({
    id: "l4",
    email: "pedro@correo.com",
    created_at: "2026-05-24T10:00:00.000Z",
  }),
  makeLead({
    id: "l5",
    email: "raul@correo.com",
    created_at: "2026-05-23T10:00:00.000Z",
  }),
];

const AI_SCORES: Record<string, number> = {
  l1: 80,
  l2: 90,
  l3: 50,
  l4: 60,
  l5: 30,
};

describe("QueueView", () => {
  it("AC6: stats cards reflejan counts reales (total=5, alta=2, baja=1)", () => {
    render(<QueueView leads={FIVE_LEADS} aiScores={AI_SCORES} />);

    const total = screen.getByTestId("queue-stat-total");
    const alta = screen.getByTestId("queue-stat-alta");
    const baja = screen.getByTestId("queue-stat-baja");

    expect(within(total).getByText("5")).toBeInTheDocument();
    expect(within(alta).getByText("2")).toBeInTheDocument();
    expect(within(baja).getByText("1")).toBeInTheDocument();
  });

  it("AC1: render por defecto monta 5 QueueCard (filtro = Todos)", () => {
    render(<QueueView leads={FIVE_LEADS} aiScores={AI_SCORES} />);
    const cards = screen.getAllByTestId("queue-card");
    expect(cards).toHaveLength(5);
  });

  it("AC4: filtro 'Alta calidad' deja sólo los 2 leads con score >= 75", async () => {
    const user = userEvent.setup();
    render(<QueueView leads={FIVE_LEADS} aiScores={AI_SCORES} />);

    await user.click(screen.getByRole("button", { name: "Alta calidad" }));

    const cards = screen.getAllByTestId("queue-card");
    expect(cards).toHaveLength(2);
    const ids = cards.map((c) => c.getAttribute("data-lead-id"));
    expect(ids).toEqual(expect.arrayContaining(["l1", "l2"]));
  });

  it("AC4: filtro 'Todos' vuelve a mostrar los 5 leads después de filtrar", async () => {
    const user = userEvent.setup();
    render(<QueueView leads={FIVE_LEADS} aiScores={AI_SCORES} />);

    await user.click(screen.getByRole("button", { name: "Alta calidad" }));
    expect(screen.getAllByTestId("queue-card")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Todos" }));
    expect(screen.getAllByTestId("queue-card")).toHaveLength(5);
  });

  it("AC4: filtro 'Baja calidad' deja sólo el lead con score < 40", async () => {
    const user = userEvent.setup();
    render(<QueueView leads={FIVE_LEADS} aiScores={AI_SCORES} />);

    await user.click(screen.getByRole("button", { name: "Baja calidad" }));

    const cards = screen.getAllByTestId("queue-card");
    expect(cards).toHaveLength(1);
    expect(cards[0].getAttribute("data-lead-id")).toBe("l5");
  });
});

describe("QueueCard (integración con secciones completas)", () => {
  const fullLead = makeLead({
    id: "lead-completo",
    email: "juan.perez@correo.com",
    telefono: "+54 11 4444-7788",
    mensaje:
      "Hola, estoy muy interesado en agendar una visita lo antes posible para esta propiedad. Gracias!",
    direccion_propiedad: "Posadas 1342 Piso 4 Dpto B",
    agencia: "Inmobiliaria Demo",
    source: "Zonaprop",
    created_at: "2026-05-27T08:00:00.000Z",
  });

  it("AC2: lead completo renderiza avatar, score pill, reason chips, contacto enmascarado y botón ojo", () => {
    render(<QueueCard lead={fullLead} trust_score={87} />);

    // Avatar visible.
    expect(screen.getByTestId("queue-card-avatar")).toBeInTheDocument();
    // Score pill con valor.
    const pill = screen.getByTestId("queue-card-score-pill");
    expect(pill.textContent).toContain("Alta");
    expect(pill.textContent).toContain("87%");
    // Reason chips presentes (al menos 1).
    const reasons = screen.getByTestId("queue-card-reasons");
    expect(reasons.children.length).toBeGreaterThan(0);
    // Email enmascarado (no muestra crudo).
    const emailField = screen.getByTestId("queue-card-email");
    expect(emailField.textContent).not.toContain("juan.perez");
    expect(emailField.textContent).toMatch(/•••@•••\./);
    // Botón ojo presente.
    expect(screen.getByTestId("queue-card-reveal")).toBeInTheDocument();
    // Property row visible.
    expect(screen.getByTestId("queue-card-property")).toBeInTheDocument();
    // Message box visible.
    expect(screen.getByTestId("queue-card-message")).toBeInTheDocument();
    // Tags presentes.
    expect(screen.getByTestId("queue-card-tags")).toBeInTheDocument();
    // 3 botones de acción.
    expect(screen.getByTestId("queue-card-action-create")).toBeInTheDocument();
    expect(screen.getByTestId("queue-card-action-assign")).toBeInTheDocument();
    expect(screen.getByTestId("queue-card-action-delete")).toBeInTheDocument();
  });

  it("AC5: click en botón ojo revela el email y teléfono crudos", async () => {
    const user = userEvent.setup();
    render(<QueueCard lead={fullLead} trust_score={87} />);

    const emailBefore = screen.getByTestId("queue-card-email");
    const phoneBefore = screen.getByTestId("queue-card-phone");
    expect(emailBefore.textContent).not.toContain("juan.perez@correo.com");
    expect(phoneBefore.textContent).not.toContain("4444-7788");

    await user.click(screen.getByLabelText("Mostrar contacto"));

    const emailAfter = screen.getByTestId("queue-card-email");
    const phoneAfter = screen.getByTestId("queue-card-phone");
    expect(emailAfter.textContent).toContain("juan.perez@correo.com");
    expect(phoneAfter.textContent).toContain("4444-7788");
    // El aria-label cambia al estado opuesto.
    expect(screen.getByLabelText("Ocultar contacto")).toBeInTheDocument();
  });

  it("AC2: click en 'Crear contacto' dispara onCrearContacto con el leadId", async () => {
    const onCrear = jest.fn();
    const user = userEvent.setup();
    render(
      <QueueCard
        lead={fullLead}
        trust_score={87}
        onCrearContacto={onCrear}
      />,
    );

    await user.click(screen.getByTestId("queue-card-action-create"));
    expect(onCrear).toHaveBeenCalledTimes(1);
    expect(onCrear).toHaveBeenCalledWith("lead-completo");
  });
});
