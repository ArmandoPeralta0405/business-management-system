import { IRol, RolModel } from '../models/Rol.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class RolService extends RolModel {
  async getAll(): Promise<IRol[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM rol');
    return rows as IRol[];
  }

  async getById(id: number): Promise<IRol | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM rol WHERE id_rol = ?', 
      [id]
    );
    return rows[0] as IRol || null;
  }

  async create(rolData: Omit<IRol, 'id_rol'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO rol (descripcion) VALUES (?)',
      [rolData.descripcion]
    );
    return result.insertId;
  }

  async update(id: number, rolData: Partial<IRol>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE rol SET descripcion = ? WHERE id_rol = ?',
      [rolData.descripcion, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM rol WHERE id_rol = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}