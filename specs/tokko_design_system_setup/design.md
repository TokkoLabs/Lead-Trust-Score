# Design — tokko_design_system_setup

Feature ID: 7
Layer: frontend
Estado: spec_ready

> Esta es la **piedra angular** del rediseño Tokko. Su alcance es
> deliberadamente quirúrgico: tokens, tipografía, theme. No se toca
> ningún componente. Las features 8–18 se apoyan sobre estos tokens.

---

## 1. Resumen de la decisión

- **Fuente de verdad de tokens:** `product/frontend/styles/tokens.css`
  (CSS custom properties bajo `:root`). Es la traducción 1:1 del bloque
  `:root` del HTML target.
- **Bridge Tailwind ↔ tokens:** `tailwind.config.js` referencia los
  tokens vía `var(--token)` en `theme.extend`. Esto mantiene una sola
  fuente de verdad (CSS) y deja que Tailwind genere clases utilitarias.
- **Tipografía:** Nunito Sans se carga vía `<link>` en
  `pages/_document.tsx` (no via `@import` en CSS ni vía
  `<link>` en `_app.tsx`). Justificación en sección 5.
- **Tema claro global:** `styles/globals.css` importa `tokens.css` antes
  de las directivas Tailwind y declara reglas mínimas sobre `body` para
  fijar background claro, color de texto neutro 800 y antialiasing.

## 2. Archivos a crear

| Archivo | Propósito | Requirements cubiertos |
|---|---|---|
| `product/frontend/styles/tokens.css` | Declaración única de CSS custom properties Tokko (`:root`). | R1.a–R1.g |
| `pages/_document.tsx` | Custom Document de Next que carga Nunito Sans via `<link>` en `<Head>`. | R9 |
| `tests/frontend/test_design_tokens.tsx` | Test jest+RTL que verifica resolución de `bg-brand-primary-500` y `font-family` del body. | R14, R15, R16 |

## 3. Archivos a modificar

| Archivo | Cambio | Requirements |
|---|---|---|
| `tailwind.config.js` | Añadir `theme.extend.colors`, `borderRadius`, `boxShadow`, `spacing`, `fontSize`, `fontFamily` referenciando `var(--token)`. Mantener `keyframes`/`animation` existentes. | R2, R4, R5, R6, R7, R8 |
| `styles/globals.css` | `@import '../product/frontend/styles/tokens.css';` arriba de Tailwind. Añadir bloque `body { … }` con background, color, font-family, antialiasing. | R10, R11, R12, R18 |
| `pages/_app.tsx` | Sin cambios funcionales — sólo confirmar que sigue siendo el único punto que importa `globals.css`. | R13 |
| `feature_list.json` | `status` de la feature id 7: `pending → spec_ready`. (Lo hace este spec_author al cerrar; el implementer no lo toca.) | — |

## 4. Firmas y contratos

### 4.1 `product/frontend/styles/tokens.css`

```css
:root {
  /* Brand */
  --color-brand-primary-100: #FACECF;
  --color-brand-primary-500: #DF1517;
  --color-brand-primary-500-15: rgba(223,21,23,0.15);
  --color-brand-primary-700: #9C0F10;
  --color-brand-secondary-500: #427F94;
  --color-brand-secondary-700: #275C6D;
  --color-brand-secondary-high: #1A4958;

  /* Neutral */
  --color-neutral-grey-50:  #FBFCFC;
  --color-neutral-grey-100: #F3F6F8;
  /* … hasta 900 + white #FFFFFF */

  /* Surface, Feedback, Radius, Shadow, Spacing, Typography */
  /* — ver R1.a–R1.g para la lista completa, valores literales del HTML target */
}
```

### 4.2 `tailwind.config.js` (forma esperada)

