# Requirements — app_shell_redesign

Feature ID: 8
Layer: frontend
Estado: spec_ready

> Esta feature reemplaza `DashboardLayout.tsx` por un nuevo `AppShell.tsx`
> que reproduce el shell del HTML target Tokko: topbar teal #1A4958,
> left rail blanco 80px, right rail 48px y bottom bar 72px con live badge
> pulsante. Solo el shell. La feature 9 (`view_router_navigation`)
> consumirá los props `activeView` / `onSelectView` para conmutar vistas;
> la feature 17 rediseñará los componentes internos. Los componentes
> existentes (LeadsFeed, LeadCard, LeadDetailPanel, SimulatorPanel) NO
> se tocan acá — pueden verse "rotos" hasta la feature 17. Contrato no
> negociable: `pages/index.tsx` DEBE seguir compilando y la app DEBE
> seguir levantando.

---

## R1 — Componente raíz `AppShell` existe y monta las 4 regiones del shell

El sistema DEBE exponer el archivo
`product/frontend/components/AppShell.tsx` que renderiza una estructura
con exactamente cuatro regiones distintas en el árbol del DOM:

- una `Topbar` (R2)
- un `LeftRail` (R3)
- un `RightRail` (R4)
- un `BottomBar` (R5)

y un área central de contenido (`<main>` o equivalente) que renderiza
`props.children` entre el `LeftRail` y el `RightRail`.

La firma del componente DEBE ser:

```ts
interface AppShellProps {
  children: React.ReactNode;
  activeView?: 'dashboard' | 'queue' | 'processed' | 'criteria' | string;
  onSelectView?: (view: string) => void;
  onNewLead?: () => void;
  queueBadgeCount?: number;   // default 0
  analyzedCount?: number;     // default 0
  userInitials?: string;      // default 'EH'
  userName?: string;          // default 'Emanuel'
  notificationCount?: number; // default 3
}
```

`activeView` DEBE tener default `'dashboard'`.

## R2 — Subcomponente `Topbar` con logo, search, iconos y avatar

El sistema DEBE exponer el archivo
`product/frontend/components/shell/Topbar.tsx` que renderiza un `<header>`
con `aria-label="Topbar"` (o `role="banner"`) y contiene, en este orden:

1. Un bloque logo con un cuadrado 26×26 de color
   `bg-brand-primary-500`, SVG de ojo/diana inline blanco, y el texto
   `Lead` seguido de `<span>Trust</span>` con color
   `text-brand-primary-100`.
2. Un input de búsqueda (visualmente, una caja blanca con icono lupa
   inline y placeholder exacto `Buscar leads, propiedades, contactos…`).
   El elemento DEBE ser un `<input type="text">` con
   `placeholder="Buscar leads, propiedades, contactos…"` y
   `aria-label="Buscar"`.
3. Un grupo a la derecha (`role="group"` o `<div>` con
   `aria-label="Acciones del topbar"`) con: un botón de notificaciones
   (icono campana inline) que renderiza un badge numérico circular con
   el valor de `notificationCount` (default 3), un botón "+" inline, el
   bloque usuario (avatar circular con iniciales `userInitials` default
   `'EH'` y `userName` default `'Emanuel'`), un botón settings inline y
   un botón help inline. Cada botón DEBE tener `aria-label` accesible.

El `<header>` DEBE aplicar la clase `bg-brand-secondary-high` y altura
fija 56px (vía `h-14` o equivalente).

## R3 — Subcomponente `LeftRail` con botón "Nuevo" y 8 nav items

El sistema DEBE exponer el archivo
`product/frontend/components/shell/LeftRail.tsx` que renderiza un `<nav>`
con `aria-label="Navegación principal"`, ancho fijo 80px
(`w-20` o equivalente), fondo `bg-surface-ground` (blanco) y
`shadow-low`. Contiene, en este orden:

