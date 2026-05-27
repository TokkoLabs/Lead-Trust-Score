import React, { useState } from "react";

/**
 * KeywordsList — lista editable de palabras clave (feature 15).
 *
 * Reproduce `.kw-section` del HTML target (líneas 862-873):
 *   - Header: título.
 *   - Lista de chips removibles (× a la derecha del chip).
 *   - Input + botón "+ Agregar"; ENTER en el input también agrega.
 *
 * Variantes:
 *   - `positive` (verde): bg-feedback-green-500-15, border verde,
 *     texto verde.
 *   - `negative` (rojo):  bg-brand-primary-500-15, border rojo,
 *     texto rojo.
 *
 * Reglas de agregado:
 *   - input vacío → no agrega.
 *   - lowercase + trim antes de comparar.
 *   - dedup: si la palabra ya existe (case-insensitive) NO se duplica.
 *   - se preserva el orden de inserción.
 *
 * El componente es controlado: el padre maneja `items` y recibe
 * `onAdd(item)` / `onRemove(index)`.
 */

export type KeywordsVariant = "positive" | "negative";

export interface KeywordsListProps {
  title: string;
  variant: KeywordsVariant;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  /** Texto bajo el header (default según variante). */
  description?: string;
}

const VARIANT_CHIP: Record<KeywordsVariant, string> = {
  positive:
    "bg-feedback-green-500-15 border-feedback-green-500 text-feedback-green-500",
  negative:
    "bg-brand-primary-500-15 border-brand-primary-500 text-brand-primary-500",
};

const VARIANT_BTN: Record<KeywordsVariant, string> = {
  positive: "bg-feedback-green-500 hover:opacity-90 text-white",
  negative: "bg-brand-primary-500 hover:bg-brand-primary-700 text-white",
};

const VARIANT_DEFAULT_DESC: Record<KeywordsVariant, string> = {
  positive: "El mensaje contiene estas palabras — suma puntos",
  negative: "Penaliza si el mensaje las contiene",
};

export default function KeywordsList({
  title,
  variant,
  items,
  onAdd,
  onRemove,
  description,
}: KeywordsListProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const cleaned = draft.trim().toLowerCase();
    if (!cleaned) return;
    setDraft("");
    onAdd(cleaned);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    }
  }

  const chipCls = VARIANT_CHIP[variant];
  const btnCls = VARIANT_BTN[variant];
  const desc = description ?? VARIANT_DEFAULT_DESC[variant];

  return (
    <section
      aria-label={title}
      data-variant={variant}
      data-testid={`kw-list-${variant}`}
      className="mt-4"
    >
      <div className="text-[12px] font-semibold text-neutral-grey-800">
        {title}
      </div>
      <div className="text-[11px] text-neutral-grey-500 mb-2">{desc}</div>

      <ul
        role="list"
        aria-label={`Lista ${title}`}
        className="flex flex-wrap gap-2 mb-3"
      >
        {items.map((kw, idx) => (
          <li
            key={`${kw}-${idx}`}
            data-testid={`kw-chip-${variant}-${kw}`}
            className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-chip border px-2 py-1 ${chipCls}`}
          >
            <span>{kw}</span>
            <button
              type="button"
              aria-label={`Eliminar ${kw}`}
              onClick={() => onRemove(idx)}
              className="ml-1 leading-none text-[12px] font-bold opacity-80 hover:opacity-100"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="agregar palabra…"
          aria-label={`Agregar palabra a ${title}`}
          data-testid={`kw-input-${variant}`}
          className="flex-1 text-[12px] text-neutral-grey-800 bg-surface-ground border border-neutral-grey-200 rounded-chip px-3 py-2 focus:outline-none focus:border-brand-secondary-500"
        />
        <button
          type="button"
          onClick={commit}
          data-testid={`kw-add-${variant}`}
          className={`text-[12px] font-semibold rounded-chip px-3 py-2 ${btnCls}`}
        >
          Agregar
        </button>
      </div>
    </section>
  );
}
