# Review — feature 8 deliverable_readme

**Veredicto:** APPROVED

## Trazabilidad acceptance ↔ contenido del README

- **A1 (secciones 1-8 en orden):** [x] — Tabla de contenidos en `README.md` líneas 9-16; encabezados:
  - `## 1. Qué es Lead Trust Copilot` (línea 20)
  - `## 2. Stack` (línea 30)
  - `## 3. Cómo se corre` (línea 48)
  - `## 4. Estructura del repo` (línea 94)
  - `## 5. Cómo desarrollamos: Harness Engineering + SDD` (línea 122)
  - `## 6. Arquitectura del backend` (línea 250)
  - `## 7. Entregables` (línea 343)
  - `## 8. Link al repo` (línea 354)
  Orden exacto.

- **A2 (§1 Qué es, 2-4 oraciones):** [x] — Líneas 22, 24 y 26. Tres párrafos cortos que describen el producto (dashboard agéntico inmobiliario), el output JSON estructurado de Claude (scores, `ai_summary`, `suggested_action`, `property_match_ids`) y la meta del hackaton.

- **A3 (§2 Stack con versiones):** [x] — Tabla en líneas 32-42. Next.js `^16.2.6` (Pages Router), React `^19.2.6`, TypeScript `^5.4.5`, Tailwind `^3.4.17`, `@anthropic-ai/sdk` `^0.30.1`, Jest + ts-jest `^30.4.2`, Docker + docker-compose, `node:20-alpine`. Cumple lista mínima exigida y añade modelo `claude-sonnet-4-6` (consistente con `ai_analyser.ts` línea 187).

- **A4 (§3 Quickstart):** [x] — Líneas 50-79. Secuencia completa: `git clone`, `cd`, `cp .env.example .env`, editar `ANTHROPIC_API_KEY`, `docker compose -f docker/docker-compose.yml up lead-trust-copilot`, abrir `http://localhost:3000`. Tiempo estimado de primer build "~10 minutos" en línea 50. Prerrequisitos (Docker Desktop + clave Anthropic) listados antes. Tabla de envs en 81-90.

- **A5 (§4 Estructura del repo):** [x] — Tabla en líneas 96-118 con 22+ filas top-level: `pages/`, `pages/api/leads/analyze.ts`, `product/`, `product/backend/`, `product/backend/data/`, `product/frontend/`, `product/types/`, `tests/`, `docker/`, `specs/`, `progress/`, `.claude/agents/`, `skills/`, `docs/`, `feature_list.json`, `init.sh`/`init.ps1`, `AGENTS.md`, `CLAUDE.md`, `CHECKPOINTS.md`. Una línea explicativa por entrada.

- **A6 (§5 Harness + SDD, subpuntos 5.1-5.8):** [x] — Todos los 8 subpuntos cubiertos uno a uno:
  - 5.1 (línea 124): Harness Engineering en una oración (arnés reproducible Docker + scripts + agentes + specs + progress).
  - 5.2 (línea 128): SDD Kiro-style requirements→design→tasks→code; puerta humana entre `spec_ready` e `in_progress` justificada como control editorial.
  - 5.3 (línea 140): Punto de entrada — `CLAUDE.md` pone a Claude en rol `leader`, le indica leer `AGENTS.md`, `feature_list.json`, `progress/current.md` y ejecutar `./init.sh`. Coincide con `CLAUDE.md` líneas 33-38 y `.claude/agents/leader.md` líneas 13-16.
  - 5.4 (línea 150): Diagrama ASCII completo `pending → [spec_author] → spec_ready → ⏸ HUMANO APRUEBA → in_progress → [implementer_* + docker_manager?] → [reviewer_*] → done`. Coincide literalmente con el flujo de `.claude/agents/leader.md` línea 25.
  - 5.5 (línea 171): Referencia a `skills/feature-list/SKILL.md` y mini-ejemplo JSON. Verifiqué el esquema contra `skills/feature-list/SKILL.md` líneas 39-54: campos `id`, `name`, `title`, `layer`, `description`, `acceptance`, `sdd`, `status` con `status: "pending"` al crear — consistentes.
  - 5.6 (línea 199): "El leader NO escribe código. Solo orquesta." + tabla por agente con destino de escritura + tabla de enrutamiento por `layer`. Coincide con `CLAUDE.md` líneas 20-29 y la tabla de escalado de `.claude/agents/leader.md` líneas 35-40 y 103-112.
  - 5.7 (línea 226): "Los tests NO los escribe el reviewer (no edita código). Los escribe el implementer durante la implementación, junto con la feature." Incluye que cada `R<n>` debe tener al menos un test, que el implementer documenta trazabilidad `R<n> → archivo:test` en `progress/impl_<feature>.md`, que el reviewer ejecuta `./docker/scripts/product-test.sh` y rechaza si falta cobertura, y cita explícitamente `"require_tests_to_close": true` (línea 234) referenciando `feature_list.json` (donde efectivamente aparece en la línea 6 de ese archivo). Subpunto crítico cumplido en su totalidad.
  - 5.8 (línea 240): Regla anti-teléfono-descompuesto explicada con ejemplos concretos (`spec_ready -> specs/<feature>/`, `done -> progress/impl_<feature>.md`, `APPROVED -> progress/review_<feature>.md`). Coincide con `CLAUDE.md` líneas 47-50 y `.claude/agents/leader.md` líneas 88-99.

