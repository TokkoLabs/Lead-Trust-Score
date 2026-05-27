# Requirements — realtime_simulation_trigger

Feature: Simulador de Entrada de Leads en Vivo
Layer: fullstack
EARS notation — cada R cubre uno o más acceptance criteria del feature_list.json.

---

## R1

El sistema DEBE crear el endpoint `POST /api/leads/simulate` en
`product/backend/api/leads/simulate.ts` que acepte un body
`{ type: "interested" | "spam" }` y retorne un objeto
`{ lead: Lead; analysis: LeadAnalysis }` con HTTP 200.

---

## R2

CUANDO `POST /api/leads/simulate` recibe `{ type: "interested" }`, el sistema
DEBE generar un objeto `Lead` con los campos exactos:
- `id`: `"sim-" + Date.now()` (string)
- `mensaje`: texto de al menos 120 caracteres que incluya zona, tipo de
  propiedad, presupuesto y señales de urgencia claras
- `email`: dominio `gmail.com` o `hotmail.com` con nombre plausible
- `telefono`: número de 10 dígitos con formato `+54 9 11 XXXX-XXXX`
- `zona`: una de las zonas presentes en `properties_mock.json`
- `tipo_propiedad`: `"departamento"` o `"casa"`
- `presupuesto_usd`: valor entre 150000 y 500000
- `property_ids`: array vacío `[]`

---

## R3

CUANDO `POST /api/leads/simulate` recibe `{ type: "spam" }`, el sistema
DEBE generar un objeto `Lead` con los campos exactos:
- `id`: `"sim-" + Date.now()` (string)
- `mensaje`: texto sin sentido de menos de 30 caracteres (ej: "comprar casa precio")
- `email`: dominio temporal de la lista `["tempmail.org", "guerrillamail.com",
  "mailinator.com"]`
- `telefono`: cadena no numérica o con menos de 8 dígitos (ej: `"000-0000"`)
- `zona`: string vacío `""`
- `tipo_propiedad`: `null`
- `presupuesto_usd`: `0`
- `property_ids`: array vacío `[]`

---

## R4

CUANDO `POST /api/leads/simulate` recibe un `type` distinto de `"interested"`
o `"spam"`, ENTONCES el sistema DEBE retornar HTTP 400 con body
`{ error: "type must be 'interested' or 'spam'" }`.

---

## R5

CUANDO `POST /api/leads/simulate` recibe un método HTTP distinto de `POST`,
ENTONCES el sistema DEBE retornar HTTP 405 con body `{ error: "Method not allowed" }`.

---

## R6

CUANDO `POST /api/leads/simulate` genera el `Lead` sintético, el sistema DEBE
invocar `analyseLeadWithAI` del servicio `ai_analyser.ts` (usando
`filterCandidateProperties` para obtener las propiedades candidatas del
catálogo `properties_mock.json`) y retornar el `LeadAnalysis` resultante
junto al `Lead` generado en la misma respuesta HTTP.

---

## R7

SI `analyseLeadWithAI` lanza cualquier excepción durante la ejecución de
`POST /api/leads/simulate`, ENTONCES el sistema DEBE retornar HTTP 500 con
body `{ error: "Simulation failed", detail: "<mensaje del error>" }`.

---

## R8

El sistema DEBE exportar el componente `SimulatorPanel` en
`product/frontend/components/SimulatorPanel.tsx` que renderice exactamente
dos botones con etiquetas `"Simular Lead Interesado"` y `"Simular Lead Spam"`.

---

## R9

MIENTRAS `SimulatorPanel` está en estado de carga (después de un click y antes
de recibir respuesta), el sistema DEBE deshabilitar ambos botones y mostrar
un indicador textual de carga (`"Simulando..."`) visible al usuario.

---

## R10

CUANDO el usuario hace click en `"Simular Lead Interesado"`, el sistema DEBE
ejecutar `fetch("/api/leads/simulate", { method: "POST", body: JSON.stringify({ type: "interested" }) })`
y, al recibir respuesta exitosa, invocar el callback `onLeadSimulated` con el
objeto `{ lead: Lead; analysis: LeadAnalysis }` recibido.

