import { ICategoria, CategoriaModel } from '../models/Categoria.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class CategoriaService extends CategoriaModel {
  async getAll(): Promise<ICategoria[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categoria');
    return rows as ICategoria[];
  }

  async getById(id: number): Promise<ICategoria | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categoria WHERE id_categoria = ?', 
      [id]
    );
    return rows[0] as ICategoria || null;
  }

  async create(categoriaData: Omit<ICategoria, 'id_categoria'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categoria (descripcion) VALUES (?)',
      [categoriaData.descripcion]
    );
    return result.insertId;
  }

  async update(id: number, categoriaData: Partial<ICategoria>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE categoria SET descripcion = ? WHERE id_categoria = ?',
      [categoriaData.descripcion, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM categoria WHERE id_categoria = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}