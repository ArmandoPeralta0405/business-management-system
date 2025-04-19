import { IImpuesto, ImpuestoModel } from '../models/Impuesto.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class ImpuestoService extends ImpuestoModel {
  async getAll(): Promise<IImpuesto[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM impuesto');
    return rows as IImpuesto[];
  }

  async getById(id: number): Promise<IImpuesto | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM impuesto WHERE id_impuesto = ?', 
      [id]
    );
    return rows[0] as IImpuesto || null;
  }

  async create(impuestoData: Omit<IImpuesto, 'id_impuesto'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO impuesto (descripcion, valor_calculo, abreviacion) VALUES (?, ?, ?)',
      [impuestoData.descripcion, impuestoData.valor_calculo, impuestoData.abreviacion]
    );
    return result.insertId;
  }

  async update(id: number, impuestoData: Partial<IImpuesto>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE impuesto SET descripcion = ?, valor_calculo = ?, abreviacion = ? WHERE id_impuesto = ?',
      [impuestoData.descripcion, impuestoData.valor_calculo, impuestoData.abreviacion, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM impuesto WHERE id_impuesto = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}