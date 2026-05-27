# Impl — Feature 9: deliverable_ai_usage

**Status:** `done` desde el lado del implementer (NO se marca `done` en `feature_list.json`).
**Fecha:** 2026-05-27
**Layer:** `docs` (`sdd: false`, sin carpeta `specs/`; criterios en la entrada de la feature 9 de `feature_list.json`).

---

## Archivos creados / modificados

| Archivo | Acción |
|---|---|
| `AI_USAGE.md` (raíz del repo) | **Creado** — entregable del hackaton; 5 secciones requeridas + tabla de contenidos + bloque "Referencias rápidas" final. Español. |
| `progress/impl_deliverable_ai_usage.md` | **Creado** (este archivo). |

No se tocó ningún otro archivo. En particular: NO se editó `feature_list.json`, ni `README.md`, ni código en `product/`, ni `tests/`, ni nada bajo `specs/`.

---

## Mapeo acceptance (feature 9) → bloque del documento

| # | Viñeta del acceptance | Bloque en `AI_USAGE.md` |
|---|---|---|
| 1 | "Existe AI_USAGE.md en la raíz del repo con las 5 secciones requeridas por el enunciado: 'Stack de IA', 'Arquitectura del uso (runtime vs dev)', 'Patrones avanzados', 'Decisiones', 'Aprendizajes'." | Encabezados `## 1. Stack de IA`, `## 2. Arquitectura del uso (runtime vs proceso de dev)`, `## 3. Patrones avanzados`, `## 4. Decisiones`, `## 5. Aprendizajes`. Tabla de contenidos al inicio. |
| 2 | "'Stack de IA' lista los modelos y SDKs usados: Claude API (modelo concreto), `@anthropic-ai/sdk` en backend, y Claude Code + subagentes del arnés en desarrollo." | §1 con dos sub-tablas ("IA en runtime del producto" y "IA en proceso de desarrollo"). Modelo `claude-sonnet-4-6` con cita del archivo+línea; SDK `^0.30.1` con cita a `package.json`; Claude Code + 9 subagentes con cita a `.claude/agents/` y `AGENTS.md`. |
| 3 | "'Arquitectura del uso' distingue claramente: (a) IA en runtime — POST /api/leads/analyze invoca Claude para scoring/insights; (b) IA en proceso de dev — leader + spec_author + implementers + reviewers vía SDD." | §2.1 con diagrama ASCII completo del request (browser → pages/api → product/backend/api → ai_analyser → Anthropic) + descripción de capas. §2.2 con diagrama ASCII del flujo SDD `pending → spec_author → spec_ready → ⏸ humano → in_progress → implementers + docker_manager → reviewer → done` + lista de roles. |
| 4 | "'Patrones avanzados' documenta al menos: JSON estructurado forzado por system prompt en /api/leads/analyze, separación de orquestación (leader) e implementación (subagentes), regla anti-teléfono-descompuesto, modo mock SMOKE_MOCK_AI para CI sin credenciales (si se mantiene)." | §3.1 JSON estructurado; §3.2 separación leader/subagentes; §3.3 regla anti-teléfono-descompuesto; **§3.4 SMOKE_MOCK_AI no implementado** (verificado por `grep -n SMOKE_MOCK_AI product/backend/services/ai_analyser.ts` sin resultados); §3.5 trazabilidad R→test; §3.6 spec EARS antes de código. |
| 5 | "'Decisiones' explica al menos 3 trade-offs reales tomados durante el hackaton." | §4 con tabla de **7 decisiones**, cada una con trade-off y razón. Cubre las 3 sugeridas (JSON estricto vs free-form / tool use, Pages Router vs App Router, monolito Next.js vs servicios separados) y suma 4 más (datos mock vs DB, mocks de tests vs API real, leader sin Write/Edit, feature 7 descartada). |
| 6 | "'Aprendizajes' captura 3-5 insights honestos del equipo." | §5 con **7 aprendizajes**. Cubren: valor de la puerta humana, JSON via system prompt no es contrato, fricción del SDK Anthropic, Docker en host del reviewer como bloqueo, anti-teléfono-descompuesto como memoria de largo plazo, mocks de IA como punto ciego, "uso de IA" ≠ una sola pieza. |
| 7 | "El documento es honesto: si una decisión no salió bien o un patrón no se usó como estaba planeado, se documenta." | **Sí, explícitamente:** §3.4 deja claro que `SMOKE_MOCK_AI` no se implementó y que la feature 7 `docker_smoke_test` fue descartada; §4 decisión 7 lo formaliza; §4 decisión 5 reconoce el punto ciego de mockear la API; §5 aprendizaje 2 documenta el bug del markdown que escapa al system prompt y obligó al regex defensivo; §5 aprendizaje 4 documenta la fricción con Docker en el host del reviewer; §5 aprendizaje 6 reconoce la deuda de no probar contra Claude real. |

---

## TODOs / placeholders dejados

| Placeholder | Razón | Quién lo cierra |
|---|---|---|
| `<!-- TODO: confirmar slug oficial con el panel de Anthropic antes de la demo -->` dentro de §1 | El string `claude-sonnet-4-6` está hardcodeado en `product/backend/services/ai_analyser.ts:187` y pasó por el revisor sin observaciones (`progress/review_ai_scoring_pipeline.md`). No verifiqué manualmente que el alias siga vigente en el panel de Anthropic; lo documenté como "la cadena que el equipo eligió" con un TODO en español. | Humano antes de la demo (o el equipo en el rebuild) |

Ningún otro placeholder, ningún `<!-- TODO -->` adicional, ninguna línea en blanco con "*por confirmar*". El resto del documento no inventa datos: cada cifra (versión del SDK, número de subagentes, número de leads/properties mock, líneas exactas) está respaldada con una cita al archivo del repo.

---

## Validación de links

- **28 links relativos** verificados con `test -e` (excluyendo 5 anchors intra-documento que apuntan a `#1-stack-de-ia` … `#5-aprendizajes`).
- **Resultado: 28/28 OK.** Todos resuelven a archivos o carpetas existentes en el repo.

Targets verificados (todos `OK`):

```
.claude/agents/                       .claude/agents/leader.md
.claude/agents/spec_author.md         .claude/agents/implementer.md
.claude/agents/backend_implementer.md .claude/agents/frontend_implementer.md
.claude/agents/docker_manager.md      .claude/agents/reviewer.md
.claude/agents/backend_reviewer.md    .claude/agents/frontend_reviewer.md
AGENTS.md                             CLAUDE.md
README.md                             feature_list.json
package.json                          pages/api/leads/analyze.ts
product/backend/api/leads/analyze.ts  product/backend/services/ai_analyser.ts
product/backend/data/leads_mock.json  product/backend/data/properties_mock.json
product/types/lead_analysis.ts        tests/backend/test_ai_pipeline.ts
docker/scripts/                       skills/feature-list/SKILL.md
progress/                             progress/current.md
progress/history.md                   progress/impl_ai_scoring_pipeline.md
progress/impl_realtime_simulation_trigger.md
```

Comando usado:

```bash
grep -oE '\]\(([^)]+)\)' AI_USAGE.md | sed 's/](//;s/)$//' | sort -u | while read p; do ...; done
```

(Salida completa adjunta en la sesión interactiva del implementer; cero `MISSING`.)

---

## Notas sobre decisiones de contenido

### Qué patrones documenté y por qué

- **§3.1 JSON estructurado por system prompt:** patrón fundamental del producto; sin él el frontend recibiría JSON heterogéneo. Cité líneas exactas del prompt (142-163) y del strip defensivo (207-208) para que sea reproducible.
- **§3.2 Separación leader/subagentes:** clave del proceso. Citée el front-matter de `leader.md` (no tiene `Write`/`Edit`) porque es lo que hace la separación *enforceable* — no es solo política, es permisos.
- **§3.3 Anti-teléfono-descompuesto:** documenté la regla y di pruebas concretas (`progress/impl_*.md` y `progress/review_*.md` que existen en disco) en lugar de solo recitar la regla.
- **§3.4 SMOKE_MOCK_AI no implementado:** el prompt me pidió verificar `grep -n SMOKE_MOCK_AI ai_analyser.ts`. Lo hice (resultado vacío) y lo dejé documentado **como deuda honesta**. La feature 7 `docker_smoke_test` se descartó: lo dije sin inflarlo.
- **§3.5 Trazabilidad R→test:** patrón emergente que vi en los `progress/impl_*.md` reales. No estaba en la lista sugerida del prompt, pero es tan visible en el repo (cada `impl_*.md` tiene una tabla `R<n> → test`) que omitirlo habría sido deshonesto.
- **§3.6 Spec EARS antes de código:** complemento natural de §3.5. Lo agregué corto.

### Qué decisiones elegí contar y por qué

Las 3 sugeridas por el prompt (JSON estricto, Pages Router vs App Router, monolito vs servicios) están todas. Sumé:

- **Datos mock vs DB** porque es la más visible al levantar el demo (no hay persistencia).
- **Mocks de tests vs API real** porque conecta con §3.4 (la deuda de no probar contra Claude real).
- **Leader sin `Write`/`Edit`** porque es la decisión arquitectónica que hace que la separación de roles funcione en la práctica.
- **Feature 7 descartada** porque el prompt me pidió ser honesto sobre lo descartado y porque está conectado con el modo mock no implementado.

### Cómo elegí los aprendizajes

Releí `progress/current.md`, `progress/history.md`, `progress/impl_*.md` y `progress/review_*.md`. Los 7 aprendizajes salen de fricciones reales documentadas en esos archivos:

- Aprendizaje 1 (puerta humana) ← contraste con feature 8 que es `sdd: false`.
- Aprendizaje 2 (markdown que escapa al system prompt) ← `ai_analyser.ts` línea 207 (el code-block strip existe **porque pasó**).
- Aprendizaje 3 (SDK 0.x friccionoso) ← `if (content.type !== 'text')` en `ai_analyser.ts` líneas 200-202.
- Aprendizaje 4 (Docker en host del reviewer) ← `progress/review_realtime_simulation_trigger.md` §C3-C4 y `progress/review_docker_setup.md` C4.
- Aprendizaje 5 (anti-teléfono-descompuesto como memoria larga) ← consecuencia observable de los 7+ archivos `impl_*.md` y `review_*.md` en `progress/`.
- Aprendizaje 6 (mocks vs API real) ← decisión 5 + §3.4.
- Aprendizaje 7 (el "stack de IA" es más que el SDK) ← reflexión integradora del documento entero.

No inventé ningún aprendizaje que no pudiera respaldar con un archivo del repo o un commit/review concreto.

---

## Verificación

- **No aplica `./docker/scripts/product-test.sh`**: esta feature es `sdd: false` y de capa `docs`. No tiene requirements ejecutables.
- **No se escribieron tests** (regla explícita del prompt: la feature es documental).
- **Validación manual**:
  - Estructura de secciones contrastada contra el acceptance de la feature 9 en `feature_list.json` líneas 159-167.
  - 28/28 links relativos verificados con `test -e`.
  - Verificación de SMOKE_MOCK_AI ejecutada con `grep` (cero ocurrencias en `ai_analyser.ts`).
  - Lectura cruzada con `ai_analyser.ts`, `pages/api/leads/analyze.ts`, `product/backend/api/leads/analyze.ts`, `package.json`, `CLAUDE.md`, `AGENTS.md`, los 9 archivos en `.claude/agents/`, `skills/feature-list/SKILL.md` y los `progress/impl_*.md` / `progress/review_*.md` históricos.

---

## Notas para el reviewer

1. La feature **NO está marcada como `done`** en `feature_list.json` — eso queda para el `leader` tras la revisión humana.
2. El TODO sobre el slug oficial del modelo `claude-sonnet-4-6` (§1) es deliberado: el revisor previo de `ai_scoring_pipeline` no lo verificó tampoco (ver `progress/review_ai_scoring_pipeline.md` que lo aprobó por inspección). Si el equipo confirma el slug antes de la demo, puede borrar el comentario HTML.
3. `progress/current.md` no fue tocado (la sesión sigue activa para esta feature).
4. `AI_USAGE.md` referencia `README.md` §5 y §6.2 explícitamente para evitar copiar texto y mantener una sola fuente de verdad sobre el proceso SDD y la ruta del request.
