import { Router } from "express";
import notificacionesController from "../controllers/notificacion.controllers";

class JugadorRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post(
      "/jugadores/juegos/:id/notificaciones",
      notificacionesController.notificacionParaDescargarOUnirse
    );

    this.router.post(
      "/jugadores/juegos/:id_juego/notificaciones/ganadorturno",
      notificacionesController.finDeOfertas
    );
    this.router.post(
      "/jugadores/juegos/:id_juego/notificaciones/ganadorturno",
      notificacionesController.finDeOfertas
    );

    this.router.post(
      "/jugadores/juegos/:id_juego/notificaciones/testganador",
      notificacionesController.testNotificarGanador
    );
  }
}

export default new JugadorRoutes().router;
