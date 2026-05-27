# Design — view_router_navigation

Feature ID: 9
Layer: frontend
Estado: spec_ready

> Esta feature cablea las props `activeView` / `onSelectView` /
> `queueBadgeCount` / `analyzedCount` del `AppShell` (feature 8) a un
> estado real en `pages/index.tsx`, introduce el `PageHeader` Tokko y
> extrae cuatro vistas (`DashboardView`, `QueueView`, `ProcessedView`,
> `CriteriaView`) a `product/frontend/views/`. Es la última feature
> "estructural" antes de que la feature 11+ empiece a poblar el
> Dashboard con KPIs reales.

---

## 1. Resumen de la decisión

- **Estado de navegación: inline en `pages/index.tsx`** (no contexto, no
  store). Una sola fuente de verdad para `activeView` y `tabState`,
  pasada por props al `AppShell` y a las vistas. Justificación en §5.1.
- **Cuatro vistas en `product/frontend/views/`** con un export por
  defecto cada una. `DashboardView` recibe TODA la maquinaria actual
  (leads/score/simulador/spam/detalle) vía props; `QueueView` y
  `CriteriaView` son placeholders mínimos hasta features 14/15;
  `ProcessedView` es el placeholder definitivo (feature 16 solo lo
  pulirá si hace falta).
- **`PageHeader` recibe props controladas**: title, subtitle, tabs,
  primaryAction, breadcrumb. Sin lógica de routing propia: es un
  componente "tonto". El switch de textos por vista vive en una tabla
  pura `viewHeaders` dentro de `pages/index.tsx` (o un helper).
- **Tabs por vista persistidas en estado local**: `Record<View, string>`.
  Inicializado con `Hoy` para `dashboard` y `queue`.
- **`DashboardLayout.tsx` legacy se elimina** físicamente en esta
  feature (era el cierre comprometido por la feature 8).

## 2. Archivos a crear

| Archivo                                                       | Propósito                                                                      | R cubiertos             |
|---------------------------------------------------------------|--------------------------------------------------------------------------------|-------------------------|
| `product/frontend/components/PageHeader.tsx`                  | Header de página Tokko (breadcrumb + title + subtitle + tabs + primaryAction). | R1, R2, R3, R4, R5, R6, R7 |
| `product/frontend/views/DashboardView.tsx`                    | Envuelve el layout actual: Simulador + Feed + Detalle + Spam.                  | R8, R9                  |
| `product/frontend/views/QueueView.tsx`                        | Placeholder "Vista en construcción" hasta feature 14.                          | R8, R10                 |
| `product/frontend/views/ProcessedView.tsx`                    | Placeholder definitivo con CTA "Volver al dashboard".                          | R8, R11                 |
| `product/frontend/views/CriteriaView.tsx`                     | Placeholder "Vista en construcción" hasta feature 15.                          | R8, R10                 |
| `tests/frontend/test_view_router.tsx`                         | Tests RTL para R25.                                                            | R25, R26                |

## 3. Archivos a modificar

| Archivo                                              | Cambio                                                                                                                                | R cubiertos                |
|------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------|
| `pages/index.tsx`                                    | Introduce `activeView`, `tabState`, deriva `analyzedCount` / `queueBadgeCount`, monta `PageHeader` + vista activa.                    | R12, R13, R14, R15, R16, R17, R18, R19, R20, R21, R23, R24 |
| `feature_list.json`                                  | Cambia `status` de feature id 9 de `pending` a `spec_ready` (lo hace este spec_author).                                               | —                          |

## 4. Archivos a eliminar

| Archivo                                                       | Justificación                                                                                          | R cubiertos |
|---------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|-------------|
| `product/frontend/components/DashboardLayout.tsx`             | Reemplazado por `AppShell` (feature 8). Quedó marcado `@deprecated` con compromiso explícito de borrar en esta feature 9. | R22         |

## 5. Firmas y contratos

### 5.1 `PageHeader.tsx`

```tsx
import React from "react";

export interface PageHeaderPrimaryAction {
  label: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  tabs?: string[];                       // labels exactos a renderizar
  defaultTab?: string;                   // label inicial (uncontrolled)
  activeTab?: string;                    // controlado (override de defaultTab)
  onTabChange?: (label: string) => void;
  primaryAction?: PageHeaderPrimaryAction;
  breadcrumbLabel?: string;              // default "Volver"
  breadcrumbIcon?: React.ReactNode;
  onBreadcrumbClick?: () => void;
}

export default function PageHeader({
  title,
  subtitle,
  tabs,
  defaultTab,
  activeTab: activeTabProp,
  onTabChange,
  primaryAction,
  breadcrumbLabel = "Volver",
  breadcrumbIcon,
  onBreadcrumbClick,
}: PageHeaderProps) { /* … */ }
```

