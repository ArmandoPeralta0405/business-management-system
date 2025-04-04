import { IDepartamento, IDepartamentoView, DepartamentoModel } from '../models/Departamento.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class DepartamentoService extends DepartamentoModel {
  async getAll(): Promise<IDepartamentoView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM departamento_view');
    return rows as IDepartamentoView[];
  }

  async getById(id: number): Promise<IDepartamentoView | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM departamento_view WHERE id_departamento = ?', 
      [id]
    );
    return rows[0] as IDepartamentoView || null;
  }

  async create(departamentoData: Omit<IDepartamento, 'id_departamento'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO departamento (id_pais, descripcion) VALUES (?, ?)',
      [departamentoData.id_pais, departamentoData.descripcion]
    );
    return result.insertId;
  }

  async update(id: number, departamentoData: Partial<IDepartamento>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE departamento SET id_pais = ?, descripcion = ? WHERE id_departamento = ?',
      [departamentoData.id_pais, departamentoData.descripcion, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM departamento WHERE id_departamento = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}