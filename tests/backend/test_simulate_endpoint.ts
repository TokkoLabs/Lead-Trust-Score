/**
 * tests/backend/test_simulate_endpoint.ts
 * Tests para el handler POST /api/leads/simulate (contrato legacy).
 *
 * Verifica que tras la feature 18 (unified_random_lead_simulator) el
 * endpoint sigue aceptando `type='interested'` y `type='spam'` y devuelve
 * `{ lead, analysis }`. Los asserts se ajustan a la nueva implementación,
 * que toma los atributos del lead desde los pools de
 * `product/backend/lib/leadGenerators.ts` (feature 10).
 */

// Patch ANTHROPIC_API_KEY antes de que cualquier modulo lo lea
process.env["ANTHROPIC_API_KEY"] = "test-key-mock";

// Mock del modulo ai_analyser para evitar llamadas reales a Claude
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
} from "../../product/backend/lib/leadGenerators";

const INTERESTED_ANALYSIS_FIXTURE: LeadAnalysis = {
  trust_score: 88,
  conversion_score: 82,
  urgency_score: 75,
  is_spam: false,
  detected_intent: "Compra de departamento en Palermo",
  suggested_action: "Contactar en menos de 24hs con listado disponible.",
  ai_summary:
    "Lead de alta confiabilidad con presupuesto claro y urgencia real. Candidato ideal para seguimiento inmediato.",
  property_match_ids: ["prop-01", "prop-07"],
};

const SPAM_ANALYSIS_FIXTURE: LeadAnalysis = {
  trust_score: 5,
  conversion_score: 2,
  urgency_score: 1,
  is_spam: true,
  detected_intent: "Intencion vaga o inexistente",
  suggested_action: "Descartar lead como spam.",
  ai_summary:
    "El lead presenta multiples senales de spam: email temporal, telefono invalido y mensaje sin contexto.",
  property_match_ids: [],
};

function makeReq(
  method: string,
  body: Record<string, unknown>,
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

// type='interested' → HTTP 200 con lead y analysis; campos del lead derivados de pools.
test("returns_200_with_lead_and_analysis_for_interested", async () => {
  mockAnalyseLeadWithAI.mockResolvedValue(INTERESTED_ANALYSIS_FIXTURE);

  const req = makeReq("POST", { type: "interested" });
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(200);
  const body = res.getBody() as { lead: unknown; analysis: unknown };
  expect(body).toHaveProperty("lead");
  expect(body).toHaveProperty("analysis");

  const lead = body.lead as Record<string, unknown>;
  expect(typeof lead.id).toBe("string");
  expect((lead.id as string).startsWith("sim-")).toBe(true);

  // Mensaje pertenece al pool interested
  expect(MENSAJES_INTERESTED_POOL).toContain(lead.mensaje);

  // Email gmail (interested usa @gmail.com)
  expect(lead.email).toMatch(/@gmail\.com$/);

  // Telefono argentino válido
  expect(lead.telefono).toMatch(/^\+54 9 11 \d{4}-\d{4}$/);

  // Zona pertenece al pool
  expect(ZONAS_POOL).toContain(lead.zona);

  // Presupuesto pertenece al pool
  expect(PRESUPUESTOS_POOL).toContain(lead.presupuesto_usd);

  // Source pertenece al pool
  expect(SOURCES_POOL).toContain(lead.source);

  expect(Array.isArray(lead.property_ids)).toBe(true);

  const analysis = body.analysis as Record<string, unknown>;
  expect(analysis.trust_score).toBe(88);
  expect(analysis.is_spam).toBe(false);
});

// type='spam' → HTTP 200 con lead spam y analysis; campos del lead derivados de pools de spam.
test("returns_200_with_lead_and_analysis_for_spam", async () => {
  mockAnalyseLeadWithAI.mockResolvedValue(SPAM_ANALYSIS_FIXTURE);

  const req = makeReq("POST", { type: "spam" });
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(200);
  const body = res.getBody() as { lead: unknown; analysis: unknown };
  expect(body).toHaveProperty("lead");
  expect(body).toHaveProperty("analysis");

  const lead = body.lead as Record<string, unknown>;
  expect(typeof lead.id).toBe("string");
  expect((lead.id as string).startsWith("sim-")).toBe(true);

  // Mensaje pertenece al pool spam (mensajes cortos / sin contexto)
  expect(MENSAJES_SPAM_POOL).toContain(lead.mensaje);

  // Email tempmail (spam usa @tempmail.org)
  expect(lead.email).toMatch(/@tempmail\.org$/);

  // Telefono inválido fijo para spam
  expect(lead.telefono).toBe("000-0000");

  // Presupuesto siempre 0 para spam
  expect(lead.presupuesto_usd).toBe(0);

  const analysis = body.analysis as Record<string, unknown>;
  expect(analysis.is_spam).toBe(true);
  expect(analysis.trust_score).toBe(5);
});

// type inválido → HTTP 400 (mensaje actualizado para los 3 tipos)
test("returns_400_for_invalid_type", async () => {
  const req = makeReq("POST", { type: "unknown" });
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(400);
  const body = res.getBody() as { error: string };
  expect(body.error).toContain("type must be");
  expect(mockAnalyseLeadWithAI).not.toHaveBeenCalled();
});

// Sin body ahora devuelve 200 con type='random' (default introducido por feature 18).
test("returns_200_when_type_is_missing_default_random", async () => {
  mockAnalyseLeadWithAI.mockResolvedValue(INTERESTED_ANALYSIS_FIXTURE);

  const req = makeReq("POST", {});
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(200);
  const body = res.getBody() as { lead: unknown; analysis: unknown };
  expect(body).toHaveProperty("lead");
  expect(body).toHaveProperty("analysis");
});

// Metodo GET → HTTP 405
test("returns_405_for_GET_method", async () => {
  const req = makeReq("GET", {});
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(405);
  const body = res.getBody() as { error: string };
  expect(body.error).toBe("Method not allowed");
  expect(mockAnalyseLeadWithAI).not.toHaveBeenCalled();
});

// analyseLeadWithAI lanza excepcion → HTTP 500
test("returns_500_when_analyseLeadWithAI_throws", async () => {
  mockAnalyseLeadWithAI.mockRejectedValue(
    new Error("Claude API connection failed"),
  );

  const req = makeReq("POST", { type: "interested" });
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(500);
  const body = res.getBody() as { error: string; detail: string };
  expect(body.error).toBe("Simulation failed");
  expect(body.detail).toContain("Claude API connection failed");
});
