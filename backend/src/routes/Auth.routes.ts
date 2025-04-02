import { Router } from 'express';
import { AuthController } from '../controllers/Auth.controller';

const router = Router();
const controller = new AuthController();

// Ruta de login
router.post('/login', controller.login);
router.post('/loginEmail', controller.loginEmail);

// Ruta de logout
router.post('/logout', controller.logout);

export default router;
