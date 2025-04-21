import { IUnidadMedida, UnidadMedidaModel } from '../models/UnidadMedida.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class UnidadMedidaService extends UnidadMedidaModel {
  async getAll(): Promise<IUnidadMedida[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM unidad_medida');
    return rows as IUnidadMedida[];
  }

  async getById(id: number): Promise<IUnidadMedida | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM unidad_medida WHERE id_unidad = ?', 
      [id]
    );
    return rows[0] as IUnidadMedida || null;
  }

  async create(unidadMedidaData: Omit<IUnidadMedida, 'id_unidad'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO unidad_medida (descripcion, abreviacion) VALUES (?, ?)',
      [unidadMedidaData.descripcion, unidadMedidaData.abreviacion]
    );
    return result.insertId;
  }

  async update(id: number, unidadMedidaData: Partial<IUnidadMedida>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE unidad_medida SET descripcion = ?, abreviacion = ? WHERE id_unidad = ?',
      [unidadMedidaData.descripcion, unidadMedidaData.abreviacion, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM unidad_medida WHERE id_unidad = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}