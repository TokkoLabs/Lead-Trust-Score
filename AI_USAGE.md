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
| Cliente | `new Anthropic({ apiKey })` con `client.messages.create({...})` | [`ai_analyser.ts`](product/backend/services/ai_analyser.ts) |
| Endpoints expuestos | `POST /api/leads/analyze` (scoring de lead existente) y `POST /api/leads/simulate` (genera lead random + analiza en una sola request) | [`pages/api/leads/analyze.ts`](pages/api/leads/analyze.ts), [`pages/api/leads/simulate.ts`](pages/api/leads/simulate.ts) |
| Output | JSON estricto con 8 campos validados por `validateLeadAnalysis()` y tipados con `LeadAnalysis` | [`product/types/lead_analysis.ts`](product/types/lead_analysis.ts) + `ai_analyser.ts` |
| Inyección de credencial | `process.env['ANTHROPIC_API_KEY']` con throw si no está definida (no se hace fallback ni se hardcodea) | `ai_analyser.ts` |

> **Nota sobre el modelo:** `claude-sonnet-4-6` es el identificador exacto que aparece en el código fuente. No verificamos manualmente que sea el slug oficial de la API de Anthropic; queda como la cadena que el equipo eligió y que pasó por revisión sin observaciones. Si Anthropic renombra o deprecia ese alias, el cliente fallará en runtime y habrá que actualizar la constante. <!-- TODO: confirmar slug oficial con el panel de Anthropic antes de la demo -->

### IA en proceso de desarrollo

| Pieza | Detalle | Referencia |
|-------|---------|------------|
| Cliente humano-máquina | **Claude Code** (CLI oficial de Anthropic) | Punto de entrada vía [`CLAUDE.md`](CLAUDE.md) |
| Modelo del desarrollador | Las sesiones reales fueron conducidas con modelos Claude Opus (4.6 / 4.7) según [`progress/history.md`](progress/history.md) | [`progress/history.md`](progress/history.md) |
| Sub-agentes especialistas | 9 agentes definidos en [`.claude/agents/`](.claude/agents/): `leader`, `spec_author`, `backend_implementer`, `frontend_implementer`, `implementer`, `docker_manager`, `backend_reviewer`, `frontend_reviewer`, `reviewer` | [`AGENTS.md`](AGENTS.md) tabla §2 |
| Backlog declarativo | [`feature_list.json`](feature_list.json) con `rules.require_tests_to_close: true` y `rules.require_approved_spec_to_implement: true` | `feature_list.json` líneas 4-10 |
| Arnés reproducible | Docker + scripts en [`docker/scripts/`](docker/scripts/) más `./init.sh` / `./init.ps1` | [`README.md`](README.md) §5.1 |

---

## 2. Arquitectura del uso (runtime vs proceso de dev)

### 2.1 IA en runtime (producto)

Hoy hay **dos puntos de entrada** que invocan a Claude. Ambos terminan en el mismo servicio (`ai_analyser.ts`), pero su orquestación previa difiere:

```
                          Navegador
                              │
        ┌─────────────────────┴───────────────────────┐
        │                                             │
        │  fetch POST /api/leads/analyze              │  fetch POST /api/leads/simulate
        │       body: { leadId }                      │       body: {}  (default type='random')
        ▼                                             ▼
pages/api/leads/analyze.ts          pages/api/leads/simulate.ts
  (thin re-export)                    (thin re-export)
        │                                             │
        ▼                                             ▼
product/backend/api/leads/analyze.ts    product/backend/api/leads/simulate.ts
  1. Guard de método (sólo POST)            1. Resuelve type. Si 'random':
  2. Validar body.leadId                       Math.random() < 0.8 → 'interested'
  3. fs.readFileSync leads_mock                else → 'spam' (SIM_RATIO_INTERESTED)
  4. Buscar lead por id (404 si no)        2. lead = generateRandomLead(undefined,
  5. filterCandidateProperties(...)           { forceType }) desde pools de
  6. analyseLeadWithAI(...)                   product/backend/lib/leadGenerators.ts
  7. status 200 con LeadAnalysis           3. fs.readFileSync properties_mock
                                            4. filterCandidateProperties(lead, ...)
                                            5. analyseLeadWithAI(lead, candidates)
                                            6. status 200 con { lead, analysis }
        │                                             │
        └─────────────────────┬───────────────────────┘
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
              (LeadDetailPanel + LeadsFeed + QueueView)
```

