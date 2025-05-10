/**
 * Interfaz TypeScript pura para la entidad Moneda
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IMoneda {
    id_moneda?: number;         // Opcional porque es auto-incremental
    descripcion: string;
    abreviacion: string;
    codigo_iso: string;
    simbolo: string;
    estado: boolean;
    decimales: number;  
}

export interface IMonedaView {
  id_moneda?: number;         // Opcional porque es auto-incremental
  descripcion: string;
  abreviacion: string;
  codigo_iso: string;
  simbolo: string;
  estado: string;
  decimales: number;  
}
  
  /**
   * Estructura base del modelo Moneda (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class MonedaModel {
    abstract getAll(): Promise<IMonedaView[]>;
    abstract getById(id: number): Promise<IMoneda | null>;
    abstract create(monedaData: Omit<IMoneda, 'id_moneda'>): Promise<number>;
    abstract update(id: number, monedaData: Partial<IMoneda>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }