import { Request, Response } from 'express';
import { EmpresaService } from '../services/Empresa.service';
import { IEmpresa, IEmpresaView } from '../models/Empresa.model';

const empresaService = new EmpresaService();

export class EmpresaController {
  async getAll(req: Request, res: Response) {
    try {
      const empresas = await empresaService.getAll();
      res.json(empresas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener empresas' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const empresa = await empresaService.getById(parseInt(req.params.id));
      empresa ? res.json(empresa) : res.status(404).json({ error: 'Empresa no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la empresa' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newEmpresa: Omit<IEmpresa, 'id_empresa'> = {
        razon_social: req.body.razon_social,
        nombre_comercial: req.body.nombre_comercial,
        ruc: req.body.ruc,
        dv: req.body.dv,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        email: req.body.email,
        id_ciudad: req.body.id_ciudad,
        fecha_constitucion: req.body.fecha_constitucion,
        representante_legal: req.body.representante_legal,
        estado: req.body.estado
      };
      const id = await empresaService.create(newEmpresa);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear empresa'+ error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await empresaService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Empresa no encontrada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar empresa' + error});
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await empresaService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'empresa no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar empresa' });
    }
  }
}