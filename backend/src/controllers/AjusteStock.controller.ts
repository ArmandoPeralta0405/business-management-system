import { Request, Response } from 'express';
import { AjusteStockService } from '../services/AjusteStock.service';
import { IAjusteStock, IAjusteStockFiltros } from '../models/AjusteStock.model';
import { AjusteStockReport } from '../reports/ajustes-stock/AjusteStockReport';

export class AjusteStockController {
  private ajusteStockService = new AjusteStockService();
  private ajusteStockReport = new AjusteStockReport();

  async fetchNextNumeroComprobante(req: Request, res: Response) {
    try {
      const numeroComprobante = await this.ajusteStockService.fetchNextNumeroComprobante();
      res.json({ numeroComprobante });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el número de comprobante' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const ajustes_stocks = await this.ajusteStockService.getAll();
      res.json(ajustes_stocks);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ajustes de stocks' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const ajuste_stock = await this.ajusteStockService.getById(parseInt(req.params.id));
      ajuste_stock ? res.json(ajuste_stock) : res.status(404).json({ error: 'Ajuste de stock no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el ajuste de stock' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newAjusteStock: Omit<IAjusteStock, 'id_ajuste'> = {
        id_empresa: req.body.id_empresa,
        id_sucursal: req.body.id_sucursal,
        id_deposito: req.body.id_deposito,
        numero_comprobante: req.body.numero_comprobante,
        fecha_hora: req.body.fecha_hora,
        id_movimiento: req.body.id_movimiento,
        observacion: req.body.observacion,
        id_usuario: req.body.id_usuario
      };
      const id = await this.ajusteStockService.create(newAjusteStock);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear ajuste de stock' + error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updateAjusteStock: Partial<IAjusteStock> = {
        id_empresa: req.body.id_empresa,
        id_sucursal: req.body.id_sucursal,
        id_deposito: req.body.id_deposito,
        numero_comprobante: req.body.numero_comprobante,
        fecha_hora: req.body.fecha_hora,
        id_movimiento: req.body.id_movimiento,
        observacion: req.body.observacion,
        id_usuario: req.body.id_usuario
      };
      const updated = await this.ajusteStockService.update(
        parseInt(req.params.id),
        updateAjusteStock
      );
      updated ? res.json({ success: true }) : res.status(404).json({ error: 'Ajuste de stock no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar ajuste de stock' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await this.ajusteStockService.delete(parseInt(req.params.id));
      deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Ajuste de stock no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar ajuste de stock' });
    }
  }
 /**
   * Genera un informe PDF de ajustes de stock y lo envía como respuesta
   */
 async generarInformePDF(req: Request, res: Response) {
  try {
    // Obtener todos los departamentos
    const ajustes_stocks = await this.ajusteStockService.getAll();
    
    // Generar el PDF
    const pdfBuffer = await this.ajusteStockReport.generatePDFBuffer(ajustes_stocks);
    
    // Configurar la respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=informe-ajuste-stock.pdf');
    
    // Enviar el PDF como respuesta
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar el informe PDF:', error);
    res.status(500).json({ error: 'Error al generar el informe PDF' });
  }
}

/**
 * Genera y guarda un informe PDF de ajustes de stock
 */
async guardarInformePDF(req: Request, res: Response) {
  try {
    // Obtener todos los ajustes de stock
    const ajustes_stocks = await this.ajusteStockService.getAll();
    
    // Generar y guardar el PDF
    const filePath = await this.ajusteStockReport.generateAndSavePDF(ajustes_stocks);
    
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

/**
 * Genera un informe PDF de ajustes de stock filtrado y lo envía como respuesta
 */
async generarInformePDFFiltrado(req: Request, res: Response) {
  try {
    // Validar que se proporcionaron las fechas (obligatorias)
    if (!req.query.fechaInicial || !req.query.fechaFinal) {
      return res.status(400).json({ error: 'Las fechas inicial y final son obligatorias' });
    }

    // Crear objeto de filtros
    const filtros: IAjusteStockFiltros = {
      fechaInicial: req.query.fechaInicial as string,
      fechaFinal: req.query.fechaFinal as string
    };

    // Agregar id_movimiento si está presente
    if (req.query.id_movimiento) {
      filtros.id_movimiento = parseInt(req.query.id_movimiento as string);
    }

    // Obtener los ajustes de stock filtrados
    const ajustes_stocks = await this.ajusteStockService.getByFiltros(filtros);
    
    // Generar el PDF
    const pdfBuffer = await this.ajusteStockReport.generatePDFBuffer(ajustes_stocks);
    
    // Configurar la respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=informe-ajuste-stock-filtrado.pdf');
    
    // Enviar el PDF como respuesta
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar el informe PDF filtrado:', error);
    res.status(500).json({ error: 'Error al generar el informe PDF filtrado' });
  }
}

/**
 * Genera y guarda un informe PDF de ajustes de stock filtrado
 */
async guardarInformePDFFiltrado(req: Request, res: Response) {
  try {
    // Validar que se proporcionaron las fechas (obligatorias)
    if (!req.query.fechaInicial || !req.query.fechaFinal) {
      return res.status(400).json({ error: 'Las fechas inicial y final son obligatorias' });
    }

    // Crear objeto de filtros
    const filtros: IAjusteStockFiltros = {
      fechaInicial: req.query.fechaInicial as string,
      fechaFinal: req.query.fechaFinal as string
    };

    // Agregar id_movimiento si está presente
    if (req.query.id_movimiento) {
      filtros.id_movimiento = parseInt(req.query.id_movimiento as string);
    }

    // Obtener los ajustes de stock filtrados
    const ajustes_stocks = await this.ajusteStockService.getByFiltros(filtros);
    
    // Generar y guardar el PDF
    const filePath = await this.ajusteStockReport.generateAndSavePDF(ajustes_stocks);
    
    // Enviar la respuesta con la ruta del archivo guardado
    res.json({ 
      success: true, 
      message: 'Informe PDF filtrado generado correctamente',
      filePath: filePath,
      totalRegistros: ajustes_stocks.length
    });
  } catch (error) {
    console.error('Error al generar y guardar el informe PDF filtrado:', error);
    res.status(500).json({ error: 'Error al generar y guardar el informe PDF filtrado' });
  }
}
}