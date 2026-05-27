# Tasks — dashboard_layout_and_feed

Feature ID: 3  
Layer: frontend  
Agente: frontend_implementer

El implementer marca `[x]` cada tarea al completarla.
Las tareas deben ejecutarse en el orden listado (hay dependencias entre ellas).

---

- [x] T1 — Crear `product/frontend/types/feed.ts` con el tipo `Urgency` y la
  interfaz `LeadWithScore` tal como se define en design.md §2.
  Cubre: R4.

- [x] T2 — Crear `product/frontend/lib/scoreUtils.ts` con la función pura
  `computeLocalScore(lead: Lead): LeadWithScore` usando la lógica de puntuación
  definida en design.md §3. La función NO debe hacer fetch ni importar módulos
  de Node que no existan en browser.
  Cubre: R13, R14, R15, R16, R17, R18.

- [x] T3 — Crear `product/frontend/components/DashboardLayout.tsx` con sidebar
  fija (w-64) y área principal (flex-1), aplicando las clases Tailwind de
  design.md §4.1. Acepta la prop `children: React.ReactNode`.
  Cubre: R1.

- [x] T4 — Crear `product/frontend/components/LeadCard.tsx` que recibe
  `item: LeadWithScore` y renderiza: id del lead, badge numérico del Trust Score
  con color semántico (verde/amarillo/rojo según thresholds), tag de urgencia
  (Alta/Media/Baja) con color semántico, zona y tipo de propiedad.
  Las clases de color DEBEN usar exactamente `bg-green-500`, `bg-yellow-400`,
  `bg-red-500` para que los tests de R22 puedan verificar por clase.
  Cubre: R5, R6, R7, R8, R9, R10, R11, R12.

- [x] T5 — Crear `product/frontend/components/LeadsFeed.tsx` que recibe
  `items: LeadWithScore[]` (ya ordenados) y renderiza una `<ul>` con un
  `<LeadCard>` por cada elemento. El componente NO ordena internamente.
  Cubre: R2, R3.

- [x] T6 — Crear `pages/index.tsx` que:
  1. Importa `leadsRaw` desde `product/backend/data/leads_mock.json`.
  2. Aplica `computeLocalScore` a cada lead.
  3. Ordena el array resultante por `trust_score` descendente.
  4. Renderiza `<DashboardLayout>` con `<LeadsFeed items={sorted} />` dentro.
  Cubre: R19.

- [x] T7 — Crear `tests/frontend/test_feed.tsx` con los siguientes casos de
  prueba usando React Testing Library (sin llamadas a API):
  - `renders_leads_in_descending_trust_score_order`: 3 items con scores 90, 50, 20;
    verifica orden en DOM.
  - `badge_color_green_for_high_score`: item con score 80; verifica clase `bg-green-500`.
  - `badge_color_yellow_for_mid_score`: item con score 55; verifica clase `bg-yellow-400`.
  - `badge_color_red_for_low_score`: item con score 30; verifica clase `bg-red-500`.
  - `urgency_tag_alta_visible`: item con urgency "Alta"; verifica texto "Alta".
  - `urgency_tag_media_visible`: item con urgency "Media"; verifica texto "Media".
  - `urgency_tag_baja_visible`: item con urgency "Baja"; verifica texto "Baja".
  - `renders_lead_id_visible`: verifica que `lead.id` aparece como texto en el ítem.
  El mock data se construye inline; no se importa `leads_mock.json` en los tests.
  Cubre: R20, R21, R22, R23, R5, R9, R10, R11, R12.
