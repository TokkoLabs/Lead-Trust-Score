# Review — view_router_navigation (id 9)

Layer: frontend
Reviewer: frontend_reviewer
Veredicto: **APROBADO** (con un issue menor opcional documentado abajo)

## Trazabilidad R1..R27

| R   | Estado    | Evidencia                                                                                                   |
|-----|-----------|-------------------------------------------------------------------------------------------------------------|
| R1  | OK        | `PageHeader.tsx` exporta firma exacta + `<header aria-label="Encabezado de página">` con orden requerido.   |
| R2  | OK        | Default `breadcrumbLabel = "Volver"` en la firma. Cubierto en test R20 (botón "Volver" encontrado por name).|
| R3  | OK        | Breadcrumb solo se renderiza si `onBreadcrumbClick` está definido; sin handler no monta el botón.           |
| R4  | OK        | `role="tablist"` + `role="tab"` + `aria-label` + `aria-selected` correctos. Test R18 verifica aria-selected.|
| R5  | OK        | `handleTabClick` invoca `onTabChange?.(label)`. Test R18 cubre click y persistencia.                        |
| R6  | OK        | Test "R6, R19: botón primario '+ Nuevo lead' es clickable y no lanza excepciones".                          |
| R7  | OK        | `hasTabs = Array.isArray(tabs) && tabs.length > 0`. Tests R17 (Procesados/Criterios) confirman ausencia.    |
| R8  | OK        | Cuatro archivos en `product/frontend/views/` con default export funcional verificados.                      |
| R9  | OK        | `DashboardView.tsx` recibe las props requeridas y renderiza Simulator+Feed+Spam+Detail con lógica intacta.  |
| R10 | OK        | Test "R14, R16" verifica `Vista en construcción` literal en QueueView.                                      |
| R11 | OK        | Test R17 "Procesados" verifica botón `Volver al dashboard`. Click cubierto por handler `onBackToDashboard`. |
| R12 | OK        | `pages/index.tsx` declara `useState<View>('dashboard')`. Sin Context/store.                                 |
| R13 | OK        | Render condicional `activeView === 'X' && <XView />` para las 4 vistas. Test R14 verifica desmonte.         |
| R14 | OK        | `handleSelectView` + test "R14, R16: click sobre 'Cola de leads'...".                                       |
| R15 | OK (cód.) | Garantizado por whitelist `ROUTEABLE_VIEWS` en `handleSelectView`; sin test explícito (justificable —ver §). |
| R16 | OK        | Tests "R13", "R14", "R17" cubren literales `Dashboard de leads`, `Cola de leads`, `Leads procesados`, `Criterios de scoring`. Verificado char-por-char incluyendo `·` U+00B7. |
| R17 | OK        | Tests R17 (Procesados y Criterios) verifican `queryByRole("tablist")` ausente.                              |
| R18 | OK        | Test "R18: cambio de tab persiste por vista" valida `7 días` activa tras navegar a Cola y volver.           |
| R19 | OK        | Test R6/R19 valida click sin excepción + `primaryHandlers` mapea `handleNewLead` para dashboard/queue.      |
| R20 | OK        | Test "R20: click sobre breadcrumb 'Volver'...".                                                              |
| R21 | OK        | `analyzedCount = Object.keys(aiScores).length` y `queueBadgeCount` con `useMemo` y `spamLeadIds`, propagados al `AppShell`. |
| R22 | OK        | `find . -name DashboardLayout.tsx` vacío; `grep -R DashboardLayout product/ pages/ tests/` vacío.           |
| R23 | OK        | `pages/index.tsx` no importa ni renderiza `SimulatorPanel`, `LeadsFeed`, `LeadDetailPanel`, `LeadCard`; vive todo en `DashboardView`. |
| R24 | OK        | Test R18 garantiza preservación de `tabState` (y por ende de los hijos no remontados). Sin `router.push`.   |
| R25 | OK        | `test_view_router.tsx` con 7 sub-tests, uno por bloque del spec.                                            |
| R26 | OK        | `npx jest --selectProjects frontend` → 8 suites / 47 tests verdes.                                          |
| R27 | OK        | `npx tsc --noEmit` exit 0.                                                                                  |

## R15 sin test explícito — aceptable

El implementer documenta el desvío y la cobertura es por código (whitelist
`ROUTEABLE_VIEWS`). R25 (los 7 sub-tests obligatorios) NO incluye R15, así
que la falta de test es consistente con el spec. Aceptable.

