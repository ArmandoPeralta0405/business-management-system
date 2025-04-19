import { Request, Response } from 'express';
import { LineaService } from '../services/Linea.service';
import { ILinea, ILineaView } from '../models/Linea.model';

const lineaService = new LineaService();

export class LineaController {
  async getAll(req: Request, res: Response) {
    try {
      const lineas = await lineaService.getAll();
      res.json(lineas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener lineas' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const linea = await lineaService.getById(parseInt(req.params.id));
      linea ? res.json(linea) : res.status(404).json({ error: 'Linea no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la linea' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newLinea: Omit<ILinea, 'id_linea'> = {
        descripcion: req.body.descripcion,
        id_categoria: req.body.id_categoria
      };
      const id = await lineaService.create(newLinea);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear linea' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await lineaService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Linea no encontrada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar linea' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await lineaService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Linea no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar linea' });
    }
  }
}