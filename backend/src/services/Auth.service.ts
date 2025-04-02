import { UsuarioService } from './Usuario.service';  // Asegúrate de tener acceso a UsuarioService
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/environment';  // Define tu clave secreta
import { IUsuario } from '../models/Usuario.model';

const usuarioService = new UsuarioService();

export class AuthService {
    // Login por alias: Verificar alias y clave
    async login(alias: string, clave: string): Promise<string | null> {
        const usuario = await usuarioService.getByAlias(alias);

        if (!usuario) {
            throw new Error('Alias o clave incorrectos');
        }

        // Verificar la clave con bcrypt
        const isPasswordValid = await bcrypt.compare(clave, usuario.clave);
        if (!isPasswordValid) {
            throw new Error('Alias o clave incorrectos');
        }

        // Aquí agregamos más datos al token
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                correo_electronico: usuario.correo_electronico,
                alias: usuario.alias,
                nombre: usuario.nombre,
            },
            JWT_SECRET,
            { expiresIn: '10h' }
        );
        
        return token;  // Devuelve el token con más información al usuario
    }

    // Login por email: Verificar email y clave
    async loginByEmail(email: string, clave: string): Promise<string | null> {
        const usuario = await usuarioService.getByEmail(email);

        if (!usuario) {
            throw new Error('Correo electronico o clave incorrectos');
        }

        // Verificar la clave con bcrypt
        const isPasswordValid = await bcrypt.compare(clave, usuario.clave);
        if (!isPasswordValid) {
            throw new Error('Correo electronico o clave incorrectos');
        }

        // Aquí agregamos más datos al token
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                correo_electronico: usuario.correo_electronico,  
                nombre: usuario.nombre,
                alias: usuario.alias,  
            },
            JWT_SECRET,
            { expiresIn: '10h' }
        );

        return token;  // Devuelve el token con más información al usuario
    }

    // Logout: Simplemente eliminar el token del lado del cliente
    logout(): void {
        // El logout es solo en el lado del cliente (no hay mucha lógica en el servidor)
        // El cliente debería eliminar el token (por ejemplo, localStorage o cookies)
    }
}
