import React, { useState, useEffect, useMemo, useCallback } from "react";
import type { Lead } from "../product/types/lead";
import type { Property } from "../product/types/property";
import type { LeadAnalysis } from "../product/types/lead_analysis";
import type { LeadWithScore, Urgency } from "../product/frontend/types/feed";
import { computeLocalScore } from "../product/frontend/lib/scoreUtils";
import { useLeadAnalysis } from "../product/frontend/hooks/useLeadAnalysis";
import AppShell from "../product/frontend/components/AppShell";
import PageHeader from "../product/frontend/components/PageHeader";
import Toast from "../product/frontend/components/common/Toast";
import DashboardView from "../product/frontend/views/DashboardView";
import QueueView from "../product/frontend/views/QueueView";
import ProcessedView from "../product/frontend/views/ProcessedView";
import CriteriaView from "../product/frontend/views/CriteriaView";
import leadsRaw from "../product/backend/data/leads_mock.json";
import propertiesRaw from "../product/backend/data/properties_mock.json";

// R12: enum de vistas soportadas (orquestación inline en este componente)
type View = "dashboard" | "queue" | "processed" | "criteria";

// R16: tabla pura con los literales EXACTOS del HTML target
// (ui-ux/lead-trust-dashboard-tokko (3).html, objeto pageHeaders líneas 928-933).
// Nota: el spec R16 dicta `tabs: true` para `queue` (mientras que el HTML
// fuente lo tiene como `false`). Seguimos el spec, que es la fuente de
// verdad consagrada para esta feature.
//
// Feature 18 (unified_random_lead_simulator): tanto `dashboard` como
// `queue` exponen el mismo primaryAction "+ Nuevo lead" que dispara la
// simulación. Para `processed` y `criteria` la acción primaria mantiene
// su semántica previa (Exportar / Guardar criterios).
const VIEW_HEADERS: Record<View, {
  title: string;
  subtitle: string;
  tabs: boolean;
  primary: string;
}> = {
  dashboard: {
    title: "Dashboard de leads",
    subtitle: "Mayo 2026 · Todas las fuentes",
    tabs: true,
    primary: "+ Nuevo lead",
  },
  queue: {
    title: "Cola de leads",
    subtitle: "Ordenados por llegada · Mayo 2026",
    tabs: true,
    primary: "+ Nuevo lead",
  },
  processed: {
    title: "Leads procesados",
    subtitle: "Historial completo",
    tabs: false,
    primary: "Exportar",
  },
  criteria: {
    title: "Criterios de scoring",
    subtitle: "Configurá cómo se califica cada lead entrante",
    tabs: false,
    primary: "Guardar criterios",
  },
};

const HEADER_TABS: readonly string[] = ["Hoy", "7 días", "30 días"];
const ROUTEABLE_VIEWS: View[] = ["dashboard", "queue", "processed", "criteria"];

// Helper: mapea trust_score a Urgency.
function scoreToUrgency(score: number): Urgency {
  if (score >= 70) return "Alta";
  if (score >= 40) return "Media";
  return "Baja";
}

/**
 * `Home` — orquestador delgado del shell. Mantiene el estado de leads,
 * scoring, selección y navegación (`activeView`, `tabState`) y delega
 * el render de la vista activa a los componentes de `product/frontend/views/`.
 *
 * Feature 18 (unified_random_lead_simulator):
 *   - `handleSimulateLead()` dispara `POST /api/leads/simulate` sin body.
 *   - El estado `simLoading` se propaga al `primaryAction` del PageHeader.
 *   - Los errores se exponen como `<Toast variant="error">` en el shell.
 */
