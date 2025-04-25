export interface IMovimiento {
  id_movimiento?: number;         // Opcional porque es auto-incremental
  descripcion: string;
  abreviacion: string;
  observacion?: string;
  afecta_stock: '+' | '-';
  tipo_movimiento: 'E'|'R'|'O';
  estado: boolean;
}

export interface IMovimientoView {
  id_movimiento?: number;         // Opcional porque es auto-incremental
  descripcion: string;
  abreviacion: string;
  observacion?: string;
  afecta_stock: string;
  tipo_movimiento: string;
  estado: string;
}