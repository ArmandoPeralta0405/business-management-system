import { ICiudad, ICiudadView, CiudadModel } from '../models/Ciudad.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class CiudadService extends CiudadModel {
  async getAll(): Promise<ICiudadView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM ciudad_view');
    return rows as ICiudadView[];
  }

  async getById(id: number): Promise<ICiudad | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM ciudad WHERE id_ciudad = ?', 
      [id]
    );
    return rows[0] as ICiudad || null;
  }

  async create(ciudadData: Omit<ICiudad, 'id_ciudad'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO ciudad (id_departamento, descripcion, capital, codigo_postal) VALUES (?, ?, ?, ?)',
      [ciudadData.id_departamento, ciudadData.descripcion, ciudadData.capital, ciudadData.codigo_postal]
    );
    return result.insertId;
  }

  async update(id: number, ciudadData: Partial<ICiudad>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE ciudad SET id_departamento = ?, descripcion = ?, capital = ?, codigo_postal = ? WHERE id_ciudad = ?',
      [ciudadData.id_departamento, ciudadData.descripcion, ciudadData.capital, ciudadData.codigo_postal, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM ciudad WHERE id_ciudad = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}