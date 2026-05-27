# Requirements — view_router_navigation

Feature ID: 9
Layer: frontend
Estado: spec_ready

> Esta feature cablea la navegación interna del shell (feature 8): click en
> items del `LeftRail` conmuta entre cuatro vistas (`Dashboard`, `Cola`,
> `Procesados`, `Criterios`) sin recargar la página. Introduce el componente
> `PageHeader` (breadcrumb "Volver", título, subtítulo, tabs Hoy/7 días/30 días,
> botón primario) cuyo contenido cambia dinámicamente según `activeView`.
> Monta cuatro vistas en `product/frontend/views/` y mueve el layout actual
> de `pages/index.tsx` (Simulador + Feed + Detalle + sección spam) al
> `DashboardView`. Las vistas `QueueView` y `CriteriaView` se entregan
> como placeholders mínimos ("Vista en construcción") porque su contenido
> real lo aportan las features 14 y 15. `ProcessedView` es ya el placeholder
> definitivo. El `DashboardLayout.tsx` legacy (marcado `@deprecated` en
> feature 8) se ELIMINA en esta feature.
>
> Contrato no negociable: `pages/index.tsx` DEBE seguir compilando, la app
> DEBE seguir levantando y toda la funcionalidad del dashboard actual
> (simulador, feed ordenado, detalle, sección spam) DEBE seguir
> operativa cuando `activeView === 'dashboard'`.

---

## R1 — Componente `PageHeader` existe con la firma documentada

El sistema DEBE exponer el archivo
`product/frontend/components/PageHeader.tsx` cuyo export por defecto
implemente la siguiente firma TypeScript:

```ts
export interface PageHeaderTab {
  id: string;
  label: string;
}

export interface PageHeaderPrimaryAction {
  label: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  tabs?: string[];                 // labels exactos a renderizar
  defaultTab?: string;             // label inicialmente activo
  activeTab?: string;              // controlado (override de defaultTab)
  onTabChange?: (label: string) => void;
  primaryAction?: PageHeaderPrimaryAction;
  breadcrumbLabel?: string;        // default "Volver"
  breadcrumbIcon?: React.ReactNode;
  onBreadcrumbClick?: () => void;
}
```

El componente DEBE renderizar un `<header>` con
`aria-label="Encabezado de página"` que contenga, en este orden:

1. Un nodo breadcrumb (R3).
2. Un `<h1>` o equivalente con el texto exacto de `props.title`.
3. SI `props.subtitle` es truthy ENTONCES un nodo con el texto exacto del
   subtítulo.
4. SI `props.tabs` es un array no vacío ENTONCES un contenedor con
   `role="tablist"` y un `<button role="tab">` por cada label (R4).
5. SI `props.primaryAction` es truthy ENTONCES un `<button>` con el
   texto exacto de `primaryAction.label` y `aria-label` igual al label
   (R5).

## R2 — Default de `breadcrumbLabel` es `"Volver"`

CUANDO se renderiza `<PageHeader title="…" />` sin proveer
`breadcrumbLabel`, el sistema DEBE renderizar el texto exacto `Volver`
dentro del nodo breadcrumb.

## R3 — Breadcrumb es clickable cuando se provee `onBreadcrumbClick`

CUANDO el usuario hace click sobre el nodo breadcrumb y `props.onBreadcrumbClick`
es una función, el sistema DEBE invocar `onBreadcrumbClick()` exactamente
una vez. SI `onBreadcrumbClick` es `undefined` ENTONCES el breadcrumb DEBE
renderizarse igualmente pero NO DEBE lanzar excepciones al hacer click.

## R4 — Tabs renderizan controles accesibles

CUANDO `props.tabs` es `['Hoy', '7 días', '30 días']`, el sistema DEBE
renderizar exactamente tres `<button>` con `role="tab"`, cada uno con
`aria-label` igual a su label, agrupados dentro de un contenedor con
`role="tablist"`. El tab activo (`activeTab` controlado o `defaultTab`
inicial; si ambos están ausentes, el primer label de la lista) DEBE
tener `aria-selected="true"`; los demás `aria-selected="false"`.

## R5 — Click en una tab dispara `onTabChange`

CUANDO el usuario hace click sobre un `<button role="tab">` cuyo label
es `<L>` y `props.onTabChange` es una función, el sistema DEBE invocar
`onTabChange(L)` exactamente una vez por click.

