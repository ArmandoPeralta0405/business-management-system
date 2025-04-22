import { Request, Response } from 'express';
import mysqldump from 'mysqldump'; // Importación corregida
import path from 'path';
import pool from '../config/database';
import logger from '../utils/logger';
import fs from 'fs';

// Configuración de backup
const MAX_BACKUPS = 5;
const BACKUP_DIR = path.join(__dirname, '../../backups');

export const generateBackup = async (req: Request, res: Response) => {
    try {
        // Crear directorio si no existe
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
            logger.info(`Directorio de backups creado: ${BACKUP_DIR}`);
        }

        const timestamp = new Date().toISOString()
            .replace(/[:.]/g, '-')
            .replace('T', '_');
        const backupFileName = `backup-${timestamp}.sql`;
        const backupPath = path.join(BACKUP_DIR, backupFileName);

        // Obtener configuración de la DB
        const connection = await pool.getConnection();
        const { host, port, user, password, database } = connection.config;

        // Validar que las propiedades no sean undefined
        if (!host || !port || !user || !password || !database) {
            throw new Error('Faltan datos de conexión a la base de datos. Verifique la configuración.');
        }

        connection.release();

        // Usando el paquete mysqldump (forma correcta)
        await mysqldump({
            connection: {
                host,
                port,
                user,
                password,
                database
            },
            dumpToFile: backupPath
        });

        // Limpiar backups antiguos
        //await cleanOldBackups();

        res.status(200).json({
            success: true,
            message: 'Backup generado correctamente',
            path: backupPath,
            filename: backupFileName,
            size: fs.statSync(backupPath).size
        });

    } catch (error) {
        logger.error('Error en controlador de backup:', error);
        res.status(500).json({
            error: 'Error al generar backup',
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

// Helper para limpiar backups antiguos
/*async function cleanOldBackups() {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith('backup-') && file.endsWith('.sql'))
            .map(file => ({
                name: file,
                time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        if (files.length > MAX_BACKUPS) {
            const oldFiles = files.slice(MAX_BACKUPS);
            for (const file of oldFiles) {
                fs.unlinkSync(path.join(BACKUP_DIR, file.name));
                logger.info(`Backup antiguo eliminado: ${file.name}`);
            }
        }
    } catch (error) {
        logger.error('Error limpiando backups antiguos:', error);
    }
}

// Helper para ejecutar comandos con promesas (opcional)
function execAsync(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                logger.error(`Comando falló: ${command}`, stderr);
                return reject(error);
            }
            resolve();
        });
    });
}*/