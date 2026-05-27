import type { Lead } from "../../types/lead";
import { computeLocalScore } from "./scoreUtils";

/**
 * dashboardMetrics — funciones puras para alimentar las KPI cards y los
 * gráficos del Dashboard. No tocan estado, no hacen fetch.
 *
 * Acceptance feature 11 (dashboard_kpis_and_charts):
 * - AC4: Las 4 KPI cards y ambos gráficos derivan sus valores de los leads
 *   del estado React (combinando computeLocalScore con aiScores y is_spam).
 * - AC5: computeKpis(leads, analyses) y computeDailyBuckets(leads) puras
 *   y cubiertas por tests.
 */

export interface Kpis {
  /** Total de leads en el estado actual. */
  total: number;
  /** Promedio (entero) del trust_score efectivo de todos los leads. */
  scorePromedio: number;
  /** Cantidad de leads con score efectivo ≥ 75 (excluyendo spam). */
  altaCalidad: number;
  /** Cantidad de leads marcados como spam por la IA. */
  descartados: number;
}

export interface DailyBucket {
  /** Fecha YYYY-MM-DD (UTC) del bucket. */
  date: string;
  /** Etiqueta corta para el eje X del bar chart (Lun, Mar, …, Hoy). */
  label: string;
  /** Leads con score efectivo ≥ 75 (excluye spam). */
  alta: number;
  /** Leads con score efectivo entre 40 y 74 inclusive. */
  media: number;
  /** Leads con score efectivo < 40 ó marcados como spam. */
  baja: number;
}

export type AnalysisLike = { trust_score: number; is_spam: boolean };
export type AnalysisMap = Record<string, AnalysisLike>;

/** Etiquetas Lun..Hoy alineadas con el HTML target (línea 1023). */
const WEEKDAY_LABELS_ES: readonly string[] = [
  "Dom",
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
];

/**
 * Resuelve el score efectivo y la flag de spam de un lead, combinando:
 *   1. aiScore desde `analyses[lead.id]` si existe.
 *   2. Fallback: `computeLocalScore(lead).trust_score` y `is_spam = false`.
 */
function resolveLeadScore(
  lead: Lead,
  analyses?: AnalysisMap,
): { trust_score: number; is_spam: boolean } {
  const fromAi = analyses?.[lead.id];
  if (fromAi) {
    return { trust_score: fromAi.trust_score, is_spam: fromAi.is_spam };
  }
  return {
    trust_score: computeLocalScore(lead).trust_score,
    is_spam: false,
  };
}

/**
 * Clasifica un score+flag en uno de tres tiers usados por gráficos y KPIs.
 *
 * Reglas (del briefing):
 * - is_spam=true → "baja" sin importar score.
 * - score ≥ 75 → "alta".
 * - 40 ≤ score < 75 → "media".
 * - score < 40 → "baja".
 */
export function classifyTier(
  trust_score: number,
  is_spam: boolean,
): "alta" | "media" | "baja" {
  if (is_spam) return "baja";
  if (trust_score >= 75) return "alta";
  if (trust_score >= 40) return "media";
  return "baja";
}

/**
 * Calcula los 4 KPIs del header del Dashboard:
 *   total, scorePromedio, altaCalidad (≥75 y no spam), descartados (spam).
 *
 * `analyses` puede omitirse — en ese caso se usa computeLocalScore como
 * fallback y se asume is_spam=false para todos los leads.
 */
export function computeKpis(leads: Lead[], analyses?: AnalysisMap): Kpis {
  const total = leads.length;
  if (total === 0) {
    return { total: 0, scorePromedio: 0, altaCalidad: 0, descartados: 0 };
  }

  let sumScores = 0;
  let altaCalidad = 0;
  let descartados = 0;

  for (const lead of leads) {
    const { trust_score, is_spam } = resolveLeadScore(lead, analyses);
    sumScores += trust_score;
    if (is_spam) descartados += 1;
    else if (trust_score >= 75) altaCalidad += 1;
  }

  const scorePromedio = Math.round(sumScores / total);
  return { total, scorePromedio, altaCalidad, descartados };
}

/**
 * Construye 7 buckets diarios (día más antiguo → hoy) con counts por tier.
 *
 * - Ignora leads sin `created_at` o con created_at fuera de la ventana de 7 días.
 * - Si `now` no se pasa, usa `new Date()` (sirve para tests deterministas).
 * - `label` se deriva del día de la semana en español; el bucket que cae
 *   exactamente en `now` (hoy UTC) lleva la etiqueta "Hoy".
 */
export function computeDailyBuckets(
  leads: Lead[],
  analyses?: AnalysisMap,
  now: Date = new Date(),
): DailyBucket[] {
  // Construimos 7 fechas UTC desde hoy-6 hasta hoy (inclusive).
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const buckets: DailyBucket[] = [];
  const indexByDate = new Map<string, number>();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const d = new Date(todayUTC);
    d.setUTCDate(d.getUTCDate() - offset);
    const iso = formatISODate(d);
    const isToday = offset === 0;
    buckets.push({
      date: iso,
      label: isToday ? "Hoy" : WEEKDAY_LABELS_ES[d.getUTCDay()],
      alta: 0,
      media: 0,
      baja: 0,
    });
    indexByDate.set(iso, buckets.length - 1);
  }

  for (const lead of leads) {
    if (!lead.created_at) continue;
    const date = new Date(lead.created_at);
    if (Number.isNaN(date.getTime())) continue;
    const iso = formatISODate(date);
    const idx = indexByDate.get(iso);
    if (idx === undefined) continue;
    const { trust_score, is_spam } = resolveLeadScore(lead, analyses);
    const tier = classifyTier(trust_score, is_spam);
    buckets[idx][tier] += 1;
  }

  return buckets;
}

/** Devuelve YYYY-MM-DD en UTC. */
function formatISODate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
