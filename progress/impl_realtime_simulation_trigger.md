# impl_realtime_simulation_trigger

done -> progress/impl_realtime_simulation_trigger.md

---

## Tareas completadas

- [x] T1 — tailwind.config.js creado con keyframe `enter` (0%: opacity 0, translateY -16px → 100%: opacity 1, translateY 0) y clase `animate-enter: "enter 0.6s ease-out forwards"`. Sin dependencias npm adicionales. Cubre R19.

- [x] T2 — product/backend/api/leads/simulate.ts creado con handler POST, guards de metodo (405) y tipo (400), templates INTERESTED_TEMPLATE y SPAM_TEMPLATE exactos del design.md §4, generacion de id "sim-" + Date.now(), carga de properties_mock.json, invocacion de filterCandidateProperties + analyseLeadWithAI, respuesta { lead, analysis } y captura de errores con HTTP 500. Re-export en pages/api/leads/simulate.ts. Cubre R1-R7.

- [x] T3 — product/frontend/components/SimulatorPanel.tsx creado con estado loading/error, dos botones etiquetados "Simular Lead Interesado" y "Simular Lead Spam", deshabilitacion durante carga con texto "Simulando...", mensaje de error con role="alert", fetch a /api/leads/simulate con body { type }. Cubre R8-R12.

- [x] T4 — product/frontend/components/LeadCard.tsx modificado: prop isNew?: boolean, useEffect con setTimeout 600ms que activa/desactiva clase animate-enter en el elemento <li>. product/frontend/components/LeadsFeed.tsx modificado para propagar prop newLeadId. Cubre R18.

- [x] T5 — pages/index.tsx modificado: estado leads cambio de const a useState, nuevo estado spamLeads: LeadWithScore[], funcion scoreToUrgency, handler handleLeadSimulated que separa leads no-spam (feed principal) de spam (spamLeads), estado newLeadId con limpieza a 700ms. Cubre R13-R15.

- [x] T6 — pages/index.tsx: SimulatorPanel montado con onLeadSimulated={handleLeadSimulated} encima del LeadsFeed. Cubre R8, R13.

- [x] T7 — pages/index.tsx: seccion "Leads Spam Detectados" con icono ⚠, visible solo cuando spamLeads.length > 0, contenedor div con bg-red-950, LeadCard por cada item spam. Cubre R16-R17.

- [x] T8 — tests/backend/test_simulate_endpoint.ts: 6 tests Jest con jest.mock de ai_analyser. Cubre R20. Sin llamadas reales a Claude API.

- [x] T9 — tests/frontend/test_simulator_panel.tsx: 6 tests RTL con global.fetch = jest.fn(). Cubre R21.

- [x] T10 — tests/frontend/test_simulation_integration.tsx: 4 tests RTL con IntegrationDashboard. Cubre R22.

---

## Resultado de tests

npx jest --no-coverage

Test Suites: 6 passed, 6 total
Tests:       38 passed, 38 total
Snapshots:   0 total
Time:        ~5.4s

Suites ejecutadas:
- tests/backend/test_simulate_endpoint.ts: 6 tests (nuevos)
- tests/frontend/test_simulator_panel.tsx: 6 tests (nuevos)
- tests/frontend/test_simulation_integration.tsx: 4 tests (nuevos)
- tests/frontend/test_feed.tsx: 7 tests (sin regresiones)
- tests/frontend/test_lead_detail_panel.tsx: sin fallos
- tests/frontend/test_use_lead_analysis.tsx: sin fallos

---

## Trazabilidad R<n> → test/check

| Req | Test/check |
|-----|------------|
| R1 | test_simulate_endpoint: returns_200_with_lead_and_analysis_for_interested |
| R2 | test_simulate_endpoint: returns_200_with_lead_and_analysis_for_interested (verificacion de campos) |
| R3 | test_simulate_endpoint: returns_200_with_lead_and_analysis_for_spam (verificacion de campos) |
| R4 | test_simulate_endpoint: returns_400_for_invalid_type, returns_400_when_type_is_missing |
| R5 | test_simulate_endpoint: returns_405_for_GET_method |
| R6 | test_simulate_endpoint: mockAnalyseLeadWithAI invocado, analysis en respuesta |
| R7 | test_simulate_endpoint: returns_500_when_analyseLeadWithAI_throws |
| R8 | test_simulator_panel: renders_both_buttons_with_correct_labels |
| R9 | test_simulator_panel: disables_buttons_and_shows_loading_text_while_loading |
| R10 | test_simulator_panel: calls_onLeadSimulated_with_result_when_simulating_interested_lead |
| R11 | test_simulator_panel: calls_onLeadSimulated_with_result_when_simulating_spam_lead |
| R12 | test_simulator_panel: shows_error_message_when_fetch_returns_error_status, re_enables_buttons_after_fetch_error |
| R13 | test_simulation_integration: non_spam_lead_appears_in_main_feed_sorted_by_trust_score |
| R14 | test_simulation_integration: non_spam_lead_appears_in_main_feed_sorted_by_trust_score |
| R15 | test_simulation_integration: spam_lead_appears_in_spam_section_not_in_main_feed |
| R16 | test_simulation_integration: spam_section_not_rendered_when_no_spam_leads, spam_lead_appears_in_spam_section |
| R17 | test_simulation_integration: spam_lead_container_has_bg_red_950_class |
| R18 | LeadCard.tsx: useEffect + setTimeout 600ms + animate-enter class (verificacion visual manual) |
| R19 | tailwind.config.js: keyframe enter definido, sin deps npm adicionales |
| R20 | tests/backend/test_simulate_endpoint.ts: 6 casos cubriendo todos los escenarios EARS |
| R21 | tests/frontend/test_simulator_panel.tsx: 6 casos cubriendo todos los escenarios EARS |
| R22 | tests/frontend/test_simulation_integration.tsx: 4 casos cubriendo todos los escenarios EARS |

---

## Decisiones relevantes

1. jest.config.js extendido a proyectos (frontend + backend) con testEnvironment node para backend. El archivo test_simulate_endpoint.ts se agrego al glob del proyecto backend.

2. Nesting DOM `<li>` dentro de `<li>`: LeadCard renderiza <li>. La seccion spam usaba <li> como wrapper segun design.md §7. Se corrigio usando <div class="bg-red-950"> + <ul> interno antes de LeadCard para evitar hydration error y warnings de RTL.

3. leads en pages/index.tsx cambio de const a useState para permitir insercion de leads simulados no-spam manteniendo los leads mock iniciales.

4. LeadsFeed recibio prop newLeadId?: string | null para propagar isNew a LeadCard sin romper la interfaz existente (prop opcional).

5. Retrocompatibilidad total con /api/leads/analyze: no se modifico analyze.ts ni useLeadAnalysis. Los 21 tests previos siguen verdes.
