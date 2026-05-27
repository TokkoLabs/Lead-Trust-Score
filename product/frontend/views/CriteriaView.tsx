import React, { useState } from "react";

import {
  cloneDefaults,
  type CriteriaState,
  type CriterionConfig,
} from "../lib/criteriaDefaults";
import { loadCriteria, saveCriteria } from "../lib/criteriaStorage";

import CriteriaSection from "../components/criteria/CriteriaSection";
import CriterionRow from "../components/criteria/CriterionRow";
import KeywordsList from "../components/criteria/KeywordsList";
import Toast from "../components/common/Toast";

/**
 * CriteriaView — vista "Criterios de scoring" (feature 15).
 *
 * Cubre acceptance:
 *  AC1 — Layout 2 columnas + banner azul superior (`role="status"` opcional).
 *  AC2 — Reusa `CriterionRow` para todas las filas con toggle + select.
 *  AC3 — Reusa `KeywordsList` para positivas (verde) y negativas (rojo).
 *  AC4 — Lee defaults centralizados en `lib/criteriaDefaults.ts`; el botón
 *        "Restablecer defaults" llama `cloneDefaults()` y reemplaza estado.
 *  AC5 — Al guardar: `saveCriteria(state)` (localStorage `criteria_v1`) +
 *        Toast "Criterios guardados" success.
 *  AC6 — Test cubre add/remove de keywords, restablecer defaults, persistencia
 *        en localStorage.
 *
 * Referencia HTML: ui-ux/lead-trust-dashboard-tokko (3).html, sección
 * `#view-criteria`, líneas 831-888.
 *
 * Reglas:
 *  - Estado en cliente; sin backend.
 *  - Mount: intenta hidratar desde localStorage; fallback a defaults.
 *  - "Restablecer defaults": setState(cloneDefaults()), sin recargar.
 *  - "Guardar criterios": persiste + dispara Toast (auto-dismiss 2.5s).
 */

interface ContactoConfigKey {
  key: keyof CriteriaState["contacto"];
  label: string;
  description: string;
}

interface PropiedadConfigKey {
  key: keyof CriteriaState["propiedadFuente"];
  label: string;
  description: string;
}

interface MensajeConfigKey {
  key: keyof CriteriaState["mensaje"];
  label: string;
  description: string;
}

interface FiltroConfigKey {
  key: keyof CriteriaState["filtrosAutomaticos"];
  label: string;
  sub: string;
}

const CONTACTO_ROWS: ContactoConfigKey[] = [
  {
    key: "email",
    label: "Tiene email",
    description: "El lead proveyó un email de contacto",
  },
  {
    key: "telefono",
    label: "Tiene teléfono",
    description: "Celular o fijo registrado",
  },
  {
    key: "telefonoCompleto",
    label: "Teléfono completo (≥10 dígitos)",
    description: "Al menos 10 dígitos",
  },
];

const PROPIEDAD_ROWS: PropiedadConfigKey[] = [
  {
    key: "solicitudVisita",
    label: "Solicitud de visita",
    description: "El mensaje menciona fecha o pedido de turno",
  },
  {
    key: "portalVerificado",
    label: "Portal verificado",
    description: "Lead proviene de portal real (no demo/test)",
  },
];

const MENSAJE_ROWS: MensajeConfigKey[] = [
  {
    key: "noVacio",
    label: "Mensaje no vacío",
    description: "El contacto escribió algo",
  },
  {
    key: "extenso",
    label: "Mensaje extenso (>30 chars)",
    description: "Más de 30 caracteres — indica intención real",
  },
];

const FILTROS_ROWS: FiltroConfigKey[] = [
  {
    key: "bloquearInvalidos",
    label: "Bloquear números inválidos",
    sub: "Formato de teléfono no válido",
  },
  {
    key: "detectarSpam",
    label: "Detectar spam automático",
    sub: "Mensajes tipo bot o repetidos",
  },
  {
    key: "filtrarDuplicados",
    label: "Filtrar duplicados",
    sub: "Mismo contacto en 48hs",
  },
  {
    key: "ignorarSinMensaje",
    label: "Ignorar sin mensaje",
    sub: "Lead sin texto de consulta",
  },
];

