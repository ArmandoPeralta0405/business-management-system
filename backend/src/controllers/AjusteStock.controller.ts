import { Request, Response } from 'express';
import { AjusteStockService } from '../services/AjusteStock.service';
import { IAjusteStock, IAjusteStockView } from '../models/AjusteStock.model';

const ajusteStockService = new AjusteStockService();

export class AjusteStockController {
  async getAll(req: Request, res: Response) {
    try {
      const ajustes_stocks = await ajusteStockService.getAll();
      res.json(ajustes_stocks);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ajustes de stocks' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const ajuste_stock = await ajusteStockService.getById(parseInt(req.params.id));
      ajuste_stock ? res.json(ajuste_stock) : res.status(404).json({ error: 'Ajuste de stock no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el ajuste de stock' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newAjusteStock: Omit<IAjusteStock, 'id_ajuste'> = {
        id_empresa: req.body.id_empresa,
        id_sucursal: req.body.id_sucursal,
        id_deposito: req.body.id_deposito,
        numero_comprobante: req.body.numero_comprobante,
        fecha_hora: req.body.fecha_hora,
        id_movimiento: req.body.id_movimiento,
        observacion: req.body.observacion,
        id_usuario: req.body.id_usuario
      };
      const id = await ajusteStockService.create(newAjusteStock);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear ajuste de stock' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updateAjusteStock: Partial<IAjusteStock> = {
        id_empresa: req.body.id_empresa,
        id_sucursal: req.body.id_sucursal,
        id_deposito: req.body.id_deposito,
        numero_comprobante: req.body.numero_comprobante,
        fecha_hora: req.body.fecha_hora,
        id_movimiento: req.body.id_movimiento,
        observacion: req.body.observacion,
        id_usuario: req.body.id_usuario
      };
      const updated = await ajusteStockService.update(
        parseInt(req.params.id),
        updateAjusteStock
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Ajuste de stock no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar ajuste de stock' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await ajusteStockService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Ajuste de stock no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar ajuste de stock' });
    }
  }
}