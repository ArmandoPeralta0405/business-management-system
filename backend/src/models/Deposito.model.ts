/**
 * Interfaz TypeScript pura para la entidad Deposito
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IDeposito {
    id_deposito?: number;         // Opcional porque es auto-incremental
    descripcion: string;
    id_sucursal: number;
    id_empresa: number;
}

export interface IDepositoView {
  id_deposito?: number;         // Opcional porque es auto-incremental
  descripcion: string;
  id_sucursal: number;
  sucursal_descripcion: string;
  id_empresa: number;
  empresa_descripcion: string;
}
  
  /**
   * Estructura base del modelo Deposito (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class DepositoModel {
    abstract getAll(): Promise<IDeposito[]>;
    abstract getById(id: number): Promise<IDeposito | null>;
    abstract getBySucursal(id_sucursal: number, id_empresa: number): Promise<IDeposito[]>;
    abstract create(depositoData: Omit<IDeposito, 'id_deposito'>): Promise<number>;
    abstract update(id: number, depositoData: Partial<IDeposito>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }