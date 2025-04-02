import { Request, Response } from 'express';
import { RolService } from '../services/Rol.service';
import { IRol } from '../models/Rol.model';

const rolService = new RolService();

export class RolController {
  async getAll(req: Request, res: Response) {
    try {
      const roles = await rolService.getAll();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener roles' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const rol = await rolService.getById(parseInt(req.params.id));
      rol ? res.json(rol) : res.status(404).json({ error: 'Rol no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el rol' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newRol: Omit<IRol, 'id_rol'> = {
        descripcion: req.body.descripcion
      };
      const id = await rolService.create(newRol);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear rol' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await rolService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Rol no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar rol' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await rolService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Rol no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar rol' });
    }
  }
}