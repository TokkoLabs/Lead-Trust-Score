# Tasks — ai_scoring_pipeline

> Feature: Pipeline de Analisis con Claude API (JSON estructurado)
> El `backend_implementer` marca `[x]` cada tarea al completarla.
> El `reviewer` rechaza si queda alguna `[ ]` sin justificacion documentada.

---

- [x] T1 — Instalar dependencia `@anthropic-ai/sdk` en `package.json` (si no esta presente). Cubre: R17.

- [x] T2 — Crear `product/types/lead_analysis.ts` con la interfaz `LeadAnalysis` (todos los campos del esquema) y la clase `AIResponseParseError extends Error`. Cubre: R4, R9, R10.

- [x] T3 — Crear `product/backend/services/ai_analyser.ts`: implementar `filterCandidateProperties(lead, catalog)` con las reglas de coincidencia por zona y tipo, deduplicacion por id y fallback de 5 propiedades. Cubre: R7.

- [x] T4 — En `ai_analyser.ts`: implementar `validateLeadAnalysis(raw: unknown): LeadAnalysis` que verifique presencia de todos los campos requeridos, tipos correctos y rango 0–100 para scores numericos; lanzar `AIResponseParseError` en cada caso de fallo. Exportar la funcion para permitir su uso en tests. Cubre: R8, R9, R10.

- [x] T5 — En `ai_analyser.ts`: leer `ANTHROPIC_API_KEY` desde `process.env` al inicializar el cliente de Anthropic; si no esta definida, lanzar `Error("ANTHROPIC_API_KEY is not set")` inmediatamente. Cubre: R1, R2.

- [x] T6 — En `ai_analyser.ts`: implementar `analyseLeadWithAI(lead, matchingProperties)` que construya el system prompt y el user prompt segun el diseno, llame a `claude-sonnet-4-6` usando el SDK `@anthropic-ai/sdk`, extraiga el texto de la respuesta, aplique `JSON.parse` y pase el resultado a `validateLeadAnalysis`. Cubre: R3, R5, R6, R16, R17.

- [x] T7 — Crear `product/backend/api/leads/analyze.ts` como Pages Router handler (`NextApiRequest` / `NextApiResponse`). Implementar las validaciones de entrada (`leadId` presente → 400, `leadId` encontrado en mock → 404), el flujo de llamada a `filterCandidateProperties` + `analyseLeadWithAI`, la respuesta HTTP 200 con el objeto `LeadAnalysis`, y el catch-all para HTTP 500. Cubre: R11, R12, R13, R14, R15.

- [x] T8 — Verificar que el handler de `product/backend/api/leads/analyze.ts` sea accesible como `POST /api/leads/analyze` en la configuracion de Next.js (confirmar que el archivo esta o es importado desde `pages/api/leads/analyze.ts`). Cubre: R11.

- [x] T9 — Crear `tests/backend/test_ai_pipeline.ts` con los casos `test_valid_response`, `test_missing_trust_score`, `test_missing_is_spam`, `test_missing_property_match_ids`, `test_invalid_json_string` y `test_score_out_of_range` usando `assert` nativo de Node.js e importando `validateLeadAnalysis` directamente (sin llamadas reales a la API). Cubre: R18, R19, R20.

- [x] T10 — Anadir a `tests/backend/test_ai_pipeline.ts` los casos `test_filter_by_zona`, `test_filter_by_tipo` y `test_filter_fallback` importando `filterCandidateProperties` con datos de `leads_mock.json` y `properties_mock.json`. Cubre: R7, R18.

- [x] T11 — Confirmar que el test se puede ejecutar con `ts-node tests/backend/test_ai_pipeline.ts` desde la raiz sin errores de compilacion ni de asercion. Cubre: R18, R19, R20.

- [x] T12 — Documentar el mapa de trazabilidad en `progress/impl_ai_scoring_pipeline.md` con la tabla `R<n> → <nombre_del_test>`. Cubre: todos los R.
