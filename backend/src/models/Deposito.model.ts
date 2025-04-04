/**
 * Interfaz TypeScript pura para la entidad Deposito
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IDeposito {
    id_deposito?: number;         // Opcional porque es auto-incremental
    descripcion: string;
  }
  
  /**
   * Estructura base del modelo Deposito (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class DepositoModel {
    abstract getAll(): Promise<IDeposito[]>;
    abstract getById(id: number): Promise<IDeposito | null>;
    abstract create(rolData: Omit<IDeposito, 'id_deposito'>): Promise<number>;
    abstract update(id: number, rolData: Partial<IDeposito>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }