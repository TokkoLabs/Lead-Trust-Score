import React from "react";
import type { LeadWithScore } from "../types/feed";
import LeadCard from "./LeadCard";

interface LeadsFeedProps {
  items: LeadWithScore[]; // pre-ordenados externamente
  onSelectLead?: (leadId: string) => void;  // R20
  selectedLeadId?: string | null;           // R20 — para highlight
  newLeadId?: string | null;               // R18 — para animar entrada
}

export default function LeadsFeed({ items, onSelectLead, selectedLeadId, newLeadId }: LeadsFeedProps) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <LeadCard
          key={item.lead.id}
          item={item}
          onSelect={onSelectLead}
          isSelected={selectedLeadId === item.lead.id}
          isNew={item.lead.id === newLeadId}
        />
      ))}
    </ul>
  );
}
