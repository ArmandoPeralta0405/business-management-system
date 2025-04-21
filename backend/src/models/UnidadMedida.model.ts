/**
 * Interfaz TypeScript pura para la entidad UnidadMedida
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IUnidadMedida{
    id_unidad?: number;         // Opcional porque es auto-incremental
    descripcion: string;
    abreviacion: string;
  }
  
  /**
   * Estructura base del modelo UnidadMedida (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class UnidadMedidaModel {
    abstract getAll(): Promise<IUnidadMedida[]>;
    abstract getById(id: number): Promise<IUnidadMedida | null>;
    abstract create(unidadMedidaData: Omit<IUnidadMedida, 'id_unidad'>): Promise<number>;
    abstract update(id: number, unidadMedidaData: Partial<IUnidadMedida>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }