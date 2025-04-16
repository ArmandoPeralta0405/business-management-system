import { IPrograma, IProgramaView, ProgramaModel } from '../models/Programa.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class ProgramaService extends ProgramaModel {
  async getAll(): Promise<IProgramaView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM programa_view');
    return rows as IProgramaView[];
  }

  async getById(id: number): Promise<IPrograma | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM programa WHERE id_programa = ?', 
      [id]
    );
    return rows[0] as IPrograma || null;
  }

  async create(programaData: Omit<IPrograma, 'id_programa'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO programa (id_modulo, nombre, ruta, estado, id_categoria) VALUES (?, ?, ?, ?, ?)',
      [programaData.id_modulo, programaData.nombre, programaData.ruta, programaData.estado, programaData.id_categoria]
    );
    return result.insertId;
  }

  async update(id: number, programaData: Partial<IPrograma>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE programa SET id_modulo = ?, nombre = ?, ruta = ?, estado = ?, id_categoria = ? WHERE id_programa = ?',
      [programaData.id_modulo, programaData.nombre, programaData.ruta, programaData.estado, programaData.id_categoria, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM programa WHERE id_programa = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}