**Capas relevantes:**

- **Entrada Next.js:** [`pages/api/leads/analyze.ts`](pages/api/leads/analyze.ts) y [`pages/api/leads/simulate.ts`](pages/api/leads/simulate.ts) son re-exports de una sola línea hacia `product/backend/api/leads/`. Esto mantiene el "dominio" fuera de la carpeta de routing de Next.js.
- **Lógica de dominio:** [`product/backend/api/leads/analyze.ts`](product/backend/api/leads/analyze.ts) hace I/O sobre los mocks y orquesta el llamado al servicio. [`product/backend/api/leads/simulate.ts`](product/backend/api/leads/simulate.ts) suma la **generación aleatoria** del lead antes de invocar al mismo servicio.
- **Generador de leads:** [`product/backend/lib/leadGenerators.ts`](product/backend/lib/leadGenerators.ts) expone pools (zonas, presupuestos, mensajes interested/spam, sources, agencias, direcciones) y `generateRandomLead({ forceType })`. Es la fuente de la randomización del simulador.
- **Servicio IA:** [`product/backend/services/ai_analyser.ts`](product/backend/services/ai_analyser.ts) es el único módulo que conoce el modelo, el system prompt y la forma exacta del JSON.
- **Contrato compartido:** [`product/types/lead_analysis.ts`](product/types/lead_analysis.ts) exporta `LeadAnalysis` y `AIResponseParseError`. El mismo tipo se consume desde el frontend (`useLeadAnalysis`, `LeadDetailPanel`, `QueueCard`, `RecentLeadsTable`), evitando drift entre cliente y servidor.
- **Catálogo mock:** [`product/backend/data/leads_mock.json`](product/backend/data/leads_mock.json) (30 leads, ahora con `source`, `estado`, `created_at`, `agencia`, `direccion_propiedad`) y [`product/backend/data/properties_mock.json`](product/backend/data/properties_mock.json). Sin DB.

**Ejemplo concreto del JSON estricto devuelto por Claude:**

```json
{
  "trust_score": 82,
  "conversion_score": 74,
  "urgency_score": 65,
  "is_spam": false,
  "detected_intent": "Comprar departamento 2 ambientes en Palermo",
  "suggested_action": "Llamar dentro de las próximas 24 hs para coordinar visita; tiene precalificación bancaria y plazo de 60 días.",
  "ai_summary": "Lead serio con presupuesto definido (USD 450 000) y financiamiento en curso. Especifica zona y tipo, y menciona urgencia por mudanza familiar.",
  "property_match_ids": ["prop-03", "prop-07"]
}
```

