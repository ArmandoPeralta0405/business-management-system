import { Request, Response } from 'express';
import { DetalleAjusteStockService } from '../services/DetalleAjusteStock.service';
import { IDetalleAjusteStock } from '../models/DetalleAjusteStock.model';

const detalleAjusteStockService = new DetalleAjusteStockService();

export class DetalleAjusteStockController {
  async getAll(req: Request, res: Response) {
    try {
      const detalles_ajustes_stocks = await detalleAjusteStockService.getAll();
      res.json(detalles_ajustes_stocks);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los detalles de ajustes de stock' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id_ajuste, id_articulo, numero_item } = req.params;
      const detalle_ajuste_stock = await detalleAjusteStockService.getById(
        parseInt(id_ajuste),
        parseInt(id_articulo),
        parseInt(numero_item)
      );
      detalle_ajuste_stock 
        ? res.json(detalle_ajuste_stock) 
        : res.status(404).json({ error: 'Detalle de ajuste de stock no encontrado' });
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al obtener el detalle de ajuste de stock',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newDetalleAjusteStock: IDetalleAjusteStock = {
        id_ajuste: req.body.id_ajuste,
        id_articulo: req.body.id_articulo,
        numero_item: req.body.numero_item,
        cantidad: req.body.cantidad
      };
      const ids = await detalleAjusteStockService.create(newDetalleAjusteStock);
      res.status(201).json(ids);
    } catch (error) {
      res.status(400).json({ 
        error: 'Error al crear detalle de ajuste de stock',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id_ajuste, id_articulo, numero_item } = req.params;
      const updateData: Partial<IDetalleAjusteStock> = {
        cantidad: req.body.cantidad
      };
      const updated = await detalleAjusteStockService.update(
        parseInt(id_ajuste),
        parseInt(id_articulo),
        parseInt(numero_item),
        updateData
      );
      updated 
        ? res.json({ success: true }) 
        : res.status(404).json({ error: 'Detalle de ajuste de stock no encontrado' });
    } catch (error) {
      res.status(400).json({ 
        error: 'Error al actualizar detalle de ajuste de stock',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id_ajuste, id_articulo, numero_item } = req.params;
      const deleted = await detalleAjusteStockService.delete(
        parseInt(id_ajuste),
        parseInt(id_articulo),
        parseInt(numero_item)
      );
      deleted 
        ? res.json({ success: true }) 
        : res.status(404).json({ error: 'Detalle de ajuste de stock no encontrado' });
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al eliminar detalle de ajuste de stock',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }
}