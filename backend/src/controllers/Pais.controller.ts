import { Request, Response } from 'express';
import { PaisService } from '../services/Pais.service';
import { IPais } from '../models/Pais.model';

const paisService = new PaisService();

export class PaisController {
  async getAll(req: Request, res: Response) {
    try {
      const paises = await paisService.getAll();
      res.json(paises);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener paises' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const pais = await paisService.getById(parseInt(req.params.id));
      pais ? res.json(pais) : res.status(404).json({ error: 'Pais no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el pais' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newPais: Omit<IPais, 'id_pais'> = {
        descripcion: req.body.descripcion,
        nacionalidad: req.body.nacionalidad,
        codigo_iso3: req.body.codigo_iso3
      };
      const id = await paisService.create(newPais);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear pais' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await paisService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Pais no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar pais' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await paisService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Pais no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar pais' });
    }
  }
}