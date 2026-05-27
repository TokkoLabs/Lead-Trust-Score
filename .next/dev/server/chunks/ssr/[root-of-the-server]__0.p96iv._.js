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
            lineNumber: 45,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/product/frontend/components/PageHeader.tsx",
        lineNumber: 36,
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
                                lineNumber: 93,
                                columnNumber: 32
                            }, this),
                            breadcrumbLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/components/PageHeader.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        className: "text-title-lg font-bold text-neutral-grey-900",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/PageHeader.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-body-sm text-neutral-grey-600",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/PageHeader.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/PageHeader.tsx",
                lineNumber: 85,
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
                                lineNumber: 117,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/PageHeader.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this),
                    primaryAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-label": primaryAction.label,
                        onClick: ()=>primaryAction.onClick?.(),
                        className: "bg-brand-primary-500 text-white rounded-button px-4 h-9 font-semibold text-body-sm hover:opacity-90 transition-opacity",
                        children: primaryAction.label
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/components/PageHeader.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/components/PageHeader.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/components/PageHeader.tsx",
        lineNumber: 81,
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
                lineNumber: 140,
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
                            lineNumber: 144,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$dashboard$2f$QualityDoughnut$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            data: doughnutData
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/views/DashboardView.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                lineNumber: 142,
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
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "text-title-sm font-bold text-neutral-grey-900 mb-6",
                                children: "Leads"
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$LeadsFeed$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                items: sortedLeads,
                                onSelectLead: onSelectLead,
                                selectedLeadId: selectedLeadId,
                                newLeadId: newLeadId
                            }, void 0, false, {
                                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                lineNumber: 161,
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
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this),
                                            "Leads Spam Detectados (",
                                            spamLeads.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                        lineNumber: 170,
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
                                                        lineNumber: 182,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$components$2f$LeadCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            item: item,
                                                            isNew: item.lead.id === newLeadId
                                                        }, void 0, false, {
                                                            fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                                            lineNumber: 184,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item.lead.id, true, {
                                                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                                lineNumber: 176,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                        lineNumber: 174,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                                lineNumber: 169,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                        lineNumber: 154,
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
                            lineNumber: 199,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center h-full text-neutral-grey-500 text-body-sm",
                            children: "Selecciona un lead del feed para ver el análisis IA detallado."
                        }, void 0, false, {
                            fileName: "[project]/product/frontend/views/DashboardView.tsx",
                            lineNumber: 206,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/product/frontend/views/DashboardView.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/product/frontend/views/DashboardView.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/views/DashboardView.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/product/frontend/views/QueueView.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QueueView
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function QueueView(_) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center h-full text-center px-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-title-md font-bold text-neutral-grey-800",
                children: "Vista en construcción"
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/QueueView.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-body-sm text-neutral-grey-600 mt-2",
                children: "La cola de leads se entrega en la feature 14."
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/QueueView.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/views/QueueView.tsx",
        lineNumber: 14,
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
        className: "flex flex-col items-center justify-center h-full text-center px-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-title-md font-bold text-neutral-grey-800",
                children: "Vista en construcción"
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/ProcessedView.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-body-sm text-neutral-grey-600 mt-2",
                children: "Aquí verás el histórico de leads ya analizados."
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/ProcessedView.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>onBackToDashboard?.(),
                className: "mt-6 bg-neutral-grey-100 text-neutral-grey-800 rounded-button px-4 h-9 font-semibold text-body-sm hover:bg-neutral-grey-200 transition-colors",
                children: "Volver al dashboard"
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/ProcessedView.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/views/ProcessedView.tsx",
        lineNumber: 18,
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
;
function CriteriaView(_) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center h-full text-center px-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-title-md font-bold text-neutral-grey-800",
                children: "Vista en construcción"
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-body-sm text-neutral-grey-600 mt-2",
                children: "Los criterios completos se entregan en la feature 15."
            }, void 0, false, {
                fileName: "[project]/product/frontend/views/CriteriaView.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/product/frontend/views/CriteriaView.tsx",
        lineNumber: 14,
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
            activeView === "queue" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$QueueView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 238,
                columnNumber: 34
            }, this),
            activeView === "processed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$ProcessedView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                onBackToDashboard: ()=>setActiveView("dashboard")
            }, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 240,
                columnNumber: 9
            }, this),
            activeView === "criteria" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$product$2f$frontend$2f$views$2f$CriteriaView$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 244,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0.p96iv._.js.map