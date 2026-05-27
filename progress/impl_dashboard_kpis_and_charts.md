# Implementación — dashboard_kpis_and_charts (id 11)

Layer: frontend
Estado: in_progress (esperando review)
Modo: acelerado (sdd=false) — briefing reemplaza spec EARS.

## Plan de tareas

- [x] T1 — Instalar chart.js@^4.4.1 + react-chartjs-2@^5.2.0 y commit del package.json.
- [x] T2 — `product/frontend/lib/dashboardMetrics.ts` con `computeKpis` + `computeDailyBuckets` (funciones puras).
- [x] T3 — `product/frontend/components/dashboard/KpiCard.tsx` (stripe, label, value, delta opcional).
- [x] T4 — `product/frontend/components/dashboard/KpiRow.tsx` (helper con 4 KpiCard).
- [x] T5 — `product/frontend/components/dashboard/LeadsBarChart.tsx` (Bar stacked, 3 datasets, CTA "Ver cola →").
- [x] T6 — `product/frontend/components/dashboard/QualityDoughnut.tsx` (cutout 68%, hoverOffset 6, leyenda inferior).
- [x] T7 — Integrar widgets en `DashboardView.tsx` (KpiRow + 2 charts sobre layout previo).
- [x] T8 — `tests/frontend/test_dashboard_metrics.ts` (KPIs + buckets + clasificación borderline).
- [x] T9 — `tests/frontend/test_dashboard_widgets.tsx` (render KPI row + charts con mocks).
- [x] T10 — Ajustar `jest.config.js` para incluir `*.ts` en testMatch del proyecto frontend.
- [x] T11 — Verificación: `npx tsc --noEmit` + `npx jest --selectProjects frontend`.
- [x] T12 — Ajustar `tests/frontend/test_view_router.tsx` (mock chart.js + react-chartjs-2) para que el render de `<Home/>` no crashee en jsdom tras el upgrade de DashboardView.

## Archivos a crear / modificar

Crear:
- product/frontend/lib/dashboardMetrics.ts
- product/frontend/components/dashboard/KpiCard.tsx
- product/frontend/components/dashboard/KpiRow.tsx
- product/frontend/components/dashboard/LeadsBarChart.tsx
- product/frontend/components/dashboard/QualityDoughnut.tsx
- tests/frontend/test_dashboard_metrics.ts
- tests/frontend/test_dashboard_widgets.tsx

Modificar:
- product/frontend/views/DashboardView.tsx (montar KpiRow + charts arriba)
- package.json (deps chart.js, react-chartjs-2)
- jest.config.js (testMatch incluye `.ts` para frontend)

## Trazabilidad acceptance → archivo / test

| Acceptance (id 11) | Archivo | Test |
|---|---|---|
| AC1 KpiCard | components/dashboard/KpiCard.tsx | test_dashboard_widgets.tsx |
| AC2 LeadsBarChart stacked | components/dashboard/LeadsBarChart.tsx | test_dashboard_widgets.tsx |
| AC3 QualityDoughnut | components/dashboard/QualityDoughnut.tsx | test_dashboard_widgets.tsx |
| AC4 valores derivan del estado | views/DashboardView.tsx + lib/dashboardMetrics.ts | test_dashboard_metrics.ts |
| AC5 dashboardMetrics computeKpis/computeDailyBuckets | lib/dashboardMetrics.ts | test_dashboard_metrics.ts |
| AC6 test_dashboard_metrics | tests/frontend/test_dashboard_metrics.ts | mismo |
| AC7 test_dashboard_widgets | tests/frontend/test_dashboard_widgets.tsx | mismo |

## Bitácora

### Comandos verde

- `npm install --save chart.js@^4.4.1 react-chartjs-2@^5.2.0` → instaló
  `chart.js@4.5.1` + `react-chartjs-2@5.3.1` (satisfacen los ranges).
