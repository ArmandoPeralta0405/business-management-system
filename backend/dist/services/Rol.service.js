"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolService = void 0;
const Rol_model_1 = require("../models/Rol.model");
const database_1 = __importDefault(require("../config/database"));
class RolService extends Rol_model_1.RolModel {
    async getAll() {
        const [rows] = await database_1.default.query('SELECT * FROM rol');
        return rows;
    }
    async getById(id) {
        const [rows] = await database_1.default.query('SELECT * FROM rol WHERE id_rol = ?', [id]);
        return rows[0] || null;
    }
    async create(rolData) {
        const [result] = await database_1.default.query('INSERT INTO rol (descripcion) VALUES (?)', [rolData.descripcion]);
        return result.insertId;
    }
    async update(id, rolData) {
        const [result] = await database_1.default.query('UPDATE rol SET descripcion = ? WHERE id_rol = ?', [rolData.descripcion, id]);
        return result.affectedRows > 0;
    }
    async delete(id) {
        const [result] = await database_1.default.query('DELETE FROM rol WHERE id_rol = ?', [id]);
        return result.affectedRows > 0;
    }
}
exports.RolService = RolService;
