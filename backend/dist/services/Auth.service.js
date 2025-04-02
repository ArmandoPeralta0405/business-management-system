"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const Usuario_service_1 = require("./Usuario.service"); // Asegúrate de tener acceso a UsuarioService
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment"); // Define tu clave secreta
const usuarioService = new Usuario_service_1.UsuarioService();
class AuthService {
    // Login por alias: Verificar alias y clave
    async login(alias, clave) {
        const usuario = await usuarioService.getByAlias(alias);
        if (!usuario) {
            throw new Error('Alias o clave incorrectos');
        }
        // Verificar la clave con bcrypt
        const isPasswordValid = await bcrypt_1.default.compare(clave, usuario.clave);
        if (!isPasswordValid) {
            throw new Error('Alias o clave incorrectos');
        }
        // Aquí agregamos más datos al token
        const token = jsonwebtoken_1.default.sign({
            id: usuario.id_usuario,
            correo_electronico: usuario.correo_electronico,
            alias: usuario.alias,
            nombre: usuario.nombre,
        }, environment_1.JWT_SECRET, { expiresIn: '10h' });
        return token; // Devuelve el token con más información al usuario
    }
    // Login por email: Verificar email y clave
    async loginByEmail(email, clave) {
        const usuario = await usuarioService.getByEmail(email);
        if (!usuario) {
            throw new Error('Correo electronico o clave incorrectos');
        }
        // Verificar la clave con bcrypt
        const isPasswordValid = await bcrypt_1.default.compare(clave, usuario.clave);
        if (!isPasswordValid) {
            throw new Error('Correo electronico o clave incorrectos');
        }
        // Aquí agregamos más datos al token
        const token = jsonwebtoken_1.default.sign({
            id: usuario.id_usuario,
            correo_electronico: usuario.correo_electronico,
            nombre: usuario.nombre,
            alias: usuario.alias,
        }, environment_1.JWT_SECRET, { expiresIn: '10h' });
        return token; // Devuelve el token con más información al usuario
    }
    // Logout: Simplemente eliminar el token del lado del cliente
    logout() {
        // El logout es solo en el lado del cliente (no hay mucha lógica en el servidor)
        // El cliente debería eliminar el token (por ejemplo, localStorage o cookies)
    }
}
exports.AuthService = AuthService;