- `npx tsc --noEmit` → sin output / sin errores.
- `npx jest --selectProjects frontend` → 10 suites / 64 tests verdes.
- `npx jest` (frontend + backend) → 11 suites / 70 tests verdes.
- `bash init.sh` → checks de archivos del arnés OK. El FAIL en
  "Usuario GitHub esperado 'your-github-username'" es pre-existente
  del template (placeholder en `init.sh`) y no está relacionado con
  esta feature.

### Desvíos / decisiones

1. **jest.config.js**: el `testMatch` del proyecto frontend sólo aceptaba
   `*.tsx`. Como el briefing exige `tests/frontend/test_dashboard_metrics.ts`
   (sin JSX, sólo funciones puras), agregamos `*.ts` al `testMatch` del
   proyecto frontend para que el test corra. Cambio mínimo, no afecta
   archivos existentes.
2. **test_view_router.tsx**: tras el upgrade de `DashboardView` (que ahora
   monta `LeadsBarChart`/`QualityDoughnut`), el render de `<Home/>` en
   jsdom crasheaba porque chart.js intenta acceder a `canvas.getContext`,
   no disponible en jsdom. Agregamos `jest.mock('chart.js')` +
   `jest.mock('react-chartjs-2')` al inicio del test (mismos stubs que
   `test_dashboard_widgets.tsx`). El briefing autoriza este ajuste
   mínimo: *"No rompas tests existentes. Si DashboardView se renderiza
   en algún test viejo y rompe por componentes nuevos … ajustá el test
   mínimamente para pasar"*.
3. **Stripe del HTML target**: el HTML lo define como banda horizontal
   superior (`top:0; left:0; right:0; height:3px;`), no vertical. El
   briefing dice "stripe vertical de color" — implementamos siguiendo
   el HTML target (banda horizontal superior coloreada por accent) que
   es la fuente visual real; preservamos la prop semántica `accentColor`.
4. **`KpiRow.delta` para "Alta calidad"**: el HTML target usa el sublabel
   "36% del total". Reproducimos esto en data-driven calculando
   `altaCalidad / total` y mostrándolo como delta `up` con label "% del
   total".
5. **DashboardView signature**: agregamos props opcionales
   `leadsForMetrics`, `analyses`, `onSeeQueue` con fallbacks
   reconstruidos desde `sortedLeads` + `spamLeads` para no romper el
   contrato actual con `pages/index.tsx` (que aún no pasa esos props).
   AC4 se cumple porque los widgets sí derivan del estado actual a
   través del fallback determinista.
6. **Doughnut fallback**: si los buckets diarios suman 0 (caso vista
   sin `created_at` válidos), el doughnut usa el desglose por KPIs
   (alta/media/baja deducido de total - alta - descartados). Esto
   evita un doughnut vacío sin datos visibles.

### Archivos creados

- `product/frontend/lib/dashboardMetrics.ts`
- `product/frontend/components/dashboard/KpiCard.tsx`
- `product/frontend/components/dashboard/KpiRow.tsx`
- `product/frontend/components/dashboard/LeadsBarChart.tsx`
- `product/frontend/components/dashboard/QualityDoughnut.tsx`
- `tests/frontend/test_dashboard_metrics.ts`
- `tests/frontend/test_dashboard_widgets.tsx`

### Archivos modificados

- `product/frontend/views/DashboardView.tsx` — agrega KpiRow + 2 charts
  arriba del layout previo. El bloque inferior (simulador+feed | detalle)
  se preserva intacto.
- `package.json` — `chart.js@^4.5.1` y `react-chartjs-2@^5.3.1` como
  dependencies.
- `package-lock.json` — auto-actualizado por `npm install`.
- `jest.config.js` — `testMatch` frontend ahora incluye `*.ts` y `*.tsx`.
- `tests/frontend/test_view_router.tsx` — mock de chart.js +
  react-chartjs-2 para evitar crash en jsdom.

## Resultado final

- Resumen: 12/12 tasks completadas.
- `npx tsc --noEmit`: verde (sin output).
- `npx jest`: 11 suites / 70 tests verdes (10 suites / 64 tests en frontend).
- Listo para review (frontend_reviewer).

