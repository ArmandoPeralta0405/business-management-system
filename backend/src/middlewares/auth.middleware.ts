import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/environment';

declare module 'express' {
    interface Request {
        usuario_id?: number; // Añadimos la propiedad para almacenar el id del usuario
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => { 
    const token = req.headers.authorization?.split(' ')[1];  // Obtener el token del header Authorization

    if (!token) {
        res.status(401).json({ error: 'Token no proporcionado' });
        return; // Importante: no debes retornar Response directamente, solo enviar respuesta y salir.
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };  // Decodificamos el token
        req.usuario_id = decoded.id;  // Añadimos el id del usuario al objeto de la solicitud

        next();  // Llamamos a next() para pasar al siguiente middleware
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' });
        return;  // Al igual que antes, no se devuelve un Response, solo se sale de la función.
    }
};
