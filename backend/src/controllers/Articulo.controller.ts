import { Request, Response } from 'express';
import { ArticuloService } from '../services/Articulo.service';
import { IArticulo, IArticuloView } from '../models/Articulo.model';

const articuloService = new ArticuloService();

export class ArticuloController {
  async getAll(req: Request, res: Response) {
    try {
      const articulos = await articuloService.getAll();
      res.json(articulos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener articulos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const articulo = await articuloService.getById(parseInt(req.params.id));
      articulo ? res.json(articulo) : res.status(404).json({ error: 'Articulo no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el articulo' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newArticulo: Omit<IArticulo, 'id_articulo'> = {
        codigo_alfanumerico: req.body.codigo_alfanumerico,
        descripcion: req.body.descripcion,
        id_categoria: req.body.id_categoria,
        id_linea: req.body.id_linea,
        id_marca: req.body.id_marca,
        id_tipo: req.body.id_tipo,
        id_unidad: req.body.id_unidad,
        id_impuesto: req.body.id_impuesto,
        estado: req.body.estado
      };
      const id = await articuloService.create(newArticulo);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear articulo' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await articuloService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Articulo no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar articulo' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await articuloService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Articulo no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar articulo' });
    }
  }
}