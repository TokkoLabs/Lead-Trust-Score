# Review — dashboard_kpis_and_charts (id 11)

Layer: frontend
Modo: acelerado (sdd=false) — acceptance del feature_list.json reemplaza spec EARS.
Veredicto: **APROBADO**

## Comandos ejecutados

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | exit 0 (sin output) |
| `npx jest --selectProjects frontend` | 10 suites / 64 tests passed, exit 0 |
| `grep "rgba(24,156,123,.75)|rgba(66,127,148,.55)|rgba(223,21,23,.45)" LeadsBarChart.tsx` | 3 literales presentes en líneas 38-40 |
| `grep "cutout.*68\|hoverOffset.*6" QualityDoughnut.tsx` | `cutout: "68%"` (línea 53) + `hoverOffset: 6` (línea 45) |

## Trazabilidad acceptance → archivo / test

| AC (feature_list.json id 11) | Archivo producto | Test | Estado |
|---|---|---|---|
| AC1 KpiCard {label, value, delta?, accentColor} + stripe color (teal/green/red) | `product/frontend/components/dashboard/KpiCard.tsx` (props exactas, accents teal/green/red/yellow + stripe coloreada según HTML target) | `tests/frontend/test_dashboard_widgets.tsx` describe("KpiRow") | OK |
| AC2 LeadsBarChart stacked, 3 datasets con rgba específicos, borderRadius 4 | `product/frontend/components/dashboard/LeadsBarChart.tsx` (datasets alta/media/baja con los 3 rgba literales exactos; `borderRadius: 4` líneas 57/64/71; `stacked: true` en scales x/y) | `tests/frontend/test_dashboard_widgets.tsx` describe("LeadsBarChart") | OK |
| AC3 QualityDoughnut cutout 68%, hoverOffset 6, 3 segmentos, leyenda inferior | `product/frontend/components/dashboard/QualityDoughnut.tsx` (`cutout: "68%"`, `hoverOffset: 6`, `position: "bottom"`, 3 segmentos Alta/Media/Baja) | `tests/frontend/test_dashboard_widgets.tsx` describe("QualityDoughnut") | OK |
| AC4 KPIs + gráficos derivan del estado (computeLocalScore + aiScores + is_spam); bar chart 7 días | `product/frontend/views/DashboardView.tsx` (useMemo encadenado: computeKpis + computeDailyBuckets + doughnutData) + `dashboardMetrics.resolveLeadScore` (fallback computeLocalScore si no hay aiScore) | `tests/frontend/test_dashboard_metrics.ts` ("sin analyses: usa computeLocalScore como fallback") | OK |
| AC5 dashboardMetrics.ts con computeKpis(leads, analyses) y computeDailyBuckets(leads) puras | `product/frontend/lib/dashboardMetrics.ts` (funciones puras, sin estado/IO) | `tests/frontend/test_dashboard_metrics.ts` (4 describes cubren classifyTier, computeKpis, computeDailyBuckets) | OK |
| AC6 test_dashboard_metrics valida KPIs + buckets | `tests/frontend/test_dashboard_metrics.ts` (10 it cases) | mismo | OK |
| AC7 test_dashboard_widgets verifica render KPI + datos a los charts | `tests/frontend/test_dashboard_widgets.tsx` (5 it cases con mocks chart.js) | mismo | OK |

## Validaciones específicas

### Colores literales LeadsBarChart (AC2)

LeadsBarChart.tsx líneas 38-40 declaran las constantes exactas requeridas:
- `COLOR_ALTA = "rgba(24,156,123,.75)"`
- `COLOR_MEDIA = "rgba(66,127,148,.55)"`
- `COLOR_BAJA = "rgba(223,21,23,.45)"`

Aplicados como `backgroundColor` en los 3 datasets stacked (líneas 56/63/70). `borderRadius: 4` y `borderSkipped: false` en los 3.

### QualityDoughnut (AC3)

- `cutout: "68%"` (línea 53).
- `hoverOffset: 6` (línea 45).
- `legend.position: "bottom"` (línea 56).
- 3 labels exactos `["Alta (≥75)", "Media (40–74)", "Baja / spam"]`.

### Clasificación borderline (briefing)

`classifyTier` en `dashboardMetrics.ts` líneas 81-89:
- score=75 → "alta", score=74 → "media" (verificado en test_dashboard_metrics.ts ítem "score=75 → alta" y "score=74 → media").
- score=40 → "media", score=39 → "baja" (verificado idem).
- is_spam=true → "baja" sin importar score (verificado en `classifyTier(99, true)`).

### Integración en DashboardView (AC4 + sin regresión)

DashboardView.tsx 135-211: renderiza KpiRow + grid(LeadsBarChart + QualityDoughnut) ARRIBA del bloque previo (simulador+feed+spam | detalle). Los componentes legacy `SimulatorPanel`, `LeadsFeed`, `LeadDetailPanel` se preservan intactos (líneas 153, 159, 197).

