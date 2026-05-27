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
"[project]/product/frontend/components/shell/Icon.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Icon
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function Icon({ name, className }) {
    switch(name){
        case "logo-eye":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 14 14",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "7",
                        cy: "7",
                        r: "5",
                        fill: "none",
                        stroke: "white",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "7",
                        cy: "7",
                        r: "2",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this);
        case "search":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 12 12",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "5",
                        cy: "5",
                        r: "4"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "m8.5 8.5 2 2",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, this);
        case "bell":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                width: "16",
                height: "16",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M8 2a5 5 0 0 1 5 5v2l1 2H2l1-2V7a5 5 0 0 1 5-5Z"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M6 13a2 2 0 0 0 4 0",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this);
        case "plus":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                width: "16",
                height: "16",
                className: className,
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                    d: "M8 2v12M2 8h12",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                    lineNumber: 93,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, this);
        case "settings":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                width: "16",
                height: "16",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "8",
                        cy: "8",
                        r: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 98,
                columnNumber: 9
            }, this);
        case "help":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                width: "16",
                height: "16",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "8",
                        cy: "8",
                        r: "6"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M8 7v4M8 5.5v.5",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 117,
                columnNumber: 9
            }, this);
        case "rail-dashboard":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "currentColor",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "1",
                        y: "1",
                        width: "6",
                        height: "6",
                        rx: "1.5",
                        opacity: ".7"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "9",
                        y: "1",
                        width: "6",
                        height: "6",
                        rx: "1.5",
                        opacity: ".7"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "1",
                        y: "9",
                        width: "6",
                        height: "6",
                        rx: "1.5",
                        opacity: ".7"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "9",
                        y: "9",
                        width: "6",
                        height: "6",
                        rx: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 133,
                columnNumber: 9
            }, this);
        case "rail-queue":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "2",
                        y: "2",
                        width: "5",
                        height: "5",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "9",
                        y: "2",
                        width: "5",
                        height: "5",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 151,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "2",
                        y: "9",
                        width: "5",
                        height: "5",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "9",
                        y: "9",
                        width: "5",
                        height: "5",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 142,
                columnNumber: 9
            }, this);
        case "rail-check":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "8",
                        cy: "8",
                        r: "6"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 166,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M5 8l2 2 4-4",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 158,
                columnNumber: 9
            }, this);
        case "rail-sliders":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                    d: "M2 4h12M4 8h8M6 12h4",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                    lineNumber: 180,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 172,
                columnNumber: 9
            }, this);
        case "rail-users":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "5",
                        cy: "6",
                        r: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "11",
                        cy: "6",
                        r: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M1 13c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M11 9.5c2.2 0 4 1.5 4 3.5",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 185,
                columnNumber: 9
            }, this);
        case "rail-plug":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "2",
                        y: "4",
                        width: "12",
                        height: "9",
                        rx: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 209,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 201,
                columnNumber: 9
            }, this);
        case "rail-report":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M3 2h10v12H3z"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M6 6h4M6 9h4M6 12h2",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 224,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 215,
                columnNumber: 9
            }, this);
        case "rail-gear":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "8",
                        cy: "8",
                        r: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 237,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 238,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 229,
                columnNumber: 9
            }, this);
        case "rr-share":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "12",
                        cy: "4",
                        r: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 254,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "4",
                        cy: "8",
                        r: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 255,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "12",
                        cy: "12",
                        r: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 256,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M5.5 7.2l5-2.4M5.5 8.8l5 2.4",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 246,
                columnNumber: 9
            }, this);
        case "rr-mark":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                    d: "M4 2h8v10l-4-3-4 3V2z",
                    strokeLinejoin: "round"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                    lineNumber: 270,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 262,
                columnNumber: 9
            }, this);
        case "rr-board":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "2",
                        y: "2",
                        width: "5",
                        height: "5",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 283,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "9",
                        y: "2",
                        width: "5",
                        height: "5",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 284,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "2",
                        y: "9",
                        width: "5",
                        height: "12",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 285,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "9",
                        y: "9",
                        width: "5",
                        height: "5",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 286,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 275,
                columnNumber: 9
            }, this);
        case "rr-widget":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                        cx: "8",
                        cy: "8",
                        r: "6"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 299,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M8 5v6M5 8h6",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 291,
                columnNumber: 9
            }, this);
        case "bb-export":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M8 2v8M5 7l3 3 3-3",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 313,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: "M2 12h12",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 314,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 305,
                columnNumber: 9
            }, this);
        case "bb-filter":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                    d: "M2 4h12M5 8h6M7 12h2",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                    lineNumber: 327,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 319,
                columnNumber: 9
            }, this);
        case "bb-sort":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                    d: "M3 4h10M5 8h6M7 12h2",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                    lineNumber: 340,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 332,
                columnNumber: 9
            }, this);
        case "bb-list":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "2",
                        y: "3",
                        width: "12",
                        height: "3",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 353,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "2",
                        y: "8",
                        width: "12",
                        height: "3",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 354,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "2",
                        y: "13",
                        width: "8",
                        height: "1",
                        rx: ".5"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 355,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 345,
                columnNumber: 9
            }, this);
        case "bb-grid":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                className: className,
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "1",
                        y: "1",
                        width: "6",
                        height: "6",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 368,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "9",
                        y: "1",
                        width: "6",
                        height: "6",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 369,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "1",
                        y: "9",
                        width: "6",
                        height: "6",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 370,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                        x: "9",
                        y: "9",
                        width: "6",
                        height: "6",
                        rx: "1"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                        lineNumber: 371,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Icon.tsx",
                lineNumber: 360,
                columnNumber: 9
            }, this);
        default:
            {
                // Exhaustividad: si se añade un IconName y no se maneja, TS lo detecta.
                const _exhaustive = name;
                return null;
            }
    }
}
}),
"[project]/product/frontend/components/shell/Topbar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Topbar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/shell/Icon.tsx [ssr] (ecmascript)");
;
;
function Topbar({ userInitials, userName, notificationCount }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
        role: "banner",
        "aria-label": "Topbar",
        className: "h-14 bg-brand-secondary-high flex items-center gap-8 px-6 pl-14 rounded-b-3xl shrink-0 z-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5 text-[15px] font-bold text-white tracking-tight",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-[26px] h-[26px] rounded-md bg-brand-primary-500 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            name: "logo-eye",
                            className: "w-3.5 h-3.5"
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    "Lead",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-brand-primary-100",
                        children: "Trust"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                        lineNumber: 30,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex-1 max-w-[856px] h-8 bg-white rounded-button flex items-center gap-6 px-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        name: "search",
                        className: "w-3 h-3 opacity-50 shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "text",
                        "aria-label": "Buscar",
                        placeholder: "Buscar leads, propiedades, contactos…",
                        className: "flex-1 bg-transparent text-body-xs text-neutral-grey-600 outline-none"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                role: "group",
                "aria-label": "Acciones del topbar",
                className: "flex items-center gap-6 ml-auto shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-label": "Notificaciones",
                        className: "relative w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                name: "bell"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this),
                            notificationCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "absolute top-0 right-0 bg-brand-primary-500 text-white text-[10px] font-bold min-w-[16px] h-4 rounded-pill flex items-center justify-center px-1",
                                children: notificationCount
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-label": "Añadir",
                        className: "w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            name: "plus"
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                "aria-hidden": "true",
                                className: "w-6 h-6 rounded-full bg-brand-primary-100 text-brand-primary-700 text-[10px] font-bold flex items-center justify-center",
                                children: userInitials
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-body-sm font-bold text-neutral-grey-100 whitespace-nowrap",
                                children: userName
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-label": "Configuración",
                        className: "w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            name: "settings"
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-label": "Ayuda",
                        className: "w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            name: "help"
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/shell/Topbar.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/shell/LeftRail.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeftRail
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/shell/Icon.tsx [ssr] (ecmascript)");
;
;
const ITEMS = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: "rail-dashboard"
    },
    {
        id: "queue",
        label: "Cola de leads",
        icon: "rail-queue"
    },
    {
        id: "processed",
        label: "Procesados",
        icon: "rail-check"
    },
    {
        id: "criteria",
        label: "Criterios",
        icon: "rail-sliders"
    },
    {
        id: "team",
        label: "Equipo",
        icon: "rail-users"
    },
    {
        id: "integrations",
        label: "Integraciones",
        icon: "rail-plug"
    },
    {
        id: "reports",
        label: "Reportes",
        icon: "rail-report"
    },
    {
        id: "settings",
        label: "Config",
        icon: "rail-gear"
    }
];
function LeftRail({ activeView, onSelectView, onNewLead, queueBadgeCount }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
        "aria-label": "Navegación principal",
        className: "w-20 bg-surface-ground shadow-low flex flex-col items-center gap-8 px-6 pt-[140px] pb-6 shrink-0 z-10 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Nuevo lead",
                onClick: ()=>onNewLead?.(),
                className: "w-8 h-8 rounded-chip bg-brand-primary-500 hover:opacity-90 flex items-center justify-center shrink-0 transition-opacity",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    name: "plus",
                    className: "w-3.5 h-3.5 text-white"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/shell/LeftRail.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/shell/LeftRail.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 items-center w-full",
                children: ITEMS.map((item)=>{
                    const active = item.id === activeView;
                    const showBadge = item.id === "queue" && queueBadgeCount > 0;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-label": item.label,
                        "aria-current": active ? "page" : undefined,
                        onClick: ()=>onSelectView?.(item.id),
                        className: "relative w-8 h-8 rounded-chip flex items-center justify-center transition-colors " + (active ? "bg-brand-primary-500-15 text-brand-primary-500" : "text-neutral-grey-500 hover:bg-neutral-grey-100 hover:text-neutral-grey-800"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                name: item.icon,
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/shell/LeftRail.tsx",
                                lineNumber: 70,
                                columnNumber: 15
                            }, this),
                            showBadge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "absolute top-0 right-0 bg-brand-primary-500 text-white text-[9px] font-bold min-w-[14px] h-[14px] rounded-pill flex items-center justify-center px-[3px]",
                                children: queueBadgeCount
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/shell/LeftRail.tsx",
                                lineNumber: 72,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/product/frontend/components/shell/LeftRail.tsx",
                        lineNumber: 57,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/shell/LeftRail.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/shell/LeftRail.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/shell/RightRail.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RightRail
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/shell/Icon.tsx [ssr] (ecmascript)");
;
;
const ITEMS = [
    {
        id: "share",
        label: "Compartir",
        icon: "rr-share"
    },
    {
        id: "mark",
        label: "Marcar",
        icon: "rr-mark"
    },
    {
        id: "board",
        label: "Tablero",
        icon: "rr-board"
    },
    {
        id: "widget",
        label: "Añadir widget",
        icon: "rr-widget"
    }
];
function RightRail() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
        "aria-label": "Acciones rápidas",
        className: "w-12 bg-surface-ground shadow-left rounded-l-[10px] flex flex-col items-center gap-2 px-2 py-6 mt-6 shrink-0 z-10",
        children: ITEMS.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": it.label,
                title: it.label,
                className: "w-8 h-8 rounded-chip flex items-center justify-center text-neutral-grey-500 hover:bg-neutral-grey-100 hover:text-neutral-grey-800 transition-colors",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    name: it.icon,
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/shell/RightRail.tsx",
                    lineNumber: 35,
                    columnNumber: 11
                }, this)
            }, it.id, false, {
                fileName: "[project]/product/frontend/components/shell/RightRail.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/product/frontend/components/shell/RightRail.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/shell/BottomBar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BottomBar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/shell/Icon.tsx [ssr] (ecmascript)");
;
;
const BB_BTN_CLASS = "w-8 h-8 rounded-button text-neutral-grey-600 hover:bg-neutral-grey-100 hover:text-neutral-grey-800 flex items-center justify-center transition-colors";
const VIEW_BUTTONS = [
    {
        label: "Exportar",
        icon: "bb-export",
        handlerKey: "onExport"
    },
    {
        label: "Filtrar",
        icon: "bb-filter",
        handlerKey: "onFilter"
    },
    {
        label: "Ordenar",
        icon: "bb-sort",
        handlerKey: "onSort"
    },
    {
        label: "Vista lista",
        icon: "bb-list",
        handlerKey: "onViewList"
    },
    {
        label: "Vista tarjetas",
        icon: "bb-grid",
        handlerKey: "onViewCards"
    }
];
function BottomBar(props) {
    const { analyzedCount, onExport, onFilter, onSort, onViewList, onViewCards } = props;
    const handlers = {
        onExport,
        onFilter,
        onSort,
        onViewList,
        onViewCards
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        "aria-label": "Barra inferior",
        className: "bg-surface-ground shadow-top rounded-t-card h-[72px] flex items-center px-8 gap-6 shrink-0 z-[5]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-title-lg font-bold text-neutral-grey-800 leading-none",
                        children: analyzedCount
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-caption text-neutral-grey-600 leading-tight",
                                children: "leads"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-caption text-neutral-grey-600 leading-tight",
                                children: "analizados"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: "w-px h-8 bg-neutral-grey-200 shrink-0"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-0.5 flex-1",
                children: VIEW_BUTTONS.map((b)=>{
                    const handler = handlers[b.handlerKey];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-label": b.label,
                        title: b.label,
                        onClick: ()=>handler?.(),
                        className: BB_BTN_CLASS,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Icon$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            name: b.icon,
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                            lineNumber: 95,
                            columnNumber: 15
                        }, this)
                    }, b.handlerKey, false, {
                        fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                        lineNumber: 87,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: "w-px h-8 bg-neutral-grey-200 shrink-0"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                role: "status",
                className: "bg-feedback-green-500-15 text-feedback-green-500 text-[11px] font-semibold px-2.5 py-[3px] rounded-pill flex items-center gap-1.5 ml-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: "w-1.5 h-1.5 rounded-full bg-feedback-green-500 animate-pulseDot"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    "En vivo · Analizando leads"
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/shell/BottomBar.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/AppShell.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Topbar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/shell/Topbar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$LeftRail$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/shell/LeftRail.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$RightRail$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/shell/RightRail.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$BottomBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/shell/BottomBar.tsx [ssr] (ecmascript)");
;
;
;
;
;
function AppShell({ children, activeView = "dashboard", onSelectView, onNewLead, queueBadgeCount = 0, analyzedCount = 0, userInitials = "EH", userName = "Emanuel", notificationCount = 3 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-screen overflow-hidden bg-surface-low",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$Topbar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                userInitials: userInitials,
                userName: userName,
                notificationCount: notificationCount
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/AppShell.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-1 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$LeftRail$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        activeView: activeView,
                        onSelectView: onSelectView,
                        onNewLead: onNewLead,
                        queueBadgeCount: queueBadgeCount
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/AppShell.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                        role: "main",
                        "aria-label": "Contenido",
                        className: "flex-1 flex flex-col overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-auto",
                                children: children
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/AppShell.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$BottomBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                analyzedCount: analyzedCount
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/AppShell.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/AppShell.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$shell$2f$RightRail$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/product/frontend/components/AppShell.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/AppShell.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/AppShell.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/PageHeader.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PageHeader
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function ChevronLeftIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 16 16",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5",
        width: "12",
        height: "12",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
            d: "M10 3L5 8l5 5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/product/frontend/components/PageHeader.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/product/frontend/components/PageHeader.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
function PageHeader({ title, subtitle, tabs, defaultTab, activeTab: activeTabProp, onTabChange, primaryAction, breadcrumbLabel = "Volver", breadcrumbIcon, onBreadcrumbClick }) {
    // R4: estado interno cuando es uncontrolled
    const initialTab = defaultTab ?? (tabs && tabs.length > 0 ? tabs[0] : undefined);
    const [internalActiveTab, setInternalActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialTab);
    const currentTab = activeTabProp ?? internalActiveTab;
    function handleTabClick(label) {
        // Mantener el estado interno sincronizado (uncontrolled).
        if (activeTabProp === undefined) {
            setInternalActiveTab(label);
        }
        onTabChange?.(label);
    }
    const hasTabs = Array.isArray(tabs) && tabs.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
        "aria-label": "Encabezado de página",
        className: "bg-surface-ground flex items-end justify-between px-6 pt-8 pb-6 border-b border-neutral-grey-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2",
                children: [
                    onBreadcrumbClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onBreadcrumbClick,
                        className: "flex items-center gap-1 text-body-xs font-semibold text-neutral-grey-800 hover:text-neutral-grey-900 self-start",
                        children: [
                            breadcrumbIcon ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ChevronLeftIcon, {}, void 0, false, {
                                fileName: "[project]/product/frontend/components/PageHeader.tsx",
                                lineNumber: 97,
                                columnNumber: 32
                            }, this),
                            breadcrumbLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/PageHeader.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        className: "text-title-lg font-bold text-neutral-grey-900",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/PageHeader.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-body-sm text-neutral-grey-600",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/PageHeader.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/PageHeader.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    hasTabs && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        role: "tablist",
                        className: "flex bg-neutral-grey-100 rounded-button p-0.5",
                        children: tabs.map((label)=>{
                            const selected = label === currentTab;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "button",
                                role: "tab",
                                "aria-label": label,
                                "aria-selected": selected,
                                onClick: ()=>handleTabClick(label),
                                className: "px-3 h-7 rounded-button text-body-xs font-semibold transition-colors " + (selected ? "bg-surface-ground text-neutral-grey-900 shadow-low" : "text-neutral-grey-600 hover:text-neutral-grey-800"),
                                children: label
                            }, label, false, {
                                fileName: "[project]/product/frontend/components/PageHeader.tsx",
                                lineNumber: 121,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/PageHeader.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this),
                    primaryAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-label": primaryAction.label,
                        disabled: primaryAction.disabled || primaryAction.loading,
                        "aria-busy": primaryAction.loading ? "true" : undefined,
                        onClick: ()=>{
                            if (primaryAction.disabled || primaryAction.loading) return;
                            primaryAction.onClick?.();
                        },
                        className: "inline-flex items-center gap-2 bg-brand-primary-500 text-white rounded-button px-4 h-9 font-semibold text-body-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed",
                        children: [
                            primaryAction.loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                "data-testid": "primary-action-spinner",
                                className: "inline-block w-3 h-3 rounded-pill border-2 border-white border-r-transparent animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/PageHeader.tsx",
                                lineNumber: 157,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: primaryAction.label
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/PageHeader.tsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/PageHeader.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/PageHeader.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/PageHeader.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
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
"[project]/product/frontend/components/dashboard/ScoreBar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScoreBar,
    "scoreColorClass",
    ()=>scoreColorClass
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function scoreColorClass(value) {
    if (value >= 75) {
        return {
            bg: "bg-feedback-green-500",
            text: "text-feedback-green-500",
            range: "high"
        };
    }
    if (value >= 50) {
        return {
            bg: "bg-feedback-yellow-500",
            text: "text-feedback-yellow-500",
            range: "mid"
        };
    }
    return {
        bg: "bg-brand-primary-500",
        text: "text-brand-primary-500",
        range: "low"
    };
}
function ScoreBar({ value, variant = "thin", showLabel = true, ariaLabel }) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    const { bg, text, range } = scoreColorClass(clamped);
    const trackHeight = variant === "thin" ? "h-1" : "h-1.5";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        role: "progressbar",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": clamped,
        "aria-label": ariaLabel ?? `Score ${clamped}`,
        "data-score-range": range,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `flex-1 ${trackHeight} rounded-full bg-neutral-grey-100 overflow-hidden`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: `h-full rounded-full ${bg}`,
                    style: {
                        width: `${clamped}%`
                    },
                    "data-testid": "score-fill"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/dashboard/ScoreBar.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/ScoreBar.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            showLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: `text-[11px] font-semibold min-w-[24px] text-right ${text}`,
                children: clamped
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/ScoreBar.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/ScoreBar.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/lib/leadReasons.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deriveReasons",
    ()=>deriveReasons
]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUSPICIOUS_PATTERN = /\b(test|demo|prueba)\b/i;
const MAX_CHIPS = 6;
function deriveReasons(lead, analysis) {
    const reasons = [];
    const seen = new Set();
    const push = (chip)=>{
        if (seen.has(chip.id)) return;
        seen.add(chip.id);
        reasons.push(chip);
    };
    const message = (lead.mensaje ?? "").trim();
    const messageLower = message.toLowerCase();
    const email = (lead.email ?? "").trim();
    const phone = (lead.telefono ?? "").trim();
    const phoneDigits = phone.replace(/\D/g, "");
    // ── Positivas (intencion explicita en el mensaje) ──────────────────────
    if (/(visita|visitar|\bver\b|agendar)/i.test(messageLower)) {
        push({
            id: "visita",
            label: "Solicita visita",
            variant: "positive"
        });
    }
    if (/(interesad[oa]|me interesa)/i.test(messageLower)) {
        push({
            id: "interesado",
            label: "Interesado",
            variant: "positive"
        });
    }
    if (/(mudanza|urgente)/i.test(messageLower)) {
        push({
            id: "mudanza",
            label: "Mudanza pronta",
            variant: "positive"
        });
    }
    if (/(comprar|compra\b|comprador)/i.test(messageLower)) {
        push({
            id: "compra",
            label: "Compra",
            variant: "positive"
        });
    }
    // ── Positivas (completitud de datos) ───────────────────────────────────
    if (email && EMAIL_PATTERN.test(email)) {
        push({
            id: "email-ok",
            label: "Email completo",
            variant: "positive"
        });
    }
    if (phoneDigits.length >= 10) {
        push({
            id: "telefono-ok",
            label: "Teléfono completo",
            variant: "positive"
        });
    }
    if (message.length >= 50) {
        push({
            id: "mensaje-extenso",
            label: "Mensaje extenso",
            variant: "positive"
        });
    }
    // ── Negativas (faltantes y red flags) ──────────────────────────────────
    if (!email) {
        push({
            id: "sin-email",
            label: "Sin email",
            variant: "negative"
        });
    }
    if (!phone || phoneDigits.length < 10) {
        push({
            id: "sin-telefono",
            label: "Sin teléfono",
            variant: "negative"
        });
    }
    if (!message || message.length < 10) {
        push({
            id: "mensaje-vacio",
            label: "Mensaje vacío",
            variant: "negative"
        });
    }
    if (analysis?.is_spam === true) {
        push({
            id: "spam",
            label: "Detectado como spam",
            variant: "negative"
        });
    }
    if (SUSPICIOUS_PATTERN.test(message)) {
        push({
            id: "sospechoso",
            label: "Palabras sospechosas",
            variant: "negative"
        });
    }
    return reasons.slice(0, MAX_CHIPS);
}
}),
"[project]/product/frontend/components/LeadDetailPanel.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// product/frontend/components/LeadDetailPanel.tsx
//
// Feature 17 — Rediseno Tokko del panel de detalle del lead.
//
// AC1: design system Tokko (bg-surface-neutral-ground, shadow-low, rounded-card,
//      tipografia Nunito Sans heredada del shell). Sin clases gray-* del dark
//      theme anterior.
// AC2: mantiene trust badge circular con color semantico, barras conversion/
//      urgency, ai_summary etiqueta "Analisis IA", boton copiar suggested_action,
//      property cards filtradas por property_match_ids, skeleton de loading.
// AC3: reason chips derivadas con deriveReasons() de lib/leadReasons.ts.
// AC4: footer con 3 action buttons (Crear contacto / Asignar / Marcar como spam)
//      consistentes con QueueCard.
__turbopack_context__.s([
    "default",
    ()=>LeadDetailPanel
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$ScoreBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/ScoreBar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$leadReasons$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/lib/leadReasons.ts [ssr] (ecmascript)");
;
;
;
const TONE_HIGH = {
    bg: "bg-feedback-green-500",
    bgSoft: "bg-feedback-green-500-15",
    border: "border-feedback-green-500",
    text: "text-feedback-green-500"
};
const TONE_MID = {
    bg: "bg-feedback-yellow-500",
    bgSoft: "bg-feedback-yellow-500-15",
    border: "border-feedback-yellow-500",
    text: "text-feedback-yellow-500"
};
const TONE_LOW = {
    bg: "bg-brand-primary-500",
    bgSoft: "bg-brand-primary-500-15",
    border: "border-brand-primary-500",
    text: "text-brand-primary-500"
};
function toneFor(score) {
    if (score >= 75) return TONE_HIGH;
    if (score >= 40) return TONE_MID;
    return TONE_LOW;
}
function tierLabel(score) {
    if (score >= 75) return {
        label: "Alta",
        icon: "★"
    };
    if (score >= 40) return {
        label: "Media",
        icon: "—"
    };
    return {
        label: "Baja",
        icon: "⚠"
    };
}
function deriveDisplayName(lead) {
    const email = (lead.email ?? "").trim();
    if (email && email.includes("@")) {
        const local = email.split("@")[0];
        if (local && local.length > 0) {
            const cleaned = local.replace(/[._\-]+/g, " ").trim();
            return cleaned.split(/\s+/).map((p)=>p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
        }
    }
    return `Lead ${lead.id}`;
}
function avatarInitial(name) {
    const trimmed = name.trim();
    if (!trimmed) return "?";
    return trimmed.charAt(0).toUpperCase();
}
// ─── Skeleton (AC2) ─────────────────────────────────────────────────────────
function SkeletonBody() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex-1 overflow-y-auto p-6 space-y-6",
        "data-testid": "lead-detail-skeleton",
        "aria-busy": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-2 animate-pulse",
                "data-testid": "skeleton",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-3 w-24 bg-neutral-grey-100 rounded"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "h-6 w-20 bg-neutral-grey-100 rounded-pill"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "h-6 w-24 bg-neutral-grey-100 rounded-pill"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "h-6 w-16 bg-neutral-grey-100 rounded-pill"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-3 animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-3 w-28 bg-neutral-grey-100 rounded"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-2 bg-neutral-grey-100 rounded-full"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-2 bg-neutral-grey-100 rounded-full"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-2 animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-3 w-24 bg-neutral-grey-100 rounded"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-3 bg-neutral-grey-100 rounded"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-3 bg-neutral-grey-100 rounded w-5/6"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-3 bg-neutral-grey-100 rounded w-4/6"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "animate-pulse",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "h-20 bg-neutral-grey-100 rounded-button"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                    lineNumber: 124,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
function ReasonChipView({ variant, label, id }) {
    const cls = variant === "positive" ? "bg-feedback-green-500-15 text-feedback-green-500" : "bg-brand-primary-500-15 text-brand-primary-500";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
        role: "listitem",
        "data-reason-id": id,
        "data-reason-variant": variant,
        className: `text-[11px] px-2 py-0.5 rounded-pill flex items-center gap-1 font-semibold ${cls}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                children: variant === "positive" ? "✓" : "✗"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            label
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
// ─── Property card mini (AC2) ────────────────────────────────────────────────
function PropertyMatchCard({ property }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
        "data-testid": "lead-detail-property-card",
        className: "bg-surface-low border border-neutral-grey-200 rounded-button p-3 flex items-start gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: "w-9 h-9 rounded-md bg-brand-secondary-500/15 flex items-center justify-center text-[16px] flex-shrink-0",
                children: "🏢"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-body-sm font-semibold text-neutral-grey-800 truncate",
                        children: property.titulo
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-[11px] text-neutral-grey-600 mt-0.5",
                        children: [
                            property.zona,
                            " · ",
                            property.tipo,
                            " · $",
                            property.precio_usd.toLocaleString(),
                            " USD"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
        lineNumber: 158,
        columnNumber: 5
    }, this);
}
function LeadDetailPanel({ lead, analysis, isLoading, properties, onCrearContacto, onAsignar, onMarcarSpam }) {
    const displayName = deriveDisplayName(lead);
    const initial = avatarInitial(displayName);
    // Score efectivo: el del analysis si existe, sino 0 (estado vacio).
    const effectiveScore = analysis?.trust_score ?? 0;
    const tone = toneFor(effectiveScore);
    const tier = tierLabel(effectiveScore);
    // Reason chips (AC3) — se calculan tambien con analysis null.
    const reasons = (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$leadReasons$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["deriveReasons"])(lead, analysis ? {
        is_spam: analysis.is_spam,
        detected_intent: analysis.detected_intent
    } : undefined);
    // Property matches (AC2)
    const matchedProperties = analysis ? properties.filter((p)=>analysis.property_match_ids.includes(p.id)) : [];
    const handleCopy = ()=>{
        if (!analysis) return;
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(analysis.suggested_action);
        }
    };
    // ─── Header (compartido por loading / vacio / lleno) ──────────────────────
    const header = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-6 border-b border-neutral-grey-200",
        "data-testid": "lead-detail-header",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                "data-testid": "lead-detail-avatar",
                                "aria-hidden": "true",
                                className: `w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-title-sm flex-shrink-0 ${tone.bg}`,
                                children: initial
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-title-sm font-bold text-neutral-grey-800 truncate",
                                        children: displayName
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-body-xs text-neutral-grey-600 mt-0.5 truncate",
                                        children: [
                                            "Lead ",
                                            lead.id,
                                            lead.zona ? ` · ${lead.zona}` : "",
                                            lead.tipo_propiedad ? ` · ${lead.tipo_propiedad}` : ""
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                        lineNumber: 237,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 233,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        "data-testid": "lead-detail-trust-badge",
                        "aria-label": `Trust Score ${effectiveScore}`,
                        className: `w-16 h-16 rounded-full ${tone.bgSoft} border-4 ${tone.border} flex items-center justify-center flex-shrink-0`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: `text-title-sm font-bold ${tone.text}`,
                            children: effectiveScore
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                            lineNumber: 251,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    "data-testid": "lead-detail-score-pill",
                    className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[11px] font-semibold ${tone.bgSoft} ${tone.text} border ${tone.border}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            "aria-hidden": "true",
                            children: tier.icon
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                            lineNumber: 263,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            children: [
                                tier.label,
                                " · ",
                                effectiveScore,
                                "%"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                            lineNumber: 264,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                    lineNumber: 259,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 258,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
        lineNumber: 220,
        columnNumber: 5
    }, this);
    // ─── Footer actions (AC4) — siempre presente para consistencia visual ────
    const footer = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4 border-t border-neutral-grey-200 flex gap-2 bg-surface-ground",
        "data-testid": "lead-detail-footer",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                "data-testid": "lead-detail-action-create",
                onClick: ()=>onCrearContacto?.(lead.id),
                disabled: !onCrearContacto,
                className: "text-body-xs px-3.5 py-1.5 rounded-button bg-brand-primary-500 text-white border-0 cursor-pointer font-sans font-bold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity",
                children: "Crear contacto"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 278,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                "data-testid": "lead-detail-action-assign",
                onClick: ()=>onAsignar?.(lead.id),
                disabled: !onAsignar,
                className: "text-body-xs px-3.5 py-1.5 rounded-button bg-transparent text-neutral-grey-700 border border-neutral-grey-200 cursor-pointer font-sans font-semibold hover:bg-neutral-grey-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors",
                children: "Asignar"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 287,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                "data-testid": "lead-detail-action-spam",
                onClick: ()=>onMarcarSpam?.(lead.id),
                disabled: !onMarcarSpam,
                className: "text-body-xs px-3.5 py-1.5 rounded-button bg-transparent text-brand-primary-500 border border-brand-primary-500 cursor-pointer font-sans font-semibold ml-auto hover:bg-brand-primary-500-15 disabled:opacity-60 disabled:cursor-not-allowed transition-colors",
                children: "Marcar como spam"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 296,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
        lineNumber: 274,
        columnNumber: 5
    }, this);
    // ─── Loading state (AC2) ──────────────────────────────────────────────────
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
            "data-testid": "lead-detail-panel",
            "aria-busy": "true",
            className: "bg-surface-ground rounded-card shadow-low overflow-hidden flex flex-col h-full",
            children: [
                header,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SkeletonBody, {}, void 0, false, {
                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                    lineNumber: 317,
                    columnNumber: 9
                }, this),
                footer
            ]
        }, void 0, true, {
            fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
            lineNumber: 311,
            columnNumber: 7
        }, this);
    }
    // ─── Empty state (analysis aun no llego) ──────────────────────────────────
    if (!analysis) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
            "data-testid": "lead-detail-panel",
            className: "bg-surface-ground rounded-card shadow-low overflow-hidden flex flex-col h-full",
            children: [
                header,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-body-sm text-neutral-grey-600",
                        children: "Selecciona un lead para ver el análisis."
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 332,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                    lineNumber: 331,
                    columnNumber: 9
                }, this),
                footer
            ]
        }, void 0, true, {
            fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
            lineNumber: 326,
            columnNumber: 7
        }, this);
    }
    // ─── Render principal ─────────────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
        "data-testid": "lead-detail-panel",
        className: "bg-surface-ground rounded-card shadow-low overflow-hidden flex flex-col h-full",
        children: [
            header,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-6 space-y-6",
                children: [
                    reasons.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        "data-testid": "lead-detail-reasons-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                className: "text-[10px] font-bold uppercase tracking-wider text-neutral-grey-600 mb-2",
                                children: "Razones"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 354,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                role: "list",
                                "aria-label": "Razones de scoring",
                                "data-testid": "lead-detail-reasons",
                                className: "flex flex-wrap gap-2",
                                children: reasons.map((chip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ReasonChipView, {
                                        id: chip.id,
                                        label: chip.label,
                                        variant: chip.variant
                                    }, chip.id, false, {
                                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                        lineNumber: 364,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 357,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 353,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        "data-testid": "lead-detail-metrics",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                className: "text-[10px] font-bold uppercase tracking-wider text-neutral-grey-600 mb-2",
                                children: "Métricas IA"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 377,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-body-xs text-neutral-grey-700 mb-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: "Conversión"
                                                }, void 0, false, {
                                                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                                    lineNumber: 383,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                                lineNumber: 382,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$ScoreBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                value: analysis.conversion_score,
                                                variant: "normal",
                                                ariaLabel: `Conversion ${analysis.conversion_score}`
                                            }, void 0, false, {
                                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                                lineNumber: 385,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                        lineNumber: 381,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-body-xs text-neutral-grey-700 mb-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: "Urgencia"
                                                }, void 0, false, {
                                                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                                lineNumber: 392,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$ScoreBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                value: analysis.urgency_score,
                                                variant: "normal",
                                                ariaLabel: `Urgencia ${analysis.urgency_score}`
                                            }, void 0, false, {
                                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                                lineNumber: 395,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                        lineNumber: 391,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 380,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 376,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        "data-testid": "lead-detail-ai-summary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                className: "text-[10px] font-bold uppercase tracking-wider text-neutral-grey-600 mb-2",
                                children: "Análisis IA"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 406,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-body-sm text-neutral-grey-700 leading-relaxed",
                                children: analysis.ai_summary
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 409,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 405,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        "data-testid": "lead-detail-suggested-action",
                        className: "bg-surface-low rounded-button p-4 border-l-[3px] border-l-brand-secondary-500",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                            className: "text-[10px] font-bold uppercase tracking-wider text-neutral-grey-600 mb-1",
                                            children: "Acción Recomendada"
                                        }, void 0, false, {
                                            fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                            lineNumber: 421,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-body-sm text-neutral-grey-800",
                                            children: analysis.suggested_action
                                        }, void 0, false, {
                                            fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                            lineNumber: 424,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                    lineNumber: 420,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleCopy,
                                    "aria-label": "Copiar acción recomendada",
                                    "data-testid": "lead-detail-copy",
                                    className: "text-body-xs px-3 py-1 rounded-button bg-surface-ground border border-neutral-grey-200 text-neutral-grey-700 hover:bg-neutral-grey-100 hover:text-brand-primary-500 transition-colors cursor-pointer font-semibold flex-shrink-0",
                                    children: "Copiar"
                                }, void 0, false, {
                                    fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                    lineNumber: 428,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                            lineNumber: 419,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 415,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        "data-testid": "lead-detail-properties",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                className: "text-[10px] font-bold uppercase tracking-wider text-neutral-grey-600 mb-2",
                                children: [
                                    "Propiedades Coincidentes (",
                                    matchedProperties.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 442,
                                columnNumber: 11
                            }, this),
                            matchedProperties.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-body-sm text-neutral-grey-600",
                                children: "Sin propiedades coincidentes"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 446,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                className: "space-y-2",
                                children: matchedProperties.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(PropertyMatchCard, {
                                        property: p
                                    }, p.id, false, {
                                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                        lineNumber: 452,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                                lineNumber: 450,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                        lineNumber: 441,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
                lineNumber: 350,
                columnNumber: 7
            }, this),
            footer
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/LeadDetailPanel.tsx",
        lineNumber: 343,
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
"[project]/product/frontend/components/dashboard/KpiCard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>KpiCard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
const ACCENT_BG = {
    teal: "bg-brand-secondary-500",
    green: "bg-feedback-green-500",
    red: "bg-brand-primary-500",
    yellow: "bg-feedback-yellow-500"
};
const ACCENT_VALUE_COLOR = {
    // Teal mantiene el color neutral del HTML target (la card "Total leads"
    // no tiñe el value), las demás sí.
    teal: "text-neutral-grey-800",
    green: "text-feedback-green-500",
    red: "text-brand-primary-500",
    yellow: "text-feedback-yellow-500"
};
function KpiCard({ label, value, delta, accentColor }) {
    const deltaColor = delta?.direction === "up" ? "text-feedback-green-500" : "text-brand-primary-500";
    const arrow = delta?.direction === "up" ? "↑" : "↓";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        role: "group",
        "aria-label": label,
        className: "relative overflow-hidden bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low py-4 px-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: `absolute top-0 left-0 right-0 h-[3px] rounded-t-card ${ACCENT_BG[accentColor]}`
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/KpiCard.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mb-[10px]",
                children: label
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/KpiCard.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `text-title-lg font-bold leading-tight ${ACCENT_VALUE_COLOR[accentColor]}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/KpiCard.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            delta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `text-[11px] mt-[6px] flex items-center gap-1 font-semibold ${deltaColor}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        children: arrow
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/KpiCard.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        children: [
                            delta.value,
                            delta.label ? ` ${delta.label}` : ""
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/dashboard/KpiCard.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/KpiCard.tsx",
                lineNumber: 84,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/KpiCard.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/dashboard/KpiRow.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>KpiRow
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$KpiCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/KpiCard.tsx [ssr] (ecmascript)");
;
;
function KpiRow({ kpis }) {
    const totalSafe = kpis.total === 0 ? 1 : kpis.total;
    const altaPct = Math.round(kpis.altaCalidad / totalSafe * 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$KpiCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                label: "Total leads",
                value: kpis.total,
                accentColor: "teal"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/KpiRow.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$KpiCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                label: "Score promedio",
                value: kpis.scorePromedio,
                accentColor: "green"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/KpiRow.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$KpiCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                label: "Alta calidad (≥75)",
                value: kpis.altaCalidad,
                delta: {
                    value: altaPct,
                    direction: "up",
                    label: "% del total"
                },
                accentColor: "teal"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/KpiRow.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$KpiCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                label: "Descartados (spam)",
                value: kpis.descartados,
                accentColor: "red"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/KpiRow.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/KpiRow.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/dashboard/LeadsBarChart.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>LeadsBarChart
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__ = __turbopack_context__.i("[externals]/chart.js [external] (chart.js, esm_import, [project]/node_modules/chart.js)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$29$__ = __turbopack_context__.i("[externals]/react-chartjs-2 [external] (react-chartjs-2, esm_import, [project]/node_modules/react-chartjs-2)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
// Registrar piezas de chart.js una sola vez por módulo.
__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__["Chart"].register(__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__["BarElement"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__["CategoryScale"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__["LinearScale"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__["Tooltip"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__["Legend"]);
const COLOR_ALTA = "rgba(24,156,123,.75)";
const COLOR_MEDIA = "rgba(66,127,148,.55)";
const COLOR_BAJA = "rgba(223,21,23,.45)";
const TICK_COLOR = "#94A2AB";
const GRID_COLOR = "#EAEEF1";
const FONT_FAMILY = "Nunito Sans";
function LeadsBarChart({ buckets, onSeeQueue }) {
    const data = {
        labels: buckets.map((b)=>b.label),
        datasets: [
            {
                label: "Alta calidad",
                data: buckets.map((b)=>b.alta),
                backgroundColor: COLOR_ALTA,
                borderRadius: 4,
                borderSkipped: false
            },
            {
                label: "Media calidad",
                data: buckets.map((b)=>b.media),
                backgroundColor: COLOR_MEDIA,
                borderRadius: 4,
                borderSkipped: false
            },
            {
                label: "Baja / spam",
                data: buckets.map((b)=>b.baja),
                backgroundColor: COLOR_BAJA,
                borderRadius: 4,
                borderSkipped: false
            }
        ]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: false,
                text: "Leads por día y calidad"
            },
            legend: {
                labels: {
                    color: TICK_COLOR,
                    font: {
                        family: FONT_FAMILY,
                        size: 11,
                        weight: 600
                    },
                    boxWidth: 10,
                    padding: 12
                }
            },
            tooltip: {
                backgroundColor: "#FFFFFF",
                titleColor: "#1D2327",
                bodyColor: "#6A7981",
                borderColor: "#D6DEE2",
                borderWidth: 1,
                padding: 10
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: TICK_COLOR,
                    font: {
                        family: FONT_FAMILY,
                        size: 11
                    }
                }
            },
            y: {
                stacked: true,
                grid: {
                    color: GRID_COLOR
                },
                ticks: {
                    color: TICK_COLOR,
                    font: {
                        family: FONT_FAMILY,
                        size: 11
                    }
                }
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        "aria-label": "Leads por día y calidad",
        className: "bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "flex items-center justify-between mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-[13px] font-semibold text-neutral-grey-800",
                        children: "Leads por día y calidad"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/LeadsBarChart.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    onSeeQueue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onSeeQueue,
                        className: "text-xs font-semibold text-brand-primary-500 hover:underline",
                        children: "Ver cola →"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/LeadsBarChart.tsx",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/LeadsBarChart.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "relative h-[200px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$29$__["Bar"], {
                    data: data,
                    options: options
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/dashboard/LeadsBarChart.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/LeadsBarChart.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/LeadsBarChart.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/product/frontend/components/dashboard/QualityDoughnut.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>QualityDoughnut
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__ = __turbopack_context__.i("[externals]/chart.js [external] (chart.js, esm_import, [project]/node_modules/chart.js)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$29$__ = __turbopack_context__.i("[externals]/react-chartjs-2 [external] (react-chartjs-2, esm_import, [project]/node_modules/react-chartjs-2)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
// Registrar piezas de chart.js una sola vez por módulo.
__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__["Chart"].register(__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__["ArcElement"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__["Tooltip"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$chart$2e$js$29$__["Legend"]);
const FONT_FAMILY = "Nunito Sans";
const TICK_COLOR = "#94A2AB";
function QualityDoughnut({ data }) {
    const chartData = {
        labels: [
            "Alta (≥75)",
            "Media (40–74)",
            "Baja / spam"
        ],
        datasets: [
            {
                data: [
                    data.alta,
                    data.media,
                    data.baja
                ],
                backgroundColor: [
                    "rgba(24,156,123,.8)",
                    "rgba(66,127,148,.65)",
                    "rgba(223,21,23,.7)"
                ],
                borderColor: "#FFFFFF",
                borderWidth: 3,
                hoverOffset: 6
            }
        ]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: TICK_COLOR,
                    font: {
                        family: FONT_FAMILY,
                        size: 11,
                        weight: 600
                    },
                    boxWidth: 10,
                    padding: 14
                }
            },
            tooltip: {
                backgroundColor: "#FFFFFF",
                titleColor: "#1D2327",
                bodyColor: "#6A7981",
                borderColor: "#D6DEE2",
                borderWidth: 1,
                padding: 10
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        "aria-label": "Distribución por calidad",
        className: "bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "flex items-center justify-between mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "text-[13px] font-semibold text-neutral-grey-800",
                    children: "Distribución por calidad"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/dashboard/QualityDoughnut.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/QualityDoughnut.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "relative h-[200px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$29$__["Doughnut"], {
                    data: chartData,
                    options: options
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/dashboard/QualityDoughnut.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/QualityDoughnut.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/QualityDoughnut.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RecentLeadsTable
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$scoreUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/lib/scoreUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$ScoreBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/ScoreBar.tsx [ssr] (ecmascript)");
;
;
;
;
const URGENCY_FALLBACK = {
    Alta: 85,
    Media: 55,
    Baja: 25
};
/** Mapa de color tematizado por canal — alineado con SourceFunnel + HTML target. */ const SOURCE_CHIP_CLASS = {
    Zonaprop: "bg-brand-secondary-500/15 text-brand-secondary-700 border-brand-secondary-500/30",
    Argenprop: "bg-feedback-blue-500/10 text-feedback-blue-500 border-feedback-blue-500/30",
    WhatsApp: "bg-feedback-green-500/15 text-feedback-green-500 border-feedback-green-500/30",
    Mail: "bg-feedback-yellow-500/20 text-feedback-yellow-500 border-feedback-yellow-500/30",
    "Chat web": "bg-brand-primary-500/10 text-brand-primary-500 border-brand-primary-500/30",
    Mercadolibre: "bg-neutral-grey-100 text-neutral-grey-600 border-neutral-grey-300",
    Navent: "bg-neutral-grey-100 text-neutral-grey-600 border-neutral-grey-300"
};
const ESTADO_BADGE_CLASS = {
    Nuevo: "bg-feedback-blue-500/15 text-feedback-blue-500",
    "En revisión": "bg-feedback-yellow-500/20 text-feedback-yellow-500",
    Calificado: "bg-feedback-green-500/15 text-feedback-green-500",
    Descartado: "bg-brand-primary-500/15 text-brand-primary-500"
};
function deriveDisplayName(lead) {
    if (lead.email) {
        const local = lead.email.split("@")[0];
        if (local && local.length > 0) {
            const cleaned = local.replace(/[._\-]+/g, " ").trim();
            return cleaned.split(/\s+/).map((p)=>p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
        }
    }
    return `Lead ${lead.id}`;
}
function avatarInitial(name) {
    const trimmed = name.trim();
    if (!trimmed) return "?";
    return trimmed.charAt(0).toUpperCase();
}
function truncateMsg(msg, max = 28) {
    if (!msg) return "";
    if (msg.length <= max) return msg;
    return `${msg.slice(0, max)}…`;
}
function compareByCreatedAtDesc(a, b) {
    const aTime = a.created_at ? Date.parse(a.created_at) : NaN;
    const bTime = b.created_at ? Date.parse(b.created_at) : NaN;
    const aValid = !Number.isNaN(aTime);
    const bValid = !Number.isNaN(bTime);
    if (aValid && bValid) return bTime - aTime;
    if (aValid) return -1;
    if (bValid) return 1;
    return 0;
}
function RecentLeadsTable({ leads, aiScores, analysisByLeadId, limit = 6, onSelectLead, selectedLeadId, className }) {
    const rows = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const resolved = leads.map((lead)=>{
            const local = (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$scoreUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computeLocalScore"])(lead);
            const aiTrust = aiScores[lead.id];
            const analysis = analysisByLeadId?.[lead.id];
            const trust = analysis?.trust_score ?? aiTrust ?? local.trust_score;
            const conversion = analysis?.conversion_score ?? Math.round(trust * 0.9);
            const urgency = analysis?.urgency_score ?? URGENCY_FALLBACK[local.urgency];
            const displayName = deriveDisplayName(lead);
            return {
                lead,
                trust,
                conversion,
                urgency,
                displayName,
                initial: avatarInitial(displayName),
                source: lead.source,
                estado: lead.estado ?? "Nuevo"
            };
        });
        const allHaveCreatedAt = resolved.every((r)=>Boolean(r.lead.created_at));
        const sorted = [
            ...resolved
        ].sort((a, b)=>{
            if (allHaveCreatedAt) {
                return compareByCreatedAtDesc(a.lead, b.lead);
            }
            return b.trust - a.trust;
        });
        return sorted.slice(0, limit);
    }, [
        leads,
        aiScores,
        analysisByLeadId,
        limit
    ]);
    function handleSelect(leadId) {
        onSelectLead(leadId);
    }
    function handleKeyDown(event, leadId) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelectLead(leadId);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        "aria-label": "Leads recientes",
        className: `bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5 ${className ?? ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "flex items-center justify-between mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "text-[13px] font-semibold text-neutral-grey-800",
                    children: "Leads recientes"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                    lineNumber: 181,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                    role: "table",
                    className: "w-full border-collapse",
                    "aria-label": "Tabla de leads recientes",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: [
                                    "Lead",
                                    "Trust",
                                    "Conversión",
                                    "Urgencia",
                                    "Fuente",
                                    "Estado"
                                ].map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        scope: "col",
                                        className: "text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 text-left py-2 px-3 border-b border-neutral-grey-200",
                                        children: col
                                    }, col, false, {
                                        fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                        lineNumber: 202,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                            children: [
                                rows.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                        colSpan: 6,
                                        className: "py-6 px-3 text-center text-body-sm text-neutral-grey-500",
                                        children: "No hay leads recientes para mostrar."
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                        lineNumber: 215,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                    lineNumber: 214,
                                    columnNumber: 15
                                }, this),
                                rows.map(({ lead, trust, conversion, urgency, displayName, initial, source, estado })=>{
                                    const isSelected = selectedLeadId === lead.id;
                                    const avatarBg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$ScoreBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["scoreColorClass"])(trust).bg;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        role: "button",
                                        tabIndex: 0,
                                        "aria-selected": isSelected,
                                        "data-lead-id": lead.id,
                                        onClick: ()=>handleSelect(lead.id),
                                        onKeyDown: (e)=>handleKeyDown(e, lead.id),
                                        className: `cursor-pointer transition-colors outline-none focus-visible:bg-neutral-grey-100 hover:bg-neutral-grey-50 ${isSelected ? "bg-neutral-grey-100" : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "py-2.5 px-3 border-b border-neutral-grey-100",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            "aria-hidden": "true",
                                                            className: `flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold text-white ${avatarBg}`,
                                                            children: initial
                                                        }, void 0, false, {
                                                            fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                            lineNumber: 251,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "text-[12px] font-semibold text-neutral-grey-800 truncate",
                                                                    children: displayName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                                    lineNumber: 258,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "text-[11px] text-neutral-grey-500 truncate",
                                                                    children: truncateMsg(lead.mensaje)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                                    lineNumber: 261,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                            lineNumber: 257,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                    lineNumber: 250,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                lineNumber: 249,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "py-2.5 px-3 border-b border-neutral-grey-100 w-[140px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$ScoreBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    value: trust,
                                                    ariaLabel: `Trust ${trust}`
                                                }, void 0, false, {
                                                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                lineNumber: 267,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "py-2.5 px-3 border-b border-neutral-grey-100 w-[140px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$ScoreBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    value: conversion,
                                                    ariaLabel: `Conversión ${conversion}`
                                                }, void 0, false, {
                                                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                lineNumber: 270,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "py-2.5 px-3 border-b border-neutral-grey-100 w-[140px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$ScoreBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    value: urgency,
                                                    ariaLabel: `Urgencia ${urgency}`
                                                }, void 0, false, {
                                                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                lineNumber: 276,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "py-2.5 px-3 border-b border-neutral-grey-100",
                                                children: source ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: `inline-block text-[10px] font-semibold px-2 py-[3px] rounded-chip border ${SOURCE_CHIP_CLASS[source]}`,
                                                    children: source
                                                }, void 0, false, {
                                                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] text-neutral-grey-400",
                                                    children: "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                lineNumber: 282,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "py-2.5 px-3 border-b border-neutral-grey-100",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: `inline-block text-[10px] font-semibold px-2 py-[2px] rounded-pill ${ESTADO_BADGE_CLASS[estado]}`,
                                                    children: estado
                                                }, void 0, false, {
                                                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                    lineNumber: 296,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                                lineNumber: 295,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, lead.id, true, {
                                        fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                                        lineNumber: 237,
                                        columnNumber: 19
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                    lineNumber: 187,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx",
        lineNumber: 174,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/dashboard/SourceFunnel.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SourceFunnel
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const CHANNEL_THEME = {
    Zonaprop: {
        fillClass: "bg-brand-secondary-500/25",
        textClass: "text-brand-secondary-700"
    },
    Argenprop: {
        fillClass: "bg-feedback-blue-500/15",
        textClass: "text-feedback-blue-500"
    },
    WhatsApp: {
        fillClass: "bg-feedback-green-500/20",
        textClass: "text-feedback-green-500"
    },
    Mail: {
        fillClass: "bg-feedback-yellow-500/25",
        textClass: "text-feedback-yellow-500"
    },
    "Chat web": {
        fillClass: "bg-brand-primary-500/15",
        textClass: "text-brand-primary-500"
    },
    Mercadolibre: {
        fillClass: "bg-neutral-grey-200",
        textClass: "text-neutral-grey-700"
    },
    Navent: {
        fillClass: "bg-neutral-grey-200",
        textClass: "text-neutral-grey-700"
    }
};
function aggregate(leads, limit) {
    const counts = new Map();
    for (const lead of leads){
        if (!lead.source) continue;
        counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1);
    }
    if (counts.size === 0) return [];
    const entries = Array.from(counts.entries());
    entries.sort((a, b)=>b[1] - a[1]);
    const max = entries[0][1];
    return entries.slice(0, limit).map(([source, count])=>({
            source,
            count,
            percent: max > 0 ? Math.round(count / max * 100) : 0
        }));
}
function SourceFunnel({ leads, limit = 5, className }) {
    const rows = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>aggregate(leads, limit), [
        leads,
        limit
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        "aria-label": "Volumen por fuente",
        className: `bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5 ${className ?? ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-[13px] font-semibold text-neutral-grey-800",
                        children: "Volumen por fuente"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/SourceFunnel.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mt-2",
                        children: "Distribución por canal"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/SourceFunnel.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/SourceFunnel.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            rows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-body-sm text-neutral-grey-500",
                children: "No hay leads con fuente asignada."
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/SourceFunnel.tsx",
                lineNumber: 110,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                className: "flex flex-col gap-2",
                "data-testid": "funnel-list",
                children: rows.map(({ source, count, percent })=>{
                    const theme = CHANNEL_THEME[source];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                        className: "flex items-center gap-3",
                        "data-source": source,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-[11px] font-semibold text-neutral-grey-600 w-[70px] shrink-0",
                                children: source
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/dashboard/SourceFunnel.tsx",
                                lineNumber: 123,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex-1 h-5 rounded-chip bg-neutral-grey-100 overflow-hidden",
                                role: "progressbar",
                                "aria-valuemin": 0,
                                "aria-valuemax": 100,
                                "aria-valuenow": percent,
                                "aria-label": `${source}: ${count} leads (${percent}%)`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    "data-testid": "funnel-fill",
                                    "data-percent": percent,
                                    className: `h-full rounded-chip flex items-center justify-end pr-2 text-[11px] font-bold transition-[width] duration-500 ${theme.fillClass} ${theme.textClass}`,
                                    style: {
                                        width: `${percent}%`
                                    },
                                    children: count
                                }, void 0, false, {
                                    fileName: "[project]/product/frontend/components/dashboard/SourceFunnel.tsx",
                                    lineNumber: 134,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/dashboard/SourceFunnel.tsx",
                                lineNumber: 126,
                                columnNumber: 17
                            }, this)
                        ]
                    }, source, true, {
                        fileName: "[project]/product/frontend/components/dashboard/SourceFunnel.tsx",
                        lineNumber: 118,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/SourceFunnel.tsx",
                lineNumber: 114,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/SourceFunnel.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WeightsTab,
    "weightStatus",
    ()=>weightStatus
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function weightStatus(total) {
    if (total === 100) return "ok";
    if (total > 100) return "over";
    return "under";
}
const STATUS_CLASS = {
    ok: {
        fill: "bg-feedback-green-500",
        label: "text-feedback-green-500"
    },
    over: {
        fill: "bg-brand-primary-500",
        label: "text-brand-primary-500"
    },
    under: {
        fill: "bg-feedback-yellow-500",
        label: "text-feedback-yellow-500"
    }
};
function SliderRow({ id, label, emoji, value, valueColor, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 mb-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: id,
                        className: "text-[12px] font-semibold text-neutral-grey-800 flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                children: emoji
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this),
                            label
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: `text-[12px] font-bold ${valueColor}`,
                        children: [
                            value,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                id: id,
                type: "range",
                min: 0,
                max: 100,
                value: value,
                onChange: (e)=>onChange(Number(e.target.value)),
                "aria-label": `${label} (porcentaje)`,
                className: "w-full accent-brand-primary-500"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
function WeightsTab({ weights, umbralAlerta, onWeightChange, onUmbralChange }) {
    const total = weights.trust + weights.conversion + weights.urgency;
    const status = weightStatus(total);
    const cls = STATUS_CLASS[status];
    const fillPercent = Math.min(total, 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        "data-testid": "weights-tab",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-[11px] text-neutral-grey-500 mb-3",
                children: "Distribuí el 100% entre las tres dimensiones"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SliderRow, {
                id: "cs-slider-trust",
                label: "Trust Score",
                emoji: "🔒",
                value: weights.trust,
                valueColor: "text-brand-primary-500",
                onChange: (v)=>onWeightChange("trust", v)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SliderRow, {
                id: "cs-slider-conv",
                label: "Conversión",
                emoji: "🎯",
                value: weights.conversion,
                valueColor: "text-feedback-green-500",
                onChange: (v)=>onWeightChange("conversion", v)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SliderRow, {
                id: "cs-slider-urg",
                label: "Urgencia",
                emoji: "⚡",
                value: weights.urgency,
                valueColor: "text-feedback-yellow-500",
                onChange: (v)=>onWeightChange("urgency", v)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 mt-2",
                "data-testid": "weights-total",
                "data-weight-status": status,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-[11px] text-neutral-grey-500",
                        children: "Total"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex-1 h-2 rounded-full bg-neutral-grey-100 overflow-hidden",
                        role: "progressbar",
                        "aria-valuemin": 0,
                        "aria-valuemax": 100,
                        "aria-valuenow": Math.min(total, 100),
                        "aria-label": `Suma de pesos: ${total}%`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            "data-testid": "weights-fill",
                            className: `h-full rounded-full transition-[width] duration-200 ${cls.fill}`,
                            style: {
                                width: `${fillPercent}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        "data-testid": "weights-total-label",
                        className: `text-[12px] font-bold min-w-[42px] text-right ${cls.label}`,
                        children: [
                            total,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mb-2",
                        children: "Umbral de alerta"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                htmlFor: "cs-slider-umbral",
                                className: "text-[12px] font-semibold text-neutral-grey-800",
                                children: "Score mínimo para notificar"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                "data-testid": "weights-umbral-value",
                                className: "text-[12px] font-bold text-neutral-grey-800",
                                children: umbralAlerta
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        id: "cs-slider-umbral",
                        type: "range",
                        min: 0,
                        max: 100,
                        value: umbralAlerta,
                        onChange: (e)=>onUmbralChange(Number(e.target.value)),
                        "aria-label": "Umbral de alerta",
                        className: "w-full accent-brand-primary-500"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx",
        lineNumber: 110,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FiltersTab
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function ToggleRow({ label, sub, checked, onToggle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between py-3 border-b border-neutral-grey-100 last:border-b-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "min-w-0 pr-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-[12px] font-semibold text-neutral-grey-800",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-[11px] text-neutral-grey-500",
                        children: sub
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                role: "switch",
                "aria-checked": checked,
                "aria-label": label,
                onClick: onToggle,
                "data-toggle-label": label,
                className: `relative inline-flex h-5 w-9 items-center rounded-pill transition-colors ${checked ? "bg-brand-primary-500" : "bg-neutral-grey-300"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    "aria-hidden": "true",
                    className: `inline-block h-4 w-4 transform rounded-full bg-white shadow-low transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
function FiltersTab({ filters, onToggle, onScoreMinChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        "data-testid": "filters-tab",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-[11px] text-neutral-grey-500 mb-3",
                children: "Reglas aplicadas antes del scoring"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ToggleRow, {
                label: "Bloquear números inválidos",
                sub: "Formato de teléfono no válido",
                checked: filters.bloquearInvalidos,
                onToggle: ()=>onToggle("bloquearInvalidos")
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ToggleRow, {
                label: "Detectar spam",
                sub: "Mensajes tipo bot o repetidos",
                checked: filters.detectarSpam,
                onToggle: ()=>onToggle("detectarSpam")
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ToggleRow, {
                label: "Filtrar duplicados",
                sub: "Mismo contacto en 48hs",
                checked: filters.filtrarDuplicados,
                onToggle: ()=>onToggle("filtrarDuplicados")
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ToggleRow, {
                label: "Ignorar leads sin mensaje",
                sub: "Lead sin texto de consulta",
                checked: filters.ignorarSinMensaje,
                onToggle: ()=>onToggle("ignorarSinMensaje")
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                htmlFor: "cs-score-min",
                                className: "text-[12px] font-semibold text-neutral-grey-800",
                                children: "Score mínimo global"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                "data-testid": "filters-score-min-value",
                                className: "text-[12px] font-bold text-neutral-grey-800",
                                children: filters.scoreMinGlobal
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        id: "cs-score-min",
                        type: "range",
                        min: 0,
                        max: 100,
                        value: filters.scoreMinGlobal,
                        onChange: (e)=>onScoreMinChange(Number(e.target.value)),
                        "aria-label": "Score mínimo global",
                        className: "w-full accent-brand-primary-500"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-[11px] text-neutral-grey-500 mt-1",
                        children: "Debajo de este valor se descarta"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CHANNEL_NAMES",
    ()=>CHANNEL_NAMES,
    "default",
    ()=>ChannelsTab
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
const CHANNEL_NAMES = [
    "Zonaprop",
    "Argenprop",
    "WhatsApp",
    "Mail",
    "Mercadolibre",
    "Chat web",
    "Navent"
];
function formatBoost(value) {
    return `${value.toFixed(1)}×`;
}
function ChannelsTab({ channels, boosts, onChannelToggle, onBoostChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        "data-testid": "channels-tab",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-[11px] text-neutral-grey-500 mb-3",
                children: "Activá o desactivá fuentes de leads"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                role: "group",
                "aria-label": "Canales activos",
                children: CHANNEL_NAMES.map((name)=>{
                    const on = channels[name];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-pressed": on,
                        "data-channel": name,
                        "data-state": on ? "on" : "off",
                        onClick: ()=>onChannelToggle(name),
                        className: `channel-tag text-[11px] font-semibold px-3 py-1.5 rounded-pill border transition-colors ${on ? "on bg-brand-primary-500 text-white border-brand-primary-500" : "bg-neutral-grey-100 text-neutral-grey-600 border-neutral-grey-300"}`,
                        children: name
                    }, name, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
                        lineNumber: 74,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mt-4 mb-2",
                children: "Boost por canal"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(BoostSliderRow, {
                        id: "cs-boost-whatsapp",
                        label: "WhatsApp",
                        valueClass: "text-feedback-green-500",
                        value: boosts.whatsapp,
                        onChange: (v)=>onBoostChange("whatsapp", v)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(BoostSliderRow, {
                        id: "cs-boost-mail",
                        label: "Mail",
                        valueClass: "text-feedback-blue-500",
                        value: boosts.mail,
                        onChange: (v)=>onBoostChange("mail", v)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
function BoostSliderRow({ id, label, value, valueClass, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: id,
                        className: "text-[12px] font-semibold text-neutral-grey-800",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        "data-testid": `boost-${label.toLowerCase()}-value`,
                        className: `text-[12px] font-bold ${valueClass}`,
                        children: formatBoost(value)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                id: id,
                type: "range",
                min: 10,
                max: 20,
                step: 1,
                value: Math.round(value * 10),
                onChange: (e)=>onChange(Number(e.target.value) / 10),
                "aria-label": `Boost ${label}`,
                className: "w-full accent-brand-primary-500"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/common/Toast.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Toast
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const VARIANT_CLASSES = {
    success: "bg-feedback-green-500-15 text-feedback-green-500 border-feedback-green-500",
    error: "bg-brand-primary-500-15 text-brand-primary-500 border-brand-primary-500",
    info: "bg-feedback-blue-500-15 text-feedback-blue-500 border-feedback-blue-500"
};
const VARIANT_ICON = {
    success: "✓",
    error: "✕",
    info: "ⓘ"
};
function Toast({ message, variant = "success", durationMs = 2500, onDismiss }) {
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const id = window.setTimeout(()=>{
            onDismiss();
        }, durationMs);
        return ()=>window.clearTimeout(id);
    }, [
        durationMs,
        onDismiss
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        role: "status",
        "aria-live": "polite",
        "data-toast-variant": variant,
        className: `inline-flex items-center gap-2 px-4 py-2 rounded-chip border shadow-low text-body-sm font-semibold ${VARIANT_CLASSES[variant]}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "text-[14px] leading-none",
                children: VARIANT_ICON[variant]
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/common/Toast.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                children: message
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/common/Toast.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/common/Toast.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/dashboard/CriteriaCard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_CRITERIA",
    ()=>DEFAULT_CRITERIA,
    "default",
    ()=>CriteriaCard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$criteria$2f$WeightsTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/criteria/WeightsTab.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$criteria$2f$FiltersTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/criteria/FiltersTab.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$criteria$2f$ChannelsTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/criteria/ChannelsTab.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$common$2f$Toast$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/common/Toast.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
const DEFAULT_CRITERIA = {
    weights: {
        trust: 40,
        conversion: 40,
        urgency: 20
    },
    umbralAlerta: 70,
    filters: {
        bloquearInvalidos: true,
        detectarSpam: true,
        filtrarDuplicados: true,
        ignorarSinMensaje: false,
        scoreMinGlobal: 15
    },
    channels: {
        Zonaprop: true,
        Argenprop: true,
        WhatsApp: true,
        Mail: true,
        Mercadolibre: false,
        "Chat web": true,
        Navent: false
    },
    boosts: {
        whatsapp: 1.3,
        mail: 1.1
    }
};
const TAB_LABELS = {
    weights: "Pesos",
    filters: "Filtros",
    channels: "Canales"
};
function mergeDefaults(overrides) {
    if (!overrides) return DEFAULT_CRITERIA;
    return {
        weights: {
            ...DEFAULT_CRITERIA.weights,
            ...overrides.weights
        },
        umbralAlerta: overrides.umbralAlerta ?? DEFAULT_CRITERIA.umbralAlerta,
        filters: {
            ...DEFAULT_CRITERIA.filters,
            ...overrides.filters
        },
        channels: {
            ...DEFAULT_CRITERIA.channels,
            ...overrides.channels
        },
        boosts: {
            ...DEFAULT_CRITERIA.boosts,
            ...overrides.boosts
        }
    };
}
function CriteriaCard({ defaults, onSave }) {
    const initial = mergeDefaults(defaults);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("weights");
    const [weights, setWeights] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initial.weights);
    const [umbralAlerta, setUmbralAlerta] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initial.umbralAlerta);
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initial.filters);
    const [channels, setChannels] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initial.channels);
    const [boosts, setBoosts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initial.boosts);
    const [toastOpen, setToastOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    function handleWeightChange(key, value) {
        setWeights((prev)=>({
                ...prev,
                [key]: value
            }));
    }
    function handleFilterToggle(key) {
        setFilters((prev)=>({
                ...prev,
                [key]: !prev[key]
            }));
    }
    function handleScoreMinChange(value) {
        setFilters((prev)=>({
                ...prev,
                scoreMinGlobal: value
            }));
    }
    function handleChannelToggle(name) {
        setChannels((prev)=>({
                ...prev,
                [name]: !prev[name]
            }));
    }
    function handleBoostChange(key, value) {
        setBoosts((prev)=>({
                ...prev,
                [key]: value
            }));
    }
    function handleSave() {
        const snapshot = {
            weights,
            umbralAlerta,
            filters,
            channels,
            boosts
        };
        if (onSave) {
            onSave(snapshot);
        }
        setToastOpen(true);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        "aria-label": "Criterios de scoring",
        className: "bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "flex items-center justify-between mb-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "text-[13px] font-semibold text-neutral-grey-800",
                    children: "Criterios de scoring"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                    lineNumber: 144,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                role: "group",
                "aria-label": "Sub-tabs de criterios",
                "data-testid": "criteria-subtabs",
                className: "flex gap-2 border-b border-neutral-grey-200 mb-4",
                children: Object.keys(TAB_LABELS).map((key)=>{
                    const active = activeTab === key;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        role: "tab",
                        "aria-selected": active,
                        "aria-controls": `cs-panel-${key}`,
                        id: `cs-tab-${key}`,
                        "data-tab-key": key,
                        onClick: ()=>setActiveTab(key),
                        className: `px-3 py-2 text-[12px] font-semibold cursor-pointer border-b-2 -mb-px transition-colors ${active ? "text-brand-primary-500 border-brand-primary-500" : "text-neutral-grey-500 border-transparent hover:text-neutral-grey-700"}`,
                        children: TAB_LABELS[key]
                    }, key, false, {
                        fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                        lineNumber: 162,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                role: "tabpanel",
                id: `cs-panel-${activeTab}`,
                "aria-labelledby": `cs-tab-${activeTab}`,
                children: [
                    activeTab === "weights" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$criteria$2f$WeightsTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        weights: weights,
                        umbralAlerta: umbralAlerta,
                        onWeightChange: handleWeightChange,
                        onUmbralChange: setUmbralAlerta
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this),
                    activeTab === "filters" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$criteria$2f$FiltersTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        filters: filters,
                        onToggle: handleFilterToggle,
                        onScoreMinChange: handleScoreMinChange
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                        lineNumber: 197,
                        columnNumber: 11
                    }, this),
                    activeTab === "channels" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$criteria$2f$ChannelsTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        channels: channels,
                        boosts: boosts,
                        onChannelToggle: handleChannelToggle,
                        onBoostChange: handleBoostChange
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                className: "mt-5 flex items-center justify-between gap-3 border-t border-neutral-grey-100 pt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "min-h-[28px]",
                        "data-testid": "criteria-toast-slot",
                        children: toastOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$common$2f$Toast$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            message: "Criterios guardados",
                            variant: "success",
                            onDismiss: ()=>setToastOpen(false)
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                            lineNumber: 216,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleSave,
                        "data-testid": "criteria-save-btn",
                        className: "px-4 py-2 rounded-button bg-brand-primary-500 text-white text-[12px] font-semibold hover:bg-brand-primary-700 transition-colors",
                        children: "Guardar criterios →"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: "sr-only",
                "data-testid": "channel-names",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$criteria$2f$ChannelsTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["CHANNEL_NAMES"].join(",")
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
                lineNumber: 234,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/dashboard/CriteriaCard.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/lib/dashboardMetrics.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "classifyTier",
    ()=>classifyTier,
    "computeDailyBuckets",
    ()=>computeDailyBuckets,
    "computeKpis",
    ()=>computeKpis
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$scoreUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/lib/scoreUtils.ts [ssr] (ecmascript)");
;
/** Etiquetas Lun..Hoy alineadas con el HTML target (línea 1023). */ const WEEKDAY_LABELS_ES = [
    "Dom",
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb"
];
/**
 * Resuelve el score efectivo y la flag de spam de un lead, combinando:
 *   1. aiScore desde `analyses[lead.id]` si existe.
 *   2. Fallback: `computeLocalScore(lead).trust_score` y `is_spam = false`.
 */ function resolveLeadScore(lead, analyses) {
    const fromAi = analyses?.[lead.id];
    if (fromAi) {
        return {
            trust_score: fromAi.trust_score,
            is_spam: fromAi.is_spam
        };
    }
    return {
        trust_score: (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$scoreUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computeLocalScore"])(lead).trust_score,
        is_spam: false
    };
}
function classifyTier(trust_score, is_spam) {
    if (is_spam) return "baja";
    if (trust_score >= 75) return "alta";
    if (trust_score >= 40) return "media";
    return "baja";
}
function computeKpis(leads, analyses) {
    const total = leads.length;
    if (total === 0) {
        return {
            total: 0,
            scorePromedio: 0,
            altaCalidad: 0,
            descartados: 0
        };
    }
    let sumScores = 0;
    let altaCalidad = 0;
    let descartados = 0;
    for (const lead of leads){
        const { trust_score, is_spam } = resolveLeadScore(lead, analyses);
        sumScores += trust_score;
        if (is_spam) descartados += 1;
        else if (trust_score >= 75) altaCalidad += 1;
    }
    const scorePromedio = Math.round(sumScores / total);
    return {
        total,
        scorePromedio,
        altaCalidad,
        descartados
    };
}
function computeDailyBuckets(leads, analyses, now = new Date()) {
    // Construimos 7 fechas UTC desde hoy-6 hasta hoy (inclusive).
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const buckets = [];
    const indexByDate = new Map();
    for(let offset = 6; offset >= 0; offset -= 1){
        const d = new Date(todayUTC);
        d.setUTCDate(d.getUTCDate() - offset);
        const iso = formatISODate(d);
        const isToday = offset === 0;
        buckets.push({
            date: iso,
            label: isToday ? "Hoy" : WEEKDAY_LABELS_ES[d.getUTCDay()],
            alta: 0,
            media: 0,
            baja: 0
        });
        indexByDate.set(iso, buckets.length - 1);
    }
    for (const lead of leads){
        if (!lead.created_at) continue;
        const date = new Date(lead.created_at);
        if (Number.isNaN(date.getTime())) continue;
        const iso = formatISODate(date);
        const idx = indexByDate.get(iso);
        if (idx === undefined) continue;
        const { trust_score, is_spam } = resolveLeadScore(lead, analyses);
        const tier = classifyTier(trust_score, is_spam);
        buckets[idx][tier] += 1;
    }
    return buckets;
}
/** Devuelve YYYY-MM-DD en UTC. */ function formatISODate(d) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
}),
"[project]/product/frontend/views/DashboardView.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>DashboardView
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$LeadsFeed$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/LeadsFeed.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$LeadDetailPanel$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/LeadDetailPanel.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$SimulatorPanel$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/SimulatorPanel.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$LeadCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/LeadCard.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$KpiRow$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/KpiRow.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$LeadsBarChart$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/LeadsBarChart.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$QualityDoughnut$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/QualityDoughnut.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$RecentLeadsTable$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/RecentLeadsTable.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$SourceFunnel$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/SourceFunnel.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$CriteriaCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/dashboard/CriteriaCard.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$dashboardMetrics$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/lib/dashboardMetrics.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$LeadsBarChart$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$QualityDoughnut$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$LeadsBarChart$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$QualityDoughnut$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
;
;
function DashboardView({ sortedLeads, selectedLeadId, onSelectLead, selectedLead, analysis, isLoading, properties, spamLeads, newLeadId, onLeadSimulated, leadsForMetrics, analyses, onSeeQueue }) {
    // AC4: los widgets derivan del estado actual de leads + analyses.
    // Si el host no pasa `leadsForMetrics`, reconstruimos un superset uniendo
    // los leads del feed y los marcados como spam.
    const metricsLeads = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (leadsForMetrics) return leadsForMetrics;
        const seen = new Set();
        const out = [];
        for (const item of sortedLeads){
            if (!seen.has(item.lead.id)) {
                seen.add(item.lead.id);
                out.push(item.lead);
            }
        }
        for (const item of spamLeads){
            if (!seen.has(item.lead.id)) {
                seen.add(item.lead.id);
                out.push(item.lead);
            }
        }
        return out;
    }, [
        leadsForMetrics,
        sortedLeads,
        spamLeads
    ]);
    // Si no se pasa `analyses`, derivamos un mapa best-effort desde sortedLeads
    // (trust_score conocido) y spamLeads (is_spam=true).
    const analysesMap = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (analyses) return analyses;
        const map = {};
        for (const item of sortedLeads){
            map[item.lead.id] = {
                trust_score: item.trust_score,
                is_spam: false
            };
        }
        for (const item of spamLeads){
            map[item.lead.id] = {
                trust_score: item.trust_score,
                is_spam: true
            };
        }
        return map;
    }, [
        analyses,
        sortedLeads,
        spamLeads
    ]);
    const kpis = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$dashboardMetrics$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computeKpis"])(metricsLeads, analysesMap), [
        metricsLeads,
        analysesMap
    ]);
    // Feature 12: RecentLeadsTable consume aiScores como Record<id, number>.
    // Derivamos del mismo `analysesMap` para evitar duplicar estado.
    const trustScoresMap = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const out = {};
        for (const [id, value] of Object.entries(analysesMap)){
            out[id] = value.trust_score;
        }
        return out;
    }, [
        analysesMap
    ]);
    const buckets = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$dashboardMetrics$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computeDailyBuckets"])(metricsLeads, analysesMap), [
        metricsLeads,
        analysesMap
    ]);
    const doughnutData = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const totals = buckets.reduce((acc, b)=>{
            acc.alta += b.alta;
            acc.media += b.media;
            acc.baja += b.baja;
            return acc;
        }, {
            alta: 0,
            media: 0,
            baja: 0
        });
        // Si no hubo created_at suficientes, fallback al desglose por KPIs.
        if (totals.alta + totals.media + totals.baja === 0) {
            const media = Math.max(0, kpis.total - kpis.altaCalidad - kpis.descartados);
            return {
                alta: kpis.altaCalidad,
                media,
                baja: kpis.descartados
            };
        }
        return totals;
    }, [
        buckets,
        kpis
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-6 space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$KpiRow$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                kpis: kpis
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$LeadsBarChart$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            buckets: buckets,
                            onSeeQueue: onSeeQueue
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/views/DashboardView.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$QualityDoughnut$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            data: doughnutData
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/views/DashboardView.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$RecentLeadsTable$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            leads: metricsLeads,
                            aiScores: trustScoresMap,
                            onSelectLead: onSelectLead,
                            selectedLeadId: selectedLeadId
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/views/DashboardView.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$SourceFunnel$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            leads: metricsLeads
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/views/DashboardView.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$CriteriaCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/product/frontend/views/DashboardView.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex gap-6 h-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-80 flex-shrink-0 flex flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$SimulatorPanel$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                onLeadSimulated: onLeadSimulated
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "text-title-sm font-bold text-neutral-grey-900 mb-6",
                                children: "Leads"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$LeadsFeed$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                items: sortedLeads,
                                onSelectLead: onSelectLead,
                                selectedLeadId: selectedLeadId,
                                newLeadId: newLeadId
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this),
                            spamLeads.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                                className: "mt-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "text-body-xs font-semibold text-brand-primary-500 uppercase tracking-wider mb-3 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                "aria-hidden": "true",
                                                children: "⚠"
                                            }, void 0, false, {
                                                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                                lineNumber: 202,
                                                columnNumber: 17
                                            }, this),
                                            "Leads Spam Detectados (",
                                            spamLeads.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                        lineNumber: 201,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: spamLeads.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: `rounded-card bg-red-950 border border-red-800${item.lead.id === newLeadId ? " animate-enter" : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "sr-only",
                                                        children: "Lead spam:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                                        lineNumber: 213,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$LeadCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            item: item,
                                                            isNew: item.lead.id === newLeadId
                                                        }, void 0, false, {
                                                            fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                                            lineNumber: 215,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                                        lineNumber: 214,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item.lead.id, true, {
                                                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                                lineNumber: 207,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                lineNumber: 200,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: selectedLead ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$LeadDetailPanel$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            lead: selectedLead,
                            analysis: analysis,
                            isLoading: isLoading,
                            properties: properties
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/views/DashboardView.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center h-full text-neutral-grey-500 text-body-sm",
                            children: "Selecciona un lead del feed para ver el análisis IA detallado."
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/views/DashboardView.tsx",
                            lineNumber: 237,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/views/DashboardView.tsx",
        lineNumber: 149,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/product/frontend/components/queue/QueueStats.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QueueStats
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function StatTile({ label, value, valueClassName, testId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        role: "status",
        "aria-label": `${label}: ${value}`,
        "data-testid": testId,
        className: "bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low py-3.5 px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `text-title-md font-bold leading-tight tracking-tight ${valueClassName}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/queue/QueueStats.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mt-1",
                children: label
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/queue/QueueStats.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/queue/QueueStats.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function QueueStats({ total, altaCalidad, bajaCalidad }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-3 gap-3",
        role: "group",
        "aria-label": "Resumen de la cola",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(StatTile, {
                label: "Pendientes",
                value: total,
                valueClassName: "text-neutral-grey-800",
                testId: "queue-stat-total"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/queue/QueueStats.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(StatTile, {
                label: "Alta calidad",
                value: altaCalidad,
                valueClassName: "text-feedback-green-500",
                testId: "queue-stat-alta"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/queue/QueueStats.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(StatTile, {
                label: "Baja calidad",
                value: bajaCalidad,
                valueClassName: "text-brand-primary-500",
                testId: "queue-stat-baja"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/queue/QueueStats.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/queue/QueueStats.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/queue/FilterBar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FilterBar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
const OPTIONS = [
    {
        kind: "all",
        label: "Todos"
    },
    {
        kind: "high",
        label: "Alta calidad"
    },
    {
        kind: "mid",
        label: "Media"
    },
    {
        kind: "low",
        label: "Baja calidad"
    }
];
function FilterBar({ active, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        role: "group",
        "aria-label": "Filtrar cola por calidad",
        "data-testid": "queue-filter-bar",
        className: "flex gap-1.5 items-center",
        children: [
            OPTIONS.map(({ kind, label })=>{
                const isActive = active === kind;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    type: "button",
                    "aria-pressed": isActive,
                    "data-filter-kind": kind,
                    onClick: ()=>onChange(kind),
                    className: [
                        "text-body-sm font-semibold px-3 py-1 rounded-pill border transition-colors duration-150 font-sans",
                        isActive ? "bg-brand-primary-500-15 border-brand-primary-500 text-brand-primary-500" : "bg-transparent border-neutral-grey-200 text-neutral-grey-600 hover:bg-neutral-grey-100"
                    ].join(" "),
                    children: label
                }, kind, false, {
                    fileName: "[project]/product/frontend/components/queue/FilterBar.tsx",
                    lineNumber: 44,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: "ml-auto text-[11px] text-neutral-grey-500 font-semibold",
                children: "↓ Por llegada"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/queue/FilterBar.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/queue/FilterBar.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/queue/QueueCard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QueueCard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$leadReasons$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/lib/leadReasons.ts [ssr] (ecmascript)");
;
;
;
const SCORE_TIER_HIGH = {
    label: "Alta",
    icon: "★",
    pillClass: "bg-feedback-green-500-15 text-feedback-green-500 border border-feedback-green-500",
    avatarClass: "bg-feedback-green-500-15 text-feedback-green-500"
};
const SCORE_TIER_MID = {
    label: "Media",
    icon: "—",
    pillClass: "bg-feedback-yellow-500-15 text-feedback-yellow-500 border border-feedback-yellow-500",
    avatarClass: "bg-feedback-yellow-500-15 text-feedback-yellow-500"
};
const SCORE_TIER_LOW = {
    label: "Baja",
    icon: "⚠",
    pillClass: "bg-brand-primary-500-15 text-brand-primary-500 border border-brand-primary-500",
    avatarClass: "bg-brand-primary-500-15 text-brand-primary-500"
};
function tierFor(score) {
    if (score >= 75) return SCORE_TIER_HIGH;
    if (score >= 40) return SCORE_TIER_MID;
    return SCORE_TIER_LOW;
}
/** Deriva un display name humano desde el email (o "Lead {id}"). */ function deriveDisplayName(lead) {
    const email = (lead.email ?? "").trim();
    if (email && email.includes("@")) {
        const local = email.split("@")[0];
        if (local && local.length > 0) {
            const cleaned = local.replace(/[._\-]+/g, " ").trim();
            return cleaned.split(/\s+/).map((p)=>p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
        }
    }
    return `Lead ${lead.id}`;
}
function avatarInitial(name) {
    const trimmed = name.trim();
    if (!trimmed) return "?";
    return trimmed.charAt(0).toUpperCase();
}
/**
 * Enmascarado de email: primera letra + "•••@•••." + tld original.
 * Ejemplos:
 *   "juan@gmail.com" → "j•••@•••.com"
 *   "ana.maria@correo.com.ar" → "a•••@•••.ar"
 *   ""               → ""
 */ function maskEmail(raw) {
    const email = (raw ?? "").trim();
    if (!email || !email.includes("@")) return "";
    const [local, domain] = email.split("@");
    const firstChar = local.charAt(0).toLowerCase() || "•";
    const tldMatch = domain.split(".");
    const tld = tldMatch.length > 1 ? tldMatch[tldMatch.length - 1] : "com";
    return `${firstChar}•••@•••.${tld}`;
}
/** Masking de teléfono — placeholder fijo según el HTML target. */ const MASKED_PHONE = "••• •••••••";
/** Convierte el ISO created_at en un texto humanizado tipo "Hace 2 hs". */ function formatTimestamp(createdAt, now = new Date()) {
    if (!createdAt) return "Hoy";
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "Hoy";
    const diffMs = now.getTime() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Hace un momento";
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `Hace ${days} d`;
    // > 7 días: fecha cruda DD/MM
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}`;
}
/** Operación inferida del presupuesto (Venta si ≥ 80k, sino Alquiler). */ function inferOperacion(presupuesto) {
    return presupuesto >= 80000 ? "Venta" : "Alquiler";
}
function capitalize(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function QueueCard({ lead, analysis, trust_score, onCrearContacto, onAsignar, onEliminar }) {
    const [revealed, setRevealed] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const tier = tierFor(trust_score);
    const displayName = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>deriveDisplayName(lead), [
        lead
    ]);
    const initial = avatarInitial(displayName);
    const timestamp = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>formatTimestamp(lead.created_at), [
        lead.created_at
    ]);
    const reasons = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$leadReasons$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["deriveReasons"])(lead, analysis ? {
            is_spam: analysis.is_spam,
            detected_intent: analysis.detected_intent
        } : undefined), [
        lead,
        analysis
    ]);
    const maskedEmail = maskEmail(lead.email ?? "");
    const hasEmail = Boolean((lead.email ?? "").trim());
    const hasPhone = Boolean((lead.telefono ?? "").trim());
    const showContactRow = hasEmail || hasPhone;
    const propertyLabel = (lead.direccion_propiedad ?? "").trim();
    const agencyLabel = (lead.agencia ?? "").trim();
    const showPropertyRow = Boolean(propertyLabel || agencyLabel);
    const zonaLabel = lead.zona ? `Capital Federal | ${lead.zona}` : null;
    const tipoLabel = lead.tipo_propiedad ? capitalize(lead.tipo_propiedad.replace(/_/g, " ")) : null;
    const operacion = inferOperacion(lead.presupuesto_usd);
    const sourceLabel = lead.source ?? null;
    const tags = [
        sourceLabel,
        zonaLabel,
        operacion,
        tipoLabel
    ].filter((t)=>Boolean(t));
    function handleReveal() {
        setRevealed((prev)=>!prev);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
        "data-testid": "queue-card",
        "data-lead-id": lead.id,
        "aria-label": `Lead ${displayName}`,
        className: "bg-surface-ground border border-neutral-grey-200 rounded-card p-5 mb-3 transition-all duration-150 hover:border-neutral-grey-400 hover:shadow-low animate-enter",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                "aria-hidden": "true",
                                className: `flex items-center justify-center w-[38px] h-[38px] rounded-full text-[13px] font-bold flex-shrink-0 ${tier.avatarClass}`,
                                "data-testid": "queue-card-avatar",
                                children: initial
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-body-md font-semibold text-neutral-grey-800 leading-tight",
                                        children: displayName
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-[11px] text-neutral-grey-500 mt-0.5",
                                        children: timestamp
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                        lineNumber: 207,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                "data-testid": "queue-card-score-pill",
                                className: `flex items-center gap-1.5 px-3 py-1 rounded-pill text-[11px] font-semibold ${tier.pillClass}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        children: tier.icon
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                        lineNumber: 217,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: [
                                            tier.label,
                                            " · ",
                                            Math.round(trust_score),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                        lineNumber: 218,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                lineNumber: 213,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-label": "Eliminar lead",
                                onClick: ()=>onEliminar?.(lead.id),
                                className: "bg-transparent border-0 text-neutral-grey-400 hover:text-brand-primary-500 cursor-pointer text-[16px] p-1 transition-colors",
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this),
            reasons.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex gap-1.5 flex-wrap mb-3",
                "data-testid": "queue-card-reasons",
                role: "list",
                "aria-label": "Razones de scoring",
                children: reasons.map((chip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        role: "listitem",
                        "data-reason-id": chip.id,
                        "data-reason-variant": chip.variant,
                        className: [
                            "text-[10px] px-2 py-0.5 rounded-pill flex items-center gap-1 font-semibold",
                            chip.variant === "positive" ? "bg-feedback-green-500-15 text-feedback-green-500" : "bg-brand-primary-500-15 text-brand-primary-500"
                        ].join(" "),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                children: chip.variant === "positive" ? "✓" : "✗"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                lineNumber: 254,
                                columnNumber: 15
                            }, this),
                            chip.label
                        ]
                    }, chip.id, true, {
                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                        lineNumber: 242,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                lineNumber: 235,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "h-px bg-neutral-grey-200 my-3",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            showContactRow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3 mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-x-5 gap-y-2 flex-1",
                        children: [
                            hasEmail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mb-0.5",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                        lineNumber: 275,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        "data-testid": "queue-card-email",
                                        className: "text-[12px] font-semibold text-neutral-grey-700",
                                        children: revealed ? lead.email : maskedEmail
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                        lineNumber: 278,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                lineNumber: 274,
                                columnNumber: 15
                            }, this),
                            hasPhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mb-0.5",
                                        children: "Teléfono"
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                        lineNumber: 288,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        "data-testid": "queue-card-phone",
                                        className: "text-[12px] font-semibold text-neutral-grey-700",
                                        children: revealed ? lead.telefono : MASKED_PHONE
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                        lineNumber: 291,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                lineNumber: 287,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                        lineNumber: 272,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "data-testid": "queue-card-reveal",
                        "aria-label": revealed ? "Ocultar contacto" : "Mostrar contacto",
                        "aria-pressed": revealed,
                        onClick: handleReveal,
                        className: "bg-transparent border border-neutral-grey-200 text-neutral-grey-600 hover:text-brand-primary-500 hover:border-brand-primary-500 cursor-pointer rounded-chip px-2 py-1 text-[14px] transition-colors",
                        children: revealed ? "🙈" : "👁"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                lineNumber: 271,
                columnNumber: 9
            }, this),
            showPropertyRow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2.5 px-3 py-2 bg-surface-low rounded-chip mb-2.5 border border-neutral-grey-200",
                "data-testid": "queue-card-property",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        "aria-hidden": "true",
                        className: "w-[34px] h-[34px] rounded-md bg-brand-secondary-500/15 flex items-center justify-center text-[16px] flex-shrink-0",
                        children: "🏢"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                        lineNumber: 319,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            propertyLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "text-[12px] font-semibold text-neutral-grey-800 truncate",
                                children: propertyLabel
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                lineNumber: 327,
                                columnNumber: 15
                            }, this),
                            agencyLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "text-[10px] text-neutral-grey-500 mt-0.5 truncate",
                                children: agencyLabel
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                                lineNumber: 332,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                        lineNumber: 325,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                lineNumber: 315,
                columnNumber: 9
            }, this),
            lead.mensaje && lead.mensaje.trim().length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                "data-testid": "queue-card-message",
                className: "text-[12px] text-neutral-grey-700 px-3 py-2 bg-surface-low rounded-chip mb-2.5 leading-relaxed border-l-[3px] border-l-brand-secondary-500",
                children: lead.mensaje
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                lineNumber: 342,
                columnNumber: 9
            }, this),
            tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex gap-1.5 flex-wrap mb-3.5",
                "data-testid": "queue-card-tags",
                children: tags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-[10px] px-2 py-0.5 rounded-pill bg-surface-low text-neutral-grey-600 border border-neutral-grey-200 font-semibold",
                        children: t
                    }, t, false, {
                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                        lineNumber: 357,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                lineNumber: 352,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "data-testid": "queue-card-action-create",
                        onClick: ()=>onCrearContacto?.(lead.id),
                        className: "text-[12px] px-3.5 py-1.5 rounded-button bg-brand-primary-500 text-white border-0 cursor-pointer font-sans font-bold hover:opacity-90 transition-opacity",
                        children: "Crear contacto"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "data-testid": "queue-card-action-assign",
                        onClick: ()=>onAsignar?.(lead.id),
                        className: "text-[12px] px-3.5 py-1.5 rounded-button bg-transparent text-neutral-grey-700 border border-neutral-grey-200 cursor-pointer font-sans font-semibold hover:bg-neutral-grey-100 transition-colors",
                        children: "Asignar"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                        lineNumber: 377,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "data-testid": "queue-card-action-delete",
                        onClick: ()=>onEliminar?.(lead.id),
                        className: "text-[12px] px-3.5 py-1.5 rounded-button bg-transparent text-brand-primary-500 border border-brand-primary-500 cursor-pointer font-sans font-semibold ml-auto hover:bg-brand-primary-500-15 transition-colors",
                        children: "Eliminar"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                        lineNumber: 385,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/queue/QueueCard.tsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/views/QueueView.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QueueView
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$scoreUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/lib/scoreUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$queue$2f$QueueStats$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/queue/QueueStats.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$queue$2f$FilterBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/queue/FilterBar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$queue$2f$QueueCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/queue/QueueCard.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
function classifyFilter(score) {
    if (score >= 75) return "high";
    if (score >= 40) return "mid";
    return "low";
}
function compareByCreatedAtDesc(a, b) {
    const aTime = a.created_at ? Date.parse(a.created_at) : NaN;
    const bTime = b.created_at ? Date.parse(b.created_at) : NaN;
    const aValid = !Number.isNaN(aTime);
    const bValid = !Number.isNaN(bTime);
    if (aValid && bValid) return bTime - aTime;
    if (aValid) return -1;
    if (bValid) return 1;
    return 0;
}
function QueueView({ leads, aiScores, analysisByLeadId }) {
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("all");
    const [dismissedIds, setDismissedIds] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>new Set());
    const resolved = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return leads.filter((l)=>!dismissedIds.has(l.id)).map((lead)=>{
            const aiTrust = aiScores[lead.id];
            const trust_score = typeof aiTrust === "number" ? aiTrust : (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$scoreUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computeLocalScore"])(lead).trust_score;
            return {
                lead,
                trust_score,
                analysis: analysisByLeadId?.[lead.id]
            };
        }).sort((a, b)=>compareByCreatedAtDesc(a.lead, b.lead));
    }, [
        leads,
        aiScores,
        analysisByLeadId,
        dismissedIds
    ]);
    const stats = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        let total = 0;
        let alta = 0;
        let baja = 0;
        for (const r of resolved){
            total += 1;
            if (r.trust_score >= 75) alta += 1;
            else if (r.trust_score < 40) baja += 1;
        }
        return {
            total,
            alta,
            baja
        };
    }, [
        resolved
    ]);
    const filtered = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (filter === "all") return resolved;
        return resolved.filter((r)=>classifyFilter(r.trust_score) === filter);
    }, [
        resolved,
        filter
    ]);
    function handleEliminar(leadId) {
        setDismissedIds((prev)=>{
            const next = new Set(prev);
            next.add(leadId);
            return next;
        });
    }
    // Handlers no-op para feature 14 (la integración real llega después).
    function handleCrearContacto(_leadId) {
    /* placeholder hasta feature de Contactos */ }
    function handleAsignar(_leadId) {
    /* placeholder hasta feature de Equipo */ }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        "data-testid": "queue-view",
        className: "px-6 py-6 space-y-4 overflow-y-auto h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$queue$2f$QueueStats$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                total: stats.total,
                altaCalidad: stats.alta,
                bajaCalidad: stats.baja
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/QueueView.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$queue$2f$FilterBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                active: filter,
                onChange: setFilter
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/QueueView.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                "data-testid": "queue-list",
                className: "space-y-3 transition-all duration-300",
                role: "list",
                "aria-label": "Lista de leads en cola",
                children: [
                    filtered.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "py-8 text-center text-neutral-grey-500 text-body-sm",
                        children: "No hay leads en esta categoría"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/QueueView.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this),
                    filtered.map(({ lead, trust_score, analysis })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            role: "listitem",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$queue$2f$QueueCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                lead: lead,
                                analysis: analysis,
                                trust_score: trust_score,
                                onCrearContacto: handleCrearContacto,
                                onAsignar: handleAsignar,
                                onEliminar: handleEliminar
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/views/QueueView.tsx",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this)
                        }, lead.id, false, {
                            fileName: "[project]/product/frontend/views/QueueView.tsx",
                            lineNumber: 143,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/views/QueueView.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/views/QueueView.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/views/ProcessedView.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProcessedView
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function ProcessedView({ onBackToDashboard }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        "data-testid": "processed-view",
        className: "flex h-full w-full items-center justify-center px-6 py-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex w-full max-w-md flex-col items-center gap-4 rounded-card bg-surface-ground p-8 text-center shadow-low",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    "aria-hidden": "true",
                    className: "text-6xl leading-none",
                    children: "🚧"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/views/ProcessedView.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "text-title-md font-bold text-neutral-grey-800",
                    children: "Vista en construcción"
                }, void 0, false, {
                    fileName: "[project]/product/frontend/views/ProcessedView.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-body-md text-neutral-grey-600",
                    children: "Esta sección estará disponible próximamente. Mientras tanto, podés gestionar tus leads desde el dashboard."
                }, void 0, false, {
                    fileName: "[project]/product/frontend/views/ProcessedView.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>onBackToDashboard?.(),
                    className: "mt-2 inline-flex items-center gap-2 rounded-pill bg-brand-primary-500 px-5 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-brand-primary-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            "aria-hidden": "true",
                            children: "←"
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/views/ProcessedView.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        "Volver al dashboard"
                    ]
                }, void 0, true, {
                    fileName: "[project]/product/frontend/views/ProcessedView.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/product/frontend/views/ProcessedView.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/product/frontend/views/ProcessedView.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/lib/criteriaDefaults.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * criteriaDefaults — fuente de verdad de la vista Criterios (feature 15).
 *
 * Centraliza el estado por defecto del configurador (`CriteriaState`) para que
 * tanto `CriteriaView` como sus tests usen el MISMO baseline. El botón
 * "Restablecer defaults" debe poder volver a estos valores sin recargar la
 * página: el consumidor hace `setState(CRITERIA_DEFAULTS)`.
 *
 * Los valores reproducen el HTML target
 * (ui-ux/lead-trust-dashboard-tokko (3).html, sección `#view-criteria`,
 * líneas 831-888):
 *
 *  - Datos de contacto: 3 criterios con toggle on + peso Media/Alta/Media.
 *  - Propiedad y fuente: 2 criterios con toggle on + peso Alta/Media.
 *  - Mensaje: 2 criterios con toggle on + peso Media/Baja.
 *  - Pesos de dimensiones: Trust 40 / Conversión 40 / Urgencia 20 (suma 100).
 *  - Filtros automáticos: 4 toggles (3 on, "Ignorar sin mensaje" off).
 *  - Keywords positivas: visita, interesado, mudanza, comprar, urgente.
 *  - Keywords negativas: prueba, test, demo.
 */ __turbopack_context__.s([
    "CRITERIA_DEFAULTS",
    ()=>CRITERIA_DEFAULTS,
    "WEIGHT_OPTIONS",
    ()=>WEIGHT_OPTIONS,
    "cloneDefaults",
    ()=>cloneDefaults
]);
const WEIGHT_OPTIONS = [
    "Alta",
    "Media",
    "Baja"
];
const CRITERIA_DEFAULTS = {
    contacto: {
        email: {
            id: "email",
            enabled: true,
            weight: "Media"
        },
        telefono: {
            id: "telefono",
            enabled: true,
            weight: "Alta"
        },
        telefonoCompleto: {
            id: "telefonoCompleto",
            enabled: true,
            weight: "Media"
        }
    },
    propiedadFuente: {
        solicitudVisita: {
            id: "solicitudVisita",
            enabled: true,
            weight: "Alta"
        },
        portalVerificado: {
            id: "portalVerificado",
            enabled: true,
            weight: "Media"
        }
    },
    mensaje: {
        noVacio: {
            id: "noVacio",
            enabled: true,
            weight: "Media"
        },
        extenso: {
            id: "extenso",
            enabled: true,
            weight: "Baja"
        }
    },
    pesos: {
        trust: 40,
        conversion: 40,
        urgency: 20
    },
    filtrosAutomaticos: {
        bloquearInvalidos: true,
        detectarSpam: true,
        filtrarDuplicados: true,
        ignorarSinMensaje: false
    },
    keywords: {
        positivas: [
            "visita",
            "interesado",
            "mudanza",
            "comprar",
            "urgente"
        ],
        negativas: [
            "prueba",
            "test",
            "demo"
        ]
    }
};
function cloneDefaults() {
    return {
        contacto: {
            email: {
                ...CRITERIA_DEFAULTS.contacto.email
            },
            telefono: {
                ...CRITERIA_DEFAULTS.contacto.telefono
            },
            telefonoCompleto: {
                ...CRITERIA_DEFAULTS.contacto.telefonoCompleto
            }
        },
        propiedadFuente: {
            solicitudVisita: {
                ...CRITERIA_DEFAULTS.propiedadFuente.solicitudVisita
            },
            portalVerificado: {
                ...CRITERIA_DEFAULTS.propiedadFuente.portalVerificado
            }
        },
        mensaje: {
            noVacio: {
                ...CRITERIA_DEFAULTS.mensaje.noVacio
            },
            extenso: {
                ...CRITERIA_DEFAULTS.mensaje.extenso
            }
        },
        pesos: {
            ...CRITERIA_DEFAULTS.pesos
        },
        filtrosAutomaticos: {
            ...CRITERIA_DEFAULTS.filtrosAutomaticos
        },
        keywords: {
            positivas: [
                ...CRITERIA_DEFAULTS.keywords.positivas
            ],
            negativas: [
                ...CRITERIA_DEFAULTS.keywords.negativas
            ]
        }
    };
}
}),
"[project]/product/frontend/lib/criteriaStorage.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STORAGE_KEY",
    ()=>STORAGE_KEY,
    "clearCriteria",
    ()=>clearCriteria,
    "loadCriteria",
    ()=>loadCriteria,
    "saveCriteria",
    ()=>saveCriteria
]);
const STORAGE_KEY = "criteria_v1";
function getStorage() {
    try {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    } catch  {
        return null;
    }
}
function loadCriteria() {
    const storage = getStorage();
    if (!storage) return null;
    try {
        const raw = storage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed;
    } catch  {
        return null;
    }
}
function saveCriteria(state) {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch  {
    // quota excedido o storage no disponible — no rompemos la UI.
    }
}
function clearCriteria() {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.removeItem(STORAGE_KEY);
    } catch  {
    // ignore
    }
}
}),
"[project]/product/frontend/components/criteria/CriteriaSection.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CriteriaSection
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function CriteriaSection({ title, children, intro, testId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        "data-testid": testId,
        "aria-label": title,
        className: "bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                className: "text-[13px] font-semibold text-neutral-grey-800 mb-3",
                children: title
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/criteria/CriteriaSection.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            intro ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-[11px] text-neutral-grey-500 mb-3",
                children: intro
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/criteria/CriteriaSection.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: children
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/criteria/CriteriaSection.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/criteria/CriteriaSection.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/criteria/CriterionRow.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CriterionRow
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$criteriaDefaults$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/lib/criteriaDefaults.ts [ssr] (ecmascript)");
;
;
function CriterionRow({ label, description, config, onChange }) {
    const checked = config.enabled;
    function handleToggle() {
        onChange({
            ...config,
            enabled: !config.enabled
        });
    }
    function handleWeightChange(e) {
        onChange({
            ...config,
            weight: e.target.value
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between gap-3 py-3 border-b border-neutral-grey-100 last:border-b-0",
        "data-criterion-id": config.id,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1 pr-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-[12px] font-semibold text-neutral-grey-800",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/criteria/CriterionRow.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-[11px] text-neutral-grey-500",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/criteria/CriterionRow.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/criteria/CriterionRow.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                "aria-label": `${label} (peso)`,
                value: config.weight,
                onChange: handleWeightChange,
                disabled: !config.enabled,
                "data-testid": `crit-weight-${config.id}`,
                className: "text-[11px] font-semibold text-neutral-grey-800 bg-surface-low border border-neutral-grey-200 rounded-chip px-2 py-1 disabled:opacity-50",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$criteriaDefaults$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["WEIGHT_OPTIONS"].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                        value: opt,
                        children: opt
                    }, opt, false, {
                        fileName: "[project]/product/frontend/components/criteria/CriterionRow.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/criteria/CriterionRow.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                role: "switch",
                "aria-checked": checked,
                "aria-label": label,
                onClick: handleToggle,
                "data-testid": `crit-toggle-${config.id}`,
                className: `relative inline-flex h-5 w-9 items-center rounded-pill transition-colors ${checked ? "bg-brand-primary-500" : "bg-neutral-grey-300"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    "aria-hidden": "true",
                    className: `inline-block h-4 w-4 transform rounded-full bg-white shadow-low transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`
                }, void 0, false, {
                    fileName: "[project]/product/frontend/components/criteria/CriterionRow.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/criteria/CriterionRow.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/criteria/CriterionRow.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/components/criteria/KeywordsList.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>KeywordsList
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const VARIANT_CHIP = {
    positive: "bg-feedback-green-500-15 border-feedback-green-500 text-feedback-green-500",
    negative: "bg-brand-primary-500-15 border-brand-primary-500 text-brand-primary-500"
};
const VARIANT_BTN = {
    positive: "bg-feedback-green-500 hover:opacity-90 text-white",
    negative: "bg-brand-primary-500 hover:bg-brand-primary-700 text-white"
};
const VARIANT_DEFAULT_DESC = {
    positive: "El mensaje contiene estas palabras — suma puntos",
    negative: "Penaliza si el mensaje las contiene"
};
function KeywordsList({ title, variant, items, onAdd, onRemove, description }) {
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    function commit() {
        const cleaned = draft.trim().toLowerCase();
        if (!cleaned) return;
        setDraft("");
        onAdd(cleaned);
    }
    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            commit();
        }
    }
    const chipCls = VARIANT_CHIP[variant];
    const btnCls = VARIANT_BTN[variant];
    const desc = description ?? VARIANT_DEFAULT_DESC[variant];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        "aria-label": title,
        "data-variant": variant,
        "data-testid": `kw-list-${variant}`,
        className: "mt-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-[12px] font-semibold text-neutral-grey-800",
                children: title
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/criteria/KeywordsList.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-[11px] text-neutral-grey-500 mb-2",
                children: desc
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/criteria/KeywordsList.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                role: "list",
                "aria-label": `Lista ${title}`,
                className: "flex flex-wrap gap-2 mb-3",
                children: items.map((kw, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                        "data-testid": `kw-chip-${variant}-${kw}`,
                        className: `inline-flex items-center gap-1 text-[11px] font-semibold rounded-chip border px-2 py-1 ${chipCls}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: kw
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/criteria/KeywordsList.tsx",
                                lineNumber: 107,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-label": `Eliminar ${kw}`,
                                onClick: ()=>onRemove(idx),
                                className: "ml-1 leading-none text-[12px] font-bold opacity-80 hover:opacity-100",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/components/criteria/KeywordsList.tsx",
                                lineNumber: 108,
                                columnNumber: 13
                            }, this)
                        ]
                    }, `${kw}-${idx}`, true, {
                        fileName: "[project]/product/frontend/components/criteria/KeywordsList.tsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/product/frontend/components/criteria/KeywordsList.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: draft,
                        onChange: (e)=>setDraft(e.target.value),
                        onKeyDown: handleKeyDown,
                        placeholder: "agregar palabra…",
                        "aria-label": `Agregar palabra a ${title}`,
                        "data-testid": `kw-input-${variant}`,
                        className: "flex-1 text-[12px] text-neutral-grey-800 bg-surface-ground border border-neutral-grey-200 rounded-chip px-3 py-2 focus:outline-none focus:border-brand-secondary-500"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/criteria/KeywordsList.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: commit,
                        "data-testid": `kw-add-${variant}`,
                        className: `text-[12px] font-semibold rounded-chip px-3 py-2 ${btnCls}`,
                        children: "Agregar"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/criteria/KeywordsList.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/criteria/KeywordsList.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/criteria/KeywordsList.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/frontend/views/CriteriaView.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CriteriaView
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$criteriaDefaults$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/lib/criteriaDefaults.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$criteriaStorage$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/lib/criteriaStorage.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$CriteriaSection$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/criteria/CriteriaSection.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$CriterionRow$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/criteria/CriterionRow.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$KeywordsList$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/criteria/KeywordsList.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$common$2f$Toast$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/common/Toast.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
;
;
const CONTACTO_ROWS = [
    {
        key: "email",
        label: "Tiene email",
        description: "El lead proveyó un email de contacto"
    },
    {
        key: "telefono",
        label: "Tiene teléfono",
        description: "Celular o fijo registrado"
    },
    {
        key: "telefonoCompleto",
        label: "Teléfono completo (≥10 dígitos)",
        description: "Al menos 10 dígitos"
    }
];
const PROPIEDAD_ROWS = [
    {
        key: "solicitudVisita",
        label: "Solicitud de visita",
        description: "El mensaje menciona fecha o pedido de turno"
    },
    {
        key: "portalVerificado",
        label: "Portal verificado",
        description: "Lead proviene de portal real (no demo/test)"
    }
];
const MENSAJE_ROWS = [
    {
        key: "noVacio",
        label: "Mensaje no vacío",
        description: "El contacto escribió algo"
    },
    {
        key: "extenso",
        label: "Mensaje extenso (>30 chars)",
        description: "Más de 30 caracteres — indica intención real"
    }
];
const FILTROS_ROWS = [
    {
        key: "bloquearInvalidos",
        label: "Bloquear números inválidos",
        sub: "Formato de teléfono no válido"
    },
    {
        key: "detectarSpam",
        label: "Detectar spam automático",
        sub: "Mensajes tipo bot o repetidos"
    },
    {
        key: "filtrarDuplicados",
        label: "Filtrar duplicados",
        sub: "Mismo contacto en 48hs"
    },
    {
        key: "ignorarSinMensaje",
        label: "Ignorar sin mensaje",
        sub: "Lead sin texto de consulta"
    }
];
function WeightSlider({ id, label, emoji, value, valueColor, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 mb-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: id,
                        className: "text-[12px] font-semibold text-neutral-grey-800 flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                children: emoji
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this),
                            label
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: `text-[12px] font-bold ${valueColor}`,
                        children: [
                            value,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                id: id,
                type: "range",
                min: 0,
                max: 100,
                value: value,
                onChange: (e)=>onChange(Number(e.target.value)),
                "aria-label": `${label} (porcentaje)`,
                className: "w-full accent-brand-primary-500"
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
function FilterToggleRow({ label, sub, checked, onToggle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between py-3 border-b border-neutral-grey-100 last:border-b-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "min-w-0 pr-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-[12px] font-semibold text-neutral-grey-800",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-[11px] text-neutral-grey-500",
                        children: sub
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                role: "switch",
                "aria-checked": checked,
                "aria-label": label,
                onClick: onToggle,
                className: `relative inline-flex h-5 w-9 items-center rounded-pill transition-colors ${checked ? "bg-brand-primary-500" : "bg-neutral-grey-300"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    "aria-hidden": "true",
                    className: `inline-block h-4 w-4 transform rounded-full bg-white shadow-low transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`
                }, void 0, false, {
                    fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}
function CriteriaView({ initialState }) {
    // Hidratación: priorizar override de tests > localStorage > defaults.
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        if (initialState) return initialState;
        const stored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$criteriaStorage$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["loadCriteria"])();
        return stored ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$criteriaDefaults$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["cloneDefaults"])();
    });
    const [toastOpen, setToastOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    function updateContacto(key, next) {
        setState((prev)=>({
                ...prev,
                contacto: {
                    ...prev.contacto,
                    [key]: next
                }
            }));
    }
    function updatePropiedad(key, next) {
        setState((prev)=>({
                ...prev,
                propiedadFuente: {
                    ...prev.propiedadFuente,
                    [key]: next
                }
            }));
    }
    function updateMensaje(key, next) {
        setState((prev)=>({
                ...prev,
                mensaje: {
                    ...prev.mensaje,
                    [key]: next
                }
            }));
    }
    function updatePeso(key, value) {
        setState((prev)=>({
                ...prev,
                pesos: {
                    ...prev.pesos,
                    [key]: value
                }
            }));
    }
    function toggleFiltro(key) {
        setState((prev)=>({
                ...prev,
                filtrosAutomaticos: {
                    ...prev.filtrosAutomaticos,
                    [key]: !prev.filtrosAutomaticos[key]
                }
            }));
    }
    function addKeyword(variant, item) {
        setState((prev)=>{
            const current = prev.keywords[variant];
            // Dedup case-insensitive (item ya viene en lowercase).
            if (current.some((k)=>k.toLowerCase() === item.toLowerCase())) {
                return prev;
            }
            return {
                ...prev,
                keywords: {
                    ...prev.keywords,
                    [variant]: [
                        ...current,
                        item
                    ]
                }
            };
        });
    }
    function removeKeyword(variant, index) {
        setState((prev)=>({
                ...prev,
                keywords: {
                    ...prev.keywords,
                    [variant]: prev.keywords[variant].filter((_, i)=>i !== index)
                }
            }));
    }
    function handleReset() {
        setState((0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$criteriaDefaults$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["cloneDefaults"])());
    }
    function handleSave() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$criteriaStorage$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["saveCriteria"])(state);
        setToastOpen(true);
    }
    const totalPesos = state.pesos.trust + state.pesos.conversion + state.pesos.urgency;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        "data-testid": "criteria-view",
        className: "px-6 py-6 space-y-6 overflow-y-auto h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                role: "note",
                "data-testid": "criteria-info-band",
                className: "flex items-start gap-2 rounded-card bg-feedback-blue-500-15 border border-feedback-blue-500 p-4 text-[13px] text-feedback-blue-600",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: "text-[14px] leading-none mt-[1px]",
                        children: "ℹ"
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                        lineNumber: 329,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        children: "Los cambios se aplican automáticamente a todos los leads pendientes. Los scores se recalculan al guardar."
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                lineNumber: 324,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        "data-testid": "criteria-col-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$CriteriaSection$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                title: "Datos de contacto",
                                testId: "section-contacto",
                                children: CONTACTO_ROWS.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$CriterionRow$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        label: row.label,
                                        description: row.description,
                                        config: state.contacto[row.key],
                                        onChange: (next)=>updateContacto(row.key, next)
                                    }, row.key, false, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 347,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$CriteriaSection$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                title: "Propiedad y fuente",
                                testId: "section-propiedad",
                                children: PROPIEDAD_ROWS.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$CriterionRow$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        label: row.label,
                                        description: row.description,
                                        config: state.propiedadFuente[row.key],
                                        onChange: (next)=>updatePropiedad(row.key, next)
                                    }, row.key, false, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 362,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                lineNumber: 357,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$CriteriaSection$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                title: "Pesos de dimensiones",
                                intro: "Distribuí el 100% entre las tres dimensiones",
                                testId: "section-pesos",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(WeightSlider, {
                                        id: "crit-w-trust",
                                        label: "Trust Score",
                                        emoji: "🔒",
                                        value: state.pesos.trust,
                                        valueColor: "text-brand-primary-500",
                                        onChange: (v)=>updatePeso("trust", v)
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 377,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(WeightSlider, {
                                        id: "crit-w-conv",
                                        label: "Conversión",
                                        emoji: "🎯",
                                        value: state.pesos.conversion,
                                        valueColor: "text-feedback-green-500",
                                        onChange: (v)=>updatePeso("conversion", v)
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 385,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(WeightSlider, {
                                        id: "crit-w-urg",
                                        label: "Urgencia",
                                        emoji: "⚡",
                                        value: state.pesos.urgency,
                                        valueColor: "text-feedback-yellow-500",
                                        onChange: (v)=>updatePeso("urgency", v)
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 393,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-[11px] text-neutral-grey-500 mt-1",
                                        "data-testid": "criteria-pesos-total",
                                        children: [
                                            "Total: ",
                                            totalPesos,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                        lineNumber: 341,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        "data-testid": "criteria-col-right",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$CriteriaSection$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                title: "Mensaje",
                                testId: "section-mensaje",
                                children: [
                                    MENSAJE_ROWS.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$CriterionRow$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            label: row.label,
                                            description: row.description,
                                            config: state.mensaje[row.key],
                                            onChange: (next)=>updateMensaje(row.key, next)
                                        }, row.key, false, {
                                            fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                            lineNumber: 414,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$KeywordsList$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        title: "Palabras clave positivas",
                                        variant: "positive",
                                        items: state.keywords.positivas,
                                        onAdd: (item)=>addKeyword("positivas", item),
                                        onRemove: (idx)=>removeKeyword("positivas", idx)
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 423,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$KeywordsList$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        title: "Palabras clave negativas",
                                        variant: "negative",
                                        items: state.keywords.negativas,
                                        onAdd: (item)=>addKeyword("negativas", item),
                                        onRemove: (idx)=>removeKeyword("negativas", idx)
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 431,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                lineNumber: 412,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$criteria$2f$CriteriaSection$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                title: "Filtros automáticos",
                                testId: "section-filtros",
                                children: FILTROS_ROWS.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(FilterToggleRow, {
                                        label: row.label,
                                        sub: row.sub,
                                        checked: state.filtrosAutomaticos[row.key],
                                        onToggle: ()=>toggleFiltro(row.key)
                                    }, row.key, false, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 445,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                lineNumber: 440,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-end gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "min-h-[28px] mr-auto",
                                        "data-testid": "criteria-view-toast-slot",
                                        children: toastOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$common$2f$Toast$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            message: "Criterios guardados",
                                            variant: "success",
                                            onDismiss: ()=>setToastOpen(false)
                                        }, void 0, false, {
                                            fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                            lineNumber: 461,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 456,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleReset,
                                        "data-testid": "criteria-reset-btn",
                                        className: "px-4 py-2 rounded-button border border-neutral-grey-300 text-neutral-grey-700 text-[12px] font-semibold hover:bg-surface-low transition-colors",
                                        children: "Restablecer defaults"
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 468,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleSave,
                                        "data-testid": "criteria-view-save-btn",
                                        className: "px-4 py-2 rounded-button bg-brand-primary-500 text-white text-[12px] font-semibold hover:bg-brand-primary-700 transition-colors",
                                        children: "Guardar criterios →"
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                        lineNumber: 476,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                                lineNumber: 455,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                        lineNumber: 411,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                lineNumber: 339,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
        lineNumber: 319,
        columnNumber: 5
    }, this);
}
}),
"[project]/product/backend/data/leads_mock.json.[json].cjs [ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = JSON.parse("[{\"id\":\"lead-01\",\"mensaje\":\"Hola, estoy buscando un departamento de 2 o 3 ambientes en Palermo o Belgrano, idealmente con balcon y cerca del subte. Tengo listo el presupuesto para cerrar rapido.\",\"telefono\":\"+54 11 4523-7890\",\"email\":\"martin.garcia@gmail.com\",\"zona\":\"Palermo\",\"tipo_propiedad\":\"departamento\",\"presupuesto_usd\":130000,\"property_ids\":[\"prop-01\",\"prop-07\"],\"source\":\"Zonaprop\",\"estado\":\"Nuevo\",\"created_at\":\"2026-05-27T03:15:00.000Z\",\"agencia\":\"Tokko Realty\",\"direccion_propiedad\":\"Av. Santa Fe 2350\"},{\"id\":\"lead-02\",\"mensaje\":\"Busco casa en zona norte GBA con pileta y jardin para familia de 5 personas. Tengo precalificacion bancaria y puedo firmar escritura en 60 dias. Preferencia por San Isidro o Tigre.\",\"telefono\":\"+54 11 6078-3412\",\"email\":\"claudia.benitez@outlook.com\",\"zona\":\"San Isidro\",\"tipo_propiedad\":\"casa\",\"presupuesto_usd\":450000,\"property_ids\":[\"prop-06\",\"prop-11\"],\"source\":\"Argenprop\",\"estado\":\"Calificado\",\"created_at\":\"2026-05-26T09:42:00.000Z\",\"agencia\":\"Bullrich Propiedades\",\"direccion_propiedad\":\"Av. Libertador 4450\"},{\"id\":\"lead-03\",\"mensaje\":\"Me interesa comprar un PH duplex con patio o terraza en Caballito o Flores. Busco algo con buen estado de conservacion, minimo 3 ambientes. Precio hasta 200k USD.\",\"telefono\":\"+54 11 5534-2198\",\"email\":\"rodrigo.perez@hotmail.com\",\"zona\":\"Caballito\",\"tipo_propiedad\":\"ph\",\"presupuesto_usd\":200000,\"property_ids\":[\"prop-03\",\"prop-09\"],\"source\":\"Mail\",\"estado\":\"En revisión\",\"created_at\":\"2026-05-25T17:08:00.000Z\",\"agencia\":\"RE/MAX Argentina\",\"direccion_propiedad\":\"Av. Rivadavia 5820\"},{\"id\":\"lead-04\",\"mensaje\":\"Necesito alquilar una oficina corporativa en Belgrano o Recoleta para mi equipo de 8 personas. Requiero sala de reuniones y estacionamiento. Presupuesto mensual 1500 USD.\",\"telefono\":\"+54 11 4711-9025\",\"email\":\"patricia.romero@empresa.com.ar\",\"zona\":\"Belgrano\",\"tipo_propiedad\":\"oficina\",\"presupuesto_usd\":1500,\"property_ids\":[\"prop-08\"],\"source\":\"Mail\",\"estado\":\"Calificado\",\"created_at\":\"2026-05-24T11:25:00.000Z\",\"agencia\":\"L. J. Ramos Brokers\",\"direccion_propiedad\":\"Av. Cabildo 1875\"},{\"id\":\"lead-05\",\"mensaje\":\"Quiero comprar un local comercial en Palermo o Villa Crespo para abrir un restaurante. El local debe tener minimo 40 m2, frente a calle transitada y habilitacion gastronómica posible.\",\"telefono\":\"+54 11 3378-6640\",\"email\":\"sebastian.morales@yahoo.com\",\"zona\":\"Villa Crespo\",\"tipo_propiedad\":\"local_comercial\",\"presupuesto_usd\":95000,\"property_ids\":[\"prop-04\",\"prop-12\"],\"source\":\"Zonaprop\",\"estado\":\"En revisión\",\"created_at\":\"2026-05-23T14:50:00.000Z\",\"agencia\":\"Castex Propiedades\",\"direccion_propiedad\":\"Honduras 5450\"},{\"id\":\"lead-06\",\"mensaje\":\"info dpto\",\"telefono\":\"+54 11 2200-0001\",\"email\":\"juan@gmail.com\",\"zona\":\"Palermo\",\"tipo_propiedad\":\"departamento\",\"presupuesto_usd\":0,\"property_ids\":[\"prop-01\"],\"source\":\"Chat web\",\"estado\":\"Descartado\",\"created_at\":\"2026-05-22T08:10:00.000Z\",\"agencia\":\"Tokko Realty\",\"direccion_propiedad\":\"Gorriti 4120\"},{\"id\":\"lead-07\",\"mensaje\":\"precio?\",\"telefono\":\"+54 11 1100-5555\",\"email\":\"ana@hotmail.com\",\"zona\":\"Belgrano\",\"tipo_propiedad\":\"casa\",\"presupuesto_usd\":0,\"property_ids\":[\"prop-02\"],\"source\":\"WhatsApp\",\"estado\":\"Descartado\",\"created_at\":\"2026-05-21T19:33:00.000Z\",\"agencia\":\"Inmobiliaria del Plata\",\"direccion_propiedad\":\"Av. Cabildo 1875\"},{\"id\":\"lead-08\",\"mensaje\":\"alquiler\",\"telefono\":\"+54 11 4400-8800\",\"email\":\"pedro@yahoo.com.ar\",\"zona\":\"Caballito\",\"tipo_propiedad\":\"departamento\",\"presupuesto_usd\":0,\"property_ids\":[\"prop-10\"],\"source\":\"Mercadolibre\",\"estado\":\"Descartado\",\"created_at\":\"2026-05-21T10:05:00.000Z\",\"agencia\":\"Miguel Ludmer Inmobiliaria\",\"direccion_propiedad\":\"Av. Rivadavia 5820\"},{\"id\":\"lead-09\",\"mensaje\":\"necesito casa\",\"telefono\":\"+54 11 7700-4400\",\"email\":\"lucas@live.com\",\"zona\":\"Tigre\",\"tipo_propiedad\":\"casa\",\"presupuesto_usd\":0,\"property_ids\":[\"prop-11\"],\"source\":\"Navent\",\"estado\":\"Nuevo\",\"created_at\":\"2026-05-26T16:20:00.000Z\",\"agencia\":\"Toribio Achával\",\"direccion_propiedad\":\"Soldado de la Independencia 990\"},{\"id\":\"lead-10\",\"mensaje\":\"local disponible\",\"telefono\":\"+54 11 9900-3300\",\"email\":\"carlos@icloud.com\",\"zona\":\"Flores\",\"tipo_propiedad\":\"local_comercial\",\"presupuesto_usd\":0,\"property_ids\":[\"prop-04\"],\"source\":\"Chat web\",\"estado\":\"En revisión\",\"created_at\":\"2026-05-25T07:55:00.000Z\",\"agencia\":\"Castex Propiedades\",\"direccion_propiedad\":\"Av. Corrientes 4310\"},{\"id\":\"lead-11\",\"mensaje\":\"comprar propiedad urgente oferta\",\"telefono\":\"123\",\"email\":\"winner2025@mailinator.com\",\"zona\":\"Recoleta\",\"tipo_propiedad\":\"departamento\",\"presupuesto_usd\":0,\"property_ids\":[\"prop-05\"],\"source\":\"Mail\",\"estado\":\"Descartado\",\"created_at\":\"2026-05-22T22:14:00.000Z\",\"agencia\":\"Izrastzoff Estudio Inmobiliario\",\"direccion_propiedad\":\"Posadas 1342 Piso 4 Dpto B\"},{\"id\":\"lead-12\",\"mensaje\":\"FREE PROPERTY INVESTMENT OPPORTUNITY CLICK HERE\",\"telefono\":\"abc-xyz\",\"email\":\"promo@tempmail.com\",\"zona\":\"Palermo\",\"tipo_propiedad\":null,\"presupuesto_usd\":0,\"property_ids\":[\"prop-01\"],\"source\":\"Mercadolibre\",\"estado\":\"Descartado\",\"created_at\":\"2026-05-23T03:47:00.000Z\",\"agencia\":\"RE/MAX Argentina\",\"direccion_propiedad\":\"Bonpland 1885\"},{\"id\":\"lead-13\",\"mensaje\":\"quiero casa jardin piscina mejor precio contactame ya\",\"telefono\":\"99\",\"email\":\"notreal@guerrillamail.com\",\"zona\":\"San Isidro\",\"tipo_propiedad\":\"casa\",\"presupuesto_usd\":0,\"property_ids\":[\"prop-06\"],\"source\":\"WhatsApp\",\"estado\":\"Descartado\",\"created_at\":\"2026-05-24T05:30:00.000Z\",\"agencia\":\"Bullrich Propiedades\",\"direccion_propiedad\":\"Av. Libertador 4450\"},{\"id\":\"lead-14\",\"mensaje\":\"Busco departamento para comprar en Palermo, tengo un presupuesto de 120000 USD pero mi email es nuevo porque tuve problemas con el anterior.\",\"telefono\":\"+54 11 5544-3322\",\"email\":\"comprador2025@tempmail.com\",\"zona\":\"Palermo\",\"tipo_propiedad\":\"departamento\",\"presupuesto_usd\":120000,\"property_ids\":[\"prop-01\",\"prop-07\"],\"source\":\"Zonaprop\",\"estado\":\"En revisión\",\"created_at\":\"2026-05-25T20:02:00.000Z\",\"agencia\":\"Tokko Realty\",\"direccion_propiedad\":\"Av. Santa Fe 2350\"},{\"id\":\"lead-15\",\"mensaje\":\"Me interesa el ph en Caballito\",\"telefono\":\"54119988\",\"email\":\"valeria.torres@gmail.com\",\"zona\":\"Caballito\",\"tipo_propiedad\":\"ph\",\"presupuesto_usd\":175000,\"property_ids\":[\"prop-03\"],\"source\":\"Argenprop\",\"estado\":\"Calificado\",\"created_at\":\"2026-05-26T12:48:00.000Z\",\"agencia\":\"L. J. Ramos Brokers\",\"direccion_propiedad\":\"Av. Rivadavia 5820\"},{\"id\":\"lead-16\",\"mensaje\":\"Hola, quisiera coordinar una visita esta semana, estoy interesado en mudarme cuanto antes a un dos ambientes en Palermo.\",\"telefono\":\"+54 9 11 3421-7788\",\"email\":\"lorena.aguirre@gmail.com\",\"zona\":\"Palermo\",\"tipo_propiedad\":\"departamento\",\"presupuesto_usd\":150000,\"property_ids\":[\"prop-01\"],\"source\":\"Zonaprop\",\"estado\":\"Nuevo\",\"created_at\":\"2026-05-27T05:30:00.000Z\",\"agencia\":\"Tokko Realty\",\"direccion_propiedad\":\"Honduras 5450\"},{\"id\":\"lead-17\",\"mensaje\":\"Me interesa comprar el departamento, tengo el presupuesto aprobado y puedo cerrar rápido en Belgrano.\",\"telefono\":\"+54 9 11 5670-2244\",\"email\":\"ezequiel.mendez@gmail.com\",\"zona\":\"Belgrano\",\"tipo_propiedad\":\"departamento\",\"presupuesto_usd\":240000,\"property_ids\":[\"prop-02\"],\"source\":\"Argenprop\",\"estado\":\"Calificado\",\"created_at\":\"2026-05-27T07:12:00.000Z\",\"agencia\":\"RE/MAX Argentina\",\"direccion_propiedad\":\"Av. Cabildo 1875\"},{\"id\":\"lead-18\",\"mensaje\":\"Hola! Vi la publicación y me interesa visitar la casa en San Isidro este fin de semana.\",\"telefono\":\"+54 9 11 6789-1100\",\"email\":\"natalia.vidal@gmail.com\",\"zona\":\"San Isidro\",\"tipo_propiedad\":\"casa\",\"presupuesto_usd\":380000,\"property_ids\":[\"prop-06\"],\"source\":\"WhatsApp\",\"estado\":\"En revisión\",\"created_at\":\"2026-05-27T09:45:00.000Z\",\"agencia\":\"Bullrich Propiedades\",\"direccion_propiedad\":\"Charcas 3890\"},{\"id\":\"lead-19\",\"mensaje\":\"asdf\",\"telefono\":\"000-0000\",\"email\":\"user2837@tempmail.org\",\"zona\":\"Flores\",\"tipo_propiedad\":null,\"presupuesto_usd\":0,\"property_ids\":[\"prop-09\"],\"source\":\"Mercadolibre\",\"estado\":\"Descartado\",\"created_at\":\"2026-05-27T11:55:00.000Z\",\"agencia\":\"Castex Propiedades\",\"direccion_propiedad\":\"Bonpland 1885\"},{\"id\":\"lead-20\",\"mensaje\":\"Buenas, estoy interesado en visitar la propiedad este fin de semana en Recoleta. Llamame cuando puedas.\",\"telefono\":\"+54 9 11 7821-3344\",\"email\":\"francisco.lopez@gmail.com\",\"zona\":\"Recoleta\",\"tipo_propiedad\":\"departamento\",\"presupuesto_usd\":200000,\"property_ids\":[\"prop-05\"],\"source\":\"Zonaprop\",\"estado\":\"Nuevo\",\"created_at\":\"2026-05-26T07:18:00.000Z\",\"agencia\":\"Izrastzoff Estudio Inmobiliario\",\"direccion_propiedad\":\"Posadas 1342 Piso 4 Dpto B\"},{\"id\":\"lead-21\",\"mensaje\":\"Necesito comprar urgente porque vence mi contrato de alquiler. ¿Coordinamos visita en Caballito?\",\"telefono\":\"+54 9 11 8902-4455\",\"email\":\"andrea.fernandez@gmail.com\",\"zona\":\"Caballito\",\"tipo_propiedad\":\"departamento\",\"presupuesto_usd\":120000,\"property_ids\":[\"prop-10\"],\"source\":\"Mail\",\"estado\":\"Calificado\",\"created_at\":\"2026-05-26T14:36:00.000Z\",\"agencia\":\"Miguel Ludmer Inmobiliaria\",\"direccion_propiedad\":\"Av. Rivadavia 5820\"},{\"id\":\"lead-22\",\"mensaje\":\"Me interesa la propiedad, ya vendí mi anterior departamento y necesito mudarme en 30 días a Villa Crespo.\",\"telefono\":\"+54 9 11 9013-5566\",\"email\":\"ricardo.cabrera@gmail.com\",\"zona\":\"Villa Crespo\",\"tipo_propiedad\":\"departamento\",\"presupuesto_usd\":175000,\"property_ids\":[\"prop-01\",\"prop-07\"],\"source\":\"Chat web\",\"estado\":\"En revisión\",\"created_at\":\"2026-05-26T21:09:00.000Z\",\"agencia\":\"Tokko Realty\",\"direccion_propiedad\":\"Gorriti 4120\"},{\"id\":\"lead-23\",\"mensaje\":\"test\",\"telefono\":\"000-0000\",\"email\":\"user5523@tempmail.org\",\"zona\":\"Almagro\",\"tipo_propiedad\":null,\"presupuesto_usd\":0,\"property_ids\":[\"prop-10\"],\"source\":\"Navent\",\"estado\":\"Descartado\",\"created_at\":\"2026-05-25T04:22:00.000Z\",\"agencia\":\"RE/MAX Argentina\",\"direccion_propiedad\":\"Av. Corrientes 4310\"},{\"id\":\"lead-24\",\"mensaje\":\"Hola, vi el aviso y quiero ir a verla. ¿Hay disponibilidad mañana a la tarde en Tigre?\",\"telefono\":\"+54 9 11 1024-6677\",\"email\":\"veronica.iglesias@gmail.com\",\"zona\":\"Tigre\",\"tipo_propiedad\":\"casa\",\"presupuesto_usd\":300000,\"property_ids\":[\"prop-11\"],\"source\":\"Zonaprop\",\"estado\":\"Nuevo\",\"created_at\":\"2026-05-25T10:41:00.000Z\",\"agencia\":\"Toribio Achával\",\"direccion_propiedad\":\"Soldado de la Independencia 990\"},{\"id\":\"lead-25\",\"mensaje\":\"Quisiera información sobre la propiedad en Núñez para una posible compra inmediata. ¿Aceptan créditos hipotecarios?\",\"telefono\":\"+54 9 11 1135-7788\",\"email\":\"diego.alvarez@gmail.com\",\"zona\":\"Núñez\",\"tipo_propiedad\":\"departamento\",\"presupuesto_usd\":240000,\"property_ids\":[\"prop-02\"],\"source\":\"Argenprop\",\"estado\":\"Calificado\",\"created_at\":\"2026-05-24T16:54:00.000Z\",\"agencia\":\"L. J. Ramos Brokers\",\"direccion_propiedad\":\"Av. Cramer 2310\"},{\"id\":\"lead-26\",\"mensaje\":\"demo\",\"telefono\":\"000-0000\",\"email\":\"user1190@tempmail.org\",\"zona\":\"Devoto\",\"tipo_propiedad\":null,\"presupuesto_usd\":0,\"property_ids\":[\"prop-12\"],\"source\":\"Mercadolibre\",\"estado\":\"Descartado\",\"created_at\":\"2026-05-24T23:11:00.000Z\",\"agencia\":\"Inmobiliaria del Plata\",\"direccion_propiedad\":\"Bonpland 1885\"},{\"id\":\"lead-27\",\"mensaje\":\"Estoy buscando una propiedad para mudanza urgente, ¿puedo agendar una visita el sábado en Vicente López?\",\"telefono\":\"+54 9 11 1247-8899\",\"email\":\"marina.castro@gmail.com\",\"zona\":\"Vicente López\",\"tipo_propiedad\":\"casa\",\"presupuesto_usd\":450000,\"property_ids\":[\"prop-06\"],\"source\":\"WhatsApp\",\"estado\":\"Calificado\",\"created_at\":\"2026-05-23T09:27:00.000Z\",\"agencia\":\"Bullrich Propiedades\",\"direccion_propiedad\":\"Av. Libertador 4450\"},{\"id\":\"lead-28\",\"mensaje\":\"Buenas tardes, estoy interesado en agendar visita para la compra de la propiedad publicada en Almagro.\",\"telefono\":\"+54 9 11 1358-9900\",\"email\":\"fernando.gimenez@gmail.com\",\"zona\":\"Almagro\",\"tipo_propiedad\":\"ph\",\"presupuesto_usd\":175000,\"property_ids\":[\"prop-03\"],\"source\":\"Mail\",\"estado\":\"En revisión\",\"created_at\":\"2026-05-23T22:05:00.000Z\",\"agencia\":\"Miguel Ludmer Inmobiliaria\",\"direccion_propiedad\":\"Charcas 3890\"},{\"id\":\"lead-29\",\"mensaje\":\"Hola, ¿sigue disponible la propiedad? Estoy listo para hacer una oferta luego de la visita en Devoto.\",\"telefono\":\"+54 9 11 1469-1100\",\"email\":\"soledad.ramos@gmail.com\",\"zona\":\"Devoto\",\"tipo_propiedad\":\"casa\",\"presupuesto_usd\":200000,\"property_ids\":[\"prop-02\"],\"source\":\"Chat web\",\"estado\":\"Nuevo\",\"created_at\":\"2026-05-22T12:38:00.000Z\",\"agencia\":\"Inmobiliaria del Plata\",\"direccion_propiedad\":\"Av. Cabildo 1875\"},{\"id\":\"lead-30\",\"mensaje\":\"info\",\"telefono\":\"000-0000\",\"email\":\"user8841@tempmail.org\",\"zona\":\"Flores\",\"tipo_propiedad\":null,\"presupuesto_usd\":0,\"property_ids\":[\"prop-09\"],\"source\":\"Navent\",\"estado\":\"Descartado\",\"created_at\":\"2026-05-21T15:01:00.000Z\",\"agencia\":\"Castex Propiedades\",\"direccion_propiedad\":\"Av. Corrientes 4310\"}]");
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
"[project]/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$scoreUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/lib/scoreUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$hooks$2f$useLeadAnalysis$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/hooks/useLeadAnalysis.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$AppShell$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/AppShell.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$PageHeader$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/components/PageHeader.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$DashboardView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/views/DashboardView.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$QueueView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/views/QueueView.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$ProcessedView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/views/ProcessedView.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$CriteriaView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/frontend/views/CriteriaView.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$data$2f$leads_mock$2e$json$2e5b$json$5d2e$cjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/backend/data/leads_mock.json.[json].cjs [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$data$2f$properties_mock$2e$json$2e5b$json$5d2e$cjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/product/backend/data/properties_mock.json.[json].cjs [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$DashboardView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$DashboardView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
;
// R16: tabla pura con los literales EXACTOS del HTML target
// (ui-ux/lead-trust-dashboard-tokko (3).html, objeto pageHeaders líneas 928-933).
// Nota: el spec R16 dicta `tabs: true` para `queue` (mientras que el HTML
// fuente lo tiene como `false`). Seguimos el spec, que es la fuente de
// verdad consagrada para esta feature.
const VIEW_HEADERS = {
    dashboard: {
        title: "Dashboard de leads",
        subtitle: "Mayo 2026 · Todas las fuentes",
        tabs: true,
        primary: "+ Nuevo lead"
    },
    queue: {
        title: "Cola de leads",
        subtitle: "Ordenados por llegada · Mayo 2026",
        tabs: true,
        primary: "+ Ingresar lead"
    },
    processed: {
        title: "Leads procesados",
        subtitle: "Historial completo",
        tabs: false,
        primary: "Exportar"
    },
    criteria: {
        title: "Criterios de scoring",
        subtitle: "Configurá cómo se califica cada lead entrante",
        tabs: false,
        primary: "Guardar criterios"
    }
};
const HEADER_TABS = [
    "Hoy",
    "7 días",
    "30 días"
];
const ROUTEABLE_VIEWS = [
    "dashboard",
    "queue",
    "processed",
    "criteria"
];
// Helper: mapea trust_score a Urgency.
function scoreToUrgency(score) {
    if (score >= 70) return "Alta";
    if (score >= 40) return "Media";
    return "Baja";
}
function Home() {
    // Estado existente: leads mutables, scores IA, spam, animación.
    const [leads, setLeads] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$data$2f$leads_mock$2e$json$2e5b$json$5d2e$cjs__$5b$ssr$5d$__$28$ecmascript$29$__["default"]);
    const properties = __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$backend$2f$data$2f$properties_mock$2e$json$2e5b$json$5d2e$cjs__$5b$ssr$5d$__$28$ecmascript$29$__["default"];
    const [selectedLeadId, setSelectedLeadId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [aiScores, setAiScores] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [spamLeads, setSpamLeads] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [newLeadId, setNewLeadId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // R12: estado de la vista activa (inline, sin contexto ni store global).
    const [activeView, setActiveView] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("dashboard");
    // R18: tab activa persistida por vista. Inicializada con "Hoy" para las 4.
    const [tabState, setTabState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        dashboard: "Hoy",
        queue: "Hoy",
        processed: "Hoy",
        criteria: "Hoy"
    });
    // Análisis IA del lead seleccionado (el hook se queda en Home — ver design.md §6.2).
    const { analysis, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$hooks$2f$useLeadAnalysis$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useLeadAnalysis"])(selectedLeadId);
    // Cuando llega un análisis, registrar trust_score en aiScores.
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (analysis && selectedLeadId) {
            setAiScores((prev)=>({
                    ...prev,
                    [selectedLeadId]: analysis.trust_score
                }));
        }
    }, [
        analysis,
        selectedLeadId
    ]);
    // Derivar feed ordenado por trust_score descendente.
    const sortedWithAiScores = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const scored = leads.map((lead)=>{
            const item = (0, __TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$lib$2f$scoreUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computeLocalScore"])(lead);
            if (aiScores[lead.id] !== undefined) {
                return {
                    ...item,
                    trust_score: aiScores[lead.id]
                };
            }
            return item;
        });
        return [
            ...scored
        ].sort((a, b)=>b.trust_score - a.trust_score);
    }, [
        leads,
        aiScores
    ]);
    // Lead completo para el panel de detalle.
    const selectedLead = selectedLeadId ? leads.find((l)=>l.id === selectedLeadId) ?? null : null;
    // R21: derivar counts del estado actual.
    const analyzedCount = Object.keys(aiScores).length;
    const spamLeadIds = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>new Set(spamLeads.map((s)=>s.lead.id)), [
        spamLeads
    ]);
    const queueBadgeCount = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>leads.filter((l)=>aiScores[l.id] === undefined && !spamLeadIds.has(l.id)).length, [
        leads,
        aiScores,
        spamLeadIds
    ]);
    // Handler de simulación de leads (delegado al SimulatorPanel desde DashboardView).
    function handleLeadSimulated(result) {
        const { lead, analysis: leadAnalysis } = result;
        setAiScores((prev)=>({
                ...prev,
                [lead.id]: leadAnalysis.trust_score
            }));
        if (leadAnalysis.is_spam) {
            const spamItem = {
                lead,
                trust_score: leadAnalysis.trust_score,
                urgency: scoreToUrgency(leadAnalysis.trust_score)
            };
            setSpamLeads((prev)=>[
                    spamItem,
                    ...prev
                ]);
            setNewLeadId(lead.id);
        } else {
            setLeads((prev)=>[
                    lead,
                    ...prev
                ]);
            setNewLeadId(lead.id);
        }
        setTimeout(()=>setNewLeadId(null), 700);
    }
    // R14, R15: handler de selección de vista desde el LeftRail.
    // Solo cambia activeView para vistas routeables; el resto se ignora.
    function handleSelectView(id) {
        if (ROUTEABLE_VIEWS.includes(id)) {
            setActiveView(id);
        }
    }
    // R6, R19: stub de "Nuevo lead" hasta feature 18 (unified_random_lead_simulator).
    // No-op observable: no lanza excepciones y permanece accesible.
    function handleNewLead() {
    // TODO feature 18: cablear al simulador real cuando exista.
    }
    // R19: handlers por vista del botón primario del PageHeader.
    const primaryHandlers = {
        dashboard: handleNewLead,
        queue: handleNewLead,
        processed: ()=>{
        // TODO feature 16: exportar histórico.
        },
        criteria: ()=>{
        // TODO feature 15: guardar criterios.
        }
    };
    const header = VIEW_HEADERS[activeView];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$AppShell$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        activeView: activeView,
        onSelectView: handleSelectView,
        onNewLead: handleNewLead,
        analyzedCount: analyzedCount,
        queueBadgeCount: queueBadgeCount,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$PageHeader$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: header.title,
                subtitle: header.subtitle,
                tabs: header.tabs ? [
                    ...HEADER_TABS
                ] : undefined,
                activeTab: header.tabs ? tabState[activeView] : undefined,
                onTabChange: (label)=>setTabState((prev)=>({
                            ...prev,
                            [activeView]: label
                        })),
                primaryAction: {
                    label: header.primary,
                    onClick: primaryHandlers[activeView]
                },
                breadcrumbLabel: "Volver",
                onBreadcrumbClick: activeView === "dashboard" ? undefined : ()=>setActiveView("dashboard")
            }, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            activeView === "dashboard" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$DashboardView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                sortedLeads: sortedWithAiScores,
                selectedLeadId: selectedLeadId,
                onSelectLead: setSelectedLeadId,
                selectedLead: selectedLead,
                analysis: analysis,
                isLoading: isLoading,
                properties: properties,
                spamLeads: spamLeads,
                newLeadId: newLeadId,
                onLeadSimulated: handleLeadSimulated
            }, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 225,
                columnNumber: 9
            }, this),
            activeView === "queue" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$QueueView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                leads: leads,
                aiScores: aiScores
            }, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 239,
                columnNumber: 9
            }, this),
            activeView === "processed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$ProcessedView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                onBackToDashboard: ()=>setActiveView("dashboard")
            }, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 242,
                columnNumber: 9
            }, this),
            activeView === "criteria" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$CriteriaView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 246,
                columnNumber: 37
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.tsx",
        lineNumber: 196,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0.mffpj._.js.map