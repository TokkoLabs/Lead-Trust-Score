import React, { useState } from "react";
import WeightsTab, { type Weights } from "./criteria/WeightsTab";
import FiltersTab, { type Filters } from "./criteria/FiltersTab";
import ChannelsTab, {
  CHANNEL_NAMES,
  type Boosts,
  type ChannelName,
  type ChannelsState,
} from "./criteria/ChannelsTab";
import Toast from "../common/Toast";

/**
 * CriteriaCard — card "Criterios de scoring" del Dashboard (feature 13).
 *
 * Tabs internas controladas por estado local:
 *  - Pesos    → 3 sliders Trust/Conversión/Urgencia + barra dinámica + umbral
 *  - Filtros  → 5 toggles role="switch" (labels exactos del HTML target)
 *  - Canales  → 7 chips aria-pressed + 2 boost sliders (WhatsApp / Mail)
 *
 * Footer:
 *  - Botón "Guardar criterios →". Al click llama `onSave?(state)` y muestra
 *    un Toast de éxito (role=status) que se auto-dismiss en 2.5s.
 *  - Sin endpoint: la persistencia se delega al consumidor o se descarta.
 *
 * Reference: ui-ux/lead-trust-dashboard-tokko (3).html, líneas 745-804.
 */

export type { ChannelName } from "./criteria/ChannelsTab";

export interface CriteriaState {
  weights: Weights;
  umbralAlerta: number;
  filters: Filters;
  channels: ChannelsState;
  boosts: Boosts;
}

export const DEFAULT_CRITERIA: CriteriaState = {
  weights: { trust: 40, conversion: 40, urgency: 20 },
  umbralAlerta: 70,
  filters: {
    bloquearInvalidos: true,
    detectarSpam: true,
    filtrarDuplicados: true,
    ignorarSinMensaje: false,
    scoreMinGlobal: 15,
  },
  channels: {
    Zonaprop: true,
    Argenprop: true,
    WhatsApp: true,
    Mail: true,
    Mercadolibre: false,
    "Chat web": true,
    Navent: false,
  },
  boosts: { whatsapp: 1.3, mail: 1.1 },
};

export interface CriteriaCardProps {
  /** Override parcial de defaults (útil para tests). */
  defaults?: Partial<CriteriaState>;
  /** Callback opcional al pulsar "Guardar criterios →". */
  onSave?: (state: CriteriaState) => void;
}

type TabKey = "weights" | "filters" | "channels";

const TAB_LABELS: Record<TabKey, string> = {
  weights: "Pesos",
  filters: "Filtros",
  channels: "Canales",
};

function mergeDefaults(
  overrides: Partial<CriteriaState> | undefined,
): CriteriaState {
  if (!overrides) return DEFAULT_CRITERIA;
  return {
    weights: { ...DEFAULT_CRITERIA.weights, ...overrides.weights },
    umbralAlerta: overrides.umbralAlerta ?? DEFAULT_CRITERIA.umbralAlerta,
    filters: { ...DEFAULT_CRITERIA.filters, ...overrides.filters },
    channels: { ...DEFAULT_CRITERIA.channels, ...overrides.channels },
    boosts: { ...DEFAULT_CRITERIA.boosts, ...overrides.boosts },
  };
}

export default function CriteriaCard({ defaults, onSave }: CriteriaCardProps) {
  const initial = mergeDefaults(defaults);
  const [activeTab, setActiveTab] = useState<TabKey>("weights");
  const [weights, setWeights] = useState<Weights>(initial.weights);
  const [umbralAlerta, setUmbralAlerta] = useState<number>(initial.umbralAlerta);
  const [filters, setFilters] = useState<Filters>(initial.filters);
  const [channels, setChannels] = useState<ChannelsState>(initial.channels);
  const [boosts, setBoosts] = useState<Boosts>(initial.boosts);
  const [toastOpen, setToastOpen] = useState(false);

  function handleWeightChange(key: keyof Weights, value: number) {
    setWeights((prev) => ({ ...prev, [key]: value }));
  }

  function handleFilterToggle(
    key:
      | "bloquearInvalidos"
      | "detectarSpam"
      | "filtrarDuplicados"
      | "ignorarSinMensaje",
  ) {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleScoreMinChange(value: number) {
    setFilters((prev) => ({ ...prev, scoreMinGlobal: value }));
  }

  function handleChannelToggle(name: ChannelName) {
    setChannels((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function handleBoostChange(key: keyof Boosts, value: number) {
    setBoosts((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    const snapshot: CriteriaState = {
      weights,
      umbralAlerta,
      filters,
      channels,
      boosts,
    };
    if (onSave) {
      onSave(snapshot);
    }
    setToastOpen(true);
  }

  return (
    <section
      aria-label="Criterios de scoring"
      className="bg-surface-ground border border-neutral-grey-200 rounded-card shadow-low p-5"
    >
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-[13px] font-semibold text-neutral-grey-800">
          Criterios de scoring
        </h2>
      </header>

      {/* Sub-tabs container — usamos role="group" en vez de "tablist" para no
          colisionar con el tablist (Hoy/7d/30d) del PageHeader del Dashboard,
          que es global a la vista. Los buttons mantienen role="tab" para
          semántica accesible. */}
      <div
        role="group"
        aria-label="Sub-tabs de criterios"
        data-testid="criteria-subtabs"
        className="flex gap-2 border-b border-neutral-grey-200 mb-4"
      >
        {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`cs-panel-${key}`}
              id={`cs-tab-${key}`}
              data-tab-key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-2 text-[12px] font-semibold cursor-pointer border-b-2 -mb-px transition-colors ${
                active
                  ? "text-brand-primary-500 border-brand-primary-500"
                  : "text-neutral-grey-500 border-transparent hover:text-neutral-grey-700"
              }`}
            >
              {TAB_LABELS[key]}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`cs-panel-${activeTab}`}
        aria-labelledby={`cs-tab-${activeTab}`}
      >
        {activeTab === "weights" && (
          <WeightsTab
            weights={weights}
            umbralAlerta={umbralAlerta}
            onWeightChange={handleWeightChange}
            onUmbralChange={setUmbralAlerta}
          />
        )}
        {activeTab === "filters" && (
          <FiltersTab
            filters={filters}
            onToggle={handleFilterToggle}
            onScoreMinChange={handleScoreMinChange}
          />
        )}
        {activeTab === "channels" && (
          <ChannelsTab
            channels={channels}
            boosts={boosts}
            onChannelToggle={handleChannelToggle}
            onBoostChange={handleBoostChange}
          />
        )}
      </div>

      <footer className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-grey-100 pt-4">
        <div className="min-h-[28px]" data-testid="criteria-toast-slot">
          {toastOpen && (
            <Toast
              message="Criterios guardados"
              variant="success"
              onDismiss={() => setToastOpen(false)}
            />
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          data-testid="criteria-save-btn"
          className="px-4 py-2 rounded-button bg-brand-primary-500 text-white text-[12px] font-semibold hover:bg-brand-primary-700 transition-colors"
        >
          Guardar criterios →
        </button>
      </footer>

      {/* Lista de canales solo se referencia visualmente */}
      <span className="sr-only" data-testid="channel-names">
        {CHANNEL_NAMES.join(",")}
      </span>
    </section>
  );
}
