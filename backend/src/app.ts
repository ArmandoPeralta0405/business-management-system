import 'dotenv/config'; // Esto debe ser lo primero que se ejecute
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import Routes from './routes/Routes.routes';
import AuthRoutes from './routes/Auth.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Registrar rutas
app.use('/api', Routes);
app.use('/auth', AuthRoutes);

// Ruta de prueba básica
app.get('/', (req, res) => {
  res.send('API funcionando ✅');
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  
});

export default app;