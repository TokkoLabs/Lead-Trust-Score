/**
 * tests/frontend/test_simulation_integration.tsx
 * Tests de integracion para la logica de insercion de leads simulados.
 * Verifica: feed principal ordenado por trust_score, seccion spam,
 * y que la seccion spam no aparece cuando no hay spam.
 * Cubre: R14, R15, R16, R17, R22
 */

import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { Lead } from "../../product/types/lead";
import type { LeadAnalysis } from "../../product/types/lead_analysis";
import type { LeadWithScore, Urgency } from "../../product/frontend/types/feed";
import LeadsFeed from "../../product/frontend/components/LeadsFeed";
import LeadCard from "../../product/frontend/components/LeadCard";
import SimulatorPanel from "../../product/frontend/components/SimulatorPanel";

// Helper: mapea score a Urgency
function scoreToUrgency(score: number): Urgency {
  if (score >= 70) return "Alta";
  if (score >= 40) return "Media";
  return "Baja";
}

// Leads mock iniciales con scores distintos para verificar ordenamiento
const INITIAL_LEADS: LeadWithScore[] = [
  {
    lead: {
      id: "lead-01",
      mensaje: "Busco departamento en Palermo con urgencia",
      email: "a@gmail.com",
      telefono: "+54 9 11 1234-5678",
      zona: "Palermo",
      tipo_propiedad: "departamento",
      presupuesto_usd: 200000,
      property_ids: [],
    },
    trust_score: 70,
    urgency: "Alta",
  },
  {
    lead: {
      id: "lead-02",
      mensaje: "Quiero casa en Belgrano",
      email: "b@gmail.com",
      telefono: "+54 9 11 2222-3333",
      zona: "Belgrano",
      tipo_propiedad: "casa",
      presupuesto_usd: 150000,
      property_ids: [],
    },
    trust_score: 50,
    urgency: "Media",
  },
];

