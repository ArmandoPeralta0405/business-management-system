import { Request, Response } from 'express';
import { CategoriaService } from '../services/Categoria.service';
import { ICategoria } from '../models/Categoria.model';

const categoriaService = new CategoriaService();

export class CategoriaController {
  async getAll(req: Request, res: Response) {
    try {
      const categorias = await categoriaService.getAll();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener categorias' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const categoria = await categoriaService.getById(parseInt(req.params.id));
      categoria ? res.json(categoria) : res.status(404).json({ error: 'Categoria no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la categoria' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newCategoria: Omit<ICategoria, 'id_categoria'> = {
        descripcion: req.body.descripcion
      };
      const id = await categoriaService.create(newCategoria);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear categoria' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await categoriaService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Categoria no encontrada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar categoria' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await categoriaService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Categoria no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar categoria' });
    }
  }
}