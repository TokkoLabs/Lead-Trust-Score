/**
 * product/backend/api/leads/simulate.ts
 * Next.js Pages Router handler para POST /api/leads/simulate.
 *
 * Feature 18 (unified_random_lead_simulator):
 *  - Acepta body opcional `{ type?: 'random' | 'interested' | 'spam' }`.
 *  - Default `type='random'` cuando el body está ausente o `type` es undefined.
 *  - Para `random`, el handler tira Math.random() y elige 'interested' con
 *    probabilidad 0.8 y 'spam' con probabilidad 0.2.
 *  - El lead se genera con `generateRandomLead({ forceType })` del módulo
 *    `product/backend/lib/leadGenerators.ts` (feature 10), que se encarga
 *    de elegir zona/presupuesto/mensaje/tipo_propiedad/source/agencia/
 *    direccion_propiedad desde los pools y de fijar `created_at = now`.
 *
 * El contrato de respuesta `{ lead, analysis }` se mantiene exactamente
 * igual que en la feature 5 (realtime_simulation_trigger).
 */

import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import * as path from "path";
import type { Lead } from "../../../types/lead";
import type { Property } from "../../../types/property";
import type { LeadAnalysis } from "../../../types/lead_analysis";
import {
  filterCandidateProperties,
  analyseLeadWithAI,
} from "../../services/ai_analyser";
import { generateRandomLead } from "../../lib/leadGenerators";

export interface SimulateResponse {
  lead: Lead;
  analysis: LeadAnalysis;
}

export type SimulateType = "random" | "interested" | "spam";

/** Probabilidad de elegir 'interested' cuando type='random'. */
export const SIM_RATIO_INTERESTED = 0.8;

/** Resuelve el tipo concreto a partir del random tirado. */
function pickConcreteType(rand: number): "interested" | "spam" {
  return rand < SIM_RATIO_INTERESTED ? "interested" : "spam";
}

const PROPERTIES_PATH = path.resolve(
  process.cwd(),
  "product/backend/data/properties_mock.json",
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SimulateResponse | { error: string; detail?: string }>,
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // body es opcional ahora: `req.body` puede ser undefined o {}.
  const body = (req.body ?? {}) as { type?: SimulateType };
  const requestedType: SimulateType = body.type ?? "random";

  let forceType: "interested" | "spam";
  if (requestedType === "random") {
    forceType = pickConcreteType(Math.random());
  } else if (
    requestedType === "interested" ||
    requestedType === "spam"
  ) {
    forceType = requestedType;
  } else {
    res
      .status(400)
      .json({ error: "type must be 'random', 'interested' or 'spam'" });
    return;
  }

  try {
    const lead = generateRandomLead(undefined, { forceType });

    const properties: Property[] = JSON.parse(
      fs.readFileSync(PROPERTIES_PATH, "utf-8"),
    ) as Property[];

    const candidates = filterCandidateProperties(lead, properties);
    const analysis = await analyseLeadWithAI(lead, candidates);

    res.status(200).json({ lead, analysis });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: "Simulation failed", detail });
  }
}
