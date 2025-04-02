/**
 * Interfaz TypeScript pura para la entidad Rol
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IRol {
    id_rol?: number;         // Opcional porque es auto-incremental
    descripcion: string;
  }
  
  /**
   * Estructura base del modelo Rol (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class RolModel {
    abstract getAll(): Promise<IRol[]>;
    abstract getById(id: number): Promise<IRol | null>;
    abstract create(rolData: Omit<IRol, 'id_rol'>): Promise<number>;
    abstract update(id: number, rolData: Partial<IRol>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }