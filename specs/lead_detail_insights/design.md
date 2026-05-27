# Design — lead_detail_insights

## 1. Archivos a crear

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `product/frontend/hooks/useLeadAnalysis.ts` | Hook nuevo | Llama a `POST /api/leads/analyze` y gestiona loading/error/data |
| `product/frontend/components/LeadDetailPanel.tsx` | Componente nuevo | Panel visual completo del lead seleccionado |
| `tests/frontend/test_lead_detail_panel.tsx` | Test nuevo | Cobertura de LeadDetailPanel |
| `tests/frontend/test_use_lead_analysis.tsx` | Test nuevo | Cobertura del hook |

## 2. Archivos a modificar

| Ruta | Cambio |
|------|--------|
| `pages/index.tsx` | Añadir estado `selectedLeadId`, layout de dos columnas, integración de `LeadDetailPanel` y `useLeadAnalysis`. Ver sección 4. |
| `product/frontend/components/LeadCard.tsx` | Añadir prop opcional `onSelect` y handler de click. Ver sección 5. |
| `product/frontend/components/LeadsFeed.tsx` | Añadir prop opcional `onSelectLead` y propagarla a cada `LeadCard`. Ver sección 5. |

---

## 3. Hook — useLeadAnalysis

```typescript
// product/frontend/hooks/useLeadAnalysis.ts
import { useState, useEffect } from "react";
import type { LeadAnalysis } from "../../types/lead_analysis";

interface UseLeadAnalysisResult {
  analysis: LeadAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

export function useLeadAnalysis(leadId: string | null): UseLeadAnalysisResult {
  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset siempre que cambia el leadId
    setAnalysis(null);
    setError(null);

    if (!leadId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const controller = new AbortController();

    fetch("/api/leads/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        return res.json() as Promise<LeadAnalysis>;
      })
      .then((data) => {
        setAnalysis(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [leadId]);

  return { analysis, isLoading, error };
}
```

Puntos clave:
- `AbortController` cancela la petición en vuelo si el usuario selecciona otro lead antes de que responda la anterior.
- El reset de estado ocurre antes del guard `if (!leadId)` para que cambiar a `null` también limpie resultados anteriores.

---

## 4. Flujo de estado en pages/index.tsx

```
usuario click en LeadCard
       |
       v
selectedLeadId = lead.id  (useState)
       |
       v
useLeadAnalysis(selectedLeadId)
       |-- isLoading = true  → LeadDetailPanel muestra skeleton
       |
       v  (fetch resuelve ~2-5 s)
analysis = LeadAnalysis    → LeadDetailPanel renderiza datos reales
                           → LeadCard del feed actualiza trust_score
```

Estado necesario en `pages/index.tsx`:
- `selectedLeadId: string | null` — qué lead está activo
- `aiScores: Record<string, number>` — mapa de leadId → trust_score real ya obtenido, para actualizar los badges del feed sin re-pedir

Layout de dos columnas en pantallas >= md:
```tsx
<DashboardLayout>
  <div className="flex gap-6 h-full">
    {/* Columna izquierda: feed */}
    <div className="w-80 flex-shrink-0">
      <LeadsFeed items={sortedWithAiScores} onSelectLead={setSelectedLeadId} />
    </div>
    {/* Columna derecha: detalle */}
    <div className="flex-1">
      {selectedLeadId
        ? <LeadDetailPanel ... />
        : <EmptyState />
      }
    </div>
  </div>
</DashboardLayout>
```

`sortedWithAiScores` se deriva en render: para cada `LeadWithScore`, si hay un score AI en `aiScores[lead.id]`, se reemplaza `trust_score` antes de ordenar.

---

## 5. Modificaciones a LeadCard y LeadsFeed

### LeadCard — nueva prop
```typescript
interface LeadCardProps {
  item: LeadWithScore;
  onSelect?: (leadId: string) => void;  // nueva
  isSelected?: boolean;                 // nueva — para highlight visual
}
```
El `<li>` existente recibe `onClick={() => onSelect?.(lead.id)}` y una clase
condicional `ring-2 ring-blue-500` cuando `isSelected` es `true`.