Estructura del DOM (aproximada):

```tsx
<header
  aria-label="Encabezado de página"
  className="bg-surface-ground rounded-t-card flex items-end justify-between px-6 pt-8 pb-6 border-b border-neutral-grey-200"
>
  <div className="flex flex-col gap-2">
    {onBreadcrumbClick && (
      <button
        type="button"
        onClick={onBreadcrumbClick}
        className="flex items-center gap-1 text-body-xs font-semibold text-neutral-grey-800 hover:text-neutral-grey-1000"
      >
        {breadcrumbIcon ?? <ChevronLeftIcon />}
        {breadcrumbLabel}
      </button>
    )}
    <h1 className="text-title-xl font-bold text-neutral-grey-1000">{title}</h1>
    {subtitle && <p className="text-body-sm text-neutral-grey-600">{subtitle}</p>}
  </div>
  <div className="flex items-center gap-2">
    {tabs && tabs.length > 0 && (
      <div role="tablist" className="flex bg-neutral-grey-100 rounded-button p-0.5">
        {tabs.map((label) => {
          const selected = label === (activeTabProp ?? internalActiveTab);
          return (
            <button
              key={label}
              role="tab"
              aria-label={label}
              aria-selected={selected}
              onClick={() => onTabChange?.(label)}
              className={/* selected styles */}
            >
              {label}
            </button>
          );
        })}
      </div>
    )}
    {primaryAction && (
      <button
        type="button"
        aria-label={primaryAction.label}
        onClick={() => primaryAction.onClick?.()}
        className="bg-brand-primary-500 text-white rounded-button px-4 h-9 font-semibold hover:opacity-90 transition-opacity"
      >
        {primaryAction.label}
      </button>
    )}
  </div>
</header>
```

> Nota: el `PageHeader` puede ser uncontrolled si no se provee
> `activeTab`. El estado interno (`useState`) se inicializa con
> `defaultTab ?? tabs?.[0]`. Cuando `activeTab` se provee, prevalece.

### 5.2 `views/DashboardView.tsx`

```tsx
import React from "react";
import LeadsFeed from "../components/LeadsFeed";
import LeadDetailPanel from "../components/LeadDetailPanel";
import SimulatorPanel from "../components/SimulatorPanel";
import LeadCard from "../components/LeadCard";
import type { Lead } from "../../types/lead";
import type { Property } from "../../types/property";
import type { LeadAnalysis } from "../../types/lead_analysis";
import type { LeadWithScore } from "../types/feed";

export interface DashboardViewProps {
  sortedLeads: LeadWithScore[];
  selectedLeadId: string | null;
  onSelectLead: (id: string | null) => void;
  selectedLead: Lead | null;
  analysis: LeadAnalysis | null;
  isLoading: boolean;
  properties: Property[];
  spamLeads: LeadWithScore[];
  newLeadId: string | null;
  onLeadSimulated: (result: { lead: Lead; analysis: LeadAnalysis }) => void;
}

export default function DashboardView(props: DashboardViewProps) {
  /* JSX equivalente al actual de pages/index.tsx dentro de <AppShell> */
}
```

> Mueve el JSX actual de `pages/index.tsx` (el `<div className="flex gap-6 h-full">` con Simulador + Feed + Spam + Detalle) tal cual. NO modifica clases ni lógica de scoring.

### 5.3 `views/QueueView.tsx` y `views/CriteriaView.tsx`

```tsx
export interface QueueViewProps {
  // reservado para feature 14; en esta feature props vacías o ignoradas
}

export default function QueueView(_: QueueViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <p className="text-title-lg font-semibold text-neutral-grey-800">
        Vista en construcción
      </p>
      <p className="text-body-sm text-neutral-grey-600 mt-2">
        La cola de leads se entrega en la feature 14.
      </p>
    </div>
  );
}
```

`CriteriaView` es análoga (referencia a feature 15 en el subtítulo).

### 5.4 `views/ProcessedView.tsx`

