import { ILinea, ILineaView, LineaModel } from '../models/Linea.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class LineaService extends LineaModel {
  async getAll(): Promise<ILineaView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM linea_view');
    return rows as ILineaView[];
  }

  async getById(id: number): Promise<ILinea | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM linea WHERE id_linea = ?', 
      [id]
    );
    return rows[0] as ILinea || null;
  }

  async create(lineaData: Omit<ILinea, 'id_linea'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO linea (descripcion, id_categoria) VALUES (?, ?)',
      [lineaData.descripcion, lineaData.id_categoria]
    );
    return result.insertId;
  }

  async update(id: number, lineaData: Partial<ILinea>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE linea SET descripcion = ?, id_categoria = ? WHERE id_linea = ?',
      [lineaData.descripcion, lineaData.id_categoria, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM linea WHERE id_linea = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}