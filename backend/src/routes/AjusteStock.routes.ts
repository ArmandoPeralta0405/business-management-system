import { Router } from 'express';
import { AjusteStockController } from '../controllers/AjusteStock.controller';

const router = Router();
const controller = new AjusteStockController();
// Rutas para informes PDF
router.get('/nuevo_comprobante', (req, res) => controller.fetchNextNumeroComprobante(req, res));
router.get('/informe-pdf', (req, res) => controller.generarInformePDF(req, res));
router.get('/guardar-informe-pdf', (req, res) => controller.guardarInformePDF(req, res));
// Nuevas rutas para informes PDF filtrados
router.get('/informe-pdf-filtrado', (req, res) => {
  controller.generarInformePDFFiltrado(req, res);
});
router.get('/guardar-informe-pdf-filtrado', (req, res) => {
  controller.guardarInformePDFFiltrado(req, res);
});
// Rutas CRUD básicas
router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;