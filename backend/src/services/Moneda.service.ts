import { IMoneda, IMonedaView, MonedaModel } from '../models/Moneda.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class MonedaService extends MonedaModel {
  
  async getAll(): Promise<IMonedaView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM moneda_view');
    return rows as IMonedaView[];
  }

  async getById(id: number): Promise<IMoneda | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM moneda WHERE id_moneda = ?', 
      [id]
    );
    return rows[0] as IMoneda || null;
  }

  async create(monedaData: Omit<IMoneda, 'id_moneda'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO moneda (descripcion, abreviacion, codigo_iso, simbolo, estado, decimales) VALUES (?, ?, ?, ?, ?, ?)',
      [monedaData.descripcion, monedaData.abreviacion, monedaData.codigo_iso, monedaData.simbolo, monedaData.estado, monedaData.decimales]
    );
    return result.insertId;
  }

  async update(id: number, monedaData: Partial<IMoneda>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE moneda SET descripcion = ?, abreviacion = ?, codigo_iso = ?, simbolo = ?, estado = ?, decimales = ? WHERE id_moneda = ?',
      [monedaData.descripcion, monedaData.abreviacion, monedaData.codigo_iso, monedaData.simbolo, monedaData.estado, monedaData.decimales, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM moneda WHERE id_moneda = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}