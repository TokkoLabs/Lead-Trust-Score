/**
 * tests/frontend/test_dashboard_metrics.ts
 *
 * Verifica las funciones puras de `product/frontend/lib/dashboardMetrics.ts`
 * usadas por KpiRow + LeadsBarChart + QualityDoughnut.
 *
 * Cubre acceptance feature 11 AC5/AC6:
 * - computeKpis (total, scorePromedio, altaCalidad, descartados)
 * - computeDailyBuckets (7 buckets, ignora leads sin created_at, clasifica
 *   por tier con reglas de score y is_spam)
 */

import {
  classifyTier,
  computeDailyBuckets,
  computeKpis,
} from "../../product/frontend/lib/dashboardMetrics";
import type { Lead } from "../../product/types/lead";

// Helper: lead mínimo (con campos requeridos del esquema base).
function makeLead(partial: Partial<Lead> & { id: string }): Lead {
  return {
    mensaje: "x",
    telefono: "+54 11 0000-0000",
    email: "x@example.com",
    zona: "Palermo",
    tipo_propiedad: "departamento",
    presupuesto_usd: 0,
    property_ids: [],
    ...partial,
  };
}

describe("dashboardMetrics — classifyTier", () => {
  it("score=75 → alta (borderline ≥75)", () => {
    expect(classifyTier(75, false)).toBe("alta");
  });

  it("score=74 → media", () => {
    expect(classifyTier(74, false)).toBe("media");
  });

  it("score=40 → media (borderline ≥40)", () => {
    expect(classifyTier(40, false)).toBe("media");
  });

  it("score=39 → baja", () => {
    expect(classifyTier(39, false)).toBe("baja");
  });

  it("is_spam=true → baja sin importar el score", () => {
    expect(classifyTier(99, true)).toBe("baja");
    expect(classifyTier(50, true)).toBe("baja");
  });
});

describe("dashboardMetrics — computeKpis", () => {
  it("retorna ceros para lista vacía", () => {
    const kpis = computeKpis([], {});
    expect(kpis).toEqual({
      total: 0,
      scorePromedio: 0,
      altaCalidad: 0,
      descartados: 0,
    });
  });

  it("con 5 leads sintéticos: total/promedio/alta/spam correctos", () => {
    const leads: Lead[] = [
      makeLead({ id: "l1" }),
      makeLead({ id: "l2" }),
      makeLead({ id: "l3" }),
      makeLead({ id: "l4" }),
      makeLead({ id: "l5" }),
    ];

    const analyses = {
      l1: { trust_score: 80, is_spam: false }, // alta
      l2: { trust_score: 75, is_spam: false }, // alta (borderline)
      l3: { trust_score: 50, is_spam: false }, // media
      l4: { trust_score: 30, is_spam: false }, // baja
      l5: { trust_score: 10, is_spam: true }, // spam → descartado
    };

    const kpis = computeKpis(leads, analyses);
    expect(kpis.total).toBe(5);
    // promedio = (80+75+50+30+10)/5 = 245/5 = 49
    expect(kpis.scorePromedio).toBe(49);
    // altaCalidad: l1, l2 (l5 con score 10 e is_spam ya no cuenta como alta)
    expect(kpis.altaCalidad).toBe(2);
    expect(kpis.descartados).toBe(1);
  });

  it("sin `analyses`: usa computeLocalScore como fallback (no rompe)", () => {
    // Lead que computeLocalScore puntúa en 60:
    //   presupuesto 100k (30) + mensaje 50+ chars (20) + property_ids=1 (10) +
    //   tipo definido (10) = 70. Suficiente para verificar que no es 0.
    const lead = makeLead({
      id: "lA",
      presupuesto_usd: 100000,
      mensaje: "Estoy buscando un departamento para mudarme en septiembre.",
      property_ids: ["prop-01"],
      tipo_propiedad: "departamento",
    });
    const kpis = computeKpis([lead]); // sin analyses
    expect(kpis.total).toBe(1);
    expect(kpis.scorePromedio).toBeGreaterThan(0);
    // is_spam defaulteado a false → descartados=0.
    expect(kpis.descartados).toBe(0);
  });
});

