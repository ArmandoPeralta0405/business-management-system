import { Request, Response } from 'express';
import { DepositoService } from '../services/Deposito.service';
import { IDeposito, IDepositoView } from '../models/Deposito.model';

const depositoService = new DepositoService();

export class DepositoController {
    async getAll(req: Request, res: Response) {
        try {
            const depositos = await depositoService.getAll();
            res.json(depositos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener depósitos' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const deposito = await depositoService.getById(parseInt(req.params.id));
            deposito 
                ? res.json(deposito) 
                : res.status(404).json({ error: 'Depósito no encontrado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el depósito' });
        }
    }

    async getBySucursal(req: Request, res: Response) {
        try {
            const depositos = await depositoService.getBySucursal(
                parseInt(req.params.id_sucursal),
                parseInt(req.params.id_empresa)
            );
            res.json(depositos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener depósitos por sucursal' });
        }
    }

    async create(req: Request | any, res: Response | any) {
        try {
            const newDeposito: Omit<IDeposito, 'id_deposito'> = {
                descripcion: req.body.descripcion,
                id_sucursal: req.body.id_sucursal,
                id_empresa: req.body.id_empresa
            };
            
            // Validación básica
            if (!newDeposito.descripcion || !newDeposito.id_sucursal || !newDeposito.id_empresa) {
                return res.status(400).json({ error: 'Datos incompletos' });
            }

            const id = await depositoService.create(newDeposito);
            res.status(201).json({ id });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Error al crear depósito' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const updated = await depositoService.update(
                parseInt(req.params.id),
                req.body
            );
            updated 
                ? res.json({ success: true }) 
                : res.status(404).json({ error: 'Depósito no encontrado' });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Error al actualizar depósito' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const deleted = await depositoService.delete(parseInt(req.params.id));
            deleted 
                ? res.json({ success: true }) 
                : res.status(404).json({ error: 'Depósito no encontrado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar depósito' });
        }
    }
}