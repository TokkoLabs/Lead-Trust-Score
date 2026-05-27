/**
 * tests/frontend/test_app_shell.tsx
 *
 * Verifica estructura semántica y comportamiento del nuevo `AppShell`.
 * No verifica estilos resueltos (Tailwind/PostCSS no corren en jest);
 * eso ya lo cubre `test_design_tokens.tsx`.
 *
 * Cubre: R9, R19, R20, R21, R22, R23.
 */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AppShell from "../../product/frontend/components/AppShell";

describe("AppShell", () => {
  it("R19: renderiza topbar, left rail, right rail, bottom bar y children", () => {
    render(
      <AppShell>
        <div data-testid="kid" />
      </AppShell>
    );

    // 4 regiones
    expect(screen.getByRole("banner")).toBeInTheDocument(); // Topbar
    expect(screen.getByLabelText("Navegación principal")).toBeInTheDocument();
    expect(screen.getByLabelText("Acciones rápidas")).toBeInTheDocument();
    expect(screen.getByLabelText("Barra inferior")).toBeInTheDocument();

    // children dentro de <main>
    const main = screen.getByRole("main");
    expect(within(main).getByTestId("kid")).toBeInTheDocument();
  });

  it("R20: activeView='queue' + queueBadgeCount=7 → aria-current y badge '7'", () => {
    render(
      <AppShell activeView="queue" queueBadgeCount={7}>
        <span />
      </AppShell>
    );

    const item = screen.getByRole("button", { name: "Cola de leads" });
    expect(item).toHaveAttribute("aria-current", "page");
    expect(within(item).getByText("7")).toBeInTheDocument();
  });

  it("R9: queueBadgeCount ausente (default 0) → no se renderiza badge '0' en Cola", () => {
    render(
      <AppShell>
        <span />
      </AppShell>
    );

    const item = screen.getByRole("button", { name: "Cola de leads" });
    expect(within(item).queryByText("0")).toBeNull();
  });

  it("R21: analyzedCount=42 → bottom bar muestra '42 leads analizados' y live badge 'En vivo'", () => {
    render(
      <AppShell analyzedCount={42}>
        <span />
      </AppShell>
    );

    const bb = screen.getByLabelText("Barra inferior");
    expect(within(bb).getByText("42")).toBeInTheDocument();
    // El counter renderiza "leads" y "analizados" en dos nodos separados
    // (no confundir con "Analizando leads" del live badge, que también
    // matchea /leads/i — por eso usamos matcher exacto "leads").
    expect(within(bb).getByText("leads")).toBeInTheDocument();
    expect(within(bb).getByText("analizados")).toBeInTheDocument();

    const live = screen.getByRole("status");
    expect(live).toHaveTextContent(/En vivo/i);
    expect(live).toHaveTextContent(/Analizando leads/i);
  });

  it("R22: click en nav item Cola dispara onSelectView('queue')", async () => {
    const onSelectView = jest.fn();
    const user = userEvent.setup();
    render(
      <AppShell onSelectView={onSelectView}>
        <span />
      </AppShell>
    );

    await user.click(screen.getByRole("button", { name: "Cola de leads" }));
    expect(onSelectView).toHaveBeenCalledWith("queue");
  });

  it("R22: click en botón 'Nuevo lead' dispara onNewLead una vez", async () => {
    const onNewLead = jest.fn();
    const user = userEvent.setup();
    render(
      <AppShell onNewLead={onNewLead}>
        <span />
      </AppShell>
    );

    await user.click(screen.getByRole("button", { name: "Nuevo lead" }));
    expect(onNewLead).toHaveBeenCalledTimes(1);
  });
});
