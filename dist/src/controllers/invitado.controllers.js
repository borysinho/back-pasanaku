"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitadosJuego = exports.eliminar = exports.actualizar = exports.mostrarTodos = exports.mostrarUno = exports.crear = void 0;
const invitado_service_1 = require("../services/invitado.service");
const crear = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idjuego } = req.params;
        const datosInvitado = req.body;
        const { nombre } = req.body;
        const invitado = yield (0, invitado_service_1.crearInvitado)(parseInt(idjuego), datosInvitado, nombre);
        return res.status(201).json({
            message: "Registro agregado correctamente",
            data: invitado,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en juego.controller.crear",
            error: error.message,
        });
    }
});
exports.crear = crear;
const mostrarUno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params);
        const { id } = req.params;
        const invitado = yield (0, invitado_service_1.obtenerInvitado)(parseInt(id));
        console.log({ invitado });
        return res.status(201).json({
            message: "Se obtuvo correctamente los datos",
            data: invitado,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en juego.controller.mostrarUno",
            error,
        });
    }
});
exports.mostrarUno = mostrarUno;
const mostrarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invitados = yield (0, invitado_service_1.obtenerInvitados)();
        return res.status(201).json({
            message: "Se obtuvo correctamente los datos",
            data: invitados,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en juego.controller.mostrarTodos",
            error,
        });
    }
});
exports.mostrarTodos = mostrarTodos;
const actualizar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const invitadoData = req.body;
        const invitado = yield (0, invitado_service_1.actualizarInvitado)(parseInt(id), invitadoData);
        return res.status(201).json({
            message: "Se obtuvo correctamente los datos",
            data: invitado,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en juego.controller.actualizar",
            error,
        });
    }
});
exports.actualizar = actualizar;
const eliminar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const invitado = yield (0, invitado_service_1.eliminarInvitado)(parseInt(id));
        return res.status(201).json({
            message: "Se obtuvo correctamente los datos",
            data: invitado,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en juego.controller.eliminar",
            error,
        });
    }
});
exports.eliminar = eliminar;
const invitadosJuego = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idjuego } = req.params;
        const invitados = yield (0, invitado_service_1.obtenerInvitadosDeJuego)(parseInt(idjuego));
        return res.status(201).json({
            message: "Se obtuvo correctamente los datos",
            data: invitados,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en juego.controller.invitadosJuego",
            error: error.message,
        });
    }
});
exports.invitadosJuego = invitadosJuego;
