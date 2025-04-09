import { IEmpresa, IEmpresaView, EmpresaModel } from '../models/Empresa.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class EmpresaService extends EmpresaModel {
  async getAll(): Promise<IEmpresaView[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM empresa_view');
    return rows as IEmpresaView[];
  }

  async getById(id: number): Promise<IEmpresa | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM empresa WHERE id_empresa = ?', 
      [id]
    );
    return rows[0] as IEmpresa || null;
  }

  async create(empresaData: Omit<IEmpresa, 'id_empresa'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO empresa 
      (razon_social, 
      nombre_comercial, 
      ruc, 
      dv, 
      direccion, 
      telefono, 
      email, 
      id_ciudad, 
      fecha_constitucion, 
      representante_legal, 
      estado) 
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [empresaData.razon_social, 
        empresaData.nombre_comercial, 
        empresaData.ruc, 
        empresaData.dv, 
        empresaData.direccion, 
        empresaData.telefono, 
        empresaData.email, 
        empresaData.id_ciudad, 
        empresaData.fecha_constitucion, 
        empresaData.representante_legal,
        empresaData.estado]
    );
    return result.insertId;
  }

  async update(id: number, empresaData: Partial<IEmpresa>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `
      UPDATE empresa SET 
        razon_social = ?,
        nombre_comercial = ?,
        ruc = ?,
        dv = ?,
        direccion = ?,
        telefono = ?,
        email = ?,
        id_ciudad = ?,
        fecha_constitucion = ?,
        representante_legal = ?,
        estado = ?
      WHERE id_empresa = ?;
      `,
      [empresaData.razon_social, 
        empresaData.nombre_comercial, 
        empresaData.ruc, 
        empresaData.dv,
        empresaData.direccion,
        empresaData.telefono,
        empresaData.email,
        empresaData.id_ciudad,
        empresaData.fecha_constitucion,
        empresaData.representante_legal,
        empresaData.estado,
        id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM empresa WHERE id_empresa = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}