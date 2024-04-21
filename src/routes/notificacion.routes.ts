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
      notificacionesController.enviarCorreoYWhatsAppAInvitados
    );

    this.router.post(
      "/jugadores/juegos/:id/notificaciones/testpush",
      notificacionesController.testPush
    );
  }
}

export default new JugadorRoutes().router;