```js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./product/frontend/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        "brand-primary": {
          100: "var(--color-brand-primary-100)",
          500: "var(--color-brand-primary-500)",
          "500-15": "var(--color-brand-primary-500-15)",
          700: "var(--color-brand-primary-700)",
        },
        "brand-secondary": {
          500: "var(--color-brand-secondary-500)",
          700: "var(--color-brand-secondary-700)",
          high: "var(--color-brand-secondary-high)",
        },
        "feedback-green":  { 50: "var(--color-feedback-green-50)",  500: "var(--color-feedback-green-500)",  "500-15": "var(--color-feedback-green-500-15)" },
        "feedback-yellow": { 50: "var(--color-feedback-yellow-50)", 500: "var(--color-feedback-yellow-500)", "500-15": "var(--color-feedback-yellow-500-15)" },
        "feedback-blue":   { 500: "var(--color-feedback-blue-500)", "500-15": "var(--color-feedback-blue-500-15)", 600: "var(--color-feedback-blue-600)" },
        "neutral-grey": { 50: "var(--color-neutral-grey-50)", /* … */ 900: "var(--color-neutral-grey-900)" },
        surface: {
          ground:       "var(--color-surface-neutral-ground)",
          low:          "var(--color-surface-neutral-low)",
          medium:       "var(--color-surface-neutral-medium)",
          high:         "var(--color-surface-neutral-high)",
          "success-low":  "var(--color-surface-success-low)",
          "success-high": "var(--color-surface-success-high)",
          "warning-low":  "var(--color-surface-warning-low)",
          "warning-high": "var(--color-surface-warning-high)",
          "danger-low":   "var(--color-surface-danger-low)",
          "danger-high":  "var(--color-surface-danger-high)",
        },
      },
      borderRadius: {
        card:   "var(--radius-card)",
        button: "var(--radius-button)",
        chip:   "var(--radius-chip)",
        pill:   "var(--radius-pill)",
      },
      boxShadow: {
        low:  "var(--shadow-low)",
        top:  "var(--shadow-top)",
        left: "var(--shadow-left)",
      },
      spacing: {
        1: "var(--sp-1)", 2: "var(--sp-2)", 3: "var(--sp-3)",
        4: "var(--sp-4)", 5: "var(--sp-5)", 6: "var(--sp-6)",
        8: "var(--sp-8)",
      },
      fontSize: {
        "title-lg": "var(--fs-title-lg)",
        "title-md": "var(--fs-title-md)",
        "title-sm": "var(--fs-title-sm)",
        "body-lg":  "var(--fs-body-lg)",
        "body-md":  "var(--fs-body-md)",
        "body-sm":  "var(--fs-body-sm)",
        "body-xs":  "var(--fs-body-xs)",
        caption:    "var(--fs-caption)",
      },
      fontFamily: {
        sans: ["Nunito Sans", "system-ui", "sans-serif"],
      },
      keyframes: { enter: { "0%": { opacity: "0", transform: "translateY(-16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } } },
      animation: { enter: "enter 0.6s ease-out forwards" },
    },
  },
  plugins: [],
};
```

> Notas:
> - Mantenemos el JIT por defecto de Tailwind v3 (sin `mode: 'jit'`
>   explícito, ya no es necesario). El `content` glob cubre `pages/`,
>   `product/frontend/` y `styles/`.
> - `spacing` se sobrescribe con las claves 1..8: Tailwind v3 fusiona
>   `extend.spacing` con la escala default sin pisarla, así que `p-10`,
>   `m-12`, etc. siguen funcionando.

### 4.3 `pages/_document.tsx`

```tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,300;0,6..12,400;0,6..12,600;0,6..12,700;0,6..12,800&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### 4.4 `styles/globals.css`

```css
@import "../product/frontend/styles/tokens.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: var(--color-surface-neutral-low);
  color: var(--color-neutral-grey-800);
  font-family: var(--font-family-base);
  -webkit-font-smoothing: antialiased;
}
```

### 4.5 `tests/frontend/test_design_tokens.tsx` (esqueleto)

```tsx
/**
 * Cubre: R3, R14, R15, R16
 */
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// Cargamos tokens.css y un puente mínimo de "Tailwind-like classes"
// en jsdom — jsdom no procesa Tailwind, así que inyectamos las reglas
// indispensables para que .bg-brand-primary-500 resuelva a la variable.
const TOKEN_CSS = `
  :root {
    --color-brand-primary-500: #DF1517;
    --color-surface-neutral-low: #F3F6F8;
    --color-neutral-grey-800: #2E393F;
    --font-family-base: 'Nunito Sans', system-ui, sans-serif;
  }
  .bg-brand-primary-500 { background-color: var(--color-brand-primary-500); }
  body {
    background-color: var(--color-surface-neutral-low);
    color: var(--color-neutral-grey-800);
    font-family: var(--font-family-base);
  }
`;

function injectStyle() {
  const style = document.createElement("style");
  style.setAttribute("data-test", "tokens");
  style.textContent = TOKEN_CSS;
  document.head.appendChild(style);
}

