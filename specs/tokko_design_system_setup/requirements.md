# Requirements — tokko_design_system_setup

Feature ID: 7
Layer: frontend
Estado: spec_ready

> Esta feature establece la **base** del rediseño Tokko. Define tokens
> (color, tipografía, radius, sombras, spacing), carga la fuente Nunito
> Sans y reconfigura `styles/globals.css` al tema claro. NO modifica
> componentes existentes (DashboardLayout, LeadsFeed, LeadCard,
> LeadDetailPanel, SimulatorPanel) — esos quedan obsoletos visualmente
> hasta la feature 8 (`app_shell_redesign`). El único contrato no
> negociable es: la app DEBE seguir compilando (TypeScript + Next build)
> y los tests previos NO DEBEN romperse por motivos no relacionados a
> styling.

---

## R1 — Token file existe y exporta CSS custom properties Tokko

El sistema DEBE exponer el archivo `product/frontend/styles/tokens.css`
que declara, dentro de un único bloque `:root { … }`, todas las CSS
custom properties listadas en R1.a–R1.g con los valores exactos del HTML
target `ui-ux/lead-trust-dashboard-tokko (3).html` (sección `:root`,
líneas 11–117).

### R1.a — Tokens de brand

El bloque `:root` de `product/frontend/styles/tokens.css` DEBE declarar:
`--color-brand-primary-100: #FACECF`, `--color-brand-primary-500: #DF1517`,
`--color-brand-primary-500-15: rgba(223,21,23,0.15)`,
`--color-brand-primary-700: #9C0F10`,
`--color-brand-secondary-500: #427F94`,
`--color-brand-secondary-700: #275C6D`,
`--color-brand-secondary-high: #1A4958`.

### R1.b — Tokens de neutral grey y blanco

El bloque `:root` DEBE declarar la escala completa
`--color-neutral-grey-50` … `--color-neutral-grey-900`
con los valores `#FBFCFC, #F3F6F8, #EAEEF1, #D6DEE2, #C2CCD3, #94A2AB,
#6A7981, #4D5A61, #2E393F, #1D2327` y `--color-neutral-white: #FFFFFF`.

### R1.c — Tokens de superficie

El bloque `:root` DEBE declarar
`--color-surface-neutral-ground: #FFFFFF`,
`--color-surface-neutral-low: #F3F6F8`,
`--color-surface-neutral-medium: #EAEEF1`,
`--color-surface-neutral-high: #D6DEE2`,
`--color-surface-success-low`, `--color-surface-success-high`,
`--color-surface-warning-low`, `--color-surface-warning-high`,
`--color-surface-danger-low: #FEF2F2`, `--color-surface-danger-high`
con los valores del HTML target.

### R1.d — Tokens de feedback

El bloque `:root` DEBE declarar
`--color-feedback-green-50: #E1FAF4`,
`--color-feedback-green-500: #189C7B`,
`--color-feedback-green-500-15: rgba(24,156,123,0.15)`,
`--color-feedback-yellow-50: #FEFAEA`,
`--color-feedback-yellow-500: #F3CE29`,
`--color-feedback-yellow-500-15: rgba(243,206,41,0.15)`,
`--color-feedback-blue-500: #007DDD`,
`--color-feedback-blue-500-15: rgba(0,125,221,0.15)`,
`--color-feedback-blue-600: #0066B4`.

### R1.e — Tokens de radius

El bloque `:root` DEBE declarar `--radius-card: 16px`,
`--radius-button: 8px`, `--radius-chip: 6px`, `--radius-pill: 1000px`.

### R1.f — Tokens de sombra

El bloque `:root` DEBE declarar `--shadow-low`, `--shadow-top` y
`--shadow-left` con los valores literales del HTML target
(`0 0 0 rgba(95,99,120,.10), 0 0 5px rgba(95,99,120,.10)` para `low` y
`left`; `0 -1px 15px rgba(95,99,120,.10), 0 -4px 10px rgba(95,99,120,.05)`
para `top`).

### R1.g — Tokens de spacing y tipografía