### LeadsFeed — nuevas props
```typescript
interface LeadsFeedProps {
  items: LeadWithScore[];
  onSelectLead?: (leadId: string) => void;  // nueva
  selectedLeadId?: string | null;           // nueva — para highlight
}
```

---

## 6. Componente LeadDetailPanel

### Props
```typescript
interface LeadDetailPanelProps {
  lead: Lead;
  analysis: LeadAnalysis | null;
  isLoading: boolean;
  properties: Property[];   // lista completa del catálogo, para resolver property_match_ids
}
```

### Estructura visual (de arriba abajo)

```
┌──────────────────────────────────────────────────────┐
│  Cabecera: lead.id + lead.zona + lead.tipo_propiedad  │
├──────────────────────────────────────────────────────┤
│  Trust Score Badge circular (grande, color semántico) │
├──────────────────────────────────────────────────────┤
│  Barras de progreso: Conversión | Urgencia            │
├──────────────────────────────────────────────────────┤
│  "Análisis IA" — párrafo ai_summary                   │
├──────────────────────────────────────────────────────┤
│  "Acción Recomendada" — texto + botón Copiar          │
├──────────────────────────────────────────────────────┤
│  "Propiedades Coincidentes" — tarjetas compactas      │
└──────────────────────────────────────────────────────┘
```

### Badge circular Trust Score
- `w-24 h-24 rounded-full` con `flex items-center justify-center`
- Color: `bg-green-500` (>75) / `bg-yellow-400` (40-75) / `bg-red-500` (<40)
- Valor numérico en `text-3xl font-bold`

### Barra de progreso
```tsx
<div className="w-full bg-gray-700 rounded-full h-2">
  <div
    className="h-2 rounded-full bg-blue-500 transition-all duration-700"
    style={{ width: `${score}%` }}
  />
</div>
```
La animación de `transition-all duration-700` proporciona el "wow factor" al aparecer.

### Skeleton/shimmer
Clases Tailwind `animate-pulse bg-gray-700 rounded` sobre bloques de tamaño fijo que imitan la forma de cada sección. No depende de librerías externas.

### Resolución de property_match_ids
```typescript
const matchedProperties = properties.filter(
  (p) => analysis.property_match_ids.includes(p.id)
);
```
`properties` se pasa desde `pages/index.tsx` donde se importa `properties_mock.json`.

---

## 7. Estrategia de tests

Framework: React Testing Library + Jest (misma configuración que `tests/frontend/test_feed.tsx`).

Mock del fetch global:
```typescript
global.fetch = jest.fn();
```

Por qué este approach: RTL + jest.fn() es lo que ya usa el proyecto; añadir MSW requeriría configuración adicional de Service Worker que no aporta para un MVP de hackathon.

Los tests de `LeadDetailPanel` son puramente de renderizado (no llaman fetch directamente). Los tests de `useLeadAnalysis` mockean `fetch` con `jest.fn()` que retorna `Promise.resolve(new Response(...))`.

---

## 8. Alternativa descartada

**Alternativa: Context API para el estado del lead seleccionado y el mapa de scores AI.**

Descartada porque:
1. El estado es local a una sola página (`pages/index.tsx`); elevarlo a Context añade archivos y complejidad sin beneficio para el MVP.
2. El hackathon (6 horas) prioriza velocidad de implementación; `useState` en la página es suficiente y más fácil de razonar.
3. La F5 (`realtime_simulation_trigger`) puede reutilizar el mismo patrón `useState` en `index.tsx` sin necesitar Context.

**Alternativa descartada: SWR / React Query para el fetch.**

Descartada porque introduce una dependencia de npm que no está en el proyecto base y requiere configuración extra. El hook `useLeadAnalysis` manual es trivial y testeable con `jest.fn()`.
