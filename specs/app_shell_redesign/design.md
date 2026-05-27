# Design — app_shell_redesign

Feature ID: 8
Layer: frontend
Estado: spec_ready

> Esta feature construye el **shell** del producto (topbar, left rail,
> right rail, bottom bar) que envuelve al resto del UI. Es el primer
> consumidor real de los tokens Tokko (feature 7) y prepara el terreno
> para la navegación entre vistas (feature 9) y el rediseño de los
> componentes internos (features 11–17). El alcance es estrictamente
> visual + estructural; **no** se introduce routing, ni estado global,
> ni hooks nuevos.

---

## 1. Resumen de la decisión

- **Un componente raíz** `AppShell` orquesta cuatro subcomponentes
  (`Topbar`, `LeftRail`, `RightRail`, `BottomBar`) y un `<main>`
  central que renderiza `children`.
- **Subcomponentes en `product/frontend/components/shell/`** para
  aislar la implementación del shell del resto del feature work.
- **Iconos inline**: como el repo no instala `lucide-react`,
  `heroicons` ni similares, se crea un helper `Icon.tsx` que enumera
  los SVGs estáticos copiados literalmente del HTML target. Esto evita
  añadir una dep nueva en una feature meramente cosmética.
- **`activeView` / `onSelectView` son props** (no contexto) en esta
  feature; la feature 9 elevará el estado a un provider. Para esta
  feature, `pages/index.tsx` los deja en sus defaults.
- **`DashboardLayout.tsx`** se marca `@deprecated` pero no se elimina;
  su eliminación física se difiere a la feature 9, que toca el
  routing.
- **Animación pulse custom (`pulseDot`)** en `tailwind.config.js`
  porque la curva default de `animate-pulse` no coincide con el target
  Tokko.

## 2. Archivos a crear

| Archivo                                                          | Propósito                                                              | R cubiertos        |
|------------------------------------------------------------------|------------------------------------------------------------------------|--------------------|
| `product/frontend/components/AppShell.tsx`                       | Componente raíz que monta las 4 regiones + content area.               | R1, R14, R15       |
| `product/frontend/components/shell/Topbar.tsx`                   | Header teal con logo, search, iconos y avatar.                         | R2, R15            |
| `product/frontend/components/shell/LeftRail.tsx`                 | Nav vertical 80px con botón "Nuevo" y 8 items.                         | R3, R7, R8, R9, R10, R11, R15 |
| `product/frontend/components/shell/RightRail.tsx`                | Rail derecho 48px con 4 iconos.                                        | R4, R15            |
| `product/frontend/components/shell/BottomBar.tsx`                | Barra inferior con counter, view buttons y live badge.                 | R5, R6, R12, R13, R15, R16 |
| `product/frontend/components/shell/Icon.tsx`                     | Helper que exporta SVGs inline indexados por nombre estable.           | R15                |
| `tests/frontend/test_app_shell.tsx`                              | Tests RTL para R19–R22.                                                | R19, R20, R21, R22, R23 |

## 3. Archivos a modificar

| Archivo                                              | Cambio                                                                                  | R cubiertos |
|------------------------------------------------------|-----------------------------------------------------------------------------------------|-------------|
| `pages/index.tsx`                                    | Sustituir `DashboardLayout` por `AppShell`. Mantener el layout interno existente.       | R17, R24    |
| `tailwind.config.js`                                 | Añadir `pulseDot` a `keyframes` y `animation`. Mantener `enter` existente.              | R16, R24    |
| `product/frontend/components/DashboardLayout.tsx`    | Añadir comentario JSDoc `@deprecated` (no eliminar todavía).                            | R18         |
| `feature_list.json`                                  | Cambiar `status` de feature id 8 de `pending` a `spec_ready` (lo hace este spec_author). | —          |

## 4. Firmas y contratos

### 4.1 `AppShell.tsx`

