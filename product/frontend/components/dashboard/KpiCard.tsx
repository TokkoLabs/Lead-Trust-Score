import React from "react";

/**
 * KpiCard — tarjeta KPI del Dashboard.
 *
 * Estructura del HTML target (líneas ~675-700):
 *   - Stripe superior coloreada según accent.
 *   - Label uppercase 10px gris-500.
 *   - Value 28px bold; cuando el accent NO es teal/neutral, también
 *     colorea el value para enfatizar (HTML target lo hace para
 *     green y red).
 *   - Delta opcional: flecha + texto + color (green up / red down).
 *
 * Acceptance feature 11 AC1: props {label, value, delta?, accentColor}
 * + stripe vertical (acá implementado como banda superior siguiendo
 * el HTML target, donde `.kpi-stripe` es horizontal top).
 */

export type KpiAccent = "teal" | "green" | "red" | "yellow";

export interface KpiDelta {
  /** Porcentaje o puntos delta (sin signo). */
  value: number;
  /** Dirección visual: up muestra ↑ verde, down muestra ↓ rojo. */
  direction: "up" | "down";
  /** Sufijo opcional ("% vs semana pasada", "pts esta semana", ...). */
  label?: string;
}

export interface KpiCardProps {
  label: string;
  value: number | string;
  delta?: KpiDelta;
  accentColor: KpiAccent;
}

const ACCENT_BG: Record<KpiAccent, string> = {
  teal: "bg-brand-secondary-500",
  green: "bg-feedback-green-500",
  red: "bg-brand-primary-500",
  yellow: "bg-feedback-yellow-500",
};

const ACCENT_VALUE_COLOR: Record<KpiAccent, string> = {
  // Teal mantiene el color neutral del HTML target (la card "Total leads"
  // no tiñe el value), las demás sí.
  teal: "text-neutral-grey-800",
  green: "text-feedback-green-500",
  red: "text-brand-primary-500",
  yellow: "text-feedback-yellow-500",
};

export default function KpiCard({
  label,
  value,
  delta,
  accentColor,
}: KpiCardProps) {
  const deltaColor =
    delta?.direction === "up"
      ? "text-feedback-green-500"
      : "text-brand-primary-500";
  const arrow = delta?.direction === "up" ? "↑" : "↓";

  return (
    <div
      role="group"
      aria-label={label}
      className="relative overflow-hidden bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low py-4 px-5"
    >
      <span
        aria-hidden="true"
        className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-card ${ACCENT_BG[accentColor]}`}
      />
      <div className="text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mb-[10px]">
        {label}
      </div>
      <div
        className={`text-title-lg font-bold leading-tight ${ACCENT_VALUE_COLOR[accentColor]}`}
      >
        {value}
      </div>
      {delta && (
        <div
          className={`text-[11px] mt-[6px] flex items-center gap-1 font-semibold ${deltaColor}`}
        >
          <span aria-hidden="true">{arrow}</span>
          <span>
            {delta.value}
            {delta.label ? ` ${delta.label}` : ""}
          </span>
        </div>
      )}
    </div>
  );
}
