# Design — mock_data_extension_dashboard

## Resumen

Extender el tipo `Lead`, crear el módulo `leadGenerators.ts` con pools y
helpers de generación deterministas, y regenerar el archivo
`leads_mock.json` con ≥30 leads que respetan los nuevos campos y se
distribuyen en los últimos 7 días.

## Archivos a tocar / crear

| Path | Acción | Motivo |
|------|--------|--------|
| `product/types/lead.ts` | modificar | Extender interface `Lead` con campos opcionales + exportar `Source` y `Estado`. |
| `product/backend/lib/leadGenerators.ts` | crear | Pools y funciones `pickRandom`, `generateRandomLead`. Modulo reutilizable por la feature 18. |
| `product/backend/data/leads_mock.json` | reemplazar contenido | Pasar de 15 a 30+ leads, todos con los nuevos campos y `created_at` distribuido. |
| `tests/backend/test_data_extension.ts` | crear | Cubre R3-R9, R19, R20. |
| `tests/backend/test_lead_generators.ts` | crear | Cubre R10-R18. |

NO se tocan: `product/backend/data/properties_mock.json`,
`product/backend/api/leads/simulate.ts`,
`product/backend/services/ai_analyser.ts`,
`product/backend/api/leads/analyze.ts`, ningún archivo de `product/frontend/`.

## Firmas nuevas

### `product/types/lead.ts`

```ts
export type Source =
  | "Zonaprop"
  | "Argenprop"
  | "WhatsApp"
  | "Mail"
  | "Mercadolibre"
  | "Chat web"
  | "Navent";

export type Estado =
  | "Nuevo"
  | "En revisión"
  | "Calificado"
  | "Descartado";

export interface Lead {
  id: string;
  mensaje: string;
  telefono: string;
  email: string;
  zona: string;
  tipo_propiedad:
    | "departamento"
    | "casa"
    | "ph"
    | "local_comercial"
    | "oficina"
    | null;
  presupuesto_usd: number;
  property_ids: string[];
  // Campos nuevos — todos opcionales para preservar compatibilidad con specs 1-5.
  source?: Source;
  estado?: Estado;
  created_at?: string; // ISO 8601 UTC, p. ej. "2026-05-22T14:30:00.000Z"
  agencia?: string | null;
  direccion_propiedad?: string | null;
}
```

### `product/backend/lib/leadGenerators.ts`

