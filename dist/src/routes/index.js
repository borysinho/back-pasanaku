"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jugador_routes_1 = __importDefault(require("./jugador.routes"));
const juego_routes_1 = __importDefault(require("./juego.routes"));
const invitado_routes_1 = __importDefault(require("./invitado.routes"));
const notificacion_routes_1 = __importDefault(require("./notificacion.routes"));
class Routes {
    constructor(app) {
        app.use("/api", jugador_routes_1.default);
        app.use("/api", juego_routes_1.default);
        app.use("/api", invitado_routes_1.default);
        app.use("/api", notificacion_routes_1.default);
    }
}
exports.default = Routes;