```tsx
import React from "react";
import Topbar from "./shell/Topbar";
import LeftRail from "./shell/LeftRail";
import RightRail from "./shell/RightRail";
import BottomBar from "./shell/BottomBar";

export type AppShellView =
  | "dashboard" | "queue" | "processed" | "criteria"
  | "team" | "integrations" | "reports" | "settings";

export interface AppShellProps {
  children: React.ReactNode;
  activeView?: AppShellView | string;
  onSelectView?: (view: string) => void;
  onNewLead?: () => void;
  queueBadgeCount?: number;
  analyzedCount?: number;
  userInitials?: string;
  userName?: string;
  notificationCount?: number;
}

export default function AppShell({
  children,
  activeView = "dashboard",
  onSelectView,
  onNewLead,
  queueBadgeCount = 0,
  analyzedCount = 0,
  userInitials = "EH",
  userName = "Emanuel",
  notificationCount = 3,
}: AppShellProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-low">
      <Topbar
        userInitials={userInitials}
        userName={userName}
        notificationCount={notificationCount}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftRail
          activeView={activeView}
          onSelectView={onSelectView}
          onNewLead={onNewLead}
          queueBadgeCount={queueBadgeCount}
        />
        <main
          role="main"
          aria-label="Contenido"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-auto">{children}</div>
          <BottomBar analyzedCount={analyzedCount} />
        </main>
        <RightRail />
      </div>
    </div>
  );
}
```

> Nota: el target HTML coloca `BottomBar` adentro de `.content-area`
> (entre `LeftRail` y `RightRail`, no a lo ancho de la pantalla). Este
> spec **conserva esa decisión** porque preserva la sombra superior
> proyectándose sólo sobre el content area y deja el `RightRail`
> visualmente "completo" desde topbar hasta el viewport bottom.

### 4.2 `shell/Topbar.tsx`

```tsx
interface TopbarProps {
  userInitials: string;
  userName: string;
  notificationCount: number;
}

export default function Topbar(props: TopbarProps) {
  return (
    <header
      role="banner"
      aria-label="Topbar"
      className="h-14 bg-brand-secondary-high flex items-center gap-8 px-6 pl-14 rounded-b-3xl shrink-0 z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-1.5 text-[15px] font-bold text-white tracking-tight">
        <div className="w-[26px] h-[26px] rounded-md bg-brand-primary-500 flex items-center justify-center">
          <Icon name="logo-eye" className="w-3.5 h-3.5 fill-white" />
        </div>
        Lead<span className="text-brand-primary-100">Trust</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-[856px] h-8 bg-white rounded-button flex items-center gap-6 px-3">
        <Icon name="search" className="w-3 h-3 opacity-50 shrink-0" />
        <input
          type="text"
          aria-label="Buscar"
          placeholder="Buscar leads, propiedades, contactos…"
          className="flex-1 bg-transparent text-body-xs text-neutral-grey-600 outline-none"
        />
      </div>

      {/* Right group */}
      <div role="group" aria-label="Acciones del topbar" className="flex items-center gap-6 ml-auto shrink-0">
        <button aria-label="Notificaciones" className="relative w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center">
          <Icon name="bell" />
          {props.notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-brand-primary-500 text-white text-[10px] font-bold min-w-[16px] h-4 rounded-pill flex items-center justify-center px-1">
              {props.notificationCount}
            </span>
          )}
        </button>
        <button aria-label="Añadir" className="w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center">
          <Icon name="plus" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-brand-primary-100 text-brand-primary-700 text-[10px] font-bold flex items-center justify-center">
            {props.userInitials}
          </div>
          <span className="text-body-sm font-bold text-neutral-grey-100 whitespace-nowrap">{props.userName}</span>
        </div>
        <button aria-label="Configuración" className="w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center">
          <Icon name="settings" />
        </button>
        <button aria-label="Ayuda" className="w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center">
          <Icon name="help" />
        </button>
      </div>
    </header>
  );
}
```

### 4.3 `shell/LeftRail.tsx`

