import { Request, Response } from 'express';
import { ProveedorService } from '../services/Proveedor.service';
import { IProveedor, IProveedorView } from '../models/Proveedor.model';

const proveedorService = new ProveedorService();

export class ProveedorController {
  async getAll(req: Request, res: Response) {
    try {
      const proveedores = await proveedorService.getAll();
      res.json(proveedores);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener proveedores' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const proveedor = await proveedorService.getById(parseInt(req.params.id));
      proveedor ? res.json(proveedor) : res.status(404).json({ error: 'Proveedor no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el proveedor' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newProveedor: Omit<IProveedor, 'id_proveedor'> = {
        razon_social: req.body.razon_social,
        nombre_fantasia: req.body.nombre_fantasia,
        ruc: req.body.ruc,
        cedula: req.body.cedula,
        id_ciudad: req.body.id_ciudad,
        direccion: req.body.direccion,
        email: req.body.email,
        telefono: req.body.telefono,
        estado: req.body.estado
      };
      const id = await proveedorService.create(newProveedor);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear proveedor' });
    }
  }

  async update(req: Request, res: Response) {
    try {

      const updateProveedor: Partial<IProveedor> = {
        razon_social: req.body.razon_social,
        nombre_fantasia: req.body.nombre_fantasia,
        ruc: req.body.ruc,
        cedula: req.body.cedula,
        id_ciudad: req.body.id_ciudad,
        direccion: req.body.direccion,
        email: req.body.email,
        telefono: req.body.telefono,
        estado: req.body.estado
      };

      const updated = await proveedorService.update(
        parseInt(req.params.id),
        updateProveedor
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Proveedor no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar proveedor' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await proveedorService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Proveedor no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
  }
}