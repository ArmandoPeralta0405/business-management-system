import { ICategoriaPrograma, CategoriaProgramaModel } from '../models/CategoriaPrograma.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class CategoriaProgramaService extends CategoriaProgramaModel {
  async getAll(): Promise<ICategoriaPrograma[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categoria_programa');
    return rows as ICategoriaPrograma[];
  }

  async getById(id: number): Promise<ICategoriaPrograma | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categoria_programa WHERE id_categoria_programa = ?', 
      [id]
    );
    return rows[0] as ICategoriaPrograma || null;
  }

  async create(categoriaProgramaData: Omit<ICategoriaPrograma, 'id_categoria_programa'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categoria_programa (descripcion) VALUES (?)',
      [categoriaProgramaData.descripcion]
    );
    return result.insertId;
  }

  async update(id: number, categoriaProgramaData: Partial<ICategoriaPrograma>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE categoria_programa SET descripcion = ? WHERE id_categoria_programa = ?',
      [categoriaProgramaData.descripcion, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM categoria_programa WHERE id_categoria_programa = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}