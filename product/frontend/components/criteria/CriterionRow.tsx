import React from "react";
import {
  WEIGHT_OPTIONS,
  type CriterionConfig,
  type Weight,
} from "../../lib/criteriaDefaults";

/**
 * CriterionRow — fila de un criterio en la vista Criterios (feature 15).
 *
 * Layout (reproduce `.crit-row` del HTML target, líneas 840-861):
 *   [ label + descripción opcional ]   [ select peso ]   [ toggle on/off ]
 *
 * Detalles a11y:
 *  - El toggle es `role="switch"` + `aria-checked` (consistente con
 *    FiltersTab.tsx de la feature 13). El `aria-label` repite el label
 *    para que aparezca en `getByRole("switch", { name })`.
 *  - El `<select>` recibe un `aria-label` único derivado del label + sufijo
 *    "(peso)" para distinguirlo en tests.
 *
 * Estado: el componente es CONTROLADO. Cualquier cambio dispara
 * `onChange(nextConfig)` con un objeto nuevo (no muta el `config` recibido).
 */

export interface CriterionRowProps {
  label: string;
  description?: string;
  config: CriterionConfig;
  onChange: (next: CriterionConfig) => void;
}

export default function CriterionRow({
  label,
  description,
  config,
  onChange,
}: CriterionRowProps) {
  const checked = config.enabled;

  function handleToggle() {
    onChange({ ...config, enabled: !config.enabled });
  }

  function handleWeightChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ ...config, weight: e.target.value as Weight });
  }

  return (
    <div
      className="flex items-center justify-between gap-3 py-3 border-b border-neutral-grey-100 last:border-b-0"
      data-criterion-id={config.id}
    >
      <div className="min-w-0 flex-1 pr-2">
        <div className="text-[12px] font-semibold text-neutral-grey-800">
          {label}
        </div>
        {description ? (
          <div className="text-[11px] text-neutral-grey-500">{description}</div>
        ) : null}
      </div>

      <select
        aria-label={`${label} (peso)`}
        value={config.weight}
        onChange={handleWeightChange}
        disabled={!config.enabled}
        data-testid={`crit-weight-${config.id}`}
        className="text-[11px] font-semibold text-neutral-grey-800 bg-surface-low border border-neutral-grey-200 rounded-chip px-2 py-1 disabled:opacity-50"
      >
        {WEIGHT_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={handleToggle}
        data-testid={`crit-toggle-${config.id}`}
        className={`relative inline-flex h-5 w-9 items-center rounded-pill transition-colors ${
          checked ? "bg-brand-primary-500" : "bg-neutral-grey-300"
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-low transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
