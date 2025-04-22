import { Request, Response } from 'express';
import { TipoBarraService } from '../services/TipoBarra.service';
import { ITipoBarra } from '../models/TipoBarra.model';

const tipoBarraService = new TipoBarraService();

export class TipoBarraController {
  async getAll(req: Request, res: Response) {
    try {
      const tiposBarras = await tipoBarraService.getAll();
      res.json(tiposBarras);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener tipos de barra' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const tipoBarra = await tipoBarraService.getById(parseInt(req.params.id));
      tipoBarra ? res.json(tipoBarra) : res.status(404).json({ error: 'Tipo de barra no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el tipo de barra' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newTipoBarra: Omit<ITipoBarra, 'id_tipo'> = {
        descripcion: req.body.descripcion
      };
      const id = await tipoBarraService.create(newTipoBarra);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear tipo de barra' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await tipoBarraService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Tipo de barra no encontrada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar tipo de barra' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await tipoBarraService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Tipo de barra no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar tipo de barra' });
    }
  }
}