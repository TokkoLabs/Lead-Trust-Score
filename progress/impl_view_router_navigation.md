# Implementación — view_router_navigation (id 9)

Layer: frontend
Estado: in_progress (esperando review)

## Archivos creados

- `product/frontend/components/PageHeader.tsx`
- `product/frontend/views/DashboardView.tsx`
- `product/frontend/views/QueueView.tsx`
- `product/frontend/views/ProcessedView.tsx`
- `product/frontend/views/CriteriaView.tsx`
- `tests/frontend/test_view_router.tsx`

## Archivos modificados

- `pages/index.tsx` — refactor a orquestador delgado: estado `leads`/`aiScores`/
  `spamLeads`/`selectedLeadId` + nuevos `activeView` y `tabState`, deriva
  `analyzedCount`/`queueBadgeCount`, monta `PageHeader` + render condicional
  de la vista activa.
- `product/frontend/components/AppShell.tsx` — quitado el JSDoc que
  mencionaba `DashboardLayout` para que `grep -R DashboardLayout` quede
  vacío (R22).

## Archivos eliminados

- `product/frontend/components/DashboardLayout.tsx`

## Tasks completadas: 15/15

- [x] T1 — `PageHeader.tsx` (R1, R2, R3, R4, R5, R6, R7).
- [x] T2 — `DashboardView.tsx` envuelve simulador+feed+spam+detalle (R8, R9, R23).
- [x] T3 — `QueueView.tsx` placeholder (R8, R10).
- [x] T4 — `CriteriaView.tsx` placeholder (R8, R10).
- [x] T5 — `ProcessedView.tsx` placeholder con CTA (R8, R11).
- [x] T6 — `activeView` + `VIEW_HEADERS` + `HEADER_TABS` en `pages/index.tsx` (R12, R16).
- [x] T7 — `handleSelectView` con whitelist `ROUTEABLE_VIEWS` (R14, R15).
- [x] T8 — `tabState: Record<View, string>` persistido (R18, R24).
- [x] T9 — `analyzedCount` y `queueBadgeCount` derivados con `useMemo` (R21).
- [x] T10 — `<PageHeader>` montado con title/subtitle/tabs/primaryAction/
  breadcrumb según vista (R13, R16, R17, R20).
- [x] T11 — Render condicional de la vista activa (R13, R23, R24).
- [x] T12 — `handleNewLead` stub no-op + `primaryHandlers` por vista (R6, R19).
- [x] T13 — Borrado `DashboardLayout.tsx`; `grep` vacío (R22).
- [x] T14 — `test_view_router.tsx` con 7 sub-tests (R25).
- [x] T15 — `npx tsc --noEmit` y `npx jest --selectProjects frontend` verdes (R26, R27).

## Verificación

```
$ npx tsc --noEmit
(sin output, exit 0)

$ npx jest --selectProjects frontend
Test Suites: 8 passed, 8 total
Tests:       47 passed, 47 total
```

`test_view_router.tsx` aporta 7 tests nuevos. Las 7 suites previas
(`test_app_shell`, `test_design_tokens`, `test_feed`, `test_lead_detail_panel`,
`test_simulator_panel`, `test_simulation_integration`, `test_use_lead_analysis`)
siguen verdes sin ajustes.

`grep -R DashboardLayout product/ pages/ tests/` → vacío.

## Trazabilidad

