/**
 * Interfaz TypeScript pura para la entidad DetalleAjusteStock
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IDetalleAjusteStock {
    id_ajuste: number;         // Opcional porque es auto-incremental
    id_articulo: number;
    numero_item: number;
    cantidad: number;
}

export interface IDetalleAjusteStockView {
  id_ajuste: number;  
  numero_comprobante: string;       // Opcional porque es auto-incremental
  id_articulo: number;
  articulo_descripcion: string;
  numero_item: string;
  cantidad: number;
}
  
  /**
   * Estructura base del modelo DetalleAjusteStock (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class DetalleAjusteStockModel {
    abstract getAll(): Promise<IDetalleAjusteStockView[]>;
    abstract getById(id_ajuste: number, id_articulo: number, numero_item: number): Promise<IDetalleAjusteStock | null>;
    abstract create(detalleAjusteStockData: Omit<IDetalleAjusteStock, never>): Promise<{ id_ajuste: number, id_articulo: number, numero_item: number }>;
    abstract update(id_ajuste: number, id_articulo: number, numero_item: number, detalleAjusteStockData: Partial<IDetalleAjusteStock>): Promise<boolean>;
    abstract delete(id_ajuste: number, id_articulo: number, numero_item: number): Promise<boolean>;
  }