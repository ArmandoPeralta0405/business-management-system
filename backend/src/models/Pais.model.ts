/**
 * Interfaz TypeScript pura para la entidad Pais
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IPais {
    id_pais?: number;         // Opcional porque es auto-incremental
    descripcion: string;
    nacionalidad: string;
    codigo_iso3: string;
  }
  
  /**
   * Estructura base del modelo Pais (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class PaisModel {
    abstract getAll(): Promise<IPais[]>;
    abstract getById(id: number): Promise<IPais | null>;
    abstract create(paisData: Omit<IPais, 'id_pais'>): Promise<number>;
    abstract update(id: number, paisData: Partial<IPais>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }