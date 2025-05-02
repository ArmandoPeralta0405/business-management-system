/**
 * Interfaz TypeScript pura para la entidad Movimiento
 * Representa exactamente la estructura de la tabla en la base de datos
 */
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
  
  /**
   * Estructura base del modelo Movimiento (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class MovimientoModel {
    abstract getAll(): Promise<IMovimientoView[]>;
    abstract getById(id: number): Promise<IMovimiento | null>;
    abstract create(movimientoData: Omit<IMovimiento, 'id_movimiento'>): Promise<number>;
    abstract update(id: number, movimientoData: Partial<IMovimiento>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
    abstract getMovimientosStock(): Promise<IMovimientoView[]>;
  }