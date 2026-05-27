# impl_lead_detail_tokko_redesign

> Feature 17 — modo acelerado sin spec EARS. Briefing inline del leader.

## Plan

1. Reescribir `product/frontend/components/LeadDetailPanel.tsx` aplicando tokens Tokko (bg-surface-neutral-ground / shadow-low / rounded-card / Nunito Sans) eliminando todas las clases `gray-*` del dark theme.
2. Mantener AC2: trust badge circular semantico, conversion/urgency bars (via `ScoreBar`), `ai_summary` con label "Analisis IA", boton copiar `suggested_action`, property cards filtradas por `property_match_ids`, skeleton.
3. Anyadir reason chips (AC3) reusando `deriveReasons` desde `product/frontend/lib/leadReasons.ts`.
4. Anyadir footer con 3 botones (Crear contacto / Asignar / Marcar como spam) coherentes con QueueCard (AC4) — props opcionales `onCrearContacto`, `onAsignar`, `onMarcarSpam`.
5. Sin tocar handlers de uso actual (`DashboardView.tsx` solo pasa props existentes). Botones funcionan aunque no haya callback (disabled visual + sin throw).
6. Actualizar `tests/frontend/test_lead_detail_panel.tsx`: borrar aserciones `gray-*`, anyadir aserciones brand-/feedback-, reason chips, footer buttons, callbacks click.
7. Verificar: tsc + jest. Garantizar no romper otros tests.

## Traza R<n> → test (AC del feature_list.json)

- AC1 (Tokko styling, sin gray-*) → `lead_detail_panel_uses_tokko_surface_classes`, `header_has_no_gray_classes`.
- AC2 badge semantico → `badge_green_when_trust_score_80`, `badge_yellow_when_trust_score_55`, `badge_red_when_trust_score_25`.
- AC2 conversion/urgency bars → `conversion_and_urgency_bars_render`.
- AC2 ai_summary etiqueta → `ai_summary_visible_with_label`.
- AC2 copiar suggested_action → `clipboard_writeText_invoked_on_copy_click`.
- AC2 property_match_ids filter → `property_cards_rendered_when_matches_exist`, `non_matching_property_not_rendered`.
- AC2 skeleton → `skeleton_visible_when_isLoading_true`, `skeleton_uses_animate_pulse`.
- AC3 reason chips → `reason_chips_rendered_when_lead_has_signals`.
- AC4 footer actions → `footer_has_three_action_buttons`, `crear_contacto_callback_fires`, `marcar_spam_callback_fires`, `asignar_callback_fires`.
- AC5 styling vs clases tokens → cubierto en aserciones AC1/AC2/AC4.

## Estado

- 2026-05-27: implementacion completa.
- tsc --noEmit: VERDE (sin output, sin errores).
- jest (suite completa): VERDE — 18 suites / 139 tests passed.
- jest (test_lead_detail_panel.tsx): VERDE — 22 tests passed (antes eran 9 con dark theme).
- init.sh: FAIL pre-existente (check de github user esperado 'your-github-username'); ajeno a la feature.

## Archivos tocados

- product/frontend/components/LeadDetailPanel.tsx — reescritura completa con tokens Tokko, ScoreBar, reason chips, footer con 3 actions.
- tests/frontend/test_lead_detail_panel.tsx — reescritura: 22 tests cubriendo AC1-AC4.

## Notas

- DashboardView.tsx ya consumia LeadDetailPanel con los 4 props originales (lead/analysis/isLoading/properties). Los 3 nuevos handlers (`onCrearContacto`/`onAsignar`/`onMarcarSpam`) son opcionales: si el host no los pasa, los botones del footer quedan visibles pero `disabled`. No se toco DashboardView para preservar el comportamiento actual (la integracion de los handlers se delega al simulador unificado feature 18 si aplica).
- Se respeta clase `bg-surface-ground` (token de tailwind.config existente) en lugar del placeholder `bg-surface-neutral-ground` del briefing, alineado con QueueCard.
- Header preserva la informacion del lead aun en estado de loading (zona, tipo, score 0 si analysis null) para no parpadear.
- Reuso: `ScoreBar` para conversion/urgency; `deriveReasons` para chips.
- Sin handler para `onMarcarSpam`, el button queda inerte pero accesible.

## Cierre

done -> progress/impl_lead_detail_tokko_redesign.md
