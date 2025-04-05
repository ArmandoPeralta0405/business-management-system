import { Request, Response } from 'express';
import { CiudadService } from '../services/Ciudad.service';
import { ICiudad, ICiudadView } from '../models/Ciudad.model';

const ciudadService = new CiudadService();

export class CiudadController {
  async getAll(req: Request, res: Response) {
    try {
      const ciudades = await ciudadService.getAll();
      res.json(ciudades);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ciudades' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const ciudad = await ciudadService.getById(parseInt(req.params.id));
      ciudad ? res.json(ciudad) : res.status(404).json({ error: 'Ciudad no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la ciudad' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newCiudad: Omit<ICiudad, 'id_ciudad'> = {
        id_departamento: req.body.id_departamento,
        descripcion: req.body.descripcion,
        capital: req.body.capital,
        codigo_postal: req.body.codigo_postal
      };
      const id = await ciudadService.create(newCiudad);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear ciudad' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await ciudadService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Ciudad no encontrada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar ciudad' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await ciudadService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Ciudad no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar ciudad' });
    }
  }
}