import React, { useState, useEffect } from "react";
import type { Lead } from "../product/types/lead";
import type { Property } from "../product/types/property";
import type { LeadAnalysis } from "../product/types/lead_analysis";
import type { LeadWithScore, Urgency } from "../product/frontend/types/feed";
import { computeLocalScore } from "../product/frontend/lib/scoreUtils";
import { useLeadAnalysis } from "../product/frontend/hooks/useLeadAnalysis";
import DashboardLayout from "../product/frontend/components/DashboardLayout";
import LeadsFeed from "../product/frontend/components/LeadsFeed";
import LeadDetailPanel from "../product/frontend/components/LeadDetailPanel";
import SimulatorPanel from "../product/frontend/components/SimulatorPanel";
import LeadCard from "../product/frontend/components/LeadCard";
import leadsRaw from "../product/backend/data/leads_mock.json";
import propertiesRaw from "../product/backend/data/properties_mock.json";

// Helper: mapea trust_score a Urgency
function scoreToUrgency(score: number): Urgency {
  if (score >= 70) return "Alta";
  if (score >= 40) return "Media";
  return "Baja";
}

// R16: gestionar selectedLeadId, aiScores, spamLeads y newLeadId
export default function Home() {
  // Leads mutables (incluye mock iniciales + simulados no-spam)
  const [leads, setLeads] = useState<Lead[]>(leadsRaw as Lead[]);
  const properties = propertiesRaw as Property[];

  // R16: estado del lead seleccionado
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // R18: mapa leadId → trust_score real retornado por la IA
  const [aiScores, setAiScores] = useState<Record<string, number>>({});

  // R15: leads detectados como spam
  const [spamLeads, setSpamLeads] = useState<LeadWithScore[]>([]);

  // R18: id del ultimo lead simulado para animar entrada
  const [newLeadId, setNewLeadId] = useState<string | null>(null);

  // Obtener analisis IA para el lead seleccionado
  const { analysis, isLoading } = useLeadAnalysis(selectedLeadId);

  // R18: cuando llega un analisis exitoso, guardar el trust_score en aiScores
  useEffect(() => {
    if (analysis && selectedLeadId) {
      setAiScores((prev) => ({
        ...prev,
        [selectedLeadId]: analysis.trust_score,
      }));
    }
  }, [analysis, selectedLeadId]);

  // R14, R18: derivar scored con AI scores cuando esten disponibles, luego ordenar descendente
  const scored = leads.map((lead) => {
    const item = computeLocalScore(lead);
    if (aiScores[lead.id] !== undefined) {
      return { ...item, trust_score: aiScores[lead.id] };
    }
    return item;
  });
  const sortedWithAiScores = [...scored].sort(
    (a, b) => b.trust_score - a.trust_score
  );

  // Lead completo para pasar al panel de detalle
  const selectedLead = selectedLeadId
    ? leads.find((l) => l.id === selectedLeadId) ?? null
    : null;

  // R13, R14, R15: Handler invocado por SimulatorPanel al recibir respuesta exitosa
  function handleLeadSimulated(result: {
    lead: Lead;
    analysis: LeadAnalysis;
  }) {
    const { lead, analysis: leadAnalysis } = result;

    // R13: Registrar AI score
    setAiScores((prev) => ({
      ...prev,
      [lead.id]: leadAnalysis.trust_score,
    }));

    if (leadAnalysis.is_spam) {
      // R15: Lead spam va a seccion secundaria, no al feed principal
      const spamItem: LeadWithScore = {
        lead,
        trust_score: leadAnalysis.trust_score,
        urgency: scoreToUrgency(leadAnalysis.trust_score),
      };
      setSpamLeads((prev) => [spamItem, ...prev]);
      // Animar entrada en seccion spam
      setNewLeadId(lead.id);
    } else {
      // R13, R14: Lead legítimo se inserta en leads; el sort por trust_score lo ubica
      setLeads((prev) => [lead, ...prev]);
      setNewLeadId(lead.id);
    }

    // R18: Limpiar newLeadId a los 700ms (mayor que 600ms de la animacion)
    setTimeout(() => setNewLeadId(null), 700);
  }

  return (
    <DashboardLayout>
      {/* R16: layout de dos columnas */}
      <div className="flex gap-6 h-full">
        {/* Columna izquierda: simulador + feed + seccion spam */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          {/* T6: SimulatorPanel montado encima del feed */}
          <SimulatorPanel onLeadSimulated={handleLeadSimulated} />

          <h2 className="text-2xl font-bold text-white mb-6">Leads</h2>

          {/* Feed principal ordenado por trust_score */}
          <LeadsFeed
            items={sortedWithAiScores}
            onSelectLead={setSelectedLeadId}
            selectedLeadId={selectedLeadId}
            newLeadId={newLeadId}
          />

          {/* T7, R16, R17: Seccion spam — visible solo cuando hay elementos */}
          {spamLeads.length > 0 && (
            <section className="mt-6">
              <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span aria-hidden="true">⚠</span>
                Leads Spam Detectados ({spamLeads.length})
              </h2>
              <div className="space-y-2">
                {spamLeads.map((item) => (
                  <div
                    key={item.lead.id}
                    className={`rounded-lg bg-red-950 border border-red-800${
                      item.lead.id === newLeadId ? " animate-enter" : ""
                    }`}
                  >
                    <span className="sr-only">Lead spam:</span>
                    {/* R17: LeadCard con fondo red-950 */}
                    <ul>
                      <LeadCard
                        item={item}
                        isNew={item.lead.id === newLeadId}
                      />
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Columna derecha: detalle */}
        <div className="flex-1">
          {selectedLead ? (
            <LeadDetailPanel
              lead={selectedLead}
              analysis={analysis}
              isLoading={isLoading}
              properties={properties}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Selecciona un lead del feed para ver el analisis IA detallado.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
