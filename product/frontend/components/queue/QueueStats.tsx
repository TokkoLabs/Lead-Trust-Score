import React from "react";

/**
 * QueueStats — 3 stat cards de la vista Cola: Pendientes / Alta calidad /
 * Baja calidad.
 *
 * Equivale a `.queue-stats` + `.qstat` del HTML target (líneas 493-496, 810-814):
 *  - Pendientes en color neutral-grey-800.
 *  - Alta calidad en feedback-green-500.
 *  - Baja calidad en brand-primary-500.
 *
 * role="status" en cada card para que screen-readers anuncien los counts
 * dinámicos cuando el filtro re-calcula.
 *
 * Feature 14 AC1, AC6.
 */

export interface QueueStatsProps {
  total: number;
  altaCalidad: number;
  bajaCalidad: number;
}

interface StatTileProps {
  label: string;
  value: number;
  valueClassName: string;
  testId: string;
}

function StatTile({ label, value, valueClassName, testId }: StatTileProps) {
  return (
    <div
      role="status"
      aria-label={`${label}: ${value}`}
      data-testid={testId}
      className="bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low py-3.5 px-4"
    >
      <div
        className={`text-title-md font-bold leading-tight tracking-tight ${valueClassName}`}
      >
        {value}
      </div>
      <div className="text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mt-1">
        {label}
      </div>
    </div>
  );
}

export default function QueueStats({
  total,
  altaCalidad,
  bajaCalidad,
}: QueueStatsProps) {
  return (
    <div
      className="grid grid-cols-3 gap-3"
      role="group"
      aria-label="Resumen de la cola"
    >
      <StatTile
        label="Pendientes"
        value={total}
        valueClassName="text-neutral-grey-800"
        testId="queue-stat-total"
      />
      <StatTile
        label="Alta calidad"
        value={altaCalidad}
        valueClassName="text-feedback-green-500"
        testId="queue-stat-alta"
      />
      <StatTile
        label="Baja calidad"
        value={bajaCalidad}
        valueClassName="text-brand-primary-500"
        testId="queue-stat-baja"
      />
    </div>
  );
}
