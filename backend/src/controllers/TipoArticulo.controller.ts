import { Request, Response } from 'express';
import { TipoArticuloService } from '../services/TipoArticulo.service';
import { ITipoArticulo } from '../models/TipoArticulo.model';

const tipoArticuloService = new TipoArticuloService();

export class TipoArticuloController {
  async getAll(req: Request, res: Response) {
    try {
      const tiposArticulos = await tipoArticuloService.getAll();
      res.json(tiposArticulos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener tipos de artículos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const tipoArticulo = await tipoArticuloService.getById(parseInt(req.params.id));
      tipoArticulo ? res.json(tipoArticulo) : res.status(404).json({ error: 'Tipo de artículo no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el tipo de artículo' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newTipoArticulo: Omit<ITipoArticulo, 'id_tipo_articulo'> = {
        descripcion: req.body.descripcion
      };
      const id = await tipoArticuloService.create(newTipoArticulo);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear tipo de artículo' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await tipoArticuloService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Tipo de artículo no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar tipo de artículo' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await tipoArticuloService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Tipo de artículo no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar marca' });
    }
  }
}