```tsx
import Icon, { IconName } from "./Icon";

interface RailItem {
  id: string;        // estable: 'dashboard' | 'queue' | ...
  label: string;     // español, usado como aria-label
  icon: IconName;    // p.ej. 'home', 'queue', 'archive', 'sliders', 'users', 'plug', 'chart', 'gear'
}

const ITEMS: RailItem[] = [
  { id: "dashboard",    label: "Dashboard",     icon: "rail-dashboard" },
  { id: "queue",        label: "Cola de leads", icon: "rail-queue"     },
  { id: "processed",    label: "Procesados",    icon: "rail-check"     },
  { id: "criteria",     label: "Criterios",     icon: "rail-sliders"   },
  { id: "team",         label: "Equipo",        icon: "rail-users"     },
  { id: "integrations", label: "Integraciones", icon: "rail-plug"      },
  { id: "reports",      label: "Reportes",      icon: "rail-report"    },
  { id: "settings",     label: "Config",        icon: "rail-gear"      },
];

interface LeftRailProps {
  activeView: string;
  onSelectView?: (view: string) => void;
  onNewLead?: () => void;
  queueBadgeCount: number;
}

export default function LeftRail({ activeView, onSelectView, onNewLead, queueBadgeCount }: LeftRailProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="w-20 bg-surface-ground shadow-low flex flex-col items-center gap-8 px-6 pt-[140px] pb-6 shrink-0 z-10 overflow-hidden"
    >
      <button
        aria-label="Nuevo lead"
        onClick={() => onNewLead?.()}
        className="w-8 h-8 rounded-chip bg-brand-primary-500 hover:opacity-90 flex items-center justify-center shrink-0 transition-opacity"
      >
        <Icon name="plus" className="w-3.5 h-3.5 stroke-white" />
      </button>

      <div className="flex flex-col gap-2 items-center w-full">
        {ITEMS.map((item) => {
          const active = item.id === activeView;
          return (
            <button
              key={item.id}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              onClick={() => onSelectView?.(item.id)}
              className={
                "relative w-8 h-8 rounded-chip flex items-center justify-center transition-colors " +
                (active
                  ? "bg-brand-primary-500-15 text-brand-primary-500"
                  : "text-neutral-grey-500 hover:bg-neutral-grey-100 hover:text-neutral-grey-800")
              }
            >
              <Icon name={item.icon} />
              {item.id === "queue" && queueBadgeCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-primary-500 text-white text-[9px] font-bold min-w-[14px] h-[14px] rounded-pill flex items-center justify-center px-[3px]">
                  {queueBadgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
```

### 4.4 `shell/RightRail.tsx`

```tsx
const ITEMS = [
  { id: "share",   label: "Compartir",      icon: "rr-share"  },
  { id: "mark",    label: "Marcar",         icon: "rr-mark"   },
  { id: "board",   label: "Tablero",        icon: "rr-board"  },
  { id: "widget",  label: "Añadir widget",  icon: "rr-widget" },
] as const;

export default function RightRail() {
  return (
    <aside
      aria-label="Acciones rápidas"
      className="w-12 bg-surface-ground shadow-left rounded-l-[10px] flex flex-col items-center gap-2 px-2 py-6 mt-6 shrink-0 z-10"
    >
      {ITEMS.map((it) => (
        <button
          key={it.id}
          aria-label={it.label}
          title={it.label}
          className="w-8 h-8 rounded-chip flex items-center justify-center text-neutral-grey-500 hover:bg-neutral-grey-100 hover:text-neutral-grey-800 transition-colors"
        >
          <Icon name={it.icon} />
        </button>
      ))}
    </aside>
  );
}
```

### 4.5 `shell/BottomBar.tsx`

```tsx
interface BottomBarProps {
  analyzedCount: number;
  onExport?: () => void;
  onFilter?: () => void;
  onSort?: () => void;
  onViewList?: () => void;
  onViewCards?: () => void;
}

export default function BottomBar({ analyzedCount, onExport, onFilter, onSort, onViewList, onViewCards }: BottomBarProps) {
  return (
    <div
      aria-label="Barra inferior"
      className="bg-surface-ground shadow-top rounded-t-card h-[72px] flex items-center px-8 gap-6 shrink-0 z-[5]"
    >
      {/* Counter */}
      <div className="flex items-center gap-2">
        <span className="text-title-lg font-bold text-neutral-grey-800 leading-none">{analyzedCount}</span>
        <div className="flex flex-col">
          <span className="text-caption text-neutral-grey-600 leading-tight">leads</span>
          <span className="text-caption text-neutral-grey-600 leading-tight">analizados</span>
        </div>
      </div>

      <div className="w-px h-8 bg-neutral-grey-200 shrink-0" />

      {/* View buttons */}
      <div className="flex items-center gap-0.5 flex-1">
        <button aria-label="Exportar"       title="Exportar"       onClick={() => onExport?.()}    className="bb-btn"><Icon name="bb-export" /></button>
        <button aria-label="Filtrar"        title="Filtrar"        onClick={() => onFilter?.()}    className="bb-btn"><Icon name="bb-filter" /></button>
        <button aria-label="Ordenar"        title="Ordenar"        onClick={() => onSort?.()}      className="bb-btn"><Icon name="bb-sort" /></button>
        <button aria-label="Vista lista"    title="Vista lista"    onClick={() => onViewList?.()}  className="bb-btn"><Icon name="bb-list" /></button>
        <button aria-label="Vista tarjetas" title="Vista tarjetas" onClick={() => onViewCards?.()} className="bb-btn"><Icon name="bb-grid" /></button>
      </div>

      <div className="w-px h-8 bg-neutral-grey-200 shrink-0" />

      {/* Live badge */}
      <div
        role="status"
        className="bg-feedback-green-500-15 text-feedback-green-500 text-[11px] font-semibold px-2.5 py-[3px] rounded-pill flex items-center gap-1.5 ml-auto"
      >
        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-feedback-green-500 animate-pulseDot" />
        En vivo · Analizando leads
      </div>
    </div>
  );
}
```