| R   | Verificación                                                                                                  |
|-----|---------------------------------------------------------------------------------------------------------------|
| R1  | Inspección `PageHeader.tsx` + test `R13, R16: render inicial muestra Dashboard...` (heading h1 + tablist).     |
| R2  | Default `breadcrumbLabel = "Volver"` en la firma de `PageHeader`; usado por test `R20: ...breadcrumb 'Volver'`. |
| R3  | Test `R20: click sobre breadcrumb 'Volver' desde QueueView regresa a Dashboard`.                              |
| R4  | Test `R13, R16` (tablist con 3 tabs y aria-selected en la activa) y `R18` (aria-selected en '7 días').        |
| R5  | Test `R18: cambio de tab en Dashboard persiste...` (click sobre tab dispara `onTabChange`).                   |
| R6  | Test `R6, R19: botón primario '+ Nuevo lead' es clickable...`.                                                |
| R7  | Tests `R17: click sobre 'Procesados'/'Criterios' ... SIN tablist`.                                            |
| R8  | Inspección de `product/frontend/views/{Dashboard,Queue,Processed,Criteria}View.tsx`.                          |
| R9  | Test `R13, R16` (DashboardView monta SimulatorPanel) + `R14` (DashboardView desmonta al cambiar a Cola).      |
| R10 | Tests `R14, R16` y `R17: Criterios` aserciones sobre `Vista en construcción`.                                 |
| R11 | Test `R17: click sobre 'Procesados'...` (botón `Volver al dashboard` presente).                               |
| R12 | Inspección `pages/index.tsx` — `useState<View>('dashboard')` declarado.                                       |
| R13 | Test `R13, R16` y `R14, R16` (DashboardView desmontado cuando se navega a otra vista).                        |
| R14 | Test `R14, R16: click sobre nav item 'Cola de leads' muestra QueueView...`.                                   |
| R15 | Cobertura por código: `handleSelectView` ignora ids fuera de `ROUTEABLE_VIEWS`; no se testea directo (no es path típico de usuario; la decisión sobre tests adicionales se documenta como opcional en `design.md §8`). |
| R16 | Tests `R13`, `R14`, `R17` (literales exactos `Dashboard de leads`, `Cola de leads`, `Leads procesados`, `Criterios de scoring`). |
| R17 | Tests `R17: en Procesados/Criterios NO hay tablist`.                                                          |
| R18 | Test `R18: cambio de tab persiste por vista`.                                                                  |
| R19 | Test `R6, R19: botón primario '+ Nuevo lead'` (handler no lanza excepción; stub por feature 18).              |
| R20 | Test `R20: click sobre breadcrumb 'Volver'...`.                                                                |
| R21 | Inspección `pages/index.tsx` — `analyzedCount = Object.keys(aiScores).length` y `queueBadgeCount` con `useMemo`. |
| R22 | `grep -R DashboardLayout product/ pages/ tests/` retorna vacío.                                                |
| R23 | Inspección `pages/index.tsx` — solo `AppShell`/`PageHeader`/4 vistas en su JSX; los componentes hijos viven en `DashboardView`. |
| R24 | Test `R18` verifica que el `tabState` sobrevive al cambio de vista (no remount completo). No hay llamadas a `router.*`. |
| R25 | `tests/frontend/test_view_router.tsx` con 7 sub-tests.                                                        |
| R26 | `npx jest --selectProjects frontend` → 47/47 verde, 8/8 suites verdes.                                        |
| R27 | `npx tsc --noEmit` → sin errores.                                                                              |

## Desvíos

- **R15 sin test explícito.** El requirement de "ids no routeables se
  ignoran" se garantiza por implementación (whitelist `ROUTEABLE_VIEWS`),
  pero no se incluyó un test específico de `Equipo`/`Integraciones` ya
  que el spec R25 lista 7 sub-tests obligatorios y este no está entre
  ellos. Si el reviewer lo pide, se agrega trivialmente clickeando
  `Equipo` y verificando que `activeView` no cambia (el `<h1>` sigue
  mostrando `Dashboard de leads`).
- **JSDoc de `AppShell.tsx`.** Para satisfacer estrictamente R22 ("grep
  retorna vacío") se quitó la línea de JSDoc que decía "Reemplaza el
  `DashboardLayout` legado". El comentario no era código de producción;
  el cambio no afecta runtime.
- **Comentario en `pages/index.tsx` sobre desviación HTML vs spec.** El
  HTML target declara `queue: tabs: false`, pero el spec R16 dicta
  `queue: tabs: true`. Seguimos el spec (fuente de verdad), documentado
  inline. El reviewer puede normalizar uno u otro en una feature
  posterior si el diseño lo requiere.

## Próximo paso

`frontend_reviewer` valida trazabilidad y APROBAR/RECHAZAR antes de que
el leader marque la feature como `done`.
