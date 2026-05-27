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
"[project]/product/backend/lib/leadGenerators.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * product/backend/lib/leadGenerators.ts
 * Pools de datos y helpers de generación determinista de leads sintéticos.
 * Cubre: R10, R11, R12, R13, R14, R15, R16, R17, R18.
 *
 * Diseño: ver specs/mock_data_extension_dashboard/design.md.
 * Las fuentes (SOURCES_POOL) provienen literalmente de
 *   ui-ux/lead-trust-dashboard-tokko (3).html (lineas 732-736 y 788-791).
 */ __turbopack_context__.s([
    "AGENCIAS_POOL",
    ()=>AGENCIAS_POOL,
    "DIRECCIONES_POOL",
    ()=>DIRECCIONES_POOL,
    "ESTADOS_POOL",
    ()=>ESTADOS_POOL,
    "MENSAJES_INTERESTED_POOL",
    ()=>MENSAJES_INTERESTED_POOL,
    "MENSAJES_SPAM_POOL",
    ()=>MENSAJES_SPAM_POOL,
    "PRESUPUESTOS_POOL",
    ()=>PRESUPUESTOS_POOL,
    "SOURCES_POOL",
    ()=>SOURCES_POOL,
    "TIPOS_PROPIEDAD_POOL",
    ()=>TIPOS_PROPIEDAD_POOL,
    "ZONAS_POOL",
    ()=>ZONAS_POOL,
    "generateRandomLead",
    ()=>generateRandomLead,
    "pickRandom",
    ()=>pickRandom
]);
const ZONAS_POOL = [
    "Palermo",
    "Belgrano",
    "Recoleta",
    "Caballito",
    "Tigre",
    "Flores",
    "San Isidro",
    "Villa Crespo",
    "Núñez",
    "Devoto",
    "Almagro",
    "Vicente López"
];
const PRESUPUESTOS_POOL = [
    85000,
    95000,
    120000,
    150000,
    175000,
    200000,
    240000,
    300000,
    380000,
    450000
];
const MENSAJES_INTERESTED_POOL = [
    "Hola, quisiera coordinar una visita esta semana, estoy interesado en mudarme cuanto antes.",
    "Me interesa comprar el departamento, tengo el presupuesto aprobado y puedo cerrar rápido.",
    "Estoy buscando una propiedad para mudanza urgente, ¿puedo agendar una visita el sábado?",
    "Hola! Vi la publicación y me interesa. ¿Cuándo podría ver la propiedad?",
    "Tengo interés en la propiedad, necesito mudarme antes de fin de mes. Aviseme horarios disponibles.",
    "Quisiera información sobre la propiedad para una posible compra inmediata. ¿Aceptan créditos hipotecarios?",
    "Buenas, estoy interesado en visitar la propiedad este fin de semana. Llamame cuando puedas.",
    "Hola, ¿sigue disponible la propiedad? Estoy listo para hacer una oferta luego de la visita.",
    "Necesito comprar urgente porque vence mi contrato de alquiler. ¿Coordinamos visita?",
    "Me interesa la propiedad, ya vendí mi anterior departamento y necesito mudarme en 30 días.",
    "Hola, vi el aviso y quiero ir a verla. ¿Hay disponibilidad mañana a la tarde?",
    "Buenas tardes, estoy interesado en agendar visita para la compra de la propiedad publicada."
];
const MENSAJES_SPAM_POOL = [
    "test",
    "demo",
    "asdf",
    "hola",
    "info",
    "precio?",
    "...",
    "FREE PROPERTY INVESTMENT OPPORTUNITY CLICK HERE"
];
const TIPOS_PROPIEDAD_POOL = [
    "departamento",
    "casa",
    "ph",
    "local_comercial",
    "oficina",
    null
];
const SOURCES_POOL = [
    "Zonaprop",
    "Argenprop",
    "WhatsApp",
    "Mail",
    "Mercadolibre",
    "Chat web",
    "Navent"
];
const ESTADOS_POOL = [
    "Nuevo",
    "En revisión",
    "Calificado",
    "Descartado"
];
const AGENCIAS_POOL = [
    "Tokko Realty",
    "RE/MAX Argentina",
    "Inmobiliaria del Plata",
    "Bullrich Propiedades",
    "Toribio Achával",
    "Izrastzoff Estudio Inmobiliario",
    "L. J. Ramos Brokers",
    "Castex Propiedades",
    "Miguel Ludmer Inmobiliaria"
];
const DIRECCIONES_POOL = [
    "Av. Santa Fe 2350",
    "Posadas 1342 Piso 4 Dpto B",
    "Av. Cabildo 1875",
    "Av. Rivadavia 5820",
    "Av. Corrientes 4310",
    "Honduras 5450",
    "Gorriti 4120",
    "Bonpland 1885",
    "Av. Libertador 4450",
    "Soldado de la Independencia 990",
    "Av. Cramer 2310",
    "Charcas 3890"
];
function pickRandom(pool, rng) {
    if (pool.length === 0) {
        throw new Error("pickRandom: pool vacío");
    }
    const r = (rng ?? Math.random)();
    const idx = Math.min(pool.length - 1, Math.floor(r * pool.length));
    return pool[idx];
}
let _counter = 0;
function generateRandomLead(rng, opts) {
    const r = rng ?? Math.random;
    // Decide tipo (interested 80% / spam 20%) salvo que se fuerce.
    const type = opts?.forceType ?? (r() < 0.8 ? "interested" : "spam");
    const mensaje = type === "spam" ? pickRandom(MENSAJES_SPAM_POOL, r) : pickRandom(MENSAJES_INTERESTED_POOL, r);
    const zona = pickRandom(ZONAS_POOL, r);
    const source = pickRandom(SOURCES_POOL, r);
    const estado = pickRandom(ESTADOS_POOL, r);
    const tipo_propiedad = pickRandom(TIPOS_PROPIEDAD_POOL, r);
    const presupuesto_usd = type === "spam" ? 0 : pickRandom(PRESUPUESTOS_POOL, r);
    const agencia = pickRandom(AGENCIAS_POOL, r);
    const direccion_propiedad = pickRandom(DIRECCIONES_POOL, r);
    // id estable y único entre invocaciones consecutivas
    _counter += 1;
    const id = `sim-${Date.now()}-${_counter}`;
    const email = type === "spam" ? `user${Math.floor(r() * 10000)}@tempmail.org` : `lead${Math.floor(r() * 10000)}@gmail.com`;
    const telefono = type === "spam" ? "000-0000" : `+54 9 11 ${Math.floor(r() * 9000 + 1000)}-${Math.floor(r() * 9000 + 1000)}`;
    return {
        id,
        mensaje,
        telefono,
        email,
        zona,
        tipo_propiedad,
        presupuesto_usd,
        property_ids: [],
        source,
        estado,
        created_at: new Date().toISOString(),
        agencia,
        direccion_propiedad
    };
}
}),
"[project]/product/backend/api/leads/simulate.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
 */ __turbopack_context__.s([
    "SIM_RATIO_INTERESTED",
    ()=>SIM_RATIO_INTERESTED,
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$services$2f$ai_analyser$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/backend/services/ai_analyser.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$lib$2f$leadGenerators$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/backend/lib/leadGenerators.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$services$2f$ai_analyser$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$services$2f$ai_analyser$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const SIM_RATIO_INTERESTED = 0.8;
/** Resuelve el tipo concreto a partir del random tirado. */ function pickConcreteType(rand) {
    return rand < SIM_RATIO_INTERESTED ? "interested" : "spam";
}
const PROPERTIES_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["resolve"](process.cwd(), "product/backend/data/properties_mock.json");
async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({
            error: "Method not allowed"
        });
        return;
    }
    // body es opcional ahora: `req.body` puede ser undefined o {}.
    const body = req.body ?? {};
    const requestedType = body.type ?? "random";
    let forceType;
    if (requestedType === "random") {
        forceType = pickConcreteType(Math.random());
    } else if (requestedType === "interested" || requestedType === "spam") {
        forceType = requestedType;
    } else {
        res.status(400).json({
            error: "type must be 'random', 'interested' or 'spam'"
        });
        return;
    }
    try {
        const lead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$lib$2f$leadGenerators$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["generateRandomLead"])(undefined, {
            forceType
        });
        const properties = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](PROPERTIES_PATH, "utf-8"));
        const candidates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$services$2f$ai_analyser$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["filterCandidateProperties"])(lead, properties);
        const analysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$services$2f$ai_analyser$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["analyseLeadWithAI"])(lead, candidates);
        res.status(200).json({
            lead,
            analysis
        });
    } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        res.status(500).json({
            error: "Simulation failed",
            detail
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/api/leads/simulate.ts [api] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
/**
 * pages/api/leads/simulate.ts
 * Re-exporta el handler de product/backend/api/leads/simulate.ts.
 * Conecta el routing de Next.js Pages Router con el codigo de dominio.
 * Cubre: R1
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$simulate$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/backend/api/leads/simulate.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$simulate$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$simulate$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/api/leads/simulate.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$simulate$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$leads$2f$simulate$2e$ts__$5b$api$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/pages/api/leads/simulate.ts [api] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$simulate$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/backend/api/leads/simulate.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$leads$2f$simulate$2e$ts__$5b$api$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$simulate$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$leads$2f$simulate$2e$ts__$5b$api$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$api$2f$leads$2f$simulate$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0nv0zpg._.js.map