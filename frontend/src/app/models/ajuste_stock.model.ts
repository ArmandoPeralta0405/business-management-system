export interface IAjusteStock {
  id_ajuste?: number;         // Opcional porque es auto-incremental
  id_empresa: number;
  id_sucursal: number;
  id_deposito: number;
  numero_comprobante: number;
  fecha_hora: Date;
  id_movimiento: number;
  observacion?: string;
  id_usuario: number;
}

export interface IAjusteStockView {
  id_ajuste?: number;         // Opcional porque es auto-incremental
  id_empresa: number;
  empresa_descripcion: string;
  id_sucursal: number;
  sucursal_descripcion: string;
  id_deposito: number;
  deposito_descripcion: string;
  numero_comprobante: string;
  fecha: string;
  hora: string;
  id_movimiento: number;
  movimiento_descripcion: string;
  observacion?: string;
  id_usuario: number;
  usuario_descripcion: string;
}