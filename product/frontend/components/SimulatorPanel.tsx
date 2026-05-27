/**
 * product/frontend/components/SimulatorPanel.tsx
 * Panel con dos botones de simulacion de leads.
 * Cubre: R8, R9, R10, R11, R12
 */

import React, { useState } from "react";
import type { Lead } from "../../types/lead";
import type { LeadAnalysis } from "../../types/lead_analysis";

// R8: Props del componente
interface SimulatorPanelProps {
  onLeadSimulated: (result: { lead: Lead; analysis: LeadAnalysis }) => void;
  disabled?: boolean;
}

// R8: Componente con exactamente dos botones etiquetados
export default function SimulatorPanel({
  onLeadSimulated,
  disabled = false,
}: SimulatorPanelProps) {
  // R9: Estado de carga y error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // R10, R11: Funcion generica de simulacion
  async function simulate(type: "interested" | "spam") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      // R12: Error HTTP distinto de 200
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(body.error ?? `Error ${res.status}`);
        return;
      }

      // R10, R11: Invocar callback con resultado
      const result = (await res.json()) as {
        lead: Lead;
        analysis: LeadAnalysis;
      };
      onLeadSimulated(result);
    } catch (err) {
      // R12: Error de red
      setError(err instanceof Error ? err.message : "Error de red");
    } finally {
      setLoading(false);
    }
  }

  const isDisabled = loading || disabled;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
        Simulador de Demo
      </h3>
      <div className="flex gap-3 items-center flex-wrap">
        {/* R8, R10: Boton "Simular Lead Interesado" */}
        <button
          type="button"
          onClick={() => void simulate("interested")}
          disabled={isDisabled}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Simular Lead Interesado
        </button>

        {/* R8, R11: Boton "Simular Lead Spam" */}
        <button
          type="button"
          onClick={() => void simulate("spam")}
          disabled={isDisabled}
          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Simular Lead Spam
        </button>

        {/* R9: Indicador de carga */}
        {loading && (
          <span className="text-sm text-gray-400">Simulando...</span>
        )}
      </div>

      {/* R12: Mensaje de error visible */}
      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          Error: {error}
        </p>
      )}
    </div>
  );
}
