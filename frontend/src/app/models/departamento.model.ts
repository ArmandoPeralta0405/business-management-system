export interface IDepartamento {
    id_departamento?: number;  // Opcional para creaciones
    id_pais: number;
    descripcion: string;
}

export interface IDepartamentoView {
  id_departamento?: number;  // Opcional para creaciones
  id_pais: number;
  pais_descripcion: string;
  descripcion: string;
}