- **A7 (§6 Arquitectura del backend, 6.1-6.6):** [x] — Los 6 subpuntos:
  - 6.1 (línea 252): Pages Router + delegación. El README dice que `pages/api/` re-exporta handlers desde `product/backend/api/`. **Verificado:** `pages/api/leads/analyze.ts` líneas 1-7 contiene exactamente `export { default } from '../../../product/backend/api/leads/analyze';` — thin re-export real.
  - 6.2 (línea 256): Diagrama ASCII completo Navegador → POST `/api/leads/analyze` → `pages/api/leads/analyze.ts` → `product/backend/api/leads/analyze.ts` (lee mocks, filtra propiedades candidatas, invoca `analyseLeadWithAI(...)`) → `product/backend/services/ai_analyser.ts` → Claude. **Verificado contra `product/backend/api/leads/analyze.ts`:** efectivamente lee `leads_mock.json` y `properties_mock.json` (líneas 38-39), busca el lead por `leadId` (línea 47), llama a `filterCandidateProperties()` (línea 55) y `analyseLeadWithAI()` (línea 56). Coincide 100% con la descripción del README.
  - 6.3 (línea 296): JSON estricto desde system prompt + `validateLeadAnalysis` lanza `AIResponseParseError`. **Verificado contra `ai_analyser.ts`:** system prompt en líneas 142-163 fuerza JSON con exactamente los campos listados en el README (`trust_score`, `conversion_score`, `urgency_score`, `is_spam`, `detected_intent`, `suggested_action`, `ai_summary`, `property_match_ids`); `validateLeadAnalysis` lanza `AIResponseParseError` (líneas 64-129). Coincide.
  - 6.4 (línea 314): Data layer mock con `leads_mock.json` y `properties_mock.json` leídos con `fs.readFileSync`. **Verificado:** `analyze.ts` líneas 38-39 usan `fs.readFileSync`. Coincide.
  - 6.5 (línea 322): Tipos compartidos en `product/types/{lead,property,lead_analysis}.ts`. Los tres archivos existen (verificado en grep de validación de links).
  - 6.6 (línea 332): `ANTHROPIC_API_KEY` inyectada en runtime via `env_file: ../.env`, no en el Dockerfile, `ai_analyser.ts` la lee con `process.env`, `.gitignore` excluye `.env`. **Verificado:** `docker/docker-compose.yml` líneas 11-12 (`env_file: - ../.env`), `docker/Dockerfile` no copia `.env` (solo `package.json`, `pages/`, `product/`, `styles/`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `next.config.js`), `ai_analyser.ts` línea 14 (`const apiKey = process.env['ANTHROPIC_API_KEY']`) y lanza si está ausente (línea 16). Coincide.

- **A8 (§7 Entregables con links a `deliverables/demo.mp4` y `AI_USAGE.md`):** [x] — Tabla en líneas 345-350. Ambos listados con descripción de 1 línea y marca explícita `(pendiente — feature 7 deliverable_video_demo)` / `(pendiente — feature 9 deliverable_ai_usage)`. Marcados como pendientes según la regla declarada por el implementer.

- **A9 (§8 URL GitHub):** [x] — Línea 356 `<https://github.com/<owner>/<repo>>` + comentario HTML TODO en línea 358 indicando reemplazo previo a entrega. Placeholder explícito.

- **A10 (links relativos válidos):** [x] — Verificado con `test -e` para 51 targets: todos `OK`. Ver bloque "Validación de links" abajo.

- **A11 (README anterior preservado en `docs/harness-readme.md`):** [x] — `docs/harness-readme.md` línea 1 abre con la nota de preservación: `> README original del template R2D2-Harness, preservado al pivotar el repo al producto Lead Trust Copilot el 2026-05-27.` Contiene el bloque previo del producto (líneas 3-49) y el template R2D2-Harness íntegro (líneas 51-205).

- **A12 (Idioma español consistente):** [x] — Todo el README está en español. Términos técnicos en inglés (Pages Router, JSON, Trust Score, etc.) son léxico apropiado.

## Validación de links

- 51/51 targets relativos verificados con `test -e`: [x] Todos resuelven a archivos/carpetas existentes en el repo.
- Placeholders documentados como pendientes: [x]
  - `https://github.com/<owner>/<repo>` (§3 y §8): documentado por el implementer en `progress/impl_deliverable_readme.md` como TODO para el humano, con comentario HTML `<!-- TODO -->` justo debajo en §8.
  - `deliverables/demo.mp4` (§7): marcado `(pendiente — feature 7)` en la tabla.
  - `AI_USAGE.md` (§7): marcado `(pendiente — feature 9)` en la tabla.

## Fidelidad al repo

- §5 coincide con `CLAUDE.md` y `.claude/agents/leader.md`: [x]
  - 5.3: punto de entrada (CLAUDE.md → rol leader → init.sh) coincide con `CLAUDE.md` líneas 7-9, 35-37.
  - 5.4: diagrama del flujo coincide con `.claude/agents/leader.md` línea 25.
  - 5.6: "leader NO escribe código" + enrutamiento por `layer` coinciden con `CLAUDE.md` líneas 13-29 y `.claude/agents/leader.md` líneas 35-40.
  - 5.7: regla `require_tests_to_close: true` verificada en `feature_list.json` línea 6.
  - 5.8: regla anti-teléfono-descompuesto coincide con `CLAUDE.md` líneas 47-50 y `.claude/agents/leader.md` líneas 88-99.

- §6 coincide con código real en `pages/api/leads/analyze.ts`, `product/backend/api/leads/analyze.ts` y `product/backend/services/ai_analyser.ts`: [x]
  - 6.1 thin re-export: `pages/api/leads/analyze.ts` línea 7 hace exactamente eso.
  - 6.2 ruta del request: `product/backend/api/leads/analyze.ts` líneas 38-56 implementa el flujo exacto descrito.
  - 6.3 system prompt JSON estricto: `ai_analyser.ts` líneas 142-163 emite los 8 campos enumerados en el README; `validateLeadAnalysis` lanza `AIResponseParseError`.
  - 6.4 mocks leídos con `fs.readFileSync`: confirmado.
  - 6.6 env_file en compose, lectura con `process.env`, ausencia de `.env` en Dockerfile: confirmado.

- Mini-ejemplo JSON de §5.5 coincide con el schema de `skills/feature-list/SKILL.md`: [x] — Ambos comparten los campos `id`, `name`, `title`, `layer`, `description`, `acceptance` (array), `sdd: true`, `status: "pending"`. El ejemplo del README es una entrada real (`ai_scoring_pipeline`, feature 2) con campos abreviados; no falsifica el schema.

## Salvaguarda del README anterior

- `docs/harness-readme.md` preservado con nota inicial de preservación: [x] — Línea 1: `> README original del template R2D2-Harness, preservado al pivotar el repo al producto Lead Trust Copilot el 2026-05-27.` Contenido íntegro del README previo conservado.

## Observaciones (no bloqueantes)

1. El README declara que Next.js es `^16.2.6` (línea 34); `docs/harness-readme.md` línea 5 menciona "Next.js 14" en el bloque previo del producto. El bloque preservado bajo `docs/harness-readme.md` es histórico (nota inicial de preservación lo aclara), así que no hay incoherencia operativa con el README actual; queda como nota.
2. `docs/harness-readme.md` línea 26 sugiere `docker build` antes de `docker-compose up` y línea 38 usa `docker-compose` con guion; el README nuevo (línea 69) usa la forma moderna `docker compose ... up <service>` que ya gatilla el build implícito. Esto es una mejora intencional del implementer; no requiere acción.
3. Placeholder `<owner>/<repo>` aparece en dos lugares (§3 línea 61 y §8 línea 356). El comentario HTML solo está bajo §8. Si el humano lo reemplaza, debería hacerlo también en el `git clone` de §3. Documentado para que el humano lo recuerde.

## Cambios requeridos

Ninguno. El README cumple los 12 ítems del acceptance, todos los links relativos resuelven, la sección 5 es fiel a `CLAUDE.md` y `.claude/agents/leader.md`, y la sección 6 es fiel al código real (`pages/api/leads/analyze.ts`, `product/backend/api/leads/analyze.ts`, `product/backend/services/ai_analyser.ts`, `docker/docker-compose.yml`, `docker/Dockerfile`). El README anterior está preservado íntegro en `docs/harness-readme.md` con nota de preservación.
