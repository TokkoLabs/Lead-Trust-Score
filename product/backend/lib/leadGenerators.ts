/**
 * product/backend/lib/leadGenerators.ts
 * Pools de datos y helpers de generación determinista de leads sintéticos.
 * Cubre: R10, R11, R12, R13, R14, R15, R16, R17, R18.
 *
 * Diseño: ver specs/mock_data_extension_dashboard/design.md.
 * Las fuentes (SOURCES_POOL) provienen literalmente de
 *   ui-ux/lead-trust-dashboard-tokko (3).html (lineas 732-736 y 788-791).
 */

import type { Lead, Source, Estado } from "../../types/lead";

type TipoPropiedad = Lead["tipo_propiedad"]; // incluye null

// --- Pools (R10, R11) ---

export const ZONAS_POOL: readonly string[] = [
  "Palermo",
  "Belgrano",
  "Recoleta",
  "Caballito",
  "Tigre",
  "Flores",
  "San Isidro",
  "Villa Crespo",
  "Núñez",
  "Devoto",
  "Almagro",
  "Vicente López",
] as const;

export const PRESUPUESTOS_POOL: readonly number[] = [
  85000, 95000, 120000, 150000, 175000, 200000, 240000, 300000, 380000, 450000,
] as const;

export const MENSAJES_INTERESTED_POOL: readonly string[] = [
  "Hola, quisiera coordinar una visita esta semana, estoy interesado en mudarme cuanto antes.",
  "Me interesa comprar el departamento, tengo el presupuesto aprobado y puedo cerrar rápido.",
  "Estoy buscando una propiedad para mudanza urgente, ¿puedo agendar una visita el sábado?",
  "Hola! Vi la publicación y me interesa. ¿Cuándo podría ver la propiedad?",
  "Tengo interés en la propiedad, necesito mudarme antes de fin de mes. Aviseme horarios disponibles.",
  "Quisiera información sobre la propiedad para una posible compra inmediata. ¿Aceptan créditos hipotecarios?",
  "Buenas, estoy interesado en visitar la propiedad este fin de semana. Llamame cuando puedas.",
  "Hola, ¿sigue disponible la propiedad? Estoy listo para hacer una oferta luego de la visita.",
  "Necesito comprar urgente porque vence mi contrato de alquiler. ¿Coordinamos visita?",
  "Me interesa la propiedad, ya vendí mi anterior departamento y necesito mudarme en 30 días.",
  "Hola, vi el aviso y quiero ir a verla. ¿Hay disponibilidad mañana a la tarde?",
  "Buenas tardes, estoy interesado en agendar visita para la compra de la propiedad publicada.",
] as const;

export const MENSAJES_SPAM_POOL: readonly string[] = [
  "test",
  "demo",
  "asdf",
  "hola",
  "info",
  "precio?",
  "...",
  "FREE PROPERTY INVESTMENT OPPORTUNITY CLICK HERE",
] as const;

export const TIPOS_PROPIEDAD_POOL: readonly TipoPropiedad[] = [
  "departamento",
  "casa",
  "ph",
  "local_comercial",
  "oficina",
  null,
] as const;

export const SOURCES_POOL: readonly Source[] = [
  "Zonaprop",
  "Argenprop",
  "WhatsApp",
  "Mail",
  "Mercadolibre",
  "Chat web",
  "Navent",
] as const;

export const ESTADOS_POOL: readonly Estado[] = [
  "Nuevo",
  "En revisión",
  "Calificado",
  "Descartado",
] as const;

export const AGENCIAS_POOL: readonly string[] = [
  "Tokko Realty",
  "RE/MAX Argentina",
  "Inmobiliaria del Plata",
  "Bullrich Propiedades",
  "Toribio Achával",
  "Izrastzoff Estudio Inmobiliario",
  "L. J. Ramos Brokers",
  "Castex Propiedades",
  "Miguel Ludmer Inmobiliaria",
] as const;

export const DIRECCIONES_POOL: readonly string[] = [
  "Av. Santa Fe 2350",
  "Posadas 1342 Piso 4 Dpto B",
  "Av. Cabildo 1875",
  "Av. Rivadavia 5820",
  "Av. Corrientes 4310",
  "Honduras 5450",
  "Gorriti 4120",
  "Bonpland 1885",
  "Av. Libertador 4450",
  "Soldado de la Independencia 990",
  "Av. Cramer 2310",
  "Charcas 3890",
] as const;

// --- pickRandom (R12, R13, R18) ---

export function pickRandom<T>(pool: readonly T[], rng?: () => number): T {
  if (pool.length === 0) {
    throw new Error("pickRandom: pool vacío");
  }
  const r = (rng ?? Math.random)();
  const idx = Math.min(pool.length - 1, Math.floor(r * pool.length));
  return pool[idx]!;
}

// --- generateRandomLead (R14, R15, R16, R17) ---

export interface GenerateLeadOpts {
  forceType?: "interested" | "spam";
}

let _counter = 0;

export function generateRandomLead(
  rng?: () => number,
  opts?: GenerateLeadOpts,
): Lead {
  const r = rng ?? Math.random;

  // Decide tipo (interested 80% / spam 20%) salvo que se fuerce.
  const type = opts?.forceType ?? (r() < 0.8 ? "interested" : "spam");

  const mensaje =
    type === "spam"
      ? pickRandom(MENSAJES_SPAM_POOL, r)
      : pickRandom(MENSAJES_INTERESTED_POOL, r);

  const zona = pickRandom(ZONAS_POOL, r);
  const source = pickRandom(SOURCES_POOL, r);
  const estado = pickRandom(ESTADOS_POOL, r);
  const tipo_propiedad = pickRandom(TIPOS_PROPIEDAD_POOL, r);
  const presupuesto_usd =
    type === "spam" ? 0 : pickRandom(PRESUPUESTOS_POOL, r);
  const agencia = pickRandom(AGENCIAS_POOL, r);
  const direccion_propiedad = pickRandom(DIRECCIONES_POOL, r);

  // id estable y único entre invocaciones consecutivas
  _counter += 1;
  const id = `sim-${Date.now()}-${_counter}`;

  const email =
    type === "spam"
      ? `user${Math.floor(r() * 10000)}@tempmail.org`
      : `lead${Math.floor(r() * 10000)}@gmail.com`;

  const telefono =
    type === "spam"
      ? "000-0000"
      : `+54 9 11 ${Math.floor(r() * 9000 + 1000)}-${Math.floor(
          r() * 9000 + 1000,
        )}`;

  return {
    id,
    mensaje,
    telefono,
    email,
    zona,
    tipo_propiedad,
    presupuesto_usd,
    property_ids: [],
    source,
    estado,
    created_at: new Date().toISOString(),
    agencia,
    direccion_propiedad,
  };
}