1. Un botón primario rojo de 32×32 con icono "+" inline, `aria-label="Nuevo
   lead"`, que al hacer click DEBE invocar `props.onNewLead?.()`.
2. Una lista vertical de exactamente 8 nav items con los siguientes
   `id` estables y labels:

   | id          | label          | badge dinámico                  |
   |-------------|----------------|---------------------------------|
   | dashboard   | Dashboard      | —                               |
   | queue       | Cola de leads  | sí, valor = `queueBadgeCount`   |
   | processed   | Procesados     | —                               |
   | criteria    | Criterios      | —                               |
   | team        | Equipo         | —                               |
   | integrations| Integraciones  | —                               |
   | reports     | Reportes       | —                               |
   | settings    | Config         | —                               |

   Cada nav item DEBE ser un `<button>` (o elemento con `role="button"`)
   con `aria-label` igual al label, y un SVG icono inline propio del
   item según el HTML target.

## R4 — Subcomponente `RightRail` con 4 iconos accesibles

El sistema DEBE exponer el archivo
`product/frontend/components/shell/RightRail.tsx` que renderiza un
contenedor con `aria-label="Acciones rápidas"` (o role apropiado),
ancho fijo 48px (`w-12`), fondo `bg-surface-ground` y `shadow-left`.
Contiene exactamente 4 botones verticalmente apilados con SVG icono
inline y `aria-label` (y atributo `title` para tooltip) de:
`Compartir`, `Marcar`, `Tablero`, `Añadir widget`, en ese orden.

## R5 — Subcomponente `BottomBar` con counter, view buttons y live badge

El sistema DEBE exponer el archivo
`product/frontend/components/shell/BottomBar.tsx` que renderiza un
contenedor con `aria-label="Barra inferior"`, altura fija 72px
(`h-[72px]` o equivalente), fondo `bg-surface-ground` y `shadow-top`.
Contiene, en este orden:

1. Una sección counter que muestra el texto exacto
   `{analyzedCount} leads analizados` (donde `{analyzedCount}` es el
   valor numérico del prop). El número DEBE renderizarse con clase
   `text-title-lg` o equivalente y la palabra "leads analizados" DEBE
   estar presente en el DOM (puede dividirse en dos líneas como en el
   target).
2. Una sección con 5 botones de icono inline, en este orden y con
   estos `aria-label`/`title`: `Exportar`, `Filtrar`, `Ordenar`,
   `Vista lista`, `Vista tarjetas`. Por defecto son botones sin
   handlers (ver R12).
3. Un live badge a la derecha (R6).

## R6 — Live badge con dot pulsante y `role="status"`

El `BottomBar` DEBE contener un elemento con `role="status"` cuyo texto
accesible contenga la subcadena exacta `En vivo` y la subcadena
`Analizando leads`. Dentro del elemento DEBE haber un `<span>` o `<div>`
con clase `bg-feedback-green-500`, forma circular (6×6, `rounded-full`)
que aplica una animación de pulse (alternando opacity 1 ↔ 0.35 en bucle
de 2s).

## R7 — `activeView` resalta el nav item correspondiente y expone `aria-current="page"`

CUANDO `LeftRail` recibe `activeView="<id>"` para un `<id>` que coincide
con uno de los 8 nav items, el sistema DEBE aplicar a ese nav item las
clases `bg-brand-primary-500-15` y `text-brand-primary-500` y el
atributo `aria-current="page"`. Los demás nav items NO DEBEN tener
`aria-current`.

## R8 — `queueBadgeCount > 0` muestra el badge en el nav item Cola

CUANDO el prop `queueBadgeCount` recibido por `AppShell` (y propagado a
`LeftRail`) es un número entero estrictamente mayor que 0, el sistema
DEBE renderizar dentro del nav item `queue` un elemento (badge) cuyo
texto sea exactamente la representación decimal del valor
(p. ej. `"7"` para 7, `"12"` para 12).

