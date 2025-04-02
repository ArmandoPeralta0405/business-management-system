/**
 * Interfaz TypeScript para la entidad Usuario
 * Representa la estructura exacta de la tabla en la base de datos
 */
export interface IUsuario {
    id_usuario?: number;         // Opcional (auto-incremental)
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    direccion: string;
    correo_electronico: string;
    alias: string;
    clave: string;               // Almacenará el hash de la contraseña
    estado?: boolean;            // Opcional (valor por defecto: true)
    fecha_registro?: Date;       // Opcional (se asigna automáticamente)
    fecha_actualizacion?: Date;  // Opcional (se actualiza automáticamente)
}

/**
 * Estructura base del modelo Usuario (sin implementaciones)
 * Define los métodos que deberá implementar el servicio
 */
export abstract class UsuarioModel {
    abstract getAll(): Promise<IUsuario[]>;
    abstract getById(id_usuario: number): Promise<IUsuario | null>;
    abstract getByAlias(alias: string): Promise<IUsuario | null>; // Nuevo método útil para login
    abstract create(usuarioData: Omit<IUsuario, 'id_usuario' | 'fecha_registro' | 'fecha_actualizacion'>): Promise<number>;
    abstract update(id_usuario: number, usuarioData: Partial<IUsuario>): Promise<boolean>;
    abstract delete(id_usuario: number): Promise<boolean>;
}