El bloque `:root` DEBE declarar `--sp-1: 4px`, `--sp-2: 8px`,
`--sp-3: 12px`, `--sp-4: 16px`, `--sp-5: 20px`, `--sp-6: 24px`,
`--sp-8: 32px`, `--font-family-base: 'Nunito Sans', system-ui, sans-serif`,
`--fs-title-lg: 28px`, `--fs-title-md: 24px`, `--fs-title-sm: 20px`,
`--fs-body-lg: 18px`, `--fs-body-md: 15px`, `--fs-body-sm: 14px`,
`--fs-body-xs: 12px`, `--fs-caption: 11px`.

## R2 — Tailwind extiende `theme.colors` con paleta Tokko

El sistema DEBE modificar `tailwind.config.js` para que `theme.extend.colors`
exponga, vía `var(--token)`, las siguientes claves nominales:

- `brand-primary` con sub-claves `100`, `500`, `700` y `500-15`.
- `brand-secondary` con sub-claves `500`, `700`, `high`.
- `feedback-green` con sub-claves `50`, `500`, `500-15`.
- `feedback-yellow` con sub-claves `50`, `500`, `500-15`.
- `feedback-blue` con sub-claves `500`, `500-15`, `600`.
- `neutral-grey` con sub-claves `50`, `100`, `200`, `300`, `400`, `500`,
  `600`, `700`, `800`, `900`.
- `surface` con sub-claves `ground`, `low`, `medium`, `high`,
  `success-low`, `success-high`, `warning-low`, `warning-high`,
  `danger-low`, `danger-high`.

Cada sub-clave DEBE resolver a `var(--color-…)` correspondiente al token
declarado en R1.

## R3 — Una clase `bg-brand-primary-500` resuelve al color rojo Tokko

CUANDO un componente renderiza un elemento con la clase
`bg-brand-primary-500`, el sistema DEBE pintar ese elemento con el color
`#DF1517` (vía la cadena resolutiva
`bg-brand-primary-500 → background-color: var(--color-brand-primary-500)
→ #DF1517`).

## R4 — Tailwind extiende `theme.borderRadius` con tokens Tokko

El sistema DEBE modificar `tailwind.config.js` para que `theme.extend.borderRadius`
exponga las claves `card` (`var(--radius-card)`), `button`
(`var(--radius-button)`), `chip` (`var(--radius-chip)`) y `pill`
(`var(--radius-pill)`).

## R5 — Tailwind extiende `theme.boxShadow` con tokens Tokko

El sistema DEBE modificar `tailwind.config.js` para que `theme.extend.boxShadow`
exponga las claves `low` (`var(--shadow-low)`), `top` (`var(--shadow-top)`)
y `left` (`var(--shadow-left)`).

## R6 — Tailwind extiende `theme.spacing` con tokens Tokko

El sistema DEBE modificar `tailwind.config.js` para que `theme.extend.spacing`
exponga las claves `'1'`, `'2'`, `'3'`, `'4'`, `'5'`, `'6'`, `'8'` con los
valores `var(--sp-1)` … `var(--sp-8)` respectivamente.

> Nota de diseño: Tailwind ya define spacing numérico (`1 = 4px`,
> `2 = 8px`, …) con escalado de 4px que coincide con la escala Tokko, por lo
> que el override mantiene retro-compatibilidad de las clases `p-4`, `m-2`,
> etc. existentes.

## R7 — Tailwind extiende `theme.fontSize` con tokens Tokko

El sistema DEBE modificar `tailwind.config.js` para que `theme.extend.fontSize`
exponga las claves `title-lg` (`var(--fs-title-lg)`),
`title-md` (`var(--fs-title-md)`), `title-sm` (`var(--fs-title-sm)`),
`body-lg` (`var(--fs-body-lg)`), `body-md` (`var(--fs-body-md)`),
`body-sm` (`var(--fs-body-sm)`), `body-xs` (`var(--fs-body-xs)`) y
`caption` (`var(--fs-caption)`).

## R8 — Tailwind extiende `theme.fontFamily` con Nunito Sans

El sistema DEBE modificar `tailwind.config.js` para que
`theme.extend.fontFamily.sans` sea `['Nunito Sans', 'system-ui', 'sans-serif']`,
de modo que la clase Tailwind `font-sans` y la herencia global
resuelvan a Nunito Sans.

