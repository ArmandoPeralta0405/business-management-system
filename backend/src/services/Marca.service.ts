import { IMarca, MarcaModel } from '../models/Marca.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class MarcaService extends MarcaModel {
  async getAll(): Promise<IMarca[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM marca');
    return rows as IMarca[];
  }

  async getById(id: number): Promise<IMarca | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM marca WHERE id_marca = ?', 
      [id]
    );
    return rows[0] as IMarca || null;
  }

  async create(marcaData: Omit<IMarca, 'id_marca'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO marca (descripcion) VALUES (?)',
      [marcaData.descripcion]
    );
    return result.insertId;
  }

  async update(id: number, marcaData: Partial<IMarca>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE marca SET descripcion = ? WHERE id_marca = ?',
      [marcaData.descripcion, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM marca WHERE id_marca = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}