// Componente de integracion que replica la logica de pages/index.tsx
function IntegrationDashboard() {
  const [leads, setLeads] = useState<Lead[]>(
    INITIAL_LEADS.map((item) => item.lead)
  );
  const [aiScores, setAiScores] = useState<Record<string, number>>({
    "lead-01": 70,
    "lead-02": 50,
  });
  const [spamLeads, setSpamLeads] = useState<LeadWithScore[]>([]);
  const [newLeadId, setNewLeadId] = useState<string | null>(null);

  // Derivar scored con AI scores y ordenar desc
  const scored: LeadWithScore[] = leads.map((lead) => ({
    lead,
    trust_score: aiScores[lead.id] ?? 0,
    urgency: scoreToUrgency(aiScores[lead.id] ?? 0),
  }));
  const sortedLeads = [...scored].sort((a, b) => b.trust_score - a.trust_score);

  function handleLeadSimulated(result: {
    lead: Lead;
    analysis: LeadAnalysis;
  }) {
    const { lead, analysis } = result;
    setAiScores((prev) => ({ ...prev, [lead.id]: analysis.trust_score }));

    if (analysis.is_spam) {
      const spamItem: LeadWithScore = {
        lead,
        trust_score: analysis.trust_score,
        urgency: scoreToUrgency(analysis.trust_score),
      };
      setSpamLeads((prev) => [spamItem, ...prev]);
    } else {
      setLeads((prev) => [lead, ...prev]);
    }
    setNewLeadId(lead.id);
    setTimeout(() => setNewLeadId(null), 700);
  }

  return (
    <div>
      <SimulatorPanel onLeadSimulated={handleLeadSimulated} />

      {/* Feed principal */}
      <section aria-label="feed-principal">
        <LeadsFeed items={sortedLeads} newLeadId={newLeadId} />
      </section>

      {/* Seccion spam — visible solo cuando hay elementos */}
      {spamLeads.length > 0 && (
        <section aria-label="spam-section">
          <h2>
            <span aria-hidden="true">⚠</span>
            Leads Spam Detectados ({spamLeads.length})
          </h2>
          <div>
            {spamLeads.map((item) => (
              <div
                key={item.lead.id}
                className="rounded-lg bg-red-950 border border-red-800"
              >
                <span className="sr-only">Lead spam:</span>
                <ul>
                  <LeadCard item={item} isNew={item.lead.id === newLeadId} />
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Fixture lead no-spam con trust_score alto (se insertara al tope del feed)
const HIGH_SCORE_LEAD: Lead = {
  id: "sim-high",
  mensaje:
    "Hola! Busco departamento 3 ambientes Palermo presupuesto 220k urgente, " +
    "necesito mudarme antes de fin de mes porque vence contrato alquiler.",
  email: "high@gmail.com",
  telefono: "+54 9 11 9999-8888",
  zona: "Palermo",
  tipo_propiedad: "departamento",
  presupuesto_usd: 220000,
  property_ids: [],
};

const HIGH_SCORE_ANALYSIS: LeadAnalysis = {
  trust_score: 95,
  conversion_score: 90,
  urgency_score: 88,
  is_spam: false,
  detected_intent: "Compra urgente",
  suggested_action: "Contactar inmediatamente.",
  ai_summary: "Lead de maxima prioridad.",
  property_match_ids: ["prop-01"],
};

// Fixture lead spam
const SPAM_LEAD: Lead = {
  id: "sim-spam-001",
  mensaje: "comprar casa precio",
  email: "user@tempmail.org",
  telefono: "000-0000",
  zona: "",
  tipo_propiedad: null,
  presupuesto_usd: 0,
  property_ids: [],
};

const SPAM_ANALYSIS: LeadAnalysis = {
  trust_score: 3,
  conversion_score: 1,
  urgency_score: 0,
  is_spam: true,
  detected_intent: "Spam",
  suggested_action: "Descartar.",
  ai_summary: "Lead spam detectado.",
  property_match_ids: [],
};

beforeEach(() => {
  jest.clearAllMocks();
});

// R16, R22: Seccion spam no se renderiza cuando spamLeads esta vacio
test("spam_section_not_rendered_when_no_spam_leads", () => {
  render(<IntegrationDashboard />);

  // La seccion spam no debe existir
  expect(screen.queryByLabelText("spam-section")).not.toBeInTheDocument();
  expect(
    screen.queryByText(/Leads Spam Detectados/)
  ).not.toBeInTheDocument();
});

// R14, R22: Lead no-spam aparece en feed principal ordenado por trust_score
test("non_spam_lead_appears_in_main_feed_sorted_by_trust_score", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          lead: HIGH_SCORE_LEAD,
          analysis: HIGH_SCORE_ANALYSIS,
        }),
    })
  ) as jest.Mock;

  render(<IntegrationDashboard />);

  // Inicialmente 2 leads
  let listItems = screen.getAllByRole("listitem").filter(
    (el) => !el.closest('[aria-label="spam-section"]')
  );
  // Feed principal tiene 2 leads
  expect(
    screen.getByLabelText("feed-principal").querySelectorAll("li")
  ).toHaveLength(2);

  // Simular lead interesado
  fireEvent.click(
    screen.getByRole("button", { name: "Simular Lead Interesado" })
  );

  // Esperar insercion del nuevo lead
  await waitFor(() => {
    const feedItems = screen
      .getByLabelText("feed-principal")
      .querySelectorAll("li");
    expect(feedItems).toHaveLength(3);
  });

  // El nuevo lead con trust_score 95 debe estar primero
  const feedItems = screen
    .getByLabelText("feed-principal")
    .querySelectorAll("li");
  expect(feedItems[0]).toHaveTextContent("sim-high");

  // Lead spam no debe aparecer en el feed principal
  expect(
    screen.queryByLabelText("spam-section")
  ).not.toBeInTheDocument();
});

// R15, R22: Lead spam aparece en seccion "Leads Spam Detectados" y no en feed principal
test("spam_lead_appears_in_spam_section_not_in_main_feed", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          lead: SPAM_LEAD,
          analysis: SPAM_ANALYSIS,
        }),
    })
  ) as jest.Mock;

  render(<IntegrationDashboard />);

  // Feed principal empieza con 2 leads
  expect(
    screen.getByLabelText("feed-principal").querySelectorAll("li")
  ).toHaveLength(2);

  // Simular lead spam
  fireEvent.click(screen.getByRole("button", { name: "Simular Lead Spam" }));

  // Esperar aparicion de la seccion spam
  await waitFor(() => {
    expect(screen.getByLabelText("spam-section")).toBeInTheDocument();
  });

  // Feed principal sigue con 2 leads (no cambio)
  expect(
    screen.getByLabelText("feed-principal").querySelectorAll("li")
  ).toHaveLength(2);

  // El lead spam no debe estar en el feed principal
  const feedSection = screen.getByLabelText("feed-principal");
  expect(feedSection).not.toHaveTextContent("sim-spam-001");

  // La seccion spam debe mostrar el lead
  const spamSection = screen.getByLabelText("spam-section");
  expect(spamSection).toHaveTextContent("Leads Spam Detectados");
  expect(spamSection).toHaveTextContent("sim-spam-001");
});

// R17, R22: Contenedor del lead spam tiene clase bg-red-950
test("spam_lead_container_has_bg_red_950_class", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          lead: SPAM_LEAD,
          analysis: SPAM_ANALYSIS,
        }),
    })
  ) as jest.Mock;

  const { container } = render(<IntegrationDashboard />);

  fireEvent.click(screen.getByRole("button", { name: "Simular Lead Spam" }));

  await waitFor(() => {
    expect(screen.getByLabelText("spam-section")).toBeInTheDocument();
  });

  const spamContainer = container.querySelector(".bg-red-950");
  expect(spamContainer).not.toBeNull();
});
