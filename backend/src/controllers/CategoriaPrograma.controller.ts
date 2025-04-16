import { Request, Response } from 'express';
import { CategoriaProgramaService } from '../services/CategoriaPrograma.service';
import { ICategoriaPrograma } from '../models/CategoriaPrograma.model';

const categoriaProgramaService = new CategoriaProgramaService();

export class CategoriaProgramaController {
  async getAll(req: Request, res: Response) {
    try {
      const categorias = await categoriaProgramaService.getAll();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener categorias' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const categoria = await categoriaProgramaService.getById(parseInt(req.params.id));
      categoria ? res.json(categoria) : res.status(404).json({ error: 'Categoria no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la categoria' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newCategoria: Omit<ICategoriaPrograma, 'id_categoria'> = {
        descripcion: req.body.descripcion
      };
      const id = await categoriaProgramaService.create(newCategoria);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear categoria' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await categoriaProgramaService.update(
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
      const deleted = await categoriaProgramaService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Categoria no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar categoria' });
    }
  }
}