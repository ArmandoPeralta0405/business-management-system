import { IConfiguracionStock, IConfiguracionStockView, ConfiguracionStockModel } from '../models/ConfiguracionStock.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class ConfiguracionStockService extends ConfiguracionStockModel {
  async getAll(): Promise<IConfiguracionStockView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM configuracion_stock_view');
    return rows as IConfiguracionStockView[];
  }

  async getById(id: number): Promise<IConfiguracionStock | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM configuracion_stock WHERE id_configuracion = ?',
      [id]
    );
    return rows[0] as IConfiguracionStock || null;
  }

  async create(configuracionStockData: Omit<IConfiguracionStock, 'id_configuracion'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO configuracion_stock
      (descripcion, id_tipo_articulo_servicio, observacion)
      VALUES (?,?,?)`,
      [configuracionStockData.descripcion, configuracionStockData.id_tipo_articulo_servicio, configuracionStockData.observacion]
    );
    return result.insertId;
  }

  async update(id: number, configuracionStockData: Partial<IConfiguracionStock>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE configuracion_stock
      SET
        descripcion=?,
        id_tipo_articulo_servicio=?,
        observacion=?
      WHERE id_configuracion=?`,
      [configuracionStockData.descripcion, configuracionStockData.id_tipo_articulo_servicio, configuracionStockData.observacion, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM configuracion_stock WHERE id_configuracion = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}