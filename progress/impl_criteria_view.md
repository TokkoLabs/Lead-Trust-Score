# Implementación — criteria_view (id 15)

> Modo acelerado (sdd=false). Brief literal del leader basado en
> feature_list.json + HTML target.

## Plan / Tasks

- [x] T1 — `product/frontend/lib/criteriaDefaults.ts` (tipos + CRITERIA_DEFAULTS + cloneDefaults).
- [x] T2 — `product/frontend/lib/criteriaStorage.ts` (load/save/clear con try/catch, clave `criteria_v1`).
- [x] T3 — `product/frontend/components/criteria/CriterionRow.tsx` (label + select Alta/Media/Baja + toggle role=switch).
- [x] T4 — `product/frontend/components/criteria/KeywordsList.tsx` (input + Agregar + chips removibles + ENTER + dedup + variants positive/negative).
- [x] T5 — `product/frontend/components/criteria/CriteriaSection.tsx` (card wrapper con title + intro opcional).
- [x] T6 — Reescribir `product/frontend/views/CriteriaView.tsx`: info band azul + grid 2 columnas + 3 secciones izquierda + 2 secciones derecha + acciones (Restablecer / Guardar).
- [x] T7 — Tests `tests/frontend/test_criteria_view.tsx` (10 cases) cubriendo AC1-AC6.
- [x] T8 — Verify: `npx tsc --noEmit` y `npx jest` verdes.

## Trazabilidad acceptance → test

- AC1 (layout 2 columnas + info band azul)
  → `test_criteria_view: AC1 render inicial muestra info band azul + 2 columnas + keywords defaults (5/3)`
- AC2 (`CriterionRow.tsx` reusable con toggle + select Alta/Media/Baja)
  → `test_criteria_view: AC2 secciones izquierdas y derecha montan CriterionRow con sus labels`
- AC3 (`KeywordsList.tsx` con add/remove, ENTER, dedup, variants)
  → `test_criteria_view: AC3 KeywordsList agregar 'agendar'`
  → `test_criteria_view: AC3 agregar duplicado 'visita' NO duplica`
  → `test_criteria_view: AC3 remover 'test' de negativas`
  → `test_criteria_view: AC3 ENTER agrega`
  → `test_criteria_view: AC3 input vacío no agrega`
- AC4 (`criteriaDefaults.ts` + "Restablecer defaults" restaura sin recargar)
  → `test_criteria_view: AC4 Restablecer defaults vuelve a 5/3 sin recargar`
- AC5 ("Guardar criterios →" Toast + localStorage `criteria_v1`)
  → `test_criteria_view: AC5 Guardar escribe en localStorage y muestra Toast`
- AC6 (test verifica add/remove + reset + persistencia localStorage)
  → cubierto por todos los anteriores + `AC6 tras guardar, un nuevo CriteriaView se hidrata desde localStorage`

## Archivos

- `product/frontend/lib/criteriaDefaults.ts` (nuevo)
- `product/frontend/lib/criteriaStorage.ts` (nuevo)
- `product/frontend/components/criteria/CriterionRow.tsx` (nuevo)
- `product/frontend/components/criteria/KeywordsList.tsx` (nuevo)
- `product/frontend/components/criteria/CriteriaSection.tsx` (nuevo)
- `product/frontend/views/CriteriaView.tsx` (REESCRITO — reemplaza placeholder feature 9)
- `tests/frontend/test_criteria_view.tsx` (nuevo, 10 tests)

## Resultados

- `npx tsc --noEmit` → verde (sin output).
- `npx jest` → 17 suites / 120 tests passed (frontend 16 + backend 1).
- `bash init.sh` → FAIL preexistente NO relacionado (placeholder GitHub
  username `your-github-username` vs `emanuelheredia`). Mismo FAIL reportado
  en features anteriores; no introducido por esta feature.

## Desvíos / Decisiones

1. **localStorage defensivo**: `criteriaStorage.ts` envuelve cada acceso a
   `window.localStorage` en try/catch (incluyendo el lookup inicial). En SSR
   o modos restringidos `loadCriteria()` devuelve `null` y el consumidor cae
   a `cloneDefaults()`. `saveCriteria` traga el error para no romper UI.
2. **Hidratación**: `CriteriaView` admite `initialState` opcional (para
   tests deterministas). Por defecto: localStorage → defaults.
3. **`cloneDefaults()`** se usa para evitar que mutaciones de keywords
   (que son arrays) contaminen el objeto exportado `CRITERIA_DEFAULTS`. El
   botón "Restablecer defaults" pasa un objeto fresco al setState.
4. **Test `test_view_router.tsx` NO se tocó**: la aserción de Criterios
   solo verifica `heading "Criterios de scoring"` y ausencia de tablist,
   ambas siguen aplicando con la vista nueva (no buscaba "Vista en
   construcción"). Diferencia con feature 14 (queue_view), que sí había
   requerido tocar este archivo.
5. **Pesos de dimensiones**: 3 sliders simples (Trust/Conv/Urg) sin
   coloreado dinámico de barra de suma — la lógica completa pre-existe en
   `CriteriaCard` del Dashboard (feature 13). El brief solo pedía "3
   sliders"; se mantiene el contrato mínimo.
6. **Labels filtros automáticos**: extraídos del HTML target líneas 877-880
   (4 toggles: "Bloquear números inválidos", "Detectar spam automático",
   "Filtrar duplicados", "Ignorar sin mensaje").
7. **`pages/index.tsx`** sigue montando `<CriteriaView />` sin props nuevas,
   por lo que no requiere modificación.

## Comunicación al leader

done -> progress/impl_criteria_view.md
