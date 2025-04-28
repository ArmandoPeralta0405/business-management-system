import { IDetalleAjusteStock, IDetalleAjusteStockView, DetalleAjusteStockModel } from '../models/DetalleAjusteStock.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class DetalleAjusteStockService extends DetalleAjusteStockModel {

  async getAll(): Promise<IDetalleAjusteStockView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM detalle_ajuste_stock_view');
    return rows as IDetalleAjusteStockView[];
  }

  async getById(id_ajuste: number, id_articulo: number, numero_item: number): Promise<IDetalleAjusteStock | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM detalle_ajuste_stock WHERE id_ajuste = ? AND id_articulo =? AND numero_item =?',
      [id_ajuste, id_articulo, numero_item]
    );
    return rows[0] as IDetalleAjusteStock || null;
  }

  async create(detalleAjusteStockData: IDetalleAjusteStock): Promise<{ id_ajuste: number, id_articulo: number, numero_item: number }> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO detalle_ajuste_stock
      (id_ajuste, id_articulo, numero_item, cantidad)
      VALUES (?, ?, ?, ?);`,
      [
        detalleAjusteStockData.id_ajuste,
        detalleAjusteStockData.id_articulo,
        detalleAjusteStockData.numero_item,
        detalleAjusteStockData.cantidad
      ]
    );
    return {
      id_ajuste: detalleAjusteStockData.id_ajuste,
      id_articulo: detalleAjusteStockData.id_articulo,
      numero_item: detalleAjusteStockData.numero_item
    };
  }

  async update(id_ajuste: number, id_articulo: number, numero_item: number, detalleAjusteStockData: Partial<IDetalleAjusteStock>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE detalle_ajuste_stock
      SET cantidad = ?
      WHERE id_ajuste = ? AND id_articulo = ? AND numero_item = ?;`,
      [
        detalleAjusteStockData.cantidad,
        id_ajuste,
        id_articulo,
        numero_item
      ]
    );
    return result.affectedRows > 0;
  }

  async delete(id_ajuste: number, id_articulo: number, numero_item: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM detalle_ajuste_stock WHERE id_ajuste = ? AND id_articulo = ? AND numero_item = ?',
      [id_ajuste, id_articulo, numero_item]
    );
    return result.affectedRows > 0;
  }
}