# Impl — Feature 8: deliverable_readme

**Status:** `done` desde el lado del implementer (NO se marca `done` en `feature_list.json`).
**Fecha:** 2026-05-27
**Layer:** `docs` (`sdd: false`, sin carpeta `specs/`; criterios en la entrada de la feature 8 de `feature_list.json`).

---

## Cambios realizados

| Archivo | Tipo | Resumen |
|---------|------|---------|
| `docs/harness-readme.md` | Nuevo | Copia íntegra del `README.md` anterior (template R2D2-Harness + bloque previo del producto). Lleva nota inicial indicando preservación al pivotar el repo el 2026-05-27. Links relativos reajustados (`../skills/...`, `../AGENTS.md`, `docker.md`) porque ahora vive bajo `docs/`. |
| `README.md` | Reescrito | Nuevo README del producto **Lead Trust Copilot**, en español, con las 8 secciones requeridas por el acceptance de la feature 8. |

No se tocó ningún otro archivo del repo (ni `product/`, ni `tests/`, ni specs, ni `feature_list.json`).

---

## Mapeo acceptance → bloques del README

| Criterio del acceptance (feature 8) | Bloque del README |
|---|---|
| Cubre, en este orden, las 8 secciones | Tabla de contenidos al inicio + cada sección con encabezado `## N. ...` |
| §1 "Qué es": 2-4 oraciones describiendo el producto | `## 1. Qué es Lead Trust Copilot` (3 párrafos cortos) |
| §2 "Stack": Next.js 16, React 19, TS, Tailwind, Anthropic SDK, Docker, Jest + ts-jest con versiones | `## 2. Stack` (tabla con versiones exactas de `package.json`) |
| §3 Quickstart en máquina limpia (clone → cp .env → editar key → docker compose up → localhost:3000), tiempo ~10 min | `## 3. Cómo se corre` (prerrequisitos + 4 comandos + tabla de envs) |
| §4 Estructura del repo: tabla con carpetas top-level y una línea cada una | `## 4. Estructura del repo` (tabla con 25+ entradas) |
| §5.1 Harness Engineering en una oración | `### 5.1 Qué es Harness Engineering` |
| §5.2 SDD + puerta humana | `### 5.2 Qué es SDD y por qué la puerta humana` |
| §5.3 Punto de entrada (CLAUDE.md → leader → init.sh) | `### 5.3 Punto de entrada` |
| §5.4 Ciclo completo con diagrama/flecha | `### 5.4 Ciclo completo de una feature` (diagrama ASCII) |
| §5.5 Skill `feature-list` con mini-ejemplo | `### 5.5 Cómo definimos el backlog con la skill feature-list` (bloque JSON adaptado del SKILL.md) |
| §5.6 Cómo trabajan los agentes (leader no codea; specs; implementers; reviewers) | `### 5.6 Cómo trabajan los agentes` (tabla por agente + tabla de enrutamiento por `layer`) |
| §5.7 Tests dentro del SDD: los escribe el implementer; R<n> → test; reviewer valida; regla `require_tests_to_close` | `### 5.7 Cómo se crean los tests dentro del SDD` |
| §5.8 Regla anti-teléfono-descompuesto | `### 5.8 Regla anti-teléfono-descompuesto` |
| §6.1 Pages Router + delegación a `product/backend/` | `### 6.1 Next.js Pages Router con API routes` |
| §6.2 Ruta de un request `/api/leads/analyze` | `### 6.2 Ruta de un request` (diagrama ASCII + numeración) |
| §6.3 `ai_analyser.ts` con system prompt JSON estricto | `### 6.3 ai_analyser.ts: JSON estricto desde el system prompt` (bloque ts del shape) |
| §6.4 Data layer mock | `### 6.4 Data layer mock` |
| §6.5 Tipos compartidos en `product/types/` | `### 6.5 Tipos compartidos` |
| §6.6 ANTHROPIC_API_KEY en runtime, nunca hardcodeada | `### 6.6 Seguridad de la API key` |
| §7 Entregables: links relativos a `deliverables/demo.mp4` y `AI_USAGE.md` con descripción | `## 7. Entregables` (tabla; ambos marcados como pendientes con la feature que los entregará) |
| §8 URL completa GitHub | `## 8. Link al repo` (placeholder `https://github.com/<owner>/<repo>` + comentario HTML con `TODO`) |
| Todos los links relativos válidos | Verificado con `test -e` sobre los 50+ targets — ver bloque "Validación de links" abajo |
| Mantener README anterior en `docs/harness-readme.md` | Hecho; archivo nuevo con nota inicial |
| Idioma español | Todo el README está en español |

