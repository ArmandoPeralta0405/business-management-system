/**
 * Interfaz TypeScript pura para la entidad Categoria
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface ICategoria{
    id_categoria?: number;         // Opcional porque es auto-incremental
    descripcion: string;
  }
  
  /**
   * Estructura base del modelo Categoria (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class CategoriaModel {
    abstract getAll(): Promise<ICategoria[]>;
    abstract getById(id: number): Promise<ICategoria | null>;
    abstract create(categoriaData: Omit<ICategoria, 'id_categoria'>): Promise<number>;
    abstract update(id: number, categoriaData: Partial<ICategoria>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }