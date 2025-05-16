export interface IProveedor {
  id_proveedor?: number;         // Opcional porque es auto-incremental
  razon_social: string;
  nombre_fantasia?: string;
  ruc?: string;
  cedula?: string;
  id_ciudad: number;
  direccion: string;
  email: string;
  telefono: string;
  estado: boolean;
}

export interface IProveedorView {
  id_proveedor?: number;         // Opcional porque es auto-incremental
  razon_social: string;
  nombre_fantasia?: string;
  ruc?: string;
  cedula?: string;
  id_ciudad: number;
  ciudad_descripcion: string;
  direccion: string;
  email: string;
  telefono: string;
  estado: string;
}