export interface IPrograma {
  id_programa?: number;         // Opcional porque es auto-incremental
  id_modulo: number;
  nombre: string;
  ruta: string;
  estado: boolean;
  id_categoria: number;
}

export interface IProgramaView {
  id_programa?: number;         // Opcional porque es auto-incremental
  id_modulo: number;
  modulo_descripcion: string;
  nombre: string;
  ruta: string;
  estado: String;
  id_categoria: number;
  categoria_programa_descripcion: string;
}