describe("dashboardMetrics — computeDailyBuckets", () => {
  // Ancla determinista: 2026-05-27T12:00:00Z. La ventana de 7 días será
  // 2026-05-21..2026-05-27 (UTC).
  const NOW = new Date("2026-05-27T12:00:00.000Z");

  it("retorna 7 buckets en orden cronológico (más antiguo → hoy)", () => {
    const buckets = computeDailyBuckets([], {}, NOW);
    expect(buckets).toHaveLength(7);
    expect(buckets[0].date).toBe("2026-05-21");
    expect(buckets[6].date).toBe("2026-05-27");
    expect(buckets[6].label).toBe("Hoy");
    // counts cero en todos.
    for (const b of buckets) {
      expect(b.alta + b.media + b.baja).toBe(0);
    }
  });

  it("agrupa leads en 3 días distintos con counts correctos y 0 en los demás", () => {
    const leads: Lead[] = [
      makeLead({ id: "a1", created_at: "2026-05-21T10:00:00.000Z" }),
      makeLead({ id: "a2", created_at: "2026-05-21T22:00:00.000Z" }),
      makeLead({ id: "b1", created_at: "2026-05-24T08:00:00.000Z" }),
      makeLead({ id: "c1", created_at: "2026-05-27T03:00:00.000Z" }),
      makeLead({ id: "c2", created_at: "2026-05-27T18:00:00.000Z" }),
      makeLead({ id: "c3", created_at: "2026-05-27T23:59:00.000Z" }),
    ];

    const analyses = {
      a1: { trust_score: 90, is_spam: false }, // alta
      a2: { trust_score: 50, is_spam: false }, // media
      b1: { trust_score: 20, is_spam: false }, // baja
      c1: { trust_score: 80, is_spam: false }, // alta
      c2: { trust_score: 80, is_spam: true }, // spam → baja
      c3: { trust_score: 40, is_spam: false }, // media
    };

    const buckets = computeDailyBuckets(leads, analyses, NOW);

    // 2026-05-21: 1 alta + 1 media + 0 baja
    expect(buckets[0]).toMatchObject({
      date: "2026-05-21",
      alta: 1,
      media: 1,
      baja: 0,
    });
    // 2026-05-22, 23: vacíos
    expect(buckets[1]).toMatchObject({ alta: 0, media: 0, baja: 0 });
    expect(buckets[2]).toMatchObject({ alta: 0, media: 0, baja: 0 });
    // 2026-05-24: 0 alta + 0 media + 1 baja
    expect(buckets[3]).toMatchObject({
      date: "2026-05-24",
      alta: 0,
      media: 0,
      baja: 1,
    });
    // 25, 26 vacíos.
    expect(buckets[4]).toMatchObject({ alta: 0, media: 0, baja: 0 });
    expect(buckets[5]).toMatchObject({ alta: 0, media: 0, baja: 0 });
    // 2026-05-27 (Hoy): 1 alta + 1 media + 1 baja (c2 es spam)
    expect(buckets[6]).toMatchObject({
      date: "2026-05-27",
      label: "Hoy",
      alta: 1,
      media: 1,
      baja: 1,
    });
  });

  it("ignora leads sin created_at o con created_at inválido", () => {
    const leads: Lead[] = [
      makeLead({ id: "no-date-1" }), // sin created_at
      makeLead({ id: "bad-date", created_at: "not-a-date" }),
      makeLead({ id: "outside", created_at: "2026-01-01T00:00:00.000Z" }), // fuera de ventana
      makeLead({ id: "inside", created_at: "2026-05-25T00:00:00.000Z" }),
    ];

    const analyses = {
      "no-date-1": { trust_score: 80, is_spam: false },
      "bad-date": { trust_score: 80, is_spam: false },
      outside: { trust_score: 80, is_spam: false },
      inside: { trust_score: 80, is_spam: false },
    };

    const buckets = computeDailyBuckets(leads, analyses, NOW);
    // Solo el lead "inside" debería sumar 1 alta en su día.
    const insideBucket = buckets.find((b) => b.date === "2026-05-25");
    expect(insideBucket).toBeDefined();
    expect(insideBucket!.alta).toBe(1);
    // Total de leads contados = 1 (no 4).
    const totalCounted = buckets.reduce(
      (acc, b) => acc + b.alta + b.media + b.baja,
      0,
    );
    expect(totalCounted).toBe(1);
  });

  it("respeta la clasificación borderline (75=alta, 40=media, 39=baja)", () => {
    const leads: Lead[] = [
      makeLead({ id: "x75", created_at: "2026-05-27T01:00:00.000Z" }),
      makeLead({ id: "x40", created_at: "2026-05-27T02:00:00.000Z" }),
      makeLead({ id: "x39", created_at: "2026-05-27T03:00:00.000Z" }),
    ];
    const analyses = {
      x75: { trust_score: 75, is_spam: false },
      x40: { trust_score: 40, is_spam: false },
      x39: { trust_score: 39, is_spam: false },
    };
    const buckets = computeDailyBuckets(leads, analyses, NOW);
    expect(buckets[6]).toMatchObject({
      date: "2026-05-27",
      alta: 1,
      media: 1,
      baja: 1,
    });
  });
});
