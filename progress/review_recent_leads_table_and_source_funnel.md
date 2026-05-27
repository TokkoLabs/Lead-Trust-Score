# Review — Feature 12: recent_leads_table_and_source_funnel

**Veredicto: APROBADO**

Fecha: 2026-05-27
Revisor: frontend_reviewer (modo acelerado, sin spec EARS)
Baseline previa: 10 suites / 64 tests. Resultado actual: 12 suites / 76 tests.

## Comandos de verificación

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | VERDE (exit 0) |
| `npx jest --selectProjects frontend` | VERDE (12 suites, 76 tests, exit 0) |
| Búsqueda de hex hardcodeado en ScoreBar/RecentLeadsTable/SourceFunnel | VERDE (0 ocurrencias) |
| Backend intacto (sin cambios bajo `product/backend/` atribuibles a esta feature) | VERDE |
| `<button>` anidado en `<tr>` (a11y anti-patrón) | NO presente; se usa `<tr role="button" tabIndex={0}>` con `onClick` + `onKeyDown` (Enter/Space) |

## Validación 1:1 contra los 6 acceptance del feature_list.json

### AC1 — RecentLeadsTable.tsx + ScoreBar.tsx con color dinámico
- `product/frontend/components/dashboard/RecentLeadsTable.tsx` renderiza `<table role="table">` con thead+tbody y 6 `<th scope="col">` literales: Lead, Trust, Conversión, Urgencia, Fuente, Estado (líneas 187-211).
- Reusa `ScoreBar` (import en línea 5) en las 3 columnas de scores.
- `ScoreBar.tsx` `scoreColorClass(value)` mapea: `>=75 → bg-feedback-green-500`, `>=50 → bg-feedback-yellow-500`, `<50 → bg-brand-primary-500` (líneas 34-52). Verde/amarillo/rojo según spec.
- Test `test_recent_leads_table.tsx` cubre los 3 rangos cromáticos con trust=82/60/30 + casos borde 50/75.
- **PASS**

### AC2 — SourceFunnel.tsx (agrupa, ordena desc, % relativo al max, colores por canal)
- `SourceFunnel.tsx` función pura `aggregate()` (líneas 67-84): construye `Map<Source, number>`, ignora `lead.source` undefined (línea 70), ordena `entries.sort((a,b) => b[1]-a[1])`, calcula `Math.round((count/max)*100)`.
- `CHANNEL_THEME` (líneas 36-65) cubre 7 sources con clases tokenizadas alineadas al HTML target líneas 731-735 (Zonaprop teal, Argenprop blue, WhatsApp green, Mail yellow, Chat web red).
- Test `test_source_funnel.tsx` valida orden desc (WhatsApp/Zonaprop/Mail), porcentajes 100/60/40, ignorar huérfanos, `limit=2`, y placeholder vacío.
- **PASS**

### AC3 — Click en row abre el LeadDetailPanel (reusa selectedLeadId)
- `RecentLeadsTable.tsx` líneas 237-247: `<tr role="button" tabIndex={0} aria-selected={isSelected} onClick={() => handleSelect(lead.id)} onKeyDown={...}>`. Sin nesting de `<button>` en `<tr>` (cumple buenas prácticas a11y).
- `aria-selected` refleja `selectedLeadId === lead.id` (línea 234, 241).
- Soporte teclado Enter/Space (líneas 163-171) — bonus a11y.
- `DashboardView.tsx` línea 167 cablea `onSelectLead` y `selectedLeadId` al estado existente del host, reutilizando la lógica de selección.
- Tests cubren: click → `onSelectLead("lead-03")`, Enter sobre fila enfocada, `aria-selected='true'`/`'false'`.
- **PASS**

### AC4 — Data-driven, sin mock hardcodeado
- `RecentLeadsTable` recibe `leads`, `aiScores`, `analysisByLeadId?`, `selectedLeadId`, `onSelectLead`, `limit` por props. Cero literales de lead/source en el componente.
- `SourceFunnel` recibe `leads` y `limit` por props; `aggregate()` opera 100% sobre input.
- `DashboardView.tsx` (líneas 109-115, 161-174) deriva `trustScoresMap` a partir de `analysesMap` ya existente y pasa `metricsLeads` (el mismo set que alimenta KPIs/charts). Cero duplicación de estado.
- **PASS**

