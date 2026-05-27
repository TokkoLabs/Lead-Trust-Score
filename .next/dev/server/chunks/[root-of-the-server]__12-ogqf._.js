module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/product/types/lead_analysis.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * product/types/lead_analysis.ts
 * Interfaz LeadAnalysis — resultado del pipeline de analisis con Claude API.
 * Cubre: R4, R9, R10
 */ __turbopack_context__.s([
    "AIResponseParseError",
    ()=>AIResponseParseError
]);
class AIResponseParseError extends Error {
    constructor(message){
        super(message);
        this.name = 'AIResponseParseError';
    }
}
}),
"[project]/product/backend/services/ai_analyser.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "analyseLeadWithAI",
    ()=>analyseLeadWithAI,
    "filterCandidateProperties",
    ()=>filterCandidateProperties,
    "validateLeadAnalysis",
    ()=>validateLeadAnalysis
]);
/**
 * product/backend/services/ai_analyser.ts
 * Servicio de analisis de leads con Claude API.
 * Cubre: R1, R2, R3, R5, R6, R7, R8, R9, R10, R16, R17
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f40$anthropic$2d$ai$2f$sdk__$5b$external$5d$__$2840$anthropic$2d$ai$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$29$__ = __turbopack_context__.i("[externals]/@anthropic-ai/sdk [external] (@anthropic-ai/sdk, esm_import, [project]/node_modules/@anthropic-ai/sdk)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/types/lead_analysis.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$anthropic$2d$ai$2f$sdk__$5b$external$5d$__$2840$anthropic$2d$ai$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$anthropic$2d$ai$2f$sdk__$5b$external$5d$__$2840$anthropic$2d$ai$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
// R1, R2: Leer ANTHROPIC_API_KEY desde process.env al inicializar; lanzar error si falta.
const apiKey = process.env['ANTHROPIC_API_KEY'];
if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
}
const client = new __TURBOPACK__imported__module__$5b$externals$5d2f40$anthropic$2d$ai$2f$sdk__$5b$external$5d$__$2840$anthropic$2d$ai$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$29$__["default"]({
    apiKey
});
function filterCandidateProperties(lead, catalog) {
    const seen = new Set();
    const result = [];
    for (const prop of catalog){
        if (prop.zona === lead.zona) {
            if (!seen.has(prop.id)) {
                seen.add(prop.id);
                result.push(prop);
            }
        }
    }
    if (lead.tipo_propiedad !== null) {
        for (const prop of catalog){
            if (prop.tipo === lead.tipo_propiedad) {
                if (!seen.has(prop.id)) {
                    seen.add(prop.id);
                    result.push(prop);
                }
            }
        }
    }
    if (result.length === 0) {
        const sorted = [
            ...catalog
        ].sort((a, b)=>a.precio_usd - b.precio_usd);
        return sorted.slice(0, 5);
    }
    return result;
}
function validateLeadAnalysis(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"]('Invalid AI response: not valid JSON');
    }
    const obj = raw;
    const numericScoreFields = [
        'trust_score',
        'conversion_score',
        'urgency_score'
    ];
    for (const field of numericScoreFields){
        if (!(field in obj)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"](`Invalid AI response: missing field ${field}`);
        }
        if (typeof obj[field] !== 'number') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"](`Invalid AI response: missing field ${field}`);
        }
        const val = obj[field];
        if (val < 0 || val > 100) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"](`Invalid AI response: ${field} out of range`);
        }
    }
    if (!('is_spam' in obj)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"]('Invalid AI response: missing field is_spam');
    }
    if (typeof obj['is_spam'] !== 'boolean') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"]('Invalid AI response: missing field is_spam');
    }
    const stringFields = [
        'detected_intent',
        'suggested_action',
        'ai_summary'
    ];
    for (const field of stringFields){
        if (!(field in obj)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"](`Invalid AI response: missing field ${field}`);
        }
        if (typeof obj[field] !== 'string') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"](`Invalid AI response: missing field ${field}`);
        }
    }
    if (!('property_match_ids' in obj)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"]('Invalid AI response: missing field property_match_ids');
    }
    if (!Array.isArray(obj['property_match_ids'])) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"]('Invalid AI response: missing field property_match_ids');
    }
    return {
        trust_score: obj['trust_score'],
        conversion_score: obj['conversion_score'],
        urgency_score: obj['urgency_score'],
        is_spam: obj['is_spam'],
        detected_intent: obj['detected_intent'],
        suggested_action: obj['suggested_action'],
        ai_summary: obj['ai_summary'],
        property_match_ids: obj['property_match_ids']
    };
}
async function analyseLeadWithAI(lead, matchingProperties) {
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
${JSON.stringify({
        mensaje: lead.mensaje,
        zona: lead.zona,
        tipo_propiedad: lead.tipo_propiedad,
        presupuesto_usd: lead.presupuesto_usd
    }, null, 2)}

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
                content: userPrompt
            }
        ]
    });
    // Extraer texto de la respuesta
    const content = message.content[0];
    if (!content || content.type !== 'text') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"]('Invalid AI response: not valid JSON');
    }
    const rawText = content.text.trim();
    // Strip markdown code blocks that Claude sometimes adds despite instructions
    const codeBlockMatch = rawText.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
    const jsonStr = codeBlockMatch ? codeBlockMatch[1].trim() : rawText;
    // R8, R10: Intentar parsear como JSON
    let parsed;
    try {
        parsed = JSON.parse(jsonStr);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$types$2f$lead_analysis$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["AIResponseParseError"]('Invalid AI response: not valid JSON');
    }
    // R8, R9: Validar esquema
    return validateLeadAnalysis(parsed);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/product/backend/api/leads/analyze.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * product/backend/api/leads/analyze.ts
 * Next.js Pages Router handler para POST /api/leads/analyze.
 * Cubre: R11, R12, R13, R14, R15
 */ __turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$services$2f$ai_analyser$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/backend/services/ai_analyser.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$services$2f$ai_analyser$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$services$2f$ai_analyser$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const LEADS_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["resolve"](process.cwd(), 'product/backend/data/leads_mock.json');
