import { Router } from "express";
import expulsadoController from "../controllers/expulsado.controllers";

class ExpulsadoRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get(
      "/jugadores/:id_jugador/expulsiones",
      expulsadoController.ctrlGetJuegosExpulsados
    );
  }
}

export default new ExpulsadoRoutes().router;
