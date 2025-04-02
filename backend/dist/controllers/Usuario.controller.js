"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const Usuario_service_1 = require("../services/Usuario.service");
const usuarioService = new Usuario_service_1.UsuarioService();
class UsuarioController {
    async getAll(req, res) {
        try {
            const usuarios = await usuarioService.getAll();
            res.json(usuarios);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }
    async getById(req, res) {
        try {
            const usuario = await usuarioService.getById(parseInt(req.params.id));
            usuario
                ? res.json(usuario)
                : res.status(404).json({ error: 'Usuario no encontrado' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener el usuario' });
        }
    }
    async create(req, res) {
        try {
            const newUsuario = {
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
        }
        catch (error) {
            res.status(400).json({ error: 'Error al crear usuario' });
        }
    }
    async update(req, res) {
        try {
            const updated = await usuarioService.update(parseInt(req.params.id), req.body);
            updated
                ? res.json({ success: true })
                : res.status(404).json({ error: 'Usuario no encontrado' });
        }
        catch (error) {
            res.status(400).json({ error: 'Error al actualizar usuario' });
        }
    }
    async delete(req, res) {
        try {
            const deleted = await usuarioService.delete(parseInt(req.params.id));
            deleted
                ? res.json({ success: true })
                : res.status(404).json({ error: 'Usuario no encontrado' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar usuario' });
        }
    }
}
exports.UsuarioController = UsuarioController;
