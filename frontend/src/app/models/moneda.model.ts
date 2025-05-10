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