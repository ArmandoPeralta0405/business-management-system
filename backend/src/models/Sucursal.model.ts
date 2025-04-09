/**
 * Interfaz TypeScript pura para la entidad Sucursal
 * Representa exactamente la estructura de la tabla en la base de datos
 */
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
  
  /**
   * Estructura base del modelo Sucursal (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class SucursalModel {
    abstract getAll(): Promise<ISucursalView[]>;
    abstract getById(id_sucursal: number, id_empresa: number): Promise<ISucursal | null>;
    abstract create(sucursalData: Omit<ISucursal, 'id_sucursal'>): Promise<number>;
    abstract update(id_sucursal: number, id_empresa: number, sucursalData: Partial<ISucursal>): Promise<boolean>;
    abstract delete(id_sucursal: number, id_empresa: number): Promise<boolean>;
  }