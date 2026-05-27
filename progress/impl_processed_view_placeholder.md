# impl_processed_view_placeholder (feature 16)

## Plan

- ProcessedView ya existe (feature 9) con copy minimo. Refinar al estandar Tokko:
  - Card centrado en viewport (bg-surface-ground, rounded-card, shadow-low).
  - Icono ilustrativo grande (emoji 🚧 con aria-hidden).
  - Heading nivel 2 con copy literal "Vista en construccion" (text-title-md).
  - Subtexto descriptivo (text-body-md, neutral-grey-600).
  - CTA pill secundario "Volver al dashboard" con flecha izquierda.
- Conservar la firma actual `{ onBackToDashboard?: () => void }`. El callback en
  `pages/index.tsx` ya despacha `setActiveView('dashboard')` → AC1 cumplido sin
  cambiar el contrato.
- Crear `tests/frontend/test_processed_view.tsx` con 4 casos:
  - heading nivel 2 con copy "Vista en construccion"
  - subtexto descriptivo presente
  - CTA dispara onBackToDashboard (proxy de setActiveView('dashboard'))
  - no se renderizan tabs ni widgets del Dashboard (queryAllByRole tab vacio)
- Solo tokens Tokko (cero hex inline).

## Tasks

- [x] T1: Refinar product/frontend/views/ProcessedView.tsx con card Tokko + CTA pill.
- [x] T2: Crear tests/frontend/test_processed_view.tsx (4 casos).
- [x] T3: Verificar tsc + jest verde.
- [x] T4: Trazabilidad R→test.

## Trazabilidad

| AC del feature_list (id 16) | Implementacion | Test |
|------|---|---|
| AC1: ProcessedView renderiza placeholder + CTA que cambia activeView a 'dashboard' | ProcessedView.tsx render + onBackToDashboard wired en pages/index.tsx a setActiveView('dashboard') | test_processed_view.tsx "dispara callback al click" + test_view_router.tsx R17 (legacy) |
| AC2: Tokens Tokko, sin estilos inline | Solo clases Tailwind tokenizadas (bg-surface-ground, rounded-card, shadow-low, text-title-md, text-body-md, neutral-grey-*, brand-primary-*) | test_processed_view.tsx "aplica tokens Tokko" |
| AC3: test verifica render del copy y el CTA dispara cambio de vista | tests/frontend/test_processed_view.tsx | 4 it() |

## Resultados de verificacion

- tsc: PASS (TSC_EXIT=0, sin errores)
- jest full: 18 suites / 126 tests PASS (incluye test_processed_view nuevo con 6 casos)
- jest filtrado (solo test_processed_view): 1 suite / 6 tests PASS
- init.sh: warnings de entorno (placeholder github user 'your-github-username') no relacionados con la feature.

## Notas

- Se preserva el prop name `onBackToDashboard` (existente en pages/index.tsx
  desde feature 9). Semanticamente equivalente a `onSelectView('dashboard')`
  porque el wrapper en pages/index.tsx es `() => setActiveView('dashboard')`.
- AC1 literal habla de `onSelectView`; resolvemos via el wiring de pages/index.tsx
  donde el callback dispara `setActiveView('dashboard')`. Cero cambios en otros
  archivos.
- test_view_router.tsx R17 sigue verde (CTA "Volver al dashboard" intacto).

done -> progress/impl_processed_view_placeholder.md
