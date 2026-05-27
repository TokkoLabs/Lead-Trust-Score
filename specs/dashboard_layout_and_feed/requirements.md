# Requirements — dashboard_layout_and_feed

Feature ID: 3  
Layer: frontend  
Estado: spec_ready

---

## R1

El sistema DEBE exponer el archivo `product/frontend/components/DashboardLayout.tsx`
que renderiza una barra lateral de navegación fija a la izquierda y un área de
trabajo principal a la derecha dentro de un contenedor que ocupa el viewport completo.

## R2

El sistema DEBE exponer el archivo `product/frontend/components/LeadsFeed.tsx`
que recibe un array de objetos `LeadWithScore` (Lead + trust_score simulado) como
prop y renderiza la lista en orden descendente de `trust_score`.

## R3

CUANDO `LeadsFeed` recibe un array con más de un elemento, el sistema DEBE
renderizar los elementos de manera que el ítem con `trust_score` más alto aparezca
primero y el de `trust_score` más bajo aparezca último en el DOM.

## R4

El sistema DEBE exponer el tipo auxiliar `LeadWithScore` en
`product/frontend/types/feed.ts` con la forma:
```
{ lead: Lead; trust_score: number; urgency: "Alta" | "Media" | "Baja" }
```

## R5

CUANDO se renderiza un ítem del feed, el sistema DEBE mostrar el identificador
del lead (`lead.id`) como texto visible dentro de ese ítem.

## R6

CUANDO se renderiza un ítem del feed con `trust_score > 75`, el sistema DEBE
aplicar el badge del Trust Score con clase CSS de color verde (Tailwind `bg-green-500`
o equivalente semántico definido en diseño).

## R7

CUANDO se renderiza un ítem del feed con `trust_score` entre 40 y 75 inclusive,
el sistema DEBE aplicar el badge del Trust Score con clase CSS de color amarillo
(Tailwind `bg-yellow-400` o equivalente semántico definido en diseño).

## R8

CUANDO se renderiza un ítem del feed con `trust_score < 40`, el sistema DEBE
aplicar el badge del Trust Score con clase CSS de color rojo (Tailwind `bg-red-500`
o equivalente semántico definido en diseño).

## R9

CUANDO se renderiza un ítem del feed, el sistema DEBE mostrar el valor numérico
de `trust_score` dentro del badge de color semántico descrito en R6, R7 y R8.

## R10

CUANDO se renderiza un ítem del feed con `urgency === "Alta"`, el sistema DEBE
mostrar un tag con el texto "Alta" visible dentro de ese ítem.

## R11

CUANDO se renderiza un ítem del feed con `urgency === "Media"`, el sistema DEBE
mostrar un tag con el texto "Media" visible dentro de ese ítem.

## R12

CUANDO se renderiza un ítem del feed con `urgency === "Baja"`, el sistema DEBE
mostrar un tag con el texto "Baja" visible dentro de ese ítem.

## R13

El sistema DEBE exponer la función pura `computeLocalScore(lead: Lead): LeadWithScore`
en `product/frontend/lib/scoreUtils.ts` que calcula `trust_score` y `urgency`
de forma determinista a partir de los campos del `Lead` sin llamar a ningún endpoint
externo.

## R14

CUANDO `computeLocalScore` recibe un `Lead` con `presupuesto_usd >= 100000`,
`property_ids.length >= 1` y `mensaje.length >= 50`, el sistema DEBE retornar
`trust_score >= 70`.

## R15

CUANDO `computeLocalScore` recibe un `Lead` con `presupuesto_usd < 20000`
y `mensaje.length < 20`, el sistema DEBE retornar `trust_score < 40`.

## R16

CUANDO `computeLocalScore` retorna `trust_score >= 70`, el sistema DEBE
asignar `urgency === "Alta"`.

## R17

CUANDO `computeLocalScore` retorna `trust_score` entre 40 y 69 inclusive,
el sistema DEBE asignar `urgency === "Media"`.

## R18

CUANDO `computeLocalScore` retorna `trust_score < 40`, el sistema DEBE
asignar `urgency === "Baja"`.

## R19

El sistema DEBE exponer la página `pages/index.tsx` (o `pages/dashboard.tsx`)
que importa `DashboardLayout` y `LeadsFeed`, carga los 15 leads de
`product/backend/data/leads_mock.json`, aplica `computeLocalScore` a cada uno
y pasa el array resultante como prop a `LeadsFeed`.

## R20

El sistema DEBE tener el archivo `tests/frontend/test_feed.tsx` que, usando
React Testing Library, verifica que `LeadsFeed` renderiza correctamente
el conjunto de leads del mock data local.

## R21

CUANDO `tests/frontend/test_feed.tsx` ejecuta el test de ordenamiento, el sistema
DEBE verificar que el primer elemento DOM del feed corresponde al lead con mayor
`trust_score` del conjunto provisto.

## R22

CUANDO `tests/frontend/test_feed.tsx` ejecuta el test de badge de color, el sistema
DEBE verificar que un lead con `trust_score > 75` tiene el badge con clase de
color verde, y un lead con `trust_score < 40` tiene el badge con clase de color rojo.

## R23

CUANDO `tests/frontend/test_feed.tsx` ejecuta el test de tags de urgencia, el sistema
DEBE verificar que el texto "Alta", "Media" o "Baja" aparece en el ítem cuyo campo
`urgency` lo indica.
