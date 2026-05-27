# Lead Trust Copilot

> Plataforma agéntica de scoring y priorización de leads inmobiliarios, construida en un hackaton con **Harness Engineering + Spec Driven Development (SDD)** y un equipo cooperativo de subagentes de Claude Code.

---

## Tabla de contenidos

1. [Qué es Lead Trust Copilot](#1-qué-es-lead-trust-copilot)
2. [Stack](#2-stack)
3. [Cómo se corre](#3-cómo-se-corre)
4. [Estructura del repo](#4-estructura-del-repo)
5. [Cómo desarrollamos: Harness Engineering + SDD](#5-cómo-desarrollamos-harness-engineering--sdd)
6. [Arquitectura del backend](#6-arquitectura-del-backend)
7. [Entregables](#7-entregables)
8. [Link al repo](#8-link-al-repo)

---

## 1. Qué es Lead Trust Copilot

Lead Trust Copilot es un **dashboard agéntico para inmobiliarias** que recibe leads entrantes (mensajes, contactos), los clasifica con IA y los prioriza en cuatro vistas conectadas — Dashboard, Cola, Procesados y Criterios — para que el agente comercial atienda primero a los de mayor potencial.

Cada lead es analizado por **Claude** y devuelve, en un único JSON estructurado, tres scores (trust, conversion, urgency), un flag `is_spam`, un resumen ejecutivo (`ai_summary`), una **acción recomendada** copiable al portapapeles y los IDs de las propiedades del catálogo que mejor encajan con su perfil. El **Dashboard** complementa esto con 4 KPI cards, un bar chart stacked de leads por día y calidad, un doughnut de distribución por calidad, una tabla de leads recientes, un funnel por fuente y una card de criterios de scoring con tabs (Pesos / Filtros / Canales). La **vista Cola** muestra queue cards expandidas con razones IA y contacto enmascarado. La **vista Criterios** permite configurar pesos, keywords positivas/negativas y filtros automáticos, con persistencia en `localStorage`. Un **simulador unificado** (botón `+ Nuevo lead` en el page-header de Dashboard y Cola) inyecta leads sintéticos con datos aleatorizados, mezclando 80 % interesados y 20 % spam para mostrar cómo se reordena la cola en tiempo real.

La meta del hackaton no era solo el producto final, sino **demostrar el proceso de construcción cooperativa con agentes**: un `leader` que orquesta sin tocar código, `spec_author` que redacta el contrato antes de implementar, e `implementers` y `reviewers` por capa que escriben y validan en paralelo.

---

## 2. Stack

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework | **Next.js** (Pages Router) | `^16.2.6` |
| UI | **React** | `^19.2.6` |
| Lenguaje | **TypeScript** | `^5.4.5` |
| Estilos | **Tailwind CSS** | `^3.4.17` |
| Design System | **Tokko** (tokens CSS + Tailwind extendido, Nunito Sans) | in-repo |
| Gráficos | **Chart.js** + **react-chartjs-2** | `^4.5.1` / `^5.3.1` |
| IA en runtime | **Claude API** vía `@anthropic-ai/sdk` | `^0.30.1` |
| Modelo | `claude-sonnet-4-6` (servidor) | — |
| Testing | **Jest** + **ts-jest** + Testing Library | `^30.4.2` |
| Empaquetado | **Docker** + **docker-compose** | runtime local |
| Node | `node:20-alpine` (imagen base) | 20.x |

### Design System Tokko

El frontend usa el **Design System Tokko** (theming claro alineado con el HTML target [`ui-ux/lead-trust-dashboard-tokko (3).html`](ui-ux/)):

- **Tipografía:** Nunito Sans cargada desde Google Fonts en [`pages/_document.tsx`](pages/_document.tsx) y aplicada como `font-family` base.
- **Tokens:** variables CSS en [`product/frontend/styles/tokens.css`](product/frontend/styles/tokens.css) importadas desde [`styles/globals.css`](styles/globals.css). Cubren color, tipografía, spacing, radius (16 / 8 / 6 / 1000 px) y shadows.
- **Paleta brand:** rojo `#DF1517` (brand-primary), teal `#1A4958` / `#427F94` (brand-secondary), feedback green / yellow / blue, grises 50-900 — todos expuestos como clases Tailwind (`bg-brand-primary-500`, `text-feedback-green-500`, etc.) vía [`tailwind.config.js`](tailwind.config.js).
- **Animaciones:** `enter` (slide-in del feed) y `pulseDot` (live badge del bottom bar).

### Router de vistas client-side

La navegación entre las 4 vistas (Dashboard / Cola / Procesados / Criterios) es **client-side**, sin Next.js dynamic routing: [`pages/index.tsx`](pages/index.tsx) mantiene un estado local `activeView` y monta condicionalmente cada componente de `product/frontend/views/`. El `LeftRail` y el `PageHeader` reaccionan al cambio sin recargar la página.

Ver [`package.json`](package.json) para la lista exacta de dependencias.

---

## 3. Cómo se corre

Quickstart desde una máquina limpia. Tiempo estimado del primer build: **~10 minutos** (descarga de `node:20-alpine`, `npm ci` y `next build`).

### Prerrequisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) con el daemon activo.
- Una clave de API de Anthropic (obtener en <https://console.anthropic.com/>).

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/<owner>/<repo>.git lead-trust-copilot
cd lead-trust-copilot

# 2. Copiar el template de variables de entorno y editarlo
cp .env.example .env
# Abrir .env y pegar tu clave en ANTHROPIC_API_KEY=...

# 3. Levantar el servicio (build + run en un solo comando)
docker compose -f docker/docker-compose.yml up lead-trust-copilot

# 4. Abrir el dashboard
#    http://localhost:3000
```

Para detenerlo:

```bash
docker compose -f docker/docker-compose.yml down
```

### Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `ANTHROPIC_API_KEY` | Sí | Clave de Claude API para el scoring de leads |
| `NODE_ENV` | No | El Dockerfile lo fija en `production` |
| `GITHUB_EXPECTED_USER` | No | Login esperado por `init.sh` (validación del arnés) |
| `APP_PORT` | No | Puerto host para el perfil `product` del arnés (default `8080`) |

El archivo `.env` **nunca** debe commitearse (está en `.gitignore`). Solo se versionan [`/.env.example`](.env.example) y [`docker/.env.example`](docker/.env.example).

---

## 4. Estructura del repo

| Ruta | Rol |
|------|-----|
| [`pages/`](pages/) | Rutas de Next.js (Pages Router); `pages/index.tsx` orquesta las 4 vistas |
| [`pages/_app.tsx`](pages/_app.tsx) / [`pages/_document.tsx`](pages/_document.tsx) | Bootstrap de la app y carga de Nunito Sans desde Google Fonts |
| [`pages/api/leads/analyze.ts`](pages/api/leads/analyze.ts) | Endpoint `POST /api/leads/analyze` (re-export thin) |
| [`pages/api/leads/simulate.ts`](pages/api/leads/simulate.ts) | Endpoint `POST /api/leads/simulate` para el simulador unificado |
| [`product/`](product/) | Código de aplicación: `backend/`, `frontend/`, `types/` |
| [`product/backend/api/leads/`](product/backend/api/leads/) | Handlers de dominio para `analyze` y `simulate` |
| [`product/backend/services/`](product/backend/services/) | `ai_analyser.ts` (cliente de Claude + JSON estricto) |
| [`product/backend/lib/`](product/backend/lib/) | `leadGenerators.ts` con pools (zonas, presupuestos, mensajes, sources, agencias) |
| [`product/backend/data/`](product/backend/data/) | `leads_mock.json` (30 leads con source/estado/created_at) y `properties_mock.json` |
| [`product/frontend/components/`](product/frontend/components/) | `AppShell`, `PageHeader`, `LeadDetailPanel`, `LeadsFeed`, `LeadCard` |
| [`product/frontend/components/shell/`](product/frontend/components/shell/) | `Topbar`, `LeftRail`, `RightRail`, `BottomBar`, `Icon` (app shell Tokko) |
| [`product/frontend/components/dashboard/`](product/frontend/components/dashboard/) | `KpiCard`, `KpiRow`, `LeadsBarChart`, `QualityDoughnut`, `RecentLeadsTable`, `SourceFunnel`, `CriteriaCard`, `ScoreBar` |
| [`product/frontend/components/queue/`](product/frontend/components/queue/) | `QueueCard`, `FilterBar`, `QueueStats` |
| [`product/frontend/components/criteria/`](product/frontend/components/criteria/) | `CriteriaSection`, `CriterionRow`, `KeywordsList` |
| [`product/frontend/components/common/`](product/frontend/components/common/) | `Toast` (feedback de éxito/error reusable) |
| [`product/frontend/views/`](product/frontend/views/) | `DashboardView`, `QueueView`, `ProcessedView`, `CriteriaView` (router client-side) |
| [`product/frontend/lib/`](product/frontend/lib/) | `criteriaDefaults`, `criteriaStorage`, `dashboardMetrics`, `leadReasons`, `scoreUtils` |
| [`product/frontend/styles/`](product/frontend/styles/) | `tokens.css` (variables CSS del Design System Tokko) |
| [`product/frontend/hooks/`](product/frontend/hooks/) | `useLeadAnalysis` (cliente del endpoint analyze) |
| [`product/types/`](product/types/) | Contratos TypeScript compartidos: `lead.ts`, `property.ts`, `lead_analysis.ts` |
| [`styles/`](styles/) | `globals.css` (importa tokens Tokko + base Tailwind) |
| [`ui-ux/`](ui-ux/) | HTML target del Design System Tokko (referencia visual) |
| [`tests/`](tests/) | Tests por capa: `tests/backend/` y `tests/frontend/` |
| [`docker/`](docker/) | `Dockerfile`, `docker-compose.yml`, `Dockerfile.harness`, scripts del arnés |
| [`specs/`](specs/) | Specs SDD por feature (`requirements.md`, `design.md`, `tasks.md`) |
| [`progress/`](progress/) | Bitácora viva: `current.md`, `history.md`, `impl_*.md`, `review_*.md` |
| [`deliverables/`](deliverables/) | Entregables del hackaton: README, guión y tips del video demo |
| [`.claude/agents/`](.claude/agents/) | Definiciones de subagentes: `leader`, `spec_author`, implementers, reviewers, `docker_manager` |
| [`skills/`](skills/) | Skills del arnés: [`feature-list`](skills/feature-list/SKILL.md) y [`agent-author`](skills/agent-author/SKILL.md) |
| [`docs/`](docs/) | Documentación del proceso: [arquitectura](docs/architecture.md), [convenciones](docs/conventions.md), [SDD](docs/specs.md), [verificación](docs/verification.md), [docker](docs/docker.md), [harness-readme](docs/harness-readme.md) |
| [`feature_list.json`](feature_list.json) | Backlog SDD: una feature a la vez, estados y `layer` por feature |
| [`init.sh`](init.sh) / [`init.ps1`](init.ps1) | Pre-flight checks del host (Docker, Git, `gh`) |
| [`AGENTS.md`](AGENTS.md) | Mapa de navegación para agentes |
| [`CLAUDE.md`](CLAUDE.md) | Instrucciones de sesión: Claude actúa siempre como `leader` |
| [`CHECKPOINTS.md`](CHECKPOINTS.md) | Criterios objetivos de cierre del repo |

---

## 5. Cómo desarrollamos: Harness Engineering + SDD

### 5.1 Qué es Harness Engineering

**Harness Engineering** es la práctica de construir un *arnés* reproducible — Docker, scripts, agentes, specs, progress — que envuelve al producto y obliga al equipo (humano + IA) a trabajar con el mismo protocolo en cada sesión, en lugar de improvisar.

### 5.2 Qué es SDD y por qué la puerta humana

**Spec Driven Development (SDD)** sigue un flujo Kiro-style: **requirements → design → tasks → code**. No se escribe una línea de aplicación hasta que el spec está aprobado.

Cada feature SDD tiene tres archivos en `specs/<feature>/`:

- `requirements.md` — qué hace, en notación EARS estricta (cada `R<n>` es verificable).
- `design.md` — cómo se construirá: archivos, firmas, alternativas descartadas.
- `tasks.md` — pasos discretos `- [ ]`, cada uno referenciando los `R<n>` que cubre.

Entre `spec_ready` e `in_progress` hay una **puerta humana**: el `leader` se detiene, el humano lee el spec y decide aprobar o pedir cambios. Esto evita que la IA implemente sobre una mala interpretación del problema y mantiene el control editorial en el equipo.

### 5.3 Punto de entrada

Al abrir el repo con **Claude Code**, el cliente carga automáticamente [`CLAUDE.md`](CLAUDE.md). Ese archivo:

1. Pone a Claude en rol **`leader`** (orquestador, no escribe código).
2. Le indica leer [`AGENTS.md`](AGENTS.md), [`feature_list.json`](feature_list.json) y [`progress/current.md`](progress/current.md).
3. Le obliga a ejecutar [`./init.sh`](init.sh) (o `./init.ps1`) para verificar el entorno antes de tocar nada.

Si `init.sh` falla, el `leader` para y reporta. Solo con el arnés en verde se permite avanzar.

### 5.4 Ciclo completo de una feature

```
   pending ─▶ [spec_author] ─▶ spec_ready ─▶ ⏸ HUMANO APRUEBA ─▶ in_progress
                                                                       │
                                                                       ▼
                                                      [implementer_* + docker_manager?]
                                                                       │
                                                                       ▼
                                                              [reviewer_*]
                                                                       │
                                                                       ▼
                                                                     done
```

- **`spec_author`** redacta los tres archivos del spec y deja la feature en `spec_ready`. Se detiene.
- **Humano** revisa `specs/<feature>/`. Si aprueba, el `leader` mueve la feature a `in_progress`.
- **Implementer** (uno de `backend_implementer`, `frontend_implementer`, `implementer`) escribe código en `product/` y tests en `tests/` siguiendo el spec.
- **`docker_manager`** entra en paralelo si hay tasks de infraestructura (Dockerfiles, compose, scripts).
- **Reviewer** (`backend_reviewer`, `frontend_reviewer` o `reviewer`) valida trazabilidad `R<n> → test` y completitud de tasks. Solo entonces la feature pasa a `done`.

### 5.5 Cómo definimos el backlog con la skill `feature-list`

El backlog vive en [`feature_list.json`](feature_list.json) y se mantiene con la skill documentada en [`skills/feature-list/SKILL.md`](skills/feature-list/SKILL.md) (esquema en [`schema.md`](skills/feature-list/schema.md)). Las reglas duras son:

- Una feature en `in_progress` a la vez (`one_feature_at_a_time: true`).
- `acceptance` array de criterios verificables (archivos concretos, comandos, tests).
- `layer` (`backend` | `frontend` | `fullstack` | `docker` | `docs`) enruta al implementer y reviewer correctos.
- `"sdd": true` para todo lo que sea código de producto.

Mini-ejemplo de una entrada de feature (adaptado de [`skills/feature-list/SKILL.md`](skills/feature-list/SKILL.md)):

```json
{
  "id": 2,
  "name": "ai_scoring_pipeline",
  "title": "Pipeline de Análisis con Claude API (JSON estructurado)",
  "layer": "backend",
  "description": "API route que cruza un lead con el catálogo y devuelve scoring + insights de Claude.",
  "acceptance": [
    "Existe product/backend/services/ai_analyser.ts con ANTHROPIC_API_KEY desde env.",
    "El prompt del sistema fuerza JSON estricto con trust_score, conversion_score, is_spam, ai_summary, property_match_ids.",
    "tests/backend/test_ai_pipeline.ts valida el tipado de la respuesta."
  ],
  "sdd": true,
  "status": "pending"
}
```

### 5.6 Cómo trabajan los agentes

El **leader** NO escribe código. Solo orquesta. Cada subagente tiene un alcance acotado por archivos:

| Agente | Qué hace | Dónde escribe |
|--------|----------|---------------|
| [`leader`](.claude/agents/leader.md) | Descompone la tarea, lanza subagentes, mueve estados (nunca a `done`) | `feature_list.json` (estados), `progress/current.md` |
| [`spec_author`](.claude/agents/spec_author.md) | Redacta el contrato de la feature en EARS estricto | `specs/<feature>/{requirements,design,tasks}.md` |
| [`backend_implementer`](.claude/agents/backend_implementer.md) | Implementa lógica server-side y sus tests | `product/backend/`, `tests/backend/` |
| [`frontend_implementer`](.claude/agents/frontend_implementer.md) | Implementa UI y sus tests | `product/frontend/`, `tests/frontend/` |
| [`implementer`](.claude/agents/implementer.md) | Fullstack (cuando `layer` es `fullstack` o ausente) | `product/`, `tests/` |
| [`docker_manager`](.claude/agents/docker_manager.md) | Mantiene infraestructura Docker | `docker/`, scripts, compose |
| [`backend_reviewer`](.claude/agents/backend_reviewer.md) | Valida trazabilidad y tasks backend | `progress/review_<feature>.md` |
| [`frontend_reviewer`](.claude/agents/frontend_reviewer.md) | Valida trazabilidad y tasks frontend | `progress/review_<feature>.md` |
| [`reviewer`](.claude/agents/reviewer.md) | Revisor fullstack / infra | `progress/review_<feature>.md` |

**Enrutamiento por `layer`** (definido en [`feature_list.json`](feature_list.json)):

| layer | Implementer | Reviewer |
|-------|-------------|----------|
| `backend` | `backend_implementer` | `backend_reviewer` |
| `frontend` | `frontend_implementer` | `frontend_reviewer` |
| `fullstack` o ausente | `implementer` | `reviewer` |
| `docker` / `infra` | `docker_manager` (+ implementer si aplica) | `reviewer` |
| `docs` | `implementer` (escritura directa) | revisión humana |

### 5.7 Cómo se crean los tests dentro del SDD

Los tests **no los escribe el reviewer** (no edita código). Los escribe el **implementer** durante la implementación, junto con la feature:

- Tests backend → `tests/backend/` (Jest + ts-jest).
- Tests frontend → `tests/frontend/` (Testing Library).
- **Cada `R<n>` de `requirements.md` debe tener al menos un test que lo cubra.**
- El implementer documenta la trazabilidad `R<n> → archivo:test` en `progress/impl_<feature>.md`.
- El reviewer ejecuta `./docker/scripts/product-test.sh` (o `./init.sh` para el arnés), verifica que cada `R<n>` tenga evidencia concreta y **rechaza si falta cobertura**.
- La regla [`"require_tests_to_close": true`](feature_list.json) en `feature_list.json` hace cumplir esto a nivel de proceso: **sin tests verdes la feature no llega a `done`**.

Detalle del proceso en [`docs/verification.md`](docs/verification.md).

### 5.8 Regla anti-teléfono-descompuesto

Los subagentes **escriben sus resultados en archivos** y solo devuelven al `leader` la **referencia**, no el contenido:

- `spec_author` → `spec_ready -> specs/<feature>/`
- `implementer` → `done -> progress/impl_<feature>.md`
- `reviewer` → `APPROVED -> progress/review_<feature>.md`

El `leader` (y el humano) leen los artefactos en disco. Esto evita que la información se degrade al pasar por la ventana de contexto de varios agentes (el clásico *teléfono descompuesto*) y deja un rastro auditable de la sesión.

### 5.9 Resultado real

El flujo descripto en §5.1-5.8 no es teoría: se aplicó de punta a punta en este hackaton. **21 features ejecutadas** sobre el flujo SDD del arnés:

- **18 features de producto** (id 1-18 en [`feature_list.json`](feature_list.json)), todas con `status: "done"` o equivalente verificado en código. Las 6 primeras (`mock_data_ingest` → `docker_setup`) cubren el MVP original. Las 12 siguientes (`tokko_design_system_setup` → `unified_random_lead_simulator`) corresponden a la migración al Design System Tokko, el rediseño del app shell, las 4 vistas con router, el dashboard con KPIs y gráficos, la vista Cola con razones IA, la vista Criterios configurable, y el simulador unificado 80/20.
- **3 entregables del hackaton** (id 19-21): el video demo (`deliverable_video_demo`, sigue `in_progress` porque el MP4 lo graba el humano), este README (`deliverable_readme`, `done`) y [`AI_USAGE.md`](AI_USAGE.md) (`deliverable_ai_usage`, `done`).
- **1 feature descartada en vuelo:** `docker_smoke_test` no llegó a `pending`/`spec_ready` en el backlog vigente; el smoke E2E quedó como verificación manual documentada (ver [`AI_USAGE.md §4`](AI_USAGE.md#4-decisiones) decisión 7).

La evidencia concreta está en [`progress/impl_*.md`](progress/) (un informe por feature con trazabilidad `R<n> → test`) y [`progress/review_*.md`](progress/) (veredictos APPROVED firmados por el reviewer correspondiente). En conjunto, el último ciclo (features 7-18) cerró con **139 tests verdes** repartidos entre `tests/backend/` (9) y `tests/frontend/` (130).

---

## 6. Arquitectura del backend

### 6.1 Next.js Pages Router con API routes

El producto es una sola app Next.js. Las **API routes** viven en [`pages/api/`](pages/api/) y son archivos thin que **re-exportan handlers** desde [`product/backend/api/`](product/backend/api/). Así separamos el routing (responsabilidad del framework) de la lógica de dominio (responsabilidad de `product/backend/`).

Hoy hay dos endpoints expuestos:

- [`POST /api/leads/analyze`](pages/api/leads/analyze.ts) — scoring IA de un lead existente (recibe `leadId`).
- [`POST /api/leads/simulate`](pages/api/leads/simulate.ts) — simulador unificado: genera un lead aleatorio y lo analiza en la misma request (recibe body opcional `{ type?: 'random' | 'interested' | 'spam' }`, default `random`).

### 6.2 Ruta de un request (`analyze`)

```
┌──────────────┐    POST /api/leads/analyze    ┌───────────────────────────────────┐
│  Navegador   │ ─────────────────────────────▶│ pages/api/leads/analyze.ts        │
│ (LeadDetail) │  body: { leadId: "lead-3" }   │   (thin re-export)                │
└──────────────┘                               └────────────────┬──────────────────┘
        ▲                                                       │
        │                                                       ▼
        │                                  ┌──────────────────────────────────────┐
        │  JSON { trust_score, ...,        │ product/backend/api/leads/analyze.ts │
        │         ai_summary,              │   - lee leads_mock.json              │
        │         property_match_ids }     │   - filtra propiedades candidatas    │
        │                                  │   - llama analyseLeadWithAI(...)     │
        │                                  └────────────────┬─────────────────────┘
        │                                                   │
        │                                                   ▼
        │                                  ┌──────────────────────────────────────┐
        │                                  │ product/backend/services/            │
        │                                  │   ai_analyser.ts                     │
        │                                  │   - system prompt → JSON estricto    │
        │                                  │   - Anthropic SDK → claude-sonnet-4-6│
        │                                  │   - parse + validate schema          │
        │                                  └────────────────┬─────────────────────┘
        │                                                   │
        │                                                   ▼
        │                                              ┌────────┐
        └──────── LeadAnalysis (typed) ────────────────│ Claude │
                                                       └────────┘
```

1. El navegador (panel de detalle del lead) llama `POST /api/leads/analyze` con `{ leadId }`.
2. [`pages/api/leads/analyze.ts`](pages/api/leads/analyze.ts) re-exporta el handler de dominio.
3. [`product/backend/api/leads/analyze.ts`](product/backend/api/leads/analyze.ts) lee los mocks, busca el lead, pre-filtra propiedades candidatas e invoca al servicio.
4. [`product/backend/services/ai_analyser.ts`](product/backend/services/ai_analyser.ts) construye el prompt, llama a Claude vía `@anthropic-ai/sdk` y valida la respuesta con `validateLeadAnalysis()`.
5. El backend retorna `LeadAnalysis` (JSON tipado).
6. El frontend (`LeadDetailPanel`) renderiza scores, `ai_summary`, `suggested_action`, las propiedades coincidentes y las reason chips derivadas en [`product/frontend/lib/leadReasons.ts`](product/frontend/lib/leadReasons.ts).

### 6.3 Ruta de un request (`simulate`) — simulador unificado

El simulador del Dashboard y la Cola dispara un único endpoint que encadena generación + análisis dentro del mismo handler. Frontend → BottomBar / PageHeader (botón `+ Nuevo lead`) → `POST /api/leads/simulate` → genera lead random desde pools → `filterCandidateProperties` → `analyseLeadWithAI` → JSON `{ lead, analysis }` al cliente.

```
┌──────────────────┐  POST /api/leads/simulate  ┌────────────────────────────────────┐
│  Navegador       │ ───────────────────────────▶│ pages/api/leads/simulate.ts        │
│ (PageHeader      │   body: {}  (default        │   (thin re-export)                 │
│  "+ Nuevo lead") │    type='random')           └────────────────┬───────────────────┘
└──────────────────┘                                              │
         ▲                                                        ▼
         │                              ┌─────────────────────────────────────────────┐
         │                              │ product/backend/api/leads/simulate.ts       │
         │  JSON { lead,                │   1. Resuelve type: si 'random', tira       │
         │         analysis }           │      Math.random() < 0.8 → 'interested'     │
         │                              │      else → 'spam' (SIM_RATIO_INTERESTED)   │
         │                              │   2. lead = generateRandomLead({forceType}) │
         │                              │   3. lee properties_mock.json               │
         │                              │   4. filterCandidateProperties(lead, ...)   │
         │                              │   5. analyseLeadWithAI(lead, candidates)    │
         │                              └────────────────────────┬────────────────────┘
         │                                                       │
         │                              ┌────────────────────────▼────────────────────┐
         │                              │ product/backend/lib/leadGenerators.ts       │
         │                              │   pools: ZONAS / PRESUPUESTOS / MENSAJES    │
         │                              │   _INTERESTED / _SPAM / SOURCES / AGENCIAS  │
         │                              │   / DIRECCIONES; created_at = now           │
         │                              └─────────────────────────────────────────────┘
         │                                                       │
         │                                                       ▼
         │                                  ai_analyser.ts → Claude → LeadAnalysis
         │                                                       │
         └──────────── handleLeadSimulated(data) ◀───────────────┘
                  insert animado en feed o sección spam
```

El cliente — [`pages/index.tsx`](pages/index.tsx) — mantiene `simLoading` + `simError`, muestra un spinner inline en el botón mientras espera y un `Toast` de error si la request falla. Como el endpoint reutiliza `analyseLeadWithAI`, **un solo click produce a la vez el lead y su scoring de IA**.

### 6.4 `ai_analyser.ts`: JSON estricto desde el system prompt

El servicio fuerza la salida JSON desde el **system prompt** (no desde una segunda llamada de parsing):

```ts
{
  "trust_score":      <0-100>,
  "conversion_score": <0-100>,
  "urgency_score":    <0-100>,
  "is_spam":          <boolean>,
  "detected_intent":  "<string>",
  "suggested_action": "<string>",
  "ai_summary":       "<2-3 oraciones en español>",
  "property_match_ids": ["<prop-id>", ...]
}
```

`validateLeadAnalysis()` verifica tipos, rangos y campos obligatorios y lanza `AIResponseParseError` si la respuesta no cumple. Esto blinda el frontend contra respuestas malformadas. El modelo invocado es `claude-sonnet-4-6` (hardcodeado en [`ai_analyser.ts`](product/backend/services/ai_analyser.ts) línea 187).

### 6.5 Data layer mock

Para el hackaton no hay base de datos. Los datos viven en JSON en [`product/backend/data/`](product/backend/data/):

- [`leads_mock.json`](product/backend/data/leads_mock.json) — **30 leads** sintéticos con mensaje, contacto, zona, presupuesto, `property_ids`, **`source`** (Zonaprop / Argenprop / WhatsApp / Mail / Mercadolibre / Chat web / Navent), **`estado`** (Nuevo / En revisión / Calificado / Descartado), **`created_at`** (ISO 8601, distribuidos en los últimos 7 días para alimentar el bar chart del Dashboard), **`agencia`** y **`direccion_propiedad`**.
- [`properties_mock.json`](product/backend/data/properties_mock.json) — catálogo de propiedades con id, título, zona, tipo, dormitorios y precio.

Los handlers leen estos archivos con `fs.readFileSync` en cada request — suficiente para una demo y trivial de migrar a una DB real. Para el simulador, [`product/backend/lib/leadGenerators.ts`](product/backend/lib/leadGenerators.ts) expone pools reusables (zonas, presupuestos, mensajes interested/spam, sources, agencias, direcciones) que alimentan `generateRandomLead`.

### 6.6 Tipos compartidos

[`product/types/`](product/types/) define el contrato entre backend y frontend:

- [`lead.ts`](product/types/lead.ts) — `Lead` (id, mensaje, contacto, zona, presupuesto, property_ids) más los campos `source`, `estado`, `created_at`, `agencia`, `direccion_propiedad` (todos opcionales para no romper specs previas) y los enums `Source` y `Estado`.
- [`property.ts`](product/types/property.ts) — `Property` (catálogo).
- [`lead_analysis.ts`](product/types/lead_analysis.ts) — `LeadAnalysis` (output de Claude) + `AIResponseParseError`.

El frontend importa los mismos tipos que el backend produce: **un solo source of truth** para el shape del JSON que cruza la red.

### 6.7 Seguridad de la API key

`ANTHROPIC_API_KEY` se inyecta desde `.env` **en runtime**, nunca hardcodeada ni baked en la imagen Docker:

- El [`Dockerfile`](docker/Dockerfile) **no** copia `.env` ni declara la variable en build.
- El servicio `lead-trust-copilot` en [`docker-compose.yml`](docker/docker-compose.yml) la inyecta vía `env_file: ../.env` al arrancar el contenedor.
- [`ai_analyser.ts`](product/backend/services/ai_analyser.ts) la lee con `process.env['ANTHROPIC_API_KEY']` y lanza si está ausente.
- [`.gitignore`](.gitignore) excluye `.env` para que nunca llegue al repo.

---

## 7. Entregables

| Entregable | Estado | Descripción |
|------------|--------|-------------|
| [`README.md`](README.md) | Done | Este documento (entregable 20). |
| [`AI_USAGE.md`](AI_USAGE.md) | Done | Uso de IA: stack, runtime vs dev, patrones avanzados, decisiones y aprendizajes (entregable 21). |
| [`deliverables/README.md`](deliverables/README.md) | Done | Índice de entregables del hackaton con el resumen del video planificado (duración, qué muestra) y las instrucciones de `git-lfs` para commitear el MP4. |
| [`deliverables/script.md`](deliverables/script.md) | Done | Guión narrado del video demo: checklist "Antes de grabar", 4 escenas con timestamps y voice-over en español. |
| [`deliverables/recording-tips.md`](deliverables/recording-tips.md) | Done | Tips de grabación: herramientas (QuickTime / OBS / Loom), formato MP4 H.264 1080p, voice-over vs subtítulos y manejo de peso con git-lfs. |
| `deliverables/demo.mp4` | In progress | Video de 2-4 minutos mostrando el dashboard, el panel de detalle, el simulador en vivo y la app corriendo en `localhost:3000` desde Docker. *(graba el humano siguiendo [`deliverables/script.md`](deliverables/script.md); feature 19 sigue en `in_progress` en [`feature_list.json`](feature_list.json) hasta que el MP4 esté commiteado vía git-lfs)* |
| [`docs/harness-readme.md`](docs/harness-readme.md) | — | README original del template R2D2-Harness, preservado al pivotar el repo al producto. |

---

## 8. Link al repo

<https://github.com/<owner>/<repo>>

<!-- TODO: reemplazar con la URL final del repositorio en GitHub antes de la entrega del hackaton -->
