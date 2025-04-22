/**
 * Interfaz TypeScript pura para la entidad TipoBarra
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface ITipoBarra{
    id_tipo?: number;         // Opcional porque es auto-incremental
    descripcion: string;
  }
  
  /**
   * Estructura base del modelo Marca (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class TipoBarraModel {
    abstract getAll(): Promise<ITipoBarra[]>;
    abstract getById(id: number): Promise<ITipoBarra | null>;
    abstract create(tipoBarraData: Omit<ITipoBarra, 'id_tipo'>): Promise<number>;
    abstract update(id: number, tipoBarraData: Partial<ITipoBarra>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }