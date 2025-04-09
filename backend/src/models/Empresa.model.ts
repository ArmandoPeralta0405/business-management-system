/**
 * Interfaz TypeScript pura para la entidad Empresa
 * Representa exactamente la estructura de la tabla en la base de datos
 */
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
  
  /**
   * Estructura base del modelo Empresa (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class EmpresaModel {
    abstract getAll(): Promise<IEmpresaView[]>;
    abstract getById(id: number): Promise<IEmpresa | null>;
    abstract create(empresaData: Omit<IEmpresa, 'id_empresa'>): Promise<number>;
    abstract update(id: number, empresaData: Partial<IEmpresa>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }