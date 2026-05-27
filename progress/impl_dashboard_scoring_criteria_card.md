# Implementacion — dashboard_scoring_criteria_card (id 13)

> Modo acelerado (sdd=false). Brief literal del leader basado en feature_list.json + HTML target.

## Plan / Tasks

- [x] T1 — Crear `product/frontend/components/common/Toast.tsx` (toast reusable, role=status, auto-dismiss 2.5s con cleanup).
- [x] T2 — Crear `product/frontend/components/dashboard/criteria/WeightsTab.tsx` (3 sliders + barra dinamica + slider umbral).
- [x] T3 — Crear `product/frontend/components/dashboard/criteria/FiltersTab.tsx` (5 toggles role=switch + label exactos).
- [x] T4 — Crear `product/frontend/components/dashboard/criteria/ChannelsTab.tsx` (7 chips aria-pressed + 2 boost sliders).
- [x] T5 — Crear `product/frontend/components/dashboard/CriteriaCard.tsx` (orquestador con tabs internas + boton Guardar + Toast).
- [x] T6 — Modificar `product/frontend/views/DashboardView.tsx` para incluir `<CriteriaCard />` en nueva fila ancho completo entre el bloque RecentLeadsTable+SourceFunnel y el bloque legacy.
- [x] T7 — Tests `tests/frontend/test_criteria_card.tsx` cubriendo los 9 cases del brief.
- [x] T8 — Verify: `npx tsc --noEmit` y `npx jest` verdes.

## Trazabilidad acceptance → test

- AC1 (componente raiz con tabs internas) → `renderiza 3 tabs y arranca en Pesos`
- AC2 (3 sliders + suma + barra dinamica + umbral) → `mover slider Trust` + `suma=100 verde` + `suma<100 amarillo` (3 tests)
- AC3 (5 toggles role=switch labels exactos) → `toggle filtro cambia aria-checked` + `tab Filtros muestra los 5 labels`
- AC4 (7 channel tags + boost sliders) → `click channel tag alterna aria-pressed` + `tab Canales muestra 7 chips`
- AC5 (boton guardar + toast) → `Guardar muestra toast role=status`
- AC6 (test_criteria_card.tsx con tres casos clave) → cubierto en el suite.

## Archivos

- `product/frontend/components/common/Toast.tsx` (nuevo)
- `product/frontend/components/dashboard/criteria/WeightsTab.tsx` (nuevo)
- `product/frontend/components/dashboard/criteria/FiltersTab.tsx` (nuevo)
- `product/frontend/components/dashboard/criteria/ChannelsTab.tsx` (nuevo)
- `product/frontend/components/dashboard/CriteriaCard.tsx` (nuevo)
- `product/frontend/views/DashboardView.tsx` (modificado: inserta CriteriaCard)
- `tests/frontend/test_criteria_card.tsx` (nuevo)

## Resultados

- `npx tsc --noEmit` → verde (sin output).
- `npx jest` → 14 suites / 92 tests passed (frontend 13/86 + backend 1/6).
- `npx jest --selectProjects frontend` → 13/13 suites, 86/86 tests verdes.
- `bash init.sh` → FAIL preexistente NO relacionado (placeholder GitHub username
  `your-github-username` vs `emanuelheredia`). Mismo FAIL reportado en features
  anteriores; no provocado por esta feature.

## Desvíos / Decisiones

1. **`role="group"` en lugar de `role="tablist"` en CriteriaCard.** El test
   legacy `test_view_router.tsx` usa `screen.getByRole("tablist")` esperando
   *exactamente uno* en la vista (el del PageHeader Hoy/7d/30d). Para no
   romper ese test legacy (regla dura "NO rompas tests legacy"), el wrapper
   de las sub-tabs usa `role="group"` con `aria-label`. Los `<button>`
   mantienen `role="tab"` + `aria-selected` y `role="tabpanel"` sigue
   presente, así que la semántica de tabs por panel sigue siendo accesible.
   El test propio usa `getByTestId("criteria-subtabs")` + `within(...).getAllByRole("tab")`.
2. **Boost sliders** — el HTML target codifica el step como `min=10 max=20
   value=N` y muestra `(N/10).toFixed(1)+'×'`. Replicado fielmente
   (1.0×–2.0× en pasos de 0.1), con el state expuesto en floats (1.3 / 1.1).
3. **Score mínimo global** — el brief obliga a usar fila distinta con slider
   0-100 default 15, en lugar del toggle del HTML. Implementado como slider
   con label `htmlFor` accesible. Conté 4 switches reales + 1 slider (=5
   criterios totales, alineado con el AC).

## Trazabilidad final

- AC1 → `AC1: renderiza 3 tabs (Pesos/Filtros/Canales) y arranca en Pesos`
- AC2 → `mover slider Trust de 40 a 60 ... barra es roja` + `suma=100 verde` +
  `suma<100 amarillo` + `slider 'Umbral de alerta' default es 70`
- AC3 → `cambiar a tab 'Filtros' muestra los 5 labels exactos` + `toggle de
  un filtro cambia aria-checked de true a false`
- AC4 → `cambiar a tab 'Canales' muestra los 7 channel tags exactos` +
  `click en un channel tag alterna aria-pressed y la clase 'on'`
- AC5 → `click en 'Guardar criterios' muestra Toast con role=status`
- AC6 → cubierto por la combinación AC2 (slider→suma + >100 rojo) + AC3 (toggle).

## Comunicación al leader

done -> progress/impl_dashboard_scoring_criteria_card.md