## R6 — `primaryAction.onClick` se invoca al click del botón primario

CUANDO el usuario hace click sobre el `<button>` del botón primario y
`props.primaryAction.onClick` es una función, el sistema DEBE invocar
`primaryAction.onClick()` exactamente una vez. SI `onClick` es `undefined`
ENTONCES el botón DEBE renderizarse igualmente sin lanzar excepciones.

## R7 — Cuando `tabs` está ausente o vacío, NO se renderiza el tablist

SI `props.tabs` es `undefined`, `null` o un array vacío ENTONCES el
sistema NO DEBE renderizar ningún nodo con `role="tablist"` ni ningún
`<button role="tab">` en el DOM del `PageHeader`.

## R8 — Las 4 vistas existen como módulos independientes

El sistema DEBE exponer los siguientes archivos, cada uno con un export
por defecto que sea un componente React funcional:

- `product/frontend/views/DashboardView.tsx`
- `product/frontend/views/QueueView.tsx`
- `product/frontend/views/ProcessedView.tsx`
- `product/frontend/views/CriteriaView.tsx`

## R9 — `DashboardView` envuelve el layout existente del dashboard

`DashboardView` DEBE recibir, vía props, los datos compartidos que hoy
maneja `pages/index.tsx` (leads ordenados, `selectedLeadId`,
`setSelectedLeadId`, `analysis`, `isLoading`, `properties`, `spamLeads`,
`newLeadId`, `onLeadSimulated`) y DEBE renderizar la misma estructura
visual actualmente presente entre `<AppShell>…</AppShell>`:
`SimulatorPanel` + `LeadsFeed` + sección spam (cuando `spamLeads.length > 0`)
+ `LeadDetailPanel` (cuando hay `selectedLead`). El sistema NO DEBE
modificar la lógica de scoring (`computeLocalScore`, `aiScores`,
`scoreToUrgency`) ni el contrato de los componentes hijos.

## R10 — `QueueView` y `CriteriaView` renderizan un placeholder mínimo

CUANDO se renderiza `QueueView` o `CriteriaView` en esta feature, el
sistema DEBE renderizar un contenedor centrado con el texto exacto
`Vista en construcción` y un texto secundario descriptivo. Ambos
componentes DEBEN reservar su firma de props para extensión futura
(features 14 y 15) y NO DEBEN romper el render del shell.

## R11 — `ProcessedView` renderiza el placeholder definitivo con CTA

El componente `ProcessedView` DEBE renderizar el texto exacto
`Vista en construcción` y un botón secundario con el texto exacto
`Volver al dashboard`. CUANDO el usuario hace click sobre dicho botón
y `ProcessedView` recibe `props.onBackToDashboard`, el sistema DEBE
invocar `onBackToDashboard()` exactamente una vez.

## R12 — `pages/index.tsx` mantiene `activeView` en estado local

El sistema DEBE modificar `pages/index.tsx` para que declare un estado
React mediante `useState<View>('dashboard')` (donde
`View = 'dashboard' | 'queue' | 'processed' | 'criteria'`) y lo propague
al `AppShell` vía las props `activeView` y `onSelectView`. El sistema
NO DEBE introducir un React Context, Provider, Zustand store ni
ningún otro mecanismo de estado global en esta feature.

## R13 — Render condicional de la vista activa

CUANDO `activeView === 'dashboard'`, el sistema DEBE renderizar
`<DashboardView … />` y NO DEBE renderizar `QueueView`, `ProcessedView`
ni `CriteriaView` simultáneamente. Lo mismo aplica para
`activeView === 'queue'` (solo `QueueView`),
`activeView === 'processed'` (solo `ProcessedView`) y
`activeView === 'criteria'` (solo `CriteriaView`).

## R14 — Click en un nav item del `LeftRail` cambia la vista

CUANDO el usuario hace click sobre un nav item del `LeftRail` cuyo id es
uno de `'dashboard' | 'queue' | 'processed' | 'criteria'`, el sistema
DEBE actualizar el estado `activeView` en `pages/index.tsx` con ese
mismo id, sin recargar la página (no se invoca `window.location` ni
`router.push`). El cambio DEBE reflejarse en el siguiente render.

