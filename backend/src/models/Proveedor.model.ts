/**
 * Interfaz TypeScript pura para la entidad Proveedor
 * Representa exactamente la estructura de la tabla en la base de datos
 */
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
  
  /**
   * Estructura base del modelo Proveedor (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class ProveedorModel {
    abstract getAll(): Promise<IProveedorView[]>;
    abstract getById(id: number): Promise<IProveedor | null>;
    abstract create(proveedorData: Omit<IProveedor, 'id_proveedor'>): Promise<number>;
    abstract update(id: number, proveedorData: Partial<IProveedor>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }