import React from "react";

/**
 * CriteriaSection — card wrapper para una sección de la vista Criterios
 * (feature 15). Reproduce `.card.card-pad` + `.crit-section-title` del HTML
 * target (líneas 838-855).
 *
 * Uso:
 *   <CriteriaSection title="Datos de contacto">
 *     <CriterionRow ... />
 *   </CriteriaSection>
 */

export interface CriteriaSectionProps {
  title: string;
  children: React.ReactNode;
  /** Slot opcional encima de los hijos para descripciones cortas. */
  intro?: React.ReactNode;
  /** data-testid opcional para localizar la sección en tests. */
  testId?: string;
}

export default function CriteriaSection({
  title,
  children,
  intro,
  testId,
}: CriteriaSectionProps) {
  return (
    <section
      data-testid={testId}
      aria-label={title}
      className="bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5"
    >
      <h3 className="text-[13px] font-semibold text-neutral-grey-800 mb-3">
        {title}
      </h3>
      {intro ? (
        <div className="text-[11px] text-neutral-grey-500 mb-3">{intro}</div>
      ) : null}
      <div>{children}</div>
    </section>
  );
}