## R9 — Nunito Sans se carga vía `<link>` en `pages/_document.tsx`

El sistema DEBE exponer el archivo `pages/_document.tsx` que, dentro del
componente `<Head>`, incluye dos `<link rel="preconnect">` a
`https://fonts.googleapis.com` y `https://fonts.gstatic.com` (este último
con `crossOrigin="anonymous"`) y un `<link rel="stylesheet">` a
`https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,300;0,6..12,400;0,6..12,600;0,6..12,700;0,6..12,800&display=swap`.

## R10 — `styles/globals.css` importa `tokens.css` antes de Tailwind

El sistema DEBE modificar `styles/globals.css` para que la primera línea
no vacía sea `@import '../product/frontend/styles/tokens.css';`,
seguida por `@tailwind base; @tailwind components; @tailwind utilities;`.

## R11 — `styles/globals.css` aplica tema claro Tokko al body

El sistema DEBE modificar `styles/globals.css` para que, después de las
directivas Tailwind, declare una regla `body { … }` que fija:

- `background-color: var(--color-surface-neutral-low)`,
- `color: var(--color-neutral-grey-800)`,
- `font-family: var(--font-family-base)`,
- `-webkit-font-smoothing: antialiased`.

## R12 — `styles/globals.css` no contiene referencias al tema oscuro anterior

El sistema NO DEBE conservar en `styles/globals.css` ninguna regla
global que aplique `bg-gray-950`, `bg-gray-900`, `bg-black`,
`color: white` o equivalentes sobre `html`, `body` o `:root`.

## R13 — `_app.tsx` mantiene el import único de `globals.css`

El sistema DEBE preservar el `import "../styles/globals.css";` en
`pages/_app.tsx` como única fuente de CSS global (no añadir imports
adicionales de tokens desde `_app.tsx`).

## R14 — Test de tokens verifica resolución de `bg-brand-primary-500`

El sistema DEBE exponer el archivo
`tests/frontend/test_design_tokens.tsx` que renderiza un componente
auxiliar con la clase `bg-brand-primary-500` y verifica, mediante
`getComputedStyle`, que la regla `background-color` resuelta contiene
`rgb(223, 21, 23)` o el literal `#DF1517` o la cadena
`var(--color-brand-primary-500)`.

> Nota: jsdom no aplica las reglas de Tailwind, por lo que el test
> auxiliar inyecta el CSS de tokens (`tokens.css`) y un selector
> `.bg-brand-primary-500 { background-color: var(--color-brand-primary-500); }`
> dentro de un `<style>` programático antes de renderizar, garantizando
> que la cadena de resolución sea verificable en jsdom. Esta decisión se
> documenta en `design.md`.

## R15 — Test de tokens verifica que `document.body` usa Nunito Sans

CUANDO el test `tests/frontend/test_design_tokens.tsx` monta el árbol
`<App>` (o un wrapper equivalente que importe `globals.css`), el sistema
DEBE poder verificar que `getComputedStyle(document.body).fontFamily`
contiene la subcadena `Nunito Sans`.

## R16 — Test de tokens no rompe la suite jest existente

CUANDO se ejecuta `npx jest --selectProjects frontend`, el sistema DEBE
ejecutar `test_design_tokens.tsx` con resultado verde, y todos los demás
tests existentes en `tests/frontend/**` DEBEN seguir pasando (o fallar
únicamente por motivos no relacionados con tokens — el reviewer documenta
excepciones).

## R17 — Build de TypeScript / Next no se rompe

CUANDO se ejecuta `npx next build` (o, como sustituto en ausencia de
build full, `npx tsc --noEmit`), el sistema DEBE completar sin errores
de TypeScript ni de Next relacionados con los archivos modificados o
creados por esta feature (`tokens.css`, `tailwind.config.js`,
`styles/globals.css`, `pages/_document.tsx`, `tests/frontend/test_design_tokens.tsx`).

## R18 — Tokens no se duplican en globals.css

El sistema NO DEBE redeclarar en `styles/globals.css` ninguna de las
custom properties listadas en R1; la única fuente de verdad DEBE ser
`product/frontend/styles/tokens.css`.
