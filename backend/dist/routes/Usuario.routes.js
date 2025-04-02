"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Usuario_controller_1 = require("../controllers/Usuario.controller");
const router = (0, express_1.Router)();
const controller = new Usuario_controller_1.UsuarioController();
// Rutas CRUD básicas
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
exports.default = router;
