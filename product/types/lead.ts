export type Source =
  | "Zonaprop"
  | "Argenprop"
  | "WhatsApp"
  | "Mail"
  | "Mercadolibre"
  | "Chat web"
  | "Navent";

export type Estado =
  | "Nuevo"
  | "En revisión"
  | "Calificado"
  | "Descartado";

export interface Lead {
  id: string;
  mensaje: string;
  telefono: string;
  email: string;
  zona: string;
  tipo_propiedad: "departamento" | "casa" | "ph" | "local_comercial" | "oficina" | null;
  presupuesto_usd: number;
  property_ids: string[];
  // Campos nuevos (feature 10) — todos opcionales para preservar compatibilidad con specs 1-5.
  source?: Source;
  estado?: Estado;
  created_at?: string; // ISO 8601 UTC, e.g. "2026-05-22T14:30:00.000Z"
  agencia?: string | null;
  direccion_propiedad?: string | null;
}