export default function Home() {
  // Estado existente: leads mutables, scores IA, spam, animación.
  const [leads, setLeads] = useState<Lead[]>(leadsRaw as Lead[]);
  const properties = propertiesRaw as Property[];

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [aiScores, setAiScores] = useState<Record<string, number>>({});
  const [spamLeads, setSpamLeads] = useState<LeadWithScore[]>([]);
  const [newLeadId, setNewLeadId] = useState<string | null>(null);

  // Estado de la simulación unificada (feature 18).
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);

  // R12: estado de la vista activa (inline, sin contexto ni store global).
  const [activeView, setActiveView] = useState<View>("dashboard");

  // R18: tab activa persistida por vista. Inicializada con "Hoy" para las 4.
  const [tabState, setTabState] = useState<Record<View, string>>({
    dashboard: "Hoy",
    queue: "Hoy",
    processed: "Hoy",
    criteria: "Hoy",
  });

  // Análisis IA del lead seleccionado (el hook se queda en Home — ver design.md §6.2).
  const { analysis, isLoading } = useLeadAnalysis(selectedLeadId);

  // Cuando llega un análisis, registrar trust_score en aiScores.
  useEffect(() => {
    if (analysis && selectedLeadId) {
      setAiScores((prev) => ({
        ...prev,
        [selectedLeadId]: analysis.trust_score,
      }));
    }
  }, [analysis, selectedLeadId]);

  // Derivar feed ordenado por trust_score descendente.
  const sortedWithAiScores = useMemo(() => {
    const scored = leads.map((lead) => {
      const item = computeLocalScore(lead);
      if (aiScores[lead.id] !== undefined) {
        return { ...item, trust_score: aiScores[lead.id] };
      }
      return item;
    });
    return [...scored].sort((a, b) => b.trust_score - a.trust_score);
  }, [leads, aiScores]);

  // Lead completo para el panel de detalle.
  const selectedLead = selectedLeadId
    ? leads.find((l) => l.id === selectedLeadId) ?? null
    : null;

  // R21: derivar counts del estado actual.
  const analyzedCount = Object.keys(aiScores).length;
  const spamLeadIds = useMemo(
    () => new Set(spamLeads.map((s) => s.lead.id)),
    [spamLeads]
  );
  const queueBadgeCount = useMemo(
    () =>
      leads.filter(
        (l) => aiScores[l.id] === undefined && !spamLeadIds.has(l.id)
      ).length,
    [leads, aiScores, spamLeadIds]
  );

  // Handler común de simulación: actualiza estado a partir de la respuesta
  // del endpoint (lead insertado animado en feed o sección spam).
  const handleLeadSimulated = useCallback(
    (result: { lead: Lead; analysis: LeadAnalysis }) => {
      const { lead, analysis: leadAnalysis } = result;

      setAiScores((prev) => ({
        ...prev,
        [lead.id]: leadAnalysis.trust_score,
      }));

      if (leadAnalysis.is_spam) {
        const spamItem: LeadWithScore = {
          lead,
          trust_score: leadAnalysis.trust_score,
          urgency: scoreToUrgency(leadAnalysis.trust_score),
        };
        setSpamLeads((prev) => [spamItem, ...prev]);
        setNewLeadId(lead.id);
      } else {
        setLeads((prev) => [lead, ...prev]);
        setNewLeadId(lead.id);
      }

      setTimeout(() => setNewLeadId(null), 700);
    },
    [],
  );

  // Feature 18: trigger único del botón "+ Nuevo lead" del PageHeader.
  const handleSimulateLead = useCallback(async () => {
    if (simLoading) return;
    setSimLoading(true);
    setSimError(null);
    try {
      const res = await fetch("/api/leads/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errBody.error ?? `Error ${res.status}`);
      }
      const data = (await res.json()) as {
        lead: Lead;
        analysis: LeadAnalysis;
      };
      handleLeadSimulated(data);
    } catch (err) {
      setSimError(err instanceof Error ? err.message : "Error de red");
    } finally {
      setSimLoading(false);
    }
  }, [simLoading, handleLeadSimulated]);

  // R14, R15: handler de selección de vista desde el LeftRail.
  function handleSelectView(id: string) {
    if ((ROUTEABLE_VIEWS as string[]).includes(id)) {
      setActiveView(id as View);
    }
  }

  // R19: handlers por vista del botón primario del PageHeader.
  // Dashboard y Queue comparten el simulador unificado (feature 18).
  const primaryHandlers: Record<View, () => void> = {
    dashboard: () => {
      void handleSimulateLead();
    },
    queue: () => {
      void handleSimulateLead();
    },
    processed: () => {
      // TODO feature 16: exportar histórico.
    },
    criteria: () => {
      // TODO feature 15: guardar criterios.
    },
  };

  const header = VIEW_HEADERS[activeView];
  // El botón primario muestra loading sólo en las vistas que disparan la
  // simulación (dashboard / queue).
  const headerIsSimulating =
    (activeView === "dashboard" || activeView === "queue") && simLoading;

  return (
    <AppShell
      activeView={activeView}
      onSelectView={handleSelectView}
      onNewLead={() => void handleSimulateLead()}
      analyzedCount={analyzedCount}
      queueBadgeCount={queueBadgeCount}
    >
      <PageHeader
        title={header.title}
        subtitle={header.subtitle}
        tabs={header.tabs ? [...HEADER_TABS] : undefined}
        activeTab={header.tabs ? tabState[activeView] : undefined}
        onTabChange={(label) =>
          setTabState((prev) => ({ ...prev, [activeView]: label }))
        }
        primaryAction={{
          label: headerIsSimulating ? "Generando..." : header.primary,
          onClick: primaryHandlers[activeView],
          loading: headerIsSimulating,
          disabled: headerIsSimulating,
        }}
        breadcrumbLabel="Volver"
        onBreadcrumbClick={
          activeView === "dashboard"
            ? undefined
            : () => setActiveView("dashboard")
        }
      />

      {/* R13: render condicional — solo la vista activa se monta */}
      {activeView === "dashboard" && (
        <DashboardView
          sortedLeads={sortedWithAiScores}
          selectedLeadId={selectedLeadId}
          onSelectLead={setSelectedLeadId}
          selectedLead={selectedLead}
          analysis={analysis}
          isLoading={isLoading}
          properties={properties}
          spamLeads={spamLeads}
          newLeadId={newLeadId}
        />
      )}
      {activeView === "queue" && (
        <QueueView leads={leads} aiScores={aiScores} />
      )}
      {activeView === "processed" && (
        <ProcessedView
          onBackToDashboard={() => setActiveView("dashboard")}
        />
      )}
      {activeView === "criteria" && <CriteriaView />}

      {/* Feature 18: toast global de errores de simulación. */}
      {simError && (
        <div
          data-testid="sim-error-toast"
          className="fixed bottom-6 right-6 z-50"
        >
          <Toast
            message={simError}
            variant="error"
            onDismiss={() => setSimError(null)}
          />
        </div>
      )}
    </AppShell>
  );
}
