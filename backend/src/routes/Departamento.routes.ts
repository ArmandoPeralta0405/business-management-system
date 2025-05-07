import { Router } from 'express';
import { DepartamentoController } from '../controllers/Departamento.controller';

const router = Router();
const departamentoController = new DepartamentoController();

router.get('/', departamentoController.getAll.bind(departamentoController));
router.get('/informe-pdf', departamentoController.generarInformePDF.bind(departamentoController));
router.get('/guardar-informe-pdf', departamentoController.guardarInformePDF.bind(departamentoController));
router.get('/:id', departamentoController.getById.bind(departamentoController));
router.post('/', departamentoController.create.bind(departamentoController));
router.put('/:id', departamentoController.update.bind(departamentoController));
router.delete('/:id', departamentoController.delete.bind(departamentoController));

export default router;