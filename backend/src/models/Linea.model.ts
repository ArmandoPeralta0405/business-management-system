/**
 * Interfaz TypeScript pura para la entidad Linea
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface ILinea{
    id_linea?: number;         // Opcional porque es auto-incremental
    descripcion: string;
    id_categoria: number;
  }

  export interface ILineaView{
    id_linea?: number;         // Opcional porque es auto-incremental
    descripcion: string;
    id_categoria: number;
    categoria_descripcion: string;
  }
  
  /**
   * Estructura base del modelo Categoria (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class LineaModel {
    abstract getAll(): Promise<ILinea[]>;
    abstract getById(id: number): Promise<ILinea | null>;
    abstract create(lineaData: Omit<ILinea, 'id_linea'>): Promise<number>;
    abstract update(id: number, lineaData: Partial<ILinea>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }