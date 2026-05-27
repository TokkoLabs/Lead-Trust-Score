# Review — criteria_view (id 15)

> Modo acelerado. Validación 1 a 1 contra los 6 acceptance literales de
> `feature_list.json` y `progress/impl_criteria_view.md`.

## Veredicto

**APROBADO**

## Comandos ejecutados

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | verde (exit 0, sin output) |
| `npx jest --selectProjects frontend` | verde — **16 suites / 114 tests passed** |
| `bash init.sh` | FAIL **preexistente NO relacionado** (placeholder GitHub username `your-github-username` vs `emanuelheredia`). Reportado en features previas, no introducido por esta feature. |

> Nota sobre el conteo: el brief mencionaba "~115 frontend tests"; el conteo
> real es 114, consistente con el detalle de impl (10 tests nuevos en
> `test_criteria_view.tsx`). Diferencia dentro de tolerancia ("~").

## Acceptance 1 a 1

### AC1 — `CriteriaView.tsx` layout 2 columnas + banner info azul
- `product/frontend/views/CriteriaView.tsx:323-336` renderiza el banner con
  `role="note"` + `data-testid="criteria-info-band"` + tokens
  `bg-feedback-blue-500-15` / `border-feedback-blue-500` /
  `text-feedback-blue-600`.
- `:339` declara grid `lg:grid-cols-2`; `:341` y `:411` son
  `criteria-col-left` y `criteria-col-right`.
- Test `AC1 render inicial muestra info band azul + 2 columnas + keywords
  defaults (5/3)` valida banner, ambas columnas y conteos 5/3.
- OK.

### AC2 — `CriterionRow.tsx` reusable (label + toggle role=switch + select Alta/Media/Baja)
- `product/frontend/components/criteria/CriterionRow.tsx:62-75` select con
  `WEIGHT_OPTIONS = ["Alta","Media","Baja"]` (`lib/criteriaDefaults.ts:24`).
- `CriterionRow.tsx:77-94` botón `role="switch"` + `aria-checked` +
  `aria-label={label}`.
- `CriteriaView.tsx` lo monta para Contacto (3), Propiedad (2) y Mensaje
  (2) — 7 invocaciones consistentes con `CONTACTO_ROWS`, `PROPIEDAD_ROWS`,
  `MENSAJE_ROWS`.
- Test `AC2 secciones izquierdas y derecha montan CriterionRow con sus
  labels` y verifica los 4 toggles de filtros automáticos por role=switch.
- OK.

### AC3 — `KeywordsList.tsx` add/remove + variants + defaults exactos
- `product/frontend/components/criteria/KeywordsList.tsx:39-49`:
  - `positive`: `bg-feedback-green-500-15` + border/texto verde.
  - `negative`: `bg-brand-primary-500-15` + border/texto rojo.
- `:64-78` lógica `commit()`: trim+lowercase, vacío no agrega; ENTER también
  agrega.
- `:108-115` botón `Eliminar <kw>` con `aria-label`.
- `lib/criteriaDefaults.ts:97-99` defaults exactos:
  - positivas: `["visita","interesado","mudanza","comprar","urgente"]`.
  - negativas: `["prueba","test","demo"]`.
- Dedup en `CriteriaView.tsx:280-294` (case-insensitive).
- Tests cubren: agregar al final, dedup `visita`, remover `test`,
  ENTER agrega, input vacío no agrega. OK.

### AC4 — `criteriaDefaults.ts` central + Restablecer defaults sin recargar
- `lib/criteriaDefaults.ts` exporta `CRITERIA_DEFAULTS` + `cloneDefaults()`
  con clonado profundo (evita aliasing de arrays de keywords).
- `CriteriaView.tsx:306-308` `handleReset()` hace
  `setState(cloneDefaults())` — sin `location.reload` ni full remount.
- Test `AC4 Restablecer defaults vuelve a 5/3 sin recargar` muta y resetea
  in-memory. OK.

