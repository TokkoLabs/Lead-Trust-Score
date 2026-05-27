# Tasks — tokko_design_system_setup

Feature ID: 7
Layer: frontend
Estado: spec_ready

> Orden importa. Cada task tiene checkbox y referencia a `R<n>`.
> El implementer marca `[x]` al completar. El reviewer rechaza si
> queda alguna `[ ]` sin justificación documentada.

---

- [x] **T1** — Crear el archivo `product/frontend/styles/tokens.css` con el
  bloque `:root { … }` que declara TODAS las CSS custom properties
  listadas en el HTML target `ui-ux/lead-trust-dashboard-tokko (3).html`
  (líneas 11–117). Valores literales, sin reinterpretar.
  Cubre: R1, R1.a, R1.b, R1.c, R1.d, R1.e, R1.f, R1.g.

- [x] **T2** — Modificar `styles/globals.css` para que su contenido sea
  exactamente: (1) `@import "../product/frontend/styles/tokens.css";`,
  (2) las 3 directivas `@tailwind base/components/utilities;`,
  (3) una regla `body { background-color: var(--color-surface-neutral-low);
  color: var(--color-neutral-grey-800); font-family: var(--font-family-base);
  -webkit-font-smoothing: antialiased; }`. Eliminar cualquier referencia
  a tema oscuro hardcodeado.
  Cubre: R10, R11, R12, R18.

- [x] **T3** — Modificar `tailwind.config.js` añadiendo dentro de
  `theme.extend`: el objeto `colors` con las claves `brand-primary`,
  `brand-secondary`, `feedback-green`, `feedback-yellow`, `feedback-blue`,
  `neutral-grey`, `surface` (todas las sub-claves definidas en R2 y
  sección 4.2 del design), cada una referenciando el `var(--color-…)`
  correspondiente. Preservar `keyframes` y `animation` existentes.
  Cubre: R2.

- [x] **T4** — En el mismo `tailwind.config.js`, añadir a `theme.extend`:
  `borderRadius` (`card`/`button`/`chip`/`pill` → `var(--radius-*)`),
  `boxShadow` (`low`/`top`/`left` → `var(--shadow-*)`), `spacing`
  (claves `1..6` y `8` → `var(--sp-*)`), `fontSize`
  (`title-lg/md/sm`, `body-lg/md/sm/xs`, `caption` → `var(--fs-*)`),
  y `fontFamily.sans` = `['Nunito Sans', 'system-ui', 'sans-serif']`.
  Cubre: R4, R5, R6, R7, R8.

- [x] **T5** — Crear `pages/_document.tsx` con el componente
  `Document` que importa de `next/document` y declara en `<Head>` los
  tres `<link>` para Nunito Sans: 2 `preconnect` (Google Fonts API y
  static, este último con `crossOrigin="anonymous"`) y 1 `stylesheet`
  apuntando a la URL `https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,300;0,6..12,400;0,6..12,600;0,6..12,700;0,6..12,800&display=swap`.
  Cubre: R9.

- [x] **T6** — Verificar (sin modificar) que `pages/_app.tsx` mantiene
  el `import "../styles/globals.css";` como único import CSS global.
  No agregar imports adicionales de tokens.
  Cubre: R13.

- [x] **T7** — Crear el test
  `tests/frontend/test_design_tokens.tsx` siguiendo el esqueleto del
  `design.md` sección 4.5. El test DEBE incluir dos `it(...)`:
  (a) "R14: bg-brand-primary-500 resuelve al rojo Tokko #DF1517" — usa
  RTL `render`, inyecta el CSS de tokens vía un `<style>`
  programático, lee `getComputedStyle(el).backgroundColor` y verifica
  match con `rgb(223, 21, 23)` o `#DF1517`. (b) "R15: document.body
  usa Nunito Sans tras montar la app" — verifica
  `getComputedStyle(document.body).fontFamily` contiene `Nunito Sans`.
  Cubre: R3, R14, R15.

- [x] **T8** — Ejecutar `npx jest --selectProjects frontend` y
  confirmar que (1) `test_design_tokens.tsx` pasa, (2) los tests
  previos (`test_feed.tsx`, `test_lead_detail_panel.tsx`,
  `test_simulation_integration.tsx`, `test_simulator_panel.tsx`,
  `test_use_lead_analysis.tsx`) siguen pasando o fallan ÚNICAMENTE
  por razones de styling visual no relacionadas con los tokens
  (documentar excepciones en `progress/impl_tokko_design_system_setup.md`).
  Cubre: R16.

- [x] **T9** — Ejecutar `npx tsc --noEmit` desde la raíz del repo.
  Si Next está disponible y rápido, ejecutar también `npx next build`
  hasta el paso de type-check. Cero errores TypeScript / Next en los
  archivos creados o modificados por esta feature.
  Cubre: R17.

- [x] **T10** — Documentar la trazabilidad final en
  `progress/impl_tokko_design_system_setup.md` con el mapa
  `R<n> → <archivo|test>` y cualquier observación sobre fallos
  esperados en tests de componentes legacy.
  Cubre: trazabilidad (regla dura de `docs/specs.md`).