---

## TODOs / placeholders dejados

| Placeholder | Razón | Quién lo cierra |
|---|---|---|
| `https://github.com/<owner>/<repo>` en §8 | No conozco la URL final del repo en GitHub. Hay un comentario `<!-- TODO: reemplazar... -->` justo debajo. | Humano antes de la entrega del hackaton |
| URL placeholder en el `git clone` de §3 | Mismo motivo: depende del repo final | Humano antes de la entrega |
| Link a `deliverables/demo.mp4` en §7 | El archivo no existe todavía; lo entrega la **feature 7 `deliverable_video_demo`**. La fila de la tabla dice explícitamente "*(pendiente — feature 7)*". El link no es clickable porque el archivo aún no existe, pero está documentado. | Implementer de la feature 7 |
| Link a `AI_USAGE.md` en §7 | Mismo caso: lo entrega la **feature 9 `deliverable_ai_usage`**. Marcado como "*(pendiente — feature 9)*". | Implementer de la feature 9 |

Ningún `<!-- TODO -->` adicional fue dejado dentro del texto del README más allá del de la URL del repo.

---

## Validación de links relativos

Se verificó con `for p in ...; do test -e "$p" ...; done` que **todos** los links relativos del nuevo `README.md` apunten a archivos o carpetas existentes en el repo. Resultado: **51/51 OK**.

Targets verificados (todos `OK`):

```
.env.example                       docker/.env.example
pages/                              pages/api/leads/analyze.ts
pages/api/leads/simulate.ts         product/
product/backend/                    product/backend/data/
product/backend/data/leads_mock.json
product/backend/data/properties_mock.json
product/backend/api/leads/analyze.ts
product/backend/services/ai_analyser.ts
product/frontend/                   product/types/
product/types/lead.ts               product/types/property.ts
product/types/lead_analysis.ts      tests/
styles/                              docker/
docker/Dockerfile                   docker/docker-compose.yml
specs/                               progress/
.claude/agents/                      .claude/agents/leader.md
.claude/agents/spec_author.md       .claude/agents/implementer.md
.claude/agents/backend_implementer.md
.claude/agents/frontend_implementer.md
.claude/agents/docker_manager.md    .claude/agents/reviewer.md
.claude/agents/backend_reviewer.md  .claude/agents/frontend_reviewer.md
skills/                              skills/feature-list/SKILL.md
skills/feature-list/schema.md       skills/agent-author/SKILL.md
docs/                                docs/architecture.md
docs/conventions.md                  docs/specs.md
docs/verification.md                 docs/docker.md
docs/harness-readme.md               feature_list.json
init.sh                              init.ps1
AGENTS.md                            CLAUDE.md
CHECKPOINTS.md                       .gitignore
```

Los únicos targets **explícitamente pendientes** (no rotos, pero todavía no existen porque las features 7 y 9 están `pending`) son:

- `deliverables/demo.mp4` — feature 7 `deliverable_video_demo`.
- `AI_USAGE.md` — feature 9 `deliverable_ai_usage`.

Ambos están dentro de una tabla en §7 con la nota "*(pendiente — feature 7 / feature 9)*" para que el renderizado de GitHub no parezca un bug.

---

## Verificación

- **No aplica `./docker/scripts/product-test.sh`**: esta feature es `sdd: false` y de capa `docs`. No tiene requirements ejecutables.
- **No se escribieron tests** (regla explícita del prompt para esta feature documental).
- **Validación manual**: links relativos verificados con `test -e` (ver bloque arriba), longitud y orden de secciones contrastados contra el acceptance de la feature 8 en `feature_list.json`.

---

## Notas para el reviewer

1. La feature **NO está marcada como `done`** en `feature_list.json` — eso queda para el `leader` tras revisión humana.
2. `progress/current.md` no fue tocado: la sesión sigue activa para esta feature.
3. `docs/harness-readme.md` está pensado como archivo de referencia histórico, no como documentación viva. No requiere mantenimiento.
4. Si el humano completa la URL del repo en `README.md` §8, debería **eliminar el comentario HTML `<!-- TODO: ... -->`** justo debajo.
