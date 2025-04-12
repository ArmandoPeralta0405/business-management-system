import { ISucursal, ISucursalView, SucursalModel } from '../models/Sucursal.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class SucursalService extends SucursalModel {

  async getAll(): Promise<ISucursalView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM sucursal_view');
    return rows as ISucursalView[];
  }

  async getByEmpresa(id_empresa: number): Promise<ISucursalView[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM sucursal_view WHERE id_empresa = ?',
        [id_empresa]
    );
    return rows as ISucursalView[];
}

  async getById(id_sucursal: number, id_empresa: number): Promise<ISucursal | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM sucursal WHERE id_sucursal = ? AND id_empresa = ?',
      [id_sucursal, id_empresa]
    );
    return rows[0] as ISucursal || null;
  }

  async create(sucursalData: Omit<ISucursal, 'id_sucursal'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO sucursal
      (id_empresa, 
      descripcion, 
      direccion, 
      telefono, 
      email, 
      id_ciudad, 
      casa_central, 
      estado)
      VALUES 
      (?, 
      ?, 
      ?, 
      ?, 
      ?, 
      ?, 
      ?, 
      ?);`,
      [sucursalData.id_empresa,
      sucursalData.descripcion,
      sucursalData.direccion,
      sucursalData.telefono,
      sucursalData.email,
      sucursalData.id_ciudad,
      sucursalData.casa_central,
      sucursalData.estado]
    );
    return result.insertId;
  }

  async update(id_sucursal: number, id_empresa: number, sucursalData: Partial<ISucursal>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE sucursal
      SET
        descripcion=?,
        direccion=?,
        telefono=?,
        email=?,
        id_ciudad=?,
        casa_central=?,
        estado=?
      WHERE id_sucursal= ?
      AND id_empresa = ?;
      `,
      [sucursalData.descripcion,
      sucursalData.direccion,
      sucursalData.telefono,
      sucursalData.email,
      sucursalData.id_ciudad,
      sucursalData.casa_central,
      sucursalData.estado,
      id_sucursal, 
      id_empresa]
    );
    return result.affectedRows > 0;
  }

  async delete(id_sucursal: number, id_empresa: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM sucursal WHERE id_sucursal = ? AND id_empresa = ?',
      [id_sucursal, id_empresa]
    );
    return result.affectedRows > 0;
  }
}