Fallback bien diseñado para mantener compatibilidad con `pages/index.tsx` actual (props opcionales `leadsForMetrics`, `analyses`, `onSeeQueue` con reconstrucción desde sortedLeads+spamLeads).

### Copy literal del HTML target

KpiRow.tsx replica los 4 labels exactos del HTML target (líneas 678/684/690/696):
- "Total leads" — teal
- "Score promedio" — green
- "Alta calidad (≥75)" — teal
- "Descartados (spam)" — red

### Tests (AC6 + AC7)

- `test_dashboard_metrics.ts` — 10 cases distribuidos en 3 describes:
  - classifyTier (borderline 75/74/40/39 + spam override).
  - computeKpis (lista vacía, set sintético 5 leads, fallback sin analyses).
  - computeDailyBuckets (7 buckets cronológicos, agrupación por 3 días, leads sin created_at ignorados, borderline en buckets).
- `test_dashboard_widgets.tsx` — 5 cases:
  - KpiRow: 4 labels + 4 values + 4 grupos role=group.
  - LeadsBarChart: canvas renderiza, labels[6]="Hoy", CTA "Ver cola →" condicional.
  - QualityDoughnut: canvas con 3 labels exactos.

### Tokens / hex hardcodeados

Análisis del briefing criterio 8: los 3 rgba específicos del HTML target están como literales (esperado, lo exige AC2). En LeadsBarChart/QualityDoughnut hay además `#94A2AB`, `#EAEEF1`, `#1D2327`, `#6A7981`, `#D6DEE2`, `#FFFFFF` para `tickColor`/`gridColor`/`tooltip`. Estos provienen literalmente del HTML target línea 1015 (`const tick = '#94A2AB', grid = '#EAEEF1', bg = '#FFFFFF', border = '#D6DEE2'`) y son la fuente visual real. El acceptance no exige migrar la config de chart.js a tokens CSS — chart.js no consume variables CSS de forma directa para tooltip/tick colors. Mantener fidelidad con el target es preferible al refactor a tokens en este alcance. Punto NO bloqueante (mejora a futuro: lectura de tokens via getComputedStyle).

### Scope / regresión

- Producto: solo en `product/frontend/components/dashboard/`, `product/frontend/lib/dashboardMetrics.ts`, `product/frontend/views/DashboardView.tsx`. OK.
- Tests: nuevos en `tests/frontend/` + ajuste mínimo a `tests/frontend/test_view_router.tsx` (mocks de chart.js, justificado por jsdom no soportar canvas).
- Infra (autorizada por briefing acelerado): `package.json` agrega chart.js@^4.5.1 + react-chartjs-2@^5.3.1 (matchea AC2). `jest.config.js` extiende `testMatch` para incluir `*.ts` (necesario para `test_dashboard_metrics.ts` que no usa JSX).
- `product/backend/` no tocado en esta feature. OK.
- 10 suites / 64 tests frontend verdes. Sin regresión.

### Tasks

Todas las 12 tasks en `progress/impl_dashboard_kpis_and_charts.md` marcadas `[x]`.

## Notas / mejoras opcionales (no bloqueantes)

1. Considerar exponer los hex de tooltip/tick/grid (`#94A2AB`, `#EAEEF1`, `#1D2327`, `#6A7981`, `#D6DEE2`) como constantes derivadas de tokens CSS via `getComputedStyle(document.documentElement).getPropertyValue('--color-neutral-grey-500')` en useEffect. Mejora la consistencia con el design system Tokko cuando éste evolucione. NO bloqueante: los valores son consistentes con `--color-neutral-grey-*` de `product/frontend/styles/tokens.css`.
2. El briefing menciona "stripe vertical de color" en AC1, pero el HTML target define `.kpi-stripe` como banda horizontal superior (`top:0; height:3px`). La implementación sigue el HTML target. Decisión documentada en la bitácora del implementer y aceptable.
3. `KpiRow` no muestra deltas para Total/Score/Descartados (los del HTML target son hardcodeados literales "↑ 18% vs semana pasada", "↑ 4 pts esta semana", "↑ 3 más que ayer"). El implementer expone `delta?` en `KpiCard` pero solo lo usa en "Alta calidad" con cálculo determinista. Esto preserva la prop semántica para features futuras donde haya series temporales reales y evita números fabricados. Aceptable.

## Veredicto final

**APROBADO**. Los 7 acceptance criteria están cubiertos por código + tests con trazabilidad explícita. TypeScript verde, Jest frontend 10/10 suites y 64/64 tests verdes. Scope respetado (sin tocar backend ni tests/backend). Ajustes a `jest.config.js` y `tests/frontend/test_view_router.tsx` son los mínimos necesarios y están justificados.
