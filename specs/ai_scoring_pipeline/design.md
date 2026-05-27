# Design — ai_scoring_pipeline

> Feature: Pipeline de Análisis con Claude API (JSON estructurado)
> Documenta CÓMO se construirá; no contiene código de implementación.

---

## Archivos a crear

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `product/types/lead_analysis.ts` | TypeScript | Interfaz `LeadAnalysis` y clase de error `AIResponseParseError` |
| `product/backend/services/ai_analyser.ts` | TypeScript | Función `analyseLeadWithAI` + helpers de validación y pre-filtrado |
| `product/backend/api/leads/analyze.ts` | TypeScript | Next.js API route handler para `POST /api/leads/analyze` |
| `tests/backend/test_ai_pipeline.ts` | TypeScript | Suite de tests con mock de la respuesta de Claude |

### Archivos a no modificar

Los archivos de F1 (`product/types/lead.ts`, `product/types/property.ts`, `product/backend/data/*.json`) se consumen como dependencias de solo lectura.

---

## Router: Pages Router vs App Router

Se usa **Next.js Pages Router** (`pages/api/...`) porque:

1. El proyecto arranca en un hackathon de 6 horas; Pages Router es más directo de configurar en `product/backend/api/`.
2. La convención del arnés mapea `product/backend/api/leads/analyze.ts` al path de URL `POST /api/leads/analyze`, lo cual es convencional con Pages Router sin configuración adicional de rutas.
3. App Router exigiría `export async function POST(req: Request)` con la nueva API de `NextRequest` y necesita directivas de segmento (`export const runtime = 'nodejs'`), añadiendo fricción sin beneficio para un demo de un solo endpoint.

El archivo vive en `product/backend/api/leads/analyze.ts` y debe ser copiado o enlazado desde `pages/api/leads/analyze.ts` al construir la app Next.js. La convención de carpetas del arnés mantiene el código de dominio en `product/backend/`; el `pages/` es la capa de routing de Next.js que importa desde allí.

> Alternativa descartada: ver sección al final.

---

## Firmas nuevas

### `product/types/lead_analysis.ts`

```typescript
export interface LeadAnalysis {
  trust_score: number;
  conversion_score: number;
  urgency_score: number;
  is_spam: boolean;
  detected_intent: string;
  suggested_action: string;
  ai_summary: string;
  property_match_ids: string[];
}

export class AIResponseParseError extends Error {
  constructor(message: string) { super(message); this.name = 'AIResponseParseError'; }
}
```

### `product/backend/services/ai_analyser.ts`

```typescript
// Dependencias: @anthropic-ai/sdk, product/types/lead.ts, product/types/property.ts, product/types/lead_analysis.ts

export function filterCandidateProperties(lead: Lead, catalog: Property[]): Property[]

export async function analyseLeadWithAI(
  lead: Lead,
  matchingProperties: Property[]
): Promise<LeadAnalysis>

function validateLeadAnalysis(raw: unknown): LeadAnalysis  // lanza AIResponseParseError
```

### `product/backend/api/leads/analyze.ts`

```typescript
// Next.js Pages Router handler
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void>
```

---

## Estrategia de prompt para forzar JSON estricto

Se usa un **system prompt con instrucción de JSON estricto** en lugar de `tool_use`.

Razón: `tool_use` (function calling) de Claude es la opción más robusta para producción, pero requiere definir el schema como JSON Schema completo, lo que añade ~50 líneas de boilerplate. Para un demo de hackathon, un system prompt bien redactado con la instrucción `"Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional"` es suficiente y más rápido de mantener.

La validación post-parse en `validateLeadAnalysis` actúa como red de seguridad ante cualquier desviación del formato.

### Estructura del system prompt

```
Eres un asistente especializado en análisis de leads inmobiliarios.
Tu tarea es analizar el lead y las propiedades candidatas proporcionadas y devolver
ÚNICAMENTE un objeto JSON válido con exactamente estos campos (sin texto adicional,
sin bloques de código markdown, sin explicaciones):

{
  "trust_score": <número entero 0-100>,
  "conversion_score": <número entero 0-100>,
  "urgency_score": <número entero 0-100>,
  "is_spam": <true|false>,
  "detected_intent": "<string: intención detectada del lead>",
  "suggested_action": "<string: acción recomendada para el agente de ventas>",
  "ai_summary": "<string: 2-3 oraciones en español resumiendo el perfil y potencial del lead>",
  "property_match_ids": [<"prop-id1">, <"prop-id2">]
}

Criterios de scoring:
- trust_score: confiabilidad del lead (datos coherentes, email real, mensaje serio).
- conversion_score: probabilidad de cierre (presupuesto claro, urgencia, especificidad).
- urgency_score: señales de urgencia o inmediatez en el mensaje.
- is_spam: true si el mensaje es incoherente, el email es de dominio temporal, o el teléfono es inválido.
- property_match_ids: IDs de las propiedades candidatas que mejor coinciden con el perfil del lead.
```

