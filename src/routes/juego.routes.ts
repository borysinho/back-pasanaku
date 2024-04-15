import { Router } from "express";
import { validateResult } from "../validations/result.validate";
import juegoController from "../controllers/juego.controllers";
import {
  validarExisteFecha_InicioOpcional,
  validarExisteMoneda,
  validarExisteMontoTotal,
  validarExisteNombreOpcional,
  validarFecha_InicioBody,
  validarMontoTotalBody,
  validarNombreBody,
} from "../validations/juego.validation";
import {
  validarIdParam,
  validarNoExisteIdJugador,
} from "../validations/jugador.validation";

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
    this.router.get(
      "/jugadores/:id/juegos",
      // validarIdParam,
      // validarNoExisteIdJugador,
      // validateResult,
      juegoController.obtenerJuegosDeUnJugador
    );

    this.router.post(
      "/jugadores/:id/juegos",
      // validarFecha_InicioBody,
      // validarNombreBody,
      // validarMontoTotalBody,
      // validarIdParam,
      // validarNoExisteIdJugador,
      // validateResult,
      juegoController.crear
    );

    this.router.post(
      "jugadores/:id_jugador/juegos/:id_juego",
      juegoController.aceptarInvitacionDeJuego
    );

    this.router.put(
      "/jugadores/:id_jugador/juegos/:id_juego",
      // validarIdParam,
      // validarNoExisteIdJugador,
      // validarExisteNombreOpcional,
      // validarExisteFecha_InicioOpcional,
      // validarExisteMontoTotal,
      // validarExisteMoneda,
      // validateResult,
      juegoController.actualizarJuegoDeCreador
    );
    this.router.get(
      "/jugadores/:id/juegos/invitaciones",
      juegoController.invitacionesDeJugador
    );
    this.router.delete(
      "/jugadores/:id_jugador/juegos/:id_juego",
      juegoController.eliminarJuegoDeCreador
    );
  }
}

export default new JuegoRoutes().router;
