# Feature 18 — unified_random_lead_simulator (impl)

## Plan

Refactor end-to-end del simulador de leads sintéticos: unificar los dos
botones del SimulatorPanel en un único trigger sobre el botón primario del
PageHeader y randomizar los atributos del lead vía
`generateRandomLead` (feature 10).

### Tareas backend

1. Extender `product/backend/api/leads/simulate.ts`:
   - Aceptar body opcional `{ type?: 'random' | 'interested' | 'spam' }`.
   - Default `type='random'` cuando body ausente o `type=undefined`.
   - Para `random`: tirar Math.random() < 0.8 → 'interested', else 'spam'.
   - Generar el lead con `generateRandomLead(undefined, { forceType })`.
   - Mantener el contrato `{ lead, analysis }`.
2. Actualizar `tests/backend/test_simulate_endpoint.ts` para que los
   asserts pasados consulten pertenencia a pools (interested/spam) en vez
   de igualdad estricta con templates hardcodeadas; eliminar el caso
   "type missing → 400" porque ahora por defecto es 'random'.
3. Crear `tests/backend/test_simulate_random.ts`:
   - (a) POST sin body → 200 + lead + analysis con campos mínimos.
   - (b) 200 muestras con `Math.random` seedeado por jest.spyOn →
     ratio interested/spam aproximado 80/20 (tolerancia ±15%).
   - (c) cada lead tiene `zona` en `ZONAS_POOL`, `mensaje` en
     `MENSAJES_INTERESTED_POOL ∪ MENSAJES_SPAM_POOL`, `source` en
     `SOURCES_POOL`, `created_at` ISO 8601 válido.
4. Actualizar `jest.config.js` para incluir el nuevo file backend en el
   `testMatch` (hoy es un match exacto).

### Tareas frontend

1. Eliminar `product/frontend/components/SimulatorPanel.tsx`.
2. `pages/index.tsx`:
   - Añadir `simLoading`, `simError` y `handleSimulateLead()` que hace
     POST a `/api/leads/simulate` sin body.
   - Re-cablear `primaryAction` (dashboard y queue) a
     `handleSimulateLead` con `disabled`/`loading`.
   - Re-cablear `onNewLead` del `AppShell` (LeftRail rojo) al mismo
     handler para mantener consistencia.
   - Montar `<Toast variant="error">` cuando `simError !== null`.
3. `PageHeader.tsx`: extender `PageHeaderPrimaryAction` con
   `disabled?` y `loading?` opcionales. Mostrar spinner cuando
   `loading=true` y bloquear el botón.
4. `DashboardView.tsx`:
   - Eliminar el import y el render de `SimulatorPanel`.
   - El prop `onLeadSimulated` queda inutilizado: lo dejo como opcional
     por backwards compat con tests existentes — *en su lugar lo
     removeré totalmente* y actualizaré los call-sites.
5. Re-escribir/eliminar tests obsoletos:
   - `tests/frontend/test_simulator_panel.tsx`: ELIMINAR.
   - `tests/frontend/test_simulation_integration.tsx`: REESCRIBIR para
     simular el flujo via PageHeader (o eliminar — el nuevo
     `test_random_simulator_button.tsx` lo cubre end-to-end).
   - `tests/frontend/test_view_router.tsx`: reemplazar el aserto sobre
     "Simular Lead Interesado" por uno sobre la presencia del botón
     "+ Nuevo lead"/feed; mockear fetch en el test de R6 para que el
     click no haga llamada real.
6. Crear `tests/frontend/test_random_simulator_button.tsx`:
   - render Home, verificar único botón "+ Nuevo lead", click → fetch
     hacia `/api/leads/simulate` sin body, lead aparece en feed cuando
     `is_spam=false` y en sección spam cuando `is_spam=true`, estado
     loading + texto "Generando...", toast de error en 500.

## Trazabilidad

