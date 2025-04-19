export interface IImpuesto {
  id_impuesto?: number;         // Opcional porque es auto-incremental
  descripcion: string;
  valor_calculo: number;
  abreviacion: string;
}