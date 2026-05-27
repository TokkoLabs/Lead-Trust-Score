# Tasks — view_router_navigation

Feature ID: 9
Layer: frontend
Estado: spec_ready

> Implementación frontend: cablear navegación entre 4 vistas, introducir
> `PageHeader` y mover el layout del dashboard a `DashboardView`. Tras
> completar todas las tasks, ejecutar `npx jest --selectProjects frontend`
> y `npx tsc --noEmit` para validar R26/R27.

---

## T1 — Crear `product/frontend/components/PageHeader.tsx`

- [x] Crear el archivo con la firma `PageHeaderProps` (title, subtitle,
  tabs, defaultTab, activeTab, onTabChange, primaryAction,
  breadcrumbLabel, breadcrumbIcon, onBreadcrumbClick) tal como define
  `design.md` §5.1.
- [x] Render del `<header aria-label="Encabezado de página">` con
  breadcrumb + `<h1>` + subtítulo + tablist + botón primario.
- [x] Tabs uncontrolled: `useState(defaultTab ?? tabs?.[0])` cuando
  `activeTab` no se provee.
- [x] Default `breadcrumbLabel = "Volver"`.
- [x] Estilos Tokko (sin hex literales): `bg-surface-ground`,
  `text-neutral-grey-*`, `bg-brand-primary-500`, `rounded-button`,
  `text-title-xl`, etc.
- Cubre: R1, R2, R3, R4, R5, R6, R7.

## T2 — Crear `product/frontend/views/DashboardView.tsx`

- [x] Definir `DashboardViewProps` con todos los datos compartidos
  (sortedLeads, selectedLeadId, onSelectLead, selectedLead, analysis,
  isLoading, properties, spamLeads, newLeadId, onLeadSimulated).
- [x] Mover el JSX actual de `pages/index.tsx` que vive dentro de
  `<AppShell>` (`<div className="flex gap-6 h-full">…</div>`) tal cual,
  reemplazando los valores hardcoded por las props recibidas.
- [x] No modificar clases CSS ni la lógica de orden/scoring.
- Cubre: R8, R9, R23.

## T3 — Crear `product/frontend/views/QueueView.tsx`

- [x] Componente placeholder centrado con texto exacto
  `Vista en construcción` y subtítulo
  `La cola de leads se entrega en la feature 14.`
- [x] Estilos Tokko (`text-title-lg`, `text-body-sm`,
  `text-neutral-grey-*`).
- [x] `QueueViewProps` definido como interface vacía (reservada para
  feature 14).
- Cubre: R8, R10.

## T4 — Crear `product/frontend/views/CriteriaView.tsx`

- [x] Componente placeholder análogo a `QueueView`, con subtítulo
  `Los criterios completos se entregan en la feature 15.`
- [x] `CriteriaViewProps` definido como interface vacía (reservada
  para feature 15).
- Cubre: R8, R10.

## T5 — Crear `product/frontend/views/ProcessedView.tsx`

- [x] Componente placeholder con texto exacto `Vista en construcción`,
  subtítulo `Aquí verás el histórico de leads ya analizados.` y botón
  `Volver al dashboard`.
- [x] `ProcessedViewProps.onBackToDashboard?: () => void`.
- [x] Click del botón invoca `onBackToDashboard?.()`.
- Cubre: R8, R11.

## T6 — Refactor de `pages/index.tsx` para introducir `activeView`

- [x] Importar `AppShell`, `PageHeader`, `DashboardView`, `QueueView`,
  `ProcessedView`, `CriteriaView`.
- [x] Declarar `type View = 'dashboard' | 'queue' | 'processed' | 'criteria'`.
- [x] Añadir `useState<View>('dashboard')` para `activeView`.
- [x] Definir constante `VIEW_HEADERS` con los 4 títulos/subtítulos/tabs/
  primary labels EXACTOS de R16 (tomados del HTML target líneas 928-933).
- [x] Definir constante `HEADER_TABS = ["Hoy", "7 días", "30 días"]`.
- Cubre: R12, R16.

## T7 — Implementar `handleSelectView` con whitelist de vistas routeables

- [x] Definir `ROUTEABLE_VIEWS = ["dashboard", "queue", "processed", "criteria"]`.
- [x] `handleSelectView(id)` actualiza `activeView` solo si `id ∈ ROUTEABLE_VIEWS`;
  caso contrario ignora silenciosamente.
- [x] Pasar `handleSelectView` al `AppShell` como `onSelectView`.
- Cubre: R14, R15.

## T8 — Añadir estado `tabState` persistido por vista

