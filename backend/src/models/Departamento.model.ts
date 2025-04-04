/**
 * Interfaz TypeScript pura para la entidad Departamento
 * Representa exactamente la estructura de la tabla en la base de datos
 */
export interface IDepartamento {
    id_departamento?: number;         // Opcional porque es auto-incremental
    id_pais: number;
    descripcion: string;
}

export interface IDepartamentoView {
  id_departamento?: number;         // Opcional porque es auto-incremental
  id_pais: number;
  pais_descripcion: string;
  descripcion: string;
}
  
  /**
   * Estructura base del modelo Departamento (sin implementaciones)
   * Solo define los métodos que deberá implementar el servicio
   */
  export abstract class DepartamentoModel {
    abstract getAll(): Promise<IDepartamentoView[]>;
    abstract getById(id: number): Promise<IDepartamentoView | null>;
    abstract create(departamentoData: Omit<IDepartamento, 'id_departamento'>): Promise<number>;
    abstract update(id: number, departamentoData: Partial<IDepartamento>): Promise<boolean>;
    abstract delete(id: number): Promise<boolean>;
  }