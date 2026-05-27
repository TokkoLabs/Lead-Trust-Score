# Implementación — Feature 12: recent_leads_table_and_source_funnel

## Plan de tareas

- [x] T1. Crear `product/frontend/components/dashboard/ScoreBar.tsx` con color dinámico.
- [x] T2. Crear `product/frontend/components/dashboard/RecentLeadsTable.tsx` (role='table', 6 columnas, row clickeable accesible).
- [x] T3. Crear `product/frontend/components/dashboard/SourceFunnel.tsx` (agrupar, ordenar, porcentaje relativo al max, colores por canal).
- [x] T4. Modificar `product/frontend/views/DashboardView.tsx` para insertar la fila Table + Funnel entre los charts y el bloque legacy.
- [x] T5. Crear `tests/frontend/test_recent_leads_table.tsx` (render 5 leads, color por rango, click → onSelectLead, aria-selected).
- [x] T6. Crear `tests/frontend/test_source_funnel.tsx` (orden descendente, porcentajes relativos al max, ignora leads sin source, respeta limit).
- [x] T7. Verify: `npx tsc --noEmit` + `npx jest --selectProjects frontend`.

## Archivos creados

- `product/frontend/components/dashboard/ScoreBar.tsx` — barra reusable + helper `scoreColorClass(value)` que expone `{ bg, text, range }` (`high`/`mid`/`low`) usado por avatares de la tabla.
- `product/frontend/components/dashboard/RecentLeadsTable.tsx` — tabla nativa `<table role="table">`, 6 columnas (Lead, Trust, Conversión, Urgencia, Fuente, Estado). Filas accesibles (`role="button"`, `tabIndex={0}`, `Enter`/`Space`). `aria-selected` cuando `selectedLeadId === lead.id`. Source chip y Estado badge tematizados por tokens Tokko.
- `product/frontend/components/dashboard/SourceFunnel.tsx` — bloque 'Volumen por fuente'. Agrupa por `lead.source`, ignora leads sin source, ordena desc por count, calcula `width=(count/max)*100`, color por canal alineado al HTML target (líneas 731-736).
- `tests/frontend/test_recent_leads_table.tsx` — 7 tests.
- `tests/frontend/test_source_funnel.tsx` — 5 tests.

## Archivos modificados

- `product/frontend/views/DashboardView.tsx` — agregada la fila feature 12 con `RecentLeadsTable` (lg:col-span-2) + `SourceFunnel` entre los charts y el bloque legacy. Se deriva `trustScoresMap: Record<id, number>` a partir de `analysesMap` para alimentar la tabla.

## Decisiones técnicas

- **ScoreBar**: color por rango (verde ≥75 → `bg-feedback-green-500`; amarillo 50-74 → `bg-feedback-yellow-500`; rojo <50 → `bg-brand-primary-500`). Variant 'thin' (h-1) | 'normal' (h-1.5). Atributo `data-score-range` (`high`/`mid`/`low`) para identificación determinística en tests.
- **RecentLeadsTable** ordenamiento:
  - Si todos los leads tienen `created_at`, ordena descendente por timestamp.
  - Fallback: trust desc.
- **Conversión/Urgencia derivadas** (no hay un mapa completo de `LeadAnalysis` hoy):
  - `conversion = analysisByLeadId?.[id]?.conversion_score ?? round(trust*0.9)`.
  - `urgency = analysisByLeadId?.[id]?.urgency_score ?? URGENCY_FALLBACK[computeLocalScore(lead).urgency]` (Alta=85, Media=55, Baja=25).
  - Documentado en el JSDoc del componente.
- **Nombre del lead**: derivado del local-part del email (capitalizado y normalizado), fallback `Lead {id}`.
- **Avatar**: inicial del nombre, fondo coloreado por trust (reusando `scoreColorClass`).
- **Source chip y Estado badge**: solo clases Tailwind con tokens Tokko (sin hex hardcodeado salvo el caso ya tematizado).
- **SourceFunnel**: `aggregate(leads, limit)` puro; usa `Map<Source, number>` ordenada por count desc. `percent` redondeado al entero más cercano.

## Verificación

- `npx tsc --noEmit`: VERDE (exit 0).
- `npx jest --selectProjects frontend`: VERDE — 12 suites / 76 tests (subimos desde 10 suites / 64 tests).

## Trazabilidad acceptance → tests

- AC1 (`role='table'` con 6 columnas + ScoreBar con color dinámico) → `test_recent_leads_table.tsx` (3 tests por rango + 1 estructural).
- AC2 (SourceFunnel agrupa, ordena, porcentaje relativo al máximo, colores por canal) → `test_source_funnel.tsx` (orden, porcentaje, ignorar sin source, limit, placeholder).
- AC3 (click en row abre el detalle via `onSelectLead`) → `test_recent_leads_table.tsx` (click + Enter + aria-selected).
- AC4 (data-driven sin mock interno) → ambos tests pasan `leads`/`aiScores` por props y assertean sobre los datos provistos.
- AC5 → `tests/frontend/test_recent_leads_table.tsx`.
- AC6 → `tests/frontend/test_source_funnel.tsx`.

## Desvíos

- Ninguno. `analysisByLeadId` se expone como prop opcional pero hoy `DashboardView` no lo cablea (no existe un mapa completo de `LeadAnalysis` en el host); se documenta en código y se mantiene el fallback heurístico para Conversión/Urgencia, según briefing.
