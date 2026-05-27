import React, { useState, useEffect } from "react";
import type { LeadWithScore } from "../types/feed";

interface LeadCardProps {
  item: LeadWithScore;
  onSelect?: (leadId: string) => void;  // R19
  isSelected?: boolean;                 // R19 — para highlight visual
  isNew?: boolean;                      // R18 — activa animate-enter durante 600ms
}

function getTrustScoreBadgeClass(score: number): string {
  if (score > 75) return "bg-green-500 text-white";
  if (score >= 40) return "bg-yellow-400 text-gray-900";
  return "bg-red-500 text-white";
}

function getUrgencyTagClass(score: number): string {
  if (score > 75) return "bg-green-700 text-green-100";
  if (score >= 40) return "bg-yellow-600 text-yellow-100";
  return "bg-red-700 text-red-100";
}

export default function LeadCard({ item, onSelect, isSelected, isNew = false }: LeadCardProps) {
  const { lead, trust_score, urgency } = item;
  const badgeClass = getTrustScoreBadgeClass(trust_score);
  const urgencyTagClass = getUrgencyTagClass(trust_score);

  // R18: aplicar animate-enter durante los primeros 600ms cuando isNew es true
  const [showEnter, setShowEnter] = useState(isNew);

  useEffect(() => {
    if (!isNew) return;
    setShowEnter(true);
    const timer = setTimeout(() => setShowEnter(false), 600);
    return () => clearTimeout(timer);
  }, [isNew]);

  return (
    <li
      className={`bg-gray-800 rounded-lg p-4 flex items-center justify-between gap-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer${isSelected ? " ring-2 ring-blue-500" : ""}${showEnter ? " animate-enter" : ""}`}
      onClick={() => onSelect?.(lead.id)}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{lead.id}</p>
        <p className="text-xs text-gray-400 mt-1 truncate">
          {lead.zona}
          {lead.tipo_propiedad ? ` · ${lead.tipo_propiedad}` : ""}
          {lead.presupuesto_usd > 0 ? ` · $${lead.presupuesto_usd.toLocaleString()} USD` : ""}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Trust Score badge */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${badgeClass}`}
          aria-label={`Trust Score ${trust_score}`}
        >
          {trust_score}
        </div>

        {/* Urgency tag */}
        <span
          className={`rounded px-2 py-0.5 text-xs font-semibold ${urgencyTagClass}`}
        >
          {urgency}
        </span>
      </div>
    </li>
  );
}
