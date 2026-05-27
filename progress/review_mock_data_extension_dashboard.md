# Review — mock_data_extension_dashboard (feature id 10)

Veredicto: **APROBADO**

Reviewer: backend_reviewer
Fecha: 2026-05-27

## Resumen

La implementación de la feature 10 cumple los 20 requirements del spec
`specs/mock_data_extension_dashboard/requirements.md`, respeta el
`design.md` aprobado, mantiene compatibilidad con tests legacy
(`test_data.ts`, `test_ai_pipeline.ts`) y se ciñe al scope (sólo
`product/types`, `product/backend`, `tests/backend`).

## Comandos de verificación replicados

| Comando | Exit | Resultado |
|---------|------|-----------|
| `npx tsc --noEmit` | 0 | sin output, compila limpio (R1, R2, R3). |
| `npx ts-node -O '{"module":"commonjs"}' tests/backend/test_data.ts` | 0 | 9/9 asserts OK (parse_leads, schema, cross_references, leads_count=30 ≥ 15, etc.). R3, R19. |
| `npx ts-node -O '{"module":"commonjs"}' tests/backend/test_data_extension.ts` | 0 | 8/8 asserts OK. 30 leads, 7/7 días con ≥1 lead, 30 IDs únicos. R4-R9, R19, R20. |
| `npx ts-node -O '{"module":"commonjs"}' tests/backend/test_lead_generators.ts` | 0 | 9/9 asserts OK. Pools: interested=12 spam=8 agencias=9 direcciones=12 zonas=12 sources=7 estados=4. R10-R18. |
| `npx ts-node -O '{"module":"commonjs"}' tests/backend/test_ai_pipeline.ts` | 0 | 9/9 asserts OK. Referencias hardcoded a lead-01 y lead-03 intactas. R3, R19. |
| `npx jest --selectProjects backend` | 0 | 1 suite, 6/6 tests OK (test_simulate_endpoint). R3. |
| `./init.sh` | 0 | FAIL en check de usuario GitHub esperado (`your-github-username` placeholder del arnés) — preexistente, fuera de scope de la feature 10. Todos los demás checks OK. |

## Trazabilidad R<n> -> cobertura verificada

| Req | Cobertura | Verificado |
|-----|-----------|------------|
| R1  | `tsc --noEmit` + uso real en `leads_mock.json` con los 5 campos opcionales presentes | OK |
| R2  | `product/types/lead.ts` exporta `Source` y `Estado` con los 7 y 4 literales | OK |
| R3  | `test_data.ts` y `test_ai_pipeline.ts` verdes con tipo extendido | OK |
| R4  | `test_leads_count_min_30` -> 30 leads | OK |
| R5  | `test_each_lead_has_valid_source` -> 30/30 leads con source ∈ SOURCES_POOL | OK |
| R6  | `test_each_lead_has_valid_estado` -> 30/30 leads con estado ∈ ESTADOS_POOL | OK |
| R7  | `test_each_lead_has_iso_created_at` -> 30/30 created_at ISO 8601 con sufijo Z | OK |
| R8  | `test_created_at_within_30_days` -> 30/30 dentro de ventana, 0 leads en el futuro | OK |
| R9  | `test_daily_distribution_min_5_days` -> 7/7 días con ≥1 lead (excede mínimo de 5) | OK |
| R10 | `test_module_exports` -> 9 pools + pickRandom + generateRandomLead exportados | OK |
| R11 | `test_pool_sizes` -> tamaños cumplen mínimos | OK |
| R12 | `test_pick_random_lower_bound` -> rng=0 -> pool[0] | OK |
| R13 | `test_pick_random_upper_bound` -> rng=0.9999999 -> pool[last] (clamp aplicado) | OK |
| R14 | `test_generate_lead_deterministic_zero` -> Lead extendido con TODAS las claves del schema | OK |
| R15 | `test_generate_lead_different_rng_differs` -> rngs distintos producen leads distintos | OK |
| R16 | `test_generate_lead_force_spam` -> 10/10 mensajes ∈ MENSAJES_SPAM_POOL | OK |
| R17 | `test_generate_lead_force_interested` -> 10/10 mensajes ∈ MENSAJES_INTERESTED_POOL | OK |
| R18 | `test_pick_random_no_rng_uses_math_random` -> 50/50 dentro del pool sin rng | OK |
| R19 | `test_legacy_schema_still_valid` + `test_data.ts` -> schema legacy intacto en los 30 | OK |
| R20 | `test_unique_ids` -> 30 IDs únicos | OK |

