import React from "react";

/**
 * FilterBar — chips de filtrado de la cola: Todos / Alta calidad / Media /
 * Baja calidad.
 *
 * HTML target líneas 815-821, clases `.filter-chip` y `.filter-chip.active`:
 *  - active: fondo brand-primary-500-15, borde + texto brand-primary-500.
 *  - inactive: borde neutral, texto grey-600.
 *  - hover (no active): bg neutral-grey-100 (state-hover).
 *
 * Cada chip es un `<button aria-pressed>` dentro de un `<div role="group">`.
 * Se evita `role="tablist"` para no colisionar con el tablist del PageHeader
 * (que el test_view_router legacy asume único en la vista).
 *
 * Feature 14 AC1, AC4.
 */

export type FilterKind = "all" | "high" | "mid" | "low";

export interface FilterBarProps {
  active: FilterKind;
  onChange: (kind: FilterKind) => void;
}

const OPTIONS: ReadonlyArray<{ kind: FilterKind; label: string }> = [
  { kind: "all", label: "Todos" },
  { kind: "high", label: "Alta calidad" },
  { kind: "mid", label: "Media" },
  { kind: "low", label: "Baja calidad" },
];

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar cola por calidad"
      data-testid="queue-filter-bar"
      className="flex gap-1.5 items-center"
    >
      {OPTIONS.map(({ kind, label }) => {
        const isActive = active === kind;
        return (
          <button
            key={kind}
            type="button"
            aria-pressed={isActive}
            data-filter-kind={kind}
            onClick={() => onChange(kind)}
            className={[
              "text-body-sm font-semibold px-3 py-1 rounded-pill border transition-colors duration-150 font-sans",
              isActive
                ? "bg-brand-primary-500-15 border-brand-primary-500 text-brand-primary-500"
                : "bg-transparent border-neutral-grey-200 text-neutral-grey-600 hover:bg-neutral-grey-100",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
      <span className="ml-auto text-[11px] text-neutral-grey-500 font-semibold">
        ↓ Por llegada
      </span>
    </div>
  );
}
