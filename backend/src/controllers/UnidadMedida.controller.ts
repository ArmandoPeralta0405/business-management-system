import { Request, Response } from 'express';
import { UnidadMedidaService } from '../services/UnidadMedida.service';
import { IUnidadMedida } from '../models/UnidadMedida.model';

const unidadMedidaService = new UnidadMedidaService();

export class UnidadMedidaController {
  async getAll(req: Request, res: Response) {
    try {
      const unidadesMedida = await unidadMedidaService.getAll();
      res.json(unidadesMedida);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener unidades de medida' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const unidadMedida = await unidadMedidaService.getById(parseInt(req.params.id));
      unidadMedida ? res.json(unidadMedida) : res.status(404).json({ error: 'Unidad de medida no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la unidad de medida' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newUnidadMedida: Omit<IUnidadMedida, 'id_unidad'> = {
        descripcion: req.body.descripcion,
        abreviacion: req.body.abreviacion
      };
      const id = await unidadMedidaService.create(newUnidadMedida);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear unidad de medida' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await unidadMedidaService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Unidad de medida no encontrada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar unidad de medida' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await unidadMedidaService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Unidad de medida no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar marca' });
    }
  }
}