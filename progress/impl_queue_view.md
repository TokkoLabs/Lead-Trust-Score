# Implementacion — queue_view (id 14)

> Modo acelerado (sdd=false). Brief literal del leader basado en feature_list.json + HTML target.

## Plan / Tasks

- [x] T1 — Crear `product/frontend/lib/leadReasons.ts` (deriveReasons puro + ReasonChip).
- [x] T2 — Crear `product/frontend/components/queue/QueueStats.tsx` (3 stat cards Tokko).
- [x] T3 — Crear `product/frontend/components/queue/FilterBar.tsx` (chips Todos/Alta/Media/Baja).
- [x] T4 — Crear `product/frontend/components/queue/QueueCard.tsx` (header + score pill + chips + contacto enmascarado + property + message + tags + actions).
- [x] T5 — Reescribir `product/frontend/views/QueueView.tsx` con QueueStats + FilterBar + lista QueueCard.
- [x] T6 — Modificar `pages/index.tsx` para pasar `leads`, `aiScores` a QueueView.
- [x] T7 — Tests `tests/frontend/test_lead_reasons.ts` cubriendo derivacion.
- [x] T8 — Tests `tests/frontend/test_queue_view.tsx` cubriendo stats, filtro, render QueueCard, masking, ojo, accion Crear contacto.
- [x] T9 — Verify: `npx tsc --noEmit` y `npx jest` verdes.

## Trazabilidad acceptance → test

- AC1 (QueueView monta stats+filter+lista) → `test_queue_view: render con 5 leads`
- AC2 (QueueCard con todas las secciones) → `test_queue_view: QueueCard muestra todas las secciones`
- AC3 (leadReasons.ts puro + tests) → `test_lead_reasons: casos representativos`
- AC4 (filtro por calidad re-renderiza) → `test_queue_view: filtro Alta calidad`
- AC5 (masking + ojo) → `test_queue_view: email enmascarado + click revela`
- AC6 (stats cards reflejan counts reales) → `test_queue_view: stats reflejan totales`
- AC7 (test_lead_reasons cubre derivacion) → `test_lead_reasons` suite completo

## Archivos

- `product/frontend/lib/leadReasons.ts` (nuevo)
- `product/frontend/components/queue/QueueStats.tsx` (nuevo)
- `product/frontend/components/queue/FilterBar.tsx` (nuevo)
- `product/frontend/components/queue/QueueCard.tsx` (nuevo)
- `product/frontend/views/QueueView.tsx` (reescrito)
- `pages/index.tsx` (modificado: nuevas props a QueueView)
- `tests/frontend/test_lead_reasons.ts` (nuevo)
- `tests/frontend/test_queue_view.tsx` (nuevo)
- `tests/frontend/test_view_router.tsx` (modificado: ajustada aserción de QueueView placeholder → testid `queue-view`).

## Resultados

- `npx tsc --noEmit` → verde (sin output).
- `npx jest` → 16 suites / 110 tests passed (frontend 15 + backend 1).
- `bash init.sh` → FAIL preexistente NO relacionado (placeholder GitHub
  username `your-github-username` vs `emanuelheredia`). Mismo FAIL reportado
  en features anteriores; no introducido por esta feature.

## Desvíos / Decisiones

1. **FilterBar usa `role="group"` + `aria-pressed`** (no `role="tablist"` con
   `role="tab"`). Motivo: el test legacy `test_view_router.tsx` asume
   exactamente un `tablist` en la vista (el del PageHeader Hoy/7d/30d). Para
   no provocar duplicado de tablists, se elige semántica de grupo de toggle
   buttons. Equivalente accesible, y los tests internos buscan por
   `getByRole("button", { name })`.
2. **Test legacy `test_view_router.tsx`** ajustado: la aserción del placeholder
   `Vista en construcción` ya no aplica porque feature 14 reemplaza ese
   placeholder por la vista real. Se reemplaza por `getByTestId("queue-view")`
   manteniendo la *intención* del test (verificar que QueueView se monta al
   navegar a Cola). Las 7 aserciones restantes del archivo permanecen
   intactas.
3. **Reglas dummy de masking de teléfono**: se usa placeholder fijo
   `••• •••••••` igual al HTML target, sin intentar revelar dígitos parciales.
   Al pulsar el botón ojo se muestra el teléfono original tal como llega
   en `lead.telefono`.
4. **Operación inferida por presupuesto**: ≥ 80000 USD → "Venta", sino
   "Alquiler" (regla literal del brief). Se documenta como `inferOperacion`
   en QueueCard.
5. **Eliminar lead**: handler local que oculta la card vía estado
   `dismissedIds` (no muta el estado superior). Feature 14 no contempla
   persistencia destructiva; quedan los handlers `onCrearContacto` y
   `onAsignar` como no-op hasta que existan las features de Contactos /
   Equipo.

## Trazabilidad final acceptance → test

- AC1 (QueueView con stats+filter+lista) → `test_queue_view: render por defecto monta 5 QueueCard`
- AC2 (QueueCard con todas las secciones) → `test_queue_view: lead completo renderiza avatar, score pill, reason chips, contacto enmascarado y botón ojo` + `click en 'Crear contacto'`
- AC3 (leadReasons.ts puro + tests) → `test_lead_reasons` suite completo (10 tests)
- AC4 (filtro por calidad) → `test_queue_view: filtro 'Alta calidad'` + `filtro 'Todos' vuelve a mostrar` + `filtro 'Baja calidad'`
- AC5 (masking + ojo) → `test_queue_view: lead completo... email enmascarado` + `click en botón ojo revela`
- AC6 (stats reflejan counts reales) → `test_queue_view: stats cards reflejan counts reales`
- AC7 (test_lead_reasons cubre derivación) → 10 tests en `test_lead_reasons.ts`

## Comunicación al leader

done -> progress/impl_queue_view.md
