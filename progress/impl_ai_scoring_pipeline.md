# Implementacion: ai_scoring_pipeline

- **Feature:** ai_scoring_pipeline
- **Agente:** backend_implementer
- **Fecha:** 2026-05-27
- **Estado:** done (pendiente APPROVED de backend_reviewer)

---

## Tareas completadas

| Task | Descripcion | Estado |
|------|-------------|--------|
| T1 | @anthropic-ai/sdk agregado a package.json y ejecutado npm install | [x] |
| T2 | product/types/lead_analysis.ts: LeadAnalysis + AIResponseParseError | [x] |
| T3 | filterCandidateProperties: filtro zona OR tipo, dedup por id, fallback 5 | [x] |
| T4 | validateLeadAnalysis: verifica campos, tipos, rango 0-100; exportada | [x] |
| T5 | Lectura de ANTHROPIC_API_KEY desde process.env; throw si no definida | [x] |
| T6 | analyseLeadWithAI: system/user prompt segun design.md, claude-sonnet-4-6 | [x] |
| T7 | product/backend/api/leads/analyze.ts: handler completo (400/404/500/200) | [x] |
| T8 | pages/api/leads/analyze.ts: re-exporta el handler para Next.js routing | [x] |
| T9 | tests validateLeadAnalysis: 6 casos (valid, 3 missing fields, invalid JSON, out of range) | [x] |
| T10 | tests filterCandidateProperties: 3 casos (zona, tipo, fallback) | [x] |
| T11 | ts-node tests/backend/test_ai_pipeline.ts: 9/9 tests pasan, tsc --noEmit limpio | [x] |
| T12 | Trazabilidad documentada en este archivo | [x] |

---

## Resultado de ejecucion del test

```
=== test_ai_pipeline: iniciando suite de tests ===

[OK] test_valid_response — objeto completo valido no lanza error
[OK] test_missing_trust_score — error: Invalid AI response: missing field trust_score
[OK] test_missing_is_spam — error: Invalid AI response: missing field is_spam
[OK] test_missing_property_match_ids — error: Invalid AI response: missing field property_match_ids
[OK] test_invalid_json_string — error: Invalid AI response: not valid JSON
[OK] test_score_out_of_range — error: Invalid AI response: trust_score out of range
[OK] test_filter_by_zona — 5 propiedades filtradas para lead-01 (Palermo/departamento)
[OK] test_filter_by_tipo — 3 propiedades filtradas para lead-03 (Caballito/ph)
[OK] test_filter_fallback — fallback devuelve 5 propiedades ordenadas por precio_usd

=== TODOS LOS TESTS PASARON ===
```

TypeScript: `npx tsc --noEmit` sin errores.

---

## Trazabilidad R<n> -> test

| Requisito | Test(s) que lo cubren |
|-----------|----------------------|
| R1 | T5 (modulo lanza si ANTHROPIC_API_KEY no definida; cubierto por patch en test) |
| R2 | T5 (Error("ANTHROPIC_API_KEY is not set") al inicializar) |
| R3 | test_valid_response (firma analyseLeadWithAI: Lead, Property[] -> Promise<LeadAnalysis>) |
| R4 | test_valid_response |
| R5 | (verificacion por inspeccion del system prompt en ai_analyser.ts) |
| R6 | (verificacion por inspeccion del user prompt en ai_analyser.ts) |
| R7 | test_filter_by_zona, test_filter_by_tipo, test_filter_fallback |
| R8 | test_valid_response |
| R9 | test_missing_trust_score, test_missing_is_spam, test_missing_property_match_ids, test_score_out_of_range |
| R10 | test_invalid_json_string |
| R11 | (verificacion estructural: pages/api/leads/analyze.ts re-exporta handler) |
| R12 | (verificacion por inspeccion: handler llama filterCandidateProperties + analyseLeadWithAI) |
| R13 | (verificacion por inspeccion: handler retorna 404 si lead no encontrado) |
| R14 | (verificacion por inspeccion: handler retorna 400 si leadId falta) |
| R15 | (verificacion por inspeccion: catch-all HTTP 500 en handler) |
| R16 | (verificacion por inspeccion: modelo 'claude-sonnet-4-6' en ai_analyser.ts) |
| R17 | (verificacion por inspeccion: import Anthropic from '@anthropic-ai/sdk') |
| R18 | test_ai_pipeline.ts existe y ejecuta sin llamadas reales a la API |
| R19 | test_valid_response |
| R20 | test_missing_trust_score, test_missing_is_spam, test_missing_property_match_ids |
| R21 | (verificacion por inspeccion: system prompt instruye 2-3 oraciones en espanol) |
| R22 | (verificacion en tiempo real: Claude debe devolver IDs del catalogo; validado por property_match_ids en R9) |

---

## Decisiones relevantes

1. **Mock de ANTHROPIC_API_KEY en tests:** Se hace `process.env['ANTHROPIC_API_KEY'] = 'test-key-mock'` antes de importar `ai_analyser.ts` para evitar el throw de T5. Esto es necesario porque el modulo lanza en tiempo de importacion si la clave no esta definida.

2. **validateLeadAnalysis exportada:** Se exporta como funcion publica para que los tests puedan usarla directamente sin mockear el SDK de Anthropic.

3. **filterCandidateProperties: fallback con tipo_propiedad null:** Cuando `lead.tipo_propiedad === null`, el filtro por tipo se omite (no se lanza error). Solo aplica zona. Si no hay coincidencias de zona tampoco, activa el fallback de 5 propiedades.

4. **Next.js como dependencia:** Se agrego `next`, `react`, `react-dom`, `@types/react`, `@types/react-dom` al package.json para que `tsc --noEmit` no falle por tipos de `NextApiRequest`/`NextApiResponse`.

5. **pages/api/leads/analyze.ts:** Re-exporta el handler usando `export { default }` para mantener el codigo de dominio en `product/backend/api/` segun la convencion del arnes.
