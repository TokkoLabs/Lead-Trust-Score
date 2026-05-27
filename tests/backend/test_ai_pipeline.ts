/**
 * tests/backend/test_ai_pipeline.ts
 * Suite de tests para el pipeline de analisis con Claude API.
 * NO realiza llamadas reales a la API: usa validateLeadAnalysis y
 * filterCandidateProperties directamente como funciones puras.
 *
 * Cubre: R4, R7, R8, R9, R10, R18, R19, R20
 *
 * Ejecutar con: ts-node tests/backend/test_ai_pipeline.ts
 */

// Patch de process.env antes de importar ai_analyser para evitar el throw de T5
process.env['ANTHROPIC_API_KEY'] = 'test-key-mock';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { validateLeadAnalysis, filterCandidateProperties } from '../../product/backend/services/ai_analyser';
import { AIResponseParseError } from '../../product/types/lead_analysis';
import type { Lead } from '../../product/types/lead';
import type { Property } from '../../product/types/property';

// --- Helpers ---

const LEADS_PATH = path.resolve(__dirname, '../../product/backend/data/leads_mock.json');
const PROPERTIES_PATH = path.resolve(__dirname, '../../product/backend/data/properties_mock.json');

const leads: Lead[] = JSON.parse(fs.readFileSync(LEADS_PATH, 'utf-8'));
const properties: Property[] = JSON.parse(fs.readFileSync(PROPERTIES_PATH, 'utf-8'));

function validLeadAnalysis() {
  return {
    trust_score: 80,
    conversion_score: 70,
    urgency_score: 60,
    is_spam: false,
    detected_intent: 'Compra de departamento en Palermo',
    suggested_action: 'Contactar en menos de 24hs con listado de departamentos disponibles.',
    ai_summary: 'El lead muestra alta confiabilidad con datos coherentes. Tiene presupuesto definido y urgencia moderada para cerrar. Es un prospecto calificado con buen potencial de conversion.',
    property_match_ids: ['prop-01', 'prop-07'],
  };
}

// --- T9: Tests de validateLeadAnalysis ---

function test_valid_response(): void {
  // R4, R8, R19: Objeto con todos los campos correctos no lanza error
  const result = validateLeadAnalysis(validLeadAnalysis());
  assert.strictEqual(result.trust_score, 80);
  assert.strictEqual(result.is_spam, false);
  assert.ok(Array.isArray(result.property_match_ids));
  console.log('[OK] test_valid_response — objeto completo valido no lanza error');
}

function test_missing_trust_score(): void {
  // R9, R20: Objeto sin trust_score lanza AIResponseParseError con mensaje correcto
  const obj = validLeadAnalysis() as Record<string, unknown>;
  delete obj['trust_score'];
  let caught = false;
  try {
    validateLeadAnalysis(obj);
  } catch (err) {
    caught = true;
    assert.ok(err instanceof AIResponseParseError, 'debe ser AIResponseParseError');
    assert.ok(
      (err as AIResponseParseError).message.includes('trust_score'),
      `mensaje debe mencionar trust_score, got: ${(err as AIResponseParseError).message}`
    );
    console.log(`[OK] test_missing_trust_score — error: ${(err as AIResponseParseError).message}`);
  }
  assert.ok(caught, 'test_missing_trust_score: debia lanzar error');
}

function test_missing_is_spam(): void {
  // R9, R20: Objeto sin is_spam lanza AIResponseParseError
  const obj = validLeadAnalysis() as Record<string, unknown>;
  delete obj['is_spam'];
  let caught = false;
  try {
    validateLeadAnalysis(obj);
  } catch (err) {
    caught = true;
    assert.ok(err instanceof AIResponseParseError, 'debe ser AIResponseParseError');
    assert.ok(
      (err as AIResponseParseError).message.includes('is_spam'),
      `mensaje debe mencionar is_spam, got: ${(err as AIResponseParseError).message}`
    );
    console.log(`[OK] test_missing_is_spam — error: ${(err as AIResponseParseError).message}`);
  }
  assert.ok(caught, 'test_missing_is_spam: debia lanzar error');
}

function test_missing_property_match_ids(): void {
  // R9, R20: Objeto sin property_match_ids lanza AIResponseParseError
  const obj = validLeadAnalysis() as Record<string, unknown>;
  delete obj['property_match_ids'];
  let caught = false;
  try {
    validateLeadAnalysis(obj);
  } catch (err) {
    caught = true;
    assert.ok(err instanceof AIResponseParseError, 'debe ser AIResponseParseError');
    assert.ok(
      (err as AIResponseParseError).message.includes('property_match_ids'),
      `mensaje debe mencionar property_match_ids, got: ${(err as AIResponseParseError).message}`
    );
    console.log(`[OK] test_missing_property_match_ids — error: ${(err as AIResponseParseError).message}`);
  }
  assert.ok(caught, 'test_missing_property_match_ids: debia lanzar error');
}

function test_invalid_json_string(): void {
  // R10: Cadena no-JSON lanza AIResponseParseError con mensaje correcto
  // Simulamos lo que hace analyseLeadWithAI con JSON.parse fallido pasando el objeto no-objeto
  let caught = false;
  try {
    // validateLeadAnalysis recibe un string (no objeto), debe detectar que no es un objeto valido
    validateLeadAnalysis('esto no es JSON' as unknown);
  } catch (err) {
    caught = true;
    assert.ok(err instanceof AIResponseParseError, 'debe ser AIResponseParseError');
    console.log(`[OK] test_invalid_json_string — error: ${(err as AIResponseParseError).message}`);
  }
  assert.ok(caught, 'test_invalid_json_string: debia lanzar error');
}

