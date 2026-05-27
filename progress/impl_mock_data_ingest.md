# Implementacion: mock_data_ingest

**Feature:** mock_data_ingest — Ingesta y Estructura de Datos Sinteticos
**Agente:** backend_implementer
**Fecha:** 2026-05-27
**Estado:** done (pendiente aprobacion reviewer)

---

## Tareas completadas

- [x] T1 — Carpeta `product/backend/data/` creada. Tambien se creo `product/types/` que no existia.
- [x] T2 — `product/types/property.ts` creado con interfaz `Property` exportada, union literal de 5 tipos.
- [x] T3 — `product/types/lead.ts` creado con interfaz `Lead` exportada, union literal + `null` en `tipo_propiedad`.
- [x] T4 — `product/backend/data/properties_mock.json` creado con 12 propiedades (IDs prop-01 a prop-12). Zonas: Palermo, Belgrano, Caballito, Villa Crespo, Recoleta, San Isidro, Flores, Tigre (8 zonas distintas). Tipos: departamento, casa, ph, local_comercial, oficina (5 tipos). Precios en USD coherentes con mercado inmobiliario argentino.
- [x] T5 — `product/backend/data/leads_mock.json` creado con 15 leads. Distribucion exacta:
  - Alta calidad (lead-01 a lead-05): mensajes > 40 chars, presupuesto > 0, 2-3 property_ids.
  - Mediocre (lead-06 a lead-10): mensajes vagos (< 20 chars), presupuesto = 0, 1 property_id.
  - Spam/falso (lead-11 a lead-13): email en dominios mailinator.com, tempmail.com, guerrillamail.com y/o telefono invalido (< 7 digitos o no numerico).
  - Borde (lead-14 a lead-15): lead-14 tiene buen mensaje y presupuesto pero email en tempmail.com; lead-15 tiene buen presupuesto pero mensaje muy corto y telefono sin formato internacional correcto.
- [x] T6 — `tests/backend/test_data.ts` creado con test `parse_leads`.
- [x] T7 — Test `parse_properties` implementado en `tests/backend/test_data.ts`.
- [x] T8 — Test `leads_schema` implementado; verifica los 8 campos requeridos en cada lead.
- [x] T9 — Test `properties_schema` implementado; verifica los 7 campos requeridos y precio_usd > 0.
- [x] T10 — Test `cross_references` implementado con Set<string> de IDs y mensaje descriptivo en fallo.
- [x] T11 — Test `leads_count` implementado.
- [x] T12 — Test `properties_count` implementado.
- [x] T13 — Test `tipo_enum_leads` implementado.
- [x] T14 — Test `tipo_enum_properties` implementado.
- [x] T15 — `ts-node tests/backend/test_data.ts` ejecutado: TODOS LOS TESTS PASARON.
- [x] T16 — `tsc --noEmit --strict product/types/lead.ts product/types/property.ts`: SIN ERRORES.

---

## Resultado de ejecucion del test (T15)

```
=== test_data: iniciando validacion de datasets ===

[OK] parse_leads — leads_mock.json parsea correctamente
[OK] parse_properties — properties_mock.json parsea correctamente
[OK] leads_schema — todos los campos requeridos presentes en cada lead
[OK] properties_schema — todos los campos requeridos presentes en cada propiedad
[OK] cross_references — todos los property_ids en leads referencian IDs validos
[OK] leads_count — 15 leads (>= 15)
[OK] properties_count — 12 propiedades (>= 10)
[OK] tipo_enum_leads — todos los tipo_propiedad son valores permitidos o null
[OK] tipo_enum_properties — todos los tipo son valores permitidos

=== TODOS LOS TESTS PASARON ===
```

---

## Decisiones de implementacion relevantes

1. **Creacion de package.json y tsconfig.json:** El repositorio no tenia package.json ni tsconfig.json. Se crearon ambos archivos en la raiz del proyecto con configuracion minima para soportar ts-node y tsc --strict. Dependencias: ts-node ^10.9.2, typescript ^5.4.5, @types/node ^20.12.7. Esto es necesario para que T15 y T16 sean ejecutables.

2. **Carpeta product/types/:** El spec menciona `product/types/lead.ts` y `product/types/property.ts` pero la estructura solo tenia `product/backend/` y `product/frontend/`. Se creo la carpeta `product/types/` segun lo indicado en el spec (design.md lista esta ruta explicitamente).

3. **Distribucion de leads borde:** lead-14 tiene buen mensaje y presupuesto pero usa tempmail.com (borde: calidad alta con email sospechoso). lead-15 tiene buen presupuesto pero mensaje de 30 chars y telefono sin formato `+54` (borde: presupuesto bueno pero contacto incompleto).

4. **Spam telefono invalido:** Los tres leads spam (lead-11: "123", lead-12: "abc-xyz", lead-13: "99") tienen telefonos con menos de 7 digitos o caracteres no numericos, cumpliendo R6 exactamente.

5. **Precio USD alquiler vs venta:** Las propiedades con precio bajo (prop-05: 950, prop-07: 1800, prop-08: 1200, prop-10: 750, prop-12: 2200) representan alquiler mensual y lo especifican explicitamente en el campo `descripcion`. El campo `precio_usd` es un numero puro en ambos casos, conforme al schema de R16.

---

## Trazabilidad R<n> -> test

| Requirement | Test que lo cubre |
|-------------|-------------------|
| R1 | leads_count (length >= 15) |
| R2 | leads_schema (8 campos obligatorios) |
| R3 | cross_references (property_ids validos) |
| R4 | Cubierto por datos: lead-01 a lead-05 |
| R5 | Cubierto por datos: lead-06 a lead-10 |
| R6 | Cubierto por datos: lead-11 a lead-13 |
| R7 | properties_count (length >= 10) |
| R8 | properties_schema (7 campos obligatorios + precio > 0) |
| R9 | product/types/lead.ts exporta interfaz Lead |
| R10 | product/types/property.ts exporta interfaz Property |
| R11 | T16: tsc --noEmit --strict sobre lead.ts |
| R12 | T16: tsc --noEmit --strict sobre property.ts |
| R13 | parse_leads |
| R14 | parse_properties |
| R15 | cross_references (mensaje descriptivo en ID huerfano) |
| R16 | properties_schema (precio_usd > 0, rango AR) |
| R17 | tipo_enum_properties |
| R18 | tipo_enum_leads (incluye null) |
