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
exports.eliminar = exports.actualizar = exports.mostrarUno = exports.mostrarTodos = exports.crearSinInvitacion = exports.crearConInvitacion = void 0;
const jugador_service_1 = require("../services/jugador.service");
const crearConInvitacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jugadorData = req.body;
        const invitadoData = req.body;
        const jugador = yield (0, jugador_service_1.crearJugadorAPartirDeInvitacion)(jugadorData, invitadoData);
        return res.status(201).json({
            message: "Jugador creado correctamente",
            data: jugador,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en jugador.controller.crear",
            Errors: error,
        });
    }
});
exports.crearConInvitacion = crearConInvitacion;
const crearSinInvitacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jugadorData = req.body;
        const invitadoData = req.body;
        const jugador = yield (0, jugador_service_1.crearJugadorSinSerInvitado)(jugadorData, invitadoData);
        return res.status(201).json({
            message: "Jugador creado correctamente",
            data: jugador,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en jugador.controller.crear",
            Errors: error,
        });
    }
});
exports.crearSinInvitacion = crearSinInvitacion;
const mostrarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jugadores = yield (0, jugador_service_1.obtenerJugadores)();
        return res.status(201).json({
            message: "Lista de jugadores",
            data: jugadores,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en jugador.controller.mostrarTodos",
            Errors: error,
        });
    }
});
exports.mostrarTodos = mostrarTodos;
const mostrarUno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const jugador = yield (0, jugador_service_1.obtenerJugador)(parseInt(id));
        return res.status(201).json({
            message: "Lista de jugadores",
            data: jugador,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en jugador.controller.mostrarUno",
            Errors: error,
        });
    }
});
exports.mostrarUno = mostrarUno;
const actualizar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const jugadorData = req.body;
        const invitadoData = req.body;
        const { nombre, correo, telf } = req.body;
        const jugador = yield (0, jugador_service_1.actualizarJugador)(jugadorData, invitadoData, id);
        return res.status(201).json({
            message: "Datos Actualizados Correctamente",
            data: jugador,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en jugador.actualizar.actualizar",
            Errors: error,
        });
    }
});
exports.actualizar = actualizar;
const eliminar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const jugador = yield (0, jugador_service_1.eliminarJugador)(id);
        return res.status(201).json({
            message: "Jugador eliminado correctamente",
            data: jugador,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en jugador.actualizar.eliminar",
            Errors: error,
        });
    }
});
exports.eliminar = eliminar;
