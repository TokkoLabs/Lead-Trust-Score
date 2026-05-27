/**
 * tests/frontend/test_lead_reasons.ts
 *
 * Cubre acceptance feature 14 AC3 + AC7: lógica pura de derivación de
 * reason chips en `product/frontend/lib/leadReasons.ts`.
 */

import { deriveReasons } from "../../product/frontend/lib/leadReasons";
import type { Lead } from "../../product/types/lead";

function makeLead(overrides: Partial<Lead> & { id: string }): Lead {
  return {
    id: overrides.id,
    mensaje: overrides.mensaje ?? "",
    telefono: overrides.telefono ?? "+54 11 4444-5555",
    email: overrides.email ?? "alguien@example.com",
    zona: overrides.zona ?? "Palermo",
    tipo_propiedad:
      overrides.tipo_propiedad !== undefined
        ? overrides.tipo_propiedad
        : "departamento",
    presupuesto_usd: overrides.presupuesto_usd ?? 100000,
    property_ids: overrides.property_ids ?? [],
    source: overrides.source,
    estado: overrides.estado,
    created_at: overrides.created_at,
    agencia: overrides.agencia,
    direccion_propiedad: overrides.direccion_propiedad,
  };
}

describe("deriveReasons", () => {
  it("AC3: 'Hola, quiero agendar visita el sábado' incluye chip 'Solicita visita' positive", () => {
    const lead = makeLead({
      id: "l1",
      mensaje: "Hola, quiero agendar visita el sábado",
    });
    const chips = deriveReasons(lead);
    const visita = chips.find((c) => c.id === "visita");
    expect(visita).toBeDefined();
    expect(visita?.variant).toBe("positive");
    expect(visita?.label).toBe("Solicita visita");
  });

  it("AC3: 'Estoy interesado en comprar' retorna chips 'Interesado' y 'Compra'", () => {
    const lead = makeLead({
      id: "l2",
      mensaje: "Estoy interesado en comprar",
    });
    const chips = deriveReasons(lead);
    const ids = chips.map((c) => c.id);
    expect(ids).toContain("interesado");
    expect(ids).toContain("compra");
    expect(chips.find((c) => c.id === "interesado")?.variant).toBe("positive");
    expect(chips.find((c) => c.id === "compra")?.variant).toBe("positive");
  });

  it("AC3: email vacío produce chip 'Sin email' negative", () => {
    const lead = makeLead({
      id: "l3",
      email: "",
      mensaje: "Mensaje suficientemente largo para no disparar otras razones",
    });
    const chips = deriveReasons(lead);
    const sinEmail = chips.find((c) => c.id === "sin-email");
    expect(sinEmail).toBeDefined();
    expect(sinEmail?.variant).toBe("negative");
  });

  it("AC3: analysis.is_spam=true produce chip 'Detectado como spam' negative", () => {
    const lead = makeLead({
      id: "l4",
      mensaje: "Hola, estoy interesado en visitar",
    });
    const chips = deriveReasons(lead, {
      is_spam: true,
      detected_intent: "spam",
    });
    const spam = chips.find((c) => c.id === "spam");
    expect(spam).toBeDefined();
    expect(spam?.variant).toBe("negative");
    expect(spam?.label).toBe("Detectado como spam");
  });

  it("AC3: telefono con sólo 3 dígitos produce chip 'Sin teléfono' negative", () => {
    const lead = makeLead({
      id: "l5",
      telefono: "555",
      mensaje: "Mensaje completo y descriptivo de unas cuantas palabras.",
    });
    const chips = deriveReasons(lead);
    const sinTel = chips.find((c) => c.id === "sin-telefono");
    expect(sinTel).toBeDefined();
    expect(sinTel?.variant).toBe("negative");
  });

  it("AC3: mensaje 'test demo prueba' produce chip 'Palabras sospechosas' negative", () => {
    const lead = makeLead({
      id: "l6",
      mensaje: "test demo prueba",
    });
    const chips = deriveReasons(lead);
    const sus = chips.find((c) => c.id === "sospechoso");
    expect(sus).toBeDefined();
    expect(sus?.variant).toBe("negative");
  });

  it("AC3: lead 'limpio' sin keywords positivas pero con datos completos NO retorna chips negativos", () => {
    // Email + tel completos, mensaje neutro sin keywords ni red flags.
    const lead = makeLead({
      id: "l7",
      mensaje:
        "Buenas tardes, querría más información sobre la propiedad anunciada por favor.",
      email: "ana.maria@correo.com",
      telefono: "+54 11 4444-5566",
    });
    const chips = deriveReasons(lead);
    const negatives = chips.filter((c) => c.variant === "negative");
    expect(negatives).toHaveLength(0);
    // Debe tener al menos email-ok + telefono-ok + mensaje-extenso.
    const ids = chips.map((c) => c.id);
    expect(ids).toContain("email-ok");
    expect(ids).toContain("telefono-ok");
    expect(ids).toContain("mensaje-extenso");
  });

  it("AC3: lead totalmente vacío produce sólo chips negativos (sin email, sin telefono, mensaje vacío)", () => {
    const lead = makeLead({
      id: "l8",
      mensaje: "",
      email: "",
      telefono: "",
    });
    const chips = deriveReasons(lead);
    const ids = chips.map((c) => c.id);
    expect(ids).toContain("sin-email");
    expect(ids).toContain("sin-telefono");
    expect(ids).toContain("mensaje-vacio");
    // Todos negative.
    expect(chips.every((c) => c.variant === "negative")).toBe(true);
  });

  it("AC3: cap máximo de 6 chips por lead aún con multiples matches", () => {
    const lead = makeLead({
      id: "l9",
      mensaje:
        "Hola, estoy muy interesado en comprar, quiero agendar visita urgente, planeo mudanza pronto, test demo prueba",
      email: "juan.perez@correo.com",
      telefono: "+54 11 5555-6666",
    });
    const chips = deriveReasons(lead);
    expect(chips.length).toBeLessThanOrEqual(6);
  });

  it("AC3: los chip ids son únicos (sin duplicados)", () => {
    const lead = makeLead({
      id: "l10",
      mensaje: "visita visita visitar agendar quiero ver la propiedad",
    });
    const chips = deriveReasons(lead);
    const ids = chips.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
