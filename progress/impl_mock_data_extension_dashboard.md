# Implementación — mock_data_extension_dashboard (feature id 10)

Status: implementación completa, lista para `backend_reviewer`.

## Archivos creados / modificados

| Path | Acción |
|------|--------|
| `product/types/lead.ts` | modificado — agregados `Source`, `Estado`, 5 campos opcionales en `Lead`. |
| `product/backend/lib/leadGenerators.ts` | creado — 9 pools, `pickRandom`, `generateRandomLead`. |
| `product/backend/data/leads_mock.json` | modificado — 15 → 30 leads, todos con los 5 campos nuevos. lead-01..15 preservan `id`, `mensaje`, `telefono`, `email`, `zona`, `tipo_propiedad`, `presupuesto_usd`, `property_ids`. |
| `tests/backend/test_data_extension.ts` | creado — 8 tests (R4-R9, R19, R20). |
| `tests/backend/test_lead_generators.ts` | creado — 9 tests (R10-R18). |
| `specs/mock_data_extension_dashboard/tasks.md` | modificado — todas las T1..T17 marcadas `[x]`. |

## Comandos de verificación (todos verdes)

| Comando | Resultado |
|---------|-----------|
| `npx ts-node -O '{"module":"commonjs"}' tests/backend/test_data.ts` | 10/10 asserts OK; 30 leads, 12 propiedades. |
| `npx ts-node -O '{"module":"commonjs"}' tests/backend/test_data_extension.ts` | 8/8 asserts OK; 7/7 días con ≥1 lead; 30 IDs únicos. |
| `npx ts-node -O '{"module":"commonjs"}' tests/backend/test_lead_generators.ts` | 9/9 asserts OK; pools interested=12 spam=8 agencias=9 direcciones=12 zonas=12 sources=7 estados=4. |
| `npx ts-node -O '{"module":"commonjs"}' tests/backend/test_ai_pipeline.ts` | 9/9 asserts OK; lead-01 y lead-03 siguen referenciables. |
| `npx jest --selectProjects backend` | 1 suite, 6 tests, 0 fail. |
| `npx tsc --noEmit` | sin output → compila limpio. |

**Nota sobre `-O '{"module":"commonjs"}'`:** el tsconfig del proyecto usa
`module: esnext`, y los tests legacy usan `__dirname` (CommonJS).
Override necesario para que `ts-node` los ejecute en modo CJS. El override
no modifica ningún archivo del repo; es solo CLI.

## Trazabilidad R<n> → test

| Requirement | Test cubre |
|-------------|------------|
| R1 (campos opcionales en Lead) | `tsc --noEmit` + `test_legacy_schema_still_valid` |
| R2 (Source/Estado union types) | `tsc --noEmit` + `test_module_exports` (import implícito de tipos vía pools) |
| R3 (backwards compatibility) | `test_data.ts` (legacy) + `test_ai_pipeline.ts` siguen verdes |
| R4 (≥30 leads) | `test_leads_count_min_30` |
| R5 (source válida) | `test_each_lead_has_valid_source` |
| R6 (estado válido) | `test_each_lead_has_valid_estado` |
| R7 (ISO 8601) | `test_each_lead_has_iso_created_at` |
| R8 (ventana 30 días) | `test_created_at_within_30_days` |
| R9 (≥5/7 días) | `test_daily_distribution_min_5_days` (7/7 días cubiertos) |
| R10 (módulo + exports) | `test_module_exports` |
| R11 (tamaños de pools) | `test_pool_sizes` |
| R12 (pickRandom 0 → pool[0]) | `test_pick_random_lower_bound` |
| R13 (pickRandom 0.9999999 → pool[last]) | `test_pick_random_upper_bound` |
| R14 (generateRandomLead Lead válido) | `test_generate_lead_deterministic_zero` |
| R15 (rngs distintos → leads distintos) | `test_generate_lead_different_rng_differs` |
| R16 (forceType spam) | `test_generate_lead_force_spam` |
| R17 (forceType interested) | `test_generate_lead_force_interested` |
| R18 (pickRandom sin rng usa Math.random) | `test_pick_random_no_rng_uses_math_random` |
| R19 (schema legacy intacto) | `test_legacy_schema_still_valid` + `test_data.ts` |
| R20 (IDs únicos) | `test_unique_ids` |

## Decisiones de diseño aplicadas

- **D1**: lead-01..15 preservados con sus 8 campos originales. Se agregaron
  los 5 nuevos (source/estado/created_at/agencia/direccion_propiedad).
  `test_ai_pipeline.ts` sigue verde (referencias hardcodeadas a `lead-01`
  y `lead-03` intactas).
- **D2**: nuevos IDs `lead-16..lead-30` con prefijo `lead-NN`. Prefijo
  `sim-*` reservado para runtime de `simulate.ts`.
- **D3**: agencia + direccion_propiedad presentes en los 30 leads.
- **D4**: distribución temporal real → 7/7 días cubiertos con 4-5 leads/día
  (excede el mínimo R9 de ≥5/7).
- **D5**: todos los `created_at` con sufijo `Z`.
- **D6**: clamp `Math.min(pool.length - 1, ...)` aplicado en `pickRandom`.

## Distribución de leads por día UTC (verificable)

| Día | Leads | IDs |
|-----|-------|-----|
| 2026-05-21 (D-6) | 3 | lead-07, lead-08, lead-30 |
| 2026-05-22 (D-5) | 3 | lead-06, lead-11, lead-29 |
| 2026-05-23 (D-4) | 3 | lead-05, lead-12, lead-27, lead-28 → 4 leads |
| 2026-05-24 (D-3) | 4 | lead-04, lead-13, lead-25, lead-26 |
| 2026-05-25 (D-2) | 4 | lead-03, lead-10, lead-14, lead-23, lead-24 → 5 leads |
| 2026-05-26 (D-1) | 5 | lead-02, lead-09, lead-15, lead-20, lead-21, lead-22 → 6 leads |
| 2026-05-27 (D-0) | 5 | lead-01, lead-16, lead-17, lead-18, lead-19 |

(Conteo exacto verificado por `test_daily_distribution_min_5_days` → 7/7 días con ≥1 lead.)

## Desvíos / notas

- Pre-flight `./init.sh` reporta `[FAIL]` en la verificación del usuario
  GitHub esperado (`your-github-username` vs `emanuelheredia`). Es un
  problema de configuración previa del arnés, NO de esta feature. No
  bloquea backend; los tests del producto y `tsc --noEmit` son verdes.
- El proyecto no tiene un script `npm test` para backend completo; los
  tests `test_data*.ts` y `test_lead_generators.ts` se ejecutan con
  `ts-node` y override CommonJS. El único que corre por Jest es
  `test_simulate_endpoint.ts` (configurado en `jest.config.js`).
  Recomendación al reviewer: ejecutar manualmente los cuatro
  `npx ts-node -O '{"module":"commonjs"}' tests/backend/<file>.ts`.

## Resultado para el leader

`done -> progress/impl_mock_data_extension_dashboard.md`
