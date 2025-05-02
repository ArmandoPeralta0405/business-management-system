/**
 * Interfaz TypeScript pura para la entidad Articulo
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IArticulo{
    id_articulo?: number;         // Opcional porque es auto-incremental
    codigo_alfanumerico: string;
    descripcion: string;
    id_categoria: number;
    id_linea: number;
    id_marca: number;
    id_tipo: number; 
    id_unidad: number;
    id_impuesto: number;
    estado: boolean;
  }

  export interface IArticuloView{
    id_articulo?: number;         // Opcional porque es auto-incremental
    codigo_alfanumerico: string;
    descripcion: string;
    id_categoria: number;
    categoria_descripcion: string;
    id_linea: number;
    linea_descripcion: string;
    id_marca: number;
    marca_descripcion: string;
    id_tipo: number; 
    tipo_articulo_descripcion: string;
    id_unidad: number;
    unidad_descripcion: string;
    id_impuesto: number;
    impuesto_descripcion: string;
    estado: string;
  }
  
  /**
   * Estructura base del modelo Articulo (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class ArticuloModel {
    abstract getAll(): Promise<IArticuloView[]>;
    abstract getArticulosActivos(): Promise<IArticuloView[]>;
    abstract getById(id: number): Promise<IArticulo | null>;
    abstract create(articuloData: Omit<IArticulo, 'id_articulo'>): Promise<number>;
    abstract update(id: number, articuloData: Partial<IArticulo>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
    
  }