> Nota: la clase utilitaria `bb-btn` puede declararse como un short
> `@apply` en `styles/globals.css` o bien expandirse inline en cada
> botón (`"w-8 h-8 rounded-button text-neutral-grey-600 hover:bg-neutral-grey-100 hover:text-neutral-grey-800 flex items-center justify-center transition-colors"`).
> El implementer escoge según ergonomía; el spec no fija la forma.

### 4.6 `shell/Icon.tsx`

Helper que centraliza los SVGs inline tomados del HTML target. Firma:

```tsx
export type IconName =
  | "logo-eye" | "search" | "bell" | "plus" | "settings" | "help"
  | "rail-dashboard" | "rail-queue" | "rail-check" | "rail-sliders"
  | "rail-users" | "rail-plug" | "rail-report" | "rail-gear"
  | "rr-share" | "rr-mark" | "rr-board" | "rr-widget"
  | "bb-export" | "bb-filter" | "bb-sort" | "bb-list" | "bb-grid";

interface IconProps {
  name: IconName;
  className?: string;
}

export default function Icon({ name, className }: IconProps) { /* switch sobre name → SVG */ }
```

Cada SVG DEBE provenir, literalmente, del HTML target:

| name              | fuente (línea aprox.) |
|-------------------|------------------------|
| `logo-eye`        | línea 578              |
| `search`          | línea 584              |
| `bell`            | línea 590              |
| `plus`            | líneas 594, 615        |
| `settings`        | línea 601              |
| `help`            | línea 604              |
| `rail-dashboard`  | línea 619              |
| `rail-queue`      | línea 622              |
| `rail-check`      | línea 626              |
| `rail-sliders`    | línea 629              |
| `rail-users`      | línea 632              |
| `rail-plug`       | línea 635              |
| `rail-report`     | línea 638              |
| `rail-gear`       | línea 641              |
| `rr-share`        | línea 917              |
| `rr-mark`         | línea 918              |
| `rr-board`        | línea 919              |
| `rr-widget`       | línea 920              |
| `bb-export`       | línea 903              |
| `bb-filter`       | línea 904              |
| `bb-sort`         | línea 905              |
| `bb-list`         | línea 906              |
| `bb-grid`         | línea 907              |

### 4.7 `tailwind.config.js` (patch)

```js
keyframes: {
  enter: { /* sin cambios */ },
  pulseDot: {
    "0%, 100%": { opacity: "1" },
    "50%":      { opacity: "0.35" },
  },
},
animation: {
  enter: "enter 0.6s ease-out forwards",
  pulseDot: "pulseDot 2s ease-in-out infinite",
},
```

### 4.8 `pages/index.tsx` (patch)

```diff
- import DashboardLayout from "../product/frontend/components/DashboardLayout";
+ import AppShell from "../product/frontend/components/AppShell";
…
-   <DashboardLayout>
+   <AppShell>
       <div className="flex gap-6 h-full">… (intacto) …</div>
-   </DashboardLayout>
+   </AppShell>
```

> `pages/index.tsx` NO recibe en esta feature props para `activeView` /
> `onSelectView` / `onNewLead`: los defaults son suficientes hasta la
> feature 9. `analyzedCount` puede pasar `leads.length` opcionalmente
> (no es requirement bloqueante; ver T8).

### 4.9 `DashboardLayout.tsx` (patch)

```tsx
/**
 * @deprecated Reemplazado por `AppShell` en feature 8 (app_shell_redesign).
 * Se conservará en el repo hasta que la feature 9 (view_router_navigation)
 * elimine sus últimos consumidores y borre este archivo.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) { /* … */ }
```

