# Requirements — ai_scoring_pipeline

> Feature: Pipeline de Análisis con Claude API (JSON estructurado)
> Notación EARS estricta. Cada R<n> es verificable por al menos un test concreto.

---

## R1

El sistema DEBE leer la variable de entorno `ANTHROPIC_API_KEY` para autenticarse con Claude API y NO DEBE aceptar la clave hardcodeada en ningún archivo de código fuente.

## R2

CUANDO `ANTHROPIC_API_KEY` no está definida en el entorno al iniciar el servicio, el sistema DEBE lanzar un error explícito con el mensaje `"ANTHROPIC_API_KEY is not set"` antes de intentar cualquier llamada a la API.

## R3

El sistema DEBE exponer un módulo `product/backend/services/ai_analyser.ts` que exporte una función `analyseLeadWithAI(lead: Lead, matchingProperties: Property[]): Promise<LeadAnalysis>`.

## R4

El sistema DEBE exponer una interfaz TypeScript `LeadAnalysis` en `product/types/lead_analysis.ts` con los campos exactos:
- `trust_score: number` (0–100)
- `conversion_score: number` (0–100)
- `urgency_score: number` (0–100)
- `is_spam: boolean`
- `detected_intent: string`
- `suggested_action: string`
- `ai_summary: string`
- `property_match_ids: string[]`

## R5

CUANDO `analyseLeadWithAI` es invocada, el sistema DEBE enviar a Claude API un system prompt que instruya explícitamente a responder únicamente con un objeto JSON válido que cumpla el esquema de `LeadAnalysis`, sin texto adicional antes ni después del JSON.

## R6

CUANDO `analyseLeadWithAI` es invocada, el sistema DEBE incluir en el prompt de usuario los campos del lead (`mensaje`, `zona`, `tipo_propiedad`, `presupuesto_usd`) y el listado de propiedades candidatas pre-filtradas (`matchingProperties`) serializado como JSON.

## R7

El sistema DEBE pre-filtrar las propiedades del catálogo antes de pasarlas a `analyseLeadWithAI` incluyendo únicamente aquellas cuya `zona` coincida con `lead.zona` O cuyo `tipo` coincida con `lead.tipo_propiedad`.

## R8

CUANDO Claude API devuelve una respuesta, el sistema DEBE intentar parsear el contenido como JSON con `JSON.parse` y validar que todos los campos requeridos de `LeadAnalysis` estén presentes y con el tipo correcto.

## R9

SI el JSON retornado por Claude API no contiene alguno de los campos requeridos de `LeadAnalysis` ENTONCES el sistema DEBE lanzar un error tipado `AIResponseParseError` con el mensaje `"Invalid AI response: missing field <campo>"`.

## R10

SI `JSON.parse` falla sobre la respuesta de Claude API ENTONCES el sistema DEBE lanzar un error tipado `AIResponseParseError` con el mensaje `"Invalid AI response: not valid JSON"`.

## R11

El sistema DEBE exponer un API route en `product/backend/api/leads/analyze.ts` que responda a `POST /api/leads/analyze` con un body JSON que contenga el campo `leadId: string`.

## R12

CUANDO el API route recibe una petición `POST /api/leads/analyze` con un `leadId` válido, el sistema DEBE cargar el lead desde `leads_mock.json`, pre-filtrar propiedades desde `properties_mock.json`, invocar `analyseLeadWithAI` y retornar el objeto `LeadAnalysis` serializado como JSON con status HTTP 200.

## R13

SI el API route recibe una petición con un `leadId` que no existe en `leads_mock.json` ENTONCES el sistema DEBE retornar HTTP 404 con body `{ "error": "Lead not found" }`.

## R14

SI el API route recibe una petición sin el campo `leadId` en el body ENTONCES el sistema DEBE retornar HTTP 400 con body `{ "error": "leadId is required" }`.

## R15

SI `analyseLeadWithAI` lanza cualquier error durante el procesamiento ENTONCES el API route DEBE capturarlo y retornar HTTP 500 con body `{ "error": "Analysis failed", "detail": "<mensaje del error>" }`.

## R16

El sistema DEBE usar el modelo `claude-sonnet-4-6` al llamar a Claude API.

## R17

El sistema DEBE usar el SDK `@anthropic-ai/sdk` para todas las llamadas a Claude API.

## R18

El sistema DEBE contener un archivo `tests/backend/test_ai_pipeline.ts` que valide el contrato de `LeadAnalysis` usando respuestas simuladas (mock) de Claude API, sin realizar llamadas reales a la API externa.

## R19

CUANDO el test de `test_ai_pipeline.ts` ejecuta la función de validación de esquema sobre un objeto `LeadAnalysis` simulado con todos los campos correctos, el sistema DEBE completar sin errores de aserción.

## R20

CUANDO el test de `test_ai_pipeline.ts` ejecuta la función de validación de esquema sobre un objeto con un campo faltante, el sistema DEBE detectar la ausencia y registrar el campo faltante.

## R21

El campo `ai_summary` retornado por Claude DEBE contener entre 2 y 3 oraciones en español resumiendo el perfil del lead y su potencial.

## R22

El campo `property_match_ids` retornado por Claude DEBE contener únicamente IDs que estén presentes en el catálogo `properties_mock.json`.