Sin huecos de trazabilidad.

## Compatibilidad (D1, D2, D3)

- lead-01..15 preservan id, mensaje, telefono, email, zona,
  tipo_propiedad, presupuesto_usd, property_ids originales. Verificado:
  - lead-01: Palermo / departamento / [prop-01, prop-07]
  - lead-03: Caballito / ph / [prop-03, prop-09]
- 15 nuevos lead-16..lead-30 agregados, todos con los 13 campos completos
  y property_ids ≥ 1.
- Los 5 campos nuevos en `Lead` son opcionales (`?:`), tests legacy
  (`test_data.ts`, `test_ai_pipeline.ts`, `test_simulate_endpoint.ts`)
  no requirieron modificación y siguen verdes.

## Source literales del HTML (R2, R5)

Verificado contra `ui-ux/lead-trust-dashboard-tokko (3).html` líneas
732-736 y 788-791. Los 7 literales en `SOURCES_POOL` coinciden
exactamente: Zonaprop, Argenprop, WhatsApp, Mail, Mercadolibre, Chat
web, Navent.

## Distribución temporal (R8, R9, desvío D4)

| Día UTC | Leads |
|---------|-------|
| 2026-05-21 (D-6) | 3 |
| 2026-05-22 (D-5) | 3 |
| 2026-05-23 (D-4) | 4 |
| 2026-05-24 (D-3) | 4 |
| 2026-05-25 (D-2) | 5 |
| 2026-05-26 (D-1) | 6 |
| 2026-05-27 (D-0) | 5 |

Total: 7/7 días cubiertos, excede el mínimo R9 (≥5/7). Los 5 leads del
2026-05-27 están en horas tempranas (03:15-11:55 UTC), todos `<= now`
(now = 2026-05-27T18:41 UTC). Desvío reportado por el implementer:
aceptable y documentado (ver `progress/impl_*.md` distribución diaria).

## Scope (R-scope)

Archivos tocados sólo dentro de las áreas autorizadas:

- `product/types/lead.ts` (modificado).
- `product/backend/lib/leadGenerators.ts` (creado).
- `product/backend/data/leads_mock.json` (regenerado, 15 -> 30).
- `tests/backend/test_data_extension.ts` (creado).
- `tests/backend/test_lead_generators.ts` (creado).
- `specs/mock_data_extension_dashboard/tasks.md` (todas las T1..T17
  marcadas `[x]`).

Sin cambios en `product/frontend/`, `tests/frontend/`, `styles/` ni
`pages/` por parte de esta feature. (Los cambios sin trackear en esas
áreas corresponden a otras features —app_shell_redesign,
view_router_navigation, tokko_design_system_setup— y son ortogonales.)

## Tasks

Todas las tasks T1..T17 marcadas `[x]` en `tasks.md` con `R<n>`
correspondientes referenciados.

## Desvíos aceptados

1. **5 timestamps en horas tempranas del 2026-05-27 (D-0)**: necesario
   para cumplir simultáneamente `ts <= now` (R8) y cobertura D-0 (R9).
   Aceptable; reportado en `impl_*.md`.
2. **`init.sh` reporta `[FAIL]` por GitHub username placeholder**: bug
   preexistente del arnés (`your-github-username` en config base). No
   bloquea la feature ni los tests del producto.

## Resultado

`APPROVED -> progress/review_mock_data_extension_dashboard.md`
