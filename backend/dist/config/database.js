"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTransaction = exports.executeQuery = void 0;
// AÑADE ESTO COMO PRIMERA LÍNEA del archivo
require("dotenv/config"); // Esto carga las variables de .env
const promise_1 = __importDefault(require("mysql2/promise"));
const logger_1 = __importDefault(require("../utils/logger"));
// 2. Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || ''),
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_POOL_SIZE || ''),
    queueLimit: 0,
    idleTimeout: 10000, // 10 segundos
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    charset: 'utf8mb4',
    timezone: 'Z', // UTC
    dateStrings: true,
    decimalNumbers: true,
    supportBigNumbers: true,
    multipleStatements: false // Importante por seguridad
};
// 3. Creación del pool de conexiones
const pool = promise_1.default.createPool(dbConfig);
// 4. Función para ejecutar consultas
const executeQuery = async (sql, params = []) => {
    let connection;
    try {
        connection = await pool.getConnection();
        logger_1.default.debug(`Executing query: ${sql}`);
        const [rows] = await connection.query(sql, params);
        // Manejo de diferentes tipos de resultados
        if (Array.isArray(rows)) {
            return {
                data: rows
            };
        }
        else {
            return {
                data: [],
                affectedRows: rows.affectedRows,
                insertId: rows.insertId,
                warnings: rows.warnings // Type assertion temporal
            };
        }
    }
    catch (error) {
        logger_1.default.error(`Database query failed: ${sql}`, error);
        throw error;
    }
    finally {
        if (connection)
            connection.release();
    }
};
exports.executeQuery = executeQuery;
// 5. Función para transacciones
const executeTransaction = async (queries) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const results = [];
        for (const { sql, params } of queries) {
            const result = await (0, exports.executeQuery)(sql, params || []);
            results.push(result);
        }
        await connection.commit();
        return results;
    }
    catch (error) {
        if (connection)
            await connection.rollback();
        logger_1.default.error('Transaction failed', error);
        throw error;
    }
    finally {
        if (connection)
            connection.release();
    }
};
exports.executeTransaction = executeTransaction;
// 6. Manejo de eventos del pool
pool.on('connection', (connection) => {
    logger_1.default.debug(`New connection established (ID: ${connection.threadId})`);
});
pool.on('acquire', (connection) => {
    logger_1.default.silly(`Connection acquired (ID: ${connection.threadId})`);
});
pool.on('release', (connection) => {
    logger_1.default.silly(`Connection released (ID: ${connection.threadId})`);
});
// 7. Verificación de conexión al iniciar
const verifyConnection = async () => {
    try {
        const { data } = await (0, exports.executeQuery)('SELECT 1 + 1 AS result');
        logger_1.default.info('✅ Database connection verified');
        logger_1.default.debug(`Test query result: ${data[0].result}`);
    }
    catch (error) {
        logger_1.default.error('❌ Failed to connect to database', error);
        process.exit(1);
    }
};
verifyConnection();
// 8. Exportación
exports.default = pool;
