import { Router } from "express";
import turnoController from "../controllers/turno.controller";

class TurnoRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/jugadores/juegos/turnos/",
      turnoController.obtenerTodosTurnos
    );
    this.router.get(
      "/jugadores/juegos/turnos/:id_turno",
      turnoController.obtenerGanadorTurno
    );

    this.router.get(
      "/jugadores/juegos/:id_juego/turnos",
      turnoController.obtenerTurnosJuego
    );

    this.router.get(
      "/jugadores/juegos/:id_juego/turnos/:id_turno",
      turnoController.obtenerTurnosJuego
    );

    this.router.post(
      "/jugadores/juegos/:id_juego/turnos/iniciar",
      turnoController.iniciarUnTurno
    );

    this.router.post(
      "/jugadores/juegos/turno/:id_turno",
      turnoController.establecerPuja
    );

    this.router.delete(
      "/jugadores/juegos/:id_juego/turnos",
      turnoController.eliminarTurnosJuego
    );
  }
}

export default new TurnoRoutes().router;
