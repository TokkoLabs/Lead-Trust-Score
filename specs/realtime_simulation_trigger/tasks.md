# Tasks — realtime_simulation_trigger

Implementer: fullstack
Marca cada tarea con `[x]` al completarla. El reviewer rechaza si queda alguna `[ ]` sin justificacion.

---

- [x] T1 — Añadir keyframe `enter` y utilidad `animate-enter` en `tailwind.config.js` bajo `theme.extend`. Cubre: R19.

- [x] T2 — Crear `product/backend/api/leads/simulate.ts`: handler `POST /api/leads/simulate` con guards de metodo (R5) y tipo (R4), templates INTERESTED_TEMPLATE y SPAM_TEMPLATE (R2, R3), generacion de `id: "sim-" + Date.now()`, carga de `properties_mock.json`, llamada a `filterCandidateProperties` + `analyseLeadWithAI`, respuesta `{ lead, analysis }` (R1, R6) y captura de errores con HTTP 500 (R7). Cubre: R1, R2, R3, R4, R5, R6, R7.

- [x] T3 — Crear `product/frontend/components/SimulatorPanel.tsx`: estado `loading` y `error`, botones "Simular Lead Interesado" y "Simular Lead Spam" con prop `onLeadSimulated`, deshabilitar botones durante carga y mostrar texto "Simulando..." (R9), mensaje de error en pantalla cuando fetch falla (R12), llamadas fetch a `/api/leads/simulate` para cada tipo (R10, R11). Cubre: R8, R9, R10, R11, R12.

- [x] T4 — Modificar `product/frontend/components/LeadCard.tsx`: añadir prop opcional `isNew?: boolean` al interface `LeadCardProps`, aplicar `animate-enter` al `<li>` cuando `isNew` es `true`, y limpiar la clase tras 600ms con `useEffect` + `setTimeout`. Cubre: R18.

- [x] T5 — Modificar `pages/index.tsx`: añadir estado `spamLeads: LeadWithScore[]`, funcion helper `scoreToUrgency(score: number): Urgency`, handler `handleLeadSimulated` que actualiza `leads` o `spamLeads` segun `analysis.is_spam` (R13, R14, R15), y rastrear qué lead es `isNew` con un estado `newLeadId: string | null` que se limpia a los 700ms para pasar la prop a `LeadCard`. Cubre: R13, R14, R15.

- [x] T6 — Modificar `pages/index.tsx`: montar `SimulatorPanel` con `onLeadSimulated={handleLeadSimulated}` encima del `LeadsFeed` en el area principal del dashboard. Cubre: R8, R13.

- [x] T7 — Modificar `pages/index.tsx`: añadir seccion JSX "Leads Spam Detectados" debajo del feed principal, renderizada solo cuando `spamLeads.length > 0`, con contenedor `bg-red-950`, icono de alerta `⚠` y un `LeadCard` por cada item de `spamLeads`. Cubre: R16, R17.

- [x] T8 — Crear `tests/backend/test_simulate_endpoint.ts`: mock de `analyseLeadWithAI` con `jest.mock`, casos de prueba para respuesta 200 con `type: "interested"` (verificar campos de `lead` y presencia de `analysis`), respuesta 200 con `type: "spam"` (verificar email de dominio temporal, presupuesto 0 y `analysis` presente), respuesta 400 para `type` invalido, y respuesta 405 para metodo GET. Sin llamadas reales a Claude API. Cubre: R20, R1, R2, R3, R4, R5, R6, R7.

- [x] T9 — Crear `tests/frontend/test_simulator_panel.tsx`: `global.fetch = jest.fn()`, casos de prueba para: ambos botones visibles por su label, botones deshabilitados y texto "Simulando..." durante carga, callback `onLeadSimulated` invocado con el fixture JSON al simular lead interesado, callback `onLeadSimulated` invocado con el fixture JSON al simular lead spam, y mensaje de error visible cuando fetch retorna status 500. Cubre: R21, R8, R9, R10, R11, R12.

- [x] T10 — Crear `tests/frontend/test_simulation_integration.tsx`: casos de prueba para: lead no-spam insertado en feed principal y ordenado por `trust_score`, lead con `is_spam: true` aparece en seccion "Leads Spam Detectados" y no en el feed principal, y seccion spam no renderizada cuando `spamLeads` esta vacio. Cubre: R22, R14, R15, R16, R17.
