import React from "react";

/**
 * ChannelsTab — sub-tab "Canales" de CriteriaCard (feature 13).
 *
 * 7 channel tags toggleables (aria-pressed) + 2 boost sliders.
 *
 * Labels EXACTOS (HTML target lineas 787-791):
 *  Zonaprop, Argenprop, WhatsApp, Mail, Mercadolibre, Chat web, Navent.
 *
 * Boost sliders:
 *  - WhatsApp ×N (default 1.3)
 *  - Mail ×N (default 1.1)
 * El slider expone valores 1.0×–2.0× en steps de 0.1.
 */

export type ChannelName =
  | "Zonaprop"
  | "Argenprop"
  | "WhatsApp"
  | "Mail"
  | "Mercadolibre"
  | "Chat web"
  | "Navent";

export const CHANNEL_NAMES: ChannelName[] = [
  "Zonaprop",
  "Argenprop",
  "WhatsApp",
  "Mail",
  "Mercadolibre",
  "Chat web",
  "Navent",
];

export interface Boosts {
  whatsapp: number;
  mail: number;
}

export type ChannelsState = Record<ChannelName, boolean>;

export interface ChannelsTabProps {
  channels: ChannelsState;
  boosts: Boosts;
  onChannelToggle: (name: ChannelName) => void;
  onBoostChange: (key: keyof Boosts, value: number) => void;
}

function formatBoost(value: number): string {
  return `${value.toFixed(1)}×`;
}

export default function ChannelsTab({
  channels,
  boosts,
  onChannelToggle,
  onBoostChange,
}: ChannelsTabProps) {
  return (
    <div data-testid="channels-tab">
      <p className="text-[11px] text-neutral-grey-500 mb-3">
        Activá o desactivá fuentes de leads
      </p>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Canales activos"
      >
        {CHANNEL_NAMES.map((name) => {
          const on = channels[name];
          return (
            <button
              key={name}
              type="button"
              aria-pressed={on}
              data-channel={name}
              data-state={on ? "on" : "off"}
              onClick={() => onChannelToggle(name)}
              className={`channel-tag text-[11px] font-semibold px-3 py-1.5 rounded-pill border transition-colors ${
                on
                  ? "on bg-brand-primary-500 text-white border-brand-primary-500"
                  : "bg-neutral-grey-100 text-neutral-grey-600 border-neutral-grey-300"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-grey-500 mt-4 mb-2">
        Boost por canal
      </p>

      <div className="flex flex-col gap-2">
        <BoostSliderRow
          id="cs-boost-whatsapp"
          label="WhatsApp"
          valueClass="text-feedback-green-500"
          value={boosts.whatsapp}
          onChange={(v) => onBoostChange("whatsapp", v)}
        />
        <BoostSliderRow
          id="cs-boost-mail"
          label="Mail"
          valueClass="text-feedback-blue-500"
          value={boosts.mail}
          onChange={(v) => onBoostChange("mail", v)}
        />
      </div>
    </div>
  );
}

interface BoostSliderRowProps {
  id: string;
  label: string;
  value: number;
  valueClass: string;
  onChange: (value: number) => void;
}

function BoostSliderRow({
  id,
  label,
  value,
  valueClass,
  onChange,
}: BoostSliderRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[12px] font-semibold text-neutral-grey-800"
        >
          {label}
        </label>
        <span
          data-testid={`boost-${label.toLowerCase()}-value`}
          className={`text-[12px] font-bold ${valueClass}`}
        >
          {formatBoost(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={10}
        max={20}
        step={1}
        value={Math.round(value * 10)}
        onChange={(e) => onChange(Number(e.target.value) / 10)}
        aria-label={`Boost ${label}`}
        className="w-full accent-brand-primary-500"
      />
    </div>
  );
}
