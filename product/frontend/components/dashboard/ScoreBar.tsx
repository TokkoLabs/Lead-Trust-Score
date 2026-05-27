import React from "react";

/**
 * ScoreBar — barra horizontal reusable con color semántico según el valor.
 *
 * Reglas de color (feature 12 AC1):
 *   - value >= 75  → verde   (bg-feedback-green-500)
 *   - 50-74        → amarillo (bg-feedback-yellow-500)
 *   - < 50         → rojo    (bg-brand-primary-500)
 *
 * Replica el patrón `.score-bar / .score-fill` del HTML target
 * (ui-ux/lead-trust-dashboard-tokko (3).html, líneas 444-446).
 */

export type ScoreBarVariant = "thin" | "normal";

export interface ScoreBarProps {
  /** Valor 0-100. Se clampa al renderizar. */
  value: number;
  /** 'thin' (h-1, default) o 'normal' (h-1.5). */
  variant?: ScoreBarVariant;
  /** Muestra el valor numérico a la derecha (default true). */
  showLabel?: boolean;
  /** Etiqueta accesible; por defecto "Score {value}". */
  ariaLabel?: string;
}

export function scoreColorClass(value: number): {
  bg: string;
  text: string;
  /** Token semántico usado por tests para identificar el rango. */
  range: "high" | "mid" | "low";
} {
  if (value >= 75) {
    return {
      bg: "bg-feedback-green-500",
      text: "text-feedback-green-500",
      range: "high",
    };
  }
  if (value >= 50) {
    return {
      bg: "bg-feedback-yellow-500",
      text: "text-feedback-yellow-500",
      range: "mid",
    };
  }
  return {
    bg: "bg-brand-primary-500",
    text: "text-brand-primary-500",
    range: "low",
  };
}

export default function ScoreBar({
  value,
  variant = "thin",
  showLabel = true,
  ariaLabel,
}: ScoreBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const { bg, text, range } = scoreColorClass(clamped);
  const trackHeight = variant === "thin" ? "h-1" : "h-1.5";

  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={ariaLabel ?? `Score ${clamped}`}
      data-score-range={range}
    >
      <div
        className={`flex-1 ${trackHeight} rounded-full bg-neutral-grey-100 overflow-hidden`}
      >
        <div
          className={`h-full rounded-full ${bg}`}
          style={{ width: `${clamped}%` }}
          data-testid="score-fill"
        />
      </div>
      {showLabel && (
        <span
          className={`text-[11px] font-semibold min-w-[24px] text-right ${text}`}
        >
          {clamped}
        </span>
      )}
    </div>
  );
}
