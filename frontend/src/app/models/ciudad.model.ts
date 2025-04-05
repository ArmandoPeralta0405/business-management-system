export interface ICiudad {
    id_ciudad?: number;  // Opcional para creaciones
    id_departamento: number;
    descripcion: string;
    capital: number;
    codigo_postal: string;
}

export interface ICiudadView {
  id_ciudad?: number;  // Opcional para creaciones
  id_departamento: number;
  departamento_descripcion: string;
  descripcion: string;
  capital: String;
  codigo_postal?: string;
}