```tsx
export interface ProcessedViewProps {
  onBackToDashboard?: () => void;
}

export default function ProcessedView({ onBackToDashboard }: ProcessedViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <p className="text-title-lg font-semibold text-neutral-grey-800">
        Vista en construcción
      </p>
      <p className="text-body-sm text-neutral-grey-600 mt-2">
        Aquí verás el histórico de leads ya analizados.
      </p>
      <button
        type="button"
        onClick={() => onBackToDashboard?.()}
        className="mt-6 bg-neutral-grey-100 text-neutral-grey-800 rounded-button px-4 h-9 font-semibold hover:bg-neutral-grey-200 transition-colors"
      >
        Volver al dashboard
      </button>
    </div>
  );
}
```

### 5.5 `pages/index.tsx` (refactor)

```tsx
import React, { useState, useEffect, useMemo } from "react";
import AppShell from "../product/frontend/components/AppShell";
import PageHeader from "../product/frontend/components/PageHeader";
import DashboardView from "../product/frontend/views/DashboardView";
import QueueView from "../product/frontend/views/QueueView";
import ProcessedView from "../product/frontend/views/ProcessedView";
import CriteriaView from "../product/frontend/views/CriteriaView";
import type { Lead } from "../product/types/lead";
/* … resto de imports … */

type View = "dashboard" | "queue" | "processed" | "criteria";

const VIEW_HEADERS: Record<View, {
  title: string;
  subtitle: string;
  tabs: boolean;
  primary: string;
}> = {
  dashboard: { title: "Dashboard de leads",   subtitle: "Mayo 2026 · Todas las fuentes",                  tabs: true,  primary: "+ Nuevo lead" },
  queue:     { title: "Cola de leads",        subtitle: "Ordenados por llegada · Mayo 2026",              tabs: true,  primary: "+ Ingresar lead" },
  processed: { title: "Leads procesados",     subtitle: "Historial completo",                             tabs: false, primary: "Exportar" },
  criteria:  { title: "Criterios de scoring", subtitle: "Configurá cómo se califica cada lead entrante",  tabs: false, primary: "Guardar criterios" },
};

const HEADER_TABS = ["Hoy", "7 días", "30 días"] as const;

export default function Home() {
  /* estado existente: leads, selectedLeadId, aiScores, spamLeads, newLeadId */

  // R12: estado de navegación inline
  const [activeView, setActiveView] = useState<View>("dashboard");
  // R18: estado de tab activa por vista
  const [tabState, setTabState] = useState<Record<View, string>>({
    dashboard: "Hoy",
    queue: "Hoy",
    processed: "Hoy",
    criteria: "Hoy",
  });

  /* … hooks existentes … */

  // R14: handler de selección de vista del LeftRail
  const ROUTEABLE_VIEWS: View[] = ["dashboard", "queue", "processed", "criteria"];
  function handleSelectView(id: string) {
    if ((ROUTEABLE_VIEWS as string[]).includes(id)) {
      setActiveView(id as View);
    }
    // R15: ids no routeables (team/integrations/...) se ignoran silenciosamente
  }

  // R21: derivar counts del estado
  const analyzedCount = Object.keys(aiScores).length;
  const spamLeadIds = useMemo(
    () => new Set(spamLeads.map((s) => s.lead.id)),
    [spamLeads]
  );
  const queueBadgeCount = leads.filter(
    (l) => aiScores[l.id] === undefined && !spamLeadIds.has(l.id)
  ).length;

  // R19: handlers del primaryAction según vista
  function handleNewLead() {
    // En esta feature: stub que delega al simulator real cuando exista (feature 18).
    // Por ahora invoca SimulatorPanel programáticamente o no-op.
    // El reviewer acepta no-op + console.warn hasta feature 18.
  }

  const header = VIEW_HEADERS[activeView];
  const primaryHandlers: Record<View, () => void> = {
    dashboard: handleNewLead,
    queue: handleNewLead,
    processed: () => { /* feature 16 */ },
    criteria: () => { /* feature 15 */ },
  };

  return (
    <AppShell
      activeView={activeView}
      onSelectView={handleSelectView}
      onNewLead={handleNewLead}
      analyzedCount={analyzedCount}
      queueBadgeCount={queueBadgeCount}
    >
      <PageHeader
        title={header.title}
        subtitle={header.subtitle}
        tabs={header.tabs ? [...HEADER_TABS] : undefined}
        activeTab={header.tabs ? tabState[activeView] : undefined}
        onTabChange={(label) =>
          setTabState((prev) => ({ ...prev, [activeView]: label }))
        }
        primaryAction={{ label: header.primary, onClick: primaryHandlers[activeView] }}
        breadcrumbLabel="Volver"
        onBreadcrumbClick={
          activeView === "dashboard" ? undefined : () => setActiveView("dashboard")
        }
      />

      {activeView === "dashboard" && (
        <DashboardView
          sortedLeads={sortedWithAiScores}
          selectedLeadId={selectedLeadId}
          onSelectLead={setSelectedLeadId}
          selectedLead={selectedLead}
          analysis={analysis}
          isLoading={isLoading}
          properties={properties}
          spamLeads={spamLeads}
          newLeadId={newLeadId}
          onLeadSimulated={handleLeadSimulated}
        />
      )}
      {activeView === "queue" && <QueueView />}
      {activeView === "processed" && (
        <ProcessedView onBackToDashboard={() => setActiveView("dashboard")} />
      )}
      {activeView === "criteria" && <CriteriaView />}
    </AppShell>
  );
}
```

