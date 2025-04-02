import winston from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

// Crear directorio de logs si no existe
const logDir = path.join(__dirname, '../../logs');
require('fs').existsSync(logDir) || require('fs').mkdirSync(logDir);

// Formatos personalizados
const logFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  }
);

// Configuración de niveles y colores
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
});

// Transporte para archivos rotativos
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // Conservar logs por 14 días
});

// Transporte para errores
const errorFileTransport = new winston.transports.File({
  filename: path.join(logDir, 'error.log'),
  level: 'error',
});

// Logger base
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'development' 
      ? winston.format.colorize() 
      : winston.format.uncolorize(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    fileRotateTransport,
    errorFileTransport
  ],
});

// En producción, deshabilitar los logs de debug
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info'
    })
  );
}

export default logger;