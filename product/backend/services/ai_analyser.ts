/**
 * product/backend/services/ai_analyser.ts
 * Servicio de analisis de leads con Claude API.
 * Cubre: R1, R2, R3, R5, R6, R7, R8, R9, R10, R16, R17
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Lead } from '../../types/lead';
import type { Property } from '../../types/property';
import { AIResponseParseError } from '../../types/lead_analysis';
import type { LeadAnalysis } from '../../types/lead_analysis';

// R1, R2: Leer ANTHROPIC_API_KEY desde process.env al inicializar; lanzar error si falta.
const apiKey = process.env['ANTHROPIC_API_KEY'];
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY is not set');
}

const client = new Anthropic({ apiKey });

/**
 * R7: Pre-filtra propiedades del catalogo para el lead.
 * Incluye propiedades cuya zona === lead.zona OR cuyo tipo === lead.tipo_propiedad.
 * Deduplicacion por id.
 * Fallback: primeras 5 propiedades ordenadas por precio_usd ascendente si no hay coincidencias.
 */
export function filterCandidateProperties(lead: Lead, catalog: Property[]): Property[] {
  const seen = new Set<string>();
  const result: Property[] = [];

  for (const prop of catalog) {
    if (prop.zona === lead.zona) {
      if (!seen.has(prop.id)) {
        seen.add(prop.id);
        result.push(prop);
      }
    }
  }

  if (lead.tipo_propiedad !== null) {
    for (const prop of catalog) {
      if (prop.tipo === lead.tipo_propiedad) {
        if (!seen.has(prop.id)) {
          seen.add(prop.id);
          result.push(prop);
        }
      }
    }
  }

  if (result.length === 0) {
    const sorted = [...catalog].sort((a, b) => a.precio_usd - b.precio_usd);
    return sorted.slice(0, 5);
  }

  return result;
}

/**
 * R8, R9, R10: Valida que el objeto raw cumpla el esquema de LeadAnalysis.
 * Lanza AIResponseParseError con mensajes precisos en cada caso de fallo.
 * Exportada para uso en tests sin llamadas reales a la API.
 */
export function validateLeadAnalysis(raw: unknown): LeadAnalysis {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new AIResponseParseError('Invalid AI response: not valid JSON');
  }

  const obj = raw as Record<string, unknown>;

  const numericScoreFields: Array<keyof LeadAnalysis> = [
    'trust_score',
    'conversion_score',
    'urgency_score',
  ];

  for (const field of numericScoreFields) {
    if (!(field in obj)) {
      throw new AIResponseParseError(`Invalid AI response: missing field ${field}`);
    }
    if (typeof obj[field] !== 'number') {
      throw new AIResponseParseError(`Invalid AI response: missing field ${field}`);
    }
    const val = obj[field] as number;
    if (val < 0 || val > 100) {
      throw new AIResponseParseError(`Invalid AI response: ${field} out of range`);
    }
  }

  if (!('is_spam' in obj)) {
    throw new AIResponseParseError('Invalid AI response: missing field is_spam');
  }
  if (typeof obj['is_spam'] !== 'boolean') {
    throw new AIResponseParseError('Invalid AI response: missing field is_spam');
  }

  const stringFields: Array<keyof LeadAnalysis> = [
    'detected_intent',
    'suggested_action',
    'ai_summary',
  ];

  for (const field of stringFields) {
    if (!(field in obj)) {
      throw new AIResponseParseError(`Invalid AI response: missing field ${field}`);
    }
    if (typeof obj[field] !== 'string') {
      throw new AIResponseParseError(`Invalid AI response: missing field ${field}`);
    }
  }

  if (!('property_match_ids' in obj)) {
    throw new AIResponseParseError('Invalid AI response: missing field property_match_ids');
  }
  if (!Array.isArray(obj['property_match_ids'])) {
    throw new AIResponseParseError('Invalid AI response: missing field property_match_ids');
  }

  return {
    trust_score: obj['trust_score'] as number,
    conversion_score: obj['conversion_score'] as number,
    urgency_score: obj['urgency_score'] as number,
    is_spam: obj['is_spam'] as boolean,
    detected_intent: obj['detected_intent'] as string,
    suggested_action: obj['suggested_action'] as string,
    ai_summary: obj['ai_summary'] as string,
    property_match_ids: obj['property_match_ids'] as string[],
  };
}

/**
 * R3, R5, R6, R16, R17: Analiza el lead con Claude API.
 * Construye system prompt y user prompt segun design.md.
 * Llama a claude-sonnet-4-6 via @anthropic-ai/sdk.
 * Parsea y valida la respuesta con validateLeadAnalysis.
 */
export async function analyseLeadWithAI(
  lead: Lead,
  matchingProperties: Property[]
): Promise<LeadAnalysis> {
  // R5: System prompt que instruye JSON estricto sin texto adicional
  const systemPrompt = `Eres un asistente especializado en analisis de leads inmobiliarios.
Tu tarea es analizar el lead y las propiedades candidatas proporcionadas y devolver
UNICAMENTE un objeto JSON valido con exactamente estos campos (sin texto adicional,
sin bloques de codigo markdown, sin explicaciones):

{
  "trust_score": <numero entero 0-100>,
  "conversion_score": <numero entero 0-100>,
  "urgency_score": <numero entero 0-100>,
  "is_spam": <true|false>,
  "detected_intent": "<string: intencion detectada del lead>",
  "suggested_action": "<string: accion recomendada para el agente de ventas>",
  "ai_summary": "<string: 2-3 oraciones en espanol resumiendo el perfil y potencial del lead>",
  "property_match_ids": [<"prop-id1">, <"prop-id2">]
}

Criterios de scoring:
- trust_score: confiabilidad del lead (datos coherentes, email real, mensaje serio).
- conversion_score: probabilidad de cierre (presupuesto claro, urgencia, especificidad).
- urgency_score: senales de urgencia o inmediatez en el mensaje.
- is_spam: true si el mensaje es incoherente, el email es de dominio temporal, o el telefono es invalido.
- property_match_ids: IDs de las propiedades candidatas que mejor coinciden con el perfil del lead.`;

  // R6: User prompt con campos del lead y propiedades candidatas
  const userPrompt = `Analiza el siguiente lead inmobiliario:

LEAD:
${JSON.stringify(
    {
      mensaje: lead.mensaje,
      zona: lead.zona,
      tipo_propiedad: lead.tipo_propiedad,
      presupuesto_usd: lead.presupuesto_usd,
    },
    null,
    2
  )}

PROPIEDADES CANDIDATAS DEL CATALOGO:
${JSON.stringify(matchingProperties, null, 2)}

Devuelve unicamente el objeto JSON de analisis.`;

  // R16, R17: Llamada a claude-sonnet-4-6 via @anthropic-ai/sdk
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  // Extraer texto de la respuesta
  const content = message.content[0];
  if (!content || content.type !== 'text') {
    throw new AIResponseParseError('Invalid AI response: not valid JSON');
  }

  const rawText = content.text.trim();

  // R8, R10: Intentar parsear como JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new AIResponseParseError('Invalid AI response: not valid JSON');
  }

  // R8, R9: Validar esquema
  return validateLeadAnalysis(parsed);
}
