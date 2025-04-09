import { Request, Response } from 'express';
import { SucursalService } from '../services/Sucursal.service';
import { ISucursal, ISucursalView } from '../models/Sucursal.model';

const sucursalService = new SucursalService();

export class SucursalController {
  async getAll(req: Request, res: Response) {
    try {
      const sucursales = await sucursalService.getAll();
      res.json(sucursales);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener sucursales' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id_sucursal, id_empresa } = req.params;
      const sucursal = await sucursalService.getById(
        parseInt(id_sucursal),
        parseInt(id_empresa)
      );
      sucursal 
        ? res.json(sucursal) 
        : res.status(404).json({ error: 'Sucursal no encontrada' });
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al obtener la sucursal',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newSucursal: Omit<ISucursal, 'id_sucursal'> = {
        id_empresa: req.body.id_empresa,
        descripcion: req.body.descripcion,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        email: req.body.email,
        id_ciudad: req.body.id_ciudad,
        casa_central: req.body.casa_central,
        estado: req.body.estado
      };
      
      const id = await sucursalService.create(newSucursal);
      res.status(201).json({ id_sucursal: id });
    } catch (error) {
      res.status(400).json({ 
        error: 'Error al crear sucursal',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id_sucursal, id_empresa } = req.params;
      const updateData: Partial<ISucursal> = {
        descripcion: req.body.descripcion,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        email: req.body.email,
        id_ciudad: req.body.id_ciudad,
        casa_central: req.body.casa_central,
        estado: req.body.estado
      };
      
      const updated = await sucursalService.update(
        parseInt(id_sucursal),
        parseInt(id_empresa),
        updateData
      );
      
      updated 
        ? res.json({ success: true }) 
        : res.status(404).json({ error: 'Sucursal no encontrada' });
    } catch (error) {
      res.status(400).json({ 
        error: 'Error al actualizar sucursal',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id_sucursal, id_empresa } = req.params;
      const deleted = await sucursalService.delete(
        parseInt(id_sucursal),
        parseInt(id_empresa)
      );
      
      deleted 
        ? res.json({ success: true }) 
        : res.status(404).json({ error: 'Sucursal no encontrada' });
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al eliminar sucursal',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }
}