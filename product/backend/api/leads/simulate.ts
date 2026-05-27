/**
 * product/backend/api/leads/simulate.ts
 * Next.js Pages Router handler para POST /api/leads/simulate.
 * Genera un Lead sintetico segun el tipo solicitado e invoca analyseLeadWithAI.
 * Cubre: R1, R2, R3, R4, R5, R6, R7
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

// R1: Estructura de respuesta exitosa
export interface SimulateResponse {
  lead: Lead;
  analysis: LeadAnalysis;
}

// R2: Template "interested" — mensaje >= 120 chars, email gmail, telefono argentino valido
const INTERESTED_TEMPLATE: Omit<Lead, "id"> = {
  mensaje:
    "Hola! Estoy buscando un departamento de 3 ambientes en Palermo o Recoleta. " +
    "Mi presupuesto es de USD 220.000. Necesito mudarme antes de fin de mes porque " +
    "vence mi contrato de alquiler. Preferentemente piso alto con balcon. " +
    "Puedo visitar esta semana.",
  email: "martin.gonzalez87@gmail.com",
  telefono: "+54 9 11 4832-9175",
  zona: "Palermo",
  tipo_propiedad: "departamento",
  presupuesto_usd: 220000,
  property_ids: [],
};

// R3: Template "spam" — mensaje < 30 chars, email tempmail, telefono invalido, zona vacia
const SPAM_TEMPLATE: Omit<Lead, "id"> = {
  mensaje: "comprar casa precio",
  email: "user4823@tempmail.org",
  telefono: "000-0000",
  zona: "",
  tipo_propiedad: null,
  presupuesto_usd: 0,
  property_ids: [],
};

const PROPERTIES_PATH = path.resolve(
  __dirname,
  "../../data/properties_mock.json"
);

// R1: Handler principal
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SimulateResponse | { error: string; detail?: string }>
): Promise<void> {
  // R5: Solo POST permitido
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // R4: Validar type
  const { type } = req.body as { type?: string };
  if (type !== "interested" && type !== "spam") {
    res.status(400).json({ error: "type must be 'interested' or 'spam'" });
    return;
  }

  // R2, R3: Construir Lead sintetico con id unico
  const template = type === "interested" ? INTERESTED_TEMPLATE : SPAM_TEMPLATE;
  const lead: Lead = {
    ...template,
    id: "sim-" + Date.now(),
  };

  try {
    // R6: Cargar catalogo de propiedades
    const properties: Property[] = JSON.parse(
      fs.readFileSync(PROPERTIES_PATH, "utf-8")
    ) as Property[];

    // R6: Pre-filtrar propiedades candidatas e invocar analyseLeadWithAI
    const candidates = filterCandidateProperties(lead, properties);
    const analysis = await analyseLeadWithAI(lead, candidates);

    // R1: Retornar { lead, analysis }
    res.status(200).json({ lead, analysis });
  } catch (err) {
    // R7: Capturar cualquier excepcion y retornar HTTP 500
    const detail = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: "Simulation failed", detail });
  }
}
