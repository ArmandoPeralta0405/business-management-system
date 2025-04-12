export interface IDeposito {
  id_deposito?: number;  // Opcional para creaciones
  descripcion: string;
  id_sucursal: number;
  id_empresa: number;
}

export interface IDepositoView {
  id_deposito?: number;  // Opcional para creaciones
  descripcion: string;
  id_sucursal: number;
  sucursal_descripcion: string;
  id_empresa: number;
  empresa_descripcion: string;
}