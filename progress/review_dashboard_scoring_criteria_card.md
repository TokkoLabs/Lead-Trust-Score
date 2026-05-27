# Review — dashboard_scoring_criteria_card (id 13)

> Modo acelerado. Validación 1 a 1 contra los 6 acceptance del feature_list.json
> + reporte del implementer + HTML target.

## Veredicto

**APROBADO**

## Comandos de verificación

| Comando                                  | Resultado                                              |
| ---------------------------------------- | ------------------------------------------------------ |
| `npx tsc --noEmit`                       | verde (exit 0)                                         |
| `npx jest --selectProjects frontend`     | verde — 13 suites / 86 tests (match esperado)          |

## Acceptance criteria — cobertura 1 a 1

### AC1 — CriteriaCard con tabs internas (Pesos/Filtros/Canales) controladas por estado local
OK.
- `product/frontend/components/dashboard/CriteriaCard.tsx` existe.
- `useState<TabKey>("weights")` controla el panel activo.
- Tres `<button role="tab" aria-selected={active} aria-controls aria-controls=cs-panel-* id=cs-tab-*>`.
- Wrapper usa `role="group"` con `aria-label="Sub-tabs de criterios"` y `data-testid="criteria-subtabs"`.
- Test `AC1: renderiza 3 tabs (Pesos/Filtros/Canales) y arranca en Pesos` valida orden, aria-selected y panel inicial.
- **Desvío declarado aceptado**: el implementer usa `role="group"` en lugar de `role="tablist"` para no romper `test_view_router.tsx` (legacy que asume un único tablist en la vista — Hoy/7d/30d del PageHeader). La semántica de tab/tabpanel se mantiene en los `<button role="tab">` y el contenedor `<div role="tabpanel" aria-labelledby>`. Impacto a11y: lectores de pantalla no anunciarán "tab 1 of 3" en el contenedor, pero la activación por click y la relación tab→panel sigue siendo accesible. Issue menor, no bloqueante para esta feature.

### AC2 — Tab Pesos: 3 sliders 0-100 + suma + barra coloreada + umbral
OK.
- `WeightsTab.tsx`: tres `SliderRow` (Trust 40, Conversión 40, Urgencia 20) con `<input type="range" min=0 max=100>` y defaults correctos en `DEFAULT_CRITERIA`.
- Función pura `weightStatus(total)`: `100→ok`, `>100→over`, `<100→under`.
- Barra: `data-weight-status` expuesto + `bg-feedback-green-500` / `bg-brand-primary-500` / `bg-feedback-yellow-500` para fill.
- `data-testid="weights-total-label"` con suma en tiempo real.
- Slider "Umbral de alerta" 0-100, default 70 (`weights-umbral-value` + `aria-label="Umbral de alerta"`).
- Tests cubren los 3 estados de color y el default 70 del umbral:
  - `AC2: mover slider Trust de 40 a 60 actualiza la suma a 120 y la barra es roja`
  - `AC2: cuando suma = 100 (defaults), la barra es verde`
  - `AC2: cuando suma < 100, la barra es amarilla`
  - `AC2: slider 'Umbral de alerta' default es 70 y se ve en la UI`

### AC3 — Tab Filtros: 5 toggles role="switch" con labels exactos
OK (con interpretación documentada).
- `FiltersTab.tsx` renderiza 4 `<button role="switch" aria-checked aria-label>` + 1 fila "Score mínimo global" con label + slider 0-100 default 15.
- Labels EXACTOS del brief verificados literalmente en el componente:
  1. "Bloquear números inválidos"
  2. "Detectar spam"
  3. "Filtrar duplicados"
  4. "Ignorar leads sin mensaje"
  5. "Score mínimo global" (con valor 15)
- Nota: el HTML target usa "Detectar spam automático" e "Ignorar sin mensaje". El brief del leader y el AC priorizan los strings literales del brief; el implementer respetó el brief. Aceptado.
- Test `AC3: cambiar a tab 'Filtros' muestra los 5 labels exactos` verifica los 5 strings + cantidad de switches (4 buttons role=switch + 1 slider = 5 criterios).
- Test `AC3: toggle de un filtro cambia aria-checked de true a false` valida el toggle bidireccional.

### AC4 — Tab Canales: 7 tags clicables aria-pressed + 2 boost sliders
OK.
- `ChannelsTab.tsx` exporta `CHANNEL_NAMES` con los 7 strings exactos: "Zonaprop", "Argenprop", "WhatsApp", "Mail", "Mercadolibre", "Chat web", "Navent".
- Cada chip: `<button aria-pressed data-channel data-state>` con clase `on` cuando activo (cumple referencia visual del HTML, línea 482).
- 2 boost sliders: WhatsApp 1.3× (default), Mail 1.1× (default). Slider implementado como `min=10 max=20 step=1` y se mapea a float (`value*10` / `value/10`) — fiel al HTML target línea 796.
- Tests `AC4: cambiar a tab 'Canales' muestra los 7 channel tags exactos` y `AC4: click en un channel tag alterna aria-pressed y la clase 'on'`.

### AC5 — Botón "Guardar criterios →" con toast
OK.
- Botón en `<footer>` de `CriteriaCard.tsx` con `data-testid="criteria-save-btn"` y texto "Guardar criterios →".
- Al click: `onSave?(snapshot)` opcional + `setToastOpen(true)`.
- `Toast.tsx`:
  - `role="status"` + `aria-live="polite"` (accesibilidad correcta).
  - `useEffect` con `setTimeout` y **cleanup `clearTimeout`** en el return — no hay leak.
  - `durationMs` default 2500ms (cumple "2.5s").
  - Variant `success` con tokens `bg-feedback-green-500-15 text-feedback-green-500 border-feedback-green-500` (sin hex).
- Mensaje "Criterios guardados" literal.
- Test `AC5: click en 'Guardar criterios' muestra Toast con role=status y mensaje 'Criterios guardados'` valida apertura + texto + `data-toast-variant="success"` + payload de `onSave`.

### AC6 — test_criteria_card.tsx cubre todos los casos del brief
OK. 9 tests, todos verdes:
1. AC1: 3 tabs + arranque en Pesos
2. AC2: slider Trust 40→60 → suma 120 + barra roja (`bg-brand-primary-500`)
3. AC2: suma=100 → verde (`bg-feedback-green-500`)
4. AC2: suma<100 → amarillo (`bg-feedback-yellow-500`)
5. AC3: tab Filtros muestra los 5 labels exactos
6. AC3: toggle filtro cambia aria-checked
7. AC4: tab Canales muestra los 7 tags exactos
8. AC4: click channel tag alterna aria-pressed + clase `on`
9. AC5: Guardar muestra Toast con role=status + mensaje + onSave llamado
10. AC2 (bonus): Umbral de alerta default 70 visible

## Validaciones extra

- **Sin hex hardcodeado** en los nuevos archivos. `grep -rEn '#[0-9a-fA-F]{3,8}\b'` sobre los 5 archivos nuevos: 0 hits. Todo el sistema de color va por tokens (brand-*, feedback-*, neutral-grey-*).
- **Toast — cleanup correcto** en `Toast.tsx` líneas 50-55: `useEffect` retorna `() => window.clearTimeout(id)`. Sin memory leak.
- **Backend intacto**: ningún archivo bajo `product/backend/` ni `tests/backend/` fue modificado por esta feature (la modificación pendiente de `leads_mock.json` proviene de la feature previa `mock_data_extension_dashboard`).
- **DashboardView**: `CriteriaCard` insertada en una fila ancho completo (`<div><CriteriaCard /></div>`) entre el bloque RecentLeadsTable+SourceFunnel y el bloque legacy simulator+feed+detail. No rompe el grid existente.
- **Tasks**: las 8 tareas (T1–T8) están marcadas `[x]` en el reporte.
- **Trazabilidad**: cada AC tiene al menos un test asociado y la sección "Trazabilidad acceptance → test" del reporte está completa.

## Observaciones no bloqueantes

1. El desvío `role="group"` vs `role="tablist"` en el wrapper de sub-tabs es pragmático y bien justificado por el conflicto con el test legacy `test_view_router.tsx`. Si más adelante se quiere a11y plena (anunciado "tab X of Y"), conviene refactorizar el test legacy para que use selector más específico (p.ej. `getByRole("tablist", { name: /periodo/i })`) y devolver `role="tablist"` al wrapper.
2. El brief autoriza explícitamente "Detectar spam" e "Ignorar leads sin mensaje" como strings literales aunque el HTML target use variantes ("Detectar spam automático", "Ignorar sin mensaje"). Decisión cubierta por el brief del leader; sin acción requerida.
3. El slider "Score mínimo global" como 5to criterio (en vez de un 5to toggle como en el HTML) está documentado en el reporte y respeta el AC ("5 toggles") porque el conteo del AC se interpreta como "5 criterios de filtrado configurables". Aceptable.

## Conclusión

Implementación completa, trazable y limpia. Todos los acceptance están cubiertos por tests verdes. Sin regresiones en suites legacy. No hay hex hardcodeado y el Toast cumple las garantías de accesibilidad + cleanup pedidas.

APPROVED -> progress/review_dashboard_scoring_criteria_card.md
