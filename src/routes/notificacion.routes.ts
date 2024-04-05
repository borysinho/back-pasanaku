import { Router } from "express";
import { notificaciones } from "../controllers/notificacion.controllers";
import jugadorRoutes from "./jugador.routes";

class JugadorRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post("/jugadores/juegos/:id/notificaciones", notificaciones);
  }
}

export default new JugadorRoutes().router;
