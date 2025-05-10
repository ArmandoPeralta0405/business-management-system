import { Request, Response } from 'express';
import { MonedaService } from '../services/Moneda.service';
import { IMoneda, IMonedaView } from '../models/Moneda.model';

const monedaService = new MonedaService();

export class MonedaController {
  async getAll(req: Request, res: Response) {
    try {
      const monedas = await monedaService.getAll();
      res.json(monedas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener Monedas' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const moneda = await monedaService.getById(parseInt(req.params.id));
      moneda ? res.json(moneda) : res.status(404).json({ error: 'Moneda no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el Moneda' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newMoneda: Omit<IMoneda, 'id_moneda'> = {
        descripcion: req.body.descripcion,
        abreviacion: req.body.abreviacion,
        codigo_iso: req.body.codigo_iso,
        simbolo: req.body.simbolo,
        estado: req.body.estado,
        decimales: req.body.decimales
      };
      const id = await monedaService.create(newMoneda);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear Moneda' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await monedaService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Moneda no encontrada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar Moneda' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await monedaService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Moneda no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar Moneda' });
    }
  }
}