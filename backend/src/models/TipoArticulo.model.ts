/**
 * Interfaz TypeScript pura para la entidad TipoArticulo
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface ITipoArticulo{
    id_tipo?: number;         // Opcional porque es auto-incremental
    descripcion: string;
  }
  
  /**
   * Estructura base del modelo TipoArticulo (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class TipoArticuloModel {
    abstract getAll(): Promise<ITipoArticulo[]>;
    abstract getById(id: number): Promise<ITipoArticulo | null>;
    abstract create(tipoArticuloData: Omit<ITipoArticulo, 'id_tipo'>): Promise<number>;
    abstract update(id: number, tipoArticuloData: Partial<ITipoArticulo>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }