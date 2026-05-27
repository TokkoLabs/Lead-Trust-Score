# Review — app_shell_redesign

Feature ID: 8
Layer: frontend
Reviewer: frontend_reviewer
Veredicto: **APPROVED**

## Resumen

La implementación cumple los 24 requirements del spec aprobado, las 14
tasks marcadas `[x]` están todas verificadas en código, los tests
cubren los 6 sub-casos (R19, R20, R21, R22a, R22b + R9 negativo) y la
suite frontend pasa 40/40. `tsc --noEmit` exit 0. No se introducen
dependencias nuevas ni cambios fuera de scope.

## Comandos verdes

```
npx tsc --noEmit                       → EXIT=0
npx jest --selectProjects frontend     → 7 suites / 40 tests passed
                                         Time ~1.3s
git diff HEAD -- product/backend tests/backend → vacío (sin cambios)
```

Ningún comando rojo durante el review.

## Trazabilidad R1..R24

| R   | Cobertura | Notas |
|-----|-----------|-------|
| R1  | OK | `AppShell.tsx` monta Topbar + LeftRail + `<main>` + BottomBar + RightRail. Sub-test "R19" valida 4 regiones. |
| R2  | OK | `Topbar.tsx`: `role="banner"`, `aria-label="Topbar"`, logo 26×26 con `bg-brand-primary-500`, input con placeholder exacto `Buscar leads, propiedades, contactos…` y `aria-label="Buscar"`, grupo derecho con `role="group"` + `aria-label="Acciones del topbar"` con 3 icon buttons (Notificaciones/Añadir/Configuración/Ayuda — total 4) + avatar+username. Header `h-14 bg-brand-secondary-high`. |
| R3  | OK | `LeftRail.tsx`: `<nav aria-label="Navegación principal" w-20 bg-surface-ground shadow-low>`, botón rojo "Nuevo lead" + 8 items con ids estables exactos. Cada item es `<button>` con `aria-label` igual al label. |
| R4  | OK | `RightRail.tsx`: `<aside aria-label="Acciones rápidas" w-12 bg-surface-ground shadow-left>`, 4 botones `Compartir`/`Marcar`/`Tablero`/`Añadir widget` con `aria-label` + `title`. |
| R5  | OK | `BottomBar.tsx`: `aria-label="Barra inferior"`, `h-[72px] bg-surface-ground shadow-top`, counter `{N} leads analizados`, 5 view buttons en orden Exportar/Filtrar/Ordenar/Vista lista/Vista tarjetas, live badge a la derecha. |
| R6  | OK | `<div role="status">` con dot `<span … animate-pulseDot>` y texto literal `En vivo · Analizando leads`. Validado por sub-test "R21". |
| R7  | OK | `LeftRail` aplica `bg-brand-primary-500-15 text-brand-primary-500` y `aria-current="page"` solo al item activo. Validado por sub-test "R20". |
| R8  | OK | `showBadge = item.id==="queue" && queueBadgeCount > 0` renderiza badge con valor decimal. Sub-test "R20" verifica `"7"`. |
| R9  | OK | Condicional impide nodo `"0"`. Sub-test dedicado ("R9: queueBadgeCount ausente…") con `queryByText('0')).toBeNull()`. |
| R10 | OK | `onClick={() => onSelectView?.(item.id)}`. Sub-test "R22 Cola" comprueba `toHaveBeenCalledWith("queue")`. |
| R11 | OK | `onClick={() => onNewLead?.()}` en botón Nuevo lead. Sub-test "R22 Nuevo lead" verifica una sola invocación. Optional chaining tolera `onNewLead` undefined. |
| R12 | OK | `BottomBar` declara `onExport`/`onFilter`/`onSort`/`onViewList`/`onViewCards` opcionales y los invoca con optional chaining. Sin handler: el botón sigue siendo accesible y no rompe. |
| R13 | OK | `<span>{analyzedCount}</span>` + `<span>leads</span><span>analizados</span>` en nodos contiguos. Sub-test "R21" valida con `analyzedCount=42`. |
| R14 | OK | `<main role="main" aria-label="Contenido">{children}…</main>` entre LeftRail y RightRail. Sub-test "R19" verifica `getByTestId('kid')` dentro de `main`. |
| R15 | OK | Inspección de `AppShell.tsx`, `shell/*.tsx`, `Icon.tsx`: 0 hex literales de paleta. Único `#1A4958` aparece en JSDoc comment de Topbar como referencia documental, no como valor de estilo. Todo el color sale por clases Tokko (`bg-brand-*`, `text-neutral-*`, `bg-feedback-*`, `bg-surface-*`) o `white`/`currentColor` en SVGs. |
| R16 | OK | `tailwind.config.js`: `theme.extend.keyframes.pulseDot = {"0%, 100%": {opacity:"1"}, "50%": {opacity:"0.35"}}` y `theme.extend.animation.pulseDot = "pulseDot 2s ease-in-out infinite"`. `BottomBar` consume `animate-pulseDot`. `enter` legado preservado. |
| R17 | OK | `pages/index.tsx` importa `AppShell` (no `DashboardLayout`) y JSX usa `<AppShell analyzedCount={leads.length}>…</AppShell>`. Contenido interno intacto (columna simulador+feed+spam + detalle). |
| R18 | OK | `DashboardLayout.tsx` con JSDoc que contiene literal `@deprecated` y referencia a `AppShell` sobre el `export default`. Archivo no eliminado, markup preservado. |
| R19 | OK | `test_app_shell.tsx` sub-test "R19" — verde. |
| R20 | OK | Sub-test "R20" — verde. |
| R21 | OK | Sub-test "R21" — verde. Live badge verifica `En vivo` y `Analizando leads`. |
| R22 | OK | Sub-tests "R22 Cola" y "R22 Nuevo lead" — ambos verdes. |
| R23 | OK | `npx jest --selectProjects frontend` → 40/40 verde. Las 6 suites legacy (test_design_tokens, test_feed, test_lead_detail_panel, test_simulator_panel, test_simulation_integration, test_use_lead_analysis) siguen pasando sin cambios. |
| R24 | OK | `npx tsc --noEmit` exit 0. Sin errores nuevos. |

