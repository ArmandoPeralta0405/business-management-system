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