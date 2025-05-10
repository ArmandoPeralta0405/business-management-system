/**
 * Interfaz TypeScript pura para la entidad Ajuste Stock
 * Representa exactamente la estructura de la tabla en la base de datos
 */
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


/**
 * Estructura base del modelo Ajuste Stock (sin implementaciones)
 * Solo define los métodos que deberá implementar el servicio
 */
/**
 * Interfaz para los filtros del informe de ajustes de stock
 */
export interface IAjusteStockFiltros {
  fechaInicial: string;
  fechaFinal: string;
  id_movimiento?: number; // Opcional
}

export abstract class AjusteStockModel {
  abstract getAll(): Promise<IAjusteStockView[]>;
  abstract getById(id: number): Promise<IAjusteStock | null>;
  abstract create(ajusteStockData: Omit<IAjusteStock, 'id_ajuste'>): Promise<number>;
  abstract update(id: number, ajusteStockData: Partial<IAjusteStock>): Promise<boolean>;
  abstract delete(id: number): Promise<boolean>;
  abstract fetchNextNumeroComprobante(): Promise<number>;
  abstract getByFiltros(filtros: IAjusteStockFiltros): Promise<IAjusteStockView[]>; // Nuevo método
}