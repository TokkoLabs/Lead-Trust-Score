# impl_dashboard_layout_and_feed

Feature ID: 3  
Layer: frontend  
Agente: frontend_implementer  
Fecha: 2026-05-27

---

## Estado: done (pendiente aprobacion reviewer)

---

## Tareas completadas

- [x] T1 — `product/frontend/types/feed.ts`: tipo `Urgency` e interfaz `LeadWithScore`. Cubre R4.
- [x] T2 — `product/frontend/lib/scoreUtils.ts`: función pura `computeLocalScore`. Cubre R13-R18.
- [x] T3 — `product/frontend/components/DashboardLayout.tsx`: sidebar w-64 + área principal flex-1. Cubre R1.
- [x] T4 — `product/frontend/components/LeadCard.tsx`: id, badge numérico con colores exactos (`bg-green-500`, `bg-yellow-400`, `bg-red-500`), tag urgencia. Cubre R5-R12.
- [x] T5 — `product/frontend/components/LeadsFeed.tsx`: renderiza `<ul>` sin ordenar internamente. Cubre R2, R3.
- [x] T6 — `pages/index.tsx`: importa mock JSON, aplica `computeLocalScore`, ordena descendente, renderiza layout + feed. Cubre R19.
- [x] T7 — `jest.config.js` + instalacion de dependencias (jest, ts-jest, @testing-library/react, @testing-library/jest-dom, jest-environment-jsdom) + `tests/frontend/test_feed.tsx` con 8 casos de prueba inline. Cubre R20-R23, R5, R9-R12.

---

## Resultado de tests

```
npx jest tests/frontend/test_feed.tsx --no-coverage

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        2.704 s
```

Todos los 8 tests pasan sin warnings.

---

## Trazabilidad R -> test

| Requisito | Test que lo verifica |
|-----------|---------------------|
| R2 (LeadsFeed recibe array LeadWithScore) | renders_leads_in_descending_trust_score_order |
| R3 (orden descendente en DOM) | renders_leads_in_descending_trust_score_order |
| R5 (lead.id visible) | renders_lead_id_visible |
| R6 (badge verde score > 75) | badge_color_green_for_high_score |
| R7 (badge amarillo score 40-75) | badge_color_yellow_for_mid_score |
| R8 (badge rojo score < 40) | badge_color_red_for_low_score |
| R9 (valor numérico en badge) | badge_color_green_for_high_score, badge_color_yellow_for_mid_score, badge_color_red_for_low_score |
| R10 (tag "Alta" visible) | urgency_tag_alta_visible |
| R11 (tag "Media" visible) | urgency_tag_media_visible |
| R12 (tag "Baja" visible) | urgency_tag_baja_visible |
| R20 (archivo test existe con RTL) | todos |
| R21 (test ordenamiento) | renders_leads_in_descending_trust_score_order |
| R22 (test badge verde/rojo) | badge_color_green_for_high_score, badge_color_red_for_low_score |
| R23 (test tags urgencia) | urgency_tag_alta_visible, urgency_tag_media_visible, urgency_tag_baja_visible |

Requisitos sin test automatizado (validacion visual/estructural):
- R1, R4, R13-R19: implementados y verificables visualmente o por tipado TypeScript estricto.

---

## Decisiones relevantes

1. **jest.config.js con transform en lugar de globals**: La configuracion moderna de ts-jest recomienda `transform` en vez de `globals`. Se uso la forma nueva para evitar warnings de deprecacion.

2. **tsconfig separado en jest**: En lugar de crear un tsconfig adicional, se paso la config inline a ts-jest con `jsx: "react"` y `lib: ["ES2020", "DOM"]` para que los tests compilen correctamente sin afectar el tsconfig.json raiz que no incluye JSX.

3. **Mock data inline en tests**: Todos los objetos `LeadWithScore` de los tests se construyen con la funcion helper `makeItem` y `makeLead` definidas en el propio archivo, cumpliendo el requisito de hermeticidad (sin importar leads_mock.json).

4. **LeadsFeed no ordena**: El componente recibe el array ya ordenado; el ordenamiento ocurre en `pages/index.tsx`. Esto simplifica el test de orden (el DOM refleja exactamente el orden del array de entrada).

5. **Clases CSS exactas**: `bg-green-500`, `bg-yellow-400`, `bg-red-500` usadas sin aliasing en `LeadCard.tsx`, tal como exige T4 para que los tests de querySelector funcionen por clase.

---

## Archivos creados

- `product/frontend/types/feed.ts`
- `product/frontend/lib/scoreUtils.ts`
- `product/frontend/components/DashboardLayout.tsx`
- `product/frontend/components/LeadCard.tsx`
- `product/frontend/components/LeadsFeed.tsx`
- `pages/index.tsx`
- `tests/frontend/test_feed.tsx`
- `jest.config.js`
