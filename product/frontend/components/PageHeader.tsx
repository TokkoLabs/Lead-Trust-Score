import React, { useState } from "react";

/**
 * PageHeader Tokko — header de página con breadcrumb + título + subtítulo +
 * tabs + botón primario. Componente "tonto" controlado por props (la
 * lógica de qué vista está activa vive en `pages/index.tsx`).
 *
 * Cubre: R1, R2, R3, R4, R5, R6, R7.
 */

export interface PageHeaderTab {
  id: string;
  label: string;
}

export interface PageHeaderPrimaryAction {
  label: string;
  onClick?: () => void;
  /** Si true, el botón se renderiza disabled. */
  disabled?: boolean;
  /** Si true, muestra un spinner inline y bloquea el click. */
  loading?: boolean;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  tabs?: string[]; // labels exactos a renderizar
  defaultTab?: string; // label inicialmente activo (uncontrolled)
  activeTab?: string; // controlado (override de defaultTab)
  onTabChange?: (label: string) => void;
  primaryAction?: PageHeaderPrimaryAction;
  breadcrumbLabel?: string; // default "Volver"
  breadcrumbIcon?: React.ReactNode;
  onBreadcrumbClick?: () => void;
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PageHeader({
  title,
  subtitle,
  tabs,
  defaultTab,
  activeTab: activeTabProp,
  onTabChange,
  primaryAction,
  breadcrumbLabel = "Volver",
  breadcrumbIcon,
  onBreadcrumbClick,
}: PageHeaderProps) {
  // R4: estado interno cuando es uncontrolled
  const initialTab = defaultTab ?? (tabs && tabs.length > 0 ? tabs[0] : undefined);
  const [internalActiveTab, setInternalActiveTab] = useState<string | undefined>(
    initialTab
  );

  const currentTab = activeTabProp ?? internalActiveTab;

  function handleTabClick(label: string) {
    // Mantener el estado interno sincronizado (uncontrolled).
    if (activeTabProp === undefined) {
      setInternalActiveTab(label);
    }
    onTabChange?.(label);
  }

  const hasTabs = Array.isArray(tabs) && tabs.length > 0;

  return (
    <header
      aria-label="Encabezado de página"
      className="bg-surface-ground flex items-end justify-between px-6 pt-8 pb-6 border-b border-neutral-grey-200"
    >
      <div className="flex flex-col gap-2">
        {/* R3: breadcrumb solo si hay handler — caso contrario no se renderiza */}
        {onBreadcrumbClick && (
          <button
            type="button"
            onClick={onBreadcrumbClick}
            className="flex items-center gap-1 text-body-xs font-semibold text-neutral-grey-800 hover:text-neutral-grey-900 self-start"
          >
            {breadcrumbIcon ?? <ChevronLeftIcon />}
            {breadcrumbLabel}
          </button>
        )}

        {/* R1: <h1> con el texto exacto de title */}
        <h1 className="text-title-lg font-bold text-neutral-grey-900">{title}</h1>

        {/* R1: subtítulo solo si truthy */}
        {subtitle && (
          <p className="text-body-sm text-neutral-grey-600">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* R4, R7: tablist solo si hay tabs */}
        {hasTabs && (
          <div
            role="tablist"
            className="flex bg-neutral-grey-100 rounded-button p-0.5"
          >
            {tabs!.map((label) => {
              const selected = label === currentTab;
              return (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-label={label}
                  aria-selected={selected}
                  onClick={() => handleTabClick(label)}
                  className={
                    "px-3 h-7 rounded-button text-body-xs font-semibold transition-colors " +
                    (selected
                      ? "bg-surface-ground text-neutral-grey-900 shadow-low"
                      : "text-neutral-grey-600 hover:text-neutral-grey-800")
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* R5, R6: botón primario opcional. Soporta `disabled` y `loading`
            (feature 18 — unified_random_lead_simulator). */}
        {primaryAction && (
          <button
            type="button"
            aria-label={primaryAction.label}
            disabled={primaryAction.disabled || primaryAction.loading}
            aria-busy={primaryAction.loading ? "true" : undefined}
            onClick={() => {
              if (primaryAction.disabled || primaryAction.loading) return;
              primaryAction.onClick?.();
            }}
            className="inline-flex items-center gap-2 bg-brand-primary-500 text-white rounded-button px-4 h-9 font-semibold text-body-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {primaryAction.loading && (
              <span
                aria-hidden="true"
                data-testid="primary-action-spinner"
                className="inline-block w-3 h-3 rounded-pill border-2 border-white border-r-transparent animate-spin"
              />
            )}
            <span>{primaryAction.label}</span>
          </button>
        )}
      </div>
    </header>
  );
}
