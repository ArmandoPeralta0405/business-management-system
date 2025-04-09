export interface IEmpresa {
    id_empresa?: number;         // Opcional porque es auto-incremental
    razon_social: string;
    nombre_comercial?: string;
    ruc: number;
    dv: number;
    direccion?: string;
    telefono?: string;
    email?: string;
    id_ciudad: number;
    fecha_constitucion: Date;
    representante_legal: string;
    estado?: boolean;
}

export interface IEmpresaView {
  id_empresa?: number;         // Opcional porque es auto-incremental
  razon_social: string;
  nombre_comercial?: string;
  ruc: number;
  dv: number;
  direccion?: string;
  telefono?: string;
  email?: string;
  id_ciudad: number;
  ciudad_descripcion: string;
  fecha_constitucion: Date;
  representante_legal: string;
  estado: String;
}