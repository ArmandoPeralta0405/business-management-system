import * as PdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as fs from 'fs';
import * as path from 'path';

// Configuración de fuentes
(PdfMake as any).vfs = (pdfFonts as any).vfs;

export abstract class ReportGenerator<T> {
  protected abstract getDocumentDefinition(data: T[]): any;
  protected abstract getFileName(): string;

  /**
   * Genera un informe PDF y devuelve el buffer
   * @param data Datos para el informe
   * @returns Buffer con el contenido del PDF
   */
  async generatePDFBuffer(data: T[]): Promise<Buffer> {
    const docDefinition = this.getDocumentDefinition(data);
    const pdfDoc = PdfMake.createPdf(docDefinition);
    
    return new Promise((resolve, reject) => {
      pdfDoc.getBuffer((buffer) => {
        resolve(buffer);
      });
    });
  }

  /**
   * Genera un informe PDF y lo guarda en un archivo
   * @param data Datos para el informe
   * @param outputDir Directorio donde guardar el archivo (opcional)
   * @returns Ruta del archivo guardado
   */
  async generateAndSavePDF(data: T[], outputDir?: string): Promise<string> {
    const buffer = await this.generatePDFBuffer(data);
    
    // Definir directorio de salida
    const dir = outputDir || path.join(__dirname, '..', '..', '..', 'temp');
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Crear nombre de archivo con timestamp
    const fileName = `${this.getFileName()}-${Date.now()}.pdf`;
    const filePath = path.join(dir, fileName);
    
    // Guardar archivo
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(filePath);
        }
      });
    });
  }
}