### 4.10 `tests/frontend/test_app_shell.tsx` (esqueleto)

```tsx
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AppShell from "../../product/frontend/components/AppShell";

describe("AppShell", () => {
  it("R19: renderiza topbar, left rail, right rail, bottom bar y children", () => {
    render(<AppShell><div data-testid="kid" /></AppShell>);
    expect(screen.getByRole("banner")).toBeInTheDocument();           // Topbar
    expect(screen.getByLabelText("Navegación principal")).toBeInTheDocument();
    expect(screen.getByLabelText("Acciones rápidas")).toBeInTheDocument();
    expect(screen.getByLabelText("Barra inferior")).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(within(main).getByTestId("kid")).toBeInTheDocument();
  });

  it("R20: activeView='queue' + queueBadgeCount=7 → aria-current y badge '7'", () => {
    render(<AppShell activeView="queue" queueBadgeCount={7}><span /></AppShell>);
    const item = screen.getByRole("button", { name: "Cola de leads" });
    expect(item).toHaveAttribute("aria-current", "page");
    expect(within(item).getByText("7")).toBeInTheDocument();
  });

  it("R21: analyzedCount=42 → bottom bar muestra '42' y live badge con 'En vivo'", () => {
    render(<AppShell analyzedCount={42}><span /></AppShell>);
    const bb = screen.getByLabelText("Barra inferior");
    expect(within(bb).getByText("42")).toBeInTheDocument();
    expect(within(bb).getByText(/leads/i)).toBeInTheDocument();
    expect(within(bb).getByText(/analizados/i)).toBeInTheDocument();
    const live = screen.getByRole("status");
    expect(live).toHaveTextContent(/En vivo/i);
  });

  it("R22: click en nav item Cola dispara onSelectView('queue')", async () => {
    const onSelectView = jest.fn();
    render(<AppShell onSelectView={onSelectView}><span /></AppShell>);
    await userEvent.click(screen.getByRole("button", { name: "Cola de leads" }));
    expect(onSelectView).toHaveBeenCalledWith("queue");
  });

  it("R22: click en botón 'Nuevo lead' dispara onNewLead", async () => {
    const onNewLead = jest.fn();
    render(<AppShell onNewLead={onNewLead}><span /></AppShell>);
    await userEvent.click(screen.getByRole("button", { name: "Nuevo lead" }));
    expect(onNewLead).toHaveBeenCalledTimes(1);
  });
});
```

## 5. Decisiones técnicas

### 5.1 Subcomponentes en `shell/` vs todo en `AppShell.tsx`

**Decidido**: separar en `shell/Topbar.tsx`, `shell/LeftRail.tsx`,
`shell/RightRail.tsx`, `shell/BottomBar.tsx`, `shell/Icon.tsx`.

- Cada subcomponente es testeable y reescribible aisladamente.
- La feature 9 va a inyectar lógica de routing en `LeftRail` sin tocar
  los otros tres.
- La feature 17 va a tocar `BottomBar` (counter dinámico real).

### 5.2 SVGs inline en `Icon.tsx` vs dependencia externa

**Decidido**: inline. Razones:

- No introduce `lucide-react`/`heroicons` por una feature cosmética.
- Los SVGs del HTML target son específicos (logo "eye", rail-queue
  como 4 cuadrados, rr-board, etc.) y no mapean 1:1 a sets estándar.
- El bundle final es más chico (los SVGs son micro, ~80 bytes c/u).

### 5.3 `activeView`/`onSelectView` como props y no contexto

**Decidido**: props. La feature 9 elevará el estado a un contexto
provider; este spec NO se adelanta a esa decisión arquitectural. Tener
props facilita los tests unitarios del shell.

### 5.4 Animación pulse custom

**Decidido**: declarar `pulseDot` en `tailwind.config.js`. Tailwind ya
trae `animate-pulse` (opacity 1 → 0.5 → 1, 2s, cubic-bezier-in-out),
pero el target Tokko exige `1 → 0.35 → 1` con curva ease-in-out
explícita. Re-mapear `animate-pulse` rompería el resto del repo si
mañana alguien lo usa. `animate-pulseDot` es aditivo y explícito.

### 5.5 `DashboardLayout` deprecated, no removido

**Decidido**: mantenerlo con JSDoc `@deprecated`. Removerlo en esta
feature obligaría a actualizar todos los imports en un solo commit y
mezclaría dos refactors (shell + navegación). Feature 9 lo eliminará
cuando todos los consumidores migren.

