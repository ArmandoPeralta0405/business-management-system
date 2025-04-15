/**
 * Interfaz TypeScript pura para la entidad Modulo
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IModulo {
    id_modulo?: number;         // Opcional porque es auto-incremental
    descripcion: string;
    icono: string;
    orden: number;
    estado: boolean;  
}

export interface IModuloView {
  id_modulo?: number;         // Opcional porque es auto-incremental
  descripcion: string;
  icono: string;
  orden: number;
  estado: string;  
}
  
  /**
   * Estructura base del modelo Modulo (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class ModuloModel {
    abstract getAll(): Promise<IModuloView[]>;
    abstract getById(id: number): Promise<IModulo | null>;
    abstract create(moduloData: Omit<IModulo, 'id_modulo'>): Promise<number>;
    abstract update(id: number, moduloData: Partial<IModulo>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }