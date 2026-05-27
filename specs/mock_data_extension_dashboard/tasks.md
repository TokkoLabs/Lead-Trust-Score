# Tasks — mock_data_extension_dashboard

> Checklist ejecutable. El `backend_implementer` marca `[x]` al
> completar. Cada task referencia los `R<n>` que cubre.

## Fase 1 — Tipos

- [x] **T1** — Editar `product/types/lead.ts`: agregar `export type Source = "Zonaprop" | "Argenprop" | "WhatsApp" | "Mail" | "Mercadolibre" | "Chat web" | "Navent";` y `export type Estado = "Nuevo" | "En revisión" | "Calificado" | "Descartado";` ANTES de `export interface Lead`. Cubre: R2.
- [x] **T2** — En la misma `Lead` interface, agregar al final (después de `property_ids`) los 5 campos opcionales: `source?: Source`, `estado?: Estado`, `created_at?: string`, `agencia?: string | null`, `direccion_propiedad?: string | null`. Cubre: R1, R3.

## Fase 2 — Módulo de generadores

- [x] **T3** — Crear archivo `product/backend/lib/leadGenerators.ts` con la cabecera de import (`import type { Lead, Source, Estado } from "../../types/lead";`) y el type-alias local `type TipoPropiedad = Lead["tipo_propiedad"];`. Cubre: R10.
- [x] **T4** — En `leadGenerators.ts`, definir y exportar los 9 pools como `readonly` arrays según la sección "Firmas nuevas" del `design.md` (`ZONAS_POOL`, `PRESUPUESTOS_POOL`, `MENSAJES_INTERESTED_POOL`, `MENSAJES_SPAM_POOL`, `TIPOS_PROPIEDAD_POOL`, `SOURCES_POOL`, `ESTADOS_POOL`, `AGENCIAS_POOL`, `DIRECCIONES_POOL`). Cubre: R10, R11.
- [x] **T5** — En `leadGenerators.ts`, implementar y exportar `pickRandom<T>(pool: readonly T[], rng?: () => number): T` con clamp al índice máximo (`Math.min(pool.length - 1, Math.floor(r * pool.length))`) y guard `pool.length === 0` que lanza `Error`. Cubre: R12, R13, R18.
- [x] **T6** — En `leadGenerators.ts`, implementar y exportar `generateRandomLead(rng?: () => number, opts?: { forceType?: "interested" | "spam" }): Lead` siguiendo la firma del `design.md` (80/20 default; usa `pickRandom` para todos los pools; id `sim-${Date.now()}-${counter}`; `created_at = new Date().toISOString()`). Cubre: R14, R15, R16, R17.

## Fase 3 — Mock data extendido

- [x] **T7** — Editar `product/backend/data/leads_mock.json`: para cada lead existente `lead-01..lead-15`, añadir las 5 claves nuevas (`source`, `estado`, `created_at`, `agencia`, `direccion_propiedad`) con valores válidos según los pools. Conservar `id`, `mensaje`, `telefono`, `email`, `zona`, `tipo_propiedad`, `presupuesto_usd`, `property_ids` SIN CAMBIOS. Cubre: R5, R6, R7, R19.
- [x] **T8** — Añadir 15 nuevos leads `lead-16..lead-30` al mismo `leads_mock.json` con TODOS los campos requeridos por el schema original (incluyendo `property_ids` con ≥1 elemento válido del catálogo) más los 5 campos nuevos. Cada uno con `source ∈ SOURCES_POOL`, `estado ∈ ESTADOS_POOL`. Cubre: R4, R5, R6, R19, R20.
- [x] **T9** — Distribuir los `created_at` de los 30 leads en los últimos 7 días UTC asegurando que ≥5 de los 7 días tienen ≥1 lead. Recomendado: 4-5 leads por día. Todos los timestamps en formato ISO 8601 con sufijo `Z` y dentro de los últimos 30 días. Cubre: R7, R8, R9.

## Fase 4 — Tests

