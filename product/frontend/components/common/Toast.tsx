import React, { useEffect } from "react";

/**
 * Toast — feedback visual mínimo, accesible.
 *
 * Reglas:
 *  - role="status" + aria-live="polite" para que lectores de pantalla anuncien.
 *  - Auto-dismiss tras `durationMs` (default 2500ms) llamando `onDismiss`.
 *  - Cleanup del timer en `useEffect` para evitar leaks si el componente
 *    se desmonta antes del timeout.
 *  - Tres variants: success (green), error (red), info (blue) usando tokens
 *    Tokko (sin hex).
 *
 * Uso típico:
 *   {showToast && (
 *     <Toast message="Guardado" onDismiss={() => setShowToast(false)} />
 *   )}
 */

export type ToastVariant = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  /** Duración antes del dismiss automático en ms. Default 2500. */
  durationMs?: number;
  onDismiss: () => void;
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success:
    "bg-feedback-green-500-15 text-feedback-green-500 border-feedback-green-500",
  error:
    "bg-brand-primary-500-15 text-brand-primary-500 border-brand-primary-500",
  info: "bg-feedback-blue-500-15 text-feedback-blue-500 border-feedback-blue-500",
};

const VARIANT_ICON: Record<ToastVariant, string> = {
  success: "✓",
  error: "✕",
  info: "ⓘ",
};

export default function Toast({
  message,
  variant = "success",
  durationMs = 2500,
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    const id = window.setTimeout(() => {
      onDismiss();
    }, durationMs);
    return () => window.clearTimeout(id);
  }, [durationMs, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      data-toast-variant={variant}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-chip border shadow-low text-body-sm font-semibold ${VARIANT_CLASSES[variant]}`}
    >
      <span aria-hidden="true" className="text-[14px] leading-none">
        {VARIANT_ICON[variant]}
      </span>
      <span>{message}</span>
    </div>
  );
}
