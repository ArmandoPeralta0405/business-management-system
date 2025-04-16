import { Request, Response } from 'express';
import { ProgramaService } from '../services/Programa.service';
import { IPrograma, IProgramaView } from '../models/Programa.model';

const programaService = new ProgramaService();

export class ProgramaController {
  async getAll(req: Request, res: Response) {
    try {
      const programas = await programaService.getAll();
      res.json(programas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener programas' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const programa = await programaService.getById(parseInt(req.params.id));
      programa ? res.json(programa) : res.status(404).json({ error: 'Programa no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el programa' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newPrograma: Omit<IPrograma, 'id_programa'> = {
        id_modulo: req.body.id_modulo,
        nombre: req.body.nombre,
        ruta: req.body.ruta,
        estado: req.body.estado,
        id_categoria: req.body.id_categoria
      };
      const id = await programaService.create(newPrograma);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear programa' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await programaService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Programa no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar programa' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await programaService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Programa no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar programa' });
    }
  }
}