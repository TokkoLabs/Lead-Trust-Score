import type { CriteriaState } from "./criteriaDefaults";

/**
 * criteriaStorage — wrapper defensivo sobre `localStorage` para la feature 15.
 *
 * `localStorage` puede no estar disponible (SSR, jsdom restringido, modo
 * privado, exceeded quota). Por eso TODA operación va dentro de try/catch
 * y devuelve un valor seguro:
 *  - `loadCriteria()` retorna `null` si no hay nada guardado o si parsear
 *    falla. Quien consume usa `loadCriteria() ?? cloneDefaults()`.
 *  - `saveCriteria()` traga el error silenciosamente para no romper la UI.
 *  - `clearCriteria()` borra la clave.
 *
 * La clave es `criteria_v1` (versionada para futuros cambios de shape).
 */

export const STORAGE_KEY = "criteria_v1";

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadCriteria(): CriteriaState | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CriteriaState;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCriteria(state: CriteriaState): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota excedido o storage no disponible — no rompemos la UI.
  }
}

export function clearCriteria(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
