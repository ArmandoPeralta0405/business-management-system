import 'dotenv/config'; // Esto debe ser lo primero que se ejecute
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import Routes from './routes/Routes.routes';
import AuthRoutes from './routes/Auth.routes';

// Agrega esto justo después de los imports
const allowedOrigins = [
  'http://localhost:4200',
  'http://192.168.0.111:4200',
  'http://192.168.100.6:4200',
  'http://192.168.0.110:4200'
];

const app = express(); 
const PORT = parseInt(process.env.PORT || '3000', 10); // Asegura que sea número 

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'; // Fallback

// Middlewares básicos
// Reemplaza solo el middleware cors (deja el resto igual)
  app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

app.use(helmet()); 
app.use(morgan('dev'));
app.use(express.json());

// Registrar rutas
app.use('/api', Routes);
app.use('/auth', AuthRoutes);

// Ruta para exponer la configuración
app.get('/api-info', (req, res) => {
  res.json({
    apiUrl: API_BASE_URL,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de prueba básica
app.get('/', (req, res) => {
  res.send('API funcionando ✅');
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} y ${API_BASE_URL}`);
})

export default app;