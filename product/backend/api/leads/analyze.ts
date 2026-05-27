/**
 * product/backend/api/leads/analyze.ts
 * Next.js Pages Router handler para POST /api/leads/analyze.
 * Cubre: R11, R12, R13, R14, R15
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import type { Lead } from '../../../types/lead';
import type { Property } from '../../../types/property';
import type { LeadAnalysis } from '../../../types/lead_analysis';
import { filterCandidateProperties, analyseLeadWithAI } from '../../services/ai_analyser';

const LEADS_PATH = path.resolve(__dirname, '../../data/leads_mock.json');
const PROPERTIES_PATH = path.resolve(__dirname, '../../data/properties_mock.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeadAnalysis | { error: string; detail?: string }>
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // R14: leadId requerido en el body
  const { leadId } = req.body as { leadId?: string };
  if (!leadId) {
    res.status(400).json({ error: 'leadId is required' });
    return;
  }

  let leads: Lead[];
  let properties: Property[];

  try {
    leads = JSON.parse(fs.readFileSync(LEADS_PATH, 'utf-8')) as Lead[];
    properties = JSON.parse(fs.readFileSync(PROPERTIES_PATH, 'utf-8')) as Property[];
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: 'Analysis failed', detail });
    return;
  }

  // R13: leadId debe existir en leads_mock.json
  const lead = leads.find((l) => l.id === leadId);
  if (!lead) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }

  try {
    // R12: pre-filtrar propiedades e invocar analyseLeadWithAI
    const matchingProperties = filterCandidateProperties(lead, properties);
    const analysis = await analyseLeadWithAI(lead, matchingProperties);
    res.status(200).json(analysis);
  } catch (err) {
    // R15: capturar cualquier error y retornar HTTP 500
    const detail = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: 'Analysis failed', detail });
  }
}
