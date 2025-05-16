import { IProveedor, IProveedorView, ProveedorModel } from '../models/Proveedor.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class ProveedorService extends ProveedorModel {
  async getAll(): Promise<IProveedorView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM proveedor_view');
    return rows as IProveedorView[];
  }

  async getById(id: number): Promise<IProveedor | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM proveedor WHERE id_proveedor = ?', 
      [id]
    );
    return rows[0] as IProveedor || null;
  }

  async create(proveedorData: Omit<IProveedor, 'id_proveedor'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO proveedor
      (razon_social, nombre_fantasia, ruc, cedula, id_ciudad, direccion, email, telefono, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [proveedorData.razon_social, proveedorData.nombre_fantasia, proveedorData.ruc, proveedorData.cedula, proveedorData.id_ciudad, proveedorData.direccion, proveedorData.email, proveedorData.telefono, proveedorData.estado]
    );
    return result.insertId;
  }

  async update(id: number, proveedorData: Partial<IProveedor>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE proveedor
        SET
          razon_social=?,
          nombre_fantasia=?,
          ruc=?,
          cedula=?,
          id_ciudad=?,
          direccion=?,
          email=?,
          telefono=?,
          estado=?
        WHERE id_proveedor=?;`,
      [proveedorData.razon_social, proveedorData.nombre_fantasia, proveedorData.ruc, proveedorData.cedula, proveedorData.id_ciudad, proveedorData.direccion, proveedorData.email, proveedorData.telefono, proveedorData.estado, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM proveedor WHERE id_proveedor = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}