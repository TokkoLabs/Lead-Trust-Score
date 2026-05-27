import React from "react";

/**
 * FiltersTab — sub-tab "Filtros" de CriteriaCard (feature 13).
 *
 * 5 toggles accesibles role="switch" + aria-checked.
 *
 * Labels EXACTOS del brief (literales del HTML target,
 * ui-ux/lead-trust-dashboard-tokko (3).html, líneas 779-783):
 *  1. "Bloquear números inválidos"
 *  2. "Detectar spam"
 *  3. "Filtrar duplicados"
 *  4. "Ignorar leads sin mensaje"
 *  5. "Score mínimo global" (+ valor 0-100 default 15)
 *
 * El criterio 5 ("Score mínimo global") muestra adicionalmente el valor
 * numérico y un slider 0-100.
 */

export interface Filters {
  bloquearInvalidos: boolean;
  detectarSpam: boolean;
  filtrarDuplicados: boolean;
  ignorarSinMensaje: boolean;
  scoreMinGlobal: number;
}

export interface FiltersTabProps {
  filters: Filters;
  onToggle: (
    key: "bloquearInvalidos" | "detectarSpam" | "filtrarDuplicados" | "ignorarSinMensaje",
  ) => void;
  onScoreMinChange: (value: number) => void;
}

interface ToggleRowProps {
  label: string;
  sub: string;
  checked: boolean;
  onToggle: () => void;
}

function ToggleRow({ label, sub, checked, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-grey-100 last:border-b-0">
      <div className="min-w-0 pr-3">
        <div className="text-[12px] font-semibold text-neutral-grey-800">
          {label}
        </div>
        <div className="text-[11px] text-neutral-grey-500">{sub}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onToggle}
        data-toggle-label={label}
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

export default function FiltersTab({
  filters,
  onToggle,
  onScoreMinChange,
}: FiltersTabProps) {
  return (
    <div data-testid="filters-tab">
      <p className="text-[11px] text-neutral-grey-500 mb-3">
        Reglas aplicadas antes del scoring
      </p>

      <ToggleRow
        label="Bloquear números inválidos"
        sub="Formato de teléfono no válido"
        checked={filters.bloquearInvalidos}
        onToggle={() => onToggle("bloquearInvalidos")}
      />
      <ToggleRow
        label="Detectar spam"
        sub="Mensajes tipo bot o repetidos"
        checked={filters.detectarSpam}
        onToggle={() => onToggle("detectarSpam")}
      />
      <ToggleRow
        label="Filtrar duplicados"
        sub="Mismo contacto en 48hs"
        checked={filters.filtrarDuplicados}
        onToggle={() => onToggle("filtrarDuplicados")}
      />
      <ToggleRow
        label="Ignorar leads sin mensaje"
        sub="Lead sin texto de consulta"
        checked={filters.ignorarSinMensaje}
        onToggle={() => onToggle("ignorarSinMensaje")}
      />

      {/* Score mínimo global — fila distinta con label + valor + slider */}
      <div className="py-3">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="cs-score-min"
            className="text-[12px] font-semibold text-neutral-grey-800"
          >
            Score mínimo global
          </label>
          <span
            data-testid="filters-score-min-value"
            className="text-[12px] font-bold text-neutral-grey-800"
          >
            {filters.scoreMinGlobal}
          </span>
        </div>
        <input
          id="cs-score-min"
          type="range"
          min={0}
          max={100}
          value={filters.scoreMinGlobal}
          onChange={(e) => onScoreMinChange(Number(e.target.value))}
          aria-label="Score mínimo global"
          className="w-full accent-brand-primary-500"
        />
        <div className="text-[11px] text-neutral-grey-500 mt-1">
          Debajo de este valor se descarta
        </div>
      </div>
    </div>
  );
}
