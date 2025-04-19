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