import { IUsuario, UsuarioModel } from '../models/Usuario.model';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import bcrypt from 'bcrypt';

export class UsuarioService extends UsuarioModel {
    // Obtener todos los usuarios (sin la clave por seguridad)
    async getAll(): Promise<IUsuario[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_usuario, nombre, apellido, cedula, telefono, direccion, correo_electronico, alias, estado, fecha_registro, fecha_actualizacion FROM usuario'
        );
        return rows as IUsuario[];
    }

    // Obtener usuario por ID (sin la clave)
    async getById(id_usuario: number): Promise<IUsuario | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_usuario, nombre, apellido, cedula, telefono, direccion, correo_electronico, alias, estado, fecha_registro, fecha_actualizacion FROM usuario WHERE id_usuario = ?',
            [id_usuario]
        );
        return rows[0] as IUsuario || null;
    }

    // Buscar usuario por alias (útil para login)
    async getByAlias(alias: string): Promise<IUsuario | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM usuario WHERE alias = ?',
            [alias]
        );
        return rows[0] as IUsuario || null;
    }

    // Buscar usuario por email (útil para login por email)
    async getByEmail(email: string): Promise<IUsuario | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM usuario WHERE correo_electronico = ?',
            [email]
        );
        return rows[0] as IUsuario || null;
    }

    // Crear usuario (encriptando la clave)
    async create(usuarioData: Omit<IUsuario, 'id_usuario' | 'fecha_registro' | 'fecha_actualizacion'>): Promise<number> {
        const hashedClave = await bcrypt.hash(usuarioData.clave, 10); // Encriptación con bcrypt
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO usuario (nombre, apellido, cedula, telefono, direccion, correo_electronico, alias, clave, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                usuarioData.nombre,
                usuarioData.apellido,
                usuarioData.cedula,
                usuarioData.telefono,
                usuarioData.direccion,
                usuarioData.correo_electronico,
                usuarioData.alias,
                hashedClave, // Guardamos el hash, no la clave plana
                usuarioData.estado ?? true // Valor por defecto: true (activo)
            ]
        );
        return result.insertId;
    }

    // Actualizar usuario (sin tocar la clave a menos que se especifique)
    async update(id_usuario: number, usuarioData: Partial<IUsuario>): Promise<boolean> {
        let query = 'UPDATE usuario SET ';
        const updates: string[] = [];
        const values: any[] = [];

        // Construir dinámicamente la consulta
        if (usuarioData.nombre) { updates.push('nombre = ?'); values.push(usuarioData.nombre); }
        if (usuarioData.apellido) { updates.push('apellido = ?'); values.push(usuarioData.apellido); }
        if (usuarioData.telefono) { updates.push('telefono = ?'); values.push(usuarioData.telefono); }
        if (usuarioData.direccion) { updates.push('direccion = ?'); values.push(usuarioData.direccion); }
        if (usuarioData.correo_electronico) { updates.push('correo_electronico = ?'); values.push(usuarioData.correo_electronico); }
        if (usuarioData.alias) { updates.push('alias = ?'); values.push(usuarioData.alias); }
        if (usuarioData.estado !== undefined) { updates.push('estado = ?'); values.push(usuarioData.estado); }
        if (usuarioData.clave) { 
            const hashedClave = await bcrypt.hash(usuarioData.clave, 10); 
            updates.push('clave = ?'); 
            values.push(hashedClave); 
        }

        if (updates.length === 0) return false; // No hay nada que actualizar

        query += updates.join(', ') + ' WHERE id_usuario = ?';
        values.push(id_usuario);

        const [result] = await pool.query<ResultSetHeader>(query, values);
        return result.affectedRows > 0;
    }

    // Eliminar usuario (cambiar estado a false en lugar de borrar físicamente)
    async delete(id_usuario: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE usuario SET estado = false WHERE id_usuario = ?',
            [id_usuario]
        );
        return result.affectedRows > 0;
    }
}
