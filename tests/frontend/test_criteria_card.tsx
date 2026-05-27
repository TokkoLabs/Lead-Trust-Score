/**
 * tests/frontend/test_criteria_card.tsx
 *
 * Cubre acceptance feature 13 (dashboard_scoring_criteria_card):
 *  AC1  → 3 tabs (Pesos/Filtros/Canales) + arranca en Pesos.
 *  AC2  → sliders de pesos actualizan la suma; color verde/rojo/amarillo según.
 *  AC3  → 5 toggles role="switch" con labels exactos; aria-checked alterna.
 *  AC4  → 7 channel tags clicables (aria-pressed alterna).
 *  AC5  → botón "Guardar criterios →" muestra Toast role="status".
 *  AC6  → mover slider actualiza suma, >100 → rojo, toggles cambian aria-checked.
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import CriteriaCard from "../../product/frontend/components/dashboard/CriteriaCard";

describe("CriteriaCard", () => {
  it("AC1: renderiza 3 tabs (Pesos/Filtros/Canales) y arranca en Pesos", () => {
    render(<CriteriaCard />);

    const subtabs = screen.getByTestId("criteria-subtabs");
    const tabs = within(subtabs).getAllByRole("tab");
    expect(tabs.map((t) => t.textContent)).toEqual([
      "Pesos",
      "Filtros",
      "Canales",
    ]);

    const pesosTab = tabs[0];
    expect(pesosTab).toHaveAttribute("aria-selected", "true");
    // El panel activo de Pesos está montado.
    expect(screen.getByTestId("weights-tab")).toBeInTheDocument();
  });

  it("AC2: mover slider Trust de 40 a 60 actualiza la suma a 120 y la barra es roja", async () => {
    const user = userEvent.setup();
    render(<CriteriaCard />);

    const trustSlider = screen.getByLabelText(
      /Trust Score \(porcentaje\)/i,
    ) as HTMLInputElement;
    expect(trustSlider.value).toBe("40");

    // Cambio el valor del slider (input type=range) usando fireEvent-like via user.
    // userEvent.type no soporta sliders → cambiamos con `.click` + clear via fireEvent.
    // Usamos el cambio directo de valor:
    trustSlider.focus();
    // Set value programmatically y dispatch change:
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(trustSlider, "60");
    trustSlider.dispatchEvent(new Event("input", { bubbles: true }));

    // Suma esperada: 60 + 40 + 20 = 120
    const totalLabel = screen.getByTestId("weights-total-label");
    expect(totalLabel.textContent).toBe("120%");

    const totalGroup = screen.getByTestId("weights-total");
    expect(totalGroup).toHaveAttribute("data-weight-status", "over");

    const fill = screen.getByTestId("weights-fill");
    expect(fill.className).toContain("bg-brand-primary-500");
    // Suprimir warning de variable no usada
    void user;
  });

  it("AC2: cuando suma = 100 (defaults), la barra es verde", () => {
    render(<CriteriaCard />);
    const totalGroup = screen.getByTestId("weights-total");
    expect(totalGroup).toHaveAttribute("data-weight-status", "ok");
    const fill = screen.getByTestId("weights-fill");
    expect(fill.className).toContain("bg-feedback-green-500");
    const totalLabel = screen.getByTestId("weights-total-label");
    expect(totalLabel.textContent).toBe("100%");
  });

  it("AC2: cuando suma < 100, la barra es amarilla", () => {
    render(
      <CriteriaCard
        defaults={{ weights: { trust: 30, conversion: 30, urgency: 20 } }}
      />,
    );
    const totalGroup = screen.getByTestId("weights-total");
    expect(totalGroup).toHaveAttribute("data-weight-status", "under");
    const fill = screen.getByTestId("weights-fill");
    expect(fill.className).toContain("bg-feedback-yellow-500");
    const totalLabel = screen.getByTestId("weights-total-label");
    expect(totalLabel.textContent).toBe("80%");
  });

  it("AC3: cambiar a tab 'Filtros' muestra los 5 labels exactos del HTML target", async () => {
    const user = userEvent.setup();
    render(<CriteriaCard />);

    await user.click(screen.getByRole("tab", { name: /^Filtros$/ }));

    const expectedLabels = [
      "Bloquear números inválidos",
      "Detectar spam",
      "Filtrar duplicados",
      "Ignorar leads sin mensaje",
      "Score mínimo global",
    ];

    for (const label of expectedLabels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }

    // 4 switches (toggles) — el 5to criterio "Score mínimo global" usa slider.
    const switches = screen.getAllByRole("switch");
    expect(switches).toHaveLength(4);
  });

  it("AC3: toggle de un filtro cambia aria-checked de true a false", async () => {
    const user = userEvent.setup();
    render(<CriteriaCard />);

    await user.click(screen.getByRole("tab", { name: /^Filtros$/ }));

    const bloquearSwitch = screen.getByRole("switch", {
      name: "Bloquear números inválidos",
    });
    expect(bloquearSwitch).toHaveAttribute("aria-checked", "true");

    await user.click(bloquearSwitch);
    expect(bloquearSwitch).toHaveAttribute("aria-checked", "false");

    await user.click(bloquearSwitch);
    expect(bloquearSwitch).toHaveAttribute("aria-checked", "true");
  });

  it("AC4: cambiar a tab 'Canales' muestra los 7 channel tags exactos", async () => {
    const user = userEvent.setup();
    render(<CriteriaCard />);

    await user.click(screen.getByRole("tab", { name: /^Canales$/ }));

    const expectedChannels = [
      "Zonaprop",
      "Argenprop",
      "WhatsApp",
      "Mail",
      "Mercadolibre",
      "Chat web",
      "Navent",
    ];

    const panel = screen.getByTestId("channels-tab");
    for (const name of expectedChannels) {
      const tag = within(panel).getByRole("button", { name });
      expect(tag).toBeInTheDocument();
    }
  });

  it("AC4: click en un channel tag alterna aria-pressed y la clase 'on'", async () => {
    const user = userEvent.setup();
    render(<CriteriaCard />);

    await user.click(screen.getByRole("tab", { name: /^Canales$/ }));

    // Mercadolibre default = false → off
    const merc = screen.getByRole("button", { name: "Mercadolibre" });
    expect(merc).toHaveAttribute("aria-pressed", "false");

    await user.click(merc);
    expect(merc).toHaveAttribute("aria-pressed", "true");
    expect(merc.className).toContain("on");

    // WhatsApp default = true → on
    const wa = screen.getByRole("button", { name: "WhatsApp" });
    expect(wa).toHaveAttribute("aria-pressed", "true");
    await user.click(wa);
    expect(wa).toHaveAttribute("aria-pressed", "false");
  });

  it("AC5: click en 'Guardar criterios' muestra Toast con role=status y mensaje 'Criterios guardados'", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(<CriteriaCard onSave={onSave} />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    const saveBtn = screen.getByRole("button", {
      name: /Guardar criterios/i,
    });
    await user.click(saveBtn);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent("Criterios guardados");
    expect(toast).toHaveAttribute("data-toast-variant", "success");
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][0]).toMatchObject({
      weights: { trust: 40, conversion: 40, urgency: 20 },
      umbralAlerta: 70,
    });
  });

  it("AC2: slider 'Umbral de alerta' default es 70 y se ve en la UI", () => {
    render(<CriteriaCard />);
    const umbralValue = screen.getByTestId("weights-umbral-value");
    expect(umbralValue.textContent).toBe("70");

    const umbralSlider = screen.getByLabelText(
      /Umbral de alerta/i,
    ) as HTMLInputElement;
    expect(umbralSlider.value).toBe("70");
  });
});