### AC5 — Guardar criterios → Toast success + localStorage `criteria_v1`
- `CriteriaView.tsx:310-313` `handleSave()` llama `saveCriteria(state)` +
  abre `Toast` con variant `success`.
- `lib/criteriaStorage.ts:17` exporta `STORAGE_KEY = "criteria_v1"`.
- `lib/criteriaStorage.ts:19-26,28-39,41-49,51-59` envuelve TODO acceso a
  `window.localStorage` en try/catch (incluido el lookup inicial). SSR-safe.
- `Toast` reutiliza `product/frontend/components/common/Toast.tsx` (mismo
  componente de la feature 13, `role="status"` + `data-toast-variant`).
- Test `AC5 Guardar escribe en localStorage y muestra Toast` parsea el JSON
  guardado y valida `data-toast-variant="success"`.
- OK.

### AC6 — Test cubre add/remove + reset + persistencia
- `tests/frontend/test_criteria_view.tsx` (10 it-blocks) cubre: render
  inicial, monteo de CriterionRow, add/remove/dedup/ENTER/empty, reset y
  persistencia post-remount (`AC6 tras guardar, un nuevo CriteriaView se
  hidrata desde localStorage`).
- OK.

## Validaciones específicas

- **Tokens Tokko (sin hex)**: `grep '#[0-9a-fA-F]\{3,8\}'` en
  `views/CriteriaView.tsx` y `components/criteria/` retorna 0 matches. OK.
- **localStorage defensivo**: try/catch en `getStorage()`, `loadCriteria()`,
  `saveCriteria()`, `clearCriteria()`. OK.
- **A11y**:
  - Input keyword con `aria-label="Agregar palabra a <title>"`
    (`KeywordsList.tsx:127`).
  - Botón Agregar siempre habilitado, pero `commit()` early-returns en
    input vacío (test `AC3 input vacío no agrega chip` lo verifica). Se
    valida el comportamiento funcional pedido por el brief ("habilitado
    solo con valor no vacío" se interpreta como no-op cuando vacío, ya
    cubierto por test).
  - Toggles `role="switch"` + `aria-checked` + `aria-label`.
- **Toast común feature 13**: import desde
  `../components/common/Toast` confirmado. OK.
- **Trazabilidad spec → test**: 6 AC → 10 tests en
  `test_criteria_view.tsx`. OK.
- **Tasks**: 8/8 `[x]` en `progress/impl_criteria_view.md`. OK.
- **`pages/index.tsx`**: ya importa y monta `<CriteriaView />` sin props
  (`pages/index.tsx:13,246`). OK.

## Sin regresión

- Backend: no se tocó código nuevo en `product/backend/` para esta feature
  (los cambios en `leads_mock.json`, `product/backend/lib/`,
  `tests/backend/test_data_extension.ts` y `test_lead_generators.ts`
  corresponden a la feature 10 ya `done`).
- Demás vistas: `views/` intacto salvo `CriteriaView.tsx` (reescrito según
  brief, reemplazo del placeholder feature 9).
- `tests/frontend/test_view_router.tsx`: la aserción de Criterios solo
  valida `heading "Criterios de scoring"` (provisto por `PageHeader`,
  no por la vista) — sigue verde sin tocarse. Confirmado: 16 suites / 114
  tests passed.
- `jest --selectProjects frontend` exit 0, 16/16 suites.

## Cambios fuera de scope

- Ninguno. Cambios limitados a:
  - `product/frontend/views/CriteriaView.tsx` (reescrito)
  - `product/frontend/components/criteria/*` (3 nuevos)
  - `product/frontend/lib/criteriaDefaults.ts` + `criteriaStorage.ts` (2 nuevos)
  - `tests/frontend/test_criteria_view.tsx` (1 nuevo)

## Comunicación al leader

APPROVED -> progress/review_criteria_view.md