---

## R11

CUANDO el usuario hace click en `"Simular Lead Spam"`, el sistema DEBE
ejecutar `fetch("/api/leads/simulate", { method: "POST", body: JSON.stringify({ type: "spam" }) })`
y, al recibir respuesta exitosa, invocar el callback `onLeadSimulated` con el
objeto `{ lead: Lead; analysis: LeadAnalysis }` recibido.

---

## R12

SI `fetch("/api/leads/simulate")` retorna un status HTTP distinto de 200,
ENTONCES el sistema DEBE mostrar un mensaje de error visible al usuario en el
`SimulatorPanel` y restaurar los botones al estado habilitado.

---

## R13

CUANDO `pages/index.tsx` recibe un resultado de `onLeadSimulated`, el sistema
DEBE insertar el nuevo `Lead` en el estado local `leads` y registrar el
`LeadAnalysis` en el mapa `aiScores[lead.id] = analysis.trust_score`.

---

## R14

CUANDO `pages/index.tsx` inserta un lead simulado en la lista, el sistema
DEBE re-ordenar todos los leads (mock + simulados legítimos) de mayor a menor
`trust_score` (usando el score AI si disponible, local si no) y posicionar el
nuevo `LeadCard` en la posición correcta del feed principal según dicho score,
siempre que `analysis.is_spam` sea `false`.

---

## R15

CUANDO `pages/index.tsx` inserta un lead simulado cuyo `analysis.is_spam` es
`true`, el sistema DEBE excluir ese lead de la sección principal y agregarlo
al array de estado `spamLeads` en lugar de `leads`.

---

## R16

El sistema DEBE renderizar en `pages/index.tsx` una sección secundaria
"Leads Spam Detectados" debajo del feed principal, visible únicamente cuando
`spamLeads` contiene al menos un elemento.

---

## R17

El sistema DEBE renderizar cada lead de `spamLeads` como un `LeadCard`
envuelto en un contenedor con `className` que incluya `bg-red-950` y un
ícono de alerta (`⚠` como texto Unicode o SVG inline) al inicio de la card,
diferenciándolo visualmente de los leads legítimos.

---

## R18

CUANDO un nuevo `LeadCard` es insertado en el feed (principal o spam) como
resultado de una simulación, el sistema DEBE aplicar la clase CSS
`animate-enter` al elemento `<li>` durante los primeros 600ms tras la
inserción, produciendo una transición de opacidad de 0 a 1 y traslación
vertical de -16px a 0px.

---

## R19

El sistema DEBE definir los keyframes de `animate-enter` en
`tailwind.config.js` (o equivalente CSS global) de modo que no requieran
dependencias adicionales de npm y sean compatibles con Tailwind CSS v3.

---

## R20

El sistema DEBE crear `tests/backend/test_simulate_endpoint.ts` con al menos
los casos de prueba: respuesta 200 con `lead` y `analysis` para
`type: "interested"`, respuesta 200 con `lead` y `analysis` para `type: "spam"`,
respuesta 400 para `type` inválido, y respuesta 405 para método no POST.
Los tests NO deben realizar llamadas reales a Claude API (mock de `analyseLeadWithAI`).

---

## R21

El sistema DEBE crear `tests/frontend/test_simulator_panel.tsx` con al menos
los casos de prueba: ambos botones visibles en el DOM, botones deshabilitados
mientras se carga, callback `onLeadSimulated` invocado con el resultado del
fetch mockeado al simular lead interesado, callback `onLeadSimulated` invocado
con el resultado del fetch mockeado al simular lead spam, y mensaje de error
visible cuando el fetch retorna status distinto de 200.

---

## R22

El sistema DEBE crear `tests/frontend/test_simulation_integration.tsx` con al
menos los casos de prueba: lead simulado no-spam aparece en el feed principal
ordenado por `trust_score`, lead simulado con `is_spam: true` aparece en la
sección "Leads Spam Detectados" y no en el feed principal, y la sección spam
no se renderiza cuando `spamLeads` está vacío.