- [x] **T10** — Crear `tests/backend/test_data_extension.ts` (estilo del test_data.ts existente, ts-node + assert nativo). Implementar funciones:
  - `test_leads_count_min_30(leads)` — assert `leads.length >= 30`. Cubre: R4.
  - `test_each_lead_has_valid_source(leads)` — for-loop assert `SOURCES_POOL.includes(lead.source)`. Cubre: R5.
  - `test_each_lead_has_valid_estado(leads)` — for-loop assert `ESTADOS_POOL.includes(lead.estado)`. Cubre: R6.
  - `test_each_lead_has_iso_created_at(leads)` — assert regex ISO 8601 + `!isNaN(new Date(value).valueOf())`. Cubre: R7.
  - `test_created_at_within_30_days(leads)` — assert `now - ts <= 30d && ts <= now`. Cubre: R8.
  - `test_daily_distribution_min_5_days(leads)` — bucketear por `YYYY-MM-DD` UTC, contar cuántos de los últimos 7 días tienen ≥1 lead, assert `>= 5`. Cubre: R9.
  - `test_legacy_schema_still_valid(leads)` — for-loop assert que cada lead conserva `id`, `mensaje`, `telefono`, `email`, `zona`, `tipo_propiedad`, `presupuesto_usd`, `property_ids` con `>= 1`. Cubre: R19.
  - `test_unique_ids(leads)` — assert `new Set(leads.map(l => l.id)).size === leads.length`. Cubre: R20.
  - `main()` runner que ejecuta todas las funciones.
- [x] **T11** — Crear `tests/backend/test_lead_generators.ts` (mismo estilo). Implementar funciones:
  - `test_module_exports()` — importar nombrados desde `product/backend/lib/leadGenerators` y assert que cada uno es truthy y los pools tienen el tipo esperado (array). Cubre: R10.
  - `test_pool_sizes()` — assert tamaños mínimos: interested≥10, spam≥6, agencias≥8, direcciones≥10, zonas≥10, sources===7, estados===4. Cubre: R11.
  - `test_pick_random_lower_bound()` — assert `pickRandom(["a","b","c"], () => 0) === "a"`. Cubre: R12.
  - `test_pick_random_upper_bound()` — assert `pickRandom(["a","b","c"], () => 0.9999999) === "c"`. Cubre: R13.
  - `test_pick_random_no_rng_uses_math_random()` — sin segundo arg, assert que el resultado pertenece al pool (no-throw + inclusion). Cubre: R18.
  - `test_generate_lead_deterministic_zero()` — invocar `generateRandomLead(() => 0)`, assert TODAS las claves del Lead extendido están presentes y pertenecen a sus pools respectivos. Cubre: R14.
  - `test_generate_lead_different_rng_differs()` — invocar con `() => 0` y `() => 0.99`, assert que al menos uno de los campos `zona`/`source`/`mensaje` difiere entre ambos. Cubre: R15.
  - `test_generate_lead_force_spam()` — invocar con `{forceType: "spam"}`, assert `MENSAJES_SPAM_POOL.includes(lead.mensaje)`. Cubre: R16.
  - `test_generate_lead_force_interested()` — invocar con `{forceType: "interested"}`, assert `MENSAJES_INTERESTED_POOL.includes(lead.mensaje)`. Cubre: R17.
  - `main()` runner.

## Fase 5 — Verificación local

- [x] **T12** — Ejecutar `npx ts-node tests/backend/test_data.ts` y verificar que el test legacy sigue verde tras la extensión. Cubre: R3, R19.
- [x] **T13** — Ejecutar `npx ts-node tests/backend/test_data_extension.ts` y verificar todos los asserts en verde. Cubre: R4, R5, R6, R7, R8, R9, R19, R20.
- [x] **T14** — Ejecutar `npx ts-node tests/backend/test_lead_generators.ts` y verificar todos los asserts en verde. Cubre: R10-R18.
- [x] **T15** — Ejecutar `npx tsc --noEmit -p tsconfig.json` (o el comando equivalente del proyecto) y verificar que TypeScript compila sin errores. Cubre: R1, R2, R3.
- [x] **T16** — Ejecutar `npx ts-node tests/backend/test_ai_pipeline.ts` para validar que las referencias hardcodeadas a `lead-01` y `lead-03` siguen funcionando con el mock extendido. Cubre: R3, R19.

## Fase 6 — Reporte

- [x] **T17** — Crear `progress/impl_mock_data_extension_dashboard.md` con la tabla de trazabilidad R<n> → test_function final y resumen de archivos tocados.
