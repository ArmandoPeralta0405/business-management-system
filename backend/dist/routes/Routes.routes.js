"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Rol_routes_1 = __importDefault(require("../routes/Rol.routes"));
const Usuario_routes_1 = __importDefault(require("../routes/Usuario.routes"));
const auth_middleware_1 = require("../middlewares/auth.middleware"); // Importa el middleware
const router = (0, express_1.Router)();
// Aplica el middleware de autenticación en las rutas de roles y usuarios
router.use('/roles', auth_middleware_1.authenticate, Rol_routes_1.default); // Todas las rutas de roles empezarán con /roles
router.use('/usuarios', auth_middleware_1.authenticate, Usuario_routes_1.default); // Todas las rutas de los usuarios empezarán con /usuarios
// Exporta el router configurado
exports.default = router;
