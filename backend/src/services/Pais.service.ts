import { IPais, PaisModel } from '../models/Pais.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class PaisService extends PaisModel {
  async getAll(): Promise<IPais[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM pais');
    return rows as IPais[];
  }

  async getById(id: number): Promise<IPais | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM pais WHERE id_pais = ?', 
      [id]
    );
    return rows[0] as IPais || null;
  }

  async create(paisData: Omit<IPais, 'id_pais'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO pais (descripcion, nacionalidad, codigo_iso3) VALUES (?, ?, ?)',
      [paisData.descripcion, paisData.nacionalidad, paisData.codigo_iso3]
    );
    return result.insertId;
  }

  async update(id: number, paisData: Partial<IPais>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE pais SET descripcion = ?, nacionalidad = ?, codigo_iso3 = ? WHERE id_pais = ?',
      [paisData.descripcion, paisData.nacionalidad, paisData.codigo_iso3, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM pais WHERE id_pais = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}