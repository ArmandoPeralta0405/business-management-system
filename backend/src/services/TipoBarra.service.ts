import { ITipoBarra, TipoBarraModel } from '../models/TipoBarra.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class TipoBarraService extends TipoBarraModel {
  async getAll(): Promise<ITipoBarra[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tipo_barra');
    return rows as ITipoBarra[];
  }

  async getById(id: number): Promise<ITipoBarra | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM tipo_barra WHERE id_tipo = ?', 
      [id]
    );
    return rows[0] as ITipoBarra || null;
  }

  async create(tipoBarraData: Omit<ITipoBarra, 'id_tipo'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO tipo_barra (descripcion) VALUES (?)',
      [tipoBarraData.descripcion]
    );
    return result.insertId;
  }

  async update(id: number, tipoBarraData: Partial<ITipoBarra>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE tipo_barra SET descripcion = ? WHERE id_tipo = ?',
      [tipoBarraData.descripcion, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM tipo_barra WHERE id_tipo = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}