# Tasks — app_shell_redesign

Feature ID: 8
Layer: frontend
Estado: spec_ready

> Orden recomendado: crear `Icon` y subcomponentes primero, luego
> `AppShell`, luego `tailwind.config.js` (pulseDot), luego tests, luego
> swap en `pages/index.tsx`, finalmente JSDoc en `DashboardLayout`. El
> implementer marca `[x]` al cerrar cada task.

---

- [x] **T1 — Crear `product/frontend/components/shell/Icon.tsx`** que
      exporta el tipo `IconName` (unión de las 23 claves listadas en
      design.md §4.6) y el componente default `Icon({ name, className })`
      que retorna el SVG inline correspondiente, copiado literalmente
      del HTML target (líneas indicadas en design.md §4.6).
      Cubre: R15.

- [x] **T2 — Crear `product/frontend/components/shell/Topbar.tsx`**
      siguiendo la firma y el JSX de design.md §4.2: `<header
      role="banner" aria-label="Topbar">` con logo (svg `logo-eye`),
      search input con `placeholder="Buscar leads, propiedades,
      contactos…"` y `aria-label="Buscar"`, grupo derecho con
      notificaciones+badge dinámico, botón "+", avatar+username,
      settings, help. Sin valores hex literales.
      Cubre: R2, R15.

- [x] **T3 — Crear `product/frontend/components/shell/LeftRail.tsx`**
      siguiendo design.md §4.3. Constante `ITEMS` con los 8 entries
      (id estables: `dashboard`, `queue`, `processed`, `criteria`,
      `team`, `integrations`, `reports`, `settings`). Botón "Nuevo
      lead" rojo. Item activo aplica `bg-brand-primary-500-15
      text-brand-primary-500` y `aria-current="page"`. Badge en `queue`
      cuando `queueBadgeCount > 0`. Click invoca callbacks.
      Cubre: R3, R7, R8, R9, R10, R11, R15.

- [x] **T4 — Crear `product/frontend/components/shell/RightRail.tsx`**
      siguiendo design.md §4.4: `<aside aria-label="Acciones
      rápidas">` con 4 botones (`Compartir`, `Marcar`, `Tablero`,
      `Añadir widget`), cada uno con `aria-label` y `title`.
      Cubre: R4, R15.

- [x] **T5 — Crear `product/frontend/components/shell/BottomBar.tsx`**
      siguiendo design.md §4.5: contenedor con `aria-label="Barra
      inferior"`, h-72px, `shadow-top`. Counter `{analyzedCount} leads
      analizados`. 5 botones de vista con handlers opcionales. Live
      badge `<div role="status">` con dot `animate-pulseDot` y texto
      `En vivo · Analizando leads`.
      Cubre: R5, R6, R12, R13, R15.

- [x] **T6 — Crear `product/frontend/components/AppShell.tsx`** con la
      firma `AppShellProps` y los defaults de design.md §4.1. Layout
      `<div class="flex flex-col h-screen overflow-hidden
      bg-surface-low">` → `<Topbar />` + `<div class="flex flex-1
      overflow-hidden">` → `<LeftRail />` + `<main role="main"
      aria-label="Contenido">` (con `children` y `<BottomBar />`) +
      `<RightRail />`.
      Cubre: R1, R14, R15.

- [x] **T7 — Modificar `tailwind.config.js`** para añadir, dentro de
      `theme.extend.keyframes`, la clave `pulseDot: { "0%,100%":
      { opacity: "1" }, "50%": { opacity: "0.35" } }` y, dentro de
      `theme.extend.animation`, la clave `pulseDot: "pulseDot 2s
      ease-in-out infinite"`. Mantener `enter` existente intacto.
      Cubre: R16, R24.

- [x] **T8 — Modificar `pages/index.tsx`** para sustituir el import
      `DashboardLayout` por `AppShell` y reemplazar el JSX
      `<DashboardLayout>…</DashboardLayout>` por `<AppShell>…</AppShell>`.
      El contenido interno (columna simulador + feed + spam + detalle)
      queda exactamente igual. Opcional: pasar
      `analyzedCount={leads.length}` (no bloqueante).
      Cubre: R17, R24.

- [x] **T9 — Modificar `product/frontend/components/DashboardLayout.tsx`**
      añadiendo un comentario JSDoc sobre el `export default` con la
      subcadena literal `@deprecated` y referencia a `AppShell`. NO
      eliminar el archivo ni modificar su markup.
      Cubre: R18.

- [x] **T10 — Crear `tests/frontend/test_app_shell.tsx`** con los 5
      sub-tests descritos en design.md §4.10:
      1. R19: render mínimo → 4 regiones + child en `<main>`.
      2. R20: `activeView="queue"` + `queueBadgeCount=7` →
         `aria-current="page"` en el item Cola + badge texto `"7"`.
      3. R21: `analyzedCount=42` → textos `42`, `leads`, `analizados`
         dentro del bottom bar + `role="status"` con `En vivo`.
      4. R22a: click en nav item `Cola de leads` invoca
         `onSelectView("queue")`.
      5. R22b: click en botón `Nuevo lead` invoca `onNewLead()` una vez.
      Cubre: R19, R20, R21, R22.

- [x] **T11 — Añadir caso negativo en `test_app_shell.tsx`**: render
      con `queueBadgeCount` ausente (default 0) y verificar que NO
      existe en el DOM un nodo con texto `"0"` adyacente al icono de
      Cola (`within(item).queryByText('0')).toBeNull()`).
      Cubre: R9.

- [x] **T12 — Ejecutar `npx jest --selectProjects frontend`** y
      confirmar verde, incluido `test_app_shell.tsx`. Reportar
      cualquier test previo que falle por motivos no relacionados al
      shell en `progress/impl_app_shell_redesign.md`.
      Cubre: R23.

- [x] **T13 — Ejecutar `npx tsc --noEmit`** (o `npx next build` si el
      entorno lo permite) y confirmar 0 errores nuevos atribuibles a
      esta feature.
      Cubre: R24.

- [x] **T14 — Escribir `progress/impl_app_shell_redesign.md`** con la
      tabla de trazabilidad final (R<n> → test concreto), commits
      tocados y cualquier desviación respecto al design.md.
      Cubre: regla de trazabilidad de `docs/specs.md`.
