# Requirements — mock_data_ingest

> Feature: Ingesta y Estructura de Datos Sintéticos
> EARS Notation — cada R<n> es estable y verificable por un test concreto.

---

## R1

El sistema DEBE contener el archivo `product/backend/data/leads_mock.json` con un array JSON de al menos 15 objetos de tipo Lead.

## R2

El sistema DEBE garantizar que cada objeto en `leads_mock.json` incluya los campos `id`, `mensaje`, `telefono`, `email`, `zona`, `tipo_propiedad`, `presupuesto_usd` y `property_ids`.

## R3

El sistema DEBE garantizar que el array `property_ids` de cada Lead contenga al menos un ID y que todos los IDs referenciados existan en `properties_mock.json`.

## R4

El sistema DEBE incluir en `leads_mock.json` al menos 5 registros de alta calidad: mensaje detallado (más de 40 caracteres), presupuesto numérico explícito y `property_ids` no vacío.

## R5

El sistema DEBE incluir en `leads_mock.json` al menos 5 registros de calidad mediocre: mensaje vago (menos de 20 caracteres o sin datos concretos), presupuesto ausente o igual a 0.

## R6

El sistema DEBE incluir en `leads_mock.json` al menos 3 registros de tipo spam/falso: email en dominio genérico de uso abusivo (p. ej. `mailinator.com`, `tempmail.com`) o teléfono con formato inválido (menos de 7 dígitos o caracteres no numéricos excepto el `+` inicial).

## R7

El sistema DEBE contener el archivo `product/backend/data/properties_mock.json` con un array JSON de al menos 10 objetos de tipo Property.

## R8

El sistema DEBE garantizar que cada objeto en `properties_mock.json` incluya los campos `id` (string único), `titulo`, `precio_usd`, `zona`, `tipo`, `dormitorios` y `descripcion`.

## R9

El sistema DEBE contener el archivo `product/types/lead.ts` que exporte una interfaz TypeScript `Lead` cuya forma sea compatible con todos los campos requeridos en R2.

## R10

El sistema DEBE contener el archivo `product/types/property.ts` que exporte una interfaz TypeScript `Property` cuya forma sea compatible con todos los campos requeridos en R8.

## R11

CUANDO el archivo `product/types/lead.ts` es compilado con `tsc --noEmit --strict`, el sistema DEBE compilar sin errores de tipado.

## R12

CUANDO el archivo `product/types/property.ts` es compilado con `tsc --noEmit --strict`, el sistema DEBE compilar sin errores de tipado.

## R13

El sistema DEBE contener el archivo `tests/backend/test_data.ts` que verifique que `leads_mock.json` se parsea como JSON válido sin lanzar excepciones.

## R14

El sistema DEBE contener el archivo `tests/backend/test_data.ts` que verifique que `properties_mock.json` se parsea como JSON válido sin lanzar excepciones.

## R15

CUANDO `tests/backend/test_data.ts` ejecuta la validación de referencias cruzadas, el sistema DEBE verificar que cada `property_id` presente en cualquier lead existe como `id` en `properties_mock.json`, fallando el test con un mensaje descriptivo si hay un ID huérfano.

## R16

El sistema DEBE garantizar que los precios en `properties_mock.json` estén expresados en dólares estadounidenses (USD) como números positivos mayores a 0, reflejando el mercado inmobiliario argentino (rango orientativo: USD 50.000 – USD 500.000 para venta; USD 400 – USD 3.000 para alquiler mensual).

## R17

El sistema DEBE garantizar que el campo `tipo` en cada Property sea uno de los valores: `"departamento"`, `"casa"`, `"ph"`, `"local_comercial"`, `"oficina"`.

## R18

El sistema DEBE garantizar que el campo `tipo_propiedad` en cada Lead sea uno de los valores: `"departamento"`, `"casa"`, `"ph"`, `"local_comercial"`, `"oficina"`, permitiendo también `null` para leads donde el tipo no fue especificado.
