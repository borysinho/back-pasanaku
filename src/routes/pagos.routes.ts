import { Router } from "express";
import turnoController from "../controllers/turno.controller";

class PagosRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/jugadores/juegos/turnos/",
      turnoController.obtenerTodosTurnos
    );
  }
}
asdadas;

export default new PagosRoutes().router;
