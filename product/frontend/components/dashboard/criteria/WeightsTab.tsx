import React from "react";

/**
 * WeightsTab — sub-tab "Pesos" de CriteriaCard (feature 13).
 *
 * Renderiza:
 *  - 3 sliders 0-100 (Trust, Conversión, Urgencia) controlados desde el padre.
 *  - Barra de suma con color dinámico:
 *      suma === 100 → verde   (bg-feedback-green-500)   data-weight-status='ok'
 *      suma >   100 → rojo    (bg-brand-primary-500)    data-weight-status='over'
 *      suma <   100 → amarillo (bg-feedback-yellow-500) data-weight-status='under'
 *  - Slider "Umbral de alerta" 0-100.
 *
 * Inspirado en `#tab-weights` del HTML target
 * (ui-ux/lead-trust-dashboard-tokko (3).html, líneas 752-776 + función
 * updateWeights() líneas 966-981).
 */

export interface Weights {
  trust: number;
  conversion: number;
  urgency: number;
}

export interface WeightsTabProps {
  weights: Weights;
  umbralAlerta: number;
  onWeightChange: (key: keyof Weights, value: number) => void;
  onUmbralChange: (value: number) => void;
}

export type WeightStatus = "ok" | "over" | "under";

export function weightStatus(total: number): WeightStatus {
  if (total === 100) return "ok";
  if (total > 100) return "over";
  return "under";
}

const STATUS_CLASS: Record<WeightStatus, { fill: string; label: string }> = {
  ok: {
    fill: "bg-feedback-green-500",
    label: "text-feedback-green-500",
  },
  over: {
    fill: "bg-brand-primary-500",
    label: "text-brand-primary-500",
  },
  under: {
    fill: "bg-feedback-yellow-500",
    label: "text-feedback-yellow-500",
  },
};

interface SliderRowProps {
  id: string;
  label: string;
  emoji: string;
  value: number;
  valueColor: string;
  onChange: (value: number) => void;
}

function SliderRow({
  id,
  label,
  emoji,
  value,
  valueColor,
  onChange,
}: SliderRowProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[12px] font-semibold text-neutral-grey-800 flex items-center gap-1"
        >
          <span aria-hidden="true">{emoji}</span>
          {label}
        </label>
        <span className={`text-[12px] font-bold ${valueColor}`}>{value}%</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} (porcentaje)`}
        className="w-full accent-brand-primary-500"
      />
    </div>
  );
}

export default function WeightsTab({
  weights,
  umbralAlerta,
  onWeightChange,
  onUmbralChange,
}: WeightsTabProps) {
  const total = weights.trust + weights.conversion + weights.urgency;
  const status = weightStatus(total);
  const cls = STATUS_CLASS[status];
  const fillPercent = Math.min(total, 100);

  return (
    <div data-testid="weights-tab">
      <p className="text-[11px] text-neutral-grey-500 mb-3">
        Distribuí el 100% entre las tres dimensiones
      </p>

      <SliderRow
        id="cs-slider-trust"
        label="Trust Score"
        emoji="🔒"
        value={weights.trust}
        valueColor="text-brand-primary-500"
        onChange={(v) => onWeightChange("trust", v)}
      />
      <SliderRow
        id="cs-slider-conv"
        label="Conversión"
        emoji="🎯"
        value={weights.conversion}
        valueColor="text-feedback-green-500"
        onChange={(v) => onWeightChange("conversion", v)}
      />
      <SliderRow
        id="cs-slider-urg"
        label="Urgencia"
        emoji="⚡"
        value={weights.urgency}
        valueColor="text-feedback-yellow-500"
        onChange={(v) => onWeightChange("urgency", v)}
      />

      <div
        className="flex items-center gap-3 mt-2"
        data-testid="weights-total"
        data-weight-status={status}
      >
        <span className="text-[11px] text-neutral-grey-500">Total</span>
        <div
          className="flex-1 h-2 rounded-full bg-neutral-grey-100 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(total, 100)}
          aria-label={`Suma de pesos: ${total}%`}
        >
          <div
            data-testid="weights-fill"
            className={`h-full rounded-full transition-[width] duration-200 ${cls.fill}`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <span
          data-testid="weights-total-label"
          className={`text-[12px] font-bold min-w-[42px] text-right ${cls.label}`}
        >
          {total}%
        </span>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mb-2">
          Umbral de alerta
        </p>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="cs-slider-umbral"
            className="text-[12px] font-semibold text-neutral-grey-800"
          >
            Score mínimo para notificar
          </label>
          <span
            data-testid="weights-umbral-value"
            className="text-[12px] font-bold text-neutral-grey-800"
          >
            {umbralAlerta}
          </span>
        </div>
        <input
          id="cs-slider-umbral"
          type="range"
          min={0}
          max={100}
          value={umbralAlerta}
          onChange={(e) => onUmbralChange(Number(e.target.value))}
          aria-label="Umbral de alerta"
          className="w-full accent-brand-primary-500"
        />
      </div>
    </div>
  );
}
