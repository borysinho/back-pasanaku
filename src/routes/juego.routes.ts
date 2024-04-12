import { Router } from "express";
import { validateResult } from "../validations/result.validate";
import {
  aceptarInvitacionDeJuego,
  actualizarJuegoDeCreador,
  crear,
  invitacionesDeJugador,
  obtenerJuegosDeTodosLosJugadores,
  obtenerJuegosDeUnJugador,
} from "../controllers/juego.controllers";
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
    this.router.get("/juegos", obtenerJuegosDeTodosLosJugadores);
    this.router.get(
      "/jugadores/:id/juegos",
      // validarIdParam,
      // validarNoExisteIdJugador,
      // validateResult,
      obtenerJuegosDeUnJugador
    );

    this.router.post(
      "/jugadores/:id/juegos",
      // validarFecha_InicioBody,
      // validarNombreBody,
      // validarMontoTotalBody,
      // validarIdParam,
      // validarNoExisteIdJugador,
      // validateResult,
      crear
    );

    this.router.post(
      "jugadores/:id_jugador/juegos/:id_juego",
      aceptarInvitacionDeJuego
    );

    this.router.put(
      "/jugadores/:id/juegos",
      // validarIdParam,
      // validarNoExisteIdJugador,
      // validarExisteNombreOpcional,
      // validarExisteFecha_InicioOpcional,
      // validarExisteMontoTotal,
      // validarExisteMoneda,
      // validateResult,
      actualizarJuegoDeCreador
    );
    this.router.get(
      "/jugadores/:id/juegos/invitaciones",
      invitacionesDeJugador
    );
  }
}

export default new JuegoRoutes().router;
