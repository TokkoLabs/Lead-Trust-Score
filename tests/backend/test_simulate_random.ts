/**
 * tests/backend/test_simulate_random.ts
 * Tests específicos de la feature 18 (unified_random_lead_simulator) para
 * el handler POST /api/leads/simulate.
 *
 * Cubre los acceptance criteria 6.a / 6.b / 6.c:
 *   (a) llamada sin body → 200 con `{ lead, analysis }`.
 *   (b) ratio aprox 80/20 (interested/spam) sobre 200 muestras con
 *       `Math.random` seedeado.
 *   (c) campos randomizados pertenecen a los pools definidos en
 *       `product/backend/lib/leadGenerators.ts`.
 *
 * El test mockea `analyseLeadWithAI` para no salir a la red y simula la
 * decisión 80/20 controlando `Math.random` (el primer valor por
 * invocación determina el `forceType`).
 */

process.env["ANTHROPIC_API_KEY"] = "test-key-mock";

jest.mock("../../product/backend/services/ai_analyser", () => ({
  filterCandidateProperties: jest.fn(() => []),
  analyseLeadWithAI: jest.fn(),
}));

import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../../product/backend/api/leads/simulate";
import {
  analyseLeadWithAI,
  filterCandidateProperties,
} from "../../product/backend/services/ai_analyser";
import type { LeadAnalysis } from "../../product/types/lead_analysis";
import {
  ZONAS_POOL,
  MENSAJES_INTERESTED_POOL,
  MENSAJES_SPAM_POOL,
  PRESUPUESTOS_POOL,
  SOURCES_POOL,
  AGENCIAS_POOL,
  DIRECCIONES_POOL,
  TIPOS_PROPIEDAD_POOL,
} from "../../product/backend/lib/leadGenerators";

const INTERESTED_ANALYSIS_FIXTURE: LeadAnalysis = {
  trust_score: 78,
  conversion_score: 70,
  urgency_score: 60,
  is_spam: false,
  detected_intent: "Compra",
  suggested_action: "Llamar pronto.",
  ai_summary: "Lead random interested.",
  property_match_ids: [],
};

const SPAM_ANALYSIS_FIXTURE: LeadAnalysis = {
  trust_score: 4,
  conversion_score: 1,
  urgency_score: 0,
  is_spam: true,
  detected_intent: "Spam",
  suggested_action: "Descartar.",
  ai_summary: "Lead random spam.",
  property_match_ids: [],
};

function makeReq(
  method: string,
  body: Record<string, unknown> | undefined,
): NextApiRequest {
  return {
    method,
    body,
    headers: {},
    query: {},
  } as unknown as NextApiRequest;
}

function makeRes() {
  let capturedStatus = 200;
  let capturedBody: unknown = null;

  const res = {
    status(code: number) {
      capturedStatus = code;
      return res;
    },
    json(body: unknown) {
      capturedBody = body;
      return res;
    },
    getStatus() {
      return capturedStatus;
    },
    getBody() {
      return capturedBody;
    },
  };

  return res as unknown as NextApiResponse & {
    getStatus: () => number;
    getBody: () => unknown;
  };
}

const mockAnalyseLeadWithAI = analyseLeadWithAI as jest.MockedFunction<
  typeof analyseLeadWithAI
>;
const mockFilterCandidateProperties =
  filterCandidateProperties as jest.MockedFunction<
    typeof filterCandidateProperties
  >;

