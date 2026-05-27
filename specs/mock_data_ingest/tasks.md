# Tasks — mock_data_ingest

> Feature: Ingesta y Estructura de Datos Sintéticos
> El implementer marca `[x]` cada tarea al completarla.
> El reviewer rechaza si queda alguna `[ ]` sin justificación documentada.

---

- [x] T1 — Crear la carpeta `product/backend/data/` si no existe. Cubre: R1, R7.

- [x] T2 — Crear `product/types/property.ts` con la interfaz `Property` exportada (campos: `id`, `titulo`, `precio_usd`, `zona`, `tipo`, `dormitorios`, `descripcion`; `tipo` como union literal de los 5 valores permitidos). Cubre: R10, R12, R17.

- [x] T3 — Crear `product/types/lead.ts` con la interfaz `Lead` exportada (campos: `id`, `mensaje`, `telefono`, `email`, `zona`, `tipo_propiedad`, `presupuesto_usd`, `property_ids`; `tipo_propiedad` como union literal + `null`). Cubre: R9, R11, R18.

- [x] T4 — Crear `product/backend/data/properties_mock.json` con al menos 10 propiedades simuladas. Requisitos de contenido: IDs en formato `prop-<n>`, precios en USD, zonas variadas (mínimo 4 distintas), al menos 2 tipos distintos, `dormitorios: 0` para locales/oficinas. Verificar que todos los campos de R8 están presentes. Cubre: R7, R8, R16, R17.

- [x] T5 — Crear `product/backend/data/leads_mock.json` con al menos 15 leads simulados. Distribución requerida: 5 de alta calidad (mensaje > 40 chars, presupuesto > 0, 2–3 property_ids), 5 de calidad mediocre (mensaje vago, presupuesto = 0, 1 property_id), 3 spam/falsos (email en dominio temporal o teléfono inválido), 2 casos borde. Todos los `property_ids` DEBEN referenciar IDs existentes en `properties_mock.json`. Cubre: R1, R2, R3, R4, R5, R6, R16, R18.

- [x] T6 — Crear la carpeta `tests/backend/` si no existe y crear `tests/backend/test_data.ts`. Implementar el test `parse_leads` que lee y parsea `leads_mock.json` sin excepciones. Cubre: R13.

- [x] T7 — En `tests/backend/test_data.ts`, implementar el test `parse_properties` que lee y parsea `properties_mock.json` sin excepciones. Cubre: R14.

- [x] T8 — En `tests/backend/test_data.ts`, implementar el test `leads_schema` que itera cada lead y verifica con `assert.ok` la presencia de los campos `id`, `mensaje`, `telefono`, `email`, `zona`, `tipo_propiedad`, `presupuesto_usd` y `property_ids`. Cubre: R2.

- [x] T9 — En `tests/backend/test_data.ts`, implementar el test `properties_schema` que itera cada propiedad y verifica con `assert.ok` la presencia de los campos `id`, `titulo`, `precio_usd`, `zona`, `tipo`, `dormitorios` y `descripcion`. Cubre: R8.

- [x] T10 — En `tests/backend/test_data.ts`, implementar el test `cross_references` que construye un `Set<string>` con los IDs de propiedades y verifica que cada `property_id` de cada lead existe en ese Set, fallando con mensaje descriptivo si encuentra un ID huérfano. Cubre: R3, R15.

- [x] T11 — En `tests/backend/test_data.ts`, implementar el test `leads_count` que verifica `leads.length >= 15`. Cubre: R1.

- [x] T12 — En `tests/backend/test_data.ts`, implementar el test `properties_count` que verifica `properties.length >= 10`. Cubre: R7.

- [x] T13 — En `tests/backend/test_data.ts`, implementar el test `tipo_enum_leads` que verifica que `tipo_propiedad` de cada lead sea uno de `["departamento","casa","ph","local_comercial","oficina", null]`. Cubre: R18.

- [x] T14 — En `tests/backend/test_data.ts`, implementar el test `tipo_enum_properties` que verifica que `tipo` de cada propiedad sea uno de `["departamento","casa","ph","local_comercial","oficina"]`. Cubre: R17.

- [x] T15 — Ejecutar `ts-node tests/backend/test_data.ts` (o el runner equivalente configurado en el proyecto) y verificar que todos los tests pasan sin errores. Cubre: R13, R14, R15.

- [x] T16 — Ejecutar `tsc --noEmit --strict` sobre `product/types/lead.ts` y `product/types/property.ts` y verificar que la compilación termina sin errores de tipado. Cubre: R11, R12.
