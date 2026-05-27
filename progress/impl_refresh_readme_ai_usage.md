# Impl — Refresh `README.md` y `AI_USAGE.md`

> Tarea de "refresh in-place" sobre los entregables ya marcados `done` en `feature_list.json` (id 20 README, id 21 AI_USAGE). **No** se modifica `feature_list.json`, **no** se toca código de producto ni tests, **no** se toca `docs/harness-readme.md`. Solo se actualiza el contenido factual de los dos documentos para reflejar el estado real del producto tras las 12 features Tokko (id 7-18).

---

## Archivos modificados

### `README.md`

Mantenidas las **8 secciones** y la tabla de contenidos original. Sustancia agregada por sección:

| Sección | Cambios |
|---------|---------|
| §1 Qué es | Reescrito el párrafo central: ahora menciona explícitamente las 4 vistas (Dashboard / Cola / Procesados / Criterios), el dashboard con KPIs + bar/doughnut + tabla recientes + funnel por fuente + card de criterios con tabs, la cola con reason chips IA, la vista Criterios con keywords + filtros + persistencia `localStorage`, y el simulador unificado 80/20 disparado desde un único botón "+ Nuevo lead". |
| §2 Stack | Tabla aumentada con `Design System Tokko (in-repo)` y `Chart.js + react-chartjs-2` (versiones leídas de `package.json`). Añadidas dos subsecciones: "Design System Tokko" (tokens.css, Nunito Sans, paleta brand, animaciones `enter`/`pulseDot`) y "Router de vistas client-side" (estado `activeView` en `pages/index.tsx`). |
| §3 Cómo se corre | Sin cambios estructurales — el quickstart `docker compose -f docker/docker-compose.yml up lead-trust-copilot` sigue válido. Tabla de variables intacta. |
| §4 Estructura del repo | Tabla **expandida** con todas las nuevas carpetas reales: `pages/_app.tsx`/`_document.tsx`, `product/backend/api/leads/`, `product/backend/services/`, `product/backend/lib/leadGenerators.ts`, `product/frontend/components/{shell,dashboard,queue,criteria,common}/` con lista de archivos clave en cada subcarpeta, `product/frontend/views/`, `product/frontend/lib/` (5 helpers nombrados), `product/frontend/styles/tokens.css`, `product/frontend/hooks/useLeadAnalysis`, `styles/globals.css`, `ui-ux/` (HTML target), `deliverables/`. |
| §5 Cómo desarrollamos (SDD) | §5.1-5.8 **intactas** (capítulo conceptual). Añadida nueva **§5.9 "Resultado real"** con los conteos exactos: 21 features, 18 producto + 3 entregables, 1 descartada (`docker_smoke_test`), 139 tests verdes (9 backend + 130 frontend) en el último ciclo. |
| §6 Arquitectura del backend | Reorganizada en 7 sub-secciones (era 6). §6.1 amplía la lista de endpoints (analyze + simulate). §6.2 mantiene el diagrama de `analyze`. **Nueva §6.3** con diagrama ASCII de `simulate` (PageHeader → Math.random 0.8/0.2 → generateRandomLead → filterCandidateProperties → analyseLeadWithAI → `{ lead, analysis }`), explicación de `simLoading`/`simError`/`Toast`. §6.5 actualizada con los nuevos campos del mock (30 leads, source/estado/created_at/agencia/direccion_propiedad). §6.6 actualizada con los enums `Source` y `Estado` y los campos opcionales en `lead.ts`. |
| §7 Entregables | Tabla recompuesta con columna **"Estado"** explícita: README (Done), AI_USAGE (Done), deliverables/README.md (Done), deliverables/script.md (Done), deliverables/recording-tips.md (Done), `deliverables/demo.mp4` (In progress — feature 19 sigue `in_progress` hasta que el humano grabe), docs/harness-readme.md (preservado). |
| §8 Link al repo | Sin cambios — placeholder `<https://github.com/<owner>/<repo>>` mantenido con su `<!-- TODO: -->` (permitido por el prompt). |

### `AI_USAGE.md`

Mantenidas las **5 secciones** y la tabla de contenidos original. Sustancia agregada por sección:

