export interface ISucursal {
  id_sucursal?: number;         // Opcional porque es auto-incremental
  id_empresa: number;
  descripcion: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  id_ciudad: number;
  casa_central: boolean;
  estado: boolean;
}

export interface ISucursalView {
  id_sucursal?: number;         // Opcional porque es auto-incremental
  id_empresa: number;
  empresa_razon_social: string;
  empresa_ruc: string;
  descripcion: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  id_ciudad: number;
  ciudad_descripcion: string;
  casa_central: string;
  estado: string;
}