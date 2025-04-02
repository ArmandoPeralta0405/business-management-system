"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolController = void 0;
const Rol_service_1 = require("../services/Rol.service");
const rolService = new Rol_service_1.RolService();
class RolController {
    async getAll(req, res) {
        try {
            const roles = await rolService.getAll();
            res.json(roles);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener roles' });
        }
    }
    async getById(req, res) {
        try {
            const rol = await rolService.getById(parseInt(req.params.id));
            rol ? res.json(rol) : res.status(404).json({ error: 'Rol no encontrado' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener el rol' });
        }
    }
    async create(req, res) {
        try {
            const newRol = {
                descripcion: req.body.descripcion
            };
            const id = await rolService.create(newRol);
            res.status(201).json({ id });
        }
        catch (error) {
            res.status(400).json({ error: 'Error al crear rol' });
        }
    }
    async update(req, res) {
        try {
            const updated = await rolService.update(parseInt(req.params.id), req.body);
            updated ? res.json({ success: true }) : res.status(404).json({ error: 'Rol no encontrado' });
        }
        catch (error) {
            res.status(400).json({ error: 'Error al actualizar rol' });
        }
    }
    async delete(req, res) {
        try {
            const deleted = await rolService.delete(parseInt(req.params.id));
            deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Rol no encontrado' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar rol' });
        }
    }
}
exports.RolController = RolController;