```ts
import type {
  Lead,
  Source,
  Estado,
} from "../../types/lead";

type TipoPropiedad = Lead["tipo_propiedad"]; // incluye null

export const ZONAS_POOL: readonly string[] = [
  "Palermo", "Belgrano", "Recoleta", "Caballito", "Tigre",
  "Flores", "San Isidro", "Villa Crespo", "Núñez", "Devoto",
  "Almagro", "Vicente López",
] as const;

export const PRESUPUESTOS_POOL: readonly number[] = [
  85000, 95000, 120000, 150000, 175000, 200000, 240000, 300000, 380000, 450000,
] as const;

export const MENSAJES_INTERESTED_POOL: readonly string[] = [
  "Hola, quisiera coordinar una visita esta semana, estoy interesado en mudarme cuanto antes.",
  "Me interesa comprar el departamento, tengo el presupuesto aprobado y puedo cerrar rápido.",
  "Estoy buscando una propiedad para mudanza urgente, ¿puedo agendar una visita el sábado?",
  "Hola! Vi la publicación y me interesa. ¿Cuándo podría ver la propiedad?",
  "Tengo interés en la propiedad, necesito mudarme antes de fin de mes. Aviseme horarios disponibles.",
  "Quisiera información sobre la propiedad para una posible compra inmediata. ¿Aceptan créditos hipotecarios?",
  "Buenas, estoy interesado en visitar la propiedad este fin de semana. Llamame cuando puedas.",
  "Hola, ¿sigue disponible la propiedad? Estoy listo para hacer una oferta luego de la visita.",
  "Necesito comprar urgente porque vence mi contrato de alquiler. ¿Coordinamos visita?",
  "Me interesa la propiedad, ya vendí mi anterior departamento y necesito mudarme en 30 días.",
  "Hola, vi el aviso y quiero ir a verla. ¿Hay disponibilidad mañana a la tarde?",
  "Buenas tardes, estoy interesado en agendar visita para la compra de la propiedad publicada.",
] as const;

export const MENSAJES_SPAM_POOL: readonly string[] = [
  "test",
  "demo",
  "asdf",
  "hola",
  "info",
  "precio?",
  "...",
  "FREE PROPERTY INVESTMENT OPPORTUNITY CLICK HERE",
] as const;

export const TIPOS_PROPIEDAD_POOL: readonly TipoPropiedad[] = [
  "departamento", "casa", "ph", "local_comercial", "oficina", null,
] as const;

export const SOURCES_POOL: readonly Source[] = [
  "Zonaprop", "Argenprop", "WhatsApp", "Mail",
  "Mercadolibre", "Chat web", "Navent",
] as const;

export const ESTADOS_POOL: readonly Estado[] = [
  "Nuevo", "En revisión", "Calificado", "Descartado",
] as const;

export const AGENCIAS_POOL: readonly string[] = [
  "Tokko Realty",
  "RE/MAX Argentina",
  "Inmobiliaria del Plata",
  "Bullrich Propiedades",
  "Toribio Achával",
  "Izrastzoff Estudio Inmobiliario",
  "L. J. Ramos Brokers",
  "Castex Propiedades",
  "Miguel Ludmer Inmobiliaria",
] as const;

export const DIRECCIONES_POOL: readonly string[] = [
  "Av. Santa Fe 2350",
  "Posadas 1342 Piso 4 Dpto B",
  "Av. Cabildo 1875",
  "Av. Rivadavia 5820",
  "Av. Corrientes 4310",
  "Honduras 5450",
  "Gorriti 4120",
  "Bonpland 1885",
  "Av. Libertador 4450",
  "Soldado de la Independencia 990",
  "Av. Cramer 2310",
  "Charcas 3890",
] as const;

export function pickRandom<T>(
  pool: readonly T[],
  rng?: () => number,
): T {
  if (pool.length === 0) {
    throw new Error("pickRandom: pool vacío");
  }
  const r = (rng ?? Math.random)();
  const idx = Math.min(pool.length - 1, Math.floor(r * pool.length));
  return pool[idx];
}

export interface GenerateLeadOpts {
  forceType?: "interested" | "spam";
}

let _counter = 0;

export function generateRandomLead(
  rng?: () => number,
  opts?: GenerateLeadOpts,
): Lead {
  const r = rng ?? Math.random;
  // Decide tipo (interested 80% / spam 20%) salvo que se fuerce.
  const type =
    opts?.forceType ?? (r() < 0.8 ? "interested" : "spam");

  const mensaje =
    type === "spam"
      ? pickRandom(MENSAJES_SPAM_POOL, r)
      : pickRandom(MENSAJES_INTERESTED_POOL, r);

  const zona = pickRandom(ZONAS_POOL, r);
  const source = pickRandom(SOURCES_POOL, r);
  const estado = pickRandom(ESTADOS_POOL, r);
  const tipo_propiedad = pickRandom(TIPOS_PROPIEDAD_POOL, r);
  const presupuesto_usd =
    type === "spam" ? 0 : pickRandom(PRESUPUESTOS_POOL, r);
  const agencia = pickRandom(AGENCIAS_POOL, r);
  const direccion_propiedad = pickRandom(DIRECCIONES_POOL, r);

  // id estable y único entre invocaciones consecutivas
  _counter += 1;
  const id = `sim-${Date.now()}-${_counter}`;

  const email =
    type === "spam"
      ? `user${Math.floor(r() * 10000)}@tempmail.org`
      : `lead${Math.floor(r() * 10000)}@gmail.com`;
  const telefono =
    type === "spam" ? "000-0000" : `+54 9 11 ${Math.floor(r() * 9000 + 1000)}-${Math.floor(r() * 9000 + 1000)}`;

  return {
    id,
    mensaje,
    telefono,
    email,
    zona,
    tipo_propiedad,
    presupuesto_usd,
    property_ids: [],
    source,
    estado,
    created_at: new Date().toISOString(),
    agencia,
    direccion_propiedad,
  };
}
```

### Formato esperado de `leads_mock.json` (extracto)

Cada lead suma los 5 campos nuevos al schema actual. Ejemplo:

```json
{
  "id": "lead-01",
  "mensaje": "Hola, estoy buscando un departamento ...",
  "telefono": "+54 11 4523-7890",
  "email": "martin.garcia@gmail.com",
  "zona": "Palermo",
  "tipo_propiedad": "departamento",
  "presupuesto_usd": 130000,
  "property_ids": ["prop-01", "prop-07"],
  "source": "Zonaprop",
  "estado": "Nuevo",
  "created_at": "2026-05-24T10:15:00.000Z",
  "agencia": "Tokko Realty",
  "direccion_propiedad": "Av. Santa Fe 2350"
}
```

## Decisiones técnicas (requieren visto bueno humano)

### D1 — Estrategia para los 30+ leads: **conservar los 15 existentes + agregar 15 nuevos**

**Decisión recomendada:** mantener los `lead-01..lead-15` con sus
`id`, `property_ids` y campos originales intactos, y **agregar** los 5
campos nuevos a cada uno. Luego añadir 15 leads nuevos `lead-16..lead-30`
con datos coherentes.

**Justificación:**
- Los IDs y `property_ids` de `lead-01..lead-15` son referenciados por
  `tests/backend/test_ai_pipeline.ts` (busca explícitamente `lead-01` y
  `lead-03`, ver líneas 150 y 177). Regenerar todo rompería esos tests.
- Conservar la diversidad spam/interested ya curada en los 15 leads
  originales evita perder valor narrativo (lead-11, lead-12 tienen
  patrones de spam diseñados a mano).

