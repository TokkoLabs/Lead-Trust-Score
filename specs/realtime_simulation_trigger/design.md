# Design — realtime_simulation_trigger

## 1. Archivos a crear

| Ruta | Tipo | Descripcion |
|------|------|-------------|
| `product/backend/api/leads/simulate.ts` | Handler Next.js nuevo | Endpoint `POST /api/leads/simulate`; genera Lead sintetico + invoca `analyseLeadWithAI` |
| `product/frontend/components/SimulatorPanel.tsx` | Componente nuevo | Panel con los dos botones de simulacion y gestion de carga/error |
| `tests/backend/test_simulate_endpoint.ts` | Test nuevo | Cobertura del handler con mock de `analyseLeadWithAI` |
| `tests/frontend/test_simulator_panel.tsx` | Test nuevo | Cobertura de `SimulatorPanel` con fetch mockeado |
| `tests/frontend/test_simulation_integration.tsx` | Test nuevo | Cobertura de la logica de insercion en `pages/index.tsx` |

## 2. Archivos a modificar

| Ruta | Cambio |
|------|--------|
| `pages/index.tsx` | Añadir estado `spamLeads`, handler `onLeadSimulated`, seccion spam, montaje de `SimulatorPanel` |
| `tailwind.config.js` | Añadir keyframe `enter` y utilidad `animate-enter` en `theme.extend` |

---

## 3. Arquitectura elegida: nuevo endpoint `POST /api/leads/simulate`

### Decision

Se crea un endpoint dedicado `POST /api/leads/simulate` que encapsula
generacion del lead sintetico + analisis AI en una sola llamada HTTP, en lugar
de modificar la firma de `/api/leads/analyze` para aceptar objetos Lead
directamente.

### Razonamiento

| Criterio | Nuevo endpoint | Modificar analyze |
|----------|---------------|-------------------|
| Retrocompatibilidad | Sin cambios en F2/F4 | Rompe contratos de `useLeadAnalysis` y tests existentes |
| Responsabilidad unica | `simulate` genera + analiza; `analyze` solo analiza | `analyze` mezcla dos flujos |
| Testabilidad | Mock aislado de generacion | Logica condicional dentro del handler existente |
| Velocidad (hackathon) | Archivo nuevo, sin tocar codigo probado | Requiere refactor + re-test de F2 |

La opcion de modificar `analyze` fue descartada porque introduce riesgo de
regresion sobre F2 y F4, que ya estan spec_ready.

---

## 4. Templates de leads sinteticos

### 4.1 Template "interested"

```typescript
const INTERESTED_TEMPLATE: Omit<Lead, "id"> = {
  mensaje:
    "Hola! Estoy buscando un departamento de 3 ambientes en Palermo o Recoleta. " +
    "Mi presupuesto es de USD 220.000. Necesito mudarme antes de fin de mes porque " +
    "vence mi contrato de alquiler. Preferentemente piso alto con balcon. " +
    "Puedo visitar esta semana.",
  email: "martin.gonzalez87@gmail.com",
  telefono: "+54 9 11 4832-9175",
  zona: "Palermo",
  tipo_propiedad: "departamento",
  presupuesto_usd: 220000,
  property_ids: [],
};
```

Justificacion de los campos:
- `mensaje` >= 120 caracteres con zona, tipo, presupuesto y urgencia explicita.
- `email` de dominio gmail con nombre plausible (nombre + apellido + digitos).
- `telefono` con formato argentino valido.
- `zona` coincide con zonas de `properties_mock.json` para que
  `filterCandidateProperties` devuelva resultados.
- `presupuesto_usd` alto para que Claude devuelva scores elevados.

### 4.2 Template "spam"

```typescript
const SPAM_TEMPLATE: Omit<Lead, "id"> = {
  mensaje: "comprar casa precio",
  email: "user4823@tempmail.org",
  telefono: "000-0000",
  zona: "",
  tipo_propiedad: null,
  presupuesto_usd: 0,
  property_ids: [],
};
```

Justificacion de los campos:
- `mensaje` < 30 caracteres, sin contexto ni intencion clara.
- `email` de dominio temporal de la lista hardcodeada.
- `telefono` con formato claramente invalido.
- `zona` vacia: `filterCandidateProperties` tendra cero coincidencias y usara
  el fallback de las 5 propiedades mas baratas; Claude aun recibe contexto.
- `presupuesto_usd: 0` y `tipo_propiedad: null` refuerzan la senal de spam.

Los IDs se generan con `"sim-" + Date.now()` en tiempo de ejecucion para
garantizar unicidad sin dependencias externas (no UUID).

---

## 5. Firma del endpoint simulate.ts

```typescript
// product/backend/api/leads/simulate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import type { Lead } from "../../../types/lead";
import type { LeadAnalysis } from "../../../types/lead_analysis";
import {
  filterCandidateProperties,
  analyseLeadWithAI,
} from "../../services/ai_analyser";
import * as fs from "fs";
import * as path from "path";
import type { Property } from "../../../types/property";

export interface SimulateResponse {
  lead: Lead;
  analysis: LeadAnalysis;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SimulateResponse | { error: string; detail?: string }>
): Promise<void>
```

Internamente:
1. Guard de metodo (solo POST).
2. Guard de `type` (`"interested"` | `"spam"`).
3. Construir `Lead` sintetico segun template + `id: "sim-" + Date.now()`.
4. Cargar `properties_mock.json`.
5. `filterCandidateProperties(lead, properties)`.
6. `analyseLeadWithAI(lead, candidates)` — puede lanzar, capturar con try/catch.
7. Retornar `{ lead, analysis }`.

---

## 6. Componente SimulatorPanel

### Props

```typescript
interface SimulatorPanelProps {
  onLeadSimulated: (result: { lead: Lead; analysis: LeadAnalysis }) => void;
  disabled?: boolean; // prop opcional para deshabilitar externamente si se desea
}
```

### Estado interno

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Estructura visual

```
┌─────────────────────────────────────────────────────┐
│  Simulador de Demo                                  │
│  [Simular Lead Interesado]  [Simular Lead Spam]     │
│  (cuando loading) "Simulando..."                    │
│  (cuando error)   "Error: ..."                      │
└─────────────────────────────────────────────────────┘
```

Clases de los botones:
- Interesado: `bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg
  text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed`
- Spam: `bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg
  text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed`

El panel se monta en `pages/index.tsx` encima del `LeadsFeed`, dentro del area
principal del dashboard.

---

## 7. Cambios en pages/index.tsx

### Estado nuevo

```typescript
const [spamLeads, setSpamLeads] = useState<LeadWithScore[]>([]);
```

### Handler onLeadSimulated

```typescript
function handleLeadSimulated(result: { lead: Lead; analysis: LeadAnalysis }) {
  const { lead, analysis } = result;
  const newItem: LeadWithScore = {
    lead,
    trust_score: analysis.trust_score,
    urgency: scoreToUrgency(analysis.trust_score),
  };

  // Actualizar mapa AI scores
  setAiScores((prev) => ({ ...prev, [lead.id]: analysis.trust_score }));

  if (analysis.is_spam) {
    setSpamLeads((prev) => [newItem, ...prev]);
  } else {
    setLeads((prev) => [lead, ...prev]);
  }
}
```

`scoreToUrgency` es una funcion helper (extraida de `computeLocalScore` o
inline) que mapea `trust_score` a `"Alta" | "Media" | "Baja"`.

El re-ordenado del feed ocurre en el render derivado `sortedWithAiScores`,
ya existente en F4, que ordena por `trust_score` descendente. No requiere
logica adicional porque el nuevo lead entra en `leads` y el sort lo ubica
automaticamente.

### Seccion spam en el JSX

```tsx
{spamLeads.length > 0 && (
  <section className="mt-6">
    <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
      <span aria-hidden="true">⚠</span>
      Leads Spam Detectados ({spamLeads.length})
    </h2>
    <ul className="space-y-2">
      {spamLeads.map((item) => (
        <li key={item.lead.id} className="rounded-lg bg-red-950 border border-red-800">
          <span className="sr-only">Lead spam:</span>
          <LeadCard item={item} />
        </li>
      ))}
    </ul>
  </section>
)}
```

---

## 8. Animacion de entrada — animate-enter

### Definicion en tailwind.config.js

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        enter: {
          "0%":  { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        enter: "enter 0.6s ease-out forwards",
      },
    },
  },
};
```

### Uso en LeadCard

El `<li>` de `LeadCard` acepta una prop opcional `isNew?: boolean`. Cuando
es `true`, el `className` incluye `animate-enter`. Pasados 600ms, la clase se
retira via `useEffect` + `setTimeout` para no interferir con renders futuros.

Alternativa descartada: usar la libreria `framer-motion`. Descartada porque
requiere una dependencia de npm no incluida en el proyecto base y la animacion
CSS pura con Tailwind keyframes es suficiente para el wow factor sin overhead.

---

## 9. Estrategia de tests

### Backend — test_simulate_endpoint.ts

- Se mockea el modulo `../../services/ai_analyser` con `jest.mock`.
- `analyseLeadWithAI` retorna un `LeadAnalysis` fixture hardcodeado.
- Se testea el handler directamente instanciando `req`/`res` mock (patron de F2).
- NO hay llamadas reales a Claude API.

### Frontend — test_simulator_panel.tsx

- `global.fetch = jest.fn()` retorna `Promise.resolve` con body JSON fixture.
- Se usa React Testing Library (`render`, `screen`, `fireEvent`).
- Patron identico al de `tests/frontend/test_use_lead_analysis.tsx`.

### Frontend — test_simulation_integration.tsx

- Se monta `pages/index.tsx` (o una version simplificada que incluya el estado
  relevante) con `leads` mock y se simula la llamada a `handleLeadSimulated`
  directamente para verificar insercion en feed principal vs seccion spam.
- Alternativa evaluada: test e2e con Playwright. Descartada por tiempo (hackathon)
  y porque los tests de integracion con RTL son suficientes para verificar la logica.
