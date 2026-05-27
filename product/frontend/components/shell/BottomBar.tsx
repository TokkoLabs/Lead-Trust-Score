import React from "react";
import Icon, { IconName } from "./Icon";

interface BottomBarProps {
  analyzedCount: number;
  onExport?: () => void;
  onFilter?: () => void;
  onSort?: () => void;
  onViewList?: () => void;
  onViewCards?: () => void;
}

const BB_BTN_CLASS =
  "w-8 h-8 rounded-button text-neutral-grey-600 hover:bg-neutral-grey-100 hover:text-neutral-grey-800 flex items-center justify-center transition-colors";

interface ViewButtonConfig {
  label: string;
  icon: IconName;
  handlerKey:
    | "onExport"
    | "onFilter"
    | "onSort"
    | "onViewList"
    | "onViewCards";
}

const VIEW_BUTTONS: ViewButtonConfig[] = [
  { label: "Exportar", icon: "bb-export", handlerKey: "onExport" },
  { label: "Filtrar", icon: "bb-filter", handlerKey: "onFilter" },
  { label: "Ordenar", icon: "bb-sort", handlerKey: "onSort" },
  { label: "Vista lista", icon: "bb-list", handlerKey: "onViewList" },
  { label: "Vista tarjetas", icon: "bb-grid", handlerKey: "onViewCards" },
];

/**
 * BottomBar Tokko — barra inferior con counter, 5 view buttons y live badge.
 * Cubre R5, R6, R12, R13, R15, R16.
 */
export default function BottomBar(props: BottomBarProps) {
  const {
    analyzedCount,
    onExport,
    onFilter,
    onSort,
    onViewList,
    onViewCards,
  } = props;

  const handlers: Record<ViewButtonConfig["handlerKey"], (() => void) | undefined> = {
    onExport,
    onFilter,
    onSort,
    onViewList,
    onViewCards,
  };

  return (
    <div
      aria-label="Barra inferior"
      className="bg-surface-ground shadow-top rounded-t-card h-[72px] flex items-center px-8 gap-6 shrink-0 z-[5]"
    >
      {/* Counter */}
      <div className="flex items-center gap-2">
        <span className="text-title-lg font-bold text-neutral-grey-800 leading-none">
          {analyzedCount}
        </span>
        <div className="flex flex-col">
          <span className="text-caption text-neutral-grey-600 leading-tight">
            leads
          </span>
          <span className="text-caption text-neutral-grey-600 leading-tight">
            analizados
          </span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="w-px h-8 bg-neutral-grey-200 shrink-0"
      />

      {/* View buttons */}
      <div className="flex items-center gap-0.5 flex-1">
        {VIEW_BUTTONS.map((b) => {
          const handler = handlers[b.handlerKey];
          return (
            <button
              key={b.handlerKey}
              type="button"
              aria-label={b.label}
              title={b.label}
              onClick={() => handler?.()}
              className={BB_BTN_CLASS}
            >
              <Icon name={b.icon} className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className="w-px h-8 bg-neutral-grey-200 shrink-0"
      />

      {/* Live badge */}
      <div
        role="status"
        className="bg-feedback-green-500-15 text-feedback-green-500 text-[11px] font-semibold px-2.5 py-[3px] rounded-pill flex items-center gap-1.5 ml-auto"
      >
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full bg-feedback-green-500 animate-pulseDot"
        />
        En vivo · Analizando leads
      </div>
    </div>
  );
}
