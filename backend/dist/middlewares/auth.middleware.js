"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header Authorization
    if (!token) {
        res.status(401).json({ error: 'Token no proporcionado' });
        return; // Importante: no debes retornar Response directamente, solo enviar respuesta y salir.
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.JWT_SECRET); // Decodificamos el token
        req.usuario_id = decoded.id; // Añadimos el id del usuario al objeto de la solicitud
        next(); // Llamamos a next() para pasar al siguiente middleware
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' });
        return; // Al igual que antes, no se devuelve un Response, solo se sale de la función.
    }
};
exports.authenticate = authenticate;
