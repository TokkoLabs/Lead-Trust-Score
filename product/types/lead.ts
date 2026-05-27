export interface Lead {
  id: string;
  mensaje: string;
  telefono: string;
  email: string;
  zona: string;
  tipo_propiedad: "departamento" | "casa" | "ph" | "local_comercial" | "oficina" | null;
  presupuesto_usd: number;
  property_ids: string[];
}
