import React from "react";

/**
 * ProcessedView — placeholder Tokko (feature 16).
 *
 * Renderiza una card centrada con:
 *  - icono ilustrativo (emoji 🚧, aria-hidden)
 *  - heading nivel 2 "Vista en construcción"
 *  - subtexto descriptivo
 *  - CTA pill secundario "Volver al dashboard" que dispara onBackToDashboard
 *
 * El callback `onBackToDashboard` en pages/index.tsx mapea a
 * `setActiveView('dashboard')`, por lo que se cumple AC1 (cambio de
 * activeView a 'dashboard') sin modificar la firma usada por el orquestador.
 *
 * Cubre: AC1, AC2 del feature 16.
 */
export interface ProcessedViewProps {
  onBackToDashboard?: () => void;
}

export default function ProcessedView({
  onBackToDashboard,
}: ProcessedViewProps) {
  return (
    <div
      data-testid="processed-view"
      className="flex h-full w-full items-center justify-center px-6 py-8"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-card bg-surface-ground p-8 text-center shadow-low">
        <div
          aria-hidden="true"
          className="text-6xl leading-none"
        >
          🚧
        </div>
        <h2 className="text-title-md font-bold text-neutral-grey-800">
          Vista en construcción
        </h2>
        <p className="text-body-md text-neutral-grey-600">
          Esta sección estará disponible próximamente. Mientras tanto, podés
          gestionar tus leads desde el dashboard.
        </p>
        <button
          type="button"
          onClick={() => onBackToDashboard?.()}
          className="mt-2 inline-flex items-center gap-2 rounded-pill bg-brand-primary-500 px-5 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-brand-primary-700"
        >
          <span aria-hidden="true">←</span>
          Volver al dashboard
        </button>
      </div>
    </div>
  );
}
