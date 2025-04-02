"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Esto debe ser lo primero que se ejecute
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const Routes_routes_1 = __importDefault(require("./routes/Routes.routes"));
const Auth_routes_1 = __importDefault(require("./routes/Auth.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares básicos
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Registrar rutas
app.use('/api', Routes_routes_1.default);
app.use('/auth', Auth_routes_1.default);
// Ruta de prueba básica
app.get('/', (req, res) => {
    res.send('API funcionando ✅');
});
// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
exports.default = app;