### AC5 — test_recent_leads_table.tsx (5 leads + 6 columnas, color por rango, click → onSelectLead)
- Archivo presente con 7 tests: render con 6 headers literales y 5 filas; 3 tests de rango cromático (82/60/30) verificando `data-score-range` + clase Tailwind aplicada; click dispara `onSelectLead("lead-03")`; `aria-selected` true/false; Enter en row.
- **PASS**

### AC6 — test_source_funnel.tsx (porcentajes + orden desc)
- Archivo presente con 5 tests: orden desc por count; porcentajes 100%/60%/40% (data-percent + style.width); ignorar leads sin source; `limit=2` top 2; placeholder cuando no hay sources.
- **PASS**

## Validaciones específicas adicionales del briefing

- **a11y de row clickable**: PASS. No hay `<button>` anidado en `<tr>`. Se usa `<tr role="button" tabIndex={0}>` con handlers de teclado para Enter y Space (el segundo previene scroll del browser).
- **Tokens Tokko**: PASS. `grep -nE "#[0-9A-Fa-f]{3,8}"` retorna 0 matches en `ScoreBar.tsx`, `RecentLeadsTable.tsx`, `SourceFunnel.tsx`. Todas las clases usan `bg-feedback-*`, `bg-brand-*`, `text-neutral-grey-*`, `rounded-card`, `shadow-low`, etc.
- **Conteos de tests**: PASS. Baseline 10 suites/64 tests → ahora 12 suites/76 tests, exactamente +2 suites +12 tests (7 en RecentLeadsTable + 5 en SourceFunnel).
- **Sin regresión backend**: PASS. Los cambios visibles en `product/backend/` (leads_mock.json, types/lead.ts, lib/leadGenerators.ts) corresponden a feature 10 (`mock_data_extension_dashboard`, ya `done`) y no a esta feature.
- **Tasks**: PASS. Las 7 tareas del plan en `impl_recent_leads_table_and_source_funnel.md` están marcadas `[x]`.

## Trazabilidad AC → tests (matriz)

| AC | Test |
|---|---|
| AC1 (table + 6 cols + ScoreBar color) | test_recent_leads_table.tsx (4 tests) |
| AC2 (funnel agrupa/ordena/%/colores) | test_source_funnel.tsx (4 tests) |
| AC3 (click → onSelectLead + aria-selected) | test_recent_leads_table.tsx (3 tests, click + Enter + aria) |
| AC4 (data-driven) | Ambos tests pasan datos por props y assertean salida sobre el input |
| AC5 (test_recent_leads_table.tsx) | Archivo existe, 7 tests, todos verdes |
| AC6 (test_source_funnel.tsx) | Archivo existe, 5 tests, todos verdes |

## Observaciones (no bloqueantes)

1. **Fallback heurístico para Conversion/Urgency**: Cuando no hay un `LeadAnalysis` completo cableado, `RecentLeadsTable` aproxima `conversion ≈ trust*0.9` y `urgency` desde el bucket de `computeLocalScore` (Alta=85/Media=55/Baja=25). Está documentado en JSDoc y aceptado por el briefing. Cuando feature 17 (`lead_detail_tokko_redesign`) o un futuro feature cablee un mapa real de `LeadAnalysis` global, se puede pasar vía la prop opcional `analysisByLeadId` sin cambios de contrato. No bloquea.

2. **Color del fill en Mail (funnel)**: El HTML target usa `color:#927C19` literal para Mail; el componente lo reemplaza por `text-feedback-yellow-500` (token). Decisión consistente con la regla "cero hex hardcodeado" del briefing y aceptable porque la regla excluye explícitamente este caso.

3. **Sort fallback en tabla**: Si todos los leads tienen `created_at`, ordena por timestamp desc; de lo contrario fallback a trust desc. Razonable y documentado en código.

## Acción siguiente

Marcar feature 12 como `done` en `feature_list.json` y avanzar al siguiente item del backlog (feature 13: `dashboard_scoring_criteria_card`).
