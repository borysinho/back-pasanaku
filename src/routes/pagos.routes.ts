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
  }
}

export default new PagosRoutes().router;
