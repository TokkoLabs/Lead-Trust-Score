# Design — dashboard_layout_and_feed

Feature ID: 3  
Layer: frontend

---

## 1. Archivos a crear / modificar

| Acción | Ruta |
|--------|------|
| CREAR  | `product/frontend/types/feed.ts` |
| CREAR  | `product/frontend/lib/scoreUtils.ts` |
| CREAR  | `product/frontend/components/DashboardLayout.tsx` |
| CREAR  | `product/frontend/components/LeadsFeed.tsx` |
| CREAR  | `product/frontend/components/LeadCard.tsx` |
| CREAR  | `pages/index.tsx` (página raíz Next.js) |
| CREAR  | `tests/frontend/test_feed.tsx` |

No se modifica ningún archivo de `product/backend/` ni `product/types/`.

---

## 2. Tipos auxiliares (`product/frontend/types/feed.ts`)

```ts
import type { Lead } from "../../types/lead";

export type Urgency = "Alta" | "Media" | "Baja";

export interface LeadWithScore {
  lead: Lead;
  trust_score: number;   // 0-100, entero
  urgency: Urgency;
}
```

---

## 3. Lógica de scoring local (`product/frontend/lib/scoreUtils.ts`)

El objetivo es poblar el feed visualmente sin llamar al endpoint de IA.
El algoritmo es deliberadamente simple y determinista; se reemplazará por
datos reales del endpoint en F4/F5.

```ts
import type { Lead } from "../../types/lead";
import type { LeadWithScore, Urgency } from "../types/feed";

export function computeLocalScore(lead: Lead): LeadWithScore {
  let score = 0;

  // Presupuesto (hasta 40 pts)
  if (lead.presupuesto_usd >= 300000) score += 40;
  else if (lead.presupuesto_usd >= 100000) score += 30;
  else if (lead.presupuesto_usd >= 50000) score += 20;
  else if (lead.presupuesto_usd >= 20000) score += 10;
  // <20000 → 0 pts

  // Longitud del mensaje (hasta 30 pts, proxy de intención detallada)
  if (lead.mensaje.length >= 100) score += 30;
  else if (lead.mensaje.length >= 50) score += 20;
  else if (lead.mensaje.length >= 20) score += 10;
  // <20 → 0 pts

  // Propiedades referenciadas (hasta 20 pts)
  if (lead.property_ids.length >= 3) score += 20;
  else if (lead.property_ids.length >= 1) score += 10;

  // Tipo de propiedad definido (10 pts)
  if (lead.tipo_propiedad !== null) score += 10;

  const trust_score = Math.min(100, score);

  const urgency: Urgency =
    trust_score >= 70 ? "Alta" :
    trust_score >= 40 ? "Media" :
    "Baja";

  return { lead, trust_score, urgency };
}
```

Rango posible: 0–100 pts.
- Alta calidad (presupuesto alto + mensaje largo + propiedades): 80-100 → Verde + Alta.
- Mediocre: 40-69 → Amarillo + Media.
- Spam/incompleto (presupuesto irrisorio + mensaje corto + sin propiedades): 0-39 → Rojo + Baja.

La función es pura: sin side-effects, sin fetch, sin llamadas a módulos externos.

---

## 4. Estructura visual del Dashboard

### 4.1 `DashboardLayout.tsx`

Disposición de dos columnas con Tailwind:

```
┌─────────────────────────────────────────────────────────┐
│ Sidebar (w-64, fijo, fondo oscuro)  │  Main area (flex-1)│
│                                     │                    │
│  Logo / título                      │  {children}        │
│  Nav item: "Leads"   ← activo       │                    │
│  Nav item: "Config"  ← futuro       │                    │
└─────────────────────────────────────────────────────────┘
```

Props:
```ts
interface DashboardLayoutProps {
  children: React.ReactNode;
}
```

Clases clave:
- Contenedor: `flex h-screen bg-gray-950 text-white`
- Sidebar: `w-64 bg-gray-900 border-r border-gray-800 flex flex-col`
- Main: `flex-1 overflow-y-auto p-6`