const PROPERTIES_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["resolve"](process.cwd(), 'product/backend/data/properties_mock.json');
async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }
    // R14: leadId requerido en el body
    const { leadId } = req.body;
    if (!leadId) {
        res.status(400).json({
            error: 'leadId is required'
        });
        return;
    }
    let leads;
    let properties;
    try {
        leads = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](LEADS_PATH, 'utf-8'));
        properties = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](PROPERTIES_PATH, 'utf-8'));
    } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        res.status(500).json({
            error: 'Analysis failed',
            detail
        });
        return;
    }
    // R13: leadId debe existir en leads_mock.json
    const lead = leads.find((l)=>l.id === leadId);
    if (!lead) {
        res.status(404).json({
            error: 'Lead not found'
        });
        return;
    }
    try {
        // R12: pre-filtrar propiedades e invocar analyseLeadWithAI
        const matchingProperties = (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$services$2f$ai_analyser$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["filterCandidateProperties"])(lead, properties);
        const analysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$services$2f$ai_analyser$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["analyseLeadWithAI"])(lead, matchingProperties);
        res.status(200).json(analysis);
    } catch (err) {
        // R15: capturar cualquier error y retornar HTTP 500
        const detail = err instanceof Error ? err.message : String(err);
        res.status(500).json({
            error: 'Analysis failed',
            detail
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/api/leads/analyze.ts [api] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
/**
 * pages/api/leads/analyze.ts
 * Re-exporta el handler de product/backend/api/leads/analyze.ts.
 * Esto conecta el routing de Next.js Pages Router con el codigo de dominio.
 * Cubre: R11
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$analyze$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/backend/api/leads/analyze.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$analyze$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$analyze$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/api/leads/analyze.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$analyze$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$leads$2f$analyze$2e$ts__$5b$api$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/pages/api/leads/analyze.ts [api] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$analyze$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/backend/api/leads/analyze.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$leads$2f$analyze$2e$ts__$5b$api$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$analyze$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$leads$2f$analyze$2e$ts__$5b$api$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$analyze$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__12-ogqf._.js.map