### Estructura del user prompt

```
Analiza el siguiente lead inmobiliario:

LEAD:
{
  "mensaje": "<lead.mensaje>",
  "zona": "<lead.zona>",
  "tipo_propiedad": "<lead.tipo_propiedad>",
  "presupuesto_usd": <lead.presupuesto_usd>
}

PROPIEDADES CANDIDATAS DEL CATÁLOGO:
<JSON.stringify(matchingProperties, null, 2)>

Devuelve únicamente el objeto JSON de análisis.
```

---

## Estrategia de cross-reference

`filterCandidateProperties(lead, catalog)` aplica el siguiente criterio:

1. Incluye toda propiedad donde `property.zona === lead.zona` (coincidencia exacta de zona).
2. Incluye toda propiedad donde `property.tipo === lead.tipo_propiedad` (coincidencia de tipo), siempre que `lead.tipo_propiedad !== null`.
3. Aplica deduplicación por `property.id`.
4. Si el resultado está vacío (ninguna coincidencia), devuelve las primeras 5 propiedades del catálogo ordenadas por `precio_usd` ascendente como fallback, para que el modelo siempre tenga contexto.

Este filtro reduce el tamaño del contexto enviado a Claude, lo que mejora la calidad de `property_match_ids` y reduce costo de tokens.

---

## Manejo de errores

| Escenario | Comportamiento |
|-----------|---------------|
| `ANTHROPIC_API_KEY` no definida | Error en tiempo de inicialización del módulo, antes de cualquier llamada |
| Claude devuelve texto no-JSON | `AIResponseParseError("Invalid AI response: not valid JSON")` |
| Claude devuelve JSON con campo faltante | `AIResponseParseError("Invalid AI response: missing field <campo>")` |
| Campo numérico fuera del rango 0–100 | `AIResponseParseError("Invalid AI response: <campo> out of range")` |
| Error de red / timeout de la API | Burbujea el error nativo del SDK; el API route lo captura con HTTP 500 |
| `leadId` no encontrado | HTTP 404 desde el API route |
| `leadId` ausente en body | HTTP 400 desde el API route |

---

## Estructura del test (tests/backend/test_ai_pipeline.ts)

El archivo de test NO llama a la API real. Mockea la respuesta de Claude interceptando el SDK o pasando directamente un objeto `LeadAnalysis` simulado a la función de validación.

### Estrategia de mock

Se extrae la función de validación `validateLeadAnalysis` como una función pura exportada desde `ai_analyser.ts`. El test la importa y le pasa objetos construidos manualmente, evitando cualquier llamada de red.

### Casos de test

| Nombre | Descripción | R<n> cubierto |
|--------|-------------|---------------|
| `test_valid_response` | Objeto con todos los campos correctos no lanza error | R4, R8, R19 |
| `test_missing_trust_score` | Objeto sin `trust_score` lanza `AIResponseParseError` con mensaje correcto | R9, R20 |
| `test_missing_is_spam` | Objeto sin `is_spam` lanza `AIResponseParseError` | R9, R20 |
| `test_missing_property_match_ids` | Objeto sin `property_match_ids` lanza `AIResponseParseError` | R9, R20 |
| `test_invalid_json_string` | Cadena no-JSON lanza `AIResponseParseError` | R10 |
| `test_score_out_of_range` | `trust_score: 150` lanza `AIResponseParseError` | R9 |
| `test_filter_by_zona` | `filterCandidateProperties` devuelve solo propiedades de la zona del lead | R7 |
| `test_filter_by_tipo` | `filterCandidateProperties` devuelve propiedades del tipo del lead | R7 |
| `test_filter_fallback` | Sin coincidencias, devuelve hasta 5 propiedades del catálogo | R7 |

Los tests se ejecutan secuencialmente con `assert` nativo de Node.js (sin framework externo), siguiendo el patrón establecido en F1 (`test_data.ts`).

---

## Alternativa descartada: App Router (`app/api/leads/analyze/route.ts`)

**Por qué se consideró:** App Router es la dirección oficial de Next.js desde v13.4 y permite `export async function POST`.

**Por qué se descartó:**
1. Requiere mover la convención de carpetas del arnés (`product/backend/api/`) a `app/api/`, lo que rompe el mapeo establecido.
2. El runtime de Node.js en App Router requiere declaración explícita (`export const runtime = 'nodejs'`) para usar `fs` o variables de entorno del servidor; aumenta la superficie de error en un demo.
3. Pages Router funciona de forma idéntica para un endpoint REST simple y es más familiar para el perfil del implementer en un hackathon de corta duración.
4. Migrar a App Router es un cambio estructural de la app, no una decisión de esta feature.