### 4.2 `LeadCard.tsx`

Un ítem de la lista. Muestra:

```
┌──────────────────────────────────────────────────────┐
│  lead-01             [82] verde    [Alta] badge      │
│  Palermo · departamento · $130,000 USD               │
└──────────────────────────────────────────────────────┘
```

Props:
```ts
interface LeadCardProps {
  item: LeadWithScore;
}
```

Badge de Trust Score: círculo pequeño (`w-10 h-10 rounded-full`) con número centrado.
Tag de urgencia: `rounded px-2 py-0.5 text-xs font-semibold`.

Mapa de colores (clases Tailwind):

| Rango trust_score | Badge bg    | Tag urgency color   |
|-------------------|-------------|---------------------|
| > 75              | `bg-green-500` | `bg-green-700 text-green-100` |
| 40–75             | `bg-yellow-400 text-gray-900` | `bg-yellow-600 text-yellow-100` |
| < 40              | `bg-red-500`   | `bg-red-700 text-red-100`   |

### 4.3 `LeadsFeed.tsx`

Props:
```ts
interface LeadsFeedProps {
  items: LeadWithScore[];  // pre-ordenados externamente
}
```

El componente NO ordena; el ordenamiento ocurre en el lugar de uso (página).
Esto hace que `LeadsFeed` sea un componente puro y fácil de testear.

Renderiza: `<ul>` con un `<LeadCard>` por cada `item`.

### 4.4 `pages/index.tsx`

```ts
import leadsRaw from "../product/backend/data/leads_mock.json";
// computeLocalScore + sort + render
```

El import estático del JSON es válido en Next.js con `resolveJsonModule: true`
(habilitado por defecto en `tsconfig.json` de Next.js).

Los datos se pasan como `getStaticProps` o directamente como módulo importado
(import estático); dado que es demo local sin necesidad de ISR, se elige
import directo en el módulo para minimizar complejidad.

---

## 5. Estrategia de testing

**Herramienta:** React Testing Library + Jest (incluidos en `create-next-app` por defecto).

Archivo: `tests/frontend/test_feed.tsx`

Casos de prueba:
1. `renders_leads_in_descending_trust_score_order` — provee 3 leads con scores 90, 50, 20; verifica que aparecen en ese orden en el DOM.
2. `badge_color_green_for_high_score` — provee lead con score 80; verifica presencia de clase `bg-green-500`.
3. `badge_color_yellow_for_mid_score` — provee lead con score 55; verifica presencia de clase `bg-yellow-400`.
4. `badge_color_red_for_low_score` — provee lead con score 30; verifica presencia de clase `bg-red-500`.
5. `urgency_tag_alta_visible` — provee item con urgency "Alta"; verifica texto "Alta" en DOM.
6. `urgency_tag_media_visible` — provee item con urgency "Media"; verifica texto "Media".
7. `urgency_tag_baja_visible` — provee item con urgency "Baja"; verifica texto "Baja".
8. `renders_lead_id_visible` — verifica que el `id` del lead aparece como texto en el ítem.

**Mock data de tests:** objetos `LeadWithScore` construidos inline (no dependen de leads_mock.json),
garantizando que los tests son herméticos.

---

## 6. Alternativa descartada

**Alternativa: ordenar dentro de `LeadsFeed`**

Se consideró que `LeadsFeed` recibiera el array desordenado y ordenara
internamente con `[...items].sort(...)`.

**Razón del descarte:** viola el principio de responsabilidad única y dificulta
el test de ordenamiento (requeriría proveer datos desordenados y verificar
el estado post-render, acoplando el test a la lógica interna del componente).
Ordenar en la página (`pages/index.tsx`) y pasar la lista ya ordenada es
más predecible y testeable.

---

## 7. Dependencias externas

No se añaden dependencias npm nuevas en esta feature. React Testing Library
y Jest ya están disponibles en el proyecto Next.js base.