| Sección | Cambios |
|---------|---------|
| §1 Stack de IA | Tabla "IA en runtime" aumentada con la fila "Endpoints expuestos" (analyze + simulate). Resto del stack confirmado contra `package.json` actual (`@anthropic-ai/sdk ^0.30.1`, modelo `claude-sonnet-4-6` línea 187). "IA en proceso de desarrollo" sin cambios — sigue siendo correcto. |
| §2.1 Runtime | Diagrama ASCII rediseñado: ahora muestra **dos puntos de entrada** que confluyen en el mismo `ai_analyser.ts`. Documenta la lógica de cada handler (analyze: lee mock → filtra → analiza; simulate: resuelve type random → genera → filtra → analiza). Lista de capas relevantes ampliada con `product/backend/lib/leadGenerators.ts`. Mock data: corregido el conteo (30 leads ahora, con todos los campos nuevos). **Añadido ejemplo concreto del JSON estricto devuelto** (lead-02 con valores realistas). Nota explícita sobre el "encadenamiento" del simulador unificado. |
| §2.2 Dev (R2D2-Harness + SDD) | Diagrama intacto. **Sección "Volumen real" añadida al final** con los conteos: 21 features ejecutadas, 18 producto + 3 entregables, 1 descartada, 139 tests verdes al cierre del ciclo Tokko. |
| §3 Patrones avanzados | §3.1-3.6 mantenidos. **Nueva §3.7 "Briefing rico para features `sdd: false`"** documenta el modo "Opción A" usado en features 11-18 (briefing rico en el prompt al implementer, sin spec EARS separado). **Nueva §3.8 "Helpers puros como capa de fricción reusable"** enumera los 4 helpers nuevos en `product/frontend/lib/` (leadReasons, dashboardMetrics, criteriaDefaults+criteriaStorage, scoreUtils) y el patrón de testear lógica sin React. §3.4 SMOKE_MOCK_AI mantenida y reforzada: confirmado por `grep -rn SMOKE_MOCK_AI product/ tests/` sin resultados. |
| §4 Decisiones | Mantenidas las 7 decisiones originales (con tweaks mínimos: decisión 4 dice "30 leads"). **Añadidas decisiones 8-12**: tokens CSS en archivo separado vs solo Tailwind, router client-side vs Next.js dynamic routes, simulador unificado 1 botón 80/20 vs 2 botones determinísticos, Chart.js vs Recharts, persistencia localStorage vs endpoint backend. |
| §5 Aprendizajes | Mantenidos los 7 aprendizajes originales (con leve actualización al #1 que ahora referencia feature 20 — el README — en vez de "feature 8 docs"). **Añadidos aprendizajes 8-10**: viabilidad del modo Opción A para tramos homogéneos, migración a Design System como tarea mecánica una vez extraídos los tokens, impacto de los helpers puros en velocidad de review. |

---

## Mapping features 7-18 → bloques actualizados

| Feature | Nombre | README | AI_USAGE |
|---------|--------|--------|----------|
| 7 | `tokko_design_system_setup` | §2 "Design System Tokko", §4 (tokens.css, tailwind.config.js) | §3.7 (modo SDD estricto), §4 decisión 8, §5 aprendizaje 9 |
| 8 | `app_shell_redesign` | §4 (`product/frontend/components/shell/`), §2 "Design System Tokko" | §3.8 (componentes Tokko), §4 decisión 8 |
| 9 | `view_router_navigation` | §1 (4 vistas), §2 "Router de vistas client-side", §4 (`product/frontend/views/`) | §4 decisión 9 |
| 10 | `mock_data_extension_dashboard` | §1 (campos source/estado), §6.5 (30 leads con campos nuevos), §6.6 (enums) | §2.1 capas (`leadGenerators.ts`), §4 decisión 4 |
| 11 | `dashboard_kpis_and_charts` | §1 (KPIs + bar stacked + doughnut), §2 (Chart.js fila tabla), §4 (`product/frontend/components/dashboard/`) | §3.7 modo Opción A, §3.8 (dashboardMetrics.ts), §4 decisión 11 |
| 12 | `recent_leads_table_and_source_funnel` | §1 (tabla recientes + funnel), §4 (dashboard/ archivos) | §3.7 modo Opción A |
| 13 | `dashboard_scoring_criteria_card` | §1 (card con tabs), §4 (CriteriaCard) | §3.7 modo Opción A |
| 14 | `queue_view` | §1 (cola con reason chips), §4 (`product/frontend/components/queue/`) | §3.8 (leadReasons.ts), §6.2 (frontend consumers) |
| 15 | `criteria_view` | §1 (vista Criterios), §4 (`product/frontend/components/criteria/`) | §3.8 (criteriaDefaults/Storage), §4 decisión 12 |
| 16 | `processed_view_placeholder` | §1 (4 vistas), §4 (`product/frontend/views/ProcessedView.tsx`) | §3.7 modo Opción A |
| 17 | `lead_detail_tokko_redesign` | §4 (LeadDetailPanel mencionado), §6.2 (reason chips en frontend) | §3.8 (consumidores de leadReasons) |
| 18 | `unified_random_lead_simulator` | §1 (80/20), §6.1 (endpoints), §6.3 (diagrama ASCII nuevo del simulador) | §1 endpoints, §2.1 diagrama dual + ejemplo JSON, §4 decisión 10 |

---

## Validación de links

Extracción con `grep -oE '\]\([^)]+\)'`:

| Documento | Links totales | Anchors (`#…`) | Externos (`https://…`) | Internos relativos | Rotos |
|-----------|---------------|----------------|------------------------|--------------------|-------|
| `README.md`  | **119** | 8 anchors + 1 anchor cross-doc (`AI_USAGE.md#4-decisiones`) | 1 (`docker.com/products/docker-desktop`) | 109 internos relativos únicos | **0** |
| `AI_USAGE.md` | **92** | 5 anchors + 2 anchors cross-doc (`README.md#3-cómo-se-corre`, `README.md#6-arquitectura-del-backend`) | 0 | 85 internos relativos únicos | **0** |

Verificación de rutas relativas (con `ls -d <path>` agrupado por bloques): los 5 bloques (`OK_AGENTS`, `OK_ROOT`, `OK_DOCS`, `OK_PRODUCT`, `OK_PROGRESS_SKILLS`, `OK_DIRS`) volvieron sin un solo `cannot/No such`. **0 rutas rotas en ambos documentos.**

Placeholder explícito permitido: `<https://github.com/<owner>/<repo>>` en README §8 con su `<!-- TODO: -->`. No es un link broken — es un placeholder reconocible.

---

## TODOs documentados

1. **README §8 (link al repo):** placeholder `<https://github.com/<owner>/<repo>>` con `<!-- TODO: reemplazar con la URL final del repositorio en GitHub antes de la entrega del hackaton -->`. Conservado del README anterior; lo completa el humano al publicar.
2. **AI_USAGE §1 (modelo `claude-sonnet-4-6`):** `<!-- TODO: confirmar slug oficial con el panel de Anthropic antes de la demo -->`. Conservado: no verificamos manualmente contra la consola de Anthropic.
3. **`deliverables/demo.mp4`** (README §7): marcado "In progress" — feature 19 (`deliverable_video_demo`) sigue `in_progress` en `feature_list.json`. El humano graba el MP4 siguiendo `deliverables/script.md`; no es un TODO de este refresh.

---

## Confirmación de salvaguardas

- **`feature_list.json`:** NO se tocó. Features 20 y 21 siguen `done`; feature 19 sigue `in_progress`. Las 1-6 siguen `spec_ready` (no se cambian aunque el código exista).
- **`docs/harness-readme.md`:** NO se tocó. El README original del template R2D2-Harness queda preservado.
- **Código de producto:** NO se modificó nada en `product/`, `tests/`, `pages/`, `docker/`, `styles/`, `.claude/agents/`, `skills/`, `specs/`, `init.sh`, `init.ps1`, `tailwind.config.js`, `package.json`, `feature_list.json`.
- **`progress/current.md`:** NO se tocó (la bitácora de la sesión Tokko queda como referencia histórica).
- **Idioma:** español consistente en ambos documentos.
- **Estilo / estructura:** README mantiene 8 secciones, AI_USAGE mantiene 5 secciones. No se duplica contenido entre ambos (README didáctico/onboarding; AI_USAGE meta/proceso).

---

## Comunicación

`done -> progress/impl_refresh_readme_ai_usage.md`