## DashboardLayout eliminado

- `find . -name DashboardLayout.tsx` → vacío.
- `grep -R DashboardLayout product/ pages/ tests/` → vacío.
- JSDoc de `AppShell.tsx` reescrito para no mencionar el componente legado
  (cambio menor, no afecta runtime). Documentado en el reporte del
  implementer.

## `pages/index.tsx` como orquestador delgado

Verificado: el JSX dentro de `<AppShell>` solo contiene `<PageHeader>` y
un switch de 4 ramas con las vistas. `SimulatorPanel`, `LeadsFeed`,
`LeadDetailPanel`, `LeadCard` y la sección spam fueron movidos a
`DashboardView.tsx`. El handler `handleLeadSimulated` se mantiene en
`Home` y se pasa por props (consistente con design §6.2 que mantiene el
hook `useLeadAnalysis` en `Home`).

## Vistas placeholder

- `QueueView.tsx` / `CriteriaView.tsx`: ambos centran `Vista en construcción`
  + subtítulo apuntando a la feature futura (14 y 15). Interfaces vacías
  reservadas para extensión.
- `ProcessedView.tsx`: placeholder definitivo con botón `Volver al dashboard`
  y handler `onBackToDashboard?`.

## PageHeader

- Estructura `<header aria-label>` + breadcrumb + h1 + subtitle + tablist
  + primary action, en el orden y con los atributos del spec.
- Soporta uncontrolled (con `defaultTab`/`tabs[0]` como inicial) y controlado
  (vía `activeTab`). Spot-check de los 4 títulos exactos pasa.

## Discrepancia spec vs HTML target (queue.tabs)

El HTML target (`ui-ux/lead-trust-dashboard-tokko (3).html`, línea 929)
declara `queue: { tabs: false }`, pero el spec R16 dicta `queue: tabs:
true`. El implementer siguió el spec (fuente de verdad consagrada) y
documentó la decisión inline en `pages/index.tsx` + en el reporte.

**Lectura del reviewer**: aceptable. El spec es la fuente de verdad y la
elección está explícita. Si el equipo de diseño quiere alinear ambos
(eliminando tabs en Cola o agregándolas al HTML), corresponde un spec
posterior. Marcado como **issue menor** opcional, no bloqueante.

## Render condicional y preservación de estado

Verificado: solo la vista activa se monta (no `display:none`). El estado
`leads`/`aiScores`/`spamLeads`/`selectedLeadId`/`tabState` vive en `Home`,
por lo que sobrevive el cambio de vista. Cuando se vuelve a Dashboard,
`useLeadAnalysis(selectedLeadId)` y `handleLeadSimulated` quedan
disponibles intactos (el remount de `DashboardView` recibe las props
preservadas).

## Tests

```
npx tsc --noEmit         → exit 0 (sin output)
npx jest --selectProjects frontend → exit 0
  Test Suites: 8 passed, 8 total
  Tests:       47 passed, 47 total
```

Las 7 suites previas (`test_app_shell`, `test_design_tokens`, `test_feed`,
`test_lead_detail_panel`, `test_simulator_panel`,
`test_simulation_integration`, `test_use_lead_analysis`) siguen verdes.
`test_view_router.tsx` aporta 7 tests nuevos, uno por cada bloque del
spec R25.

## Cambios fuera de `product/frontend/` y `tests/frontend/`

- `pages/index.tsx`: refactor autorizado por el spec (R12, R13, R14, R15,
  R16, R17, R18, R19, R20, R21, R23, R24).
- Eliminación de `product/frontend/components/DashboardLayout.tsx`:
  autorizada por R22 + design §4.

Sin tocar backend, docker, ni `progress/` (salvo el reporte del
implementer y este review).

## Issues menores (no bloqueantes)

1. **Discrepancia `queue.tabs` spec vs HTML**: el HTML target marca
   `tabs: false` para Cola; el spec y la implementación marcan `tabs:
   true`. Recomiendo abrir una micro-spec posterior para alinear (no
   bloquea esta feature).
2. **`handleNewLead` no-op**: stub esperado por el spec hasta feature
   18. Documentado y aceptado.

## Veredicto

**APROBADO** — todas las tasks `[x]`, los 27 requirements cubiertos
(R15 por código, justificable), tsc y jest verdes, sin regresiones,
sin cambios fuera del scope autorizado.

El leader puede ahora pedir aprobación humana para mover la feature 9
de `in_progress` a `done` en `feature_list.json`.
