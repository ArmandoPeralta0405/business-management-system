import { IArticulo, IArticuloView, ArticuloModel } from '../models/Articulo.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class ArticuloService extends ArticuloModel {

  async getAll(): Promise<IArticuloView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM articulo_view');
    return rows as IArticuloView[];
  }

  async getArticulosActivos(): Promise<IArticuloView[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM articulo_view WHERE estado = 'Activo'`);
    return rows as IArticuloView[];
  }

  async getById(id: number): Promise<IArticulo | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM articulo WHERE id_articulo = ?', 
      [id]
    );
    return rows[0] as IArticulo || null;
  }

  async create(articuloData: Omit<IArticulo, 'id_articulo'>): Promise<number> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO articulo (codigo_alfanumerico, descripcion, id_categoria, id_linea, id_marca, id_tipo, id_unidad, id_impuesto, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [articuloData.codigo_alfanumerico, articuloData.descripcion, articuloData.id_categoria, articuloData.id_linea, articuloData.id_marca, articuloData.id_tipo, articuloData.id_unidad, articuloData.id_impuesto, articuloData.estado]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error al crear artículo:', error);
      throw new Error('Error al crear artículo');
    }
  }

  async update(id: number, articuloData: Partial<IArticulo>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE articulo SET codigo_alfanumerico = ?, descripcion = ?, id_categoria = ?, id_linea = ?, id_marca = ?, id_tipo = ?, id_unidad = ?, id_impuesto = ?, estado = ? WHERE id_articulo = ?',
      [articuloData.codigo_alfanumerico, articuloData.descripcion, articuloData.id_categoria, articuloData.id_linea, articuloData.id_marca, articuloData.id_tipo, articuloData.id_unidad, articuloData.id_impuesto, articuloData.estado, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM articulo WHERE id_articulo = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}