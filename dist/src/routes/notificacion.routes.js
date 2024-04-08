"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificacion_controllers_1 = require("../controllers/notificacion.controllers");
class JugadorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post("/jugadores/juegos/:id/notificaciones", notificacion_controllers_1.notificaciones);
    }
}
exports.default = new JugadorRoutes().router;
