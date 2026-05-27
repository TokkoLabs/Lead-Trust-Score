# Design — mock_data_ingest

> Feature: Ingesta y Estructura de Datos Sintéticos
> Documenta CÓMO se construirá; no contiene código de implementación.

---

## Archivos a crear

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `product/backend/data/leads_mock.json` | JSON | Dataset de 15+ leads sintéticos del ecosistema inmobiliario AR |
| `product/backend/data/properties_mock.json` | JSON | Catálogo de 10+ propiedades simuladas disponibles |
| `product/types/lead.ts` | TypeScript | Interfaz `Lead` que tipifica el esquema del dataset |
| `product/types/property.ts` | TypeScript | Interfaz `Property` que tipifica el catálogo |
| `tests/backend/test_data.ts` | TypeScript | Suite de validación de integridad de los datasets |

No se modifica ningún archivo existente.

---

## Esquema de datos

### Lead (product/types/lead.ts)

```typescript
export interface Lead {
  id: string;
  mensaje: string;
  telefono: string;
  email: string;
  zona: string;
  tipo_propiedad: "departamento" | "casa" | "ph" | "local_comercial" | "oficina" | null;
  presupuesto_usd: number;
  property_ids: string[];
}
```

Notas de dominio:
- `id`: formato `lead-<n>` (p. ej. `"lead-01"`).
- `telefono`: formato argentino, p. ej. `"+54 11 1234-5678"`. Para leads spam puede ser inválido.
- `presupuesto_usd`: `0` cuando el lead no especifica presupuesto (leads mediocres/spam).
- `property_ids`: array de uno o más IDs de `properties_mock.json`. Los leads mediocres pueden referenciar solo 1 propiedad genérica.

### Property (product/types/property.ts)

```typescript
export interface Property {
  id: string;
  titulo: string;
  precio_usd: number;
  zona: string;
  tipo: "departamento" | "casa" | "ph" | "local_comercial" | "oficina";
  dormitorios: number;
  descripcion: string;
}
```

Notas de dominio:
- `id`: formato `prop-<n>` (p. ej. `"prop-01"`).
- `dormitorios`: `0` para locales/oficinas.
- `precio_usd`: puede representar precio de venta o alquiler mensual según `descripcion`.

---

## Estrategia de datos sintéticos

### Distribución de leads (15 registros mínimo)

| Segmento | Cantidad | Características |
|----------|----------|-----------------|
| Alta calidad | 5 | Mensaje > 40 chars, presupuesto explícito, 2-3 property_ids |
| Calidad mediocre | 5 | Mensaje < 20 chars o vago, presupuesto = 0, 1 property_id |
| Spam / falso | 3 | Email dominio temporal, teléfono inválido, mensaje sin sentido |
| Mixto / borde | 2 | Casos intermedios (ej: buen mensaje pero email sospechoso) |

### Zonas geográficas representadas (al menos 4 distintas)

Ejemplos: Palermo, Belgrano, San Isidro, Caballito, Villa Crespo, Recoleta, Flores, Tigre.

### Distribución del catálogo (10 propiedades mínimo)

Al menos 2 tipos distintos (p. ej. departamento y casa). Zonas variadas para permitir coincidencias cruzadas con los leads.

---

## Estrategia de testing (tests/backend/test_data.ts)

El archivo de test se ejecuta con `ts-node` (o `tsx`) desde el contexto del contenedor Docker del arnés.

Se usa la API nativa `assert` de Node.js para mantener dependencias al mínimo (sin framework externo de testing).

Estructura de los tests:

1. **parse_leads** — `JSON.parse(fs.readFileSync(...))` sin try/catch: si el JSON es inválido, el proceso falla con traza.
2. **parse_properties** — igual para el catálogo.
3. **leads_schema** — itera cada lead y verifica presencia de campos requeridos con `assert.ok`.
4. **properties_schema** — igual para propiedades.
5. **cross_references** — construye un `Set<string>` de IDs de propiedades; para cada lead itera `property_ids` y comprueba con `assert.ok(propertySet.has(pid), ...)`.
6. **leads_count** — `assert.ok(leads.length >= 15)`.
7. **properties_count** — `assert.ok(properties.length >= 10)`.
8. **tipo_enum_leads** — verifica que `tipo_propiedad` sea uno de los valores permitidos o `null`.
9. **tipo_enum_properties** — verifica que `tipo` sea uno de los valores permitidos.

Todos los tests se invocan secuencialmente en un bloque `main()` exportado; el archivo puede ejecutarse directamente con `ts-node tests/backend/test_data.ts`.

---

## Alternativa descartada: usar una librería de generación de datos (Faker.js)

**Por qué se consideró:** Faker.js permite generar datos variados y realistas automáticamente.

**Por qué se descartó:**
1. Introduce una dependencia de desarrollo que requiere instalación en el contenedor.
2. Los datos generados aleatoriamente no garantizan la distribución intencional de calidad (alta / mediocre / spam) que la feature siguiente (F2) necesita para probar el pipeline de IA.
3. Un JSON estático es determinista y auditável: el revisor puede verificar a simple vista que los criterios de calidad están cubiertos.
4. La feature F2 requiere `property_ids` específicos con coincidencias predecibles; datos aleatorios complican la validación del cross-reference en el test.

**Decisión:** JSON estático redactado a mano con datos realistas del mercado inmobiliario argentino.

---

## Relación con features vecinas

- **F2 (ai_scoring_pipeline):** consumirá `leads_mock.json` y `properties_mock.json` directamente via `fs.readFileSync` o `import`. Las interfaces `Lead` y `Property` de `product/types/` serán importadas en el servicio `ai_analyser.ts`.
- **F3/F4 (dashboard):** el frontend consumirá los datos a través del API route definido en F2; no accede a los JSON directamente.
