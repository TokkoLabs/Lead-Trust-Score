# Requirements — lead_detail_insights

Feature: Panel de Detalle y Visualización de Scores
Layer: frontend
EARS notation — cada R cubre uno o más acceptance criteria del feature_list.json.

---

## R1

El sistema DEBE exportar un componente `LeadDetailPanel` en
`product/frontend/components/LeadDetailPanel.tsx` que acepte las props
`{ lead: Lead; analysis: LeadAnalysis | null; isLoading: boolean; properties: Property[] }`
y renderice sin errores de compilación TypeScript en modo `strict`.

---

## R2

CUANDO `isLoading` es `true`, el sistema DEBE renderizar un bloque skeleton/shimmer
que ocupe el espacio visual completo del panel con al menos tres secciones
diferenciadas (badge circular, barras de scores y párrafo de resumen) antes de
que `analysis` esté disponible.

---

## R3

CUANDO `isLoading` es `false` y `analysis` no es `null`, el sistema DEBE renderizar
un Trust Score Badge circular con el valor numérico de `analysis.trust_score`
centrado y con fondo de color semántico: verde (`bg-green-500`) para valores
mayores a 75, amarillo (`bg-yellow-400`) para valores entre 40 y 75 inclusive,
rojo (`bg-red-500`) para valores menores a 40.

---

## R4

CUANDO `isLoading` es `false` y `analysis` no es `null`, el sistema DEBE renderizar
`analysis.conversion_score` como una barra de progreso horizontal con ancho
proporcional al valor (0–100) y etiqueta visible "Conversión".

---

## R5

CUANDO `isLoading` es `false` y `analysis` no es `null`, el sistema DEBE renderizar
`analysis.urgency_score` como una barra de progreso horizontal con ancho
proporcional al valor (0–100) y etiqueta visible "Urgencia".

---

## R6

CUANDO `isLoading` es `false` y `analysis` no es `null`, el sistema DEBE renderizar
`analysis.ai_summary` como un párrafo de texto precedido por la etiqueta
"Análisis IA" visible al usuario.

---

## R7

CUANDO `isLoading` es `false` y `analysis` no es `null`, el sistema DEBE renderizar
una sección titulada "Acción Recomendada" que contenga el texto de
`analysis.suggested_action`.

---

## R8

CUANDO el usuario hace click en el botón "Copiar" dentro de la sección
"Acción Recomendada", el sistema DEBE invocar `navigator.clipboard.writeText`
con el valor de `analysis.suggested_action`.

---

## R9

CUANDO `isLoading` es `false` y `analysis` no es `null` y
`analysis.property_match_ids` contiene al menos un ID, el sistema DEBE renderizar
una tarjeta compacta por cada `Property` de la prop `properties` cuyo `id` figure
en `property_match_ids`, mostrando `titulo`, `precio_usd`, `zona` y `tipo`.

---

## R10

CUANDO `isLoading` es `false` y `analysis` no es `null` y
`analysis.property_match_ids` está vacío, el sistema DEBE renderizar un mensaje
"Sin propiedades coincidentes" en la sección de propiedades.

---

## R11

El sistema DEBE exportar el hook `useLeadAnalysis` en
`product/frontend/hooks/useLeadAnalysis.ts` con la firma
`useLeadAnalysis(leadId: string | null): { analysis: LeadAnalysis | null; isLoading: boolean; error: string | null }`.

---

## R12

CUANDO `leadId` no es `null`, el hook `useLeadAnalysis` DEBE disparar
`fetch('/api/leads/analyze', { method: 'POST', body: JSON.stringify({ leadId }) })`
y actualizar `analysis` con el resultado parseado al recibir respuesta exitosa.

---

## R13

MIENTRAS la llamada `fetch` de `useLeadAnalysis` está en curso, el hook DEBE
mantener `isLoading` en `true` y `analysis` en `null`.

---

## R14

SI la llamada `fetch` de `useLeadAnalysis` retorna un status HTTP distinto de
200, ENTONCES el hook DEBE establecer `error` con el mensaje de la respuesta y
mantener `analysis` en `null`.

---

## R15

CUANDO `leadId` cambia a un valor diferente (incluyendo `null`), el hook
`useLeadAnalysis` DEBE reiniciar `analysis` a `null`, `isLoading` a `false` y
`error` a `null` antes de lanzar la nueva petición.

---

## R16

El sistema DEBE modificar `pages/index.tsx` para gestionar el estado
`selectedLeadId: string | null` mediante `useState` y pasar el lead seleccionado
al `LeadDetailPanel` junto al resultado de `useLeadAnalysis`.

---

## R17

CUANDO el usuario hace click en un `LeadCard` del feed, el sistema DEBE
actualizar `selectedLeadId` con el `lead.id` correspondiente, lo que dispara el
análisis IA para ese lead.

---

## R18

CUANDO un análisis IA retorna con éxito para el lead seleccionado, el sistema
DEBE actualizar el `trust_score` visible en el `LeadCard` correspondiente del
feed con el valor `analysis.trust_score` retornado por la API.

---

## R19

El sistema DEBE modificar `product/frontend/components/LeadCard.tsx` para
aceptar la prop opcional `onSelect?: (leadId: string) => void` y disparar
`onSelect(lead.id)` al hacer click en la card.

---

## R20

El sistema DEBE modificar `product/frontend/components/LeadsFeed.tsx` para
aceptar la prop opcional `onSelectLead?: (leadId: string) => void` y
propagarla a cada `LeadCard`.

---

## R21

El sistema DEBE crear el archivo `tests/frontend/test_lead_detail_panel.tsx`
con al menos los casos de prueba: skeleton visible cuando `isLoading` es `true`,
badge de color correcto para cada rango de `trust_score`, texto de `ai_summary`
visible, texto de `suggested_action` visible, tarjetas de propiedades renderizadas,
mensaje de sin coincidencias cuando `property_match_ids` está vacío, e invocación
de `navigator.clipboard.writeText` al hacer click en "Copiar".

---

## R22

El sistema DEBE crear el archivo `tests/frontend/test_use_lead_analysis.tsx`
con al menos los casos de prueba: `isLoading` inicia en `true` al recibir un
`leadId`, se actualiza `analysis` al resolver el fetch mockeado con 200, se
actualiza `error` al resolver el fetch mockeado con status distinto de 200,
y el estado se reinicia al cambiar `leadId`.
