/**
 * Interfaz TypeScript pura para la entidad Ciudad
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface ICiudad {
    id_ciudad?: number;         // Opcional porque es auto-incremental
    id_departamento: number;
    descripcion: string;
    capital: number;
    codigo_postal: string;
}

export interface ICiudadView {
  id_ciudad?: number;         // Opcional porque es auto-incremental
  id_departamento: number;
  departamento_descripcion: string;
  descripcion: string;
  capital: string;
  codigo_postal: string;
}
  
  /**
   * Estructura base del modelo Ciudad (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class CiudadModel {
    abstract getAll(): Promise<ICiudadView[]>;
    abstract getById(id: number): Promise<ICiudad | null>;
    abstract create(ciudadData: Omit<ICiudad, 'id_ciudad'>): Promise<number>;
    abstract update(id: number, ciudadData: Partial<ICiudad>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }