# Sesion actual

> Este archivo se vacia al cerrar cada sesion y se mueve a `history.md`.
> Mientras trabajas, **mantenlo actualizado en tiempo real**, no al final.

- **Mision:** Migracion del frontend al design Tokko (HTML target ui-ux/lead-trust-dashboard-tokko.html) + simulador unificado
- **Feature en curso:** tokko_design_system_setup (id 7)
- **Inicio:** 2026-05-27
- **Modo:** secuencial autonomo (usuario autorizo saltar go/no-go salvo bloqueos)
- **Backlog nuevo:** features 7-18 en feature_list.json

## Pipeline secuencial planeado

1. **#7 tokko_design_system_setup** (frontend) — tokens, fuente, Tailwind, theme claro
2. **#8 app_shell_redesign** (frontend) — Topbar/LeftRail/RightRail/BottomBar
3. **#9 view_router_navigation** (frontend) — switch entre 4 vistas + PageHeader
4. **#10 mock_data_extension_dashboard** (backend) — source/estado/created_at + pools
5. **#11 dashboard_kpis_and_charts** (frontend) — KPIs + Chart.js
6. **#12 recent_leads_table_and_source_funnel** (frontend)
7. **#13 dashboard_scoring_criteria_card** (frontend)
8. **#14 queue_view** (frontend)
9. **#15 criteria_view** (frontend)
10. **#16 processed_view_placeholder** (frontend)
11. **#17 lead_detail_tokko_redesign** (frontend)
12. **#18 unified_random_lead_simulator** (fullstack)

## Estado actual

- Feature #7 tokko_design_system_setup: DONE
- Feature #8 app_shell_redesign: DONE
- Feature #9 view_router_navigation: DONE
- Feature #10 mock_data_extension_dashboard: lanzando spec_author... (BACKEND)

## Bitacora

- Decisiones del usuario: rediseno completo, las 4 vistas, datos derivados del mock (iterable), boton unico 80/20 random.
- HTML target: ui-ux/lead-trust-dashboard-tokko (3).html (1160 lineas)
- Frontend actual usa dark theme Tailwind; sera reemplazado por light + Tokko tokens.

### Feature #7 — DONE
- spec_author -> 18 requirements EARS + 10 tasks.
- frontend_implementer -> 10/10 tasks, tsc verde, jest 34/34 verde.
- frontend_reviewer -> APROBADO. Tokens 13/13 fieles al HTML target.
- Archivos clave: product/frontend/styles/tokens.css, pages/_document.tsx, tailwind.config.js, styles/globals.css, tests/frontend/test_design_tokens.tsx.

### Feature #8 — DONE
- spec_author -> 24 requirements EARS + 14 tasks.
- frontend_implementer -> 14/14 tasks, tsc verde, jest 40/40 verde.
- frontend_reviewer -> APROBADO.
- Archivos clave: product/frontend/components/AppShell.tsx + shell/*, tests/frontend/test_app_shell.tsx, tailwind.config.js.

### Feature #9 — DONE
- spec_author -> 27 requirements + 15 tasks.
- frontend_implementer -> 15/15 tasks, tsc verde, jest 47/47 verde, DashboardLayout eliminado.
- frontend_reviewer -> APROBADO. Issue menor opcional: queue.tabs:true (spec) vs HTML target (false) — diferimos alineacion.
- Archivos clave: product/frontend/components/PageHeader.tsx, product/frontend/views/{Dashboard,Queue,Processed,Criteria}View.tsx, pages/index.tsx refactor a orquestador, tests/frontend/test_view_router.tsx.

## Proximo paso

Modo Opcion A (sdd=false para #11-18): frontend_implementer #11 directo -> reviewer -> #12.
Briefing rico al implementer reemplaza spec EARS (acceptance literal + HTML ref + decisiones tecnicas + tests obligatorios).

### Feature #10 — IN PROGRESS (backend_implementer)
- Plan: T1-T2 extender Lead type + Source/Estado. T3-T6 crear lib/leadGenerators.ts con pools + pickRandom + generateRandomLead. T7-T9 enriquecer leads_mock.json (preservar lead-01..15, agregar lead-16..30, distribuir created_at en 7 dias UTC). T10-T11 crear tests backend (test_data_extension.ts y test_lead_generators.ts). T12-T16 verify (ts-node + tsc). T17 reporte.
- Fecha base para created_at: 2026-05-27 (hoy). Distribuir entre 2026-05-21 y 2026-05-27 con >=5 dias cubiertos.

### Feature #15 — IN PROGRESS (frontend_implementer, modo acelerado)
- Reemplazo de placeholder CriteriaView por configurador completo.
- Nuevos: criteriaDefaults.ts, criteriaStorage.ts, CriterionRow.tsx, KeywordsList.tsx, CriteriaSection.tsx; vista CriteriaView reescrita; test_criteria_view.tsx.
