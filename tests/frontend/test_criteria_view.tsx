/**
 * tests/frontend/test_criteria_view.tsx
 *
 * Cubre acceptance feature 15 (criteria_view):
 *  AC1 — Render inicial: banner azul + 2 columnas + ambas KeywordsList con
 *        defaults (5 positivas, 3 negativas).
 *  AC2 — `CriterionRow` reusable se monta para cada criterio.
 *  AC3 — `KeywordsList` agregar / remover / dedup.
 *  AC4 — Botón "Restablecer defaults" vuelve al baseline (5/3) sin recargar.
 *  AC5 — Botón "Guardar criterios →" persiste en localStorage['criteria_v1']
 *        y dispara Toast "Criterios guardados".
 *  AC6 — Re-montar la vista tras guardar hidrata desde localStorage.
 */

import React from "react";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import CriteriaView from "../../product/frontend/views/CriteriaView";
import {
  STORAGE_KEY,
} from "../../product/frontend/lib/criteriaStorage";

describe("CriteriaView (feature 15)", () => {
  beforeEach(() => {
    // Importante: cada test arranca con localStorage limpio para que la
    // hidratación use defaults.
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("AC1: render inicial muestra info band azul + 2 columnas + keywords defaults (5/3)", () => {
    render(<CriteriaView />);

    // Banner azul superior.
    const band = screen.getByTestId("criteria-info-band");
    expect(band).toBeInTheDocument();
    expect(band.textContent).toMatch(
      /Los cambios se aplican automáticamente/,
    );

    // 2 columnas presentes.
    expect(screen.getByTestId("criteria-col-left")).toBeInTheDocument();
    expect(screen.getByTestId("criteria-col-right")).toBeInTheDocument();

    // Keywords positivas: 5 chips por default.
    const posList = screen.getByTestId("kw-list-positive");
    const posChips = within(posList).getAllByRole("listitem");
    expect(posChips).toHaveLength(5);
    expect(posChips.map((c) => c.textContent?.replace("×", "").trim())).toEqual([
      "visita",
      "interesado",
      "mudanza",
      "comprar",
      "urgente",
    ]);

    // Keywords negativas: 3 chips por default.
    const negList = screen.getByTestId("kw-list-negative");
    const negChips = within(negList).getAllByRole("listitem");
    expect(negChips).toHaveLength(3);
    expect(negChips.map((c) => c.textContent?.replace("×", "").trim())).toEqual([
      "prueba",
      "test",
      "demo",
    ]);
  });

  it("AC2: secciones izquierdas y derecha montan CriterionRow con sus labels", () => {
    render(<CriteriaView />);

    // Datos de contacto (3 filas).
    expect(screen.getByText("Tiene email")).toBeInTheDocument();
    expect(screen.getByText("Tiene teléfono")).toBeInTheDocument();
    expect(
      screen.getByText("Teléfono completo (≥10 dígitos)"),
    ).toBeInTheDocument();

    // Propiedad y fuente (2 filas).
    expect(screen.getByText("Solicitud de visita")).toBeInTheDocument();
    expect(screen.getByText("Portal verificado")).toBeInTheDocument();

    // Mensaje (2 filas).
    expect(screen.getByText("Mensaje no vacío")).toBeInTheDocument();
    expect(screen.getByText("Mensaje extenso (>30 chars)")).toBeInTheDocument();

    // Filtros automáticos (4 toggles role=switch).
    expect(
      screen.getByRole("switch", { name: "Bloquear números inválidos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Detectar spam automático" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Filtrar duplicados" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Ignorar sin mensaje" }),
    ).toBeInTheDocument();
  });

  it("AC3: KeywordsList agregar 'agendar' añade un chip al final", async () => {
    const user = userEvent.setup();
    render(<CriteriaView />);

    const input = screen.getByTestId("kw-input-positive") as HTMLInputElement;
    await user.type(input, "agendar");
    await user.click(screen.getByTestId("kw-add-positive"));

    const posList = screen.getByTestId("kw-list-positive");
    const chips = within(posList).getAllByRole("listitem");
    expect(chips).toHaveLength(6);
    expect(chips[5].textContent?.replace("×", "").trim()).toBe("agendar");
    expect(input.value).toBe("");
  });

  it("AC3: agregar duplicado 'visita' (ya presente) NO duplica", async () => {
    const user = userEvent.setup();
    render(<CriteriaView />);

    const input = screen.getByTestId("kw-input-positive") as HTMLInputElement;
    await user.type(input, "visita");
    await user.click(screen.getByTestId("kw-add-positive"));

    const posList = screen.getByTestId("kw-list-positive");
    expect(within(posList).getAllByRole("listitem")).toHaveLength(5);
  });

  it("AC3: remover 'test' de negativas hace desaparecer el chip", async () => {
    const user = userEvent.setup();
    render(<CriteriaView />);

    const removeBtn = screen.getByRole("button", { name: "Eliminar test" });
    await user.click(removeBtn);

    const negList = screen.getByTestId("kw-list-negative");
    const chips = within(negList).getAllByRole("listitem");
    expect(chips).toHaveLength(2);
    expect(chips.map((c) => c.textContent?.replace("×", "").trim())).toEqual([
      "prueba",
      "demo",
    ]);
  });

  it("AC3: ENTER en el input agrega también la palabra", async () => {
    const user = userEvent.setup();
    render(<CriteriaView />);

    const input = screen.getByTestId("kw-input-negative") as HTMLInputElement;
    await user.type(input, "spam{Enter}");

    const negList = screen.getByTestId("kw-list-negative");
    const chips = within(negList).getAllByRole("listitem");
    expect(chips).toHaveLength(4);
    expect(chips[3].textContent?.replace("×", "").trim()).toBe("spam");
  });

  it("AC3: input vacío no agrega chip", async () => {
    const user = userEvent.setup();
    render(<CriteriaView />);
    await user.click(screen.getByTestId("kw-add-positive"));
    const posList = screen.getByTestId("kw-list-positive");
    expect(within(posList).getAllByRole("listitem")).toHaveLength(5);
  });

  it("AC4: 'Restablecer defaults' vuelve a 5 positivas y 3 negativas sin recargar", async () => {
    const user = userEvent.setup();
    render(<CriteriaView />);

    // Mutamos el estado: agregamos uno positivo y removemos uno negativo.
    const input = screen.getByTestId("kw-input-positive") as HTMLInputElement;
    await user.type(input, "comprometido");
    await user.click(screen.getByTestId("kw-add-positive"));
    await user.click(screen.getByRole("button", { name: "Eliminar test" }));

    expect(
      within(screen.getByTestId("kw-list-positive")).getAllByRole("listitem"),
    ).toHaveLength(6);
    expect(
      within(screen.getByTestId("kw-list-negative")).getAllByRole("listitem"),
    ).toHaveLength(2);

    // Reset.
    await user.click(screen.getByTestId("criteria-reset-btn"));

    const posList = screen.getByTestId("kw-list-positive");
    const negList = screen.getByTestId("kw-list-negative");
    expect(within(posList).getAllByRole("listitem")).toHaveLength(5);
    expect(within(negList).getAllByRole("listitem")).toHaveLength(3);
  });

  it("AC5: 'Guardar criterios →' escribe en localStorage['criteria_v1'] y muestra Toast", async () => {
    const user = userEvent.setup();
    render(<CriteriaView />);

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    // Mutamos algo para asegurar que el snapshot guardado refleja el estado.
    const input = screen.getByTestId("kw-input-positive") as HTMLInputElement;
    await user.type(input, "agendar{Enter}");

    await user.click(screen.getByTestId("criteria-view-save-btn"));

    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(parsed.keywords.positivas).toContain("agendar");
    expect(parsed.keywords.positivas).toContain("visita");
    expect(parsed.keywords.negativas).toEqual(["prueba", "test", "demo"]);

    // Toast visible con el copy esperado.
    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent("Criterios guardados");
    expect(toast).toHaveAttribute("data-toast-variant", "success");
  });

  it("AC6: tras guardar, un nuevo CriteriaView se hidrata desde localStorage", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<CriteriaView />);

    // Mutamos: removemos 'demo' de negativas + agregamos 'agendar' a positivas.
    await user.click(screen.getByRole("button", { name: "Eliminar demo" }));
    const input = screen.getByTestId("kw-input-positive") as HTMLInputElement;
    await user.type(input, "agendar{Enter}");

    // Guardamos y desmontamos.
    await user.click(screen.getByTestId("criteria-view-save-btn"));
    unmount();

    // Re-mount: debería leer de localStorage (no defaults).
    render(<CriteriaView />);

    const posList = screen.getByTestId("kw-list-positive");
    const negList = screen.getByTestId("kw-list-negative");
    const posChips = within(posList).getAllByRole("listitem");
    const negChips = within(negList).getAllByRole("listitem");

    expect(posChips.map((c) => c.textContent?.replace("×", "").trim())).toEqual(
      ["visita", "interesado", "mudanza", "comprar", "urgente", "agendar"],
    );
    expect(negChips.map((c) => c.textContent?.replace("×", "").trim())).toEqual(
      ["prueba", "test"],
    );
  });
});
