"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const result_validate_1 = require("../validations/result.validate");
const jugador_validation_1 = require("../validations/jugador.validation");
const jugador_controllers_1 = require("../controllers/jugador.controllers");
class JugadorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get("/jugadores", jugador_controllers_1.mostrarTodos);
        this.router.get("/jugadores/:id", jugador_validation_1.validarIdParam, jugador_validation_1.validarNoExisteIdJugador, result_validate_1.validateResult, jugador_controllers_1.mostrarUno);
        this.router.post("/jugadores", 
        //TODO corregir las validaciones de crear jugador
        // validarNombreBody,
        // validarCorreoBody,
        // validarTelfBody,
        // validarNoExisteEmailJugador,
        // validarNoExisteTelfJugador,
        // validateResult,
        jugador_controllers_1.crearConInvitacion);
        this.router.post("/jugadores/norelacionar", jugador_controllers_1.crearSinInvitacion);
        this.router.put("/jugadores/:id", jugador_validation_1.validarIdParam, jugador_validation_1.validarExisteTelefonoOpcional, jugador_validation_1.validarExisteCorreoOpcional, result_validate_1.validateResult, jugador_controllers_1.actualizar);
        this.router.delete("/jugadores/:id", jugador_validation_1.validarIdParam, jugador_validation_1.validarNoExisteIdJugador, result_validate_1.validateResult, jugador_controllers_1.eliminar);
    }
}
exports.default = new JugadorRoutes().router;
