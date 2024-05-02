import { Router } from "express";
import pagoController from "../controllers/pago.controllers";

class PagosRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/jugadores_juegos/turnos/:id_turno/pagos",
      pagoController.obtenerPagosDeUnTurno
    );
    this.router.get(
      "/jugadores_juegos/:id_jugador_juego/turnos/:id_turno/pagos",
      pagoController.obtenerPagosDeJugador_JuegoEnUnTurnoEspecifico
    );
    this.router.post(
      "/jugadores_juegos/:id_jugador_juego/turnos/:id_turno/pagos",
      pagoController.crearPagoDeUnTurno
    );
  }
}

export default new PagosRoutes().router;