## R9 — `queueBadgeCount` ausente o 0 oculta el badge del nav item Cola

SI `queueBadgeCount` es `undefined`, `null` o `0` ENTONCES el sistema NO
DEBE renderizar ningún elemento badge dentro del nav item `queue` (no
debe haber un nodo cuyo texto sea `"0"` adyacente al icono de Cola).

## R10 — Click en un nav item dispara `onSelectView(id)`

CUANDO el usuario hace click sobre un nav item del `LeftRail` cuyo id
es `<id>`, el sistema DEBE invocar `props.onSelectView?.(id)`. La firma
del callback DEBE recibir el string id estable definido en R3
(`'dashboard' | 'queue' | 'processed' | 'criteria' | 'team' |
'integrations' | 'reports' | 'settings'`).

## R11 — Click en el botón "Nuevo" dispara `onNewLead`

CUANDO el usuario hace click sobre el botón primario rojo "Nuevo" del
`LeftRail`, el sistema DEBE invocar `props.onNewLead?.()` exactamente
una vez por click. SI `onNewLead` es `undefined` ENTONCES el sistema NO
DEBE lanzar ninguna excepción (el botón sigue siendo clickable sin
efecto).

## R12 — Botones de vista del `BottomBar` aceptan handlers opcionales

El subcomponente `BottomBar` DEBE aceptar las siguientes props opcionales
y, CUANDO una de ellas es provista, DEBE invocarla en el click del botón
correspondiente: `onExport?: () => void`, `onFilter?: () => void`,
`onSort?: () => void`, `onViewList?: () => void`, `onViewCards?: () => void`.
SI un handler no se provee ENTONCES el botón correspondiente DEBE
renderizarse igualmente como `<button>` accesible sin lanzar errores al
hacer click.

## R13 — `analyzedCount` se refleja en el counter del `BottomBar`

CUANDO `AppShell` recibe `analyzedCount={N}` (con `N` entero ≥ 0), el
`BottomBar` DEBE renderizar un nodo de texto cuya subcadena combinada
incluya `"{N} leads analizados"` (admitiendo que `N` y `leads analizados`
estén en nodos separados pero contiguos en el DOM).

## R14 — `children` se renderiza dentro del content area

CUANDO se renderiza
`<AppShell><div data-testid="kid" /></AppShell>`, el sistema DEBE
montar el `<div data-testid="kid" />` dentro de un contenedor con
`role="main"` (o `aria-label="Contenido"`) ubicado entre `LeftRail` y
`RightRail` en el DOM.

## R15 — Layout root usa tokens Tokko (no hex literales)

El sistema NO DEBE introducir, en ninguno de los archivos creados por
esta feature (`AppShell.tsx`, `Topbar.tsx`, `LeftRail.tsx`,
`RightRail.tsx`, `BottomBar.tsx`, `Icon.tsx`), valores hex literales
para colores brand, neutrales, feedback o superficie. Todo color de
estos sets DEBE consumirse vía clases Tailwind del namespace Tokko
(`brand-primary-*`, `brand-secondary-*`, `neutral-grey-*`,
`feedback-*`, `surface-*`) o vía `var(--color-...)` en `style` inline
cuando una clase Tailwind no exista para ese caso (p. ej. opacities
custom no presentes en `tokens.css`).

## R16 — Animación pulse declarada en `tailwind.config.js`

El sistema DEBE modificar `tailwind.config.js` para que
`theme.extend.keyframes` declare la clave `pulseDot` con los frames
`0%, 100% { opacity: 1 }` y `50% { opacity: 0.35 }`, y para que
`theme.extend.animation` declare `pulseDot: 'pulseDot 2s ease-in-out
infinite'`. El live dot del `BottomBar` DEBE usar la clase
`animate-pulseDot`.

> Nota: Tailwind ya provee `animate-pulse` por default, pero su curva
> (opacity 1 → 0.5) no coincide con el target Tokko (1 → 0.35). Esta
> feature introduce `pulseDot` para preservar paridad visual.

