import { Request, Response } from 'express';
import { DepositoService } from '../services/Deposito.service';
import { IDeposito } from '../models/Deposito.model';

const depositoService = new DepositoService();

export class DepositoController {
  async getAll(req: Request, res: Response) {
    try {
      const depositos = await depositoService.getAll();
      res.json(depositos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener depositos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const deposito = await depositoService.getById(parseInt(req.params.id));
      deposito ? res.json(deposito) : res.status(404).json({ error: 'Deposito no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el deposito' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newDeposito: Omit<IDeposito, 'id_deposito'> = {
        descripcion: req.body.descripcion
      };
      const id = await depositoService.create(newDeposito);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear deposito' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await depositoService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Deposito no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar deposito' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await depositoService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Deposito no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar deposito' });
    }
  }
}