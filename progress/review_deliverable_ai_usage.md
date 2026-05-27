# Review — feature 9 deliverable_ai_usage

**Veredicto:** APPROVED

Feature documental (`sdd: false`, `layer: docs`). Sin `specs/`, sin tests obligatorios.
Verificación 100% por lectura del repo.

---

## Trazabilidad acceptance ↔ contenido del AI_USAGE.md

- **A1 (5 secciones requeridas: Stack / Arquitectura / Patrones / Decisiones / Aprendizajes):** [x]
  - `## 1. Stack de IA` (L17)
  - `## 2. Arquitectura del uso (runtime vs proceso de dev)` (L43)
  - `## 3. Patrones avanzados` (L180)
  - `## 4. Decisiones` (L249)
  - `## 5. Aprendizajes` (L263)
  - Plus tabla de contenidos (L7-13) y bloque "Referencias rápidas" (L281).
  - El nombre exacto del enunciado dice "runtime vs dev"; el documento usa "runtime vs proceso de dev". Considero equivalente — la palabra "proceso de" agrega claridad, no oculta nada.

- **A2 (Stack lista modelos y SDKs: Claude API, `@anthropic-ai/sdk` en backend, Claude Code + subagentes en dev):** [x]
  - Modelo: `claude-sonnet-4-6` citado con archivo+línea exacta (L23). Verificado en `ai_analyser.ts:187` (`model: 'claude-sonnet-4-6'`).
  - SDK: `@anthropic-ai/sdk` versión `^0.30.1` (L24). Verificado en `package.json:13` (`"@anthropic-ai/sdk": "^0.30.1"`).
  - Cliente: `new Anthropic({ apiKey })` (L25). Verificado en `ai_analyser.ts:19`.
  - Claude Code + 9 subagentes (L35-37). Verificado: 9 archivos en `.claude/agents/` (`backend_implementer`, `backend_reviewer`, `docker_manager`, `frontend_implementer`, `frontend_reviewer`, `implementer`, `leader`, `reviewer`, `spec_author`).
  - TODO sobre el slug oficial del modelo (L29) está justificado y declarado — no es inflado, es transparente.

- **A3 (Arquitectura distingue runtime vs dev):** [x]
  - §2.1 diagrama ASCII completo Navegador → POST `/api/leads/analyze` → handler → `ai_analyser.ts` → Claude API → JSON (L47-94). Coincide con el código real verificado abajo en "Fidelidad al repo".
  - §2.2 diagrama del flujo SDD `pending → spec_author → spec_ready → ⏸ humano → in_progress → implementer + docker_manager → reviewer → done` (L110-166). Coincide con `.claude/agents/leader.md`.

- **A4 (Patrones avanzados: JSON estricto + leader/subagentes + anti-teléfono + SMOKE_MOCK_AI):** [x]
  - §3.1 JSON estricto por system prompt — cita L142-163 del `ai_analyser.ts` (verificado: el prompt empieza en L142 con `const systemPrompt = ...` y termina en L163 con el último criterio).
  - §3.2 Separación leader/subagentes — cita el front-matter de `leader.md` (verificado: `tools: Read, Glob, Grep, Bash, Agent`, sin Write/Edit).
  - §3.3 Regla anti-teléfono-descompuesto — referencia concreta a `progress/impl_*.md` y `progress/review_*.md` reales.
  - §3.4 `SMOKE_MOCK_AI` documentado como **NO implementado** — verificado: `grep -n SMOKE_MOCK_AI product/backend/services/ai_analyser.ts` devolvió exit=1 (cero ocurrencias).
  - Bonus: §3.5 trazabilidad R→test, §3.6 spec EARS.

- **A5 (Decisiones: ≥3 trade-offs reales con justificación):** [x]
  - Tabla con **7 decisiones** (L251-259). Las 3 sugeridas (JSON estricto vs free-form/tool use, Pages Router vs App Router, monolito Next.js vs servicios separados) presentes y bien argumentadas.
  - Extras coherentes con el repo: datos mock vs DB, mocks de tests vs API real, leader sin Write/Edit, feature 7 descartada (caveat menor más abajo).

