/**
 * tests/backend/test_lead_generators.ts
 * Suite de tests para el módulo product/backend/lib/leadGenerators.ts.
 * Cubre: R10, R11, R12, R13, R14, R15, R16, R17, R18.
 *
 * Ejecutar con: ts-node tests/backend/test_lead_generators.ts
 * Requiere Node.js nativo; sin frameworks externos.
 */

import * as assert from "assert";
import {
  ZONAS_POOL,
  PRESUPUESTOS_POOL,
  MENSAJES_INTERESTED_POOL,
  MENSAJES_SPAM_POOL,
  TIPOS_PROPIEDAD_POOL,
  SOURCES_POOL,
  ESTADOS_POOL,
  AGENCIAS_POOL,
  DIRECCIONES_POOL,
  pickRandom,
  generateRandomLead,
} from "../../product/backend/lib/leadGenerators";

// --- R10 ---
function test_module_exports(): void {
  const exports_ = {
    ZONAS_POOL,
    PRESUPUESTOS_POOL,
    MENSAJES_INTERESTED_POOL,
    MENSAJES_SPAM_POOL,
    TIPOS_PROPIEDAD_POOL,
    SOURCES_POOL,
    ESTADOS_POOL,
    AGENCIAS_POOL,
    DIRECCIONES_POOL,
    pickRandom,
    generateRandomLead,
  };
  for (const [name, value] of Object.entries(exports_)) {
    assert.ok(value, `test_module_exports: '${name}' es falsy`);
  }
  // Los pools son arrays
  const pools: [string, readonly unknown[]][] = [
    ["ZONAS_POOL", ZONAS_POOL],
    ["PRESUPUESTOS_POOL", PRESUPUESTOS_POOL],
    ["MENSAJES_INTERESTED_POOL", MENSAJES_INTERESTED_POOL],
    ["MENSAJES_SPAM_POOL", MENSAJES_SPAM_POOL],
    ["TIPOS_PROPIEDAD_POOL", TIPOS_PROPIEDAD_POOL],
    ["SOURCES_POOL", SOURCES_POOL],
    ["ESTADOS_POOL", ESTADOS_POOL],
    ["AGENCIAS_POOL", AGENCIAS_POOL],
    ["DIRECCIONES_POOL", DIRECCIONES_POOL],
  ];
  for (const [name, pool] of pools) {
    assert.ok(Array.isArray(pool), `test_module_exports: '${name}' no es array`);
  }
  assert.strictEqual(typeof pickRandom, "function");
  assert.strictEqual(typeof generateRandomLead, "function");
  console.log("[OK] test_module_exports — 11 símbolos exportados");
}

// --- R11 ---
function test_pool_sizes(): void {
  assert.ok(MENSAJES_INTERESTED_POOL.length >= 10, `interested: ${MENSAJES_INTERESTED_POOL.length}`);
  assert.ok(MENSAJES_SPAM_POOL.length >= 6, `spam: ${MENSAJES_SPAM_POOL.length}`);
  assert.ok(AGENCIAS_POOL.length >= 8, `agencias: ${AGENCIAS_POOL.length}`);
  assert.ok(DIRECCIONES_POOL.length >= 10, `direcciones: ${DIRECCIONES_POOL.length}`);
  assert.ok(ZONAS_POOL.length >= 10, `zonas: ${ZONAS_POOL.length}`);
  assert.strictEqual(SOURCES_POOL.length, 7, `sources length=${SOURCES_POOL.length}`);
  assert.strictEqual(ESTADOS_POOL.length, 4, `estados length=${ESTADOS_POOL.length}`);
  console.log(
    `[OK] test_pool_sizes — interested=${MENSAJES_INTERESTED_POOL.length} spam=${MENSAJES_SPAM_POOL.length} agencias=${AGENCIAS_POOL.length} direcciones=${DIRECCIONES_POOL.length} zonas=${ZONAS_POOL.length} sources=${SOURCES_POOL.length} estados=${ESTADOS_POOL.length}`
  );
}

// --- R12 ---
function test_pick_random_lower_bound(): void {
  const result = pickRandom(["a", "b", "c"], () => 0);
  assert.strictEqual(result, "a", `pickRandom con () => 0 devolvió '${result}'`);
  console.log("[OK] test_pick_random_lower_bound — pickRandom(pool, () => 0) === pool[0]");
}

// --- R13 ---
function test_pick_random_upper_bound(): void {
  const result = pickRandom(["a", "b", "c"], () => 0.9999999);
  assert.strictEqual(result, "c", `pickRandom con () => 0.9999999 devolvió '${result}'`);
  console.log("[OK] test_pick_random_upper_bound — pickRandom(pool, () => 0.9999999) === pool[length-1]");
}

// --- R18 ---
function test_pick_random_no_rng_uses_math_random(): void {
  const pool = ["x", "y", "z"];
  // Sin segundo argumento — no debe lanzar y debe devolver un elemento del pool.
  for (let i = 0; i < 50; i++) {
    const r = pickRandom(pool);
    assert.ok(pool.includes(r), `pickRandom sin rng devolvió '${r}' fuera del pool`);
  }
  console.log("[OK] test_pick_random_no_rng_uses_math_random — sin rng, resultado ∈ pool en 50 corridas");
}

// --- R14 ---
function test_generate_lead_deterministic_zero(): void {
  const lead = generateRandomLead(() => 0);
  // id no vacío
  assert.ok(typeof lead.id === "string" && lead.id.length > 0, `id inválido: '${lead.id}'`);
  // mensaje ∈ interested ∪ spam (con rng=0 cae en interested, dado que 0 < 0.8)
  const allMensajes = [...MENSAJES_INTERESTED_POOL, ...MENSAJES_SPAM_POOL];
  assert.ok(allMensajes.includes(lead.mensaje), `mensaje no pertenece al pool combinado: '${lead.mensaje}'`);
  // telefono
  assert.ok(typeof lead.telefono === "string" && lead.telefono.length > 0, `telefono inválido`);
  // email
  assert.ok(typeof lead.email === "string" && lead.email.length > 0, `email inválido`);
  // zona ∈ ZONAS_POOL
  assert.ok((ZONAS_POOL as readonly string[]).includes(lead.zona), `zona no en pool: '${lead.zona}'`);
  // tipo_propiedad ∈ TIPOS_PROPIEDAD_POOL
  assert.ok(
    (TIPOS_PROPIEDAD_POOL as readonly (string | null)[]).includes(lead.tipo_propiedad),
    `tipo_propiedad inválido: '${lead.tipo_propiedad}'`
  );
  // presupuesto_usd >= 0
  assert.ok(typeof lead.presupuesto_usd === "number" && lead.presupuesto_usd >= 0, `presupuesto inválido`);
  // property_ids es array
  assert.ok(Array.isArray(lead.property_ids), `property_ids no es array`);
  // source
  assert.ok(lead.source !== undefined, `source ausente`);
  assert.ok((SOURCES_POOL as readonly string[]).includes(lead.source), `source no en pool: '${lead.source}'`);
  // estado
  assert.ok(lead.estado !== undefined, `estado ausente`);
  assert.ok((ESTADOS_POOL as readonly string[]).includes(lead.estado), `estado no en pool: '${lead.estado}'`);
  // created_at ISO 8601
  const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  assert.ok(typeof lead.created_at === "string" && iso.test(lead.created_at), `created_at no ISO: '${lead.created_at}'`);
  // agencia
  assert.ok(typeof lead.agencia === "string" && lead.agencia !== null, `agencia inválida: '${lead.agencia}'`);
  assert.ok((AGENCIAS_POOL as readonly string[]).includes(lead.agencia as string), `agencia no en pool`);
  // direccion_propiedad
  assert.ok(
    typeof lead.direccion_propiedad === "string" && lead.direccion_propiedad !== null,
    `direccion inválida`
  );
  assert.ok(
    (DIRECCIONES_POOL as readonly string[]).includes(lead.direccion_propiedad as string),
    `direccion no en pool`
  );
  console.log("[OK] test_generate_lead_deterministic_zero — Lead extendido completo");
}

// --- R15 ---
function test_generate_lead_different_rng_differs(): void {
  const a = generateRandomLead(() => 0);
  const b = generateRandomLead(() => 0.99);
  const allSame =
    a.zona === b.zona && a.source === b.source && a.mensaje === b.mensaje;
  assert.ok(
    !allSame,
    `test_generate_lead_different_rng_differs: zona/source/mensaje son simultáneamente iguales. a=${JSON.stringify({ z: a.zona, s: a.source, m: a.mensaje })} b=${JSON.stringify({ z: b.zona, s: b.source, m: b.mensaje })}`
  );
  console.log("[OK] test_generate_lead_different_rng_differs — al menos un campo difiere");
}

// --- R16 ---
function test_generate_lead_force_spam(): void {
  for (let i = 0; i < 10; i++) {
    const lead = generateRandomLead(Math.random, { forceType: "spam" });
    assert.ok(
      (MENSAJES_SPAM_POOL as readonly string[]).includes(lead.mensaje),
      `forceType spam: mensaje no en pool spam: '${lead.mensaje}'`
    );
  }
  console.log("[OK] test_generate_lead_force_spam — 10/10 mensajes ∈ MENSAJES_SPAM_POOL");
}

// --- R17 ---
function test_generate_lead_force_interested(): void {
  for (let i = 0; i < 10; i++) {
    const lead = generateRandomLead(Math.random, { forceType: "interested" });
    assert.ok(
      (MENSAJES_INTERESTED_POOL as readonly string[]).includes(lead.mensaje),
      `forceType interested: mensaje no en pool interested: '${lead.mensaje}'`
    );
  }
  console.log("[OK] test_generate_lead_force_interested — 10/10 mensajes ∈ MENSAJES_INTERESTED_POOL");
}

function main(): void {
  console.log("=== test_lead_generators: iniciando suite ===\n");
  test_module_exports();
  test_pool_sizes();
  test_pick_random_lower_bound();
  test_pick_random_upper_bound();
  test_pick_random_no_rng_uses_math_random();
  test_generate_lead_deterministic_zero();
  test_generate_lead_different_rng_differs();
  test_generate_lead_force_spam();
  test_generate_lead_force_interested();
  console.log("\n=== TODOS LOS TESTS PASARON ===");
}

main();
