export interface Property {
  id: string;
  titulo: string;
  precio_usd: number;
  zona: string;
  tipo: "departamento" | "casa" | "ph" | "local_comercial" | "oficina";
  dormitorios: number;
  descripcion: string;
}
