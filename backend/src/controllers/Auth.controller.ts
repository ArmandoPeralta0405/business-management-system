import 'dotenv/config';

import { Request, Response } from 'express';
import { AuthService } from '../services/Auth.service';

const authService = new AuthService();

export class AuthController {
    // Login
    async login(req: Request, res: Response) {
        try {
            const { alias, clave } = req.body;
            const token = await authService.login(alias, clave);
            res.json({ token });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async loginEmail(req: Request, res: Response) {
        try {
            const { email, clave } = req.body;
            const token = await authService.loginByEmail(email, clave);
            res.json({ token });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Logout
    async logout(req: Request, res: Response) {
        // No hay lógica en el servidor para el logout, se hace del lado del cliente
        // Solo devolver una respuesta
        res.json({ message: 'Logout exitoso' });
    }
}
