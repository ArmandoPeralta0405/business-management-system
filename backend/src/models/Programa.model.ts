/**
 * Interfaz TypeScript pura para la entidad Ciudad
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IPrograma {
    id_programa?: number;         // Opcional porque es auto-incremental
    id_modulo: number;
    nombre: string;
    ruta: string;
    estado: boolean;
}

export interface IProgramaView {
  id_programa?: number;         // Opcional porque es auto-incremental
  id_modulo: number;
  modulo_descripcion: string;
  nombre: string;
  ruta: string;
  estado: boolean;
}
  
  /**
   * Estructura base del modelo Programa (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class ProgramaModel {
    abstract getAll(): Promise<IProgramaView[]>;
    abstract getById(id: number): Promise<IPrograma | null>;
    abstract create(programaData: Omit<IPrograma, 'id_programa'>): Promise<number>;
    abstract update(id: number, programaData: Partial<IPrograma>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }