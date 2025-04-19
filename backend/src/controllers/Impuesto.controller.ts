import { Request, Response } from 'express';
import { ImpuestoService } from '../services/Impuesto.service';
import { IImpuesto } from '../models/Impuesto.model';

const impuestoService = new ImpuestoService();

export class ImpuestoController {
  async getAll(req: Request, res: Response) {
    try {
      const impuestos = await impuestoService.getAll();
      res.json(impuestos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener impuestos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const impuesto = await impuestoService.getById(parseInt(req.params.id));
      impuesto ? res.json(impuesto) : res.status(404).json({ error: 'Impuesto no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el impuesto' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newImpuesto: Omit<IImpuesto, 'id_impuesto'> = {
        descripcion: req.body.descripcion,
        valor_calculo: req.body.valor_calculo,
        abreviacion: req.body.abreviacion
      };
      const id = await impuestoService.create(newImpuesto);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear impuesto' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await impuestoService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Impuesto no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar impuesto' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await impuestoService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Impuesto no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar impuesto' });
    }
  }
}