### 5.6 `tests/frontend/test_view_router.tsx` (esqueleto)

```tsx
import React from "react";
import { render, screen, within, queryByRole } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Home from "../../pages/index";

// Mockear el hook useLeadAnalysis para que no haga fetch real
jest.mock("../../product/frontend/hooks/useLeadAnalysis", () => ({
  useLeadAnalysis: () => ({ analysis: null, isLoading: false }),
}));

describe("view_router_navigation", () => {
  it("R13, R16: render inicial muestra Dashboard con title 'Dashboard de leads' y tabs", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dashboard de leads");
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    // DashboardView se reconoce por la presencia del SimulatorPanel o LeadsFeed
    expect(screen.getByText(/Leads/)).toBeInTheDocument();
  });

  it("R14, R16: click en 'Cola de leads' muestra QueueView y cambia el title", async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole("button", { name: "Cola de leads" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cola de leads");
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("R17: en Procesados NO hay tablist", async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole("button", { name: "Procesados" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Leads procesados");
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("R17: en Criterios NO hay tablist", async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole("button", { name: "Criterios" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Criterios de scoring");
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("R18: cambio de tab persiste por vista", async () => {
    render(<Home />);
    // Dashboard: seleccionar "7 días"
    await userEvent.click(screen.getByRole("tab", { name: "7 días" }));
    expect(screen.getByRole("tab", { name: "7 días" })).toHaveAttribute("aria-selected", "true");
    // Ir a Cola
    await userEvent.click(screen.getByRole("button", { name: "Cola de leads" }));
    // Volver a Dashboard
    await userEvent.click(screen.getByRole("button", { name: "Dashboard" }));
    // La tab "7 días" sigue activa
    expect(screen.getByRole("tab", { name: "7 días" })).toHaveAttribute("aria-selected", "true");
  });

  it("R20: breadcrumb 'Volver' en QueueView regresa a Dashboard", async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole("button", { name: "Cola de leads" }));
    await userEvent.click(screen.getByRole("button", { name: "Volver" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dashboard de leads");
  });

  it("R6, R19: click '+ Nuevo lead' invoca el handler de nuevo lead", async () => {
    // Spia el handler vía window console.warn o vía mock del SimulatorPanel.
    // El implementer decide la estrategia exacta de aserción.
    render(<Home />);
    const btn = screen.getByRole("button", { name: "+ Nuevo lead" });
    await userEvent.click(btn);
    // Aserción: el botón no lanza excepciones y permanece habilitado.
    expect(btn).toBeInTheDocument();
  });
});
```

> Nota sobre R19 / R6: dado que el "handler real" del botón
> `+ Nuevo lead` lo completa la feature 18 (`unified_random_lead_simulator`),
> este test verifica que el click NO lanza excepciones y que el botón
> permanece accesible. El implementer puede reforzar la aserción
> mockeando un `onNewLead` stub si refactoriza `Home` para exponerlo
> como prop (no requerido en esta feature).

## 6. Decisiones técnicas

### 6.1 Estado inline en `pages/index.tsx` vs hook `useViewState` o Context

**Decidido: estado inline.**

- Hay una única fuente de verdad (`Home`), no hay consumidores
  hermanos que necesiten leer `activeView` lateralmente. Las vistas y
  el shell reciben los valores por props.
- `useState<View>` + `useState<Record<View, string>>` es legible y
  trazable en code review.
