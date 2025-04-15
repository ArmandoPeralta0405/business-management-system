export interface IModulo {
  id_modulo?: number;         // Opcional porque es auto-incremental
  descripcion: string;
  icono: string;
  orden: number;
  estado: boolean;  
}

export interface IModuloView {
  id_modulo?: number;         // Opcional porque es auto-incremental
  descripcion: string;
  icono: string;
  orden: number;
  estado: string;  
}