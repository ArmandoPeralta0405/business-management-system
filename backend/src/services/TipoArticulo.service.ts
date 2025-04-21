import { ITipoArticulo, TipoArticuloModel } from '../models/TipoArticulo.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class TipoArticuloService extends TipoArticuloModel {
  async getAll(): Promise<ITipoArticulo[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tipo_articulo');
    return rows as ITipoArticulo[];
  }

  async getById(id: number): Promise<ITipoArticulo | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM tipo_articulo WHERE id_tipo = ?', 
      [id]
    );
    return rows[0] as ITipoArticulo || null;
  }

  async create(tipoArticuloData: Omit<ITipoArticulo, 'id_tipo'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO tipo_articulo (descripcion) VALUES (?)',
      [tipoArticuloData.descripcion]
    );
    return result.insertId;
  }

  async update(id: number, tipoArticuloData: Partial<ITipoArticulo>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE tipo_articulo SET descripcion = ? WHERE id_tipo = ?',
      [tipoArticuloData.descripcion, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM tipo_articulo WHERE id_tipo = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}