/**
 * Interfaz TypeScript pura para la entidad ConfiguracionStock
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IConfiguracionStock {
    id_configuracion?: number;         // Opcional porque es auto-incremental
    descripcion: string;
    id_tipo_articulo_servicio: number;
    observacion: string;
}

export interface IConfiguracionStockView {
  id_configuracion?: number;         // Opcional porque es auto-incremental
  descripcion: string;
  id_tipo_articulo_servicio: number;
  tipo_articulo_servicio_descripcion: string;
  observacion: string;
}
  
  /**
   * Estructura base del modelo ConfiguracionStock (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class ConfiguracionStockModel {
    abstract getAll(): Promise<IConfiguracionStockView[]>;
    abstract getById(id: number): Promise<IConfiguracionStock | null>;
    abstract create(configuracionStockData: Omit<IConfiguracionStock, 'id_configuracion'>): Promise<number>;
    abstract update(id: number, configuracionStockData: Partial<IConfiguracionStock>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }