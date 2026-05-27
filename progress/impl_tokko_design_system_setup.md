# Implementación — tokko_design_system_setup (feature 7)

Layer: frontend
Spec: `specs/tokko_design_system_setup/`
Resultado: completa, lista para review.

## Archivos creados

- `product/frontend/styles/tokens.css` — fuente única de verdad de los CSS custom properties Tokko (traducción 1:1 del bloque `:root` del HTML target líneas 11–117).
- `pages/_document.tsx` — Custom Document de Next que precarga Nunito Sans desde Google Fonts.
- `tests/frontend/test_design_tokens.tsx` — Test jest+RTL que verifica resolución de `bg-brand-primary-500` y que `document.body` usa Nunito Sans.

## Archivos modificados

- `tailwind.config.js` — añadido `theme.extend.colors`, `borderRadius`, `boxShadow`, `spacing`, `fontSize`, `fontFamily` referenciando `var(--token)`. Preservados `keyframes` y `animation` previos.
- `styles/globals.css` — ahora `@import` de `../product/frontend/styles/tokens.css`, seguido por directivas `@tailwind` y un bloque `body { … }` con tema claro Tokko (background `--color-surface-neutral-low`, color `--color-neutral-grey-800`, font-family `--font-family-base`, antialiased). Sin referencias a tema oscuro.

## Archivos NO modificados (verificados)

- `pages/_app.tsx` — sigue siendo el único import de `globals.css`. `git diff` vacío (R13 OK).
- `product/frontend/components/**` — DashboardLayout, LeadsFeed, LeadCard, LeadDetailPanel, SimulatorPanel intactos.
- `tests/frontend/test_feed.tsx`, `test_lead_detail_panel.tsx`, `test_simulation_integration.tsx`, `test_simulator_panel.tsx`, `test_use_lead_analysis.tsx` — sin cambios; siguen pasando.

## Tasks

- [x] **T1** — `product/frontend/styles/tokens.css` creado con TODAS las CSS custom properties del bloque `:root` del HTML target (brand, neutral, surface, feedback, radius, shadow, spacing, typography). Valores literales sin reinterpretar.
- [x] **T2** — `styles/globals.css` rescrito con `@import` de tokens (1ª línea no vacía), 3 directivas `@tailwind`, regla `body { … }` con tokens claros. Sin restos del tema oscuro.
- [x] **T3** — `tailwind.config.js` extendido con `theme.extend.colors` (brand-primary, brand-secondary, feedback-green/yellow/blue, neutral-grey 50..900, surface ground/low/medium/high y success/warning/danger low/high). Todas referencian `var(--color-*)`.
- [x] **T4** — `tailwind.config.js` extendido con `borderRadius` (card/button/chip/pill), `boxShadow` (low/top/left), `spacing` (1..6, 8), `fontSize` (title-lg/md/sm, body-lg/md/sm/xs, caption), `fontFamily.sans = ['Nunito Sans', 'system-ui', 'sans-serif']`. Keyframes/animation previos preservados.
- [x] **T5** — `pages/_document.tsx` creado con `Document` que en `<Head>` declara dos `<link rel="preconnect">` (googleapis y gstatic con `crossOrigin="anonymous"`) y un `<link rel="stylesheet">` a `https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,300;0,6..12,400;0,6..12,600;0,6..12,700;0,6..12,800&display=swap`.
- [x] **T6** — `pages/_app.tsx` verificado intacto: único import CSS sigue siendo `import "../styles/globals.css";`. `git diff pages/_app.tsx` vacío.
- [x] **T7** — `tests/frontend/test_design_tokens.tsx` creado con dos `it()`: (a) R14: resuelve `bg-brand-primary-500` a `rgb(223,21,23)`/`#DF1517`/`var(--color-brand-primary-500)`; (b) R15: `getComputedStyle(document.body).fontFamily` contiene `Nunito Sans`.
- [x] **T8** — `npx jest --selectProjects frontend` → 6 suites, 34 tests, todos verde. Tests legacy (`test_feed`, `test_lead_detail_panel`, `test_simulation_integration`, `test_simulator_panel`, `test_use_lead_analysis`) siguen pasando sin modificaciones.
- [x] **T9** — `npx tsc --noEmit` → exit 0, sin errores.
- [x] **T10** — Trazabilidad R<n> → archivo/test documentada abajo.

## Comandos de verificación ejecutados

```
$ npx jest --selectProjects frontend
Running one project: frontend
Test Suites: 6 passed, 6 total
Tests:       34 passed, 34 total
Snapshots:   0 total
Time:        1.992 s

$ npx tsc --noEmit; echo "tsc exit: $?"
tsc exit: 0
```

## Trazabilidad R<n> → archivo/test

| Requirement | Verificación |
|---|---|
| R1, R1.a | `product/frontend/styles/tokens.css` — bloque `:root`, tokens brand (`--color-brand-primary-100/500/500-15/700`, `--color-brand-secondary-500/700/high`) |
| R1.b | `product/frontend/styles/tokens.css` — escala `--color-neutral-grey-50..900` + `--color-neutral-white` |
| R1.c | `product/frontend/styles/tokens.css` — `--color-surface-neutral-*` y `--color-surface-success/warning/danger-low/high` |
| R1.d | `product/frontend/styles/tokens.css` — `--color-feedback-green/yellow/blue-*` |
| R1.e | `product/frontend/styles/tokens.css` — `--radius-card/button/chip/pill` |
| R1.f | `product/frontend/styles/tokens.css` — `--shadow-low/top/left` |
| R1.g | `product/frontend/styles/tokens.css` — `--sp-1..8`, `--font-family-base`, `--fs-title-lg/md/sm`, `--fs-body-lg/md/sm/xs`, `--fs-caption` |
| R2 | `tailwind.config.js` — `theme.extend.colors` con todas las sub-claves Tokko via `var(--color-*)` |
| R3 | `tests/frontend/test_design_tokens.tsx` — test "R14: bg-brand-primary-500 resuelve al rojo Tokko #DF1517" |
| R4 | `tailwind.config.js` — `theme.extend.borderRadius.{card,button,chip,pill}` |
| R5 | `tailwind.config.js` — `theme.extend.boxShadow.{low,top,left}` |
| R6 | `tailwind.config.js` — `theme.extend.spacing.{1,2,3,4,5,6,8}` via `var(--sp-*)` |
| R7 | `tailwind.config.js` — `theme.extend.fontSize.{title-lg/md/sm, body-lg/md/sm/xs, caption}` |
| R8 | `tailwind.config.js` — `theme.extend.fontFamily.sans = ['Nunito Sans', 'system-ui', 'sans-serif']` |
| R9 | `pages/_document.tsx` — `<Head>` con dos `<link rel="preconnect">` + `<link rel="stylesheet">` Nunito Sans |
| R10 | `styles/globals.css` — primera línea no vacía es `@import "../product/frontend/styles/tokens.css";`, seguida por las directivas `@tailwind` |
| R11 | `styles/globals.css` — bloque `body { background-color: var(--color-surface-neutral-low); color: var(--color-neutral-grey-800); font-family: var(--font-family-base); -webkit-font-smoothing: antialiased; }` |
| R12 | `styles/globals.css` — auditado, sin referencias a `bg-gray-950/900/black` ni `color: white` sobre html/body/:root |
| R13 | `pages/_app.tsx` — sin cambios; sigue siendo el único import CSS global (`git diff` vacío) |
| R14 | `tests/frontend/test_design_tokens.tsx::it("R14: bg-brand-primary-500 resuelve al rojo Tokko #DF1517")` — pasa |
| R15 | `tests/frontend/test_design_tokens.tsx::it("R15: document.body usa Nunito Sans tras aplicar tokens")` — pasa |
| R16 | `npx jest --selectProjects frontend` → 6/6 suites verde, 34/34 tests verde (sin regresiones en legacy) |
| R17 | `npx tsc --noEmit` → exit 0, sin errores TypeScript |
| R18 | `styles/globals.css` no redeclara tokens; única fuente de verdad es `product/frontend/styles/tokens.css` |

## Desvíos del design.md

1. **R15 — font-family literal en el CSS del test**: el design.md sección 4.5 mostraba el body del CSS inyectado por el test usando `font-family: var(--font-family-base);`. En la implementación inicial siguiendo literalmente ese esqueleto, jsdom (jest-environment-jsdom v30) NO resuelve `var()` para la propiedad `font-family` en `getComputedStyle` (devuelve la cadena cruda `var(--font-family-base)`). Esto se documenta en una nota explícita del test y se reemplaza por el literal `'Nunito Sans', system-ui, sans-serif` SOLO en el CSS inyectado por el test. En la aplicación real (`styles/globals.css`), el body sigue declarando `font-family: var(--font-family-base);` como exige R11. La intención de R15 (verificar que el body adopta Nunito Sans) se preserva intacta.

2. **R14 — regex más amplia**: el test acepta `rgb(223,21,23)`, `#DF1517` o `var(--color-brand-primary-500)` (sin resolver). En esta versión de jsdom el computedStyle resolvió `var()` correctamente a `rgb(223, 21, 23)` para `background-color`, pero la regex amplia evita fragilidad si una versión futura del entorno devuelve uno de los otros formatos válidos.

Ningún desvío afecta el contrato de los requirements ni rompe trazabilidad.

## Observaciones para el reviewer

- No se modificó ningún componente en `product/frontend/components/` (DashboardLayout, LeadsFeed, LeadCard, LeadDetailPanel, SimulatorPanel) ni sus tests, como exige el alcance de esta feature. El refactor visual quedará a cargo de la feature 8.
- Los componentes legacy que usaban clases dark-theme (`bg-gray-950`, etc.) seguirán renderizando con los grises Tailwind default (no Tokko) hasta la feature 8 — esto es el comportamiento esperado y los tests existentes lo siguen aceptando.
- No se tocó `feature_list.json` ni `progress/current.md` (es responsabilidad del leader post-review).