### 5.6 BottomBar dentro de `<main>` (no a lo ancho)

**Decidido**: replicar la jerarquía del HTML target. El `BottomBar`
vive adentro del content area, no a lo ancho del viewport, para que el
`RightRail` se extienda visualmente desde el topbar hasta el fondo del
viewport. Esto es importante para preservar las sombras (`shadow-top`
del bottom bar, `shadow-left` del right rail) coincidentes con el
target.

### 5.7 Tests con RTL + jsdom

Como Tailwind/PostCSS no corren en jest, los tests verifican
**estructura semántica** (roles, aria-labels, aria-current, texto) y
**comportamiento** (callbacks). No verifican estilos resueltos (eso lo
hace ya `test_design_tokens.tsx` para la cadena de resolución de
tokens). Esta es la frontera correcta: el shell se testea por
contrato, no por píxel.

## 6. Alternativas descartadas

### 6.1 Refactorizar `DashboardLayout.tsx` in-place (sin archivo nuevo)

**Descartada.** Renombrar al mismo archivo a `AppShell` (o
sobrescribir su contenido) introduce ruido en el diff y dificulta el
review. La feature 8 prefiere un archivo nuevo limpio y deja el viejo
visible como `@deprecated`.

### 6.2 Introducir `lucide-react` para los iconos

**Descartada.** Añade una dep nueva (~150 KB minified) por una feature
puramente visual. Los SVGs del target son pequeños, estables y
copiables 1:1. Cuando el catálogo de iconos crezca (feature 17), se
puede revisitar la decisión.

### 6.3 Contexto `ShellContext` ya en esta feature

**Descartada.** Crear un `ShellProvider` y refactorizar
`pages/index.tsx` para consumirlo extiende el blast radius de la
feature 8. La feature 9 (`view_router_navigation`) está específicamente
asignada a esa decisión.

### 6.4 Reusar `animate-pulse` default de Tailwind

**Descartada.** No coincide con la curva del target Tokko (1 → 0.5 vs
1 → 0.35) y no es trivialmente reconfigurable sin pisar el default
global de Tailwind para otros consumidores futuros.

### 6.5 Pasar `analyzedCount={leads.length}` ya desde `pages/index.tsx`

**Diferido.** No es requirement bloqueante de esta feature; la feature
11 (`dashboard_kpis_and_charts`) ya derivará counters reales. Si el
implementer ve trivial pasar `leads.length`, puede hacerlo (T8
opcional). Mientras tanto el bottom bar muestra `0 leads analizados`,
consistente con el copy "vacío" del HTML target.

## 7. Trazabilidad (esbozo, completa la fija el implementer)

| Requirement | Verificación esperada                                                  |
|-------------|-------------------------------------------------------------------------|
| R1, R14     | Inspección de `AppShell.tsx` + `test_app_shell.tsx` "R19".              |
| R2          | Inspección de `shell/Topbar.tsx` + `test_app_shell.tsx` "R19".          |
| R3, R7      | Inspección de `shell/LeftRail.tsx` + `test_app_shell.tsx` "R20".        |
| R4          | Inspección de `shell/RightRail.tsx` + `test_app_shell.tsx` "R19".       |
| R5, R6, R13 | Inspección de `shell/BottomBar.tsx` + `test_app_shell.tsx` "R21".       |
| R8, R9      | `test_app_shell.tsx` "R20" (con count=7) + caso adicional con count=0.  |
| R10, R11    | `test_app_shell.tsx` "R22" (dos sub-tests).                             |
| R12         | Inspección de `shell/BottomBar.tsx` (firmas opcionales).                |
| R15         | Inspección de `AppShell`, `shell/*.tsx`. (Sin hex literal de paleta.)   |
| R16         | Inspección de `tailwind.config.js` (`pulseDot` declarado).              |
| R17         | Inspección de `pages/index.tsx` (sustituye `DashboardLayout`).          |
| R18         | Inspección de `DashboardLayout.tsx` (JSDoc `@deprecated`).              |
| R19–R22     | Cobertos en `test_app_shell.tsx` (5 sub-tests).                         |
| R23         | `npx jest --selectProjects frontend` en CI.                             |
| R24         | `npx tsc --noEmit` (o `npx next build`) sin errores nuevos.             |
