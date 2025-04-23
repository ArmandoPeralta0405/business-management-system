/**
 * Interfaz TypeScript pura para la entidad CodigoBarra
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface ICodigoBarra{
    id_codigo?: number;         // Opcional porque es auto-incremental
    id_articulo: number;
    codigo_barra: string;
    id_tipo: number;
    estado: boolean;
  }
 
  export interface ICodigoBarraView{
    id_codigo?: number;         // Opcional porque es auto-incremental
    id_articulo: number;
    articulo_descripcion: string;
    codigo_barra: string;
    id_tipo: number;
    tipo_barra_descripcion: string;
    estado: string;
  }
  /**
   * Estructura base del modelo CodigoBarra (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class CodigoBarraModel {
    abstract getAll(): Promise<ICodigoBarraView[]>;
    abstract getById(id_codigo: number, id_articulo: number): Promise<ICodigoBarra | null>;
    abstract create(codigoBarraData: Omit<ICodigoBarra, 'id_codigo'>): Promise<number>;
    abstract update(id_codigo: number, id_articulo: number, codigoBarraData: Partial<ICodigoBarra>): Promise<boolean>;
    abstract delete(id_codigo: number, id_articulo: number): Promise<boolean>;
  }