"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
require("dotenv/config");
const Auth_service_1 = require("../services/Auth.service");
const authService = new Auth_service_1.AuthService();
class AuthController {
    // Login
    async login(req, res) {
        try {
            const { alias, clave } = req.body;
            const token = await authService.login(alias, clave);
            res.json({ token });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async loginEmail(req, res) {
        try {
            const { email, clave } = req.body;
            const token = await authService.loginByEmail(email, clave);
            res.json({ token });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Logout
    async logout(req, res) {
        // No hay lógica en el servidor para el logout, se hace del lado del cliente
        // Solo devolver una respuesta
        res.json({ message: 'Logout exitoso' });
    }
}
exports.AuthController = AuthController;
