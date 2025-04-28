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