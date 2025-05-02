import { IMovimiento, IMovimientoView, MovimientoModel } from '../models/Movimiento.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class MovimientoService extends MovimientoModel {
  async getAll(): Promise<IMovimientoView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM movimiento_view');
    return rows as IMovimientoView[];
  }
  
  async getById(id: number): Promise<IMovimiento | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM movimiento WHERE id_movimiento = ?', 
      [id]
    );
    return rows[0] as IMovimiento || null;
  }

  async create(movimientoData: Omit<IMovimiento, 'id_movimiento'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO movimiento (descripcion, abreviacion, observacion, afecta_stock, tipo_movimiento, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [movimientoData.descripcion, movimientoData.abreviacion, movimientoData.observacion, movimientoData.afecta_stock, movimientoData.tipo_movimiento, movimientoData.estado]
    );
    return result.insertId;
  }

  async update(id: number, movimientoData: Partial<IMovimiento>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE movimiento SET descripcion = ?, abreviacion = ?, observacion = ?, afecta_stock = ?, tipo_movimiento = ?, estado = ? WHERE id_movimiento = ?',
      [movimientoData.descripcion, movimientoData.abreviacion, movimientoData.observacion, movimientoData.afecta_stock, movimientoData.tipo_movimiento, movimientoData.estado, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM movimiento WHERE id_movimiento = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async getMovimientosStock(): Promise<IMovimientoView[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM movimiento_view WHERE tipo_movimiento = 'Otros' AND estado = 'Activo'`);
    return rows as IMovimientoView[];
  }
}