- [x] `useState<Record<View, string>>` inicializado con `Hoy` en las 4
  claves.
- [x] `onTabChange` del `PageHeader` actualiza
  `tabState[activeView] = label` con `setTabState(prev => ({…prev, [activeView]: label}))`.
- [x] El `PageHeader` recibe `activeTab={tabState[activeView]}` solo
  cuando `header.tabs` es `true`.
- Cubre: R18, R24.

## T9 — Derivar y propagar `analyzedCount` y `queueBadgeCount`

- [x] `analyzedCount = Object.keys(aiScores).length`.
- [x] `spamLeadIds = new Set(spamLeads.map(s => s.lead.id))` (via
  `useMemo` para evitar recreación en cada render).
- [x] `queueBadgeCount = leads.filter(l => aiScores[l.id] === undefined && !spamLeadIds.has(l.id)).length`.
- [x] Pasar ambos al `AppShell` como props.
- Cubre: R21.

## T10 — Montar `PageHeader` con valores derivados de `activeView`

- [x] `const header = VIEW_HEADERS[activeView]`.
- [x] Render del `<PageHeader>` con `title`, `subtitle`,
  `tabs={header.tabs ? [...HEADER_TABS] : undefined}`,
  `activeTab` (solo si `header.tabs`),
  `onTabChange`,
  `primaryAction={{ label: header.primary, onClick: primaryHandlers[activeView] }}`,
  `breadcrumbLabel="Volver"`,
  `onBreadcrumbClick={activeView === 'dashboard' ? undefined : () => setActiveView('dashboard')}`.
- Cubre: R13, R16, R17, R20.

## T11 — Render condicional de la vista activa dentro del `AppShell`

- [x] Reemplazar el JSX actual dentro de `<AppShell>` por un switch:
  - `activeView === 'dashboard'` → `<DashboardView {...props} />`
  - `activeView === 'queue'` → `<QueueView />`
  - `activeView === 'processed'` → `<ProcessedView onBackToDashboard={() => setActiveView('dashboard')} />`
  - `activeView === 'criteria'` → `<CriteriaView />`
- [x] Verificar manualmente que no quedan referencias directas a
  `SimulatorPanel`, `LeadsFeed`, `LeadDetailPanel`, `LeadCard` ni a la
  sección spam en `pages/index.tsx`.
- Cubre: R13, R23, R24.

## T12 — Implementar `handleNewLead` (stub) y handlers de primaryAction

- [x] `handleNewLead` como stub: en esta feature, su implementación es
  opcional (la feature 18 la cierra). Aceptable: `() => { console.warn('TODO feature 18'); }`
  o invocar programáticamente el `SimulatorPanel` si trivial.
- [x] `primaryHandlers: Record<View, () => void>` con `handleNewLead`
  para `dashboard` y `queue`, y stubs no-op para `processed` y
  `criteria`.
- [x] Pasar `handleNewLead` al `AppShell` como `onNewLead` (sincroniza
  el botón rojo "+" del `LeftRail` con el botón primario del
  `PageHeader`).
- Cubre: R6, R19.

## T13 — Eliminar `product/frontend/components/DashboardLayout.tsx`

- [x] Borrar el archivo.
- [x] Verificar `grep -R DashboardLayout product/ pages/ tests/` retorna
  vacío. Si retorna algo, corregir referencias antes de cerrar la task.
- Cubre: R22.

## T14 — Crear `tests/frontend/test_view_router.tsx`

- [x] Mockear `useLeadAnalysis` para que retorne
  `{ analysis: null, isLoading: false }`.
- [x] Importar `Home` desde `pages/index.tsx`.
- [x] Implementar los 7 sub-tests definidos en R25 (render inicial,
  Cola, Procesados, Criterios, persistencia de tab, breadcrumb,
  primary action click).
- [x] Cada sub-test referencia los `R<n>` que cubre como comentario al
  inicio del `it(...)`.
- Cubre: R25.

## T15 — Validar suite y build

- [x] Ejecutar `npx jest --selectProjects frontend` y verificar que
  `test_view_router.tsx` pasa Y que los tests previos
  (`test_app_shell.tsx`, `test_design_tokens.tsx`, `test_feed.tsx`,
  `test_lead_detail_panel.tsx`, `test_simulator_panel.tsx`,
  `test_simulation_integration.tsx`, `test_use_lead_analysis.tsx`)
  siguen verdes.
- [x] Ejecutar `npx tsc --noEmit` y verificar 0 errores nuevos.
- [x] Documentar trazabilidad `R<n> → test` en
  `progress/impl_view_router_navigation.md`.
- Cubre: R26, R27.
