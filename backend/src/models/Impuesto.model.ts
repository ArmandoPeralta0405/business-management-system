/**
 * Interfaz TypeScript pura para la entidad Impuesto
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IImpuesto {
    id_impuesto?: number;         // Opcional porque es auto-incremental
    descripcion: string;
    valor_calculo: number;
    abreviacion: string;
  }
  
  /**
   * Estructura base del modelo Impuesto (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class ImpuestoModel {
    abstract getAll(): Promise<IImpuesto[]>;
    abstract getById(id: number): Promise<IImpuesto | null>;
    abstract create(impuestoData: Omit<IImpuesto, 'id_impuesto'>): Promise<number>;
    abstract update(id: number, impuestoData: Partial<IImpuesto>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }