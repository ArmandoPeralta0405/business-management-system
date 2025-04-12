import { IDeposito, IDepositoView, DepositoModel } from '../models/Deposito.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class DepositoService extends DepositoModel {
    async getAll(): Promise<IDepositoView[]> {
        /*const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT d.*, s.descripcion AS sucursal_descripcion, e.razon_social AS empresa_descripcion
            FROM deposito d
            JOIN sucursal s ON d.id_sucursal = s.id_sucursal AND d.id_empresa = s.id_empresa
            JOIN empresa e ON s.id_empresa = e.id_empresa
        `);*/
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT *
            FROM deposito_view;
        `);
        return rows as IDepositoView[];
    }

    async getById(id: number): Promise<IDeposito | null> {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT *
            FROM deposito 
            WHERE id_deposito = ?
        `, [id]);
        return rows[0] as IDepositoView || null;
    }

    async getBySucursal(id_sucursal: number, id_empresa: number): Promise<IDeposito[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM deposito WHERE id_sucursal = ? AND id_empresa = ?',
            [id_sucursal, id_empresa]
        );
        return rows as IDeposito[];
    }

    async create(depositoData: Omit<IDeposito, 'id_deposito'>): Promise<number> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO deposito (descripcion, id_sucursal, id_empresa) VALUES (?, ?, ?)',
            [depositoData.descripcion, depositoData.id_sucursal, depositoData.id_empresa]
        );
        return result.insertId;
    }

    async update(id: number, depositoData: Partial<IDeposito>): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE deposito SET ? WHERE id_deposito = ?',
            [depositoData, id]
        );
        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM deposito WHERE id_deposito = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}