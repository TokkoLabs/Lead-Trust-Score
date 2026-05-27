# Requirements — mock_data_extension_dashboard (feature id 10)

> EARS estricto. Cada `R<n>` es verificable por al menos un test concreto en
> `tests/backend/test_data_extension.ts` o `tests/backend/test_lead_generators.ts`.

## Glosario de pools (fuentes de verdad)

- `SOURCES_POOL` = `["Zonaprop", "Argenprop", "WhatsApp", "Mail", "Mercadolibre", "Chat web", "Navent"]` (literales extraídos de `ui-ux/lead-trust-dashboard-tokko (3).html` líneas 732-736 y 788-791).
- `ESTADOS_POOL` = `["Nuevo", "En revisión", "Calificado", "Descartado"]` (definición de la feature 10 en `feature_list.json`).
- `TIPOS_PROPIEDAD_POOL` = `["departamento", "casa", "ph", "local_comercial", "oficina", null]` (alineado con el tipo `Lead.tipo_propiedad` actual).
- "Lead extendido" = un objeto que cumple el schema `Lead` de `product/types/lead.ts` (post-extensión), incluyendo los nuevos campos opcionales.

---

## R1 — Extensión del tipo Lead (ubicuo)

El sistema DEBE extender `product/types/lead.ts` agregando cinco campos
opcionales en la interfaz `Lead`: `source?: Source`, `estado?: Estado`,
`created_at?: string`, `agencia?: string | null`, `direccion_propiedad?:
string | null`.

## R2 — Definición de los union types (ubicuo)

El sistema DEBE exportar desde `product/types/lead.ts` dos union types
literales: `Source = "Zonaprop" | "Argenprop" | "WhatsApp" | "Mail" |
"Mercadolibre" | "Chat web" | "Navent"` y `Estado = "Nuevo" | "En revisión"
| "Calificado" | "Descartado"`.

## R3 — Backwards compatibility con leads sin campos nuevos (no deseado)

SI un consumidor del tipo `Lead` (p. ej. `tests/backend/test_data.ts`,
`tests/backend/test_ai_pipeline.ts`, `product/backend/services/ai_analyser.ts`)
construye o recibe un lead sin las claves `source`, `estado`, `created_at`,
`agencia` o `direccion_propiedad` ENTONCES el sistema DEBE compilar y
ejecutar sin errores y sin lanzar excepciones de tipado en tiempo de
build.

## R4 — Cantidad mínima de leads en el mock (ubicuo)

El sistema DEBE asegurar que `product/backend/data/leads_mock.json`
contiene al menos 30 elementos en su array raíz.

## R5 — Source válida en cada lead del mock (ubicuo)

El sistema DEBE asegurar que cada lead de
`product/backend/data/leads_mock.json` contiene la clave `source` con un
valor que pertenece a `SOURCES_POOL`.

## R6 — Estado válido en cada lead del mock (ubicuo)

El sistema DEBE asegurar que cada lead de
`product/backend/data/leads_mock.json` contiene la clave `estado` con un
valor que pertenece a `ESTADOS_POOL`.

## R7 — `created_at` ISO 8601 parseable (ubicuo)

El sistema DEBE asegurar que cada lead de
`product/backend/data/leads_mock.json` contiene la clave `created_at` con
un string que `new Date(value)` parsea sin retornar `NaN` y cuya
representación coincide con el formato ISO 8601 (matches del regex
`^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$`).

## R8 — Ventana temporal de `created_at` (ubicuo)

El sistema DEBE asegurar que cada `created_at` de
`product/backend/data/leads_mock.json` está dentro de los últimos 30 días
contados desde el momento en que se ejecuta el test (`Date.now() -
created_at <= 30 * 24 * 60 * 60 * 1000` y `created_at <= Date.now()`).

## R9 — Distribución diaria suficiente para el bar chart (ubicuo)

El sistema DEBE asegurar que entre los últimos 7 días calendario (UTC),
al menos 5 días tienen ≥ 1 lead con `created_at` cayendo en ese día en
`product/backend/data/leads_mock.json`.

## R10 — Existencia del módulo `leadGenerators.ts` (ubicuo)

