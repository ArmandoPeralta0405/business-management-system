/**
 * Interfaz TypeScript pura para la entidad CategoriaPrograma
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface ICategoriaPrograma {
    id_categoria?: number;         // Opcional porque es auto-incremental
    descripcion: string;
  }
  
  /**
   * Estructura base del modelo CategoriaPrograma (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class CategoriaProgramaModel {
    abstract getAll(): Promise<ICategoriaPrograma[]>;
    abstract getById(id: number): Promise<ICategoriaPrograma | null>;
    abstract create(categoriaProgramaData: Omit<ICategoriaPrograma, 'id_categoria'>): Promise<number>;
    abstract update(id: number, categoriaProgramaData: Partial<ICategoriaPrograma>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }