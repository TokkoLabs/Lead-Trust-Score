# AI_USAGE — Lead Trust Copilot

> Documenta el uso de IA en este hackaton: stack, arquitectura (runtime vs proceso de desarrollo), patrones aplicados, decisiones reales y aprendizajes. Pensado como complemento al [`README.md`](README.md): el README explica **qué** construimos y cómo se corre; este documento explica **cómo usamos IA** para construirlo y para hacerlo funcionar.

---

## Tabla de contenidos

1. [Stack de IA](#1-stack-de-ia)
2. [Arquitectura del uso (runtime vs proceso de dev)](#2-arquitectura-del-uso-runtime-vs-proceso-de-dev)
3. [Patrones avanzados](#3-patrones-avanzados)
4. [Decisiones](#4-decisiones)
5. [Aprendizajes](#5-aprendizajes)

---

## 1. Stack de IA

### IA en runtime del producto

| Pieza | Detalle | Referencia en el repo |
|-------|---------|----------------------|
| Modelo | `claude-sonnet-4-6` (string literal hardcodeado en el cliente) | [`product/backend/services/ai_analyser.ts`](product/backend/services/ai_analyser.ts) línea 187 |
| SDK | `@anthropic-ai/sdk` versión `^0.30.1` | [`package.json`](package.json) |
| Cliente | `new Anthropic({ apiKey })` con `client.messages.create({...})` | [`ai_analyser.ts`](product/backend/services/ai_analyser.ts) líneas 7, 19, 186-196 |
| Output | JSON estricto con 8 campos validados por `validateLeadAnalysis()` y tipados con `LeadAnalysis` | [`product/types/lead_analysis.ts`](product/types/lead_analysis.ts) + `ai_analyser.ts` líneas 64-129 |
| Inyección de credencial | `process.env['ANTHROPIC_API_KEY']` con throw si no está definida (no se hace fallback ni se hardcodea) | `ai_analyser.ts` líneas 14-17 |

> **Nota sobre el modelo:** `claude-sonnet-4-6` es el identificador exacto que aparece en el código fuente. No verificamos manualmente que sea el slug oficial de la API de Anthropic; queda como la cadena que el equipo eligió y que pasó por revisión sin observaciones. Si Anthropic renombra o deprecia ese alias, el cliente fallará en runtime y habrá que actualizar la constante. <!-- TODO: confirmar slug oficial con el panel de Anthropic antes de la demo -->

### IA en proceso de desarrollo

| Pieza | Detalle | Referencia |
|-------|---------|------------|
| Cliente humano-máquina | **Claude Code** (CLI oficial de Anthropic) | Punto de entrada vía [`CLAUDE.md`](CLAUDE.md) |
| Modelo del desarrollador | Las sesiones reales fueron conducidas con modelos Claude Opus (4.6 / 4.7) según `progress/history.md` | [`progress/history.md`](progress/history.md) |
| Sub-agentes especialistas | 9 agentes definidos en [`.claude/agents/`](.claude/agents/): `leader`, `spec_author`, `backend_implementer`, `frontend_implementer`, `implementer`, `docker_manager`, `backend_reviewer`, `frontend_reviewer`, `reviewer` | [`AGENTS.md`](AGENTS.md) tabla §2 |
| Backlog declarativo | [`feature_list.json`](feature_list.json) con `rules.require_tests_to_close: true` y `rules.require_approved_spec_to_implement: true` | `feature_list.json` líneas 4-10 |
| Arnés reproducible | Docker + scripts en [`docker/scripts/`](docker/scripts/) más `./init.sh` / `./init.ps1` | [`README.md`](README.md) §5.1 |

---

## 2. Arquitectura del uso (runtime vs proceso de dev)

### 2.1 IA en runtime (producto)

```
                          Navegador
                              │
                              │  fetch POST /api/leads/analyze
                              │       body: { leadId }
                              ▼
                pages/api/leads/analyze.ts        (thin re-export)
                              │  export { default } from
                              │  product/backend/api/leads/analyze
                              ▼
        product/backend/api/leads/analyze.ts
        ┌──────────────────────────────────────────────────┐
        │ 1. Guard de método (sólo POST → 405 si no)       │
        │ 2. Validar body.leadId                           │
        │ 3. fs.readFileSync de leads_mock.json y          │
        │    properties_mock.json                          │
        │ 4. Buscar el lead por id; si no existe → 404     │
        │ 5. filterCandidateProperties(lead, properties)   │
        │    (filtro por zona OR tipo, fallback a 5)       │
        │ 6. analyseLeadWithAI(lead, matchingProperties)   │
        │ 7. status 200 con JSON LeadAnalysis              │
        │    o 500 en caso de error capturado              │
        └──────────────────────────────────────────────────┘
                              │
                              ▼
       product/backend/services/ai_analyser.ts
        ┌──────────────────────────────────────────────────┐
        │ • client.messages.create({                       │
        │     model: 'claude-sonnet-4-6',                  │
        │     system: <system prompt JSON estricto>,       │
        │     messages: [{ role: 'user', content: ... }]   │
        │   })                                             │
        │ • Strip de bloques ```json ... ``` si aparecen   │
        │ • JSON.parse → validateLeadAnalysis              │
        │   (tipos, rango 0-100, campos obligatorios)      │
        │ • throw AIResponseParseError si falla            │
        └──────────────────────────────────────────────────┘
                              │
                              ▼
                   Anthropic Claude API
                              │
                              ▼
                 LeadAnalysis (JSON estricto)
                              │
                              ▼
                       Vuelve al frontend
                  (LeadDetailPanel + LeadsFeed)
```

**Capas relevantes:**

- **Entrada Next.js:** [`pages/api/leads/analyze.ts`](pages/api/leads/analyze.ts) es un re-export de una sola línea hacia `product/backend/api/leads/analyze.ts`. Esto mantiene el "dominio" fuera de la carpeta de routing de Next.js.
- **Lógica de dominio:** [`product/backend/api/leads/analyze.ts`](product/backend/api/leads/analyze.ts) hace I/O de archivos mock y orquesta el llamado al servicio.
- **Servicio IA:** [`product/backend/services/ai_analyser.ts`](product/backend/services/ai_analyser.ts) es el único módulo que conoce el modelo, el system prompt y la forma exacta del JSON.
- **Contrato compartido:** [`product/types/lead_analysis.ts`](product/types/lead_analysis.ts) exporta `LeadAnalysis` y `AIResponseParseError`. El mismo tipo se consume desde el frontend (`useLeadAnalysis`, `LeadDetailPanel`), evitando drift entre cliente y servidor.
- **Catálogo mock:** [`product/backend/data/leads_mock.json`](product/backend/data/leads_mock.json) (15 leads) y [`product/backend/data/properties_mock.json`](product/backend/data/properties_mock.json) (12 propiedades). Sin DB.

> Para un walkthrough más detallado de cada paso, ver `README.md` §6.2.

### 2.2 IA en proceso de desarrollo (R2D2-Harness + SDD)

Este repo aplica **Spec Driven Development (SDD)** sobre un arnés reproducible. El flujo SDD obligatorio para toda feature con `"sdd": true` es:

```
                         feature_list.json
                                │
                                ▼
                          status: pending
                                │
                                │  leader lanza spec_author
                                ▼
              ┌─────────────────────────────────┐
              │      spec_author (subagente)    │
              │ ─────────────────────────────── │
              │ escribe en disco:               │
              │  specs/<name>/requirements.md   │
              │  specs/<name>/design.md         │
              │  specs/<name>/tasks.md          │
              │ cambia status → spec_ready      │
              │ devuelve: "spec_ready -> ..."   │
              └─────────────────────────────────┘
                                │
                                ▼
                       status: spec_ready
                                │
                                │  ⏸  PUERTA HUMANA
                                │     (lectura + "aprobado")
                                ▼
                       status: in_progress
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼                                   ▼
    backend_implementer /            (opcional, en paralelo)
    frontend_implementer /              docker_manager
    implementer                      (Dockerfiles + compose
                                       + scripts en docker/)
              │                                   │
              │ escribe en product/ + tests/      │
              │ marca [x] en tasks.md             │
              │ informe → progress/impl_<name>.md │
              │                                   │
              └─────────────────┬─────────────────┘
                                ▼
              ┌─────────────────────────────────┐
              │   backend_reviewer /            │
              │   frontend_reviewer / reviewer  │
              │ ─────────────────────────────── │
              │ verifica trazabilidad R<n>→test │
              │ ejecuta ./init.sh + product-    │
              │   test.sh                       │
              │ veredicto en progress/          │
              │   review_<name>.md              │
              │ devuelve: "APPROVED -> ..."     │
              │       o   "CHANGES_REQUESTED…"  │
              └─────────────────────────────────┘
                                │
                                ▼
                          status: done
```

**Roles clave en términos de IA:**

- **`leader`** ([`.claude/agents/leader.md`](.claude/agents/leader.md)): orquestador puro. No toca `product/` ni `tests/`. Decide qué subagente lanzar según `layer` y `status` de la feature. Es el que se sienta en la "puerta humana".
- **`spec_author`** ([`.claude/agents/spec_author.md`](.claude/agents/spec_author.md)): redacta `requirements.md` (formato EARS estricto), `design.md` (archivos a tocar, firmas, alternativas descartadas) y `tasks.md` (pasos discretos con checkboxes). No escribe código.
- **Implementers** ([`backend_implementer`](.claude/agents/backend_implementer.md), [`frontend_implementer`](.claude/agents/frontend_implementer.md), [`implementer`](.claude/agents/implementer.md)): escriben código en `product/` **y** tests en `tests/`. Cada `R<n>` del spec debe estar cubierto por al menos un test.
- **`docker_manager`** ([`.claude/agents/docker_manager.md`](.claude/agents/docker_manager.md)): único autorizado a tocar `docker/Dockerfile*`, `docker-compose.yml` y scripts del arnés.
- **Reviewers** ([`reviewer.md`](.claude/agents/reviewer.md), [`backend_reviewer.md`](.claude/agents/backend_reviewer.md), [`frontend_reviewer.md`](.claude/agents/frontend_reviewer.md)): aprueban o rechazan. Tienen tools `Read/Glob/Grep/Bash`, no `Write/Edit`. Si rechazan, vuelve al implementer.

El backlog se mantiene declarativamente con la skill [`skills/feature-list/SKILL.md`](skills/feature-list/SKILL.md) (esquema, ejemplos y plantilla).

---

## 3. Patrones avanzados

### 3.1 JSON estructurado forzado por system prompt

`analyseLeadWithAI` (ver [`product/backend/services/ai_analyser.ts`](product/backend/services/ai_analyser.ts) líneas 142-163) construye un **system prompt en español** que:

1. Define al asistente como "experto en análisis de leads inmobiliarios".
2. Le obliga a devolver **únicamente** un objeto JSON sin texto adicional, sin markdown, sin explicaciones.
3. Especifica el shape exacto con los 8 campos y el tipo/rango de cada uno (`trust_score` entero 0-100, `is_spam` booleano, etc.).
4. Documenta los criterios cualitativos para cada score (qué cuenta como "trust", qué cuenta como "spam").

Como salvaguarda en runtime, el código aplica dos capas:

- **Strip defensivo** de bloques ` ```json ... ``` ` (a Claude se le escapa el markdown a veces a pesar del system prompt: ver `ai_analyser.ts` líneas 207-208).
- **`validateLeadAnalysis()`** valida tipos, rango numérico y presencia de cada campo, lanzando `AIResponseParseError` con mensajes específicos. Los tests del pipeline ([`tests/backend/test_ai_pipeline.ts`](tests/backend/test_ai_pipeline.ts)) cubren todos los modos de fallo sin tocar la API real.

> Ventaja real observada: el frontend nunca ve un campo `undefined`. El precio que pagamos es no aprovechar tool use / response schemas nativos de Anthropic (ver §4 decisión 1).

### 3.2 Separación de orquestación e implementación

El `leader` tiene `tools: Read, Glob, Grep, Bash, Agent` (ver [`leader.md`](.claude/agents/leader.md) front-matter). **No tiene `Write` ni `Edit`.** La consecuencia práctica es que el modelo no puede caer en la tentación de "arreglar yo mismo el código mientras coordino". Toda mutación pasa por un subagente especializado con permisos acotados a su carpeta:

- `backend_implementer` solo escribe `product/backend/` y `tests/backend/`.
- `frontend_implementer` solo escribe `product/frontend/` y `tests/frontend/`.
- `docker_manager` solo escribe `docker/`.
- Reviewers no escriben nada (solo dejan veredicto en `progress/review_<name>.md`).

Esto se refleja en la tabla de enrutamiento por `layer` en [`leader.md`](.claude/agents/leader.md) §"Enrutamiento por layer".

### 3.3 Regla anti-teléfono-descompuesto

Los subagentes **no devuelven contenido en chat**, lo escriben en disco y devuelven una sola línea con la referencia:

- `spec_author` → `spec_ready -> specs/<name>/`
- implementer → `done -> progress/impl_<name>.md` (o `blocked -> ...`)
- reviewer → `APPROVED -> progress/review_<name>.md` (o `CHANGES_REQUESTED -> ...`)
- `docker_manager` → informe en `progress/docker_<name>.md`

La regla está enunciada en [`CLAUDE.md`](CLAUDE.md) §"Regla anti-teléfono-descompuesto" y en [`leader.md`](.claude/agents/leader.md) §"Regla anti-teléfono-descompuesto", y en la práctica se cumple: la carpeta [`progress/`](progress/) contiene `impl_*.md` y `review_*.md` por cada feature (`impl_ai_scoring_pipeline.md`, `review_ai_scoring_pipeline.md`, `impl_realtime_simulation_trigger.md`, `review_realtime_simulation_trigger.md`, etc.). Al inspeccionarlos se ven trazabilidades concretas `R<n> → test` y veredictos APPROVED firmados por el reviewer.

### 3.4 Modo mock para CI / desarrollo sin credenciales — **no implementado**

El acceptance original de esta feature mencionaba documentar un modo `SMOKE_MOCK_AI` "si se mantiene". **No se mantuvo.** Verificado por inspección directa:

```bash
grep -n SMOKE_MOCK_AI product/backend/services/ai_analyser.ts
# (sin resultados)
```

La única referencia viva a `SMOKE_MOCK_AI` en el repo está en el acceptance histórico de la feature 7 `docker_smoke_test` dentro de [`feature_list.json`](feature_list.json), pero esa feature fue descartada del backlog (no aparece como `pending`/`spec_ready`/`done`; tampoco hay carpeta `specs/docker_smoke_test/`). El equipo decidió no invertir tiempo en un mock por bandera de entorno y dejó toda la cobertura de tests sin red en el nivel de **mocks de Jest** sobre `analyseLeadWithAI`/`filterCandidateProperties` (ver `tests/backend/test_simulate_endpoint.ts`, `tests/backend/test_ai_pipeline.ts`).

**Trade-off honesto:** los tests cubren bien el código del servicio, pero **no validan** que el formato del prompt o el JSON real de Claude no rompa el contrato. Es una deuda que asumimos para terminar a tiempo.

### 3.5 Trazabilidad R → test como contrato de "done"

`feature_list.json` declara `"require_tests_to_close": true` y `"require_approved_spec_to_implement": true` (líneas 6-7). Esto se cumple así en cada implementación:

1. El `spec_author` numera requirements estables `R1, R2, ...` en `specs/<name>/requirements.md` en formato EARS ("Cuando ... entonces el sistema debe ...").
2. El `implementer` produce código + tests **y** documenta una tabla `R<n> → archivo:test` en `progress/impl_<name>.md`.
3. El `reviewer` verifica esa tabla y rechaza si algún `R<n>` queda sin evidencia.

Ejemplos reales en el repo: ver la tabla de trazabilidad de [`progress/impl_ai_scoring_pipeline.md`](progress/impl_ai_scoring_pipeline.md) (22 requirements mapeados) y [`progress/impl_realtime_simulation_trigger.md`](progress/impl_realtime_simulation_trigger.md) (22 requirements mapeados a 16 tests Jest concretos).

### 3.6 Spec en EARS antes de cualquier línea de código

Toda feature `sdd: true` pasa por `spec_author` antes que cualquier implementer mire el repo. El resultado es un trío de archivos en disco (`requirements.md`, `design.md`, `tasks.md`) que actúa como **contrato congelado** entre la persona humana y el implementer. La puerta humana entre `spec_ready` e `in_progress` no es decorativa: es donde el equipo lee el spec y dice "aprobado" o "cambiá X". Si el spec no resiste la lectura humana, no llega al implementer.

---

## 4. Decisiones

| # | Decisión | Trade-off | Por qué la tomamos |
|---|----------|-----------|---------------------|
| 1 | **JSON estricto vía system prompt + validador propio** en lugar de tool use / response schemas nativos de Anthropic | Más frágil ante un cambio de comportamiento del modelo (Claude a veces mete ` ```json ` por costumbre, ver workaround en `ai_analyser.ts` línea 207). En cambio, sirve con cualquier modelo de la familia sin depender de features beta de la API. | El tiempo de hackaton no daba para probar la API de tool use end-to-end con tests; un system prompt + `validateLeadAnalysis()` da garantías tipadas en el cliente y se prueba con JSON.parse de fixtures. |
| 2 | **Next.js Pages Router** (no App Router) | Perdemos Server Components, Server Actions y el patrón de streaming del App Router. La estructura `pages/api/*` ya se siente legacy. | El requisito de la feature 8 lo fijaba explícitamente y la documentación de Next.js 16 sigue soportando Pages Router con strict mode (`next.config.js`). Más rápido para un equipo que no había hecho App Router antes. |
| 3 | **Monolito Next.js** (frontend + API routes en un solo proceso, una imagen Docker) en lugar de servicios separados | No hay aislamiento de procesos: si el handler de `/api/leads/analyze` tira, también cae el SSR. Tampoco hay queue para cuando Claude responde lento. | Para un hackaton de demo local es óptimo: un solo `docker compose -f docker/docker-compose.yml up lead-trust-copilot` y el dashboard está corriendo. Cero ops. |
| 4 | **Datos mock en JSON sobre disco** (`leads_mock.json`, `properties_mock.json`) en lugar de Postgres + ORM | No podemos persistir leads simulados entre reloads. La paginación o búsqueda real no es viable. Los leads insertados por `/api/leads/simulate` viven solo en el estado del frontend. | El producto es un POC de scoring de IA; persistencia es ruido de hackaton. Cargar JSON con `fs.readFileSync` por request es suficiente para 27 registros totales. |
| 5 | **Tests con `process.env['ANTHROPIC_API_KEY'] = 'test-key-mock'`** y `jest.mock('ai_analyser')` en lugar de ejecutar contra Claude real | No probamos el contrato real del modelo. Si Anthropic cambia la forma del response (o el modelo `claude-sonnet-4-6` deja de existir), los tests siguen verdes y el bug solo se ve en runtime. Está documentado como deuda en §3.4. | Tests reales contra la API cuestan tokens, son no-determinísticos y no funcionan en CI sin secrets. La validación estricta `validateLeadAnalysis` cubre los modos de fallo más comunes. |
| 6 | **El leader no tiene `Write`/`Edit`** (solo `Read/Glob/Grep/Bash/Agent`) | Cuando el leader detecta un error trivial (un typo en docs, un import faltante) tiene que **igual** lanzar un subagente para arreglarlo. Esto se siente burocrático en cambios de 1 línea. | El beneficio supera el costo: elimina la categoría "el leader se distrae implementando y rompe el flujo SDD". En la práctica vimos que el leader respeta los límites incluso cuando estaría tentado a editar. Ver [`leader.md`](.claude/agents/leader.md) front-matter. |
| 7 | **Feature 7 `docker_smoke_test` descartada en el camino** y el modo mock `SMOKE_MOCK_AI` con ella | El smoke E2E del Dockerfile + compose se delegó a verificación manual del equipo (ver `progress/impl_docker_setup.md` y `progress/review_docker_setup.md`). Hoy no hay test que ejecute `docker compose up && curl localhost:3000`. | El entorno del arnés/CI no tiene Docker disponible (ver `progress/review_realtime_simulation_trigger.md` §C3-C4), entonces un test E2E vía script sería verde-falso. Se optó por documentar el procedimiento de smoke en `progress/impl_docker_setup.md` y aceptar la limitación. |

---

## 5. Aprendizajes

1. **La puerta humana entre `spec_ready` e `in_progress` paga por sí sola.** En las 6 features SDD reales del backlog no hubo retrabajo grande por malentendidos: el spec en disco hizo de contrato. Cuando un implementer leía un requirement ambiguo, no improvisaba — el flujo lo obligaba a parar y pedir aclaración. Lo notamos comparando con la feature 8 (docs, `sdd: false`) donde el implementer tomó decisiones de estructura del README que después comentamos en la review.

2. **Forzar JSON estructurado por system prompt funciona ~95% de las veces; el 5% restante tiene que estar en código defensivo.** La línea 207 de [`ai_analyser.ts`](product/backend/services/ai_analyser.ts) (`const codeBlockMatch = rawText.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);`) existe porque Claude, a pesar de la instrucción explícita "sin bloques de código markdown, sin explicaciones", a veces igual envuelve la respuesta en ` ```json `. Si no lo hubiéramos parcheado, el JSON.parse habría tirado y el frontend habría visto un 500. Lección: **system prompts ≠ contratos**. El validador en código es obligatorio.

3. **El SDK de `@anthropic-ai/sdk` (^0.30.1) tiene tipos solo razonables.** `message.content[0]` es una unión discriminada `TextBlock | ToolUseBlock | ...`; tuvimos que hacer `if (content.type !== 'text') throw ...` antes de usar `.text`. No es un defecto del SDK — refleja la API real — pero suma fricción al primer contacto. La versión 0.x indica que aún no es estable.

4. **Docker en el entorno del reviewer fue el bloqueo recurrente.** `./init.sh` exige Docker, pero el host del revisor no siempre lo tenía instalado. Eso obligó a que los tests del producto se pudieran correr **también** con `npx jest` directo (sin contenedor) y que los reviewers documentaran "init.sh en rojo por falta de Docker en el host" como excepción aceptada (ver `progress/review_realtime_simulation_trigger.md` §C3-C4 y `progress/review_docker_setup.md`). El arnés es robusto, pero su requisito Docker friccionó las revisiones rápidas.

5. **La regla anti-teléfono-descompuesto cambia el shape del log.** El humano que abre el repo *no necesita* leer el chat completo de la sesión: con `progress/impl_<name>.md` y `progress/review_<name>.md` reconstruye qué se hizo y por qué. En la práctica esto convirtió a `progress/` en la "memoria a largo plazo" del proyecto, separada del prompt corto del leader. Es un patrón que vale la pena replicar fuera del hackaton.

6. **Mockear la API de IA en tests con `jest.mock` ahorra plata y tiempo, pero deja un punto ciego real.** Hicimos esta apuesta consciente (ver decisión 5 y patrón 3.4). El día de la demo, si Anthropic responde con un campo extra o renombra algo, los tests no nos van a avisar. Mitigación parcial: el script de demo (ver README §3) levanta `docker compose up` y el primer click sobre "Simular Lead Interesado" funciona como smoke manual.

7. **El stack de IA del hackaton terminó siendo más de una sola pieza.** Empezamos pensando "vamos a usar Claude". Terminamos con **Claude el modelo en runtime** + **Claude Code el cliente del desarrollador** + **9 subagentes con prompts y permisos distintos** + **una skill `feature-list` que reusa templates** + **un flujo SDD enforced por convenciones de carpetas**. El "uso de IA" no es solo la llamada a `client.messages.create()`; es la arquitectura cooperativa que la rodea.

---

## Referencias rápidas

- Endpoint runtime: [`pages/api/leads/analyze.ts`](pages/api/leads/analyze.ts) → [`product/backend/api/leads/analyze.ts`](product/backend/api/leads/analyze.ts) → [`product/backend/services/ai_analyser.ts`](product/backend/services/ai_analyser.ts)
- Contrato del JSON: [`product/types/lead_analysis.ts`](product/types/lead_analysis.ts)
- Datos mock: [`product/backend/data/leads_mock.json`](product/backend/data/leads_mock.json), [`product/backend/data/properties_mock.json`](product/backend/data/properties_mock.json)
- Subagentes: [`.claude/agents/`](.claude/agents/) (leader, spec_author, backend_implementer, frontend_implementer, implementer, docker_manager, backend_reviewer, frontend_reviewer, reviewer)
- Backlog: [`feature_list.json`](feature_list.json) y skill [`skills/feature-list/SKILL.md`](skills/feature-list/SKILL.md)
- Bitácora: [`progress/history.md`](progress/history.md) (cierre por sesión) y [`progress/current.md`](progress/current.md) (sesión en curso)
- Hub de procesos: [`README.md`](README.md) §5 explica el flujo SDD desde la perspectiva del repo; este documento lo explica desde la perspectiva del **uso de IA**.
