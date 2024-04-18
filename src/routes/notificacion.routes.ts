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
      "/jugadores/:id_jugador/juegos/:id_juego/invitados/:id_invitado",
      notificacionesController.aceptarInvitacionDeJuego
    );
  }
}

export default new JugadorRoutes().router;
