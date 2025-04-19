import { Request, Response } from 'express';
import { MarcaService } from '../services/Marca.service';
import { IMarca } from '../models/Marca.model';

const marcaService = new MarcaService();

export class MarcaController {
  async getAll(req: Request, res: Response) {
    try {
      const marcas = await marcaService.getAll();
      res.json(marcas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener marcas' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const marca = await marcaService.getById(parseInt(req.params.id));
      marca ? res.json(marca) : res.status(404).json({ error: 'Marca no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la marca' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newMarca: Omit<IMarca, 'id_marca'> = {
        descripcion: req.body.descripcion
      };
      const id = await marcaService.create(newMarca);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear marca' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await marcaService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Marca no encontrada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar marca' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await marcaService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Marca no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar marca' });
    }
  }
}