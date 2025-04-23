import { Request, Response } from 'express';
import { CodigoBarraService } from '../services/CodigoBarra.service';
import { ICodigoBarra, ICodigoBarraView } from '../models/CodigoBarra.model';

const codigoBarraService = new CodigoBarraService();

export class CodigoBarraController {
  async getAll(req: Request, res: Response) {
    try {
      const codigos_barras = await codigoBarraService.getAll();
      res.json(codigos_barras);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener codigos de barras' });
    }
  }

  async getById(req: Request, res: Response) {
      try {
        const { id_codigo, id_articulo } = req.params;
        const codigo_barra = await codigoBarraService.getById(
          parseInt(id_codigo),
          parseInt(id_articulo)
        );
        codigo_barra 
          ? res.json(codigo_barra) 
          : res.status(404).json({ error: 'Codigo de barra no encontrada' });
      } catch (error) {
        res.status(500).json({ 
          error: 'Error al obtener el Codigo de barra',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }

  async create(req: Request, res: Response) {
    try {
      const newCodigoBarra: Omit<ICodigoBarra, 'id_codigo'> = {
        id_articulo: req.body.id_articulo,
        codigo_barra: req.body.codigo_barra,
        id_tipo: req.body.id_tipo,
        estado: req.body.estado
      };
      const id = await codigoBarraService.create(newCodigoBarra);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear codigo de barra' });
    }
  }

  async update(req: Request, res: Response) {
      try {
        const { id_codigo, id_articulo } = req.params;
        const updateData: Partial<ICodigoBarra> = {
          codigo_barra: req.body.codigo_barra,
          id_tipo: req.body.id_tipo,
          estado: req.body.estado
        };
        
        const updated = await codigoBarraService.update(
          parseInt(id_codigo),
          parseInt(id_articulo),
          updateData
        );
        
        updated 
          ? res.json({ success: true }) 
          : res.status(404).json({ error: 'Codigo de barra no encontrada' });
      } catch (error) {
        res.status(400).json({ 
          error: 'Error al actualizar codigo de barra',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }

  async delete(req: Request, res: Response) {
    try {
      const { id_codigo, id_articulo } = req.params;
      const deleted = await codigoBarraService.delete(
        parseInt(id_codigo),
        parseInt(id_articulo)
      );
      
      deleted 
        ? res.json({ success: true }) 
        : res.status(404).json({ error: 'Codigo de barra no encontrada' });
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al eliminar codigo de barra',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }
}