## R17 — `pages/index.tsx` deja de importar `DashboardLayout`

El sistema DEBE modificar `pages/index.tsx` para que sustituya el
`import DashboardLayout` por `import AppShell` y reemplace el JSX
`<DashboardLayout>…</DashboardLayout>` por `<AppShell>…</AppShell>`.
El contenido interno (columna de simulador + feed + spam + detalle) NO
DEBE modificarse en esta feature (la feature 9 lo refactoriza).

## R18 — `DashboardLayout.tsx` queda marcado como deprecated, no eliminado

El sistema NO DEBE eliminar `product/frontend/components/DashboardLayout.tsx`
en esta feature (su eliminación física se difiere a la feature 9
`view_router_navigation` para mantener atomicidad). El archivo DEBE,
sin embargo, contener un comentario JSDoc en el export por defecto que
incluya literalmente la subcadena `@deprecated` y una referencia a
`AppShell`.

## R19 — Tests verifican render de las 4 regiones

El sistema DEBE exponer el archivo
`tests/frontend/test_app_shell.tsx`. Al renderizar
`<AppShell><div data-testid="kid" /></AppShell>` con valores default,
los tests DEBEN comprobar que:

- Existe un nodo con `role="banner"` o `aria-label="Topbar"`.
- Existe un nodo con `aria-label="Navegación principal"`.
- Existe un nodo con `aria-label="Acciones rápidas"`.
- Existe un nodo con `aria-label="Barra inferior"`.
- `screen.getByTestId('kid')` es descendiente del nodo con
  `role="main"` (o `aria-label="Contenido"`).

## R20 — Tests verifican `activeView` + `queueBadgeCount`

CUANDO el test renderiza `<AppShell activeView="queue" queueBadgeCount={7}>…`,
el sistema DEBE permitir que:

- el nav item con label `Cola de leads` tenga `aria-current="page"`,
- exista en el DOM un nodo cuyo texto sea exactamente `"7"` dentro del
  nav item `Cola de leads`.

## R21 — Tests verifican `analyzedCount` y live badge

CUANDO el test renderiza `<AppShell analyzedCount={42}>…`, el sistema
DEBE permitir que:

- el `BottomBar` muestre la cadena `"42 leads analizados"` (admite
  partición en nodos contiguos).
- exista un nodo con `role="status"` cuyo `textContent` contenga
  `En vivo`.

## R22 — Tests verifican callbacks de interacción

El test `test_app_shell.tsx` DEBE simular:

- click sobre el nav item `Cola de leads` y verificar que el handler
  `onSelectView` se invocó con el argumento `"queue"`.
- click sobre el botón "Nuevo" del `LeftRail` y verificar que
  `onNewLead` se invocó una vez.

## R23 — Tests no rompen la suite frontend existente

CUANDO se ejecuta `npx jest --selectProjects frontend`, el sistema DEBE
ejecutar `test_app_shell.tsx` con resultado verde, y los tests previos
(`test_design_tokens.tsx`, `test_feed.tsx`, `test_lead_detail_panel.tsx`,
`test_simulator_panel.tsx`, `test_simulation_integration.tsx`,
`test_use_lead_analysis.tsx`) DEBEN seguir pasando (o fallar
únicamente por motivos no relacionados con el shell; el reviewer
documenta excepciones).

## R24 — Build no se rompe

CUANDO se ejecuta `npx tsc --noEmit` (o `npx next build` si está
disponible), el sistema DEBE completar sin errores de TypeScript ni de
Next relacionados con los archivos modificados o creados por esta
feature (`AppShell.tsx`, `Topbar.tsx`, `LeftRail.tsx`, `RightRail.tsx`,
`BottomBar.tsx`, `Icon.tsx` si se crea, `tailwind.config.js`,
`pages/index.tsx`, `DashboardLayout.tsx` con su JSDoc).
