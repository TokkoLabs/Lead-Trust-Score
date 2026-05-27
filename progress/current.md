# Sesion actual

> Este archivo se vacia al cerrar cada sesion y se mueve a `history.md`.
> Mientras trabajas, **mantenlo actualizado en tiempo real**, no al final.

- **Feature en curso:** realtime_simulation_trigger
- **Inicio:** 2026-05-27
- **Agente:** implementer (fullstack)

## Plan

1. T1 — tailwind.config.js: keyframe enter + animate-enter
2. T2 — product/backend/api/leads/simulate.ts: handler POST
3. T3 — product/frontend/components/SimulatorPanel.tsx: componente
4. T4 — product/frontend/components/LeadCard.tsx: prop isNew + animate-enter
5. T5 — pages/index.tsx: spamLeads, handleLeadSimulated, newLeadId
6. T6 — pages/index.tsx: montar SimulatorPanel
7. T7 — pages/index.tsx: seccion spam JSX
8. T8 — tests/backend/test_simulate_endpoint.ts
9. T9 — tests/frontend/test_simulator_panel.tsx
10. T10 — tests/frontend/test_simulation_integration.tsx

## Bitacora

- product/types/lead.ts: Lead interface con tipo_propiedad nullable
- product/backend/services/ai_analyser.ts: analyseLeadWithAI, filterCandidateProperties
- pages/index.tsx: estado leads (const), aiScores, selectedLeadId
- tailwind.config.js: no existe aun, hay que crearlo
- jest.config.js: testMatch solo frontend; backend usa ts-node

## Proximo paso

Implementar T1 -> T10 en orden
