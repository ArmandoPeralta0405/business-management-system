import { ICodigoBarra, ICodigoBarraView, CodigoBarraModel } from '../models/CodigoBarra.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class CodigoBarraService extends CodigoBarraModel {
  async getAll(): Promise<ICodigoBarraView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM codigo_barra_view');
    return rows as ICodigoBarraView[];
  }

  async getById(id_codigo: number, id_articulo: number): Promise<ICodigoBarra | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM codigo_barra WHERE id_codigo = ? AND id_articulo = ?', 
      [id_codigo, id_articulo]
    );
    return rows[0] as ICodigoBarra || null;
  }

  async create(codigobarraData: Omit<ICodigoBarra, 'id_codigo'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO codigo_barra (id_articulo, codigo_barra, id_tipo, estado) VALUES (?, ?, ?, ?)',
      [codigobarraData.id_articulo, codigobarraData.codigo_barra, codigobarraData.id_tipo, codigobarraData.estado]
    );
    return result.insertId;
  }

  async update(id_codigo: number, id_articulo: number, codigoBarraData: Partial<ICodigoBarra>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE codigo_barra SET codigo_barra = ?, id_tipo = ?, estado = ? WHERE id_codigo = ? AND id_articulo = ?',
      [codigoBarraData.codigo_barra, codigoBarraData.id_tipo, codigoBarraData.estado, id_codigo, id_articulo]
    );
    return result.affectedRows > 0;
  }

  async delete(id_codigo: number, id_articulo: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM codigo_barra WHERE id_codigo = ? AND id_articulo = ?',
      [id_codigo, id_articulo]
    );
    return result.affectedRows > 0;
  }
}