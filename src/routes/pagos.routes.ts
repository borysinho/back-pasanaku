import { Router } from "express";
import pagoController from "../controllers/pago.controllers";

class PagosRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/jugadores/juegos/turnos/:id_turno/jugadores_juegos/:id_jugador_juego/pagos",
      pagoController.obtenerPagosDeUnTurno
    );
  }
}

export default new PagosRoutes().router;
