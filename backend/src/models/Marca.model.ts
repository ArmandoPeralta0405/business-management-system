/**
 * Interfaz TypeScript pura para la entidad Marca
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IMarca{
    id_marca?: number;         // Opcional porque es auto-incremental
    descripcion: string;
  }
  
  /**
   * Estructura base del modelo Marca (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class MarcaModel {
    abstract getAll(): Promise<IMarca[]>;
    abstract getById(id: number): Promise<IMarca | null>;
    abstract create(marcaData: Omit<IMarca, 'id_marca'>): Promise<number>;
    abstract update(id: number, marcaData: Partial<IMarca>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }