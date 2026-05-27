module.exports = [
"[project]/product/frontend/lib/scoreUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeLocalScore",
    ()=>computeLocalScore
]);
function computeLocalScore(lead) {
    let score = 0;
    // Presupuesto (hasta 40 pts)
    if (lead.presupuesto_usd >= 300000) score += 40;
    else if (lead.presupuesto_usd >= 100000) score += 30;
    else if (lead.presupuesto_usd >= 50000) score += 20;
    else if (lead.presupuesto_usd >= 20000) score += 10;
    // <20000 → 0 pts
    // Longitud del mensaje (hasta 30 pts, proxy de intención detallada)
    if (lead.mensaje.length >= 100) score += 30;
    else if (lead.mensaje.length >= 50) score += 20;
    else if (lead.mensaje.length >= 20) score += 10;
    // <20 → 0 pts
    // Propiedades referenciadas (hasta 20 pts)
    if (lead.property_ids.length >= 3) score += 20;
    else if (lead.property_ids.length >= 1) score += 10;
    // Tipo de propiedad definido (10 pts)
    if (lead.tipo_propiedad !== null) score += 10;
    const trust_score = Math.min(100, score);
    const urgency = trust_score >= 70 ? "Alta" : trust_score >= 40 ? "Media" : "Baja";
    return {
        lead,
        trust_score,
        urgency
    };
}
}),
"[project]/product/frontend/hooks/useLeadAnalysis.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLeadAnalysis",
    ()=>useLeadAnalysis
]);
// product/frontend/hooks/useLeadAnalysis.ts
// Hook para llamar POST /api/leads/analyze y gestionar loading/error/data.
// Cubre: R11, R12, R13, R14, R15
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
function useLeadAnalysis(leadId) {
    const [analysis, setAnalysis] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Reset siempre que cambia el leadId (R15)
        setAnalysis(null);
        setError(null);
        if (!leadId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true); // R13
        const controller = new AbortController();
        fetch("/api/leads/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                leadId
            }),
            signal: controller.signal
        }).then(async (res)=>{
            if (!res.ok) {
                // R14: error con mensaje de la respuesta
                const text = await res.text();
                throw new Error(text || `HTTP ${res.status}`);
            }
            return res.json();
        }).then((data)=>{
            setAnalysis(data); // R12
            setIsLoading(false);
        }).catch((err)=>{
            if (err.name === "AbortError") return;
            setError(err.message); // R14
            setIsLoading(false);
        });
        return ()=>controller.abort();
    }, [
        leadId
    ]);
    return {
        analysis,
        isLoading,
        error
    };
}
}),
"[project]/product/frontend/components/LeadCard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeadCard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function getTrustScoreBadgeClass(score) {
    if (score > 75) return "bg-green-500 text-white";
    if (score >= 40) return "bg-yellow-400 text-gray-900";
    return "bg-red-500 text-white";
}
function getUrgencyTagClass(score) {
    if (score > 75) return "bg-green-700 text-green-100";
    if (score >= 40) return "bg-yellow-600 text-yellow-100";
    return "bg-red-700 text-red-100";
}
function LeadCard({ item, onSelect, isSelected, isNew = false }) {
    const { lead, trust_score, urgency } = item;
    const badgeClass = getTrustScoreBadgeClass(trust_score);
    const urgencyTagClass = getUrgencyTagClass(trust_score);
    // R18: aplicar animate-enter durante los primeros 600ms cuando isNew es true
    const [showEnter, setShowEnter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(isNew);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!isNew) return;
        setShowEnter(true);
        const timer = setTimeout(()=>setShowEnter(false), 600);
        return ()=>clearTimeout(timer);
    }, [
        isNew
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
        className: `bg-gray-800 rounded-lg p-4 flex items-center justify-between gap-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer${isSelected ? " ring-2 ring-blue-500" : ""}${showEnter ? " animate-enter" : ""}`,
        onClick: ()=>onSelect?.(lead.id),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-sm font-semibold text-white truncate",
                        children: lead.id
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadCard.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-400 mt-1 truncate",
                        children: [
                            lead.zona,
                            lead.tipo_propiedad ? ` · ${lead.tipo_propiedad}` : "",
                            lead.presupuesto_usd > 0 ? ` · $${lead.presupuesto_usd.toLocaleString()} USD` : ""
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/LeadCard.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadCard.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: `w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${badgeClass}`,
                        "aria-label": `Trust Score ${trust_score}`,
                        children: trust_score
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadCard.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: `rounded px-2 py-0.5 text-xs font-semibold ${urgencyTagClass}`,
                        children: urgency
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadCard.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadCard.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/LeadCard.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/LeadsFeed.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeadsFeed
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$LeadCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/LeadCard.tsx [ssr] (ecmascript)");
;
;
function LeadsFeed({ items, onSelectLead, selectedLeadId, newLeadId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
        className: "space-y-3",
        children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$LeadCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                item: item,
                onSelect: onSelectLead,
                isSelected: selectedLeadId === item.lead.id,
                isNew: item.lead.id === newLeadId
            }, item.lead.id, false, {
                fileName: "[project]/product/frontend/components/LeadsFeed.tsx",
                lineNumber: 16,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/product/frontend/components/LeadsFeed.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/LeadDetailPanel.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// product/frontend/components/LeadDetailPanel.tsx
// Panel de detalle con Trust Score badge, barras de progreso, análisis IA,
// acción recomendada y propiedades coincidentes.
// Cubre: R1, R2, R3, R4, R5, R6, R7, R8, R9, R10
__turbopack_context__.s([
    "default",
    ()=>LeadDetailPanel
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function getTrustScoreBadgeColor(score) {
    if (score > 75) return "bg-green-500";
    if (score >= 40) return "bg-yellow-400";
    return "bg-red-500";
}
// --- Skeleton/shimmer (R2) ---
function Skeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "animate-pulse space-y-6",
        "data-testid": "skeleton",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "w-24 h-24 rounded-full bg-gray-700"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-gray-700 rounded w-1/4"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-2 bg-gray-700 rounded"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-gray-700 rounded w-1/4 mt-2"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-2 bg-gray-700 rounded"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-gray-700 rounded w-1/3"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-gray-700 rounded"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-gray-700 rounded w-5/6"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-gray-700 rounded w-4/6"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
function ProgressBar({ label, score }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "space-y-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex justify-between text-sm text-gray-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        children: score
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "w-full bg-gray-700 rounded-full h-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "h-2 rounded-full bg-blue-500 transition-all duration-700",
                    style: {
                        width: `${score}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
function LeadDetailPanel({ lead, analysis, isLoading, properties }) {
    // --- Header ---
    const header = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "border-b border-gray-700 pb-4 mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-lg font-bold text-white",
                children: lead.id
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-400 mt-1",
                children: [
                    lead.zona,
                    lead.tipo_propiedad ? ` · ${lead.tipo_propiedad}` : ""
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
    // --- Skeleton state (R2) ---
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "bg-gray-900 rounded-xl p-6 h-full overflow-y-auto",
            children: [
                header,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Skeleton, {}, void 0, false, {
                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, this);
    }
    // --- Empty state ---
    if (!analysis) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "bg-gray-900 rounded-xl p-6 h-full overflow-y-auto",
            children: [
                header,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-gray-500 text-sm",
                    children: "Selecciona un lead para ver el análisis."
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
            lineNumber: 103,
            columnNumber: 7
        }, this);
    }
    // --- Badge color (R3) ---
    const badgeColor = getTrustScoreBadgeColor(analysis.trust_score);
    // --- Matched properties (R9, R10) ---
    const matchedProperties = properties.filter((p)=>analysis.property_match_ids.includes(p.id));
    // --- Copy action (R8) ---
    const handleCopy = ()=>{
        navigator.clipboard.writeText(analysis.suggested_action);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "bg-gray-900 rounded-xl p-6 h-full overflow-y-auto space-y-6",
        children: [
            header,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: `w-24 h-24 rounded-full flex items-center justify-center ${badgeColor}`,
                    "aria-label": `Trust Score ${analysis.trust_score}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-3xl font-bold text-white",
                        children: analysis.trust_score
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                    lineNumber: 131,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ProgressBar, {
                        label: "Conversión",
                        score: analysis.conversion_score
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ProgressBar, {
                        label: "Urgencia",
                        score: analysis.urgency_score
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-gray-300 mb-2",
                        children: "Análisis IA"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-200 leading-relaxed",
                        children: analysis.ai_summary
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-gray-300 mb-2",
                        children: "Acción Recomendada"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-200 flex-1",
                                children: analysis.suggested_action
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: handleCopy,
                                className: "text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors flex-shrink-0",
                                children: "Copiar"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-gray-300 mb-2",
                        children: "Propiedades Coincidentes"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    matchedProperties.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500",
                        children: "Sin propiedades coincidentes"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                        className: "space-y-2",
                        children: matchedProperties.map((prop)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                className: "bg-gray-800 rounded-lg p-3 border border-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-white",
                                        children: prop.titulo
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                        lineNumber: 189,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-400 mt-1",
                                        children: [
                                            prop.zona,
                                            " · ",
                                            prop.tipo,
                                            " · $",
                                            prop.precio_usd.toLocaleString(),
                                            " USD"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                        lineNumber: 192,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, prop.id, true, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 185,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/SimulatorPanel.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SimulatorPanel
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
/**
 * product/frontend/components/SimulatorPanel.tsx
 * Panel con dos botones de simulacion de leads.
 * Cubre: R8, R9, R10, R11, R12
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function SimulatorPanel({ onLeadSimulated, disabled = false }) {
    // R9: Estado de carga y error
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // R10, R11: Funcion generica de simulacion
    async function simulate(type) {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/leads/simulate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type
                })
            });
            // R12: Error HTTP distinto de 200
            if (!res.ok) {
                const body = await res.json().catch(()=>({}));
                setError(body.error ?? `Error ${res.status}`);
                return;
            }
            // R10, R11: Invocar callback con resultado
            const result = await res.json();
            onLeadSimulated(result);
        } catch (err) {
            // R12: Error de red
            setError(err instanceof Error ? err.message : "Error de red");
        } finally{
            setLoading(false);
        }
    }
    const isDisabled = loading || disabled;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                className: "text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3",
                children: "Simulador de Demo"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/SimulatorPanel.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex gap-3 items-center flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>void simulate("interested"),
                        disabled: isDisabled,
                        className: "bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
                        children: "Simular Lead Interesado"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/SimulatorPanel.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>void simulate("spam"),
                        disabled: isDisabled,
                        className: "bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
                        children: "Simular Lead Spam"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/SimulatorPanel.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-sm text-gray-400",
                        children: "Simulando..."
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/SimulatorPanel.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/SimulatorPanel.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "mt-2 text-sm text-red-400",
                role: "alert",
                children: [
                    "Error: ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/SimulatorPanel.tsx",
                lineNumber: 96,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/SimulatorPanel.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/backend/data/leads_mock.json.[json].cjs [ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "lead-01",
        "mensaje": "Hola, estoy buscando un departamento de 2 o 3 ambientes en Palermo o Belgrano, idealmente con balcon y cerca del subte. Tengo listo el presupuesto para cerrar rapido.",
        "telefono": "+54 11 4523-7890",
        "email": "martin.garcia@gmail.com",
        "zona": "Palermo",
        "tipo_propiedad": "departamento",
        "presupuesto_usd": 130000,
        "property_ids": [
            "prop-01",
            "prop-07"
        ]
    },
    {
        "id": "lead-02",
        "mensaje": "Busco casa en zona norte GBA con pileta y jardin para familia de 5 personas. Tengo precalificacion bancaria y puedo firmar escritura en 60 dias. Preferencia por San Isidro o Tigre.",
        "telefono": "+54 11 6078-3412",
        "email": "claudia.benitez@outlook.com",
        "zona": "San Isidro",
        "tipo_propiedad": "casa",
        "presupuesto_usd": 450000,
        "property_ids": [
            "prop-06",
            "prop-11"
        ]
    },
    {
        "id": "lead-03",
        "mensaje": "Me interesa comprar un PH duplex con patio o terraza en Caballito o Flores. Busco algo con buen estado de conservacion, minimo 3 ambientes. Precio hasta 200k USD.",
        "telefono": "+54 11 5534-2198",
        "email": "rodrigo.perez@hotmail.com",
        "zona": "Caballito",
        "tipo_propiedad": "ph",
        "presupuesto_usd": 200000,
        "property_ids": [
            "prop-03",
            "prop-09"
        ]
    },
    {
        "id": "lead-04",
        "mensaje": "Necesito alquilar una oficina corporativa en Belgrano o Recoleta para mi equipo de 8 personas. Requiero sala de reuniones y estacionamiento. Presupuesto mensual 1500 USD.",
        "telefono": "+54 11 4711-9025",
        "email": "patricia.romero@empresa.com.ar",
        "zona": "Belgrano",
        "tipo_propiedad": "oficina",
        "presupuesto_usd": 1500,
        "property_ids": [
            "prop-08"
        ]
    },
    {
        "id": "lead-05",
        "mensaje": "Quiero comprar un local comercial en Palermo o Villa Crespo para abrir un restaurante. El local debe tener minimo 40 m2, frente a calle transitada y habilitacion gastronómica posible.",
        "telefono": "+54 11 3378-6640",
        "email": "sebastian.morales@yahoo.com",
        "zona": "Villa Crespo",
        "tipo_propiedad": "local_comercial",
        "presupuesto_usd": 95000,
        "property_ids": [
            "prop-04",
            "prop-12"
        ]
    },
    {
        "id": "lead-06",
        "mensaje": "info dpto",
        "telefono": "+54 11 2200-0001",
        "email": "juan@gmail.com",
        "zona": "Palermo",
        "tipo_propiedad": "departamento",
        "presupuesto_usd": 0,
        "property_ids": [
            "prop-01"
        ]
    },
    {
        "id": "lead-07",
        "mensaje": "precio?",
        "telefono": "+54 11 1100-5555",
        "email": "ana@hotmail.com",
        "zona": "Belgrano",
        "tipo_propiedad": "casa",
        "presupuesto_usd": 0,
        "property_ids": [
            "prop-02"
        ]
    },
    {
        "id": "lead-08",
        "mensaje": "alquiler",
        "telefono": "+54 11 4400-8800",
        "email": "pedro@yahoo.com.ar",
        "zona": "Caballito",
        "tipo_propiedad": "departamento",
        "presupuesto_usd": 0,
        "property_ids": [
            "prop-10"
        ]
    },
    {
        "id": "lead-09",
        "mensaje": "necesito casa",
        "telefono": "+54 11 7700-4400",
        "email": "lucas@live.com",
        "zona": "Tigre",
        "tipo_propiedad": "casa",
        "presupuesto_usd": 0,
        "property_ids": [
            "prop-11"
        ]
    },
    {
        "id": "lead-10",
        "mensaje": "local disponible",
        "telefono": "+54 11 9900-3300",
        "email": "carlos@icloud.com",
        "zona": "Flores",
        "tipo_propiedad": "local_comercial",
        "presupuesto_usd": 0,
        "property_ids": [
            "prop-04"
        ]
    },
    {
        "id": "lead-11",
        "mensaje": "comprar propiedad urgente oferta",
        "telefono": "123",
        "email": "winner2025@mailinator.com",
        "zona": "Recoleta",
        "tipo_propiedad": "departamento",
        "presupuesto_usd": 0,
        "property_ids": [
            "prop-05"
        ]
    },
    {
        "id": "lead-12",
        "mensaje": "FREE PROPERTY INVESTMENT OPPORTUNITY CLICK HERE",
        "telefono": "abc-xyz",
        "email": "promo@tempmail.com",
        "zona": "Palermo",
        "tipo_propiedad": null,
        "presupuesto_usd": 0,
        "property_ids": [
            "prop-01"
        ]
    },
    {
        "id": "lead-13",
        "mensaje": "quiero casa jardin piscina mejor precio contactame ya",
        "telefono": "99",
        "email": "notreal@guerrillamail.com",
        "zona": "San Isidro",
        "tipo_propiedad": "casa",
        "presupuesto_usd": 0,
        "property_ids": [
            "prop-06"
        ]
    },
    {
        "id": "lead-14",
        "mensaje": "Busco departamento para comprar en Palermo, tengo un presupuesto de 120000 USD pero mi email es nuevo porque tuve problemas con el anterior.",
        "telefono": "+54 11 5544-3322",
        "email": "comprador2025@tempmail.com",
        "zona": "Palermo",
        "tipo_propiedad": "departamento",
        "presupuesto_usd": 120000,
        "property_ids": [
            "prop-01",
            "prop-07"
        ]
    },
    {
        "id": "lead-15",
        "mensaje": "Me interesa el ph en Caballito",
        "telefono": "54119988",
        "email": "valeria.torres@gmail.com",
        "zona": "Caballito",
        "tipo_propiedad": "ph",
        "presupuesto_usd": 175000,
        "property_ids": [
            "prop-03"
        ]
    }
];
}),
"[project]/product/backend/data/properties_mock.json.[json].cjs [ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "prop-01",
        "titulo": "Departamento luminoso en Palermo Hollywood",
        "precio_usd": 120000,
        "zona": "Palermo",
        "tipo": "departamento",
        "dormitorios": 2,
        "descripcion": "Venta. Departamento de 2 dormitorios, 65 m2, piso 4, luminoso, cocina integrada, balcon corrido. Expensas bajas. A metros del subte D."
    },
    {
        "id": "prop-02",
        "titulo": "Casa en Belgrano R con jardin",
        "precio_usd": 310000,
        "zona": "Belgrano",
        "tipo": "casa",
        "dormitorios": 4,
        "descripcion": "Venta. Casa de 4 dormitorios, 240 m2 cubiertos, jardin de 80 m2, 2 banos, cochera doble. Ideal familia. Barrio residencial tranquilo."
    },
    {
        "id": "prop-03",
        "titulo": "PH duplex en Caballito",
        "precio_usd": 175000,
        "zona": "Caballito",
        "tipo": "ph",
        "dormitorios": 3,
        "descripcion": "Venta. PH en dos plantas, 3 dormitorios, patio propio de 25 m2, living comedor amplio. Sin expensas. A cuadras del Parque Rivadavia."
    },
    {
        "id": "prop-04",
        "titulo": "Local comercial en Villa Crespo",
        "precio_usd": 85000,
        "zona": "Villa Crespo",
        "tipo": "local_comercial",
        "dormitorios": 0,
        "descripcion": "Venta. Local sobre avenida de alto trafico peatonal, 45 m2, frente de 5 metros, bano incorporado. Ideal gastronomia o comercio minorista."
    },
    {
        "id": "prop-05",
        "titulo": "Departamento monoambiente en Recoleta",
        "precio_usd": 950,
        "zona": "Recoleta",
        "tipo": "departamento",
        "dormitorios": 1,
        "descripcion": "Alquiler mensual. Monoambiente de 35 m2 totalmente equipado, piso 8 con vista panoramica, porteria 24hs, laundry en el edificio."
    },
    {
        "id": "prop-06",
        "titulo": "Casa en San Isidro con pileta",
        "precio_usd": 480000,
        "zona": "San Isidro",
        "tipo": "casa",
        "dormitorios": 5,
        "descripcion": "Venta. Chalet de 5 dormitorios, 380 m2, pileta, quincho, jardin de 600 m2, cochera para 3 autos. Premium zona norte GBA."
    },
    {
        "id": "prop-07",
        "titulo": "Departamento 3 ambientes en Palermo Soho",
        "precio_usd": 1800,
        "zona": "Palermo",
        "tipo": "departamento",
        "dormitorios": 2,
        "descripcion": "Alquiler mensual. 3 ambientes, 80 m2, amenities completos (gym, sum, piscina), cochera opcional. Excelente estado."
    },
    {
        "id": "prop-08",
        "titulo": "Oficina en piso corporativo Belgrano",
        "precio_usd": 1200,
        "zona": "Belgrano",
        "tipo": "oficina",
        "dormitorios": 0,
        "descripcion": "Alquiler mensual. Oficina de 55 m2 en edificio corporativo con recepcion compartida, sala de reuniones, estacionamiento cubierto. Ideal pymes."
    },
    {
        "id": "prop-09",
        "titulo": "PH en planta baja Flores",
        "precio_usd": 95000,
        "zona": "Flores",
        "tipo": "ph",
        "dormitorios": 2,
        "descripcion": "Venta. PH en planta baja, 2 dormitorios, patio de 30 m2, cocina separada. Sin expensas. Acceso independiente desde calle tranquila."
    },
    {
        "id": "prop-10",
        "titulo": "Departamento 1 dormitorio en Caballito",
        "precio_usd": 750,
        "zona": "Caballito",
        "tipo": "departamento",
        "dormitorios": 1,
        "descripcion": "Alquiler mensual. 1 dormitorio, 45 m2, piso 2, balcon, cerca de shoppings y subte B. Expensas incluidas en el precio."
    },
    {
        "id": "prop-11",
        "titulo": "Casa en Tigre frente al rio",
        "precio_usd": 220000,
        "zona": "Tigre",
        "tipo": "casa",
        "dormitorios": 3,
        "descripcion": "Venta. Casa con frente al rio Lujan, 3 dormitorios, muelle propio, jardin con asador. Ideal segunda residencia o alquiler temporal."
    },
    {
        "id": "prop-12",
        "titulo": "Local comercial en Palermo con deposito",
        "precio_usd": 2200,
        "zona": "Palermo",
        "tipo": "local_comercial",
        "dormitorios": 0,
        "descripcion": "Alquiler mensual. Local de 90 m2 con deposito de 30 m2, frente sobre avenida principal, aire central, camara frigorifica incluida."
    }
];
}),
"[project]/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/pages/index.tsx'\n\nExpected corresponding JSX closing tag for <AppShell>");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0.bi7tw._.js.map