# Tasks — lead_detail_insights

Ejecutor: `frontend_implementer`
Orden de ejecución: secuencial (cada task puede depender de la anterior).
Marca cada `[ ]` como `[x]` al completar. Documenta la trazabilidad en
`progress/impl_lead_detail_insights.md`.

---

- [x] T1 — Crear `product/frontend/hooks/useLeadAnalysis.ts` con la firma y
  lógica descritas en `design.md` sección 3: estado `analysis/isLoading/error`,
  `useEffect` con `AbortController`, reset al cambiar `leadId`.
  Cubre: R11, R12, R13, R14, R15.

- [x] T2 — Crear `tests/frontend/test_use_lead_analysis.tsx`: mockear
  `global.fetch`; verificar que `isLoading` arranca en `true`; verificar que
  `analysis` se actualiza al resolver con HTTP 200; verificar que `error` se
  actualiza al resolver con HTTP 500; verificar que el estado se reinicia al
  cambiar `leadId`.
  Cubre: R11, R12, R13, R14, R15, R22.

- [x] T3 — Crear `product/frontend/components/LeadDetailPanel.tsx` con las
  props `{ lead, analysis, isLoading, properties }` y la estructura visual
  definida en `design.md` sección 6 (cabecera, badge circular, barras de
  progreso, sección IA, sección acción recomendada, sección propiedades).
  Cubre: R1, R3, R4, R5, R6, R7, R9, R10.

- [x] T4 — Implementar el bloque skeleton/shimmer en `LeadDetailPanel` que se
  renderiza cuando `isLoading` es `true`, usando clases Tailwind `animate-pulse`
  sobre bloques que imitan la estructura del panel completo.
  Cubre: R2.

- [x] T5 — Implementar la lógica del botón "Copiar" en `LeadDetailPanel`: al
  hacer click invocar `navigator.clipboard.writeText(analysis.suggested_action)`.
  Cubre: R8.

- [x] T6 — Crear `tests/frontend/test_lead_detail_panel.tsx` con los siguientes
  casos:
  (a) skeleton visible cuando `isLoading=true`,
  (b) badge verde cuando `trust_score=80`,
  (c) badge amarillo cuando `trust_score=60`,
  (d) badge rojo cuando `trust_score=30`,
  (e) texto de `ai_summary` visible con etiqueta "Análisis IA",
  (f) texto de `suggested_action` visible en sección "Acción Recomendada",
  (g) tarjetas de propiedades renderizadas cuando `property_match_ids` tiene IDs coincidentes,
  (h) mensaje "Sin propiedades coincidentes" cuando `property_match_ids` está vacío,
  (i) `navigator.clipboard.writeText` invocado con `suggested_action` al click en "Copiar".
  Cubre: R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R21.

- [x] T7 — Modificar `product/frontend/components/LeadCard.tsx`: añadir props
  opcionales `onSelect?: (leadId: string) => void` e `isSelected?: boolean`;
  añadir `onClick` al elemento `<li>` que llama `onSelect?.(lead.id)`; añadir
  clase condicional `ring-2 ring-blue-500` cuando `isSelected` es `true`.
  Cubre: R19.

- [x] T8 — Modificar `product/frontend/components/LeadsFeed.tsx`: añadir props
  opcionales `onSelectLead?: (leadId: string) => void` y
  `selectedLeadId?: string | null`; propagar ambas a cada `LeadCard`.
  Cubre: R20.

- [x] T9 — Modificar `pages/index.tsx`:
  (a) Importar `Property` desde `product/types/property.ts` y
  `propertiesRaw` desde `product/backend/data/properties_mock.json`.
  (b) Añadir estado `selectedLeadId: string | null` con `useState(null)`.
  (c) Añadir estado `aiScores: Record<string, number>` con `useState({})`.
  (d) Llamar `useLeadAnalysis(selectedLeadId)` y, cuando `analysis` llegue,
  actualizar `aiScores[selectedLeadId]`.
  (e) Derivar `sortedWithAiScores` reemplazando `trust_score` con el valor
  de `aiScores` cuando esté disponible, antes de ordenar.
  (f) Cambiar el layout a dos columnas (feed izquierda + panel derecha).
  (g) Pasar `onSelectLead`, `selectedLeadId` a `LeadsFeed`.
  (h) Renderizar `LeadDetailPanel` con el lead seleccionado, el resultado de
  `useLeadAnalysis` y `propertiesRaw as Property[]`.
  Cubre: R16, R17, R18.

- [x] T10 — Verificar que `npm run build` (o `tsc --noEmit`) no produce errores
  de tipos en ninguno de los archivos creados o modificados.
  Cubre: R1.
