# Impl — app_shell_redesign

Feature ID: 8
Layer: frontend
Estado: in_progress (pendiente review)

## Archivos creados

- `product/frontend/components/AppShell.tsx`
- `product/frontend/components/shell/Icon.tsx`
- `product/frontend/components/shell/Topbar.tsx`
- `product/frontend/components/shell/LeftRail.tsx`
- `product/frontend/components/shell/RightRail.tsx`
- `product/frontend/components/shell/BottomBar.tsx`
- `tests/frontend/test_app_shell.tsx`

## Archivos modificados

- `tailwind.config.js` — añadidas `pulseDot` keyframe + animation (T7).
- `pages/index.tsx` — swap `DashboardLayout` → `AppShell`; `analyzedCount={leads.length}` pasado (T8).
- `product/frontend/components/DashboardLayout.tsx` — JSDoc `@deprecated` sobre `export default` (T9).

## Tasks

- [x] **T1** — `shell/Icon.tsx` con tipo `IconName` (23 claves) y switch exhaustivo. SVGs copiados literalmente del HTML target. Sin hex de paleta.
- [x] **T2** — `shell/Topbar.tsx` con `role="banner"`/`aria-label="Topbar"`, logo, input `aria-label="Buscar"` con placeholder exacto `Buscar leads, propiedades, contactos…`, grupo derecho (`role="group"` + `aria-label="Acciones del topbar"`) con notificaciones (badge dinámico), botón "+", avatar+username (defaults `EH`/`Emanuel`), settings y help.
- [x] **T3** — `shell/LeftRail.tsx` con `aria-label="Navegación principal"`, 80px, botón "Nuevo lead" rojo, 8 items con ids estables. `activeView` aplica `bg-brand-primary-500-15 text-brand-primary-500` + `aria-current="page"`. Badge en `queue` cuando `queueBadgeCount > 0`. Click invoca `onSelectView(id)` / `onNewLead()`. Defaults no rompen sin callbacks.
- [x] **T4** — `shell/RightRail.tsx` con `aria-label="Acciones rápidas"`, 48px, 4 botones (`Compartir`, `Marcar`, `Tablero`, `Añadir widget`) con `aria-label` + `title`.
- [x] **T5** — `shell/BottomBar.tsx` con `aria-label="Barra inferior"`, h-[72px], counter `{N} leads analizados`, 5 view buttons con handlers opcionales (`onExport`, `onFilter`, `onSort`, `onViewList`, `onViewCards`), live badge `role="status"` con dot `animate-pulseDot` y texto `En vivo · Analizando leads`.
- [x] **T6** — `AppShell.tsx` con `AppShellProps`, defaults (`activeView='dashboard'`, `queueBadgeCount=0`, `analyzedCount=0`, `userInitials='EH'`, `userName='Emanuel'`, `notificationCount=3`). Estructura: `<div flex-col h-screen bg-surface-low>` → `Topbar` → `<div flex flex-1>` → `LeftRail` + `<main role="main" aria-label="Contenido">` (children + `BottomBar`) + `RightRail`.
- [x] **T7** — `tailwind.config.js` extendido con `pulseDot` keyframe (`0%,100%:opacity 1; 50%:opacity 0.35`) y `pulseDot: 'pulseDot 2s ease-in-out infinite'`. Animación `enter` preservada.
- [x] **T8** — `pages/index.tsx` ahora importa `AppShell` y renderiza `<AppShell analyzedCount={leads.length}>…`. Contenido interno (columna simulador+feed+spam + columna detalle) intacto.
- [x] **T9** — `DashboardLayout.tsx` recibe JSDoc con literal `@deprecated` y referencia a `AppShell`. Archivo y markup conservados.
- [x] **T10** — `tests/frontend/test_app_shell.tsx` con los 5 sub-tests del spec (R19, R20, R21, R22a, R22b).
- [x] **T11** — Caso negativo R9 añadido: render default con `queueBadgeCount` ausente → `within(item).queryByText('0')).toBeNull()`.
- [x] **T12** — `npx jest --selectProjects frontend`: 7 suites / 40 tests verde (incluye los 6 sub-tests nuevos del shell + los 34 previos).
- [x] **T13** — `npx tsc --noEmit`: exit 0, sin errores.
- [x] **T14** — Este informe + tabla de trazabilidad abajo.

## Verificación

### `npx tsc --noEmit`

```
EXIT=0
```

### `npx jest --selectProjects frontend`

```
Test Suites: 7 passed, 7 total
Tests:       40 passed, 40 total
Snapshots:   0 total
Time:        1.428 s
EXIT=0
```

Suites pasando:
- `test_design_tokens.tsx` (previo, sin cambios)
- `test_feed.tsx` (previo, sin cambios)
- `test_lead_detail_panel.tsx` (previo, sin cambios)
- `test_simulator_panel.tsx` (previo, sin cambios)
- `test_simulation_integration.tsx` (previo, sin cambios)
- `test_use_lead_analysis.tsx` (previo, sin cambios)
- `test_app_shell.tsx` (nuevo, esta feature)

Ningún test legacy rompió por el swap `DashboardLayout`→`AppShell` (los tests legacy renderizan los componentes feed/detail/simulator de forma aislada, no `pages/index.tsx`).

### `bash ./init.sh`

Pre-flight reporta `[FAIL]` por `usuario GitHub esperado 'your-github-username'`, configuración de plantilla del arnés sin relación con esta feature. Las verificaciones de Docker, Git, archivos base están verde.