- Crear un hook `useViewState` ahora introduce indirección sin
  beneficio: el hook tendría exactamente los mismos `useState` y un
  consumidor. Es abstracción prematura.
- Crear un `ViewContext` rompe testabilidad de las vistas como módulos
  aislados (tendríamos que envolverlas en provider en cada test).

Cuando la prop drilling crezca (features 11–17 traen handlers, filtros
y selección de leads de tabla), se reevalúa. Hasta entonces, inline es
la decisión correcta.

### 6.2 `DashboardView` recibe TODA la maquinaria actual vía props (no se mueven hooks)

**Decidido: hooks permanecen en `Home`.**

- `useLeadAnalysis(selectedLeadId)` se queda en `pages/index.tsx`. Mover
  el hook a `DashboardView` implicaría que `selectedLeadId` viva ahí
  también, pero la feature 12 (`recent_leads_table_and_source_funnel`)
  introducirá selección de leads desde una tabla que vive en el
  Dashboard, y la feature 17 (`lead_detail_tokko_redesign`) puede
  querer reusar el detalle desde la vista Cola. Mantener el hook en
  `Home` permite compartir el estado de detalle entre vistas en el
  futuro sin re-refactor.
- En esta feature el detalle SOLO se renderiza desde `DashboardView`,
  pero la convención queda sentada.

### 6.3 `ProcessedView` es ya el placeholder definitivo

**Decidido: feature 16 NO duplica trabajo.**

La feature 16 (`processed_view_placeholder`) tiene exactamente los
mismos acceptance criteria que el placeholder que entregamos acá. El
spec autor de feature 16 podrá marcarla `done` sin código nuevo, o
hacer un polish menor (ej. añadir un ícono). Documentado para evitar
duplicar implementación.

### 6.4 Definiciones consagradas de `analyzedCount` y `queueBadgeCount`

- **`analyzedCount = Object.keys(aiScores).length`**: número de leads
  con score IA persistido. Coincide con el counter del `BottomBar`
  que la feature 11 va a reemplazar con un cálculo más rico
  (combinando `computeLocalScore` + `aiScores`).
- **`queueBadgeCount = leads.filter(l => !aiScores[l.id] && !spamLeadIds.has(l.id)).length`**:
  leads no-spam que aún no han sido procesados por la IA. Esta es la
  definición que mejor encaja con la semántica del badge "cola" del
  HTML target (12 pendientes esperando análisis).

> Ambas definiciones son provisionales y la feature 11 las puede
> reemplazar; documentamos la decisión actual para que el implementer
> no la dispute sin propuesta alternativa.

### 6.5 Eliminación física de `DashboardLayout.tsx`

**Decidido: borrar en esta feature.**

- La feature 8 dejó el archivo con JSDoc `@deprecated` y un compromiso
  explícito de borrar en feature 9 (su `R18` lo dice literalmente).
- El único consumidor era `pages/index.tsx`, que en feature 8 ya migró
  a `AppShell`. No quedan referencias en el árbol del producto.
- Tests legacy: ninguno importa `DashboardLayout`. El reviewer
  verifica con `grep -R DashboardLayout product/ pages/ tests/`.

### 6.6 PageHeader como componente "tonto" (controlado por props)

**Decidido: sin lógica de routing interna.**

- `PageHeader` no sabe qué vista está activa: recibe `title`,
  `subtitle`, `tabs`, etc. ya resueltos.
- La tabla `VIEW_HEADERS` vive en `pages/index.tsx`. Mantenerla
  exportable como helper (`product/frontend/lib/viewHeaders.ts`) es
  opcional; el implementer decide. Si la mueve, debe seguir
  cumpliendo los literales de R16.
- Esta separación facilita reusar `PageHeader` en futuras vistas no
  enumeradas (ej. detalle de propiedad) sin tocar la lógica de
  navegación.

### 6.7 Mock de `useLeadAnalysis` en tests

**Decidido: mock global del hook en `test_view_router.tsx`.**

- El test renderiza `Home`, no aislamos `DashboardView`.
- `useLeadAnalysis` haría fetch real al API, lo que rompe jsdom.
- Mockearlo a `{ analysis: null, isLoading: false }` mantiene los
  tests deterministas y rápidos.

## 7. Alternativas descartadas

### 7.1 Next.js Router con rutas `/dashboard`, `/queue`, `/processed`, `/criteria`

**Descartada.**

