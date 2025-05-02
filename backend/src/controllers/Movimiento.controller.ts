import { Request, Response } from 'express';
import { MovimientoService } from '../services/Movimiento.service';
import { IMovimiento, IMovimientoView } from '../models/Movimiento.model';

const movimientoService = new MovimientoService();

export class MovimientoController {
  async getAll(req: Request, res: Response) {
    try {
      const movimientos = await movimientoService.getAll();
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener movimientos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const movimiento = await movimientoService.getById(parseInt(req.params.id));
      movimiento ? res.json(movimiento) : res.status(404).json({ error: 'movimiento no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el movimiento' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newMovimiento: Omit<IMovimiento, 'id_movimiento'> = {
        descripcion: req.body.descripcion,
        abreviacion: req.body.abreviacion,
        observacion: req.body.observacion,
        afecta_stock: req.body.afecta_stock,
        tipo_movimiento: req.body.tipo_movimiento,
        estado: req.body.estado
      };
      const id = await movimientoService.create(newMovimiento);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear Movimiento' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await movimientoService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Movimiento no encontrada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar Movimiento' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await movimientoService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Movimiento no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar Movimiento' });
    }
  }

  async getMovimientosStock(req: Request, res: Response) {
    try {
      const movimientos = await movimientoService.getMovimientosStock();
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener movimientos de stock' });
    }
  }

}