import { IAjusteStock, IAjusteStockView, AjusteStockModel, IAjusteStockFiltros } from '../models/AjusteStock.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class AjusteStockService extends AjusteStockModel {

  async fetchNextNumeroComprobante(): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>('CALL pa_ajuste_stock_next_nro_comprobante()');
    return rows[0][0].numero_comprobante;
  }
  
  async getAll(): Promise<IAjusteStockView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM ajuste_stock_view');
    return rows as IAjusteStockView[];
  }

  async getById(id: number): Promise<IAjusteStock | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM ajuste_stock WHERE id_ajuste = ?', 
      [id]
    );
    return rows[0] as IAjusteStock || null;
  }

  async create(ajusteStockData: Omit<IAjusteStock, 'id_ajuste'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO ajuste_stock (id_empresa, id_sucursal, id_deposito, numero_comprobante, fecha_hora, id_movimiento, observacion, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        ajusteStockData.id_empresa,
        ajusteStockData.id_sucursal,
        ajusteStockData.id_deposito,
        ajusteStockData.numero_comprobante,
        ajusteStockData.fecha_hora,
        ajusteStockData.id_movimiento,
        ajusteStockData.observacion,
        ajusteStockData.id_usuario
      ]
    );
    
    return result.insertId;
  }

  async update(id: number, ajusteStockData: Partial<IAjusteStock>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE ajuste_stock SET id_empresa = ?, id_sucursal = ?, id_deposito = ?, numero_comprobante = ?, fecha_hora = ?, id_movimiento = ?, observacion = ?, id_usuario = ? WHERE id_ajuste = ?',
      [
        ajusteStockData.id_empresa,
        ajusteStockData.id_sucursal,
        ajusteStockData.id_deposito,
        ajusteStockData.numero_comprobante,
        ajusteStockData.fecha_hora,
        ajusteStockData.id_movimiento,
        ajusteStockData.observacion,
        ajusteStockData.id_usuario,
        id
      ]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM ajuste_stock WHERE id_ajuste = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
  
  async getByFiltros(filtros: IAjusteStockFiltros): Promise<IAjusteStockView[]> {
    let query = 'SELECT * FROM ajuste_stock_view WHERE fecha BETWEEN ? AND ?';
    const params: any[] = [filtros.fechaInicial, filtros.fechaFinal];
    
    // Agregar filtro de movimiento si está presente
    if (filtros.id_movimiento) {
      query += ' AND id_movimiento = ?';
      params.push(filtros.id_movimiento);
    }
    
    // Ordenar por fecha
    query += ' ORDER BY fecha DESC, hora DESC';
    
    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as IAjusteStockView[];
  }
}