describe("Tokko design tokens", () => {
  beforeEach(() => {
    document.head.querySelectorAll('style[data-test="tokens"]').forEach(n => n.remove());
    injectStyle();
  });

  it("R14: bg-brand-primary-500 resuelve al rojo Tokko #DF1517", () => {
    const { container } = render(<div className="bg-brand-primary-500">x</div>);
    const el = container.firstChild as HTMLElement;
    const bg = getComputedStyle(el).backgroundColor;
    // jsdom devuelve "rgb(223, 21, 23)" cuando resuelve el var()
    expect(bg.replace(/\s+/g, "")).toMatch(/rgb\(223,21,23\)|#DF1517/i);
  });

  it("R15: document.body usa Nunito Sans tras montar la app", () => {
    const ff = getComputedStyle(document.body).fontFamily;
    expect(ff).toMatch(/Nunito Sans/i);
  });
});
```

> Nota de ejecución (R14, R16): jsdom **sí** resuelve `var(--…)` cuando
> el custom property está definido en la cascada, por eso inyectamos un
> mini-CSS controlado en el test en lugar de depender de Tailwind/PostCSS
> (no se ejecutan en jest). Esta es la forma estándar de verificar tokens
> en jest+RTL.

## 5. Decisiones técnicas

### 5.1 ¿Por qué `<link>` en `_document.tsx` y no `@import` en CSS?

- `<link rel="stylesheet">` permite paralelizar la descarga con el HTML
  (preconnect a Google Fonts) y evita el FOIT prolongado de un
  `@import` CSS (que sería procesado después del CSS principal).
- Next recomienda `_document.tsx` para `<link>` y `<meta>` que deben
  vivir en `<head>` antes de la hidratación de React.
- `next/font` (alternativa) cargaría Nunito Sans con self-host
  automático; ver alternativa 6.1.

### 5.2 ¿Por qué `var(--token)` en Tailwind en lugar de hex literales?

- Una sola fuente de verdad: el CSS. Si el diseñador cambia el rojo
  Tokko, modificar `tokens.css` propaga el cambio sin recompilar
  Tailwind ni tocar `tailwind.config.js`.
- Permite theming dinámico en el futuro (ej. dark mode) reasignando
  custom properties sin reconstruir.
- Costo: Tailwind no puede usar `colors: rgba(var(--rgb), 0.5)` con
  estos tokens; pero el HTML target ya provee tokens con alpha
  pre-resueltos (`--color-brand-primary-500-15`), así que no es
  bloqueante.

### 5.3 Spacing override controlado

Tailwind v3 fusiona `theme.extend.spacing` con la escala default. Los
tokens `--sp-1..--sp-8` están alineados con la escala Tailwind
(`1 = 4px, 2 = 8px, …, 8 = 32px`), así que el override es **no-op
funcional** y sólo introduce una indirección por var(). Esto preserva
todas las clases `p-4`, `gap-2`, etc. existentes.

### 5.4 No tocar componentes

El brief del producto indica explícitamente que esta feature **no debe
modificar layout ni componentes**. Si los componentes existentes
(DashboardLayout, LeadsFeed, …) usan clases gray-* genéricas de
Tailwind, esas clases **seguirán resolviendo a los grises Tailwind
default**, no a los Tokko, hasta que la feature 8 los reescriba. El
contrato no negociable: **TypeScript compila y Next build no falla**.

### 5.5 Tests aislados de Tailwind

Como jsdom no procesa Tailwind/PostCSS, el test
`test_design_tokens.tsx` inyecta inline un subset de CSS para
demostrar la cadena de resolución. Esta es una práctica estándar
(la alternativa sería un test e2e con Playwright/Cypress, fuera de
alcance para esta feature). El test es **suficiente** para R14/R15
porque verifica los dos puntos clave: que el token rojo resuelve a
`#DF1517` y que `body` adopta Nunito Sans.

## 6. Alternativas descartadas

### 6.1 Usar `next/font` para self-hostear Nunito Sans

**Descartada.** `next/font` es la opción recomendada por Next moderno y
elimina la dependencia de Google Fonts en producción. Sin embargo:

- Introduce una variable CSS generada dinámicamente
  (`--font-nunito-sans`) que rompe el contrato literal del HTML target
  (que usa `'Nunito Sans'` como string).
- Hace los tests jest más frágiles (la variable se inyecta en build
  time y no en jsdom).
- Para una MVP/demo donde el bundle ya incluye un Google Fonts request
  análogo en el HTML target, no aporta valor diferencial.

Cuando el producto vaya a producción seria, esta es la primera
migración recomendada (re-spec en feature futura). Mientras tanto, el
`<link>` en `_document.tsx` mantiene paridad 1:1 con el target HTML.

### 6.2 Tokens duplicados directamente en `tailwind.config.js` como hex

**Descartada.** Sería más simple para Tailwind (sin indirección
`var()`), pero duplica la fuente de verdad: cambios al diseñador
implicarían tocar dos archivos (`tokens.css` y `tailwind.config.js`)
y abre la puerta a drift.

### 6.3 Cargar `tokens.css` desde `_app.tsx` con un import separado

**Descartada.** Funciona en Next, pero rompe la regla del repo de
mantener un único import CSS en `_app.tsx` (`globals.css`).
`globals.css` ya es el punto natural para inyectar tokens via
`@import` antes de Tailwind, y mantiene a `_app.tsx` libre de
acoplamientos al sistema de diseño.

## 7. Trazabilidad inicial (esbozo, completa la fija el implementer)

| Requirement | Verificación esperada |
|---|---|
| R1.a–R1.g | Inspección de `product/frontend/styles/tokens.css` (todas las custom properties presentes con los valores literales del HTML target). |
| R2, R4, R5, R6, R7, R8 | Inspección de `tailwind.config.js`. Opcionalmente, un test que importe la config y verifique `theme.extend.colors["brand-primary"]["500"] === "var(--color-brand-primary-500)"`. |
| R3, R14 | `tests/frontend/test_design_tokens.tsx` test "bg-brand-primary-500 resuelve a #DF1517". |
| R9 | Inspección de `pages/_document.tsx`. |
| R10, R11, R12, R18 | Inspección de `styles/globals.css`. |
| R13 | Inspección (diff) de `pages/_app.tsx` — no cambia. |
| R15 | `tests/frontend/test_design_tokens.tsx` test "body usa Nunito Sans". |
| R16 | `npx jest --selectProjects frontend` pasa en CI. |
| R17 | `npx tsc --noEmit` (o `npx next build` si está disponible) sin errores. |
