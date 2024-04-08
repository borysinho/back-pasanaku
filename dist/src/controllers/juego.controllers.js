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
exports.eliminarJuegoDeCreador = exports.actualizarJuegoDeCreador = exports.obtenerJuegosDeTodosLosJugadores = exports.obtenerJuegosDeCreador = exports.crear = void 0;
const juego_service_1 = require("../services/juego.service");
const crear = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const datosJuego = req.body;
        const juego = yield (0, juego_service_1.crearJuego)(parseInt(id), datosJuego);
        return res.status(201).json({
            message: "Juego creado correctamente",
            data: juego,
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
const obtenerJuegosDeCreador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const juegos = yield (0, juego_service_1.obtenerJuegosDeJugador)(parseInt(id));
        return res.status(201).json({
            message: `Lista de Juegos de jugador id: ${parseInt(id)}`,
            data: juegos,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en juego.controllers.obtenerJuegosDeCreador",
            error,
        });
    }
});
exports.obtenerJuegosDeCreador = obtenerJuegosDeCreador;
const obtenerJuegosDeTodosLosJugadores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const juegos = yield (0, juego_service_1.obtenerJuegos)();
        return res.status(201).json({
            message: "Listado de todos los juegos",
            data: juegos,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en juego.controllers.obtenerJuegosDeTodosLosJugadores",
            error,
        });
    }
});
exports.obtenerJuegosDeTodosLosJugadores = obtenerJuegosDeTodosLosJugadores;
const actualizarJuegoDeCreador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombre, fecha_inicio, monto_total, moneda } = req.body;
        const date = new Date(fecha_inicio);
        const juego = yield (0, juego_service_1.actualizarJuego)(parseInt(id), {
            nombre,
            fecha_inicio: date,
            monto_total,
            moneda,
        });
        return res.status(201).json({
            message: "Datos de juego actualizados",
            data: juego,
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en juego.controllers.actualizarJuego",
            error,
        });
    }
});
exports.actualizarJuegoDeCreador = actualizarJuegoDeCreador;
const eliminarJuegoDeCreador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en juego.controllers.eliminarJuegoDeCreador",
            error,
        });
    }
});
exports.eliminarJuegoDeCreador = eliminarJuegoDeCreador;