- **A6 (Aprendizajes: 3-5 insights honestos):** [x] — el documento entrega **7**, mismo orden de magnitud y todos respaldados.
  - Aprendizaje 1 (puerta humana) — coherente con el flujo SDD documentado.
  - Aprendizaje 2 (markdown que escapa al system prompt) — respaldado por el strip defensivo real en `ai_analyser.ts:207`.
  - Aprendizaje 3 (SDK 0.x friccionoso) — respaldado por el `if (content.type !== 'text')` real en `ai_analyser.ts:200-202`.
  - Aprendizaje 4 (Docker en host del reviewer como bloqueo) — respaldado por `progress/review_realtime_simulation_trigger.md` y `progress/review_docker_setup.md` (ambos archivos existen).
  - Aprendizaje 5 (anti-teléfono como memoria larga) — respaldado por el contenido observable de `progress/`.
  - Aprendizaje 6 (mocks vs API real como punto ciego) — consistente con §3.4 y §4-decisión-5.
  - Aprendizaje 7 (el stack de IA es más que el SDK) — síntesis honesta del documento.
  - Ninguno suena a marketing genérico; cada uno apunta a fricción real o archivo concreto.

- **A7 (Honestidad: documentar lo que no salió como planeado):** [x]
  - §3.4 dice explícitamente "no implementado" sobre `SMOKE_MOCK_AI` y muestra el comando grep usado.
  - §4 decisión 7 admite que la feature 7 `docker_smoke_test` fue descartada y que el smoke E2E quedó como verificación manual.
  - §4 decisión 5 admite punto ciego de mockear la API.
  - §5 aprendizaje 4 documenta la fricción real con Docker en el host del reviewer.

---

## Fidelidad al repo (cross-check con código)

- **§1 Modelo y SDK coinciden con package.json / ai_analyser.ts:** [x]
  - `claude-sonnet-4-6` en `ai_analyser.ts:187` ✓
  - `@anthropic-ai/sdk` `^0.30.1` en `package.json:13` ✓
  - `new Anthropic({ apiKey })` en `ai_analyser.ts:19` ✓
  - Throw si `ANTHROPIC_API_KEY` falta en `ai_analyser.ts:14-17` ✓
  - El TODO sobre el slug es honestidad, no debilidad.

- **§2.1 Ruta del request coincide con pages/api/leads/analyze.ts y product/backend/api/leads/analyze.ts:** [x]
  - `pages/api/leads/analyze.ts` es efectivamente un re-export de una línea (`export { default } from '../../../product/backend/api/leads/analyze'`). ✓
  - `product/backend/api/leads/analyze.ts` hace: guard POST → validar `leadId` → `fs.readFileSync` de `leads_mock.json` y `properties_mock.json` → buscar lead → 404 si no existe → `filterCandidateProperties` → `analyseLeadWithAI` → 200 con JSON o 500 capturado. ✓
  - El diagrama del documento (L47-94) describe exactamente los 7 pasos del handler real.

- **§2.2 Flujo SDD coincide con `.claude/agents/leader.md`:** [x]
  - El diagrama L110-166 enumera `spec_author → spec_ready → puerta humana → in_progress → implementer + docker_manager → reviewer → done`. Coincide con el protocolo del leader y con la tabla de enrutamiento por `layer` declarada en su front-matter.
  - El conteo de 9 subagentes coincide con `ls .claude/agents/`.

- **§3 Patrón JSON estricto soporta lo dicho en ai_analyser.ts:** [x]
  - El system prompt (L142-163 del código) efectivamente dice "UNICAMENTE un objeto JSON valido... sin texto adicional, sin bloques de codigo markdown, sin explicaciones".
  - El "strip defensivo" (`/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/`) está en `ai_analyser.ts:207`. ✓
  - `validateLeadAnalysis()` cubre tipos, rango 0-100, presencia de cada campo (L64-129 del código), levantando `AIResponseParseError`. ✓

- **§3 `SMOKE_MOCK_AI` declarado coherente con el grep al código:** [x]
  - `grep -n SMOKE_MOCK_AI product/backend/services/ai_analyser.ts` → exit=1 (cero ocurrencias). Reproduce exactamente la verificación que el documento muestra en su bloque de código.

- **§4 Decisiones documentadas se sostienen con el código observable:** [x]
  - Decisión 1 (JSON estricto + validador propio): visible en `ai_analyser.ts:142-163` (prompt) + `ai_analyser.ts:64-129` (validador). ✓
  - Decisión 2 (Pages Router): visible en `pages/api/leads/analyze.ts` (Pages Router clásico, no App Router). No hay carpeta `app/`. ✓
  - Decisión 3 (Monolito Next.js): visible en el único `package.json` con frontend + API routes + un solo proceso. ✓
  - Decisión 4 (mock JSON sobre disco): visible en `product/backend/data/leads_mock.json` (15 leads) y `properties_mock.json` (12 propiedades). El documento dice exactamente "15 leads" y "12 propiedades" en §2.1; verificado con `grep -c '"id":' → 15 y 12`. ✓
  - Decisión 5 (tests con env mock + `jest.mock`): coherente con `tests/backend/test_ai_pipeline.ts` y `test_simulate_endpoint.ts` (ambos existen).
  - Decisión 6 (leader sin Write/Edit): verificado en `leader.md` front-matter (`tools: Read, Glob, Grep, Bash, Agent`).
  - Decisión 7 (feature 7 descartada): caveat menor — ver "Honestidad" abajo.