> El simulador unificado **encadena** las dos cosas en una sola request: el frontend toca el botón `+ Nuevo lead` del `PageHeader`, el backend genera el lead aleatorio, lo analiza en el mismo handler y devuelve `{ lead, analysis }`. La UI inserta el lead en el feed (o en la sección spam si `is_spam=true`) sin segundo round-trip. Ver `simLoading` + `handleSimulateLead()` en [`pages/index.tsx`](pages/index.tsx).
>
> Para un walkthrough más detallado de cada paso, ver [`README.md` §6](README.md#6-arquitectura-del-backend).

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

**Volumen real del proceso:** este flujo se ejerció sobre **21 features** del backlog (ver [`feature_list.json`](feature_list.json) y [`progress/history.md`](progress/history.md)):

- **18 features de producto** ejecutadas (id 1-18 en el orden cronológico real): las 6 primeras formaron el MVP (ingesta, pipeline IA, layout, panel de detalle, simulador inicial, Docker); las 12 siguientes (`tokko_design_system_setup` → `unified_random_lead_simulator`) fueron la migración al Design System Tokko, el rediseño del app shell, las 4 vistas con router, el Dashboard con KPIs y gráficos (Chart.js), la vista Cola con razones IA, la vista Criterios con persistencia en `localStorage`, el placeholder de Procesados, el rediseño Tokko del `LeadDetailPanel` y el simulador unificado 80/20.
- **3 entregables del hackaton** (id 19-21): video demo (`in_progress`), README (`done`), `AI_USAGE.md` (`done`).
- **1 feature descartada en vuelo:** `docker_smoke_test` con el modo `SMOKE_MOCK_AI`. Ver §3.4 y decisión 7.

El ciclo Tokko (features 7-18) cerró con **139 tests verdes**: 9 en `tests/backend/` y 130 en `tests/frontend/` (registro en [`progress/current.md`](progress/current.md) y `progress/impl_unified_random_lead_simulator.md`).

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

La regla está enunciada en [`CLAUDE.md`](CLAUDE.md) §"Regla anti-teléfono-descompuesto" y en [`leader.md`](.claude/agents/leader.md) §"Regla anti-teléfono-descompuesto", y en la práctica se cumple: la carpeta [`progress/`](progress/) contiene `impl_*.md` y `review_*.md` por cada feature (`impl_ai_scoring_pipeline.md`, `review_ai_scoring_pipeline.md`, `impl_tokko_design_system_setup.md`, `review_view_router_navigation.md`, `impl_unified_random_lead_simulator.md`, etc.). Al inspeccionarlos se ven trazabilidades concretas `R<n> → test` y veredictos APPROVED firmados por el reviewer.

### 3.4 Modo mock para CI / desarrollo sin credenciales — **no implementado**

El acceptance original de esta feature mencionaba documentar un modo `SMOKE_MOCK_AI` "si se mantiene". **No se mantuvo.** Verificado por inspección directa:

```bash
grep -rn SMOKE_MOCK_AI product/ tests/
# (sin resultados — confirmado tras el ciclo Tokko)
```

La única referencia viva a `SMOKE_MOCK_AI` en el repo está en el acceptance histórico de la feature `docker_smoke_test` original (descartada del backlog: no aparece como `pending` / `spec_ready` / `done`, y la carpeta `specs/docker_smoke_test/` quedó como artefacto huérfano del intento previo). El equipo decidió no invertir tiempo en un mock por bandera de entorno y dejó toda la cobertura de tests sin red en el nivel de **mocks de Jest** sobre `analyseLeadWithAI`/`filterCandidateProperties` (ver `tests/backend/test_simulate_endpoint.ts`, `tests/backend/test_simulate_random.ts`, `tests/backend/test_ai_pipeline.ts`).

**Trade-off honesto:** los tests cubren bien el código del servicio, pero **no validan** que el formato del prompt o el JSON real de Claude no rompa el contrato. Es una deuda que asumimos para terminar a tiempo.

### 3.5 Trazabilidad R → test como contrato de "done"

`feature_list.json` declara `"require_tests_to_close": true` y `"require_approved_spec_to_implement": true` (líneas 6-7). Esto se cumple así en cada implementación:

1. El `spec_author` numera requirements estables `R1, R2, ...` en `specs/<name>/requirements.md` en formato EARS ("Cuando ... entonces el sistema debe ...").
2. El `implementer` produce código + tests **y** documenta una tabla `R<n> → archivo:test` en `progress/impl_<name>.md`.
3. El `reviewer` verifica esa tabla y rechaza si algún `R<n>` queda sin evidencia.

Ejemplos reales en el repo: ver la tabla de trazabilidad de [`progress/impl_ai_scoring_pipeline.md`](progress/impl_ai_scoring_pipeline.md) (22 requirements mapeados), [`progress/impl_tokko_design_system_setup.md`](progress/impl_tokko_design_system_setup.md) (18 requirements / 10 tasks / 34 tests) y [`progress/impl_unified_random_lead_simulator.md`](progress/impl_unified_random_lead_simulator.md) (7 acceptance criteria mapeados a tests concretos por archivo).

### 3.6 Spec en EARS antes de cualquier línea de código

Toda feature `sdd: true` pasa por `spec_author` antes que cualquier implementer mire el repo. El resultado es un trío de archivos en disco (`requirements.md`, `design.md`, `tasks.md`) que actúa como **contrato congelado** entre la persona humana y el implementer. La puerta humana entre `spec_ready` e `in_progress` no es decorativa: es donde el equipo lee el spec y dice "aprobado" o "cambiá X". Si el spec no resiste la lectura humana, no llega al implementer.

### 3.7 Briefing rico para features `sdd: false` ("modo Opción A")

A partir de la feature 11 el equipo movió el resto del ciclo Tokko (features 11-18) a `sdd: false` para acelerar el ritmo, sin perder rigor. El reemplazo del trío `requirements/design/tasks.md` fue un **briefing rico** entregado en el prompt al implementer:

- `acceptance` literal copiado de [`feature_list.json`](feature_list.json) (mismo nivel de detalle que un EARS).
- Referencia a las líneas exactas del HTML target ([`ui-ux/lead-trust-dashboard-tokko (3).html`](ui-ux/)).
- Decisiones técnicas anticipadas (qué librería, qué archivo, qué tokens).
- Tests obligatorios enumerados explícitamente en el prompt.

Quien escribió código y tests siguió siendo el implementer; el reviewer siguió validando la trazabilidad acceptance → test. El cambio fue **menos archivos en `specs/`, mismo nivel de evidencia en `progress/`**. Funcionó: 8 features cerraron en una sola sesión secuencial sin retrabajo bloqueante (ver [`progress/current.md`](progress/current.md) §"Pipeline ejecutado (12/12 done)").

### 3.8 Helpers puros como capa de fricción reusable

Cuatro features del ciclo Tokko empujaron lógica a `product/frontend/lib/` para mantener los componentes tontos y los tests rápidos:

- [`leadReasons.ts`](product/frontend/lib/leadReasons.ts) — deriva reason chips IA (✓ positivas / ✗ negativas) a partir del lead + análisis. Consumido por `QueueCard` (feature 14) y `LeadDetailPanel` (feature 17).
- [`dashboardMetrics.ts`](product/frontend/lib/dashboardMetrics.ts) — `computeKpis` y `computeDailyBuckets` puras para alimentar los 4 KPI cards y el `LeadsBarChart`.
- [`criteriaDefaults.ts`](product/frontend/lib/criteriaDefaults.ts) + [`criteriaStorage.ts`](product/frontend/lib/criteriaStorage.ts) — defaults centralizados y persistencia en `localStorage` para la vista Criterios.
- [`scoreUtils.ts`](product/frontend/lib/scoreUtils.ts) — `computeLocalScore` reutilizado por feed, cola, KPIs y simulador.

Patrón: **las funciones puras se testean sin React** (`tests/frontend/test_lead_reasons.ts`, `test_dashboard_metrics.ts`), y los componentes solo testean render + interacción. Bajó el tiempo de los tests y subió la cobertura efectiva.

---

## 4. Decisiones

| # | Decisión | Trade-off | Por qué la tomamos |
|---|----------|-----------|---------------------|
| 1 | **JSON estricto vía system prompt + validador propio** en lugar de tool use / response schemas nativos de Anthropic | Más frágil ante un cambio de comportamiento del modelo (Claude a veces mete ` ```json ` por costumbre, ver workaround en `ai_analyser.ts` línea 207). En cambio, sirve con cualquier modelo de la familia sin depender de features beta de la API. | El tiempo de hackaton no daba para probar la API de tool use end-to-end con tests; un system prompt + `validateLeadAnalysis()` da garantías tipadas en el cliente y se prueba con JSON.parse de fixtures. |
| 2 | **Next.js Pages Router** (no App Router) | Perdemos Server Components, Server Actions y el patrón de streaming del App Router. La estructura `pages/api/*` ya se siente legacy. | El requisito de la feature 8 original lo fijaba explícitamente y la documentación de Next.js 16 sigue soportando Pages Router con strict mode (`next.config.js`). Más rápido para un equipo que no había hecho App Router antes. |
| 3 | **Monolito Next.js** (frontend + API routes en un solo proceso, una imagen Docker) en lugar de servicios separados | No hay aislamiento de procesos: si el handler de `/api/leads/analyze` tira, también cae el SSR. Tampoco hay queue para cuando Claude responde lento. | Para un hackaton de demo local es óptimo: un solo `docker compose -f docker/docker-compose.yml up lead-trust-copilot` y el dashboard está corriendo. Cero ops. |
| 4 | **Datos mock en JSON sobre disco** (`leads_mock.json` con 30 leads, `properties_mock.json`) en lugar de Postgres + ORM | No podemos persistir leads simulados entre reloads. La paginación o búsqueda real no es viable. Los leads insertados por `/api/leads/simulate` viven solo en el estado del frontend. | El producto es un POC de scoring de IA; persistencia es ruido de hackaton. Cargar JSON con `fs.readFileSync` por request es suficiente para 30 + N registros. |
| 5 | **Tests con `process.env['ANTHROPIC_API_KEY'] = 'test-key-mock'`** y `jest.mock('ai_analyser')` en lugar de ejecutar contra Claude real | No probamos el contrato real del modelo. Si Anthropic cambia la forma del response (o el modelo `claude-sonnet-4-6` deja de existir), los tests siguen verdes y el bug solo se ve en runtime. Está documentado como deuda en §3.4. | Tests reales contra la API cuestan tokens, son no-determinísticos y no funcionan en CI sin secrets. La validación estricta `validateLeadAnalysis` cubre los modos de fallo más comunes. |
| 6 | **El leader no tiene `Write`/`Edit`** (solo `Read/Glob/Grep/Bash/Agent`) | Cuando el leader detecta un error trivial (un typo en docs, un import faltante) tiene que **igual** lanzar un subagente para arreglarlo. Esto se siente burocrático en cambios de 1 línea. | El beneficio supera el costo: elimina la categoría "el leader se distrae implementando y rompe el flujo SDD". En la práctica vimos que el leader respeta los límites incluso cuando estaría tentado a editar. Ver [`leader.md`](.claude/agents/leader.md) front-matter. |
| 7 | **Feature `docker_smoke_test` descartada en el camino** y el modo mock `SMOKE_MOCK_AI` con ella | El smoke E2E del Dockerfile + compose se delegó a verificación manual del equipo (ver [`progress/impl_docker_setup.md`](progress/impl_docker_setup.md) y [`progress/review_docker_setup.md`](progress/review_docker_setup.md)). Hoy no hay test que ejecute `docker compose up && curl localhost:3000`. | El entorno del arnés/CI no tiene Docker disponible (ver [`progress/review_realtime_simulation_trigger.md`](progress/review_realtime_simulation_trigger.md) §C3-C4), entonces un test E2E vía script sería verde-falso. Se optó por documentar el procedimiento de smoke y aceptar la limitación. |
| 8 | **Tokens CSS en archivo separado** (`product/frontend/styles/tokens.css`) + Tailwind extendido que los referencia con `var(--…)` en lugar de poner los hex literales solo en `tailwind.config.js` | Hay un nivel de indirección extra: para cambiar un color hay que tocar el `.css` y revisar que la entrada de Tailwind lo reciba. Tampoco hay autocompletado de IDE sobre el contenido de las variables. | Reproduce 1:1 la `:root` del HTML target ([`ui-ux/lead-trust-dashboard-tokko (3).html`](ui-ux/)) — el archivo `.css` es el mismo bloque copiado. Eso hizo trivial demostrar fidelidad al diseño en el review de la feature 7 (13/13 tokens fieles). Además, permite usar las variables directamente desde HTML/JSX no controlado por Tailwind (gradientes en charts, por ejemplo). |
| 9 | **Router de vistas client-side** (un `useState<View>` en `pages/index.tsx` que monta condicionalmente `DashboardView` / `QueueView` / `ProcessedView` / `CriteriaView`) en lugar de rutas dedicadas de Next.js (`pages/dashboard.tsx`, `pages/queue.tsx`, ...) | No hay URL deeplinkable por vista (el botón "Volver" del navegador no funciona, no se puede compartir el link a "Cola"). Tampoco hay code-splitting por vista. | El producto vive dentro de un `AppShell` (Topbar + LeftRail + RightRail + BottomBar) que se mantiene **igual** entre vistas, y el estado de leads + análisis es compartido. Con rutas separadas tendríamos que duplicar el shell o pasar a un `Layout` global; más fricción para una demo de hackaton. Ver `pages/index.tsx` orquestación de `activeView`. |
| 10 | **Simulador unificado con un solo botón `+ Nuevo lead`** y mezcla 80/20 interesado/spam en el servidor en lugar de los dos botones originales (`Simular Lead Interesado` + `Simular Lead Spam`) | El usuario pierde el control fino: no puede forzar un spam si quiere demostrar la sección spam de forma determinística (aunque el endpoint sigue aceptando `type: 'interested' | 'spam'` para tests). | El HTML target Tokko tiene un solo CTA primario en el page-header; mantener dos botones hubiera roto la consistencia visual. Y el ratio 80/20 reproduce mejor la realidad de una bandeja de leads que la opción de elegir el tipo. Ver `SIM_RATIO_INTERESTED = 0.8` en [`product/backend/api/leads/simulate.ts`](product/backend/api/leads/simulate.ts). |
| 11 | **Chart.js + react-chartjs-2** para el bar stacked y el doughnut del Dashboard, en lugar de Recharts o D3 | Chart.js es imperativo y trae un canvas; los tests no pueden assert "la barra de altas mide 28 px" — solo verifican que los datos calculados llegan al componente. El bundle suma ~70 KB. | El HTML target usa Chart.js (era el camino corto para reproducir 1:1). `react-chartjs-2` da el wrapper React idiomático. Los tests cubren `dashboardMetrics.ts` (puro) y verifican que `LeadsBarChart` / `QualityDoughnut` reciben los datos correctos — suficiente. |
| 12 | **Persistencia de criterios en `localStorage`** (clave `criteria_v1`) en lugar de un endpoint backend | Si el usuario abre el dashboard en otra máquina o limpia el browser, pierde su configuración. No hay multi-usuario. | Cero backend, cero migraciones, cero auth. La feature pide persistencia "que sobreviva al refresh", no compartida entre clientes. `criteriaStorage.ts` aísla el acceso a `localStorage` con guard contra SSR (`typeof window`), y los tests inyectan un mock — todo dentro de hackaton-scope. |

---

## 5. Aprendizajes

1. **La puerta humana entre `spec_ready` e `in_progress` paga por sí sola en las features SDD estrictas.** En las 6 features SDD del MVP y las 4 primeras del ciclo Tokko (features 7-10) no hubo retrabajo grande por malentendidos: el spec en disco hizo de contrato. Cuando un implementer leía un requirement ambiguo, no improvisaba — el flujo lo obligaba a parar y pedir aclaración. Lo notamos comparando con la feature 20 (docs, `sdd: false`) donde el implementer tomó decisiones de estructura del README que después comentamos en la review.

2. **Forzar JSON estructurado por system prompt funciona ~95% de las veces; el 5% restante tiene que estar en código defensivo.** La línea 207 de [`ai_analyser.ts`](product/backend/services/ai_analyser.ts) (`const codeBlockMatch = rawText.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);`) existe porque Claude, a pesar de la instrucción explícita "sin bloques de código markdown, sin explicaciones", a veces igual envuelve la respuesta en ` ```json `. Si no lo hubiéramos parcheado, el JSON.parse habría tirado y el frontend habría visto un 500. Lección: **system prompts ≠ contratos**. El validador en código es obligatorio.

3. **El SDK de `@anthropic-ai/sdk` (^0.30.1) tiene tipos solo razonables.** `message.content[0]` es una unión discriminada `TextBlock | ToolUseBlock | ...`; tuvimos que hacer `if (content.type !== 'text') throw ...` antes de usar `.text`. No es un defecto del SDK — refleja la API real — pero suma fricción al primer contacto. La versión 0.x indica que aún no es estable.

4. **Docker en el entorno del reviewer fue el bloqueo recurrente.** `./init.sh` exige Docker, pero el host del revisor no siempre lo tenía instalado. Eso obligó a que los tests del producto se pudieran correr **también** con `npx jest` directo (sin contenedor) y que los reviewers documentaran "init.sh en rojo por falta de Docker en el host" como excepción aceptada (ver [`progress/review_realtime_simulation_trigger.md`](progress/review_realtime_simulation_trigger.md) §C3-C4 y [`progress/review_docker_setup.md`](progress/review_docker_setup.md)). El arnés es robusto, pero su requisito Docker friccionó las revisiones rápidas.

5. **La regla anti-teléfono-descompuesto cambia el shape del log.** El humano que abre el repo *no necesita* leer el chat completo de la sesión: con `progress/impl_<name>.md` y `progress/review_<name>.md` reconstruye qué se hizo y por qué. En la práctica esto convirtió a [`progress/`](progress/) en la "memoria a largo plazo" del proyecto, separada del prompt corto del leader. Es un patrón que vale la pena replicar fuera del hackaton.

6. **Mockear la API de IA en tests con `jest.mock` ahorra plata y tiempo, pero deja un punto ciego real.** Hicimos esta apuesta consciente (ver decisión 5 y patrón 3.4). El día de la demo, si Anthropic responde con un campo extra o renombra algo, los tests no nos van a avisar. Mitigación parcial: el script de demo (ver [`README.md` §3](README.md#3-cómo-se-corre)) levanta `docker compose up` y el primer click sobre `+ Nuevo lead` funciona como smoke manual.

7. **El stack de IA del hackaton terminó siendo más de una sola pieza.** Empezamos pensando "vamos a usar Claude". Terminamos con **Claude el modelo en runtime** + **Claude Code el cliente del desarrollador** + **9 subagentes con prompts y permisos distintos** + **una skill `feature-list` que reusa templates** + **un flujo SDD enforced por convenciones de carpetas**. El "uso de IA" no es solo la llamada a `client.messages.create()`; es la arquitectura cooperativa que la rodea.

8. **El modo "Opción A" (briefing rico sin spec EARS) es viable para tramos de features muy similares entre sí.** Las 8 features `sdd: false` del ciclo Tokko (11-18) cerraron en una sola sesión secuencial sin retrabajo bloqueante. El truco: las features compartían stack, design system y patrón (`KpiCard` → `QueueCard` → `CriterionRow` → `KeywordsList` → ...), y el HTML target hacía de spec implícito. **Cuando las features son disímiles o tocan capas diferentes, no se sostiene** — el MVP (features 1-6) sí necesitó EARS estricto porque cada feature era una capa nueva.

9. **Migrar a un Design System estricto es más una tarea de "buscar y reemplazar consciente" que de creatividad.** El ciclo Tokko (12 features en una sesión) demostró que con (a) un HTML target completo, (b) tokens CSS extraídos antes de tocar componentes y (c) un Tailwind extendido que los referencia, el trabajo se vuelve **mecánico**: cada componente nuevo reusa `bg-brand-primary-500`, `text-feedback-green-500`, `rounded-card`. La fricción real fue el primer paso (extraer tokens fieles al HTML — feature 7); a partir de ahí, los implementers volaron. Lección para futuros productos: **siempre invertir la primera feature en el design system base**.

10. **Los helpers puros en `product/frontend/lib/` aceleraron review más que cualquier otra técnica.** Funciones como `leadReasons.deriveReasons(lead, analysis)` o `dashboardMetrics.computeKpis(leads, analyses)` se testean sin React Testing Library, corren en milisegundos y aíslan la lógica de negocio. Cuando el reviewer abre el `progress/impl_<name>.md` y ve "R5 cubierto en `test_lead_reasons.ts:42`", el veredicto es rápido. Sin esa capa, cada test sería un mount completo del componente con mocks de `useLeadAnalysis` — más lento y más frágil.

---

## Referencias rápidas

- Endpoints runtime: [`pages/api/leads/analyze.ts`](pages/api/leads/analyze.ts) y [`pages/api/leads/simulate.ts`](pages/api/leads/simulate.ts) → [`product/backend/api/leads/`](product/backend/api/leads/) → [`product/backend/services/ai_analyser.ts`](product/backend/services/ai_analyser.ts)
- Generador de leads sintéticos: [`product/backend/lib/leadGenerators.ts`](product/backend/lib/leadGenerators.ts)
- Contrato del JSON: [`product/types/lead_analysis.ts`](product/types/lead_analysis.ts)
- Datos mock: [`product/backend/data/leads_mock.json`](product/backend/data/leads_mock.json), [`product/backend/data/properties_mock.json`](product/backend/data/properties_mock.json)
- Design System Tokko: [`product/frontend/styles/tokens.css`](product/frontend/styles/tokens.css), [`tailwind.config.js`](tailwind.config.js), [`ui-ux/`](ui-ux/) (HTML target)
- Vistas y orquestación: [`pages/index.tsx`](pages/index.tsx), [`product/frontend/views/`](product/frontend/views/)
- Subagentes: [`.claude/agents/`](.claude/agents/) (leader, spec_author, backend_implementer, frontend_implementer, implementer, docker_manager, backend_reviewer, frontend_reviewer, reviewer)
- Backlog: [`feature_list.json`](feature_list.json) y skill [`skills/feature-list/SKILL.md`](skills/feature-list/SKILL.md)
- Bitácora: [`progress/history.md`](progress/history.md) (cierre por sesión) y [`progress/current.md`](progress/current.md) (sesión en curso)
- Hub de procesos: [`README.md`](README.md) §5 explica el flujo SDD desde la perspectiva del repo; este documento lo explica desde la perspectiva del **uso de IA**.
