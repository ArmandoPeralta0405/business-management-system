"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_controller_1 = require("../controllers/Auth.controller");
const router = (0, express_1.Router)();
const controller = new Auth_controller_1.AuthController();
// Ruta de login
router.post('/login', controller.login);
router.post('/loginEmail', controller.loginEmail);
// Ruta de logout
router.post('/logout', controller.logout);
exports.default = router;
