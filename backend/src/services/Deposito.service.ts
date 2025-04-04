import { IDeposito, DepositoModel } from '../models/Deposito.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class DepositoService extends DepositoModel {
  async getAll(): Promise<IDeposito[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM deposito');
    return rows as IDeposito[];
  }

  async getById(id: number): Promise<IDeposito | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM deposito WHERE id_deposito = ?', 
      [id]
    );
    return rows[0] as IDeposito || null;
  }

  async create(depositoData: Omit<IDeposito, 'id_deposito'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO deposito (descripcion) VALUES (?)',
      [depositoData.descripcion]
    );
    return result.insertId;
  }

  async update(id: number, depositoData: Partial<IDeposito>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE deposito SET descripcion = ? WHERE id_deposito = ?',
      [depositoData.descripcion, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM deposito WHERE id_deposito = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}