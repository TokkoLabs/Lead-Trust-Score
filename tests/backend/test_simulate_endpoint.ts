/**
 * tests/backend/test_simulate_endpoint.ts
 * Tests para el handler POST /api/leads/simulate.
 * Mock de analyseLeadWithAI — sin llamadas reales a Claude API.
 * Cubre: R1, R2, R3, R4, R5, R6, R7, R20
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

// Fixture de LeadAnalysis para leads interesados
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

// Fixture de LeadAnalysis para spam
const SPAM_ANALYSIS_FIXTURE: LeadAnalysis = {
  trust_score: 5,
  conversion_score: 2,
  urgency_score: 1,
  is_spam: true,
  detected_intent: "Intencion vaga o inexistente",
  suggested_action: "Descartar lead como spam.",
  ai_summary: "El lead presenta multiples senales de spam: email temporal, telefono invalido y mensaje sin contexto.",
  property_match_ids: [],
};

// Helper: crear mock de NextApiRequest
function makeReq(
  method: string,
  body: Record<string, unknown>
): NextApiRequest {
  return {
    method,
    body,
    headers: {},
    query: {},
  } as unknown as NextApiRequest;
}

// Helper: crear mock de NextApiResponse con captura de status y json
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

// R1, R2, R6, R20: type "interested" → HTTP 200 con lead y analysis
test("returns_200_with_lead_and_analysis_for_interested", async () => {
  mockAnalyseLeadWithAI.mockResolvedValue(INTERESTED_ANALYSIS_FIXTURE);

  const req = makeReq("POST", { type: "interested" });
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(200);
  const body = res.getBody() as { lead: unknown; analysis: unknown };
  expect(body).toHaveProperty("lead");
  expect(body).toHaveProperty("analysis");

  // R2: Verificar campos del lead interesado
  const lead = body.lead as Record<string, unknown>;
  expect(lead.id).toMatch(/^sim-\d+$/);
  expect(typeof lead.mensaje).toBe("string");
  expect((lead.mensaje as string).length).toBeGreaterThanOrEqual(120);
  expect(lead.email).toMatch(/@(gmail\.com|hotmail\.com)$/);
  expect(lead.telefono).toMatch(/^\+54 9 11 \d{4}-\d{4}$/);
  expect(lead.zona).toBe("Palermo");
  expect(lead.tipo_propiedad).toBe("departamento");
  expect(lead.presupuesto_usd).toBeGreaterThanOrEqual(150000);
  expect(lead.presupuesto_usd).toBeLessThanOrEqual(500000);
  expect(Array.isArray(lead.property_ids)).toBe(true);

  // R6: analysis presente y con campos correctos
  const analysis = body.analysis as Record<string, unknown>;
  expect(analysis.trust_score).toBe(88);
  expect(analysis.is_spam).toBe(false);
});

// R1, R3, R6, R20: type "spam" → HTTP 200 con lead spam y analysis
test("returns_200_with_lead_and_analysis_for_spam", async () => {
  mockAnalyseLeadWithAI.mockResolvedValue(SPAM_ANALYSIS_FIXTURE);

  const req = makeReq("POST", { type: "spam" });
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(200);
  const body = res.getBody() as { lead: unknown; analysis: unknown };
  expect(body).toHaveProperty("lead");
  expect(body).toHaveProperty("analysis");

  // R3: Verificar campos del lead spam
  const lead = body.lead as Record<string, unknown>;
  expect(lead.id).toMatch(/^sim-\d+$/);
  expect(typeof lead.mensaje).toBe("string");
  expect((lead.mensaje as string).length).toBeLessThan(30);
  expect(lead.email).toMatch(/@(tempmail\.org|guerrillamail\.com|mailinator\.com)$/);
  expect(lead.telefono).toBe("000-0000");
  expect(lead.zona).toBe("");
  expect(lead.tipo_propiedad).toBeNull();
  expect(lead.presupuesto_usd).toBe(0);

  // R6: analysis presente
  const analysis = body.analysis as Record<string, unknown>;
  expect(analysis.is_spam).toBe(true);
  expect(analysis.trust_score).toBe(5);
});

// R4, R20: type invalido → HTTP 400
test("returns_400_for_invalid_type", async () => {
  const req = makeReq("POST", { type: "unknown" });
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(400);
  const body = res.getBody() as { error: string };
  expect(body.error).toBe("type must be 'interested' or 'spam'");
  expect(mockAnalyseLeadWithAI).not.toHaveBeenCalled();
});

// R4, R20: type ausente → HTTP 400
test("returns_400_when_type_is_missing", async () => {
  const req = makeReq("POST", {});
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(400);
  const body = res.getBody() as { error: string };
  expect(body.error).toBe("type must be 'interested' or 'spam'");
});

// R5, R20: metodo GET → HTTP 405
test("returns_405_for_GET_method", async () => {
  const req = makeReq("GET", {});
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(405);
  const body = res.getBody() as { error: string };
  expect(body.error).toBe("Method not allowed");
  expect(mockAnalyseLeadWithAI).not.toHaveBeenCalled();
});

// R7, R20: analyseLeadWithAI lanza excepcion → HTTP 500
test("returns_500_when_analyseLeadWithAI_throws", async () => {
  mockAnalyseLeadWithAI.mockRejectedValue(
    new Error("Claude API connection failed")
  );

  const req = makeReq("POST", { type: "interested" });
  const res = makeRes();

  await handler(req, res);

  expect(res.getStatus()).toBe(500);
  const body = res.getBody() as { error: string; detail: string };
  expect(body.error).toBe("Simulation failed");
  expect(body.detail).toContain("Claude API connection failed");
});