## R15 — Click en nav items NO routeables NO cambia la vista activa

CUANDO el usuario hace click sobre un nav item del `LeftRail` cuyo id
NO pertenece al conjunto `'dashboard' | 'queue' | 'processed' | 'criteria'`
(es decir: `'team' | 'integrations' | 'reports' | 'settings'`), el
sistema NO DEBE cambiar el valor de `activeView`. La vista renderizada
DEBE seguir siendo la previa.

## R16 — Textos exactos del `PageHeader` por vista

CUANDO `activeView` toma cada uno de los valores soportados, el
`PageHeader` DEBE renderizar los siguientes textos LITERALES, tomados
del HTML target (`ui-ux/lead-trust-dashboard-tokko (3).html`,
objeto `pageHeaders` líneas 928-933):

| activeView | title                   | subtitle                                            | tabs | primaryAction label |
|------------|-------------------------|-----------------------------------------------------|------|---------------------|
| dashboard  | `Dashboard de leads`    | `Mayo 2026 · Todas las fuentes`                     | sí   | `+ Nuevo lead`      |
| queue      | `Cola de leads`         | `Ordenados por llegada · Mayo 2026`                 | sí   | `+ Ingresar lead`   |
| processed  | `Leads procesados`      | `Historial completo`                                | no   | `Exportar`          |
| criteria   | `Criterios de scoring`  | `Configurá cómo se califica cada lead entrante`     | no   | `Guardar criterios` |

Los strings se reproducen carácter por carácter (incluyendo el `·`
U+00B7 medio-punto y la tilde de "califica"). Cualquier desviación
literal DEBE marcarse como falla en el test.

## R17 — Tabs visibles solo en Dashboard y Cola

MIENTRAS `activeView` es `'dashboard'` o `'queue'`, el sistema DEBE
renderizar el tablist con los labels exactos `['Hoy', '7 días', '30 días']`.
MIENTRAS `activeView` es `'processed'` o `'criteria'`, el sistema NO DEBE
renderizar ningún `role="tablist"` ni ningún `<button role="tab">` en
el `PageHeader`.

## R18 — Estado de la tab activa se persiste por vista

El sistema DEBE mantener, en el estado de `pages/index.tsx`, un mapa
`Record<View, string>` (o estructura equivalente) que registre, por cada
vista que renderiza tabs, el label de la tab actualmente seleccionada.
CUANDO el usuario está en `dashboard`, selecciona `7 días`, navega a
`queue` y luego regresa a `dashboard`, el sistema DEBE mostrar `7 días`
como tab activa nuevamente (sin volver a `Hoy`). El valor inicial por
vista DEBE ser `Hoy`.

## R19 — Botón primario del `PageHeader` dispara handlers según la vista

CUANDO `activeView === 'dashboard'` o `activeView === 'queue'`, el
click sobre el botón primario del `PageHeader` DEBE invocar el handler
`onNewLead` que `pages/index.tsx` propaga (mismo handler que el botón
"+" rojo del `LeftRail`). Para `'processed'` y `'criteria'`, el click
DEBE invocar un handler local (`onExport`, `onSaveCriteria`) que en
esta feature se entrega como una función stub que NO lanza
excepciones (la lógica real la cubren features 16 y 15).

## R20 — Breadcrumb "Volver" regresa a Dashboard cuando no es Dashboard

CUANDO `activeView` es distinto de `'dashboard'` (es decir, `'queue'`,
`'processed'` o `'criteria'`), el `PageHeader` DEBE renderizar el
breadcrumb con el label `Volver` clickable, y el click DEBE actualizar
`activeView` a `'dashboard'`. CUANDO `activeView === 'dashboard'`, el
sistema NO DEBE renderizar el breadcrumb (o DEBE renderizarlo con
`aria-disabled="true"` y sin handler).

## R21 — `analyzedCount` y `queueBadgeCount` se derivan del estado actual

El sistema DEBE calcular y propagar al `AppShell`, vía sus props,
los valores:

- `analyzedCount`: número de leads en el estado React que han recibido
  un `trust_score` (es decir, `Object.keys(aiScores).length`). Esta es
  la definición consagrada por esta feature; la documenta `design.md`
  §5.4.
