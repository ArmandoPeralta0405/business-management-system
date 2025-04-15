import { IModulo, IModuloView, ModuloModel } from '../models/Modulo.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class ModuloService extends ModuloModel {
  async getAll(): Promise<IModuloView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM modulo_view');
    return rows as IModuloView[];
  }

  async getById(id: number): Promise<IModulo | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM modulo WHERE id_modulo = ?', 
      [id]
    );
    return rows[0] as IModulo || null;
  }

  async create(moduloData: Omit<IModulo, 'id_modulo'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO modulo (descripcion, icono, orden, estado) VALUES (?, ?, ?, ?)',
      [moduloData.descripcion, moduloData.icono, moduloData.orden, moduloData.estado]
    );
    return result.insertId;
  }

  async update(id: number, moduloData: Partial<IModulo>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE modulo SET descripcion = ?, icono = ?, orden = ?, estado = ? WHERE id_modulo = ?',
      [moduloData.descripcion, moduloData.icono, moduloData.orden, moduloData.estado, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM modulo WHERE id_modulo = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}