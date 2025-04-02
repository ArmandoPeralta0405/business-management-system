
// AÑADE ESTO COMO PRIMERA LÍNEA del archivo
import 'dotenv/config'; // Esto carga las variables de .env

import mysql, {
    Pool,
    PoolOptions,
    PoolConnection,
    RowDataPacket,
    OkPacket,
    ResultSetHeader,
    QueryError
  } from 'mysql2/promise';
  import logger from '../utils/logger';
  
  // 1. Definición de tipos
  interface DatabaseConfig extends PoolOptions {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
  }
  
  interface QueryResult<T = RowDataPacket> {
    data: T[];
    affectedRows?: number;
    insertId?: number;
    warnings?: QueryError[];
  }
  
  // 2. Configuración de la base de datos
  const dbConfig: DatabaseConfig = {
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
  const pool: Pool = mysql.createPool(dbConfig);
  
  // 4. Función para ejecutar consultas
  export const executeQuery = async <T = RowDataPacket>(
    sql: string,
    params: any[] | Record<string, any> = []
  ): Promise<QueryResult<T>> => {
    let connection: PoolConnection | undefined;
  
    try {
      connection = await pool.getConnection();
      logger.debug(`Executing query: ${sql}`);
  
      const [rows] = await connection.query<RowDataPacket[] | OkPacket | ResultSetHeader>(sql, params);
  
      // Manejo de diferentes tipos de resultados
      if (Array.isArray(rows)) {
        return {
          data: rows as T[]
        };
      } else {
        return {
          data: [],
          affectedRows: rows.affectedRows,
          insertId: rows.insertId,
          warnings: (rows as any).warnings // Type assertion temporal
        };
      }
    } catch (error) {
      logger.error(`Database query failed: ${sql}`, error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  };
  
  // 5. Función para transacciones
  export const executeTransaction = async (queries: {
    sql: string;
    params?: any[] | Record<string, any>;
  }[]): Promise<QueryResult[]> => {
    let connection: PoolConnection | undefined;
  
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
  
      const results: QueryResult[] = [];
      for (const { sql, params } of queries) {
        const result = await executeQuery(sql, params || []);
        results.push(result);
      }
  
      await connection.commit();
      return results;
    } catch (error) {
      if (connection) await connection.rollback();
      logger.error('Transaction failed', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  };
  
  // 6. Manejo de eventos del pool
  pool.on('connection', (connection: PoolConnection) => {
    logger.debug(`New connection established (ID: ${connection.threadId})`);
  });
  
  pool.on('acquire', (connection: PoolConnection) => {
    logger.silly(`Connection acquired (ID: ${connection.threadId})`);
  });
  
  pool.on('release', (connection: PoolConnection) => {
    logger.silly(`Connection released (ID: ${connection.threadId})`);
  });
  
  // 7. Verificación de conexión al iniciar
  const verifyConnection = async () => {
    try {
      const { data } = await executeQuery<{ result: number }>('SELECT 1 + 1 AS result');
      logger.info('✅ Database connection verified');
      logger.debug(`Test query result: ${data[0].result}`);
    } catch (error) {
      logger.error('❌ Failed to connect to database', error);
      process.exit(1);
    }
  };
  
  verifyConnection();
  
  // 8. Exportación
  export default pool;