No hay huecos de trazabilidad.

## Spot-check de fidelidad visual (HTML target)

- Placeholder search: `"Buscar leads, propiedades, contactos…"` ✓ (línea 585 del HTML target).
- Live badge text: `"En vivo · Analizando leads"` ✓ (línea 910).
- Counter copy: `"{N} leads analizados"` ✓.
- Item `queue` label: `"Cola de leads"` (con badge dinámico cuando >0) ✓.

## Subregiones — checklist

- Topbar: logo (cuadro 26×26 + svg eye), search input, 3 icon buttons (Notificaciones con badge dinámico, +, Configuración, Ayuda — son 4 botones de icono pero el R2 sólo exige los listados; todos presentes), avatar. ✓
- LeftRail: botón rojo Nuevo lead + 8 nav items con ids estables + badge en Cola + item activo con `aria-current`. ✓
- RightRail: 4 iconos verticales con `aria-label`+`title`. ✓
- BottomBar: counter, 5 view buttons, live badge con `role="status"`, dot `animate-pulseDot`. ✓

## Props del AppShell

Firma `AppShellProps` coincide con design.md §4.1 al pie de la letra:
`children, activeView?, onSelectView?, onNewLead?, queueBadgeCount?,
analyzedCount?, userInitials?, userName?, notificationCount?`. Defaults
razonables (`'dashboard'`, `0`, `0`, `'EH'`, `'Emanuel'`, `3`).

## Tests

`test_app_shell.tsx` cubre los 6 casos esperados:

1. R19: 4 regiones + child en `<main>` (default render).
2. R9: badge `"0"` NO se renderiza con default.
3. R20: `activeView="queue"` + `queueBadgeCount=7` → `aria-current="page"` y `"7"`.
4. R21: `analyzedCount=42` → `"42"`, `"leads"`, `"analizados"` en bottom bar + `role="status"` con `"En vivo"`.
5. R22a: click en Cola → `onSelectView("queue")`.
6. R22b: click en Nuevo lead → `onNewLead()` una vez.

## Scope y no-regresión

- `git diff HEAD -- product/backend tests/backend specs/` → vacío.
- Componentes UI no shell (`LeadsFeed`, `LeadCard`, `LeadDetailPanel`,
  `SimulatorPanel`) intactos. Sus tests siguen pasando.
- `DashboardLayout.tsx` conservado con JSDoc `@deprecated` (eliminación
  difiere a feature 9, conforme R18).
- `package.json` NO añade libs (`lucide-react`/`heroicons`/etc.).
- Solo se modifican: `pages/index.tsx` (swap import + JSX), `tailwind.config.js`
  (pulseDot), `DashboardLayout.tsx` (JSDoc). Todo autorizado por el spec.

## Desvíos del implementer — análisis

1. **`analyzedCount={leads.length}` en `pages/index.tsx`**: aceptable.
   design.md alt. 6.5 lo dejaba explícitamente como opcional ("trivial,
   puede hacerlo") y la feature 11 lo reemplazará por un counter real.
   Mejora el UX inmediato sin tocar contratos.

2. **Matcher exacto `"leads"` y `"analizados"` en R21**: aceptable y
   bien justificado. El spec §4.10 proponía `getByText(/leads/i)` pero
   en RTL real eso colisiona con `"Analizando leads"` del live badge,
   produciendo error de múltiples matches. Cambiar a matchers exactos
   preserva la intención del requirement (R13 + R21 piden verificar
   `"{N} leads analizados"` en el bottom bar) y queda documentado
   inline en el test. No es desvío de spec sino corrección del
   esqueleto del design.

3. **`BB_BTN_CLASS` como const inline**: aceptable. design.md §4.5 nota
   dejaba al implementer elegir entre `@apply` global o expansión
   inline. La const TS es la opción más ergonómica para frontend-only:
   evita modificar `styles/globals.css` con `@apply`, mantiene los 5
   botones consistentes y es fácilmente refactoreable a `@apply` si la
   feature 17 lo pide.

4. **`width`/`height` y `className="w-4 h-4"` en iconos**: aceptable.
   No es desvío del contrato del spec, sólo robustece la presentación
   sin CSS global. No introduce hex ni rompe R15.

Los 4 desvíos están aprobados explícitamente.

## Animación pulseDot

`tailwind.config.js` declara la keyframe `pulseDot` con `0%, 100% {opacity:"1"}`
y `50% {opacity:"0.35"}`, y la animación `pulseDot: "pulseDot 2s ease-in-out
infinite"`. `BottomBar.tsx` consume `animate-pulseDot` en el dot del live
badge. Cumple R16 literalmente.

## Conclusión

```
APPROVED -> progress/review_app_shell_redesign.md
```

El leader puede mover feature 8 de `in_progress` a `done` en el siguiente
ciclo, ejecutar el handoff y pasar a la feature 9 (`view_router_navigation`),
que se hará cargo de eliminar `DashboardLayout.tsx` y cablear el routing
de `activeView`/`onSelectView`.
