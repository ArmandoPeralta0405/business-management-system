"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRES_IN = exports.JWT_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../utils/logger"));
// Cargar variables de entorno desde el archivo .env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Validar y tipar las variables de entorno
const validateEnvVar = (name, defaultValue) => {
    const value = process.env[name] || defaultValue;
    if (value === undefined) {
        logger_1.default.error(`Falta la variable de entorno requerida: ${name}`);
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
    logger_1.default.warn('La aplicación se está ejecutando en modo desarrollo');
    logger_1.default.debug(`Configuración cargada: ${JSON.stringify(config, null, 2)}`);
}
exports.JWT_SECRET = 'BMS_KEY'; // Usa variables de entorno en producción
exports.JWT_EXPIRES_IN = '1h'; // Ej: 1 hora de validez
exports.default = config;
