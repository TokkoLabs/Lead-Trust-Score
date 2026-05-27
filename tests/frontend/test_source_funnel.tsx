/**
 * tests/frontend/test_source_funnel.tsx
 *
 * Cubre acceptance feature 12 AC2/AC4:
 *  - Agrupa leads por source, ignora los que no tienen source.
 *  - Ordena descendente por count.
 *  - Calcula porcentaje relativo al máximo (max = 100%).
 *  - Respeta `limit` (top-N).
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";

import SourceFunnel from "../../product/frontend/components/dashboard/SourceFunnel";
import type { Lead, Source } from "../../product/types/lead";

function makeLead(id: string, source?: Source): Lead {
  return {
    id,
    mensaje: "x",
    telefono: "+54 11 0000-0000",
    email: `${id}@example.com`,
    zona: "Palermo",
    tipo_propiedad: "departamento",
    presupuesto_usd: 100000,
    property_ids: [],
    source,
  };
}

describe("SourceFunnel", () => {
  // 10 leads: 3 Zonaprop, 5 WhatsApp, 2 Mail.
  const leadsBase: Lead[] = [
    ...Array.from({ length: 5 }, (_, i) =>
      makeLead(`w-${i}`, "WhatsApp"),
    ),
    ...Array.from({ length: 3 }, (_, i) =>
      makeLead(`z-${i}`, "Zonaprop"),
    ),
    ...Array.from({ length: 2 }, (_, i) => makeLead(`m-${i}`, "Mail")),
  ];

  it("AC2: ordena canales descendente por count: WhatsApp(5)/Zonaprop(3)/Mail(2)", () => {
    render(<SourceFunnel leads={leadsBase} />);

    const list = screen.getByTestId("funnel-list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0].getAttribute("data-source")).toBe("WhatsApp");
    expect(items[1].getAttribute("data-source")).toBe("Zonaprop");
    expect(items[2].getAttribute("data-source")).toBe("Mail");
  });

  it("AC2: porcentajes relativos al máximo — WhatsApp=100%, Zonaprop=60%, Mail=40%", () => {
    render(<SourceFunnel leads={leadsBase} />);

    const fills = screen.getAllByTestId("funnel-fill");
    expect(fills).toHaveLength(3);
    expect(fills[0].getAttribute("data-percent")).toBe("100");
    expect(fills[1].getAttribute("data-percent")).toBe("60");
    expect(fills[2].getAttribute("data-percent")).toBe("40");

    // El style inline también refleja el width.
    expect((fills[0] as HTMLElement).style.width).toBe("100%");
    expect((fills[1] as HTMLElement).style.width).toBe("60%");
    expect((fills[2] as HTMLElement).style.width).toBe("40%");

    // El número absoluto se renderiza dentro de la barra.
    expect(fills[0].textContent).toContain("5");
    expect(fills[1].textContent).toContain("3");
    expect(fills[2].textContent).toContain("2");
  });

  it("AC2: leads sin source son ignorados", () => {
    const leadsConHuerfanos: Lead[] = [
      ...leadsBase,
      makeLead("orphan-1", undefined),
      makeLead("orphan-2", undefined),
    ];
    render(<SourceFunnel leads={leadsConHuerfanos} />);

    const items = within(screen.getByTestId("funnel-list")).getAllByRole(
      "listitem",
    );
    expect(items).toHaveLength(3); // Sigue habiendo 3 canales.
    // Verificamos counts intactos: WhatsApp=5, Zonaprop=3, Mail=2.
    const fills = screen.getAllByTestId("funnel-fill");
    expect(fills[0].textContent).toContain("5");
    expect(fills[1].textContent).toContain("3");
    expect(fills[2].textContent).toContain("2");
  });

  it("AC2: respeta limit=2 → solo top 2 filas", () => {
    render(<SourceFunnel leads={leadsBase} limit={2} />);

    const items = within(screen.getByTestId("funnel-list")).getAllByRole(
      "listitem",
    );
    expect(items).toHaveLength(2);
    expect(items[0].getAttribute("data-source")).toBe("WhatsApp");
    expect(items[1].getAttribute("data-source")).toBe("Zonaprop");
  });

  it("renderiza placeholder accesible cuando no hay leads con source", () => {
    const sinSource: Lead[] = [
      makeLead("a"),
      makeLead("b"),
      makeLead("c"),
    ];
    render(<SourceFunnel leads={sinSource} />);

    expect(
      screen.getByText("No hay leads con fuente asignada."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("funnel-list")).not.toBeInTheDocument();
  });
});