El sistema DEBE crear el módulo `product/backend/lib/leadGenerators.ts`
que exporta los siguientes símbolos: `ZONAS_POOL`,
`PRESUPUESTOS_POOL`, `MENSAJES_INTERESTED_POOL`, `MENSAJES_SPAM_POOL`,
`TIPOS_PROPIEDAD_POOL`, `SOURCES_POOL`, `ESTADOS_POOL`, `AGENCIAS_POOL`,
`DIRECCIONES_POOL`, `pickRandom`, `generateRandomLead`.

## R11 — Tamaños mínimos de los pools (ubicuo)

El sistema DEBE asegurar que `MENSAJES_INTERESTED_POOL.length >= 10`,
`MENSAJES_SPAM_POOL.length >= 6`, `AGENCIAS_POOL.length >= 8`,
`DIRECCIONES_POOL.length >= 10`, `ZONAS_POOL.length >= 10`,
`SOURCES_POOL.length === 7`, `ESTADOS_POOL.length === 4`.

## R12 — Determinismo de `pickRandom` con borde inferior (evento)

CUANDO `pickRandom(pool, () => 0)` se invoca con un pool no vacío, el
sistema DEBE retornar `pool[0]`.

## R13 — Determinismo de `pickRandom` con borde superior (evento)

CUANDO `pickRandom(pool, () => 0.9999999)` se invoca con un pool no
vacío, el sistema DEBE retornar `pool[pool.length - 1]`.

## R14 — `generateRandomLead` con `rng` determinista produce Lead válido (evento)

CUANDO `generateRandomLead(() => 0)` se invoca sin `opts`, el sistema
DEBE retornar un objeto `Lead` con TODAS las siguientes claves no nulas
ni vacías: `id` (string no vacío), `mensaje` (string ∈
`MENSAJES_INTERESTED_POOL ∪ MENSAJES_SPAM_POOL`), `telefono` (string),
`email` (string), `zona` (string ∈ `ZONAS_POOL`), `tipo_propiedad` (∈
`TIPOS_PROPIEDAD_POOL`), `presupuesto_usd` (number ≥ 0), `property_ids`
(array, puede ser vacío), `source` (∈ `SOURCES_POOL`), `estado` (∈
`ESTADOS_POOL`), `created_at` (string ISO 8601), `agencia` (string ∈
`AGENCIAS_POOL`), `direccion_propiedad` (string ∈ `DIRECCIONES_POOL`).

## R15 — `generateRandomLead` produce Leads distintos con `rng` distintos (evento)

CUANDO `generateRandomLead(() => 0)` y `generateRandomLead(() => 0.99)`
se invocan en secuencia, el sistema DEBE retornar dos objetos cuyos
campos `zona`, `source` y `mensaje` no son simultáneamente iguales (al
menos uno de los tres difiere).

## R16 — `generateRandomLead` honra `forceType="spam"` (evento)

CUANDO `generateRandomLead(rng, { forceType: "spam" })` se invoca con
cualquier `rng`, el sistema DEBE retornar un Lead cuyo `mensaje`
pertenece a `MENSAJES_SPAM_POOL`.

## R17 — `generateRandomLead` honra `forceType="interested"` (evento)

CUANDO `generateRandomLead(rng, { forceType: "interested" })` se invoca
con cualquier `rng`, el sistema DEBE retornar un Lead cuyo `mensaje`
pertenece a `MENSAJES_INTERESTED_POOL`.

## R18 — `pickRandom` sin `rng` usa `Math.random` (ubicuo)

DONDE el segundo argumento de `pickRandom` se omite, el sistema DEBE
usar `Math.random` como fuente de aleatoriedad y retornar un elemento
perteneciente al pool.

## R19 — Compatibilidad de `leads_mock.json` con tests previos (no deseado)

SI `tests/backend/test_data.ts` u otros consumidores del archivo
`leads_mock.json` se ejecutan después de la extensión, ENTONCES el
sistema DEBE seguir validando los campos originales (`id`, `mensaje`,
`telefono`, `email`, `zona`, `tipo_propiedad`, `presupuesto_usd`,
`property_ids` con `>= 1` elemento) en todos los leads sin error.

## R20 — IDs únicos en el mock (ubicuo)

El sistema DEBE asegurar que los `id` de todos los leads de
`product/backend/data/leads_mock.json` son únicos (no hay duplicados).
