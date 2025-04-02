import { Request, Response } from 'express';
import { UsuarioService } from '../services/Usuario.service';
import { IUsuario } from '../models/Usuario.model';

const usuarioService = new UsuarioService();

export class UsuarioController {
    async getAll(req: Request, res: Response) {
        try {
            const usuarios = await usuarioService.getAll();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const usuario = await usuarioService.getById(parseInt(req.params.id));
            usuario 
                ? res.json(usuario) 
                : res.status(404).json({ error: 'Usuario no encontrado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el usuario' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const newUsuario: Omit<IUsuario, 'id_usuario' | 'fecha_registro' | 'fecha_actualizacion'> = {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                cedula: req.body.cedula,
                telefono: req.body.telefono,
                direccion: req.body.direccion,
                correo_electronico: req.body.correo_electronico,
                alias: req.body.alias,
                clave: req.body.clave,
                estado: req.body.estado ?? true
            };
            const id = await usuarioService.create(newUsuario);
            res.status(201).json({ id });
        } catch (error) {
            res.status(400).json({ error: 'Error al crear usuario' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const updated = await usuarioService.update(
                parseInt(req.params.id),
                req.body
            );
            updated 
                ? res.json({ success: true }) 
                : res.status(404).json({ error: 'Usuario no encontrado' });
        } catch (error) {
            res.status(400).json({ error: 'Error al actualizar usuario' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const deleted = await usuarioService.delete(parseInt(req.params.id));
            deleted 
                ? res.json({ success: true }) 
                : res.status(404).json({ error: 'Usuario no encontrado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar usuario' });
        }
    }
}