- **§5 Aprendizajes respaldados por progress/:** [x]
  - El doc cita `progress/review_realtime_simulation_trigger.md`, `progress/review_docker_setup.md`, `progress/impl_docker_setup.md`. Los tres existen.
  - El bug del code-block markdown está empíricamente respaldado por la existencia del regex en el código de producción (no es teoría: el código tiene la línea, lo que significa que el bug pasó).

---

## Validación de links

- **28 links relativos** extraídos del `AI_USAGE.md` con `grep -oE '\]\(([^)#][^)]*)\)'` (excluyendo anchors intra-doc tipo `#1-stack-de-ia`).
- **28/28 OK** (verificado con un `test -e` por link). Ninguno `MISS`.
- Targets verificados incluyen: los 9 archivos de `.claude/agents/`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `feature_list.json`, `package.json`, `pages/api/leads/analyze.ts`, `product/backend/api/leads/analyze.ts`, `product/backend/services/ai_analyser.ts`, `product/backend/data/leads_mock.json`, `product/backend/data/properties_mock.json`, `product/types/lead_analysis.ts`, `tests/backend/test_ai_pipeline.ts`, `docker/scripts/`, `skills/feature-list/SKILL.md`, `progress/` y sus impl_*/history.md.

---

## Honestidad

- **Feature 7 `docker_smoke_test` descartada mencionada:** [x] — pero con caveat menor.
  - El documento §3.4 dice "La única referencia viva a `SMOKE_MOCK_AI` en el repo está en el acceptance histórico de la feature 7 `docker_smoke_test` dentro de `feature_list.json`". Esto es **levemente inexacto**: en el `feature_list.json` actual, la feature 7 es `deliverable_video_demo`, y la única mención de `SMOKE_MOCK_AI` en el JSON está en la línea 163 (dentro del propio acceptance de la feature **9** `deliverable_ai_usage`, no en la 7). La feature `docker_smoke_test` probablemente fue eliminada del JSON en algún punto (queda una carpeta `specs/docker_smoke_test/` vacía como huella histórica). El documento §4 decisión 7 también afirma "Feature 7 `docker_smoke_test` descartada", lo cual mantiene la misma imprecisión sobre la numeración.
  - El espíritu (descartada, no implementada, honesto sobre lo que no se hizo) es correcto. La inexactitud es de numeración / atribución, no de honestidad. No bloquea aprobación.

- **Sin marketing inflado sin sustento:** [x] — cada afirmación tiene archivo+línea o un archivo concreto detrás. Los aprendizajes apuntan a fricción real (Docker en host, SDK 0.x, code-block markdown del modelo), no a generalidades. El §5-7 ("el stack de IA es más que el SDK") es una reflexión integradora plausible, no marketing vacío.

- **Idioma:** español consistente en todo el documento. ✓

---

## Cambios requeridos

Ninguno bloqueante. Caveats menores (opcionales, no bloquean APPROVED):

1. (Opcional) En §3.4 y §4-decisión-7: precisar que la feature `docker_smoke_test` fue eliminada del `feature_list.json` actual y que el número 7 corresponde hoy a `deliverable_video_demo`. La mención actual ("la única referencia viva a SMOKE_MOCK_AI está en el acceptance histórico de la feature 7 docker_smoke_test dentro de feature_list.json") es imprecisa: en el JSON actual la única mención de `SMOKE_MOCK_AI` aparece dentro del acceptance de la feature **9** (este propio documento). La carpeta `specs/docker_smoke_test/` existe pero está vacía.

2. (Opcional) Confirmar el slug oficial del modelo `claude-sonnet-4-6` antes de la demo y cerrar el `<!-- TODO -->` de §1. El documento ya lo declara explícitamente, así que no es un defecto del entregable — pero queda como acción para el equipo.

Ambos puntos son refinamientos. El documento cumple los 7 ítems del `acceptance` de la feature 9 y se sostiene contra el código observable del repo.