- `queueBadgeCount`: número de leads NO clasificados como spam que aún
  no tienen score IA (es decir,
  `leads.filter(l => !aiScores[l.id] && !spamLeadIds.has(l.id)).length`).
  Esta es la definición consagrada por esta feature; la documenta
  `design.md` §5.4.

Las definiciones DEBEN documentarse en `design.md` y permanecen
estables hasta que la feature 11 introduzca métricas derivadas más
precisas.

## R22 — `DashboardLayout.tsx` legacy se elimina

El sistema DEBE eliminar físicamente el archivo
`product/frontend/components/DashboardLayout.tsx` introducido por la
feature 3 y marcado `@deprecated` en la feature 8. CUANDO se ejecuta
`grep -R DashboardLayout product/ pages/ tests/` después de aplicar
esta feature, el resultado DEBE estar vacío (no quedan imports ni
referencias en código de producto/tests).

## R23 — `pages/index.tsx` no contiene JSX de detalle/feed/simulador

El sistema DEBE refactorizar `pages/index.tsx` para que su JSX dentro
de `<AppShell>` consista únicamente en un switch/condicional que
renderice una de las cuatro vistas (`DashboardView`, `QueueView`,
`ProcessedView`, `CriteriaView`) más el `PageHeader` (encima de la
vista activa). Los componentes `SimulatorPanel`, `LeadsFeed`,
`LeadDetailPanel`, `LeadCard` y la sección spam NO DEBEN aparecer
directamente en `pages/index.tsx`; DEBEN consumirse exclusivamente
desde `DashboardView`.

## R24 — Cambio de vista NO desmonta `AppShell` ni recarga la página

CUANDO el usuario cambia `activeView`, el sistema DEBE preservar la
instancia del `AppShell` (no remount) y DEBE preservar todo estado
React colocalizado en `pages/index.tsx` (`leads`, `aiScores`,
`spamLeads`, `selectedLeadId`, `tabState`). El sistema NO DEBE
disparar ninguna navegación de Next router (`router.push`,
`router.replace`, etc.) durante el cambio de vista.

## R25 — Tests cubren render inicial y conmutación de vistas

El sistema DEBE exponer el archivo
`tests/frontend/test_view_router.tsx`. Los tests DEBEN cubrir, como
mínimo:

- (R13, R16) Render inicial: `activeView` por defecto es `'dashboard'`,
  el `PageHeader` muestra el title exacto `Dashboard de leads`, el
  tablist está presente y `DashboardView` (con `LeadsFeed`) está en
  el DOM.
- (R14, R16) Click sobre el nav item `Cola de leads`: el componente
  `QueueView` aparece, el title del header pasa a `Cola de leads`, y
  el tablist sigue visible.
- (R17) Click sobre `Procesados`: `ProcessedView` aparece, el title
  pasa a `Leads procesados`, y NO existe ningún nodo con
  `role="tablist"`.
- (R17) Click sobre `Criterios`: `CriteriaView` aparece, el title pasa
  a `Criterios de scoring`, y NO existe ningún nodo con
  `role="tablist"`.
- (R18) En `dashboard` cambia la tab activa a `7 días`, conmuta a
  `queue`, vuelve a `dashboard`, y verifica que el tab `7 días` sigue
  marcado `aria-selected="true"`.
- (R20) En `QueueView`, click sobre el breadcrumb `Volver` regresa a
  `dashboard`.
- (R6, R19) Click sobre el botón primario `+ Nuevo lead` invoca el
  handler `onNewLead` (mock) una vez.

## R26 — Suite frontend existente sigue verde

CUANDO se ejecuta `npx jest --selectProjects frontend`, el sistema
DEBE ejecutar `test_view_router.tsx` con resultado verde y los tests
previos (`test_app_shell.tsx`, `test_design_tokens.tsx`,
`test_feed.tsx`, `test_lead_detail_panel.tsx`,
`test_simulator_panel.tsx`, `test_simulation_integration.tsx`,
`test_use_lead_analysis.tsx`) DEBEN seguir pasando. El reviewer
documenta explícitamente cualquier excepción.

## R27 — Build TypeScript sin errores

CUANDO se ejecuta `npx tsc --noEmit`, el sistema DEBE completar sin
errores de tipo relacionados con los archivos creados o modificados
por esta feature (`PageHeader.tsx`, las 4 vistas, `pages/index.tsx`).
