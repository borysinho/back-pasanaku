import { Router } from "express";
import juegoController from "../controllers/juego.controllers";

class JuegoRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/juegos",
      juegoController.obtenerJuegosDeTodosLosJugadores
    );

    this.router.get("/jugadores/juegos/:id", juegoController.obtenerJuegoPorId);

    this.router.get(
      "/jugadores/:id/juegos",
      juegoController.obtenerJuegosDeUnJugador
    );

    this.router.post("/jugadores/:id/juegos", juegoController.crear);

    this.router.put(
      "/jugadores/:id_jugador/juegos/:id_juego",
      juegoController.actualizarJuegoDeCreador
    );

    this.router.delete(
      "/jugadores/:id_jugador/juegos/:id_juego",
      juegoController.eliminarJuegoDeCreador
    );

    this.router.get(
      "/jugadores/:id/juegos/pendientes",
      juegoController.invitacionesPendientesDeJugador
    );

    this.router.get("/jugadores/juegos/pujas", juegoController.pujasDeJuego);
  }
}

export default new JuegoRoutes().router;