| AC                                            | Cobertura |
|-----------------------------------------------|-----------|
| AC1 endpoint body opcional + random 80/20     | `tests/backend/test_simulate_random.ts` (b) + endpoint default |
| AC2 contrato `{ lead, analysis }` preservado  | `tests/backend/test_simulate_endpoint.ts` (interested/spam) |
| AC3 elim SimulatorPanel + botón único         | `tests/frontend/test_random_simulator_button.tsx` (no antiguos) |
| AC4 flujo existente reutilizado               | `test_random_simulator_button.tsx` (insert feed/spam) |
| AC5 loading + toast error                     | `test_random_simulator_button.tsx` (loading + error) |
| AC6 tests backend random                      | `test_simulate_random.ts` (a, b, c) |
| AC7 test frontend único botón                 | `test_random_simulator_button.tsx` |

## Resultado

### Archivos modificados / creados / eliminados

Backend:
- `product/backend/api/leads/simulate.ts` — REWRITE: acepta `type?: 'random' | 'interested' | 'spam'`, default `random`, usa `generateRandomLead`.
- `tests/backend/test_simulate_endpoint.ts` — UPDATE: asserts ahora por pertenencia a pools, eliminado caso "missing → 400" (ahora default random → 200).
- `tests/backend/test_simulate_random.ts` — NEW: cubre (a) POST sin body, (b) ratio 80/20 sobre 200 muestras con `Math.random` mockeado por LCG, (c) campos en pools.
- `jest.config.js` — UPDATE: `testMatch` backend incluye los dos files.

Frontend:
- `product/frontend/components/SimulatorPanel.tsx` — DELETED.
- `tests/frontend/test_simulator_panel.tsx` — DELETED.
- `tests/frontend/test_simulation_integration.tsx` — DELETED (cubierto por el nuevo `test_random_simulator_button.tsx` que ejerce el flujo end-to-end via `Home`).
- `product/frontend/components/PageHeader.tsx` — UPDATE: `PageHeaderPrimaryAction` ahora soporta `disabled?` y `loading?`; render del botón añade spinner inline, `aria-busy`, y `disabled` cuando loading.
- `product/frontend/views/DashboardView.tsx` — UPDATE: elimina import + render de `SimulatorPanel`, elimina prop `onLeadSimulated`.
- `pages/index.tsx` — UPDATE: agrega `simLoading` + `simError` + `handleSimulateLead()` (POST sin body) que reutiliza `handleLeadSimulated`. `primaryAction` de Dashboard y Queue dispara la simulación. `<Toast variant="error">` global montado dentro de `AppShell`. `onNewLead` del rail también cablea al simulate.
- `tests/frontend/test_view_router.tsx` — UPDATE: removida referencia a "Simular Lead Interesado"; test del botón "+ Nuevo lead" mockea fetch.
- `tests/frontend/test_random_simulator_button.tsx` — NEW: cubre AC3, AC4, AC5, AC7.

### Trazabilidad final

| AC                                            | Cobertura |
|-----------------------------------------------|-----------|
| AC1 endpoint body opcional + random 80/20     | `simulate.ts` + `test_simulate_random.ts` test (b) |
| AC2 contrato `{ lead, analysis }` preservado  | `test_simulate_endpoint.ts` (interested + spam + random default) |
| AC3 elim SimulatorPanel + botón único         | `test_random_simulator_button.tsx` (`dashboard_does_not_render_legacy_simulator_buttons`, `dashboard_renders_single_new_lead_primary_button`) |
| AC4 flujo existente reutilizado               | `non_spam_lead_appears_in_feed_after_click`, `spam_lead_appears_in_spam_section_after_click` |
| AC5 loading + toast error                     | `button_shows_loading_state_during_fetch`, `error_response_shows_toast_with_role_status_and_re_enables_button` |
| AC6 tests backend random                      | `test_simulate_random.ts` (a, b, c) |
| AC7 test frontend único botón                 | `test_random_simulator_button.tsx` (todos) |

### Verificación

- `npx tsc --noEmit` → 0 errores.
- `npx jest --selectProjects backend` → 2 suites, 9 tests verdes.
- `npx jest --selectProjects frontend` → 16 suites, 130 tests verdes.
- Total: 18 suites, 139 tests verdes.
- `bash init.sh` → falla en check 4 (GitHub user esperado 'your-github-username' vs 'emanuelheredia') — pre-existing en el harness, no causado por esta feature.