interface WeightSliderProps {
  id: string;
  label: string;
  emoji: string;
  value: number;
  valueColor: string;
  onChange: (value: number) => void;
}

function WeightSlider({
  id,
  label,
  emoji,
  value,
  valueColor,
  onChange,
}: WeightSliderProps) {
  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[12px] font-semibold text-neutral-grey-800 flex items-center gap-1"
        >
          <span aria-hidden="true">{emoji}</span>
          {label}
        </label>
        <span className={`text-[12px] font-bold ${valueColor}`}>{value}%</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} (porcentaje)`}
        className="w-full accent-brand-primary-500"
      />
    </div>
  );
}

interface FilterToggleRowProps {
  label: string;
  sub: string;
  checked: boolean;
  onToggle: () => void;
}

function FilterToggleRow({
  label,
  sub,
  checked,
  onToggle,
}: FilterToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-grey-100 last:border-b-0">
      <div className="min-w-0 pr-3">
        <div className="text-[12px] font-semibold text-neutral-grey-800">
          {label}
        </div>
        <div className="text-[11px] text-neutral-grey-500">{sub}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 items-center rounded-pill transition-colors ${
          checked ? "bg-brand-primary-500" : "bg-neutral-grey-300"
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-low transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export interface CriteriaViewProps {
  /** Override del baseline (útil para tests). */
  initialState?: CriteriaState;
}

export default function CriteriaView({ initialState }: CriteriaViewProps) {
  // Hidratación: priorizar override de tests > localStorage > defaults.
  const [state, setState] = useState<CriteriaState>(() => {
    if (initialState) return initialState;
    const stored = loadCriteria();
    return stored ?? cloneDefaults();
  });
  const [toastOpen, setToastOpen] = useState(false);

  function updateContacto(
    key: keyof CriteriaState["contacto"],
    next: CriterionConfig,
  ) {
    setState((prev) => ({
      ...prev,
      contacto: { ...prev.contacto, [key]: next },
    }));
  }

  function updatePropiedad(
    key: keyof CriteriaState["propiedadFuente"],
    next: CriterionConfig,
  ) {
    setState((prev) => ({
      ...prev,
      propiedadFuente: { ...prev.propiedadFuente, [key]: next },
    }));
  }

  function updateMensaje(
    key: keyof CriteriaState["mensaje"],
    next: CriterionConfig,
  ) {
    setState((prev) => ({
      ...prev,
      mensaje: { ...prev.mensaje, [key]: next },
    }));
  }

  function updatePeso(
    key: keyof CriteriaState["pesos"],
    value: number,
  ) {
    setState((prev) => ({
      ...prev,
      pesos: { ...prev.pesos, [key]: value },
    }));
  }

  function toggleFiltro(key: keyof CriteriaState["filtrosAutomaticos"]) {
    setState((prev) => ({
      ...prev,
      filtrosAutomaticos: {
        ...prev.filtrosAutomaticos,
        [key]: !prev.filtrosAutomaticos[key],
      },
    }));
  }

  function addKeyword(variant: "positivas" | "negativas", item: string) {
    setState((prev) => {
      const current = prev.keywords[variant];
      // Dedup case-insensitive (item ya viene en lowercase).
      if (current.some((k) => k.toLowerCase() === item.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        keywords: {
          ...prev.keywords,
          [variant]: [...current, item],
        },
      };
    });
  }

  function removeKeyword(variant: "positivas" | "negativas", index: number) {
    setState((prev) => ({
      ...prev,
      keywords: {
        ...prev.keywords,
        [variant]: prev.keywords[variant].filter((_, i) => i !== index),
      },
    }));
  }

  function handleReset() {
    setState(cloneDefaults());
  }

  function handleSave() {
    saveCriteria(state);
    setToastOpen(true);
  }

  const totalPesos =
    state.pesos.trust + state.pesos.conversion + state.pesos.urgency;

  return (
    <div
      data-testid="criteria-view"
      className="px-6 py-6 space-y-6 overflow-y-auto h-full"
    >
      {/* Banner azul superior (AC1) */}
      <div
        role="note"
        data-testid="criteria-info-band"
        className="flex items-start gap-2 rounded-card bg-feedback-blue-500-15 border border-feedback-blue-500 p-4 text-[13px] text-feedback-blue-600"
      >
        <span aria-hidden="true" className="text-[14px] leading-none mt-[1px]">
          ℹ
        </span>
        <span>
          Los cambios se aplican automáticamente a todos los leads pendientes.
          Los scores se recalculan al guardar.
        </span>
      </div>

      {/* Layout 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-6" data-testid="criteria-col-left">
          <CriteriaSection
            title="Datos de contacto"
            testId="section-contacto"
          >
            {CONTACTO_ROWS.map((row) => (
              <CriterionRow
                key={row.key}
                label={row.label}
                description={row.description}
                config={state.contacto[row.key]}
                onChange={(next) => updateContacto(row.key, next)}
              />
            ))}
          </CriteriaSection>

          <CriteriaSection
            title="Propiedad y fuente"
            testId="section-propiedad"
          >
            {PROPIEDAD_ROWS.map((row) => (
              <CriterionRow
                key={row.key}
                label={row.label}
                description={row.description}
                config={state.propiedadFuente[row.key]}
                onChange={(next) => updatePropiedad(row.key, next)}
              />
            ))}
          </CriteriaSection>

          <CriteriaSection
            title="Pesos de dimensiones"
            intro="Distribuí el 100% entre las tres dimensiones"
            testId="section-pesos"
          >
            <WeightSlider
              id="crit-w-trust"
              label="Trust Score"
              emoji="🔒"
              value={state.pesos.trust}
              valueColor="text-brand-primary-500"
              onChange={(v) => updatePeso("trust", v)}
            />
            <WeightSlider
              id="crit-w-conv"
              label="Conversión"
              emoji="🎯"
              value={state.pesos.conversion}
              valueColor="text-feedback-green-500"
              onChange={(v) => updatePeso("conversion", v)}
            />
            <WeightSlider
              id="crit-w-urg"
              label="Urgencia"
              emoji="⚡"
              value={state.pesos.urgency}
              valueColor="text-feedback-yellow-500"
              onChange={(v) => updatePeso("urgency", v)}
            />
            <div
              className="text-[11px] text-neutral-grey-500 mt-1"
              data-testid="criteria-pesos-total"
            >
              Total: {totalPesos}%
            </div>
          </CriteriaSection>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6" data-testid="criteria-col-right">
          <CriteriaSection title="Mensaje" testId="section-mensaje">
            {MENSAJE_ROWS.map((row) => (
              <CriterionRow
                key={row.key}
                label={row.label}
                description={row.description}
                config={state.mensaje[row.key]}
                onChange={(next) => updateMensaje(row.key, next)}
              />
            ))}

            <KeywordsList
              title="Palabras clave positivas"
              variant="positive"
              items={state.keywords.positivas}
              onAdd={(item) => addKeyword("positivas", item)}
              onRemove={(idx) => removeKeyword("positivas", idx)}
            />

            <KeywordsList
              title="Palabras clave negativas"
              variant="negative"
              items={state.keywords.negativas}
              onAdd={(item) => addKeyword("negativas", item)}
              onRemove={(idx) => removeKeyword("negativas", idx)}
            />
          </CriteriaSection>

          <CriteriaSection
            title="Filtros automáticos"
            testId="section-filtros"
          >
            {FILTROS_ROWS.map((row) => (
              <FilterToggleRow
                key={row.key}
                label={row.label}
                sub={row.sub}
                checked={state.filtrosAutomaticos[row.key]}
                onToggle={() => toggleFiltro(row.key)}
              />
            ))}
          </CriteriaSection>

          <div className="flex items-center justify-end gap-3">
            <div
              className="min-h-[28px] mr-auto"
              data-testid="criteria-view-toast-slot"
            >
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
              onClick={handleReset}
              data-testid="criteria-reset-btn"
              className="px-4 py-2 rounded-button border border-neutral-grey-300 text-neutral-grey-700 text-[12px] font-semibold hover:bg-surface-low transition-colors"
            >
              Restablecer defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              data-testid="criteria-view-save-btn"
              className="px-4 py-2 rounded-button bg-brand-primary-500 text-white text-[12px] font-semibold hover:bg-brand-primary-700 transition-colors"
            >
              Guardar criterios →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