beforeEach(() => {
  jest.clearAllMocks();
  mockFilterCandidateProperties.mockReturnValue([]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

// (a) POST sin body → 200 con { lead, analysis }.
test("a_post_without_body_returns_lead_and_analysis", async () => {
  mockAnalyseLeadWithAI.mockResolvedValue(INTERESTED_ANALYSIS_FIXTURE);

  // body undefined: el handler debe tratar `req.body ?? {}` y aplicar default 'random'.
  const req = makeReq("POST", undefined);
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(200);
  const body = res.getBody() as { lead: unknown; analysis: unknown };
  expect(body).toHaveProperty("lead");
  expect(body).toHaveProperty("analysis");

  const lead = body.lead as Record<string, unknown>;
  expect(typeof lead.id).toBe("string");
  expect(typeof lead.mensaje).toBe("string");
  expect(typeof lead.email).toBe("string");
  expect(typeof lead.telefono).toBe("string");
});

// (b) Ratio aproximado 80/20 sobre 200 muestras con Math.random seedeado.
//
// Implementación: usamos un PRNG determinista lineal congruencial (LCG)
// para reemplazar Math.random durante la corrida. Como el handler usa
// `Math.random()` UNA vez para decidir el tipo y luego `generateRandomLead`
// llama internamente a Math.random varias veces más, no hay forma sencilla
// de "saber" cuál tirada es la de decisión. La estrategia robusta es:
//  - Mockear analyseLeadWithAI para que devuelva `is_spam` reflejando el
//    pool de mensajes (los spam usan MENSAJES_SPAM_POOL).
//  - Contar tipos detectados por pertenencia del mensaje a cada pool.
//  - Verificar ratio interested ≈ 80% ± 15%.
test("b_ratio_approx_80_20_over_200_samples", async () => {
  // PRNG determinista (LCG) — usado por el handler y por generateRandomLead.
  let seed = 0x1a4958;
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  jest.spyOn(Math, "random").mockImplementation(lcg);

  // Mock que clasifica `is_spam` según el mensaje (pool spam → true, sino false).
  mockAnalyseLeadWithAI.mockImplementation(
    async (lead): Promise<LeadAnalysis> => {
      const isSpam = (MENSAJES_SPAM_POOL as readonly string[]).includes(
        lead.mensaje,
      );
      return isSpam ? SPAM_ANALYSIS_FIXTURE : INTERESTED_ANALYSIS_FIXTURE;
    },
  );

  const N = 200;
  let interested = 0;
  let spam = 0;
  for (let i = 0; i < N; i++) {
    const req = makeReq("POST", {});
    const res = makeRes();
    await handler(req, res);
    expect(res.getStatus()).toBe(200);
    const body = res.getBody() as {
      lead: { mensaje: string };
      analysis: LeadAnalysis;
    };
    // Clasificación robusta: nos basamos en el mensaje (pool).
    if ((MENSAJES_SPAM_POOL as readonly string[]).includes(body.lead.mensaje)) {
      spam += 1;
    } else if (
      (MENSAJES_INTERESTED_POOL as readonly string[]).includes(
        body.lead.mensaje,
      )
    ) {
      interested += 1;
    }
  }

  expect(interested + spam).toBe(N);
  const interestedRatio = interested / N;
  // Esperado 0.8 ± 0.15 → entre 0.65 y 0.95.
  expect(interestedRatio).toBeGreaterThanOrEqual(0.65);
  expect(interestedRatio).toBeLessThanOrEqual(0.95);
});

// (c) Campos randomizados pertenecen a los pools definidos.
test("c_random_fields_belong_to_pools", async () => {
  mockAnalyseLeadWithAI.mockResolvedValue(INTERESTED_ANALYSIS_FIXTURE);

  const SAMPLES = 25;
  for (let i = 0; i < SAMPLES; i++) {
    const req = makeReq("POST", { type: "random" });
    const res = makeRes();
    await handler(req, res);
    expect(res.getStatus()).toBe(200);
    const body = res.getBody() as {
      lead: Record<string, unknown>;
      analysis: LeadAnalysis;
    };
    const lead = body.lead;

    // Zona pertenece al pool.
    expect(ZONAS_POOL).toContain(lead.zona);
    // Source pertenece al pool.
    expect(SOURCES_POOL).toContain(lead.source);
    // Tipo de propiedad pertenece al pool (incluye null).
    expect(TIPOS_PROPIEDAD_POOL).toContain(lead.tipo_propiedad);
    // Agencia / dirección pertenecen a sus pools.
    expect(AGENCIAS_POOL).toContain(lead.agencia);
    expect(DIRECCIONES_POOL).toContain(lead.direccion_propiedad);
    // Mensaje pertenece a la unión de pools.
    const allMessages = [
      ...MENSAJES_INTERESTED_POOL,
      ...MENSAJES_SPAM_POOL,
    ];
    expect(allMessages).toContain(lead.mensaje);
    // created_at es ISO 8601 válido.
    expect(typeof lead.created_at).toBe("string");
    expect(Number.isNaN(Date.parse(lead.created_at as string))).toBe(false);
    // Presupuesto: 0 (spam) o miembro del pool (interested).
    expect(
      lead.presupuesto_usd === 0 ||
        (PRESUPUESTOS_POOL as readonly number[]).includes(
          lead.presupuesto_usd as number,
        ),
    ).toBe(true);
  }
});
