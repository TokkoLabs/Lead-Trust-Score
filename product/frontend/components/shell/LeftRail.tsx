import React from "react";
import Icon, { IconName } from "./Icon";

interface RailItem {
  id: string;
  label: string;
  icon: IconName;
}

const ITEMS: RailItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "rail-dashboard" },
  { id: "queue", label: "Cola de leads", icon: "rail-queue" },
  { id: "processed", label: "Procesados", icon: "rail-check" },
  { id: "criteria", label: "Criterios", icon: "rail-sliders" },
  { id: "team", label: "Equipo", icon: "rail-users" },
  { id: "integrations", label: "Integraciones", icon: "rail-plug" },
  { id: "reports", label: "Reportes", icon: "rail-report" },
  { id: "settings", label: "Config", icon: "rail-gear" },
];

interface LeftRailProps {
  activeView: string;
  onSelectView?: (view: string) => void;
  onNewLead?: () => void;
  queueBadgeCount: number;
}

/**
 * LeftRail Tokko — nav vertical 80px, blanco, sombra-low.
 * Cubre R3, R7, R8, R9, R10, R11, R15.
 */
export default function LeftRail({
  activeView,
  onSelectView,
  onNewLead,
  queueBadgeCount,
}: LeftRailProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="w-20 bg-surface-ground shadow-low flex flex-col items-center gap-8 px-6 pt-[140px] pb-6 shrink-0 z-10 overflow-hidden"
    >
      <button
        type="button"
        aria-label="Nuevo lead"
        onClick={() => onNewLead?.()}
        className="w-8 h-8 rounded-chip bg-brand-primary-500 hover:opacity-90 flex items-center justify-center shrink-0 transition-opacity"
      >
        <Icon name="plus" className="w-3.5 h-3.5 text-white" />
      </button>

      <div className="flex flex-col gap-2 items-center w-full">
        {ITEMS.map((item) => {
          const active = item.id === activeView;
          const showBadge = item.id === "queue" && queueBadgeCount > 0;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              onClick={() => onSelectView?.(item.id)}
              className={
                "relative w-8 h-8 rounded-chip flex items-center justify-center transition-colors " +
                (active
                  ? "bg-brand-primary-500-15 text-brand-primary-500"
                  : "text-neutral-grey-500 hover:bg-neutral-grey-100 hover:text-neutral-grey-800")
              }
            >
              <Icon name={item.icon} className="w-4 h-4" />
              {showBadge && (
                <span className="absolute top-0 right-0 bg-brand-primary-500 text-white text-[9px] font-bold min-w-[14px] h-[14px] rounded-pill flex items-center justify-center px-[3px]">
                  {queueBadgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
