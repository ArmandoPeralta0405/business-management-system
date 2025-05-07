import { Request, Response } from 'express';
import { ConfiguracionStockService } from '../services/ConfiguracionStock.service';
import { IConfiguracionStock, IConfiguracionStockView } from '../models/ConfiguracionStock.model';

const configuracionStockService = new ConfiguracionStockService();

export class ConfiguracionStoclController {
  async getAll(req: Request, res: Response) {
    try {
      const configuraciones_stocks = await configuracionStockService.getAll();
      res.json(configuraciones_stocks);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener configuraciones de stock' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const configuracion_stock = await configuracionStockService.getById(parseInt(req.params.id));
      configuracion_stock ? res.json(configuracion_stock) : res.status(404).json({ error: 'Configuracion de stock no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la ciudad' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newConfiguracionStock: Omit<IConfiguracionStock, 'id_configuracion'> = {
        descripcion: req.body.descripcion,
        id_tipo_articulo_servicio: req.body.id_tipo_articulo_servicio,
        observacion: req.body.observacion
      };
      const id = await configuracionStockService.create(newConfiguracionStock);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear configuracion de stock' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await configuracionStockService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Configuracion de stock no encontrada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar configuracion de stock' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await configuracionStockService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Configuracion de stock no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar configuracion de stock' });
    }
  }
}