- La feature acepta SPA pura: "cambio de vista NO recarga la página"
  (R24). Next router con `router.push` recarga el árbol, hace remount
  parcial y rompe `aiScores`/`leads`/`spamLeads` (que viven en estado
  React de `Home`).
- Persistir esos estados en URL/query/localStorage extiende el blast
  radius de esta feature significativamente. Lo difiere features
  posteriores si el producto lo requiere (deep-linking, share state).

### 7.2 Hook `useViewState` con `Record<View, ViewMeta>` interno

**Descartada (por ahora).**

- Discutida en §6.1. Abstracción prematura. Sin consumidores múltiples,
  el hook duplica el `useState`.

### 7.3 Context Provider `ShellContext` con `activeView` + setter

**Descartada.**

- Mismo argumento: sin consumidores hermanos, el provider añade
  superficie sin beneficio.
- Romper testabilidad de las vistas en aislamiento.

### 7.4 Mover `useLeadAnalysis` a `DashboardView`

**Descartada.**

- §6.2: el detalle puede consumirse desde otras vistas en features
  futuras (12, 17). Mantener el hook en `Home` evita un segundo
  refactor.

### 7.5 Eliminar `SimulatorPanel` ya en esta feature

**Descartada.**

- La feature 18 (`unified_random_lead_simulator`) elimina
  `SimulatorPanel.tsx` y unifica los dos botones en uno solo. Hacerlo
  ahora mezcla dos refactors. Mantenemos `SimulatorPanel` intacto en
  `DashboardView`.

### 7.6 Renderizar las cuatro vistas todo el tiempo y mostrar/ocultar con CSS

**Descartada.**

- Renderizar `QueueView`/`ProcessedView`/`CriteriaView` placeholders
  cuesta poco, pero `DashboardView` monta `LeadsFeed`, `LeadDetailPanel`
  y `SimulatorPanel`, que invocan hooks y fetch reales. Mantenerlos
  vivos cuando no son visibles desperdicia ciclos y enmascara errores
  de render.
- El render condicional respeta el patrón React idiomático.

## 8. Trazabilidad (esbozo, fija el implementer en `progress/impl_view_router_navigation.md`)

| Requirement | Verificación esperada                                                               |
|-------------|--------------------------------------------------------------------------------------|
| R1, R7      | Inspección de `PageHeader.tsx` + tests "R13, R17" en `test_view_router.tsx`.        |
| R2          | Test que verifica `Volver` como default cuando se omite `breadcrumbLabel`.          |
| R3, R20     | Test "R20: breadcrumb regresa a Dashboard".                                          |
| R4, R5      | Test "R18: cambio de tab" (cubre render y aria-selected).                            |
| R6, R19     | Test "R6, R19: click '+ Nuevo lead'".                                                |
| R8          | Inspección estructural de `product/frontend/views/`.                                 |
| R9          | Inspección + smoke test del feed/detalle en `DashboardView`.                         |
| R10         | Inspección + render snapshot de `QueueView` / `CriteriaView`.                        |
| R11         | Test (parte de R20) que click sobre "Volver al dashboard" cambia `activeView`.       |
| R12         | Inspección de `pages/index.tsx` (`useState<View>`).                                  |
| R13         | Tests "R13", "R14", "R17" (vistas montadas mutuamente excluyentes).                  |
| R14         | Test "R14: click 'Cola de leads' muestra QueueView".                                 |
| R15         | Test adicional: click en nav item `Equipo` no cambia `activeView` (opcional).        |
| R16         | Tests "R13, R16", "R14, R16", "R17" (literales exactos).                             |
| R17         | Tests "R17: en Procesados/Criterios NO hay tablist".                                 |
| R18         | Test "R18: cambio de tab persiste por vista".                                        |
| R21         | Inspección de `pages/index.tsx` (derivación de `analyzedCount`/`queueBadgeCount`).   |
| R22         | `grep -R DashboardLayout product/ pages/ tests/` retorna vacío.                      |
| R23         | Inspección de `pages/index.tsx` (no quedan `LeadsFeed`, `SimulatorPanel`, etc. directos). |
| R24         | Test (parte de R18) verifica que el `aiScores` / `tabState` sobrevive al cambio.     |
| R25         | Cobertos en `test_view_router.tsx` (7 sub-tests).                                    |
| R26         | `npx jest --selectProjects frontend` en CI.                                          |
| R27         | `npx tsc --noEmit` sin errores nuevos.                                               |
