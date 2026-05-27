import React from "react";
import Icon, { IconName } from "./Icon";

interface RightRailItem {
  id: string;
  label: string;
  icon: IconName;
}

const ITEMS: RightRailItem[] = [
  { id: "share", label: "Compartir", icon: "rr-share" },
  { id: "mark", label: "Marcar", icon: "rr-mark" },
  { id: "board", label: "Tablero", icon: "rr-board" },
  { id: "widget", label: "Añadir widget", icon: "rr-widget" },
];

/**
 * RightRail Tokko — aside 48px con 4 acciones rápidas.
 * Cubre R4, R15.
 */
export default function RightRail() {
  return (
    <aside
      aria-label="Acciones rápidas"
      className="w-12 bg-surface-ground shadow-left rounded-l-[10px] flex flex-col items-center gap-2 px-2 py-6 mt-6 shrink-0 z-10"
    >
      {ITEMS.map((it) => (
        <button
          key={it.id}
          type="button"
          aria-label={it.label}
          title={it.label}
          className="w-8 h-8 rounded-chip flex items-center justify-center text-neutral-grey-500 hover:bg-neutral-grey-100 hover:text-neutral-grey-800 transition-colors"
        >
          <Icon name={it.icon} className="w-4 h-4" />
        </button>
      ))}
    </aside>
  );
}
