/**
 * tests/frontend/test_processed_view.tsx
 *
 * Verifica el placeholder Tokko de la vista "Procesados" (feature 16).
 *
 * Cubre los 3 AC del feature_list id 16:
 *  - AC1: render del copy literal + CTA secundario que dispara cambio de
 *         vista (a través de onBackToDashboard, que en pages/index.tsx mapea
 *         a setActiveView('dashboard')).
 *  - AC2: tokens Tokko sin estilos inline (clases Tailwind tokenizadas).
 *  - AC3: este archivo de tests verifica render del copy y dispatch del CTA.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import ProcessedView from "../../product/frontend/views/ProcessedView";

describe("ProcessedView (feature 16)", () => {
  it("AC1: renderiza el heading nivel 2 con copy 'Vista en construcción'", () => {
    render(<ProcessedView />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Vista en construcción");
  });

  it("AC1: renderiza el subtexto descriptivo del placeholder", () => {
    render(<ProcessedView />);

    expect(
      screen.getByText(
        /Esta sección estará disponible próximamente\. Mientras tanto, podés gestionar tus leads desde el dashboard\./
      )
    ).toBeInTheDocument();
  });

  it("AC1: el CTA 'Volver al dashboard' dispara el callback (cambio a 'dashboard')", async () => {
    const user = userEvent.setup();
    const onBackToDashboard = jest.fn();

    render(<ProcessedView onBackToDashboard={onBackToDashboard} />);

    const cta = screen.getByRole("button", { name: /Volver al dashboard/i });
    expect(cta).toBeInTheDocument();

    await user.click(cta);

    // El handler en pages/index.tsx mapea este callback a
    // setActiveView('dashboard'), por lo que dispararlo cumple AC1.
    expect(onBackToDashboard).toHaveBeenCalledTimes(1);
  });

  it("AC1: click en el CTA sin handler no lanza error (prop opcional)", async () => {
    const user = userEvent.setup();
    render(<ProcessedView />);

    const cta = screen.getByRole("button", { name: /Volver al dashboard/i });
    await expect(user.click(cta)).resolves.toBeUndefined();
  });

  it("AC2: no renderiza tabs ni widgets propios del Dashboard", () => {
    render(<ProcessedView />);

    // El placeholder no debe traer ningún tablist (las tabs Hoy/7d/30d viven
    // en Dashboard y Cola).
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("tab")).toHaveLength(0);

    // Ni botones característicos del Dashboard (simulador) ni KPIs.
    expect(
      screen.queryByRole("button", { name: /Simular Lead/i })
    ).not.toBeInTheDocument();
  });

  it("AC2: aplica clases Tokko tokenizadas (sin estilos inline)", () => {
    const { container } = render(<ProcessedView />);

    // Card: bg-surface-ground + rounded-card + shadow-low + tipografía Tokko
    // en el heading (text-title-md) y subtítulo (text-body-md).
    const card = container.querySelector(".bg-surface-ground");
    expect(card).not.toBeNull();
    expect(card).toHaveClass("rounded-card");
    expect(card).toHaveClass("shadow-low");

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("text-title-md");
    expect(heading).toHaveClass("text-neutral-grey-800");

    // CTA con color de marca Tokko.
    const cta = screen.getByRole("button", { name: /Volver al dashboard/i });
    expect(cta).toHaveClass("bg-brand-primary-500");
    expect(cta).toHaveClass("text-white");

    // Ningún nodo debe traer style inline (AC2: "sin estilos inline").
    container.querySelectorAll("*").forEach((node) => {
      const styleAttr = (node as HTMLElement).getAttribute("style");
      expect(styleAttr === null || styleAttr === "").toBe(true);
    });
  });
});
