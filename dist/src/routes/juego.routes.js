"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const result_validate_1 = require("../validations/result.validate");
const juego_controllers_1 = require("../controllers/juego.controllers");
const juego_validation_1 = require("../validations/juego.validation");
const jugador_validation_1 = require("../validations/jugador.validation");
class JuegoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/juegos", juego_controllers_1.obtenerJuegosDeTodosLosJugadores);
        this.router.get("/jugadores/juegos/:id", jugador_validation_1.validarIdParam, jugador_validation_1.validarNoExisteIdJugador, result_validate_1.validateResult, juego_controllers_1.obtenerJuegosDeCreador);
        this.router.post("/jugadores/:id/juegos", juego_validation_1.validarFecha_InicioBody, juego_validation_1.validarNombreBody, juego_validation_1.validarMontoTotalBody, jugador_validation_1.validarIdParam, jugador_validation_1.validarNoExisteIdJugador, result_validate_1.validateResult, juego_controllers_1.crear);
        this.router.put("/jugadores/:id/juegos", jugador_validation_1.validarIdParam, jugador_validation_1.validarNoExisteIdJugador, juego_validation_1.validarExisteNombreOpcional, juego_validation_1.validarExisteFecha_InicioOpcional, juego_validation_1.validarExisteMontoTotal, juego_validation_1.validarExisteMoneda, result_validate_1.validateResult, juego_controllers_1.actualizarJuegoDeCreador);
        this.router.delete("/jugadores/:id/juegos", jugador_validation_1.validarIdParam, jugador_validation_1.validarNoExisteIdJugador, 
        // TODO Validar que el ID de juego corresponda al jugador que pretende eliminar
        result_validate_1.validateResult, juego_controllers_1.eliminarJuegoDeCreador);
    }
}
exports.default = new JuegoRoutes().router;
