"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invitado_controllers_1 = require("../controllers/invitado.controllers");
class InvitadoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        // Métodos exclusivos del modelo Invitados
        //Obtener todos los invitados
        this.router.get("/invitados", invitado_controllers_1.mostrarTodos);
        //Obtener un invitado por su identificador
        this.router.get("/invitados/:id", invitado_controllers_1.mostrarUno);
        //Métodos que incluyen los modelos Invitados, Juegos y Jugadores
        //Crear un invitado para un juego previamente creado
        this.router.post("/jugadores/juegos/:idjuego/invitados", invitado_controllers_1.crear);
        //Obtener los invitados de un juego
        this.router.get("/jugadores/juegos/:idjuego/invitados", invitado_controllers_1.invitadosJuego);
    }
}
exports.default = new InvitadoRoutes().router;
