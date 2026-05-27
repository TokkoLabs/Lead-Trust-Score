/**
 * tests/backend/test_data_extension.ts
 * Suite de validación de la extensión del mock de leads (feature 10).
 * Cubre: R3, R4, R5, R6, R7, R8, R9, R19, R20.
 *
 * Ejecutar con: ts-node tests/backend/test_data_extension.ts
 * Requiere Node.js nativo; sin frameworks externos.
 */

import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import type { Lead } from "../../product/types/lead";
import {
  SOURCES_POOL,
  ESTADOS_POOL,
} from "../../product/backend/lib/leadGenerators";

const LEADS_PATH = path.resolve(
  __dirname,
  "../../product/backend/data/leads_mock.json"
);

const ISO_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
const DAY_MS = 24 * 60 * 60 * 1000;

function loadLeads(): Lead[] {
  const raw = fs.readFileSync(LEADS_PATH, "utf-8");
  return JSON.parse(raw) as Lead[];
}

// --- R4 ---
function test_leads_count_min_30(leads: Lead[]): void {
  assert.ok(
    leads.length >= 30,
    `test_leads_count_min_30: se esperaban >= 30 leads, encontrados ${leads.length}`
  );
  console.log(`[OK] test_leads_count_min_30 — ${leads.length} leads`);
}

// --- R5 ---
function test_each_lead_has_valid_source(leads: Lead[]): void {
  for (const lead of leads) {
    assert.ok(
      lead.source !== undefined,
      `test_each_lead_has_valid_source: lead '${lead.id}' no tiene source`
    );
    assert.ok(
      (SOURCES_POOL as readonly string[]).includes(lead.source as string),
      `test_each_lead_has_valid_source: lead '${lead.id}' source invalido: '${lead.source}'`
    );
  }
  console.log("[OK] test_each_lead_has_valid_source — todos los leads tienen source en SOURCES_POOL");
}

// --- R6 ---
function test_each_lead_has_valid_estado(leads: Lead[]): void {
  for (const lead of leads) {
    assert.ok(
      lead.estado !== undefined,
      `test_each_lead_has_valid_estado: lead '${lead.id}' no tiene estado`
    );
    assert.ok(
      (ESTADOS_POOL as readonly string[]).includes(lead.estado as string),
      `test_each_lead_has_valid_estado: lead '${lead.id}' estado invalido: '${lead.estado}'`
    );
  }
  console.log("[OK] test_each_lead_has_valid_estado — todos los leads tienen estado en ESTADOS_POOL");
}

// --- R7 ---
function test_each_lead_has_iso_created_at(leads: Lead[]): void {
  for (const lead of leads) {
    assert.ok(
      typeof lead.created_at === "string",
      `test_each_lead_has_iso_created_at: lead '${lead.id}' created_at no es string`
    );
    const value = lead.created_at as string;
    assert.ok(
      ISO_REGEX.test(value),
      `test_each_lead_has_iso_created_at: lead '${lead.id}' created_at no matchea ISO 8601: '${value}'`
    );
    const parsed = new Date(value).valueOf();
    assert.ok(
      !Number.isNaN(parsed),
      `test_each_lead_has_iso_created_at: lead '${lead.id}' created_at no parseable: '${value}'`
    );
  }
  console.log("[OK] test_each_lead_has_iso_created_at — todos los created_at son ISO 8601 parseables");
}

// --- R8 ---
function test_created_at_within_30_days(leads: Lead[]): void {
  const now = Date.now();
  const thirtyDaysMs = 30 * DAY_MS;
  for (const lead of leads) {
    const ts = new Date(lead.created_at as string).valueOf();
    assert.ok(
      ts <= now,
      `test_created_at_within_30_days: lead '${lead.id}' created_at en el futuro: '${lead.created_at}'`
    );
    assert.ok(
      now - ts <= thirtyDaysMs,
      `test_created_at_within_30_days: lead '${lead.id}' created_at fuera de los últimos 30 días: '${lead.created_at}'`
    );
  }
  console.log("[OK] test_created_at_within_30_days — todos los created_at dentro de los últimos 30 días");
}

// --- R9 ---
function test_daily_distribution_min_5_days(leads: Lead[]): void {
  // Construir los últimos 7 días calendario UTC (D-6 .. D-0).
  const now = new Date();
  const todayKey = (() => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  })();

  // Construir set de los últimos 7 días en formato YYYY-MM-DD UTC
  const lastSevenDays: string[] = [];
  const todayUtc = new Date(`${todayKey}T00:00:00.000Z`).valueOf();
  for (let i = 6; i >= 0; i--) {
    const dayMs = todayUtc - i * DAY_MS;
    lastSevenDays.push(new Date(dayMs).toISOString().slice(0, 10));
  }

  // Bucketear leads por día UTC
  const buckets = new Map<string, number>();
  for (const lead of leads) {
    const key = (lead.created_at as string).slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  // Contar cuántos de los últimos 7 días tienen >=1 lead
  let daysWithLeads = 0;
  for (const day of lastSevenDays) {
    if ((buckets.get(day) ?? 0) >= 1) {
      daysWithLeads++;
    }
  }

  assert.ok(
    daysWithLeads >= 5,
    `test_daily_distribution_min_5_days: solo ${daysWithLeads}/7 días con >=1 lead; se requieren >=5. Days=${lastSevenDays.join(",")} buckets=${JSON.stringify(Object.fromEntries(buckets))}`
  );
  console.log(`[OK] test_daily_distribution_min_5_days — ${daysWithLeads}/7 días tienen >=1 lead`);
}

// --- R19 ---
function test_legacy_schema_still_valid(leads: Lead[]): void {
  const required: (keyof Lead)[] = [
    "id",
    "mensaje",
    "telefono",
    "email",
    "zona",
    "tipo_propiedad",
    "presupuesto_usd",
    "property_ids",
  ];
  for (const lead of leads) {
    for (const field of required) {
      assert.ok(
        field in lead,
        `test_legacy_schema_still_valid: lead '${lead.id}' falta campo '${String(field)}'`
      );
    }
    assert.ok(
      Array.isArray(lead.property_ids),
      `test_legacy_schema_still_valid: lead '${lead.id}' property_ids no es array`
    );
    assert.ok(
      lead.property_ids.length >= 1,
      `test_legacy_schema_still_valid: lead '${lead.id}' property_ids vacío`
    );
  }
  console.log("[OK] test_legacy_schema_still_valid — schema legacy intacto en todos los leads");
}

// --- R20 ---
function test_unique_ids(leads: Lead[]): void {
  const ids = leads.map((l) => l.id);
  const unique = new Set(ids);
  assert.strictEqual(
    unique.size,
    ids.length,
    `test_unique_ids: hay IDs duplicados. total=${ids.length} unicos=${unique.size}`
  );
  console.log(`[OK] test_unique_ids — ${unique.size} IDs únicos`);
}

function main(): void {
  console.log("=== test_data_extension: iniciando validacion ===\n");
  const leads = loadLeads();
  test_leads_count_min_30(leads);
  test_each_lead_has_valid_source(leads);
  test_each_lead_has_valid_estado(leads);
  test_each_lead_has_iso_created_at(leads);
  test_created_at_within_30_days(leads);
  test_daily_distribution_min_5_days(leads);
  test_legacy_schema_still_valid(leads);
  test_unique_ids(leads);
  console.log("\n=== TODOS LOS TESTS PASARON ===");
}

main();