## Trazabilidad (R<n> → verificación)

| R   | Verificación concreta                                                                                              |
|-----|---------------------------------------------------------------------------------------------------------------------|
| R1  | `AppShell.tsx`: monta `Topbar` + `LeftRail` + `<main>` + `BottomBar` + `RightRail`. `test_app_shell` sub-test R19.   |
| R2  | `shell/Topbar.tsx`: `role="banner"`, logo svg, input con placeholder exacto y `aria-label="Buscar"`, grupo derecho.  |
| R3  | `shell/LeftRail.tsx`: `aria-label="Navegación principal"`, botón "Nuevo lead" + 8 items con ids estables.            |
| R4  | `shell/RightRail.tsx`: `aria-label="Acciones rápidas"` + 4 botones con `aria-label`/`title`.                         |
| R5  | `shell/BottomBar.tsx`: `aria-label="Barra inferior"`, counter + 5 view buttons + live badge.                         |
| R6  | `shell/BottomBar.tsx`: `<div role="status">` con dot `animate-pulseDot` y texto `En vivo · Analizando leads`. Sub-test R21. |
| R7  | `shell/LeftRail.tsx`: clases `bg-brand-primary-500-15 text-brand-primary-500` + `aria-current="page"`. Sub-test R20. |
| R8  | `shell/LeftRail.tsx`: `showBadge = item.id==="queue" && queueBadgeCount > 0`. Sub-test R20 (renderiza "7").          |
| R9  | `shell/LeftRail.tsx`: condicional impide nodo `"0"`. Sub-test R9 (`queryByText('0')).toBeNull()`).                   |
| R10 | `shell/LeftRail.tsx`: `onClick={() => onSelectView?.(item.id)}`. Sub-test R22 (`onSelectView('queue')`).             |
| R11 | `shell/LeftRail.tsx`: `onClick={() => onNewLead?.()}` en botón Nuevo lead. Sub-test R22 (1 invocación).              |
| R12 | `shell/BottomBar.tsx`: props `onExport`/`onFilter`/`onSort`/`onViewList`/`onViewCards` opcionales, click safe sin handler. |
| R13 | `shell/BottomBar.tsx`: `<span>{analyzedCount}</span><div>…leads…analizados…</div>`. Sub-test R21 (con `analyzedCount=42`). |
| R14 | `AppShell.tsx`: `<main role="main" aria-label="Contenido">{children}…</main>`. Sub-test R19 (`getByTestId('kid')` dentro de `main`). |
| R15 | Inspección: ningún literal hex Tokko en `AppShell`, `shell/*.tsx`, `Icon.tsx`. Solo clases del namespace Tokko (`bg-brand-*`, `text-neutral-*`, `bg-feedback-*`, `bg-surface-*`, `shadow-*`, `rounded-*`). SVGs usan `currentColor`/`white`. |
| R16 | `tailwind.config.js`: `pulseDot` declarada en `theme.extend.keyframes` y `theme.extend.animation`. `shell/BottomBar.tsx` consume `animate-pulseDot`. |
| R17 | `pages/index.tsx`: `import AppShell from "../product/frontend/components/AppShell"` reemplaza el import previo; JSX usa `<AppShell>…</AppShell>`. |
| R18 | `product/frontend/components/DashboardLayout.tsx`: JSDoc con literal `@deprecated` y referencia a `AppShell` sobre `export default`. Archivo no eliminado. |
| R19 | `test_app_shell.tsx` sub-test "R19" — verde.                                                                        |
| R20 | `test_app_shell.tsx` sub-test "R20" — verde.                                                                        |
| R21 | `test_app_shell.tsx` sub-test "R21" — verde.                                                                        |
| R22 | `test_app_shell.tsx` sub-tests "R22 click Cola" + "R22 click Nuevo lead" — verde.                                   |
| R23 | `npx jest --selectProjects frontend` — 40/40 verde. Suite previa intacta.                                           |
| R24 | `npx tsc --noEmit` — EXIT=0.                                                                                        |

## Desvíos respecto a design.md

1. **`pages/index.tsx`**: el design dejaba opcional pasar `analyzedCount={leads.length}` (alternativa 6.5). Implementé esa opción porque es trivial y mejora el counter del bottom bar de `0` a un valor real.
2. **R21 — assertion del bottom bar**: el design.md §4.10 proponía `within(bb).getByText(/leads/i)` y `within(bb).getByText(/analizados/i)`. Al ejecutarlo en RTL, `/leads/i` matchea tanto el counter `"leads"` como el texto del live badge `"Analizando leads"`, produciendo `getByText` error de múltiples matches. Ajusté el assertion a matchers exactos `"leads"` y `"analizados"` que apuntan únicamente a los nodos del counter. La intención del requirement (R13 + R21: ver "{N} leads analizados" en el bottom bar) se preserva. Documentado inline en el test.
3. **`shell/BottomBar.tsx`**: la clase utilitaria `bb-btn` (mencionada como opcional en design.md §4.5 nota) la expandí inline mediante una constante TS `BB_BTN_CLASS` para evitar tocar `styles/globals.css` con un `@apply` que escapa del scope frontend-only.
4. **Iconos `width`/`height`**: añadí `width="16" height="16"` a `bell`/`plus`/`settings`/`help` (como en el HTML target) y `className="w-4 h-4"` a iconos rail/right-rail/bottom-bar para que tengan tamaño consistente sin depender de CSS global no escrito.

Ninguno de estos desvíos altera contratos de spec ni introduce hex literales.
