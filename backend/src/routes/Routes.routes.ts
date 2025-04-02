import { Router } from 'express';
import rolRoutes from '../routes/Rol.routes';
import usuarioRoutes from '../routes/Usuario.routes';
import { authenticate } from '../middlewares/auth.middleware'; // Importa el middleware

const router = Router();

// Aplica el middleware de autenticación en las rutas de roles y usuarios
router.use('/roles', authenticate, rolRoutes); // Todas las rutas de roles empezarán con /roles
router.use('/usuarios', authenticate, usuarioRoutes); // Todas las rutas de los usuarios empezarán con /usuarios

// Exporta el router configurado
export default router;
