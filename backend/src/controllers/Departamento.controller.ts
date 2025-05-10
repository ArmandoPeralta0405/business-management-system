import { Request, Response } from 'express';
import { DepartamentoService } from '../services/Departamento.service';
import { DepartamentoReport } from '../reports/departamentos/DepartamentoReport';
import { IDepartamento, IDepartamentoView } from '../models/Departamento.model';

const departamentoService = new DepartamentoService();

export class DepartamentoController {
  private departamentoService = new DepartamentoService();
  private departamentoReport = new DepartamentoReport();

  async getAll(req: Request, res: Response) {
    try {
      const departamentos = await this.departamentoService.getAll();
      res.json(departamentos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener departamentos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const departamento = await departamentoService.getById(parseInt(req.params.id));
      departamento ? res.json(departamento) : res.status(404).json({ error: 'Departamento no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el departamento' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newDepartamento: Omit<IDepartamento, 'id_departamento'> = {
        id_pais: req.body.id_pais,
        descripcion: req.body.descripcion
      };
      const id = await departamentoService.create(newDepartamento);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear departamento' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await departamentoService.update(
        parseInt(req.params.id),
        req.body
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Departamento no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar departamento' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await departamentoService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Departamento no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar departamento' });
    }
  }

  /**
   * Genera un informe PDF de departamentos y lo envía como respuesta
   */
  async generarInformePDF(req: Request, res: Response) {
    try {
      // Obtener todos los departamentos
      const departamentos = await this.departamentoService.getAll();
      
      // Generar el PDF
      const pdfBuffer = await this.departamentoReport.generatePDFBuffer(departamentos);
      
      // Configurar la respuesta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=informe-departamentos.pdf');
      
      // Enviar el PDF como respuesta
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error al generar el informe PDF:', error);
      res.status(500).json({ error: 'Error al generar el informe PDF' });
    }
  }

  /**
   * Genera y guarda un informe PDF de departamentos
   */
  async guardarInformePDF(req: Request, res: Response) {
    try {
      // Obtener todos los departamentos
      const departamentos = await this.departamentoService.getAll();
      
      // Generar y guardar el PDF
      const filePath = await this.departamentoReport.generateAndSavePDF(departamentos);
      
      // Enviar la respuesta con la ruta del archivo guardado
      res.json({ 
        success: true, 
        message: 'Informe PDF generado correctamente',
        filePath: filePath
      });
    } catch (error) {
      console.error('Error al generar y guardar el informe PDF:', error);
      res.status(500).json({ error: 'Error al generar y guardar el informe PDF' });
    }
  }
}