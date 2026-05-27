/**
 * tests/backend/test_data.ts
 * Suite de validacion de integridad de los datasets mock.
 * Cubre: R1-R3, R7-R9, R13-R18
 *
 * Ejecutar con: ts-node tests/backend/test_data.ts
 * Requiere Node.js nativo; sin frameworks externos.
 */

import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

const LEADS_PATH = path.resolve(
  __dirname,
  "../../product/backend/data/leads_mock.json"
);
const PROPERTIES_PATH = path.resolve(
  __dirname,
  "../../product/backend/data/properties_mock.json"
);

const TIPO_PROPIEDAD_VALUES = [
  "departamento",
  "casa",
  "ph",
  "local_comercial",
  "oficina",
  null,
] as const;

const TIPO_VALUES = [
  "departamento",
  "casa",
  "ph",
  "local_comercial",
  "oficina",
] as const;

// --- Tests ---

function parse_leads(): any[] {
  const raw = fs.readFileSync(LEADS_PATH, "utf-8");
  const leads = JSON.parse(raw);
  console.log("[OK] parse_leads — leads_mock.json parsea correctamente");
  return leads;
}

function parse_properties(): any[] {
  const raw = fs.readFileSync(PROPERTIES_PATH, "utf-8");
  const properties = JSON.parse(raw);
  console.log(
    "[OK] parse_properties — properties_mock.json parsea correctamente"
  );
  return properties;
}

function leads_schema(leads: any[]): void {
  const required = [
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
        `leads_schema: lead '${lead.id}' missing required field '${field}'`
      );
    }
    assert.ok(
      Array.isArray(lead.property_ids),
      `leads_schema: lead '${lead.id}' property_ids debe ser un array`
    );
    assert.ok(
      lead.property_ids.length >= 1,
      `leads_schema: lead '${lead.id}' property_ids debe tener al menos un elemento`
    );
  }
  console.log("[OK] leads_schema — todos los campos requeridos presentes en cada lead");
}

function properties_schema(properties: any[]): void {
  const required = [
    "id",
    "titulo",
    "precio_usd",
    "zona",
    "tipo",
    "dormitorios",
    "descripcion",
  ];
  for (const prop of properties) {
    for (const field of required) {
      assert.ok(
        field in prop,
        `properties_schema: propiedad '${prop.id}' missing required field '${field}'`
      );
    }
    assert.ok(
      typeof prop.precio_usd === "number" && prop.precio_usd > 0,
      `properties_schema: propiedad '${prop.id}' precio_usd debe ser numero positivo mayor a 0`
    );
  }
  console.log(
    "[OK] properties_schema — todos los campos requeridos presentes en cada propiedad"
  );
}

function cross_references(leads: any[], properties: any[]): void {
  const propertySet = new Set<string>(properties.map((p: any) => p.id));
  for (const lead of leads) {
    for (const pid of lead.property_ids) {
      assert.ok(
        propertySet.has(pid),
        `cross_references: lead '${lead.id}' tiene property_id huerfano '${pid}' que no existe en properties_mock.json`
      );
    }
  }
  console.log(
    "[OK] cross_references — todos los property_ids en leads referencian IDs validos"
  );
}

function leads_count(leads: any[]): void {
  assert.ok(
    leads.length >= 15,
    `leads_count: se esperaban >= 15 leads, se encontraron ${leads.length}`
  );
  console.log(`[OK] leads_count — ${leads.length} leads (>= 15)`);
}

function properties_count(properties: any[]): void {
  assert.ok(
    properties.length >= 10,
    `properties_count: se esperaban >= 10 propiedades, se encontraron ${properties.length}`
  );
  console.log(`[OK] properties_count — ${properties.length} propiedades (>= 10)`);
}

function tipo_enum_leads(leads: any[]): void {
  for (const lead of leads) {
    assert.ok(
      (TIPO_PROPIEDAD_VALUES as ReadonlyArray<string | null>).includes(
        lead.tipo_propiedad
      ),
      `tipo_enum_leads: lead '${lead.id}' tiene tipo_propiedad invalido: '${lead.tipo_propiedad}'`
    );
  }
  console.log(
    "[OK] tipo_enum_leads — todos los tipo_propiedad son valores permitidos o null"
  );
}

function tipo_enum_properties(properties: any[]): void {
  for (const prop of properties) {
    assert.ok(
      (TIPO_VALUES as ReadonlyArray<string>).includes(prop.tipo),
      `tipo_enum_properties: propiedad '${prop.id}' tiene tipo invalido: '${prop.tipo}'`
    );
  }
  console.log(
    "[OK] tipo_enum_properties — todos los tipo son valores permitidos"
  );
}

function main(): void {
  console.log("=== test_data: iniciando validacion de datasets ===\n");

  const leads = parse_leads();
  const properties = parse_properties();

  leads_schema(leads);
  properties_schema(properties);
  cross_references(leads, properties);
  leads_count(leads);
  properties_count(properties);
  tipo_enum_leads(leads);
  tipo_enum_properties(properties);

  console.log("\n=== TODOS LOS TESTS PASARON ===");
}

main();
