import { Request, Response } from 'express';
import { ModuloService } from '../services/Modulo.service';
import { IModulo, IModuloView } from '../models/Modulo.model';

const moduloService = new ModuloService();

export class ModuloController {
  async getAll(req: Request, res: Response) {
    try {
      const modulos = await moduloService.getAll();
      res.json(modulos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener modulos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const modulo = await moduloService.getById(parseInt(req.params.id));
      modulo ? res.json(modulo) : res.status(404).json({ error: 'Modulo no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el modulo' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newModulo: Omit<IModulo, 'id_modulo'> = {
        descripcion: req.body.descripcion,
        icono: req.body.icono,
        orden: req.body.orden,
        estado: req.body.estado
      };
      const id = await moduloService.create(newModulo);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear modulo' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await moduloService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Modulo no encontrada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar modulo' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await moduloService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Modulo no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar modulo' });
    }
  }
}