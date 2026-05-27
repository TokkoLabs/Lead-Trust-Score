// product/frontend/components/LeadDetailPanel.tsx
// Panel de detalle con Trust Score badge, barras de progreso, análisis IA,
// acción recomendada y propiedades coincidentes.
// Cubre: R1, R2, R3, R4, R5, R6, R7, R8, R9, R10

import React from "react";
import type { Lead } from "../../types/lead";
import type { LeadAnalysis } from "../../types/lead_analysis";
import type { Property } from "../../types/property";

interface LeadDetailPanelProps {
  lead: Lead;
  analysis: LeadAnalysis | null;
  isLoading: boolean;
  properties: Property[];
}

function getTrustScoreBadgeColor(score: number): string {
  if (score > 75) return "bg-green-500";
  if (score >= 40) return "bg-yellow-400";
  return "bg-red-500";
}

// --- Skeleton/shimmer (R2) ---
function Skeleton() {
  return (
    <div className="animate-pulse space-y-6" data-testid="skeleton">
      {/* Badge circular skeleton */}
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-gray-700" />
      </div>
      {/* Barras de scores skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-1/4" />
        <div className="h-2 bg-gray-700 rounded" />
        <div className="h-4 bg-gray-700 rounded w-1/4 mt-2" />
        <div className="h-2 bg-gray-700 rounded" />
      </div>
      {/* Párrafo de resumen skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-700 rounded" />
        <div className="h-4 bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-700 rounded w-4/6" />
      </div>
    </div>
  );
}

// --- Barra de progreso (R4, R5) ---
interface ProgressBarProps {
  label: string;
  score: number;
}

function ProgressBar({ label, score }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-300">
        <span>{label}</span>
        <span>{score}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function LeadDetailPanel({
  lead,
  analysis,
  isLoading,
  properties,
}: LeadDetailPanelProps) {
  // --- Header ---
  const header = (
    <div className="border-b border-gray-700 pb-4 mb-6">
      <p className="text-lg font-bold text-white">{lead.id}</p>
      <p className="text-sm text-gray-400 mt-1">
        {lead.zona}
        {lead.tipo_propiedad ? ` · ${lead.tipo_propiedad}` : ""}
      </p>
    </div>
  );

  // --- Skeleton state (R2) ---
  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 h-full overflow-y-auto">
        {header}
        <Skeleton />
      </div>
    );
  }

  // --- Empty state ---
  if (!analysis) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 h-full overflow-y-auto">
        {header}
        <p className="text-gray-500 text-sm">
          Selecciona un lead para ver el análisis.
        </p>
      </div>
    );
  }

  // --- Badge color (R3) ---
  const badgeColor = getTrustScoreBadgeColor(analysis.trust_score);

  // --- Matched properties (R9, R10) ---
  const matchedProperties = properties.filter((p) =>
    analysis.property_match_ids.includes(p.id)
  );

  // --- Copy action (R8) ---
  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.suggested_action);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full overflow-y-auto space-y-6">
      {header}

      {/* Trust Score Badge circular (R3) */}
      <div className="flex justify-center">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center ${badgeColor}`}
          aria-label={`Trust Score ${analysis.trust_score}`}
        >
          <span className="text-3xl font-bold text-white">
            {analysis.trust_score}
          </span>
        </div>
      </div>

      {/* Barras de progreso (R4, R5) */}
      <div className="space-y-4">
        <ProgressBar label="Conversión" score={analysis.conversion_score} />
        <ProgressBar label="Urgencia" score={analysis.urgency_score} />
      </div>

      {/* Análisis IA (R6) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Análisis IA
        </h3>
        <p className="text-sm text-gray-200 leading-relaxed">
          {analysis.ai_summary}
        </p>
      </div>

      {/* Acción Recomendada (R7, R8) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Acción Recomendada
        </h3>
        <div className="flex items-start gap-3">
          <p className="text-sm text-gray-200 flex-1">
            {analysis.suggested_action}
          </p>
          <button
            onClick={handleCopy}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors flex-shrink-0"
          >
            Copiar
          </button>
        </div>
      </div>

      {/* Propiedades Coincidentes (R9, R10) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Propiedades Coincidentes
        </h3>
        {matchedProperties.length === 0 ? (
          <p className="text-sm text-gray-500">Sin propiedades coincidentes</p>
        ) : (
          <ul className="space-y-2">
            {matchedProperties.map((prop) => (
              <li
                key={prop.id}
                className="bg-gray-800 rounded-lg p-3 border border-gray-700"
              >
                <p className="text-sm font-semibold text-white">
                  {prop.titulo}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {prop.zona} · {prop.tipo} · $
                  {prop.precio_usd.toLocaleString()} USD
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