**Alternativa descartada:** *Regenerar todo el archivo desde cero
invocando `generateRandomLead()` 30 veces.* Se descarta porque:
1. Rompería las referencias hardcodeadas a `lead-01` y `lead-03` en
   `test_ai_pipeline.ts` → invalidaría specs 1 y 2 ya en `spec_ready`.
2. Perdería el control narrativo sobre los casos spam/interested que
   actualmente cubren intencionalmente casos borde (tempmail, mensaje
   ultra-corto, etc.).
3. Hace el mock no-reproducible entre corridas del generador, lo cual
   sería molesto para debugging visual durante la demo.

### D2 — IDs de los leads nuevos: `lead-16` .. `lead-30`

Los nuevos leads usan el prefijo `lead-NN` (correlativo). NO usan
`sim-*` porque ese prefijo está reservado en `simulate.ts` (línea 78
del archivo actual) para leads inyectados en runtime. Mantener la
distinción `lead-*` (mock estático) vs `sim-*` (runtime) ayuda a la
trazabilidad en logs y en el feed.

### D3 — Incluir `agencia` y `direccion_propiedad` también en lead-01..lead-15

**Decisión:** sí, agregarlos a TODOS los 30 leads. Aunque la feature
declara estos campos opcionales en el tipo (R1), el archivo
`leads_mock.json` los rellena en el 100% de los registros para que las
vistas Cola (feature 14) y Detalle (feature 17) tengan datos para
mostrar sin lógica condicional. La opcionalidad en el tipo cubre el
caso de leads generados en runtime que aún no los tienen (por si una
feature futura los omite).

### D4 — Distribución temporal: bucketing por días UTC con cobertura ≥5/7

Para cada uno de los últimos 7 días UTC (D-6 hasta D-0 = hoy), al menos
un lead tiene `created_at` cayendo en ese día calendario UTC. Como
30/7 ≈ 4.3, en la práctica habrá 3-5 leads por día. La generación se
hace offline (escrita a mano o por script local, no en runtime). El
test (R9) tolera huecos: exige ≥5 días con ≥1 lead de los 7 (no 7/7),
para que un test corrido en zona horaria distinta o en día de borde no
falle por un timezone de minutos.

### D5 — `created_at` siempre en UTC con sufijo `Z`

Todos los `created_at` se serializan como `YYYY-MM-DDTHH:mm:ss.sssZ`.
Esto evita ambigüedad de timezones y satisface el regex de R7.

### D6 — `pickRandom` clampa el índice contra el límite superior

Por seguridad numérica (R13), `pickRandom` aplica
`Math.min(pool.length - 1, Math.floor(r * pool.length))` para que un
`rng()` que retorne exactamente `1.0` (caso teórico) no resulte en
índice fuera de rango. Esto garantiza que `() => 0.9999999` siempre
retorne el último elemento.

### D7 — `MENSAJES_INTERESTED_POOL` cubre keywords del scoring (visita, urgente, mudanza, comprar, interesado)

Los mensajes interested incluyen palabras clave que las features
posteriores (criterios de scoring) usarán para derivar `reasons`:
"visita", "interesado", "urgente", "mudanza", "comprar". Esto facilita
que la feature 14 (`leadReasons.ts`) tenga señal real para generar
chips positivas.

## Excepciones reutilizadas o nuevas

Ninguna excepción nueva. `pickRandom` lanza `Error("pickRandom: pool
vacío")` solo como guard interno (pools del módulo nunca están vacíos
por construcción, ver R11). No se introduce una clase de excepción
custom porque es un guard defensivo, no un error de dominio.

## Trazabilidad requirement → test (mapa preliminar)

| Requirement | Test esperado |
|-------------|---------------|
| R1, R2 | `tests/backend/test_data_extension.ts::test_type_compile` (verifica vía import que `Source`/`Estado` existen y la interfaz acepta los campos). |
| R3 | `tests/backend/test_data.ts` (existente) sigue verde tras la extensión. |
| R4 | `test_leads_count_min_30` |
| R5 | `test_each_lead_has_valid_source` |
| R6 | `test_each_lead_has_valid_estado` |
| R7 | `test_each_lead_has_iso_created_at` |
| R8 | `test_created_at_within_30_days` |
| R9 | `test_daily_distribution_min_5_days` |
| R10 | `test_lead_generators.ts::test_module_exports` |
| R11 | `test_pool_sizes` |
| R12 | `test_pick_random_lower_bound` |
| R13 | `test_pick_random_upper_bound` |
| R14 | `test_generate_lead_deterministic_zero` |
| R15 | `test_generate_lead_different_rng_differs` |
| R16 | `test_generate_lead_force_spam` |
| R17 | `test_generate_lead_force_interested` |
| R18 | `test_pick_random_no_rng_uses_math_random` |
| R19 | `test_legacy_schema_still_valid` |
| R20 | `test_unique_ids` |
