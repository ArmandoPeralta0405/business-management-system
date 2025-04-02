"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
// Crear directorio de logs si no existe
const logDir = path_1.default.join(__dirname, '../../logs');
require('fs').existsSync(logDir) || require('fs').mkdirSync(logDir);
// Formatos personalizados
const logFormat = winston_1.default.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});
// Configuración de niveles y colores
winston_1.default.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
});
// Transporte para archivos rotativos
const fileRotateTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d', // Conservar logs por 14 días
});
// Transporte para errores
const errorFileTransport = new winston_1.default.transports.File({
    filename: path_1.default.join(logDir, 'error.log'),
    level: 'error',
});
// Logger base
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), process.env.NODE_ENV === 'development'
        ? winston_1.default.format.colorize()
        : winston_1.default.format.uncolorize(), logFormat),
    transports: [
        new winston_1.default.transports.Console(),
        fileRotateTransport,
        errorFileTransport
    ],
});
// En producción, deshabilitar los logs de debug
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston_1.default.transports.File({
        filename: path_1.default.join(logDir, 'combined.log'),
        level: 'info'
    }));
}
exports.default = logger;