function test_score_out_of_range(): void {
  // R9: trust_score: 150 lanza AIResponseParseError
  const obj = validLeadAnalysis() as Record<string, unknown>;
  obj['trust_score'] = 150;
  let caught = false;
  try {
    validateLeadAnalysis(obj);
  } catch (err) {
    caught = true;
    assert.ok(err instanceof AIResponseParseError, 'debe ser AIResponseParseError');
    assert.ok(
      (err as AIResponseParseError).message.includes('out of range'),
      `mensaje debe indicar out of range, got: ${(err as AIResponseParseError).message}`
    );
    console.log(`[OK] test_score_out_of_range — error: ${(err as AIResponseParseError).message}`);
  }
  assert.ok(caught, 'test_score_out_of_range: debia lanzar error');
}

// --- T10: Tests de filterCandidateProperties ---

function test_filter_by_zona(): void {
  // R7: filterCandidateProperties devuelve solo propiedades de la zona del lead (y del tipo)
  const lead = leads.find((l) => l.id === 'lead-01')!; // zona: Palermo, tipo: departamento
  const result = filterCandidateProperties(lead, properties);

  // Todas deben ser de zona Palermo O tipo departamento
  for (const prop of result) {
    const matchesZona = prop.zona === lead.zona;
    const matchesTipo = prop.tipo === lead.tipo_propiedad;
    assert.ok(
      matchesZona || matchesTipo,
      `test_filter_by_zona: propiedad ${prop.id} no coincide por zona ni tipo`
    );
  }

  // Debe incluir al menos las de zona Palermo
  const palermo = properties.filter((p) => p.zona === 'Palermo');
  for (const p of palermo) {
    assert.ok(
      result.some((r) => r.id === p.id),
      `test_filter_by_zona: propiedad Palermo ${p.id} no incluida`
    );
  }

  console.log(`[OK] test_filter_by_zona — ${result.length} propiedades filtradas para lead-01 (Palermo/departamento)`);
}

function test_filter_by_tipo(): void {
  // R7: filterCandidateProperties devuelve propiedades del tipo del lead
  const lead = leads.find((l) => l.id === 'lead-03')!; // zona: Caballito, tipo: ph
  const result = filterCandidateProperties(lead, properties);

  // Todas deben ser de zona Caballito O tipo ph
  for (const prop of result) {
    const matchesZona = prop.zona === lead.zona;
    const matchesTipo = prop.tipo === lead.tipo_propiedad;
    assert.ok(
      matchesZona || matchesTipo,
      `test_filter_by_tipo: propiedad ${prop.id} no coincide por zona ni tipo`
    );
  }

  // Debe incluir propiedades de tipo ph
  const phProps = properties.filter((p) => p.tipo === 'ph');
  for (const p of phProps) {
    assert.ok(
      result.some((r) => r.id === p.id),
      `test_filter_by_tipo: propiedad ph ${p.id} no incluida`
    );
  }

  console.log(`[OK] test_filter_by_tipo — ${result.length} propiedades filtradas para lead-03 (Caballito/ph)`);
}

function test_filter_fallback(): void {
  // R7: Sin coincidencias, devuelve hasta 5 propiedades del catalogo ordenadas por precio_usd asc
  // Usamos un lead con zona y tipo inexistentes en el catalogo
  const fakeLead: Lead = {
    id: 'lead-fake',
    mensaje: 'test',
    telefono: '123',
    email: 'test@test.com',
    zona: 'ZonaInexistente',
    tipo_propiedad: null,
    presupuesto_usd: 100000,
    property_ids: [],
  };

  const result = filterCandidateProperties(fakeLead, properties);

  assert.ok(result.length <= 5, `test_filter_fallback: fallback debe devolver <= 5, devolvio ${result.length}`);
  assert.ok(result.length > 0, 'test_filter_fallback: fallback debe devolver al menos 1 propiedad');

  // Verificar orden ascendente por precio_usd
  for (let i = 1; i < result.length; i++) {
    assert.ok(
      result[i].precio_usd >= result[i - 1].precio_usd,
      `test_filter_fallback: orden incorrecto en posicion ${i}`
    );
  }

  // Las 5 primeras por precio asc del catalogo
  const sorted = [...properties].sort((a, b) => a.precio_usd - b.precio_usd).slice(0, 5);
  for (let i = 0; i < result.length; i++) {
    assert.strictEqual(result[i].id, sorted[i].id, `test_filter_fallback: propiedad en posicion ${i} incorrecta`);
  }

  console.log(`[OK] test_filter_fallback — fallback devuelve ${result.length} propiedades ordenadas por precio_usd`);
}

// --- Runner ---

function main(): void {
  console.log('=== test_ai_pipeline: iniciando suite de tests ===\n');

  // T9: Tests de validateLeadAnalysis
  test_valid_response();
  test_missing_trust_score();
  test_missing_is_spam();
  test_missing_property_match_ids();
  test_invalid_json_string();
  test_score_out_of_range();

  // T10: Tests de filterCandidateProperties
  test_filter_by_zona();
  test_filter_by_tipo();
  test_filter_fallback();

  console.log('\n=== TODOS LOS TESTS PASARON ===');
}

main();
