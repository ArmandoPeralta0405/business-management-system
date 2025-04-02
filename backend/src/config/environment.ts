import dotenv from 'dotenv';
import path from 'path';
import logger from '../utils/logger';

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Validar y tipar las variables de entorno
const validateEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name] || defaultValue;
  
  if (value === undefined) {
    logger.error(`Falta la variable de entorno requerida: ${name}`);
    process.exit(1);
  }

  return value;
};

// Configuración de la base de datos
const dbConfig = {
  host: validateEnvVar('DB_HOST'),
  port: parseInt(validateEnvVar('DB_PORT', '3306')),
  user: validateEnvVar('DB_USER'),
  password: validateEnvVar('DB_PASSWORD'),
  database: validateEnvVar('DB_NAME'),
  connectionLimit: parseInt(validateEnvVar('DB_POOL_SIZE', '10')),
  timezone: validateEnvVar('DB_TIMEZONE', 'UTC'),
};

// Configuración de la aplicación
const appConfig = {
  port: parseInt(validateEnvVar('APP_PORT', '3000')),
  env: validateEnvVar('NODE_ENV', 'development'),
  jwtSecret: validateEnvVar('JWT_SECRET'),
  apiPrefix: validateEnvVar('API_PREFIX', '/api/v1'),
};

// Configuración del logger
const loggerConfig = {
  level: validateEnvVar('LOG_LEVEL', 'info'),
  logFile: validateEnvVar('LOG_FILE', 'logs/combined.log'),
  errorLogFile: validateEnvVar('ERROR_LOG_FILE', 'logs/error.log'),
};

// Configuración completa
const config = {
  db: dbConfig,
  app: appConfig,
  logger: loggerConfig,
};

// Verificar modo de desarrollo
if (config.app.env === 'development') {
  logger.warn('La aplicación se está ejecutando en modo desarrollo');
  logger.debug(`Configuración cargada: ${JSON.stringify(config, null, 2)}`);
}

export const JWT_SECRET = 'BMS_KEY'; // Usa variables de entorno en producción
export const JWT_EXPIRES_IN = '1h'; // Ej: 1 hora de validez

export default config;